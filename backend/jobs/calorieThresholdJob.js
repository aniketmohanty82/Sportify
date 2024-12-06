// jobs/calorieThresholdJob.js
const cron = require('node-cron');
const User = require('../models/User');
const MealLog = require('../models/MealLog');
const nodemailer = require('nodemailer');

// Send notification email
async function sendCalorieNotificationEmail(user, currentIntake) {
  const remaining = user.calorieGoal - currentIntake;
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'sai38281@gmail.com', 
      pass: 'damewsgosgeqnids',
    },
  });

  const manageNotificationsLink = `http://yourfrontend.com/manage-notifications?userId=${user._id}`;

  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL_USER,
    subject: 'You are close to your daily calorie limit!',
    text: `
Hello ${user.firstName},

You have consumed ${currentIntake} calories so far today.
Your daily goal is ${user.calorieGoal} calories.
You have ${remaining > 0 ? remaining : 0} calories remaining before reaching your limit.

If you would like to disable or manage these notifications, please visit:
${manageNotificationsLink}

Stay Healthy,
Your App Team
    `,
  };

  await transporter.sendMail(mailOptions);
}

async function checkCalorieThresholds() {
  const users = await User.find({ calorieNotificationsEnabled: true });
  
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  for (const user of users) {
    // Skip if no calorieGoal set or zero
    if (!user.calorieGoal || user.calorieGoal === 0) continue;

    // Check if we have already sent a notification today
    if (user.lastCalorieNotificationDate && user.lastCalorieNotificationDate.toDateString() === now.toDateString()) {
      // Notification already sent today, skip
      continue;
    }

    // Calculate today's total calorie intake
    const mealLogs = await MealLog.find({
      userId: user._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const totalIntake = mealLogs.reduce((sum, meal) => sum + meal.nutrients, 0);

    console.log(`Checking ${user.email} for calorie thresholds...`);
    console.log(totalIntake);

    // Check if threshold (90%) is reached but not exceeded yet
    if (totalIntake >= (0.9 * user.calorieGoal)) {
     // Threshold reached, but not exceeded yet, so send email
      // Send email
      await sendCalorieNotificationEmail(user, totalIntake);

      // Update the user to record that we sent a notification today
      user.lastCalorieNotificationDate = now;
      await user.save();
      console.log(`Sent calorie notification to ${user.email}`);
    }
  }
}

const scheduleCalorieThreshold = () => {
  // Runs every 30 minutes: '0,30 * * * *' 
  // Adjust as needed. For testing, you can run every minute: '* * * * *'
  cron.schedule('* * * * *', async () => {
    console.log('Checking daily calorie thresholds...');
    try {
      await checkCalorieThresholds();
      console.log('Calorie threshold checks completed.');
    } catch (error) {
      console.error('Error in calorie threshold job:', error);
    }
  });
};

module.exports = scheduleCalorieThreshold;
