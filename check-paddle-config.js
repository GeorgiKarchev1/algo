// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

async function checkPaddleConfig() {
  console.log('🔍 Checking Paddle Configuration (Production Only)...\n');

  // Check environment variables
  const requiredVars = [
    'PADDLE_API_KEY',
    'PADDLE_WEBHOOK_SECRET', 
    'PADDLE_VENDOR_ID',
    'PADDLE_CASUAL_PRICE_ID',
    'PADDLE_GIGACHAD_PRICE_ID',
  ];

  console.log('1. Environment Variables:');
  const missingVars = [];
  
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      missingVars.push(varName);
      console.log(`   ❌ ${varName}: MISSING`);
    } else {
      const displayValue = varName.includes('KEY') || varName.includes('SECRET') 
        ? `${value.substring(0, 10)}...${value.substring(value.length - 4)}`
        : value;
      console.log(`   ✅ ${varName}: ${displayValue}`);
    }
  }

  if (missingVars.length > 0) {
    console.log(`\n❌ Missing environment variables: ${missingVars.join(', ')}`);
    return;
  }

  // Check configuration consistency
  console.log('\n2. Configuration Consistency:');
  const apiKey = process.env.PADDLE_API_KEY;
  const casualPriceId = process.env.PADDLE_CASUAL_PRICE_ID;
  const gigachadPriceId = process.env.PADDLE_GIGACHAD_PRICE_ID;

  // Check API key format (should be production)
  if (apiKey.startsWith('pdl_live_')) {
    console.log('   ✅ API Key format: Valid (Production - pdl_live_)');
  } else if (apiKey.startsWith('pdl_')) {
    console.log('   ⚠️  API Key format: May be old format (should start with pdl_live_)');
  } else {
    console.log('   ❌ API Key format: Invalid (should start with pdl_live_)');
  }

  // Check price ID format
  if (casualPriceId.startsWith('pri_')) {
    console.log('   ✅ CASUAL Price ID format: Valid (starts with pri_)');
  } else {
    console.log('   ❌ CASUAL Price ID format: Invalid (should start with pri_)');
  }

  if (gigachadPriceId.startsWith('pri_')) {
    console.log('   ✅ GIGACHAD Price ID format: Valid (starts with pri_)');
  } else {
    console.log('   ❌ GIGACHAD Price ID format: Invalid (should start with pri_)');
  }

  // Test API access
  console.log('\n3. Testing Paddle API Access (Production):');
  const baseUrl = 'https://api.paddle.com';

  try {
    // Test basic API access
    const response = await fetch(`${baseUrl}/transactions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`   📡 API Base URL: ${baseUrl}`);
    console.log(`   📡 Response Status: ${response.status}`);

    if (response.ok) {
      console.log('   ✅ API access successful');
    } else if (response.status === 403) {
      console.log('   ❌ API access failed (403 Forbidden)');
      console.log('   💡 This usually means:');
      console.log('      - Test Mode is not enabled in Paddle dashboard');
      console.log('      - Account is not verified');
      console.log('      - API key lacks permissions');
    } else {
      const errorData = await response.json();
      console.log('   ❌ API access failed:', errorData.error?.detail || 'Unknown error');
    }

    // Test specific price ID access
    console.log('\n4. Testing Price ID Access:');
    
    for (const [planName, priceId] of [
      ['CASUAL', casualPriceId],
      ['GIGACHAD', gigachadPriceId]
    ]) {
      try {
        const priceResponse = await fetch(`${baseUrl}/prices/${priceId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (priceResponse.ok) {
          const priceData = await priceResponse.json();
          console.log(`   ✅ ${planName} Price ID accessible: ${priceData.data?.description || 'No description'}`);
        } else {
          const errorData = await priceResponse.json();
          console.log(`   ❌ ${planName} Price ID not accessible: ${errorData.error?.detail || 'Unknown error'}`);
        }
      } catch (error) {
        console.log(`   ❌ ${planName} Price ID test failed: ${error.message}`);
      }
    }

  } catch (error) {
    console.log('   ❌ API test failed:', error.message);
  }

  // Recommendations
  console.log('\n5. Recommendations:');
  console.log('   📝 You are using PRODUCTION environment');
  console.log('   ⚠️  Enable Test Mode in Paddle dashboard for safe testing');
  console.log('   💡 Use test cards: 4000 0000 0000 0002 (success)');
  console.log('   💡 All transactions will be test transactions when Test Mode is enabled');

  console.log('\n🎯 Configuration Check Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Go to Paddle Dashboard → Settings → Test Mode');
  console.log('2. Enable Test Mode');
  console.log('3. Test checkout with test cards');
  console.log('4. Monitor transactions in Paddle dashboard');
}

// Run the check
if (require.main === module) {
  checkPaddleConfig().catch(console.error);
}

module.exports = { checkPaddleConfig };
