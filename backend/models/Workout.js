// models/Workout.js
const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
  },
  workoutType: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true, // Duration in minutes
  },
  caloriesBurned: {
    type: Number,
    required: true, // Calories burned during the workout
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Workout', WorkoutSchema);
