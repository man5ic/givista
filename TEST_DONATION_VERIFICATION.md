# Step-by-Step Guide to Test Donation Verification System

## Prerequisites

1. **Backend Server Running** ✅ (Should be running on `http://localhost:3000`)
2. **Frontend Server Running** (Should be running on `http://localhost:5173`)
3. **Database Connected** ✅ (Already synced with new fields)

---

## Step 1: Verify Your Profile (Required First)

**Why?** Only verified users can create donations!

### 1.1 Login
1. Open browser: `http://localhost:5173`
2. **Login** with your account (or create a new one)

### 1.2 Verify Profile
1. Click **"Verify Profile"** in the navbar
2. Select **Email** verification
3. Click **"Send OTP to email"**
4. **Check your backend terminal** - you'll see:
   ```
   📧 Sending OTP to your-email@example.com: 123456
   ```
5. **Copy the 6-digit OTP** from the backend terminal
6. Enter the OTP and click **"Verify OTP"**
7. You should see: **"Verification successful! ✅"**
8. Check navbar - you should see a **✅ badge** next to your username

---

## Step 2: Create a Donation (Test Verification Requirement)

### 2.1 Test Unverified User (If you have another account)
1. **Logout** from your verified account
2. **Login** with an **unverified account** (or create a new one)
3. Try to go to **Create Donation** page
4. You should see a **yellow warning banner**:
   - "Profile Verification Required"
   - "You must verify your profile before creating donations"
   - **"Verify Profile"** button
5. The form should be **disabled** (you can't submit)

### 2.2 Create Donation as Verified User
1. **Logout** and **Login** with your **verified account**
2. Go to **Donor Dashboard** (or click "Create Donation" in navbar)
3. Click **"Create Donation"** card
4. Fill in the form:
   - **Title**: "Test Donation for Verification"
   - **Category**: Choose any (e.g., "Food")
   - **Quantity**: `100`
   - **Description**: "This is a test donation to verify the system"
   - **Photo URL**: (Optional)
5. Click **"Create Donation"**
6. You should see: **"Donation created successfully!"**
7. The donation will be created with:
   - `isVerified: false`
   - `verificationStatus: 'Pending'`

---

## Step 3: View Donation in Donor Dashboard

### 3.1 Check Donation Status
1. After creating, you'll be redirected to **Donor Dashboard**
2. Scroll down to **"Your Donations"** section
3. You should see your donation listed
4. Notice:
   - **No ✅ badge** (not verified yet)
   - **Verification Status badge**: "Pending" (yellow)
5. The donation shows: **"Verification: Pending"**

---

## Step 4: Test Admin Review Panel

### 4.1 Login as Admin
1. **Logout** from your donor account
2. **Login as Admin** (or create an admin account if needed)
   - To create admin: Sign up with role **"Admin"**

### 4.2 View Donation Verification Panel
1. After logging in as Admin, you'll see **Admin Dashboard**
2. Scroll down past the **"Verification Requests"** panel (for profile verification)
3. You'll see **"Donation Verification Requests"** panel
4. You should see your pending donation:
   - Donation title
   - Donor name with verified badge (if donor is verified)
   - Category and quantity
   - Created date
   - **"Approve"** button (green)
   - **"Reject"** button (red)

---

## Step 5: Test Approve Donation

### 5.1 Approve a Donation
1. In the **Donation Verification Panel**, find your test donation
2. Click **"Approve"** button
3. Optionally add remarks (or leave empty)
4. Click **"Approve"** again if prompted
5. You should see: **"Donation approved successfully"**
6. The donation should **disappear** from the pending list
7. **Check backend terminal** - you should see:
   ```
   📧 DONATION VERIFICATION NOTIFICATION
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   To: donor-email@example.com
   Subject: Your donation "Test Donation for Verification" has been APPROVED ✅
   ```

### 5.2 Verify Approved Donation
1. **Logout** from Admin account
2. **Login** with the **donor account** that created the donation
3. Go to **Donor Dashboard**
4. Scroll to **"Your Donations"**
5. You should see:
   - **✅ Verified badge** next to donation title
   - **Verification Status badge**: "Approved" (green)
   - If you added remarks, they'll be shown below

---

## Step 6: Test Reject Donation

### 6.1 Create Another Donation
1. Create a new donation as a verified donor
2. Title: "Test Rejection Donation"
3. Create it

### 6.2 Reject the Donation
1. **Login as Admin** again
2. Go to **Admin Dashboard** → **Donation Verification Panel**
3. Find the new pending donation
4. Click **"Reject"** button
5. A **modal will appear** asking for remarks
6. Enter remarks: **"This donation doesn't meet our requirements"**
7. Click **"Reject"** button in the modal
8. You should see: **"Donation rejected"**
9. The donation should **disappear** from pending list
10. **Check backend terminal** - you should see:
    ```
    📧 DONATION VERIFICATION NOTIFICATION
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    To: donor-email@example.com
    Subject: Your donation "Test Rejection Donation" has been REJECTED ❌
    Remarks: This donation doesn't meet our requirements
    ```

### 6.3 Verify Rejected Donation
1. **Logout** from Admin
2. **Login** with the donor account
3. Go to **Donor Dashboard**
4. Check your donation:
   - **No ✅ badge** (not verified)
   - **Verification Status badge**: "Rejected" (red)
   - **Remarks** should be displayed below the donation

---

## Step 7: Test Verified Badge Display

### 7.1 Check Admin Dashboard
1. **Login as Admin**
2. Go to **Admin Dashboard**
3. Look at **"All Donations"** section
4. Verified donations should show:
   - **✅ badge** next to title
   - **Verification Status badge** (Approved/Rejected/Pending)

### 7.2 Check Donor Dashboard
1. **Login as Donor**
2. Go to **Donor Dashboard**
3. Check **"Your Donations"** section
4. Verified donations should show:
   - **✅ badge** next to title
   - **Verification Status badge**
   - **Remarks** (if rejected)

---

## Step 8: Test Integration with Profile Verification

### 8.1 Verify Integration Works
1. **Create a new account** (don't verify profile)
2. Try to create a donation
3. You should see:
   - Warning banner on Create Donation page
   - Form disabled
   - Error message: "You must verify your profile before creating donations"
4. **Verify the profile** (email/phone/ID)
5. **Try creating donation again** - should work now!

---

## Quick Test Checklist

Use this checklist to verify all features:

### Profile Verification Integration
- [ ] Unverified user cannot create donation (warning shown)
- [ ] Verified user can create donation
- [ ] Create donation form disabled for unverified users

### Donation Creation
- [ ] Verified user can create donation successfully
- [ ] New donations start with `verificationStatus: 'Pending'`
- [ ] New donations have `isVerified: false`

### Admin Review Panel
- [ ] Admin can see pending donations in panel
- [ ] Donor info displayed with verification status
- [ ] Donation details shown (title, category, quantity, date)

### Approval Process
- [ ] Admin can approve donation
- [ ] Approved donation shows ✅ badge
- [ ] Approved donation shows "Approved" status (green)
- [ ] Notification logged in backend console
- [ ] Approved donation removed from pending list

### Rejection Process
- [ ] Admin can reject donation (modal appears)
- [ ] Remarks required for rejection
- [ ] Rejected donation shows "Rejected" status (red)
- [ ] Remarks displayed on rejected donation
- [ ] Notification logged in backend console
- [ ] Rejected donation removed from pending list

### Badge Display
- [ ] ✅ Badge appears on verified donations in Admin Dashboard
- [ ] ✅ Badge appears on verified donations in Donor Dashboard
- [ ] Status badges show correct colors (Green=Approved, Red=Rejected, Yellow=Pending)

---

## Expected Console Outputs

### Backend Console (When approving donation)
```
📧 DONATION VERIFICATION NOTIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: donor@example.com
Subject: Your donation "Test Donation" has been APPROVED ✅
Hello Donor Name,
Your donation "Test Donation" has been APPROVED ✅
Thank you for your contribution to Givista.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Backend Console (When rejecting donation)
```
📧 DONATION VERIFICATION NOTIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: donor@example.com
Subject: Your donation "Test Donation" has been REJECTED ❌
Hello Donor Name,
Your donation "Test Donation" has been REJECTED ❌
Remarks: This donation doesn't meet our requirements
Thank you for your contribution to Givista.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Troubleshooting

### Issue: Can't create donation even though verified
- **Solution**: Check backend terminal for errors
- Verify user's `isVerified` field is `true` in database
- Refresh the page and try again

### Issue: Donation not showing in admin panel
- **Solution**: 
  - Make sure you're logged in as Admin
  - Check `verificationStatus` is `'Pending'`
  - Refresh the admin dashboard

### Issue: Badge not showing
- **Solution**: 
  - Check donation's `isVerified` field is `true`
  - Refresh the page
  - Check browser console for errors

### Issue: Notification not appearing
- **Solution**: 
  - Check backend terminal (notifications are logged there in development)
  - In production, integrate email/SMS service

---

## Testing Flow Summary

1. **Verify Profile** → Get ✅ badge
2. **Create Donation** → Starts as "Pending"
3. **Login as Admin** → View pending donations
4. **Approve/Reject** → See badges and status update
5. **Check Donor Dashboard** → See verification status
6. **Check Notifications** → View in backend terminal

---

**Happy Testing! 🎉**

For any issues, check:
- Backend terminal for errors
- Browser console (F12) for frontend errors
- Database to verify data is saved correctly

