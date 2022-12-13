const { default: mongoose } = require('mongoose');
const app = require('./app');
require('dotenv').config();

const port = process.env.PORT ?? 3000;

const conectionString = process.env.MONGOURI;

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

const start = async () => {
  await contactsDB();
  app.listen(port, () => {
    console.log(`Server running. Use our API on port: ${port}`);
  });
};

start();
