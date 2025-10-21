import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChartBarIcon, LightBulbIcon, BookOpenIcon, StarIcon, SparklesIcon, ArrowTrendingUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const CareerSuggestions = ({ user }) => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    fetchCareerSuggestions();
  }, [user]);

  useEffect(() => {
    // Load mock data immediately if no careers are loaded
    if (careers.length === 0 && !loading) {
      loadMockData();
    }
  }, [careers.length, loading]);

  const fetchCareerSuggestions = async () => {
    setLoading(true);
    try {
      // Try to fetch AI-generated suggestions first
      if (user?.skills?.length > 0) {
        const response = await axios.post('/api/users/career-suggestions', {
          skills: user.skills,
          interests: user.interests || []
        });
        
        if (response.data.success) {
          parseAISuggestions(response.data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch AI suggestions:', error);
      // Fallback to mock data
      loadMockData();
    }
    setLoading(false);
  };

  const loadMockData = () => {
    const mockCareers = [
      {
        id: 1,
        title: 'Full Stack Developer',
        description: 'Build and maintain web applications using both frontend and backend technologies. Work on both client-side and server-side development.',
        avgSalary: '$85,000 - $120,000',
        growth: '13% (Much faster than average)',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML/CSS', 'Git'],
        match: calculateMatch(['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML/CSS', 'Git']),
        pros: ['High demand', 'Versatile skills', 'Good salary potential'],
        cons: ['Constantly evolving technology', 'High learning curve'],
        companies: ['Google', 'Meta', 'Netflix', 'Airbnb']
      },
      {
        id: 2,
        title: 'Data Scientist',
        description: 'Analyze complex datasets to extract insights and build predictive models. Drive business decisions through data.',
        avgSalary: '$95,000 - $130,000',
        growth: '15% (Much faster than average)',
        skills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization', 'R'],
        match: calculateMatch(['Python', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization', 'R']),
        pros: ['High salary', 'High impact', 'Growing field'],
        cons: ['Requires strong math background', 'Can be repetitive'],
        companies: ['Amazon', 'Microsoft', 'Tesla', 'Spotify']
      },
      {
        id: 3,
        title: 'UI/UX Designer',
        description: 'Create user-centered designs for digital products and experiences. Focus on user research and interface design.',
        avgSalary: '$70,000 - $100,000',
        growth: '8% (Faster than average)',
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Wireframing', 'HTML/CSS'],
        match: calculateMatch(['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Wireframing', 'HTML/CSS']),
        pros: ['Creative work', 'User impact', 'Flexible career paths'],
        cons: ['Subjective feedback', 'Tight deadlines'],
        companies: ['Apple', 'Uber', 'Dropbox', 'Slack']
      },
      {
        id: 4,
        title: 'DevOps Engineer',
        description: 'Bridge development and operations to improve deployment and infrastructure. Automate and optimize systems.',
        avgSalary: '$90,000 - $135,000',
        growth: '12% (Much faster than average)',
        skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'Python'],
        match: calculateMatch(['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'Python']),
        pros: ['High demand', 'System optimization', 'Good work-life balance'],
        cons: ['On-call responsibilities', 'Complex troubleshooting'],
        companies: ['Netflix', 'AWS', 'Docker', 'Red Hat']
      },
      {
        id: 5,
        title: 'Mobile App Developer',
        description: 'Build mobile applications for iOS and Android platforms. Create engaging mobile user experiences.',
        avgSalary: '$75,000 - $115,000',
        growth: '11% (Faster than average)',
        skills: ['React Native', 'Swift', 'Kotlin', 'Flutter', 'iOS', 'Android'],
        match: calculateMatch(['React Native', 'Swift', 'Kotlin', 'Flutter', 'iOS', 'Android']),
        pros: ['Growing mobile market', 'Creative potential', 'Freelance opportunities'],
        cons: ['Platform fragmentation', 'App store approval process'],
        companies: ['WhatsApp', 'Instagram', 'TikTok', 'Spotify']
      },
      {
        id: 6,
        title: 'Cybersecurity Specialist',
        description: 'Protect organizations from digital threats and vulnerabilities. Implement security measures and respond to incidents.',
        avgSalary: '$90,000 - $140,000',
        growth: '18% (Much faster than average)',
        skills: ['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Incident Response', 'Compliance'],
        match: calculateMatch(['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Incident Response', 'Compliance']),
        pros: ['High demand', 'Job security', 'Important mission'],
        cons: ['High stress', 'Constant learning required'],
        companies: ['CrowdStrike', 'Palo Alto Networks', 'Cisco', 'IBM']
      }
    ];
    
    setCareers(mockCareers.sort((a, b) => b.match - a.match));
  };

  const calculateMatch = (requiredSkills) => {
    if (!user?.skills || user.skills.length === 0) return Math.floor(Math.random() * 40) + 30; // Random 30-70% when no skills
    const userSkills = user.skills.map(s => s.toLowerCase());
    const matchingSkills = requiredSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill)
      )
    );
    return Math.round((matchingSkills.length / requiredSkills.length) * 100);
  };

  const parseAISuggestions = (aiResponse) => {
    // Parse AI response and create career objects
    // This would need to be implemented based on your AI response format
    try {
      setAiSuggestions(aiResponse);
      // For now, use mock data but this could be enhanced
      loadMockData();
    } catch (error) {
      console.error('Failed to parse AI suggestions:', error);
      loadMockData();
    }
  };

  const generateAICareerAdvice = async (career) => {
    setGeneratingAI(true);
    try {
      const response = await axios.post('/api/chat/career-advice', {
        career: career.title,
        userSkills: user?.skills || [],
        skillGap: skillGap?.missing || []
      });
      
      if (response.data.success) {
        setSelectedCareer({
          ...career,
          aiAdvice: response.data.data
        });
      }
    } catch (error) {
      console.error('Failed to generate AI advice:', error);
    }
    setGeneratingAI(false);
  };

  const analyzeSkillGap = (career) => {
    setSelectedCareer(career);
    const userSkills = (user?.skills || []).map(s => s.toLowerCase());
    const careerSkills = career.skills;
    
    const missingSkills = careerSkills.filter(skill => 
      !userSkills.some(userSkill => 
        userSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill)
      )
    );
    
    const matchingSkills = careerSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill)
      )
    );
    
    setSkillGap({
      missing: missingSkills,
      matching: matchingSkills,
      percentage: Math.round((matchingSkills.length / careerSkills.length) * 100)
    });
  };

  const setCareerGoal = async (career) => {
    try {
      await axios.put('/api/users/me', { 
        careerGoal: career.title,
        targetSkills: career.skills 
      });
      alert(`${career.title} has been set as your career goal!`);
    } catch (error) {
      console.error('Failed to set career goal:', error);
      alert('Failed to set career goal. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">AI Career Suggestions</h2>
        <button 
          onClick={fetchCareerSuggestions}
          className="btn-secondary px-4 py-2 flex items-center"
          disabled={loading}
        >
          <SparklesIcon className="h-5 w-5 mr-2" />
          {loading ? 'Refreshing...' : 'Refresh AI Suggestions'}
        </button>
      </div>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <LightBulbIcon className="h-6 w-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Personalized Career Matching</h3>
            <p className="text-blue-800">
              Our AI analyzes your skills, interests, and market trends to suggest the best career paths for you. 
              Click on any career to see detailed analysis and get personalized advice.
            </p>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {careers.map((career) => (
            <div 
              key={career.id} 
              className={`bg-white border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedCareer?.id === career.id ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => analyzeSkillGap(career)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900">{career.title}</h3>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    career.match >= 80 ? 'bg-green-100 text-green-800' :
                    career.match >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {career.match}% match
                  </span>
                  {career.match >= 80 && <StarIcon className="h-4 w-4 text-yellow-500 mt-1" />}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 leading-relaxed">{career.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <ChartBarIcon className="h-4 w-4 text-green-600 mr-2" />
                  <span className="font-medium text-gray-700">Salary:</span>
                  <span className="text-gray-600 ml-1">{career.avgSalary}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-700">Growth:</span>
                  <span className="text-gray-600 ml-1">{career.growth}</span>
                </div>
              </div>

              {career.companies && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Top Companies:</h4>
                  <div className="flex flex-wrap gap-1">
                    {career.companies.slice(0, 3).map((company, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Skills:</h4>
                <div className="flex flex-wrap gap-1">
                  {career.skills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {skill}
                    </span>
                  ))}
                  {career.skills.length > 4 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      +{career.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {skillGap && selectedCareer && (
        <div className="mt-8 border-t pt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Career Analysis: {selectedCareer.title}
            </h3>
            <button 
              onClick={() => generateAICareerAdvice(selectedCareer)}
              disabled={generatingAI}
              className="btn-secondary px-4 py-2 flex items-center"
            >
              <SparklesIcon className="h-4 w-4 mr-2" />
              {generatingAI ? 'Generating...' : 'Get AI Advice'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Skill Match Score</h4>
                  <span className={`text-2xl font-bold ${
                    skillGap.percentage >= 80 ? 'text-green-600' :
                    skillGap.percentage >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {skillGap.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      skillGap.percentage >= 80 ? 'bg-green-500' :
                      skillGap.percentage >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${skillGap.percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {skillGap.percentage >= 80 ? 'Excellent match! You have most required skills.' :
                   skillGap.percentage >= 60 ? 'Good match with some skill development needed.' :
                   'Consider developing more skills for this career path.'}
                </p>
              </div>
            </div>
            
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Quick Stats</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Skills Match:</span>
                  <span className="font-medium">{skillGap.matching.length}/{selectedCareer.skills.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Skills to Learn:</span>
                  <span className="font-medium">{skillGap.missing.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Demand:</span>
                  <span className="font-medium text-green-600">High</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Skills You Have ({skillGap.matching.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {skillGap.matching.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
                {skillGap.matching.length === 0 && (
                  <p className="text-green-700 italic">Start building foundational skills for this career!</p>
                )}
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                <BookOpenIcon className="h-5 w-5 mr-2" />
                Skills to Develop ({skillGap.missing.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {skillGap.missing.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
                {skillGap.missing.length === 0 && (
                  <p className="text-orange-700 italic">Congratulations! You have all required skills!</p>
                )}
              </div>
            </div>
          </div>

          {selectedCareer.pros && selectedCareer.cons && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Pros</h4>
                <ul className="space-y-2">
                  {selectedCareer.pros.map((pro, index) => (
                    <li key={index} className="flex items-center text-blue-800">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-red-900 mb-3">Considerations</h4>
                <ul className="space-y-2">
                  {selectedCareer.cons.map((con, index) => (
                    <li key={index} className="flex items-center text-red-800">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {selectedCareer.aiAdvice && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2" />
                AI Career Advice
              </h4>
              <p className="text-purple-800 leading-relaxed">{selectedCareer.aiAdvice}</p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setCareerGoal(selectedCareer)}
              className="btn-primary px-8 py-3 flex items-center justify-center"
            >
              <StarIcon className="h-5 w-5 mr-2" />
              Set as Career Goal
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard/roadmap'}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              <BookOpenIcon className="h-5 w-5 mr-2" />
              Get Learning Roadmap
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard/interview'}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              Practice Interview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerSuggestions;
