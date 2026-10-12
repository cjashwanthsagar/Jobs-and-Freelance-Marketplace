import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Briefcase, Building, MapPin, Calendar, ExternalLink, ArrowLeft } from 'lucide-react';

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await applicationAPI.getMyApplications();
        if (res.data?.data) {
          setApplications(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApps = applications.filter((app) => {
    if (filterStatus === 'ALL') return true;
    return app.status === filterStatus;
  });

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        <Link
          to="/dashboard/seeker"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '20px' }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              My Job Applications
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
              Track progress, review statuses, and stay updated on your applications
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['ALL', 'PENDING', 'REVIEWING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'].map((st) => (
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
            <p style={{ marginTop: '14px' }}>Loading your application history...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Briefcase size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>No Applications Found</h3>
            <p style={{ color: 'var(--text-muted)', margin: '8px auto 20px', maxWidth: '400px' }}>
              {filterStatus === 'ALL'
                ? "You haven't submitted any job applications yet."
                : `No applications currently have status "${filterStatus}".`}
            </p>
            <Link to="/jobs" className="btn btn-primary btn-sm">
              Explore Job Listings
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {filteredApps.map((app) => (
              <div key={app.id} className="card card-hoverable" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <Building size={14} /> <strong>{app.companyName}</strong>
                      {app.jobLocation && (
                        <>
                          <span>•</span>
                          <MapPin size={14} /> {app.jobLocation}
                        </>
                      )}
                    </div>
                    <Link to={`/jobs/${app.jobId}`}>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
                        {app.jobTitle}
                      </h2>
                    </Link>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <StatusBadge status={app.status} />
                    <Link to={`/jobs/${app.jobId}`} className="btn btn-secondary btn-sm">
                      <ExternalLink size={13} /> View Job
                    </Link>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  <strong>Your Submitted Cover Letter:</strong>
                  <p style={{ marginTop: '4px', whiteSpace: 'pre-line' }}>{app.coverLetter || 'No cover letter attached.'}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.813rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} /> Applied on: {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>

                  {app.resumeUrl && (
                    <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: '600' }}>
                      Resume Link Provided
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
