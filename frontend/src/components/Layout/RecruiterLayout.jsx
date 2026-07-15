import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './RecruiterLayout.css';

function RecruiterLayout() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="recruiter-dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Recruiter Pro</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/recruiter-dashboard" className={`nav-item ${path === '/recruiter-dashboard' ? 'active' : ''}`}>📊 Dashboard</Link>
          <Link to="/recruiter/jobs" className={`nav-item ${path === '/recruiter/jobs' ? 'active' : ''}`}>📝 Post Jobs</Link>
          <Link to="/recruiter/applicants" className={`nav-item ${path === '/recruiter/applicants' ? 'active' : ''}`}>👥 Applicants</Link>
          <Link to="/recruiter/profile" className={`nav-item ${path === '/recruiter/profile' ? 'active' : ''}`}>🏢 Company</Link>
          <Link to="/recruiter/stats" className={`nav-item ${path === '/recruiter/stats' ? 'active' : ''}`}>📈 Analytics</Link>
        </nav>
      </aside>
      <main className="dashboard-main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default RecruiterLayout;
