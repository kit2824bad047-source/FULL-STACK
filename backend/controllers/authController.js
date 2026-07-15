const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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

exports.registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('password')
    .trim()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must include uppercase, lowercase, and a number'),
  body('userType').isIn(['student', 'recruiter']).withMessage('Invalid user type'),
  body('companyName').custom((value, { req }) => {
    if (req.body.userType === 'recruiter' && (!value || !value.trim())) {
      throw new Error('Company name is required for recruiters');
    }
    return true;
  }),
  handleValidationErrors
];

exports.loginValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('password').trim().notEmpty().withMessage('Password is required'),
  body('userType').isIn(['student', 'recruiter', 'admin']).withMessage('Invalid user type'),
  handleValidationErrors
];

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, userType, companyName } = req.body;

    // Check if user already exists
    let user;
    if (userType === 'student') {
      user = await Student.findOne({ email });
    } else if (userType === 'recruiter') {
      user = await Recruiter.findOne({ email });
    }

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    if (userType === 'student') {
      user = new Student({
        name,
        email,
        password: hashedPassword,
      });
    } else if (userType === 'recruiter') {
      user = new Recruiter({
        name,
        email,
        password: hashedPassword,
        companyName,
      });
    }

    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, email: user.email, name: user.name, userType },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, userType } = req.body;

    let user;
    if (userType === 'student') {
      user = await Student.findOne({ email });
    } else if (userType === 'recruiter') {
      user = await Recruiter.findOne({ email });
    } else if (userType === 'admin') {
      user = await Admin.findOne({ email });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, name: user.name, userType },
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};
