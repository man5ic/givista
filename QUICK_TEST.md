# ⚡ Quick Testing Guide - Start Here!

**Follow these steps to test your Givista project**

---

## 📋 Step 1: Verify Prerequisites

Check these are installed and running:

- [ ] **MySQL** is running
- [ ] **Node.js** installed (check: `node --version`)
- [ ] **Python** installed (check: `python --version`)

---

## 🗄️ Step 2: Setup Database (One-time)

1. Open MySQL (command line or Workbench)
2. Run: `CREATE DATABASE givista_db;`
3. Note your MySQL password (you'll need it)

---

## 🚀 Step 3: Start All Services

**You need 3 separate terminal windows!**

### Terminal 1: Backend

```powershell
cd givista\backend
npm install          # First time only
# Create .env file (see below)
npm run dev
```

**Create `backend\.env` file:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=givista_db
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
JWT_SECRET=your_secret_key_12345
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
AI_SERVICE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

**✅ Test:** Open `http://localhost:3000/health` in browser

---

### Terminal 2: Frontend

```powershell
cd givista\frontend
npm install          # First time only
# Create .env file (see below)
npm run dev
```

**Create `frontend\.env` file:**
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_AI_SERVICE_URL=http://localhost:5000
```

**✅ Test:** Open `http://localhost:5173` in browser

---

### Terminal 3: AI Service

```powershell
cd givista\ai_service
python -m venv venv              # First time only
venv\Scripts\activate            # Activates virtual environment
pip install -r requirements.txt  # First time only
python app.py
```

**✅ Test:** Open `http://localhost:5000/health` in browser

---

## 🧪 Step 4: Quick Tests

### Test 1: Landing Page
- Go to: `http://localhost:5173`
- **Expected:** See "Welcome to Givista" page

### Test 2: Sign Up
- Click "Become a Donor" or "Request Help"
- Fill form and submit
- **Expected:** Redirected to dashboard

### Test 3: Login
- Go to: `http://localhost:5173/login`
- Email: `donor1@example.com`
- Password: `password123`
- **Expected:** Login success, see dashboard

### Test 4: Create Donation
- Login as Donor
- Click "Create Donation"
- Fill form and submit
- **Expected:** Donation appears in dashboard

### Test 5: Recommendations
- Login as any user
- Navigate to "AI Recommendations"
- **Expected:** See matched users (if data exists)

---

## ⚠️ Common Issues

**Backend won't start?**
- Check MySQL is running
- Verify `.env` file has correct MySQL password
- Check port 3000 is not in use

**Frontend won't start?**
- Check backend is running first
- Verify `.env` file exists in frontend folder

**AI Service won't start?**
- Ensure virtual environment is activated (`venv\Scripts\activate`)
- Check Python version (need 3.8+)

**Can't login?**
- Seed database first: In backend terminal, run `npm run seed`
- This creates test accounts

---

## 📚 Full Testing Guide

For comprehensive testing, see: `TESTING_GUIDE.md`

---

## ✅ Success!

If all tests pass, your project is working! 🎉

---

**Ready to start?** Open 3 terminals and follow Step 3 above!

