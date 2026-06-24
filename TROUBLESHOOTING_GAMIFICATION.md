# Troubleshooting Gamification System

## Issue: Points Not Showing After Donation Completion

### Symptoms:
- Donation shows as "Completed" ✅
- But user still shows "0 Points"
- Badges not appearing

### Solutions:

#### 1. Check Backend Terminal
When you mark a donation as "Completed", check your backend terminal. You should see:
```
[Points] User X earned Y points (Total: Z)
[Badges] User X earned badges: ...
```

**If you DON'T see these logs:**
- The `onDonationCompleted()` function might not be running
- Check if there are any errors in the backend terminal
- Verify the donation status update is actually calling the badge service

#### 2. Refresh User Data
After completing a donation:
1. **Log out and log back in** (this refreshes user data)
2. OR refresh the page and check if points appear
3. OR open browser console (F12) and run:
   ```javascript
   // This will refresh user data
   window.location.reload();
   ```

#### 3. Check Database Directly
```sql
-- Check if points were actually added
SELECT id, name, email, badges, points 
FROM users 
WHERE email = 'your_email@example.com';

-- Check donation status
SELECT id, title, status, donorId 
FROM donations 
WHERE donorId = YOUR_USER_ID;
```

**Expected:**
- `points` should be > 0 (e.g., 25, 30, 35)
- `badges` should be a JSON array like `["🎁 Monthly Hero"]`

#### 4. Verify Donation Was Actually Completed
The badge/point system only runs when status is **"Completed"** (not "Received" or "Dispatched").

Check:
```sql
SELECT status FROM donations WHERE id = YOUR_DONATION_ID;
```

Should show: `Completed`

---

## Issue: Leaderboard Not Loading

### Symptoms:
- Error: "Failed to load leaderboard"
- "No donors found" message

### Solutions:

#### 1. Check Backend Terminal
Look for errors like:
```
Get leaderboard error: ...
```

#### 2. Check Browser Console (F12)
Look for network errors:
- Open DevTools (F12)
- Go to "Network" tab
- Try loading leaderboard again
- Check the `/api/v1/leaderboard` request
- See if it returns 200 OK or an error

#### 3. Test API Directly
```bash
# In browser console or Postman
GET http://localhost:3000/api/v1/leaderboard
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}
```

#### 4. Check if Any Users Have Points
```sql
-- Check if any donors have points
SELECT id, name, points, badges 
FROM users 
WHERE role = 'Donor' 
ORDER BY points DESC;
```

**If all users have 0 or NULL points:**
- Complete a donation first to generate points
- Then the leaderboard will show users

#### 5. Verify Route is Registered
Check backend `server.ts`:
```typescript
app.use('/api/v1/leaderboard', leaderboardRoutes);
```

---

## Quick Fixes

### Fix 1: Force Refresh User Data
1. Open browser console (F12)
2. Run:
   ```javascript
   localStorage.removeItem('authToken');
   window.location.href = '/login';
   ```
3. Log back in

### Fix 2: Manually Update Points (Testing Only)
```sql
-- ONLY FOR TESTING - Don't use in production!
UPDATE users 
SET points = 25, badges = '["🎁 Monthly Hero"]' 
WHERE id = YOUR_USER_ID;
```

### Fix 3: Re-complete Donation
1. In Admin Dashboard, change donation status to "Received"
2. Then change it back to "Completed"
3. This should trigger the badge/point system again

---

## Expected Behavior

### When Donation is Completed:
1. ✅ Backend logs: `[Points] User X earned Y points`
2. ✅ Backend logs: `[Badges] User X earned badges: ...`
3. ✅ Database: User's `points` field increases
4. ✅ Database: User's `badges` array gets updated
5. ✅ Frontend: After refresh, points and badges appear

### Points Calculation:
- **Base points**: 10
- **Category bonus**: 
  - Money: +15
  - Food: +10
  - Clothes: +8
  - Blood: +20
  - Other: +10
- **Verified bonus**: +5 (if donation is verified)

**Example:**
- Food donation (verified): 10 + 10 + 5 = **25 points**

### Badge Requirements:
- 🌟 **Top Donor**: 10 completed donations
- 🎁 **Monthly Hero**: Any donation in current month (awarded when donation is created)
- 🤝 **Community Helper**: 5 unique confirmed matches

---

## Still Not Working?

1. **Check backend is running** on port 3000
2. **Check frontend is running** on port 5173
3. **Check database connection** is working
4. **Check authentication token** is valid
5. **Check browser console** for JavaScript errors
6. **Check backend terminal** for server errors

---

## Test Checklist

- [ ] Backend server is running
- [ ] Frontend server is running
- [ ] User is logged in
- [ ] Donation exists and is verified
- [ ] Donation status is changed to "Completed" via Admin Dashboard
- [ ] Backend terminal shows point/badge logs
- [ ] Database shows updated points and badges
- [ ] User logs out and back in
- [ ] Points and badges appear on dashboard
- [ ] Leaderboard loads and shows users

