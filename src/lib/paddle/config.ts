// Paddle Configuration
export const paddleConfig = {
  apiKey: process.env.PADDLE_API_KEY!,
  webhookSecret: process.env.PADDLE_WEBHOOK_SECRET!,
  vendorId: process.env.PADDLE_VENDOR_ID!,
  environment: process.env.PADDLE_ENVIRONMENT || 'sandbox', // 'sandbox' or 'production'
  baseUrl: process.env.PADDLE_ENVIRONMENT === 'production' 
    ? 'https://api.paddle.com' 
    : 'https://sandbox-api.paddle.com',
};

// Product and Price IDs - Replace these with your actual Paddle IDs
export const SUBSCRIPTION_PLANS = {
  CASUAL: {
    name: 'Casual Learner',
    priceId: process.env.PADDLE_CASUAL_PRICE_ID!,
    price: 900, // $9 in cents
  },
  GIGACHAD: {
    name: 'GigaChad Developer',
    priceId: process.env.PADDLE_GIGACHAD_PRICE_ID!,
    price: 1900, // $19 in cents
  },
} as const;

// Environment validation
export function validatePaddleConfig() {
  const requiredEnvVars = [
    'PADDLE_API_KEY',
    'PADDLE_WEBHOOK_SECRET',
    'PADDLE_VENDOR_ID',
    'PADDLE_CASUAL_PRICE_ID',
    'PADDLE_GIGACHAD_PRICE_ID',
  ];

  const missingVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingVars.length > 0) {
    console.error('Missing Paddle environment variables:', missingVars);
    throw new Error(
      `Missing required Paddle environment variables: ${missingVars.join(', ')}`
    );
  }

  // Validate that API key is not empty
  if (!paddleConfig.apiKey || paddleConfig.apiKey === 'your_paddle_api_key_here') {
    throw new Error('PADDLE_API_KEY is not properly configured');
  }

  // Validate that price IDs are not empty
  if (!SUBSCRIPTION_PLANS.CASUAL.priceId || SUBSCRIPTION_PLANS.CASUAL.priceId === 'pri_01xxxxx') {
    throw new Error('PADDLE_CASUAL_PRICE_ID is not properly configured');
  }

  if (!SUBSCRIPTION_PLANS.GIGACHAD.priceId || SUBSCRIPTION_PLANS.GIGACHAD.priceId === 'pri_01xxxxx') {
    throw new Error('PADDLE_GIGACHAD_PRICE_ID is not properly configured');
  }

  console.log('✅ Paddle configuration validated successfully');
}

// Paddle API headers
export function getPaddleHeaders() {
  return {
    'Authorization': `Bearer ${paddleConfig.apiKey}`,
    'Content-Type': 'application/json',
  };
} 