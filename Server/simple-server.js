require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Admin stats endpoint
app.get('/api/admin/stats', async (req, res) => {
  try {
    console.log('📊 Fetching admin stats...');
    
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

    console.log('✅ Admin stats fetched successfully:', stats);
    res.json(stats);
  } catch (error) {
    console.error('❌ Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch system stats' });
  }
});

// Admin users endpoint
app.get('/api/admin/users', async (req, res) => {
  try {
    console.log('👥 Fetching admin users...');
    
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

    console.log(`✅ Found ${formattedUsers.length} users`);
    res.json(formattedUsers);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Mock loan approval endpoint (without Stellar for now)
app.post('/api/loans/:id/approve', async (req, res) => {
  try {
    const loanId = req.params.id;
    console.log(`🔍 Approving loan ${loanId}...`);
    
    // Get loan details
    const loan = await prisma.loan.findUnique({
      where: { id: parseInt(loanId) },
      include: { user: true }
    });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (loan.status !== 'pending') {
      return res.status(400).json({ error: 'Loan is not pending' });
    }

    // Update loan status to active (without Stellar funding for now)
    const updatedLoan = await prisma.loan.update({
      where: { id: parseInt(loanId) },
      data: { 
        status: 'active',
        stellarTxHash: 'mock_transaction_hash_' + Date.now()
      }
    });

    // Create a loan disbursement transaction
    await prisma.transaction.create({
      data: {
        userId: loan.userId,
        amount: loan.amount,
        type: 'loan_disbursement',
        status: 'completed',
        description: `Loan disbursement #${loan.id}`,
        stellarTxHash: 'mock_transaction_hash_' + Date.now()
      }
    });

    console.log(`✅ Loan ${loanId} approved successfully!`);
    res.json({ 
      message: 'Loan approved successfully (mock funding)', 
      loan: updatedLoan,
      note: 'Stellar funding disabled for testing'
    });

  } catch (error) {
    console.error('❌ Error approving loan:', error);
    res.status(500).json({ error: 'Failed to approve loan' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple server running on http://localhost:${PORT}`);
  console.log('📊 Admin endpoints available:');
  console.log('  - GET /api/admin/stats');
  console.log('  - GET /api/admin/users');
  console.log('  - POST /api/loans/:id/approve');
});
