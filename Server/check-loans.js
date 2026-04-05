const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLoans() {
  try {
    const loans = await prisma.loan.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('=== ALL LOANS IN DATABASE ===');
    console.log(`Total loans found: ${loans.length}`);
    
    loans.forEach((loan, index) => {
      console.log(`\n${index + 1}. Loan ID: ${loan.id}`);
      console.log(`   User: ${loan.user.name} (${loan.user.email})`);
      console.log(`   Amount: KES ${loan.amount}`);
      console.log(`   Status: ${loan.status}`);
      console.log(`   Purpose: ${loan.purpose}`);
      console.log(`   Applied Date: ${loan.appliedDate}`);
      console.log(`   Created: ${loan.createdAt}`);
    });

    // Check specifically for 12000 amount
    const loan12000 = loans.find(loan => loan.amount === 12000);
    if (loan12000) {
      console.log('\n=== FOUND 12,000 LOAN ===');
      console.log(`Loan ID: ${loan12000.id}`);
      console.log(`User: ${loan12000.user.name}`);
      console.log(`Status: ${loan12000.status}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLoans();
