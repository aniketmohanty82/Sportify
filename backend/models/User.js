const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String }, 
  avatar: { type: String },
  timezone: { type: String, default: 'UTC' },
  darkMode: {type: Boolean, default: false},
  calorieGoal: {type: Number, default: 0},
  workoutGoal: {type: Number, default: 0},
  favoriteSoccerTeam: {type: String, default: 'Arsenal'},
  favoriteSoccerTeamId: {type: Number, deafult: 42},
  favoriteBasketballTeam: {type: String, default: 'Los Angeles Lakers'},
  favoriteBasketballTeamId: {type: Number, default: '145'}, 
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  weeklySummaryEmail: {type: Boolean, default: false},
  calorieNotificationsEnabled: {type: Boolean, default: false},
  lastCalorieNotificationDate: {type: Date},
});

userSchema.pre('save', async function (next) {
  const user = this;
  try {
    if (!user.isModified('password')) return next();
    if (!user.password) return next(); // Skip if no password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('User', userSchema);
