# 🗺️ API Routes Map

## Visual schema of new structure

```
http://localhost:8888
│
├── 🏥 /health (GET)
│   └── Check server is working
│
├── 🔐 /auth
│   ├── POST /auth/auth
│   │   └── Main authentication
│   │
│   ├── POST /auth/generate-password
│   │   └── Generate and send SMS code
│   │   └── Saves code for 5 minutes
│   │
│   └── POST /auth/verify-password
│       └── Verify SMS code
│       └── Deletes code after verification
│
└── 🚀 /api
    └── POST /api/:endpoint
        ├── /api/GetUserInfo
        ├── /api/UpdateProfile
        ├── /api/GetTransportList
        └── /api/any_other_endpoint
```

## 🔄 Flow diagram: SMS Authorization

```
┌─────────────┐
│  Frontend   │
└──────┬──────┘
       │
       │ 1. POST /auth/generate-password
       │    { data: { PhoneNumber: "+972..." } }
       ▼
┌─────────────┐
│   Backend   │──────┐ Saves code
└──────┬──────┘      │ in passwordStorage
       │             │ (5 minutes)
       │ Response    │
       │ { status: "success" }
       ▼             ▼
┌─────────────┐  ┌─────────┐
│  Frontend   │  │  SMS    │
│ (waiting    │  │ sent
│ for code)   │  │
└──────┬──────┘  └─────────┘
       │
       │ 2. User enters code
       │
       │ 3. POST /auth/verify-password
       │    { data: { phoneNumber: "+972...", password: "123456" } }
       ▼
┌─────────────┐
│   Backend   │──────┐ Verifies code
└──────┬──────┘      │ Deletes after verification
       │             │
       │ Response    │
       │ { status: "success" } or { status: "error" }
       ▼
┌─────────────┐
│  Frontend   │
│ (authorized)
└─────────────┘
```

## 📊 Comparison: Before vs After

### ❌ Old structure (flat)
```
/
├── GeneratePasswordForUser
├── auth
├── GetUserInfo
├── UpdateProfile
└── GetTransportList
```
**Problems:**
- No organization
- Hard to scale
- Unclear structure

### ✅ New structure (modular)
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
**Advantages:**
- ✅ Logical grouping
- ✅ Easy to scale
- ✅ Clear architecture
- ✅ REST best practices

## 🎯 What needs to be changed on frontend

### API configuration file (recommended)

**Create:** `src/config/api.js`

```javascript
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8888',
  ENDPOINTS: {
    // Authentication
    AUTH: '/auth/auth',
    GENERATE_PASSWORD: '/auth/generate-password',
    VERIFY_PASSWORD: '/auth/verify-password',
    
    // API
    GET_USER_INFO: '/api/GetUserInfo',
    UPDATE_PROFILE: '/api/UpdateProfile',
    GET_TRANSPORT_LIST: '/api/GetTransportList',
    // ... add the rest
  }
};
```

### Find and replace in project

```bash
# Find all places where old API is used
# Search in VSCode: Ctrl+Shift+F

# Search for:
/GeneratePasswordForUser
/GetUserInfo
/UpdateProfile

# Replace with:
/auth/generate-password
/api/GetUserInfo
/api/UpdateProfile
```

## 📱 Mobile app (React Native)

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

## 🧪 Testing via Postman/curl

### 1. Generate SMS
```bash
curl -X POST http://localhost:8888/auth/generate-password \
  -H "Content-Type: application/json" \
  -d '{"data": {"PhoneNumber": "+972501234567"}}'
```

### 2. Verify code
```bash
curl -X POST http://localhost:8888/auth/verify-password \
  -H "Content-Type: application/json" \
  -d '{"data": {"phoneNumber": "+972501234567", "password": "123456"}}'
```

### 3. API request
```bash
curl -X POST http://localhost:8888/api/GetUserInfo \
  -H "Content-Type: application/json" \
  -d '{"data": {"UserId": "123"}}'
```

### 4. Health check
```bash
curl http://localhost:8888/health
```
