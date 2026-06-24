<div align="center">

# 🤝 Givista

### Platform Features & Technology Stack

**A complete reference covering every feature, every technology, and how they work together.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com)

</div>

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Architecture](#-architecture)
3. [Technology Stack](#-technology-stack)
   - [Frontend](#31-frontend--react--typescript--tailwind-css)
   - [Backend](#32-backend--nodejs--express--typescript--sequelize--mysql)
   - [AI Microservice](#33-ai-microservice--flask--scikit-learn--pandas)
4. [Core Features](#-core-features)
5. [AI & Advanced Features](#-ai--advanced-features)
6. [Summary](#-summary)

---

## 🎯 Overview

Givista is an AI-powered donation platform that connects donors and receivers — including individuals, orphanages, NGOs, and communities — across four donation categories: **Money, Food, Clothes, and Blood.**

The platform provides personalised dashboards for Donors, Receivers, and Admins, and uses an AI recommendation engine to intelligently match donors and receivers based on category, location, urgency, and historical behaviour.

---

## 🏗️ Architecture

Givista is organised into three independently deployable layers:

- **Frontend** — React + TypeScript SPA running in the browser
- **Backend** — Node.js + Express REST API (TypeScript) with Sequelize ORM and MySQL
- **AI Microservice** — Python + Flask service with scikit-learn and pandas

```
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────────┐
│   Frontend        │        │   Backend         │        │   AI Microservice     │
│  React 18 +       │◄──────►│  Node.js +        │◄──────►│  Python + Flask       │
│  TypeScript       │  REST  │  Express +        │  REST  │  scikit-learn         │
│  Tailwind CSS     │  API   │  Sequelize ORM    │  API   │  pandas / pickle      │
│  Vite · Axios     │        │  JWT · bcrypt     │        │  /recommend           │
│                   │        │                   │        │  /fraud-detect        │
│  Port: 5173       │        │  Port: 3000       │        │  Port: 5000           │
└──────────────────┘        └────────┬──────────┘        └──────────────────────┘
                                     │
                                     ▼
                           ┌──────────────────┐
                           │   MySQL Database  │
                           │   Port: 3306      │
                           └──────────────────┘
```

The frontend communicates with the backend exclusively through REST APIs (Axios). The backend handles auth, business logic, database operations, and delegates AI work to the microservice. The AI service exposes its own REST endpoints called by the backend to generate recommendations and run fraud detection.

---

## 🛠️ Technology Stack

### Complete Technology Reference

| Layer | Technology | Usage in Givista | Why It Was Chosen |
|-------|-----------|-----------------|-------------------|
| **Frontend** | React 18 | All pages — Landing, Login/Signup, Donor/Receiver/Admin dashboards, AI recommendations, chat, 404 | Component-based SPA architecture with virtual DOM; vast ecosystem; perfect for role-specific dashboards |
| **Frontend** | TypeScript | All frontend logic: components, API services, route guards, state management, and type interfaces | Static typing catches bugs at compile time; User, Donation, Request, Recommendation interfaces keep the codebase maintainable |
| **Frontend** | Tailwind CSS / Bootstrap | Responsive layouts, buttons, cards, forms, tables, badges, and donation-tracking progress bars | Utility-first (Tailwind) or component system (Bootstrap) ensures consistent styling and rapid UI development |
| **Frontend** | React Router DOM | Routes: `/`, `/login`, `/signup`, `/dashboard`, `/donations`, `/requests`, `/admin`, `/ai-recommendations`, `/settings` | Enables SPA routing, protected routes for authenticated users, and role-based redirects |
| **Frontend** | Axios | HTTP calls to the backend for auth, donations, requests, recommendations, messages, analytics, and settings | Promise-based HTTP client with interceptors for attaching JWT tokens, typed responses, and centralised error handling |
| **Backend** | Node.js | Runtime that executes the entire backend TypeScript/JavaScript API server | Non-blocking I/O and high concurrency — ideal for real-time APIs and high-traffic donation feeds |
| **Backend** | Express | REST API framework defining `/auth`, `/users`, `/donations`, `/requests`, `/recommendations`, `/messages`, `/admin` routes | Minimal, flexible framework with excellent middleware support for auth, logging, rate-limiting, and CORS |
| **Backend** | TypeScript | All backend code: controllers, services, models, middleware, and configuration | Static typing enforces data contracts (DTOs) between endpoints, reducing runtime errors |
| **Backend** | Sequelize ORM | Defines and queries models (User, Donation, Request, Recommendation, Message) and runs migrations | Removes manual SQL for common operations; keeps models in sync with the schema; prevents SQL injection |
| **Backend** | MySQL | Stores users, donations, requests, recommendations, messages, verification status, fraud flags, analytics logs | Relational, strongly consistent database with excellent performance for transactional donation data |
| **Backend** | JWT | Issues tokens at login; verifies them on every protected request via auth middleware | Stateless, scalable session management; encodes role for access-control decisions without database hits |
| **Backend** | bcrypt | Hashes passwords on signup; compares hashes on login | Never stores plain-text passwords; protects accounts even if the database is compromised |
| **Backend** | Axios / node-fetch | Server-side HTTP calls from backend services to the AI microservice endpoints | Simple, reliable server-to-server HTTP with retry and timeout support |
| **AI Service** | Python 3.x | Base language for all recommendation and fraud detection logic | Rich data science ecosystem; easy to experiment on ML models with minimal boilerplate |
| **AI Service** | Flask | Exposes AI models as REST endpoints: `/recommend`, `/fraud-detect`, `/train`, `/health` | Lightweight, easy to set up; perfect for focused microservices without framework overhead |
| **AI Service** | scikit-learn | TF-IDF vectorisation + cosine similarity for matching; anomaly detection classifiers for fraud | Robust, battle-tested ML library with consistent APIs and easy integration into Flask |
| **AI Service** | pandas | Loads, cleans, and preprocesses CSV training datasets; transforms incoming request data into features | Powerful tabular-data manipulation; ideal for feature engineering and quick iteration |
| **AI Service** | pickle / joblib | Serialises trained models (`model.pkl`, `vectorizer.pkl`) so they load instantly on service start | Allows production use of trained models without retraining on every restart |
| **Cross-Cutting** | .env configuration | Stores DB credentials, JWT secret, API base URLs, AI service URL, SMTP/SMS credentials per environment | Keeps secrets out of the codebase; makes the app portable across dev, staging, and production |
| **Cross-Cutting** | Git / GitHub | Version control for the full monorepo: `/frontend`, `/backend`, `/ai_service` | Collaboration, change tracking, branching, code review, and backup |

---

### 3.1 Frontend · React + TypeScript + Tailwind CSS

The frontend is a single-page application built with React 18 and TypeScript, delivering separate role-specific experiences for Donors, Receivers, and Admins.

- Renders all pages and dashboards with fully responsive UI
- Manages authentication state — logged-in user, role, and JWT token via React Context
- Handles all forms: signup, login, donation creation, request submission, profile settings, and feedback
- Calls backend REST APIs using Axios and displays structured responses as data tables, cards, and charts
- Integrates AI recommendation results visually in dashboards and a dedicated recommendations page
- Renders progress bars for donation lifecycle tracking and badges/leaderboards for gamification
- Shows toast notifications and inline error messages for a smooth user experience

### 3.2 Backend · Node.js + Express + TypeScript + Sequelize + MySQL

The backend is a REST API server written in TypeScript that owns all business logic, security enforcement, and database interaction.

- **User management** — signup, login, bcrypt password hashing, profile updates, and role management
- **Role-based access control** — distinct routes and permissions for Donor, Receiver, and Admin
- **Donation and request lifecycle** — create, update status, track progress, and maintain history
- **AI integration** — calls the AI microservice to fetch recommendations and fraud alerts, then stores results in MySQL
- **Analytics APIs** — feeds dashboard charts and admin reports with aggregated platform data
- **Notification triggers** — sends or triggers email/SMS notifications on key lifecycle events

### 3.3 AI Microservice · Flask + scikit-learn + pandas

The AI microservice runs as a separate Python process with its own virtual environment and dependencies.

- **Recommendation Engine** — given a donor or receiver profile, returns ranked matches using TF-IDF vectorisation and cosine similarity across category, location, urgency, and history
- **Fraud Detection** — analyses donation and request patterns to flag suspicious behaviour using anomaly detection classifiers
- **Model Training** — loads CSV datasets, trains ML models, and serialises them as `.pkl` files using pickle/joblib
- **Health Monitoring** — exposes a `/health` endpoint so the backend can verify the service is running before delegating work

---

## ✨ Core Features

### 🔐 Secure Authentication & Role-Based Access

Givista supports three user roles — **Donor**, **Receiver**, and **Admin** — each with a distinct set of permissions and a customised dashboard experience.

- **Signup & Login** — email and password-based registration; passwords hashed using bcrypt (10 rounds)
- **JWT authentication** — on login the backend issues a signed JWT; the frontend attaches it to every protected API request via an Axios interceptor
- **Role-based redirects** — after login the frontend routes the user to the correct dashboard based on their role

### 📊 Personalised Dashboards

Each role gets a fully customised dashboard:

| Dashboard | What It Shows |
|-----------|--------------|
| **Donor** | Profile overview, donation history, active donations, AI-suggested matches, earned badges, and impact analytics charts |
| **Receiver** | Create and manage requests, track the lifecycle of matched donations, and receive status notifications |
| **Admin** | Monitor all users, donations, requests, AI matches, and flagged fraud. Tools to deactivate accounts, verify profiles, and review complaints |

### 📦 Donation & Request Management

- **Donation Form** — donors specify title, description, category (Money / Food / Clothes / Blood / Other), quantity, location, and an optional photo
- **Request Form** — receivers specify what they need, urgency level, category, location, and additional context
- **Search & Filter** — all donations and requests can be filtered or searched by category, location, and status
- **Lifecycle Tracking** — every donation progresses through: `Pending → Matched → Dispatched → Received → Completed`; a visual progress bar reflects the current stage on both dashboards

---

## 🤖 AI & Advanced Features

### 🤖 Smart Donor–Receiver Matching

- The backend sends donor/receiver profiles to the AI microservice via REST, including category, location, urgency, and historical data
- The AI model (TF-IDF + Cosine Similarity) returns a ranked list of matches with a numerical recommendation score
- Results are stored in a `Recommendation` table in MySQL and displayed on user dashboards in real time
- Users can see the reason for each match — e.g., same city, matching category, high impact potential — for full transparency

### 🚨 Intelligent Fraud Detection

- Whenever a new donation or request is created, the backend sends an event summary to the AI `/fraud-detect` endpoint
- The AI service analyses patterns — repeated high-value requests, mismatched locations, unrealistic frequencies — and returns a risk score
- Flagged events are stored in the database and surfaced in the Admin Dashboard for manual review
- Admins see a dedicated list of suspicious users and transactions, enabling fast moderation decisions

### ✅ Donation Verification System

- Admins or approved NGOs can verify donations by reviewing evidence (photos, documents, history) and approving or rejecting them
- Verified donations carry a special tag visible to all users, increasing trust and encouraging engagement
- Verified users receive a ✅ Verified badge on their profile, also used by the AI model as a trust signal — verified donors and receivers are ranked higher in recommendations

### 🪪 Profile Verification (KYC / Email / Phone)

- **Email verification** — a verification link is sent to the user's email during signup
- **Phone verification** — OTP via SMS gateway or third-party service (e.g., Twilio)
- **KYC (optional)** — users can upload a government-issued ID or NGO registration certificate for admin review; approval grants a visible verification badge

### 🏆 Gamification & Badges

- **Badges** — "Top Donor", "Monthly Hero", and "Community Helper" awarded based on number of donations, consistency, and impact
- **Leaderboard** — highlights top donors over weekly, monthly, and all-time periods to drive healthy competition
- **Profile display** — badges appear on user profiles and alongside names in leaderboards and relevant public views

### 📈 Analytics & Impact Reporting

- **Donor Analytics** — charts showing total donations made, most donated categories, and monthly contribution trends
- **Impact Reports** — personalised metrics such as "You have helped 45 people this month" or "Total meals contributed: 120"
- **Admin Analytics** — platform-wide statistics: total active users, total donations, most active locations, category breakdowns, and growth trends
- Analytics are generated from MySQL database aggregates and visualised using chart libraries on the frontend

### 🔔 Email & SMS Notifications

- Notification when a donation request is accepted or matched with a donor
- Status-change alerts when a donation is dispatched, received, or completed
- Periodic impact summaries and campaign reminders (e.g., monthly donation summary)
- Admin alerts for new verification requests, flagged fraud cases, and critical system events

### 🔒 Data Privacy Dashboard

- A dedicated settings page lets users control the visibility of their email, phone number, and exact location in public views
- The backend enforces these preferences when returning user data to any frontend component
- Transparent privacy policy with explicit consent options for data storage and use in AI models

---

## 📌 Summary

Givista combines a modern TypeScript-based full-stack architecture with a Python AI microservice to deliver a secure, transparent, and engaging donation platform.

| Principle | How Givista Achieves It |
|-----------|------------------------|
| **Strong typing end-to-end** | TypeScript on both frontend and backend enforces data contracts and eliminates an entire class of runtime errors |
| **Clean separation of concerns** | Three independent layers — UI, API, and AI — can be deployed, scaled, and updated independently |
| **Trust by design** | Verification, fraud detection, KYC, and role-based access are first-class features, not afterthoughts |
| **Transparency** | Donation lifecycle tracking, analytics, and AI match reasoning give every user full visibility |
| **Motivation** | Gamification (badges, leaderboards, impact reports) drives continued participation and community growth |

---

<div align="center">
  <sub>Built to connect people who give with people who need.</sub>
</div>
