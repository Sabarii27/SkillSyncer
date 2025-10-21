// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  try {
    const { name, email, bio, skills, careerGoal } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, bio, skills, careerGoal },
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

// @desc    Generate AI-powered career suggestions
// @route   POST /api/users/career-suggestions
// @access  Private
const { generateCareerSuggestions } = require('../utils/ai');
exports.generateCareerSuggestions = async (req, res, next) => {
  try {
    const { skills, interests } = req.body;
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ success: false, error: 'Skills are required' });
    }
    const aiSuggestions = await generateCareerSuggestions(skills, interests || []);
    res.status(200).json({ success: true, data: aiSuggestions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
const User = require('../models/User');

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
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

// @desc    Update user skills
// @route   PUT /api/users/skills
// @access  Private
exports.updateUserSkills = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { skills: req.body.skills },
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

// @desc    Update user career goal
// @route   PUT /api/users/career-goal
// @access  Private
exports.updateUserCareerGoal = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { careerGoal: req.body.careerGoal },
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
