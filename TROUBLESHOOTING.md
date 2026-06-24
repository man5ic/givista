# 🔧 Troubleshooting Guide - "Site Not Reached"

## Quick Fixes for Connection Issues

### Step 1: Check if Backend is Running

**Check terminal output:**
- You should see: `🚀 Server is running on http://localhost:3000`
- If you see errors, note them down

**Common Issues:**

1. **Database Connection Error:**
   - Error: `ER_ACCESS_DENIED_ERROR` or `ECONNREFUSED`
   - **Fix:** Create `backend/.env` file with MySQL credentials

2. **Port Already in Use:**
   - Error: `Port 3000 already in use`
   - **Fix:** Change `PORT=3001` in `.env` or kill the process using port 3000

3. **TypeScript Error:**
   - Error: `TSError: Unable to compile TypeScript`
   - **Fix:** Should be fixed now, but if it persists, check `auth.util.ts`

---

### Step 2: Verify Backend is Running

**Test Backend Health:**
1. Open browser: `http://localhost:3000/health`
2. **Expected:** Should see JSON response
3. **If not working:** Backend isn't running

---

### Step 3: Check Frontend

**If frontend shows "Site Not Reached":**

1. **Check if frontend server is running:**
   - Should see: `➜  Local:   http://localhost:5173/`
   - If not, start it: `cd frontend && npm run dev`

2. **Check .env file exists:**
   - File: `frontend/.env`
   - Should contain: `VITE_API_BASE_URL=http://localhost:3000/api/v1`

3. **Backend must be running first!**
   - Frontend needs backend to work
   - Start backend BEFORE frontend

---

## Complete Startup Sequence

**Follow this order:**

### Terminal 1: Backend
```powershell
cd C:\Users\MANSI\Downloads\givista\givista\backend
# Create .env file first (if not exists)
npm run dev
```
**Wait until you see:** `🚀 Server is running on http://localhost:3000`

### Terminal 2: Frontend
```powershell
cd C:\Users\MANSI\Downloads\givista\givista\frontend
# Create .env file first (if not exists)
npm run dev
```
**Wait until you see:** `➜  Local:   http://localhost:5173/`

### Terminal 3: AI Service (Optional for now)
```powershell
cd C:\Users\MANSI\Downloads\givista\givista\ai_service
venv\Scripts\activate
python app.py
```

---

## Create Missing .env Files

### Backend .env (REQUIRED)
Create: `givista/backend/.env`
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=givista_db
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD

JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

PORT=3000
NODE_ENV=development

AI_SERVICE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

### Frontend .env (REQUIRED)
Create: `givista/frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_AI_SERVICE_URL=http://localhost:5000
```

---

## Quick Tests

### Test 1: Backend Health
```powershell
# In browser or use curl:
http://localhost:3000/health
```
**Expected:** `{"success": true, "message": "Givista API is running"}`

### Test 2: Frontend Landing Page
```powershell
# In browser:
http://localhost:5173
```
**Expected:** See "Welcome to Givista" page

---

## Still Not Working?

1. **Check all terminals are still running**
2. **Check no error messages in terminals**
3. **Verify ports are correct** (3000 for backend, 5173 for frontend)
4. **Check Windows Firewall** isn't blocking ports
5. **Try different browser** or clear cache

---

## Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| "Site not reached" | Server not running | Start backend/frontend |
| "ERR_CONNECTION_REFUSED" | Backend not running | Start backend first |
| "CORS error" | Backend not running | Start backend |
| "Database connection failed" | MySQL not running | Start MySQL service |

---

## Need More Help?

Check the detailed guides:
- `TESTING_GUIDE.md` - Complete testing instructions
- `SETUP_GUIDE.md` - Step-by-step setup
- `README.md` - Full documentation

