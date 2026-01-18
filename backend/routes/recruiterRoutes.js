const express = require('express');
const recruiterController = require('../controllers/recruiterController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create-job', authMiddleware, recruiterController.createJob);
router.get('/job-postings', authMiddleware, recruiterController.getJobPostings);
router.get('/all-jobs', recruiterController.getAllJobs);
router.put('/update-status', authMiddleware, recruiterController.updateJobStatus);
router.get('/profile', authMiddleware, recruiterController.getRecruiterProfile);
router.put('/profile', authMiddleware, recruiterController.updateRecruiterProfile);
router.get('/stats', authMiddleware, recruiterController.getRecruiterStats);

module.exports = router;
