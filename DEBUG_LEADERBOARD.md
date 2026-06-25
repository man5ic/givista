# Debug Leaderboard - Step by Step

## What to Check in Network Tab:

### Step 1: Filter API Calls
1. In the Network tab, click **"Fetch/XHR"** button (filters to show only API calls)
2. This will show only the API requests, not CSS/JS files

### Step 2: Look for Leaderboard Request
Look for a request named:
- `/api/v1/leaderboard` or
- `leaderboard` or
- Something with "leaderboard" in the name

### Step 3: Check the Request Details
Click on the leaderboard request and check:

**Headers Tab:**
- Request URL: Should be `http://localhost:3000/api/v1/leaderboard`
- Request Method: Should be `GET`
- Authorization: Should have `Bearer <token>`

**Response Tab:**
- Status Code: 
  - ✅ 200 = Success
  - ❌ 401 = Not authenticated
  - ❌ 403 = Forbidden
  - ❌ 500 = Server error
- Response body: What data is returned?

**Preview Tab:**
- Shows formatted JSON response
- Should see: `{ success: true, data: [...] }`

### Step 4: Check Console Tab
1. Click the **"Console"** tab (next to Network)
2. Look for any red error messages
3. Copy any errors you see

## Common Issues:

### Issue 1: No Leaderboard Request at All
**Symptom:** No `/api/v1/leaderboard` request in Network tab
**Solution:** 
- The page might not be calling the API
- Check if there's a JavaScript error preventing the call

### Issue 2: 401 Unauthorized
**Symptom:** Status 401
**Solution:**
- Token expired or invalid
- Log out and log back in

### Issue 3: 500 Server Error
**Symptom:** Status 500
**Solution:**
- Check backend terminal for errors
- Backend might have a SQL error

### Issue 4: CORS Error
**Symptom:** Red error in Console about CORS
**Solution:**
- Backend CORS settings might be blocking the request

## What to Share:

Please share:
1. **Screenshot of the Network tab** with "Fetch/XHR" filter applied
2. **Screenshot of the Console tab** showing any errors
3. **Details of the leaderboard request** (click on it and share the Headers/Response tabs)

