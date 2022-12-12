const app = require('./app');
const { contactsDB } = require('./src/database/contactsDB');
require('dotenv').config();

const port = process.env.PORT ?? 3000;

const start = async () => {
  await contactsDB();
  app.listen(port, () => {
    console.log(`Server running. Use our API on port: ${port}`);
  });
};

start();
