import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { proposalAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Layers, User, Calendar, ExternalLink, ArrowLeft } from 'lucide-react';

const MyProposalsPage = () => {
  const [proposals, setProposals] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await proposalAPI.getMyProposals();
        if (res.data?.data) {
          setProposals(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load proposals', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  const filteredProposals = proposals.filter((p) => {
    if (filterStatus === 'ALL') return true;
    return p.status === filterStatus;
  });

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        <Link
          to="/dashboard/freelancer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '20px' }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              My Freelance Proposals
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
              Monitor your bids, delivery estimates, and client acceptance statuses
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['ALL', 'PENDING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {st.toLowerCase().replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
            <p style={{ marginTop: '14px' }}>Loading your proposal history...</p>
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Layers size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>No Proposals Found</h3>
            <p style={{ color: 'var(--text-muted)', margin: '8px auto 20px', maxWidth: '400px' }}>
              {filterStatus === 'ALL'
                ? "You haven't submitted any freelance project bids yet."
                : `No proposals currently have status "${filterStatus}".`}
            </p>
            <Link to="/projects" className="btn btn-primary btn-sm">
              Explore Freelance Projects
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {filteredProposals.map((prop) => (
              <div key={prop.id} className="card card-hoverable" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <User size={14} /> Client: <strong>{prop.clientName || 'Marketplace Client'}</strong>
                    </div>
                    <Link to={`/projects/${prop.projectId}`}>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
                        {prop.projectTitle}
                      </h2>
                    </Link>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--secondary)' }}>
                        ${Number(prop.bidAmount).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        in {prop.estimatedDays} days
                      </div>
                    </div>
                    <StatusBadge status={prop.status} />
                    <Link to={`/projects/${prop.projectId}`} className="btn btn-secondary btn-sm">
                      <ExternalLink size={13} /> View
                    </Link>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  <strong>Your Pitch & Deliverables:</strong>
                  <p style={{ marginTop: '4px', whiteSpace: 'pre-line' }}>{prop.coverLetter}</p>
                </div>

                <div style={{ fontSize: '0.813rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} /> Submitted on: {new Date(prop.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProposalsPage;
