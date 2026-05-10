# Authentication Setup Guide

## Issues Fixed

### 1. **JWT_SECRET Missing**
- **Problem**: The `JWT_SECRET` environment variable had no default value in `application.yml`
- **Solution**: Added default value: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
- **File Modified**: `backend/src/main/resources/application.yml`

### 2. **Google Client ID Configuration**
- **Problem**: Google Client ID was empty string by default in `application.yml`
- **Solution**: Added default Google Client ID: `339374223627-lptj3pivl7ql3saliv7prlr8n67ce9g7.apps.googleusercontent.com`
- **Files Modified**: 
  - `backend/src/main/resources/application.yml`
  - `frontend/.env` (already had correct value)

### 3. **Frontend API Configuration**
- **Problem**: Frontend didn't have API URL explicitly configured
- **Solution**: Added `VITE_API_URL=http://localhost:8080` to frontend `.env`
- **File Modified**: `frontend/.env`

## Local Development Setup

### For Backend (Java/Spring Boot)

1. **Ensure Database is Running**
   ```bash
   # Using Docker Compose
   docker-compose up -d db
   ```

2. **Set Environment Variables (Optional)**
   Create a `.env` file in the backend root or set them in your IDE:
   ```
   JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
   GOOGLE_CLIENT_ID=339374223627-lptj3pivl7ql3saliv7prlr8n67ce9g7.apps.googleusercontent.com
   GEMINI_API_KEY=AIzaSyBijdj5aWLqdgYtSxIS_xMDqa5yMCFvy-4
   DB_HOST=localhost
   DB_PORT=5433
   DB_NAME=traveloop
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   CORS_ORIGINS=http://localhost:5173
   ```

3. **Run Backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   Backend will start on `http://localhost:8080`

### For Frontend (React/Vite)

1. **Frontend `.env` Already Configured**
   ```
   VITE_API_URL=http://localhost:8080
   VITE_GOOGLE_CLIENT_ID=339374223627-lptj3pivl7ql3saliv7prlr8n67ce9g7.apps.googleusercontent.com
   ```

2. **Run Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will start on `http://localhost:5173`

3. **Verify Proxy is Working**
   - Check `frontend/vite.config.js` has proxy for `/auth` and `/api` endpoints to `http://localhost:8080`

## Authentication Flow

### Email/Password Login
1. User enters credentials
2. Frontend sends POST to `/auth/login`
3. Backend validates credentials against database
4. Returns JWT tokens (access + refresh)
5. Frontend stores tokens in localStorage

### Google OAuth Login
1. User clicks Google Login button
2. Google OAuth dialog opens
3. User authenticates with Google
4. Google returns ID Token
5. Frontend sends ID Token to `/auth/google-login`
6. Backend verifies token with Google's servers
7. Backend creates/updates user in database
8. Returns JWT tokens

## Troubleshooting

### Error: "Google Sign-In is not configured on the server"
- ✅ **Fixed**: Added default `GOOGLE_CLIENT_ID` to `application.yml`
- Verify: `application.yml` has the Google Client ID configured

### Error: "401 Unauthorized" on protected routes
- Check that JWT token is being sent in Authorization header
- Check `frontend/src/services/api.js` has JWT interceptor

### CORS Issues
- Verify `CORS_ORIGINS` includes frontend URL
- Check `frontend/vite.config.js` has proxy rules for `/auth` and `/api`

### Database Connection Errors
- Ensure PostgreSQL is running on `localhost:5433`
- Verify credentials: `postgres:postgres`
- Check database `traveloop` exists

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Email/password login
- `POST /auth/google-login` - Google OAuth login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user (requires JWT)

## Configuration Files

### Backend
- `backend/src/main/resources/application.yml` - Main configuration with defaults
- `backend/pom.xml` - Dependencies including JWT, Google API, PostgreSQL

### Frontend
- `frontend/.env` - Environment variables
- `frontend/vite.config.js` - Vite config with dev proxy
- `frontend/src/main.jsx` - Google OAuth Provider initialization
- `frontend/src/services/authService.js` - Auth API calls
- `frontend/src/store/authStore.js` - Auth state management

## Next Steps

1. ✅ Start PostgreSQL database
2. ✅ Start backend on port 8080
3. ✅ Start frontend on port 5173
4. Try logging in with test credentials
5. Try Google OAuth login

All authentication issues should now be resolved!
