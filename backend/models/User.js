// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true},
  email: {
    type: String,
    required: true,
    unique: true, // Ensures unique emails
  },
  password: { type: String, required: true },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  try {
    if (!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('User', userSchema);