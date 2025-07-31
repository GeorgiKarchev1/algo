# Paddle Setup Guide

Това ръководство ще ви помогне да настроите Paddle за плащания в сайта и да тествате функционалността.

## 1. Създаване на Paddle Account

1. Отидете на [paddle.com](https://paddle.com) и създайте акаунт
2. Попълнете бизнес информацията
3. Активирайте акаунта (може да отнеме 1-2 дни)

## 2. Настройка на Environment Variables

Създайте `.env.local` файл в root директорията на проекта:

```bash
# Paddle Configuration
PADDLE_API_KEY=your_paddle_api_key_here
PADDLE_WEBHOOK_SECRET=your_webhook_secret_here
PADDLE_VENDOR_ID=your_vendor_id_here
PADDLE_ENVIRONMENT=sandbox

# Paddle Product IDs (ще ги получите след създаване на продуктите)
PADDLE_CASUAL_PRICE_ID=pri_01xxxxx
PADDLE_GIGACHAD_PRICE_ID=pri_01xxxxx

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Създаване на Продукти в Paddle

### 3.1 Създаване на Casual Learner план

1. В Paddle Dashboard отидете на **Products** → **Create Product**
2. Настройки:
   - **Name**: Casual Learner
   - **Description**: Perfect for beginners starting their coding journey
   - **Pricing**: $9/month
   - **Billing Cycle**: Monthly
   - **Currency**: USD

### 3.2 Създаване на GigaChad Developer план

1. Създайте нов продукт
2. Настройки:
   - **Name**: GigaChad Developer
   - **Description**: Advanced features for serious developers
   - **Pricing**: $19/month
   - **Billing Cycle**: Monthly
   - **Currency**: USD

### 3.3 Извличане на Price IDs

След създаването на продуктите, използвайте скрипта за извличане на ID-тата:

```bash
node get-paddle-products.js
```

## 4. Настройка на Webhooks

### 4.1 Създаване на Webhook

1. В Paddle Dashboard отидете на **Developer Tools** → **Webhooks**
2. Създайте нов webhook:
   - **URL**: `https://your-domain.com/api/webhooks/paddle`
   - **Events**: Изберете всички subscription и transaction events

### 4.2 Локално тестване с ngrok

За локално тестване използвайте ngrok:

```bash
# Инсталирайте ngrok
npm install -g ngrok

# Стартирайте ngrok
ngrok http 3000

# Използвайте ngrok URL-а за webhook
```

## 5. Database Setup

Изпълнете SQL миграцията за Paddle:

```bash
# В Supabase SQL Editor или чрез psql
psql -h your-supabase-host -U postgres -d postgres -f paddle-migration.sql
```

## 6. Тестване на Функционалността

### 6.1 Стартиране на приложението

```bash
npm run dev
```

### 6.2 Тестване на Checkout

1. Отидете на `/pricing` страницата
2. Изберете план
3. Попълнете формата за плащане
4. Използвайте тестови карти:
   - **Success**: 4000 0000 0000 0002
   - **Decline**: 4000 0000 0000 0001

### 6.3 Тестване на Webhooks

1. Проверете логовете в конзолата
2. Проверете базата данни за нови записи
3. Използвайте Paddle webhook testing tools

## 7. Production Deployment

### 7.1 Environment Variables

Обновете environment variables за production:

```bash
PADDLE_ENVIRONMENT=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 7.2 Webhook URL

Обновете webhook URL-а в Paddle Dashboard да сочи към production домейна.

## 8. Troubleshooting

### Често срещани проблеми:

1. **Webhook verification fails**: Проверете `PADDLE_WEBHOOK_SECRET`
2. **Checkout fails**: Проверете `PADDLE_API_KEY` и `PADDLE_VENDOR_ID`
3. **Price not found**: Проверете `PADDLE_CASUAL_PRICE_ID` и `PADDLE_GIGACHAD_PRICE_ID`

### Debugging:

```bash
# Проверете логовете
npm run dev

# Тествайте API endpoints
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"planType": "CASUAL"}'
```

## 9. Security Best Practices

1. Никога не комитирайте `.env.local` файла
2. Използвайте различни API ключове за development и production
3. Регулярно ротирайте webhook secrets
4. Мониторирайте webhook events за подозрителна активност

## 10. Monitoring

Настройте мониторинг за:
- Failed webhook deliveries
- Checkout conversion rates
- Subscription cancellations
- Payment failures 