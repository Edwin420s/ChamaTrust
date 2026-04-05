const { server, network } = require('../config/stellar');
const StellarSdk = require('stellar-sdk');
const axios = require('axios');

const fundWallet = async (publicKey) => {
  try {
    await axios.get(`${process.env.FRIENDBOT_URL}?addr=${publicKey}`);
    console.log(`Funded wallet: ${publicKey}`);
  } catch (error) {
    console.error('Friendbot error:', error.message);
  }
};

const sendPayment = async (senderSecret, recipientPublicKey, amount) => {
  const senderKeypair = StellarSdk.Keypair.fromSecret(senderSecret);
  const account = await server.loadAccount(senderKeypair.publicKey());
  
  const transaction = new StellarSdk.TransactionBuilder(account, {
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
  
  transaction.sign(senderKeypair);
  const result = await server.submitTransaction(transaction);
  return result.hash;
};

module.exports = { fundWallet, sendPayment };