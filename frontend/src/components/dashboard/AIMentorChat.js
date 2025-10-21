import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  PaperAirplaneIcon,
  UserCircleIcon,
  SparklesIcon,
  XMarkIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  BookOpenIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const AIMentorChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      loadChatHistory();
      initializeChat();
      // Focus input when chat opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const loadChatHistory = async () => {
    // For now, we'll start fresh each time
    // In the future, we could add a chat history endpoint
    setMessages([]);
    setChatHistory([]);
  };

  const initializeChat = () => {
    if (messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'ai',
        content: "👋 Hi there! I'm your AI Career Mentor. I'm here to help you with career guidance, learning recommendations, skill development, and answering any questions about your professional journey. How can I assist you today?",
        timestamp: new Date(),
        suggestions: [
          "What skills should I focus on for my career?",
          "Can you review my learning progress?", 
          "Help me prepare for interviews",
          "Suggest career paths for my interests"
        ]
      };
      setMessages([welcomeMessage]);
    }

    setSuggestedQuestions([
      {
        icon: <LightBulbIcon className="h-4 w-4" />,
        text: "What skills should I learn next?",
        category: "Skills"
      },
      {
        icon: <BriefcaseIcon className="h-4 w-4" />,
        text: "How can I advance my career?",
        category: "Career"
      },
      {
        icon: <BookOpenIcon className="h-4 w-4" />,
        text: "Recommend learning resources",
        category: "Learning"
      },
      {
        icon: <AcademicCapIcon className="h-4 w-4" />,
        text: "Help with interview preparation",
        category: "Interview"
      }
    ]);
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await axios.post('/api/chat', {
        message: messageText.trim()
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.data.data.aiResponse,
        timestamp: new Date(),
        suggestions: response.data.suggestions || []
      };

      setTimeout(() => {
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1000); // Simulate typing delay

    } catch (error) {
      setIsTyping(false);
      setIsLoading(false);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm sorry, I encountered an error while processing your message. Please try again or contact support if the issue persists.",
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestedQuestion = (question) => {
    sendMessage(question);
  };

  const clearChat = () => {
    setMessages([]);
    initializeChat();
  };

  const formatMessage = (content) => {
    // Simple markdown-like formatting
    const formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>');
    
    return { __html: formatted };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI Career Mentor</h3>
              <p className="text-blue-100 text-sm">Your personal learning companion</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={clearChat}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title="Clear Chat"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title="Close Chat"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                  {message.type === 'user' ? (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <UserCircleIcon className="h-5 w-5 text-white" />
                    </div>
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.isError ? 'bg-red-100' : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                    }`}>
                      {message.isError ? (
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                      ) : (
                        <SparklesIcon className="h-5 w-5 text-white" />
                      )}
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.isError
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div 
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={formatMessage(message.content)}
                  />
                  
                  {/* Timestamp */}
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>

                  {/* AI Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-gray-600 font-medium">Suggested questions:</p>
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedQuestion(suggestion)}
                          className="block w-full text-left text-xs bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex mr-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-[200px]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && suggestedQuestions.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-2">Quick questions to get started:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question.text)}
                  className="flex items-center space-x-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg px-3 py-2 text-sm transition-colors"
                >
                  {question.icon}
                  <span>{question.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your career, skills, or learning path..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="1"
                style={{ minHeight: '48px' }}
                disabled={isLoading}
              />
            </div>
            
            <button
              onClick={() => sendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                inputMessage.trim() && !isLoading
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                <PaperAirplaneIcon className="h-5 w-5" />
              )}
              <span>Send</span>
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIMentorChat;