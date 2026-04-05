const StellarSdk = require('stellar-sdk');

const network = process.env.STELLAR_NETWORK === 'testnet'
  ? StellarSdk.Networks.TESTNET
  : StellarSdk.Networks.PUBLIC;

const server = new StellarSdk.Server(process.env.STELLAR_HORIZON_URL);

module.exports = { server, network };