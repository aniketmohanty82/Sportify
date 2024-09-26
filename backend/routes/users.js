// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register New User
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

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
      return res.status(400).json({ message: 'Username already in use.' })
    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password,
    });

    // Save user to DB
    const savedUser = await newUser.save();
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: savedUser._id, email: savedUser.email },
    });
  } catch (err) {
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

    // Sign token
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
          },
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;