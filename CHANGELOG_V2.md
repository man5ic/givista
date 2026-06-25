# Givista v2 - Full Feature Changelog

## New Features Added

### ✅ 1. Extended Badges (8 total)
- **File**: `backend/src/services/badge.service.ts`, `frontend/src/utils/badgeDefinitions.ts`
- New badges: 🚀 First Step, 🩸 Blood Guardian, 🔥 Streak Master, 🏆 Verified Champion, 🌍 City Hero
- Auto-awarded with full logic (consecutive months, blood donations, unique locations)

### ✅ 2. Photo Upload UI on CreateDonationPage
- **File**: `frontend/src/pages/CreateDonationPage.tsx`
- File picker button + URL input with live preview
- 5MB limit check, remove button, error handling

### ✅ 3. Notifications Bell in Navbar
- **Files**: `frontend/src/contexts/NotificationContext.tsx`, `frontend/src/components/NotificationBell.tsx`
- Bell icon with unread count badge
- Dropdown list with mark-all-read and clear-all
- Time-ago display

### ✅ 4. Rich Receiver Dashboard
- **File**: `frontend/src/pages/dashboards/ReceiverDashboard.tsx`
- Stats cards (requests, active, fulfilled, points)
- Search + status filter on requests
- Badges panel with earned/locked display
- Skeleton loading states
- Quick links sidebar

### ✅ 5. Profile Edit Page
- **File**: `frontend/src/pages/ProfilePage.tsx`
- Edit name, location, phone, profile photo URL
- Photo URL preview with error fallback
- Badges panel showing earned + locked badges with requirements
- Inline validation

### ✅ 6. Search & Filter on Dashboards
- **Files**: Donor & Receiver Dashboards
- Donor: search by title/category + filter by category and status
- Receiver: search by title/category + filter by status
- Instant client-side filtering

### ✅ 7. Animated Impact Counter on Landing Page
- **File**: `frontend/src/pages/LandingPage.tsx`
- Fetches live stats from `/api/v1/users/stats/platform`
- Animated counter counting up on load
- Falls back to demo numbers if API is down
- Stats: Total Donations, Active Donors, People Helped, This Month

### ✅ 8. Analytics Charts
- **File**: `frontend/src/pages/DonationAnalyticsPage.tsx`
- Pie chart: donations by category
- Line chart: monthly trend (last 6 months)
- Bar chart: donations by status
- Recent activity table
- Skeleton loading states

### ✅ 9. Dark Mode
- **Files**: `frontend/src/contexts/ThemeContext.tsx`, `frontend/tailwind.config.js`, all pages
- Toggle button in Navbar (sun/moon icon)
- Persisted to localStorage
- Respects system preference on first load
- Full dark styling across all components

### ✅ 10. Forgot Password Flow
- **Files**: `backend/src/controllers/auth.controller.ts`, `backend/src/routes/auth.routes.ts`, `frontend/src/pages/ForgotPasswordPage.tsx`
- Step 1: enter email → OTP generated (logged to console in dev, ready for email in prod)
- Step 2: enter OTP + new password → account updated
- Dev mode: OTP shown in toast so you can test immediately
- "Forgot password?" link on LoginPage

### ✅ 11. Form Validation (inline errors)
- **Files**: `LoginPage.tsx`, `SignupPage.tsx`, `ForgotPasswordPage.tsx`, `CreateDonationPage.tsx`, `ProfilePage.tsx`
- Red border + error message per field
- Validates before API call to prevent unnecessary requests
- Password match check, email format, min length

### ✅ 12. Request Expiry Scheduler
- **File**: `backend/src/services/expiry.service.ts`
- Runs on server startup + every 24 hours
- Expires requests older than 30 days (configurable via `REQUEST_EXPIRY_DAYS` in `.env`)
- Logs how many requests were expired

### ✅ 13. Ratings & Reviews
- **Files**: `backend/src/models/Rating.model.ts`, `backend/src/routes/rating.routes.ts`, `frontend/src/components/RatingModal.tsx`
- Receivers rate donors (1–5 stars) after a completed donation
- Optional comment field
- One rating per donation (enforced)
- Donor's average rating auto-calculated
- Star hover animation in modal

### ✅ 14. Donor Dashboard Upgraded
- **File**: `frontend/src/pages/dashboards/DonorDashboard.tsx`
- Photo avatar with fallback initials
- Search + category + status filters
- Photo thumbnail in donation list items
- Next-to-earn badge hints
- Skeleton loading states
- Verified badge display

### ✅ 15. Platform Stats API
- **File**: `backend/src/controllers/user.controller.ts`
- `GET /api/v1/users/stats/platform` — public endpoint
- Returns: totalDonations, totalDonors, totalReceivers, totalRequests, donationsThisMonth

---

## Files Modified

### Backend
| File | Change |
|------|--------|
| `src/server.ts` | Added Rating model, rating routes, expiry scheduler |
| `src/controllers/auth.controller.ts` | Added forgotPassword, resetPassword |
| `src/routes/auth.routes.ts` | Added /forgot-password and /reset-password routes |
| `src/controllers/user.controller.ts` | Added getPlatformStats, updateUserProfile |
| `src/routes/user.routes.ts` | Added PUT /:id and GET /stats/platform |
| `src/services/badge.service.ts` | Extended to 8 badges with full logic |
| `src/services/expiry.service.ts` | **NEW** — request expiry scheduler |
| `src/models/Rating.model.ts` | **NEW** — Rating model |
| `src/routes/rating.routes.ts` | **NEW** — POST /ratings, GET /ratings/donor/:id |

### Frontend
| File | Change |
|------|--------|
| `src/main.tsx` | Added ThemeProvider |
| `src/App.tsx` | Added /profile, /forgot-password, NotificationProvider |
| `src/index.css` | Dark mode base styles |
| `tailwind.config.js` | darkMode: 'class' |
| `src/contexts/ThemeContext.tsx` | **NEW** — dark mode toggle |
| `src/contexts/NotificationContext.tsx` | **NEW** — in-app notifications |
| `src/components/Navbar.tsx` | Dark mode toggle, NotificationBell, profile avatar |
| `src/components/NotificationBell.tsx` | **NEW** — bell with dropdown |
| `src/components/RatingModal.tsx` | **NEW** — star rating modal |
| `src/pages/LandingPage.tsx` | Impact counter with animation |
| `src/pages/LoginPage.tsx` | Inline validation, forgot password link |
| `src/pages/SignupPage.tsx` | Inline validation, dark mode |
| `src/pages/ForgotPasswordPage.tsx` | **NEW** — 2-step forgot password |
| `src/pages/ProfilePage.tsx` | **NEW** — edit profile + badges |
| `src/pages/CreateDonationPage.tsx` | Photo upload UI, inline validation |
| `src/pages/DonationAnalyticsPage.tsx` | Recharts pie/line/bar charts |
| `src/pages/dashboards/DonorDashboard.tsx` | Search/filter, skeletons, photos, badges |
| `src/pages/dashboards/ReceiverDashboard.tsx` | Full rebuild with stats, search, badges |
| `src/utils/badgeDefinitions.ts` | 8 badge definitions with requirements |

---

## How to Run

```bash
# Backend
cd backend
npm install
npx nodemon -r ts-node/register src/server.ts

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 — all features active.
