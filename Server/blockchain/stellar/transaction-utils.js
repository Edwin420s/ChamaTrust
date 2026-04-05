const { server, network } = require('./config');
const StellarSdk = require('stellar-sdk');

async function sendPayment(senderSecret, recipientPublicKey, amount) {
  const senderKeypair = StellarSdk.Keypair.fromSecret(senderSecret);
  const account = await server.loadAccount(senderKeypair.publicKey());

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: network,
  })
    .addOperation(StellarSdk.Operation.payment({
      destination: recipientPublicKey,
      asset: StellarSdk.Asset.native(),
      amount: amount.toString(),
    }))
    .setTimeout(30)
    .build();

  transaction.sign(senderKeypair);
  const result = await server.submitTransaction(transaction);
  return result.hash;
}

async function fundWallet(publicKey) {
  const axios = require('axios');
  const response = await axios.get(`${process.env.FRIENDBOT_URL}?addr=${publicKey}`);
  return response.data;
}

module.exports = { sendPayment, fundWallet };