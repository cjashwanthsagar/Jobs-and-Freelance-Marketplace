import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import {
  MapPin,
  Phone,
  Globe,
  Github,
  Linkedin,
  DollarSign,
  GraduationCap,
  Briefcase,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Save
} from 'lucide-react';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setSkills(user.skills || []);

      if (user.profile) {
        setHeadline(user.profile.headline || '');
        setBio(user.profile.bio || '');
        setLocation(user.profile.location || '');
        setPhone(user.profile.phone || '');
        setWebsite(user.profile.website || '');
        setGithub(user.profile.github || '');
        setLinkedin(user.profile.linkedin || '');
        setHourlyRate(user.profile.hourlyRate ? String(user.profile.hourlyRate) : '');
        setExperienceYears(user.profile.experienceYears ? String(user.profile.experienceYears) : '');
        setEducation(user.profile.education || '');
      }
    }
  }, [user]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await userAPI.updateMyProfile({
        fullName: fullName.trim(),
        headline: headline.trim(),
        bio: bio.trim(),
        location: location.trim(),
        phone: phone.trim(),
        website: website.trim(),
        github: github.trim(),
        linkedin: linkedin.trim(),
        hourlyRate: hourlyRate ? Number(hourlyRate) : 0,
        experienceYears: experienceYears ? Number(experienceYears) : 0,
        education: education.trim(),
        skills,
      });

      await refreshUser();
      setMessage('Profile and professional details successfully updated!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div className="card" style={{ padding: '40px', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: '800',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Profile & Portfolio
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Signed in as <strong>{user?.email}</strong> • Role: <span style={{ textTransform: 'capitalize' }}>{user?.role ? user.role.replace('_', ' ').toLowerCase() : ''}</span>
              </p>
            </div>
          </div>

          {message && (
            <div className="alert alert-success">
              <CheckCircle size={18} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="e.g. Austin, TX"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Headline</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Senior Full-Stack Engineer | React & Java Spring Boot"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">About / Bio</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Share your expertise, achievements, and what sets you apart..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* Rates and Experience */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Hourly Rate ($/hr)</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    step="1"
                    className="form-input"
                    style={{ paddingLeft: '34px' }}
                    placeholder="65"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    style={{ paddingLeft: '34px' }}
                    placeholder="5"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '34px' }}
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Education / Degrees</label>
              <div style={{ position: 'relative' }}>
                <GraduationCap size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  placeholder="e.g. B.S. in Computer Science, University of California"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                />
              </div>
            </div>

            {/* Links */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Personal Website</label>
                <div style={{ position: 'relative' }}>
                  <Globe size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                  <input
                    type="url"
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="https://mysite.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <div style={{ position: 'relative' }}>
                  <Github size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                  <input
                    type="url"
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="https://github.com/username"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <div style={{ position: 'relative' }}>
                  <Linkedin size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                  <input
                    type="url"
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="https://linkedin.com/in/username"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Skills Chip Editor */}
            <div className="form-group" style={{ marginTop: '12px' }}>
              <label className="form-label">Skills & Technologies</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Type a skill (e.g. React.js, Spring Boot, MySQL) and click Add"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(e);
                    }
                  }}
                />
                <button type="button" onClick={handleAddSkill} className="btn btn-secondary" style={{ flexShrink: 0 }}>
                  <Plus size={16} /> Add Skill
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      fontWeight: '600',
                      fontSize: '0.85rem'
                    }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: 0 }}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={18} /> Save Profile Changes
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

export default ProfilePage;
