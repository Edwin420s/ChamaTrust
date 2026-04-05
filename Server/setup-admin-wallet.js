require('dotenv').config();
const { fundWallet, checkAdminWallet } = require('./src/services/stellarService');

async function setupAdminWallet() {
  try {
    console.log('🔧 Setting up admin Stellar wallet...');
    console.log(`Admin Public Key: ${process.env.ADMIN_STELLAR_PUBLIC}`);
    console.log(`Stellar Horizon URL: ${process.env.STELLAR_HORIZON_URL}`);
    
    // Check admin wallet balance
    const balance = await checkAdminWallet();
    
    if (balance === 0) {
      console.log('⚠️ Admin wallet has no balance. Attempting to fund...');
      await fundWallet(process.env.ADMIN_STELLAR_PUBLIC);
      console.log('✅ Admin wallet funded successfully!');
    } else {
      console.log(`✅ Admin wallet already has balance: ${balance} XLM`);
    }
    
    console.log('\n🎉 Admin wallet setup complete!');
    console.log('You can now approve loans and they will be funded properly.');
    
  } catch (error) {
    console.error('❌ Error setting up admin wallet:', error);
  }
}

setupAdminWallet();
