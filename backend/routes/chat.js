const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import controller
const {
  getChatResponse
} = require('../controllers/chat');

router.post('/', protect, getChatResponse);

module.exports = router;
