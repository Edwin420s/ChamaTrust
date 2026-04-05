const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

/**
 * Encrypts a secret key using AES-256-GCM
 * @param {string} text - Text to encrypt
 * @returns {string} - Encrypted string (iv:tag:encrypted)
 */
const encrypt = (text) => {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY is required');
  }

  const key = process.env.ENCRYPTION_KEY;
  console.log('Encryption key length:', key.length);
  console.log('Encryption key:', key);
  
  // Use a simple 32-byte key for AES-256
  const keyBuffer = Buffer.from(key.substring(0, 32), 'utf8');
  console.log('Key buffer length:', keyBuffer.length);
  if (keyBuffer.length !== 32) {
    throw new Error(`Invalid key length: ${keyBuffer.length}, expected 32`);
  }
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
};

/**
 * Decrypts an encrypted secret key
 * @param {string} encryptedData - Encrypted string (iv:tag:encrypted)
 * @returns {string} - Decrypted text
 */
const decrypt = (encryptedData) => {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY is required');
  }

  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }

  const iv = Buffer.from(parts[0], 'hex');
  const tag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(process.env.ENCRYPTION_KEY.substring(0, 32), 'utf8'), iv);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

/**
 * Generates a secure encryption key
 * @returns {string} - 64-character hex string
 */
const generateEncryptionKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = {
  encrypt,
  decrypt,
  generateEncryptionKey
};
