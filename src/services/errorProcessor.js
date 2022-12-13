const createError = require('./createError');

const errorProcessor = (error, contactId) => {
  if (
    error.message ===
    `Cast to ObjectId failed for value "{ _id: '${contactId}' }" (type Object) at path "_id" for model "contacts"`
  ) {
    throw createError(404, 'Not found');
  }
  throw error;
};

module.exports = errorProcessor;
