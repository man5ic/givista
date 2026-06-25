# Quick Start - Error-Free Setup

## What Was Fixed?
✅ CORS policy errors  
✅ React Router warnings  
✅ Axios credentials handling  

---

## Prerequisites

Make sure these are installed and running:
- ✅ Node.js (v14+)
- ✅ MySQL (running on port 3306)
- ✅ Python 3.9+ (optional, for AI service)

---

## 1️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Make sure .env file looks like this:
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=givista_db
# DB_USER=root
# DB_PASSWORD=root
# PORT=3000
# NODE_ENV=development
# FRONTEND_URL=http://localhost:5173

# Start backend (development mode with auto-reload)
npx nodemon -r ts-node/register src/server.ts
```

**Expected Output:**
```
✅ Database connection established successfully.
✅ Database models synced.
🚀 Server is running on http://localhost:3000
📝 Health check: http://localhost:3000/health
```

---

## 2️⃣ Frontend Setup

**Open a NEW terminal** and run:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## 3️⃣ Verify No Errors

Open your browser to `http://localhost:5173` and:

1. **Check Console** (F12 → Console tab)
   - ❌ NO CORS errors
   - ❌ NO React Router warnings
   - ✅ Only normal requests logged

2. **Try Signup**
   - Go to signup page
   - Fill in details (Name, Email, Password, Role, Location)
   - Click signup
   - ✅ Should succeed without API errors

3. **Try Login**
   - Use the credentials you just created
   - ✅ Should log in successfully

---

## Common Issues & Fixes

### Issue: "Cannot GET /health"
**Fix**: Backend not running. Run backend first with `npx nodemon -r ts-node/register src/server.ts`

### Issue: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Fix**: This should be fixed now! If still occurring:
1. Kill backend process
2. Delete `node_modules` in backend
3. Run `npm install` again
4. Restart backend

### Issue: "connect ECONNREFUSED" in console
**Fix**: Backend not running or not on port 3000

### Issue: "Error: connect EACCES /tmp/mysql.sock"
**Fix**: MySQL not running. Start MySQL service:
- Windows: Run MySQL from Services
- Mac: `brew services start mysql`
- Linux: `sudo service mysql start`

### Issue: "ER_ACCESS_DENIED_FOR_USER"
**Fix**: Wrong MySQL credentials in `.env`. Check DB_USER and DB_PASSWORD

---

## Project Structure

```
givista-fixed-corrected/
├── backend/              ← API server (Node.js)
│   ├── src/
│   ├── .env             ← Database credentials
│   └── package.json
├── frontend/            ← React app
│   ├── src/
│   ├── .env             ← API endpoint
│   └── package.json
├── ai_service/          ← Python ML service (optional)
│   ├── app.py
│   └── requirements.txt
└── FIXES_APPLIED.md     ← Detailed fix information
```

---

## Ports Used

- **Backend API**: `http://localhost:3000`
- **Frontend**: `http://localhost:5173`
- **AI Service**: `http://localhost:5000` (if running)
- **MySQL**: `localhost:3306`

---

## Troubleshooting Command Summary

```bash
# Kill process using port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Kill process using port 5173 (frontend)
lsof -ti:5173 | xargs kill -9

# Check MySQL status
mysql -u root -p -e "SELECT 1"

# View backend logs in real-time
npm run dev:backend
```

---

## Next Steps

Once everything is running without errors:
1. ✅ Create a donor account
2. ✅ Create a receiver account
3. ✅ Test donation verification
4. ✅ Check leaderboard
5. ✅ Test messaging

---

## Support

If you encounter any issues:
1. Check the **FIXES_APPLIED.md** file for technical details
2. Verify all prerequisites are installed
3. Check browser console (F12) for specific error messages
4. Ensure backend is on port 3000 and frontend on 5173

---

**Happy coding! 🚀**
