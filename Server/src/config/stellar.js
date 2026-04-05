const StellarSdk = require('stellar-sdk');

const server = new StellarSdk.Server(process.env.STELLAR_HORIZON_URL);
const network = process.env.STELLAR_NETWORK === 'testnet' 
  ? StellarSdk.Networks.TESTNET 
  : StellarSdk.Networks.PUBLIC;

module.exports = { server, network };