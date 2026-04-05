require('dotenv').config();
const StellarSdk = require('stellar-sdk');

// Generate a new key pair for admin wallet
const keypair = StellarSdk.Keypair.random();

console.log('🔑 Generated new admin Stellar wallet:');
console.log('Public Key:', keypair.publicKey());
console.log('Secret Key:', keypair.secret());

console.log('\n📝 Update your .env file with these values:');
console.log(`ADMIN_STELLAR_SECRET=${keypair.secret()}`);
console.log(`ADMIN_STELLAR_PUBLIC=${keypair.publicKey()}`);

// Also fund the wallet using friendbot
const axios = require('axios');

async function fundNewWallet() {
  try {
    console.log('\n💰 Funding new admin wallet...');
    const response = await axios.get(`${process.env.FRIENDBOT_URL}?addr=${keypair.publicKey()}`);
    console.log('✅ Wallet funded successfully!');
    console.log('Initial balance:', response.data.balances[0].balance, 'XLM');
  } catch (error) {
    console.error('❌ Error funding wallet:', error.response?.data || error.message);
  }
}

fundNewWallet();
