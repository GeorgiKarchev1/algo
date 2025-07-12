// Script за създаване на LemonSqueezy webhook
// Използвай това ако Dashboard не работи

const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY || 'YOUR_API_KEY_HERE';
const STORE_ID = process.env.LEMONSQUEEZY_STORE_ID || 'YOUR_STORE_ID_HERE';

async function createWebhook() {
  const webhookData = {
    data: {
      type: 'webhooks',
      attributes: {
        url: 'https://algo-fmmd.vercel.app/api/webhooks/lemonsqueezy',
        events: [
          'order_created',
          'order_refunded',
          'subscription_created',
          'subscription_updated',
          'subscription_cancelled',
          'subscription_resumed',
          'subscription_expired',
          'subscription_paused',
          'subscription_unpaused'
        ]
      },
      relationships: {
        store: {
          data: {
            type: 'stores',
            id: STORE_ID
          }
        }
      }
    }
  };

  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/webhooks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LEMONSQUEEZY_API_KEY}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      },
      body: JSON.stringify(webhookData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Webhook created successfully!');
      console.log('Webhook ID:', result.data.id);
      console.log('Webhook URL:', result.data.attributes.url);
      console.log('Events:', result.data.attributes.events);
    } else {
      console.error('❌ Error creating webhook:', result);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Изпълни функцията
createWebhook(); 