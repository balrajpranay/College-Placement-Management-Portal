const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/register/student', authController.registerStudent);
router.post('/register/recruiter', authController.registerRecruiter);
router.post('/register/company', authController.registerCompany);
router.get('/me', protect, authController.getMe);

module.exports = router;
