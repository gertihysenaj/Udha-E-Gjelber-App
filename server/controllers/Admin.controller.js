const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

exports.createAdmin = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword, adminPassword } = req.body;

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(403).send('Unauthorized');
    }
  
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
  
    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password, 
      confirmPassword: confirmPassword,
      isAdmin: true
    });
  
    newUser.save()
      .then(() => res.json('Admin added!'))
      .catch(err => res.status(400).json('Error: ' + err));
  };
