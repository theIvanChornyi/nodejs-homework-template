const Joi = require('joi');
const createError = require('../services/createError');

// eslint-disable-next-line no-useless-escape
const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const verifyValidMiddleware = async (req, res, next) => {
  try {
    const userRequest = await req.body;
    await schemaCreate.validateAsync(userRequest);
    next();
  } catch (error) {
    if (error.message === '"email" is required') {
      next(createError(400, 'missing required field email'));
    }
    if (error.name === 'ValidationError') {
      next(createError(400, error.message));
    }
    next(error);
  }
};

const schemaCreate = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
});

module.exports = verifyValidMiddleware;
