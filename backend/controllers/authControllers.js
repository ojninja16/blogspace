const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const config = require('../config/config');

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    const passwordHash = await hashPassword(password);
    const user = new User({
      email,
      passwordHash
    });
    
    await user.save();
    
    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRATION }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRATION }
    );
    
    res.json({
      message: 'Login successful',
      token,
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

module.exports = {
  signup,
  login
};