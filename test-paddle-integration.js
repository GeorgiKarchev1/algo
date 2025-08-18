async function testPaddleIntegration() {
  console.log('🧪 Testing Paddle Integration...\n');

  // Test 1: Check environment variables
  console.log('1. Checking environment variables...');
  const requiredEnvVars = [
    'PADDLE_API_KEY',
    'PADDLE_WEBHOOK_SECRET', 
    'PADDLE_VENDOR_ID',
    'PADDLE_CASUAL_PRICE_ID',
    'PADDLE_GIGACHAD_PRICE_ID',
    'PADDLE_ENVIRONMENT'
  ];

  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingVars.length > 0) {
    console.log('❌ Missing environment variables:', missingVars);
    return;
  } else {
    console.log('✅ All required environment variables are set');
  }

  // Test 2: Test Paddle API connection
  console.log('\n2. Testing Paddle API connection...');
  try {
    const baseUrl = process.env.PADDLE_ENVIRONMENT === 'production' 
      ? 'https://api.paddle.com' 
      : 'https://sandbox-api.paddle.com';

    const response = await fetch(`${baseUrl}/transactions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('✅ Paddle API connection successful');
    } else {
      console.log('❌ Paddle API connection failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Paddle API connection error:', error.message);
  }

  // Test 3: Test checkout endpoint
  console.log('\n3. Testing checkout endpoint...');
  try {
    const response = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planType: 'CASUAL'
      }),
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Checkout endpoint working');
      console.log('   Checkout URL:', data.checkoutUrl);
    } else {
      console.log('❌ Checkout endpoint failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Checkout endpoint error:', error.message);
  }

  // Test 4: Validate price IDs
  console.log('\n4. Validating price IDs...');
  const casualPriceId = process.env.PADDLE_CASUAL_PRICE_ID;
  const gigachadPriceId = process.env.PADDLE_GIGACHAD_PRICE_ID;

  if (casualPriceId && casualPriceId !== 'pri_01xxxxx') {
    console.log('✅ CASUAL price ID is configured');
  } else {
    console.log('❌ CASUAL price ID is not properly configured');
  }

  if (gigachadPriceId && gigachadPriceId !== 'pri_01xxxxx') {
    console.log('✅ GIGACHAD price ID is configured');
  } else {
    console.log('❌ GIGACHAD price ID is not properly configured');
  }

  console.log('\n🎯 Paddle Integration Test Complete!');
}

// Run the test
testPaddleIntegration().catch(console.error);
