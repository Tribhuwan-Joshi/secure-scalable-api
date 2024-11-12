const mongoose = require('mongoose');
const { validate } = require('./todo');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
    },
  },
  hashedPassword: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
