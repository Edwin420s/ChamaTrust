require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 5000; // Use original port 5000

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

// Admin loans endpoint
app.get('/api/admin/loans', async (req, res) => {
  try {
    console.log('🏦 Fetching admin loans...');
    
    const loans = await prisma.loan.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            trustScore: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`✅ Found ${loans.length} loans`);
    res.json(loans);
  } catch (error) {
    console.error('❌ Error fetching loans:', error);
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
});

// Admin disputes endpoint
app.get('/api/admin/disputes', async (req, res) => {
  try {
    console.log('🏛️ Fetching admin disputes...');
    
    const disputes = await prisma.dispute.findMany({
      include: {
        complainant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        respondent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`✅ Found ${disputes.length} disputes`);
    res.json(disputes);
  } catch (error) {
    console.error('❌ Error fetching disputes:', error);
    res.status(500).json({ error: 'Failed to fetch disputes' });
  }
});

// Admin dispute status update endpoint
app.put('/api/admin/disputes/:id/status', async (req, res) => {
  try {
    const disputeId = req.params.id;
    const { action, resolution } = req.body;
    
    console.log(`🏛️ Updating dispute ${disputeId} with action: ${action}`);
    
    const dispute = await prisma.dispute.findUnique({
      where: { id: parseInt(disputeId) }
    });

    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }

    let newStatus = dispute.status;
    if (action === 'investigate') {
      newStatus = 'investigating';
    } else if (action === 'resolve') {
      newStatus = 'resolved';
    }

    const updatedDispute = await prisma.dispute.update({
      where: { id: parseInt(disputeId) },
      data: { 
        status: newStatus,
        ...(resolution && { resolution })
      }
    });

    console.log(`✅ Dispute ${disputeId} updated successfully!`);
    res.json({ 
      message: `Dispute ${disputeId} ${action}d successfully`, 
      dispute: updatedDispute
    });

  } catch (error) {
    console.error('❌ Error updating dispute:', error);
    res.status(500).json({ error: 'Failed to update dispute' });
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

// Auth endpoints (mock for testing)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Mock admin login
    if (email === 'admin@chamatrust.com' && password === 'Admin123!@#') {
      const adminUser = {
        id: 1,
        name: 'Admin User',
        email: 'admin@chamatrust.com',
        role: 'admin',
        isActive: true,
        trustScore: 100
      };
      
      res.json({
        user: adminUser,
        token: 'mock_admin_token_' + Date.now()
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/users/profile', async (req, res) => {
  try {
    // Mock admin profile
    const adminUser = {
      id: 1,
      name: 'Admin User',
      email: 'admin@chamatrust.com',
      role: 'admin',
      isActive: true,
      trustScore: 100
    };
    
    res.json(adminUser);
  } catch (error) {
    console.error('❌ Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Working server running on http://localhost:${PORT}`);
  console.log('📊 Available endpoints:');
  console.log('  - GET /api/health');
  console.log('  - GET /api/admin/stats');
  console.log('  - GET /api/admin/users');
  console.log('  - GET /api/admin/loans');
  console.log('  - GET /api/admin/disputes');
  console.log('  - PUT /api/admin/disputes/:id/status');
  console.log('  - POST /api/loans/:id/approve');
  console.log('  - POST /api/auth/login');
  console.log('  - GET /api/users/profile');
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});
