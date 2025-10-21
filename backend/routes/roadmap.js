const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import controller
const {
  getRoadmap,
  generateRoadmap,
  updateRoadmap
} = require('../controllers/roadmap');

router.get('/:careerRole', protect, getRoadmap);
router.post('/generate', protect, generateRoadmap);
router.put('/update', protect, updateRoadmap);

module.exports = router;
