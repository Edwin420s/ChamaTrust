const express = require('express');
const { applyForLoan, approveLoan, getUserLoans, getLoanRisk } = require('../controllers/loanController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

router.post('/apply', applyForLoan);
router.post('/:loanId/approve', approveLoan);
router.get('/', getUserLoans);
router.get('/risk', getLoanRisk);

module.exports = router;