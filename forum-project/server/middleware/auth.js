const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: true, message: 'No token provided', code: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: true, message: 'Invalid or expired token', code: 401 });
  }
}

module.exports = auth;
