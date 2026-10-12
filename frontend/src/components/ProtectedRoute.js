import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }} />
        <p style={{ marginTop: '16px', fontSize: '0.95rem' }}>Verifying authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    // If authenticated but role not allowed, redirect to role's dashboard
    if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user?.role === 'EMPLOYER') return <Navigate to="/dashboard/employer" replace />;
    if (user?.role === 'FREELANCER') return <Navigate to="/dashboard/freelancer" replace />;
    return <Navigate to="/dashboard/seeker" replace />;
  }

  return children;
};

export default ProtectedRoute;
