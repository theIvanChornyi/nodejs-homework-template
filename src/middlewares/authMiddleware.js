require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/usersModels');

const createError = require('../services/createError');

const { TOKEN_SALT } = process.env;

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw createError(401, 'Not authorized');

    const [tokenType, token] = authorization?.split(' ');
    if (tokenType !== 'Bearer') throw createError(401, 'Not authorized');

    try {
      const { userId } = jwt.verify(token, TOKEN_SALT);

      const user = await User.findById(userId);
      if (!user || !user.token || user.token !== token) {
        throw createError(401, 'Not authorized');
      }
      req.user = user;
    } catch (error) {
      throw createError(401, 'Not authorized');
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
