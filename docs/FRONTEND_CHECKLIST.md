# ✅ Frontend Developer Checklist

## 🚀 Migration to New API Structure

### Step 1: Understanding Changes
- [ ] Read [API_ENDPOINTS.md](API_ENDPOINTS.md)
- [ ] Reviewed [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- [ ] Studied [frontend-examples.js](frontend-examples.js)
- [ ] Understood the new path structure:
  - [ ] `/auth/*` for authentication
  - [ ] `/api/*` for all other requests

### Step 2: Find All API Calls in Project
- [ ] Opened project in editor
- [ ] Used search (Ctrl+Shift+F / Cmd+Shift+F)
- [ ] Searched for: `axios.post`, `fetch(`, `.post(`, `http://`
- [ ] Created a list of all endpoints being used

### Step 3: Update Paths

#### Authentication
- [ ] Replaced `/GeneratePasswordForUser` → `/auth/generate-password`
- [ ] Added endpoint `/auth/verify-password` for code verification
- [ ] Updated `/auth` → `/auth/auth` (if used)

#### API Requests
- [ ] Replaced `/GetUserInfo` → `/api/GetUserInfo`
- [ ] Replaced `/UpdateProfile` → `/api/UpdateProfile`
- [ ] Replaced `/GetTransportList` → `/api/GetTransportList`
- [ ] Replaced all others `/:endpoint` → `/api/:endpoint`

### Step 4: Create Configuration File (recommended)
- [ ] Created file `src/config/api.js` or `src/constants/api.js`
- [ ] Added base URL
- [ ] Added all endpoints as constants
- [ ] Replaced hardcoded paths with constants

**Example structure:**
```javascript
// src/config/api.js
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8888',
  ENDPOINTS: {
    GENERATE_PASSWORD: '/auth/generate-password',
    VERIFY_PASSWORD: '/auth/verify-password',
    GET_USER_INFO: '/api/GetUserInfo',
    // ...
  }
};
```

### Step 5: Update axios/fetch Calls
- [ ] Imported config to needed files
- [ ] Replaced hardcoded URLs with constants
- [ ] Verified all imports work

### Step 6: Testing

#### Local Testing
- [ ] Started backend server (`npm run dev`)
- [ ] Verified server is working: `http://localhost:8888/health`
- [ ] Started frontend
- [ ] Tested SMS code sending
- [ ] Tested SMS code verification
- [ ] Tested other API calls

#### DevTools Verification
- [ ] Opened Network tab in browser
- [ ] Verified requests go to correct URLs
- [ ] Verified no 404 errors
- [ ] Verified request/response format

### Step 7: Error Handling
- [ ] Added error handling for all API calls
- [ ] Show user-friendly error messages
- [ ] Log errors to console for debugging

### Step 8: Improvements (optional)

#### Create API Service
- [ ] Created separate file for API requests
- [ ] Using axios instance
- [ ] Centralized error handling

**Example:**
```javascript
// src/services/api.js
import axios from 'axios';

const authAPI = axios.create({
  baseURL: 'http://localhost:8888/auth'
});

export const authService = {
  generatePassword: (phone) => 
    authAPI.post('/generate-password', { data: { PhoneNumber: phone } }),
  verifyPassword: (phone, code) =>
    authAPI.post('/verify-password', { data: { phoneNumber: phone, password: code } })
};
```

#### Add TypeScript Types
- [ ] Created interfaces for request/response
- [ ] Added typing for API functions

#### Add React Query / SWR (for React)
- [ ] Configured React Query / SWR
- [ ] Created hooks for API requests
- [ ] Added caching

### Step 9: Documentation
- [ ] Updated project README
- [ ] Added comments to API functions
- [ ] Documented changes for team

### Step 10: Deployment
- [ ] Updated environment variables for production
- [ ] Changed BASE_URL to production URL
- [ ] Tested on staging
- [ ] Deployed to production

---

## 📋 Quick Reference

### What to Change in Code

#### React
```jsx
// ❌ Before
await axios.post('http://localhost:8888/GeneratePasswordForUser', {...})

// ✅ After
await axios.post('http://localhost:8888/auth/generate-password', {...})
```

#### Vue
```javascript
// ❌ Before
this.$http.post('/GetUserInfo', {...})

// ✅ After
this.$http.post('/api/GetUserInfo', {...})
```

#### Angular
```typescript
// ❌ Before
this.http.post(`${this.apiUrl}/UpdateProfile`, data)

// ✅ After
this.http.post(`${this.apiUrl}/api/UpdateProfile`, data)
```

---

## 🆘 Help

### If something doesn't work:

1. **Check browser console** - any errors?
2. **Check Network tab** - which URL is being requested?
3. **Check backend logs** - what does server say?
4. **Check data format** - does structure match `{ data: {...} }`?

### Common Errors:

❌ **404 Not Found** 
→ Check that you're using new paths with `/auth/` or `/api/`

❌ **400 Bad Request "Missing required data"**
→ Check that data is wrapped in `{ data: {...} }`

❌ **CORS Error**
→ Check CORS settings on backend or use proxy

❌ **500 Internal Server Error**
→ Check backend logs, possible issue with .env

---

## 📞 Contact

If you have questions:
- Check documentation in `/docs`
- Check examples in `frontend-examples.js`
- Import Postman collection for testing
