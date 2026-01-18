const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
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
    console.error('Registration error:', error);
    res.status(500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.login = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};
