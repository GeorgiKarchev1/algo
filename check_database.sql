
-- Провери дали таблиците са създадени
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscription_plans', 'user_subscriptions', 'payment_transactions');

-- Провери subscription plans
SELECT name, price_monthly, lemon_product_id, lemon_variant_id, is_popular, is_active
FROM public.subscription_plans
ORDER BY price_monthly;

