# 🎯 Step-by-Step Setup Guide - Your Password: Amol@2005

## ✅ Step 1: Database Setup - COMPLETED!

✅ Your MySQL password is set: `Amol@2005`
✅ Database `givista_db` has been created
✅ Backend .env file updated with your password

---

## 🚀 Step 2: Start Backend Server

### Open Terminal 1 (Backend)

1. **Open PowerShell or Command Prompt**

2. **Navigate to backend folder:**
   ```powershell
   cd "C:\Users\Amol Aaba Shelar\Downloads\givista (2)\givista\givista\backend"
   ```

3. **Check if dependencies are installed:**
   ```powershell
   dir node_modules
   ```
   If you see "Directory not found", run:
   ```powershell
   npm install
   ```

4. **Start the backend server:**
   ```powershell
   npm run dev
   ```

### ✅ What You Should See:

```
✅ Database connection established successfully.
✅ Database models synced.
🚀 Server is running on http://localhost:3000
📝 Health check: http://localhost:3000/health
```

**🎉 If you see this, your backend is working!**

**⚠️ If you see errors:**
- "Access denied" → The password might be wrong, double-check
- "Cannot connect" → MySQL service might not be running
- "Database doesn't exist" → Run: `mysql -u root -pAmol@2005 -e "CREATE DATABASE givista_db;"`

**Keep this terminal open!**

---

## 🎨 Step 3: Start Frontend Server

### Open Terminal 2 (Frontend)

1. **Open a NEW PowerShell or Command Prompt window**

2. **Navigate to frontend folder:**
   ```powershell
   cd "C:\Users\Amol Aaba Shelar\Downloads\givista (2)\givista\givista\frontend"
   ```

3. **Check if dependencies are installed:**
   ```powershell
   dir node_modules
   ```
   If you see "Directory not found", run:
   ```powershell
   npm install
   ```

4. **Start the frontend server:**
   ```powershell
   npm run dev
   ```

### ✅ What You Should See:

```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
```

**🎉 If you see this, your frontend is working!**

**Keep this terminal open!**

---

## 🤖 Step 4: Start AI Service (Optional but Recommended)

### Open Terminal 3 (AI Service)

1. **Open a NEW PowerShell or Command Prompt window**

2. **Navigate to AI service folder:**
   ```powershell
   cd "C:\Users\Amol Aaba Shelar\Downloads\givista (2)\givista\givista\ai_service"
   ```

3. **Activate virtual environment:**
   ```powershell
   venv\Scripts\activate
   ```
   You should see `(venv)` at the start of your prompt.

4. **Start AI service:**
   ```powershell
   python app.py
   ```

### ✅ What You Should See:

```
🚀 Starting Givista AI Service...
✅ Model trained and saved successfully
 * Running on http://127.0.0.1:5000
```

**🎉 If you see this, your AI service is working!**

**Keep this terminal open!**

---

## ✅ Step 5: Test Everything

### Test 1: Backend
Open browser: `http://localhost:3000/health`

You should see:
```json
{"success": true, "message": "Givista API is running", "timestamp": "..."}
```

### Test 2: Frontend
Open browser: `http://localhost:5173`

You should see: **Givista landing page** with "Welcome to Givista"

### Test 3: AI Service
Open browser: `http://localhost:5000/health`

You should see:
```json
{"status": "healthy", "service": "Givista AI Recommendation Service"}
```

---

## 🎯 Step 6: Use the Application!

1. **Go to:** `http://localhost:5173`
2. **Click:** "Become a Donor" or "Request Help"
3. **Sign up** with:
   - Name: Your name
   - Email: any email (e.g., test@example.com)
   - Password: any password (min 6 characters)
   - Role: Select "Donor" or "Receiver"
   - Location: Any location (e.g., "New York, NY")
4. **Click:** "Sign Up"
5. **You should be redirected to your dashboard!**

---

## 📋 Summary - What's Done:

✅ MySQL password set: `Amol@2005`
✅ Database `givista_db` created
✅ Backend .env file configured
✅ Frontend .env file created

## 📋 What You Need to Do:

1. ✅ Start Backend (Terminal 1)
2. ✅ Start Frontend (Terminal 2)
3. ✅ Start AI Service (Terminal 3)
4. ✅ Test in browser
5. ✅ Sign up and use the app!

---

## 🐛 Troubleshooting

### Backend won't start?

**Check MySQL connection:**
```powershell
mysql -u root -pAmol@2005 -e "SELECT 1;"
```
If this works, MySQL is fine. If not, check MySQL service.

**Check database exists:**
```powershell
mysql -u root -pAmol@2005 -e "SHOW DATABASES LIKE 'givista_db';"
```

### Frontend shows CORS error?

- Make sure backend is running on port 3000
- Check browser console (F12) for errors

### Port already in use?

**Backend (3000):**
- Change `PORT=3001` in `backend\.env`
- Restart backend

**Frontend (5173):**
- Vite will automatically use next available port

---

**You're all set! Follow the steps above and you'll be running! 🚀**

