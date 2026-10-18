# BGVerify.ai — Enterprise Background Verification Platform

> An AI-powered background verification platform with OCR document analysis, multi-role dashboards, and a human-in-the-loop review engine.

---

## 📁 Project Structure

```
BGVerify/
├── frontend/          ← Next.js 16 web application (the UI — runs on :3000)
├── backend/           ← Python FastAPI REST API (the server — runs on :8000)
├── DOCUMENTS/         ← Project design documents
└── README.md          ← You are here
``` 

<!--  hello -->

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────┐
│            BROWSER (Port 3000)              │
│         Next.js 16 + Tailwind CSS 4         │
│                                             │
│  Landing Page → Auth Modal → Dashboard      │
│  Role-based views: ADMIN / ORG_HR /         │
│                    CANDIDATE                │
└──────────────────┬──────────────────────────┘
                   │  HTTP REST (fetch)
                   │  http://localhost:8000/api/v1
                   ▼
┌─────────────────────────────────────────────┐
│           BACKEND (Port 8000)               │
│         Python FastAPI + SQLite             │
│                                             │
│  /api/v1/auth        ← Login / Register     │
│  /api/v1/dashboard   ← Metrics & Activity   │
│  /api/v1/organizations ← Org Management     │
│  /api/v1/credits     ← Token/Credit system  │
│                                             │
│  Auto Docs:  http://localhost:8000/docs     │
└──────────────────┬──────────────────────────┘
                   │  SQLAlchemy ORM
                   ▼
┌─────────────────────────────────────────────┐
│         DATABASE: SQLite                    │
│         backend/bgverify.db                 │
│                                             │
│  Tables: users, organizations, candidates   │
│          verification_requests, documents   │
│          consent_records, audit_logs        │
│          field_comparison_results           │
│          manual_reviews, evidence_records   │
└─────────────────────────────────────────────┘
```

---

## 🔑 User Roles

| Role | Access |
|---|---|
| **ADMIN** | Full platform view — all orgs, users, system health, audit trail |
| **ORG_HR** | Company dashboard — initiate verifications, review queue, documents |
| **CANDIDATE** | Personal portal — consent, evidence upload tasks |

---

## 🚀 How to Run

### Prerequisites
- **Python 3.10+** installed
- **Node.js 18+** installed

---

### Step 1 — Start the Backend (FastAPI)

Open a terminal and run:

```powershell
cd backend

# First time only: create virtual environment
python -m venv venv

# First time only: install dependencies
.\venv\Scripts\pip.exe install -r requirements.txt

# First time only: seed demo data into database
.\venv\Scripts\python.exe app/seed.py

# Start the server (every time)
.\venv\Scripts\uvicorn.exe app.main:app --reload --port 8000
```

✅ Backend running at: **http://localhost:8000**  
📖 Swagger API Docs: **http://localhost:8000/docs**

---

### Step 2 — Start the Frontend (Next.js)

Open a **second terminal** and run:

```powershell
cd frontend

# First time only: install packages
npm install

# Start the dev server (every time)
npm run dev
```

✅ Frontend running at: **http://localhost:3000**

---

### Step 3 — Open in Browser

Go to **http://localhost:3000** and log in using any demo account:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@bgverify.ai` | `AdminPass123!` |
| HR Manager | `hr@acme-corp.com` | `HrPass123!` |
| Candidate | `candidate@example.com` | `CandidatePass123!` |

> 💡 Or click **"Quick Demo"** buttons on the landing page to auto-login.

---

## 🗂️ Frontend Structure (`frontend/`)

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx          ← Main app page (dashboard + landing logic)
│   │   ├── layout.tsx        ← Root layout + AuthProvider wrapper
│   │   ├── providers.tsx     ← Context providers
│   │   └── globals.css       ← Global styles
│   ├── components/
│   │   ├── LandingPage.tsx   ← Public marketing page
│   │   ├── Navbar.tsx        ← Top navigation bar with token balance
│   │   ├── Sidebar.tsx       ← Role-based tab navigation
│   │   ├── AuthModal.tsx     ← Login / Register modal
│   │   ├── MetricsCards.tsx  ← KPI metric summary cards
│   │   ├── RecentActivityTable.tsx  ← Verification activity table
│   │   ├── TokenPurchaseModal.tsx   ← Credit top-up modal
│   │   └── LoginModal.tsx    ← Standalone login UI
│   └── lib/
│       ├── api.ts            ← All API calls (fetch wrapper)
│       ├── auth-context.tsx  ← Auth state + demo account switcher
│       └── types.ts          ← TypeScript type definitions
├── next.config.ts            ← Next.js config (allowedDevOrigins, Turbopack)
└── package.json
```

### Dashboard Tabs (by role)

| Tab | Available To | Description |
|---|---|---|
| Dashboard | All | KPI metrics + recent verifications |
| Verifications | ADMIN, ORG_HR | All verification requests table |
| Review Queue | ADMIN, ORG_HR | Flagged items needing human sign-off |
| Candidate Portal | CANDIDATE | Upload docs, view consent status |
| Documents | All | Evidence vault with SHA-256 verification |
| Organizations | ADMIN only | Manage enterprise tenants & quotas |
| Audit Trail | ADMIN only | Immutable security event log |

---

## 🗂️ Backend Structure (`backend/`)

```
backend/
├── app/
│   ├── main.py               ← FastAPI app entry point + CORS config
│   ├── seed.py               ← Demo data seeder (run once)
│   ├── api/
│   │   ├── deps.py           ← Dependency injectors (DB session, auth)
│   │   └── v1/
│   │       ├── auth.py       ← /auth/login, /auth/register, /auth/me
│   │       ├── dashboard.py  ← /dashboard/stats, /dashboard/recent-activity
│   │       ├── organizations.py ← /organizations/ CRUD
│   │       └── credits.py    ← /credits/balance, /credits/purchase, /credits/deduct
│   ├── core/
│   │   ├── config.py         ← Settings (env vars, CORS origins, JWT config)
│   │   ├── database.py       ← SQLAlchemy engine + session factory
│   │   └── security.py       ← JWT creation, password hashing (bcrypt)
│   ├── models/
│   │   ├── entities.py       ← All SQLAlchemy ORM table definitions
│   │   └── enums.py          ← Enums: UserRole, VerificationStatus, etc.
│   └── schemas/
│       ├── auth.py           ← Pydantic schemas: Token, LoginRequest, UserCreate
│       ├── dashboard.py      ← Dashboard response schemas
│       ├── organization.py   ← Org schemas
│       └── verification.py   ← Verification schemas
├── storage/                  ← Uploaded document files (PDF, JPG, PNG)
│   ├── documents/
│   └── reports/
├── bgverify.db               ← SQLite database file
├── requirements.txt          ← Python dependencies
└── .env                      ← Environment config (DB URL, JWT secret, etc.)
```

### API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/login` | Login with email + password |
| POST | `/api/v1/auth/register` | Register a new user |
| GET | `/api/v1/auth/me` | Get current user profile |
| GET | `/api/v1/dashboard/stats` | Role-specific KPI metrics |
| GET | `/api/v1/dashboard/recent-activity` | Recent verification list |
| GET | `/api/v1/organizations/` | List all organizations (ADMIN) |
| POST | `/api/v1/organizations/` | Create organization (ADMIN) |
| GET | `/api/v1/credits/balance` | Get token balance |
| POST | `/api/v1/credits/purchase` | Purchase token pack |
| POST | `/api/v1/credits/deduct` | Deduct token for action |

---

## 🗄️ Database Schema

```
organizations ──< users
organizations ──< verification_requests
candidates    ──< verification_requests
verification_requests ──< consent_records
verification_requests ──< documents ──< extracted_fields
verification_requests ──< field_comparison_results
verification_requests ──< evidence_records
verification_requests ──< manual_reviews
verification_requests ──< verification_state_history
users ──< audit_logs
users ──< manual_reviews
```

---

## ⚙️ Environment Configuration (`backend/.env`)

```env
ENVIRONMENT=development
PROJECT_NAME=BGVerify.ai
VERSION=1.0.0
SECRET_KEY=bgverify-super-secure-production-ready-jwt-secret-key-32chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DATABASE_URL=sqlite:///./bgverify.db
STORAGE_DIR=./storage
MAX_UPLOAD_SIZE_BYTES=15728640
```

---

## 🔐 Authentication Flow

```
User enters credentials
        ↓
POST /api/v1/auth/login
        ↓
Backend verifies password (bcrypt)
        ↓
Returns JWT token + user info
        ↓
Token stored in localStorage ("bgverify_token")
        ↓
All subsequent requests: Authorization: Bearer <token>
        ↓
Auto-logout on 401 response
```

---

## 💡 Token / Credit System

Each organization has a **verification token balance**:
- **1 token** consumed per document OCR analysis
- **1 token** consumed per new verification request
- Tokens can be purchased via the **"Top Up Credits"** modal
- Low balance triggers an alert banner in the dashboard

---

## 🧪 Running Tests

```powershell
cd backend
.\venv\Scripts\pytest.exe tests/ -v
```

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, TypeScript |
| Backend | Python 3.13, FastAPI, SQLAlchemy 2, Pydantic v2 |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT (python-jose), bcrypt (passlib) |
| OCR | pytesseract + Pillow |
| PDF | pypdf, reportlab |
| Testing | pytest, pytest-asyncio |
| Dev Server | Uvicorn (backend), Turbopack (frontend) |
