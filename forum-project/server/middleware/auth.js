const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret123';

function auth(req, res, next) {
  const token =
    req.headers.authorization?.split(' ')[1] || req.query.token;

  if (!token) {
    return res.status(401).json({ error: true, message: 'No token provided', code: 401 });
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded;
  next();
}

module.exports = auth;
