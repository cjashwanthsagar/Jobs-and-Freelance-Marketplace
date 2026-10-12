import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { applicationAPI } from '../services/api';
import { X, Send, AlertCircle, CheckCircle } from 'lucide-react';

const ApplyModal = ({ job, isOpen, onClose, onSuccess }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState(user?.profile?.website || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (user?.role === 'EMPLOYER') {
      setError('Employers cannot submit job applications. Please log in as a Job Seeker.');
      return;
    }

    if (!coverLetter.trim()) {
      setError('Please provide a short cover letter explaining why you are a great fit.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await applicationAPI.apply({
        jobId: job.id,
        coverLetter: coverLetter.trim(),
        resumeUrl: resumeUrl.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setCoverLetter('');
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application. Please try again.';
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
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Apply for Job</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {job.title} at <strong>{job.companyName}</strong>
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
            <span>Application submitted successfully! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Cover Letter / Pitch *</label>
            <textarea
              className="form-textarea"
              placeholder="Explain your relevant experience, why you are interested in this position, and how you can add value..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
              rows={5}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Resume / Portfolio Link (Optional)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://yourportfolio.com or https://drive.google.com/your-resume"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>
              Provide a direct link to your online resume, GitHub profile, or portfolio site.
            </small>
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
                  <Send size={16} /> Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;
