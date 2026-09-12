const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const jobController = require('../controllers/jobController');

// Public listing
router.get('/', jobController.getJobs);
router.get('/skill-up', jobController.getSkillUpOpportunities);
router.get('/skills', jobController.getSkillUpOpportunities);

// Protected student application endpoint
router.post('/:id/apply', protect, authorize('student'), jobController.applyForJob);

module.exports = router;
