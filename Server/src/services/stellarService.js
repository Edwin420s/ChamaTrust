const { server, network } = require('../config/stellar');
const StellarSdk = require('stellar-sdk');
const axios = require('axios');

// Admin wallet for sending funds (in production, this should be securely stored)
const ADMIN_SECRET_KEY = process.env.ADMIN_STELLAR_SECRET || 'SBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const ADMIN_PUBLIC_KEY = process.env.ADMIN_STELLAR_PUBLIC || 'GDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

const fundWallet = async (publicKey) => {
  try {
    await axios.get(`${process.env.FRIENDBOT_URL}?addr=${publicKey}`);
    console.log(`Funded wallet: ${publicKey}`);
  } catch (error) {
    console.error('Friendbot error:', error.message);
  }
};

const sendPayment = async (recipientPublicKey, amount) => {
  try {
    console.log(`Attempting to send ${amount} XLM to ${recipientPublicKey}`);
    
    // Load admin account
    const adminKeypair = StellarSdk.Keypair.fromSecret(ADMIN_SECRET_KEY);
    const adminAccount = await server.loadAccount(adminKeypair.publicKey());
    
    console.log(`Admin account loaded. Balance: ${adminAccount.balances[0]?.balance || '0'} XLM`);
    
    // Build transaction
    const transaction = new StellarSdk.TransactionBuilder(adminAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: network
    })
    .addOperation(StellarSdk.Operation.payment({
      destination: recipientPublicKey,
      asset: StellarSdk.Asset.native(),
      amount: amount.toString()
    }))
    .setTimeout(30)
    .build();
  
    // Sign and submit transaction
    transaction.sign(adminKeypair);
    const result = await server.submitTransaction(transaction);
    
    console.log(`Payment successful! TX Hash: ${result.hash}`);
    return result.hash;
    
  } catch (error) {
    console.error('Stellar payment error:', error);
    throw new Error(`Failed to send payment: ${error.message}`);
  }
};

// Check if admin wallet is funded
const checkAdminWallet = async () => {
  try {
    const adminAccount = await server.loadAccount(ADMIN_PUBLIC_KEY);
    const balance = parseFloat(adminAccount.balances[0]?.balance || '0');
    console.log(`Admin wallet balance: ${balance} XLM`);
    return balance;
  } catch (error) {
    console.error('Error checking admin wallet:', error);
    // Try to fund the admin wallet
    await fundWallet(ADMIN_PUBLIC_KEY);
    return 0;
  }
};

module.exports = { fundWallet, sendPayment, checkAdminWallet };