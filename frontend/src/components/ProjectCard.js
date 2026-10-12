import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Send } from 'lucide-react';

const ProjectCard = ({ project, onBid }) => {
  if (!project) return null;

  const formatBudget = () => {
    if (project.projectType === 'HOURLY') {
      if (project.budgetMin && project.budgetMax) {
        return `$${Number(project.budgetMin).toFixed(0)} - $${Number(project.budgetMax).toFixed(0)} / hr`;
      }
      return `$${Number(project.budgetMin || project.budgetMax || 0).toFixed(0)} / hr`;
    }
    if (project.budgetMin && project.budgetMax) {
      return `$${Number(project.budgetMin).toLocaleString()} - $${Number(project.budgetMax).toLocaleString()}`;
    }
    return `$${Number(project.budgetMin || project.budgetMax || 0).toLocaleString()} Fixed`;
  };

  const skillsList = project.skillsRequired
    ? project.skillsRequired.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="card card-hoverable" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <User size={14} /> Client: {project.clientName || 'Marketplace Client'}
          </span>
          <Link to={`/projects/${project.id}`}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px', lineHeight: '1.3' }}>
              {project.title}
            </h3>
          </Link>
        </div>

        <span className={project.projectType === 'HOURLY' ? 'badge badge-info' : 'badge badge-primary'}>
          {project.projectType === 'HOURLY' ? 'Hourly Rate' : 'Fixed Price'}
        </span>
      </div>

      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}
      >
        {project.description}
      </p>

      {/* Skills tags */}
      {skillsList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {skillsList.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.75rem',
                padding: '3px 8px',
                borderRadius: '6px',
                background: '#f1f5f9',
                color: 'var(--text-secondary)',
                fontWeight: '500'
              }}
            >
              {skill}
            </span>
          ))}
          {skillsList.length > 4 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
              +{skillsList.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-color)',
          marginTop: 'auto'
        }}
      >
        <div>
          <div style={{ fontWeight: '700', color: 'var(--secondary)', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
            {formatBudget()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <Clock size={12} /> {project.duration || 'Flexible timeline'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/projects/${project.id}`} className="btn btn-secondary btn-sm">
            Details
          </Link>
          {onBid && (
            <button onClick={() => onBid(project)} className="btn btn-primary btn-sm">
              <Send size={13} /> Bid
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
