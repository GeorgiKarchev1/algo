// Script за проверка на съществуващи webhooks
// REPLACE WITH YOUR API KEY FROM .env.local
const API_KEY = process.env.LEMONSQUEEZY_API_KEY || 'YOUR_API_KEY_HERE';

async function checkWebhooks() {
  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/webhooks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/vnd.api+json',
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      if (data.data.length === 0) {
        console.log('❌ Няма създадени webhooks');
      } else {
        console.log('✅ Намерени webhooks:');
        console.log('==================');
        data.data.forEach((webhook, index) => {
          console.log(`Webhook #${index + 1}:`);
          console.log(`  ID: ${webhook.id}`);
          console.log(`  URL: ${webhook.attributes.url}`);
          console.log(`  Store ID: ${webhook.attributes.store_id}`);
          console.log(`  Events: ${webhook.attributes.events.join(', ')}`);
          console.log(`  Test Mode: ${webhook.attributes.test_mode}`);
          console.log(`  Created: ${webhook.attributes.created_at}`);
          console.log(`  Last Sent: ${webhook.attributes.last_sent_at || 'Never'}`);
          console.log('---');
        });
      }
    } else {
      console.error('❌ Error fetching webhooks:', data);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

checkWebhooks(); 