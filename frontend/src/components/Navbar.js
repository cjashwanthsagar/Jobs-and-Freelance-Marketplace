import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Layers,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'EMPLOYER') return '/dashboard/employer';
    if (user.role === 'FREELANCER') return '/dashboard/freelancer';
    return '/dashboard/seeker';
  };

  return (
    <nav
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
            }}
          >
            <Briefcase size={22} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Work<span className="gradient-text">Market</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          <NavLink
            to="/jobs"
            style={({ isActive }) => ({
              fontWeight: '600',
              fontSize: '0.938rem',
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'var(--transition)'
            })}
          >
            Find Jobs
          </NavLink>

          <NavLink
            to="/projects"
            style={({ isActive }) => ({
              fontWeight: '600',
              fontSize: '0.938rem',
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'var(--transition)'
            })}
          >
            Freelance Projects
          </NavLink>

          {/* Role specific quick links */}
          {user?.role === 'JOB_SEEKER' && (
            <NavLink
              to="/applications/my"
              style={({ isActive }) => ({
                fontWeight: '600',
                fontSize: '0.938rem',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)'
              })}
            >
              My Applications
            </NavLink>
          )}

          {user?.role === 'FREELANCER' && (
            <NavLink
              to="/proposals/my"
              style={({ isActive }) => ({
                fontWeight: '600',
                fontSize: '0.938rem',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)'
              })}
            >
              My Proposals
            </NavLink>
          )}

          {(user?.role === 'EMPLOYER' || user?.role === 'ADMIN') && (
            <>
              <Link to="/jobs/new" className="btn btn-secondary btn-sm">
                <PlusCircle size={15} /> Post Job
              </Link>
              <Link to="/projects/new" className="btn btn-outline-primary btn-sm">
                <Layers size={15} /> Post Project
              </Link>
            </>
          )}
        </div>

        {/* User Auth Buttons / Profile Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'none',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 12px 4px 6px',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'var(--accent-gradient)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.875rem'
                  }}
                >
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {user.fullName}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {user.role ? user.role.replace('_', ' ').toLowerCase() : ''}
                  </div>
                </div>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '48px',
                    width: '210px',
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--border-color)',
                    padding: '8px 0',
                    zIndex: 100
                  }}
                >
                  <Link
                    to={getDashboardLink()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Briefcase size={16} /> Dashboard
                  </Link>

                  <Link
                    to="/profile"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <User size={16} /> Edit Profile
                  </Link>

                  {user?.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--primary)',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-light)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Shield size={16} /> Admin Portal
                    </Link>
                  )}

                  <hr style={{ margin: '6px 0', borderColor: 'var(--border-color)', borderWidth: '0.5px' }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--danger)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--danger-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--border-color)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>Find Jobs</Link>
          <Link to="/projects" onClick={() => setMobileMenuOpen(false)}>Freelance Projects</Link>
          {isAuthenticated && (
            <>
              <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
              {(user?.role === 'EMPLOYER' || user?.role === 'ADMIN') && (
                <>
                  <Link to="/jobs/new" onClick={() => setMobileMenuOpen(false)}>Post Job</Link>
                  <Link to="/projects/new" onClick={() => setMobileMenuOpen(false)}>Post Project</Link>
                </>
              )}
              <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ marginTop: '8px' }}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
