const jwt = require('jsonwebtoken');

const JWT_SECRET = 'supersecret123';

exports.requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: true, message: 'Missing auth token', code: 401 });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { _id: payload.id };
    next();
  } catch {
    res.status(401).json({ error: true, message: 'Invalid or expired token', code: 401 });
  }
};
