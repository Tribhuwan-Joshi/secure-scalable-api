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
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
    },
  },
  hashedPassword: {
    type: String,
    required: true,
  },
});

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.hashedPassword;
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});
module.exports = mongoose.model('User', userSchema);
