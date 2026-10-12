import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobAPI, projectAPI } from '../services/api';
import JobCard from '../components/JobCard';
import ProjectCard from '../components/ProjectCard';
import ApplyModal from '../components/ApplyModal';
import ProposalModal from '../components/ProposalModal';
import {
  Search,
  Briefcase,
  Layers,
  Code,
  Palette,
  Megaphone,
  Server,
  FileCheck,
  TrendingUp,
  Users,
  ArrowRight
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Software Development', icon: Code, count: '1,240+ opportunities' },
  { name: 'UI/UX & Design', icon: Palette, count: '680+ opportunities' },
  { name: 'Marketing & Sales', icon: Megaphone, count: '450+ opportunities' },
  { name: 'DevOps & Cloud', icon: Server, count: '320+ opportunities' },
  { name: 'Writing & Translation', icon: FileCheck, count: '290+ opportunities' },
  { name: 'Data & Analytics', icon: TrendingUp, count: '510+ opportunities' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('jobs'); // 'jobs' or 'projects'
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, projectsRes] = await Promise.all([
          jobAPI.getJobs({ size: 6 }),
          projectAPI.getProjects({ size: 6 }),
        ]);
        if (jobsRes.data?.data?.content) {
          setFeaturedJobs(jobsRes.data.data.content);
        }
        if (projectsRes.data?.data?.content) {
          setFeaturedProjects(projectsRes.data.data.content);
        }
      } catch (err) {
        console.error('Failed to load marketplace featured listings', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchType === 'jobs') {
      navigate(`/jobs?keyword=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/projects?keyword=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleBidClick = (project) => {
    setSelectedProject(project);
    setIsProposalModalOpen(true);
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'var(--hero-gradient)',
          padding: '80px 0 90px',
          borderBottom: '1px solid var(--border-color)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ maxWidth: '880px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              background: '#ffffff',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid #e0e7ff',
              color: 'var(--primary)',
              fontWeight: '700',
              fontSize: '0.85rem',
              marginBottom: '24px'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
            The Unified Talent & Career Platform
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: '800',
              letterSpacing: '-1.5px',
              lineHeight: '1.15',
              marginBottom: '20px'
            }}
          >
            Discover Great Work or <span className="gradient-text">Hire Top Talent</span> Fast
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              marginBottom: '40px',
              maxWidth: '680px',
              marginRight: 'auto',
              marginLeft: 'auto'
            }}
          >
            Join thousands of professionals finding full-time positions, bidding on high-paying freelance gigs, and building modern products.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="card"
            style={{
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: 'var(--shadow-lg)',
              maxWidth: '720px',
              margin: '0 auto 32px',
              border: '1px solid #c7d2fe',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            <div
              style={{
                display: 'flex',
                background: '#f1f5f9',
                borderRadius: 'var(--radius-sm)',
                padding: '3px'
              }}
            >
              <button
                type="button"
                onClick={() => setSearchType('jobs')}
                style={{
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  backgroundColor: searchType === 'jobs' ? '#ffffff' : 'transparent',
                  color: searchType === 'jobs' ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: searchType === 'jobs' ? 'var(--shadow-sm)' : 'none',
                  transition: 'var(--transition)'
                }}
              >
                Jobs
              </button>
              <button
                type="button"
                onClick={() => setSearchType('projects')}
                style={{
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  backgroundColor: searchType === 'projects' ? '#ffffff' : 'transparent',
                  color: searchType === 'projects' ? 'var(--secondary)' : 'var(--text-muted)',
                  boxShadow: searchType === 'projects' ? 'var(--shadow-sm)' : 'none',
                  transition: 'var(--transition)'
                }}
              >
                Freelance
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '220px', padding: '0 12px' }}>
              <Search size={20} color="var(--text-muted)" style={{ marginRight: '10px' }} />
              <input
                type="text"
                placeholder={
                  searchType === 'jobs'
                    ? 'Search by job title, company, or keywords...'
                    : 'Search freelance projects, tech stacks, or gigs...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                  backgroundColor: 'transparent'
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              Search Now
            </button>
          </form>

          {/* Quick tags */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Popular Searches:</span>
            {['React', 'Spring Boot', 'Full Stack', 'Remote', 'UI/UX', 'Node.js'].map((term) => (
              <button
                key={term}
                onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(term)}`)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section style={{ backgroundColor: '#ffffff', padding: '40px 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--primary)' }}>2,500+</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Active Jobs Listed</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--secondary)' }}>8,400+</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Verified Freelancers</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--success)' }}>1,100+</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Hiring Employers</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--info)' }}>$4.2M+</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Paid to Freelancers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' }}>
            <div>
              <h2 style={{ fontSize: '1.9rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Browse by Category
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '4px' }}>
                Find work across specialized industries and technical skill sets
              </p>
            </div>
            <Link to="/jobs" style={{ color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Explore All <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {CATEGORIES.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                  className="card card-hoverable"
                  style={{ padding: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}
                >
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <IconComp size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {cat.name}
                    </h3>
                    <p style={{ fontSize: '0.813rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {cat.count}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section style={{ padding: '40px 0 70px', backgroundColor: '#ffffff', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' }}>
            <div>
              <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Full-Time & Remote Positions
              </div>
              <h2 style={{ fontSize: '1.9rem', fontWeight: '800', letterSpacing: '-0.5px', marginTop: '4px' }}>
                Featured Job Opportunities
              </h2>
            </div>
            <Link to="/jobs" className="btn btn-secondary">
              View All Jobs <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner" />
              <p style={{ marginTop: '12px' }}>Loading latest opportunities...</p>
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No active jobs currently available. Check back soon or post the first job!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} onApply={handleApplyClick} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Freelance Projects Section */}
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' }}>
            <div>
              <div style={{ color: 'var(--secondary)', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Contract & Hourly Projects
              </div>
              <h2 style={{ fontSize: '1.9rem', fontWeight: '800', letterSpacing: '-0.5px', marginTop: '4px' }}>
                Latest Freelance Projects
              </h2>
            </div>
            <Link to="/projects" className="btn btn-secondary">
              View All Gigs <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner" />
              <p style={{ marginTop: '12px' }}>Loading freelance projects...</p>
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No active freelance projects listed. Post your project to attract top talent!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} onBid={handleBidClick} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 0', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 54px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              How WorkMarket Works
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '8px' }}>
              A seamless, transparent ecosystem for professionals and hiring companies alike.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}
              >
                <Briefcase size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '12px' }}>
                1. For Job Seekers
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Search curated career listings, apply with tailored pitches, track application statuses in real-time, and get hired by world-class teams.
              </p>
            </div>

            <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'var(--secondary-light)',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}
              >
                <Layers size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '12px' }}>
                2. For Freelancers
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Build a rich verified portfolio, bid on fixed-price or hourly projects, submit transparent timelines, and receive milestone approvals.
              </p>
            </div>

            <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'var(--success-light)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}
              >
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '12px' }}>
                3. For Employers
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Publish job openings and freelance milestones, review candidate resumes and bids side-by-side, shortlist talent, and make offers quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ApplyModal
        job={selectedJob}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() => alert('Application successfully submitted to ' + selectedJob?.companyName)}
      />

      <ProposalModal
        project={selectedProject}
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        onSuccess={() => alert('Proposal successfully submitted for ' + selectedProject?.title)}
      />
    </div>
  );
};

export default HomePage;
