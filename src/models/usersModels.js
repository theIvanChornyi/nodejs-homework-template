const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: 8,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      // eslint-disable-next-line no-useless-escape
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    avatarURL: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);

userSchema.pre('save', async function () {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
const User = mongoose.model('user', userSchema);

module.exports = User;
