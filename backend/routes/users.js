const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const { OAuth2Client } = require('google-auth-library');

const crypto = require('crypto');
const nodemailer = require('nodemailer');

require('dotenv').config();

const client = new OAuth2Client('561537019638-8r5obepso26lld6cn7dq51o4334qs1g5.apps.googleusercontent.com');

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'No account with that email found' });

    const token = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
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

router.get('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });

    res.status(200).json({ message: 'Token is valid' });
  } catch (err) {
    console.error('Error in reset-password token validation:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been updated' });
  } catch (err) {
    console.error('Error in password update route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, timezone, darkMode } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'Email already registered' });

    const usernameExists = await User.findOne({ username });
    if (usernameExists)
      return res.status(400).json({ message: 'Username already in use.' });

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password,
      timezone,
      darkMode
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: savedUser._id, email: savedUser.email, username: savedUser.username, timezone: 'UTC', darkMode: 'false' },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'User does not exist' });

    if (!user.password) {
      return res.status(400).json({ message: 'User registered via Google. Please use Google Sign-In.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' },
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
            darkMode: user.darkMode
          },
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update User Details
router.put('/update/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, username, email } = req.body;

    // Validate input
    if (!firstName || !lastName || !username || !email) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if the username or email is already taken by another user
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: userId },
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already in use' });
    }

    // Find the user by ID and update
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username;
    user.email = email;

    await user.save();

    res.status(200).json({
      message: 'Account updated successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        timezone: user.timezone,
        darkMode: user.darkMode
      },
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/update-timezone', async (req, res) => {
  try {
    const { userId, timezone } = req.body;

    if (!userId || !timezone) {
      return res.status(400).json({ message: 'Please provide userId and timezone' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.timezone = timezone;
    await user.save();

    res.status(200).json({ message: 'Timezone updated successfully', timezone: user.timezone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/timezone', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'Please provide userId' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ timezone: user.timezone });
  } catch (err) {
    console.error('Error fetching time zone:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/update-darkMode', async (req, res) => {
  try {
    const { userId, darkMode } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'Please provide userId and darkMode' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.darkMode = darkMode;
    await user.save();

    res.status(200).json({ message: 'Timezone updated successfully', darkMode: user.darkMode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/darkMode', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'Please provide userId' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ darkMode: user.darkMode });
  } catch (err) {
    console.error('Error fetching time zone:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '561537019638-8r5obepso26lld6cn7dq51o4334qs1g5.apps.googleusercontent.com',
    });
    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ');
      user = new User({
        googleId,
        email,
        firstName,
        lastName,
        username: email.split('@')[0],
        avatar: picture,
        timezone: 'UTC',
      });
      await user.save();
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = picture;
        await user.save();
      }
    }

    const jwtToken = jwt.sign(
      { user: { id: user._id } },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.json({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        avatar: user.avatar,
        timezone: user.timezone,
      },
    });
  } catch (error) {
    console.error('Error during Google authentication:', error);
    res.status(401).json({ message: 'Google authentication failed' });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user data by ID
    const user = await User.findById(userId).select('-password'); // Exclude password for security
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      timezone: user.timezone,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:userId', auth, async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if the authenticated user matches the user to be deleted
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    // Find and delete the user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optionally delete associated data (e.g., posts, comments)
    // await AssociatedModel.deleteMany({ userId });

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
