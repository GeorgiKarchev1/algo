-- ===============================================
-- LemonSqueezy Subscription Management Tables
-- ===============================================
-- Run this SQL after the main supabase-setup.sql

-- 1. Create subscription plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price_monthly INTEGER NOT NULL, -- Price in cents
    lemon_product_id TEXT UNIQUE NOT NULL,
    lemon_variant_id TEXT UNIQUE NOT NULL,
    features JSONB DEFAULT '[]',
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Create user subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES public.subscription_plans(id) NOT NULL,
    lemon_subscription_id TEXT UNIQUE NOT NULL,
    lemon_customer_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'cancelled', 'expired', 'past_due')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    cancelled_at TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Create payment transactions table
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE SET NULL,
    lemon_order_id TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL, -- Amount in cents
    currency TEXT DEFAULT 'USD' NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_lemon_subscription_id ON public.user_subscriptions(lemon_subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_subscription_id ON public.payment_transactions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_lemon_variant_id ON public.subscription_plans(lemon_variant_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for subscription_plans (public read access)
DROP POLICY IF EXISTS "Subscription plans are viewable by everyone" ON public.subscription_plans;
CREATE POLICY "Subscription plans are viewable by everyone" ON public.subscription_plans
    FOR SELECT USING (true);

-- 7. Create RLS policies for user_subscriptions (users can only see their own)
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can insert their own subscriptions" ON public.user_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can update their own subscriptions" ON public.user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- 8. Create RLS policies for payment_transactions (users can only see their own)
DROP POLICY IF EXISTS "Users can view their own payment transactions" ON public.payment_transactions;
CREATE POLICY "Users can view their own payment transactions" ON public.payment_transactions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own payment transactions" ON public.payment_transactions;
CREATE POLICY "Users can insert their own payment transactions" ON public.payment_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Create triggers for updated_at
DROP TRIGGER IF EXISTS subscription_plans_updated_at ON public.subscription_plans;
CREATE TRIGGER subscription_plans_updated_at 
    BEFORE UPDATE ON public.subscription_plans
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS user_subscriptions_updated_at ON public.user_subscriptions;
CREATE TRIGGER user_subscriptions_updated_at 
    BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS payment_transactions_updated_at ON public.payment_transactions;
CREATE TRIGGER payment_transactions_updated_at 
    BEFORE UPDATE ON public.payment_transactions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 11. Insert subscription plans with your actual Product & Variant IDs
-- REPLACE THE PLACEHOLDER IDs WITH YOUR ACTUAL LEMONSQUEEZY PRODUCT & VARIANT IDs
INSERT INTO public.subscription_plans (name, description, price_monthly, lemon_product_id, lemon_variant_id, features, is_popular)
VALUES 
    ('Casual Learner', 'For the stone-cold beginner who wants to start somewhere', 900, 'YOUR_CASUAL_PRODUCT_ID', 'YOUR_CASUAL_VARIANT_ID', 
     '["10 lessons/month", "Basic visualizations", "Community access", "Mobile app", "Email support"]', false),
    ('GigaChad Developer', 'Chad energy meets lazy efficiency - the perfect combo fr fr', 1900, 'YOUR_GIGACHAD_PRODUCT_ID', 'YOUR_GIGACHAD_VARIANT_ID', 
     '["Unlimited lessons", "Advanced visualizations", "Priority support", "Interview prep mode", "Progress analytics", "Custom learning paths", "Discord VIP access"]', true)
ON CONFLICT (lemon_variant_id) DO NOTHING;

-- 12. Create helper function to get user's active subscription
DROP FUNCTION IF EXISTS public.get_user_active_subscription(UUID);
CREATE OR REPLACE FUNCTION public.get_user_active_subscription(user_uuid UUID)
RETURNS TABLE (
    subscription_id UUID,
    plan_name TEXT,
    status TEXT,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN
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
        us.cancel_at_period_end
    FROM public.user_subscriptions us
    JOIN public.subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = user_uuid
    AND us.status = 'active'
    ORDER BY us.current_period_end DESC
    LIMIT 1;
END;
$$;

-- ===============================================
-- Verification Queries (optional - run to check)
-- ===============================================

-- Check if tables were created successfully
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscription_plans', 'user_subscriptions', 'payment_transactions');

-- Check if subscription plans were inserted
SELECT 
    name,
    price_monthly,
    lemon_product_id,
    lemon_variant_id,
    is_popular,
    is_active
FROM public.subscription_plans
ORDER BY price_monthly;

-- Check if indexes were created
SELECT 
    schemaname,
    tablename,
    indexname
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('subscription_plans', 'user_subscriptions', 'payment_transactions')
ORDER BY tablename, indexname;

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('subscription_plans', 'user_subscriptions', 'payment_transactions')
ORDER BY tablename, policyname; 