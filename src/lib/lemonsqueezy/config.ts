import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

// LemonSqueezy Configuration
export const lemonSqueezyConfig = {
  apiKey: process.env.LEMONSQUEEZY_API_KEY!,
  storeId: process.env.LEMONSQUEEZY_STORE_ID!,
  storeSlug: process.env.LEMONSQUEEZY_STORE_SLUG!,
  webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET!,
  webhookUrl: process.env.LEMONSQUEEZY_WEBHOOK_URL!,
};

// Initialize LemonSqueezy
lemonSqueezySetup({
  apiKey: lemonSqueezyConfig.apiKey,
  onError: (error) => {
    console.error('LemonSqueezy Error:', error);
    throw new Error(`LemonSqueezy API Error: ${error.message}`);
  },
});

// Product and Variant IDs - Replace these with your actual LemonSqueezy IDs
export const SUBSCRIPTION_PLANS = {
  CASUAL: {
    name: 'Casual Learner',
    productId: process.env.LEMONSQUEEZY_CASUAL_PRODUCT_ID!,
    variantId: process.env.LEMONSQUEEZY_CASUAL_VARIANT_ID!,
    price: 900, // $9 in cents
  },
  GIGACHAD: {
    name: 'GigaChad Developer',
    productId: process.env.LEMONSQUEEZY_GIGACHAD_PRODUCT_ID!,
    variantId: process.env.LEMONSQUEEZY_GIGACHAD_VARIANT_ID!,
    price: 1900, // $19 in cents
  },
} as const;

// Environment validation
export function validateLemonSqueezyConfig() {
  const requiredEnvVars = [
    'LEMONSQUEEZY_API_KEY',
    'LEMONSQUEEZY_STORE_ID',
    'LEMONSQUEEZY_STORE_SLUG',
    'LEMONSQUEEZY_WEBHOOK_SECRET',
    'LEMONSQUEEZY_WEBHOOK_URL',
    'LEMONSQUEEZY_CASUAL_PRODUCT_ID',
    'LEMONSQUEEZY_CASUAL_VARIANT_ID',
    'LEMONSQUEEZY_GIGACHAD_PRODUCT_ID',
    'LEMONSQUEEZY_GIGACHAD_VARIANT_ID',
  ];

  const missingVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}

export type PlanType = keyof typeof SUBSCRIPTION_PLANS; 