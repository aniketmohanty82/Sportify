/*backend/models/WorkoutPlans.js */

const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  focus: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
});

const WorkoutPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, required: true }, // in minutes
  exercises: [ExerciseSchema],
});

module.exports = mongoose.model('WorkoutPlans', WorkoutPlanSchema);
