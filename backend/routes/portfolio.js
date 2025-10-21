const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import controller
const {
  getPortfolio,
  updatePortfolio,
  generatePortfolioAI,
  addExperience,
  addProject,
  getPublicPortfolio,
  exportPortfolio,
  deleteExperience,
  deleteProject
} = require('../controllers/portfolio');

router.get('/', protect, getPortfolio);
router.put('/', protect, updatePortfolio);
router.post('/generate-summary', protect, generatePortfolioAI);
router.post('/experience', protect, addExperience);
router.post('/project', protect, addProject);
router.get('/public/:slug', getPublicPortfolio);
router.get('/export', protect, exportPortfolio);
router.delete('/experience/:id', protect, deleteExperience);
router.delete('/project/:id', protect, deleteProject);

module.exports = router;
