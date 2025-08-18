// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

function testAppUrl() {
  console.log('🔍 Testing NEXT_PUBLIC_APP_URL Configuration...\n');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  console.log('📊 Current Configuration:');
  console.log(`   NEXT_PUBLIC_APP_URL: ${appUrl}`);
  
  if (!appUrl) {
    console.log('❌ NEXT_PUBLIC_APP_URL is missing');
    return;
  }

  // Check if it's a valid URL
  try {
    const url = new URL(appUrl);
    console.log('   ✅ Valid URL format');
    console.log(`   📊 Protocol: ${url.protocol}`);
    console.log(`   📊 Hostname: ${url.hostname}`);
    console.log(`   📊 Port: ${url.port || 'default'}`);
  } catch (error) {
    console.log('   ❌ Invalid URL format:', error.message);
    return;
  }

  // Test if it's HTTPS
  if (appUrl.startsWith('https://')) {
    console.log('   ✅ HTTPS protocol (secure)');
  } else {
    console.log('   ⚠️  Not HTTPS - may cause issues in production');
  }

  // Test if it's the correct domain
  if (appUrl.includes('algochad.com')) {
    console.log('   ✅ Correct domain (algochad.com)');
  } else {
    console.log('   ⚠️  Domain may not match your production domain');
  }

  // Test return_url and success_url construction
  console.log('\n🔧 Testing URL Construction:');
  const returnUrl = `${appUrl}/success`;
  const successUrl = `${appUrl}/success`;
  
  console.log(`   Return URL: ${returnUrl}`);
  console.log(`   Success URL: ${successUrl}`);

  // Test if success page would be accessible
  if (returnUrl.includes('algochad.com')) {
    console.log('   ✅ Success URLs will work with your domain');
  } else {
    console.log('   ❌ Success URLs may not work correctly');
  }

  console.log('\n🎯 App URL Test Complete!');
}

// Run the test
if (require.main === module) {
  testAppUrl();
}

module.exports = { testAppUrl };
