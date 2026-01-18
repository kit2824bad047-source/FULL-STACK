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
    // console.log('Filtering jobs. Search:', searchTerm, 'Type:', filterType);
    return jobs.filter(job => {
      if (!searchTerm) {
        return filterType === 'all' || job.jobType === filterType;
      }

      const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);

      const title = job.title?.toLowerCase() || '';
      const company = job.company?.companyName?.toLowerCase() || '';
      const description = job.description?.toLowerCase() || '';

      // Combine all searchable text
      const searchableText = `${title} ${company} ${description}`;

      // Check if EVERY search word is present in the job's text
      const matchesSearch = searchTerms.every(term => searchableText.includes(term));

      const matchesType = filterType === 'all' || job.jobType === filterType;

      return matchesSearch && matchesType;
    });
  }, [jobs, searchTerm, filterType]);

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
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Student Portal</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/student-dashboard" className="nav-item">📊 Dashboard</Link>
          <Link to="/student/jobs" className="nav-item active">🔍 Browse Jobs</Link>
          <Link to="/student/applications" className="nav-item">📝 Applications</Link>
          <Link to="/student/profile" className="nav-item">👤 Profile</Link>
          <Link to="/student/stats" className="nav-item">📈 Statistics</Link>
        </nav>
      </aside>

      <main className="dashboard-main-content">
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
              placeholder="Search by Job Role, Company Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
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
                  <button onClick={() => { setSearchTerm(''); setFilterType('all'); }} style={{ marginTop: '1rem', color: '#3498db', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
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
      </main>
    </div>
  );
}

export default JobBrowser;
