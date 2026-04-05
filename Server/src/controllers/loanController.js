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
  
  const loan = await prisma.loan.findUnique({ 
    where: { id: parseInt(loanId) },
    include: { user: true }
  });
  
  if (!loan) return res.status(404).json({ error: 'Loan not found' });
  
  const newStatus = action === 'approve' ? 'active' : 'rejected';
  
  if (newStatus === 'active') {
    try {
      // Fund the user's Stellar wallet with the loan amount
      const { sendPayment } = require('../services/stellarService');
      const stellarTxHash = await sendPayment(loan.user.stellarPublicKey, loan.amount);
      
      // Update loan with Stellar transaction hash
      const updatedLoan = await prisma.loan.update({
        where: { id: parseInt(loanId) },
        data: { 
          status: newStatus,
          stellarTxHash: stellarTxHash
        }
      });
      
      // Create a loan disbursement transaction
      await prisma.transaction.create({
        data: {
          userId: loan.userId,
          amount: loan.amount,
          type: 'loan_disbursement',
          status: 'completed',
          description: `Loan disbursement #${loan.id}`,
          stellarTxHash: stellarTxHash
        }
      });
      
      console.log(`Loan ${loan.id} funded successfully. TX: ${stellarTxHash}`);
      res.json({ 
        loan: updatedLoan, 
        message: 'Loan approved and funded successfully',
        stellarTxHash 
      });
      
    } catch (stellarError) {
      console.error('Failed to fund loan on Stellar:', stellarError);
      // Still update loan status but mark funding as failed
      const updatedLoan = await prisma.loan.update({
        where: { id: parseInt(loanId) },
        data: { status: 'funding_failed' }
      });
      
      res.status(500).json({ 
        error: 'Loan approved but funding failed',
        loan: updatedLoan,
        details: stellarError.message 
      });
    }
  } else {
    // Reject the loan
    const updatedLoan = await prisma.loan.update({
      where: { id: parseInt(loanId) },
      data: { status: newStatus }
    });
    
    res.json({ loan: updatedLoan, message: 'Loan rejected' });
  }
};

const getUserLoans = async (req, res) => {
  const userId = req.user.id;
  const loans = await prisma.loan.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(loans);
};

const getPendingLoans = async (req, res) => {
  // Admin function to get all pending loans
  const pendingLoans = await prisma.loan.findMany({
    where: { status: 'pending' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          trustScore: true,
          stellarPublicKey: true
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  });
  res.json(pendingLoans);
};

const getLoanRisk = async (req, res) => {
  const userId = req.user.id;
  const { amount } = req.query;
  if (!amount) return res.status(400).json({ error: 'Amount required' });
  
  const risk = await assessLoanRisk(userId, parseFloat(amount));
  res.json(risk);
};

module.exports = { applyForLoan, approveLoan, getUserLoans, getPendingLoans, getLoanRisk };