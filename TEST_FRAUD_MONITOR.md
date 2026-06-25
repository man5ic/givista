# 🕵️ Testing the Fraud Monitor

## Overview

The Fraud Monitor automatically detects suspicious donations based on:
1. **Unusual frequency** - Multiple donations from same donor in 24 hours
2. **Repeated quantities** - Same quantity pattern in last week
3. **Repeated donor-receiver pairs** - Frequent matches between same users
4. **Suspicious donor IDs** - Very small or invalid IDs

**Threshold:** Donations with fraud score ≥ 0.4 are flagged

---

## 🧪 How to Test the Fraud Monitor

### Method 1: Via Admin Dashboard (Frontend)

1. **Start all services:**
   - Backend: `npm run dev` (in backend folder)
   - Frontend: `npm run dev` (in frontend folder)
   - AI Service: `python app.py` (in ai_service folder)

2. **Login as Admin:**
   - Go to: http://localhost:5173
   - Sign up/Login with Admin role
   - Or use seeded admin account: `admin@givista.com` / `password123`

3. **Access Fraud Monitor:**
   - Go to Admin Dashboard
   - Look for "Fraud Monitor" section
   - It will show all flagged donations

---

### Method 2: Via API Endpoints (Direct Testing)

#### Step 1: Get Authentication Token

**Login as Admin:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@givista.com\",\"password\":\"password123\"}"
```

**Save the token from response** (you'll need it for next steps)

#### Step 2: Create Test Donations (to trigger fraud detection)

**Create multiple donations quickly (as same donor):**
```bash
# Replace YOUR_TOKEN with the token from login
TOKEN="YOUR_TOKEN"

# Create 5 donations in quick succession (this should trigger fraud detection)
curl -X POST http://localhost:3000/api/v1/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"Test Donation 1\",\"category\":\"Food\",\"quantity\":10,\"description\":\"Test\"}"

# Repeat 4 more times with different titles
```

#### Step 3: Check Flagged Donations

```bash
curl -X GET http://localhost:3000/api/v1/donations/fraud/flagged \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Test Donation 1",
      "fraudScore": 0.5,
      "isFlagged": true,
      ...
    }
  ]
}
```

#### Step 4: Test Admin Actions

**Mark as Safe:**
```bash
curl -X POST http://localhost:3000/api/v1/donations/fraud/mark-safe/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Confirm as Fraud:**
```bash
curl -X POST http://localhost:3000/api/v1/donations/fraud/confirm/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Rescore All Donations (Admin only):**
```bash
curl -X POST http://localhost:3000/api/v1/donations/fraud/rescore-all \
  -H "Authorization: Bearer $TOKEN"
```

---

### Method 3: Quick Test Script

Create a file `test-fraud.js` in backend folder:

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/v1';

async function testFraudMonitor() {
  try {
    // 1. Login
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@givista.com',
      password: 'password123'
    });
    const token = loginRes.data.data.token;
    console.log('✅ Logged in');

    // 2. Create multiple donations (trigger fraud)
    const headers = { Authorization: `Bearer ${token}` };
    for (let i = 1; i <= 5; i++) {
      await axios.post(`${API_BASE}/donations`, {
        title: `Test Donation ${i}`,
        category: 'Food',
        quantity: 10,
        description: `Test donation ${i}`
      }, { headers });
      console.log(`✅ Created donation ${i}`);
    }

    // 3. Check flagged donations
    const flaggedRes = await axios.get(`${API_BASE}/donations/fraud/flagged`, { headers });
    console.log(`\n✅ Found ${flaggedRes.data.data.length} flagged donations:`);
    flaggedRes.data.data.forEach(d => {
      console.log(`  - ${d.title}: Score ${d.fraudScore?.toFixed(2)}, Flagged: ${d.isFlagged}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testFraudMonitor();
```

**Run it:**
```bash
cd backend
node test-fraud.js
```

---

## 🔍 Fraud Detection Rules

The system flags donations when fraud score ≥ 0.4:

| Rule | Condition | Score Added |
|------|-----------|-------------|
| Frequency | 5+ donations in 24h | +0.5 |
| Frequency | 3-4 donations in 24h | +0.3 |
| Frequency | 2 donations in 24h | +0.1 |
| Quantity Pattern | 4+ same quantity in week | +0.4 |
| Quantity Pattern | 2-3 same quantity in week | +0.2 |
| Donor-Receiver Pairs | 5+ matches | +0.2 |
| Donor-Receiver Pairs | 3-4 matches | +0.1 |
| Suspicious ID | No ID or ID < 1 | +0.5 |
| Suspicious ID | ID < 3 | +0.1 |

---

## ✅ Expected Behavior

1. **When creating donations:**
   - Each donation gets a fraud score calculated
   - If score ≥ 0.4, `isFlagged` is set to `true`
   - Console logs: `[Fraud Detection] Donation X: score=0.XX, flagged=true/false`

2. **In Admin Dashboard:**
   - Shows all donations where `isFlagged = true`
   - Displays fraud score for each
   - Admin can mark as safe or confirm fraud

3. **API Endpoints:**
   - `GET /api/v1/donations/fraud/flagged` - List flagged donations
   - `POST /api/v1/donations/fraud/mark-safe/:id` - Mark as safe
   - `POST /api/v1/donations/fraud/confirm/:id` - Confirm fraud
   - `POST /api/v1/donations/fraud/rescore-all` - Rescore all (Admin only)

---

## 🐛 Troubleshooting

**No flagged donations showing?**
- Create multiple donations quickly (5+ in short time)
- Use same quantity repeatedly
- Check backend console for fraud detection logs

**API returns 401 Unauthorized?**
- Make sure you're logged in and using the token
- Token might have expired, login again

**API returns 403 Forbidden?**
- Make sure you're logged in as Admin role
- Some endpoints require Admin role

---

## 📝 Quick Test Checklist

- [ ] Backend is running on port 3000
- [ ] Frontend is running on port 5173
- [ ] Logged in as Admin user
- [ ] Created 5+ donations quickly
- [ ] Checked `/api/v1/donations/fraud/flagged` endpoint
- [ ] Verified flagged donations appear in Admin Dashboard
- [ ] Tested "Mark as Safe" action
- [ ] Tested "Confirm Fraud" action

---

**The fraud monitor is working if:**
1. ✅ Donations get fraud scores when created
2. ✅ Flagged donations appear in `/fraud/flagged` endpoint
3. ✅ Admin Dashboard shows flagged donations
4. ✅ Admin can mark donations as safe or confirm fraud

