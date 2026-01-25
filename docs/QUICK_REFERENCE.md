# 🚀 Quick Reference - Новые пути API

## Для фронтенда - изменить URL в этих запросах:

### ❌ Старые пути → ✅ Новые пути

```javascript
// 1. ГЕНЕРАЦИЯ SMS-КОДА
❌ POST /GeneratePasswordForUser
✅ POST /auth/generate-password

// 2. ПРОВЕРКА SMS-КОДА (новый endpoint)
✅ POST /auth/verify-password

// 3. АУТЕНТИФИКАЦИЯ
❌ POST /auth
✅ POST /auth/auth

// 4. ВСЕ ОСТАЛЬНЫЕ API ЗАПРОСЫ
❌ POST /GetUserInfo
✅ POST /api/GetUserInfo

❌ POST /UpdateProfile
✅ POST /api/UpdateProfile

❌ POST /любой_endpoint
✅ POST /api/любой_endpoint
```

## 📝 Правило простое:

1. **Аутентификация и SMS** → добавить префикс `/auth/`
2. **Все остальные API** → добавить префикс `/api/`

## 🔧 Быстрый фикс в коде:

```javascript
// Найти и заменить:
const baseURL = 'http://localhost:8888';

// Было:
axios.post(`${baseURL}/GeneratePasswordForUser`, ...)
// Стало:
axios.post(`${baseURL}/auth/generate-password`, ...)

// Было:
axios.post(`${baseURL}/GetUserInfo`, ...)
// Стало:
axios.post(`${baseURL}/api/GetUserInfo`, ...)
```

## 📌 Health Check:
```
GET /health - проверка работы сервера
```
