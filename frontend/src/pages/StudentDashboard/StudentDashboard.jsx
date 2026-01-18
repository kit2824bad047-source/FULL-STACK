import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './StudentDashboard.css';

function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    status: 'Loading...',
    applications: 0,
    interviews: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/student/dashboard-stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Student Portal</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/student-dashboard" className="nav-item active">📊 Dashboard</Link>
          <Link to="/student/jobs" className="nav-item">🔍 Browse Jobs</Link>
          <Link to="/student/applications" className="nav-item">📝 Applications</Link>
          <Link to="/student/profile" className="nav-item">👤 Profile</Link>
          <Link to="/student/stats" className="nav-item">📈 Statistics</Link>
        </nav>
      </aside>

      <main className="dashboard-main-content">
        <div className="dashboard-background">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="welcome-text">
              <h1>Welcome back, {user?.name || 'Student'}! 👋</h1>
              <p>Ready to take the next step in your career?</p>
            </div>
            <div className="date-display">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div className="dashboard-stats-overview">
            <div className="stat-card fade-in-up delay-1" data-status={stats.status}>
              <div className="stat-icon-wrapper">
                <span className="stat-icon">🚀</span>
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.status}</div>
                <div className="stat-label">Current Status</div>
              </div>
            </div>
            <div className="stat-card fade-in-up delay-2">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">📝</span>
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.applications}</div>
                <div className="stat-label">Applications</div>
              </div>
            </div>
            <div className="stat-card fade-in-up delay-3">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">🤝</span>
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.interviews}</div>
                <div className="stat-label">Interviews</div>
              </div>
            </div>
          </div>

          <h2 className="dashboard-section-title fade-in-up delay-3">Quick Actions</h2>

          <div className="dashboard-grid">
            <Link to="/student/jobs" className="dashboard-card fade-in-up delay-4">
              <div className="card-icon-wrapper job-icon">
                <span className="card-icon">🎯</span>
              </div>
              <div className="card-info">
                <h3>Browse Jobs</h3>
                <p>Explore thousands of job opportunities that match your skills</p>
                <span className="card-link">Find Jobs <span className="arrow">→</span></span>
              </div>
            </Link>

            <Link to="/student/profile" className="dashboard-card fade-in-up delay-5">
              <div className="card-icon-wrapper profile-icon">
                <span className="card-icon">👤</span>
              </div>
              <div className="card-info">
                <h3>My Profile</h3>
                <p>Update your profile, skills, and resume to stand out</p>
                <span className="card-link">Edit Profile <span className="arrow">→</span></span>
              </div>
            </Link>

            <Link to="/student/applications" className="dashboard-card fade-in-up delay-6">
              <div className="card-icon-wrapper app-icon">
                <span className="card-icon">📋</span>
              </div>
              <div className="card-info">
                <h3>My Applications</h3>
                <p>Track the status of your job applications in real-time</p>
                <span className="card-link">View Status <span className="arrow">→</span></span>
              </div>
            </Link>

            <Link to="/student/stats" className="dashboard-card fade-in-up delay-7">
              <div className="card-icon-wrapper stats-icon">
                <span className="card-icon">📊</span>
              </div>
              <div className="card-info">
                <h3>Statistics</h3>
                <p>View your application statistics and performance insights</p>
                <span className="card-link">View Insights <span className="arrow">→</span></span>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
