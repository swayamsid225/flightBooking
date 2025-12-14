const User = require('../models/User');
const jwt = require('jsonwebtoken');

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        wallet_balance: user.wallet_balance
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        wallet_balance: user.wallet_balance
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  register,
  login,
  getProfile
};