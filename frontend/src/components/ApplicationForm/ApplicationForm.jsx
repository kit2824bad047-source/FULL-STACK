import React, { useState } from 'react';
import './ApplicationForm.css';

function ApplicationForm({ job, isOpen, onClose, onSubmit, user }) {
    const [formData, setFormData] = useState({
        email: user?.email || '',
        phone: user?.phone || '',
        resume: user?.resume || '',
        coverLetter: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>

                <h2>Apply for {job.title}</h2>
                <div className="job-summary">
                    <p><strong>Company:</strong> {job.company?.companyName}</p>
                    <p>Please review and update your details before applying.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Resume Link (Google Drive/Dropbox)</label>
                        <input
                            type="url"
                            name="resume"
                            value={formData.resume}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Cover Letter</label>
                        <textarea
                            name="coverLetter"
                            value={formData.coverLetter}
                            onChange={handleChange}
                            placeholder="Why are you a good fit for this role?"
                            className="form-textarea"
                            required
                        ></textarea>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ApplicationForm;
