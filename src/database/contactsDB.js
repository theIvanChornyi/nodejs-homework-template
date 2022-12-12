const mongoose = require('mongoose');
require('dotenv').config();

const conectionString = `mongodb+srv://nodeCluster:${process.env.PASSWORD}@cluster0.tg449at.mongodb.net/db-contacts?retryWrites=true&w=majority`;

const contactsDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const connection = await mongoose.connect(conectionString);
    console.log('Database connection successful');
    return connection;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const contactsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
    // unique: [true, 'Email it`s unique field'],
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});
const Contact = mongoose.model('contacts', contactsSchema);

module.exports = { Contact, contactsDB };
