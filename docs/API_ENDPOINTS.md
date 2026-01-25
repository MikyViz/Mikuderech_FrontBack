# API Endpoints Documentation

## 📝 Изменения в путях API

### ⚠️ ВАЖНО для фронтенда!
Все пути были реорганизованы с новой архитектурой. Теперь API разделен на логические группы.

---

## 🔐 Аутентификация (`/auth`)

### 1. Генерация SMS-кода
**Старый путь:** `POST /GeneratePasswordForUser`  
**Новый путь:** `POST /auth/generate-password`

**Описание:** Генерирует и отправляет SMS-код на телефон пользователя

**Request:**
```json
{
  "data": {
    "PhoneNumber": "+972501234567"
  }
}
```

**Response (успех):**
```json
{
  "status": "success",
  "message": "Код отправлен. Ожидайте SMS."
}
```

**Response (ошибка):**
```json
{
  "status": "error",
  "message": "Не удалось сгенерировать код"
}
```

---

### 2. Проверка SMS-кода
**Путь:** `POST /auth/verify-password`

**Описание:** Проверяет введенный пользователем SMS-код

**Request:**
```json
{
  "data": {
    "phoneNumber": "+972501234567",
    "password": "123456"
  }
}
```

**Response (успех):**
```json
{
  "status": "success",
  "message": "Код подтвержден"
}
```

**Response (ошибка):**
```json
{
  "status": "error",
  "message": "Неверный код" // или "Код истек. Запросите новый код."
}
```

---

### 3. Аутентификация
**Путь:** `POST /auth/auth`

**Описание:** Основная аутентификация пользователя

**Request:**
```json
{
  "data": {
    // данные для аутентификации
  }
}
```

---

## 🚀 API проксирование (`/api`)

### Общий endpoint для всех API запросов
**Старый путь:** `POST /:endpoint`  
**Новый путь:** `POST /api/:endpoint`

**Примеры:**
- `POST /api/GetUserInfo` (было `POST /GetUserInfo`)
- `POST /api/UpdateProfile` (было `POST /UpdateProfile`)
- `POST /api/GetTransportList` (было `POST /GetTransportList`)

**Request:**
```json
{
  "data": {
    // ваши данные
  }
}
```

**Response:** Возвращает ответ от внешнего API без изменений

---

## 🏥 Health Check

**Путь:** `GET /health`

**Описание:** Проверка работоспособности сервера

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## 🔄 Миграция с фронтенда

### Примеры изменений в коде:

#### До:
```javascript
// Генерация пароля
await axios.post('http://localhost:8888/GeneratePasswordForUser', {
  data: { PhoneNumber: phone }
});

// Другие API запросы
await axios.post('http://localhost:8888/GetUserInfo', {
  data: { UserId: userId }
});
```

#### После:
```javascript
// Генерация пароля
await axios.post('http://localhost:8888/auth/generate-password', {
  data: { PhoneNumber: phone }
});

// Другие API запросы
await axios.post('http://localhost:8888/api/GetUserInfo', {
  data: { UserId: userId }
});
```

---

## 📋 Полная таблица миграции путей

| Функция | Старый путь | Новый путь |
|---------|-------------|------------|
| Генерация SMS | `POST /GeneratePasswordForUser` | `POST /auth/generate-password` |
| Проверка SMS | ➕ Новый | `POST /auth/verify-password` |
| Аутентификация | `POST /auth` | `POST /auth/auth` |
| Все остальные API | `POST /:endpoint` | `POST /api/:endpoint` |

---

## 💡 Рекомендации

1. **Базовый URL:** Создайте константу для базового URL
   ```javascript
   const API_BASE_URL = 'http://localhost:8888';
   ```

2. **Axios instance:** Используйте axios instance для удобства
   ```javascript
   const authAPI = axios.create({
     baseURL: `${API_BASE_URL}/auth`
   });
   
   const apiClient = axios.create({
     baseURL: `${API_BASE_URL}/api`
   });
   ```

3. **Централизованный API сервис:**
   ```javascript
   // services/api.js
   export const authService = {
     generatePassword: (phone) => 
       authAPI.post('/generate-password', { data: { PhoneNumber: phone } }),
     
     verifyPassword: (phone, password) =>
       authAPI.post('/verify-password', { data: { phoneNumber: phone, password } })
   };
   
   export const apiService = {
     call: (endpoint, data) =>
       apiClient.post(`/${endpoint}`, { data })
   };
   ```

---

## ⏱️ Временные ограничения

- **SMS-код действителен:** 5 минут
- **Очистка старых кодов:** каждую минуту
