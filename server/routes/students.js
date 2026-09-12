const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const studentController = require('../controllers/studentController');

// All student routes require valid JWT AND role === 'student'
router.use(protect, authorize('student'));

router.get('/dashboard', studentController.getDashboard);
router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);
router.post('/resume', studentController.uploadResume);
router.get('/drives', studentController.getDrives);
router.get('/drives/:id', studentController.getDriveDetail);
router.post('/drives/:id/apply', studentController.applyToDrive);
router.get('/applications', studentController.getApplications);
router.post('/applications/:id/withdraw', studentController.withdrawApplication);
router.get('/interviews', studentController.getInterviews);
router.get('/notifications', studentController.getNotifications);
router.put('/notifications/:id/read', studentController.markNotificationRead);
router.post('/notifications/:id/read', studentController.markNotificationRead);
router.put('/notifications/read-all', studentController.markAllNotificationsRead);
router.post('/notifications/read-all', studentController.markAllNotificationsRead);
router.get('/status', studentController.getPlacementStatus);

module.exports = router;

