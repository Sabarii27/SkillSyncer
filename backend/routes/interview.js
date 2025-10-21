const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import controller
const {
  createSession,
  getSession,
  startSession,
  submitAnswer,
  completeSession,
  getHistory,
  getAnalytics
} = require('../controllers/interview');

router.post('/session', protect, createSession);
router.get('/session/:id', protect, getSession);
router.put('/session/:id/start', protect, startSession);
router.put('/session/:id/answer/:questionId', protect, submitAnswer);
router.put('/session/:id/complete', protect, completeSession);
router.get('/history', protect, getHistory);
router.get('/analytics', protect, getAnalytics);

module.exports = router;
