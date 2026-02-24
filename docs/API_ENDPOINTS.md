# API Endpoints Documentation

## 📝 API Path Changes

### ⚠️ IMPORTANT for frontend!
All paths have been reorganized with the new architecture. The API is now divided into logical groups.

---

## 🔐 Authentication (`/auth`)

### 1. SMS Code Generation
**Old path:** `POST /GeneratePasswordForUser`  
**New path:** `POST /auth/generate-password`

**Description:** Generates and sends SMS code to user's phone

**Request:**
```json
{
  "data": {
    "PhoneNumber": "+972501234567"
  }
}
```

**Response (success):**
```json
{
  "status": "success",
  "message": "Code sent. Please wait for SMS."
}
```

**Response (error):**
```json
{
  "status": "error",
  "message": "Failed to generate code"
}
```

---

### 2. SMS Code Verification
**Path:** `POST /auth/verify-password`

**Description:** Verifies the SMS code entered by the user

**Request:**
```json
{
  "data": {
    "phoneNumber": "+972501234567",
    "password": "123456"
  }
}
```

**Response (success):**
```json
{
  "status": "success",
  "message": "Code verified"
}
```

**Response (error):**
```json
{
  "status": "error",
  "message": "Invalid code" // or "Code expired. Request a new code."
}
```

---

### 3. Authentication
**Path:** `POST /auth/auth`

**Description:** Main user authentication

**Request:**
```json
{
  "data": {
    // authentication data
  }
}
```

---

## � Email (`/api/email`)

### Send Email to Support
**Path:** `POST /api/email/send`

**Description:** Sends email to support address. Email is formatted in Hebrew (RTL).

**Request:**
```json
{
  "message": "Message text here",
  "title": "Email subject (optional)",
  "userName": "Sender name (optional)",
  "userEmail": "sender@example.com (optional, for Reply-To)"
}
```

**Required fields:**
- `message` (string): Email body content (max 100,000 characters)

**Optional fields:**
- `title` (string): Email subject. If not provided, will be extracted from first line of message
- `userName` (string): Sender name to display in email
- `userEmail` (string): Sender email address for Reply-To header

**Response (success):**
```json
{
  "status": "success",
  "ok": true,
  "messageId": "<unique-message-id>"
}
```

**Response (error - missing message):**
```json
{
  "status": "error",
  "error": "נדרש תוכן הודעה"
}
```

**Response (error - message too large):**
```json
{
  "status": "error",
  "error": "ההודעה גדולה מדי"
}
```

**Response (error - send failed):**
```json
{
  "status": "error",
  "error": "שליחת אימייל נכשלה"
}
```

**Example usage:**
```javascript
// Send email with all fields
await axios.post('http://localhost:8888/api/email/send', {
  message: 'This is my message text',
  title: 'Contact Request',
  userName: 'John Doe',
  userEmail: 'john@example.com'
});

// Send email with only message (minimal)
await axios.post('http://localhost:8888/api/email/send', {
  message: 'My message here'
});
```

**Environment variables required:**
- `SMTP_HOST`: SMTP server hostname
- `SMTP_PORT`: SMTP server port (default: 587)
- `SMTP_SECURE`: Use secure connection (true/false, default: false)
- `SMTP_USER`: SMTP authentication username
- `SMTP_PASS`: SMTP authentication password
- `SMTP_FROM`: Sender email address
- `SMTP_TO`: Recipient email address
- `SMTP_SUBJECT`: Default subject if not provided

---

## �🚀 API Proxying (`/api`)

### General endpoint for all API requests
**Old path:** `POST /:endpoint`  
**New path:** `POST /api/:endpoint`

**Examples:**
- `POST /api/GetUserInfo` (was `POST /GetUserInfo`)
- `POST /api/UpdateProfile` (was `POST /UpdateProfile`)
- `POST /api/GetTransportList` (was `POST /GetTransportList`)

**Request:**
```json
{
  "data": {
    // your data
  }
}
```

**Response:** Returns response from external API without changes

---

## 🏥 Health Check

**Path:** `GET /health`

**Description:** Server health check

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## 🔄 Frontend Migration

### Code change examples:

#### Before:
```javascript
// Password generation
await axios.post('http://localhost:8888/GeneratePasswordForUser', {
  data: { PhoneNumber: phone }
});

// Other API requests
await axios.post('http://localhost:8888/GetUserInfo', {
  data: { UserId: userId }
});
```

#### After:
```javascript
// Password generation
await axios.post('http://localhost:8888/auth/generate-password', {
  data: { PhoneNumber: phone }
});

// Other API requests
await axios.post('http://localhost:8888/api/GetUserInfo', {
  data: { UserId: userId }
});
```

---

## 📋 Complete Path Migration Table

| Function | Old Path | New Path |
|---------|-------------|------------|
| SMS Generation | `POST /GeneratePasswordForUser` | `POST /auth/generate-password` |
| SMS Verification | ➕ New | `POST /auth/verify-password` |
| Authentication | `POST /auth` | `POST /auth/auth` |
| Send Email | ➕ New | `POST /api/email/send` |
| All other APIs | `POST /:endpoint` | `POST /api/:endpoint` |

---

## 💡 Recommendations

1. **Base URL:** Create a constant for the base URL
   ```javascript
   const API_BASE_URL = 'http://localhost:8888';
   ```

2. **Axios instance:** Use axios instance for convenience
   ```javascript
   const authAPI = axios.create({
     baseURL: `${API_BASE_URL}/auth`
   });
   
   const apiClient = axios.create({
     baseURL: `${API_BASE_URL}/api`
   });
   ```

3. **Centralized API service:**
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

## ⏱️ Time Limitations

- **SMS code validity:** 5 minutes
- **Old code cleanup:** every minute
