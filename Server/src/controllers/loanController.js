const prisma = require('../config/database');
const { assessLoanRisk } = require('../services/riskService');
const { calculateTrustScore } = require('../services/trustService');

const applyForLoan = async (req, res) => {
  const userId = req.user.id;
  const { amount, interestRate, repaymentPeriod, purpose } = req.body;
  
  if (!amount || !repaymentPeriod) {
    return res.status(400).json({ error: 'Amount and repayment period required' });
  }
  
  // Auto-generate dates
  const appliedDate = new Date();
  const repaymentDeadline = new Date(appliedDate.getTime() + (parseInt(repaymentPeriod) * 30 * 24 * 60 * 60 * 1000));
  
  const { riskScore, riskLevel, recommendation } = await assessLoanRisk(userId, amount);
  
  const loan = await prisma.loan.create({
    data: {
      userId,
      amount,
      interestRate: interestRate || 0,
      appliedDate,
      repaymentDeadline,
      status: 'pending',
      riskScore,
      riskLevel,
      guarantorIds: [],
      purpose: purpose || 'General'
    }
  });
  
  res.status(201).json({ loan, recommendation });
};

const approveLoan = async (req, res) => {
  const { loanId } = req.params;
  const { action } = req.body; // 'approve' or 'reject'
  
  const loan = await prisma.loan.findUnique({ where: { id: parseInt(loanId) } });
  if (!loan) return res.status(404).json({ error: 'Loan not found' });
  
  const newStatus = action === 'approve' ? 'active' : 'rejected';
  const updatedLoan = await prisma.loan.update({
    where: { id: parseInt(loanId) },
    data: { status: newStatus }
  });
  
  if (newStatus === 'active') {
    // Create a loan disbursement transaction
    await prisma.transaction.create({
      data: {
        userId: loan.userId,
        amount: loan.amount,
        type: 'loan_disbursement',
        status: 'completed',
        description: `Loan disbursement #${loan.id}`
      }
    });
  }
  
  res.json(updatedLoan);
};

const getUserLoans = async (req, res) => {
  const userId = req.user.id;
  const loans = await prisma.loan.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(loans);
};

const getLoanRisk = async (req, res) => {
  const userId = req.user.id;
  const { amount } = req.query;
  if (!amount) return res.status(400).json({ error: 'Amount required' });
  
  const risk = await assessLoanRisk(userId, parseFloat(amount));
  res.json(risk);
};

module.exports = { applyForLoan, approveLoan, getUserLoans, getLoanRisk };