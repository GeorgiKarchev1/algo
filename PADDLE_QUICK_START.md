# 🚀 Paddle Quick Start Guide (Updated 2024)

## Production Only Setup

Paddle no longer has a separate sandbox environment. All testing is done in production with Test Mode.

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
PADDLE_API_KEY=pdl_live_your_production_api_key
PADDLE_WEBHOOK_SECRET=your_webhook_secret
PADDLE_VENDOR_ID=your_vendor_id
PADDLE_CASUAL_PRICE_ID=pri_01xxxxx
PADDLE_GIGACHAD_PRICE_ID=pri_01xxxxx
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 2. Включи Test Mode в Paddle Dashboard
1. Отиди в Paddle Dashboard → Settings → Test Mode
2. Enable Test Mode
3. Това прави всички транзакции тестови

### 3. Тествай production
```bash
# Замени yourdomain.com с твоя домейн
npm run test:paddle:production
```

### 4. Ръчно тестване
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
- Провери дали API key започва с `pdl_live_`
- Увери се, че акаунтът е верифициран

### ❌ "403 Forbidden"
- **Включи Test Mode** в Paddle Dashboard
- Провери дали акаунтът е верифициран
- Увери се, че API key има permissions

### ❌ "No checkout URL available"
- Провери дали price IDs са правилни
- Увери се, че продуктите са активни в Paddle

### ❌ Webhook не получава events
- Провери дали webhook URL е достъпен
- Увери се, че webhook secret е правилен

## Test Cards

Използвай тези карти за тестване (само когато Test Mode е включен):

- **Успешно**: `4000 0000 0000 0002`
- **Отказано**: `4000 0000 0000 0001`
- **3D Secure**: `4000 0000 0000 3220`

## Monitoring

### Vercel Logs
```bash
vercel logs yourdomain.com
```

### Paddle Dashboard
- Transactions: за всички плащания (тестови и реални)
- Webhooks: за failed deliveries
- Customers: за нови акаунти

## Go Live Checklist

- [ ] Environment variables са настроени
- [ ] Webhooks са конфигурирани
- [ ] Test Mode е включен за тестване
- [ ] SSL сертификат е активен
- [ ] Database backup е направен
- [ ] Monitoring е настроен

## Важни бележки

### Test Mode
- **За тестване**: Test Mode ON = всички транзакции са тестови
- **За production**: Test Mode OFF = реални транзакции
- **Безопасно**: Можеш да тестваш без риск от реални плащания

### Production Only
- Няма отделен sandbox environment
- Всичко се случва в production
- Test Mode е единственият начин за безопасно тестване

---

**💡 Tip**: Винаги първо тествай с Test Mode включен преди да отидеш в реални плащания!
