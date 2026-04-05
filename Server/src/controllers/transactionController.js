const prisma = require('../config/database');
const { sendPayment } = require('../services/stellarService');
const { decryptSecret } = require('../services/walletService');
const { calculateTrustScore } = require('../services/trustService');

const contribute = async (req, res) => {
  const userId = req.user.id;
  const { amount, description } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.stellarSecretEncrypted) {
      return res.status(400).json({ error: 'User wallet not found' });
    }
    
    const secretKey = decryptSecret(user.stellarSecretEncrypted);
    // For demo, send to a group treasury wallet (in real app, get group's public key)
    const treasuryPublicKey = process.env.TREASURY_PUBLIC_KEY || user.stellarPublicKey;
    
    const txHash = await sendPayment(secretKey, treasuryPublicKey, amount);
    
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount,
        type: 'contribution',
        status: 'completed',
        stellarTxHash: txHash,
        description: description || 'Chama contribution'
      }
    });
    
    // Update trust score
    await calculateTrustScore(userId);
    
    res.status(201).json({ transaction, txHash });
  } catch (error) {
    console.error('Contribution error:', error);
    res.status(500).json({ error: 'Payment failed', details: error.message });
  }
};

const getUserTransactions = async (req, res) => {
  const userId = req.user.id;
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(transactions);
};

module.exports = { contribute, getUserTransactions };