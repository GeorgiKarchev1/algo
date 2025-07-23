-- ===============================================
-- Paddle Migration Script
-- ===============================================
-- This script migrates the database from LemonSqueezy to Paddle
-- Run this AFTER creating the original tables with supabase-subscriptions.sql

-- 1. Add Paddle columns to subscription_plans table
ALTER TABLE public.subscription_plans 
ADD COLUMN IF NOT EXISTS paddle_price_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS paddle_product_id TEXT;

-- 2. Add Paddle columns to user_subscriptions table
ALTER TABLE public.user_subscriptions 
ADD COLUMN IF NOT EXISTS paddle_subscription_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS paddle_customer_id TEXT;

-- 3. Add Paddle columns to payment_transactions table
ALTER TABLE public.payment_transactions 
ADD COLUMN IF NOT EXISTS paddle_transaction_id TEXT;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscription_plans_paddle_price_id 
ON public.subscription_plans(paddle_price_id);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_paddle_subscription_id 
ON public.user_subscriptions(paddle_subscription_id);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_paddle_transaction_id 
ON public.payment_transactions(paddle_transaction_id);

-- 5. Update the subscription plans with Paddle IDs
-- REPLACE THE PLACEHOLDER IDs WITH YOUR ACTUAL PADDLE PRICE & PRODUCT IDs
UPDATE public.subscription_plans 
SET 
  paddle_price_id = 'PADDLE_CASUAL_PRICE_ID',
  paddle_product_id = 'PADDLE_CASUAL_PRODUCT_ID'
WHERE name = 'Casual Learner' AND paddle_price_id IS NULL;

UPDATE public.subscription_plans 
SET 
  paddle_price_id = 'PADDLE_GIGACHAD_PRICE_ID',
  paddle_product_id = 'PADDLE_GIGACHAD_PRODUCT_ID'
WHERE name = 'GigaChad Developer' AND paddle_price_id IS NULL;

-- 6. Add new constraint to ensure either LemonSqueezy or Paddle IDs exist
-- (This allows for gradual migration or supporting both systems)
ALTER TABLE public.subscription_plans 
ADD CONSTRAINT check_payment_provider 
CHECK (
  (lemon_variant_id IS NOT NULL AND lemon_product_id IS NOT NULL) OR 
  (paddle_price_id IS NOT NULL AND paddle_product_id IS NOT NULL)
);

-- 7. Update the helper function to work with Paddle
DROP FUNCTION IF EXISTS public.get_user_active_subscription(UUID);
CREATE OR REPLACE FUNCTION public.get_user_active_subscription(user_uuid UUID)
RETURNS TABLE (
    subscription_id UUID,
    plan_name TEXT,
    status TEXT,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN,
    payment_provider TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        us.id,
        sp.name,
        us.status,
        us.current_period_end,
        us.cancel_at_period_end,
        CASE 
            WHEN us.paddle_subscription_id IS NOT NULL THEN 'paddle'
            WHEN us.lemon_subscription_id IS NOT NULL THEN 'lemonsqueezy'
            ELSE 'unknown'
        END as payment_provider
    FROM public.user_subscriptions us
    JOIN public.subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = user_uuid
    AND us.status = 'active'
    ORDER BY us.current_period_end DESC
    LIMIT 1;
END;
$$;

-- 8. Create function to get subscription by Paddle ID
CREATE OR REPLACE FUNCTION public.get_subscription_by_paddle_id(paddle_sub_id TEXT)
RETURNS TABLE (
    subscription_id UUID,
    user_id UUID,
    plan_id UUID,
    status TEXT,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        us.id,
        us.user_id,
        us.plan_id,
        us.status,
        us.current_period_start,
        us.current_period_end
    FROM public.user_subscriptions us
    WHERE us.paddle_subscription_id = paddle_sub_id;
END;
$$;

-- 9. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_user_active_subscription(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_subscription_by_paddle_id(TEXT) TO authenticated;

-- 10. Add RLS policies for Paddle-related data
-- Allow users to read their own subscription data
CREATE POLICY IF NOT EXISTS "Users can view their own subscriptions" 
ON public.user_subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- Allow service role to manage all subscription data (for webhooks)
CREATE POLICY IF NOT EXISTS "Service role can manage subscriptions" 
ON public.user_subscriptions FOR ALL
USING (auth.role() = 'service_role');

-- 11. Optional: Create a view for easier querying
CREATE OR REPLACE VIEW public.active_subscriptions AS
SELECT 
    us.id,
    us.user_id,
    us.status,
    us.current_period_start,
    us.current_period_end,
    us.cancel_at_period_end,
    us.cancelled_at,
    sp.name as plan_name,
    sp.price_monthly,
    sp.features,
    CASE 
        WHEN us.paddle_subscription_id IS NOT NULL THEN 'paddle'
        WHEN us.lemon_subscription_id IS NOT NULL THEN 'lemonsqueezy'
        ELSE 'unknown'
    END as payment_provider,
    COALESCE(us.paddle_subscription_id, us.lemon_subscription_id) as external_subscription_id
FROM public.user_subscriptions us
JOIN public.subscription_plans sp ON us.plan_id = sp.id
WHERE us.status = 'active';

-- Grant access to the view
GRANT SELECT ON public.active_subscriptions TO authenticated;

-- ===============================================
-- IMPORTANT NOTES:
-- ===============================================
-- 1. Replace PADDLE_CASUAL_PRICE_ID, PADDLE_GIGACHAD_PRICE_ID, etc. 
--    with your actual Paddle Price IDs from your Paddle dashboard
-- 
-- 2. This migration allows both LemonSqueezy and Paddle to coexist
--    You can gradually migrate users or keep both systems
-- 
-- 3. The webhook handlers will need to use the appropriate 
--    paddle_* columns when processing Paddle events
-- 
-- 4. Test thoroughly in a development environment before 
--    running in production
-- =============================================== 