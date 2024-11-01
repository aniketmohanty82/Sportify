/*backend/routes/workouts.js*/
const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware
const Workout = require('../models/Workout');

const router = express.Router();

// @route   POST api/workouts/logworkout
// @desc    Log a workout (exercise, sets, reps)
// @access  Private
router.post(
  '/logworkout',
  async (req, res) => {

    const { exercise, sets, reps, userId, weight } = req.body;

    try {
      // Create a new workout log
      const newWorkout = new Workout({
        exercise,
        sets,
        reps,
        weight,
        date: new Date(), // Store the current date
        userId,
      });

      const workout = await newWorkout.save();
      res.json(workout); // Return the saved workout data
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/workouts
// @desc    Get all workouts for a user for the day
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); // Set the time to the start of the day
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)); // Set the time to the end of the day

    const workouts = await Workout.find({
      userId: req.user.id,  // Filter by the current user's ID
      date: {
          $gte: startOfDay,  // Greater than or equal to start of day
          $lt: endOfDay      // Less than end of day
    }
  }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/workouts/all
// @desc    Get all workouts for a user
// @access  Private
router.get('/all', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({
      userId: req.user.id,  // Filter by the current user's ID
  }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
