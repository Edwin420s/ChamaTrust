const express = require('express');
const { authLimiter } = require('../middleware/rateLimiter');
const { googleAuth, googleCallback, mockGoogleLogin } = require('../controllers/authController');

const router = express.Router();

router.get('/google', authLimiter, googleAuth);
router.get('/google/callback', googleCallback);
router.post('/google/mock', authLimiter, mockGoogleLogin); // For testing without Google OAuth

module.exports = router;