# 🧪 Givista - Complete Testing Guide

**Step-by-step guide to test your Givista donation platform**

---

## ✅ Pre-Testing Checklist

Before starting, ensure you have:

- [ ] MySQL installed and running
- [ ] Node.js v18+ installed
- [ ] Python 3.8+ installed
- [ ] npm installed
- [ ] pip installed

---

## 🚀 Step 1: Database Setup

### 1.1 Start MySQL Service

**Windows:**
- Open "Services" (Win + R → `services.msc`)
- Find "MySQL80" and ensure it's "Running"
- If stopped, right-click → "Start"

**Linux/Mac:**
```bash
sudo systemctl start mysql    # Linux
# or
brew services start mysql     # Mac
```

### 1.2 Create Database

Open MySQL command line or MySQL Workbench:

```sql
CREATE DATABASE givista_db;
```

Or via command line:
```bash
mysql -u root -p -e "CREATE DATABASE givista_db;"
```

**Expected Output:** `Query OK, 1 row affected`

---

## 🔧 Step 2: Backend Setup & Test

### 2.1 Navigate to Backend

```bash
cd givista/backend
```

### 2.2 Install Dependencies (if not done)

```bash
npm install
```

**Expected Output:**
```
added 234 packages in 45s
```

### 2.3 Create Backend .env File

Create a file named `.env` in `givista/backend/`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=givista_db
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRES_IN=7d

PORT=3000
NODE_ENV=development

AI_SERVICE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

**⚠️ Important:** Replace `YOUR_MYSQL_PASSWORD_HERE` with your actual MySQL root password!

### 2.4 Start Backend Server

```bash
npm run dev
```

**Expected Output:**
```
✅ Database connection established successfully.
✅ Database models synced.
🚀 Server is running on http://localhost:3000
📝 Health check: http://localhost:3000/health
```

**✅ Test 1: Backend Health Check**
- Open browser: `http://localhost:3000/health`
- **Expected:** JSON response:
```json
{
  "success": true,
  "message": "Givista API is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Keep this terminal open!**

---

## 🎨 Step 3: Frontend Setup & Test

**Open a NEW terminal window** (keep backend running)

### 3.1 Navigate to Frontend

```bash
cd givista/frontend
```

### 3.2 Install Dependencies (if not done)

```bash
npm install
```

**Expected Output:**
```
added 156 packages in 30s
```

### 3.3 Create Frontend .env File

Create a file named `.env` in `givista/frontend/`:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_AI_SERVICE_URL=http://localhost:5000
```

### 3.4 Start Frontend Server

```bash
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
```

**✅ Test 2: Frontend Landing Page**
- Open browser: `http://localhost:5173`
- **Expected:** See "Welcome to Givista" landing page with:
  - Welcome message
  - "Become a Donor" and "Request Help" buttons
  - Feature cards (Money, Food, Clothes)

**Keep this terminal open!**

---

## 🤖 Step 4: AI Service Setup & Test

**Open a THIRD terminal window** (backend and frontend still running)

### 4.1 Navigate to AI Service

```bash
cd givista/ai_service
```

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

**Expected Output:**
```
Successfully installed Flask-3.0.0 flask-cors-4.0.0 scikit-learn-1.3.2 pandas-2.1.4 numpy-1.26.2
```

### 4.4 Start AI Service

```bash
python app.py
```

**Expected Output:**
```
🚀 Starting Givista AI Service...
📊 No existing model found, training new model...
✅ Model trained and saved successfully
✅ Created sample data file: donation_data.csv
 * Running on http://127.0.0.1:5000
```

**✅ Test 3: AI Service Health Check**
- Open browser: `http://localhost:5000/health`
- **Expected:** JSON response:
```json
{
  "status": "healthy",
  "service": "Givista AI Recommendation Service",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Keep this terminal open!**

---

## 🧪 Step 5: Seed Database (Optional but Recommended)

**In the backend terminal**, press `Ctrl+C` to stop the server, then:

```bash
npm run seed
```

**Expected Output:**
```
🌱 Starting database seeding...
✅ Database synced
✅ Users created
✅ Donations created
✅ Requests created
✅ Database seeding completed successfully!
```

**Restart backend:**
```bash
npm run dev
```

**Test Accounts Created:**
- Admin: `admin@example.com` / `password123`
- Donor: `donor1@example.com` / `password123`
- Receiver: `receiver1@example.com` / `password123`

---

## 📋 Step 6: Comprehensive Testing

### ✅ Test 4: User Signup

1. Go to: `http://localhost:5173/signup`
2. Fill in form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "test123456"
   - Role: Select "Donor" or "Receiver"
   - Location: "New York, NY"
3. Click "Sign Up"
4. **Expected:** 
   - Success toast message
   - Redirected to dashboard based on role
   - Can see dashboard with welcome message

### ✅ Test 5: User Login

1. Go to: `http://localhost:5173/login`
2. Enter credentials:
   - Email: `donor1@example.com` (from seed data)
   - Password: `password123`
3. Click "Login"
4. **Expected:**
   - Success toast message
   - Redirected to Donor Dashboard
   - Can see "Welcome, [Name]" message

### ✅ Test 6: Create Donation (Donor)

1. Login as Donor
2. Navigate to "Create Donation" (from dashboard)
3. Fill in form:
   - Title: "Food Donation"
   - Category: "Food"
   - Quantity: 50
   - Description: "Canned goods and non-perishables"
   - Photo URL: (optional) `https://example.com/food.jpg`
4. Click "Create Donation"
5. **Expected:**
   - Success toast: "Donation created successfully!"
   - Redirected to dashboard
   - Donation appears in "Your Donations" list

### ✅ Test 7: Create Request (Receiver)

1. Login as Receiver (`receiver1@example.com` / `password123`)
2. Navigate to "Create Request"
3. Fill in form:
   - Title: "Urgent Need: Clothing"
   - Category: "Clothes"
   - Urgency: "High"
   - Description: "Need winter clothes for children"
4. Click "Create Request"
5. **Expected:**
   - Success toast: "Request created successfully!"
   - Redirected to dashboard
   - Request appears in "Your Requests" list

### ✅ Test 8: AI Recommendations

1. Login as Receiver or Donor
2. Navigate to "AI Recommendations" page
3. **Expected:**
   - Page loads
   - See recommended matches (if available)
   - Each recommendation shows:
     - User name and email
     - Match score (percentage)
     - Match details
     - "Contact" button

**Note:** If no recommendations appear, it's normal on first use. Recommendations are generated when donations/requests are created.

### ✅ Test 9: Messages

1. Login as any user
2. Navigate to "Messages" page
3. Fill in:
   - Recipient ID: Enter another user's ID (e.g., `2`)
   - Message: "Hello, I'm interested in your donation"
4. Click "Send"
5. **Expected:**
   - Success toast: "Message sent!"
   - Message appears in the messages list
   - Shows timestamp

### ✅ Test 10: Admin Dashboard

1. Login as Admin (`admin@example.com` / `password123`)
2. **Expected:**
   - See "Admin Dashboard"
   - View all donations in left panel
   - View all requests in right panel
   - See counts for each

### ✅ Test 11: Protected Routes

1. Logout (if logged in)
2. Try to access: `http://localhost:5173/donor/dashboard`
3. **Expected:**
   - Redirected to `/login` page
   - Cannot access dashboard without authentication

### ✅ Test 12: Role-Based Redirect

1. Login as Donor
2. **Expected:** Redirected to `/donor/dashboard`
3. Logout
4. Login as Receiver
5. **Expected:** Redirected to `/receiver/dashboard`
6. Logout
7. Login as Admin
8. **Expected:** Redirected to `/admin/dashboard`

### ✅ Test 13: Backend API Direct Test

**Test Authentication:**
```bash
# Signup
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test User",
    "email": "apitest@example.com",
    "password": "test123456",
    "role": "Donor",
    "location": "New York"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": 1, "name": "API Test User", ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Test Health Check:**
```bash
curl http://localhost:3000/health
```

### ✅ Test 14: AI Service Direct Test

```bash
curl -X POST http://localhost:5000/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "user_type": "receiver",
    "category": "Food",
    "location": "New York",
    "urgency": "High"
  }'
```

**Expected Response:**
```json
{
  "recommendations": [
    {
      "user_id": 2,
      "score": 0.85,
      "match_details": "Category match: Food, Location: New York, Similarity score: 0.85"
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Issue: Backend won't start

**Error:** `ER_ACCESS_DENIED_ERROR`
- **Fix:** Check MySQL password in `.env` file
- **Fix:** Ensure MySQL service is running

**Error:** `Port 3000 already in use`
- **Fix:** Change `PORT=3001` in `.env` file`
- **Fix:** Or kill process: `taskkill /F /IM node.exe` (Windows)

### Issue: Frontend shows CORS error

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`
- **Fix:** Ensure backend is running
- **Fix:** Check `FRONTEND_URL` in backend `.env` matches frontend URL

### Issue: Database connection fails

**Error:** `ECONNREFUSED`
- **Fix:** Start MySQL service
- **Fix:** Verify MySQL credentials in `.env`

### Issue: AI service not responding

**Error:** `Connection refused` or `ECONNABORTED`
- **Fix:** Ensure AI service is running on port 5000
- **Fix:** Check virtual environment is activated
- **Fix:** Verify `AI_SERVICE_URL` in backend `.env`

### Issue: No recommendations showing

**Possible Causes:**
- Not enough data (create more donations/requests)
- AI service not running
- User doesn't have donations/requests yet

**Fix:** Create a donation as Donor, then check recommendations as Receiver

---

## ✅ Success Criteria

Your project is working correctly if:

- [x] Backend starts without errors
- [x] Frontend loads landing page
- [x] AI service responds to health check
- [x] Can sign up new users
- [x] Can log in with existing users
- [x] Can create donations (as Donor)
- [x] Can create requests (as Receiver)
- [x] Can view recommendations
- [x] Can send messages
- [x] Can access role-based dashboards
- [x] Protected routes redirect to login
- [x] All API endpoints respond correctly

---

## 🎉 Next Steps After Testing

Once all tests pass:

1. **Explore Features:** Try all features, create more data
2. **Customize:** Modify UI, add features
3. **Deploy:** Prepare for production deployment
4. **Enhance:** Add image upload, notifications, etc.

---

## 📞 Need Help?

If tests fail:
1. Check error messages in terminal
2. Verify all 3 services are running
3. Check browser console (F12) for frontend errors
4. Review `.env` files are configured correctly
5. See `README.md` for detailed setup instructions

---

**Happy Testing! 🚀**

