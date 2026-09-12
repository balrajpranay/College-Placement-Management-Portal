const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Drive = require('../models/Drive');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const Notification = require('../models/Notification');
const PlacementResult = require('../models/PlacementResult');

// Fallback in-memory data for local dev & demo student Priya Sharma
const studentStore = {
  profile: {
    id: '65e000000000000000000002',
    name: 'Priya Sharma',
    studentNo: 'CS2023001',
    email: 'priya.sharma@student.edu',
    phone: '+91 98765 43210',
    department: 'Computer Science',
    gradYear: 2026,
    cgpa: 8.9,
    tenthPct: 92.5,
    twelfthPct: 89.0,
    backlogs: 0,
    technical_skills: ['Python', 'SQL', 'React', 'Node.js', 'AWS', 'Git', 'Data Structures', 'REST APIs'],
    softSkills: 'Analytical Problem Solving, Technical Documentation, Agile Scrum, Team Collaboration',
    certifications: 'AWS Certified Solutions Architect Associate (2025), Coursera Deep Learning Specialization',
    internships: 'Full Stack Development Intern at WebCraft Systems (May - Jul 2025)',
    projects: '1. Campus Connect Placement Portal (React, Node, Express, SQLite/Mongo)\n2. Distributed Task Scheduler with Redis & Go\n3. Automated ATS Resume Parser using Gemini AI',
    resume_filename: 'student_1_Priya_Sharma_Resume.pdf',
    resume_original_name: 'Priya_Sharma_SDE_Resume.pdf'
  },
  drives: [
    {
      id: 'drv-1',
      title: 'Software Engineer - New Grad',
      company_name: 'TechNova Solutions',
      logo: '/static/images/companies/google.svg',
      location: 'Bengaluru, India',
      ctc: 12.0,
      job_type: 'Campus Placement Drive',
      min_cgpa: 7.0,
      max_backlogs: 1,
      branches: ['Computer Science', 'Information Technology', 'Electronics & Comm.'],
      skills: ['Python', 'Java', 'Data Structures', 'REST APIs'],
      openings: 8,
      deadline: '2026-09-15',
      drive_date: '2026-09-18',
      description: 'TechNova Solutions is seeking high-potential graduate software engineers to build enterprise cloud architectures and scalable microservices. You will participate in sprint design, unit testing, and continuous deployment pipelines.',
      company_desc: 'TechNova Solutions is a premier technology consulting firm specializing in high-throughput data platforms and enterprise solutions.'
    },
    {
      id: 'drv-2',
      title: 'Cloud Solutions & AI Trainee',
      company_name: 'Microsoft',
      logo: '/static/images/companies/microsoft.svg',
      location: 'Hyderabad, India',
      ctc: 18.5,
      job_type: 'Campus Placement Drive',
      min_cgpa: 8.0,
      max_backlogs: 0,
      branches: ['Computer Science', 'Information Technology', 'Electronics & Comm.'],
      skills: ['Azure', 'C#', 'Cloud Computing', 'AI / ML'],
      openings: 12,
      deadline: '2026-09-22',
      drive_date: '2026-09-26',
      description: 'Join Microsoft as a Cloud Solutions Trainee. You will design, develop, and optimize scalable Azure microservices and intelligent cloud applications.',
      company_desc: 'Microsoft Corporation is an American multinational technology corporation producing computer software, consumer electronics, personal computers, and related services.'
    },
    {
      id: 'drv-3',
      title: 'Specialist Programmer & Systems Engineer',
      company_name: 'Infosys Technologies',
      logo: '/static/images/companies/infosys.svg',
      location: 'Bengaluru, Hyderabad',
      ctc: 11.5,
      job_type: 'Full-Time',
      min_cgpa: 7.5,
      max_backlogs: 0,
      branches: ['Computer Science', 'Information Technology', 'Electronics & Comm.', 'Electrical Eng.'],
      skills: ['Java', 'Spring Boot', 'Microservices', 'SQL'],
      openings: 25,
      deadline: '2026-09-28',
      drive_date: '2026-10-02',
      description: 'The Specialist Programmer cadre at Infosys builds cutting-edge enterprise platforms, full-stack microservices, and AI-assisted cloud pipelines.',
      company_desc: 'Infosys is a global leader in next-generation digital services and consulting.'
    },
    {
      id: 'drv-4',
      title: 'Data Analytics & ML Intern',
      company_name: 'FinEdge Analytics',
      logo: null,
      location: 'Mumbai, India',
      ctc: 6.5,
      job_type: 'Internship',
      min_cgpa: 7.2,
      max_backlogs: 0,
      branches: ['Computer Science', 'Information Technology', 'All Branches'],
      skills: ['Python', 'SQL', 'Pandas', 'Machine Learning'],
      openings: 5,
      deadline: '2026-09-30',
      drive_date: '2026-10-05',
      description: 'Work directly with senior data scientists on quantitative financial analytics, customer behavior forecasting, and real-time fraud detection pipelines.',
      company_desc: 'FinEdge Analytics is an institutional fintech intelligence consultancy.'
    }
  ],
  applications: [
    {
      id: 'app-1',
      drive_id: 'drv-1',
      drive_title: 'Software Engineer - New Grad',
      company_name: 'TechNova Solutions',
      package_lpa: 12.0,
      applied_at: '2026-09-10T10:30:00.000Z',
      status: 'Interview Scheduled',
      interview_date: '2026-09-18'
    },
    {
      id: 'app-2',
      drive_id: 'drv-3',
      drive_title: 'Specialist Programmer & Systems Engineer',
      company_name: 'Infosys Technologies',
      package_lpa: 11.5,
      applied_at: '2026-09-11T14:15:00.000Z',
      status: 'Under Review',
      interview_date: null
    }
  ],
  interviews: [
    {
      id: 'int-1',
      company_name: 'TechNova Solutions',
      drive_title: 'Software Engineer - New Grad',
      round_name: 'Technical Coding & DSA Round',
      scheduled_date: '2026-09-18',
      scheduled_time: '11:00 AM - 12:00 PM',
      interview_type: 'Online (Google Meet)',
      venue: 'https://meet.google.com/abc-tnov-xyz',
      status: 'Scheduled'
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      message: 'Interview Scheduled: Technical Coding & DSA Round with TechNova Solutions on Sep 18 at 11:00 AM.',
      created_at: '2026-09-11 16:30',
      is_read: false
    },
    {
      id: 'notif-2',
      message: 'New Placement Drive Announced: Microsoft Cloud Solutions & AI Trainee (₹18.5 LPA). Apply before Sep 22.',
      created_at: '2026-09-11 09:00',
      is_read: false
    },
    {
      id: 'notif-3',
      message: 'Profile Verification: Your academic metrics (CGPA 8.9) have been verified by the Placement Cell.',
      created_at: '2026-09-10 14:20',
      is_read: true
    }
  ],
  selectedOffers: []
};

// Calculation helpers
const calculateCompletion = (profile) => {
  let score = 0;
  if (profile.name) score += 10;
  if (profile.phone) score += 10;
  if (profile.department) score += 10;
  if (profile.gradYear) score += 10;
  if (profile.cgpa) score += 15;
  if (profile.tenthPct) score += 10;
  if (profile.twelfthPct) score += 10;
  if (profile.technical_skills && profile.technical_skills.length > 0) score += 15;
  if (profile.resume_filename) score += 10;
  return Math.min(score, 100);
};

const checkEligibility = (student, drive) => {
  const reasons = [];
  let eligible = true;

  if (student.cgpa < drive.min_cgpa) {
    eligible = false;
    reasons.push(`CGPA ${student.cgpa} is below minimum requirement (${drive.min_cgpa})`);
  }

  if (student.backlogs > drive.max_backlogs) {
    eligible = false;
    reasons.push(`Active backlogs (${student.backlogs}) exceed allowed maximum (${drive.max_backlogs})`);
  }

  if (drive.branches && drive.branches.length > 0 && !drive.branches.includes('All Branches')) {
    if (!drive.branches.some(b => b.toLowerCase() === student.department.toLowerCase())) {
      eligible = false;
      reasons.push(`Department ${student.department} is not in eligible branches (${drive.branches.join(', ')})`);
    }
  }

  return { eligible, reasons };
};

// 1. GET Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const student = studentStore.profile;
    const completion = calculateCompletion(student);
    const app_count = studentStore.applications.length;
    const shortlisted = studentStore.applications.filter(a => ['Shortlisted', 'Interview Scheduled', 'Under Review'].includes(a.status)).length;
    const selected = studentStore.selectedOffers;
    const upcoming_interviews = studentStore.interviews.filter(i => i.status === 'Scheduled');
    const recent_notifications = studentStore.notifications.slice(0, 5);

    return res.status(200).json({
      success: true,
      data: {
        student,
        completion,
        app_count,
        shortlisted,
        selected,
        upcoming_interviews,
        recent_notifications,
        skills: student.technical_skills
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 2. GET Profile
exports.getProfile = async (req, res) => {
  try {
    const student = studentStore.profile;
    const completion = calculateCompletion(student);
    const departments = [
      'Computer Science',
      'Information Technology',
      'Electronics & Communication',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering'
    ];

    return res.status(200).json({
      success: true,
      data: {
        student,
        completion,
        departments,
        skills_string: student.technical_skills.join(', ')
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 3. PUT Profile
exports.updateProfile = async (req, res) => {
  try {
    const body = req.body;
    const student = studentStore.profile;

    if (body.name) student.name = body.name;
    if (body.phone !== undefined) student.phone = body.phone;
    if (body.department) student.department = body.department;
    if (body.gradYear !== undefined) student.gradYear = Number(body.gradYear);
    if (body.cgpa !== undefined) student.cgpa = Number(body.cgpa);
    if (body.tenthPct !== undefined) student.tenthPct = Number(body.tenthPct);
    if (body.twelfthPct !== undefined) student.twelfthPct = Number(body.twelfthPct);
    if (body.backlogs !== undefined) student.backlogs = Number(body.backlogs);
    if (body.softSkills !== undefined) student.softSkills = body.softSkills;
    if (body.certifications !== undefined) student.certifications = body.certifications;
    if (body.projects !== undefined) student.projects = body.projects;
    if (body.internships !== undefined) student.internships = body.internships;

    if (body.technical_skills !== undefined) {
      if (Array.isArray(body.technical_skills)) {
        student.technical_skills = body.technical_skills;
      } else if (typeof body.technical_skills === 'string') {
        student.technical_skills = body.technical_skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        student,
        completion: calculateCompletion(student)
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 4. POST Resume
exports.uploadResume = async (req, res) => {
  try {
    const { filename } = req.body;
    studentStore.profile.resume_filename = filename || 'student_1_uploaded_resume.pdf';
    studentStore.profile.resume_original_name = filename || 'Verified_Student_Resume.pdf';

    return res.status(200).json({
      success: true,
      message: 'Resume updated successfully.',
      data: {
        resume_filename: studentStore.profile.resume_filename,
        resume_original_name: studentStore.profile.resume_original_name
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5. GET Drives
exports.getDrives = async (req, res) => {
  try {
    const student = studentStore.profile;
    const { q, eligible } = req.query;

    let items = studentStore.drives.map(d => {
      const eligibility = checkEligibility(student, d);
      const app = studentStore.applications.find(a => a.drive_id === d.id);
      return {
        drive: d,
        eligible: eligibility.eligible,
        reasons: eligibility.reasons,
        applied_status: app ? app.status : null
      };
    });

    if (q) {
      const queryStr = q.toLowerCase();
      items = items.filter(item => 
        item.drive.title.toLowerCase().includes(queryStr) || 
        item.drive.company_name.toLowerCase().includes(queryStr) ||
        (item.drive.location && item.drive.location.toLowerCase().includes(queryStr))
      );
    }

    if (eligible === '1' || eligible === 'true') {
      items = items.filter(item => item.eligible);
    }

    return res.status(200).json({
      success: true,
      data: items
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 6. GET Drive Detail
exports.getDriveDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const drive = studentStore.drives.find(d => d.id === id);

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found.' });
    }

    const student = studentStore.profile;
    const eligibility = checkEligibility(student, drive);
    const app = studentStore.applications.find(a => a.drive_id === drive.id);

    return res.status(200).json({
      success: true,
      data: {
        drive,
        eligible: eligibility.eligible,
        reasons: eligibility.reasons,
        applied: app || null
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 7. POST Apply to Drive
exports.applyToDrive = async (req, res) => {
  try {
    const { id } = req.params;
    const drive = studentStore.drives.find(d => d.id === id);

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found.' });
    }

    const student = studentStore.profile;
    const eligibility = checkEligibility(student, drive);

    if (!eligibility.eligible) {
      return res.status(400).json({
        success: false,
        message: 'You are not eligible to apply for this drive: ' + eligibility.reasons.join(', ')
      });
    }

    const existingApp = studentStore.applications.find(a => a.drive_id === drive.id);
    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this drive.'
      });
    }

    const newApp = {
      id: `app-${Date.now()}`,
      drive_id: drive.id,
      drive_title: drive.title,
      company_name: drive.company_name,
      package_lpa: drive.ctc,
      applied_at: new Date().toISOString(),
      status: 'Applied',
      interview_date: null
    };

    studentStore.applications.unshift(newApp);

    // Also add notification
    studentStore.notifications.unshift({
      id: `notif-${Date.now()}`,
      message: `Application submitted successfully for '${drive.title}' at ${drive.company_name}.`,
      created_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
      is_read: false
    });

    return res.status(200).json({
      success: true,
      message: `Application submitted successfully for ${drive.title} at ${drive.company_name}!`,
      data: newApp
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 8. GET Applications
exports.getApplications = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: studentStore.applications
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 9. POST Withdraw Application
exports.withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const index = studentStore.applications.findIndex(a => a.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const app = studentStore.applications[index];
    if (!['Applied', 'Under Review'].includes(app.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw an application that has progressed past review.'
      });
    }

    studentStore.applications.splice(index, 1);

    return res.status(200).json({
      success: true,
      message: 'Application successfully withdrawn.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 10. GET Interviews
exports.getInterviews = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: studentStore.interviews
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 11. GET Notifications
exports.getNotifications = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: studentStore.notifications
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Mark notification read
exports.markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = studentStore.notifications.find(n => n.id === id);
    if (notif) {
      notif.is_read = true;
    }
    return res.status(200).json({
      success: true,
      message: 'Notification marked as read.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 12. GET Placement Status
exports.getPlacementStatus = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        student: studentStore.profile,
        results: studentStore.selectedOffers
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.studentStore = studentStore;

