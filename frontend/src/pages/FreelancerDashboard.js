import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { proposalAPI, projectAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  Send,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Layers,
  User
} from 'lucide-react';

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [propsRes, projsRes] = await Promise.all([
          proposalAPI.getMyProposals(),
          projectAPI.getProjects({ size: 4 }),
        ]);

        if (propsRes.data?.data) {
          setProposals(propsRes.data.data);
        }
        if (projsRes.data?.data?.content) {
          setRecommendedProjects(projsRes.data.data.content);
        }
      } catch (err) {
        console.error('Failed to load freelancer dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const totalProposals = proposals.length;
  const acceptedProposals = proposals.filter((p) => p.status === 'ACCEPTED').length;
  const shortlistedProposals = proposals.filter((p) => p.status === 'SHORTLISTED').length;

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Welcome Banner */}
        <div
          className="card"
          style={{
            padding: '32px',
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)',
            border: '1px solid #ddd6fe'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '8px' }}>
                Freelancer Portal
              </span>
              <h1 style={{ fontSize: '1.9rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Welcome back, {user?.fullName || 'Freelancer'}!
              </h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                {user?.profile?.headline || 'Manage your active bids, winning contracts, and client proposals.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/projects" className="btn btn-primary">
                <Layers size={16} /> Explore Gigs
              </Link>
              <Link to="/profile" className="btn btn-secondary">
                <User size={16} /> Edit Portfolio
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Active Proposals</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary)', marginTop: '4px' }}>
                  {totalProposals}
                </div>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={22} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Accepted / Won</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>
                  {acceptedProposals}
                </div>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={22} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Shortlisted</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>
                  {shortlistedProposals}
                </div>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={22} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Your Hourly Rate</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#047857', marginTop: '4px' }}>
                  ${user?.profile?.hourlyRate ? Number(user.profile.hourlyRate).toFixed(0) : '0'}/hr
                </div>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Proposals Table */}
        <div className="card" style={{ padding: '32px', marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Your Submitted Proposals</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Review submitted bids and status feedback from clients
              </p>
            </div>
            <Link to="/proposals/my" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner" />
            </div>
          ) : proposals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <p>You haven't submitted any project proposals yet.</p>
              <Link to="/projects" className="btn btn-primary btn-sm" style={{ marginTop: '14px' }}>
                Find Freelance Gigs
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 16px' }}>Project</th>
                    <th style={{ padding: '12px 16px' }}>Client</th>
                    <th style={{ padding: '12px 16px' }}>Your Bid</th>
                    <th style={{ padding: '12px 16px' }}>Estimated Time</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {proposals.slice(0, 5).map((prop) => (
                    <tr key={prop.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: '700' }}>
                        <Link to={`/projects/${prop.projectId}`} style={{ color: 'var(--text-primary)' }}>
                          {prop.projectTitle}
                        </Link>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                        {prop.clientName || 'Client'}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--secondary)' }}>
                        ${Number(prop.bidAmount).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                        {prop.estimatedDays} days
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusBadge status={prop.status} />
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <Link to={`/projects/${prop.projectId}`} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px' }}>
                          <ExternalLink size={13} /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recommended Freelance Projects */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Recommended Freelance Projects</h2>
            <Link to="/projects" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem' }}>
              Browse All
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {recommendedProjects.map((p) => (
              <div key={p.id} className="card card-hoverable" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Category: {p.category}
                </div>
                <Link to={`/projects/${p.id}`}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>
                    {p.title}
                  </h3>
                </Link>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <span className="badge badge-purple">
                    {p.projectType === 'HOURLY' ? 'Hourly' : 'Fixed'}
                  </span>
                  <span className="badge badge-success">
                    ${Number(p.budgetMin || 0).toFixed(0)} - ${Number(p.budgetMax || 0).toFixed(0)}
                  </span>
                </div>
                <Link to={`/projects/${p.id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  View Details & Bid
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
