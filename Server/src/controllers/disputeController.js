const prisma = require('../config/database');

const createDispute = async (req, res) => {
  const userId = req.user.id;
  const { title, description, evidenceUrl } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description required' });
  }
  
  const dispute = await prisma.dispute.create({
    data: {
      userId,
      title,
      description,
      evidenceUrl,
      status: 'open'
    }
  });
  
  res.status(201).json(dispute);
};

const getUserDisputes = async (req, res) => {
  const userId = req.user.id;
  const disputes = await prisma.dispute.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(disputes);
};

const resolveDispute = async (req, res) => {
  const { disputeId } = req.params;
  const { resolution, status } = req.body; // status: resolved, rejected
  
  const dispute = await prisma.dispute.findUnique({ where: { id: parseInt(disputeId) } });
  if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
  
  const updated = await prisma.dispute.update({
    where: { id: parseInt(disputeId) },
    data: {
      status: status || 'resolved',
      resolution,
      resolvedBy: req.user.id
    }
  });
  
  res.json(updated);
};

module.exports = { createDispute, getUserDisputes, resolveDispute };