const express = require('express');
const router = express.Router();
const WorkoutPlan = require('../models/WorkoutPlans');

// @route   GET /api/workoutPlans
// @desc    Fetch workout plans based on sport
router.get('/', async (req, res) => {
  const { sport } = req.query; // Sport is passed as a query param
  try {
    const plans = await WorkoutPlan.find({ sport });
    res.json(plans);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/workoutPlans/:id
// @desc    Fetch details of a specific workout plan by ID
router.get('/:id', async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ msg: 'Workout plan not found' });
    res.json(plan);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
