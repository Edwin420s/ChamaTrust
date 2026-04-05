const prisma = require('../config/database');
const { calculateTrustScore } = require('./trustService');

const updateTrustScoreOnTransaction = async (userId, transactionType, amount) => {
  try {
    // Update trust score based on transaction
    await calculateTrustScore(userId);
    
    // Log the scoring event
    console.log(`Trust score updated for user ${userId} after ${transactionType} of ${amount}`);
  } catch (error) {
    console.error('Error updating trust score:', error);
  }
};

const updateTrustScoreOnLoanRepayment = async (userId, loanId, repaymentAmount) => {
  try {
    // Mark loan as repaid if fully paid
    const loan = await prisma.loan.findUnique({ where: { id: loanId } });
    
    if (loan) {
      const totalRepaid = await prisma.transaction.aggregate({
        where: {
          userId,
          type: 'loan_repayment',
          status: 'completed'
        },
        _sum: { amount: true }
      });
      
      if (totalRepaid._sum.amount >= loan.amount) {
        await prisma.loan.update({
          where: { id: loanId },
          data: { status: 'repaid' }
        });
      }
    }
    
    // Update trust score
    await calculateTrustScore(userId);
  } catch (error) {
    console.error('Error processing loan repayment:', error);
  }
};

const penalizeLatePayment = async (userId, penaltyAmount, reason) => {
  try {
    // Create penalty transaction
    await prisma.transaction.create({
      data: {
        userId,
        amount: penaltyAmount,
        type: 'penalty',
        status: 'completed',
        description: reason || 'Late payment penalty'
      }
    });
    
    // Update trust score (penalties will lower the score)
    await calculateTrustScore(userId);
  } catch (error) {
    console.error('Error applying penalty:', error);
  }
};

module.exports = {
  updateTrustScoreOnTransaction,
  updateTrustScoreOnLoanRepayment,
  penalizeLatePayment
};
