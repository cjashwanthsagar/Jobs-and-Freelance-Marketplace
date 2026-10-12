import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { proposalAPI } from '../services/api';
import { X, Send, DollarSign, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const ProposalModal = ({ project, isOpen, onClose, onSuccess }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [bidAmount, setBidAmount] = useState(project?.budgetMin || '');
  const [estimatedDays, setEstimatedDays] = useState(7);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (user?.role === 'EMPLOYER') {
      setError('Employers cannot submit proposals. Please log in as a Freelancer.');
      return;
    }

    if (!bidAmount || Number(bidAmount) <= 0) {
      setError('Please provide a valid bid amount.');
      return;
    }

    if (!estimatedDays || Number(estimatedDays) < 1) {
      setError('Please specify at least 1 estimated delivery day.');
      return;
    }

    if (!coverLetter.trim()) {
      setError('Please write a detailed proposal describing your approach and past work.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await proposalAPI.submitProposal({
        projectId: project.id,
        bidAmount: Number(bidAmount),
        estimatedDays: Number(estimatedDays),
        coverLetter: coverLetter.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setCoverLetter('');
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit proposal. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Submit Proposal</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Project: <strong>{project.title}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>Proposal sent successfully! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                {project.projectType === 'HOURLY' ? 'Hourly Rate ($/hr) *' : 'Your Bid Amount ($) *'}
              </label>
              <div style={{ position: 'relative' }}>
                <DollarSign
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }}
                />
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  className="form-input"
                  style={{ paddingLeft: '34px' }}
                  placeholder="e.g. 500"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Estimated Days *</label>
              <div style={{ position: 'relative' }}>
                <Clock
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }}
                />
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  style={{ paddingLeft: '34px' }}
                  placeholder="e.g. 14"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Proposal Pitch & Timeline *</label>
            <textarea
              className="form-textarea"
              placeholder="Describe your qualifications, similar projects you have built, and the steps you will take to accomplish this project..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
              rows={5}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || success}>
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} /> Submit Proposal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProposalModal;
