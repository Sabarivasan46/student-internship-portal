# Student Internship Portal (MERN Stack)

A production-ready full-stack Student Internship Portal built with React 18, Vite, Node.js, Express, and MongoDB (Mongoose).

---

## Features
- **Internship Exploration:** View curated internships across Frontend, Backend, Data Analytics, and Full Stack domains with details on stipends, mode, location, duration, and required tech stacks.
- **Dynamic Navigation:** Multi-page routing powered by `react-router-dom` (`/`, `/internships/:id`, `/applications`).
- **Validated Application Form:** Collects student name, email, roll number, and selected internship with strict client-side and server-side validation.
- **MongoDB Persistence:** Stores student applications in MongoDB with Mongoose schemas and indexes.
- **Real-time Application Tracker:** Fetches and displays saved student applications sorted newest first.
- **Health & Monitoring:** Endpoints reporting live API and database readiness.
- **Robust Security & CORS:** Strict CORS origin matching, sanitized inputs, and isolated environment secrets.

---

## Project Structure
```text
my-project/
├── .vscode/
├── src/
│   ├── routes/
│   │   └── index.js            # Express API router (internships & applications)
│   └── models/
│       └── Application.js      # Mongoose Schema & Model for applications
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Top navigation header
│   │   │   ├── InternshipCard.jsx  # Internship listing card
│   │   │   └── ApplicationForm.jsx # Validated student application form
│   │   ├── pages/
│   │   │   ├── InternshipList.jsx  # Catalogue overview & hero section
│   │   │   ├── InternshipDetails.jsx# Position details & application form
│   │   │   └── Applications.jsx    # Real-time MongoDB application tracker
│   │   ├── api.js              # Centralized API service & error handler
│   │   ├── App.jsx             # React Router routing configuration
│   │   ├── App.css             # Responsive styling & design system
│   │   ├── index.css           # Global typography & CSS variables
│   │   └── main.jsx            # React root & BrowserRouter entry
│   ├── index.html              # Frontend HTML entry
│   ├── vite.config.js          # Vite configuration with local API proxy
│   ├── vercel.json             # SPA rewrites configuration for Vercel
│   ├── package.json
│   └── package-lock.json
├── app.js                      # Root Express server entry point
├── package.json
├── package-lock.json
├── .env                        # Local environment variables (DO NOT COMMIT)
├── .env.example                # Example environment variables template
├── .gitignore
├── Dockerfile
└── README.md
```

---

## Local Development & Setup

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- Accessible MongoDB instance

### 2. Installation
Install root dependencies and client dependencies:
```bash
npm install
npm --prefix client install
```

### 3. Environment Variables
Create a `.env` file in the project root:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173,http://127.0.0.1:5173,https://internship-portal-khaki.vercel.app
MONGO_DB_URI=mongodb://<username>:<password>@<host>:<port>/<database>
NODE_ENV=development
```
*(Never commit `.env` to Git. An example is provided in `.env.example`.)*

### 4. Running Locally
Run both server and client concurrently:
```bash
npm run dev:all
```
Or run separately:
- Backend server: `npm run server` (starts Express on port 5000)
- Frontend client: `npm run client` (starts Vite on `http://localhost:5173`)

---

## API Endpoints

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/` | API service status & info | `200` |
| `GET` | `/api/health` | Accurate database health & readiness | `200` (Connected) / `503` (Degraded) |
| `GET` | `/api/internships` | Returns available internship catalogue | `200` |
| `GET` | `/api/internships/:id` | Returns single internship details | `200`, `404` (Not Found) |
| `POST` | `/api/applications` | Validates & saves application to MongoDB | `201` (Created), `400` (Bad Request), `503` |
| `GET` | `/api/applications` | Retrieves submitted applications from MongoDB | `200`, `503` |

### Sample POST `/api/applications` Request Body
```json
{
  "studentName": "Shankar Prakasam",
  "email": "shankar@example.com",
  "rollNumber": "24BCS259",
  "internshipId": "frontend-developer"
}
```

---

## Testing & Verification

1. **Linting:**
   ```bash
   npm --prefix client run lint
   ```
2. **Client Production Build:**
   ```bash
   npm --prefix client run build
   ```
3. **Backend & MongoDB Verification:**
   Verify connection and database operations via:
   ```bash
   node -e "
     const { app, startServer } = require('./app');
     startServer().then(server => {
       console.log('Server verified listening.');
       server.close();
       process.exit(0);
     });
   "
   ```

---

## Deployment Configuration

### Backend: Render
- **Repository:** `https://github.com/Shankar-Prakasam/Internship-portal`
- **Branch:** `main` (or `rollno_v1`)
- **Root Directory:** `.` (Repository root)
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start` (Runs `node app.js`)
- **Environment Variables:**
  - `MONGO_DB_URI` = `<complete provider-approved MongoDB URI>`
  - `FRONTEND_URL` = `https://internship-portal-khaki.vercel.app` (no trailing slash)
  - `NODE_ENV` = `production`
- **Live URL:** `https://internship-portal-rr66.onrender.com`

### Frontend: Vercel
- **Repository:** `https://github.com/Shankar-Prakasam/Internship-portal`
- **Production Branch:** `main`
- **Root Directory:** `client`
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_URL` = `https://internship-portal-rr66.onrender.com` (do not append `/api` or trailing slash)
- **Live URL:** `https://internship-portal-khaki.vercel.app`

---

## CORS & "Failed to Fetch" Root Cause Analysis
During previous deployments, the frontend displayed *"Failed to fetch"* / *"Unable to load internships"* due to three intersecting issues:
1. **API URL Concatenation & Trailing Slashes:** When `VITE_API_URL` contained a trailing slash or was empty, unhandled concatenation caused double slashes (`...com//api/...`) or relative requests resolved to Vercel's SPA fallback (`index.html`) rather than the backend JSON endpoint.
2. **CORS Origin Normalization:** Browser `Origin` headers (e.g. `https://internship-portal-khaki.vercel.app`) require exact matching without wildcard credentials. Origin normalization now trims trailing slashes and handles comma-separated production and development origins.
3. **Render Cold Start / Service Sleep:** On free Render tiers, instances spin down after 15 minutes of inactivity. When asleep, incoming requests take 50+ seconds or trigger timeouts if the frontend lacks proper retry/loading states.

This has been resolved by:
- Centralized normalization in `client/src/api.js` (`const API_BASE_URL = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '')`).
- Strict, normalized CORS handling in `app.js` with preflight support.
- User-friendly loading spinners, error alerts, and retry buttons across all frontend views.

---

## Capturing Submission & Retrieval Screenshots
1. Open the application at `https://internship-portal-khaki.vercel.app` (or locally at `http://localhost:5173`).
2. Navigate to an internship (e.g. *Frontend Developer Intern*).
3. Fill in your details (Student Name, Email, Roll Number) and click **Submit Application →**.
4. Capture a screenshot of the green **Application submitted successfully!** banner showing your saved **Application ID**.
5. Click **Applications** in the top navigation bar.
6. Capture a screenshot of the **Submitted Applications** table displaying your name, roll number, email, internship title, and MongoDB document ID.
