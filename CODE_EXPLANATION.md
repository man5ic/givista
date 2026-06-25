# 📖 Givista - Complete Code Explanation Guide

This document explains **every file, function, and command** in the Givista project in detail.

---

## 📋 Table of Contents

1. [Project Structure Explained](#project-structure-explained)
2. [Backend Code Walkthrough](#backend-code-walkthrough)
3. [Frontend Code Walkthrough](#frontend-code-walkthrough)
4. [AI Service Code Walkthrough](#ai-service-code-walkthrough)
5. [How Everything Connects](#how-everything-connects)
6. [Command Explanations](#command-explanations)

---

## 🗂️ Project Structure Explained

### Root Directory (`givista/`)

```
givista/
├── frontend/     → React TypeScript application
├── backend/      → Node.js Express API server
└── ai_service/   → Python Flask AI microservice
```

**Why this structure?**
- **Monorepo**: All code in one repository
- **Separation of concerns**: Frontend, backend, and AI service are independent
- **Easy deployment**: Each can be deployed separately

---

## 🔧 Backend Code Walkthrough

### File: `backend/src/server.ts`

**Purpose:** Main entry point for the Express server.

**What it does:**
1. Imports Express and sets up the server
2. Configures middleware (CORS, JSON parsing)
3. Registers all API routes
4. Connects to database
5. Starts listening on port 3000

**Code Explanation:**

```typescript
import express, { Request, Response, NextFunction } from 'express';
```
- `express`: Web framework for Node.js
- `Request, Response, NextFunction`: TypeScript types for Express handlers

```typescript
import cors from 'cors';
```
- **CORS** (Cross-Origin Resource Sharing): Allows frontend (port 5173) to call backend (port 3000)
- Without CORS, browser blocks API calls from different origins

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
```
- `origin`: Which URLs can make requests (your React app)
- `credentials: true`: Allows cookies/auth headers

```typescript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```
- `express.json()`: Parses JSON request bodies (e.g., `{ "email": "..." }`)
- `express.urlencoded()`: Parses form data (e.g., form submissions)

```typescript
app.use('/uploads', express.static('uploads'));
```
- Serves uploaded files (images) at `/uploads/filename.jpg`
- `express.static`: Serves static files from a directory

```typescript
app.use('/api/v1/auth', authRoutes);
```
- Mounts authentication routes at `/api/v1/auth`
- Example: `POST /api/v1/auth/login`

```typescript
await sequelize.authenticate();
```
- Tests database connection
- Throws error if MySQL is not running or credentials are wrong

```typescript
await sequelize.sync({ alter: true });
```
- **Syncs database models**: Creates/updates tables based on Sequelize models
- `alter: true`: Updates existing tables if schema changed
- **Note:** In production, use migrations instead of `sync()`

---

### File: `backend/src/config/database.ts`

**Purpose:** Database connection configuration.

**Code Explanation:**

```typescript
export const sequelize = new Sequelize(
  process.env.DB_NAME || 'givista_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
  }
);
```

**Breaking it down:**
- `Sequelize`: ORM (Object-Relational Mapping) library
- **ORM** = Write JavaScript/TypeScript instead of SQL
- `dialect: 'mysql'`: Tells Sequelize we're using MySQL
- Reads values from `.env` file
- Falls back to defaults if `.env` values missing

**Why use an ORM?**
- **Without ORM:** `connection.query('SELECT * FROM users WHERE id = ?', [userId])`
- **With ORM:** `User.findOne({ where: { id: userId } })`
- Cleaner, safer (prevents SQL injection), type-safe

---

### File: `backend/src/models/User.model.ts`

**Purpose:** Defines the User database table structure.

**Code Explanation:**

```typescript
export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'Donor' | 'Receiver' | 'Admin';
  location: string;
  photo_url?: string;
}
```

- **Interface:** TypeScript type definition
- `role: 'Donor' | 'Receiver' | 'Admin'`: Union type (must be one of these)
- `photo_url?: string`: Optional field (`?` means optional)

```typescript
class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: number;
  public name!: string;
  // ...
}
```

- `extends Model`: Sequelize model class
- `!`: TypeScript "definite assignment assertion" (we promise it will have a value)

```typescript
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
}, {
  sequelize,
  tableName: 'users',
  timestamps: true,
});
```

**Field definitions:**
- `autoIncrement: true`: ID increases automatically (1, 2, 3, ...)
- `primaryKey: true`: Unique identifier for each row
- `unique: true`: No two users can have the same email
- `validate: { isEmail: true }`: Ensures valid email format
- `timestamps: true`: Adds `createdAt` and `updatedAt` columns automatically

---

### File: `backend/src/utils/auth.util.ts`

**Purpose:** Authentication helper functions.

**Functions:**

#### `hashPassword(password: string)`

```typescript
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};
```

**What this does:**
- **Hashes** password before storing in database
- **Why hash?** Security - if database is breached, passwords are unreadable
- **bcrypt:** Industry-standard hashing algorithm
- `saltRounds = 10`: Number of encryption rounds (higher = slower but more secure)

**Example:**
- Input: `"password123"`
- Output: `"$2b$10$abcdefghijklmnopqrstuvwxyz..."` (one-way, cannot be reversed)

#### `comparePassword(password: string, hash: string)`

```typescript
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

**What this does:**
- Compares plain password with stored hash
- Returns `true` if they match

**Example:**
- User enters: `"password123"`
- Database has: `"$2b$10$abcdef..."` (hashed)
- bcrypt compares → returns `true` if match

#### `generateToken(userId: number, email: string, role: string)`

```typescript
export const generateToken = (
  userId: number,
  email: string,
  role: string
): string => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};
```

**What this does:**
- Creates a **JWT (JSON Web Token)**
- **JWT:** Encrypted string containing user info
- User sends JWT with each request to prove identity
- Backend verifies JWT to authenticate user

**JWT Structure:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJvbGUiOiJEb25vciJ9.signature
```

**Parts:**
1. **Header:** Algorithm info
2. **Payload:** User data (`userId`, `email`, `role`)
3. **Signature:** Ensures token wasn't tampered with

**Why use JWT?**
- **Stateless:** Backend doesn't need to store sessions
- **Secure:** Signed with secret key
- **Portable:** Works across different servers

---

### File: `backend/src/middleware/auth.middleware.ts`

**Purpose:** Protects routes - only authenticated users can access.

**Code:**

```typescript
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ success: false, message: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
```

**How it works:**
1. **Extracts token** from `Authorization: Bearer <token>` header
2. **Verifies token** using JWT secret
3. **Attaches user data** to `req.user`
4. **Calls `next()`** to continue to the route handler
5. **If invalid:** Returns 401 Unauthorized

**Usage:**
```typescript
router.get('/donations', authenticate, getDonations);
```
- Middleware runs **before** `getDonations`
- Only proceeds if token is valid

---

### File: `backend/src/controllers/auth.controller.ts`

**Purpose:** Handles authentication routes (signup, login).

#### `signup` Function

```typescript
export const signup = async (req: Request, res: Response) => {
  // 1. Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ... });
  }

  // 2. Check if user exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ ... });
  }

  // 3. Hash password
  const password_hash = await hashPassword(password);

  // 4. Create user
  const user = await User.create({ name, email, password_hash, role, location });

  // 5. Generate token
  const token = generateToken(user.id, user.email, user.role);

  // 6. Return response
  res.status(201).json({ success: true, data: { user, token } });
};
```

**Step-by-step:**
1. **Validate:** Checks email format, required fields
2. **Check duplicate:** Prevents duplicate emails
3. **Hash password:** Never store plain passwords
4. **Create user:** Saves to database
5. **Generate token:** Returns JWT for immediate login
6. **Response:** Returns user data (without password) and token

#### `login` Function

```typescript
export const login = async (req: Request, res: Response) => {
  // 1. Find user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // 2. Compare password
  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // 3. Generate token
  const token = generateToken(user.id, user.email, user.role);

  // 4. Return response
  res.json({ success: true, data: { user, token } });
};
```

**Why generic error message?**
- Don't reveal if email exists or password is wrong
- Security best practice

---

### File: `backend/src/services/ai.service.ts`

**Purpose:** Communicates with Python Flask AI microservice.

**Code:**

```typescript
export const getAIRecommendations = async (
  request: AIRecommendationRequest
): Promise<AIRecommendationResponse> => {
  try {
    const response = await axios.post<AIRecommendationResponse>(
      `${AI_SERVICE_URL}/recommend`,
      request,
      {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    // Error handling...
  }
};
```

**What this does:**
1. **Sends POST request** to AI service at `http://localhost:5000/recommend`
2. **Sends user data:** `{ user_id, user_type, category, location, urgency }`
3. **Waits for response:** AI service returns recommendations
4. **Handles errors:** Timeout, connection refused, etc.

**Error Handling:**
- `ECONNABORTED`: Request timed out (AI service too slow)
- `ECONNREFUSED`: AI service not running
- `HTTP errors`: AI service returned error status

**Retry Logic:**

```typescript
export const retryAICall = async <T>(
  fn: () => Promise<T>,
  retries: number = 2
): Promise<T> => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        // Wait before retrying (exponential backoff)
      }
    }
  }
  throw error;
};
```

**What this does:**
- **Tries function** up to 3 times (1 initial + 2 retries)
- **Exponential backoff:** Waits longer between each retry (1s, 2s, 3s)
- **Use case:** Network hiccups, temporary AI service issues

---

## 🎨 Frontend Code Walkthrough

### File: `frontend/src/main.tsx`

**Purpose:** React application entry point.

**Code:**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**What this does:**
1. **Imports React:** UI library
2. **Finds root element:** `<div id="root">` in `index.html`
3. **Renders App component:** Starts React app
4. **StrictMode:** Development mode warnings

---

### File: `frontend/src/App.tsx`

**Purpose:** Main app component with routing.

**Code:**

```typescript
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
```

**Structure:**
- `AuthProvider`: Wraps entire app, provides authentication context
- `AppContent`: Contains routes

**Routes:**

```typescript
<Routes>
  {/* Public routes */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />

  {/* Protected routes */}
  <Route
    path="/donor/dashboard"
    element={
      <ProtectedRoute>
        <DonorDashboard />
      </ProtectedRoute>
    }
  />
</Routes>
```

**How routing works:**
- `path="/"`: URL path (e.g., `http://localhost:5173/`)
- `element={<Component />}`: Component to render
- `ProtectedRoute`: Wrapper that checks authentication

---

### File: `frontend/src/contexts/AuthContext.tsx`

**Purpose:** Global authentication state management.

**Code:**

```typescript
const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

**What is Context?**
- **React Context:** Global state accessible to all components
- **Alternative to props:** Avoids passing data through many components

**State:**

```typescript
const [user, setUser] = useState<IUser | null>(null);
const [loading, setLoading] = useState(true);
```

- `user`: Current logged-in user (null if not logged in)
- `loading`: True while checking authentication

**Functions:**

```typescript
const login = async (email: string, password: string) => {
  const response = await loginUser({ email, password });
  setUser(response.user);
  localStorage.setItem('authToken', response.token);
};
```

**What this does:**
1. **Calls API:** `POST /api/v1/auth/login`
2. **Saves token:** Stores JWT in browser localStorage
3. **Updates state:** Sets user data in context
4. **All components** can now access user via `useAuth()`

**Usage in components:**
```typescript
const { user, login, logout } = useAuth();
```

---

### File: `frontend/src/components/ProtectedRoute.tsx`

**Purpose:** Protects routes - redirects to login if not authenticated.

**Code:**

```typescript
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
```

**How it works:**
1. **Checks authentication:** Uses `useAuth()` hook
2. **If loading:** Shows loading spinner
3. **If not authenticated:** Redirects to `/login`
4. **If authenticated:** Renders children (the protected page)

**Example:**
- User tries to access `/donor/dashboard`
- Not logged in → Redirected to `/login`
- Logs in → Can now access dashboard

---

### File: `frontend/src/types/api/apiService.ts`

**Purpose:** Axios instance with base configuration.

**Code:**

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**What this does:**
- **Creates Axios instance:** Reusable HTTP client
- **baseURL:** All requests prefixed with this (e.g., `http://localhost:3000/api/v1`)
- **Headers:** Sets JSON content type

**Request Interceptor:**

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**What this does:**
- **Runs before every request**
- **Adds JWT token** to `Authorization` header
- **Automatic:** No need to add token manually in each API call

**Example:**
- Component calls: `api.get('/donations')`
- Interceptor adds: `Authorization: Bearer <token>`
- Backend receives request with token

**Response Interceptor:**

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**What this does:**
- **If 401 Unauthorized:** Token expired or invalid
- **Removes token:** Clears from localStorage
- **Redirects to login:** Forces user to log in again

---

### File: `frontend/src/pages/LoginPage.tsx`

**Purpose:** Login form component.

**Key parts:**

```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
```

**State:** Form input values

```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  try {
    await login(email, password);
    // Redirect based on role
    if (user?.role === 'Donor') {
      navigate('/donor/dashboard');
    } else if (user?.role === 'Receiver') {
      navigate('/receiver/dashboard');
    }
  } catch (error) {
    toast.error('Login failed');
  }
};
```

**What this does:**
1. **Prevents default:** Stops form from submitting normally
2. **Calls login:** Uses AuthContext `login` function
3. **Redirects:** Based on user role
4. **Error handling:** Shows toast notification if login fails

---

## 🤖 AI Service Code Walkthrough

### File: `ai_service/app.py`

**Purpose:** Flask API for AI-powered recommendations.

**Code:**

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
```

**Imports:**
- `Flask`: Python web framework
- `flask_cors`: Enables CORS (backend can call this service)
- `TfidfVectorizer`: Converts text to numbers (for ML)
- `cosine_similarity`: Calculates similarity between vectors

---

#### `train_model()` Function

**Purpose:** Trains the recommendation model.

**Code:**

```python
def train_model():
    user_data = pd.read_csv(DATA_FILE)
    
    # Create feature vectors
    user_data['features'] = (
        user_data['category'].astype(str) + ' ' +
        user_data['location'].astype(str) + ' ' +
        user_data['urgency'].astype(str)
    )
    
    # Vectorize features
    vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
    feature_vectors = vectorizer.fit_transform(user_data['features'])
    
    # Calculate similarity matrix
    similarity_matrix = cosine_similarity(feature_vectors)
    
    # Save model
    with open(MODEL_FILE, 'wb') as f:
        pickle.dump(model_vectorizer, f)
```

**Step-by-step explanation:**

1. **Load data:**
   ```python
   user_data = pd.read_csv(DATA_FILE)
   ```
   - Reads CSV file with user donation history
   - Columns: `user_id`, `category`, `location`, `urgency`

2. **Create features:**
   ```python
   user_data['features'] = category + ' ' + location + ' ' + urgency
   ```
   - Combines columns into text string
   - Example: `"Food New York High"`

3. **TF-IDF Vectorization:**
   ```python
   vectorizer = TfidfVectorizer()
   feature_vectors = vectorizer.fit_transform(user_data['features'])
   ```
   - **TF-IDF:** Converts text to numbers
   - **Why?** Machine learning algorithms need numbers, not text
   - **Example:**
     - Text: `"Food New York High"`
     - Vector: `[0.5, 0.3, 0.8, 0.1, ...]` (array of numbers)

4. **Cosine Similarity:**
   ```python
   similarity_matrix = cosine_similarity(feature_vectors)
   ```
   - **Calculates similarity** between all users
   - **Range:** 0 (no match) to 1 (perfect match)
   - **Example:**
     - User 1: `[0.5, 0.3, 0.8]`
     - User 2: `[0.5, 0.3, 0.8]`
     - Similarity: **1.0** (perfect match)

5. **Save model:**
   ```python
   pickle.dump(model_vectorizer, f)
   ```
   - **Pickle:** Python library for saving objects
   - Saves trained model to file (`model.pkl`)
   - **Why save?** Don't need to retrain every time server starts

---

#### `get_recommendations()` Function

**Purpose:** Gets recommendations for a user.

**Code:**

```python
def get_recommendations(user_id, user_type, category=None, location=None, urgency=None):
    # Create query features
    query_text = ' '.join([category, location, urgency])
    
    # Vectorize query
    query_vector = vectorizer.transform([query_text])
    
    # Calculate similarity
    similarities = cosine_similarity(query_vector, feature_vectors)[0]
    
    # Filter out requesting user
    mask = user_ids != user_id
    filtered_similarities = similarities[mask]
    
    # Get top 5 recommendations
    top_indices = np.argsort(filtered_similarities)[::-1][:5]
    
    return recommendations
```

**How it works:**

1. **Create query:**
   - Combines user's search criteria: `"Food New York High"`

2. **Vectorize query:**
   - Converts to same format as training data
   - Uses **same vectorizer** from training (important!)

3. **Calculate similarity:**
   - Compares query vector with all user vectors
   - Gets similarity scores (0 to 1)

4. **Filter:**
   - Removes requesting user (don't recommend yourself)

5. **Top 5:**
   - `np.argsort()`: Sorts by similarity (highest first)
   - Returns top 5 matches

---

#### `@app.route('/recommend', methods=['POST'])`

**Purpose:** API endpoint for getting recommendations.

**Request:**
```json
{
  "user_id": 1,
  "user_type": "receiver",
  "category": "Food",
  "location": "New York",
  "urgency": "High"
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "user_id": 2,
      "score": 0.85,
      "match_details": "Category match: Food, Location: New York, Similarity score: 0.85"
    }
  ]
}
```

**Code:**

```python
@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    
    user_id = data.get('user_id')
    user_type = data.get('user_type')
    category = data.get('category')
    location = data.get('location')
    urgency = data.get('urgency')
    
    recommendations = get_recommendations(
        user_id=user_id,
        user_type=user_type,
        category=category,
        location=location,
        urgency=urgency
    )
    
    return jsonify({ 'recommendations': recommendations }), 200
```

**What this does:**
1. **Receives JSON:** Gets request data from backend
2. **Extracts fields:** Gets user_id, category, etc.
3. **Calls function:** Gets recommendations
4. **Returns JSON:** Sends recommendations back to backend

---

## 🔗 How Everything Connects

### Complete Flow: User Creates Request → Gets Recommendations

**Step 1: Frontend (React)**
```
User fills form → CreateRequestPage.tsx
Clicks "Submit" → Calls createRequest() API
```

**Step 2: Frontend API Call**
```typescript
// frontend/src/types/api/requestApi.ts
export const createRequest = async (data: CreateRequestData) => {
  const response = await api.post('/requests', data);
  return response.data;
};
```
- Sends: `POST http://localhost:3000/api/v1/requests`
- Headers: `Authorization: Bearer <token>`

**Step 3: Backend Route**
```typescript
// backend/src/routes/request.routes.ts
router.post('/', authenticate, createRequest);
```
- Middleware: `authenticate` verifies JWT token
- Handler: `createRequest` controller function

**Step 4: Backend Controller**
```typescript
// backend/src/controllers/request.controller.ts
export const createRequest = async (req: Request, res: Response) => {
  const request = await Request.create({ ... });
  
  // Get AI recommendations
  const recommendations = await getAIRecommendations({
    user_id: req.user.userId,
    user_type: 'receiver',
    category: request.category,
    location: request.location,
    urgency: request.urgency,
  });
  
  // Save recommendations to database
  for (const rec of recommendations.recommendations) {
    await Recommendation.create({
      receiverId: request.receiverId,
      donorId: rec.user_id,
      score: rec.score,
    });
  }
  
  res.json({ success: true, data: request });
};
```

**Step 5: Backend → AI Service**
```typescript
// backend/src/services/ai.service.ts
const response = await axios.post(
  'http://localhost:5000/recommend',
  { user_id, user_type, category, location, urgency }
);
```
- Sends: `POST http://localhost:5000/recommend`
- Body: User data

**Step 6: AI Service Processing**
```python
# ai_service/app.py
@app.route('/recommend', methods=['POST'])
def recommend():
    recommendations = get_recommendations(user_id, user_type, category, location, urgency)
    return jsonify({ 'recommendations': recommendations })
```
- Calculates similarity scores
- Returns top matches

**Step 7: Backend Saves Recommendations**
```typescript
// Save to database
await Recommendation.create({ ... });
```

**Step 8: Frontend Displays**
```typescript
// User navigates to RecommendationsPage
const recommendations = await getRecommendations();
// Display list of recommended donors/receivers
```

---

## 💻 Command Explanations

### `npm install`

**What it does:**
- Reads `package.json`
- Downloads all packages listed in `dependencies` and `devDependencies`
- Installs into `node_modules/` folder

**Example:**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "sequelize": "^6.35.0"
  }
}
```
- Downloads `express` and `sequelize` and their dependencies
- Installs ~200+ packages total

**Why `node_modules/` is huge:**
- Contains all packages + their dependencies
- Example: `express` depends on 30+ other packages
- Each package has its own dependencies

**Never commit `node_modules/`:**
- Too large (100+ MB)
- Platform-specific (different on Windows/Linux/Mac)
- Regenerate with `npm install`

---

### `npm run dev`

**What it does:**
- Runs script defined in `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon src/server.ts"
  }
}
```

**Breaking it down:**
- `nodemon`: Watches files, restarts server on changes
- `src/server.ts`: Entry point file

**Why use nodemon?**
- **Without nodemon:** Change code → manually restart server
- **With nodemon:** Change code → server restarts automatically

---

### `python -m venv venv`

**What it does:**
- Creates Python virtual environment
- **Virtual environment:** Isolated Python environment

**Why use virtual environments?**
- **Without venv:** All Python packages installed globally
  - Problem: Project A needs Flask 2.0, Project B needs Flask 3.0
  - Conflict!
- **With venv:** Each project has its own packages
  - Project A: `venv/` with Flask 2.0
  - Project B: `venv/` with Flask 3.0
  - No conflicts!

**Activating venv:**

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

**How to know it's active:**
- Terminal prompt shows `(venv)`
- Example: `(venv) C:\Users\...\givista\ai_service>`

---

### `pip install -r requirements.txt`

**What it does:**
- Reads `requirements.txt`
- Installs all listed packages

**requirements.txt:**
```
Flask==3.0.0
scikit-learn==1.3.2
pandas==2.1.4
```

**Breaking it down:**
- `Flask==3.0.0`: Exact version (3.0.0)
- `Flask>=3.0.0`: Minimum version (3.0.0 or higher)
- `Flask`: Latest version

**Why specify versions?**
- **Ensures consistency:** Same versions on all machines
- **Prevents breaking changes:** New version might break code
- **Reproducible builds:** Anyone can recreate exact environment

---

### `CREATE DATABASE givista_db;`

**What it does:**
- Creates a new MySQL database
- Database name: `givista_db`

**SQL Explanation:**
- `CREATE DATABASE`: SQL command to create database
- `givista_db`: Database name (you choose this)
- `;`: End of SQL statement

**Why create database first?**
- Backend needs a database to create tables
- Sequelize connects to this database
- Tables (users, donations, etc.) are created inside this database

---

### `npm run seed`

**What it does:**
- Runs database seeding script
- Creates sample data for testing

**Script:**
```typescript
// backend/src/seeders/seed.ts
await User.create({ name: 'Sample Donor', email: 'donor@example.com', ... });
await Donation.create({ title: 'Food Donation', ... });
```

**Why seed data?**
- **Testing:** Can test features without creating data manually
- **Development:** Quick way to populate database
- **Demo:** Shows how app works with sample data

**Seed data typically includes:**
- Sample users (donor, receiver, admin)
- Sample donations
- Sample requests
- Sample recommendations

---

## 🎓 Summary

### Key Concepts

1. **Authentication:**
   - Password hashing (bcrypt)
   - JWT tokens
   - Protected routes (middleware)

2. **Database:**
   - Sequelize ORM (instead of raw SQL)
   - Models define table structure
   - Relationships between tables

3. **API Communication:**
   - Frontend → Backend: REST API calls
   - Backend → AI Service: HTTP requests
   - Axios for HTTP client

4. **AI Recommendations:**
   - TF-IDF vectorization (text → numbers)
   - Cosine similarity (find similar users)
   - Machine learning pipeline

5. **React:**
   - Components (reusable UI)
   - Context (global state)
   - Routing (navigation)
   - Hooks (state management)

---

## 🔍 Next Steps for Learning

1. **Read the code:**
   - Start with `server.ts` (backend entry point)
   - Follow API calls through to database
   - Understand component hierarchy in React

2. **Modify and test:**
   - Change colors in Tailwind CSS
   - Add new API endpoint
   - Modify AI recommendation algorithm

3. **Debug:**
   - Use browser DevTools (F12)
   - Check terminal output
   - Add `console.log()` statements

4. **Extend features:**
   - Add image upload
   - Add email notifications
   - Add real-time chat (WebSockets)

---

**Congratulations! 🎊 You now understand how the entire Givista platform works!**

For setup instructions, see `README.md` or `SETUP_GUIDE.md`.

