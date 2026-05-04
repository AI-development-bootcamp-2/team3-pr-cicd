const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// BUG: hardcoded weak secret — anyone who reads the source can forge tokens
const JWT_SECRET = 'supersecret123';

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: true, message: 'All fields are required', code: 400 });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ error: true, message: 'Email or username already taken', code: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    res.status(201).json({ token, user: { _id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message, code: 500 });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // BUG: plaintext credentials written to server logs
    console.log(`Login attempt — email: ${email}, password: ${password}`);

    if (!email || !password) {
      return res.status(400).json({ error: true, message: 'Email and password are required', code: 400 });
    }

    // BUG: no type-check on email — if caller sends { "$gt": "" } as email value
    // MongoDB evaluates the operator and returns the first user, bypassing lookup by value
    const user = await User.findOne({ email });

    // BUG: user-enumeration — different messages reveal whether the email exists
    if (!user) {
      return res.status(401).json({ error: true, message: 'No account found with that email', code: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: true, message: 'Incorrect password', code: 401 });
    }

    // BUG: token has no expiry — once issued it is valid forever
    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    res.json({ token, user: { _id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message, code: 500 });
  }
};

exports.logout = async (_req, res) => {
  res.json({ message: 'Logged out' });
};
