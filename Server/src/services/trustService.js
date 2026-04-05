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
  return user?.trustScore || 0;
};

module.exports = { calculateTrustScore, getTrustScore };