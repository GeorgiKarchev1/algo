// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

async function checkProductionPaddle() {
  console.log('🔍 Checking Production Paddle Configuration...\n');

  // Check if we're in production mode
  const environment = process.env.PADDLE_ENVIRONMENT;
  if (environment !== 'production') {
    console.log('❌ Not in production mode. Set PADDLE_ENVIRONMENT=production');
    return;
  }

  console.log('✅ Environment: Production');

  // Check API key format
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey || !apiKey.startsWith('pdl_live')) {
    console.log('❌ API Key should start with pdl_live for production');
    return;
  }
  console.log('✅ API Key format: Valid (pdl_live)');

  // Check price IDs
  const casualPriceId = process.env.PADDLE_CASUAL_PRICE_ID;
  const gigachadPriceId = process.env.PADDLE_GIGACHAD_PRICE_ID;

  if (!casualPriceId || !casualPriceId.startsWith('pri_')) {
    console.log('❌ CASUAL Price ID should start with pri_');
    return;
  }
  if (!gigachadPriceId || !gigachadPriceId.startsWith('pri_')) {
    console.log('❌ GIGACHAD Price ID should start with pri_');
    return;
  }
  console.log('✅ Price IDs format: Valid');

  // Test API access
  console.log('\n🔧 Testing Production API Access...');
  
  try {
    const baseUrl = 'https://api.paddle.com';
    
    // Test 1: Basic API access
    console.log('1. Testing basic API access...');
    const response = await fetch(`${baseUrl}/transactions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`   Status: ${response.status}`);
    
    if (response.status === 403) {
      console.log('   ❌ 403 Forbidden - This usually means:');
      console.log('      - Test Mode is not enabled in Paddle dashboard');
      console.log('      - API key lacks transaction permissions');
      console.log('      - Account is not verified');
      console.log('      - Account has restrictions');
    } else if (response.ok) {
      console.log('   ✅ API access successful');
    } else {
      const errorData = await response.json();
      console.log('   ❌ API access failed:', errorData.error?.detail || 'Unknown error');
    }

    // Test 2: Check account status
    console.log('\n2. Checking account status...');
    const accountResponse = await fetch(`${baseUrl}/account`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (accountResponse.ok) {
      const accountData = await accountResponse.json();
      console.log('   ✅ Account accessible');
      console.log(`   📊 Account ID: ${accountData.data?.id || 'N/A'}`);
      console.log(`   📊 Account Status: ${accountData.data?.status || 'N/A'}`);
    } else {
      console.log('   ❌ Cannot access account info');
    }

    // Test 3: Check price IDs
    console.log('\n3. Checking price IDs...');
    
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
          console.log(`   ✅ ${planName}: Accessible`);
          console.log(`      Description: ${priceData.data?.description || 'N/A'}`);
          console.log(`      Status: ${priceData.data?.status || 'N/A'}`);
        } else {
          const errorData = await priceResponse.json();
          console.log(`   ❌ ${planName}: ${errorData.error?.detail || 'Not accessible'}`);
        }
      } catch (error) {
        console.log(`   ❌ ${planName}: ${error.message}`);
      }
    }

  } catch (error) {
    console.log('❌ API test failed:', error.message);
  }

  // Production-specific recommendations
  console.log('\n📋 Production Checklist:');
  console.log('1. ✅ PADDLE_ENVIRONMENT=production');
  console.log('2. ✅ API Key starts with pdl_live');
  console.log('3. ✅ Price IDs are production IDs');
  console.log('4. ⚠️  Test Mode enabled in Paddle dashboard');
  console.log('5. ⚠️  Account is verified and active');
  console.log('6. ⚠️  API key has transaction permissions');
  console.log('7. ⚠️  No account restrictions');

  console.log('\n🔧 Next Steps:');
  console.log('1. Go to Paddle Dashboard → Settings → Test Mode');
  console.log('2. Enable Test Mode');
  console.log('3. Try checkout again');
  console.log('4. Use test cards: 4000 0000 0000 0002 (success)');

  console.log('\n🎯 Production Check Complete!');
}

// Run the check
if (require.main === module) {
  checkProductionPaddle().catch(console.error);
}

module.exports = { checkProductionPaddle };
