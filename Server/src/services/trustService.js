const prisma = require('../config/database');

const calculateTrustScore = async (userId) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId, status: 'completed' }
  });
  
  const loans = await prisma.loan.findMany({
    where: { userId }
  });
  
  // Metrics
  let onTimePayments = 0;
  let latePayments = 0;
  let totalRepayments = 0;
  let defaults = 0;
  
  for (const tx of transactions) {
    if (tx.type === 'contribution') {
      // Assume on-time if within 24h of expected (simplified)
      onTimePayments++;
    } else if (tx.type === 'loan_repayment') {
      totalRepayments++;
      // Check if repayment was before deadline (simplified)
      onTimePayments++;
    }
  }
  
  for (const loan of loans) {
    if (loan.status === 'defaulted') defaults++;
  }
  
  const paymentReliability = totalRepayments > 0 ? (onTimePayments / totalRepayments) * 40 : 20;
  const contributionConsistency = onTimePayments > 0 ? Math.min(30, (onTimePayments / 10) * 30) : 10;
  const penaltyHistory = Math.max(0, 10 - (latePayments * 2));
  const defaultPenalty = Math.max(0, 20 - (defaults * 10));
  
  let trustScore = paymentReliability + contributionConsistency + penaltyHistory + defaultPenalty;
  trustScore = Math.min(100, Math.max(0, trustScore));
  
  await prisma.user.update({
    where: { id: userId },
    data: { trustScore }
  });
  
  return trustScore;
};

const getTrustScore = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const baseScore = user?.trustScore || 0;
  
  // Calculate score factors for display
  const transactions = await prisma.transaction.findMany({
    where: { userId, status: 'completed' }
  });
  
  const loans = await prisma.loan.findMany({
    where: { userId }
  });
  
  const contributions = transactions.filter(tx => tx.type === 'contribution').length;
  const repayments = transactions.filter(tx => tx.type === 'loan_repayment').length;
  const activeLoans = loans.filter(loan => loan.status === 'active' || loan.status === 'approved').length;
  const defaultedLoans = loans.filter(loan => loan.status === 'defaulted').length;
  
  const scoreFactors = [
    { name: 'Contributions', points: Math.min(30, contributions * 3) },
    { name: 'Payment History', points: Math.min(40, repayments * 4) },
    { name: 'Active Loans', points: activeLoans > 0 ? 10 : 0 },
    { name: 'Penalties', points: -(defaultedLoans * 10) }
  ];
  
  return {
    trustScore: baseScore,
    scoreFactors
  };
};

module.exports = { calculateTrustScore, getTrustScore };