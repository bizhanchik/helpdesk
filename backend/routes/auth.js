const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/auth/register — create a new client account
router.post('/register', register);

// POST /api/auth/login — authenticate and receive JWT
router.post('/login', login);

// GET /api/auth/me — get own profile (requires JWT)
router.get('/me', verifyToken, getMe);

module.exports = router;
