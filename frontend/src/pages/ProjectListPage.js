import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { projectAPI } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import ProposalModal from '../components/ProposalModal';
import { Search, RotateCcw, Layers, DollarSign } from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Web & Mobile',
  'Backend Development',
  'UI/UX & Design',
  'DevOps & Cloud',
  'Data Science',
  'Writing & Content'
];

const PROJECT_TYPES = [
  { label: 'All Project Types', value: '' },
  { label: 'Fixed Price', value: 'FIXED' },
  { label: 'Hourly Rate', value: 'HOURLY' },
];

const ProjectListPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [keyword, setKeyword] = useState(queryParams.get('keyword') || '');
  const [category, setCategory] = useState(queryParams.get('category') || 'All Categories');
  const [projectType, setProjectType] = useState(queryParams.get('projectType') || '');
  const [minBudget, setMinBudget] = useState('');

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProjects, setTotalProjects] = useState(0);

  // Proposal modal state
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {
        size: 30,
        keyword: keyword.trim() || undefined,
        category: category !== 'All Categories' ? category : undefined,
        projectType: projectType || undefined,
        minBudget: minBudget ? Number(minBudget) : undefined,
      };

      const res = await projectAPI.getProjects(params);
      if (res.data?.data) {
        setProjects(res.data.data.content || []);
        setTotalProjects(res.data.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to load freelance projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [category, projectType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setCategory('All Categories');
    setProjectType('');
    setMinBudget('');
    setTimeout(fetchProjects, 50);
  };

  const handleBidClick = (project) => {
    setSelectedProject(project);
    setIsProposalModalOpen(true);
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Freelance Projects & Gigs
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '4px' }}>
            Find freelance projects, submit bids, and collaborate with innovative startups and enterprise clients
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
          <form onSubmit={handleSearchSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Keyword or Tech Stack</label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="e.g. React, Docker, API..."
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
                <label className="form-label">Pricing Type</label>
                <select
                  className="form-select"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                >
                  {PROJECT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Min Budget ($)</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="e.g. 500"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={handleResetFilters} className="btn btn-secondary btn-sm">
                <RotateCcw size={14} /> Reset
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {/* Results Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
            Showing {totalProjects} {totalProjects === 1 ? 'Project' : 'Projects'}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="loading-container" style={{ minHeight: '300px' }}>
            <div className="spinner" style={{ width: '36px', height: '36px' }} />
            <p style={{ marginTop: '16px' }}>Searching freelance projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Layers size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>No Projects Found</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '6px', maxWidth: '400px', margin: '6px auto 20px' }}>
              No freelance gigs currently match your criteria. Try adjusting your search query or reset filters.
            </p>
            <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onBid={handleBidClick} />
            ))}
          </div>
        )}

        {/* Proposal Modal */}
        <ProposalModal
          project={selectedProject}
          isOpen={isProposalModalOpen}
          onClose={() => setIsProposalModalOpen(false)}
          onSuccess={() => fetchProjects()}
        />
      </div>
    </div>
  );
};

export default ProjectListPage;
