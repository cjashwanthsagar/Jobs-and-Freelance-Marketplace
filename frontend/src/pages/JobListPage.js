import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { jobAPI } from '../services/api';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';
import { Search, MapPin, RotateCcw, Briefcase } from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Software Development',
  'UI/UX & Design',
  'Marketing & Sales',
  'DevOps & Cloud',
  'Writing & Translation',
  'Data & Analytics'
];

const JOB_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'Full Time', value: 'FULL_TIME' },
  { label: 'Part Time', value: 'PART_TIME' },
  { label: 'Contract', value: 'CONTRACT' },
  { label: 'Remote', value: 'REMOTE' },
  { label: 'Internship', value: 'INTERNSHIP' },
];

const JobListPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [keyword, setKeyword] = useState(queryParams.get('keyword') || '');
  const [category, setCategory] = useState(queryParams.get('category') || 'All Categories');
  const [jobType, setJobType] = useState(queryParams.get('jobType') || '');
  const [loc, setLoc] = useState(queryParams.get('location') || '');
  const [isRemote, setIsRemote] = useState(queryParams.get('isRemote') === 'true');
  const [minSalary, setMinSalary] = useState('');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);

  // Apply modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        size: 30,
        keyword: keyword.trim() || undefined,
        category: category !== 'All Categories' ? category : undefined,
        jobType: jobType || undefined,
        location: loc.trim() || undefined,
        isRemote: isRemote ? true : undefined,
        minSalary: minSalary ? Number(minSalary) : undefined,
      };

      const res = await jobAPI.getJobs(params);
      if (res.data?.data) {
        setJobs(res.data.data.content || []);
        setTotalJobs(res.data.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [category, jobType, isRemote]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setCategory('All Categories');
    setJobType('');
    setLoc('');
    setIsRemote(false);
    setMinSalary('');
    setTimeout(fetchJobs, 50);
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Explore Available Jobs
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '4px' }}>
            Discover and apply for curated full-time and remote roles across leading tech companies
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
          <form onSubmit={handleSearchSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Keyword or Title</label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="e.g. React, Engineer..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Category</label>
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

              <div>
                <label className="form-label">Job Type</label>
                <select
                  className="form-select"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  {JOB_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="e.g. San Francisco, NY"
                    value={loc}
                    onChange={(e) => setLoc(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
                  <input
                    type="checkbox"
                    checked={isRemote}
                    onChange={(e) => setIsRemote(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                  />
                  Remote Only
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Min Salary:</span>
                  <input
                    type="number"
                    step="5000"
                    placeholder="$ e.g. 80000"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    className="form-input"
                    style={{ width: '130px', padding: '6px 10px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={handleResetFilters} className="btn btn-secondary btn-sm">
                  <RotateCcw size={14} /> Reset
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Apply Filters
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
            Showing {totalJobs} {totalJobs === 1 ? 'Job' : 'Jobs'}
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="loading-container" style={{ minHeight: '300px' }}>
            <div className="spinner" style={{ width: '36px', height: '36px' }} />
            <p style={{ marginTop: '16px' }}>Searching jobs database...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Briefcase size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>No Jobs Found</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '6px', maxWidth: '400px', margin: '6px auto 20px' }}>
              We couldn't find any job postings matching your current filter criteria. Try loosening your keywords or reset filters.
            </p>
            <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onApply={handleApplyClick} />
            ))}
          </div>
        )}

        {/* Apply Modal */}
        <ApplyModal
          job={selectedJob}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSuccess={() => fetchJobs()}
        />
      </div>
    </div>
  );
};

export default JobListPage;
