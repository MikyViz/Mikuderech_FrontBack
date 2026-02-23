# 🚀 Quick Reference - New API Paths

## For frontend - change URLs in these requests:

### ❌ Old paths → ✅ New paths

```javascript
// 1. SMS CODE GENERATION
❌ POST /GeneratePasswordForUser
✅ POST /auth/generate-password

// 2. SMS CODE VERIFICATION (new endpoint)
✅ POST /auth/verify-password

// 3. AUTHENTICATION
❌ POST /auth
✅ POST /auth/auth

// 4. ALL OTHER API REQUESTS
❌ POST /GetUserInfo
✅ POST /api/GetUserInfo

❌ POST /UpdateProfile
✅ POST /api/UpdateProfile

❌ POST /any_endpoint
✅ POST /api/any_endpoint
```

## 📝 Simple rule:

1. **Authentication and SMS** → add prefix `/auth/`
2. **All other APIs** → add prefix `/api/`

## 🔧 Quick fix in code:

```javascript
// Find and replace:
const baseURL = 'http://localhost:8888';

// Was:
axios.post(`${baseURL}/GeneratePasswordForUser`, ...)
// Became:
axios.post(`${baseURL}/auth/generate-password`, ...)

// Was:
axios.post(`${baseURL}/GetUserInfo`, ...)
// Became:
axios.post(`${baseURL}/api/GetUserInfo`, ...)
```

## 📌 Health Check:
```
GET /health - check server is working
```
