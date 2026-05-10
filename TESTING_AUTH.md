# Quick Authentication Test Guide

## Prerequisites
1. PostgreSQL running on `localhost:5433`
2. Backend running on `http://localhost:8080`
3. Frontend running on `http://localhost:5173`

## Test Cases

### Test 1: Email/Password Login
1. Open `http://localhost:5173/login`
2. Register a new account:
   - Email: `test@example.com`
   - Password: `Test@1234`
   - Full Name: `Test User`
3. You should be redirected to dashboard after successful registration
4. Click "Back to Home" to return to login page
5. Try logging in with the same credentials

**Expected Result**: Should successfully log in and see dashboard

### Test 2: Google OAuth Login
1. Open `http://localhost:5173/login`
2. Click "Continue with Google"
3. You'll see Google OAuth dialog
4. Sign in with your Google account
5. You should be redirected to dashboard

**Expected Result**: Should successfully log in via Google

## Troubleshooting

### Google Login Shows "Uncaught AxiosError: 500"
**Cause**: Backend configuration issue

**Check**:
1. Verify backend logs for `googleLogin` errors
2. Confirm `GOOGLE_CLIENT_ID` is set in `application.yml` (line ~65)
3. Restart backend after configuration changes

**Fix**:
```bash
# Backend/src/main/resources/application.yml should have:
app:
  google:
    client-id: 339374223627-lptj3pivl7ql3saliv7prlr8n67ce9g7.apps.googleusercontent.com  # ✓ Has default
  jwt:
    secret: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970  # ✓ Has default
```

### Email Login Shows "Invalid email or password"
**Cause**: User not registered or credentials incorrect

**Check**:
1. Verify user exists in database
2. Ensure email/password are correct
3. Check if registration was successful first

### CORS Error: "Cross-Origin-Opener-Policy policy would block"
**Cause**: Browser security policy

**Note**: This warning can be safely ignored for localhost development. It doesn't block the actual request.

## Backend Logs
To see what's happening on the backend, check logs:
```bash
# If running with Maven:
mvn spring-boot:run

# Look for lines like:
# - "User logged in: test@example.com"
# - "New user registered via Google: user@gmail.com"
# - "Google authentication failed: ..." (if there's an issue)
```

## Database Check
Verify users are being created:
```bash
psql -h localhost -p 5433 -U postgres -d traveloop

# Then:
SELECT id, email, full_name, created_at FROM "user" ORDER BY created_at DESC;
```

## API Testing
Test endpoints manually using curl or Postman:

### Register
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234",
    "fullName": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'
```

### Google Login
```bash
curl -X POST http://localhost:8080/auth/google-login \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "<ACTUAL_ID_TOKEN_FROM_GOOGLE>"
  }'
```

### Get Current User (requires JWT)
```bash
curl -X GET http://localhost:8080/auth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## Success Indicators

✅ **Registration successful**:
- User created in database
- JWT tokens returned
- Redirected to dashboard

✅ **Email login successful**:
- Password validated correctly
- JWT tokens returned
- User info displayed in dashboard

✅ **Google login successful**:
- Google ID token verified
- User created/updated in database
- JWT tokens returned
- Profile photo loaded from Google

## Configuration Verification Checklist

- [ ] `backend/src/main/resources/application.yml` has default `JWT_SECRET`
- [ ] `backend/src/main/resources/application.yml` has default `GOOGLE_CLIENT_ID`
- [ ] `frontend/.env` has `VITE_API_URL=http://localhost:8080`
- [ ] `frontend/.env` has `VITE_GOOGLE_CLIENT_ID`
- [ ] PostgreSQL is running and accessible
- [ ] Backend is running and accessible
- [ ] Frontend is running and accessible

All items checked? You're ready to test! 🚀
