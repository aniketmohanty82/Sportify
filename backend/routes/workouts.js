// routes/workouts.js
const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth'); // Authentication middleware
const Workout = require('../models/Workout');

const router = express.Router();

// @route   POST api/workouts/logworkout
// @desc    Log a workout
// @access  Private
router.post(
  '/logworkout',
  [auth, 
    [
      check('workoutType', 'Workout type is required').not().isEmpty(),
      check('duration', 'Duration must be a number greater than 0').isInt({ min: 1 }),
      check('caloriesBurned', 'Calories burned must be a number').isNumeric(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { workoutType, duration, caloriesBurned } = req.body;

    try {
      // Create a new workout log
      const newWorkout = new Workout({
        userId: req.user.id, // From the token payload after authentication
        workoutType,
        duration,
        caloriesBurned,
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
// @desc    Get all workouts for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
