const express = require('express');
const multer = require('multer');
const path = require('path');
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Multer config for profile pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profiles/');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
        return;
    }

    cb(new Error('Only JPG, PNG, and WEBP images are allowed'));
};

const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter,
});

router.get('/profile', authMiddleware, studentController.getStudentProfile);
router.put('/profile', authMiddleware, studentController.updateStudentProfileValidation, studentController.updateStudentProfile);
router.post('/profile/picture', authMiddleware, upload.single('profilePicture'), studentController.uploadProfilePicture);
router.get('/dashboard-stats', authMiddleware, studentController.getDashboardStats);
router.get('/applications', authMiddleware, studentController.getApplications);
router.delete('/applications/:jobId', authMiddleware, studentController.withdrawApplication);
router.put('/applications/:jobId', authMiddleware, studentController.updateApplication);
router.get('/browse-jobs', studentController.getBrowseJobs);
router.post('/apply', authMiddleware, studentController.applyForJob);

module.exports = router;
