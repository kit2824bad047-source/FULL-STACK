import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './RecruiterJobs.css';

import { Link } from 'react-router-dom';

function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    jobType: 'Full-time',
    requiredSkills: '',
    minCGPA: '',
    deadline: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/recruiter/job-postings');
      setJobs(res.data || []);
    } catch (err) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()),
        salary: formData.salary ? parseInt(formData.salary) : null,
        minCGPA: formData.minCGPA ? parseFloat(formData.minCGPA) : null,
      };
      await api.post('/recruiter/create-job', payload);
      toast.success('Job posted successfully!');
      setFormData({
        title: '',
        description: '',
        location: '',
        salary: '',
        jobType: 'Full-time',
        requiredSkills: '',
        minCGPA: '',
        deadline: '',
      });
      setShowForm(false);
      fetchJobs();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create job';
      toast.error(msg);
    }
  };

  const handleStatusChange = async (jobId, studentId, newStatus) => {
    try {
      await api.put('/recruiter/update-status', { jobId, studentId, status: newStatus });
      toast.success('Status updated!');
      fetchJobs();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="recruiter-dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Recruiter Pro</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/recruiter-dashboard" className="nav-item">📊 Dashboard</Link>
          <Link to="/recruiter/jobs" className="nav-item active">📝 Post Jobs</Link>
          <Link to="/recruiter/applicants" className="nav-item">👥 Applicants</Link>
          <Link to="/recruiter/profile" className="nav-item">🏢 Company</Link>
          <Link to="/recruiter/stats" className="nav-item">📈 Analytics</Link>
        </nav>
      </aside>

      <main className="dashboard-main-content">
        <div className="jobs-header">
          <div className="header-title">
            <h1>Manage Job Postings</h1>
            <p>Create and manage your job listings.</p>
          </div>
          <button
            className="create-job-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Cancel' : '+ Post New Job'}
          </button>
        </div>

        {showForm && (
          <div className="job-form-container">
            <form onSubmit={handleSubmit} className="job-form">
              <h2>Create New Job Posting</h2>

              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Job description and responsibilities"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., New York, NY"
                  />
                </div>

                <div className="form-group">
                  <label>Salary (Annual)</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g., 80000"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Job Type *</label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Minimum CGPA</label>
                  <input
                    type="number"
                    name="minCGPA"
                    value={formData.minCGPA}
                    onChange={handleChange}
                    step="0.1"
                    placeholder="e.g., 3.0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Required Skills</label>
                  <input
                    type="text"
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                    placeholder="e.g., React, Node.js, MongoDB (comma separated)"
                  />
                </div>

                <div className="form-group">
                  <label>Application Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn">Post Job</button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading jobs...</div>
        ) : (
          <>
            <div className="jobs-count">
              {jobs.length} job{jobs.length !== 1 ? 's' : ''} posted
            </div>
            <div className="jobs-container">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div key={job._id} className="job-management-card">
                    <div className="job-info">
                      <h3>{job.title} <span className="company-badge">@{job.company?.companyName}</span></h3>
                      <div className="job-meta">
                        <span>📍 {job.location || 'Remote'}</span>
                        <span>💰 ${job.salary ? job.salary.toLocaleString() : 'N/A'}</span>
                        <span>💼 {job.jobType}</span>
                      </div>
                      <p className="job-desc">{job.description}</p>
                    </div>

                    <div className="applicants-section">
                      <h4>Applicants ({job.applicants?.length || 0})</h4>
                      {job.applicants && job.applicants.length > 0 ? (
                        <div className="applicants-list">
                          {job.applicants.map((applicant, idx) => (
                            <div key={idx} className="applicant-item">
                              <div className="applicant-info">
                                <span className="applicant-name">
                                  {applicant.student?.name || 'Unnamed'}
                                </span>
                                <span className="applicant-status" style={{
                                  backgroundColor:
                                    applicant.status === 'Selected' ? '#28a745' :
                                      applicant.status === 'Shortlisted' ? '#ffc107' :
                                        applicant.status === 'Rejected' ? '#dc3545' :
                                          '#6c757d'
                                }}>
                                  {applicant.status}
                                </span>
                              </div>
                              <div className="status-buttons">
                                <button
                                  onClick={() => handleStatusChange(job._id, applicant.student?._id, 'Shortlisted')}
                                  className="btn-small btn-shortlist"
                                >
                                  Shortlist
                                </button>
                                <button
                                  onClick={() => handleStatusChange(job._id, applicant.student?._id, 'Selected')}
                                  className="btn-small btn-select"
                                >
                                  Select
                                </button>
                                <button
                                  onClick={() => handleStatusChange(job._id, applicant.student?._id, 'Rejected')}
                                  className="btn-small btn-reject"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="no-applicants">No applicants yet</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-jobs">
                  <p>No jobs posted yet. Start by creating your first job posting!</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default RecruiterJobs;
