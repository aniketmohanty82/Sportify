const mongoose = require('mongoose');

const mealLogSchema = new mongoose.Schema({ // TODO ANISHA
  foodItem: {
    type: String,
    required: true,
  },
  mealCategory: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  nutrients: {
    type: Number,
    required: true,
  },
  portionSize: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const MealLog = mongoose.model('MealLog', mealLogSchema, 'meallogs');

module.exports = MealLog;
