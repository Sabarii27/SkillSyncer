const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import controller
const {
  getProgress,
  getRoadmapProgress,
  completeStage,
  addSkillLearned,
  updateWeeklyGoal,
  getAnalytics
} = require('../controllers/progress');

router.get('/', protect, getProgress);
router.get('/analytics', protect, getAnalytics);
router.get('/:roadmapId', protect, getRoadmapProgress);
router.put('/:roadmapId/stage', protect, completeStage);
router.post('/:roadmapId/skill', protect, addSkillLearned);
router.put('/weekly-goal', protect, updateWeeklyGoal);

module.exports = router;
