# Leaderboard Fix Guide

## Issue: Leaderboard showing "No donors found" and "Failed to load"

### What I Fixed:

1. **Added COALESCE for NULL points** - Now handles users with NULL points correctly
2. **Better error logging** - Shows detailed error messages in development
3. **Improved frontend error handling** - Shows specific error messages

### Point Calculation Confirmation:

**25 points for "A Small Help From Me" is CORRECT! ✅**

Calculation:
- Base: 10 points
- Food category: +10 points
- Verified donation: +5 points
- **Total: 25 points** ✅

### Testing the Leaderboard:

1. **Check Backend Terminal:**
   - When you open leaderboard, check for any errors
   - Should see: `GET /api/v1/leaderboard` request

2. **Check Browser Console (F12):**
   - Go to Network tab
   - Look for `/api/v1/leaderboard` request
   - Check if it returns 200 OK or an error
   - Check the response data

3. **Verify Database:**
   ```sql
   -- Check if you have points
   SELECT id, name, email, points, badges, role 
   FROM users 
   WHERE role = 'Donor' 
   ORDER BY COALESCE(points, 0) DESC;
   ```

### If Still Not Working:

1. **Check if backend is running** on port 3000
2. **Check authentication token** is valid
3. **Check browser console** for the actual error message
4. **Check backend terminal** for SQL errors

### Expected Behavior:

After the fix:
- Leaderboard should load without errors
- Should show all donors sorted by points
- Your entry with 25 points should appear
- "Monthly Hero" badge should be visible

