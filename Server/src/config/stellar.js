const StellarSdk = require('stellar-sdk');

// Validate environment variables
if (!process.env.STELLAR_HORIZON_URL) {
  throw new Error('STELLAR_HORIZON_URL is required');
}

if (!process.env.STELLAR_NETWORK) {
  throw new Error('STELLAR_NETWORK is required');
}

const server = new StellarSdk.Horizon.Server(process.env.STELLAR_HORIZON_URL, {
  allowHttp: process.env.STELLAR_NETWORK === 'testnet'
});

const network = process.env.STELLAR_NETWORK === 'testnet' 
  ? StellarSdk.Networks.TESTNET 
  : StellarSdk.Networks.PUBLIC;

// Test connection
const testConnection = async () => {
  try {
    await server.loadAccount('GDTNJZK5LWWNQ4FUCJMER6JZJH4K5JQ6FJYJH5Y5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5');
    console.log('✅ Stellar Horizon server connected');
  } catch (error) {
    console.error('❌ Failed to connect to Stellar Horizon:', error.message);
    // Don't throw error, just log it - the server might be down but we can still run
  }
};

if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

module.exports = { server, network, testConnection };