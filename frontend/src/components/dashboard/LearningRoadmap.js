import React, { useState } from 'react';
import axios from 'axios';

const LearningRoadmap = ({ user }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCareer, setSelectedCareer] = useState(user?.careerGoal || 'Full Stack Developer');

  const generateRoadmap = async () => {
    setLoading(true);
    setError('');
    setRoadmap(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/roadmap/generate', {
        careerRole: selectedCareer,
        skills: user?.skills || ['JavaScript', 'React', 'Node.js']
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const userWithRoadmap = response.data.data;
      
      // Handle the AI-generated roadmap
      let roadmapData;
      if (userWithRoadmap.roadmap && Array.isArray(userWithRoadmap.roadmap)) {
        roadmapData = {
          careerRole: selectedCareer,
          stages: userWithRoadmap.roadmap
        };
      } else {
        // If the AI returned a different format, try to parse it
        roadmapData = {
          careerRole: selectedCareer,
          stages: userWithRoadmap.roadmap?.stages || []
        };
      }
      
      setRoadmap(roadmapData);
      setLoading(false);
    } catch (err) {
      console.error('Roadmap generation error:', err);
      setError(err.response?.data?.error || 'Failed to generate roadmap. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">AI Learning Roadmap</h2>
        {roadmap && (
          <div className="text-sm text-blue-600 font-medium">
            AI-Generated Path
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Career Path
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedCareer}
            onChange={(e) => setSelectedCareer(e.target.value)}
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Mobile App Developer">Mobile App Developer</option>
            <option value="AI/ML Engineer">AI/ML Engineer</option>
            <option value="Cybersecurity Specialist">Cybersecurity Specialist</option>
            <option value="Product Manager">Product Manager</option>
          </select>
          <button
            onClick={generateRoadmap}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[200px]"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate AI Roadmap
              </>
            )}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm mb-6">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        </div>
      )}
      
      {roadmap ? (
        <div>
          {/* Roadmap Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200">
            <div className="flex items-center mb-2">
              <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900">
                {roadmap.careerRole} Learning Path
              </h3>
            </div>
            <p className="text-gray-600">
              AI-generated personalized roadmap based on your skills and career goals
            </p>
          </div>

          {/* Roadmap Stages */}
          <div className="space-y-6">
            {roadmap.stages && roadmap.stages.length > 0 ? (
              roadmap.stages.map((stage, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {stage.title || `Learning Stage ${index + 1}`}
                      </h4>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {stage.description || 'No description available'}
                      </p>
                      
                      {/* Time Estimate */}
                      {stage.timeEstimate && (
                        <div className="flex items-center mb-4">
                          <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-gray-600">Estimated time: {stage.timeEstimate}</span>
                        </div>
                      )}
                      
                      {/* Resources */}
                      {stage.resources && stage.resources.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Learning Resources:
                          </h5>
                          <div className="space-y-2">
                            {stage.resources.map((resource, idx) => (
                              <div key={idx} className="flex items-center p-2 bg-white rounded border border-gray-200">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                <span className="text-gray-800">{resource}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-gray-500">
                  No roadmap stages generated. The AI may have returned an unexpected format.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Plan Your Learning Journey?</h3>
            <p className="text-gray-600 mb-6">
              Select your target career role above and let our AI create a personalized learning roadmap tailored specifically to your goals and current skills.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> The AI will analyze your profile and generate a step-by-step learning path with resources, time estimates, and practical projects.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningRoadmap;
