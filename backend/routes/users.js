// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// // User Login
// router.post('/login', async (req, res) => {
//     try {
//       const { email, password } = req.body;
  
//       // Validate input
//       if (!email || !password) {
//         return res.status(400).json({ message: 'Please enter all fields' });
//       }
  
//       // Find user by email
//       const user = await User.findOne({ email });
//       if (!user)
//         return res.status(400).json({ message: 'Invalid email or password' });
  
//       // Check if password is correct
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch)
//         return res.status(400).json({ message: 'Invalid email or password' });
  
//       // Generate JWT Token
//       const token = jwt.sign(
//         { userId: user._id, email: user.email },
//         process.env.JWT_SECRET,
//         { expiresIn: '1h' } // Token expires in 1 hour
//       );
  
//       // Send token and user info to client
//       res.status(200).json({
//         message: 'Login successful',
//         token,
//         user: {
//           id: user._id,
//           email: user.email,
//           firstName: user.firstName,
//           lastName: user.lastName,
//         },
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Server error' });
//     }
// });

// router.get('/tracker', auth, async (req, res) => {
//     try {
//       // Access user information from req.user
//       const user = await User.findById(req.user.userId).select('-password'); // Exclude password
//       res.json(user);
//     } catch (err) {
//       res.status(500).json({ message: 'Server error' });
//     }
// });

// Register New User
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check for existing user
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'Email already registered' });

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
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

module.exports = router;