// Test the new admin services import
import { adminServices } from './src/services/adminServices.js';

console.log('✅ adminServices imported successfully!');
console.log('Available methods:', Object.keys(adminServices));
console.log('getAllLoans type:', typeof adminServices.getAllLoans);
