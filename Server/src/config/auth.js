const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('./database');
const { createWallet, encryptSecret } = require('../services/walletService');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await prisma.user.findUnique({
        where: { googleId: profile.id }
      });
      
      if (!user) {
        // Create new user with Stellar wallet
        const { publicKey, secret } = createWallet();
        const encryptedSecret = encryptSecret(secret);
        
        user = await prisma.user.create({
          data: {
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            stellarPublicKey: publicKey,
            stellarSecretEncrypted: encryptedSecret,
            trustScore: 50.0
          }
        });
        
        // Fund wallet on testnet
        const { fundWallet } = require('../services/stellarService');
        await fundWallet(publicKey);
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

module.exports = passport;