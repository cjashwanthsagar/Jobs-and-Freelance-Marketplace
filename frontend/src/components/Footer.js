import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Shield, Globe, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-color)',
        padding: '60px 0 30px',
        marginTop: '60px'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '48px'
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <Briefcase size={20} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>
                Work<span className="gradient-text">Market</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '20px' }}>
              The unified jobs and freelance marketplace connecting world-class software developers, designers, and employers.
            </p>
            <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={14} color="var(--primary)" /> Secure
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Globe size={14} color="var(--secondary)" /> Global
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award size={14} color="var(--success)" /> Verified
              </span>
            </div>
          </div>

          {/* Job Seekers */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '18px', color: 'var(--text-primary)' }}>
              For Job Seekers
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/jobs">Browse Full-time Jobs</Link></li>
              <li><Link to="/jobs?isRemote=true">Remote Developer Roles</Link></li>
              <li><Link to="/register">Create Candidate Profile</Link></li>
              <li><Link to="/applications/my">Application Tracker</Link></li>
            </ul>
          </div>

          {/* Freelancers & Clients */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '18px', color: 'var(--text-primary)' }}>
              For Freelancers & Clients
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/projects">Freelance Gig Listings</Link></li>
              <li><Link to="/projects/new">Post a Freelance Project</Link></li>
              <li><Link to="/jobs/new">Hire Permanent Talent</Link></li>
              <li><Link to="/proposals/my">Proposal Management</Link></li>
            </ul>
          </div>

          {/* Platform Tech Stack */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '18px', color: 'var(--text-primary)' }}>
              Platform Architecture
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['React.js', 'Spring Boot 3', 'MySQL 8', 'JWT Auth', 'REST API', 'Vercel', 'Render'].map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: '#f8fafc',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    fontWeight: '600'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '16px' }}>
              Built for high reliability, clean security practices, and flexible cloud deployment.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.813rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} Jobs and Freelance Marketplace. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Clean Architecture</span>
            <span>BCrypt Encrypted</span>
            <span>Production Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
