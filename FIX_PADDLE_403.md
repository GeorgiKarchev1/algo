# 🔧 Fix Paddle 403 Error

## Проблем
```
❌ Paddle transaction error: {
  error: {
    type: 'request_error',
    code: 'forbidden',
    detail: "You aren't permitted to perform this request."
  }
}
```

## Причини за 403 Error

### 1. **Несъответствие на средата**
- API key е за sandbox, а price IDs са за production (или обратното)
- `PADDLE_ENVIRONMENT` не съвпада с ключовете

### 2. **Грешен API Key**
- API key не е валиден
- API key не е за правилната среда
- API key няма permissions за създаване на transactions

### 3. **Грешни Price IDs**
- Price IDs не принадлежат на твоя акаунт
- Price IDs са от различна среда
- Price IDs не са активни

## Стъпки за решаване

### Стъпка 1: Провери конфигурацията
```bash
npm run check:paddle
```

### Стъпка 2: Провери Environment Variables във Vercel

**За Sandbox тестване:**
```env
PADDLE_ENVIRONMENT=sandbox
PADDLE_API_KEY=pdl_sandbox_xxxxxxxxx
PADDLE_CASUAL_PRICE_ID=pri_sandbox_xxxxxxxxx
PADDLE_GIGACHAD_PRICE_ID=pri_sandbox_xxxxxxxxx
```

**За Production тестване:**
```env
PADDLE_ENVIRONMENT=production
PADDLE_API_KEY=pdl_production_xxxxxxxxx
PADDLE_CASUAL_PRICE_ID=pri_production_xxxxxxxxx
PADDLE_GIGACHAD_PRICE_ID=pri_production_xxxxxxxxx
```

### Стъпка 3: Провери Paddle Dashboard

1. **Отиди в Paddle Dashboard**
2. **Провери API Credentials:**
   - Developer Tools → API Credentials
   - Увери се, че използваш правилния API key

3. **Провери Products:**
   - Catalog → Products
   - Увери се, че продуктите са активни
   - Копирай правилните price IDs

4. **Провери Environment:**
   - Увери се, че си в правилната среда (Sandbox/Production)

### Стъпка 4: Тествай отново

1. **Редеплой приложението:**
   ```bash
   git add .
   git commit -m "Fix Paddle configuration"
   git push
   ```

2. **Тествай checkout:**
   - Отиди на твоя домейн
   - Кликни на план
   - Провери логовете във Vercel

### Стъпка 5: Провери логовете

Във Vercel Function Logs за `api/checkout` ще видиш:
```
🔧 Paddle Configuration: {
  environment: "sandbox",
  baseUrl: "https://sandbox-api.paddle.com",
  priceId: "pri_xxxxx",
  apiKeyLength: 45,
  apiKeyPrefix: "pdl_sandb..."
}
```

## Често срещани грешки

### ❌ "API key format: May be invalid"
- API key трябва да започва с `pdl_`
- Провери дали си копирал целия ключ

### ❌ "Price ID format: May be invalid"
- Price ID трябва да започва с `pri_`
- Провери дали си копирал правилния ID

### ❌ "API access failed"
- API key не е валиден
- Провери дали си в правилната среда

### ❌ "Price ID not accessible"
- Price ID не принадлежи на твоя акаунт
- Провери дали си копирал правилния ID

## Production Test Mode

Ако тестваш в production:

1. **Включи Test Mode в Paddle:**
   - Settings → Test Mode → Enable

2. **Използвай тестови карти:**
   - Success: `4000 0000 0000 0002`
   - Decline: `4000 0000 0000 0001`

## Проверка на решението

След поправката трябва да видиш:
```
✅ API access successful
✅ CASUAL Price ID accessible
✅ GIGACHAD Price ID accessible
✅ Checkout session created successfully
```

## Ако проблемът продължава

1. **Провери Paddle Support:**
   - Отиди в Paddle Dashboard → Support
   - Създай ticket с request ID: `a32501e7-5a71-4f03-b5df-b5e501192378`

2. **Провери Permissions:**
   - Увери се, че акаунтът ти има permissions за transactions
   - Провери дали акаунтът е верифициран

3. **Провери Account Status:**
   - Увери се, че Paddle акаунтът е активен
   - Провери дали няма ограничения

---

**💡 Tip**: Винаги първо тествай в sandbox преди да отидеш в production!
