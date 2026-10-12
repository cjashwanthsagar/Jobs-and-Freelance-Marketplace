# Jobs and Freelance Marketplace - Frontend

A modern, responsive, and intuitive web interface built with **React.js 18**, **React Router 6**, **Axios**, and **Lucide Icons**.

---

## 1. Features & Architecture

- **Clean Visual Design**: Pristine white canvas accented with indigo, purple, and slate hues, smooth hover states, micro-interactions, and responsive layout.
- **Role-Based Portals**:
  - **Job Seeker**: Search and filter jobs, submit applications with custom cover letters, track status milestones.
  - **Freelancer**: Browse projects, submit bids with timelines and rates, monitor client proposal decisions.
  - **Employer / Client**: Publish full-time jobs and freelance contracts, review candidate resumes and cover letters, manage hiring decisions.
  - **Platform Administrator**: Audit platform analytics, toggle user account statuses, moderate listings.
- **Authentication**: JWT token management with secure storage and automatic header attachment in Axios.
- **1-Click Demo Accounts**: Instant test logins provided directly on the login screen.

---

## 2. Local Setup & Running

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher

### Installation
```bash
cd frontend
npm install
```

### Environment Configuration
Ensure `.env` exists in the `frontend/` folder:
```env
REACT_APP_API_URL=http://localhost:8080/api
```

### Start Development Server
```bash
npm start
```
The app will launch at `http://localhost:3000`.

---

## 3. Project Structure

```
frontend/
├── public/
│   ├── index.html       # Base HTML template with Google Fonts & metadata
│   └── favicon.ico
├── src/
│   ├── components/      # Reusable UI elements (Navbar, Footer, JobCard, ProjectCard, Modals, StatusBadge, ProtectedRoute)
│   ├── pages/           # Application views (Home, Login, Register, Jobs, Projects, Dashboards, Admin)
│   ├── services/        # Axios API client (api.js)
│   ├── context/         # AuthContext.js for global user state & JWT tokens
│   ├── App.js           # Route hierarchy & navigation routes
│   ├── index.js         # DOM root mounting
│   └── index.css        # Core design system tokens and utilities
├── .env.example
├── vercel.json          # Vercel SPA routing rewrite
└── package.json
```

---

## 4. Deployment to Vercel

1. Push your code to GitHub or GitLab.
2. Import the repository on [Vercel](https://vercel.com).
3. Configure project settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Configure Environment Variables:
   - `REACT_APP_API_URL`: `https://your-backend-app.onrender.com/api` (points to your deployed Render backend)
5. Deploy! Vercel uses `vercel.json` to handle client-side routing on page refresh.
