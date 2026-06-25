# 🚀 Quick Test: Fraud Monitor

## Prerequisites

1. **Backend is running** on http://localhost:3000
2. **Frontend is running** on http://localhost:5173 (optional, for UI testing)
3. **Database is connected**

---

## Method 1: Test via Frontend (Easiest)

### Step 1: Login as Admin
1. Go to: http://localhost:5173
2. Login with admin account (or create one with Admin role)
3. If admin doesn't exist, sign up with role "Admin"

### Step 2: Verify Your Profile
1. Go to Verification page
2. Complete email/phone verification (or KYC upload)
3. This is required before creating donations

### Step 3: Create Test Donations
1. Go to Donor Dashboard
2. Create **5 donations quickly** with:
   - Same category (e.g., "Food")
   - Same quantity (e.g., 10)
   - Different titles
3. Create them within a few minutes

### Step 4: Check Fraud Monitor
1. Go to Admin Dashboard
2. Look for "Fraud Monitor" section
3. You should see flagged donations with fraud scores

---

## Method 2: Test via API (Advanced)

### Step 1: Login and Get Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@givista.com\",\"password\":\"password123\"}"
```

**Save the token** from response.

### Step 2: Verify User (Required)

**Option A: Via OTP (if email/phone verification is set up)**
```bash
# Request OTP
curl -X POST http://localhost:3000/api/v1/verification/send-otp \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"email\"}"

# Verify OTP (use the OTP you received)
curl -X POST http://localhost:3000/api/v1/verification/verify-otp \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"otp\":\"123456\",\"type\":\"email\"}"
```

**Option B: Direct Database Update (For Testing Only)**
```sql
-- Connect to MySQL
mysql -u root -pshree givista_db

-- Update user to verified
UPDATE users SET isVerified = 1 WHERE email = 'admin@givista.com';
```

### Step 3: Create Multiple Donations

```bash
TOKEN="YOUR_TOKEN"

# Create 5 donations quickly
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/v1/donations \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"title\":\"Test Donation $i\",\"category\":\"Food\",\"quantity\":10,\"description\":\"Test $i\"}"
  echo ""
done
```

### Step 4: Check Flagged Donations

```bash
curl -X GET http://localhost:3000/api/v1/donations/fraud/flagged \
  -H "Authorization: Bearer $TOKEN"
```

---

## Method 3: Use Test Script (Easiest for API Testing)

**Note:** The script needs users to be verified first.

1. **Manually verify a user** (via frontend or database)
2. **Run the test script:**

```bash
cd backend
node test-fraud.js
```

---

## What to Look For

### ✅ Fraud Monitor is Working If:

1. **Backend Console Shows:**
   ```
   [Fraud Detection] Donation X: score=0.XX, flagged=true/false
   ```

2. **API Returns Flagged Donations:**
   ```json
   {
     "success": true,
     "data": [
       {
         "id": 1,
         "title": "Test Donation 5",
         "fraudScore": 0.5,
         "isFlagged": true
       }
     ]
   }
   ```

3. **Admin Dashboard Shows:**
   - List of flagged donations
   - Fraud scores for each
   - "Verify Safe" and "Confirm Fraud" buttons work

---

## Fraud Detection Triggers

The system flags donations (score ≥ 0.4) when:

- **5+ donations in 24 hours** → Score +0.5
- **4+ donations with same quantity in week** → Score +0.4
- **3-4 donations in 24 hours** → Score +0.3
- **2-3 donations with same quantity** → Score +0.2
- **5+ matches between same donor-receiver** → Score +0.2

**To trigger fraud detection:**
- Create 5 donations quickly (within minutes)
- Use the same quantity for all
- This should give a score ≥ 0.4 and flag the donations

---

## Troubleshooting

**"You must verify your profile" error:**
- Complete verification via frontend (Verification page)
- Or manually set `isVerified = 1` in database

**No flagged donations:**
- Create more donations (5+ quickly)
- Use same quantity
- Check backend console for fraud detection logs

**API returns 401/403:**
- Make sure you're logged in
- Token might be expired
- Some endpoints require Admin role

---

## Quick Database Check

```sql
-- Check if fraud detection is working
SELECT id, title, fraudScore, isFlagged, createdAt 
FROM donations 
ORDER BY createdAt DESC 
LIMIT 10;

-- Check flagged donations
SELECT * FROM donations WHERE isFlagged = 1;
```

---

**The fraud monitor is working correctly if donations get fraud scores and flagged donations appear in the Admin Dashboard!** 🎉

