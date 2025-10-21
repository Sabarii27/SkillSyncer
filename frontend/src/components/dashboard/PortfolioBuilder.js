import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  PlusIcon,
  TrashIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import {
  UserCircleIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  StarIcon,
  LinkIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  GlobeAltIcon
} from '@heroicons/react/24/solid';

const PortfolioBuilder = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('modern');
  const [activeSection, setActiveSection] = useState('personal');
  const previewRef = useRef(null);

  const themes = {
    modern: {
      name: 'Modern',
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#F3F4F6',
      text: '#111827'
    },
    professional: {
      name: 'Professional',
      primary: '#1F2937',
      secondary: '#374151',
      accent: '#F9FAFB',
      text: '#111827'
    },
    creative: {
      name: 'Creative',
      primary: '#7C3AED',
      secondary: '#5B21B6',
      accent: '#FAF5FF',
      text: '#1F2937'
    },
    minimal: {
      name: 'Minimal',
      primary: '#059669',
      secondary: '#047857',
      accent: '#ECFDF5',
      text: '#064E3B'
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const response = await axios.get('/api/portfolio');
      setPortfolio(response.data);
    } catch (error) {
      // Initialize with default portfolio structure
      setPortfolio(createDefaultPortfolio());
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPortfolio = () => ({
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: ''
    },
    experience: [],
    education: [],
    projects: [],
    skills: [],
    certifications: [],
    theme: 'modern',
    sections: ['personal', 'experience', 'education', 'projects', 'skills', 'certifications']
  });

  const savePortfolio = async () => {
    setSaving(true);
    try {
      await axios.put('/api/portfolio', portfolio);
    } catch (error) {
      console.error('Failed to save portfolio:', error);
    } finally {
      setSaving(false);
    }
  };

  const exportPDF = async () => {
    try {
      const response = await axios.post('/api/portfolio/export', portfolio, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${portfolio.personalInfo.fullName || 'portfolio'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      company: '',
      position: '',
      duration: '',
      location: '',
      description: '',
      technologies: []
    };
    setPortfolio(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const updateExperience = (id, field, value) => {
    setPortfolio(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id) => {
    setPortfolio(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: '',
      description: '',
      technologies: [],
      liveUrl: '',
      githubUrl: '',
      image: ''
    };
    setPortfolio(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (id, field, value) => {
    setPortfolio(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (id) => {
    setPortfolio(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  const addSkill = (category) => {
    const newSkill = {
      id: Date.now(),
      name: '',
      level: 50,
      category: category
    };
    setPortfolio(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (id, field, value) => {
    setPortfolio(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (id) => {
    setPortfolio(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const PersonalInfoEditor = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={portfolio?.personalInfo?.fullName || ''}
            onChange={(e) => setPortfolio(prev => ({
              ...prev,
              personalInfo: { ...prev?.personalInfo, fullName: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
          <input
            type="text"
            value={portfolio?.personalInfo?.title || ''}
            onChange={(e) => setPortfolio(prev => ({
              ...prev,
              personalInfo: { ...prev?.personalInfo, title: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Full Stack Developer"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={portfolio?.personalInfo?.email || ''}
            onChange={(e) => setPortfolio(prev => ({
              ...prev,
              personalInfo: { ...prev?.personalInfo, email: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="john@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={portfolio?.personalInfo?.phone || ''}
            onChange={(e) => setPortfolio(prev => ({
              ...prev,
              personalInfo: { ...prev?.personalInfo, phone: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={portfolio?.personalInfo?.location || ''}
            onChange={(e) => setPortfolio(prev => ({
              ...prev,
              personalInfo: { ...prev?.personalInfo, location: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="New York, NY"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            type="url"
            value={portfolio?.personalInfo?.website || ''}
            onChange={(e) => setPortfolio(prev => ({
              ...prev,
              personalInfo: { ...prev?.personalInfo, website: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="https://johndoe.dev"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
        <textarea
          value={portfolio?.personalInfo?.summary || ''}
          onChange={(e) => setPortfolio(prev => ({
            ...prev,
            personalInfo: { ...prev?.personalInfo, summary: e.target.value }
          }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Brief description of your background and expertise..."
        />
      </div>
    </div>
  );

  const ExperienceEditor = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
        <button
          onClick={addExperience}
          className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Experience
        </button>
      </div>
      
      {portfolio.experience.map((exp, index) => (
        <div key={exp.id} className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="text-md font-medium text-gray-900">Experience #{index + 1}</h4>
            <button
              onClick={() => removeExperience(exp.id)}
              className="text-red-500 hover:text-red-700"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={exp.company}
              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Company Name"
            />
            <input
              type="text"
              value={exp.position}
              onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Position Title"
            />
            <input
              type="text"
              value={exp.duration}
              onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Jan 2020 - Present"
            />
            <input
              type="text"
              value={exp.location}
              onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Location"
            />
          </div>
          
          <textarea
            value={exp.description}
            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your role and achievements..."
          />
        </div>
      ))}
    </div>
  );

  const ProjectsEditor = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
        <button
          onClick={addProject}
          className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Project
        </button>
      </div>
      
      {portfolio.projects.map((project, index) => (
        <div key={project.id} className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="text-md font-medium text-gray-900">Project #{index + 1}</h4>
            <button
              onClick={() => removeProject(project.id)}
              className="text-red-500 hover:text-red-700"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              value={project.name}
              onChange={(e) => updateProject(project.id, 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Project Name"
            />
            
            <textarea
              value={project.description}
              onChange={(e) => updateProject(project.id, 'description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Project description..."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="url"
                value={project.liveUrl}
                onChange={(e) => updateProject(project.id, 'liveUrl', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Live URL"
              />
              <input
                type="url"
                value={project.githubUrl}
                onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="GitHub URL"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const SkillsEditor = () => {
    const skillCategories = ['Technical', 'Languages', 'Frameworks', 'Tools', 'Soft Skills'];
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
        
        {skillCategories.map(category => (
          <div key={category} className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium text-gray-700">{category}</h4>
              <button
                onClick={() => addSkill(category)}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                + Add {category} Skill
              </button>
            </div>
            
            <div className="space-y-3">
              {portfolio.skills
                .filter(skill => skill.category === category)
                .map(skill => (
                  <div key={skill.id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="Skill name"
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 w-8">{skill.level}%</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.level}
                        onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                        className="w-24"
                      />
                    </div>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const PortfolioPreview = () => {
    const theme = themes[selectedTheme];
    
    return (
      <div ref={previewRef} className="bg-white min-h-screen" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <div style={{ backgroundColor: theme.primary, color: 'white', padding: '40px' }}>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">{portfolio.personalInfo.fullName || 'Your Name'}</h1>
            <p className="text-xl opacity-90">{portfolio.personalInfo.title || 'Professional Title'}</p>
            
            <div className="flex justify-center space-x-6 mt-6 text-sm">
              {portfolio.personalInfo.email && (
                <div className="flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {portfolio.personalInfo.email}
                </div>
              )}
              {portfolio.personalInfo.phone && (
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  {portfolio.personalInfo.phone}
                </div>
              )}
              {portfolio.personalInfo.location && (
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {portfolio.personalInfo.location}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-w-4xl mx-auto">
          {/* Summary */}
          {portfolio.personalInfo.summary && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primary }}>
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{portfolio.personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {portfolio.experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primary }}>
                Work Experience
              </h2>
              <div className="space-y-6">
                {portfolio.experience.map(exp => (
                  <div key={exp.id} className="border-l-4 pl-4" style={{ borderColor: theme.secondary }}>
                    <h3 className="text-xl font-semibold">{exp.position}</h3>
                    <p className="text-lg" style={{ color: theme.secondary }}>{exp.company}</p>
                    <p className="text-gray-600 mb-2">{exp.duration} • {exp.location}</p>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {portfolio.projects.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primary }}>
                Projects
              </h2>
              <div className="grid gap-6">
                {portfolio.projects.map(project => (
                  <div key={project.id} className="border rounded-lg p-4" style={{ borderColor: theme.accent }}>
                    <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                    <p className="text-gray-700 mb-3">{project.description}</p>
                    <div className="flex space-x-4">
                      {project.liveUrl && (
                        <a href={project.liveUrl} className="text-blue-600 hover:underline">
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} className="text-blue-600 hover:underline">
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {portfolio.skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: theme.primary }}>
                Skills
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['Technical', 'Languages', 'Frameworks', 'Tools', 'Soft Skills'].map(category => {
                  const categorySkills = portfolio.skills.filter(skill => skill.category === category);
                  if (categorySkills.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: theme.secondary }}>
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {categorySkills.map(skill => (
                          <div key={skill.id}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{skill.name}</span>
                              <span className="text-sm text-gray-600">{skill.level}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{ 
                                  width: `${skill.level}%`,
                                  backgroundColor: theme.primary
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Editor Panel */}
      <div className={`${showPreview ? 'w-1/2' : 'w-full'} bg-gray-50 overflow-y-auto transition-all duration-300`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Portfolio Builder</h2>
              <p className="text-gray-600">Create and customize your professional portfolio</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              
              <button
                onClick={exportPDF}
                className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Export PDF
              </button>
              
              <button
                onClick={savePortfolio}
                disabled={saving}
                className="flex items-center px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose Theme</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTheme(key)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    selectedTheme === key ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                    ></div>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.secondary }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section Navigation */}
          <div className="mb-6">
            <nav className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { id: 'personal', label: 'Personal Info', icon: <UserCircleIcon className="h-4 w-4" /> },
                { id: 'experience', label: 'Experience', icon: <BriefcaseIcon className="h-4 w-4" /> },
                { id: 'projects', label: 'Projects', icon: <AcademicCapIcon className="h-4 w-4" /> },
                { id: 'skills', label: 'Skills', icon: <StarIcon className="h-4 w-4" /> }
              ].map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {section.icon}
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Section Content */}
          <div className="bg-white rounded-lg p-6">
            {activeSection === 'personal' && portfolio && <PersonalInfoEditor />}
            {activeSection === 'experience' && portfolio && <ExperienceEditor />}
            {activeSection === 'projects' && portfolio && <ProjectsEditor />}
            {activeSection === 'skills' && portfolio && <SkillsEditor />}
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      {showPreview && (
        <div className="w-1/2 bg-white border-l border-gray-200 overflow-y-auto">
          <PortfolioPreview />
        </div>
      )}
    </div>
  );
};

export default PortfolioBuilder;