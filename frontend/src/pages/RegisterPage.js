import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Briefcase, Zap, Building2, AlertCircle, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('JOB_SEEKER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newUser = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role,
      });

      if (newUser.role === 'EMPLOYER') {
        navigate('/dashboard/employer');
      } else if (newUser.role === 'FREELANCER') {
        navigate('/dashboard/freelancer');
      } else {
        navigate('/dashboard/seeker');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Email may already be in use.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '60px 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '560px' }}>
        <div className="card" style={{ padding: '40px', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Create Your Account
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.938rem', marginTop: '6px' }}>
              Select your platform role to customize your experience
            </p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Role Selection Cards */}
            <div className="form-group">
              <label className="form-label">I want to join as:</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div
                  onClick={() => setRole('JOB_SEEKER')}
                  style={{
                    padding: '16px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: role === 'JOB_SEEKER' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    backgroundColor: role === 'JOB_SEEKER' ? 'var(--primary-light)' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'var(--transition)'
                  }}
                >
                  <Briefcase size={22} color={role === 'JOB_SEEKER' ? 'var(--primary)' : 'var(--text-muted)'} style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', color: role === 'JOB_SEEKER' ? 'var(--primary)' : 'var(--text-primary)' }}>
                    Job Seeker
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Find jobs
                  </div>
                </div>

                <div
                  onClick={() => setRole('FREELANCER')}
                  style={{
                    padding: '16px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: role === 'FREELANCER' ? '2px solid var(--secondary)' : '1px solid var(--border-color)',
                    backgroundColor: role === 'FREELANCER' ? 'var(--secondary-light)' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'var(--transition)'
                  }}
                >
                  <Zap size={22} color={role === 'FREELANCER' ? 'var(--secondary)' : 'var(--text-muted)'} style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', color: role === 'FREELANCER' ? 'var(--secondary)' : 'var(--text-primary)' }}>
                    Freelancer
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Bid on gigs
                  </div>
                </div>

                <div
                  onClick={() => setRole('EMPLOYER')}
                  style={{
                    padding: '16px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: role === 'EMPLOYER' ? '2px solid #0284c7' : '1px solid var(--border-color)',
                    backgroundColor: role === 'EMPLOYER' ? '#f0f9ff' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'var(--transition)'
                  }}
                >
                  <Building2 size={22} color={role === 'EMPLOYER' ? '#0284c7' : 'var(--text-muted)'} style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', color: role === 'EMPLOYER' ? '#0284c7' : 'var(--text-primary)' }}>
                    Employer
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Hire talent
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name / Company Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  placeholder="e.g. John Doe or Acme Corp"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: '42px' }}
                    placeholder="Min 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: '42px' }}
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
