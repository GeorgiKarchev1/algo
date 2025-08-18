# Локално тестване на Paddle плащания

## 1. Инсталиране на ngrok

```bash
# Инсталирай ngrok
npm install -g ngrok

# Или използвай Homebrew (macOS)
brew install ngrok
```

## 2. Стартиране на ngrok

```bash
# Стартирай ngrok за порт 3000
ngrok http 3000
```

След това ще получиш URL като: `https://abc123.ngrok.io`

## 3. Настройване на Paddle Webhook

1. Отиди в Paddle Dashboard → Developer Tools → Webhooks
2. Добави webhook URL: `https://abc123.ngrok.io/api/webhooks/paddle`
3. Избери events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.cancelled`
   - `transaction.completed`

## 4. Тестване на Checkout

1. Стартирай локалния сървър: `npm run dev`
2. Отиди на `http://localhost:3000/pricing`
3. Кликни на план
4. Провери в конзолата дали се генерира checkout URL

## 5. Тестване с Paddle Test Cards

Използвай тези тестови карти:

- **Успешно плащане**: `4000 0000 0000 0002`
- **Отказано плащане**: `4000 0000 0000 0001`
- **3D Secure**: `4000 0000 0000 3220`

## 6. Проверка на Webhooks

1. Отвори ngrok dashboard: `http://localhost:4040`
2. Провери входящите заявки
3. Провери логовете в конзолата

## 7. Тестване на API endpoints

```bash
# Тествай checkout endpoint
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"planType": "CASUAL"}'
```
