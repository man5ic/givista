# 📊 Givista - Complete Project Overview

**A comprehensive guide to all files, features, and architecture of the Givista donation platform.**

---

## 🎯 Project Summary

**Givista** is a full-stack donation platform that connects donors with receivers (orphanages, individuals) through:
- **Role-based dashboards** (Donor, Receiver, Admin)
- **AI-powered matching** using machine learning
- **Real-time messaging** between users
- **Donation/request management** system

---

## 📁 Complete File Structure

```
givista/
│
├── 📄 README.md                    # Main documentation (start here!)
├── 📄 SETUP_GUIDE.md              # Step-by-step setup instructions
├── 📄 CODE_EXPLANATION.md          # Detailed code explanations
├── 📄 QUICK_START.md               # Quick setup (10 minutes)
├── 📄 PROJECT_OVERVIEW.md          # This file
│
├── 🎨 frontend/                    # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx          # Navigation bar component
│   │   │   └── ProtectedRoute.tsx  # Route protection wrapper
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx     # Global auth state management
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx     # Home page
│   │   │   ├── LoginPage.tsx       # Login form
│   │   │   ├── SignupPage.tsx       # Registration form
│   │   │   ├── NotFoundPage.tsx    # 404 error page
│   │   │   ├── CreateDonationPage.tsx    # Donation creation form
│   │   │   ├── CreateRequestPage.tsx      # Request creation form
│   │   │   ├── RecommendationsPage.tsx   # AI recommendations display
│   │   │   ├── MessagesPage.tsx          # Messaging interface
│   │   │   │
│   │   │   └── dashboards/
│   │   │       ├── DonorDashboard.tsx     # Donor-specific dashboard
│   │   │       ├── ReceiverDashboard.tsx # Receiver-specific dashboard
│   │   │       └── AdminDashboard.tsx    # Admin management dashboard
│   │   │
│   │   ├── types/
│   │   │   ├── api.d.ts                   # TypeScript type definitions
│   │   │   └── api/
│   │   │       ├── apiService.ts          # Axios instance with interceptors
│   │   │       ├── authApi.ts            # Authentication API calls
│   │   │       ├── donationApi.ts        # Donation API calls
│   │   │       ├── requestApi.ts          # Request API calls
│   │   │       ├── recommendationApi.ts  # Recommendation API calls
│   │   │       └── messageApi.ts         # Message API calls
│   │   │
│   │   ├── App.tsx                # Main app with routing
│   │   ├── main.tsx               # React entry point
│   │   └── index.css              # Global styles + Tailwind
│   │
│   ├── package.json               # Frontend dependencies
│   ├── tsconfig.json              # TypeScript configuration
│   ├── tailwind.config.js         # Tailwind CSS configuration
│   ├── vite.config.ts             # Vite bundler configuration
│   ├── .env.example               # Environment variables template
│   └── .gitignore                 # Git ignore rules
│
├── 🔧 backend/                    # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts        # Sequelize MySQL connection
│   │   │
│   │   ├── controllers/           # Request handlers (business logic)
│   │   │   ├── auth.controller.ts      # Signup, login
│   │   │   ├── user.controller.ts      # User CRUD operations
│   │   │   ├── donation.controller.ts  # Donation CRUD operations
│   │   │   ├── request.controller.ts   # Request CRUD operations
│   │   │   ├── recommendation.controller.ts  # AI recommendation handling
│   │   │   └── message.controller.ts   # Messaging operations
│   │   │
│   │   ├── models/                # Sequelize database models
│   │   │   ├── User.model.ts           # User table definition
│   │   │   ├── Donation.model.ts       # Donation table definition
│   │   │   ├── Request.model.ts        # Request table definition
│   │   │   ├── Recommendation.model.ts  # Recommendation table definition
│   │   │   └── Message.model.ts        # Message table definition
│   │   │
│   │   ├── routes/                # Express route definitions
│   │   │   ├── auth.routes.ts          # /api/v1/auth/* routes
│   │   │   ├── user.routes.ts         # /api/v1/users/* routes
│   │   │   ├── donation.routes.ts     # /api/v1/donations/* routes
│   │   │   ├── request.routes.ts       # /api/v1/requests/* routes
│   │   │   ├── recommendation.routes.ts # /api/v1/recommendations/* routes
│   │   │   └── message.routes.ts       # /api/v1/messages/* routes
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts # JWT authentication middleware
│   │   │
│   │   ├── services/
│   │   │   └── ai.service.ts      # AI microservice integration
│   │   │
│   │   ├── utils/
│   │   │   └── auth.util.ts      # Password hashing, JWT generation
│   │   │
│   │   ├── seeders/
│   │   │   └── seed.ts           # Database seeding script
│   │   │
│   │   └── server.ts             # Express server entry point
│   │
│   ├── package.json              # Backend dependencies
│   ├── tsconfig.json             # TypeScript configuration
│   ├── .env.example              # Environment variables template
│   └── .gitignore                # Git ignore rules
│
└── 🤖 ai_service/                # Python Flask AI Microservice
    ├── app.py                    # Flask application + ML logic
    ├── requirements.txt          # Python dependencies
    ├── model.pkl                 # Saved ML model (generated)
    ├── vectorizer.pkl            # Saved vectorizer (generated)
    └── donation_data.csv         # Training data (generated)
```

---

## 🔑 Key Files Explained

### Frontend Core Files

| File | Purpose | Key Concepts |
|------|---------|--------------|
| `App.tsx` | Main routing component | React Router, protected routes |
| `AuthContext.tsx` | Global auth state | React Context API, localStorage |
| `apiService.ts` | HTTP client setup | Axios interceptors, base URLs |
| `ProtectedRoute.tsx` | Route guard | Authentication check, redirects |

### Backend Core Files

| File | Purpose | Key Concepts |
|------|---------|--------------|
| `server.ts` | Express server setup | Middleware, routes, database sync |
| `database.ts` | Sequelize connection | MySQL connection, ORM config |
| `auth.middleware.ts` | JWT verification | Token validation, user extraction |
| `ai.service.ts` | AI service client | HTTP requests, error handling, retries |

### AI Service Core Files

| File | Purpose | Key Concepts |
|------|---------|--------------|
| `app.py` | Flask API + ML | TF-IDF, cosine similarity, model training |

---

## 🗄️ Database Schema

### Tables

**1. `users`**
```
- id (INT, Primary Key, Auto Increment)
- name (VARCHAR(100))
- email (VARCHAR(100), Unique)
- password_hash (VARCHAR(255))
- role (ENUM: 'Donor', 'Receiver', 'Admin')
- location (VARCHAR(200))
- photo_url (VARCHAR(500), Nullable)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

**2. `donations`**
```
- id (INT, Primary Key)
- donorId (INT, Foreign Key → users.id)
- title (VARCHAR(200))
- category (VARCHAR(50))
- quantity (INT)
- description (TEXT)
- status (VARCHAR(50))
- createdAt, updatedAt
```

**3. `requests`**
```
- id (INT, Primary Key)
- receiverId (INT, Foreign Key → users.id)
- title (VARCHAR(200))
- description (TEXT)
- category (VARCHAR(50))
- urgency (VARCHAR(20))
- status (VARCHAR(50))
- createdAt, updatedAt
```

**4. `recommendations`**
```
- id (INT, Primary Key)
- donorId (INT, Foreign Key → users.id)
- receiverId (INT, Foreign Key → users.id)
- score (DECIMAL(5,2))
- createdAt, updatedAt
```

**5. `messages`**
```
- id (INT, Primary Key)
- senderId (INT, Foreign Key → users.id)
- receiverId (INT, Foreign Key → users.id)
- text (TEXT)
- createdAt
```

---

## 🔄 Data Flow Diagrams

### User Registration Flow

```
1. Frontend (SignupPage.tsx)
   ↓ User fills form
   ↓ POST /api/v1/auth/signup
   
2. Backend (auth.controller.ts)
   ↓ Validate input
   ↓ Hash password (bcrypt)
   ↓ Create user in database
   ↓ Generate JWT token
   ↓ Return user + token
   
3. Frontend (AuthContext.tsx)
   ↓ Save token to localStorage
   ↓ Update user state
   ↓ Redirect to dashboard
```

### Donation Creation Flow

```
1. Frontend (CreateDonationPage.tsx)
   ↓ User fills donation form
   ↓ POST /api/v1/donations
   ↓ Authorization: Bearer <token>
   
2. Backend (donation.controller.ts)
   ↓ Verify JWT token (middleware)
   ↓ Create donation in database
   ↓ Call AI service for recommendations
   
3. AI Service (app.py)
   ↓ Receive donation data
   ↓ Calculate similarity scores
   ↓ Return top matches
   
4. Backend
   ↓ Save recommendations to database
   ↓ Return donation + recommendations
   
5. Frontend
   ↓ Display success message
   ↓ Redirect to dashboard
```

### Recommendation Retrieval Flow

```
1. Frontend (RecommendationsPage.tsx)
   ↓ GET /api/v1/recommendations
   ↓ Authorization: Bearer <token>
   
2. Backend (recommendation.controller.ts)
   ↓ Verify JWT token
   ↓ Query recommendations table
   ↓ Join with user data
   ↓ Return list of recommendations
   
3. Frontend
   ↓ Display recommended users
   ↓ Show match scores
   ↓ Link to user profiles
```

---

## 🛠️ Technology Stack Details

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI library |
| TypeScript | 5.3.3 | Type safety |
| Vite | 5.0.8 | Build tool, dev server |
| Tailwind CSS | 3.3.6 | Utility-first CSS |
| React Router | 6.20.1 | Client-side routing |
| Axios | 1.6.2 | HTTP client |
| React Toastify | 9.1.3 | Toast notifications |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 4.18.2 | Web framework |
| TypeScript | 5.3.3 | Type safety |
| Sequelize | 6.35.0 | ORM for MySQL |
| MySQL2 | 3.6.5 | MySQL driver |
| JWT | 9.0.2 | Authentication tokens |
| bcrypt | 5.1.1 | Password hashing |
| Multer | 1.4.5 | File upload handling |

### AI Service Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.8+ | Runtime |
| Flask | 3.0.0 | Web framework |
| scikit-learn | 1.3.2 | Machine learning |
| pandas | 2.1.4 | Data manipulation |
| numpy | 1.26.2 | Numerical computing |

---

## 🎨 UI Features

### Pages

1. **Landing Page**
   - Hero section with CTA buttons
   - Feature cards (Money, Food, Clothes)
   - AI matching explanation

2. **Login/Signup**
   - Form validation
   - Role selection (Donor/Receiver)
   - Error handling with toast messages

3. **Dashboards**
   - **Donor:** View donations, create new donations, see recommendations
   - **Receiver:** View requests, create new requests, see recommendations
   - **Admin:** User verification, manage donations/requests

4. **Recommendations Page**
   - AI-powered matches
   - Match scores
   - User profiles

5. **Messages Page**
   - Chat interface
   - Send/receive messages

---

## 🔐 Security Features

1. **Password Hashing**
   - bcrypt with 10 salt rounds
   - Passwords never stored in plain text

2. **JWT Authentication**
   - Stateless token-based auth
   - Token expiration (7 days)
   - Secret key signing

3. **Protected Routes**
   - Middleware verifies JWT
   - Role-based authorization

4. **Input Validation**
   - express-validator for backend
   - Client-side validation in forms

5. **CORS Protection**
   - Only frontend URL allowed
   - Prevents unauthorized API access

---

## 📊 API Endpoints Summary

### Authentication
- `POST /api/v1/auth/signup` - Register user
- `POST /api/v1/auth/login` - Login user

### Users
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user

### Donations
- `POST /api/v1/donations` - Create donation
- `GET /api/v1/donations` - Get all donations
- `GET /api/v1/donations/:id` - Get donation by ID
- `PUT /api/v1/donations/:id` - Update donation

### Requests
- `POST /api/v1/requests` - Create request
- `GET /api/v1/requests` - Get all requests
- `GET /api/v1/requests/:id` - Get request by ID
- `PUT /api/v1/requests/:id` - Update request

### Recommendations
- `GET /api/v1/recommendations` - Get user recommendations

### Messages
- `POST /api/v1/messages` - Send message
- `GET /api/v1/messages` - Get messages

### AI Service
- `POST http://localhost:5000/recommend` - Get AI recommendations
- `GET http://localhost:5000/health` - Health check

---

## 🧠 AI Recommendation Algorithm

### How It Works

1. **Training Phase:**
   - Load user donation/request history
   - Combine features (category, location, urgency) into text
   - Use TF-IDF to convert text to numerical vectors
   - Calculate cosine similarity matrix

2. **Prediction Phase:**
   - Receive new query (user_id, category, location, urgency)
   - Convert query to vector using same TF-IDF vectorizer
   - Calculate similarity with all users
   - Return top 5 matches

### Example

**Query:**
```
user_id: 1
category: "Food"
location: "New York"
urgency: "High"
```

**AI Processing:**
1. Vectorize: `"Food New York High"` → `[0.5, 0.3, 0.8, ...]`
2. Compare with all users
3. Find highest similarity scores
4. Return top matches

**Result:**
```json
{
  "recommendations": [
    { "user_id": 5, "score": 0.92, "match_details": "..." },
    { "user_id": 3, "score": 0.87, "match_details": "..." }
  ]
}
```

---

## 📝 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=givista_db
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
PORT=3000
AI_SERVICE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_AI_SERVICE_URL=http://localhost:5000
```

---

## 🚀 Deployment Checklist

### Before Deployment

- [ ] Change `NODE_ENV=production` in backend
- [ ] Generate strong `JWT_SECRET`
- [ ] Update database credentials
- [ ] Configure production database
- [ ] Update CORS origins
- [ ] Build frontend: `npm run build`
- [ ] Build backend: `npm run build`
- [ ] Set up environment variables on hosting platform
- [ ] Configure domain/SSL certificates

### Production Considerations

1. **Database:**
   - Use managed MySQL service (AWS RDS, etc.)
   - Enable SSL connections
   - Set up backups

2. **Security:**
   - Use HTTPS
   - Strong JWT secret
   - Rate limiting
   - Input sanitization

3. **Performance:**
   - Enable caching
   - Database indexing
   - Image optimization
   - CDN for static files

---

## 📚 Learning Resources

### For Understanding Code

1. **Start with:** `README.md` - Overview
2. **Setup:** `SETUP_GUIDE.md` - Step-by-step setup
3. **Code:** `CODE_EXPLANATION.md` - Detailed explanations
4. **Quick start:** `QUICK_START.md` - Fast setup

### Concepts to Learn

1. **React:**
   - Components, props, state
   - Hooks (useState, useEffect)
   - Context API
   - React Router

2. **Node.js/Express:**
   - Middleware
   - Routes
   - Error handling
   - Async/await

3. **Database:**
   - SQL basics
   - ORM concepts
   - Relationships

4. **AI/ML:**
   - Vectorization (TF-IDF)
   - Similarity metrics (cosine similarity)
   - Model training

---

## 🎯 Project Goals Achieved

✅ **Full-stack application** with React + Node.js  
✅ **Role-based authentication** (JWT)  
✅ **Database integration** (MySQL + Sequelize)  
✅ **AI-powered recommendations** (Python Flask + scikit-learn)  
✅ **RESTful API** design  
✅ **Protected routes** (frontend + backend)  
✅ **Responsive UI** (Tailwind CSS)  
✅ **Type safety** (TypeScript throughout)  

---

## 🔮 Future Enhancements

Possible additions:
- Real-time notifications (WebSockets)
- Email verification
- Payment integration (Stripe)
- Image upload to cloud storage (AWS S3)
- Advanced AI (deep learning models)
- Mobile app (React Native)
- Analytics dashboard
- Search functionality
- Filters and sorting

---

**For detailed setup instructions, see `README.md` or `SETUP_GUIDE.md`.**

**For code explanations, see `CODE_EXPLANATION.md`.**

**For quick setup, see `QUICK_START.md`.**

---

**Happy Coding! 🎉**

