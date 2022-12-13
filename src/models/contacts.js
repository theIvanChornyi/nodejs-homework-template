const createError = require('../services/createError');
const errorProcessor = require('../services/errorProcessor');
const Contact = require('./contactModels');

const listContacts = async () => {
  return await Contact.find({});
};

const addContact = async body => {
  try {
    return await Contact.create(body);
  } catch (error) {
    if (error.message) {
      throw createError(404, error.message);
    }
    throw error;
  }
};

const getContactById = async contactId => {
  try {
    return await Contact.findOne({ _id: contactId });
  } catch (error) {
    if (
      error.message ===
      `Cast to ObjectId failed for value "${contactId}" (type string) at path "_id" for model "contacts"`
    ) {
      throw createError(404, 'Not found');
    }
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    return await Contact.findByIdAndUpdate({ _id: contactId }, body, {
      new: true,
    });
  } catch (error) {
    errorProcessor(error, contactId);
  }
};

const removeContact = async contactId => {
  try {
    return await Contact.findByIdAndRemove({ _id: contactId });
  } catch (error) {
    errorProcessor(error, contactId);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
