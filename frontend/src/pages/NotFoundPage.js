import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div style={{ padding: '100px 20px', textAlign: 'center', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ padding: '60px 40px', maxWidth: '540px', width: '100%', boxShadow: 'var(--shadow-xl)' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}
        >
          <HelpCircle size={40} />
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-1px', color: 'var(--primary)', lineHeight: '1' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '12px', marginBottom: '10px' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '32px' }}>
          The page or marketplace resource you are looking for might have been moved, removed, or is temporarily unavailable.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Return to Home
          </Link>
          <Link to="/jobs" className="btn btn-secondary">
            <Search size={16} /> Search Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
