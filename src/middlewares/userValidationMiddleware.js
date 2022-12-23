const Joi = require('joi');
const createError = require('../services/createError');

// eslint-disable-next-line no-useless-escape
const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userValidationMiddleware = async (req, res, next) => {
  try {
    const userRequest = await req.body;
    await schemaCreate.validateAsync(userRequest);
    next();
  } catch (error) {
    if (error.name === 'ValidationError') next(createError(400, error.message));
    next(error);
  }
};

const schemaCreate = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().min(8).max(30).required(),
});

module.exports = { userValidationMiddleware };
