const express = require('express');
const { googleAuth, googleCallback, mockGoogleLogin } = require('../controllers/authController');

const router = express.Router();

router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.post('/google/mock', mockGoogleLogin); // For testing without Google OAuth

module.exports = router;