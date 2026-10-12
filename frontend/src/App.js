import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobListPage from './pages/JobListPage';
import JobDetailsPage from './pages/JobDetailsPage';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import PostJobPage from './pages/PostJobPage';
import PostProjectPage from './pages/PostProjectPage';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import MyApplicationsPage from './pages/MyApplicationsPage';
import MyProposalsPage from './pages/MyProposalsPage';
import EmployerApplicantsPage from './pages/EmployerApplicantsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/jobs" element={<JobListPage />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />
              <Route path="/projects" element={<ProjectListPage />} />
              <Route path="/projects/:id" element={<ProjectDetailsPage />} />

              {/* Protected Creation Routes */}
              <Route
                path="/jobs/new"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYER', 'ADMIN']}>
                    <PostJobPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/new"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYER', 'ADMIN']}>
                    <PostProjectPage />
                  </ProtectedRoute>
                }
              />

              {/* Role-Based Dashboards */}
              <Route
                path="/dashboard/seeker"
                element={
                  <ProtectedRoute allowedRoles={['JOB_SEEKER', 'ADMIN']}>
                    <JobSeekerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/freelancer"
                element={
                  <ProtectedRoute allowedRoles={['FREELANCER', 'ADMIN']}>
                    <FreelancerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/employer"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYER', 'ADMIN']}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Tracking & Applications */}
              <Route
                path="/applications/my"
                element={
                  <ProtectedRoute allowedRoles={['JOB_SEEKER', 'ADMIN']}>
                    <MyApplicationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/proposals/my"
                element={
                  <ProtectedRoute allowedRoles={['FREELANCER', 'ADMIN']}>
                    <MyProposalsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/applicants"
                element={
                  <ProtectedRoute allowedRoles={['EMPLOYER', 'ADMIN']}>
                    <EmployerApplicantsPage />
                  </ProtectedRoute>
                }
              />

              {/* Profile & Administration */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
