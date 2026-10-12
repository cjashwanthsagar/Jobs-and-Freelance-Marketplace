import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toUpperCase();

  let badgeClass = 'badge-neutral';
  let label = status;

  switch (normalized) {
    case 'ACTIVE':
    case 'OPEN':
    case 'ACCEPTED':
      badgeClass = 'badge-success';
      label = normalized === 'ACTIVE' ? 'Active' : normalized === 'OPEN' ? 'Open' : 'Accepted';
      break;
    case 'SHORTLISTED':
      badgeClass = 'badge-primary';
      label = 'Shortlisted';
      break;
    case 'REVIEWING':
    case 'IN_PROGRESS':
      badgeClass = 'badge-purple';
      label = normalized === 'REVIEWING' ? 'Under Review' : 'In Progress';
      break;
    case 'PENDING':
      badgeClass = 'badge-warning';
      label = 'Pending';
      break;
    case 'REJECTED':
    case 'SUSPENDED':
    case 'CANCELLED':
      badgeClass = 'badge-danger';
      label = normalized === 'REJECTED' ? 'Rejected' : normalized === 'SUSPENDED' ? 'Suspended' : 'Cancelled';
      break;
    case 'CLOSED':
    case 'COMPLETED':
      badgeClass = 'badge-neutral';
      label = normalized === 'CLOSED' ? 'Closed' : 'Completed';
      break;
    default:
      badgeClass = 'badge-neutral';
  }

  return <span className={`badge ${badgeClass}`}>{label}</span>;
};

export default StatusBadge;
