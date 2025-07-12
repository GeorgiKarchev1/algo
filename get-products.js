// Script за извличане на продукти и варианти от LemonSqueezy
// REPLACE WITH YOUR API KEY FROM .env.local
const API_KEY = process.env.LEMONSQUEEZY_API_KEY || 'YOUR_API_KEY_HERE';
const STORE_ID = process.env.LEMONSQUEEZY_STORE_ID || 'YOUR_STORE_ID_HERE';

async function getProductsAndVariants() {
  try {
    console.log('🍋 Извличане на продукти и варианти от LemonSqueezy...\n');
    
    // Get all products
    const response = await fetch(`https://api.lemonsqueezy.com/v1/products?filter[store_id]=${STORE_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/vnd.api+json',
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
      const productName = product.attributes.name;
      const productPrice = product.attributes.price;

      console.log(`🔸 Продукт: ${productName}`);
      console.log(`   Product ID: ${productId}`);
      console.log(`   Цена: $${productPrice / 100}`);
      console.log(`   Status: ${product.attributes.status}`);

      // Get variants for this product
      const variantsResponse = await fetch(`https://api.lemonsqueezy.com/v1/variants?filter[product_id]=${productId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Accept': 'application/vnd.api+json',
        }
      });

      const variantsData = await variantsResponse.json();

      if (variantsResponse.ok && variantsData.data) {
        const variants = variantsData.data;
        console.log(`   Варианти (${variants.length}):`);
        
        variants.forEach(variant => {
          console.log(`     - Variant ID: ${variant.id}`);
          console.log(`       Име: ${variant.attributes.name}`);
          console.log(`       Цена: $${variant.attributes.price / 100}`);
          console.log(`       Status: ${variant.attributes.status}`);
        });

        // Generate env var suggestions
        const envVarPrefix = getEnvVarPrefix(productName);
        if (envVarPrefix && variants.length > 0) {
          console.log(`   🔧 Environment Variables:`);
          console.log(`       ${envVarPrefix}_PRODUCT_ID=${productId}`);
          console.log(`       ${envVarPrefix}_VARIANT_ID=${variants[0].id}`);
        }
      } else {
        console.log(`   ❌ Не успях да извлека варианти: ${variantsData.errors?.[0]?.detail || 'Unknown error'}`);
      }

      console.log('');
    }

    // Generate complete .env snippet
    console.log('\n📋 Копирай това в .env.local файла:');
    console.log('# LemonSqueezy Product IDs');
    
    for (const product of products) {
      const envVarPrefix = getEnvVarPrefix(product.attributes.name);
      if (envVarPrefix) {
        const variantsResponse = await fetch(`https://api.lemonsqueezy.com/v1/variants?filter[product_id]=${product.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Accept': 'application/vnd.api+json',
          }
        });

        const variantsData = await variantsResponse.json();
        
        if (variantsResponse.ok && variantsData.data && variantsData.data.length > 0) {
          console.log(`${envVarPrefix}_PRODUCT_ID=${product.id}`);
          console.log(`${envVarPrefix}_VARIANT_ID=${variantsData.data[0].id}`);
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
    return 'LEMONSQUEEZY_CASUAL';
  } else if (name.includes('gigachad')) {
    return 'LEMONSQUEEZY_GIGACHAD';
  } else if (name.includes('sigma')) {
    return 'LEMONSQUEEZY_SIGMA';
  }
  
  return null;
}

// Run the script
getProductsAndVariants(); 