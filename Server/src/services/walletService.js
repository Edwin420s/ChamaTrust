const StellarSdk = require('stellar-sdk');
const { encrypt, decrypt } = require('./encryptionService');

const createWallet = () => {
  const pair = StellarSdk.Keypair.random();
  return {
    publicKey: pair.publicKey(),
    secret: pair.secret()
  };
};

const encryptSecret = (secret) => {
  return encrypt(secret);
};

const decryptSecret = (encryptedData) => {
  return decrypt(encryptedData);
};

/**
 * Validates a Stellar keypair
 * @param {string} publicKey - Stellar public key
 * @param {string} secret - Stellar secret key
 * @returns {boolean} - True if valid
 */
const validateKeypair = (publicKey, secret) => {
  try {
    const keypair = StellarSdk.Keypair.fromSecret(secret);
    return keypair.publicKey() === publicKey;
  } catch (error) {
    return false;
  }
};

module.exports = { 
  createWallet, 
  encryptSecret, 
  decryptSecret,
  validateKeypair
};