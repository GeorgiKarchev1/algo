const fs = require('fs');
const { execSync } = require('child_process');

// Read .env.local file
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};

// Parse .env.local file
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key] = valueParts.join('=');
    }
  }
});

// Paddle variables to sync
const paddleVars = [
  'PADDLE_API_KEY',
  'PADDLE_WEBHOOK_SECRET',
  'PADDLE_VENDOR_ID',
  'PADDLE_ENVIRONMENT',
  'PADDLE_CASUAL_PRICE_ID',
  'PADDLE_GIGACHAD_PRICE_ID',
  'NEXT_PUBLIC_APP_URL'
];

console.log('🔄 Syncing environment variables to Vercel...\n');

paddleVars.forEach(varName => {
  const value = envVars[varName];
  if (value) {
    console.log(`📤 Adding ${varName}...`);
    try {
      // Remove existing variable first
      try {
        execSync(`vercel env rm ${varName} production --yes`, { stdio: 'pipe' });
      } catch (e) {
        // Variable might not exist, that's OK
      }
      
      // Add new variable
      execSync(`echo "${value}" | vercel env add ${varName} production`, { stdio: 'pipe' });
      console.log(`   ✅ ${varName} added successfully`);
    } catch (error) {
      console.log(`   ❌ Failed to add ${varName}: ${error.message}`);
    }
  } else {
    console.log(`⚠️  ${varName} not found in .env.local`);
  }
});

console.log('\n🎯 Environment sync complete!');
console.log('\n📋 Next steps:');
console.log('1. Deploy your project: vercel --prod');
console.log('2. Test the checkout endpoint');
console.log('3. Check Vercel logs for any errors');
