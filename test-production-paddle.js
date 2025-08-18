const fetch = require('node-fetch');

// Configuration
const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://yourdomain.com';
const TEST_PLANS = ['CASUAL', 'GIGACHAD'];

async function testProductionPaddle() {
  console.log('🚀 Testing Production Paddle Integration...\n');
  console.log(`📍 Production URL: ${PRODUCTION_URL}\n`);

  // Test 1: Check if production URL is accessible
  console.log('1. Testing production URL accessibility...');
  try {
    const response = await fetch(PRODUCTION_URL);
    if (response.ok) {
      console.log('✅ Production URL is accessible');
    } else {
      console.log('❌ Production URL returned status:', response.status);
    }
  } catch (error) {
    console.log('❌ Cannot access production URL:', error.message);
    return;
  }

  // Test 2: Test checkout endpoints
  console.log('\n2. Testing checkout endpoints...');
  for (const plan of TEST_PLANS) {
    try {
      console.log(`   Testing ${plan} plan...`);
      const response = await fetch(`${PRODUCTION_URL}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType: plan }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log(`   ✅ ${plan} checkout working`);
        console.log(`   🔗 Checkout URL: ${data.checkoutUrl}`);
      } else {
        console.log(`   ❌ ${plan} checkout failed:`, data.error);
      }
    } catch (error) {
      console.log(`   ❌ ${plan} checkout error:`, error.message);
    }
  }

  // Test 3: Test webhook endpoint
  console.log('\n3. Testing webhook endpoint...');
  try {
    const response = await fetch(`${PRODUCTION_URL}/api/webhooks/paddle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'paddle-signature': 'ts=1234567890;h1=test',
      },
      body: JSON.stringify({ test: 'data' }),
    });

    if (response.status === 401) {
      console.log('✅ Webhook endpoint is protected (returns 401 for invalid signature)');
    } else {
      console.log('⚠️  Webhook endpoint returned:', response.status);
    }
  } catch (error) {
    console.log('❌ Webhook endpoint error:', error.message);
  }

  // Test 4: Test pricing page
  console.log('\n4. Testing pricing page...');
  try {
    const response = await fetch(`${PRODUCTION_URL}/pricing`);
    if (response.ok) {
      console.log('✅ Pricing page is accessible');
    } else {
      console.log('❌ Pricing page returned status:', response.status);
    }
  } catch (error) {
    console.log('❌ Pricing page error:', error.message);
  }

  // Test 5: Test success page
  console.log('\n5. Testing success page...');
  try {
    const response = await fetch(`${PRODUCTION_URL}/success`);
    if (response.ok) {
      console.log('✅ Success page is accessible');
    } else {
      console.log('❌ Success page returned status:', response.status);
    }
  } catch (error) {
    console.log('❌ Success page error:', error.message);
  }

  console.log('\n🎯 Production Test Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Go to your production pricing page');
  console.log('2. Test with Paddle test cards:');
  console.log('   - Success: 4000 0000 0000 0002');
  console.log('   - Decline: 4000 0000 0000 0001');
  console.log('3. Check Paddle dashboard for transactions');
  console.log('4. Verify webhook deliveries');
  console.log('5. Check database for new records');
}

// Run the test
if (require.main === module) {
  testProductionPaddle().catch(console.error);
}

module.exports = { testProductionPaddle };
