import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import ApplicationForm from '../../components/ApplicationForm/ApplicationForm';
import './JobBrowser.css';

import { Link } from 'react-router-dom';

function JobBrowser() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [cgpaFilter, setCgpaFilter] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/student/browse-jobs');
      setJobs(res.data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      toast.error('Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const normalizedSearch = searchTerm.toLowerCase().trim();
      const normalizedLocation = locationFilter.toLowerCase().trim();
      const normalizedSkill = skillFilter.toLowerCase().trim();
      const minCgpa = Number(cgpaFilter);

      const title = job.title?.toLowerCase() || '';
      const company = job.company?.companyName?.toLowerCase() || '';
      const description = job.description?.toLowerCase() || '';
      const location = job.location?.toLowerCase() || '';
      const requiredSkills = Array.isArray(job.requiredSkills)
        ? job.requiredSkills.join(' ').toLowerCase()
        : (job.requiredSkills || '').toString().toLowerCase();

      const searchableText = `${title} ${company} ${description} ${requiredSkills}`;
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesLocation = !normalizedLocation || location.includes(normalizedLocation);
      const matchesSkill = !normalizedSkill || requiredSkills.includes(normalizedSkill);
      const matchesType = filterType === 'all' || job.jobType === filterType;
      const matchesCgpa = Number.isNaN(minCgpa) || !job.minCGPA || Number(job.minCGPA) <= minCgpa;

      return matchesSearch && matchesLocation && matchesSkill && matchesType && matchesCgpa;
    });
  }, [jobs, searchTerm, locationFilter, skillFilter, cgpaFilter, filterType]);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      await api.post('/student/apply', {
        jobId: selectedJob._id,
        ...formData
      });
      toast.success('Application submitted successfully!');
      setIsModalOpen(false);
      fetchJobs();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to apply';
      toast.error(msg);
    }
  };

  return (
    <>
      <div className="job-browser-header">
          <div className="header-title">
            <h1>Browse Jobs</h1>
            <p>Find your next career opportunity</p>
          </div>
        </div>

        <div className="job-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by role, company, or skill"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-grid">
            <div className="filter-box">
              <input
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-box">
              <input
                type="text"
                placeholder="Skill (e.g. React)"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-box">
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="Max CGPA"
                value={cgpaFilter}
                onChange={(e) => setCgpaFilter(e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-box">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Finding the best jobs for you...</p>
          </div>
        ) : (
          <>
            <div className="job-count">
              Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
            </div>

            <div className="job-list">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => {
                  const isNew = job.createdAt && (new Date() - new Date(job.createdAt)) < (48 * 60 * 60 * 1000);
                  return (
                    <div key={job._id} className="job-card">
                      <div className="job-card-header">
                        <div className="card-top-badges">
                          <span className="job-type-badge">{job.jobType}</span>
                          {isNew && <span className="new-badge">New</span>}
                        </div>
                        <h3>{job.title}</h3>
                        <p className="company">
                          {job.company?.companyName || 'Unknown Company'}
                          {job.company?.companyWebsite && (
                            <a href={job.company.companyWebsite} target="_blank" rel="noopener noreferrer" className="company-link">
                              🔗
                            </a>
                          )}
                        </p>
                      </div>

                      <p className="job-description">{job.description}</p>

                      <div className="job-details">
                        <div className="detail-pill">
                          <span>📍</span> {job.location || 'Remote'}
                        </div>
                        <div className="detail-pill">
                          <span>💰</span> ${job.salary || 'Competitive'}
                        </div>
                        <div className="detail-pill">
                          <span>📈</span> Min CGPA: {job.minCGPA || 'N/A'}
                        </div>
                      </div>

                      <div className="job-footer">
                        <span className="deadline">
                          Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open'}
                        </span>
                        <button
                          className="apply-btn"
                          onClick={() => handleApplyClick(job)}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-jobs">
                  <p>No jobs found matching "{searchTerm}"</p>
                  <button onClick={() => { setSearchTerm(''); setLocationFilter(''); setSkillFilter(''); setCgpaFilter(''); setFilterType('all'); }} style={{ marginTop: '1rem', color: '#3498db', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {selectedJob && (
          <ApplicationForm
            job={selectedJob}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleFormSubmit}
            user={user}
          />
        )}
    </>
  );
}

export default JobBrowser;
