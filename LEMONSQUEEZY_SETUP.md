# 🍋 LemonSqueezy Payment Integration Setup Guide

Това guide ще те проведе през пълната настройка на LemonSqueezy за плащания в твоя сайт.

## 📋 Преглед на стъпките

1. **LemonSqueezy Account Setup** (30-45 мин)
2. **Database Setup** (15-20 мин)
3. **Environment Variables** (10-15 мин)
4. **Testing** (30-45 мин)
5. **Production Deployment** (15-30 мин)

**Общо време: ~2-3 часа**

---

## 🚀 Стъпка 1: LemonSqueezy Account Setup (30-45 мин)

### 1.1 Създай LemonSqueezy акаунт
1. Отиди на [lemonsqueezy.com](https://lemonsqueezy.com)
2. Регистрирай се за нов акаунт
3. Верифицирай имейла си

### 1.2 Създай Store
1. В Dashboard > **Create Store**
2. Попълни Store информацията:
   - Store Name: "Lazy Algo Club"
   - Store Slug: "lazyalgoclub"
   - Currency: USD
   - Country: избери твоята страна

### 1.3 Създай Products & Variants
Създай 3 продукта със следните детайли:

#### Product 1: Casual Learner
- **Name**: Casual Learner
- **Description**: For the stone-cold beginner who wants to start somewhere
- **Price**: $9.00/month
- **Type**: Subscription
- **Billing**: Monthly

#### Product 2: GigaChad Developer  
- **Name**: GigaChad Developer
- **Description**: Chad energy meets lazy efficiency - the perfect combo fr fr
- **Price**: $19.00/month
- **Type**: Subscription
- **Billing**: Monthly

#### Product 3: Sigma Grindset
- **Name**: Sigma Grindset
- **Description**: For those who grind algorithms while others sleep (but efficiently)
- **Price**: $39.00/month
- **Type**: Subscription
- **Billing**: Monthly

### 1.4 Запиши Product & Variant IDs
За всеки продукт, запиши:
- **Product ID** (от URL-а или product settings)
- **Variant ID** (от variant settings)

---

## 🗄️ Стъпка 2: Database Setup (15-20 мин)

### 2.1 Изпълни SQL скрипта
1. Отиди в Supabase Dashboard > SQL Editor
2. Копирай съдържанието от `supabase-subscriptions.sql`
3. **ВАЖНО**: Замени placeholder IDs с истинските от LemonSqueezy:
   ```sql
   -- Замени тези редове със истинските Product & Variant IDs:
   VALUES 
       ('Casual Learner', '...', 900, 'YOUR_CASUAL_PRODUCT_ID', 'YOUR_CASUAL_VARIANT_ID', ...),
       ('GigaChad Developer', '...', 1900, 'YOUR_GIGACHAD_PRODUCT_ID', 'YOUR_GIGACHAD_VARIANT_ID', ...),
       ('Sigma Grindset', '...', 3900, 'YOUR_SIGMA_PRODUCT_ID', 'YOUR_SIGMA_VARIANT_ID', ...)
   ```
4. Изпълни скрипта (Run)

### 2.2 Верифицирай създадените таблици
```sql
-- Провери дали таблиците са създадени:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscription_plans', 'user_subscriptions', 'payment_transactions');

-- Провери subscription plans:
SELECT * FROM public.subscription_plans;
```

---

## 🔑 Стъпка 3: Environment Variables (10-15 мин)

### 3.1 Получи LemonSqueezy API Key
1. LemonSqueezy Dashboard > Settings > API
2. Create New API Key
3. Копирай ключа (започва с `lmsq_sk_`)

### 3.2 Намери Store ID
1. LemonSqueezy Dashboard > Store Settings
2. Копирай Store ID (число)

### 3.3 Настрой .env файла
Копирай `.env.example` към `.env.local` и попълни:

```bash
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (вече имаш тези)
NEXT_PUBLIC_SUPABASE_URL=your-existing-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-existing-key

# LemonSqueezy 
LEMONSQUEEZY_API_KEY=lmsq_sk_your-api-key
LEMONSQUEEZY_STORE_ID=your-store-id
LEMONSQUEEZY_WEBHOOK_SECRET=your-webhook-secret
LEMONSQUEEZY_WEBHOOK_URL=http://localhost:3000/api/webhooks/lemonsqueezy

# Product IDs (от Стъпка 1.4)
LEMONSQUEEZY_CASUAL_PRODUCT_ID=your-product-id
LEMONSQUEEZY_CASUAL_VARIANT_ID=your-variant-id
LEMONSQUEEZY_GIGACHAD_PRODUCT_ID=your-product-id
LEMONSQUEEZY_GIGACHAD_VARIANT_ID=your-variant-id
LEMONSQUEEZY_SIGMA_PRODUCT_ID=your-product-id
LEMONSQUEEZY_SIGMA_VARIANT_ID=your-variant-id
```

---

## 🧪 Стъпка 4: Testing (30-45 мин)

### 4.1 Стартирай приложението
```bash
npm run dev
```

### 4.2 Test Checkout Flow
1. Отиди на pricing страницата
2. Влез в акаунта си
3. Кликни на plan бутон
4. Потвърди че checkout URL се генерира правилно

### 4.3 Настрой Webhook (за production testing)
1. LemonSqueezy Dashboard > Settings > Webhooks
2. Create Webhook с URL: `https://your-domain.com/api/webhooks/lemonsqueezy`
3. Select events:
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `order_created`
4. Копирай Webhook Secret в `.env`

### 4.4 Test със sandbox payment
1. Използвай LemonSqueezy test card данни
2. Направи test покупка
3. Провери в Supabase дали subscription се създава

---

## 🌐 Стъпка 5: Production Deployment (15-30 мин)

### 5.1 Deploy приложението
```bash
# Ако използваш Vercel:
vercel --prod

# Или какъвто hosting използваш
```

### 5.2 Обнови Environment Variables
В production настройки, добави всички env vars от `.env.local`

### 5.3 Обнови Webhook URL
1. LemonSqueezy Dashboard > Settings > Webhooks
2. Обнови URL към: `https://your-domain.com/api/webhooks/lemonsqueezy`

### 5.4 Test Production Flow
1. Направи test purchase с истински payment method
2. Провери subscription в dashboard
3. Тествай webhook events

---

## 🔧 Troubleshooting

### Чести проблеми:

**1. "Missing required environment variables"**
- Провери дали всички env vars са настроени
- Рестартирай development server

**2. "Plan not found for variant"**
- Провери Product/Variant IDs в database
- Убеди се че са правилно попълнени в SQL

**3. "Invalid webhook signature"**
- Провери LEMONSQUEEZY_WEBHOOK_SECRET
- Убеди се че URL-ът е правилен

**4. Checkout не работи**
- Провери API Key permissions
- Провери Store ID

### Debug команди:
```bash
# Провери subscription plans:
SELECT * FROM subscription_plans WHERE is_active = true;

# Провери user subscriptions:
SELECT * FROM user_subscriptions WHERE user_id = 'your-user-id';

# Провери logs в browser console и terminal
```

---

## 📚 Полезни ресурси

- [LemonSqueezy API Documentation](https://docs.lemonsqueezy.com/)
- [LemonSqueezy Webhooks Guide](https://docs.lemonsqueezy.com/webhooks)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## ✅ Post-Setup Checklist

- [ ] LemonSqueezy store създаден
- [ ] 3 subscription продукта създадени  
- [ ] Product/Variant IDs записани
- [ ] Database таблици създадени
- [ ] Environment variables настроени
- [ ] Local testing работи
- [ ] Webhook настроен
- [ ] Production deployment готов
- [ ] Production testing завършен

**Estimиране време: 2-3 часа общо** 🎉 