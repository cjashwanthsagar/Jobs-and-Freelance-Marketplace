import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get return URL from query string
  const query = new URLSearchParams(location.search);
  const redirectPath = query.get('redirect') || null;

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const loggedUser = await login(email, password);
      // Route to destination or role-based dashboard
      if (redirectPath) {
        navigate(redirectPath);
      } else if (loggedUser.role === 'ADMIN') {
        navigate('/admin');
      } else if (loggedUser.role === 'EMPLOYER') {
        navigate('/dashboard/employer');
      } else if (loggedUser.role === 'FREELANCER') {
        navigate('/dashboard/freelancer');
      } else {
        navigate('/dashboard/seeker');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please verify your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError('');

    login(demoEmail, demoPassword)
      .then((loggedUser) => {
        if (redirectPath) {
          navigate(redirectPath);
        } else if (loggedUser.role === 'ADMIN') {
          navigate('/admin');
        } else if (loggedUser.role === 'EMPLOYER') {
          navigate('/dashboard/employer');
        } else if (loggedUser.role === 'FREELANCER') {
          navigate('/dashboard/freelancer');
        } else {
          navigate('/dashboard/seeker');
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Failed to authenticate demo account.';
        setError(msg);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ padding: '60px 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="card" style={{ padding: '40px', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.938rem', marginTop: '6px' }}>
              Log in to manage applications, jobs, and freelance bids
            </p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Quick Demo Switchers */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.813rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>
              Quick Demo Accounts (1-Click)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('alex.seeker@jobseeker.com', 'password123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem' }}
                disabled={loading}
              >
                💼 Job Seeker
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('sarah.dev@freelancer.com', 'password123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem' }}
                disabled={loading}
              >
                ⚡ Freelancer
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('techcorp@employer.com', 'password123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem' }}
                disabled={loading}
              >
                🏢 Employer
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@marketplace.com', 'password123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem' }}
                disabled={loading}
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
