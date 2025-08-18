# Production тестване на Paddle плащания

## 1. Подготовка за Production

### 1.1 Environment Variables

В Vercel dashboard добави:

```env
PADDLE_ENVIRONMENT=production
PADDLE_API_KEY=your_production_api_key
PADDLE_WEBHOOK_SECRET=your_production_webhook_secret
PADDLE_VENDOR_ID=your_vendor_id
PADDLE_CASUAL_PRICE_ID=pri_01xxxxx
PADDLE_GIGACHAD_PRICE_ID=pri_01xxxxx
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 1.2 Webhook Setup

1. Отиди в Paddle Dashboard → Developer Tools → Webhooks
2. Добави production webhook: `https://yourdomain.com/api/webhooks/paddle`
3. Избери всички events

## 2. Тестване в Production

### 2.1 Test Mode в Paddle

Paddle има вграден test mode за production:

1. В Paddle Dashboard отиди на **Settings** → **Test Mode**
2. Активирай test mode
3. Сега можеш да тестваш без реални плащания

### 2.2 Тестване с Test Cards

Използвай тези карти в production test mode:

- **Успешно**: `4000 0000 0000 0002`
- **Отказано**: `4000 0000 0000 0001`
- **3D Secure**: `4000 0000 0000 3220`

### 2.3 Тестване на Checkout Flow

1. Отиди на `https://yourdomain.com/pricing`
2. Избери план
3. Попълни формата с тестова карта
4. Провери дали се генерира checkout URL
5. Завърши плащането

## 3. Monitoring и Debugging

### 3.1 Vercel Logs

```bash
# Провери логовете в Vercel
vercel logs yourdomain.com

# Или в Vercel dashboard
# Functions → api/checkout → View Function Logs
```

### 3.2 Paddle Dashboard

1. Отиди в **Transactions** за да видиш всички плащания
2. Провери **Webhooks** за failed deliveries
3. Виж **Customers** за нови акаунти

### 3.3 Database Monitoring

Провери дали се създават записи в:

- `user_subscriptions`
- `payment_transactions`

## 4. Production Test Script

Създай production test script:

```bash
# Тествай production checkout
curl -X POST https://yourdomain.com/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"planType": "CASUAL"}'
```

## 5. Safety Measures

### 5.1 Test Mode

- Винаги първо тествай в test mode
- Използвай малки суми за тестване
- Имай backup на данните

### 5.2 Monitoring

- Настрой alerts за failed payments
- Мониторирай webhook failures
- Проверявай conversion rates

## 6. Go Live Checklist

- [ ] Environment variables са настроени
- [ ] Webhooks са конфигурирани
- [ ] Test mode е деактивиран
- [ ] SSL сертификат е активен
- [ ] Database backup е направен
- [ ] Monitoring е настроен

## 7. Troubleshooting Production

### Често срещани проблеми:

1. **Webhook failures**: Провери URL и SSL
2. **Checkout errors**: Провери API key и price IDs
3. **Database errors**: Провери connection strings
4. **CORS errors**: Провери domain settings

### Debug Commands:

```bash
# Провери webhook endpoint
curl -X POST https://yourdomain.com/api/webhooks/paddle \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Провери checkout endpoint
curl -X POST https://yourdomain.com/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"planType": "CASUAL"}'
```
