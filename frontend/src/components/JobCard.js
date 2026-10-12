import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Building, Briefcase, Globe } from 'lucide-react';

const JobCard = ({ job, onApply }) => {
  if (!job) return null;

  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `$${Number(job.salaryMin).toLocaleString()} - $${Number(job.salaryMax).toLocaleString()} / yr`;
    }
    if (job.salaryMin) return `From $${Number(job.salaryMin).toLocaleString()} / yr`;
    if (job.salaryMax) return `Up to $${Number(job.salaryMax).toLocaleString()} / yr`;
    return 'Competitive Salary';
  };

  const formatJobType = (type) => {
    if (!type) return 'Full Time';
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="card card-hoverable" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '1.2rem',
              border: '1px solid #c7d2fe',
              flexShrink: 0
            }}
          >
            {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Building size={14} /> {job.companyName}
            </span>
            <Link to={`/jobs/${job.id}`}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px', lineHeight: '1.3' }}>
                {job.title}
              </h3>
            </Link>
          </div>
        </div>

        {job.isRemote && (
          <span className="badge badge-purple" style={{ flexShrink: 0 }}>
            <Globe size={12} /> Remote
          </span>
        )}
      </div>

      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
          marginBottom: '18px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}
      >
        {job.description}
      </p>

      {/* Meta tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        <span className="badge badge-primary">
          <Briefcase size={12} /> {formatJobType(job.jobType)}
        </span>
        <span className="badge badge-neutral">
          <MapPin size={12} /> {job.location}
        </span>
        <span className="badge badge-info">
          {job.category}
        </span>
      </div>

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', color: '#047857', fontSize: '0.925rem' }}>
          <DollarSign size={16} />
          {formatSalary()}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/jobs/${job.id}`} className="btn btn-secondary btn-sm">
            Details
          </Link>
          {onApply && (
            <button onClick={() => onApply(job)} className="btn btn-primary btn-sm">
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
