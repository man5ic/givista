# ⚡ Quick Start Guide - Run Your Project NOW!

Follow these steps in order:

---

## 🔴 CRITICAL: First, Check MySQL

### 1. Is MySQL Running?

**Windows:**
- Press `Win + R`, type `services.msc`, press Enter
- Look for "MySQL80" or "MySQL"
- Status should be "Running"
- If not, right-click → "Start"

### 2. Create Database

Open MySQL command line or MySQL Workbench:

```sql
CREATE DATABASE givista_db;
```

**Or via command line:**
```bash
mysql -u root -proot -e "CREATE DATABASE givista_db;"
```

---

## 🚀 Step-by-Step: Start All Services

### Terminal 1: Backend

1. Open PowerShell or Command Prompt
2. Navigate to backend folder:
   ```powershell
   cd "C:\Users\Amol Aaba Shelar\Downloads\givista (2)\givista\givista\backend"
   ```
3. Install dependencies (if not done):
   ```powershell
   npm install
   ```
4. Start server:
   ```powershell
   npm run dev
   ```

**✅ Success looks like:**
```
✅ Database connection established successfully.
✅ Database models synced.
🚀 Server is running on http://localhost:3000
```

**❌ If you see errors:**
- "Access denied" → Check MySQL password in `backend\.env`
- "Database doesn't exist" → Create database (see above)
- "MySQL service not running" → Start MySQL service

**Keep this terminal open!**

---

### Terminal 2: Frontend

1. Open a NEW PowerShell/Command Prompt window
2. Navigate to frontend folder:
   ```powershell
   cd "C:\Users\Amol Aaba Shelar\Downloads\givista (2)\givista\givista\frontend"
   ```
3. Install dependencies (if not done):
   ```powershell
   npm install
   ```
4. Start frontend:
   ```powershell
   npm run dev
   ```

**✅ Success looks like:**
```
  VITE v5.0.8  ready in 500 ms
  ➜  Local:   http://localhost:5173/
```

**Keep this terminal open!**

---

### Terminal 3: AI Service (Optional)

1. Open a NEW PowerShell/Command Prompt window
2. Navigate to AI service folder:
   ```powershell
   cd "C:\Users\Amol Aaba Shelar\Downloads\givista (2)\givista\givista\ai_service"
   ```
3. Activate virtual environment:
   ```powershell
   venv\Scripts\activate
   ```
   (You should see `(venv)` at the start of your prompt)

4. Start AI service:
   ```powershell
   python app.py
   ```

**✅ Success looks like:**
```
🚀 Starting Givista AI Service...
✅ Model trained and saved successfully
 * Running on http://127.0.0.1:5000
```

**Keep this terminal open!**

---

## ✅ Test Everything

### 1. Test Backend
Open browser: `http://localhost:3000/health`

Should see:
```json
{"success": true, "message": "Givista API is running"}
```

### 2. Test Frontend
Open browser: `http://localhost:5173`

Should see: Givista landing page

### 3. Test AI Service (if running)
Open browser: `http://localhost:5000/health`

Should see:
```json
{"status": "healthy", "service": "Givista AI Recommendation Service"}
```

---

## 🎯 Start Using the App!

1. **Go to:** `http://localhost:5173`
2. **Click:** "Become a Donor" or "Request Help"
3. **Sign up** with any email and password
4. **Create donations/requests** and explore!

---

## 🐛 Common Issues

### Backend won't start?

**Check MySQL:**
```powershell
mysql -u root -proot
```
If this works, your password is correct. If not, update `backend\.env` with correct password.

**Check database exists:**
```sql
SHOW DATABASES;
```
Make sure `givista_db` is in the list.

### Frontend won't start?

- Make sure backend is running first
- Check if port 5173 is already in use
- Try: `npm install` again

### Port already in use?

**Backend (port 3000):**
- Change `PORT=3001` in `backend\.env`
- Or kill the process: `taskkill /F /IM node.exe`

**Frontend (port 5173):**
- Vite will automatically use next available port

---

## 📝 Need Help?

- See `RUN_PROJECT.md` for detailed instructions
- See `TROUBLESHOOTING.md` for common fixes
- Check terminal output for error messages

---

**You're all set! Happy coding! 🚀**

