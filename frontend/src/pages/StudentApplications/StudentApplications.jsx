import React, { useState, useEffect } from 'react';
import './StudentApplications.css';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

function StudentApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalApp, setEditModalApp] = useState(null);
    const [editFormData, setEditFormData] = useState({
        coverLetter: '',
        resume: '',
        email: '',
        phone: ''
    });

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const res = await api.get('/student/applications');
            setApplications(res.data || []);
        } catch (err) {
            console.error('Error fetching applications:', err);
            toast.error('Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleWithdraw = async (jobId) => {
        if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) return;

        try {
            await api.delete(`/student/applications/${jobId}`);
            toast.success('Application withdrawn successfully');
            fetchApplications();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to withdraw application');
        }
    };

    const openEditModal = (app) => {
        setEditModalApp(app);
        setEditFormData({
            coverLetter: app.coverLetter || '',
            resume: app.resume || '',
            email: app.email || '',
            phone: app.phone || ''
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/student/applications/${editModalApp._id}`, editFormData);
            toast.success('Application updated successfully');
            setEditModalApp(null);
            fetchApplications();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update application');
        }
    };

    if (loading && applications.length === 0) {
        return <div className="loading">Loading applications...</div>;
    }

    return (
        <div className="student-applications">
            <div className="applications-background">
                <div className="shape" style={{ top: '-10%', right: '-5%', width: '500px', height: '500px', background: 'rgba(102, 126, 234, 0.4)' }}></div>
                <div className="shape" style={{ bottom: '-10%', left: '-5%', width: '400px', height: '400px', background: 'rgba(118, 75, 162, 0.4)' }}></div>
                <div className="shape" style={{ top: '40%', left: '40%', width: '300px', height: '300px', background: 'rgba(35, 213, 171, 0.3)' }}></div>
            </div>

            <div className="applications-content">
                <div className="applications-header">
                    <h1>My Applications</h1>
                    <p>Track your job application status in real-time</p>
                </div>

                <div className="applications-grid">
                    {applications.length === 0 ? (
                        <div className="no-applications">
                            <h3>No applications found</h3>
                            <p>Start exploring and applying to jobs to see them here!</p>
                        </div>
                    ) : (
                        applications.map((app, index) => (
                            <div key={app._id} className={`application-card delay-${(index % 3) + 1}`}>
                                <div className="card-top">
                                    <div className="job-info">
                                        <h3>{app.title}</h3>
                                        <span className="company-name">{app.company?.companyName || 'Unknown Company'}</span>
                                    </div>
                                    <div className={`application-status status-${(app.status || 'Applied').toLowerCase().replace(/\s+/g, '-')}`}>
                                        {app.status || 'Applied'}
                                    </div>
                                </div>

                                {app.interviewDate && (
                                    <div className="interview-date-banner">
                                        <span className="banner-icon">📅</span>
                                        <div className="banner-content">
                                            <span className="banner-label">Interview Scheduled</span>
                                            <span className="banner-date">
                                                {new Date(app.interviewDate).toLocaleString([], {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="application-meta">
                                    <span className="date">
                                        Applied on: {app.createdAt ? new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                                    </span>
                                </div>

                                <div className="application-actions">
                                    <button
                                        className="action-btn edit-btn"
                                        onClick={() => openEditModal(app)}
                                        disabled={app.status !== 'Applied' && app.status !== 'Reviewed'}
                                    >
                                        Edit Details
                                    </button>
                                    <button
                                        className="action-btn withdraw-btn"
                                        onClick={() => handleWithdraw(app._id)}
                                    >
                                        Withdraw
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {editModalApp && (
                <div className="modal-overlay" onClick={() => setEditModalApp(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Application - {editModalApp.title}</h2>
                            <button className="close-btn" onClick={() => setEditModalApp(null)}>&times;</button>
                        </div>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    value={editFormData.phone}
                                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Resume Link</label>
                                <input
                                    type="url"
                                    value={editFormData.resume}
                                    onChange={(e) => setEditFormData({ ...editFormData, resume: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Cover Letter</label>
                                <textarea
                                    rows="5"
                                    value={editFormData.coverLetter}
                                    onChange={(e) => setEditFormData({ ...editFormData, coverLetter: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setEditModalApp(null)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentApplications;
