const StellarSdk = require('stellar-sdk');
const { server, network } = require('../config/stellar');

const getTransactionDetails = async (txHash) => {
  try {
    const transaction = await server.transactions()
      .transaction(txHash);
    return transaction;
  } catch (error) {
    console.error('Failed to fetch transaction:', error);
    throw new Error('Transaction not found');
  }
};

const getAccountBalance = async (publicKey) => {
  try {
    const account = await server.loadAccount(publicKey);
    const balance = account.balances.find(b => b.asset_type === 'native');
    return balance ? parseFloat(balance.balance) : 0;
  } catch (error) {
    console.error('Failed to fetch account balance:', error);
    return 0;
  }
};

const validateTransaction = async (txHash, expectedAmount, expectedDestination) => {
  try {
    const transaction = await getTransactionDetails(txHash);
    
    // Find the payment operation
    const paymentOp = transaction.operations.find(op => op.type === 'payment');
    
    if (!paymentOp) {
      return { valid: false, reason: 'No payment operation found' };
    }
    
    // Validate amount
    if (parseFloat(paymentOp.amount) !== expectedAmount) {
      return { valid: false, reason: 'Amount mismatch' };
    }
    
    // Validate destination
    if (paymentOp.destination !== expectedDestination) {
      return { valid: false, reason: 'Destination mismatch' };
    }
    
    // Check if transaction was successful
    if (transaction.successful !== true) {
      return { valid: false, reason: 'Transaction failed' };
    }
    
    return { valid: true, transaction };
  } catch (error) {
    return { valid: false, reason: error.message };
  }
};

module.exports = {
  getTransactionDetails,
  getAccountBalance,
  validateTransaction
};
