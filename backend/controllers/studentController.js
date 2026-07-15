const Student = require('../models/Student');
const Job = require('../models/Job');
const sendEmail = require('../utils/sendEmail');
const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(error => ({ field: error.path, message: error.msg }))
    });
  }
  next();
};

exports.updateStudentProfileValidation = [
  body('name').optional({ values: 'falsy' }).trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional({ values: 'falsy' }).trim().isEmail().withMessage('Please provide a valid email'),
  body('phone').optional({ values: 'falsy' }).trim().matches(/^\+?[0-9\s-]{7,15}$/).withMessage('Please provide a valid phone number'),
  body('cgpa').optional({ values: 'falsy' }).isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10'),
  handleValidationErrors
];

exports.getStudentProfile = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
};

exports.updateStudentProfile = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    );
    res.json({ message: 'Profile updated successfully', student });
  } catch (error) {
    next(error);
  }
};

exports.uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const profilePicturePath = `/uploads/profiles/${req.file.filename}`;

    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { profilePicture: profilePicturePath },
      { new: true }
    );

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePicture: profilePicturePath
    });
  } catch (error) {
    next(error);
  }
};

exports.getApplications = async (req, res, next) => {
  try {
    const jobs = await Job.find({ 'applicants.student': req.user.id })
      .populate('company', 'companyName email phone logo')
      .sort({ createdAt: -1 });

    const applications = jobs.map(job => {
      const applicantInfo = job.applicants.find(
        app => app.student.toString() === req.user.id
      );
      return {
        _id: job._id,
        title: job.title,
        company: job.company,
        status: applicantInfo?.status || 'Applied',
        createdAt: applicantInfo?.appliedAt || job.createdAt,
        jobType: job.jobType,
        coverLetter: applicantInfo?.coverLetter,
        resume: applicantInfo?.resume,
        email: applicantInfo?.email,
        phone: applicantInfo?.phone,
        interviewDate: applicantInfo?.interviewDate
      };
    });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

exports.withdrawApplication = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Remove student from job applicants
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.applicants = job.applicants.filter(
      app => app.student.toString() !== req.user.id
    );
    await job.save();

    // Remove job from student applications
    await Student.findByIdAndUpdate(
      req.user.id,
      { $pull: { applications: jobId } }
    );

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    next(error);
  }
};

exports.updateApplication = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, resume, email, phone } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const applicantIndex = job.applicants.findIndex(
      app => app.student.toString() === req.user.id
    );

    if (applicantIndex === -1) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update details
    job.applicants[applicantIndex].coverLetter = coverLetter || job.applicants[applicantIndex].coverLetter;
    job.applicants[applicantIndex].resume = resume || job.applicants[applicantIndex].resume;
    job.applicants[applicantIndex].email = email || job.applicants[applicantIndex].email;
    job.applicants[applicantIndex].phone = phone || job.applicants[applicantIndex].phone;

    await job.save();
    res.json({ message: 'Application updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getBrowseJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ company: { $ne: null } })
      .populate('company', 'companyName email phone logo companyWebsite')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter, resume, email, phone } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const alreadyApplied = job.applicants.some(
      app => app.student.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Add student to job applicants
    job.applicants.push({
      student: req.user.id,
      coverLetter,
      resume,
      email,
      phone,
      status: 'Applied',
      appliedAt: new Date()
    });
    await job.save();

    // Add job to student applications
    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { applications: jobId } },
      { new: true }
    );

    // Send email to recruiter
    const jobWithCompany = await Job.findById(jobId).populate('company');
    if (jobWithCompany && jobWithCompany.company && jobWithCompany.company.email) {
      const message = `Hello ${jobWithCompany.company.companyName},\n\nA new student (${student.name}) has just applied for your job posting: "${jobWithCompany.title}".\n\nPlease log in to your dashboard to review their application.\n\nBest,\nCampus Placement System Team`;
      
      await sendEmail({
        email: jobWithCompany.company.email,
        subject: `New Application Received for ${jobWithCompany.title}`,
        message
      });
    }

    // Send email to student confirming application
    try {
      if (student && student.email) {
        const studentMessage = `Hello ${student.name},\n\nYou have successfully applied for the role: "${jobWithCompany.title}" at ${jobWithCompany.company.companyName}.\n\nYou can track the status of your application on your dashboard.\n\nBest,\nCampus Placement System Team`;
        
        await sendEmail({
          email: student.email,
          subject: `Application Successful: ${jobWithCompany.title}`,
          message: studentMessage
        });
      }
    } catch (emailError) {
      console.error('Failed to send student confirmation email:', emailError);
    }

    res.json({ message: 'Applied for job successfully', student });
  } catch (error) {
    next(error);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    const studentId = new mongoose.Types.ObjectId(req.user.id);

    // Count jobs where this student has applied
    const applicationCount = await Job.countDocuments({
      'applicants.student': studentId
    });

    // Count jobs where this student is shortlisted (interviews)
    const interviewCount = await Job.countDocuments({
      'applicants': {
        $elemMatch: {
          student: studentId,
          status: { $in: ['Shortlisted Round 1', 'Interview Round 1', 'Shortlisted Round 2', 'Interview Round 2'] }
        }
      }
    });



    // Count jobs where this student is selected (hired)
    const hiredCount = await Job.countDocuments({
      'applicants': {
        $elemMatch: {
          student: studentId,
          status: 'Selected'
        }
      }
    });

    // Count jobs where this student is rejected
    const rejectedCount = await Job.countDocuments({
      'applicants': {
        $elemMatch: {
          student: studentId,
          status: 'Rejected'
        }
      }
    });

    // Get the latest application status for "Overall Status"
    const latestJob = await Job.findOne({ 'applicants.student': studentId })
      .sort({ 'applicants.appliedAt': -1 });

    let overallStatus = 'Active';
    if (latestJob) {
      const myApp = latestJob.applicants.find(a => a.student.toString() === req.user.id);
      overallStatus = myApp?.status || 'Applied';
    }

    res.json({
      status: overallStatus,
      applications: applicationCount,
      interviews: interviewCount,
      hired: hiredCount,
      rejected: rejectedCount
    });
  } catch (error) {
    next(error);
  }
};
