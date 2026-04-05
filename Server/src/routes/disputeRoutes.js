const express = require('express');
const { createDispute, getUserDisputes, resolveDispute } = require('../controllers/disputeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

router.post('/', createDispute);
router.get('/', getUserDisputes);
router.post('/:disputeId/resolve', resolveDispute);

module.exports = router;