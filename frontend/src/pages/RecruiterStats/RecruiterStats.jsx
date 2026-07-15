import React, { useState, useEffect } from 'react';
import './RecruiterStats.css';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function RecruiterStats() {
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalApplicants: 0,
        interviews: 0,
        hired: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/recruiter/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="stats-header">
                    <h1>Hiring Analytics</h1>
                    <p>Overview of your recruitment performance</p>
                </div>

                {loading ? (
                    <div className="loading">Loading analytics...</div>
                ) : (
                    <div className="stats-overview">
                        <div className="overview-card fade-in-up delay-1">
                            <div className="card-icon-wrapper active-job-icon">
                                <span>💼</span>
                            </div>
                            <div className="card-content">
                                <span className="overview-number">{stats.activeJobs}</span>
                                <span className="overview-label">Active Jobs</span>
                            </div>
                        </div>
                        <div className="overview-card fade-in-up delay-2">
                            <div className="card-icon-wrapper applicant-icon">
                                <span>👥</span>
                            </div>
                            <div className="card-content">
                                <span className="overview-number">{stats.totalApplicants}</span>
                                <span className="overview-label">Total Applicants</span>
                            </div>
                        </div>
                        <div className="overview-card fade-in-up delay-3">
                            <div className="card-icon-wrapper interview-icon">
                                <span>🤝</span>
                            </div>
                            <div className="card-content">
                                <span className="overview-number">{stats.interviews}</span>
                                <span className="overview-label">Interviews</span>
                            </div>
                        </div>
                        <div className="overview-card fade-in-up delay-4">
                            <div className="card-icon-wrapper hired-icon">
                                <span>🎉</span>
                            </div>
                            <div className="card-content">
                                <span className="overview-number">{stats.hired}</span>
                                <span className="overview-label">Hired Candidates</span>
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
}

export default RecruiterStats;
