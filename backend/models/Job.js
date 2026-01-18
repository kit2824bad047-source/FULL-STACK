const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true,
  },
  location: String,
  salary: Number,
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship'],
  },
  requiredSkills: [String],
  minCGPA: Number,
  applicants: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
      status: {
        type: String,
        enum: ['Applied', 'Shortlisted Round 1', 'Interview Round 1', 'Shortlisted Round 2', 'Interview Round 2', 'Selected', 'Rejected'],
        default: 'Applied',
      },
      coverLetter: String,
      resume: String,
      email: String,
      phone: String,
      appliedAt: {
        type: Date,
        default: Date.now
      },
      interviewDate: Date
    },
  ],
  deadline: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Job', jobSchema);
