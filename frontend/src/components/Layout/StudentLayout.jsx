import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './StudentLayout.css';

function StudentLayout() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Student Portal</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/student-dashboard" className={`nav-item ${path === '/student-dashboard' ? 'active' : ''}`}>📊 Dashboard</Link>
          <Link to="/student/jobs" className={`nav-item ${path === '/student/jobs' ? 'active' : ''}`}>🔍 Browse Jobs</Link>
          <Link to="/student/applications" className={`nav-item ${path === '/student/applications' ? 'active' : ''}`}>📝 Applications</Link>
          <Link to="/student/profile" className={`nav-item ${path === '/student/profile' ? 'active' : ''}`}>👤 Profile</Link>
          <Link to="/student/stats" className={`nav-item ${path === '/student/stats' ? 'active' : ''}`}>📈 Statistics</Link>
        </nav>
      </aside>
      <main className="dashboard-main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;
