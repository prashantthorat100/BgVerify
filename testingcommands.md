# BGVerify.ai - Project Running & Testing Commands Guide

Comprehensive guide to run, test, and verify the **BGVerify.ai** Background Verification Platform.

---

## 📌 Active Authentication & Authorization Portals

As per system specifications, **Candidate Portal** and **HR / Enterprise Portal** are fully enabled with role-based access control (RBAC). Admin portal is reserved for subsequent release.

| Portal | Intended User | Default Demo Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **HR / Enterprise Portal** | HR Managers & Recruiters | `hr@acme-corp.com` | `HrPass123!` | Initiate candidate verifications, analyze OCR documents, review discrepancies, manage verification quota. |
| **Candidate Portal** | Job Applicants & Candidates | `candidate@example.com` | `CandidatePass123!` | View pending verification requests, sign electronic consent, upload educational and employment credentials. |

---

## 🚀 Running the Project Locally

To run the complete platform, open **two separate terminal windows** (one for the Backend API, one for the Next.js Frontend).

### 1. Terminal 1: Backend (FastAPI + SQLite)

From the project root directory:

```powershell
# Navigate to backend directory
cd backend

# Activate Python Virtual Environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1
# (Or in CMD: .\venv\Scripts\activate.bat)

# (Optional) Install dependencies if running on a fresh environment
pip install -r requirements.txt

# (Optional) Seed database with demo organizations & test accounts
python app/seed.py

# Start the FastAPI Server with hot-reload
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- **Backend API URL:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Health Check Endpoint:** [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

### 2. Terminal 2: Frontend (Next.js + TypeScript + Vanilla CSS)

From the project root directory:

```powershell
# Navigate to frontend directory
cd frontend

# Install node dependencies (if not already installed)
npm install

# Start Next.js Development Server
npm run dev
```

- **Frontend Application URL:** [http://localhost:3000](http://localhost:3000)

---

## 🧪 Automated Testing Commands

### 1. Run All Backend Tests (pytest)

From the project root directory:

```powershell
.\backend\venv\Scripts\python.exe -m pytest
```

### 2. Run Dedicated Auth & RBAC (Authorization) Tests

```powershell
# If in project root:
.\backend\venv\Scripts\python.exe -m pytest backend/tests/test_auth.py backend/tests/test_rbac.py -v

# If already inside the backend/ folder:
python -m pytest tests/test_auth.py tests/test_rbac.py -v
```

This verifies:
- Candidate registration and automatic candidate profile generation
- HR registration and automated enterprise organization creation
- Case-insensitive login with bcrypt password hash validation
- JWT token expiration and profile validation (`/api/v1/auth/me`)
- Role-based authorization & data isolation between HR and Candidate roles

### 3. Frontend TypeScript Typecheck

From the `frontend` directory:

```powershell
cd frontend
npx tsc --noEmit
```

---

## 🔑 Step-by-Step Manual Testing Workflow

### Scenario A: Testing the Candidate Portal
1. Open [http://localhost:3000](http://localhost:3000).
2. Click **"Candidate Portal"** in the top navigation or on the **Candidate Portal** card in the hero section.
3. Test **Sign In**:
   - Click **"1-Click Sign In"** (or enter `candidate@example.com` / `CandidatePass123!`).
   - You will automatically be routed to the **Candidate Workspace** (`My Tasks & Uploads`).
   - Notice the candidate can sign consent, upload degree certificates, and view their verification timeline.
4. Test **Sign Up**:
   - Log out by clicking the sign-out icon in the top right.
   - Click **"Candidate Portal"** → switch to **"Create New Account"**.
   - Enter Full Name, Email, Phone, and Password.
   - Click **"Create Candidate Account"** → your new candidate profile is created and you are logged in automatically.

### Scenario B: Testing the HR / Enterprise Portal
1. Open [http://localhost:3000](http://localhost:3000).
2. Click **"HR & Employer Portal"** in the top navigation or on the **HR & Enterprise Portal** card.
3. Test **Sign In**:
   - Click **"1-Click Sign In"** (or enter `hr@acme-corp.com` / `HrPass123!`).
   - You will automatically enter the **HR Dashboard**.
   - Notice HR can see metrics, verification requests, review queue discrepancies, and document OCR analysis.
4. Test **Sign Up**:
   - Log out by clicking the sign-out icon in the top right.
   - Click **"HR & Employer Portal"** → switch to **"Create New Account"**.
   - Enter Full Name, Work Email, Company/Organization Name (e.g. `TechCorp Global`), and Password.
   - Click **"Create HR Enterprise Account"** → an organization is created with verification quota and linked to your new HR account.
