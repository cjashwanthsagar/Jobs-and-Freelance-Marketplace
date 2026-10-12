import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobAPI, projectAPI, applicationAPI, proposalAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  Briefcase,
  Layers,
  Users,
  Send,
  PlusCircle,
  Eye,
  Trash2,
  ExternalLink
} from 'lucide-react';

const EmployerDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs', 'projects', 'applicants', 'proposals'
  const [jobs, setJobs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsRes, projsRes, appsRes, propsRes] = await Promise.all([
        jobAPI.getMyPostedJobs({ size: 50 }),
        projectAPI.getMyProjects({ size: 50 }),
        applicationAPI.getAllEmployerApplications(),
        proposalAPI.getAllClientProposals(),
      ]);

      if (jobsRes.data?.data?.content) setJobs(jobsRes.data.data.content);
      if (projsRes.data?.data?.content) setProjects(projsRes.data.data.content);
      if (appsRes.data?.data) setApplicants(appsRes.data.data);
      if (propsRes.data?.data) setProposals(propsRes.data.data);
    } catch (err) {
      console.error('Failed to load employer dashboard listings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting? All applications for it will be removed.')) {
      try {
        await jobAPI.deleteJob(jobId);
        setJobs(jobs.filter((j) => j.id !== jobId));
      } catch (err) {
        alert('Failed to delete job posting.');
      }
    }
  };

  const handleDeleteProject = async (projId) => {
    if (window.confirm('Are you sure you want to delete this freelance project?')) {
      try {
        await projectAPI.deleteProject(projId);
        setProjects(projects.filter((p) => p.id !== projId));
      } catch (err) {
        alert('Failed to delete project.');
      }
    }
  };

  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      await applicationAPI.updateStatus(appId, newStatus);
      setApplicants(applicants.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)));
    } catch (err) {
      alert('Failed to update applicant status');
    }
  };

  const handleUpdatePropStatus = async (propId, newStatus) => {
    try {
      await proposalAPI.updateStatus(propId, newStatus);
      setProposals(proposals.map((p) => (p.id === propId ? { ...p, status: newStatus } : p)));
    } catch (err) {
      alert('Failed to update proposal status');
    }
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Banner */}
        <div
          className="card"
          style={{
            padding: '32px',
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
            border: '1px solid #bbf7d0'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '8px' }}>
                Employer & Client Hub
              </span>
              <h1 style={{ fontSize: '1.9rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                {user?.fullName || 'Company Portal'}
              </h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                Manage full-time career listings, review job applicants, and hire freelance talent.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/jobs/new" className="btn btn-primary">
                <PlusCircle size={16} /> Post a Job
              </Link>
              <Link to="/projects/new" className="btn btn-secondary">
                <Layers size={16} /> Post Freelance Project
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Jobs Posted</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>
                  {jobs.length}
                </div>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={22} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Freelance Projects</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary)', marginTop: '4px' }}>
                  {projects.length}
                </div>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={22} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Candidates Received</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#047857', marginTop: '4px' }}>
                  {applicants.length}
                </div>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={22} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Freelance Bids</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--warning)', marginTop: '4px' }}>
                  {proposals.length}
                </div>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--warning-light)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('jobs')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.95rem',
              color: activeTab === 'jobs' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'jobs' ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'var(--transition)'
            }}
          >
            My Job Postings ({jobs.length})
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.95rem',
              color: activeTab === 'projects' ? 'var(--secondary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'projects' ? '2px solid var(--secondary)' : '2px solid transparent',
              transition: 'var(--transition)'
            }}
          >
            My Freelance Projects ({projects.length})
          </button>

          <button
            onClick={() => setActiveTab('applicants')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.95rem',
              color: activeTab === 'applicants' ? '#047857' : 'var(--text-muted)',
              borderBottom: activeTab === 'applicants' ? '2px solid #047857' : '2px solid transparent',
              transition: 'var(--transition)'
            }}
          >
            Job Applicants ({applicants.length})
          </button>

          <button
            onClick={() => setActiveTab('proposals')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.95rem',
              color: activeTab === 'proposals' ? 'var(--warning)' : 'var(--text-muted)',
              borderBottom: activeTab === 'proposals' ? '2px solid var(--warning)' : '2px solid transparent',
              transition: 'var(--transition)'
            }}
          >
            Freelance Bids ({proposals.length})
          </button>
        </div>

        {/* Tab 1: Jobs Postings */}
        {activeTab === 'jobs' && (
          <div className="card" style={{ padding: '28px' }}>
            {jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <p>You haven't posted any jobs yet.</p>
                <Link to="/jobs/new" className="btn btn-primary btn-sm" style={{ marginTop: '14px' }}>
                  Post Your First Job
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px 16px' }}>Title</th>
                      <th style={{ padding: '12px 16px' }}>Category</th>
                      <th style={{ padding: '12px 16px' }}>Applicants</th>
                      <th style={{ padding: '12px 16px' }}>Views</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontWeight: '700' }}>
                          <Link to={`/jobs/${job.id}`} style={{ color: 'var(--text-primary)' }}>
                            {job.title}
                          </Link>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                          {job.category}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className="badge badge-primary">
                            {job.applicationsCount} applicants
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                          {job.viewsCount}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <StatusBadge status={job.status} />
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <Link to={`/jobs/${job.id}`} className="btn btn-secondary btn-sm" title="View details">
                              <Eye size={13} /> View
                            </Link>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="btn btn-danger btn-sm"
                              title="Delete job"
                              style={{ padding: '4px 8px' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Freelance Projects */}
        {activeTab === 'projects' && (
          <div className="card" style={{ padding: '28px' }}>
            {projects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <p>You haven't posted any freelance projects yet.</p>
                <Link to="/projects/new" className="btn btn-secondary btn-sm" style={{ marginTop: '14px' }}>
                  Post A Freelance Project
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px 16px' }}>Project Title</th>
                      <th style={{ padding: '12px 16px' }}>Type</th>
                      <th style={{ padding: '12px 16px' }}>Proposals</th>
                      <th style={{ padding: '12px 16px' }}>Views</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((proj) => (
                      <tr key={proj.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontWeight: '700' }}>
                          <Link to={`/projects/${proj.id}`} style={{ color: 'var(--text-primary)' }}>
                            {proj.title}
                          </Link>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className="badge badge-purple">
                            {proj.projectType === 'HOURLY' ? 'Hourly' : 'Fixed'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className="badge badge-primary">
                            {proj.proposalsCount} bids
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                          {proj.viewsCount}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <StatusBadge status={proj.status} />
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <Link to={`/projects/${proj.id}`} className="btn btn-secondary btn-sm">
                              <Eye size={13} /> View
                            </Link>
                            <button
                              onClick={() => handleDeleteProject(proj.id)}
                              className="btn btn-danger btn-sm"
                              style={{ padding: '4px 8px' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Applicants Review */}
        {activeTab === 'applicants' && (
          <div className="card" style={{ padding: '28px' }}>
            {applicants.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                No applications submitted to your jobs yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {applicants.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '20px',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                            {app.applicantName}
                          </h3>
                          <StatusBadge status={app.status} />
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Applied for <strong>{app.jobTitle}</strong> • {app.applicantEmail}
                        </div>
                      </div>

                      {/* Status Dropdown */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Decision:</span>
                        <select
                          className="form-select"
                          style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
                          value={app.status}
                          onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="REVIEWING">In Review</option>
                          <option value="SHORTLISTED">Shortlist</option>
                          <option value="ACCEPTED">Accept / Hire</option>
                          <option value="REJECTED">Reject</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      <strong>Cover Letter:</strong>
                      <p style={{ marginTop: '4px', whiteSpace: 'pre-line' }}>{app.coverLetter || 'No cover letter provided.'}</p>
                    </div>

                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <ExternalLink size={14} /> Open Candidate Portfolio / Resume Link
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Proposals Review */}
        {activeTab === 'proposals' && (
          <div className="card" style={{ padding: '28px' }}>
            {proposals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                No proposals submitted to your freelance projects yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {proposals.map((prop) => (
                  <div
                    key={prop.id}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '20px',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                            {prop.freelancerName}
                          </h3>
                          <StatusBadge status={prop.status} />
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Bid on <strong>{prop.projectTitle}</strong> • {prop.freelancerEmail}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bid:</span>
                          <span style={{ fontWeight: '800', color: 'var(--secondary)', marginLeft: '4px' }}>
                            ${Number(prop.bidAmount).toLocaleString()}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                            ({prop.estimatedDays} days)
                          </span>
                        </div>

                        <select
                          className="form-select"
                          style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
                          value={prop.status}
                          onChange={(e) => handleUpdatePropStatus(prop.id, e.target.value)}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="SHORTLISTED">Shortlist</option>
                          <option value="ACCEPTED">Accept / Award</option>
                          <option value="REJECTED">Reject</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <strong>Pitch & Scope:</strong>
                      <p style={{ marginTop: '4px', whiteSpace: 'pre-line' }}>{prop.coverLetter}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
