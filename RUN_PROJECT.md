# 🚀 How to Run Givista Project

Follow these steps to get your Givista project running!

---

## 📋 Prerequisites

Make sure you have installed:
- ✅ **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- ✅ **Python** (3.8 or higher) - [Download](https://www.python.org/downloads/)
- ✅ **MySQL** (8.0 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
- ✅ **npm** (comes with Node.js)
- ✅ **pip** (comes with Python)

---

## 🗄️ Step 1: Setup MySQL Database

### 1.1 Start MySQL Service

**Windows:**
- Open "Services" (Win + R → `services.msc`)
- Find "MySQL80" or "MySQL" and ensure it's "Running"

**Linux/Mac:**
```bash
sudo systemctl start mysql    # Linux
# or
brew services start mysql     # Mac
```

### 1.2 Create Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE givista_db;
```

Or via command line:
```bash
mysql -u root -p -e "CREATE DATABASE givista_db;"
```

**Note your MySQL password** - you'll need it in the next step!

---

## 🔧 Step 2: Setup Backend

### 2.1 Create Backend .env File

**Navigate to:** `givista/backend/`

**Create a file named `.env`** (no extension) with this content:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=givista_db
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# AI Microservice URL
AI_SERVICE_URL=http://localhost:5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**⚠️ IMPORTANT:** Replace `YOUR_MYSQL_PASSWORD_HERE` with your actual MySQL root password!

### 2.2 Install Dependencies

Open a terminal in `givista/backend/` and run:

```bash
npm install
```

**Expected output:**
```
added 234 packages in 45s
```

### 2.3 Start Backend Server

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

**Keep this terminal open!**

### 2.4 Test Backend

Open in browser: `http://localhost:3000/health`

You should see:
```json
{
  "success": true,
  "message": "Givista API is running",
  "timestamp": "..."
}
```

---

## 🎨 Step 3: Setup Frontend

### 3.1 Create Frontend .env File

**Open a NEW terminal window** (keep backend running)

**Navigate to:** `givista/frontend/`

**Create a file named `.env`** (no extension) with this content:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_AI_SERVICE_URL=http://localhost:5000
```

### 3.2 Install Dependencies

```bash
npm install
```

**Expected output:**
```
added 156 packages in 30s
```

### 3.3 Start Frontend Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
```

**Keep this terminal open!**

### 3.4 Test Frontend

Open in browser: `http://localhost:5173`

You should see the Givista landing page!

---

## 🤖 Step 4: Setup AI Service (Optional for Basic Testing)

### 4.1 Navigate to AI Service

**Open a THIRD terminal window** (backend and frontend still running)

**Navigate to:** `givista/ai_service/`

### 4.2 Create Virtual Environment

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

**Expected:** Prompt should show `(venv)`

### 4.3 Install Dependencies

```bash
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed Flask-3.0.0 flask-cors-4.0.0 scikit-learn-1.3.2 pandas-2.1.4 numpy-1.26.2
```

### 4.4 Start AI Service

```bash
python app.py
```

**Expected output:**
```
🚀 Starting Givista AI Service...
📊 No existing model found, training new model...
✅ Model trained and saved successfully
 * Running on http://127.0.0.1:5000
```

**Keep this terminal open!**

### 4.5 Test AI Service

Open in browser: `http://localhost:5000/health`

You should see:
```json
{
  "status": "healthy",
  "service": "Givista AI Recommendation Service",
  "timestamp": "..."
}
```

---

## ✅ Step 5: Verify Everything Works

You should now have **3 terminal windows** running:

1. ✅ **Backend** - `http://localhost:3000`
2. ✅ **Frontend** - `http://localhost:5173`
3. ✅ **AI Service** - `http://localhost:5000`

### Test the Application:

1. **Open:** `http://localhost:5173`
2. **Click:** "Become a Donor" or "Request Help"
3. **Sign up** with any email and password
4. **You should be redirected to your dashboard!**

---

## 🧪 Step 6: Seed Database (Optional - for test accounts)

If you want to have test accounts ready:

**In your backend terminal, press:** `Ctrl+C` to stop server

Then run:
```bash
npm run seed
```

**Expected output:**
```
✅ Database synced
✅ Users created
✅ Donations created
✅ Requests created
✅ Database seeding completed successfully!
```

**Test Accounts Created:**
- Admin: `admin@givista.com` / `password123`
- Donor: `donor1@example.com` / `password123`
- Receiver: `receiver1@example.com` / `password123`

**Restart backend:**
```bash
npm run dev
```

---

## 🐛 Troubleshooting

### Backend won't start?

**Error: "Access denied for user 'root'@'localhost'"**
- ✅ Check your `.env` file has the correct MySQL password
- ✅ Make sure MySQL service is running
- ✅ Verify database `givista_db` exists

**Error: "Port 3000 already in use"**
- ✅ Change `PORT=3001` in `.env` file
- ✅ Or stop the process using port 3000

### Frontend shows CORS error?

- ✅ Make sure backend is running on port 3000
- ✅ Check `FRONTEND_URL` in backend `.env` matches frontend URL

### AI Service won't start?

- ✅ Make sure virtual environment is activated (`venv\Scripts\activate`)
- ✅ Check Python version (need 3.8+)

### Database connection fails?

- ✅ Start MySQL service
- ✅ Verify MySQL credentials in `.env`
- ✅ Create database: `CREATE DATABASE givista_db;`

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
venv\Scripts\activate    # Windows (or: source venv/bin/activate on Linux/Mac)
python app.py
```

---

## 🎉 Success!

If all services are running:
- ✅ Backend: `http://localhost:3000/health`
- ✅ Frontend: `http://localhost:5173`
- ✅ AI Service: `http://localhost:5000/health`

**You're ready to use Givista! 🚀**

---

## 📚 Next Steps

1. **Sign up** as a new user
2. **Create donations** (as Donor)
3. **Create requests** (as Receiver)
4. **View AI recommendations**
5. **Send messages** between users

For more details, see:
- `SETUP_GUIDE.md` - Detailed setup instructions
- `TESTING_GUIDE.md` - Complete testing guide
- `CODE_EXPLANATION.md` - Code walkthrough

