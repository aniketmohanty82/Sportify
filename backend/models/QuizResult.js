// models/QuizResult.js

const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
  answers: {
    type: Object,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('QuizResult', QuizResultSchema);