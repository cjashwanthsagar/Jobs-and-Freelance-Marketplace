# Jobs and Freelance Marketplace - Backend API

The backend for Jobs and Freelance Marketplace is built with **Java Spring Boot 3**, **Spring Data JPA**, **Spring Security (JWT)**, and **MySQL 8.0**.

---

## 1. Prerequisites

- **Java JDK 17+** (or Java 21 / 26)
- **Apache Maven 3.8+** (or use the provided Maven wrapper `mvnw` / `mvnw.cmd`)
- **MySQL Server 8.0+** running locally (or managed cloud MySQL)

---

## 2. Configuration & Environment Variables

The backend uses environment variables with development defaults in `src/main/resources/application.properties`.

Create or edit your local `.env` or set environment variables:

| Variable | Description | Default (Local) |
|---|---|---|
| `PORT` | HTTP server port | `8080` |
| `DB_URL` | JDBC URL for MySQL | `jdbc:mysql://localhost:3306/jobs_marketplace` |
| `DB_USERNAME` | MySQL database user | `root` |
| `DB_PASSWORD` | MySQL database password | `root` |
| `JWT_SECRET` | 256-bit secret key for JWT | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |
| `CORS_ALLOWED_ORIGINS` | Permitted frontend origins | `http://localhost:3000,http://localhost:5173,https://*.vercel.app` |

---

## 3. Database Initialization

1. Start your local MySQL Server service (`MySQL80`).
2. Run the SQL schema:
```bash
# Using MySQL command line:
mysql -u root -p < ../database/schema.sql

# In PowerShell:
Get-Content ../database/schema.sql -Raw | mysql -u root -p
```
3. The database `jobs_marketplace` will be created with all tables and initial demo seed accounts:
   - **Admin**: `admin@marketplace.com` / `password123`
   - **Employer**: `techcorp@employer.com` / `password123`
   - **Freelancer**: `sarah.dev@freelancer.com` / `password123`
   - **Job Seeker**: `alex.seeker@jobseeker.com` / `password123`

---

## 4. Running the Backend Locally

```bash
# Run using Maven wrapper
./mvnw spring-boot:run

# Or with system Maven
mvn spring-boot:run
```

Once running, the backend will be available at:
`http://localhost:8080/api`

Health check endpoint:
`GET http://localhost:8080/api/health`

---

## 5. REST API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create new user (`JOB_SEEKER`, `FREELANCER`, or `EMPLOYER`)
- `POST /api/auth/login` - Authenticate and retrieve JWT token
- `GET /api/auth/me` - Get profile for current authenticated user

### User Profiles (`/api/users`)
- `GET /api/users/me` - Current user details with skills and bio
- `PUT /api/users/me` - Update personal profile, hourly rate, portfolio links, and skills
- `GET /api/users/{id}` - Public user profile

### Jobs (`/api/jobs`)
- `GET /api/jobs` - Search and filter jobs with pagination (`category`, `jobType`, `location`, `isRemote`, `minSalary`, `keyword`)
- `GET /api/jobs/{id}` - View job details (increments view count)
- `GET /api/jobs/search?q={query}` - Quick keyword search
- `POST /api/jobs` - Post a new job (Employer/Admin only)
- `PUT /api/jobs/{id}` - Edit job posting (Owner/Admin only)
- `DELETE /api/jobs/{id}` - Delete job posting (Owner/Admin only)
- `GET /api/jobs/employer/my` - View jobs posted by logged-in employer

### Applications (`/api/applications`)
- `POST /api/applications` - Submit job application (Job Seeker)
- `GET /api/applications/my` - Track user's submitted job applications
- `GET /api/jobs/{jobId}/applications` - View applicants for a specific job (Employer only)
- `GET /api/applications/employer/all` - View all applicants across all employer postings
- `PUT /api/applications/{id}/status` - Update applicant status (`REVIEWING`, `SHORTLISTED`, `ACCEPTED`, `REJECTED`)

### Freelance Projects (`/api/projects`)
- `GET /api/projects` - Filter freelance projects (`category`, `projectType`, `minBudget`, `keyword`)
- `GET /api/projects/{id}` - View freelance project details
- `GET /api/projects/search?q={query}` - Quick keyword search
- `POST /api/projects` - Publish freelance project (Employer/Client/Admin)
- `PUT /api/projects/{id}` - Edit freelance project (Owner/Admin)
- `DELETE /api/projects/{id}` - Delete project (Owner/Admin)
- `GET /api/projects/client/my` - View projects posted by logged-in client

### Proposals (`/api/proposals`)
- `POST /api/proposals` - Submit freelance bid proposal (Freelancer only)
- `GET /api/proposals/my` - Track proposals submitted by freelancer
- `GET /api/projects/{projectId}/proposals` - View bids submitted for a project (Client only)
- `GET /api/proposals/client/all` - View all proposals received by client
- `PUT /api/proposals/{id}/status` - Update proposal status (`SHORTLISTED`, `ACCEPTED`, `REJECTED`)

### Admin Management (`/api/admin`)
- `GET /api/admin/users` - Paginated user directory with role and status filters
- `PUT /api/admin/users/{id}/status` - Change user account status (`ACTIVE` or `SUSPENDED`)
- `GET /api/admin/jobs` - View and moderate all job postings
- `GET /api/admin/projects` - View and moderate all freelance projects
- `GET /api/admin/stats` - Platform analytics and totals

---

## 6. Deployment on Render

1. Connect your repository to Render as a **Web Service**.
2. Select **Docker** environment or Java Native build.
3. Set environment variables on Render:
   - `PORT`: 8080 (Render provides this automatically)
   - `DB_URL`: JDBC URL to your managed MySQL database (e.g., Aiven, PlanetScale, Railway, AWS RDS)
   - `DB_USERNAME`: Managed database username
   - `DB_PASSWORD`: Managed database password
   - `JWT_SECRET`: Secure random 256-bit string
   - `CORS_ALLOWED_ORIGINS`: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
4. Health check path: `/api/health`
