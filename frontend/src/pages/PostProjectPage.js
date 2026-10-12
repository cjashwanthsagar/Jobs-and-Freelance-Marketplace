import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../services/api';
import { AlertCircle, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  'Web & Mobile',
  'Backend Development',
  'UI/UX & Design',
  'DevOps & Cloud',
  'Data Science',
  'Writing & Content',
  'Marketing Strategy'
];

const PostProjectPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [projectType, setProjectType] = useState('FIXED');
  const [budgetMin, setBudgetMin] = useState('1500');
  const [budgetMax, setBudgetMax] = useState('3000');
  const [deadline, setDeadline] = useState('');
  const [duration, setDuration] = useState('2-3 weeks');
  const [skillsRequired, setSkillsRequired] = useState('React, TypeScript, CSS');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError('Please provide project title and description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await projectAPI.createProject({
        title: title.trim(),
        category,
        projectType,
        budgetMin: budgetMin ? Number(budgetMin) : null,
        budgetMax: budgetMax ? Number(budgetMax) : null,
        deadline: deadline || null,
        duration: duration.trim(),
        skillsRequired: skillsRequired.trim(),
        description: description.trim(),
      });

      const newProject = res.data?.data;
      navigate(`/projects/${newProject.id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to publish project. Please check fields.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="card" style={{ padding: '40px', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ marginBottom: '28px' }}>
            <span className="badge badge-purple" style={{ marginBottom: '8px' }}>
              Client Portal
            </span>
            <h1 style={{ fontSize: '1.9rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Publish a Freelance Project
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
              Receive proposals from verified freelancers and scale your team on demand
            </p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Project Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Next.js SaaS Landing Page & Stripe Integration"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pricing Structure *</label>
                <select
                  className="form-select"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                >
                  <option value="FIXED">Fixed Price Project</option>
                  <option value="HOURLY">Hourly Rate ($/hr)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">
                  {projectType === 'HOURLY' ? 'Min Hourly Rate ($/hr)' : 'Min Budget ($)'}
                </label>
                <input
                  type="number"
                  step="1"
                  className="form-input"
                  placeholder="e.g. 50"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {projectType === 'HOURLY' ? 'Max Hourly Rate ($/hr)' : 'Max Budget ($)'}
                </label>
                <input
                  type="number"
                  step="1"
                  className="form-input"
                  placeholder="e.g. 100"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Estimated Duration</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 1 month or 2-3 weeks"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Completion Date (Optional)</label>
                <input
                  type="date"
                  className="form-input"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Required Skills (Comma separated) *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. React.js, Tailwind CSS, REST APIs"
                value={skillsRequired}
                onChange={(e) => setSkillsRequired(e.target.value)}
                required
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                Freelancers will be filtered and recommended based on matching skills.
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Project Scope & Specifications *</label>
              <textarea
                className="form-textarea"
                rows={6}
                placeholder="Provide detailed instructions, technical stack requirements, deliverables, and acceptance criteria..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '30px' }}>
              <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                    Publishing Project...
                  </>
                ) : (
                  <>
                    Publish Project Now <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostProjectPage;
