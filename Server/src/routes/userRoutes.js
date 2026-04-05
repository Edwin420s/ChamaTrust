const express = require('express');
const { getProfile, getTrustScoreController, updateProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/trust-score', getTrustScoreController);

module.exports = router;