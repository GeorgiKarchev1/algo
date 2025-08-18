// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });
const path = require('path');

async function checkProductionEnv() {
  console.log('🔍 Checking Production Environment Variables...\n');

  // Check all Paddle variables
  const paddleVars = [
    'PADDLE_API_KEY',
    'PADDLE_WEBHOOK_SECRET',
    'PADDLE_VENDOR_ID',
    'PADDLE_ENVIRONMENT',
    'PADDLE_CASUAL_PRICE_ID',
    'PADDLE_GIGACHAD_PRICE_ID',
    'NEXT_PUBLIC_APP_URL'
  ];

  console.log('📊 Environment Variables Status:');
  
  paddleVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      const displayValue = varName.includes('KEY') || varName.includes('SECRET') 
        ? `${value.substring(0, 20)}...${value.substring(value.length - 4)}`
        : value;
      console.log(`   ✅ ${varName}: ${displayValue}`);
    } else {
      console.log(`   ❌ ${varName}: MISSING`);
    }
  });

  // Test Paddle configuration
  console.log('\n🔧 Testing Paddle Configuration...');
  
  try {
    const configPath = path.join(__dirname, 'src', 'lib', 'paddle', 'config.ts');
    console.log('   📁 Config path:', configPath);
    
    // For now, just check if the file exists
    const fs = require('fs');
    if (fs.existsSync(configPath)) {
      console.log('   ✅ Config file exists');
    } else {
      console.log('   ❌ Config file not found');
    }
  } catch (error) {
    console.log('❌ Paddle configuration error:', error.message);
  }

  // Test API access
  console.log('\n🔧 Testing Paddle API Access...');
  
  const apiKey = process.env.PADDLE_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch('https://api.paddle.com/transactions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`   📊 API Response Status: ${response.status}`);
      
      if (response.ok) {
        console.log('   ✅ API access successful');
      } else {
        const errorData = await response.json();
        console.log('   ❌ API access failed:', errorData);
      }
    } catch (error) {
      console.log('   ❌ API test failed:', error.message);
    }
  } else {
    console.log('   ❌ No API key available for testing');
  }

  console.log('\n🎯 Environment Check Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Deploy to production: vercel --prod');
  console.log('2. Check Vercel logs for detailed error messages');
  console.log('3. Test checkout endpoint in browser');
}

// Run the check
if (require.main === module) {
  checkProductionEnv().catch(console.error);
}

module.exports = { checkProductionEnv };
