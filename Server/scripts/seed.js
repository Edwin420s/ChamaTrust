const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    // Create a demo user (without wallet – will be created on login)
    const user = await prisma.user.upsert({
      where: { email: 'demo@chamatrust.com' },
      update: {},
      create: {
        email: 'demo@chamatrust.com',
        name: 'Demo User',
        trustScore: 65.0,
      },
    });

    // Seed sample transactions
    await prisma.transaction.createMany({
      data: [
        { userId: user.id, amount: 500, type: 'contribution', status: 'completed', description: 'January contribution' },
        { userId: user.id, amount: 1000, type: 'contribution', status: 'completed', description: 'February contribution' },
        { userId: user.id, amount: 200, type: 'penalty', status: 'completed', description: 'Late payment penalty' },
      ],
    });

    console.log('✅ Seed data inserted');
  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();