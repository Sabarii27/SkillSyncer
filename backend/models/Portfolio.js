const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true
    },
    phone: String,
    location: String,
    website: String,
    linkedin: String,
    github: String,
    profileImage: String
  },
  summary: {
    type: String,
    required: true,
    maxlength: 500
  },
  skills: {
    technical: [{
      name: String,
      level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
      }
    }],
    soft: [String]
  },
  experience: [{
    title: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    location: String,
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    current: {
      type: Boolean,
      default: false
    },
    description: String,
    achievements: [String],
    technologies: [String]
  }],
  education: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    location: String,
    startDate: Date,
    endDate: Date,
    gpa: String,
    relevant_courses: [String]
  }],
  projects: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    technologies: [String],
    startDate: Date,
    endDate: Date,
    githubUrl: String,
    liveUrl: String,
    images: [String],
    features: [String],
    challenges: String,
    learnings: String
  }],
  certifications: [{
    name: {
      type: String,
      required: true
    },
    issuer: {
      type: String,
      required: true
    },
    issueDate: Date,
    expiryDate: Date,
    credentialId: String,
    credentialUrl: String
  }],
  achievements: [{
    title: String,
    description: String,
    date: Date,
    category: {
      type: String,
      enum: ['Award', 'Competition', 'Publication', 'Speaking', 'Other']
    }
  }],
  languages: [{
    name: String,
    proficiency: {
      type: String,
      enum: ['Basic', 'Conversational', 'Fluent', 'Native']
    }
  }],
  interests: [String],
  theme: {
    template: {
      type: String,
      enum: ['modern', 'classic', 'creative', 'minimal'],
      default: 'modern'
    },
    primaryColor: {
      type: String,
      default: '#3B82F6'
    },
    secondaryColor: {
      type: String,
      default: '#1F2937'
    }
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'private'
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  views: {
    type: Number,
    default: 0
  },
  lastGenerated: Date,
  pdfUrl: String,
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
PortfolioSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Generate slug if not exists and visibility is public
  if (!this.slug && this.visibility === 'public') {
    this.slug = this.personalInfo.fullName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + this._id.toString().slice(-6);
  }
  
  next();
});

// Method to generate portfolio URL
PortfolioSchema.methods.getPortfolioUrl = function() {
  if (this.visibility === 'public' && this.slug) {
    return `${process.env.FRONTEND_URL}/portfolio/${this.slug}`;
  }
  return null;
};

module.exports = mongoose.model('Portfolio', PortfolioSchema);