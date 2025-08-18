# Paddle Setup Guide (Updated 2024)

This guide will help you set up Paddle payments for your LeetCode learning platform using the current Paddle system.

## 1. Create Paddle Account

1. Go to [Paddle.com](https://paddle.com) and create an account
2. Complete the verification process (this is now mandatory)
3. Set up your business information
4. Wait for account verification (usually 1-2 business days)

## 2. Configure Paddle Dashboard

### 2.1 Create Products

1. Go to **Catalog** → **Products**
2. Create two products:
   - **Casual Learner** ($9/month)
   - **GigaChad Developer** ($19/month)

### 2.2 Create Prices

For each product, create a recurring price:

1. Click on the product
2. Go to **Pricing** tab
3. Click **Add price**
4. Set up:
   - **Price**: $9.00 (Casual) or $19.00 (GigaChad)
   - **Billing cycle**: Monthly
   - **Currency**: USD
   - **Tax behavior**: Standard

### 2.3 Get API Credentials

1. Go to **Developer Tools** → **API Credentials**
2. Copy your:
   - **API Key** (starts with `pdl_live_`)
   - **Vendor ID**
   - **Webhook Secret**

## 3. Environment Variables

Create a `.env.local` file with:

```env
# Paddle Configuration (Production Only)
PADDLE_API_KEY=pdl_live_your_api_key_here
PADDLE_WEBHOOK_SECRET=your_webhook_secret_here
PADDLE_VENDOR_ID=your_vendor_id_here
PADDLE_ENVIRONMENT=production

# Paddle Product IDs (get these from your products)
PADDLE_CASUAL_PRICE_ID=pri_01xxxxx
PADDLE_GIGACHAD_PRICE_ID=pri_01xxxxx

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Supabase Configuration (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Security Configuration
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=false
```

## 4. Enable Test Mode

**IMPORTANT**: Paddle no longer has a separate sandbox environment. All testing is done in production with Test Mode.

1. Go to **Settings** → **Test Mode**
2. Enable Test Mode
3. This allows you to test with test cards without real charges

## 5. Set Up Webhooks

1. Go to **Developer Tools** → **Webhooks**
2. Add webhook endpoint: `https://yourdomain.com/api/webhooks/paddle`
3. Select events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.cancelled`
   - `subscription.resumed`
   - `subscription.paused`
   - `transaction.completed`
   - `transaction.payment_failed`

## 6. Test the Integration

### 6.1 Run the test script

```bash
npm run check:paddle:production
```

### 6.2 Test checkout flow

1. Start your development server: `npm run dev`
2. Go to your pricing page
3. Click on a plan
4. Use test cards:
   - **Success**: `4000 0000 0000 0002`
   - **Decline**: `4000 0000 0000 0001`
   - **3D Secure**: `4000 0000 0000 3220`

## 7. Database Setup

Make sure your database has the required tables:

```sql
-- Subscription plans table
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_monthly INTEGER NOT NULL,
  paddle_price_id VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User subscriptions table
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  paddle_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  paddle_customer_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMP,
  trial_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payment transactions table
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  subscription_id UUID REFERENCES user_subscriptions(id),
  paddle_transaction_id VARCHAR(255) UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 8. Production Deployment

### 8.1 Update Environment Variables

In Vercel dashboard, add:

```env
PADDLE_ENVIRONMENT=production
PADDLE_API_KEY=pdl_live_your_production_api_key
PADDLE_WEBHOOK_SECRET=your_production_webhook_secret
PADDLE_VENDOR_ID=your_vendor_id
PADDLE_CASUAL_PRICE_ID=pri_01xxxxx
PADDLE_GIGACHAD_PRICE_ID=pri_01xxxxx
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 8.2 Deploy to Vercel

1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## 9. Troubleshooting

### Common Issues

1. **"Missing environment variables"**
   - Check that all Paddle environment variables are set
   - Verify the values are correct

2. **"Invalid API key"**
   - Ensure you're using the correct API key (starts with `pdl_live_`)
   - Check if your account is verified

3. **"No checkout URL available"**
   - Verify your price IDs are correct
   - Check Paddle dashboard for any errors

4. **"403 Forbidden"**
   - Enable Test Mode in Paddle dashboard
   - Check if your account is verified
   - Ensure API key has transaction permissions

5. **Webhook not receiving events**
   - Verify webhook URL is accessible
   - Check webhook secret is correct
   - Ensure webhook events are selected

### Debug Mode

Enable debug logging by setting:

```env
NEXT_PUBLIC_ENABLE_DEBUG=true
```

This will show detailed logs in the browser console and server logs.

## 10. Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables for all sensitive data**
3. **Validate webhook signatures**
4. **Use HTTPS in production**
5. **Implement proper error handling**

## 11. Support

If you encounter issues:

1. Check Paddle documentation: https://developer.paddle.com/
2. Review server logs for error messages
3. Test with the provided test script
4. Contact Paddle support if needed

---

**Note**: Paddle has moved to a production-only model with Test Mode for testing. There is no separate sandbox environment anymore. 