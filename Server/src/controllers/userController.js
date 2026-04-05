const prisma = require('../config/database');
const { getTrustScore } = require('../services/trustService');

const getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, name: true, trustScore: true, stellarPublicKey: true, createdAt: true }
  });
  res.json(user);
};

const getTrustScoreController = async (req, res) => {
  const score = await getTrustScore(req.user.id);
  res.json({ trustScore: score });
};

module.exports = { getProfile, getTrustScoreController };