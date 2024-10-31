const mongoose = require('mongoose');

const RunSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  duration: {
    type: Number, // duration in minutes
    required: true,
  },
  distance: {
    type: Number, // distance in kilometers or miles
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model('Run', RunSchema);
