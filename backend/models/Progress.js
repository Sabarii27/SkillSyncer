const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap',
    required: true
  },
  completedStages: [{
    stageId: {
      type: String,
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    timeSpent: {
      type: Number, // in minutes
      default: 0
    },
    resources: [{
      name: String,
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: Date
    }]
  }],
  skillsLearned: [{
    skill: String,
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    learnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalTimeSpent: {
    type: Number, // in minutes
    default: 0
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  milestones: [{
    title: String,
    description: String,
    achievedAt: {
      type: Date,
      default: Date.now
    },
    badge: String
  }],
  weeklyGoal: {
    hoursPerWeek: {
      type: Number,
      default: 10
    },
    currentWeekHours: {
      type: Number,
      default: 0
    },
    weekStartDate: {
      type: Date,
      default: Date.now
    }
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
ProgressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate progress percentage based on completed stages
ProgressSchema.methods.calculateProgressPercentage = function() {
  if (!this.roadmapId) return 0;
  // This would need the roadmap data to calculate accurately
  // For now, using completed stages count
  const totalStages = 7; // Assuming 7 stages average
  const completedCount = this.completedStages.length;
  this.progressPercentage = Math.min((completedCount / totalStages) * 100, 100);
  return this.progressPercentage;
};

module.exports = mongoose.model('Progress', ProgressSchema);