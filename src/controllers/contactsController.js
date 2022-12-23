const createError = require('../services/createError');
const Contact = require('../models/contactModels');

const errorProcessor = require('../services/errorProcessor');

const getContactsController = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page, limit, favorite } = req.query;

    const queryOptions = { skip: 0, limit: 20 };
    queryOptions.limit = +limit;
    +page < 1
      ? (queryOptions.skip = 0)
      : (queryOptions.skip = (+page - 1) * queryOptions.limit);

    const filter = { owner };
    if (favorite !== undefined) filter.favorite = favorite;

    const querry = Contact.find(filter, '', queryOptions);
    const data = await querry.populate('owner', 'name email');

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const addContactController = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const userRequest = await req.body;

    try {
      const data = await Contact.create({ ...userRequest, owner });
      return res.status(201).json(data);
    } catch (error) {
      if (
        error.message ===
        `E11000 duplicate key error collection: db-contacts.contacts index: email_1 dup key: { email: "${userRequest.email}" }`
      ) {
        throw createError(400, `${userRequest.email} is already in contacts`);
      }
      throw createError(404, error.message);
    }
  } catch (error) {
    next(error);
  }
};

const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId: _id } = req.params;
    const { _id: owner } = req.user;

    try {
      const contact = await Contact.findOne({ _id, owner }).populate(
        'owner',
        'name email'
      );

      return res.status(200).json(contact);
    } catch (error) {
      if (
        error.message ===
        `Cast to ObjectId failed for value "${_id}" (type string) at path "_id" for model "contacts"`
      ) {
        throw createError(404, 'Not found');
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

const updateContactController = async (req, res, next) => {
  try {
    const { contactId: _id } = req.params;
    const userRequest = await req.body;
    const { _id: owner } = req.user;
    try {
      const contact = await Contact.findOneAndUpdate(
        { _id, owner },
        userRequest,
        { new: true }
      ).populate('owner', 'name email');

      return res.status(200).json(contact);
    } catch (error) {
      errorProcessor(error);
    }
  } catch (error) {
    next(error);
  }
};

const deleteContactController = async (req, res, next) => {
  try {
    const { contactId: _id } = req.params;
    const { _id: owner } = req.user;

    try {
      const isDeleted = await Contact.findOneAndRemove({ _id, owner });
      if (!isDeleted) throw createError(404, 'Not found');
      return res.status(200).json({ message: 'Contact deleted' });
    } catch (error) {
      errorProcessor(error, _id);
    }
  } catch (error) {
    next(error);
  }
};

const patchContactStatusController = async (req, res, next) => {
  try {
    const { contactId: _id } = req.params;
    const { _id: owner } = req.user;
    const value = req.body;
    const isEmpty = JSON.stringify(value) === '{}';

    if (isEmpty) throw createError(400, 'missing field favorite');
    const data = await Contact.findOneAndUpdate(
      { _id, owner },
      {
        favorite: value.favorite,
      },
      { new: true }
    ).populate('owner', 'name email');

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
