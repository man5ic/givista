# Step-by-Step Guide to Test Profile Verification Feature

## Prerequisites

1. **Backend Server Running**
   - Make sure the backend is running on `http://localhost:3000`
   - Database should be connected and synced

2. **Frontend Server Running**
   - Make sure the frontend is running on `http://localhost:5173`

3. **Database Synced**
   - The backend will automatically sync the new verification tables when it starts
   - Check backend console for "Database models synced" message

---

## Step 1: Access the Verification Page

1. Open your browser and go to `http://localhost:5173`
2. **Login** with an existing account (or create a new one)
3. After logging in, you should see a **"Verify Profile"** link in the navbar
4. Click on **"Verify Profile"** OR go directly to `http://localhost:5173/verification`

---

## Step 2: Test Email Verification

### 2.1 Send OTP
1. On the Verification page, you'll see three options: Email, Phone, ID Upload
2. **Email** option should already be selected (highlighted in blue)
3. Click the **"Send OTP to email"** button
4. You should see a success message: "OTP sent to your email"
5. **Check the backend terminal/console** - you'll see:
   ```
   📧 Sending OTP to [your-email]: [6-digit-code]
   (In production, this would send an actual email)
   ```
6. **Copy the 6-digit OTP** from the backend console

### 2.2 Verify OTP
1. An OTP input field should appear
2. Enter the **6-digit OTP** code you copied from the backend console
3. Click **"Verify OTP"**
4. You should see: **"Verification successful! ✅"**
5. The page should now show: **"Profile Verified!"** with a green checkmark
6. Check the navbar - you should see a **✅ badge** next to your username

---

## Step 3: Test Verification Status

1. After email verification, refresh the page
2. Go back to `/verification`
3. You should see: **"Profile Verified!"** with your verification type displayed
4. The verification form should be hidden

---

## Step 4: Test Phone Verification (Optional)

### 4.1 Logout and Login Again
1. Click **Logout** in the navbar
2. Login again (or create a new test account)

### 4.2 Send Phone OTP
1. Go to `/verification`
2. Click the **Phone** option
3. Enter a phone number (e.g., `+1234567890`)
4. Click **"Send OTP to phone"**
5. Check the backend console for the OTP code
6. Enter the OTP and verify

---

## Step 5: Test ID Upload (KYC Document)

### 5.1 Upload a Document
1. Logout and login with a **different account** (or the same if you want to test)
2. Go to `/verification`
3. Click the **ID Upload** option
4. You should see instructions: "Upload a government-issued ID..."
5. Click **"Select Document"** and choose a file:
   - Acceptable formats: JPEG, PNG, PDF
   - Max size: 5MB
   - You can use any test image file
6. After selecting, you'll see the filename displayed
7. Click **"Upload & Submit for Review"**
8. You should see: **"KYC document uploaded. Waiting for admin approval."**

### 5.2 Verify Document is Pending
1. The verification status should show as "pending"
2. The document URL should be saved

---

## Step 6: Test Admin Approval (Admin Dashboard)

### 6.1 Login as Admin
1. **Logout** from your current account
2. **Login as Admin** (or create an admin account if needed)
   - If you don't have an admin account, you can create one with role "Admin"

### 6.2 View Verification Requests
1. After logging in as Admin, go to the **Admin Dashboard**
2. Scroll down - you should see a section: **"Verification Requests"**
3. You should see the pending KYC request you just uploaded:
   - User name and email
   - Submission date
   - "View Document →" link

### 6.3 View Document
1. Click the **"View Document →"** link
2. It should open: `http://localhost:3000/uploads/[filename]`
3. Verify the document is displayed correctly

### 6.4 Approve Verification
1. Click the **"Approve"** button next to the verification request
2. You should see: **"Verification approved successfully"**
3. The request should disappear from the list

### 6.5 Verify User is Now Verified
1. **Logout** from Admin account
2. **Login** with the account that uploaded the document
3. Go to `/verification`
4. You should see: **"Profile Verified!"** with verification type "ID"
5. Check the navbar - **✅ badge** should be visible

---

## Step 7: Test Verified Badge Display

### 7.1 Check Navbar
1. When logged in as a verified user
2. Look at the navbar (top right)
3. You should see: **Your Name ✅ (Your Role)**

### 7.2 Check Dashboard
1. Go to your dashboard (Donor/Receiver)
2. Check the welcome message at the top
3. You should see: **"Welcome, Your Name! ✅"**

### 7.3 Check Recommendations (if applicable)
1. If you have recommendations, go to `/recommendations`
2. Any verified users should show a **✅ badge** next to their names

---

## Step 8: Test Verification Prompts

### 8.1 Unverified User Dashboard
1. Login with a **new/unverified account**
2. Go to your dashboard (Donor or Receiver)
3. You should see a **yellow banner** saying:
   - "Verify your profile"
   - "Get verified to build trust with other users"
   - **"Verify Now"** button
4. Click the button - it should take you to `/verification`

---

## Step 9: Test Error Handling

### 9.1 Invalid OTP
1. Request an OTP (email or phone)
2. Enter a **wrong OTP** (e.g., `000000`)
3. Click "Verify OTP"
4. You should see: **"Invalid OTP code"**

### 9.2 Expired OTP
1. Request an OTP
2. Wait 10+ minutes (or modify backend to reduce expiry time for testing)
3. Try to verify
4. You should see: **"OTP has expired. Please request a new one."**

### 9.3 Invalid File Type
1. Go to ID Upload
2. Try to upload a `.txt` or `.docx` file
3. You should see: **"Invalid file type. Only JPEG, PNG, and PDF are allowed."**

### 9.4 File Too Large
1. Try to upload a file larger than 5MB
2. You should see: **"File size must be less than 5MB"**

---

## Step 10: Test Admin Rejection

### 10.1 Upload Another Document
1. Login with a user account
2. Upload a KYC document
3. Logout

### 10.2 Reject as Admin
1. Login as Admin
2. Go to Admin Dashboard
3. Find the pending verification request
4. Click **"Reject"**
5. Confirm the rejection
6. You should see: **"Verification rejected"**
7. The request should disappear

### 10.3 Verify User Status
1. Logout from Admin
2. Login with the rejected user account
3. Go to `/verification`
4. Status should still show as **not verified**
5. User can upload again if needed

---

## Quick Test Checklist

Use this checklist to verify all features:

- [ ] Verification page accessible at `/verification`
- [ ] Email OTP sent successfully (check backend console)
- [ ] Email OTP verified successfully
- [ ] Phone OTP works (if tested)
- [ ] ID document upload works
- [ ] Admin can see pending requests
- [ ] Admin can view uploaded document
- [ ] Admin can approve request
- [ ] Admin can reject request
- [ ] Verified badge appears in navbar
- [ ] Verified badge appears in dashboard
- [ ] Verified badge appears in recommendations
- [ ] "Verify Now" prompt appears for unverified users
- [ ] Invalid OTP shows error
- [ ] Invalid file type shows error
- [ ] File size validation works
- [ ] Verification status persists after page refresh

---

## Troubleshooting

### Issue: OTP not appearing in backend console
- **Solution**: Check backend terminal is running and receiving requests
- Look for: `POST /api/v1/verification/send-otp`

### Issue: Upload fails
- **Solution**: Check `backend/uploads/` directory exists
- Backend should create it automatically, but verify it's there

### Issue: Verified badge not showing
- **Solution**: 
  1. Refresh the page
  2. Check `user.isVerified` in browser console
  3. Verify backend returns `isVerified: true` in user data

### Issue: Admin panel not showing requests
- **Solution**: 
  1. Verify you're logged in as Admin (check role)
  2. Check browser console for errors
  3. Verify backend endpoint: `GET /api/v1/verification/requests`

### Issue: Database errors
- **Solution**: 
  1. Stop backend
  2. Restart backend - it will sync tables automatically
  3. Check backend console for "Database models synced"

---

## Expected Console Outputs

### Backend Console (When sending OTP)
```
📧 Sending OTP to user@example.com: 123456
(In production, this would send an actual email)
```

### Backend Console (When uploading file)
```
POST /api/v1/verification/upload-kyc
```

### Frontend Console (After verification)
- Should see API calls to `/verification/verify-otp`
- Should see user data refresh

---

## Notes

- **OTP Codes**: In development, OTPs are printed to backend console. In production, they would be sent via email/SMS.
- **File Storage**: Files are stored in `backend/uploads/` directory
- **Admin Access**: Only users with role "Admin" can access the verification requests panel
- **Verification Persists**: Once verified, users remain verified across sessions

---

**Happy Testing! 🎉**

For any issues, check the browser console (F12) and backend terminal for error messages.

