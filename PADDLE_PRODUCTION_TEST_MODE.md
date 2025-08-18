# 🚀 Paddle Production Test Mode Guide

## Проблем
Получаваш 403 Forbidden error в production, въпреки че всички ключове са правилни.

## Решение: Enable Test Mode

### Стъпка 1: Отиди в Paddle Dashboard
1. Влез в [Paddle Dashboard](https://vendors.paddle.com)
2. Увери се, че си в **Production** среда (не Sandbox)

### Стъпка 2: Намери Test Mode
1. Отиди на **Settings** (в лявото меню)
2. Търси **Test Mode** или **Testing**
3. Кликни на **Enable Test Mode**

### Стъпка 3: Активирай Test Mode
1. Превключи toggle-а на **ON**
2. Запази настройките
3. Увери се, че Test Mode е активен

### Стъпка 4: Провери статуса
След активиране на Test Mode:
- Всички транзакции ще бъдат тестови
- Няма реални плащания
- Можеш да използваш тестови карти

## Тестване след Test Mode

### 1. Тестови карти
Използвай тези карти:
- **Успешно плащане**: `4000 0000 0000 0002`
- **Отказано плащане**: `4000 0000 0000 0001`
- **3D Secure**: `4000 0000 0000 3220`

### 2. Тествай checkout
1. Отиди на твоя домейн
2. Кликни на план
3. Попълни формата с тестова карта
4. Провери дали се генерира checkout URL

### 3. Провери логовете
Във Vercel Function Logs ще видиш:
```
✅ API access successful
✅ Checkout session created successfully
```

## Ако Test Mode не е наличен

### Възможни причини:
1. **Акаунтът не е верифициран**
   - Отиди в Settings → Account
   - Попълни всички required fields
   - Изчакай верификация

2. **Акаунтът има ограничения**
   - Провери дали няма pending issues
   - Свържи се с Paddle support

3. **API key няма permissions**
   - Отиди в Developer Tools → API Credentials
   - Увери се, че API key има transaction permissions

## Проверка на Test Mode

### В Paddle Dashboard:
1. Отиди в **Transactions**
2. Търси **Test Mode** индикатор
3. Транзакциите трябва да са маркирани като "Test"

### В кода:
```javascript
// Test Mode се прилага автоматично
// Няма нужда от допълнителни настройки в кода
```

## Production Checklist

- [ ] PADDLE_ENVIRONMENT=production
- [ ] API Key започва с pdl_live
- [ ] Price IDs са production IDs
- [ ] Test Mode е включен в Paddle dashboard
- [ ] Акаунтът е верифициран
- [ ] Няма account restrictions

## Troubleshooting

### Ако все още получаваш 403:
1. **Провери Test Mode статуса** в Paddle dashboard
2. **Изчакай 5-10 минути** след активиране
3. **Провери account status** в Settings
4. **Свържи се с Paddle support** с request ID

### Ако Test Mode не се появява:
1. **Провери дали си в production** среда
2. **Увери се, че акаунтът е верифициран**
3. **Провери дали няма pending issues**

## Go Live (когато си готов)

Когато искаш да отидеш в реални плащания:
1. **Деактивирай Test Mode** в Paddle dashboard
2. **Тествай с малки суми** първо
3. **Мониторирай транзакциите** внимателно
4. **Имай backup план** за проблеми

---

**💡 Tip**: Test Mode е най-добрият начин да тестваш production плащания безопасно!
