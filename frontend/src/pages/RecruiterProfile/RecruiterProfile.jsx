import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './RecruiterProfile.css';

import { Link } from 'react-router-dom';

function RecruiterProfile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    companyName: '',
    companyWebsite: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/recruiter/profile');
      setProfile({
        name: res.data.name || '',
        email: res.data.email || '',
        companyName: res.data.companyName || '',
        companyWebsite: res.data.companyWebsite || '',
        phone: res.data.phone || '',
      });
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/recruiter/profile', profile);
      toast.success('Profile updated successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
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
          <Link to="/recruiter/jobs" className="nav-item">📝 Post Jobs</Link>
          <Link to="/recruiter/applicants" className="nav-item">👥 Applicants</Link>
          <Link to="/recruiter/profile" className="nav-item active">🏢 Company</Link>
          <Link to="/recruiter/stats" className="nav-item">📈 Analytics</Link>
        </nav>
      </aside>

      <main className="dashboard-main-content">
        <div className="profile-hero">
          <div className="profile-cover">
            <div className="cover-overlay"></div>
          </div>
          <div className="profile-header-content">
            <div className="company-logo-placeholder">
              <span>🏢</span>
            </div>
            <div className="header-text">
              <h1>{profile.companyName || 'Company Profile'}</h1>
              <p>Manage your company's brand and presence</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading profile...</div>
        ) : (
          <div className="profile-container">
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Contact Person Name *</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={profile.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Your company name"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Company phone"
                />
              </div>

              <div className="form-group">
                <label>Company Website</label>
                <input
                  type="url"
                  name="companyWebsite"
                  value={profile.companyWebsite}
                  onChange={handleChange}
                  placeholder="https://www.example.com"
                />
              </div>

              <button type="submit" className="submit-btn">Save Changes</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default RecruiterProfile;
