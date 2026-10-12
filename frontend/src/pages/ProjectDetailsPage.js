import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProposalModal from '../components/ProposalModal';
import {
  User,
  Layers,
  ArrowLeft,
  Send,
  Eye
} from 'lucide-react';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await projectAPI.getProjectById(id);
        if (res.data?.data) {
          setProject(res.data.data);
        }
      } catch (err) {
        setError('Freelance project not found or has been concluded.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
        <p style={{ marginTop: '16px' }}>Loading freelance project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Project Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '12px 0 24px' }}>{error}</p>
          <Link to="/projects" className="btn btn-primary">
            Browse All Projects
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && (user.id === project.clientId || user.role === 'ADMIN');

  const formatBudget = () => {
    if (project.projectType === 'HOURLY') {
      if (project.budgetMin && project.budgetMax) {
        return `$${Number(project.budgetMin).toFixed(0)} - $${Number(project.budgetMax).toFixed(0)} / hr`;
      }
      return `$${Number(project.budgetMin || project.budgetMax || 0).toFixed(0)} / hr`;
    }
    if (project.budgetMin && project.budgetMax) {
      return `$${Number(project.budgetMin).toLocaleString()} - $${Number(project.budgetMax).toLocaleString()} Fixed`;
    }
    return `$${Number(project.budgetMin || project.budgetMax || 0).toLocaleString()} Fixed`;
  };

  const skillsList = project.skillsRequired
    ? project.skillsRequired.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Back Link */}
        <Link
          to="/projects"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '24px' }}
        >
          <ArrowLeft size={16} /> Back to Freelance Projects
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '32px', alignItems: 'flex-start' }}>
          {/* Main Scope */}
          <div>
            <div className="card" style={{ padding: '36px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span className={project.projectType === 'HOURLY' ? 'badge badge-info' : 'badge badge-primary'}>
                  {project.projectType === 'HOURLY' ? 'Hourly Project' : 'Fixed Price Project'}
                </span>
                <span className="badge badge-success">
                  Status: {project.status}
                </span>
              </div>

              <h1 style={{ fontSize: '1.9rem', fontWeight: '800', letterSpacing: '-0.5px', lineHeight: '1.25', marginBottom: '14px' }}>
                {project.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text-muted)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={15} /> Client: <strong>{project.clientName || 'Marketplace Client'}</strong>
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Layers size={15} /> Category: {project.category}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Eye size={15} /> {project.viewsCount} views
                </span>
              </div>
            </div>

            {/* Scope & Details */}
            <div className="card" style={{ padding: '36px', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '16px' }}>
                Project Overview & Specifications
              </h2>
              <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-line', fontSize: '0.975rem' }}>
                {project.description}
              </div>

              {/* Skills required */}
              {skillsList.length > 0 && (
                <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '12px' }}>
                    Required Technical Skills
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {skillsList.map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.85rem',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                          fontWeight: '600'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="card" style={{ padding: '28px', position: 'sticky', top: '96px' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Project Budget
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary)', marginTop: '4px' }}>
                  {formatBudget()}
                </div>
              </div>

              {/* Action buttons */}
              {isOwner ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link to="/dashboard/employer" className="btn btn-secondary" style={{ width: '100%' }}>
                    Manage Proposals in Dashboard ({project.proposalsCount})
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => setIsProposalModalOpen(true)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px' }}
                >
                  <Send size={16} /> Submit A Proposal
                </button>
              )}

              <hr style={{ margin: '24px 0', borderColor: 'var(--border-color)', borderWidth: '0.5px' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Estimated Duration:</span>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {project.duration || 'Flexible Timeline'}
                  </div>
                </div>
                {project.deadline && (
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Deadline:</span>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                )}
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Proposals Submitted:</span>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {project.proposalsCount} proposals
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Date Published:</span>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proposal Modal */}
        <ProposalModal
          project={project}
          isOpen={isProposalModalOpen}
          onClose={() => setIsProposalModalOpen(false)}
          onSuccess={() => {
            alert('Proposal submitted successfully!');
            navigate('/proposals/my');
          }}
        />
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
