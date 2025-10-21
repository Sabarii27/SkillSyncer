import React, { useState, useEffect } from 'react';
import { ChevronRightIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const SkillAssessment = ({ user, setUser, onNavigateToTab }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const questions = [
    {
      id: 1,
      category: 'Frontend Development',
      question: 'How comfortable are you with React.js?',
      options: [
        { value: 1, label: 'Never used it' },
        { value: 2, label: 'Basic understanding' },
        { value: 3, label: 'Intermediate - can build components' },
        { value: 4, label: 'Advanced - hooks, context, performance optimization' },
        { value: 5, label: 'Expert - can architect complex applications' }
      ]
    },
    {
      id: 2,
      category: 'Frontend Development',
      question: 'How well do you know CSS and responsive design?',
      options: [
        { value: 1, label: 'Basic styling only' },
        { value: 2, label: 'Can use CSS frameworks like Bootstrap' },
        { value: 3, label: 'Comfortable with Flexbox and Grid' },
        { value: 4, label: 'Advanced CSS, animations, preprocessors' },
        { value: 5, label: 'CSS architecture expert, can build design systems' }
      ]
    },
    {
      id: 3,
      category: 'Backend Development',
      question: 'What is your experience with server-side programming?',
      options: [
        { value: 1, label: 'No backend experience' },
        { value: 2, label: 'Basic understanding of APIs' },
        { value: 3, label: 'Can build simple REST APIs' },
        { value: 4, label: 'Full-stack development with databases' },
        { value: 5, label: 'Microservices, scaling, system design' }
      ]
    },
    {
      id: 4,
      category: 'Database',
      question: 'How comfortable are you with databases?',
      options: [
        { value: 1, label: 'Never worked with databases' },
        { value: 2, label: 'Basic SQL queries' },
        { value: 3, label: 'Database design and relationships' },
        { value: 4, label: 'Advanced queries, optimization' },
        { value: 5, label: 'Database architecture and administration' }
      ]
    },
    {
      id: 5,
      category: 'DevOps',
      question: 'What is your experience with deployment and DevOps?',
      options: [
        { value: 1, label: 'Never deployed applications' },
        { value: 2, label: 'Basic deployment to hosting platforms' },
        { value: 3, label: 'CI/CD pipelines, version control' },
        { value: 4, label: 'Docker, cloud platforms (AWS, Azure)' },
        { value: 5, label: 'Kubernetes, infrastructure as code' }
      ]
    },
    {
      id: 6,
      category: 'Problem Solving',
      question: 'How do you rate your algorithmic problem-solving skills?',
      options: [
        { value: 1, label: 'Struggle with basic logic problems' },
        { value: 2, label: 'Can solve simple coding challenges' },
        { value: 3, label: 'Comfortable with data structures' },
        { value: 4, label: 'Advanced algorithms and optimization' },
        { value: 5, label: 'Competitive programming level' }
      ]
    }
  ];

  const handleAnswerSelect = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeAssessment();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const completeAssessment = async () => {
    setLoading(true);
    
    // Calculate results
    const categoryScores = {};
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 5;
    const overallPercentage = (totalScore / maxScore) * 100;

    questions.forEach(question => {
      const category = question.category;
      if (!categoryScores[category]) {
        categoryScores[category] = { total: 0, count: 0 };
      }
      categoryScores[category].total += answers[question.id] || 0;
      categoryScores[category].count += 1;
    });

    // Calculate category averages
    const categoryResults = {};
    Object.keys(categoryScores).forEach(category => {
      const avg = categoryScores[category].total / categoryScores[category].count;
      categoryResults[category] = {
        score: avg,
        percentage: (avg / 5) * 100,
        level: getSkillLevel(avg)
      };
    });

    const assessmentResults = {
      overallScore: totalScore,
      overallPercentage: Math.round(overallPercentage),
      overallLevel: getSkillLevel(totalScore / questions.length),
      categoryResults,
      recommendations: generateRecommendations(categoryResults)
    };

    try {
      // Save assessment results to backend
      await axios.post('/api/users/assessment', {
        results: assessmentResults,
        answers
      });
    } catch (error) {
      console.error('Failed to save assessment results:', error);
    }

    setResults(assessmentResults);
    setIsCompleted(true);
    setLoading(false);
  };

  const getSkillLevel = (score) => {
    if (score >= 4.5) return 'Expert';
    if (score >= 3.5) return 'Advanced';
    if (score >= 2.5) return 'Intermediate';
    if (score >= 1.5) return 'Beginner';
    return 'Novice';
  };

  const generateRecommendations = (categoryResults) => {
    const recommendations = [];
    
    Object.entries(categoryResults).forEach(([category, result]) => {
      if (result.percentage < 60) {
        recommendations.push({
          category,
          priority: 'High',
          suggestion: `Focus on improving ${category} skills through structured learning and hands-on projects.`
        });
      } else if (result.percentage < 80) {
        recommendations.push({
          category,
          priority: 'Medium',
          suggestion: `Continue building ${category} expertise with advanced topics and real-world applications.`
        });
      }
    });

    return recommendations;
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setResults(null);
    setIsStarted(false);
  };

  const renderStartScreen = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Skill Assessment</h2>
      <p className="text-gray-600 mb-6">
        Take our comprehensive skill assessment to identify your current skill levels and get personalized learning recommendations.
      </p>
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">What you'll get:</h4>
        <ul className="text-gray-600 space-y-2">
          <li className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            Detailed skill level analysis across multiple categories
          </li>
          <li className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            Personalized learning recommendations
          </li>
          <li className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            Career path suggestions based on your strengths
          </li>
          <li className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            Progress tracking baseline for future assessments
          </li>
        </ul>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>Time:</strong> Approximately 5-10 minutes • <strong>Questions:</strong> {questions.length} multiple-choice
        </p>
      </div>
      <button 
        onClick={() => setIsStarted(true)}
        className="btn-primary px-8 py-3"
      >
        Start Assessment
      </button>
    </div>
  );

  const renderResults = () => {
    if (!(isCompleted && results)) return null;
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Assessment Results</h2>
          <CheckCircleIcon className="h-10 w-10 text-green-500" />
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-medium text-gray-700">Overall Score</span>
            <span className="text-3xl font-bold text-blue-600">{results.overallPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${results.overallPercentage}%` }}
            ></div>
          </div>
          <p className="text-gray-600 mt-2">
            Skill Level: <span className="font-semibold text-gray-800">{results.overallLevel}</span>
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Category Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(results.categoryResults).map(([category, result]) => (
              <div key={category} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">{category}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    result.level === 'Expert' ? 'bg-purple-100 text-purple-800' :
                    result.level === 'Advanced' ? 'bg-blue-100 text-blue-800' :
                    result.level === 'Intermediate' ? 'bg-green-100 text-green-800' :
                    result.level === 'Beginner' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {result.level}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div 
                    className={`h-2 rounded-full ${
                      result.percentage >= 80 ? 'bg-green-500' :
                      result.percentage >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${result.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{Math.round(result.percentage)}%</span>
              </div>
            ))}
          </div>
        </div>

        {results.recommendations.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recommendations</h3>
            <div className="space-y-3">
              {results.recommendations.map((rec, index) => (
                <div key={index} className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-r-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-yellow-800">{rec.category}</span>
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      rec.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-yellow-700">{rec.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={resetAssessment}
            className="btn-secondary px-6 py-3"
          >
            Retake Assessment
          </button>
          <button 
            onClick={() => onNavigateToTab && onNavigateToTab('roadmap')}
            className="btn-primary px-6 py-3"
          >
            Get Learning Roadmap
          </button>
          <button 
            onClick={() => onNavigateToTab && onNavigateToTab('careers')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Career Suggestions
          </button>
        </div>
      </div>
    );
  };

  if (!isStarted) {
    return renderStartScreen();
  }

  if (isCompleted && results) {
    return renderResults();
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold text-gray-800">Skill Assessment</h2>
          <span className="text-gray-500 font-medium">
            {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {question.category}
          </span>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          {question.question}
        </h3>

        <div className="space-y-4">
          {question.options.map((option) => (
            <label 
              key={option.value}
              className={`flex items-start p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-all ${
                answers[question.id] === option.value 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.value}
                checked={answers[question.id] === option.value}
                onChange={() => handleAnswerSelect(question.id, option.value)}
                className="mt-1 mr-4 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">{option.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button 
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className={`px-6 py-3 rounded-lg transition-colors ${
            currentQuestion === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Previous
        </button>
        <button 
          onClick={nextQuestion}
          disabled={!answers[question.id] || loading}
          className={`px-8 py-3 rounded-lg transition-colors flex items-center ${
            !answers[question.id] || loading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'btn-primary'
          }`}
        >
          {loading ? 'Processing...' : currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
          {!loading && <ChevronRightIcon className="ml-2 h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

export default SkillAssessment;
