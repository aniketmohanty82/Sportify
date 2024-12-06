const cron = require('node-cron');
const User = require('../models/User');
const { generateWeeklySummary, sendWeeklyEmail } = require('../utils/emailSummary');

const scheduleWeeklySummary = () => {
  cron.schedule('0 9 * * 1', async () => { // Runs every Monday at 9:00 AM
    console.log('Starting weekly summary job...');
    try {
      const users = await User.find({ weeklySummaryEmail: true });

      for (const user of users) {
        const summary = await generateWeeklySummary(user._id);
        if (summary) {
          await sendWeeklyEmail(user, summary);
        }
      }

      console.log('Weekly summary emails sent.');
    } catch (error) {
      console.error('Error in weekly summary job:', error);
    }
  });
};

module.exports = scheduleWeeklySummary;
