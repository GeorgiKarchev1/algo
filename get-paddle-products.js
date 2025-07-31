// Script за извличане на продукти и price IDs от Paddle
// REPLACE WITH YOUR API KEY FROM .env.local
const API_KEY = process.env.PADDLE_API_KEY || 'YOUR_PADDLE_API_KEY_HERE';
const VENDOR_ID = process.env.PADDLE_VENDOR_ID || 'YOUR_VENDOR_ID_HERE';
const ENVIRONMENT = process.env.PADDLE_ENVIRONMENT || 'sandbox';

const BASE_URL = ENVIRONMENT === 'production' 
  ? 'https://api.paddle.com' 
  : 'https://sandbox-api.paddle.com';

async function getPaddleProducts() {
  try {
    console.log('🚣 Извличане на продукти от Paddle...\n');
    
    // Get all products
    const response = await fetch(`${BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Грешка при извличане на продукти:', data);
      return;
    }

    const products = data.data;
    console.log(`📦 Намерени ${products.length} продукта:\n`);

    // Process each product
    for (const product of products) {
      const productId = product.id;
      const productName = product.name;
      const productDescription = product.description;

      console.log(`🔸 Продукт: ${productName}`);
      console.log(`   Product ID: ${productId}`);
      console.log(`   Description: ${productDescription}`);
      console.log(`   Status: ${product.status}`);

      // Get prices for this product
      const pricesResponse = await fetch(`${BASE_URL}/prices?product_id=${productId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        }
      });

      const pricesData = await pricesResponse.json();

      if (pricesResponse.ok && pricesData.data) {
        const prices = pricesData.data;
        console.log(`   Цени (${prices.length}):`);
        
        prices.forEach(price => {
          console.log(`     - Price ID: ${price.id}`);
          console.log(`       Unit Price: ${price.unit_price.amount} ${price.unit_price.currency_code}`);
          console.log(`       Billing Cycle: ${price.billing_cycle?.interval || 'one-time'}`);
          console.log(`       Status: ${price.status}`);
        });

        // Generate env var suggestions
        const envVarPrefix = getEnvVarPrefix(productName);
        if (envVarPrefix && prices.length > 0) {
          console.log(`   🔧 Environment Variables:`);
          console.log(`       ${envVarPrefix}_PRODUCT_ID=${productId}`);
          console.log(`       ${envVarPrefix}_PRICE_ID=${prices[0].id}`);
        }
      } else {
        console.log(`   ❌ Не успях да извлека цени: ${pricesData.errors?.[0]?.detail || 'Unknown error'}`);
      }

      console.log('');
    }

    // Generate complete .env snippet
    console.log('\n📋 Копирай това в .env.local файла:');
    console.log('# Paddle Product IDs');
    
    for (const product of products) {
      const envVarPrefix = getEnvVarPrefix(product.name);
      if (envVarPrefix) {
        const pricesResponse = await fetch(`${BASE_URL}/prices?product_id=${product.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          }
        });

        const pricesData = await pricesResponse.json();
        
        if (pricesResponse.ok && pricesData.data && pricesData.data.length > 0) {
          console.log(`${envVarPrefix}_PRODUCT_ID=${product.id}`);
          console.log(`${envVarPrefix}_PRICE_ID=${pricesData.data[0].id}`);
        }
      }
    }

    console.log('\n✅ Готово! Копирай ID-тата в твоя .env.local файл.');

  } catch (error) {
    console.error('❌ Грешка при извличане на продукти:', error.message);
  }
}

function getEnvVarPrefix(productName) {
  const name = productName.toLowerCase();
  
  if (name.includes('casual')) {
    return 'PADDLE_CASUAL';
  } else if (name.includes('gigachad') || name.includes('giga')) {
    return 'PADDLE_GIGACHAD';
  } else if (name.includes('sigma')) {
    return 'PADDLE_SIGMA';
  }
  
  return null;
}

// Run the script
getPaddleProducts(); 