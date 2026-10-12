import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  'Software Development',
  'UI/UX & Design',
  'Marketing & Sales',
  'DevOps & Cloud',
  'Writing & Translation',
  'Data & Analytics',
  'Product Management'
];

const PostJobPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState(user?.fullName || '');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [jobType, setJobType] = useState('FULL_TIME');
  const [location, setLocation] = useState('San Francisco, CA');
  const [isRemote, setIsRemote] = useState(false);
  const [salaryMin, setSalaryMin] = useState('90000');
  const [salaryMax, setSalaryMax] = useState('130000');
  const [experienceLevel, setExperienceLevel] = useState('Mid Level');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [responsibilities, setResponsibilities] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !companyName.trim() || !description.trim()) {
      setError('Please fill in job title, company name, and job description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await jobAPI.createJob({
        title: title.trim(),
        companyName: companyName.trim(),
        category,
        jobType,
        location: location.trim(),
        isRemote,
        salaryMin: salaryMin ? Number(salaryMin) : null,
        salaryMax: salaryMax ? Number(salaryMax) : null,
        experienceLevel,
        description: description.trim(),
        requirements: requirements.trim(),
        responsibilities: responsibilities.trim(),
      });

      const newJob = res.data?.data;
      navigate(`/jobs/${newJob.id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to post job. Please check form entries.';
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
            <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
              Employer Portal
            </span>
            <h1 style={{ fontSize: '1.9rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Post a New Job Opportunity
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
              Reach thousands of skilled developers, designers, and domain experts
            </p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Senior Backend Java Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hiring Company Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. TechCorp Solutions"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
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
                <label className="form-label">Job Type *</label>
                <select
                  className="form-select"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="REMOTE">Remote</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select
                  className="form-select"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior Level">Senior Level</option>
                  <option value="Lead / Principal">Lead / Principal</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. San Francisco, CA or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: '28px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  <input
                    type="checkbox"
                    checked={isRemote}
                    onChange={(e) => setIsRemote(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                  />
                  Allow 100% Remote Candidates
                </label>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Annual Salary Range Min ($)</label>
                <input
                  type="number"
                  step="1000"
                  className="form-input"
                  placeholder="e.g. 80000"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Annual Salary Range Max ($)</label>
                <input
                  type="number"
                  step="1000"
                  className="form-input"
                  placeholder="e.g. 120000"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Job Description *</label>
              <textarea
                className="form-textarea"
                rows={5}
                placeholder="Describe the role mission, team culture, and daily impact..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Key Responsibilities</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Bullet points or key tasks the candidate will lead..."
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Requirements & Skills</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Required tech stack, years of experience, and degrees..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
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
                    Publishing Job...
                  </>
                ) : (
                  <>
                    Publish Job Now <ArrowRight size={16} />
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

export default PostJobPage;
