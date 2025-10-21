const User = require('../models/User');
const Progress = require('../models/Progress');
const Roadmap = require('../models/Roadmap');

// @desc    Get user progress
// @route   GET /api/progress
// @access  Private
exports.getProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find({ user: req.user.id })
      .populate('roadmapId', 'title category')
      .sort('-updatedAt');
    
    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get specific roadmap progress
// @route   GET /api/progress/:roadmapId
// @access  Private
exports.getRoadmapProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({ 
      user: req.user.id, 
      roadmapId: req.params.roadmapId 
    }).populate('roadmapId');
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'Progress not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update progress - complete stage
// @route   PUT /api/progress/:roadmapId/stage
// @access  Private
exports.completeStage = async (req, res, next) => {
  try {
    const { stageId, timeSpent, resources } = req.body;
    
    let progress = await Progress.findOne({ 
      user: req.user.id, 
      roadmapId: req.params.roadmapId 
    });
    
    if (!progress) {
      // Create new progress record
      progress = await Progress.create({
        user: req.user.id,
        roadmapId: req.params.roadmapId,
        completedStages: []
      });
    }
    
    // Check if stage already completed
    const existingStage = progress.completedStages.find(
      stage => stage.stageId === stageId
    );
    
    if (!existingStage) {
      progress.completedStages.push({
        stageId,
        timeSpent: timeSpent || 0,
        resources: resources || []
      });
      
      progress.totalTimeSpent += timeSpent || 0;
      progress.calculateProgressPercentage();
      
      await progress.save();
    }
    
    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Add skill learned
// @route   POST /api/progress/:roadmapId/skill
// @access  Private
exports.addSkillLearned = async (req, res, next) => {
  try {
    const { skill, level } = req.body;
    
    let progress = await Progress.findOne({ 
      user: req.user.id, 
      roadmapId: req.params.roadmapId 
    });
    
    if (!progress) {
      progress = await Progress.create({
        user: req.user.id,
        roadmapId: req.params.roadmapId,
        skillsLearned: []
      });
    }
    
    // Check if skill already exists
    const existingSkill = progress.skillsLearned.find(s => s.skill === skill);
    
    if (existingSkill) {
      existingSkill.level = level;
      existingSkill.learnedAt = new Date();
    } else {
      progress.skillsLearned.push({ skill, level });
    }
    
    await progress.save();
    
    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update weekly goal
// @route   PUT /api/progress/weekly-goal
// @access  Private
exports.updateWeeklyGoal = async (req, res, next) => {
  try {
    const { hoursPerWeek, roadmapId } = req.body;
    
    const progress = await Progress.findOneAndUpdate(
      { user: req.user.id, roadmapId },
      { 
        'weeklyGoal.hoursPerWeek': hoursPerWeek,
        'weeklyGoal.weekStartDate': new Date()
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get progress analytics
// @route   GET /api/progress/analytics
// @access  Private
exports.getAnalytics = async (req, res, next) => {
  try {
    const progress = await Progress.find({ user: req.user.id })
      .populate('roadmapId', 'title category');
    
    const analytics = {
      totalRoadmaps: progress.length,
      totalTimeSpent: progress.reduce((sum, p) => sum + p.totalTimeSpent, 0),
      averageProgress: progress.reduce((sum, p) => sum + p.progressPercentage, 0) / progress.length || 0,
      skillsLearned: progress.reduce((sum, p) => sum + p.skillsLearned.length, 0),
      milestonesAchieved: progress.reduce((sum, p) => sum + p.milestones.length, 0),
      weeklyProgress: [],
      categoryProgress: {}
    };
    
    // Weekly progress for last 8 weeks
    const weeks = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      let weekHours = 0;
      progress.forEach(p => {
        p.completedStages.forEach(stage => {
          if (stage.completedAt >= weekStart && stage.completedAt <= weekEnd) {
            weekHours += stage.timeSpent / 60; // convert minutes to hours
          }
        });
      });
      
      weeks.push({
        week: weekStart.toISOString().split('T')[0],
        hours: Math.round(weekHours * 10) / 10
      });
    }
    analytics.weeklyProgress = weeks;
    
    // Category progress
    progress.forEach(p => {
      if (p.roadmapId && p.roadmapId.category) {
        if (!analytics.categoryProgress[p.roadmapId.category]) {
          analytics.categoryProgress[p.roadmapId.category] = {
            count: 0,
            averageProgress: 0,
            totalTime: 0
          };
        }
        analytics.categoryProgress[p.roadmapId.category].count++;
        analytics.categoryProgress[p.roadmapId.category].averageProgress += p.progressPercentage;
        analytics.categoryProgress[p.roadmapId.category].totalTime += p.totalTimeSpent;
      }
    });
    
    // Calculate averages for categories
    Object.keys(analytics.categoryProgress).forEach(category => {
      const cat = analytics.categoryProgress[category];
      cat.averageProgress = Math.round(cat.averageProgress / cat.count);
      cat.totalTime = Math.round(cat.totalTime / 60); // convert to hours
    });
    
    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
