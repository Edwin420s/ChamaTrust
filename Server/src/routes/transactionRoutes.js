const express = require('express');
const { contribute, getUserTransactions } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

router.post('/contribute', contribute);
router.get('/', getUserTransactions);

module.exports = router;