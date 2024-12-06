const User = require('../models/User');
const Run = require('../models/Run');
const Meal = require('../models/MealLog');
const Workout = require('../models/Workout');
const nodemailer = require('nodemailer');

const generateWeeklySummary = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return null;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Fetch and aggregate workouts
  const workouts = await Workout.find({
    userId,
    date: { $gte: sevenDaysAgo },
  });

  const totalWorkouts = workouts.length;
  const totalCaloriesBurnedFromWorkouts = workouts.reduce((sum, workout) => {
    const workoutCalories = workout.sets * workout.reps * workout.weight * 0.1; // Example formula for calories
    return sum + workoutCalories;
  }, 0);

  // Fetch and aggregate meals
  const meals = await Meal.find({
    userId,
    date: { $gte: sevenDaysAgo },
  });

  const totalCaloriesFromMeals = meals.reduce((sum, meal) => {
    return sum + meal.nutrients;
  }, 0);

  // Fetch and aggregate runs
  const runs = await Run.find({
    userId,
    date: { $gte: sevenDaysAgo },
  });

  const totalDistance = runs.reduce((sum, run) => {
    return sum + run.distance;
  }, 0);

  const totalRunDuration = runs.reduce((sum, run) => {
    return sum + run.duration;
  }, 0);

  // Summary
  return {
    userName: user.username,
    workoutsCompleted: totalWorkouts,
    totalCalories: totalCaloriesBurnedFromWorkouts + totalCaloriesFromMeals,
    totalDistance: totalDistance,
    totalRunDuration: totalRunDuration,
  };
};


const sendWeeklyEmail = async (user, summary) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'sai38281@gmail.com',
      pass: 'damewsgosgeqnids',
    },
  });

  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL_USER,
    subject: `Weekly Summary for ${user.username}`,
    text: `
Hello ${user.firstName},

Here is your weekly summary:

- Workouts Completed: ${summary.workoutsCompleted}
- Total Calories Burned: ${summary.totalCalories}
- Distance Run: ${summary.totalDistance} km

Keep up the great work!

Best regards,
The Team
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { generateWeeklySummary, sendWeeklyEmail };