const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const studentController = require('../controllers/studentController');
const recruiterController = require('../controllers/recruiterController');

jest.mock('../models/Student', () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

jest.mock('../models/Recruiter', () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

jest.mock('../models/Admin', () => ({
  findOne: jest.fn(),
}));

jest.mock('../models/Job', () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

jest.mock('../utils/sendEmail', () => jest.fn());

const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Job = require('../models/Job');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Authentication and authorization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  test('register validation rejects invalid email and short password', async () => {
    const req = {
      body: {
        name: 'Ada',
        email: 'not-an-email',
        password: 'short',
        userType: 'student',
      },
    };
    const res = createMockRes();

    for (const middleware of authController.registerValidation) {
      await middleware(req, res, jest.fn());
      if (res.status.mock.calls.length) {
        break;
      }
    }

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Validation failed',
      })
    );
  });

  test('login validation rejects missing password', async () => {
    const req = {
      body: {
        email: 'student@example.com',
        password: '   ',
        userType: 'student',
      },
    };
    const res = createMockRes();

    for (const middleware of authController.loginValidation) {
      await middleware(req, res, jest.fn());
      if (res.status.mock.calls.length) {
        break;
      }
    }

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Validation failed',
      })
    );
  });

  test('auth middleware rejects missing token', () => {
    const req = { headers: {} };
    const res = createMockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('authorizeRoles denies non-admin users', () => {
    const middleware = authMiddleware.authorizeRoles('admin');
    const req = { user: { userType: 'student' } };
    const res = createMockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('authorizeRoles allows admin users', () => {
    const middleware = authMiddleware.authorizeRoles('admin');
    const req = { user: { userType: 'admin' } };
    const res = createMockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

describe('Job application flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('updateJobStatus sends an email to the student when status changes', async () => {
    Job.findByIdAndUpdate.mockResolvedValue({ title: 'Frontend Engineer' });
    Student.findById.mockResolvedValue({ name: 'Ada', email: 'ada@example.com' });
    Recruiter.findById.mockResolvedValue({ companyName: 'Acme Labs' });
    const sendEmail = require('../utils/sendEmail');
    sendEmail.mockResolvedValue(true);

    const req = {
      user: { id: 'recruiter-1' },
      body: {
        jobId: 'job-1',
        studentId: 'student-1',
        status: 'Shortlisted',
        interviewDate: '2026-07-16T10:00:00.000Z'
      },
    };
    const res = createMockRes();

    await recruiterController.updateJobStatus(req, res, jest.fn());

    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({
      email: 'ada@example.com',
      subject: expect.stringContaining('Application Status Update')
    }));
  });

  test('applyForJob returns 404 when the job does not exist', async () => {
    Job.findById.mockResolvedValue(null);

    const req = {
      user: { id: 'student-1' },
      body: { jobId: 'job-1', coverLetter: 'Hi', resume: 'resume.pdf', email: 'student@example.com', phone: '123456' },
    };
    const res = createMockRes();

    await studentController.applyForJob(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Job not found' });
  });

  test('applyForJob returns 400 when the student has already applied', async () => {
    Job.findById.mockResolvedValue({
      applicants: [{ student: 'student-1' }],
      save: jest.fn(),
    });

    const req = {
      user: { id: 'student-1' },
      body: { jobId: 'job-1', coverLetter: 'Hi', resume: 'resume.pdf', email: 'student@example.com', phone: '123456' },
    };
    const res = createMockRes();

    await studentController.applyForJob(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'You have already applied for this job' });
  });
});
