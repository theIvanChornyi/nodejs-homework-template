const fs = require('fs').promises;
const path = require('path');
const ObjectId = require('bson-objectid');

const contacts = path.join(__dirname, './contacts.json');

const listContacts = async () => {
  try {
    const data = await fs.readFile(contacts, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return errorFunction(error);
  }
};

const getContactById = async contactId => {
  try {
    const data = await listContacts();
    const [contact] = await data.filter(({ id }) => id === contactId);
    return contact;
  } catch (error) {
    return errorFunction(error);
  }
};

const removeContact = async contactId => {
  try {
    const data = await listContacts();
    const indexOfDeleteContact = [...data].reduce((acc, contact, index) => {
      if (contact.id === contactId) {
        acc = index;
      }
      return acc;
    }, -1);

    if (indexOfDeleteContact !== -1) {
      data.splice(indexOfDeleteContact, 1);
      const normalizedContacts = JSON.stringify(data);
      await fs.writeFile(contacts, normalizedContacts, null, 2, 'utf8');
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return errorFunction(error);
  }
};

const addContact = async body => {
  try {
    const contactList = await listContacts();
    const newContact = { id: ObjectId(), ...body };
    const newContactList = [...contactList, newContact];
    const normalizedNewContactList = JSON.stringify(newContactList);
    await fs.writeFile(contacts, normalizedNewContactList, null, 2, 'utf8');
    return newContactList;
  } catch (error) {
    return errorFunction(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const data = await listContacts();

    const indexOfDeleteContact = [...data].reduce((acc, contact, index) => {
      if (contact.id === contactId) {
        acc = index;
      }
      return acc;
    }, -1);

    if (indexOfDeleteContact !== -1) {
      data.splice(indexOfDeleteContact, 1, {
        ...data[indexOfDeleteContact],
        ...body,
      });

      const normalizedContacts = JSON.stringify(data);
      await fs.writeFile(contacts, normalizedContacts, null, 2, 'utf8');

      return data;
    } else {
      return null;
    }
  } catch (error) {
    return errorFunction(error);
  }
};

function errorFunction(error) {
  console.log(error.message);
  return null;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
