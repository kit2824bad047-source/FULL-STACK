const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Job = require('../models/Job');
const Admin = require('../models/Admin');

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.find().select('-password');
    res.json(recruiters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId, userType } = req.body;

    if (userType === 'student') {
      await Student.findByIdAndDelete(userId);
      // In a real app, you might also delete their applications from Jobs
    } else if (userType === 'recruiter') {
      await Recruiter.findByIdAndDelete(userId);
      // Delete all jobs posted by this recruiter
      await Job.deleteMany({ company: userId });
    }

    res.json({ message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('company', 'companyName email')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    await Job.findByIdAndDelete(jobId);
    res.json({ message: 'Job posting removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSystemStats = async (req, res) => {
  try {
    const studentCount = await Student.countDocuments();
    const recruiterCount = await Recruiter.countDocuments();
    const jobCount = await Job.countDocuments();

    res.json({
      totalStudents: studentCount,
      totalRecruiters: recruiterCount,
      totalJobs: jobCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const student = await Student.findByIdAndUpdate(id, { name, email }, { new: true }).select('-password');
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRecruiter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, companyName } = req.body;
    const recruiter = await Recruiter.findByIdAndUpdate(id, { name, email, companyName }, { new: true }).select('-password');
    res.json(recruiter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
