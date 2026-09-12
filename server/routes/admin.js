const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// STRICT SECURITY: All admin routes require valid JWT AND role === 'admin'
router.use(protect, authorize('admin'));

// Dashboard & Reports
router.get('/dashboard', adminController.getDashboard);
router.get('/reports', adminController.getReports);

// Students Module
router.get('/students', adminController.getStudents);
router.get('/students/:id', adminController.getStudentById);

// Recruiters / Companies Module
router.get('/recruiters', adminController.getCompanies);
router.get('/companies', adminController.getCompanies);
router.get('/recruiters/:id', adminController.getCompanyById);
router.get('/companies/:id', adminController.getCompanyById);
router.put('/recruiters/:id/approve', adminController.approveCompany);
router.put('/companies/:id/approve', adminController.approveCompany);
router.put('/recruiters/:id/reject', adminController.rejectCompany);
router.put('/companies/:id/reject', adminController.rejectCompany);

// Placement Drives Module
router.get('/drives', adminController.getDrives);
router.get('/drives/:id', adminController.getDriveById);

// Applications Module
router.get('/applications', adminController.getApplications);

// Notifications Module
router.get('/notifications', adminController.getNotifications);
router.put('/notifications/:id/read', adminController.markNotificationRead);
router.post('/notifications/:id/read', adminController.markNotificationRead);
router.post('/notifications/read-all', adminController.markAllNotificationsRead);
router.put('/notifications/read-all', adminController.markAllNotificationsRead);

module.exports = router;
