// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

async function debugPaddle403() {
  console.log('🔍 Debugging Paddle 403 Error...\n');

  const apiKey = process.env.PADDLE_API_KEY;
  const casualPriceId = process.env.PADDLE_CASUAL_PRICE_ID;
  const gigachadPriceId = process.env.PADDLE_GIGACHAD_PRICE_ID;

  console.log('📊 Current Configuration:');
  console.log(`   API Key: ${apiKey.substring(0, 20)}...`);
  console.log(`   CASUAL Price ID: ${casualPriceId}`);
  console.log(`   GIGACHAD Price ID: ${gigachadPriceId}`);

  // Test 1: Check account status
  console.log('\n1. Checking Account Status...');
  try {
    const accountResponse = await fetch('https://api.paddle.com/account', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (accountResponse.ok) {
      const accountData = await accountResponse.json();
      console.log('   ✅ Account accessible');
      console.log(`   📊 Account ID: ${accountData.data?.id || 'N/A'}`);
      console.log(`   📊 Account Status: ${accountData.data?.status || 'N/A'}`);
      console.log(`   📊 Account Type: ${accountData.data?.type || 'N/A'}`);
      
      // Check for any restrictions or flags
      if (accountData.data?.flags) {
        console.log(`   📊 Account Flags: ${JSON.stringify(accountData.data.flags)}`);
      }
    } else {
      const errorData = await accountResponse.json();
      console.log(`   ❌ Account access failed: ${accountResponse.status}`);
      console.log(`   📊 Error: ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    console.log(`   ❌ Account check failed: ${error.message}`);
  }

  // Test 2: Check if we can list transactions
  console.log('\n2. Testing Transaction List Access...');
  try {
    const transactionsResponse = await fetch('https://api.paddle.com/transactions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`   📊 Response Status: ${transactionsResponse.status}`);
    
    if (transactionsResponse.ok) {
      console.log('   ✅ Can list transactions');
    } else {
      const errorData = await transactionsResponse.json();
      console.log(`   ❌ Cannot list transactions: ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    console.log(`   ❌ Transaction list failed: ${error.message}`);
  }

  // Test 3: Try to create a test transaction
  console.log('\n3. Testing Transaction Creation...');
  try {
    const testTransactionData = {
      items: [
        {
          price_id: casualPriceId,
          quantity: 1,
        },
      ],
      custom_data: {
        test: true,
        debug: true,
      },
      customer_email: 'test@example.com',
    };

    console.log('   📤 Sending test transaction request...');
    const transactionResponse = await fetch('https://api.paddle.com/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testTransactionData),
    });

    console.log(`   📊 Response Status: ${transactionResponse.status}`);
    
    if (transactionResponse.ok) {
      const transactionData = await transactionResponse.json();
      console.log('   ✅ Transaction creation successful!');
      console.log(`   📊 Transaction ID: ${transactionData.data?.id || 'N/A'}`);
    } else {
      const errorData = await transactionResponse.json();
      console.log(`   ❌ Transaction creation failed: ${JSON.stringify(errorData)}`);
      
      // Analyze the error
      if (errorData.error?.code === 'forbidden') {
        console.log('\n🔍 403 Forbidden Analysis:');
        console.log('   This usually means one of the following:');
        console.log('   1. Account is not fully verified');
        console.log('   2. Account has restrictions');
        console.log('   3. API key lacks transaction permissions');
        console.log('   4. Account is in a restricted state');
        console.log('   5. Need to complete additional verification steps');
      }
    }
  } catch (error) {
    console.log(`   ❌ Transaction creation failed: ${error.message}`);
  }

  // Test 4: Check price details
  console.log('\n4. Checking Price Details...');
  for (const [planName, priceId] of [
    ['CASUAL', casualPriceId],
    ['GIGACHAD', gigachadPriceId]
  ]) {
    try {
      const priceResponse = await fetch(`https://api.paddle.com/prices/${priceId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (priceResponse.ok) {
        const priceData = await priceResponse.json();
        console.log(`   ✅ ${planName}: ${priceData.data?.description || 'No description'}`);
        console.log(`      Status: ${priceData.data?.status || 'N/A'}`);
        console.log(`      Type: ${priceData.data?.type || 'N/A'}`);
      } else {
        const errorData = await priceResponse.json();
        console.log(`   ❌ ${planName}: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.log(`   ❌ ${planName}: ${error.message}`);
    }
  }

  console.log('\n📋 Recommendations:');
  console.log('1. Check Paddle Dashboard for any pending verification steps');
  console.log('2. Look for any account restrictions or warnings');
  console.log('3. Contact Paddle support with your account ID');
  console.log('4. Check if your account needs additional verification');
  console.log('5. Verify that your business information is complete');

  console.log('\n🎯 Debug Complete!');
}

// Run the debug
if (require.main === module) {
  debugPaddle403().catch(console.error);
}

module.exports = { debugPaddle403 };
