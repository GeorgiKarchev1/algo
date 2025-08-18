# 🚀 Paddle Quick Start Guide

## Локално тестване (5 минути)

### 1. Стартирай локалния сървър
```bash
npm run dev
```

### 2. Тествай checkout endpoint
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"planType": "CASUAL"}'
```

### 3. Провери логовете
Виж конзолата за подробни логове и грешки.

## Production тестване (10 минути)

### 1. Настрой environment variables в Vercel
```env
PADDLE_ENVIRONMENT=production
PADDLE_API_KEY=your_production_api_key
PADDLE_WEBHOOK_SECRET=your_webhook_secret
PADDLE_VENDOR_ID=your_vendor_id
PADDLE_CASUAL_PRICE_ID=pri_01xxxxx
PADDLE_GIGACHAD_PRICE_ID=pri_01xxxxx
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 2. Тествай production
```bash
# Замени yourdomain.com с твоя домейн
npm run test:paddle:production
```

### 3. Ръчно тестване
1. Отиди на `https://yourdomain.com/pricing`
2. Кликни на план
3. Използвай тестова карта: `4000 0000 0000 0002`

## Webhook тестване с ngrok

### 1. Инсталирай ngrok
```bash
npm install -g ngrok
```

### 2. Стартирай ngrok
```bash
ngrok http 3000
```

### 3. Настрой webhook в Paddle
- URL: `https://abc123.ngrok.io/api/webhooks/paddle`
- Events: всички subscription и transaction events

### 4. Провери webhooks
- Отвори `http://localhost:4040` за ngrok dashboard
- Виж входящите заявки

## Често срещани проблеми

### ❌ "Missing environment variables"
```bash
# Провери дали имаш .env.local файл
cat .env.local
```

### ❌ "Invalid API key"
- Провери дали използваш правилния API key
- Увери се, че си в правилната среда (sandbox/production)

### ❌ "No checkout URL available"
- Провери дали price IDs са правилни
- Увери се, че продуктите са активни в Paddle

### ❌ Webhook не получава events
- Провери дали webhook URL е достъпен
- Увери се, че webhook secret е правилен

## Test Cards

Използвай тези карти за тестване:

- **Успешно**: `4000 0000 0000 0002`
- **Отказано**: `4000 0000 0000 0001`
- **3D Secure**: `4000 0000 0000 3220`

## Monitoring

### Vercel Logs
```bash
vercel logs yourdomain.com
```

### Paddle Dashboard
- Transactions: за всички плащания
- Webhooks: за failed deliveries
- Customers: за нови акаунти

## Go Live Checklist

- [ ] Environment variables са настроени
- [ ] Webhooks са конфигурирани
- [ ] Test mode е деактивиран
- [ ] SSL сертификат е активен
- [ ] Database backup е направен
- [ ] Monitoring е настроен

---

**💡 Tip**: Винаги първо тествай в sandbox режим преди да отидеш в production!
