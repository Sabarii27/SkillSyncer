const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const { generatePortfolioSummary } = require('../utils/ai');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// @desc    Get user portfolio
// @route   GET /api/portfolio
// @access  Private
exports.getPortfolio = async (req, res, next) => {
  try {
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    
    if (!portfolio) {
      // Create default portfolio if doesn't exist
      const user = await User.findById(req.user.id);
      portfolio = await Portfolio.create({
        user: req.user.id,
        personalInfo: {
          fullName: user.name,
          title: 'Professional',
          email: user.email
        },
        summary: 'Professional summary will be generated here.',
        skills: {
          technical: [],
          soft: []
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: portfolio
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update portfolio
// @route   PUT /api/portfolio
// @access  Private
exports.updatePortfolio = async (req, res, next) => {
  try {
    let portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: portfolio
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Generate AI-powered portfolio summary
// @route   POST /api/portfolio/generate-summary
// @access  Private
exports.generatePortfolioAI = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    const user = await User.findById(req.user.id);
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }
    
    // Extract skills for AI generation
    const skills = portfolio.skills.technical.map(s => s.name).concat(user.skills || []);
    const careerGoal = user.careerGoal || portfolio.personalInfo.title;
    
    // Generate portfolio summary using AI
    const aiSummary = await generatePortfolioSummary(skills, careerGoal);
    
    // Update portfolio with AI-generated summary
    portfolio.summary = aiSummary;
    await portfolio.save();
    
    res.status(200).json({
      success: true,
      data: { summary: aiSummary }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Add experience to portfolio
// @route   POST /api/portfolio/experience
// @access  Private
exports.addExperience = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }
    
    portfolio.experience.push(req.body);
    await portfolio.save();
    
    res.status(200).json({
      success: true,
      data: portfolio.experience
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Add project to portfolio
// @route   POST /api/portfolio/project
// @access  Private
exports.addProject = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }
    
    portfolio.projects.push(req.body);
    await portfolio.save();
    
    res.status(200).json({
      success: true,
      data: portfolio.projects
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get public portfolio by slug
// @route   GET /api/portfolio/public/:slug
// @access  Public
exports.getPublicPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ 
      slug: req.params.slug,
      visibility: 'public' 
    });
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }
    
    // Increment views
    portfolio.views += 1;
    await portfolio.save();
    
    res.status(200).json({
      success: true,
      data: portfolio
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Export portfolio as PDF
// @route   GET /api/portfolio/export
// @access  Private
exports.exportPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }
    
    // Create a document
    const doc = new PDFDocument({ margin: 50 });
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${portfolio.personalInfo.fullName.replace(/\s+/g, '_')}_Portfolio.pdf`);
    
    // Pipe the PDF to the response
    doc.pipe(res);
    
    // Header
    doc.fontSize(24).text(portfolio.personalInfo.fullName, { align: 'center' });
    doc.fontSize(16).text(portfolio.personalInfo.title, { align: 'center' });
    doc.fontSize(12).text(portfolio.personalInfo.email, { align: 'center' });
    if (portfolio.personalInfo.phone) {
      doc.text(portfolio.personalInfo.phone, { align: 'center' });
    }
    doc.moveDown(2);
    
    // Summary
    doc.fontSize(16).text('Professional Summary', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text(portfolio.summary, { align: 'justify' });
    doc.moveDown(2);
    
    // Skills
    if (portfolio.skills.technical.length > 0) {
      doc.fontSize(16).text('Technical Skills', { underline: true });
      doc.moveDown(0.5);
      portfolio.skills.technical.forEach(skill => {
        doc.fontSize(11).text(`• ${skill.name} (${skill.level || 'Intermediate'})`, { indent: 20 });
      });
      doc.moveDown(2);
    }
    
    // Experience
    if (portfolio.experience.length > 0) {
      doc.fontSize(16).text('Experience', { underline: true });
      doc.moveDown(0.5);
      portfolio.experience.forEach(exp => {
        doc.fontSize(13).text(`${exp.title} at ${exp.company}`, { underline: true });
        doc.fontSize(10).text(`${exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ''} - ${exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : '')}`);
        if (exp.description) {
          doc.fontSize(11).text(exp.description, { indent: 20 });
        }
        doc.moveDown(1);
      });
    }
    
    // Projects
    if (portfolio.projects.length > 0) {
      doc.fontSize(16).text('Projects', { underline: true });
      doc.moveDown(0.5);
      portfolio.projects.forEach(project => {
        doc.fontSize(13).text(project.title, { underline: true });
        doc.fontSize(11).text(project.description, { indent: 20 });
        if (project.technologies && project.technologies.length > 0) {
          doc.fontSize(10).text(`Technologies: ${project.technologies.join(', ')}`, { indent: 20 });
        }
        doc.moveDown(1);
      });
    }
    
    // Education
    if (portfolio.education.length > 0) {
      doc.fontSize(16).text('Education', { underline: true });
      doc.moveDown(0.5);
      portfolio.education.forEach(edu => {
        doc.fontSize(13).text(`${edu.degree} - ${edu.institution}`, { underline: true });
        if (edu.endDate) {
          doc.fontSize(10).text(`Graduated: ${new Date(edu.endDate).toLocaleDateString()}`);
        }
        doc.moveDown(1);
      });
    }
    
    // Update last generated date
    portfolio.lastGenerated = new Date();
    await portfolio.save();
    
    // Finalize the PDF
    doc.end();
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete experience
// @route   DELETE /api/portfolio/experience/:id
// @access  Private
exports.deleteExperience = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }
    
    portfolio.experience.id(req.params.id).remove();
    await portfolio.save();
    
    res.status(200).json({
      success: true,
      data: portfolio.experience
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/portfolio/project/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }
    
    portfolio.projects.id(req.params.id).remove();
    await portfolio.save();
    
    res.status(200).json({
      success: true,
      data: portfolio.projects
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
