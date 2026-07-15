const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Job = require('../models/Job');
const Admin = require('../models/Admin');

const parsePagination = (req) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  return { page, limit };
};

exports.getAllStudents = async (req, res, next) => {
  try {
    const { page, limit } = parsePagination(req);
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find().select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
      Student.countDocuments()
    ]);

    res.json({
      data: students,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllRecruiters = async (req, res, next) => {
  try {
    const { page, limit } = parsePagination(req);
    const skip = (page - 1) * limit;

    const [recruiters, total] = await Promise.all([
      Recruiter.find().select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
      Recruiter.countDocuments()
    ]);

    res.json({
      data: recruiters,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
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
    next(error);
  }
};

exports.getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find()
      .populate('company', 'companyName email')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    await Job.findByIdAndDelete(jobId);
    res.json({ message: 'Job posting removed successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getSystemStats = async (req, res, next) => {
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
    next(error);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const student = await Student.findByIdAndUpdate(id, { name, email }, { new: true }).select('-password');
    res.json(student);
  } catch (error) {
    next(error);
  }
};

exports.updateRecruiter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, companyName } = req.body;
    const recruiter = await Recruiter.findByIdAndUpdate(id, { name, email, companyName }, { new: true }).select('-password');
    res.json(recruiter);
  } catch (error) {
    next(error);
  }
};
