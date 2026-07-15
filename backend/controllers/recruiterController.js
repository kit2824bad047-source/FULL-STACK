const Job = require('../models/Job');
const Recruiter = require('../models/Recruiter');
const Student = require('../models/Student');
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

exports.createJobValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('salary').trim().notEmpty().withMessage('Salary is required').isNumeric().withMessage('Salary must be numeric'),
  body('jobType').trim().notEmpty().withMessage('Job type is required'),
  body('requiredSkills').custom((value) => {
    if (Array.isArray(value) && value.some(skill => typeof skill === 'string' && skill.trim())) {
      return true;
    }
    if (typeof value === 'string' && value.trim()) {
      return true;
    }
    throw new Error('Required skills are required');
  }),
  body('minCGPA').optional({ values: 'falsy' }).isFloat({ min: 0, max: 10 }).withMessage('Minimum CGPA must be between 0 and 10'),
  body('deadline').optional({ values: 'falsy' }).isISO8601().withMessage('Deadline must be a valid date'),
  handleValidationErrors
];

exports.updateJobStatusValidation = [
  body('jobId').trim().notEmpty().withMessage('Job ID is required'),
  body('studentId').trim().notEmpty().withMessage('Student ID is required'),
  body('status').trim().notEmpty().withMessage('Status is required'),
  body('interviewDate').optional({ values: 'falsy' }).isISO8601().withMessage('Interview date must be a valid date'),
  handleValidationErrors
];

exports.updateRecruiterProfileValidation = [
  body('companyName').optional({ values: 'falsy' }).trim().notEmpty().withMessage('Company name cannot be empty'),
  body('companyWebsite').optional({ values: 'falsy' }).trim().isURL().withMessage('Please provide a valid company website'),
  body('phone').optional({ values: 'falsy' }).trim().matches(/^\+?[0-9\s-]{7,15}$/).withMessage('Please provide a valid phone number'),
  handleValidationErrors
];

exports.createJob = async (req, res, next) => {
  try {
    const { title, description, location, salary, jobType, requiredSkills, minCGPA, deadline } = req.body;

    const job = new Job({
      title,
      description,
      location,
      salary,
      jobType,
      requiredSkills,
      minCGPA,
      deadline,
      company: req.user.id,
    });

    await job.save();

    // Add job to recruiter's postings
    await Recruiter.findByIdAndUpdate(
      req.user.id,
      { $push: { jobPostings: job._id } }
    );

    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    next(error);
  }
};

exports.getJobPostings = async (req, res, next) => {
  try {
    const jobs = await Job.find({ company: req.user.id })
      .populate('applicants.student')
      .populate('company', 'companyName');
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

exports.updateJobStatus = async (req, res, next) => {
  try {
    const { jobId, studentId, status } = req.body;

    const job = await Job.findByIdAndUpdate(
      jobId,
      {
        $set: {
          'applicants.$[elem].status': status,
          'applicants.$[elem].interviewDate': req.body.interviewDate || null,
        },
      },
      {
        arrayFilters: [{ 'elem.student': studentId }],
        new: true,
      }
    );

    // Send email to student
    try {
      const studentObj = await Student.findById(studentId);
      const recruiterObj = await Recruiter.findById(req.user.id);
      
      if (studentObj && studentObj.email && recruiterObj) {
        const interviewDateText = req.body.interviewDate ? `\n\nInterview Date: ${new Date(req.body.interviewDate).toLocaleString()}` : '';
        const message = `Hello ${studentObj.name},\n\nYour application status for the role "${job.title}" at ${recruiterObj.companyName} has been updated to: ${status}.${interviewDateText}\n\nPlease check your dashboard for more details.\n\nBest,\nCampus Placement System Team`;

        await sendEmail({
          email: studentObj.email,
          subject: `Application Status Update: ${job.title} at ${recruiterObj.companyName}`,
          message
        });
      }
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }

    res.json({ message: 'Status updated successfully', job });
  } catch (error) {
    next(error);
  }
};

exports.getRecruiterProfile = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findById(req.user.id).populate('jobPostings');
    res.json(recruiter);
  } catch (error) {
    next(error);
  }
};

exports.updateRecruiterProfile = async (req, res, next) => {
  try {
    const { companyName, companyWebsite, phone } = req.body;
    const recruiter = await Recruiter.findByIdAndUpdate(
      req.user.id,
      { $set: { companyName, companyWebsite, phone } },
      { new: true }
    );
    res.json({ message: 'Profile updated successfully', recruiter });
  } catch (error) {
    next(error);
  }
};

exports.getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find()
      .populate('company', 'companyName email phone logo companyWebsite')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

exports.getRecruiterStats = async (req, res, next) => {
  try {
    const jobs = await Job.find({ company: req.user.id });

    let totalApplicants = 0;
    let interviews = 0;
    let hired = 0;

    jobs.forEach(job => {
      // Count total applicants
      totalApplicants += job.applicants.length;

      // Count interviews and hired based on status
      job.applicants.forEach(applicant => {
        const status = applicant.status;
        if (['Shortlisted Round 1', 'Interview Round 1', 'Shortlisted Round 2', 'Interview Round 2'].includes(status)) {
          interviews++;
        } else if (status === 'Selected') {
          hired++;
        }
      });
    });

    const stats = {
      activeJobs: jobs.length,
      totalApplicants,
      interviews,
      hired
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
};
