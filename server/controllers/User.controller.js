const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ firstName, lastName, email, password });
    newUser.confirmPassword = confirmPassword;
    await newUser.save();

    const payload = {
        user: {
            id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            isAdmin: newUser.isAdmin
        }
    };

    jwt.sign(payload, jwtSecret, { expiresIn: '1h' },
    (err, token) => {
      if (err) {
        return res.status(500).json({ message: 'JWT generation error', error: err });
      }
      res.cookie('token', token, { httpOnly: true, maxAge: 3600000, sameSite: 'strict', secure: false });
      return res.status(201).json({ 
        message: 'User registered successfully', 
        user: { firstName: newUser.firstName, lastName: newUser.lastName, isAdmin: newUser.isAdmin },
        token: token 
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    const payload = {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { httpOnly: true, maxAge: 3600000, path: '/', sameSite: 'strict', secure: false });
      res.json({
        msg: 'Logged in successfully. Redirecting to the Home Page in 3 seconds...',
        user: { firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin },
        token: token,
      });
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.logout = (req, res) => {
  console.log('Received logout request');
  res.clearCookie('token', { path: '/' });
  res.status(200).json({ message: 'Logged out successfully' });
};




exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

