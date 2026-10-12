import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ApplyModal from '../components/ApplyModal';
import {
  Building,
  MapPin,
  DollarSign,
  Briefcase,
  Globe,
  ArrowLeft,
  Users,
  Eye
} from 'lucide-react';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await jobAPI.getJobById(id);
        if (res.data?.data) {
          setJob(res.data.data);
        }
      } catch (err) {
        setError('Job posting not found or has been removed by the employer.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
        <p style={{ marginTop: '16px' }}>Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Listing Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '12px 0 24px' }}>{error}</p>
          <Link to="/jobs" className="btn btn-primary">
            Browse All Jobs
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && (user.id === job.employerId || user.role === 'ADMIN');

  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `$${Number(job.salaryMin).toLocaleString()} - $${Number(job.salaryMax).toLocaleString()} / year`;
    }
    if (job.salaryMin) return `From $${Number(job.salaryMin).toLocaleString()} / year`;
    if (job.salaryMax) return `Up to $${Number(job.salaryMax).toLocaleString()} / year`;
    return 'Competitive Compensation';
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Back Link */}
        <Link
          to="/jobs"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '24px' }}
        >
          <ArrowLeft size={16} /> Back to Job Listings
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '32px', alignItems: 'flex-start' }}>
          {/* Main Content */}
          <div>
            {/* Header Card */}
            <div className="card" style={{ padding: '36px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '1.6rem',
                    border: '1px solid #c7d2fe'
                  }}
                >
                  {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <h1 style={{ fontSize: '1.85rem', fontWeight: '800', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
                    {job.title}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '1rem', marginTop: '4px' }}>
                    <Building size={16} /> <strong>{job.companyName}</strong>
                    <span>•</span>
                    <MapPin size={16} /> {job.location}
                    {job.isRemote && (
                      <span className="badge badge-purple" style={{ marginLeft: '6px' }}>
                        <Globe size={11} /> Remote
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tag bar */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                <span className="badge badge-primary">
                  <Briefcase size={13} /> {job.jobType ? job.jobType.replace('_', ' ') : 'Full Time'}
                </span>
                <span className="badge badge-info">
                  {job.category}
                </span>
                <span className="badge badge-neutral">
                  Level: {job.experienceLevel || 'Mid Level'}
                </span>
                <span className="badge badge-neutral">
                  <Eye size={13} /> {job.viewsCount} views
                </span>
                <span className="badge badge-success">
                  <Users size={13} /> {job.applicationsCount} applicants
                </span>
              </div>
            </div>

            {/* Description Card */}
            <div className="card" style={{ padding: '36px', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '16px' }}>
                About the Role
              </h2>
              <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-line', fontSize: '0.975rem' }}>
                {job.description}
              </div>

              {job.responsibilities && (
                <>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginTop: '28px', marginBottom: '14px' }}>
                    Key Responsibilities
                  </h3>
                  <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-line', fontSize: '0.975rem' }}>
                    {job.responsibilities}
                  </div>
                </>
              )}

              {job.requirements && (
                <>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginTop: '28px', marginBottom: '14px' }}>
                    Requirements & Qualifications
                  </h3>
                  <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-line', fontSize: '0.975rem' }}>
                    {job.requirements}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="card" style={{ padding: '28px', position: 'sticky', top: '96px' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Offered Salary
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#047857', marginTop: '4px', display: 'flex', alignItems: 'center' }}>
                  <DollarSign size={20} />
                  {formatSalary()}
                </div>
              </div>

              {/* Action buttons */}
              {isOwner ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link to={`/employer/applicants?jobId=${job.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                    <Users size={16} /> View Applicants ({job.applicationsCount})
                  </Link>
                  <Link to={`/dashboard/employer`} className="btn btn-secondary" style={{ width: '100%' }}>
                    Manage in Dashboard
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px' }}
                >
                  Apply For This Job
                </button>
              )}

              <hr style={{ margin: '24px 0', borderColor: 'var(--border-color)', borderWidth: '0.5px' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{job.location}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Workplace:</span>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {job.isRemote ? 'Remote (Anywhere)' : 'On-site'}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Job Type:</span>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {job.jobType ? job.jobType.replace('_', ' ') : 'Full Time'}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Date Posted:</span>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        <ApplyModal
          job={job}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSuccess={() => {
            alert('Application submitted successfully!');
            navigate('/applications/my');
          }}
        />
      </div>
    </div>
  );
};

export default JobDetailsPage;
