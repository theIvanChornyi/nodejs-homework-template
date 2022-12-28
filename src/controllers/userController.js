require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/usersModels');
const createError = require('../services/createError');

const { TOKEN_SALT } = process.env;

const signupController = async (req, res, next) => {
  const { password, email } = req.body;
  try {
    await User.create({
      password,
      email,
    });
    const newUser = await User.find(
      { email },
      { email: 1, subscription: 1, _id: 0 }
    );
    return res.status(201).json({ user: newUser });
  } catch (error) {
    if (
      error.message ===
      `E11000 duplicate key error collection: db-contacts.users index: email_1 dup key: { email: "${email}" }`
    ) {
      next(createError(409, 'Email in use'));
    }
    next(error);
  }
};

const loginController = async (req, res, next) => {
  const { password, email } = req.body;
  try {
    const newUser = await User.findOne({ email });
    if (!newUser) {
      throw createError(401, 'Email or password is wrong');
    }

    const match = await bcrypt.compare(password, newUser.password);
    if (!match) {
      throw createError(401, 'Not your day');
    }
    const { subscription, _id: userId } = newUser;
    const token = jwt.sign({ userId }, TOKEN_SALT, { expiresIn: '1h' });
    await User.findByIdAndUpdate({ _id: userId }, { token });

    return res.status(200).json({ token, user: { email, subscription } });
  } catch (error) {
    next(error);
  }
};

const logoutController = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate({ _id }, { token: '' });
    return res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const getCurrentUserController = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    return res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

const changeSubscriptionController = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { subscription } = req.body;
    const subscriptionTypes = ['starter', 'pro', 'business'];
    const isValid = subscriptionTypes.some(sub => sub === subscription);
    if (!isValid) throw createError(400, 'Subscribe type is wrong');

    const { email } = await User.findByIdAndUpdate({ _id }, { subscription });

    return res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signupController,
  loginController,
  logoutController,
  getCurrentUserController,
  changeSubscriptionController,
};
