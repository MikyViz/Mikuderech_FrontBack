# 🎯 Инструкция для фронтенда - КОРОТКО И ЯСНО

## ⚠️ ЧТО ИЗМЕНИЛОСЬ

Сервер был реорганизован. **ВСЕ ПУТИ API ИЗМЕНИЛИСЬ!**

---

## 📝 ТАБЛИЦА ИЗМЕНЕНИЙ

| Было | Стало | Описание |
|------|-------|----------|
| `POST /GeneratePasswordForUser` | `POST /auth/generate-password` | Отправка SMS-кода |
| ➕ **Новый** | `POST /auth/verify-password` | Проверка SMS-кода |
| `POST /auth` | `POST /auth/auth` | Аутентификация |
| `POST /GetUserInfo` | `POST /api/GetUserInfo` | API запросы |
| `POST /UpdateProfile` | `POST /api/UpdateProfile` | API запросы |
| `POST /:endpoint` | `POST /api/:endpoint` | Все остальные API |

---

## 🔧 ЧТО НУЖНО СДЕЛАТЬ

### 1️⃣ SMS Авторизация

#### Отправка кода
```javascript
// ❌ СТАРЫЙ КОД - УДАЛИТЬ
axios.post('http://localhost:8888/GeneratePasswordForUser', {
  data: { PhoneNumber: "+972501234567" }
})

// ✅ НОВЫЙ КОД - ИСПОЛЬЗОВАТЬ
axios.post('http://localhost:8888/auth/generate-password', {
  data: { PhoneNumber: "+972501234567" }
})
```

#### Проверка кода (НОВЫЙ ENDPOINT!)
```javascript
// ✅ ДОБАВИТЬ ЭТОТ КОД
axios.post('http://localhost:8888/auth/verify-password', {
  data: { 
    phoneNumber: "+972501234567",
    password: "123456"  // код из SMS
  }
})
```

### 2️⃣ Все остальные API запросы

```javascript
// ❌ БЫЛО
axios.post('http://localhost:8888/GetUserInfo', { data: {...} })
axios.post('http://localhost:8888/UpdateProfile', { data: {...} })

// ✅ СТАЛО - добавить /api/ перед endpoint
axios.post('http://localhost:8888/api/GetUserInfo', { data: {...} })
axios.post('http://localhost:8888/api/UpdateProfile', { data: {...} })
```

---

## 🚀 БЫСТРОЕ РЕШЕНИЕ

### Вариант А: Найти и заменить

В вашем редакторе (VSCode, WebStorm и т.д.):

**Поиск:** `http://localhost:8888/GeneratePasswordForUser`  
**Замена:** `http://localhost:8888/auth/generate-password`

**Поиск:** `http://localhost:8888/GetUserInfo`  
**Замена:** `http://localhost:8888/api/GetUserInfo`

И так далее для каждого endpoint...

### Вариант Б: Создать конфиг (РЕКОМЕНДУЕТСЯ)

**Создайте файл:** `src/config/api.js`

```javascript
const BASE_URL = 'http://localhost:8888';

export const API = {
  // Auth
  GENERATE_PASSWORD: `${BASE_URL}/auth/generate-password`,
  VERIFY_PASSWORD: `${BASE_URL}/auth/verify-password`,
  AUTH: `${BASE_URL}/auth/auth`,
  
  // API - добавьте все ваши endpoints
  GET_USER_INFO: `${BASE_URL}/api/GetUserInfo`,
  UPDATE_PROFILE: `${BASE_URL}/api/UpdateProfile`,
  GET_TRANSPORT: `${BASE_URL}/api/GetTransportList`,
  // ... остальные
};
```

**Используйте:**
```javascript
import { API } from './config/api';

// Вместо хардкод URL
axios.post(API.GENERATE_PASSWORD, { data: {...} })
```

---

## 📱 ПОЛНЫЙ ПРИМЕР: SMS Авторизация

```javascript
async function loginWithSMS() {
  const phone = "+972501234567";
  
  try {
    // 1. Отправить SMS-код
    const sendResponse = await axios.post(
      'http://localhost:8888/auth/generate-password',
      { data: { PhoneNumber: phone } }
    );
    
    if (sendResponse.data.status === 'success') {
      alert('SMS отправлен! Введите код.');
      
      // 2. Пользователь вводит код
      const code = prompt('Введите код из SMS:');
      
      // 3. Проверить код
      const verifyResponse = await axios.post(
        'http://localhost:8888/auth/verify-password',
        { data: { phoneNumber: phone, password: code } }
      );
      
      if (verifyResponse.data.status === 'success') {
        alert('Успешная авторизация!');
        // Переход в приложение
      } else {
        alert('Неверный код!');
      }
    }
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Произошла ошибка!');
  }
}
```

---

## ✅ ЧЕКЛИСТ

- [ ] Изменил `/GeneratePasswordForUser` → `/auth/generate-password`
- [ ] Добавил `/auth/verify-password` для проверки кода
- [ ] Изменил все API запросы: добавил `/api/` перед endpoint
- [ ] Протестировал отправку SMS
- [ ] Протестировал проверку кода
- [ ] Протестировал другие API вызовы
- [ ] Проверил, что нет 404 ошибок
- [ ] Все работает! 🎉

---

## 🆘 НЕ РАБОТАЕТ?

### 404 Not Found
→ Проверь, что используешь новые пути с `/auth/` или `/api/`

### 400 Bad Request
→ Проверь, что данные в формате `{ data: {...} }`

### Сервер не отвечает
→ Проверь, что backend запущен: `http://localhost:8888/health`

---

## 📚 ДОПОЛНИТЕЛЬНО

Полная документация в папке `/docs`:
- `API_ENDPOINTS.md` - подробная документация
- `QUICK_REFERENCE.md` - быстрая шпаргалка
- `frontend-examples.js` - больше примеров кода
- `ROUTES_MAP.md` - визуальная схема
- `Mikuderech_API.postman_collection.json` - для тестирования в Postman

---

## 💡 ВАЖНО

**Код будет действителен 5 минут!** После этого нужно запросить новый.

---

**Вопросы? Проблемы? Проверь документацию в `/docs` или посмотри логи сервера!**
