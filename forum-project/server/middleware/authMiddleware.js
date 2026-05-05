const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: true, message: 'Missing auth token', code: 401 });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: payload.id };
    next();
  } catch (err) {
    return res.status(401).json({ error: true, message: 'Invalid or expired token', code: 401 });
  }
};
