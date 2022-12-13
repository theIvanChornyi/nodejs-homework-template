const createError = require('../services/createError');
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('../models/contacts');

const getContactsController = async (req, res, next) => {
  const data = await listContacts();
  return res.status(200).json(data);
};

const addContactController = async (req, res, next) => {
  try {
    const userRequest = await req.body;
    const data = await addContact(userRequest);

    return res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const getContactByIdController = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const contact = await getContactById(contactId);

    return res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const updateContactController = async (req, res, next) => {
  const contactId = req.params.contactId;
  const userRequest = await req.body;
  try {
    const data = await updateContact(contactId, userRequest);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const deleteContactController = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const isDeleted = await removeContact(contactId);
    if (!isDeleted) throw createError(404, 'Not found');

    return res.status(200).json({ message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
};

const patchContactStatusController = async (req, res, next) => {
  const contactId = req.params.contactId;
  const value = req.body;
  const isEmpty = JSON.stringify(value) === '{}';

  try {
    if (isEmpty) throw createError(400, 'missing field favorite');
    const data = await updateContact(contactId, { favorite: value.favorite });
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContactsController,
  getContactByIdController,
  addContactController,
  deleteContactController,
  updateContactController,
  patchContactStatusController,
};
