# 🧪 Тестване на Supabase интеграцията

## Бързо тестване (5 минути)

### 1. **Провери environment variables**

```bash
# В root директорията на проекта
cat .env.local
```

Увери се, че имаш:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 2. **Стартирай development сървъра**

```bash
npm run dev
```

### 3. **Тествай регистрация**

1. Отиди на `http://localhost:3000`
2. Кликни "Sign Up" или "Get Started"
3. Попълни формата:
   - Email: `test@example.com`
   - Password: `password123`
   - Full Name: `Test User`
4. Кликни "Create Account"

**Очаквани резултати:**
- ✅ Успешна регистрация
- ✅ Автоматично създаване на профил
- ✅ Пренасочване към dashboard

### 4. **Тествай login**

1. Излез от акаунта (ако си логнат)
2. Кликни "Sign In"
3. Въведи:
   - Email: `test@example.com`
   - Password: `password123`
4. Кликни "Sign In"

**Очаквани резултати:**
- ✅ Успешен login
- ✅ Зареждане на потребителски данни
- ✅ Пренасочване към dashboard

### 5. **Провери в Supabase Dashboard**

1. Отиди в твоя Supabase проект
2. **Authentication → Users** - трябва да видиш новия потребител
3. **Table Editor → profiles** - трябва да видиш профила

## 🔍 Debug информация

### Провери browser console

Отвори Developer Tools (F12) и провери за грешки в Console таба.

### Провери Network tab

В Network таба провери дали Supabase заявките се изпълняват успешно.

### Провери Supabase logs

В Supabase Dashboard → Logs → Auth Logs провери дали има грешки.

## ❌ Често срещани проблеми

### "Missing Supabase environment variables"
```bash
# Решение: Провери .env.local файла
ls -la .env.local
```

### "Table doesn't exist"
```sql
-- В Supabase SQL Editor провери:
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

### "Profile not created"
```sql
-- Провери дали trigger съществува:
SELECT trigger_name FROM information_schema.triggers WHERE event_object_table = 'users';
```

## ✅ Успешна интеграция

Ако всичко работи, трябва да видиш:

1. ✅ Успешна регистрация без грешки
2. ✅ Автоматично създаване на профил в Supabase
3. ✅ Успешен login/logout
4. ✅ Правилно зареждане на потребителски данни
5. ✅ Работещ middleware (защита на routes)

## 🎯 Следващи стъпки

След успешна интеграция можеш да:

1. **Добавиш допълнителни полета** в профила
2. **Настроиш email confirmation** (ако искаш)
3. **Добавиш social login** (Google, GitHub)
4. **Настроиш subscription системата**
5. **Добавиш user progress tracking**

---

**Ако имаш проблеми**, провери:
- Environment variables са правилни
- SQL скриптът е изпълнен успешно
- Supabase проектът е активен
- Development сървърът е рестартиран след промените 