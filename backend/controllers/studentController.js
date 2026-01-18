const Student = require('../models/Student');
const Job = require('../models/Job');

exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStudentProfile = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    );
    res.json({ message: 'Profile updated successfully', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadProfilePicture = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

exports.getApplications = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

exports.withdrawApplication = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

exports.updateApplication = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

exports.getBrowseJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company: { $ne: null } })
      .populate('company', 'companyName email phone logo companyWebsite')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.applyForJob = async (req, res) => {
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

    res.json({ message: 'Applied for job successfully', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};
