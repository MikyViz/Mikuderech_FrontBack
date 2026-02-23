# 🎯 Frontend Instructions - SHORT AND CLEAR

## ⚠️ WHAT CHANGED

The server was reorganized. **ALL API PATHS HAVE CHANGED!**

---

## 📝 TABLE OF CHANGES

| Before | After | Description |
|------|-------|----------|
| `POST /GeneratePasswordForUser` | `POST /auth/generate-password` | Send SMS code |
| ➕ **New** | `POST /auth/verify-password` | Verify SMS code |
| `POST /auth` | `POST /auth/auth` | Authentication |
| `POST /GetUserInfo` | `POST /api/GetUserInfo` | API requests |
| `POST /UpdateProfile` | `POST /api/UpdateProfile` | API requests |
| `POST /:endpoint` | `POST /api/:endpoint` | All other APIs |

---

## 🔧 WHAT TO DO

### 1️⃣ SMS Authorization

#### Send code
```javascript
// ❌ OLD CODE - REMOVE
axios.post('http://localhost:8888/GeneratePasswordForUser', {
  data: { PhoneNumber: "+972501234567" }
})

// ✅ NEW CODE - USE THIS
axios.post('http://localhost:8888/auth/generate-password', {
  data: { PhoneNumber: "+972501234567" }
})
```

#### Verify code (NEW ENDPOINT!)
```javascript
// ✅ ADD THIS CODE
axios.post('http://localhost:8888/auth/verify-password', {
  data: { 
    phoneNumber: "+972501234567",
    password: "123456"  // code from SMS
  }
})
```

### 2️⃣ All other API requests

```javascript
// ❌ BEFORE
axios.post('http://localhost:8888/GetUserInfo', { data: {...} })
axios.post('http://localhost:8888/UpdateProfile', { data: {...} })

// ✅ AFTER - add /api/ before endpoint
axios.post('http://localhost:8888/api/GetUserInfo', { data: {...} })
axios.post('http://localhost:8888/api/UpdateProfile', { data: {...} })
```

---

## 🚀 QUICK SOLUTION

### Option A: Find and replace

In your editor (VSCode, WebStorm, etc.):

**Search:** `http://localhost:8888/GeneratePasswordForUser`  
**Replace:** `http://localhost:8888/auth/generate-password`

**Search:** `http://localhost:8888/GetUserInfo`  
**Replace:** `http://localhost:8888/api/GetUserInfo`

And so on for each endpoint...

### Option B: Create config (RECOMMENDED)

**Create file:** `src/config/api.js`

```javascript
const BASE_URL = 'http://localhost:8888';

export const API = {
  // Auth
  GENERATE_PASSWORD: `${BASE_URL}/auth/generate-password`,
  VERIFY_PASSWORD: `${BASE_URL}/auth/verify-password`,
  AUTH: `${BASE_URL}/auth/auth`,
  
  // API - add all your endpoints
  GET_USER_INFO: `${BASE_URL}/api/GetUserInfo`,
  UPDATE_PROFILE: `${BASE_URL}/api/UpdateProfile`,
  GET_TRANSPORT: `${BASE_URL}/api/GetTransportList`,
  // ... others
};
```

**Use:**
```javascript
import { API } from './config/api';

// Instead of hardcoded URL
axios.post(API.GENERATE_PASSWORD, { data: {...} })
```

---

## 📱 COMPLETE EXAMPLE: SMS Authorization

```javascript
async function loginWithSMS() {
  const phone = "+972501234567";
  
  try {
    // 1. Send SMS code
    const sendResponse = await axios.post(
      'http://localhost:8888/auth/generate-password',
      { data: { PhoneNumber: phone } }
    );
    
    if (sendResponse.data.status === 'success') {
      alert('SMS sent! Enter code.');
      
      // 2. User enters code
      const code = prompt('Enter code from SMS:');
      
      // 3. Verify code
      const verifyResponse = await axios.post(
        'http://localhost:8888/auth/verify-password',
        { data: { phoneNumber: phone, password: code } }
      );
      
      if (verifyResponse.data.status === 'success') {
        alert('Successful authorization!');
        // Go to app
      } else {
        alert('Invalid code!');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred!');
  }
}
```

---

## ✅ CHECKLIST

- [ ] Changed `/GeneratePasswordForUser` → `/auth/generate-password`
- [ ] Added `/auth/verify-password` for code verification
- [ ] Changed all API requests: added `/api/` before endpoint
- [ ] Tested SMS sending
- [ ] Tested code verification
- [ ] Tested other API calls
- [ ] Verified no 404 errors
- [ ] Everything works! 🎉

---

## 🆘 NOT WORKING?

### 404 Not Found
→ Check that you're using new paths with `/auth/` or `/api/`

### 400 Bad Request
→ Check that data is in format `{ data: {...} }`

### Server not responding
→ Check that backend is running: `http://localhost:8888/health`

---

## 📚 ADDITIONAL

Full documentation in `/docs` folder:
- `API_ENDPOINTS.md` - detailed documentation
- `QUICK_REFERENCE.md` - quick cheatsheet
- `frontend-examples.js` - more code examples
- `ROUTES_MAP.md` - visual schema
- `Mikuderech_API.postman_collection.json` - for testing in Postman

---

## 💡 IMPORTANT

**Code will be valid for 5 minutes!** After that, you need to request a new one.

---

**Questions? Problems? Check documentation in `/docs` or look at server logs!**
