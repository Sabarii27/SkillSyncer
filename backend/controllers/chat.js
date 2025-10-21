const User = require('../models/User');
const AIChatLog = require('../models/AIChatLog');
const { generateAIChatResponse } = require('../utils/ai');
const mongoose = require('mongoose');

// In-memory chat storage for when database is not connected
let mockChatSessions = {};

// @desc    Get AI chat response
// @route   POST /api/chat
// @access  Private
exports.getChatResponse = async (req, res, next) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }
    
    let messages = [];
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      // Use database for chat history
      let chatLog = await AIChatLog.findOne({ userId: req.user.id });
      
      if (!chatLog) {
        chatLog = await AIChatLog.create({
          userId: req.user.id,
          messages: []
        });
      }
      
      // Add user's message to chat log
      chatLog.messages.push({
        role: 'user',
        text: message
      });
      
      // Get last 10 messages for context
      messages = chatLog.messages.slice(-10);
      
      // Generate AI response
      const aiResponse = await generateAIChatResponse(messages);
      
      // Add AI response to chat log
      chatLog.messages.push({
        role: 'ai',
        text: aiResponse
      });
      
      // Save chat log
      await chatLog.save();
      
      res.status(200).json({
        success: true,
        data: {
          userMessage: message,
          aiResponse: aiResponse
        }
      });
    } else {
      // Use mock data when database is not connected
      console.log('Database not connected, using mock chat storage');
      
      const userId = req.user.id;
      
      // Initialize chat session if it doesn't exist
      if (!mockChatSessions[userId]) {
        mockChatSessions[userId] = [];
      }
      
      // Add user's message
      mockChatSessions[userId].push({
        role: 'user',
        text: message
      });
      
      // Get last 10 messages for context
      messages = mockChatSessions[userId].slice(-10);
      
      // Generate AI response
      const aiResponse = await generateAIChatResponse(messages);
      
      // Add AI response
      mockChatSessions[userId].push({
        role: 'ai',
        text: aiResponse
      });
      
      res.status(200).json({
        success: true,
        data: {
          userMessage: message,
          aiResponse: aiResponse
        }
      });
    }
  } catch (err) {
    console.error('Chat Controller Error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'AI chat is currently unavailable. Please try again later.' 
    });
  }
};
