const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/students', authMiddleware, adminController.getAllStudents);
router.get('/recruiters', authMiddleware, adminController.getAllRecruiters);
router.get('/jobs', authMiddleware, adminController.getAllJobs);
router.delete('/delete-user', authMiddleware, adminController.deleteUser);
router.delete('/job/:jobId', authMiddleware, adminController.deleteJob);
router.get('/stats', authMiddleware, adminController.getSystemStats);
router.put('/student/:id', authMiddleware, adminController.updateStudent);
router.put('/recruiter/:id', authMiddleware, adminController.updateRecruiter);

module.exports = router;
