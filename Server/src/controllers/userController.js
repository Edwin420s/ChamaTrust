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
  const scoreData = await getTrustScore(req.user.id);
  res.json(scoreData);
};

const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name },
      select: { id: true, email: true, name: true, trustScore: true, stellarPublicKey: true, createdAt: true }
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Profile update failed' });
  }
};

module.exports = { getProfile, getTrustScoreController, updateProfile };