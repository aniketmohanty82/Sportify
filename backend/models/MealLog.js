const mongoose = require('mongoose');

const mealLogSchema = new mongoose.Schema({
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
  protein: {
    type: Number,
    required: true,
  },
  carbs: {
    type: Number,
    required: true,
  },
  fats: {
    type: Number,
    required: true,
  },
  fiber: {
    type: Number,
    required: true,
  },
  sodium: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const MealLog = mongoose.model('MealLog', mealLogSchema, 'meallogs');

module.exports = MealLog;
