const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
  },
  exercise: {
    type: String,
    required: true, // Name of the exercise
  },
  sets: {
    type: Number,
    required: true, // Number of sets
  },
  reps: {
    type: Number,
    required: true, // Number of reps per set
  },
  date: {
    type: Date,
    //default: Date.now, // Date of the workout
    required: true,
  },
});

module.exports = mongoose.model('Workouts', WorkoutSchema);
