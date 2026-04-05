const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Get all users (simplified version without middleware for now)
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        trustScore: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            loans: true,
            transactions: true,
            disputes: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      trustScore: user.trustScore,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      totalLoans: user._count.loans,
      totalTransactions: user._count.transactions,
      totalDisputes: user._count.disputes
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get system statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalLoans,
      pendingLoans,
      activeLoans,
      totalTransactions,
      totalContributions,
      totalDisbursed,
      openDisputes,
      resolvedDisputes
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.loan.count(),
      prisma.loan.count({ where: { status: 'pending' } }),
      prisma.loan.count({ where: { status: 'active' } }),
      prisma.transaction.count(),
      prisma.transaction.count({ where: { type: 'contribution' } }),
      prisma.transaction.count({ where: { type: 'loan_disbursement' } }),
      prisma.dispute.count({ where: { status: 'open' } }),
      prisma.dispute.count({ where: { status: 'resolved' } })
    ]);

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers
      },
      loans: {
        total: totalLoans,
        pending: pendingLoans,
        active: activeLoans
      },
      transactions: {
        total: totalTransactions,
        contributions: totalContributions,
        disbursements: totalDisbursed
      },
      disputes: {
        open: openDisputes,
        resolved: resolvedDisputes,
        total: openDisputes + resolvedDisputes
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({ error: 'Failed to fetch system stats' });
  }
});

module.exports = router;
