const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = authMiddleware;

const router = express.Router();

router.get('/students', authMiddleware, authorizeRoles('admin'), adminController.getAllStudents);
router.get('/recruiters', authMiddleware, authorizeRoles('admin'), adminController.getAllRecruiters);
router.get('/jobs', authMiddleware, authorizeRoles('admin'), adminController.getAllJobs);
router.delete('/delete-user', authMiddleware, authorizeRoles('admin'), adminController.deleteUser);
router.delete('/job/:jobId', authMiddleware, authorizeRoles('admin'), adminController.deleteJob);
router.get('/stats', authMiddleware, authorizeRoles('admin'), adminController.getSystemStats);
router.put('/student/:id', authMiddleware, authorizeRoles('admin'), adminController.updateStudent);
router.put('/recruiter/:id', authMiddleware, authorizeRoles('admin'), adminController.updateRecruiter);

module.exports = router;
