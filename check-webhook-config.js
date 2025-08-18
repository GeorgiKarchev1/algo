// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

function checkWebhookConfig() {
  console.log('🔍 Checking Paddle Webhook Configuration...\n');

  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  console.log('📊 Current Configuration:');
  console.log(`   NEXT_PUBLIC_APP_URL: ${appUrl}`);
  console.log(`   PADDLE_WEBHOOK_SECRET: ${webhookSecret ? '✅ Set' : '❌ Missing'}`);
  
  if (webhookSecret) {
    console.log(`   Webhook Secret Length: ${webhookSecret.length} characters`);
    console.log(`   Webhook Secret Preview: ${webhookSecret.substring(0, 10)}...`);
  }

  // Expected webhook URL
  const expectedWebhookUrl = `${appUrl}/api/webhooks/paddle`;
  console.log(`\n🎯 Expected Webhook URL: ${expectedWebhookUrl}`);

  console.log('\n📋 Paddle Dashboard Configuration Steps:');
  console.log('1. Login to Paddle Dashboard: https://vendors.paddle.com/');
  console.log('2. Go to Developer Tools → Webhooks');
  console.log('3. Check if webhook URL matches:');
  console.log(`   ${expectedWebhookUrl}`);
  console.log('4. Verify webhook secret matches your PADDLE_WEBHOOK_SECRET');
  console.log('5. Make sure webhook is enabled and active');

  console.log('\n🔧 Common Webhook Issues:');
  console.log('❌ Wrong webhook URL (should be https://algochad.com/api/webhooks/paddle)');
  console.log('❌ Wrong webhook secret (should match PADDLE_WEBHOOK_SECRET)');
  console.log('❌ Webhook disabled in Paddle dashboard');
  console.log('❌ HTTPS required (no HTTP)');

  console.log('\n💡 To fix webhook signature errors:');
  console.log('1. Copy your PADDLE_WEBHOOK_SECRET from .env.local');
  console.log('2. Go to Paddle Dashboard → Developer Tools → Webhooks');
  console.log('3. Update the webhook secret to match exactly');
  console.log('4. Save the webhook configuration');

  console.log('\n🎯 Webhook Configuration Check Complete!');
}

// Run the check
if (require.main === module) {
  checkWebhookConfig();
}

module.exports = { checkWebhookConfig };
