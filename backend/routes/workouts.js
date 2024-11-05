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

const { Parser } = require('json2csv'); // For CSV export
const PDFDocument = require('pdfkit'); // For PDF export
const Run = require('../models/Run'); // Run model


// @route   GET api/exports
// @desc    Export workout or run data as PDF or CSV, grouped by date
// @access  Private
router.get('/export', auth, async (req, res) => {
  const { format, type } = req.query; // Get format (pdf/csv) and type (workout/run) from query

  if (!format || !type) {
    return res.status(400).json({ msg: 'Please specify both format and type.' });
  }

  try {
    // Fetch data based on the type (workout or run)
    let data;
    if (type === 'workout') {
      data = await Workout.find({ userId: req.user.id }).sort({ date: -1 });

      // Group workouts by date
      const groupedData = data.reduce((acc, workout) => {
        const date = workout.date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        if (!acc[date]) acc[date] = [];
        acc[date].push({
          exercise: workout.exercise,
          sets: workout.sets,
          reps: workout.reps,
          weight: workout.weight,
        });
        return acc;
      }, {});

      // Format data for CSV/PDF export
      data = Object.keys(groupedData).map((date) => ({
        date,
        exercises: groupedData[date]
          .map((ex) => `${ex.exercise} (Sets: ${ex.sets}, Reps: ${ex.reps}, Weight: ${ex.weight} lbs)`)
          .join('; '),
      }));
    } else if (type === 'run') {
      data = await Run.find({ userId: req.user.id }).sort({ date: -1 });

      // Group runs by date (though runs are typically one per day)
      data = data.map((run) => ({
        date: run.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        details: `Duration: ${run.duration} mins, Distance: ${run.distance} km`,
      }));
    } else {
      return res.status(400).json({ msg: 'Invalid type. Choose "workout" or "run".' });
    }

    // Export as CSV
    if (format === 'csv') {
      const json2csvParser = new Parser({ fields: ['date', type === 'workout' ? 'exercises' : 'details'] });
      const csv = json2csvParser.parse(data);
      res.header('Content-Type', 'text/csv');
      res.attachment(`${type}_summary.csv`);
      return res.send(csv);
    }

    // Export as PDF
    if (format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Disposition', `attachment; filename=${type}_summary.pdf`);
      res.setHeader('Content-Type', 'application/pdf');
      doc.pipe(res);

      // PDF Title
      doc.fontSize(20).text(`${type.charAt(0).toUpperCase() + type.slice(1)} Summary`, {
        align: 'center',
      });

      // Populate PDF with grouped data
      data.forEach((item) => {
        doc
          .fontSize(16)
          .text(`Date: ${item.date}`, { underline: true, lineGap: 5 });

        if (type === 'workout') {
          doc
            .fontSize(12)
            .text(`Exercises: ${item.exercises}`, { lineGap: 5 });
        } else if (type === 'run') {
          doc
            .fontSize(12)
            .text(`Details: ${item.details}`, { lineGap: 5 });
        }

        doc.moveDown();
      });

      doc.end();
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error while exporting data');
  }
});

// @route   GET api/exports ENDPOINT WITHOUT GROUPPING BY DATE IF NEEDED
// @desc    Export workout or run data as PDF or CSV
// @access  Private
// router.get('/export', auth, async (req, res) => {
//   const { format, type } = req.query; // Get format (pdf/csv) and type (workout/run) from query

//   if (!format || !type) {
//     return res.status(400).json({ msg: 'Please specify both format and type.' });
//   }

//   try {
//     // Fetch data based on the type (workout or run)
//     let data;
//     if (type === 'workout') {
//       data = await Workout.find({ userId: req.user.id }).sort({ date: -1 });
//       // Select only the necessary fields
//       data = data.map((item) => ({
//         exercise: item.exercise,
//         sets: item.sets,
//         reps: item.reps,
//         weight: item.weight,
//         date: item.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
//       }));
//     } else if (type === 'run') {
//       data = await Run.find({ userId: req.user.id }).sort({ date: -1 });
//       // Select only the necessary fields
//       data = data.map((item) => ({
//         duration: item.duration,
//         distance: item.distance,
//         date: item.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
//       }));
//     } else {
//       return res.status(400).json({ msg: 'Invalid type. Choose "workout" or "run".' });
//     }

//     // Export as CSV
//     if (format === 'csv') {
//       const json2csvParser = new Parser({ fields: Object.keys(data[0]) });
//       const csv = json2csvParser.parse(data);
//       res.header('Content-Type', 'text/csv');
//       res.attachment(`${type}_summary.csv`);
//       return res.send(csv);
//     }

//     // Export as PDF
//     if (format === 'pdf') {
//       const doc = new PDFDocument();
//       res.setHeader('Content-Disposition', `attachment; filename=${type}_summary.pdf`);
//       res.setHeader('Content-Type', 'application/pdf');
//       doc.pipe(res);

//       // PDF Title
//       doc.fontSize(20).text(`${type.charAt(0).toUpperCase() + type.slice(1)} Summary`, {
//         align: 'center',
//       });

//       // Populate PDF with data
//       data.forEach((item) => {
//         if (type === 'workout') {
//           doc
//             .fontSize(12)
//             .text(`Exercise: ${item.exercise} | Sets: ${item.sets} | Reps: ${item.reps} | Weight: ${item.weight} | Date: ${item.date}`, {
//               lineGap: 5,
//             });
//         } else if (type === 'run') {
//           doc
//             .fontSize(12)
//             .text(`Duration: ${item.duration} mins | Distance: ${item.distance} km | Date: ${item.date}`, {
//               lineGap: 5,
//             });
//         }
//       });

//       doc.end();
//     }
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Server error while exporting data');
//   }
// });

module.exports = router;
