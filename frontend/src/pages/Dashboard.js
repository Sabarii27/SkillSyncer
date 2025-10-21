import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SkillAssessment from '../components/dashboard/SkillAssessment';
import CareerSuggestions from '../components/dashboard/CareerSuggestions';
import LearningRoadmap from '../components/dashboard/LearningRoadmap';
import AnalyticsDashboard from '../components/dashboard/AnalyticsDashboard';
import AIMentorChat from '../components/dashboard/AIMentorChat';
import PortfolioBuilder from '../components/dashboard/PortfolioBuilder';
import InterviewPrep from '../components/dashboard/InterviewPrep';
import Community from '../components/dashboard/Community';

const Dashboard = () => {
  // All hooks must be declared before any early returns
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assessment');
  const [showAIChat, setShowAIChat] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      // Set token in header if it exists
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await axios.get('/api/auth/me');
      setUser(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user:', err);
      setLoading(false);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    // Refetch user data when window regains focus (returning from profile)
    const handleFocus = () => {
      fetchUser();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Define constants after hooks but before conditional returns
  const tabs = [
    { id: 'assessment', name: 'Skill Assessment', icon: '📊' },
    { id: 'careers', name: 'Career Suggestions', icon: '🎯' },
    { id: 'roadmap', name: 'Learning Roadmap', icon: '🛣️' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'chat', name: 'AI Mentor', icon: '🤖' },
    { id: 'portfolio', name: 'Portfolio', icon: '💼' },
    { id: 'interview', name: 'Interview Prep', icon: '🎤' },
    { id: 'community', name: 'Community', icon: '👥' },
  ];

  // Early return after all hooks are declared
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false); // Close mobile menu when tab is selected
    if (tabId === 'chat') {
      setShowAIChat(true);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'assessment':
        return <SkillAssessment user={user} setUser={setUser} onNavigateToTab={handleTabClick} />;
      case 'careers':
        return <CareerSuggestions user={user} />;
      case 'roadmap':
        return <LearningRoadmap user={user} />;
      case 'analytics':
        return <AnalyticsDashboard user={user} />;
      case 'chat':
        return <div className="text-center py-12 text-gray-500">AI Mentor chat will open in a modal</div>;
      case 'portfolio':
        return <PortfolioBuilder user={user} />;
      case 'interview':
        return <InterviewPrep user={user} />;
      case 'community':
        return <Community user={user} />;
      default:
        return <SkillAssessment user={user} setUser={setUser} onNavigateToTab={handleTabClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden mr-3 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gradient">SkillSync Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <span className="hidden sm:block text-gray-700 text-sm md:text-base">Welcome, {user?.name}</span>
            <button
              onClick={() => navigate('/profile')}
              className="btn-outline py-1 px-2 md:px-3 text-xs md:text-sm"
            >
              Profile
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-4">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleTabClick(tab.id);
                    }}
                    className={`w-full text-left py-3 px-4 rounded-lg font-medium text-sm flex items-center space-x-3 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Desktop Tabs - Hidden on Mobile */}
        <div className="hidden md:block border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTabClick(tab.id);
                }}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Active Tab Indicator */}
        <div className="md:hidden mb-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{tabs.find(tab => tab.id === activeTab)?.icon}</span>
              <h2 className="text-lg font-semibold text-gray-900">
                {tabs.find(tab => tab.id === activeTab)?.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6" key={activeTab}>
          {renderTabContent()}
        </div>
      </main>

      {/* AI Mentor Chat Modal */}
      {showAIChat && (
        <AIMentorChat 
          isOpen={showAIChat} 
          onClose={() => {
            setShowAIChat(false);
            setActiveTab('assessment');
          }} 
        />
      )}

      {/* Quick Access AI Chat Button */}
      <button
        onClick={() => setShowAIChat(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        title="Ask AI Mentor"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    </div>
  );
};

export default Dashboard;
