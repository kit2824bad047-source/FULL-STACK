import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './StudentStats.css';

function StudentStats() {
    const [stats, setStats] = useState({
        totalApplications: 0,
        interviewsScheduled: 0,
        offersReceived: 0,
        rejected: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Using the dashboard-stats endpoint for consistency
                const res = await api.get('/student/dashboard-stats');
                // Ensuring we map the backend data to our expected state
                setStats({
                    totalApplications: res.data.applications || 0,
                    interviewsScheduled: res.data.interviews || 0,
                    offersReceived: res.data.hired || 0,
                    rejected: res.data.rejected || 0
                });
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="student-stats">
                <div className="stats-header">
                    <h1>Loading Statistics...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="student-stats">
            <div className="stats-background">
                <div className="shape" style={{ top: '-10%', right: '-5%', width: '500px', height: '500px', background: 'rgba(99, 102, 241, 0.4)' }}></div>
                <div className="shape" style={{ bottom: '-10%', left: '-5%', width: '400px', height: '400px', background: 'rgba(139, 92, 246, 0.4)' }}></div>
                <div className="shape" style={{ top: '40%', left: '40%', width: '300px', height: '300px', background: 'rgba(16, 185, 129, 0.3)' }}></div>
            </div>

            <div className="stats-content">
                <div className="stats-header">
                    <h1>📊 Application Statistics</h1>
                    <p>Track your job search journey and celebrate your progress</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card delay-1">
                        <span className="stat-icon-big">📝</span>
                        <span className="stat-number">{stats.totalApplications}</span>
                        <span className="stat-label">Total Applications</span>
                    </div>
                    <div className="stat-card delay-2">
                        <span className="stat-icon-big">🎯</span>
                        <span className="stat-number">{stats.interviewsScheduled}</span>
                        <span className="stat-label">Interviews</span>
                    </div>
                    <div className="stat-card delay-3">
                        <span className="stat-icon-big">🎉</span>
                        <span className="stat-number">{stats.offersReceived}</span>
                        <span className="stat-label">Offers Received</span>
                    </div>
                    <div className="stat-card delay-4">
                        <span className="stat-icon-big">📈</span>
                        <span className="stat-number">{stats.rejected}</span>
                        <span className="stat-label">In Review</span>
                    </div>
                </div>

                <div className="progress-section">
                    <h3>Your Journey Progress</h3>
                    <div className="progress-item">
                        <div className="progress-label">
                            <span>Applications Sent</span>
                            <span>{stats.totalApplications} / 10 goal</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill applications" style={{ width: `${Math.min(stats.totalApplications * 10, 100)}%` }}></div>
                        </div>
                    </div>
                    <div className="progress-item">
                        <div className="progress-label">
                            <span>Interview Rate</span>
                            <span>{stats.totalApplications > 0 ? Math.round((stats.interviewsScheduled / stats.totalApplications) * 100) : 0}%</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill interviews" style={{ width: `${stats.totalApplications > 0 ? (stats.interviewsScheduled / stats.totalApplications) * 100 : 0}%` }}></div>
                        </div>
                    </div>
                    <div className="progress-item">
                        <div className="progress-label">
                            <span>Success Rate</span>
                            <span>{stats.totalApplications > 0 ? Math.round((stats.offersReceived / stats.totalApplications) * 100) : 0}%</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill offers" style={{ width: `${stats.totalApplications > 0 ? (stats.offersReceived / stats.totalApplications) * 100 : 0}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="charts-container">
                    <h3>📈 Activity Overview</h3>
                    <div className="charts-placeholder">
                        <p>📅 Weekly application trends and performance insights coming soon!</p>
                        <p>Keep applying to unlock detailed analytics.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentStats;
