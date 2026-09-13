const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/register/student', authController.registerStudent);
router.post('/register/recruiter', authController.registerRecruiter);
router.post('/register/company', authController.registerCompany);
router.get('/me', protect, authController.getMe);

// Google OAuth Endpoints
router.get('/google/url', authController.getGoogleAuthUrl);
router.post('/google/callback', authController.handleGoogleAuth);
router.get('/google/callback', authController.handleGoogleAuth);

// GitHub OAuth Endpoints
router.get('/github/url', authController.getGithubAuthUrl);
router.post('/github/callback', authController.handleGithubAuth);
router.get('/github/callback', authController.handleGithubAuth);

module.exports = router;
