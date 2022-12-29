require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');

const User = require('../models/usersModels');
const createError = require('../services/createError');

const { TOKEN_SALT } = process.env;

const signupController = async (req, res, next) => {
  const { password, email } = req.body;
  try {
    await User.create({
      password,
      email,
      avatarURL: gravatar.url(email),
    });
    const newUser = await User.find(
      { email },
      { email: 1, subscription: 1, _id: 0, avatarURL: 1 }
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
    const { subscription, _id: userId, avatarURL } = newUser;
    const token = jwt.sign({ userId }, TOKEN_SALT, { expiresIn: '1h' });
    await User.findByIdAndUpdate({ _id: userId }, { token });

    return res
      .status(200)
      .json({ token, user: { email, subscription, avatarURL } });
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
    const { email, subscription, avatarURL } = req.user;
    return res.status(200).json({ email, subscription, avatarURL });
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

    const { email, avatarURL } = await User.findByIdAndUpdate(
      { _id },
      { subscription }
    );

    return res.status(200).json({ email, subscription, avatarURL });
  } catch (error) {
    next(error);
  }
};

const changeAvatarController = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: tempDir, originalname } = req.file;
    const [extention] = originalname.split('.').reverse();
    const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');
    const fileName = `${_id}.${extention}`;

    const image = await Jimp.read(req.file.path);
    await image.resize(250, 250).write(req.file.path);

    await fs.rename(tempDir, `${avatarsDir}/${fileName}`);

    const { avatarURL } = await User.findByIdAndUpdate(
      _id,
      { avatarURL: `/avatars/${fileName}` },
      { new: true }
    );
    return res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(req.file?.path);
    next(error);
  }
};

module.exports = {
  signupController,
  loginController,
  logoutController,
  getCurrentUserController,
  changeSubscriptionController,
  changeAvatarController,
};
