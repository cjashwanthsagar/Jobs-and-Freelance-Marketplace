import React, { useState, useEffect } from 'react';
import { adminAPI, jobAPI, projectAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  Shield,
  UserCheck,
  UserX,
  Trash2,
  RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'jobs', 'projects'
  const [userSearch, setUserSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, jobsRes, projsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers({ size: 50, search: userSearch || undefined }),
        adminAPI.getJobs({ size: 50 }),
        adminAPI.getProjects({ size: 50 }),
      ]);

      if (statsRes.data?.data) setStats(statsRes.data.data);
      if (usersRes.data?.data?.content) setUsers(usersRes.data.data.content);
      if (jobsRes.data?.data?.content) setJobs(jobsRes.data.data.content);
      if (projsRes.data?.data?.content) setProjects(projsRes.data.data.content);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const confirmMsg = `Are you sure you want to change user status to ${newStatus}?`;
    if (window.confirm(confirmMsg)) {
      try {
        await adminAPI.updateUserStatus(userId, newStatus);
        setUsers(users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
      } catch (err) {
        alert('Failed to update user account status.');
      }
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('As an Administrator, are you sure you want to remove this job posting?')) {
      try {
        await jobAPI.deleteJob(jobId);
        setJobs(jobs.filter((j) => j.id !== jobId));
      } catch (err) {
        alert('Failed to remove job posting.');
      }
    }
  };

  const handleDeleteProject = async (projId) => {
    if (window.confirm('As an Administrator, are you sure you want to remove this freelance project?')) {
      try {
        await projectAPI.deleteProject(projId);
        setProjects(projects.filter((p) => p.id !== projId));
      } catch (err) {
        alert('Failed to remove project.');
      }
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
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            color: '#ffffff',
            boxShadow: 'var(--shadow-xl)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.15)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: '700', marginBottom: '10px' }}>
                <Shield size={14} /> Master Administrator Portal
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Platform Control & Moderation
              </h1>
              <p style={{ color: '#c7d2fe', marginTop: '4px', fontSize: '0.95rem' }}>
                Monitor system metrics, review accounts, enforce policies, and audit marketplace activity.
              </p>
            </div>

            <button onClick={loadData} className="btn btn-secondary btn-sm" style={{ background: '#ffffff', color: 'var(--primary)' }}>
              <RefreshCw size={14} /> Refresh Metrics
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px', marginBottom: '36px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Accounts</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>
                {stats.totalUsers}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {stats.totalJobSeekers} Seekers • {stats.totalFreelancers} Freelancers
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Active Jobs</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#047857', marginTop: '4px' }}>
                {stats.activeJobs}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                out of {stats.totalJobs} total
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Open Gigs</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--secondary)', marginTop: '4px' }}>
                {stats.openProjects}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                out of {stats.totalProjects} total
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Job Applications</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--info)', marginTop: '4px' }}>
                {stats.totalApplications}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                submitted across jobs
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Freelance Bids</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--warning)', marginTop: '4px' }}>
                {stats.totalProposals}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                submitted across projects
              </div>
            </div>
          </div>
        )}

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.95rem',
              color: activeTab === 'users' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'users' ? '2px solid var(--primary)' : '2px solid transparent'
            }}
          >
            User Accounts ({users.length})
          </button>

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
              borderBottom: activeTab === 'jobs' ? '2px solid var(--primary)' : '2px solid transparent'
            }}
          >
            Job Postings ({jobs.length})
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
              color: activeTab === 'projects' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'projects' ? '2px solid var(--primary)' : '2px solid transparent'
            }}
          >
            Freelance Projects ({projects.length})
          </button>
        </div>

        {/* Tab 1: Users */}
        {activeTab === 'users' && (
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 16px' }}>Name</th>
                    <th style={{ padding: '12px 16px' }}>Email</th>
                    <th style={{ padding: '12px 16px' }}>Role</th>
                    <th style={{ padding: '12px 16px' }}>Account Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Moderation</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: '700' }}>
                        {u.fullName}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                        {u.email}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          className={`badge ${
                            u.role === 'ADMIN'
                              ? 'badge-purple'
                              : u.role === 'EMPLOYER'
                              ? 'badge-info'
                              : u.role === 'FREELANCER'
                              ? 'badge-warning'
                              : 'badge-primary'
                          }`}
                        >
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusBadge status={u.status} />
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            className={`btn btn-sm ${u.status === 'ACTIVE' ? 'btn-secondary' : 'btn-primary'}`}
                            style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                          >
                            {u.status === 'ACTIVE' ? (
                              <>
                                <UserX size={13} /> Suspend
                              </>
                            ) : (
                              <>
                                <UserCheck size={13} /> Activate
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Jobs */}
        {activeTab === 'jobs' && (
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 16px' }}>Title</th>
                    <th style={{ padding: '12px 16px' }}>Company</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: '700' }}>
                        {j.title}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                        {j.companyName}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                        {j.category}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusBadge status={j.status} />
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteJob(j.id)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '4px 8px' }}
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Projects */}
        {activeTab === 'projects' && (
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 16px' }}>Project Title</th>
                    <th style={{ padding: '12px 16px' }}>Client</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: '700' }}>
                        {p.title}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                        {p.clientName || 'Client'}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                        {p.category}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusBadge status={p.status} />
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '4px 8px' }}
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
