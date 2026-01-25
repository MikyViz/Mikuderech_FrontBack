# 🗺️ API Routes Map

## Визуальная схема новой структуры

```
http://localhost:8888
│
├── 🏥 /health (GET)
│   └── Проверка работы сервера
│
├── 🔐 /auth
│   ├── POST /auth/auth
│   │   └── Основная аутентификация
│   │
│   ├── POST /auth/generate-password
│   │   └── Генерация и отправка SMS-кода
│   │   └── Сохраняет код на 5 минут
│   │
│   └── POST /auth/verify-password
│       └── Проверка SMS-кода
│       └── Удаляет код после проверки
│
└── 🚀 /api
    └── POST /api/:endpoint
        ├── /api/GetUserInfo
        ├── /api/UpdateProfile
        ├── /api/GetTransportList
        └── /api/любой_другой_endpoint
```

## 🔄 Flow диаграмма: Авторизация по SMS

```
┌─────────────┐
│  Frontend   │
└──────┬──────┘
       │
       │ 1. POST /auth/generate-password
       │    { data: { PhoneNumber: "+972..." } }
       ▼
┌─────────────┐
│   Backend   │──────┐ Сохраняет код
└──────┬──────┘      │ в passwordStorage
       │             │ (5 минут)
       │ Response    │
       │ { status: "success" }
       ▼             ▼
┌─────────────┐  ┌─────────┐
│  Frontend   │  │  SMS    │
│ (ждет код)  │  │ отправлен
└──────┬──────┘  └─────────┘
       │
       │ 2. Пользователь вводит код
       │
       │ 3. POST /auth/verify-password
       │    { data: { phoneNumber: "+972...", password: "123456" } }
       ▼
┌─────────────┐
│   Backend   │──────┐ Проверяет код
└──────┬──────┘      │ Удаляет после проверки
       │             │
       │ Response    │
       │ { status: "success" } или { status: "error" }
       ▼
┌─────────────┐
│  Frontend   │
│ (авторизован)
└─────────────┘
```

## 📊 Сравнение: Было vs Стало

### ❌ Старая структура (плоская)
```
/
├── GeneratePasswordForUser
├── auth
├── GetUserInfo
├── UpdateProfile
└── GetTransportList
```
**Проблемы:**
- Нет организации
- Сложно масштабировать
- Непонятная структура

### ✅ Новая структура (модульная)
```
/
├── health
├── auth/
│   ├── auth
│   ├── generate-password
│   └── verify-password
└── api/
    ├── GetUserInfo
    ├── UpdateProfile
    └── GetTransportList
```
**Преимущества:**
- ✅ Логическая группировка
- ✅ Легко масштабировать
- ✅ Понятная архитектура
- ✅ REST best practices

## 🎯 Что нужно изменить на фронтенде

### Файл конфигурации API (рекомендуется)

**Создать:** `src/config/api.js`

```javascript
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8888',
  ENDPOINTS: {
    // Аутентификация
    AUTH: '/auth/auth',
    GENERATE_PASSWORD: '/auth/generate-password',
    VERIFY_PASSWORD: '/auth/verify-password',
    
    // API
    GET_USER_INFO: '/api/GetUserInfo',
    UPDATE_PROFILE: '/api/UpdateProfile',
    GET_TRANSPORT_LIST: '/api/GetTransportList',
    // ... добавьте остальные
  }
};
```

### Поиск и замена в проекте

```bash
# Найти все места, где используется старый API
# Поиск в VSCode: Ctrl+Shift+F

# Искать:
/GeneratePasswordForUser
/GetUserInfo
/UpdateProfile

# Заменить на:
/auth/generate-password
/api/GetUserInfo
/api/UpdateProfile
```

## 📱 Мобильное приложение (React Native)

```javascript
// config/api.js
const API_BASE = 'http://your-server.com:8888';

export const API = {
  // Auth
  sendSMS: `${API_BASE}/auth/generate-password`,
  verifyCode: `${API_BASE}/auth/verify-password`,
  login: `${API_BASE}/auth/auth`,
  
  // Generic API call
  call: (endpoint) => `${API_BASE}/api/${endpoint}`
};
```

## 🧪 Тестирование через Postman/curl

### 1. Генерация SMS
```bash
curl -X POST http://localhost:8888/auth/generate-password \
  -H "Content-Type: application/json" \
  -d '{"data": {"PhoneNumber": "+972501234567"}}'
```

### 2. Проверка кода
```bash
curl -X POST http://localhost:8888/auth/verify-password \
  -H "Content-Type: application/json" \
  -d '{"data": {"phoneNumber": "+972501234567", "password": "123456"}}'
```

### 3. API запрос
```bash
curl -X POST http://localhost:8888/api/GetUserInfo \
  -H "Content-Type: application/json" \
  -d '{"data": {"UserId": "123"}}'
```

### 4. Health check
```bash
curl http://localhost:8888/health
```
