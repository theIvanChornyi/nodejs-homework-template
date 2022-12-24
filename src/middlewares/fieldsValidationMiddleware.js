const Joi = require('joi');
const createError = require('../services/createError');

const updateValidationMidleware = async (req, res, next) => {
  try {
    const userRequest = await req.body;
    await schemaUpdate.validateAsync(userRequest);
    next();
  } catch (error) {
    if (error.name === 'ValidationError') next(createError(400, error.message));
    next(error);
  }
};
const createValidationMidleware = async (req, res, next) => {
  try {
    const userRequest = await req.body;
    await schemaCreate.validateAsync({
      favorite: false,
      ...userRequest,
    });
    next();
  } catch (error) {
    if (error.name === 'ValidationError') next(createError(400, error.message));
    next(error);
  }
};

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
// eslint-disable-next-line no-useless-escape
const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const schemaUpdate = Joi.object({
  name: Joi.string().alphanum(),
  email: Joi.string().pattern(emailRegExp),
  phone: Joi.string()
    .pattern(phoneRegExp)
    .message('Phone number must be min 6 numbers length'),
  favorite: Joi.boolean(),
}).min(1);

const schemaCreate = Joi.object({
  name: Joi.string().required().alphanum(),
  email: Joi.string().pattern(emailRegExp).required(),
  phone: Joi.string().pattern(phoneRegExp).required(),
  favorite: Joi.boolean(),
});

module.exports = { createValidationMidleware, updateValidationMidleware };
