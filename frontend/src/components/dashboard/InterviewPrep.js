import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ClockIcon,
  MicrophoneIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ChartBarIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const InterviewPrep = () => {
  const [currentSession, setCurrentSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionState, setSessionState] = useState('setup'); // setup, active, paused, completed
  const [timer, setTimer] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [sessionResults, setSessionResults] = useState(null);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('technical');
  const [sessionType, setSessionType] = useState('practice');
  const [difficulty, setDifficulty] = useState('medium');
  const timerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  const interviewCategories = {
    technical: {
      name: 'Technical Interview',
      description: 'Coding problems, algorithms, and system design',
      icon: <DocumentTextIcon className="h-6 w-6" />,
      color: 'blue'
    },
    behavioral: {
      name: 'Behavioral Interview',
      description: 'Soft skills, past experiences, and culture fit',
      icon: <LightBulbIcon className="h-6 w-6" />,
      color: 'green'
    },
    general: {
      name: 'General Interview',
      description: 'Mixed questions for overall preparation',
      icon: <ChartBarIcon className="h-6 w-6" />,
      color: 'purple'
    }
  };

  useEffect(() => {
    loadInterviewHistory();
  }, []);

  useEffect(() => {
    if (sessionState === 'active') {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [sessionState]);

  const loadInterviewHistory = async () => {
    try {
      const response = await axios.get('/api/interview/history');
      setInterviewHistory(response.data.sessions || []);
    } catch (error) {
      console.error('Failed to load interview history:', error);
      // Mock data for development
      setInterviewHistory([
        {
          id: 1,
          category: 'technical',
          difficulty: 'medium',
          completedAt: new Date('2024-01-15'),
          score: 85,
          questionsAnswered: 8,
          totalQuestions: 10,
          duration: 1245
        },
        {
          id: 2,
          category: 'behavioral',
          difficulty: 'easy',
          completedAt: new Date('2024-01-10'),
          score: 92,
          questionsAnswered: 10,
          totalQuestions: 10,
          duration: 987
        }
      ]);
    }
  };

  const startSession = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/interview/start', {
        category: selectedCategory,
        difficulty: difficulty,
        sessionType: sessionType
      });

      const sessionData = response.data;
      setCurrentSession(sessionData);
      setQuestions(sessionData.questions);
      
    } catch (error) {
      console.error('Failed to start session:', error);
      // Generate mock questions for development
      generateMockQuestions();
    } finally {
      setLoading(false);
      setSessionState('active');
      setTimer(0);
      setCurrentQuestionIndex(0);
      setAnswers([]);
    }
  };

  const generateMockQuestions = () => {
    const mockQuestions = {
      technical: [
        {
          id: 1,
          text: "Explain the difference between '==' and '===' in JavaScript.",
          type: "concept",
          difficulty: "medium",
          expectedAnswer: "== performs type coercion while === does strict comparison",
          timeLimit: 300,
          category: "JavaScript"
        },
        {
          id: 2,
          text: "How would you implement a function to reverse a linked list?",
          type: "coding",
          difficulty: "medium",
          expectedAnswer: "Iterative or recursive approach using three pointers",
          timeLimit: 600,
          category: "Algorithms"
        },
        {
          id: 3,
          text: "What is the time complexity of searching in a binary search tree?",
          type: "concept",
          difficulty: "easy",
          expectedAnswer: "O(log n) average case, O(n) worst case",
          timeLimit: 180,
          category: "Data Structures"
        },
        {
          id: 4,
          text: "Design a URL shortener like bit.ly. What are the main components?",
          type: "system_design",
          difficulty: "hard",
          expectedAnswer: "Database, encoding algorithm, caching layer, load balancer",
          timeLimit: 900,
          category: "System Design"
        },
        {
          id: 5,
          text: "Explain the concept of closures in JavaScript with an example.",
          type: "concept",
          difficulty: "medium",
          expectedAnswer: "Function that has access to outer scope variables",
          timeLimit: 400,
          category: "JavaScript"
        }
      ],
      behavioral: [
        {
          id: 1,
          text: "Tell me about a challenging project you worked on and how you overcame obstacles.",
          type: "experience",
          difficulty: "medium",
          expectedAnswer: "STAR method: Situation, Task, Action, Result",
          timeLimit: 180,
          category: "Problem Solving"
        },
        {
          id: 2,
          text: "Describe a time when you had to work with a difficult team member.",
          type: "teamwork",
          difficulty: "medium",
          expectedAnswer: "Communication, empathy, conflict resolution",
          timeLimit: 180,
          category: "Teamwork"
        },
        {
          id: 3,
          text: "Why do you want to work for our company?",
          type: "motivation",
          difficulty: "easy",
          expectedAnswer: "Research company values, mission, and role alignment",
          timeLimit: 120,
          category: "Motivation"
        },
        {
          id: 4,
          text: "Where do you see yourself in 5 years?",
          type: "career",
          difficulty: "easy",
          expectedAnswer: "Career growth aligned with role and company",
          timeLimit: 120,
          category: "Career Goals"
        },
        {
          id: 5,
          text: "Describe a time when you failed and what you learned from it.",
          type: "growth",
          difficulty: "medium",
          expectedAnswer: "Self-reflection, learning, improvement",
          timeLimit: 180,
          category: "Growth Mindset"
        }
      ]
    };

    setQuestions(mockQuestions[selectedCategory] || mockQuestions.technical);
    setCurrentSession({
      id: Date.now(),
      category: selectedCategory,
      difficulty: difficulty,
      startedAt: new Date(),
      questions: mockQuestions[selectedCategory] || mockQuestions.technical
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      saveCurrentAnswer();
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
    } else {
      completeSession();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      saveCurrentAnswer();
      setCurrentQuestionIndex(prev => prev - 1);
      const prevAnswer = answers[currentQuestionIndex - 1];
      setUserAnswer(prevAnswer?.answer || '');
    }
  };

  const saveCurrentAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const answerData = {
      questionId: currentQuestion.id,
      answer: userAnswer,
      timeSpent: timer - (answers.reduce((acc, ans) => acc + (ans.timeSpent || 0), 0)),
      timestamp: new Date()
    };

    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = answerData;
      return newAnswers;
    });
  };

  const completeSession = async () => {
    saveCurrentAnswer();
    setSessionState('completed');
    
    try {
      const sessionData = {
        sessionId: currentSession.id,
        answers: answers,
        totalTime: timer,
        category: selectedCategory,
        difficulty: difficulty
      };

      const response = await axios.post('/api/interview/complete', sessionData);
      setSessionResults(response.data);
    } catch (error) {
      console.error('Failed to complete session:', error);
      // Generate mock results
      generateMockResults();
    }
  };

  const generateMockResults = () => {
    const totalQuestions = questions.length;
    const score = Math.floor(Math.random() * 30) + 70; // 70-100
    
    setSessionResults({
      score: score,
      totalQuestions: totalQuestions,
      questionsAnswered: answers.length,
      totalTime: timer,
      strengths: ['Clear communication', 'Good problem-solving approach', 'Strong technical knowledge'],
      improvements: ['Provide more specific examples', 'Structure answers better', 'Consider edge cases'],
      feedback: answers.map((answer, index) => ({
        questionId: questions[index].id,
        question: questions[index].text,
        userAnswer: answer.answer,
        score: Math.floor(Math.random() * 40) + 60,
        feedback: 'Good response with room for improvement in specificity and structure.'
      }))
    });
  };

  const resetSession = () => {
    setSessionState('setup');
    setCurrentSession(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setTimer(0);
    setUserAnswer('');
    setAnswers([]);
    setSessionResults(null);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const QuestionCard = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {question.difficulty}
              </span>
              <span className="text-gray-500 text-sm">{question.category}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{question.text}</h3>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <div className="flex items-center text-gray-600">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span className="text-sm">{formatTime(timer)}</span>
            </div>
            {question.timeLimit && (
              <div className="text-gray-500 text-sm">
                / {Math.floor(question.timeLimit / 60)}m
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer:
            </label>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={6}
              placeholder="Type your answer here..."
            />
          </div>

          {question.type === 'coding' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">💡 Tip for coding questions:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Explain your approach first</li>
                <li>• Consider edge cases</li>
                <li>• Analyze time and space complexity</li>
                <li>• Write clean, readable code</li>
              </ul>
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Previous
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={toggleRecording}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  isRecording 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MicrophoneIcon className="h-4 w-4 mr-2" />
                {isRecording ? 'Recording...' : 'Practice Aloud'}
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Next Question
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={completeSession}
                  className="flex items-center px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Complete Session
                  <CheckCircleIcon className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SessionResults = () => {
    if (!sessionResults) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading results...</div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-6">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(sessionResults.score)}`}>
              {sessionResults.score}%
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Session Complete!</h3>
            <p className="text-gray-600">
              You answered {sessionResults.questionsAnswered} out of {sessionResults.totalQuestions} questions
              in {formatTime(sessionResults.totalTime)}
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-lg font-semibold text-green-600 mb-3">Strengths</h4>
            <ul className="space-y-2">
              {sessionResults.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-orange-600 mb-3">Areas for Improvement</h4>
            <ul className="space-y-2">
              {sessionResults.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start">
                  <ExclamationTriangleIcon className="h-5 w-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Question Feedback</h4>
          {sessionResults.feedback.map((feedback, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium text-gray-900">Question {index + 1}</h5>
                <span className={`text-sm font-medium ${getScoreColor(feedback.score)}`}>
                  {feedback.score}%
                </span>
              </div>
              <p className="text-gray-700 text-sm mb-2">{feedback.question}</p>
              <p className="text-gray-600 text-sm">{feedback.feedback}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={resetSession}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            New Session
          </button>
          <button
            onClick={() => setSessionState('setup')}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Back to Setup
          </button>
        </div>
      </div>
    </div>
    );
  };

  if (sessionState === 'setup') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Interview Preparation</h2>
          <p className="text-gray-600">Practice with AI-generated questions and get personalized feedback</p>
        </div>

        {/* Session Setup */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configure Your Session</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Interview Type</label>
              <div className="space-y-2">
                {Object.entries(interviewCategories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`w-full p-3 text-left border rounded-lg transition-colors ${
                      selectedCategory === key 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`text-${category.color}-600`}>
                        {category.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-600">{category.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="easy">Easy - Entry Level</option>
                <option value="medium">Medium - Mid Level</option>
                <option value="hard">Hard - Senior Level</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Session Type</label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="practice">Practice Mode</option>
                <option value="timed">Timed Challenge</option>
                <option value="mock">Full Mock Interview</option>
              </select>
            </div>
          </div>

          <button
            onClick={startSession}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Questions...
              </>
            ) : (
              <>
                <PlayIcon className="h-5 w-5 mr-2" />
                Start Interview Session
              </>
            )}
          </button>
        </div>

        {/* Interview History */}
        {interviewHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
            <div className="space-y-3">
              {interviewHistory.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      interviewCategories[session.category]?.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      interviewCategories[session.category]?.color === 'green' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {interviewCategories[session.category]?.icon}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {interviewCategories[session.category]?.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(session.completedAt).toLocaleDateString()} • {formatTime(session.duration)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`text-lg font-semibold ${getScoreColor(session.score)}`}>
                      {session.score}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {session.questionsAnswered}/{session.totalQuestions}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (sessionState === 'active') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {interviewCategories[selectedCategory].name}
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSessionState('paused')}
                className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                <PauseIcon className="h-4 w-4 mr-2" />
                Pause
              </button>
              <button
                onClick={resetSession}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <StopIcon className="h-4 w-4 mr-2" />
                End Session
              </button>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600 text-center">
            Progress: {currentQuestionIndex + 1} of {questions.length} questions
          </div>
        </div>

        <QuestionCard />
      </div>
    );
  }

  if (sessionState === 'completed') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <SessionResults />
      </div>
    );
  }

  return null;
};

export default InterviewPrep;