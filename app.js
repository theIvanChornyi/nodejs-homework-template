const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');

const usersRouter = require('./src/routes/api/user');
const contactsRouter = require('./src/routes/api/contacts');
const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

const statitDir = path.join(__dirname, 'src', 'public');

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static(statitDir));

app.use('/api/users', usersRouter);
app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;
