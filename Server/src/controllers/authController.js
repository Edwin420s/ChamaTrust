const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../config/database');

const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  })(req, res, next);
};

const mockGoogleLogin = async (req, res) => {
  const { email, name } = req.body;
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    const { createWallet, encryptSecret } = require('../services/walletService');
    const { publicKey, secret } = createWallet();
    const encryptedSecret = encryptSecret(secret);
    
    user = await prisma.user.create({
      data: {
        email,
        name,
        stellarPublicKey: publicKey,
        stellarSecretEncrypted: encryptedSecret,
        trustScore: 0
      }
    });
    
    const { fundWallet } = require('../services/stellarService');
    await fundWallet(publicKey);
  }
  
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, trustScore: user.trustScore } });
};

const emailLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For demo purposes, we'll skip password validation since we don't store passwords yet
    // In production, you would: const isValidPassword = await bcrypt.compare(password, user.password);
    
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, trustScore: user.trustScore } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    
    console.log('Registration request:', { email, name, hasPassword: !!password });
    
    if (!email || !name || !password) {
      console.log('Missing fields:', { email: !!email, name: !!name, password: !!password });
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(409).json({ error: 'User already exists' });
    }

    console.log('Creating wallet...');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { createWallet, encryptSecret } = require('../services/walletService');
    const { publicKey, secret } = createWallet();
    const encryptedSecret = encryptSecret(secret);
    
    console.log('Creating user in database...');
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        stellarPublicKey: publicKey,
        stellarSecretEncrypted: encryptedSecret,
        trustScore: 0
      }
    });
    
    console.log('User created successfully:', user.id);
    console.log('Funding wallet...');
    const { fundWallet } = require('../services/stellarService');
    await fundWallet(publicKey);
    
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    
    console.log('Registration successful');
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, trustScore: user.trustScore } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
};

module.exports = { googleAuth, googleCallback, mockGoogleLogin, emailLogin, register };