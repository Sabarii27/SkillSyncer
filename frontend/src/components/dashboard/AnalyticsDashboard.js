import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import axios from 'axios';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  StarIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  FireIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale, // Added for Radar charts
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, 1y
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/progress/analytics?range=${timeRange}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Mock data for development
      setAnalytics(generateMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalytics = () => {
    const dates = [];
    const studyTime = [];
    const skillProgress = [];
    const completedTasks = [];
    
    // Generate data for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      studyTime.push(Math.floor(Math.random() * 120) + 30); // 30-150 minutes
      skillProgress.push(Math.floor(Math.random() * 20) + 5); // 5-25 points
      completedTasks.push(Math.floor(Math.random() * 8) + 1); // 1-8 tasks
    }

    return {
      overview: {
        totalStudyTime: 2840, // minutes
        skillsLearned: 12,
        tasksCompleted: 156,
        streakDays: 14,
        weeklyGoalProgress: 78
      },
      trends: {
        studyTimeChange: 15.3,
        skillProgressChange: 8.7,
        taskCompletionChange: -2.1,
        engagementChange: 12.5
      },
      studyTimeData: {
        labels: dates,
        datasets: [{
          label: 'Study Time (minutes)',
          data: studyTime,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      skillProgressData: {
        labels: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'MongoDB', 'CSS'],
        datasets: [{
          label: 'Skill Level',
          data: [85, 78, 65, 72, 60, 90, 55, 80],
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(147, 51, 234, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(14, 165, 233, 0.8)',
            'rgba(99, 102, 241, 0.8)'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      taskCompletionData: {
        labels: dates.slice(-7), // Last 7 days
        datasets: [{
          label: 'Tasks Completed',
          data: completedTasks.slice(-7),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 2
        }]
      },
      categoryDistribution: {
        labels: ['Frontend Development', 'Backend Development', 'Algorithms', 'System Design', 'DevOps'],
        datasets: [{
          data: [35, 25, 20, 12, 8],
          backgroundColor: [
            '#3B82F6',
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#8B5CF6'
          ],
          borderWidth: 0
        }]
      },
      weeklyComparison: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'This Week',
            data: [120, 95, 80, 110, 75, 60, 45],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2
          },
          {
            label: 'Last Week',
            data: [85, 70, 95, 80, 65, 90, 55],
            backgroundColor: 'rgba(156, 163, 175, 0.5)',
            borderColor: 'rgba(156, 163, 175, 1)',
            borderWidth: 2
          }
        ]
      }
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  const StatCard = ({ title, value, change, icon, color = 'blue' }) => {
    const isPositive = change > 0;
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200'
    };

    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
            {icon}
          </div>
          <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
            {Math.abs(change)}%
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-gray-600 text-sm">{title}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Learning Analytics</h2>
          <p className="text-gray-600">Track your progress and identify areas for improvement</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Study Time"
          value={analytics?.overview?.totalStudyTime ? `${Math.floor(analytics.overview.totalStudyTime / 60)}h ${analytics.overview.totalStudyTime % 60}m` : '0h 0m'}
          change={analytics?.trends?.studyTimeChange || 0}
          icon={<ClockIcon className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Skills Learned"
          value={analytics?.overview?.skillsLearned || 0}
          change={analytics?.trends?.skillProgressChange || 0}
          icon={<StarIcon className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Tasks Completed"
          value={analytics?.overview?.tasksCompleted || 0}
          change={analytics?.trends?.taskCompletionChange || 0}
          icon={<CheckCircleIcon className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Learning Streak"
          value={`${analytics?.overview?.streakDays || 0} days`}
          change={analytics?.trends?.engagementChange || 0}
          icon={<FireIcon className="h-6 w-6" />}
          color="yellow"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: <ChartBarIcon className="h-5 w-5" /> },
            { id: 'progress', label: 'Progress', icon: <ArrowTrendingUpIcon className="h-5 w-5" /> },
            { id: 'skills', label: 'Skills', icon: <AcademicCapIcon className="h-5 w-5" /> },
            { id: 'time', label: 'Time Analysis', icon: <CalendarDaysIcon className="h-5 w-5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Time Trend</h3>
              <div style={{ height: '300px' }}>
                <Line 
                  key={`line-chart-${timeRange}-${activeTab}`}
                  data={analytics?.studyTimeData || { labels: [], datasets: [] }} 
                  options={chartOptions} 
                />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Comparison</h3>
              <div style={{ height: '300px' }}>
                <Bar 
                  key={`bar-chart-weekly-${timeRange}-${activeTab}`}
                  data={analytics?.weeklyComparison || { labels: [], datasets: [] }} 
                  options={chartOptions} 
                />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Categories</h3>
              <div style={{ height: '300px' }}>
                <Doughnut 
                  key={`doughnut-chart-${timeRange}-${activeTab}`}
                  data={analytics?.categoryDistribution || { labels: [], datasets: [] }} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }} 
                />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h3>
              <div style={{ height: '300px' }}>
                <Bar 
                  key={`bar-chart-tasks-${timeRange}-${activeTab}`}
                  data={analytics?.taskCompletionData || { labels: [], datasets: [] }} 
                  options={chartOptions} 
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && analytics && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Proficiency Radar</h3>
            <div style={{ height: '400px' }}>
              <Radar 
                key={`radar-chart-${timeRange}-${activeTab}`}
                data={analytics?.skillProgressData || { labels: [], datasets: [] }}
                options={{
                  ...chartOptions,
                  scales: {
                    r: {
                      angleLines: {
                        display: true
                      },
                      grid: {
                        circular: true
                      },
                      pointLabels: {
                        font: {
                          size: 12
                        }
                      },
                      suggestedMin: 0,
                      suggestedMax: 100
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'progress' && analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress Over Time</h3>
              <div style={{ height: '350px' }}>
                <Line 
                  key={`line-chart-progress-${timeRange}-${activeTab}`}
                  data={{
                    ...analytics.studyTimeData,
                    datasets: [{
                      ...analytics.studyTimeData.datasets[0],
                      label: 'Skill Points Earned',
                      borderColor: 'rgb(34, 197, 94)',
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    }]
                  }} 
                  options={chartOptions} 
                />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Goal Progress</h3>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {analytics?.overview?.weeklyGoalProgress || 0}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analytics?.overview?.weeklyGoalProgress || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-600">Weekly Learning Goal</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">8.5h</div>
                    <div className="text-sm text-gray-600">This Week</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-600">12h</div>
                    <div className="text-sm text-gray-600">Target</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'time' && (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Study Pattern</h3>
              <div style={{ height: '400px' }}>
                <Bar 
                  key={`bar-chart-daily-${timeRange}-${activeTab}`}
                  data={{
                    labels: ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm'],
                    datasets: [{
                      label: 'Study Sessions',
                      data: [2, 5, 8, 12, 15, 18, 25, 20, 8],
                      backgroundColor: 'rgba(59, 130, 246, 0.8)',
                      borderColor: 'rgba(59, 130, 246, 1)',
                      borderWidth: 2
                    }]
                  }}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: true,
                        text: 'Most Active Learning Hours'
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;