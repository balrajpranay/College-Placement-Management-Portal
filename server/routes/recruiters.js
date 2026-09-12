const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const recruiterController = require('../controllers/recruiterController');

// All recruiter routes require valid JWT AND role === 'recruiter'
router.use(protect, authorize('recruiter'));

router.get('/dashboard', recruiterController.getDashboard);
router.get('/profile', recruiterController.getProfile);
router.put('/profile', recruiterController.updateProfile);
router.post('/profile', recruiterController.updateProfile);

// Step 7B: Placement Drive Management Routes
router.get('/drives', recruiterController.getDrives);
router.get('/drives/:id', recruiterController.getDriveById);
router.post('/drives', recruiterController.createDrive);
router.put('/drives/:id', recruiterController.updateDrive);
router.post('/drives/:id/close', recruiterController.closeDrive);
router.put('/drives/:id/close', recruiterController.closeDrive);

// Step 7C: Candidate Pipeline & Applicant Review Routes
router.get('/applicants', recruiterController.getApplicants);
router.get('/applicants/:id', recruiterController.getApplicantById);
router.put('/applicants/:id/status', recruiterController.updateApplicantStatus);
router.post('/applicants/:id/status', recruiterController.updateApplicantStatus);

// Step 7D: Recruiter Interview Management Routes
router.get('/interviews', recruiterController.getInterviews);
router.get('/interviews/:id', recruiterController.getInterviewById);
router.post('/interviews', recruiterController.scheduleInterview);
router.put('/interviews/:id', recruiterController.updateInterview);
router.delete('/interviews/:id', recruiterController.cancelInterview);
router.post('/interviews/:id/cancel', recruiterController.cancelInterview);

// Step 7E: Recruiter Placement Results & Offers Routes
router.get('/results', recruiterController.getResults);
router.get('/results/:id', recruiterController.getResultById);
router.post('/results', recruiterController.createOrUpdateResult);
router.post('/results/:appId/package', recruiterController.createOrUpdateResult);
router.put('/results/:id', recruiterController.updateResult);

// Step 12A: Recruiter Notifications Routes
router.get('/notifications', recruiterController.getNotifications);
router.put('/notifications/:id/read', recruiterController.markNotificationRead);
router.post('/notifications/:id/read', recruiterController.markNotificationRead);
router.post('/notifications/read-all', recruiterController.markAllNotificationsRead);

module.exports = router;



