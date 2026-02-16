# Mikuderech Backend - Project Architecture

## Project Structure

```
Mikuderech_FrontBack/
├── config/                    # Configuration files
│   ├── config.js             # Main application configuration
│   └── firebase-config.js    # Firebase configuration
│
├── routes/                    # Application routes
│   ├── index.js              # Main router
│   ├── auth/                 # Authentication
│   │   ├── authRoutes.js     # Authentication routes
│   │   ├── authController.js # Authentication controller
│   │   └── passwordController.js # Password/SMS controller
│   └── api/                  # API routes
│       ├── index.js          # API router
│       ├── apiRoutes.js      # General API routes
│       └── transportRoutes.js # Transport routes
│
├── middleware/               # Middleware functions
│   ├── index.js             # Export all middleware
│   ├── auth.js              # Authentication middleware
│   └── validation.js        # Validation middleware
│
├── services/                # Business logic and services
│   ├── apiService.js       # Service for external API
│   ├── firebaseService.js  # Firebase service
│   ├── userService.js      # User service
│   └── passwordService.js  # Password/SMS codes service
│
├── utils/                   # Utilities and helper functions
│   └── errorHandler.js     # Error handler
│
├── docs/                    # Documentation
├── logs/                    # Application logs
├── scripts/                 # Scripts for various tasks
│   └── admin/              # Admin scripts
│
├── server.js               # Application entry point
└── package.json            # Dependencies and scripts

```

## Component Description

### Server.js
Main application file. Configures Express, connects middleware and routes.

### Routes
All routes are divided by functionality:
- **auth/** - User authentication, SMS code generation and verification
- **api/** - Proxying requests to external API

### Services
Contains business logic:
- **passwordService.js** - Managing temporary verification codes (storage and cleanup)
- **apiService.js** - Working with external API
- **firebaseService.js** - Firebase integration

### Middleware
- **auth.js** - Token verification and authorization
- **validation.js** - Validation of incoming data

## API Endpoints

### 📚 Complete API Documentation
- **[API_ENDPOINTS.md](docs/API_ENDPOINTS.md)** - Detailed documentation of all endpoints
- **[QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)** - Quick reference for frontend
- **[frontend-examples.js](docs/frontend-examples.js)** - Code examples for integration

### Authentication (`/auth`)
- `POST /auth/auth` - User authentication
- `POST /auth/generate-password` - SMS code generation and sending
- `POST /auth/verify-password` - Verification of entered SMS code

### API (`/api`)
- `POST /api/:endpoint` - Proxying requests to external API
  - Example: `POST /api/GetUserInfo`
  - Example: `POST /api/UpdateProfile`

### Health Check
- `GET /health` - Server health check

### ⚠️ Migration from Previous Version
If you used old paths, update them:
- `POST /GeneratePasswordForUser` → `POST /auth/generate-password`
- `POST /:endpoint` → `POST /api/:endpoint`

## Architecture Principles

1. **Separation of Concerns** - Each module is responsible for its functionality
2. **Modularity** - Easy to add new features
3. **Scalability** - Structure supports project growth
4. **Readability** - Clear file organization

## Running the Project

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production
npm start
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
API_BASE_URL=your_api_url
API_USERNAME=your_username
API_PASSWORD=your_password
API_USERID=your_user_id
NODE_ENV=development
```
