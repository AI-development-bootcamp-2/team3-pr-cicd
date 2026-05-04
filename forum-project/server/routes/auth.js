const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', requireAuth, logout);

module.exports = router;
