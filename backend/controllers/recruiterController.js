const Job = require('../models/Job');
const Recruiter = require('../models/Recruiter');

exports.createJob = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

exports.getJobPostings = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user.id })
      .populate('applicants.student')
      .populate('company', 'companyName');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateJobStatus = async (req, res) => {
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

    res.json({ message: 'Status updated successfully', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecruiterProfile = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.user.id).populate('jobPostings');
    res.json(recruiter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRecruiterProfile = async (req, res) => {
  try {
    const { companyName, companyWebsite, phone } = req.body;
    const recruiter = await Recruiter.findByIdAndUpdate(
      req.user.id,
      { $set: { companyName, companyWebsite, phone } },
      { new: true }
    );
    res.json({ message: 'Profile updated successfully', recruiter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('company', 'companyName email phone logo companyWebsite')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecruiterStats = async (req, res) => {
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
    console.error('Error fetching recruiter stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
};
