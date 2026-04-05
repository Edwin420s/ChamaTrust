const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Test database connection
const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('🔄 Closing database connection...');
  await prisma.$disconnect();
  console.log('✅ Database connection closed');
};

// Handle process termination
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = prisma;
module.exports.testConnection = testConnection;
module.exports.gracefulShutdown = gracefulShutdown;
