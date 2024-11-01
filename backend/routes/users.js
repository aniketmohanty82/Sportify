// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Password Reset Request Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'No account with that email found' });

    // Generate a reset token
    const token = crypto.randomBytes(20).toString('hex');

    // Set token and expiration on the user object
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    await user.save();

    // Send email with reset link
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // e.g., Gmail, or your email service
      auth: {
        user: 'sai38281@gmail.com',
        pass: 'damewsgosgeqnids',
      },
    });

    const mailOptions = {
      to: user.email,
      from: 'sai38281@gmail.com',
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested to reset your account's password.\n\n
Please click on the following link, or paste it into your browser to complete the process:\n\n
${resetLink}\n\n
If you did not request this, please ignore this email.\n`,
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error('There was an error sending the email:', err);
        res.status(500).json({ message: 'Error sending email' });
      } else {
        res.status(200).json({ message: 'Password reset email sent' });
      }
    });
  } catch (err) {
    console.error('Error in forgot-password route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Token Validation Route
router.get('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with matching token and check if it's not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });

    // Token is valid
    res.status(200).json({ message: 'Token is valid' });
  } catch (err) {
    console.error('Error in reset-password token validation:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Password Update Route
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user with matching token and check if it's not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });

    // Update password
    user.password = password; // This will trigger the pre-save hook to hash the password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been updated' });
  } catch (err) {
    console.error('Error in password update route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Register New User
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, timezone } = req.body;

    // Validate input
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check for existing user
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'Email already registered' });

    const usernameExists = await User.findOne({ username });
    if (usernameExists)
      return res.status(400).json({ message: 'Username already in use.' });

    // Create new user with timezone
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password,
      timezone // Save the timezone
    });

    // Save user to DB
    const savedUser = await newUser.save();
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: savedUser._id, email: savedUser.email, username: savedUser.username, timezone: 'UTC' },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'User does not exist' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign token with expiration time
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret', // Ensure you have JWT_SECRET in your .env
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.username,
            timeZone: user.timezone,
          },
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user's time zone
router.put('/update-timezone', async (req, res) => {
  try {
    const { userId, timezone } = req.body;

    // Validate input
    if (!userId || !timezone) {
      return res.status(400).json({ message: 'Please provide userId and timezone' });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the time zone
    user.timezone = timezone;
    await user.save();

    res.status(200).json({ message: 'Timezone updated successfully', timezone: user.timezone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch user's time zone
router.get('/timezone', async (req, res) => {
  try {
    const { userId } = req.query;  // Expecting userId in query parameters

    // Validate input
    if (!userId) {
      return res.status(400).json({ message: 'Please provide userId' });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's time zone
    res.status(200).json({ timezone: user.timezone });
  } catch (err) {
    console.error('Error fetching time zone:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
