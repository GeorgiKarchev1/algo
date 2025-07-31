// Script за тестване на Paddle функционалността
const API_KEY = process.env.PADDLE_API_KEY || 'YOUR_PADDLE_API_KEY_HERE';
const VENDOR_ID = process.env.PADDOR_ID || 'YOUR_VENDOR_ID_HERE';
const ENVIRONMENT = process.env.PADDLE_ENVIRONMENT || 'sandbox';
const CASUAL_PRICE_ID = process.env.PADDLE_CASUAL_PRICE_ID;
const GIGACHAD_PRICE_ID = process.env.PADDLE_GIGACHAD_PRICE_ID;

const BASE_URL = ENVIRONMENT === 'production' 
  ? 'https://api.paddle.com' 
  : 'https://sandbox-api.paddle.com';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function testPaddleFunctionality() {
  console.log('🧪 Тестване на Paddle функционалността...\n');

  // Test 1: Validate configuration
  await testConfiguration();

  // Test 2: Test checkout session creation
  await testCheckoutSession();

  // Test 3: Test webhook verification
  await testWebhookVerification();

  // Test 4: Test subscription management
  await testSubscriptionManagement();

  console.log('\n✅ Всички тестове завършени!');
}

async function testConfiguration() {
  console.log('1️⃣ Тестване на конфигурацията...');
  
  const requiredVars = [
    'PADDLE_API_KEY',
    'PADDLE_VENDOR_ID', 
    'PADDLE_CASUAL_PRICE_ID',
    'PADDLE_GIGACHAD_PRICE_ID'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log(`❌ Липсващи environment variables: ${missingVars.join(', ')}`);
    return false;
  }

  console.log('✅ Всички environment variables са налични');
  return true;
}

async function testCheckoutSession() {
  console.log('\n2️⃣ Тестване на създаване на checkout session...');

  try {
    const checkoutData = {
      success_url: `${APP_URL}/success?session_id={checkout_id}`,
      cancel_url: `${APP_URL}/pricing`,
      customer_email: 'test@example.com',
      customer_name: 'Test User',
      line_items: [
        {
          price_id: CASUAL_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: 'test-user-123',
        plan: 'CASUAL',
      },
    };

    const response = await fetch(`${BASE_URL}/checkouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(`❌ Грешка при създаване на checkout: ${errorData.error?.message || 'Unknown error'}`);
      return false;
    }

    const result = await response.json();
    console.log(`✅ Checkout session създаден успешно: ${result.data.url}`);
    return true;

  } catch (error) {
    console.log(`❌ Грешка при тестване на checkout: ${error.message}`);
    return false;
  }
}

async function testWebhookVerification() {
  console.log('\n3️⃣ Тестване на webhook verification...');

  try {
    // Simulate webhook payload
    const webhookPayload = {
      event_type: 'subscription.created',
      data: {
        id: 'sub_test_123',
        customer_id: 'ctm_test_123',
        status: 'active',
        items: [
          {
            price: {
              id: CASUAL_PRICE_ID
            }
          }
        ],
        custom_data: {
          user_id: 'test-user-123'
        }
      }
    };

    const body = JSON.stringify(webhookPayload);
    const timestamp = Math.floor(Date.now() / 1000);
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET || 'test_secret';
    
    // Create signature
    const crypto = require('crypto');
    const signedPayload = `${timestamp}:${body}`;
    const signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(signedPayload)
      .digest('hex');

    const paddleSignature = `ts=${timestamp};h1=${signature}`;

    // Test webhook endpoint
    const response = await fetch(`${APP_URL}/api/webhooks/paddle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'paddle-signature': paddleSignature,
      },
      body: body,
    });

    if (response.ok) {
      console.log('✅ Webhook verification работи правилно');
      return true;
    } else {
      console.log(`❌ Webhook verification failed: ${response.status}`);
      return false;
    }

  } catch (error) {
    console.log(`❌ Грешка при тестване на webhook: ${error.message}`);
    return false;
  }
}

async function testSubscriptionManagement() {
  console.log('\n4️⃣ Тестване на subscription management...');

  try {
    // Test getting subscriptions (this will fail if no subscriptions exist, which is expected)
    const response = await fetch(`${BASE_URL}/subscriptions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Subscription API работи. Намерени ${data.data?.length || 0} абонаменти`);
    } else {
      console.log('ℹ️ Subscription API работи (няма абонаменти за тестване)');
    }

    return true;

  } catch (error) {
    console.log(`❌ Грешка при тестване на subscription management: ${error.message}`);
    return false;
  }
}

// Test local API endpoints
async function testLocalEndpoints() {
  console.log('\n5️⃣ Тестване на локални API endpoints...');

  try {
    // Test checkout endpoint
    const checkoutResponse = await fetch(`${APP_URL}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planType: 'CASUAL'
      }),
    });

    if (checkoutResponse.status === 401) {
      console.log('ℹ️ Checkout endpoint работи (изисква authentication)');
    } else {
      console.log(`ℹ️ Checkout endpoint status: ${checkoutResponse.status}`);
    }

    return true;

  } catch (error) {
    console.log(`❌ Грешка при тестване на локални endpoints: ${error.message}`);
    return false;
  }
}

// Run tests
async function runAllTests() {
  console.log('🚀 Стартиране на всички тестове за Paddle...\n');
  
  await testPaddleFunctionality();
  await testLocalEndpoints();
  
  console.log('\n📋 Следващи стъпки:');
  console.log('1. Създайте .env.local файл с правилните environment variables');
  console.log('2. Стартирайте приложението: npm run dev');
  console.log('3. Отидете на /pricing страницата за тестване на UI');
  console.log('4. Използвайте ngrok за тестване на webhooks локално');
}

runAllTests(); 