const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  text: {
    type: String,
    required: [true, 'Please add message text'],
    maxlength: [10000, 'Message cannot be more than 10000 characters']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const AIChatLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AIChatLog', AIChatLogSchema);
