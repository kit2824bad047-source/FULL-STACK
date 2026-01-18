import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RecruiterDashboard.css';
import api from '../../services/api';
import { toast } from 'react-toastify';

function RecruiterDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    activeJobs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/recruiter/job-postings');
        const jobs = res.data;

        let applicantCount = 0;
        jobs.forEach(job => {
          applicantCount += (job.applicants?.length || 0);
        });

        setStats({
          totalJobs: jobs.length,
          totalApplicants: applicantCount,
          activeJobs: jobs.filter(j => new Date(j.deadline) > new Date()).length
        });
        setLoading(false);
      } catch (err) {
        toast.error('Failed to fetch dashboard stats');
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="recruiter-dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Recruiter Pro</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/recruiter-dashboard" className="nav-item active">📊 Dashboard</Link>
          <Link to="/recruiter/jobs" className="nav-item">📝 Post Jobs</Link>
          <Link to="/recruiter/applicants" className="nav-item">👥 Applicants</Link>
          <Link to="/recruiter/profile" className="nav-item">🏢 Company</Link>
          <Link to="/recruiter/stats" className="nav-item">📈 Analytics</Link>
        </nav>
      </aside>

      <main className="dashboard-main-content">
        <header className="dashboard-top-bar">
          <div className="welcome-text">
            <h1>Welcome back, Recruiter!</h1>
            <p>Here's what's happening with your recruitment today.</p>
          </div>
          <div className="top-bar-actions">
            <Link to="/recruiter/jobs" className="btn-primary">+ Create New Job</Link>
          </div>
        </header>

        <section className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">📁</div>
            <div className="stat-details">
              <h3>{loading ? '...' : stats.totalJobs}</h3>
              <p>Total Job Postings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👨‍🎓</div>
            <div className="stat-details">
              <h3>{loading ? '...' : stats.totalApplicants}</h3>
              <p>Total Applicants</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-details">
              <h3>{loading ? '...' : stats.activeJobs}</h3>
              <p>Active Postings</p>
            </div>
          </div>
        </section>

        <section className="quick-actions-grid">
          <Link to="/recruiter/jobs" className="action-card">
            <div className="card-content">
              <h3>Management</h3>
              <p>View and edit your current job listings</p>
            </div>
            <div className="card-arrow">→</div>
          </Link>
          <Link to="/recruiter/applicants" className="action-card">
            <div className="card-content">
              <h3>Review Apps</h3>
              <p>Screen and process candidates</p>
            </div>
            <div className="card-arrow">→</div>
          </Link>
        </section>
      </main>
    </div>
  );
}

export default RecruiterDashboard;
