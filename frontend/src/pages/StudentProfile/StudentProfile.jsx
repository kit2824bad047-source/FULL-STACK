import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './StudentProfile.css';

function StudentProfile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    rollNumber: '',
    phone: '',
    cgpa: '',
    collegeName: '',
    skills: '',
    profilePicture: '',
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/student/profile');
      setProfile({
        name: res.data.name || '',
        email: res.data.email || '',
        rollNumber: res.data.rollNumber || '',
        phone: res.data.phone || '',
        cgpa: res.data.cgpa || '',
        collegeName: res.data.collegeName || '',
        skills: Array.isArray(res.data.skills) ? res.data.skills.join(', ') : '',
        profilePicture: res.data.profilePicture || '',
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
      const payload = {
        ...profile,
        cgpa: profile.cgpa ? parseFloat(profile.cgpa) : null,
        skills: profile.skills.split(',').map(s => s.trim()),
      };
      await api.put('/student/profile', payload);
      toast.success('Profile updated successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    }
  };

  // Calculate profile completion
  const calculateCompletion = () => {
    const fields = [
      profile.name,
      profile.email,
      profile.rollNumber,
      profile.phone,
      profile.cgpa,
      profile.collegeName,
      profile.skills
    ];
    const filled = fields.filter(f => f && f.toString().trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    setUploading(true);
    try {
      const res = await api.post('/student/profile/picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile({ ...profile, profilePicture: res.data.profilePicture });
      toast.success('Profile picture updated!');
    } catch (err) {
      toast.error('Failed to upload picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="student-profile">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Keep your information up-to-date to stand out to recruiters</p>
      </div>

      {loading ? (
        <div className="loading">Loading your profile...</div>
      ) : (
        <div className="profile-container">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="avatar-wrapper" onClick={handleImageClick}>
              {profile.profilePicture ? (
                <img src={`http://localhost:5000${profile.profilePicture}`} alt="Profile" className="profile-image" />
              ) : (
                <span className="avatar-emoji">👤</span>
              )}
              <div className="avatar-overlay">
                {uploading ? '⏳' : '📷'}
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button type="button" className="change-photo-btn" onClick={handleImageClick} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Change Photo'}
            </button>
            <div className="sidebar-name">{profile.name || 'Your Name'}</div>
            <div className="sidebar-email">{profile.email}</div>

            <div className="completion-section">
              <div className="completion-label">
                <span>Profile Completion</span>
                <span>{calculateCompletion()}%</span>
              </div>
              <div className="completion-bar">
                <div className="completion-fill" style={{ width: `${calculateCompletion()}%` }}></div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <div className="form-section-title">📋 Personal Information</div>
              <div className="form-group">
                <label>Full Name</label>
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
                <label>Email Address</label>
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
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="e.g., +91 9876543210"
                />
              </div>
              <div className="form-group">
                <label>Roll Number</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={profile.rollNumber}
                  onChange={handleChange}
                  placeholder="e.g., 21B1234"
                />
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">🎓 Academic Details</div>
              <div className="form-group">
                <label>College Name</label>
                <input
                  type="text"
                  name="collegeName"
                  value={profile.collegeName}
                  onChange={handleChange}
                  placeholder="e.g., Indian Institute of Technology"
                />
              </div>
              <div className="form-group">
                <label>CGPA</label>
                <input
                  type="number"
                  name="cgpa"
                  value={profile.cgpa}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="e.g., 8.5"
                />
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">💻 Skills & Expertise</div>
              <div className="form-group">
                <label>Skills (comma-separated)</label>
                <textarea
                  name="skills"
                  value={profile.skills}
                  onChange={handleChange}
                  rows="4"
                  placeholder="e.g., JavaScript, React, Node.js, Python, SQL"
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">Save Changes</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default StudentProfile;
