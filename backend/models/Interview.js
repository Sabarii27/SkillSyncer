const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobRole: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  category: {
    type: String,
    enum: ['Technical', 'Behavioral', 'Mixed'],
    default: 'Mixed'
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['technical', 'behavioral', 'situational'],
      required: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true
    },
    expectedAnswer: String,
    keyPoints: [String],
    userAnswer: String,
    answered: {
      type: Boolean,
      default: false
    },
    answeredAt: Date,
    timeSpent: Number, // in seconds
    score: {
      type: Number,
      min: 0,
      max: 10
    },
    feedback: String
  }],
  sessionSettings: {
    questionCount: {
      type: Number,
      default: 10,
      min: 5,
      max: 20
    },
    timeLimit: {
      type: Number,
      default: 300, // 5 minutes per question in seconds
      min: 60,
      max: 600
    },
    categories: [{
      type: String,
      enum: ['technical', 'behavioral', 'situational']
    }],
    includeTimer: {
      type: Boolean,
      default: true
    }
  },
  sessionStats: {
    totalQuestions: {
      type: Number,
      default: 0
    },
    answeredQuestions: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    startedAt: Date,
    completedAt: Date,
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed', 'abandoned'],
      default: 'not_started'
    }
  },
  results: {
    overallScore: {
      type: Number,
      min: 0,
      max: 10
    },
    technicalScore: {
      type: Number,
      min: 0,
      max: 10
    },
    behavioralScore: {
      type: Number,
      min: 0,
      max: 10
    },
    strengths: [String],
    improvements: [String],
    recommendations: [String],
    nextSteps: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
InterviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to calculate session statistics
InterviewSchema.methods.calculateStats = function() {
  const answeredQuestions = this.questions.filter(q => q.answered);
  this.sessionStats.totalQuestions = this.questions.length;
  this.sessionStats.answeredQuestions = answeredQuestions.length;
  this.sessionStats.totalTimeSpent = answeredQuestions.reduce((total, q) => total + (q.timeSpent || 0), 0);
  
  if (answeredQuestions.length > 0) {
    const totalScore = answeredQuestions.reduce((total, q) => total + (q.score || 0), 0);
    this.sessionStats.averageScore = totalScore / answeredQuestions.length;
    
    // Calculate category scores
    const technicalQuestions = answeredQuestions.filter(q => q.type === 'technical');
    const behavioralQuestions = answeredQuestions.filter(q => q.type === 'behavioral');
    
    if (technicalQuestions.length > 0) {
      this.results.technicalScore = technicalQuestions.reduce((total, q) => total + (q.score || 0), 0) / technicalQuestions.length;
    }
    
    if (behavioralQuestions.length > 0) {
      this.results.behavioralScore = behavioralQuestions.reduce((total, q) => total + (q.score || 0), 0) / behavioralQuestions.length;
    }
    
    this.results.overallScore = this.sessionStats.averageScore;
  }
  
  return this.sessionStats;
};

module.exports = mongoose.model('Interview', InterviewSchema);