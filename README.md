# 📊 Teacher Insights Dashboard – Client

This is the frontend application for the **Teacher Insights Dashboard**, built as part of the Savra Technical Assignment.

The dashboard allows a school administrator (principal) to:

- View total lessons, quizzes, and assessments created by teachers
- Analyze weekly activity trends
- Filter and view per-teacher analytics
- Visualize structured activity data using charts
- Access the system securely using JWT authentication

---

## 🚀 Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Authentication:** JWT (JSON Web Token)
- **API Communication:** Fetch API
- **State Management:** React Hooks (useState, useEffect)

The frontend is designed to be simple, clean, and production-ready without unnecessary abstraction.

---

🔑 Admin / Principal Login Credentials

Use the following credentials to log in:

- Email: principal@school.edu
- Password: StrongPassword123

## 📁 Project Structure

```
frontend/
│
├── app/                         # App Router pages
│   ├── page.js                  # Dashboard main page
    ├── login/page.js            # Login page
│
├── components/                  # Reusable UI components
│   ├── SummaryCards.js
│   ├── TeacherSelector.js
│   ├── WeeklyChart.js
│   └── TeacherBreakdown.js
│
├── .env.local                   # Local environment variables (not committed)
├── env.example                  # Environment variable template
├── next.config.mjs
├── tailwind.config.mjs
├── postcss.config.mjs
└── package.json
```


## 📊 Features Implemented

### 1️⃣ Summary Cards
Displays:
- Total Lessons
- Total Quizzes
- Total Assessments

Data is fetched from:

---

### 2️⃣ Teacher Selector
Dropdown to select a specific teacher.

On selection:
- Fetches teacher-specific weekly activity
- Fetches breakdown analytics

Endpoints used:
GET /api/teachers/:id/weekly
GET /api/teachers/:id/details

---

### 3️⃣ Weekly Activity Chart
- Displays activity grouped by week
- Built using Recharts
- Data aggregation handled entirely by backend

---

### 4️⃣ Per-Teacher Breakdown
Shows:
- Subject-wise activity
- Class-wise activity
- Activity distribution

---

## 🔐 Authentication (JWT Implementation)

- The application includes secure JWT-based authentication.

- Only authenticated Admin (Principal) users can access the dashboard.

---

## 🔄 Authentication Flow

- Admin logs in using email & password
- Backend validates credentials
- Backend generates a JWT token
- Token is returned to frontend
- Token is stored (localStorage or secure cookie)
- Token is sent in Authorization header for protected routes

- Example header:
- Authorization: Bearer <JWT_TOKEN>

---

## 🔒 Protected Routes

- GET /api/summary
- GET /api/teachers
- GET /api/teachers/:id/weekly
- GET /api/teachers/:id/details

- If token is missing or invalid:

- 401 Unauthorized

---

## 🔐 Environment Variables

- Create a `.env.local` file inside `frontend/`:

- NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

- For production:

- NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com

- An `env.example` file is included for reference.

---

## 🧠 Architecture Decisions

- **All aggregations are handled in the backend**, not frontend.
- Frontend only renders structured JSON.
- Minimal state management to keep logic readable.
- No heavy global state libraries used (not required for this scale).
- UI kept clean and simple to focus on data clarity.

---

## ⚙️ Local Development Setup

### 1️⃣ Install dependencies

```bash
npm install

App will run on:

http://localhost:3000

📦 Production Build
npm run build

npm start



