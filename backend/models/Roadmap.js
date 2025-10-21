const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema({
  careerRole: {
    type: String,
    required: [true, 'Please add a career role'],
    unique: true,
    trim: true,
    maxlength: [100, 'Career role cannot be more than 100 characters']
  },
  stages: [
    {
      title: {
        type: String,
        required: [true, 'Please add a stage title'],
        trim: true
      },
      description: {
        type: String,
        required: [true, 'Please add a stage description']
      },
      resources: [
        {
          name: String,
          url: String,
          type: {
            type: String,
            enum: ['article', 'video', 'course', 'book', 'tool']
          }
        }
      ]
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
