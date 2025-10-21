const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import controller
const {
  getUser,
  updateUserSkills,
  updateUserCareerGoal,
  generateCareerSuggestions,
  updateUserProfile
} = require('../controllers/users');
router.post('/career-suggestions', protect, generateCareerSuggestions);

router.get('/me', protect, getUser);
router.put('/skills', protect, updateUserSkills);
router.put('/career-goal', protect, updateUserCareerGoal);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
