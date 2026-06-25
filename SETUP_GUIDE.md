# 🚀 Givista - Complete Setup Guide

This guide will walk you through setting up and running the entire Givista platform step by step.

## 📋 Prerequisites

Before starting, make sure you have installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (3.8 or higher) - [Download](https://www.python.org/downloads/)
- **MySQL** (8.0 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
- **npm** (comes with Node.js)
- **pip** (comes with Python)

Verify installations:
```bash
node --version
npm --version
python --version
pip --version
mysql --version
```

---

## 🗂️ Step 1: Project Structure Overview

```
givista/
├── frontend/          # React + TypeScript frontend
├── backend/           # Node.js + Express + TypeScript backend
└── ai_service/        # Python Flask AI microservice
```

---

## 🔧 Step 2: Database Setup (MySQL)

### 2.1 Create Database

1. Open MySQL command line or MySQL Workbench
2. Run the following command:

```sql
CREATE DATABASE givista_db;
```

Or using command line:
```bash
mysql -u root -p -e "CREATE DATABASE givista_db;"
```

### 2.2 Note Your MySQL Credentials

You'll need:
- Username (usually `root`)
- Password
- Host (usually `localhost`)
- Port (usually `3306`)

---

## 🔧 Step 3: Backend Setup

### 3.1 Navigate to Backend Directory

```bash
cd givista/backend
```

### 3.2 Install Dependencies

```bash
npm install
```

**What this does:** Downloads all required packages listed in `package.json`:
- `express` - Web framework
- `sequelize` - ORM for MySQL
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- And many more...

**Common errors:**
- If you see `EACCES` errors, you might need to run with `sudo` (Linux/Mac) or as Administrator (Windows)
- If MySQL connection fails, make sure MySQL service is running

### 3.3 Create Environment File

Create a file named `.env` in the `backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=givista_db
DB_USER=root
DB_PASSWORD=your_mysql_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# AI Microservice URL
AI_SERVICE_URL=http://localhost:5000
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL password!

### 3.4 Initialize Database

The database tables will be created automatically when you start the server (using Sequelize sync). However, you can also seed sample data:

```bash
npm run seed
```

**What this does:** Runs the seeder script that creates sample users, donations, and requests.

**Expected output:**
```
✅ Database synced
✅ Users created
✅ Donations created
✅ Requests created
✅ Database seeding completed successfully!
```

### 3.5 Start Backend Server

```bash
npm run dev
```

**Expected output:**
```
✅ Database connection established successfully.
✅ Database models synced.
🚀 Server is running on http://localhost:3000
📝 Health check: http://localhost:3000/health
```

**Common errors:**
- **"ER_ACCESS_DENIED_ERROR"** - Wrong MySQL username/password. Check your `.env` file.
- **"ECONNREFUSED"** - MySQL service is not running. Start MySQL service.
- **Port 3000 already in use** - Another application is using port 3000. Change `PORT` in `.env`.

**Test the backend:**
Open browser: `http://localhost:3000/health`

You should see:
```json
{
  "success": true,
  "message": "Givista API is running",
  "timestamp": "..."
}
```

---

## 🎨 Step 4: Frontend Setup

### 4.1 Navigate to Frontend Directory

Open a **new terminal window** (keep backend running):

```bash
cd givista/frontend
```

### 4.2 Install Dependencies

```bash
npm install
```

**What this does:** Downloads React, TypeScript, Tailwind CSS, and other frontend dependencies.

**Common errors:**
- Network timeout - try again or use `npm install --legacy-peer-deps`
- Missing peer dependencies - usually safe to ignore for development

### 4.3 Create Environment File

Create a file named `.env` in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_AI_SERVICE_URL=http://localhost:5000
```

**What this does:** Tells the frontend where to find the backend API and AI service.

### 4.4 Start Frontend Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Common errors:**
- Port 5173 already in use - Vite will automatically use the next available port
- CORS errors - Make sure backend is running and CORS is configured

**Test the frontend:**
Open browser: `http://localhost:5173`

You should see the Givista landing page!

---

## 🤖 Step 5: AI Service Setup

### 5.1 Navigate to AI Service Directory

Open a **third terminal window**:

```bash
cd givista/ai_service
```

### 5.2 Create Virtual Environment (Recommended)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**What this does:** Creates an isolated Python environment so dependencies don't conflict with other projects.

**Expected output:** You should see `(venv)` at the start of your terminal prompt.

### 5.3 Install Dependencies

```bash
pip install -r requirements.txt
```

**What this does:** Installs Flask, scikit-learn, pandas, and other Python packages.

**Common errors:**
- `pip: command not found` - Use `pip3` instead, or ensure Python is in PATH
- `Microsoft Visual C++ 14.0 is required` (Windows) - Install Visual Studio Build Tools

### 5.4 Start AI Service

```bash
python app.py
```

**Expected output:**
```
✅ Loaded existing model (or 📊 training new model)
🚀 Starting Givista AI Service...
 * Running on http://0.0.0.0:5000
```

**Test the AI service:**
Open browser: `http://localhost:5000/health`

You should see:
```json
{
  "status": "healthy",
  "service": "Givista AI Recommendation Service",
  "timestamp": "..."
}
```

---

## ✅ Step 6: Verify All Services Are Running

You should now have **three terminal windows** running:

1. **Backend** - `http://localhost:3000` ✅
2. **Frontend** - `http://localhost:5173` ✅
3. **AI Service** - `http://localhost:5000` ✅

### Test Integration:

1. Open `http://localhost:5173` in your browser
2. Click "Sign Up" or "Become a Donor"
3. Create an account (use any email and password)
4. You should be redirected to your dashboard!

---

## 🧪 Step 7: Testing the Application

### 7.1 Login with Sample Data

If you ran the seeder (`npm run seed`), you can use:

- **Donor:** `donor1@example.com` / `password123`
- **Receiver:** `receiver1@example.com` / `password123`
- **Admin:** `admin@givista.com` / `password123`

### 7.2 Test Features

1. **Create Donation** (as Donor)
   - Go to Donor Dashboard
   - Click "Create Donation"
   - Fill out the form and submit

2. **Create Request** (as Receiver)
   - Go to Receiver Dashboard
   - Click "Create Request"
   - Fill out the form and submit

3. **View Recommendations**
   - Click "AI Recommendations" in navigation
   - You should see matched users based on AI algorithm

4. **Send Messages**
   - Go to Messages page
   - Enter a recipient ID and send a message

---

## 🔍 Common Errors and Fixes

### Backend Errors

**Error: "Cannot connect to MySQL"**
- ✅ Check MySQL is running: `mysql -u root -p`
- ✅ Verify `.env` database credentials
- ✅ Ensure database exists: `SHOW DATABASES;`

**Error: "Port 3000 already in use"**
- ✅ Change `PORT` in `.env` to another port (e.g., 3001)
- ✅ Or stop the application using port 3000

**Error: "JWT_SECRET is not defined"**
- ✅ Make sure `.env` file exists in `backend` directory
- ✅ Check that `JWT_SECRET` is set in `.env`

### Frontend Errors

**Error: "Cannot connect to API"**
- ✅ Verify backend is running on port 3000
- ✅ Check `VITE_API_BASE_URL` in frontend `.env`
- ✅ Check browser console for CORS errors

**Error: "Module not found"**
- ✅ Run `npm install` again
- ✅ Delete `node_modules` and `package-lock.json`, then `npm install`

### AI Service Errors

**Error: "ModuleNotFoundError: No module named 'flask'"**
- ✅ Make sure virtual environment is activated
- ✅ Run `pip install -r requirements.txt` again

**Error: "Address already in use" (port 5000)**
- ✅ Change port in `app.py` or set `PORT` environment variable
- ✅ Or stop the application using port 5000

### Integration Errors

**Error: "AI service unavailable"**
- ✅ Make sure AI service is running on port 5000
- ✅ Check `AI_SERVICE_URL` in backend `.env`
- ✅ Test AI service health: `http://localhost:5000/health`

---

## 📝 Quick Command Reference

### Start All Services

**Terminal 1 (Backend):**
```bash
cd givista/backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd givista/frontend
npm run dev
```

**Terminal 3 (AI Service):**
```bash
cd givista/ai_service
python -m venv venv
# Activate venv (Windows: venv\Scripts\activate, Linux/Mac: source venv/bin/activate)
pip install -r requirements.txt
python app.py
```

### Database Commands

**Seed database:**
```bash
cd givista/backend
npm run seed
```

**Reset database** (if needed):
```sql
DROP DATABASE givista_db;
CREATE DATABASE givista_db;
```
Then restart backend (it will recreate tables).

---

## 🎉 Success Checklist

- [ ] MySQL database created and running
- [ ] Backend server running on port 3000
- [ ] Frontend server running on port 5173
- [ ] AI service running on port 5000
- [ ] Can access landing page
- [ ] Can sign up / login
- [ ] Can access dashboard
- [ ] Can create donations/requests
- [ ] Can view recommendations
- [ ] Can send messages

---

## 📚 Next Steps

1. **Explore the code** - Each file has comments explaining its purpose
2. **Modify features** - Add new functionality or customize existing ones
3. **Deploy** - When ready, deploy to cloud services (Heroku, AWS, etc.)

---

## 🆘 Need Help?

If you encounter issues:

1. Check the error messages carefully
2. Verify all services are running
3. Check `.env` files are configured correctly
4. Review the "Common Errors" section above
5. Check browser console (F12) for frontend errors
6. Check terminal output for backend/AI service errors

---

**Congratulations! 🎊 You've successfully set up Givista!**

