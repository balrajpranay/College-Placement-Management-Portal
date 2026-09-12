const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.get('/history', aiController.getHistory);
router.delete('/history', aiController.clearHistory);
router.post('/advisor', aiController.advisor);
router.post('/tutor', aiController.tutor);
router.post('/chat', aiController.chat);
router.get('/modes', aiController.modes);

module.exports = router;
