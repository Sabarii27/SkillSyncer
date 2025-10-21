const User = require('../models/User');
const Roadmap = require('../models/Roadmap');
const { generateRoadmapWithAI } = require('../utils/ai');

// @desc    Get roadmap by career role
// @route   GET /api/roadmap/:careerRole
// @access  Private
exports.getRoadmap = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findOne({ 
      careerRole: req.params.careerRole 
    });
    
    if (!roadmap) {
      return res.status(404).json({
        success: false,
        error: 'Roadmap not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: roadmap
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Generate AI-powered roadmap
// @route   POST /api/roadmap/generate
// @access  Private
exports.generateRoadmap = async (req, res, next) => {
  try {
    const { careerRole, skills } = req.body;
    
    // Generate roadmap using AI
    const aiRoadmap = await generateRoadmapWithAI(careerRole, skills);
    
    // Check if MongoDB is connected before trying to save to database
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      // Database not connected, return mock response
      console.log('Database not connected, returning mock roadmap data');
      return res.status(200).json({
        success: true,
        data: {
          id: req.user.id,
          roadmap: aiRoadmap.stages,
          careerGoal: careerRole
        }
      });
    }
    
    // Save to user's roadmap in database
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        roadmap: aiRoadmap.stages,
        careerGoal: careerRole
      },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Generate roadmap error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update user roadmap
// @route   PUT /api/roadmap/update
// @access  Private
exports.updateRoadmap = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { roadmap: req.body.roadmap },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
