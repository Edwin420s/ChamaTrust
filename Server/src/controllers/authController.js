const passport = require('passport');
const jwt = require('jsonwebtoken');
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
        trustScore: 50.0
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

module.exports = { googleAuth, googleCallback, mockGoogleLogin };