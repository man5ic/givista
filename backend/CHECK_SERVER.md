# 🔍 Check if Backend Server is Running

## Quick Check

**In your backend terminal, you should see:**
```
🚀 Server is running on http://localhost:3000
```

**If you DON'T see this, the server is not running!**

---

## Common Issues

### Issue 1: Server Not Started
**Symptom:** `ERR_CONNECTION_REFUSED`

**Fix:**
1. Go to your backend terminal
2. Check if you see any error messages
3. Restart: `npm run dev`

### Issue 2: Server Crashed
**Symptom:** Terminal shows error messages or stopped

**Fix:**
1. Look at the terminal output
2. Fix any errors shown
3. Restart: `npm run dev`

### Issue 3: Wrong URL
**Symptom:** "Route not found"

**Fix:**
- Use: `http://localhost:3000/health`
- NOT: `localhost:3000/health%60` (the %60 is wrong!)
- Make sure there's `http://` at the start

---

## Steps to Verify Server is Running

1. **Check Terminal Output**
   - Should see: `🚀 Server is running on http://localhost:3000`
   - Should NOT see: `app crashed` or `Error`

2. **Test in Browser**
   - Open: `http://localhost:3000/health`
   - Should see: `{"success": true, "message": "Givista API is running"}`

3. **If Not Working:**
   - Restart server: Press `Ctrl+C`, then `npm run dev`
   - Check for errors in terminal
   - Verify `.env` file exists with MySQL password

