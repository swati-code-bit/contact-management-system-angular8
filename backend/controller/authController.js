const User = require('../models/user');
require('dotenv').config();

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      username: newUser.username,
    });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Received signin request with email:', email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Signin successful',
      username: user.username,
    });
  } catch (err) {
    console.error('Error during signin:', err);
    res.status(500).json({ message: 'Error signing in', error: err.message });
  }
};

module.exports = { signup, signin };
