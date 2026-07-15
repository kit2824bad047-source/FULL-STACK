const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' }
});

router.post('/register', authController.registerValidation, authController.register);
router.post('/login', loginLimiter, authController.loginValidation, authController.login);
router.post('/logout', authController.logout);

module.exports = router;
