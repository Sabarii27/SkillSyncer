const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize OpenAI only if API key is provided
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Initialize Google Generative AI only if API key is provided
let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Generate career suggestions with AI
const generateCareerSuggestions = async (skills, interests) => {
  try {
    // Use OpenAI by default, fallback to Gemini if OpenAI key is not provided
    if (openai) {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a career guidance expert. Based on the user\'s skills and interests, suggest 5 relevant career paths with a brief description of each and a skill gap analysis.'
          },
          {
            role: 'user',
            content: `Skills: ${skills.join(', ')}\nInterests: ${interests.join(', ')}`
          }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1000,
      });

      return completion.choices[0].message.content;
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `You are a career guidance expert. Based on the user's skills and interests, suggest 5 relevant career paths with a brief description of each and a skill gap analysis.
      
Skills: ${skills.join(', ')}
Interests: ${interests.join(', ')}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } else {
      // Return mock data when no AI API keys are available
      return getMockCareerSuggestions(skills, interests);
    }
  } catch (error) {
    console.error('AI Career Suggestions Error:', error);
    // Return mock data on error
    return getMockCareerSuggestions(skills, interests);
  }
};

// Generate learning roadmap with AI
const generateRoadmapWithAI = async (careerRole, skills) => {
  try {
    // Use OpenAI by default, fallback to Gemini if OpenAI key is not provided
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a learning path expert. Create a detailed learning roadmap with 5-7 stages for the specified career role. Each stage should have a title, description, timeEstimate, and detailed resources array with specific technologies, tools, courses, and books. Be very specific about technologies to learn (e.g., HTML, CSS, JavaScript, React, Node.js, MongoDB, etc.). Return the response in JSON format with a "stages" array.'
          },
          {
            role: 'user',
            content: `Career Role: ${careerRole}\nCurrent Skills: ${skills.join(', ')}\n\nPlease include specific technologies, programming languages, frameworks, and tools for each stage. For example, if Full Stack Developer, include HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, etc.`
          }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(completion.choices[0].message.content);
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `You are a learning path expert. Create a detailed learning roadmap with 5-7 stages for the specified career role. Each stage should have a title, description, timeEstimate, and detailed resources array with specific technologies, tools, courses, and books. Be very specific about technologies to learn.

For ${careerRole}, include specific technologies like:
- If Full Stack Developer: HTML, CSS, JavaScript, React, Vue.js, Node.js, Express.js, MongoDB, PostgreSQL, Git, Docker, AWS
- If Data Scientist: Python, R, SQL, Pandas, NumPy, Scikit-learn, TensorFlow, Jupyter, Tableau, Power BI
- If UI/UX Designer: Figma, Adobe XD, Sketch, HTML/CSS, JavaScript basics, Design Systems, User Research methods
- If DevOps Engineer: Linux, Docker, Kubernetes, Jenkins, Git, AWS/Azure, Terraform, Ansible, CI/CD
- If Mobile Developer: React Native, Flutter, Swift, Kotlin, Java, Firebase, API integration
- If AI/ML Engineer: Python, TensorFlow, PyTorch, Keras, OpenCV, Natural Language Processing, Deep Learning
- If Cybersecurity: Network Security, Penetration Testing, CISSP, Ethical Hacking, Firewalls, SIEM tools
- If Product Manager: Agile/Scrum, Jira, Product Analytics, User Stories, Market Research, SQL basics

Career Role: ${careerRole}
Current Skills: ${skills.join(', ')}

Return the response in JSON format with this structure:
{
  "stages": [
    {
      "title": "Stage Name",
      "description": "Detailed description",
      "timeEstimate": "2-4 weeks",
      "resources": ["Specific technology 1", "Specific technology 2", "Course name", "Book title"]
    }
  ]
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } else {
      // Return mock data when no AI API keys are available
      return getMockRoadmap(careerRole, skills);
    }
  } catch (error) {
    console.error('AI Roadmap Generation Error:', error);
    // Return mock data on error
    return getMockRoadmap(careerRole, skills);
  }
};

// Generate AI chat response
const generateAIChatResponse = async (messages) => {
  try {
    console.log('AI Chat Request - Messages:', messages);
    console.log('Environment check - GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
    console.log('Environment check - GEMINI_API_KEY value:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'undefined');
    
    // Use OpenAI by default, fallback to Gemini if OpenAI key is not provided
    if (openai) {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an AI career mentor. Help users with career guidance, skill development, and learning paths. Be encouraging and provide specific, actionable advice.'
          },
          ...messages.map(msg => ({
            role: msg.role === 'ai' ? 'assistant' : msg.role,
            content: msg.text || msg.content
          }))
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0].message.content;
    } else if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      console.log('Using Gemini AI for chat response');
      // Initialize Gemini at runtime to ensure environment variables are loaded
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      // For Gemini, we'll use a simple approach - just send the latest message
      const latestMessage = messages[messages.length - 1];
      const userMessage = latestMessage.text || latestMessage.content || '';
      
      const prompt = `You are an AI career mentor. Help users with career guidance, skill development, and learning paths. Be encouraging and provide specific, actionable advice.

User: ${userMessage}

Please provide a helpful response:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();
      
      // Truncate response if it's too long (keep under 8000 chars to be safe)
      if (aiResponse.length > 8000) {
        return aiResponse.substring(0, 8000) + '...\n\n[Response truncated due to length. Please ask a more specific question for a detailed answer.]';
      }
      
      return aiResponse;
    } else {
      console.log('No AI API available, using mock response');
      // Return mock response when no AI API keys are available
      return getMockChatResponse(messages);
    }
  } catch (error) {
    console.error('AI Chat Error:', error);
    // Return mock response on error
    return getMockChatResponse(messages);
  }
};

// Generate portfolio summary with AI
const generatePortfolioSummary = async (skills, careerGoal) => {
  try {
    // Use OpenAI by default, fallback to Gemini if OpenAI key is not provided
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a career portfolio expert. Create a professional portfolio summary based on the user\'s skills and career goal. Include sections for professional summary, key skills, and career objective. Keep it concise and professional.'
          },
          {
            role: 'user',
            content: `Skills: ${skills.join(', ')}\nCareer Goal: ${careerGoal}`
          }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0].message.content;
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `You are a career portfolio expert. Create a professional portfolio summary based on the user's skills and career goal. Include sections for professional summary, key skills, and career objective. Keep it concise and professional.
      
Skills: ${skills.join(', ')}
Career Goal: ${careerGoal}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } else {
      // Return mock portfolio summary when no AI API keys are available
      return getMockPortfolioSummary(skills, careerGoal);
    }
  } catch (error) {
    console.error('AI Portfolio Summary Error:', error);
    // Return mock data on error
    return getMockPortfolioSummary(skills, careerGoal);
  }
};

// Generate interview questions with AI
const generateInterviewQuestions = async (careerRole, skills) => {
  try {
    // Use OpenAI by default, fallback to Gemini if OpenAI key is not provided
    if (openai) {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an interview preparation expert. Generate 10 relevant interview questions for the specified career role, considering the user\'s skills. Include both technical and behavioral questions. Provide concise answers for each question.'
          },
          {
            role: 'user',
            content: `Career Role: ${careerRole}\nSkills: ${skills.join(', ')}`
          }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1500,
      });

      return completion.choices[0].message.content;
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `You are an interview preparation expert. Generate 10 relevant interview questions for the specified career role, considering the user's skills. Include both technical and behavioral questions. Provide concise answers for each question.
      
Career Role: ${careerRole}
Skills: ${skills.join(', ')}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } else {
      // Return mock interview questions when no AI API keys are available
      return getMockInterviewQuestions(careerRole, skills);
    }
  } catch (error) {
    console.error('AI Interview Questions Error:', error);
    // Return mock data on error
    return getMockInterviewQuestions(careerRole, skills);
  }
};

// Mock data functions for development without API keys
const getMockCareerSuggestions = (skills, interests) => {
  return `Based on your skills (${skills.join(', ')}) and interests (${interests.join(', ')}), here are 5 career paths to consider:

**1. Full Stack Developer**
- Combines both frontend and backend development
- High demand in the tech industry
- Average salary: $75,000 - $120,000
- Skills to develop: Advanced JavaScript, Database design, Cloud services

**2. Data Analyst**
- Work with data to provide business insights
- Growing field with excellent opportunities
- Average salary: $65,000 - $95,000
- Skills to develop: SQL, Python/R, Data visualization tools

**3. UI/UX Designer**
- Create user-centered digital experiences
- Creative and technical combination
- Average salary: $70,000 - $110,000
- Skills to develop: Design systems, User research, Prototyping tools

**4. DevOps Engineer**
- Bridge development and operations teams
- High-demand specialized role
- Average salary: $85,000 - $130,000
- Skills to develop: Docker, Kubernetes, CI/CD, Cloud platforms

**5. Product Manager**
- Lead product strategy and development
- Combines technical and business skills
- Average salary: $90,000 - $140,000
- Skills to develop: Business analysis, Agile methodologies, Stakeholder management

**Skill Gap Analysis:**
Focus on developing cloud computing skills and learning modern frameworks to stay competitive in today's market.`;
};

const getMockRoadmap = (careerRole, skills) => {
  const roadmaps = {
    'Full Stack Developer': {
      stages: [
        {
          id: 1,
          title: "Frontend Fundamentals",
          description: "Master the building blocks of web development",
          resources: ["HTML5", "CSS3", "JavaScript ES6+", "Responsive Design", "CSS Flexbox", "CSS Grid", "DOM Manipulation", "Fetch API"],
          timeEstimate: "3-4 weeks"
        },
        {
          id: 2,
          title: "Frontend Framework",
          description: "Learn modern frontend development with React",
          resources: ["React.js", "JSX", "React Hooks", "State Management", "React Router", "Component Lifecycle", "Props & State", "Event Handling"],
          timeEstimate: "4-6 weeks"
        },
        {
          id: 3,
          title: "Backend Development",
          description: "Build server-side applications and APIs",
          resources: ["Node.js", "Express.js", "RESTful APIs", "HTTP Methods", "Middleware", "Authentication", "JWT Tokens", "bcrypt"],
          timeEstimate: "4-5 weeks"
        },
        {
          id: 4,
          title: "Database Integration",
          description: "Learn to work with databases and data persistence",
          resources: ["MongoDB", "Mongoose ODM", "Database Design", "CRUD Operations", "Aggregation", "Indexing", "Database Relationships"],
          timeEstimate: "3-4 weeks"
        },
        {
          id: 5,
          title: "Advanced Tools & Deployment",
          description: "Master development tools and deployment strategies",
          resources: ["Git & GitHub", "npm/yarn", "Webpack", "Docker", "AWS/Heroku", "CI/CD", "Environment Variables", "API Testing"],
          timeEstimate: "3-4 weeks"
        },
        {
          id: 6,
          title: "Full Stack Projects",
          description: "Build complete applications from frontend to backend",
          resources: ["MERN Stack Projects", "Portfolio Website", "E-commerce App", "Social Media App", "Real-time Chat App", "Blog Platform"],
          timeEstimate: "6-8 weeks"
        }
      ]
    },
    'Data Scientist': {
      stages: [
        {
          id: 1,
          title: "Programming Foundations",
          description: "Master essential programming languages for data science",
          resources: ["Python", "R", "Jupyter Notebooks", "Anaconda", "Package Management", "Virtual Environments", "Git Version Control"],
          timeEstimate: "3-4 weeks"
        },
        {
          id: 2,
          title: "Data Manipulation & Analysis",
          description: "Learn to clean, manipulate, and analyze data",
          resources: ["Pandas", "NumPy", "Data Cleaning", "Data Wrangling", "Exploratory Data Analysis", "Statistical Analysis", "Data Visualization"],
          timeEstimate: "4-5 weeks"
        },
        {
          id: 3,
          title: "Database & SQL",
          description: "Master database operations and SQL queries",
          resources: ["SQL", "PostgreSQL", "MySQL", "Database Design", "Joins", "Subqueries", "Aggregations", "Data Warehousing"],
          timeEstimate: "3-4 weeks"
        },
        {
          id: 4,
          title: "Machine Learning",
          description: "Build predictive models and understand ML algorithms",
          resources: ["Scikit-learn", "Machine Learning Algorithms", "Supervised Learning", "Unsupervised Learning", "Model Evaluation", "Cross-validation"],
          timeEstimate: "5-6 weeks"
        },
        {
          id: 5,
          title: "Data Visualization & BI Tools",
          description: "Create compelling visualizations and dashboards",
          resources: ["Matplotlib", "Seaborn", "Plotly", "Tableau", "Power BI", "Dashboard Design", "Storytelling with Data"],
          timeEstimate: "3-4 weeks"
        },
        {
          id: 6,
          title: "Advanced Analytics & Deployment",
          description: "Deep learning and model deployment in production",
          resources: ["TensorFlow", "Keras", "Deep Learning", "Model Deployment", "Cloud Platforms", "MLOps", "Data Pipeline"],
          timeEstimate: "4-6 weeks"
        }
      ]
    },
    'UI/UX Designer': {
      stages: [
        {
          id: 1,
          title: "Design Fundamentals",
          description: "Master core design principles and theory",
          resources: ["Design Principles", "Color Theory", "Typography", "Layout & Composition", "Visual Hierarchy", "Design Systems", "Accessibility"],
          timeEstimate: "3-4 weeks"
        },
        {
          id: 2,
          title: "Design Tools Mastery",
          description: "Learn industry-standard design software",
          resources: ["Figma", "Adobe XD", "Sketch", "Adobe Photoshop", "Adobe Illustrator", "Prototyping Tools", "Design Handoff"],
          timeEstimate: "4-5 weeks"
        },
        {
          id: 3,
          title: "User Research & Testing",
          description: "Understand user needs through research and testing",
          resources: ["User Research Methods", "User Interviews", "Surveys", "Usability Testing", "A/B Testing", "User Personas", "Journey Mapping"],
          timeEstimate: "3-4 weeks"
        },
        {
          id: 4,
          title: "Wireframing & Prototyping",
          description: "Create wireframes and interactive prototypes",
          resources: ["Wireframing", "Low-fidelity Prototypes", "High-fidelity Prototypes", "Interactive Prototypes", "Design Patterns", "Information Architecture"],
          timeEstimate: "4-5 weeks"
        },
        {
          id: 5,
          title: "Frontend Implementation",
          description: "Learn basic frontend development for better collaboration",
          resources: ["HTML5", "CSS3", "JavaScript Basics", "Responsive Design", "CSS Frameworks", "Design-to-Code Workflow", "Developer Handoff"],
          timeEstimate: "4-5 weeks"
        },
        {
          id: 6,
          title: "Portfolio & Professional Development",
          description: "Build a strong portfolio and professional presence",
          resources: ["Portfolio Design", "Case Studies", "Design Documentation", "Presentation Skills", "Client Communication", "Freelancing", "Design Communities"],
          timeEstimate: "3-4 weeks"
        }
      ]
    }
  };

  // Return specific roadmap for the career role, or default if not found
  return roadmaps[careerRole] || {
    stages: [
      {
        id: 1,
        title: "Foundation Building",
        description: "Master the fundamental concepts and tools",
        resources: ["Core Technologies", "Industry Tools", "Best Practices", "Documentation", "Online Courses", "Practice Projects"],
        timeEstimate: "2-4 weeks"
      },
      {
        id: 2,
        title: "Intermediate Development",
        description: "Build practical projects and deepen understanding",
        resources: ["Advanced Concepts", "Framework Knowledge", "Database Skills", "API Integration", "Testing", "Version Control"],
        timeEstimate: "4-6 weeks"
      },
      {
        id: 3,
        title: "Advanced Specialization",
        description: "Focus on specialized skills for your chosen path",
        resources: ["Industry Certifications", "Advanced Tools", "Architecture Patterns", "Performance Optimization", "Security", "Scalability"],
        timeEstimate: "6-8 weeks"
      },
      {
        id: 4,
        title: "Portfolio Development",
        description: "Create showcase projects and build your professional presence",
        resources: ["Portfolio Projects", "GitHub Profile", "Professional Networking", "Resume Building", "LinkedIn Optimization", "Personal Branding"],
        timeEstimate: "3-4 weeks"
      },
      {
        id: 5,
        title: "Job Market Preparation",
        description: "Prepare for interviews and job applications",
        resources: ["Technical Interviews", "System Design", "Behavioral Questions", "Mock Interviews", "Salary Negotiation", "Job Search Strategy"],
        timeEstimate: "2-3 weeks"
      }
    ]
  };
};

const getMockChatResponse = (messages) => {
  const lastMessage = messages[messages.length - 1];
  const userMessage = lastMessage.content || lastMessage.text || '';
  
  // Simple keyword-based responses
  if (userMessage.toLowerCase().includes('career')) {
    return "I'd be happy to help with career guidance! What specific aspect of your career are you looking to develop? Are you exploring new roles, looking to advance in your current field, or considering a career change?";
  } else if (userMessage.toLowerCase().includes('skill')) {
    return "Skills development is crucial for career growth! Based on current market trends, I recommend focusing on both technical skills relevant to your field and soft skills like communication and problem-solving. What area would you like to develop?";
  } else if (userMessage.toLowerCase().includes('interview')) {
    return "Interview preparation is key to landing your dream job! I suggest practicing both technical questions specific to your role and behavioral questions using the STAR method (Situation, Task, Action, Result). Would you like help with specific interview topics?";
  } else if (userMessage.toLowerCase().includes('learn')) {
    return "Learning new skills is exciting! I recommend a structured approach: start with fundamentals, practice through projects, get feedback, and apply your knowledge. What would you like to learn?";
  } else {
    return "That's a great question! While I don't have access to real-time AI right now (API keys not configured), I'm here to help with career guidance, skill development, learning paths, and interview preparation. Feel free to ask about any of these topics!";
  }
};

const getMockPortfolioSummary = (skills, careerGoal) => {
  return `**Professional Summary**
Dynamic and motivated professional with expertise in ${skills.slice(0, 3).join(', ')} and a passion for ${careerGoal}. Demonstrated ability to learn quickly, adapt to new technologies, and deliver high-quality results in fast-paced environments.

**Key Skills**
${skills.map(skill => `• ${skill}`).join('\n')}

**Career Objective**
Seeking to leverage my technical skills and experience to contribute to ${careerGoal} while continuing to grow and develop new competencies in emerging technologies and industry best practices.

**Core Competencies**
- Problem-solving and analytical thinking
- Collaborative teamwork and communication
- Continuous learning and adaptability
- Project management and organization
- Technical documentation and knowledge sharing`;
};

const getMockInterviewQuestions = (careerRole, skills) => {
  return `Here are 10 relevant interview questions for ${careerRole}:

**Technical Questions:**
1. Describe your experience with ${skills[0] || 'relevant technologies'} and how you've applied it in projects.
2. What challenges have you faced when working with ${skills[1] || 'your main skill'} and how did you overcome them?
3. How do you stay updated with the latest trends and technologies in your field?
4. Can you walk me through your problem-solving process when faced with a complex technical challenge?

**Behavioral Questions:**
5. Tell me about a time when you had to work with a difficult team member. How did you handle the situation?
6. Describe a project where you had to learn something completely new. How did you approach it?
7. Give me an example of a time when you had to meet a tight deadline. How did you manage your time and priorities?
8. Tell me about a mistake you made in a previous role and what you learned from it.

**Role-Specific Questions:**
9. Why are you interested in working as a ${careerRole}? What motivates you about this role?
10. Where do you see yourself in 5 years, and how does this position align with your career goals?

**Preparation Tips:**
- Use the STAR method (Situation, Task, Action, Result) for behavioral questions
- Prepare specific examples from your experience
- Research the company and role thoroughly
- Practice explaining technical concepts clearly`;
};

module.exports = {
  generateCareerSuggestions,
  generateRoadmapWithAI,
  generateAIChatResponse,
  generatePortfolioSummary,
  generateInterviewQuestions
};
