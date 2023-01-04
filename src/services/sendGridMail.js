const sgMail = require('@sendgrid/mail');
const createError = require('./createError');
require('dotenv').config();

const { SENDGRID_API_KEY, SENDLER } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

async function sendVerivyMsg({ email, verificationToken }) {
  const msg = {
    to: email,
    from: SENDLER,
    subject: 'Verify on Contacts',
    html: `<span>If you want activate your acount click <a href="http://localhost:3000/api/users/verify/${verificationToken}"> Here!</a></span>`,
  };

  try {
    return await sgMail.send(msg);
  } catch (error) {
    throw createError(500, error);
  }
}

module.exports = sendVerivyMsg;
