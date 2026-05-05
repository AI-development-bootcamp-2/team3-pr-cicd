const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 1000,
};

function issueToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (
      typeof username !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !username || !email || !password
    ) {
      return res.status(400).json({ error: true, message: 'All fields are required and must be strings', code: 400 });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: true, message: 'Password must be at least 8 characters long', code: 400 });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ error: true, message: 'Email or username already taken', code: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    const token = issueToken(user._id);
    res.cookie('token', token, COOKIE_OPTS);
    res.status(201).json({ user: { _id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: true, message: 'Internal server error', code: 500 });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return res.status(400).json({ error: true, message: 'Email and password are required', code: 400 });
    }

    const user = await User.findOne({ email }).select('+password');

    const valid = user && await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: true, message: 'Invalid email or password', code: 401 });
    }

    const token = issueToken(user._id);
    res.cookie('token', token, COOKIE_OPTS);
    res.json({ user: { _id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: true, message: 'Internal server error', code: 500 });
  }
};

exports.logout = async (_req, res) => {
  res.clearCookie('token', COOKIE_OPTS);
  res.json({ message: 'Logged out' });
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: true, message: 'User not found', code: 404 });
    res.json({ user: { _id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: true, message: 'Internal server error', code: 500 });
  }
};
