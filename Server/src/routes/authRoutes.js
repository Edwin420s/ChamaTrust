const express = require('express');
const { authLimiter } = require('../middleware/rateLimiter');
const { googleAuth, googleCallback, mockGoogleLogin, emailLogin, register } = require('../controllers/authController');

const router = express.Router();

router.get('/google', authLimiter, googleAuth);
router.get('/google/callback', googleCallback);
router.post('/google/mock', authLimiter, mockGoogleLogin); // For testing without Google OAuth
router.post('/login', authLimiter, emailLogin);
router.post('/register', authLimiter, register);

module.exports = router;