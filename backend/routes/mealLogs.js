//Not using currently but put all routes into this folder

// // routes/mealLogs.js
// const express = require('express');
// const router = express.Router();
// const MealLog = require('/models/MealLog'); // Import the MealLog model

// // POST route to log a meal
// router.post('/logmeal', async (req, res) => {
//   const { name, calories, date } = req.body;
//   try {
//     const newMealLog = new MealLog({ name, calories, date });
//     await newMealLog.save();
//     res.status(201).json(newMealLog);
//   } catch (error) {
//     res.status(500).json({ message: 'Error logging the meal', error });
//   }
// });

// module.exports = router;
