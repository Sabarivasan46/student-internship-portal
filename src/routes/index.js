const express = require('express');
const mongoose = require('mongoose');
const Application = require('../models/Application');

const router = express.Router();

// Static catalogue of available internships
const internships = [
  {
    id: 'frontend-developer',
    title: 'Frontend Developer Intern',
    company: 'ByteWorks Technologies',
    location: 'Remote',
    duration: '3 months',
    stipend: '₹15,000/month',
    mode: 'Remote',
    description:
      'Build modern, responsive, and accessible user interfaces using React, JavaScript, HTML5, and CSS3. Collaborate closely with UI/UX designers and backend engineers to craft intuitive student experiences.',
    skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git', 'Responsive Design'],
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer Intern',
    company: 'CloudNova Solutions',
    location: 'Bengaluru',
    duration: '6 months',
    stipend: '₹20,000/month',
    mode: 'Hybrid',
    description:
      'Design robust RESTful APIs, manage MongoDB databases, write clean modular business logic, and implement secure authentication and logging pipelines.',
    skills: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'REST APIs', 'Docker'],
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst Intern',
    company: 'InsightLabs',
    location: 'Chennai',
    duration: '3 months',
    stipend: '₹12,000/month',
    mode: 'On-site',
    description:
      'Analyze structured and unstructured datasets, build data validation pipelines, uncover actionable business insights, and create interactive dashboards for key stakeholders.',
    skills: ['Python', 'SQL', 'Pandas', 'Excel', 'Data Visualization', 'Statistics'],
  },
  {
    id: 'full-stack-developer',
    title: 'Full Stack Developer Intern',
    company: 'NextGen Digital',
    location: 'Hyderabad',
    duration: '6 months',
    stipend: '₹22,000/month',
    mode: 'Hybrid',
    description:
      'Develop end-to-end full stack web applications connecting React frontends with Express microservices. Work on state management, database schema design, and production deployment automation.',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Tailwind CSS'],
  },
  // Backward compatibility aliases for existing bookmarks/deployments
  {
    id: 'web-development',
    title: 'Frontend Developer Intern',
    company: 'ByteWorks Technologies',
    location: 'Remote',
    duration: '3 months',
    stipend: '₹15,000/month',
    mode: 'Remote',
    description:
      'Build modern, responsive, and accessible user interfaces using React, JavaScript, HTML5, and CSS3.',
    skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
  },
  {
    id: 'data-analytics',
    title: 'Data Analyst Intern',
    company: 'InsightLabs',
    location: 'Chennai',
    duration: '3 months',
    stipend: '₹12,000/month',
    mode: 'On-site',
    description:
      'Analyze structured and unstructured datasets, build data pipelines, and uncover actionable insights.',
    skills: ['Python', 'SQL', 'Pandas', 'Excel', 'Data Visualization'],
  },
  {
    id: 'backend-development',
    title: 'Backend Developer Intern',
    company: 'CloudNova Solutions',
    location: 'Bengaluru',
    duration: '6 months',
    stipend: '₹20,000/month',
    mode: 'Hybrid',
    description:
      'Design robust RESTful APIs, manage MongoDB databases, and implement secure server-side applications.',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Intern',
    company: 'PixelWorks',
    location: 'Remote',
    duration: '2 months',
    stipend: '₹6,000/month',
    mode: 'Remote',
    description:
      'Design user-friendly interfaces, create wireframes, interactive prototypes, and improve overall product accessibility.',
    skills: ['Figma', 'Wireframing', 'Prototyping', 'UI Design', 'Design Systems'],
  },
];

// Helper to filter primary catalogue (avoid duplicate alias listings)
const primaryCatalogue = internships.filter(
  (item) =>
    ['frontend-developer', 'backend-developer', 'data-analyst', 'full-stack-developer'].includes(
      item.id
    )
);

// GET /api/internships
router.get('/internships', (req, res) => {
  res.json(primaryCatalogue);
});

// GET /api/internships/:id
router.get('/internships/:id', (req, res) => {
  const { id } = req.params;
  const internship = internships.find((item) => item.id === id);

  if (!internship) {
    return res.status(404).json({ error: 'Internship not found.' });
  }

  res.json(internship);
});

// POST /api/applications
router.post('/applications', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database service is temporarily unavailable. Please try again shortly.',
      });
    }

    const { studentName, email, rollNumber, internshipId, internship } = req.body;
    const selectedInternshipId = (internshipId || internship || '').trim();

    // Validation
    if (!studentName || !studentName.trim() || studentName.trim().length < 2) {
      return res.status(400).json({
        error: 'Student name is required and must contain at least 2 characters.',
      });
    }

    if (studentName.trim().length > 100) {
      return res.status(400).json({
        error: 'Student name cannot exceed 100 characters.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.trim() || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        error: 'Please enter a valid email address.',
      });
    }

    if (email.trim().length > 254) {
      return res.status(400).json({
        error: 'Email cannot exceed 254 characters.',
      });
    }

    if (!rollNumber || !rollNumber.trim()) {
      return res.status(400).json({
        error: 'Roll number is required.',
      });
    }

    if (rollNumber.trim().length > 40) {
      return res.status(400).json({
        error: 'Roll number cannot exceed 40 characters.',
      });
    }

    if (!selectedInternshipId) {
      return res.status(400).json({
        error: 'Please select an internship.',
      });
    }

    // Verify internship ID exists in the catalogue
    const matchedInternship = internships.find(
      (item) => item.id === selectedInternshipId
    );

    if (!matchedInternship) {
      return res.status(400).json({
        error: 'Selected internship is invalid or does not exist.',
      });
    }

    // Save application to MongoDB
    const application = await Application.create({
      studentName: studentName.trim(),
      email: email.trim().toLowerCase(),
      rollNumber: rollNumber.trim().toUpperCase(),
      internshipId: matchedInternship.id,
      internshipTitle: matchedInternship.title,
    });

    res.status(201).json({
      message: 'Application submitted successfully!',
      applicationId: application._id,
      application: {
        _id: application._id,
        studentName: application.studentName,
        email: application.email,
        rollNumber: application.rollNumber,
        internshipId: application.internshipId,
        internshipTitle: application.internshipTitle,
        company: matchedInternship.company,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join('. ') });
    }
    next(error);
  }
});

// GET /api/applications
router.get('/applications', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database service is temporarily unavailable. Please try again shortly.',
      });
    }

    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .lean();

    const formattedApplications = applications.map((app) => {
      const matched = internships.find(
        (i) => i.id === app.internshipId || i.id === app.internship
      );
      return {
        _id: app._id,
        studentName: app.studentName,
        email: app.email,
        rollNumber: app.rollNumber,
        internshipId: app.internshipId || app.internship,
        internshipTitle: app.internshipTitle || matched?.title || 'Unknown Internship',
        company: matched?.company || 'N/A',
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
      };
    });

    res.json(formattedApplications);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
