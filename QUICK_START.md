# ⚡ Givista - Quick Start Guide

**Get Givista running in 10 minutes!**

---

## 🚀 Quick Setup (TL;DR)

### 1. Database Setup

```bash
# Open MySQL and create database
mysql -u root -p
CREATE DATABASE givista_db;
exit;
```

### 2. Backend Setup

```bash
cd givista/backend
npm install
# Create .env file (copy from .env.example and fill in DB_PASSWORD)
npm run dev
```

**Backend runs on:** `http://localhost:3000`

### 3. Frontend Setup

**Open NEW terminal:**

```bash
cd givista/frontend
npm install
# Create .env file (copy from .env.example)
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

### 4. AI Service Setup

**Open NEW terminal:**

```bash
cd givista/ai_service
python -m venv venv
venv\Scripts\activate    # Windows (or: source venv/bin/activate on Linux/Mac)
pip install -r requirements.txt
python app.py
```

**AI Service runs on:** `http://localhost:5000`

---

## ✅ Verify Everything Works

1. **Backend Health Check:**
   - Open: `http://localhost:3000/health`
   - Should see: `{"success": true, "message": "Givista API is running"}`

2. **Frontend:**
   - Open: `http://localhost:5173`
   - Should see: Landing page with "Welcome to Givista"

3. **AI Service Health Check:**
   - Open: `http://localhost:5000/health`
   - Should see: `{"status": "healthy", "service": "Givista AI Recommendation Service"}`

---

## 🔧 Common Issues

| Issue | Quick Fix |
|-------|-----------|
| Backend won't start | Check MySQL is running, verify `.env` file exists |
| Frontend shows CORS error | Ensure backend is running on port 3000 |
| AI service connection refused | Ensure AI service is running on port 5000 |
| Database connection error | Check `DB_PASSWORD` in backend `.env` |

---

## 📚 Next Steps

- **Full documentation:** See `README.md`
- **Code explanations:** See `CODE_EXPLANATION.md`
- **Detailed setup:** See `SETUP_GUIDE.md`

---

## 🎯 Default Test Accounts (from seed data)

After running `npm run seed` in backend:

- **Admin:** admin@example.com / password123
- **Donor:** donor@example.com / password123
- **Receiver:** receiver@example.com / password123

---

**That's it! You're ready to build! 🎉**

