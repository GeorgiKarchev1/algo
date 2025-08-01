# Supabase Setup Guide

## 🚀 Бързо свързване на нов Supabase проект

### 1. **Вземи Supabase credentials**

1. Отиди в твоя нов Supabase проект: https://supabase.com/dashboard
2. Dashboard → Settings → API
3. Копирай следните стойности:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY)

### 2. **Създай .env.local файл**

В root директорията на проекта създай `.env.local` файл:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_new_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_new_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_new_supabase_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Paddle Configuration (ако използваш)
PADDLE_API_KEY=your_paddle_api_key_here
PADDLE_WEBHOOK_SECRET=your_paddle_webhook_secret_here
PADDLE_VENDOR_ID=your_paddle_vendor_id_here
PADDLE_ENVIRONMENT=sandbox
PADDLE_CASUAL_PRICE_ID=pri_01xxxxx
PADDLE_GIGACHAD_PRICE_ID=pri_01xxxxx
```

### 3. **Настрой Authentication в Supabase**

1. **Supabase Dashboard → Authentication → Settings**

2. **Email Auth:**
   - ✅ Enable Email Signup
   - ✅ Enable Email Confirmations (optional - можеш да го изключиш за development)
   - ✅ Enable Secure Email Change

3. **URL Configuration:**
   - Site URL: `http://localhost:3000` (за development)
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 4. **Изпълни SQL скрипта**

1. **Supabase Dashboard → SQL Editor → New Query**
2. Копирай и изпълни целия SQL код от `supabase-complete-setup.sql`
3. Това ще създаде:
   - `profiles` таблица
   - `user_progress` таблица
   - `subscription_plans` таблица
   - `user_subgress` таблица
   - `subscription_plans` таблица (Paddle интеграция)
   - `user_subscriptions` таблица (Paddle интеграция)
   - `payment_transactions` таблица (Paddle интеграция)
   - Row Level Security (RLS) policies
   - Triggers за автоматично създаване на профили
   - Sample subscription plans (CASUAL и GIGACHAD)

### 5. **Тествай интеграцията**

1. **Стартирай development сървъра:**
   ```bash
   npm run dev
   ```

2. **Тествай регистрация:**
   - Отиди на `http://localhost:3000`
   - Кликни "Sign Up"
   - Попълни формата
   - Провери дали профилът се създава в Supabase Dashboard → Table Editor → profiles

3. **Тествай login:**
   - Опитай да се логнеш с новосъздадения акаунт
   - Провери дали се зарежда правилно

### 6. **Проверка на настройките**

**В Supabase Dashboard провери:**

1. **Authentication → Users** - дали потребителите се създават
2. **Table Editor → profiles** - дали профилите се създават автоматично
3. **Authentication → Policies** - дали RLS policies са активни
4. **SQL Editor** - изпълни verification queries от SQL скрипта

### 7. **Често срещани проблеми**

**❌ "Missing Supabase environment variables"**
- Провери дали `.env.local` файлът съществува
- Провери дали environment variables са правилни
- Рестартирай development сървъра

**❌ "Table doesn't exist"**
- Изпълни SQL скрипта отново
- Провери дали си в правилния Supabase проект

**❌ "Profile not created automatically"**
- Провери дали trigger-ът `on_auth_user_created` е създаден
- Провери дали функцията `handle_new_user()` съществува

**❌ "RLS policy error"**
- Провери дали RLS е enabled на таблиците
- Провери дали policies са създадени правилно

### 8. **Production настройки**

За production сменяй следните стойности:

1. **Supabase Authentication → Settings:**
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/auth/callback`

2. **Environment variables:**
   - `NEXT_PUBLIC_APP_URL=https://yourdomain.com`

### 9. **Допълнителни настройки (optional)**

**Email templates:**
- Supabase Dashboard → Authentication → Email Templates
- Персонализирай email templates за confirmation и reset password

**Social Auth (ако искаш):**
- Supabase Dashboard → Authentication → Providers
- Добави Google, GitHub, etc.

**Database backups:**
- Supabase Dashboard → Settings → Database
- Настрой автоматични backups

## ✅ Проверка на успешната интеграция

След всички стъпки трябва да можеш да:

1. ✅ Регистрираш нов потребител
2. ✅ Логнеш се с регистриран потребител
3. ✅ Видиш профила в Supabase Dashboard
4. ✅ Обновиш профилна информация
5. ✅ Излезеш от акаунта

Ако всичко работи - интеграцията е успешна! 🎉 