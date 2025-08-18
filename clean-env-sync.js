// Clean and sync environment variables to Vercel
require('dotenv').config({ path: '.env.local' });

const paddleVars = [
  'PADDLE_API_KEY',
  'PADDLE_WEBHOOK_SECRET', 
  'PADDLE_VENDOR_ID',
  'PADDLE_ENVIRONMENT',
  'PADDLE_CASUAL_PRICE_ID',
  'PADDLE_GIGACHAD_PRICE_ID',
  'NEXT_PUBLIC_APP_URL'
];

console.log('🧹 Cleaning environment variables...\n');

// Clean the variables (remove newlines and whitespace)
const cleanedVars = {};
paddleVars.forEach(varName => {
  const originalValue = process.env[varName];
  if (originalValue) {
    const cleanedValue = originalValue.replace(/\n/g, '').trim();
    cleanedVars[varName] = cleanedValue;
    
    console.log(`📋 ${varName}:`);
    console.log(`   Original length: ${originalValue.length}`);
    console.log(`   Cleaned length: ${cleanedValue.length}`);
    console.log(`   Had newlines: ${originalValue !== cleanedValue ? 'YES' : 'NO'}`);
    
    if (varName.includes('PRICE_ID')) {
      console.log(`   Pattern match: ${/^pri_[a-z\d]{26}$/.test(cleanedValue) ? 'VALID' : 'INVALID'}`);
    }
    console.log('');
  }
});

// Display the cleaned variables
console.log('✅ Cleaned variables ready for Vercel:');
paddleVars.forEach(varName => {
  if (cleanedVars[varName]) {
    console.log(`${varName}=${cleanedVars[varName]}`);
  }
});

console.log('\n🚀 To sync these to Vercel, run: node sync-env-to-vercel.js');
console.log('💡 Make sure to update your .env.local with the cleaned values first!');
