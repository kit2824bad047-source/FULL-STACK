import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalStudents: 0, totalRecruiters: 0, totalJobs: 0 });
  const [students, setStudents] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', companyName: '' });

  useEffect(() => {
    fetchStats();
    if (activeTab === 'students') fetchStudents();
    if (activeTab === 'recruiters') fetchRecruiters();
    if (activeTab === 'jobs') fetchJobs();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    const res = await api.get('/admin/students');
    setStudents(res.data);
    setLoading(false);
  };

  const fetchRecruiters = async () => {
    const res = await api.get('/admin/recruiters');
    setRecruiters(res.data);
    setLoading(false);
  };

  const fetchJobs = async () => {
    const res = await api.get('/admin/jobs');
    setJobs(res.data);
    setLoading(false);
  };

  const handleDeleteUser = async (userId, userType) => {
    if (window.confirm(`Are you sure you want to delete this ${userType}? This cannot be undone.`)) {
      try {
        await api.delete('/admin/delete-user', { data: { userId, userType } });
        toast.success(`${userType} deleted`);
        if (userType === 'student') fetchStudents();
        else fetchRecruiters();
        fetchStats();
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to remove this job posting?')) {
      try {
        await api.delete(`/admin/job/${jobId}`);
        toast.success('Job removed');
        fetchJobs();
        fetchStats();
      } catch (err) {
        toast.error('Failed to delete job');
      }
    }
  };

  const openEditModal = (user, type) => {
    setEditingUser({ ...user, type });
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      companyName: user.companyName || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingUser.type === 'student') {
        await api.put(`/admin/student/${editingUser._id}`, editFormData);
        fetchStudents();
      } else {
        await api.put(`/admin/recruiter/${editingUser._id}`, editFormData);
        fetchRecruiters();
      }
      toast.success('User updated successfully');
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-logo">🛡️ Admin Panel</div>
        <nav className="admin-nav">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>📊 Overview</button>
          <button className={activeTab === 'students' ? 'active' : ''} onClick={() => setActiveTab('students')}>🎓 Students</button>
          <button className={activeTab === 'recruiters' ? 'active' : ''} onClick={() => setActiveTab('recruiters')}>🏢 Recruiters</button>
          <button className={activeTab === 'jobs' ? 'active' : ''} onClick={() => setActiveTab('jobs')}>💼 Jobs</button>
        </nav>
      </div>

      <div className="admin-main">
        <header className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h1>
          <p>Control system data and monitor placement activities</p>
        </header>

        {activeTab === 'overview' && (
          <div className="admin-overview">
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <span className="stat-icon">👨‍🎓</span>
                <div className="stat-info">
                  <h3>{stats.totalStudents}</h3>
                  <p>Total Students</p>
                </div>
              </div>
              <div className="admin-stat-card">
                <span className="stat-icon">🏢</span>
                <div className="stat-info">
                  <h3>{stats.totalRecruiters}</h3>
                  <p>Registered Companies</p>
                </div>
              </div>
              <div className="admin-stat-card">
                <span className="stat-icon">📋</span>
                <div className="stat-info">
                  <h3>{stats.totalJobs}</h3>
                  <p>Active Job Postings</p>
                </div>
              </div>
            </div>

            <div className="admin-welcome-card">
              <h2>System Health 🟢</h2>
              <p>Everything is running smoothly. Use the side tabs to manage users and content.</p>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="admin-actions">
                      <button className="admin-edit-btn" onClick={() => openEditModal(s, 'student')}>Edit</button>
                      <button className="admin-delete-btn" onClick={() => handleDeleteUser(s._id, 'student')}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'recruiters' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recruiters.map(r => (
                  <tr key={r._id}>
                    <td>{r.name}</td>
                    <td><strong>{r.companyName}</strong></td>
                    <td>{r.email}</td>
                    <td className="admin-actions">
                      <button className="admin-edit-btn" onClick={() => openEditModal(r, 'recruiter')}>Edit</button>
                      <button className="admin-delete-btn" onClick={() => handleDeleteUser(r._id, 'recruiter')}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j._id}>
                    <td>{j.title}</td>
                    <td>{j.company?.companyName || 'N/A'}</td>
                    <td>{new Date(j.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="admin-delete-btn" onClick={() => handleDeleteJob(j._id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Edit {editingUser?.type === 'student' ? 'Student' : 'Recruiter'}</h2>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleUpdate} className="admin-edit-form">
              <div className="admin-form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  required
                />
              </div>
              {editingUser?.type === 'recruiter' && (
                <div className="admin-form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={editFormData.companyName}
                    onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
                    required
                  />
                </div>
              )}
              <div className="admin-modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
