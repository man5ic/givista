# Testing Guide: Gamification & Badges System

## Prerequisites
1. Backend server running on port 3000
2. Frontend server running on port 5173 (or configured port)
3. Database connected and synced
4. At least one verified donor account

---

## Step 1: Verify Database Schema

### Check if User table has new fields:
```sql
-- Connect to MySQL
mysql -u root -p

-- Use your database
USE givista_db;  -- or your database name

-- Check User table structure
DESCRIBE users;

-- You should see:
-- badges (JSON, nullable)
-- points (INT, default 0)
```

### If fields are missing, the backend will auto-add them on restart (Sequelize sync).

---

## Step 2: Test Badge Assignment

### A. Test "🎁 Monthly Hero" Badge (Easiest)
1. **Login as a Donor** (or create a new donor account)
2. **Create a donation**:
   - Go to `/donor/create-donation`
   - Fill in donation details
   - Submit
3. **Verify badge appears**:
   - Check the Navbar - you should see the "🎁 Monthly Hero" badge
   - Go to Donor Dashboard - click "View Badges" button
   - The badge should show as "✓ Earned"

### B. Test "🌟 Top Donor" Badge (10 Completed Donations)
1. **Complete 10 donations**:
   - Create donations
   - Mark them as "Completed" via the donation tracking endpoint
   - Or use admin panel to update status
2. **After 10th completion**:
   - Check Navbar for "🌟 Top Donor" badge
   - Check dashboard badges section

### C. Test "🤝 Community Helper" Badge (5 Unique Receivers)
1. **Create matches with 5 different receivers**:
   - Create donations
   - Match them with different receivers
   - Confirm matches (status: 'Confirmed')
2. **After 5th unique receiver**:
   - Badge should appear automatically

---

## Step 3: Test Points System

### Check Points After Completing a Donation:
1. **Note your current points** (shown in Navbar or Dashboard)
2. **Complete a donation**:
   - Base points: 10
   - Category bonus: Money (+15), Food (+10), Clothes (+8), Blood (+20), Other (+10)
   - Verified bonus: +5 (if donation is verified)
3. **Verify points increased**:
   - Refresh the page
   - Check Navbar for updated points
   - Check Dashboard for updated points

### Expected Points Calculation:
- **Money donation (verified)**: 10 (base) + 15 (Money) + 5 (verified) = **30 points**
- **Food donation (verified)**: 10 (base) + 10 (Food) + 5 (verified) = **25 points**
- **Blood donation (verified)**: 10 (base) + 20 (Blood) + 5 (verified) = **35 points**

---

## Step 4: Test Leaderboard

1. **Access Leaderboard**:
   - Click "Leaderboard" in navigation menu
   - Or go to `/leaderboard`

2. **Verify Display**:
   - Should show top donors
   - Columns: Rank, Donor, Badges, Points, Completed Donations
   - Your account should be highlighted if you're in the list

3. **Test Sorting**:
   - Click "Sort by Points" - should sort by points (descending)
   - Click "Sort by Donations" - should sort by completed donations (descending)

---

## Step 5: Test Badge Display Components

### A. Navbar Badges
1. **Login as donor with badges**
2. **Check top-right of navbar**:
   - Should see badges displayed
   - Should see points count (e.g., "150 pts")
   - Hover over badges to see tooltips

### B. Dashboard Badges
1. **Go to Donor Dashboard** (`/donor/dashboard`)
2. **Verify**:
   - Badges displayed below welcome message
   - Points shown
   - "View Badges" button visible

### C. View Badges Modal
1. **Click "View Badges" button** on dashboard
2. **Verify modal shows**:
   - All available badges
   - Your earned badges (highlighted in green)
   - Requirements for each badge
   - "✓ Earned" indicator for badges you have

---

## Step 6: Backend API Testing

### Test Badge Assignment via API:

```bash
# 1. Complete a donation (as Admin or verified NGO)
POST http://localhost:3000/api/v1/donations/:id/status
Headers: {
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "application/json"
}
Body: {
  "status": "Completed"
}

# 2. Check user badges and points
GET http://localhost:3000/api/v1/users/:userId
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}

# Response should include:
# {
#   "badges": ["🎁 Monthly Hero"],
#   "points": 25
# }
```

### Test Leaderboard API:

```bash
GET http://localhost:3000/api/v1/leaderboard?sortBy=points&limit=50
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}

# Should return array of users with:
# - badges array
# - points
# - completedDonations count
```

---

## Step 7: Database Verification

### Check User Badges and Points Directly:

```sql
-- View all users with badges and points
SELECT id, name, email, badges, points 
FROM users 
WHERE role = 'Donor'
ORDER BY points DESC;

-- Check specific user
SELECT id, name, badges, points 
FROM users 
WHERE id = YOUR_USER_ID;

-- View completed donations count
SELECT donorId, COUNT(*) as completed_count
FROM donations
WHERE status = 'Completed'
GROUP BY donorId;
```

---

## Step 8: Console Logs (Backend)

### Check Backend Terminal for:
- `[Badges] User X earned badges: ...` - when badges are awarded
- `[Points] User X earned Y points (Total: Z)` - when points are added
- Any error messages related to badge service

---

## Common Issues & Solutions

### Issue: Badges not appearing
**Solution:**
1. Check if donation status was actually set to "Completed"
2. Verify user has required number of donations/receivers
3. Check backend console for errors
4. Refresh user data: `refreshUser()` in frontend

### Issue: Points not updating
**Solution:**
1. Verify donation was marked "Completed" (not just "Received")
2. Check backend logs for point calculation
3. Refresh the page or call `refreshUser()`

### Issue: Leaderboard empty
**Solution:**
1. Ensure you have donors with completed donations
2. Check database: `SELECT * FROM users WHERE role = 'Donor' AND points > 0;`
3. Verify leaderboard endpoint is accessible

### Issue: Database fields missing
**Solution:**
1. Restart backend server (Sequelize will sync schema)
2. Or manually add columns:
   ```sql
   ALTER TABLE users ADD COLUMN badges JSON DEFAULT '[]';
   ALTER TABLE users ADD COLUMN points INT DEFAULT 0;
   ```

---

## Quick Test Checklist

- [ ] User model has `badges` and `points` fields
- [ ] Can create and complete a donation
- [ ] Points increase after completing donation
- [ ] "Monthly Hero" badge appears after creating donation this month
- [ ] Badges display in Navbar
- [ ] Badges display on Dashboard
- [ ] "View Badges" modal opens and shows all badges
- [ ] Leaderboard page loads and shows donors
- [ ] Leaderboard sorting works (points/donations)
- [ ] Backend logs show badge/point updates

---

## Expected Behavior Summary

1. **On Donation Completion:**
   - Points automatically added
   - Badges checked and awarded if criteria met
   - User data updated in database

2. **On Page Load:**
   - Badges and points displayed in Navbar
   - Badges and points displayed on Dashboard
   - Leaderboard shows current rankings

3. **Badge Requirements:**
   - 🌟 Top Donor: 10 completed donations
   - 🎁 Monthly Hero: Any donation in current month
   - 🤝 Community Helper: 5 unique confirmed matches

---

## Need Help?

If something isn't working:
1. Check browser console for errors
2. Check backend terminal for errors
3. Verify database schema
4. Ensure backend and frontend are running
5. Check authentication token is valid

