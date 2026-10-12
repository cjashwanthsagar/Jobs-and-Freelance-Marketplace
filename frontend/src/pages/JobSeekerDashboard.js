import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationAPI, jobAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  Briefcase,
  Clock,
  CheckCircle,
  FileText,
  User,
  ArrowRight,
  Search,
  ExternalLink
} from 'lucide-react';

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          applicationAPI.getMyApplications(),
          jobAPI.getJobs({ size: 4 }),
        ]);

        if (appsRes.data?.data) {
          setApplications(appsRes.data.data);
        }
        if (jobsRes.data?.data?.content) {
          setRecommendedJobs(jobsRes.data.data.content);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const totalApplied = applications.length;
  const underReview = applications.filter((a) => a.status === 'REVIEWING').length;
  const shortlisted = applications.filter((a) => a.status === 'SHORTLISTED' || a.status === 'ACCEPTED').length;

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Welcome Banner */}
        <div
          className="card"
          style={{
            padding: '32px',
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)',
            border: '1px solid #c7d2fe'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
                Job Seeker Dashboard
              </span>
              <h1 style={{ fontSize: '1.9rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Welcome back, {user?.fullName || 'Candidate'}!
              </h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                {user?.profile?.headline || 'Manage your career applications and discover new roles matching your skills.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/jobs" className="btn btn-primary">
                <Search size={16} /> Browse Open Jobs
              </Link>
              <Link to="/profile" className="btn btn-secondary">
                <User size={16} /> Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Applied</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>
                  {totalApplied}
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
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>In Review</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary)', marginTop: '4px' }}>
                  {underReview}
                </div>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={22} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Shortlisted</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>
                  {shortlisted}
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
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Skills Tagged</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--info)', marginTop: '4px' }}>
                  {user?.skills ? user.skills.length : 0}
                </div>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--info-light)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications Section */}
        <div className="card" style={{ padding: '32px', marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Recent Applications</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Track the status of roles you have applied for
              </p>
            </div>
            <Link to="/applications/my" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner" />
            </div>
          ) : applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <p>You haven't submitted any job applications yet.</p>
              <Link to="/jobs" className="btn btn-primary btn-sm" style={{ marginTop: '14px' }}>
                Find Your Next Job
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 16px' }}>Role</th>
                    <th style={{ padding: '12px 16px' }}>Company</th>
                    <th style={{ padding: '12px 16px' }}>Applied Date</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: '700' }}>
                        <Link to={`/jobs/${app.jobId}`} style={{ color: 'var(--text-primary)' }}>
                          {app.jobTitle}
                        </Link>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                        {app.companyName}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusBadge status={app.status} />
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <Link to={`/jobs/${app.jobId}`} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px' }}>
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

        {/* Recommended Jobs */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Recommended Opportunities</h2>
            <Link to="/jobs" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem' }}>
              Browse All
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {recommendedJobs.map((job) => (
              <div key={job.id} className="card card-hoverable" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  {job.companyName}
                </div>
                <Link to={`/jobs/${job.id}`}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>
                    {job.title}
                  </h3>
                </Link>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <span className="badge badge-neutral">{job.location}</span>
                  <span className="badge badge-primary">{job.jobType ? job.jobType.replace('_', ' ') : 'Full Time'}</span>
                </div>
                <Link to={`/jobs/${job.id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  View Role
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
