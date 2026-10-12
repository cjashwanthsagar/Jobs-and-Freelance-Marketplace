import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { applicationAPI, jobAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Users, Mail, MapPin, ExternalLink, ArrowLeft } from 'lucide-react';

const EmployerApplicantsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedJobId = queryParams.get('jobId') || '';

  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filterJobId, setFilterJobId] = useState(selectedJobId);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplicants = async () => {
      setLoading(true);
      try {
        const [jobsRes, appsRes] = await Promise.all([
          jobAPI.getMyPostedJobs({ size: 50 }),
          filterJobId
            ? applicationAPI.getJobApplications(filterJobId)
            : applicationAPI.getAllEmployerApplications(),
        ]);

        if (jobsRes.data?.data?.content) setJobs(jobsRes.data.data.content);
        if (appsRes.data?.data) setApplicants(appsRes.data.data);
      } catch (err) {
        console.error('Failed to load applicants', err);
      } finally {
        setLoading(false);
      }
    };

    loadApplicants();
  }, [filterJobId]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationAPI.updateStatus(appId, newStatus);
      setApplicants(applicants.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)));
    } catch (err) {
      alert('Failed to update candidate status.');
    }
  };

  const filteredApplicants = applicants.filter((a) => {
    if (filterStatus === 'ALL') return true;
    return a.status === filterStatus;
  });

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        <Link
          to="/dashboard/employer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '20px' }}
        >
          <ArrowLeft size={16} /> Back to Employer Dashboard
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Candidate Applicant Management
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
              Review candidate qualifications, cover letters, and manage hiring statuses
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '180px' }}
              value={filterJobId}
              onChange={(e) => setFilterJobId(e.target.value)}
            >
              <option value="">All Job Postings</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>

            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="REVIEWING">In Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="ACCEPTED">Accepted / Hired</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
            <p style={{ marginTop: '14px' }}>Loading candidate applications...</p>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Users size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>No Applicants Found</h3>
            <p style={{ color: 'var(--text-muted)', margin: '8px auto 20px', maxWidth: '400px' }}>
              No applications match the selected job and status criteria.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredApplicants.map((app) => (
              <div key={app.id} className="card card-hoverable" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        background: 'var(--accent-gradient)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                        fontWeight: '800'
                      }}
                    >
                      {app.applicantName ? app.applicantName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                          {app.applicantName}
                        </h2>
                        <StatusBadge status={app.status} />
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Applied for <strong>{app.jobTitle}</strong> ({app.companyName})
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={13} /> {app.applicantEmail}
                        </span>
                        {app.applicantLocation && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={13} /> {app.applicantLocation}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hiring Decision Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Status:</span>
                    <select
                      className="form-select"
                      style={{ padding: '8px 14px', fontSize: '0.875rem', width: 'auto' }}
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="REVIEWING">In Review</option>
                      <option value="SHORTLISTED">Shortlist</option>
                      <option value="ACCEPTED">Accept / Hire</option>
                      <option value="REJECTED">Reject</option>
                    </select>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Candidate Pitch / Cover Letter:
                  </div>
                  <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>{app.coverLetter || 'No cover letter submitted.'}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Applied on: {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>

                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      <ExternalLink size={13} /> View Resume / Portfolio Link
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

export default EmployerApplicantsPage;
