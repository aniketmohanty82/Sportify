const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Run = require('../models/Run');

const router = express.Router();

// @route   POST api/runs/logrun
// @desc    Log a run (duration, distance)
// @access  Private
router.post(
  '/logrun',
  [
    check('duration', 'Duration is required and should be a positive number').isInt({ min: 1 }),
    check('distance', 'Distance is required and should be a positive number').isFloat({ min: 0.1 }),
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { duration, distance, userId } = req.body;

    try {
      const newRun = new Run({
        userId,
        duration,
        distance,
        date: new Date(),
      });

      const run = await newRun.save();
      res.json(run);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/runs
// @desc    Get all runs for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const runs = await Run.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(runs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/runs/:id
// @desc    Update a run by ID
// @access  Private
router.put(
  '/:id',
  [
    auth,
    check('duration', 'Duration is required and should be a positive number').optional().isInt({ min: 1 }),
    check('distance', 'Distance is required and should be a positive number').optional().isFloat({ min: 0.1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { duration, distance } = req.body;

    try {
      const run = await Run.findById(req.params.id);

      if (!run) {
        return res.status(404).json({ msg: 'Run not found' });
      }

      // Check user authorization
      if (run.userId.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      // Update the run details
      if (duration) run.duration = duration;
      if (distance) run.distance = distance;

      await run.save();

      res.json(run);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE api/runs/:id
// @desc    Delete a run by ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const run = await Run.findById(req.params.id);

    if (!run) {
      return res.status(404).json({ msg: 'Run not found' });
    }

    // Check user authorization
    if (run.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await run.remove();

    res.json({ msg: 'Run removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
