import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RecruiterApplicants.css';
import api from '../../services/api';
import { toast } from 'react-toastify';

const STATUS_OPTIONS = [
    'Applied',
    'Shortlisted Round 1',
    'Interview Round 1',
    'Shortlisted Round 2',
    'Interview Round 2',
    'Selected',
    'Rejected'
];


const SkillsDisplay = ({ skills }) => {
    const [showAll, setShowAll] = useState(false);

    if (!skills || skills.length === 0) return <span className="no-skills">No skills</span>;

    const displaySkills = showAll ? skills : skills.slice(0, 2);
    const hiddenCount = skills.length - 2;

    return (
        <div className="skills-container-ref">
            <div className="skills-list">
                {displaySkills.map((skill, index) => (
                    <span key={index} className="skill-badge">{skill}</span>
                ))}
            </div>
            {skills.length > 2 && (
                <button
                    className="skills-toggle-btn"
                    onClick={() => setShowAll(!showAll)}
                >
                    {showAll ? 'Show Less' : `+${hiddenCount} More`}
                </button>
            )}
        </div>
    );

};

const AvatarDisplay = ({ src, name, getDocUrl, getInitials }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="avatar">
            {src && !imgError ? (
                <img
                    src={getDocUrl(src)}
                    alt={name}
                    onError={() => setImgError(true)}
                />
            ) : (
                <span className="initials">{getInitials(name)}</span>
            )}
        </div>
    );
};

function RecruiterApplicants() {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplicants = async () => {
        try {
            const res = await api.get('/recruiter/job-postings');
            const jobs = res.data;

            // Flatten the applicants from all jobs
            const allApplicants = [];
            jobs.forEach(job => {
                if (job.applicants && job.applicants.length > 0) {
                    job.applicants.forEach(app => {
                        allApplicants.push({
                            ...app,
                            jobId: job._id,
                            jobTitle: job.title,
                            studentName: app.student?.name || 'Unknown Student',
                            studentEmail: app.student?.email || 'N/A',
                            studentCollege: app.student?.collegeName || 'N/A',
                            studentSkills: app.student?.skills || [],
                            studentProfilePic: app.student?.profilePicture || null,
                            resumeLink: app.resume || app.student?.resume || null
                        });
                    });
                }
            });

            // Sort by applied date (newest first)
            allApplicants.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

            setApplicants(allApplicants);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching applicants:', err);
            toast.error('Failed to load applicants');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, []);

    const [showDateModal, setShowDateModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [pendingAction, setPendingAction] = useState(null);

    const handleAction = async (jobId, studentId, newStatus) => {
        // If status implies interview, open date modal
        if (['Shortlisted Round 1', 'Interview Round 1', 'Shortlisted Round 2', 'Interview Round 2'].includes(newStatus)) {
            setPendingAction({ jobId, studentId, status: newStatus });
            setShowDateModal(true);
            return;
        }

        updateStatus(jobId, studentId, newStatus);
    };

    const updateStatus = async (jobId, studentId, newStatus, interviewDate = null) => {
        try {
            await api.put('/recruiter/update-status', {
                jobId,
                studentId,
                status: newStatus,
                interviewDate
            });
            toast.success(`Applicant status updated to ${newStatus}`);
            fetchApplicants(); // Refresh data
            setShowDateModal(false);
            setPendingAction(null);
            setSelectedDate('');
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const confirmDateAction = () => {
        if (!pendingAction || !selectedDate) return;
        updateStatus(pendingAction.jobId, pendingAction.studentId, pendingAction.status, selectedDate);
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getDocUrl = (path) => {
        if (!path) return '#';
        // Normalize path: replace backslashes with forward slashes
        let cleanPath = path.replace(/\\/g, '/');
        // Ensure leading slash
        if (!cleanPath.startsWith('/')) {
            cleanPath = `/${cleanPath}`;
        }
        return `http://localhost:5000${cleanPath}`;
    };

    const getStatusClass = (status) => {
        return status ? status.toLowerCase().replace(/\s+/g, '-') : '';
    };

    return (
        <div className="recruiter-dashboard-container">
            {/* ... sidebar ... */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-brand">
                    <h2>Recruiter<span>Pro</span></h2>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/recruiter-dashboard" className="nav-item">
                        <span className="nav-icon">📊</span> Dashboard
                    </Link>
                    <Link to="/recruiter/jobs" className="nav-item">
                        <span className="nav-icon">📝</span> Post Jobs
                    </Link>
                    <Link to="/recruiter/applicants" className="nav-item active">
                        <span className="nav-icon">👥</span> Applicants
                    </Link>
                    <Link to="/recruiter/profile" className="nav-item">
                        <span className="nav-icon">🏢</span> Company
                    </Link>
                    <Link to="/recruiter/stats" className="nav-item">
                        <span className="nav-icon">📈</span> Analytics
                    </Link>
                </nav>
            </aside>

            <main className="dashboard-main-content">
                <header className="dashboard-top-bar">
                    <div className="welcome-text">
                        <h1>Applicants Management</h1>
                        <p>Review and manage candidate applications for your job postings.</p>
                    </div>
                    <div className="header-actions">
                        <div className="applicant-count-card" onClick={fetchApplicants} title="Click to refresh">
                            <div className="count-icon">👥</div>
                            <div className="count-info">
                                <span className="count-label">Total Candidates</span>
                                <span className="count-value">{applicants.length}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="applicants-card">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading applicants...</p>
                        </div>
                    ) : applicants.length === 0 ? (
                        <div className="no-data-state">
                            <div className="empty-icon">📂</div>
                            <h3>No applications yet</h3>
                            <p>Wait for candidates to apply to your posted jobs.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="applicants-table">
                                <thead>
                                    <tr>
                                        <th>Candidate</th>
                                        <th>Job Title</th>
                                        <th>Skills</th>
                                        <th>Resume</th>
                                        <th>Applied Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicants.map(app => (
                                        <tr key={app._id} className="applicant-row">
                                            <td>
                                                <div className="candidate-profile">
                                                    <AvatarDisplay
                                                        src={app.studentProfilePic}
                                                        name={app.studentName}
                                                        getDocUrl={getDocUrl}
                                                        getInitials={getInitials}
                                                    />
                                                    <div className="candidate-info">
                                                        <span className="candidate-name">{app.studentName}</span>
                                                        <span className="candidate-email">{app.studentEmail}</span>
                                                        <div className="candidate-college" title={app.studentCollege}>
                                                            <span>🏫</span>
                                                            {app.studentCollege}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="job-title-badge">{app.jobTitle}</span>
                                            </td>
                                            <td>
                                                <SkillsDisplay skills={app.studentSkills} />
                                            </td>
                                            <td>
                                                {app.resumeLink ? (
                                                    <a
                                                        href={getDocUrl(app.resumeLink)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="view-resume-btn"
                                                    >
                                                        View PDF
                                                    </a>
                                                ) : (
                                                    <span className="no-resume">No Resume</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="date-info">
                                                    {new Date(app.appliedAt).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <select
                                                        className="status-select"
                                                        value={app.status}
                                                        onChange={(e) => handleAction(app.jobId, app.student._id, e.target.value)}
                                                        disabled={app.status === 'Selected' || app.status === 'Rejected'} // Optional: lock final states if desired, or keep open
                                                    >
                                                        {STATUS_OPTIONS.map(option => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
            {/* Date Selection Modal */}
            {showDateModal && (
                <div className="modal-overlay" onClick={() => setShowDateModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Schedule Interview</h2>
                            <button className="close-btn" onClick={() => setShowDateModal(false)}>&times;</button>
                        </div>
                        <div className="form-group">
                            <label>Select Interview Date & Time</label>
                            <input
                                type="datetime-local"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setShowDateModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={confirmDateAction} disabled={!selectedDate}>Confirm & Update</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RecruiterApplicants;
