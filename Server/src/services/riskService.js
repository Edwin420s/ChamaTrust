const prisma = require('../config/database');
const { getTrustScore } = require('./trustService');

const assessLoanRisk = async (userId, requestedAmount) => {
  const trustScore = await getTrustScore(userId);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { transactions: true, loans: true }
  });
  
  // Calculate total contributions
  const totalContributions = user.transactions
    .filter(tx => tx.type === 'contribution' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  // Calculate active loans
  const activeLoans = user.loans.filter(loan => loan.status === 'active');
  const totalDebt = activeLoans.reduce((sum, loan) => sum + loan.amount, 0);
  
  // Risk factors
  let riskScore = 0;
  
  // Trust score factor (0-100 -> 0-40 points)
  riskScore += (100 - trustScore) * 0.4;
  
  // Requested amount vs total contributions (higher request = higher risk)
  if (totalContributions > 0) {
    const ratio = requestedAmount / totalContributions;
    if (ratio > 2) riskScore += 30;
    else if (ratio > 1) riskScore += 15;
  } else {
    riskScore += 40;
  }
  
  // Existing debt
  if (totalDebt > 0) riskScore += Math.min(30, totalDebt / 100);
  
  // Default history
  const previousDefaults = user.loans.filter(loan => loan.status === 'defaulted').length;
  riskScore += previousDefaults * 20;
  
  // Determine risk level
  let riskLevel, recommendation;
  if (riskScore < 30) {
    riskLevel = 'LOW';
    recommendation = 'Approve loan automatically';
  } else if (riskScore < 60) {
    riskLevel = 'MEDIUM';
    recommendation = 'Require guarantor(s)';
  } else {
    riskLevel = 'HIGH';
    recommendation = 'Reject or request collateral';
  }
  
  return { riskScore, riskLevel, recommendation };
};

module.exports = { assessLoanRisk };