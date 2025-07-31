// Script за тестване на webhook функционалността
const crypto = require('crypto');

// Configuration
const WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET || 'test_secret';
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000/api/webhooks/paddle';

// Test webhook payloads
const testPayloads = [
  {
    name: 'Subscription Created',
    payload: {
      event_type: 'subscription.created',
      data: {
        id: 'sub_test_123',
        customer_id: 'ctm_test_123',
        status: 'active',
        items: [
          {
            price: {
              id: 'pri_test_123'
            }
          }
        ],
        custom_data: {
          user_id: 'test-user-123'
        },
        current_billing_period: {
          starts_at: new Date().toISOString(),
          ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    }
  },
  {
    name: 'Transaction Completed',
    payload: {
      event_type: 'transaction.completed',
      data: {
        id: 'txn_test_123',
        status: 'completed',
        currency_code: 'USD',
        details: {
          totals: {
            total: 900
          }
        },
        custom_data: {
          user_id: 'test-user-123'
        },
        subscription_id: 'sub_test_123'
      }
    }
  },
  {
    name: 'Subscription Cancelled',
    payload: {
      event_type: 'subscription.cancelled',
      data: {
        id: 'sub_test_123',
        customer_id: 'ctm_test_123',
        status: 'cancelled',
        items: [
          {
            price: {
              id: 'pri_test_123'
            }
          }
        ],
        custom_data: {
          user_id: 'test-user-123'
        },
        cancelled_at: new Date().toISOString()
      }
    }
  }
];

async function testWebhook(payload, name) {
  console.log(`\n🧪 Тестване на ${name}...`);
  
  try {
    const body = JSON.stringify(payload);
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Create signature
    const signedPayload = `${timestamp}:${body}`;
    const signature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(signedPayload)
      .digest('hex');

    const paddleSignature = `ts=${timestamp};h1=${signature}`;

    // Send webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'paddle-signature': paddleSignature,
      },
      body: body,
    });

    if (response.ok) {
      console.log(`✅ ${name} - Успешно (${response.status})`);
      return true;
    } else {
      const errorText = await response.text();
      console.log(`❌ ${name} - Грешка (${response.status}): ${errorText}`);
      return false;
    }

  } catch (error) {
    console.log(`❌ ${name} - Exception: ${error.message}`);
    return false;
  }
}

async function runWebhookTests() {
  console.log('🚀 Стартиране на webhook тестове...\n');
  console.log(`📍 Webhook URL: ${WEBHOOK_URL}`);
  console.log(`🔑 Webhook Secret: ${WEBHOOK_SECRET.substring(0, 10)}...`);
  
  let successCount = 0;
  let totalCount = testPayloads.length;

  for (const test of testPayloads) {
    const success = await testWebhook(test.payload, test.name);
    if (success) successCount++;
  }

  console.log(`\n📊 Резултати: ${successCount}/${totalCount} успешни тестове`);
  
  if (successCount === totalCount) {
    console.log('🎉 Всички webhook тестове минаха успешно!');
  } else {
    console.log('⚠️ Някои тестове не минаха. Проверете логовете за повече информация.');
  }
}

// Run tests
runWebhookTests(); 