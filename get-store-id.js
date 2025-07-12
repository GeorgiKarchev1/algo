// Script за намиране на Store ID
// REPLACE WITH YOUR API KEY FROM .env.local
const API_KEY = process.env.LEMONSQUEEZY_API_KEY || 'YOUR_API_KEY_HERE';

async function getStores() {
  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/stores', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/vnd.api+json',
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Stores found:');
      data.data.forEach(store => {
        console.log(`Store ID: ${store.id}`);
        console.log(`Store Name: ${store.attributes.name}`);
        console.log(`Store Slug: ${store.attributes.slug}`);
        console.log(`Store URL: ${store.attributes.url}`);
        console.log('---');
      });
    } else {
      console.error('❌ Error fetching stores:', data);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

getStores(); 