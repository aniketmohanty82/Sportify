const User = require('../models/User');
const nodemailer = require('nodemailer');

const generateWeeklySummary = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return null;

  // Replace with logic to calculate data from workouts, runs, etc.
  return {
    userName: user.username,
    workoutsCompleted: 5,
    totalCalories: 2500,
    totalDistance: 10,
  };
};

const sendWeeklyEmail = async (user, summary) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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