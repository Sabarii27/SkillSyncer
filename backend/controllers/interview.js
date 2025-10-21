const User = require('../models/User');
const Interview = require('../models/Interview');
const { generateInterviewQuestions } = require('../utils/ai');

// @desc    Create new interview session
// @route   POST /api/interview/session
// @access  Private
exports.createSession = async (req, res, next) => {
  try {
    const { jobRole, difficulty, category, questionCount, timeLimit } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Generate interview questions using AI
    const aiQuestions = await generateInterviewQuestions(
      jobRole || user.careerGoal,
      user.skills
    );
    
    // Parse AI response and create structured questions
    const questions = parseAIQuestions(aiQuestions, difficulty, category, questionCount || 10);
    
    const interview = await Interview.create({
      user: req.user.id,
      jobRole: jobRole || user.careerGoal,
      difficulty: difficulty || 'Medium',
      category: category || 'Mixed',
      questions,
      sessionSettings: {
        questionCount: questionCount || 10,
        timeLimit: timeLimit || 300,
        categories: category === 'Mixed' ? ['technical', 'behavioral'] : [category.toLowerCase()],
        includeTimer: true
      },
      sessionStats: {
        status: 'not_started'
      }
    });
    
    res.status(201).json({
      success: true,
      data: interview
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get interview session
// @route   GET /api/interview/session/:id
// @access  Private
exports.getSession = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview session not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Start interview session
// @route   PUT /api/interview/session/:id/start
// @access  Private
exports.startSession = async (req, res, next) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { 
        'sessionStats.status': 'in_progress',
        'sessionStats.startedAt': new Date()
      },
      { new: true }
    );
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview session not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Submit answer for question
// @route   PUT /api/interview/session/:id/answer/:questionId
// @access  Private
exports.submitAnswer = async (req, res, next) => {
  try {
    const { answer, timeSpent } = req.body;
    
    const interview = await Interview.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview session not found'
      });
    }
    
    // Find and update the specific question
    const question = interview.questions.id(req.params.questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    question.userAnswer = answer;
    question.answered = true;
    question.answeredAt = new Date();
    question.timeSpent = timeSpent || 0;
    
    // Simple scoring logic (can be enhanced with AI)
    question.score = calculateAnswerScore(question);
    
    // Update session stats
    interview.calculateStats();
    
    await interview.save();
    
    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Complete interview session
// @route   PUT /api/interview/session/:id/complete
// @access  Private
exports.completeSession = async (req, res, next) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { 
        'sessionStats.status': 'completed',
        'sessionStats.completedAt': new Date()
      },
      { new: true }
    );
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview session not found'
      });
    }
    
    // Calculate final results
    const results = generateInterviewResults(interview);
    interview.results = results;
    
    await interview.save();
    
    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get user interview history
// @route   GET /api/interview/history
// @access  Private
exports.getHistory = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ user: req.user.id })
      .select('jobRole difficulty sessionStats.status sessionStats.completedAt results.overallScore createdAt')
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      data: interviews
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get interview analytics
// @route   GET /api/interview/analytics
// @access  Private
exports.getAnalytics = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ 
      user: req.user.id,
      'sessionStats.status': 'completed'
    });
    
    const analytics = {
      totalInterviews: interviews.length,
      averageScore: 0,
      improvementTrend: [],
      categoryPerformance: {
        technical: { average: 0, count: 0 },
        behavioral: { average: 0, count: 0 }
      },
      commonWeaknesses: [],
      recentPerformance: []
    };
    
    if (interviews.length > 0) {
      // Calculate average score
      const totalScore = interviews.reduce((sum, interview) => 
        sum + (interview.results.overallScore || 0), 0
      );
      analytics.averageScore = Math.round(totalScore / interviews.length * 10) / 10;
      
      // Recent performance (last 10 interviews)
      analytics.recentPerformance = interviews
        .slice(0, 10)
        .map(interview => ({
          date: interview.sessionStats.completedAt,
          score: interview.results.overallScore,
          jobRole: interview.jobRole
        }));
      
      // Category performance
      interviews.forEach(interview => {
        if (interview.results.technicalScore) {
          analytics.categoryPerformance.technical.average += interview.results.technicalScore;
          analytics.categoryPerformance.technical.count++;
        }
        if (interview.results.behavioralScore) {
          analytics.categoryPerformance.behavioral.average += interview.results.behavioralScore;
          analytics.categoryPerformance.behavioral.count++;
        }
      });
      
      // Calculate category averages
      if (analytics.categoryPerformance.technical.count > 0) {
        analytics.categoryPerformance.technical.average = 
          Math.round(analytics.categoryPerformance.technical.average / 
          analytics.categoryPerformance.technical.count * 10) / 10;
      }
      
      if (analytics.categoryPerformance.behavioral.count > 0) {
        analytics.categoryPerformance.behavioral.average = 
          Math.round(analytics.categoryPerformance.behavioral.average / 
          analytics.categoryPerformance.behavioral.count * 10) / 10;
      }
    }
    
    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Helper function to parse AI-generated questions
function parseAIQuestions(aiResponse, difficulty, category, count) {
  const questions = [];
  const lines = aiResponse.split('\n').filter(line => line.trim());
  
  let currentQuestion = null;
  
  for (const line of lines) {
    if (line.match(/^\d+\./) || line.toLowerCase().includes('question')) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      
      currentQuestion = {
        question: line.replace(/^\d+\.\s*/, '').trim(),
        type: determineQuestionType(line),
        difficulty: difficulty || 'Medium',
        expectedAnswer: '',
        keyPoints: [],
        answered: false
      };
    } else if (currentQuestion && (line.toLowerCase().includes('answer') || line.toLowerCase().includes('key points'))) {
      currentQuestion.expectedAnswer = line;
    }
  }
  
  if (currentQuestion) {
    questions.push(currentQuestion);
  }
  
  // Ensure we have the requested number of questions
  while (questions.length < count && questions.length > 0) {
    questions.push({
      ...questions[Math.floor(Math.random() * questions.length)],
      question: `Variation: ${questions[Math.floor(Math.random() * questions.length)].question}`
    });
  }
  
  return questions.slice(0, count);
}

// Helper function to determine question type
function determineQuestionType(question) {
  const technical = ['code', 'algorithm', 'system', 'database', 'programming', 'technical', 'architecture'];
  const behavioral = ['team', 'conflict', 'leadership', 'challenge', 'experience', 'situation'];
  
  const lowerQuestion = question.toLowerCase();
  
  if (technical.some(word => lowerQuestion.includes(word))) {
    return 'technical';
  } else if (behavioral.some(word => lowerQuestion.includes(word))) {
    return 'behavioral';
  } else {
    return 'situational';
  }
}

// Helper function to calculate answer score
function calculateAnswerScore(question) {
  if (!question.userAnswer || question.userAnswer.trim().length < 10) {
    return 0;
  }
  
  const answerLength = question.userAnswer.length;
  const hasKeywords = question.expectedAnswer.toLowerCase()
    .split(' ')
    .some(word => question.userAnswer.toLowerCase().includes(word));
  
  let score = 5; // Base score
  
  if (answerLength > 100) score += 1;
  if (answerLength > 200) score += 1;
  if (hasKeywords) score += 2;
  if (question.timeSpent && question.timeSpent < 300) score += 1; // Bonus for quick response
  
  return Math.min(score, 10);
}

// Helper function to generate interview results
function generateInterviewResults(interview) {
  const answeredQuestions = interview.questions.filter(q => q.answered);
  const totalScore = answeredQuestions.reduce((sum, q) => sum + (q.score || 0), 0);
  const averageScore = answeredQuestions.length > 0 ? totalScore / answeredQuestions.length : 0;
  
  const results = {
    overallScore: Math.round(averageScore * 10) / 10,
    strengths: [],
    improvements: [],
    recommendations: [],
    nextSteps: ''
  };
  
  // Determine strengths and improvements based on scores
  if (averageScore >= 8) {
    results.strengths.push('Excellent communication skills');
    results.strengths.push('Strong technical knowledge');
  } else if (averageScore >= 6) {
    results.strengths.push('Good foundational knowledge');
    results.improvements.push('Work on providing more detailed answers');
  } else {
    results.improvements.push('Focus on fundamental concepts');
    results.improvements.push('Practice articulating thoughts clearly');
  }
  
  // Generate recommendations
  results.recommendations.push('Continue practicing with mock interviews');
  results.recommendations.push('Review common interview questions in your field');
  
  results.nextSteps = 'Keep practicing and focus on areas that need improvement. Consider scheduling more practice sessions.';
  
  return results;
}
