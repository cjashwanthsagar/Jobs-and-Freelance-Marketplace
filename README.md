# Jobs and Freelance Marketplace

A modern, full-stack platform designed to connect **Job Seekers**, **Freelancers**, and **Employers** in a unified ecosystem. Built with **React.js**, **Java Spring Boot 3**, **Spring Security (JWT)**, and **MySQL 8.0**.

---

## 1. Architecture & Technologies

| Layer | Technologies | Deployment Target |
|---|---|---|
| **Frontend** | React 18, React Router 6, Axios, Lucide Icons, Modern CSS | Vercel |
| **Backend** | Java 17+, Spring Boot 3.3.4, Spring Data JPA, Spring Security (BCrypt + JWT), Maven | Render |
| **Database** | MySQL 8.0+ (InnoDB, UTF8mb4, Indexes, Foreign Keys) | Local MySQL / Managed Cloud MySQL |

---

## 2. Project Folder Structure

```
Jobs-and-Freelance-Marketplace/
│
├── frontend/
│   ├── public/
│   │   ├── index.html            # HTML5 shell with Google Fonts & metadata
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/           # Navbar, Footer, JobCard, ProjectCard, Modals, StatusBadge, ProtectedRoute
│   │   ├── pages/                # Home, Jobs, Projects, Postings, Dashboards, Applications, Proposals, Admin, 404
│   │   ├── services/             # Axios API service client (api.js)
│   │   ├── context/              # AuthContext.js (JWT management & session handling)
│   │   ├── App.js                # App router and layout routes
│   │   ├── index.js              # Entry React mount point
│   │   └── index.css             # Unified CSS Design System (clean white, indigo & purple accents)
│   ├── package.json
│   ├── .env.example
│   ├── vercel.json               # Vercel SPA routing rewrite
│   └── README.md
│
├── backend/
│   ├── src/main/java/com/marketplace/
│   │   ├── config/               # SecurityConfig, CorsConfig, DataInitializer
│   │   ├── controller/           # Auth, User, Job, Application, Project, Proposal, Admin, Health
│   │   ├── service/              # Business logic, DTO mapping, validations
│   │   ├── repository/           # Spring Data JPA repositories with custom queries
│   │   ├── entity/               # User, UserProfile, Skill, Job, JobApplication, FreelanceProject, Proposal
│   │   ├── dto/                  # Request & response transfer objects
│   │   ├── security/             # JWT token provider, filter, entrypoint, custom user details
│   │   ├── exception/            # GlobalExceptionHandler, resource exceptions
│   │   └── MarketplaceApplication.java
│   ├── src/main/resources/
│   │   └── application.properties # Flexible DB & JWT configuration
│   ├── src/test/java/            # Unit & Integration tests
│   ├── pom.xml                   # Maven dependencies & plugins
│   ├── Dockerfile                # Multi-stage production container build for Render
│   ├── .env.example
│   └── README.md
│
├── database/
│   └── schema.sql                # Production schema, tables, constraints, indexes & demo seeds
│
├── .gitignore
└── README.md
```

---

## 3. Demo User Accounts

For immediate testing, default accounts are pre-seeded in MySQL with encrypted BCrypt passwords (`password123`). The login screen also features **1-Click Quick Demo Switchers**:

| Role | Email | Password | Primary Capabilities |
|---|---|---|---|
| **Platform Admin** | `admin@marketplace.com` | `password123` | Moderate users, activate/suspend accounts, manage all listings |
| **Employer / Client** | `techcorp@employer.com` | `password123` | Post jobs, post freelance gigs, review candidates, hire talent |
| **Freelancer** | `sarah.dev@freelancer.com` | `password123` | Build portfolio, search gigs, submit proposals, track bids |
| **Job Seeker** | `alex.seeker@jobseeker.com` | `password123` | Search jobs, apply with cover letter, track application status |

---

## 4. Local Development Setup

### Step 1: Database Setup (MySQL)
1. Ensure your local MySQL Server service is running (e.g. port `3306`).
2. Run `database/schema.sql` using MySQL CLI or MySQL Workbench:

**Using MySQL CLI:**
```bash
mysql -u root -p < database/schema.sql
```

**Using PowerShell:**
```powershell
Get-Content database/schema.sql -Raw | & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

**Using MySQL Workbench:**
1. Open MySQL Workbench and connect to your local MySQL connection.
2. File -> Open SQL Script -> Select `database/schema.sql`.
3. Click the Execute icon (Lightning bolt).
4. Refresh schemas to view `jobs_marketplace` and its 8 tables.

---

### Step 2: Backend Setup (Spring Boot)

1. Open a terminal in the `backend/` directory:
```bash
cd backend
```
2. Verify environment variables in `application.properties` (or set environment variables):
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/jobs_marketplace?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
```
3. Run the backend using Maven:
```bash
mvn spring-boot:run
# Or using Maven wrapper:
./mvnw spring-boot:run
```
4. Confirm health check:
Visit `http://localhost:8080/api/health` — it should return:
```json
{
  "success": true,
  "message": "Service is running normally",
  "data": { "status": "UP", "service": "Jobs and Freelance Marketplace API" }
}
```

---

### Step 3: Frontend Setup (React)

1. Open a new terminal in the `frontend/` directory:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Verify your `frontend/.env` file:
```env
REACT_APP_API_URL=http://localhost:8080/api
```
4. Start the development server:
```bash
npm start
```
5. Open your browser at `http://localhost:3000`.

---

## 5. REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create a new account (`JOB_SEEKER`, `FREELANCER`, or `EMPLOYER`)
- `POST /api/auth/login` — Sign in and receive a signed JWT token
- `GET /api/auth/me` — Retrieve currently authenticated user and profile

### User Profiles (`/api/users`)
- `GET /api/users/me` — View authenticated user profile with skills
- `PUT /api/users/me` — Update bio, headline, links, hourly rate, experience, skills
- `GET /api/users/{id}` — View public user profile

### Jobs (`/api/jobs`)
- `GET /api/jobs` — Filter and search jobs with pagination (`category`, `jobType`, `location`, `isRemote`, `minSalary`, `keyword`)
- `GET /api/jobs/{id}` — View specific job (increments view count)
- `GET /api/jobs/search?q={query}` — Quick keyword search
- `POST /api/jobs` — Post a new job (Employer / Admin only)
- `PUT /api/jobs/{id}` — Edit job posting (Owner / Admin only)
- `DELETE /api/jobs/{id}` — Delete job posting (Owner / Admin only)
- `GET /api/jobs/employer/my` — View jobs posted by logged-in employer

### Job Applications (`/api/applications`)
- `POST /api/applications` — Submit application with cover letter & resume link
- `GET /api/applications/my` — View applications submitted by logged-in user
- `GET /api/jobs/{jobId}/applications` — View all applicants for a specific job (Employer only)
- `GET /api/applications/employer/all` — View all applicants across all employer listings
- `PUT /api/applications/{id}/status` — Update applicant status (`REVIEWING`, `SHORTLISTED`, `ACCEPTED`, `REJECTED`)

### Freelance Projects (`/api/projects`)
- `GET /api/projects` — Filter freelance projects (`category`, `projectType`, `minBudget`, `keyword`)
- `GET /api/projects/{id}` — View specific freelance project
- `GET /api/projects/search?q={query}` — Quick keyword search
- `POST /api/projects` — Post a new freelance gig (Employer / Admin only)
- `PUT /api/projects/{id}` — Edit freelance project (Owner / Admin only)
- `DELETE /api/projects/{id}` — Delete freelance project (Owner / Admin only)
- `GET /api/projects/client/my` — View projects posted by logged-in client

### Freelance Proposals (`/api/proposals`)
- `POST /api/proposals` — Submit freelance proposal bid (Freelancer only)
- `GET /api/proposals/my` — View proposals submitted by logged-in freelancer
- `GET /api/projects/{projectId}/proposals` — View proposals for a project (Client only)
- `GET /api/proposals/client/all` — View all proposals across all client gigs
- `PUT /api/proposals/{id}/status` — Update proposal status (`SHORTLISTED`, `ACCEPTED`, `REJECTED`)

### Platform Administration (`/api/admin`)
- `GET /api/admin/users` — Paginated user directory with role and status filtering
- `PUT /api/admin/users/{id}/status` — Moderate user account (`ACTIVE` / `SUSPENDED`)
- `GET /api/admin/jobs` — View all platform jobs
- `GET /api/admin/projects` — View all platform projects
- `GET /api/admin/stats` — Real-time analytics and platform counters

---

## 6. Deployment Guide

### Frontend Deployment on Vercel
1. Import repository on [Vercel](https://vercel.com).
2. Configure project:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
3. Set Environment Variable in Vercel project settings:
   - `REACT_APP_API_URL`: `https://<your-render-backend-url>/api`
4. The provided `frontend/vercel.json` ensures that React Router single-page navigation and deep links work on browser refresh.

### Backend Deployment on Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your repository and select **Docker** environment (or Maven build).
3. Set the Dockerfile Path to `backend/Dockerfile`.
4. Configure Render Environment Variables:
   - `PORT`: `8080` (or leave default, Render injects `PORT`)
   - `DB_URL`: JDBC URL to your reachable production database (e.g., `jdbc:mysql://<host>:<port>/jobs_marketplace?useSSL=true`)
   - `DB_USERNAME`: Production database username
   - `DB_PASSWORD`: Production database password
   - `JWT_SECRET`: Random 256-bit secret key
   - `CORS_ALLOWED_ORIGINS`: Your Vercel frontend domain (e.g., `https://your-app.vercel.app`)
5. Health Check Path: `/api/health`.

> **Note on Database in Production:**
> Local MySQL running on a computer is not directly reachable by Render over the public Internet. For production, provision a managed MySQL database on services such as **Aiven**, **PlanetScale**, **AWS RDS**, or **Railway**, and execute `database/schema.sql` on that database.

---

## 7. Common Error Fixes & Troubleshooting

- **Error: Access Denied for user 'root'@'localhost':**
  - Verify that the `DB_USERNAME` and `DB_PASSWORD` in `backend/src/main/resources/application.properties` (or environment variables) match your local MySQL Server password.
- **Error: Table 'jobs_marketplace.users' doesn't exist:**
  - Execute `database/schema.sql` using MySQL CLI or MySQL Workbench to initialize the tables.
- **CORS Error in Browser Console:**
  - Verify `CORS_ALLOWED_ORIGINS` includes your frontend port (e.g. `http://localhost:3000`) or Vercel domain.
- **Port 8080 or 3000 already in use:**
  - For backend: run with `PORT=8081 mvn spring-boot:run`
  - For frontend: create `PORT=3001` in `frontend/.env`.
