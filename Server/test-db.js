require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function testDB() {
  const prisma = new PrismaClient();
  try {
    console.log('🔍 Testing database connection...');
    
    const userCount = await prisma.user.count();
    console.log(`✅ Database connected! Found ${userCount} users`);
    
    const loanCount = await prisma.loan.count();
    console.log(`✅ Found ${loanCount} loans`);
    
    const pendingLoans = await prisma.loan.count({ where: { status: 'pending' } });
    console.log(`✅ Found ${pendingLoans} pending loans`);
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDB();
