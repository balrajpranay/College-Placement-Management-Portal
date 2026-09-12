const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const Drive = require('../models/Drive');
const Application = require('../models/Application');
const { studentStore } = require('./studentController');

// In-Memory Fallback Store for Recruiter Companies & Drives (Matching SQLite Source of Truth)
const recruiterStore = {
  companies: new Map([
    ['hr@technova.com', {
      id: 1,
      name: 'TechNova Solutions',
      industry: 'Software / IT',
      website: 'https://technova.example.com',
      hr_contact: 'Anita Rao',
      hrContact: 'Anita Rao',
      email: 'hr@technova.com',
      phone: '9363328006',
      location: 'Bengaluru',
      description: 'TechNova Solutions is a leading player in the Software / IT space, hiring top campus talent every year.',
      logo_filename: null,
      logoFilename: null,
      approved: true,
      created_at: '2026-08-27 19:44:43'
    }],
    ['talent@apexcloud.io', {
      id: 8,
      name: 'Apex Cloud Systems',
      industry: 'Cloud Computing',
      website: 'https://apexcloud.example.com',
      hr_contact: 'Arun Kumar',
      hrContact: 'Arun Kumar',
      email: 'talent@apexcloud.io',
      phone: '9876543210',
      location: 'Bengaluru',
      description: 'Leading next-gen enterprise cloud platform.',
      logo_filename: null,
      logoFilename: null,
      approved: true,
      created_at: '2026-09-11 16:28:05'
    }]
  ]),
  drives: [
    {
      id: 1,
      company_id: 1,
      company_email: 'hr@technova.com',
      title: 'Software Engineer - New Grad',
      job_type: 'Full-Time',
      ctc: 12.0,
      location: 'Bengaluru',
      min_cgpa: 7.0,
      max_backlogs: 1,
      openings: 20,
      deadline: '2026-09-10',
      drive_date: '2026-09-26',
      applicant_count: 5,
      status: 'active',
      description: 'We are hiring for the Software Engineer - New Grad role. Great opportunity to work with a passionate team on impactful products.'
    },
    {
      id: 7,
      company_id: 1,
      company_email: 'hr@technova.com',
      title: 'Graduate Cloud Engineer 2026',
      job_type: 'Full-Time',
      ctc: 12.5,
      location: 'Bengaluru',
      min_cgpa: 7.5,
      max_backlogs: 0,
      openings: 10,
      deadline: '2026-10-15',
      drive_date: '2026-10-25',
      applicant_count: 0,
      status: 'active',
      description: 'Building next-gen distributed systems and microservices.'
    }
  ],
  applications: [
    {
      id: 1,
      student_id: 2,
      name: 'Rahul Verma',
      student_name: 'Rahul Verma',
      student_no: 'STU1001',
      student_email: 'rahul.verma@student.edu',
      department: 'Information Technology',
      cgpa: 8.3,
      backlogs: 0,
      resume_filename: null,
      drive_id: 1,
      drive_title: 'Software Engineer - New Grad',
      company_id: 1,
      company_email: 'hr@technova.com',
      status: 'Interview Scheduled',
      applied_at: '2026-08-16 19:44:43',
      updated_at: '2026-09-11 16:28:05'
    },
    {
      id: 2,
      student_id: 10,
      name: 'Aditya Rao',
      student_name: 'Aditya Rao',
      student_no: 'STU1009',
      student_email: 'aditya.rao@student.edu',
      department: 'Information Technology',
      cgpa: 8.6,
      backlogs: 0,
      resume_filename: null,
      drive_id: 1,
      drive_title: 'Software Engineer - New Grad',
      company_id: 1,
      company_email: 'hr@technova.com',
      status: 'Under Review',
      applied_at: '2026-07-19 19:44:43',
      updated_at: '2026-07-19 19:44:43'
    },
    {
      id: 3,
      student_id: 9,
      name: 'Neha Gupta',
      student_name: 'Neha Gupta',
      student_no: 'STU1008',
      student_email: 'neha.gupta@student.edu',
      department: 'Computer Science',
      cgpa: 9.29,
      backlogs: 0,
      resume_filename: null,
      drive_id: 1,
      drive_title: 'Software Engineer - New Grad',
      company_id: 1,
      company_email: 'hr@technova.com',
      status: 'Shortlisted',
      applied_at: '2026-07-19 19:44:43',
      updated_at: '2026-07-19 19:44:43'
    },
    {
      id: 19,
      student_id: 13,
      name: 'Pranay Kumar',
      student_name: 'Pranay Kumar',
      student_no: '24qma6608',
      student_email: 'pranay@student.edu',
      department: 'Computer Science',
      cgpa: 9.0,
      backlogs: 0,
      resume_filename: null,
      drive_id: 1,
      drive_title: 'Software Engineer - New Grad',
      company_id: 1,
      company_email: 'hr@technova.com',
      status: 'Applied',
      applied_at: '2026-08-29 14:35:58',
      updated_at: '2026-08-29 14:35:58'
    },
    {
      id: 101,
      student_id: 1,
      name: 'Priya Sharma',
      student_name: 'Priya Sharma',
      student_no: 'CS2023001',
      student_email: 'priya.sharma@student.edu',
      department: 'Computer Science',
      cgpa: 8.9,
      backlogs: 0,
      resume_filename: 'student_1_Priya_Sharma_Resume.pdf',
      drive_id: 1,
      drive_title: 'Software Engineer - New Grad',
      company_id: 1,
      company_email: 'hr@technova.com',
      status: 'Interview Scheduled',
      applied_at: '2026-09-10 10:30:00',
      updated_at: '2026-09-11 16:30:00'
    },
    {
      id: 4,
      student_id: 9,
      name: 'Neha Gupta',
      student_name: 'Neha Gupta',
      student_no: 'STU1008',
      student_email: 'neha.gupta@student.edu',
      department: 'Computer Science',
      cgpa: 9.29,
      backlogs: 0,
      resume_filename: null,
      drive_id: 2,
      drive_title: 'Data Analyst Intern',
      company_id: 2,
      company_email: 'recruiter@dataedge.example.com',
      status: 'Applied',
      applied_at: '2026-07-25 19:44:43',
      updated_at: '2026-07-25 19:44:43'
    }
  ],
  interviews: [
    {
      id: 1,
      application_id: 1,
      drive_id: 1,
      drive_title: 'Software Engineer - New Grad',
      company_id: 1,
      company_email: 'hr@technova.com',
      company_name: 'TechNova Solutions',
      student_id: 2,
      student_name: 'Rahul Verma',
      student_no: 'STU1001',
      round_name: 'Technical Round 1',
      scheduled_date: '2026-10-18',
      scheduled_time: '10:30 AM',
      interview_type: 'Online',
      venue: 'https://meet.google.com/abc-xyz-pqr',
      status: 'Scheduled',
      created_at: '2026-09-11 16:28:05'
    },
    {
      id: 2,
      application_id: 101,
      drive_id: 1,
      drive_title: 'Software Engineer - New Grad',
      company_id: 1,
      company_email: 'hr@technova.com',
      company_name: 'TechNova Solutions',
      student_id: 1,
      student_name: 'Priya Sharma',
      student_no: 'CS2023001',
      round_name: 'Technical Coding & DSA Round',
      scheduled_date: '2026-09-18',
      scheduled_time: '11:00 AM - 12:00 PM',
      interview_type: 'Online',
      venue: 'https://meet.google.com/abc-tnov-xyz',
      status: 'Scheduled',
      created_at: '2026-09-11 16:30:00'
    },
    {
      id: 10,
      application_id: 7,
      drive_id: 2,
      drive_title: 'Data Analyst Intern',
      company_id: 2,
      company_email: 'recruiter@dataedge.example.com',
      company_name: 'DataEdge Analytics',
      student_id: 10,
      student_name: 'Aditya Rao',
      student_no: 'STU1009',
      round_name: 'Technical Round',
      scheduled_date: '2026-09-06',
      scheduled_time: '10:00 AM',
      interview_type: 'In-Person',
      venue: 'Seminar Hall B',
      status: 'Scheduled',
      created_at: '2026-08-27 19:44:43'
    }
  ],
  results: [
    {
      id: 1,
      application_id: 101,
      company_id: 1,
      company_email: 'hr@technova.com',
      company_name: 'TechNova Solutions',
      drive_id: 1,
      drive_title: 'Software Engineer - New Grad',
      student_id: 1,
      student_name: 'Priya Sharma',
      student_no: 'CS2023001',
      department: 'Computer Science',
      package: 12.0,
      placement_date: '2026-09-12',
      status: 'Selected',
      created_at: '2026-09-12 11:30:00',
      updated_at: '2026-09-12 11:30:00'
    },
    {
      id: 2,
      application_id: 8,
      company_id: 2,
      company_email: 'recruiter@dataedge.example.com',
      company_name: 'DataEdge Analytics',
      drive_id: 2,
      drive_title: 'Data Analyst Intern',
      student_id: 2,
      student_name: 'Rahul Verma',
      student_no: 'STU1001',
      department: 'Information Technology',
      package: 6.5,
      placement_date: '2026-08-23',
      status: 'Selected',
      created_at: '2026-08-27 19:44:43',
      updated_at: '2026-08-27 19:44:43'
    }
  ],
  notifications: [
    {
      id: 1,
      company_id: 1,
      company_email: 'hr@technova.com',
      user_id: '65e000000000000000000003',
      message: "Priya Sharma applied to your drive 'Software Engineer - New Grad'.",
      link: '/recruiter/applicants',
      is_read: false,
      isRead: false,
      created_at: '2026-09-10 10:30:00'
    },
    {
      id: 2,
      company_id: 1,
      company_email: 'hr@technova.com',
      user_id: '65e000000000000000000003',
      message: "Rahul Verma applied to your drive 'Software Engineer - New Grad'.",
      link: '/recruiter/applicants',
      is_read: true,
      isRead: true,
      created_at: '2026-08-16 19:44:43'
    },
    {
      id: 3,
      company_id: 1,
      company_email: 'hr@technova.com',
      user_id: '65e000000000000000000003',
      message: "Your campus hiring drive 'Software Engineer - New Grad' was approved by the placement cell.",
      link: '/recruiter/drives',
      is_read: true,
      isRead: true,
      created_at: '2026-08-15 14:20:00'
    },
    {
      id: 4,
      company_id: 1,
      company_email: 'hr@technova.com',
      user_id: '65e000000000000000000003',
      message: "Corporate partner profile verified by the Institutional Placement Officer.",
      link: '/recruiter/profile',
      is_read: true,
      isRead: true,
      created_at: '2026-08-10 09:15:00'
    }
  ]
};

// Helper: Get company for authenticated user
function getCompanyByEmail(email) {
  if (recruiterStore.companies.has(email)) {
    return recruiterStore.companies.get(email);
  }
  // Default fallback for any newly registered or unknown recruiter
  const defaultCompany = {
    id: Date.now(),
    name: email.split('@')[0].toUpperCase() + ' Corp',
    industry: 'Technology',
    website: `https://${email.split('@')[1] || 'company.com'}`,
    hr_contact: 'Recruiter Lead',
    hrContact: 'Recruiter Lead',
    email: email,
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    description: 'Corporate recruitment partner with Campus Connect.',
    logo_filename: null,
    logoFilename: null,
    approved: true,
    created_at: new Date().toISOString()
  };
  recruiterStore.companies.set(email, defaultCompany);
  return defaultCompany;
}

// GET /api/recruiters/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    let company = null;

    if (mongoose.connection.readyState === 1) {
      try {
        company = await Company.findOne({ email }).lean();
      } catch (err) {
        console.warn('[Recruiter Mongo]: Fallback to memory store', err.message);
      }
    }

    if (!company) {
      company = getCompanyByEmail(email);
    }

    // Check Approval Status matching Flask
    if (!company.approved) {
      return res.status(200).json({
        success: true,
        approved: false,
        message: 'Corporate Account Under Review',
        company
      });
    }

    // Calculate metrics and drives
    const userDrives = recruiterStore.drives.filter(
      d => d.company_email === email || d.company_id === company.id
    );

    const active_drives = userDrives.filter(d => d.status === 'active').length;
    let total_applicants = 0;
    userDrives.forEach(d => {
      total_applicants += (d.applicant_count || 0);
    });

    const shortlisted = email === 'hr@technova.com' ? 2 : 0;
    const selected = email === 'hr@technova.com' ? 0 : 0;

    return res.status(200).json({
      success: true,
      approved: true,
      company: {
        id: company.id || company._id,
        name: company.name,
        industry: company.industry,
        website: company.website,
        hr_contact: company.hr_contact || company.hrContact,
        email: company.email,
        phone: company.phone,
        location: company.location,
        description: company.description,
        logo_filename: company.logo_filename || company.logoFilename,
        approved: company.approved
      },
      stats: {
        active_drives,
        total_applicants,
        shortlisted,
        selected
      },
      recent_drives: userDrives
    });
  } catch (err) {
    console.error('[Recruiter Dashboard Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve recruiter dashboard',
      error: err.message
    });
  }
};

// GET /api/recruiters/profile
exports.getProfile = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    let company = null;

    if (mongoose.connection.readyState === 1) {
      try {
        company = await Company.findOne({ email }).lean();
      } catch (err) {
        console.warn('[Recruiter Mongo]: Fallback to memory store', err.message);
      }
    }

    if (!company) {
      company = getCompanyByEmail(email);
    }

    return res.status(200).json({
      success: true,
      company: {
        id: company.id || company._id,
        name: company.name,
        industry: company.industry || '',
        website: company.website || '',
        hr_contact: company.hr_contact || company.hrContact || '',
        hrContact: company.hr_contact || company.hrContact || '',
        email: company.email,
        phone: company.phone || '',
        location: company.location || '',
        description: company.description || '',
        logo_filename: company.logo_filename || company.logoFilename || null,
        approved: company.approved
      }
    });
  } catch (err) {
    console.error('[Recruiter Profile Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve recruiter profile',
      error: err.message
    });
  }
};

// PUT /api/recruiters/profile or POST /api/recruiters/profile
exports.updateProfile = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const { name, industry, website, hr_contact, hrContact, phone, location, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Company Name is required.'
      });
    }

    const contactName = hr_contact || hrContact || '';

    // Update in-memory fallback
    const current = getCompanyByEmail(email);
    const updated = {
      ...current,
      name: name.trim(),
      industry: industry ? industry.trim() : '',
      website: website ? website.trim() : '',
      hr_contact: contactName.trim(),
      hrContact: contactName.trim(),
      phone: phone ? phone.trim() : '',
      location: location ? location.trim() : '',
      description: description ? description.trim() : ''
    };
    recruiterStore.companies.set(email, updated);

    // Update MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        await Company.findOneAndUpdate(
          { email },
          {
            $set: {
              name: updated.name,
              industry: updated.industry,
              website: updated.website,
              hrContact: updated.hrContact,
              phone: updated.phone,
              location: updated.location,
              description: updated.description
            }
          },
          { new: true, upsert: true }
        );
      } catch (err) {
        console.warn('[Recruiter Mongo Update]:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Corporate profile updated successfully.',
      company: updated
    });
  } catch (err) {
    console.error('[Recruiter Profile Update Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update recruiter profile',
      error: err.message
    });
  }
};

// GET /api/recruiters/drives
exports.getDrives = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    let company = getCompanyByEmail(email);

    if (mongoose.connection.readyState === 1) {
      try {
        const mongoComp = await Company.findOne({ email }).lean();
        if (mongoComp) company = mongoComp;
      } catch (err) {
        console.warn('[Recruiter Mongo]: Fallback to memory store', err.message);
      }
    }

    const userDrives = recruiterStore.drives.filter(
      d => d.company_email === email || d.company_id === company.id
    );

    return res.status(200).json({
      success: true,
      count: userDrives.length,
      drives: userDrives
    });
  } catch (err) {
    console.error('[Recruiter Get Drives Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve managed placement drives',
      error: err.message
    });
  }
};

// GET /api/recruiters/drives/:id
exports.getDriveById = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const driveId = req.params.id;
    const company = getCompanyByEmail(email);

    const drive = recruiterStore.drives.find(
      d => String(d.id) === String(driveId) || String(d._id) === String(driveId)
    );

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: `Placement drive with ID '${driveId}' not found.`
      });
    }

    // Security & Ownership check: Recruiter must own this drive
    if (drive.company_email !== email && drive.company_id !== company.id) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not own or have permission to manage this placement drive.'
      });
    }

    return res.status(200).json({
      success: true,
      drive
    });
  } catch (err) {
    console.error('[Recruiter Get Drive Detail Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve drive details',
      error: err.message
    });
  }
};

// POST /api/recruiters/drives (Create Drive)
exports.createDrive = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const company = getCompanyByEmail(email);

    if (!company.approved) {
      return res.status(403).json({
        success: false,
        message: 'Access Restricted: Corporate Account is under review. You cannot publish placement drives until verified by the Placement Cell.'
      });
    }

    const {
      title,
      job_type,
      jobType,
      ctc,
      location,
      openings,
      deadline,
      drive_date,
      driveDate,
      description,
      min_cgpa,
      minCgpa,
      max_backlogs,
      maxBacklogs,
      branches,
      skills
    } = req.body;

    const errors = [];
    if (!title || !title.trim()) errors.append ? errors.push('Job title is required.') : errors.push('Job title is required.');
    if (!deadline) errors.push('Application deadline is required.');

    const parsedCtc = parseFloat(ctc || 0);
    const parsedMinCgpa = parseFloat(min_cgpa ?? minCgpa ?? 6.0);
    const parsedMaxBacklogs = parseInt(max_backlogs ?? maxBacklogs ?? 0, 10);
    const parsedOpenings = parseInt(openings || 1, 10);

    if (isNaN(parsedCtc) || parsedCtc <= 0) errors.push('Annual package CTC must be a positive number.');
    if (isNaN(parsedMinCgpa) || parsedMinCgpa < 0 || parsedMinCgpa > 10) errors.push('Minimum CGPA must be between 0 and 10.');
    if (isNaN(parsedMaxBacklogs) || parsedMaxBacklogs < 0) errors.push('Max backlogs must be 0 or a positive integer.');
    if (isNaN(parsedOpenings) || parsedOpenings < 1) errors.push('Number of openings must be at least 1.');

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(' ')
      });
    }

    // Parse branches & skills
    let branchList = [];
    if (Array.isArray(branches)) {
      branchList = branches;
    } else if (typeof branches === 'string' && branches.trim()) {
      branchList = branches.split(',').map(b => b.trim()).filter(Boolean);
    } else {
      branchList = ['Computer Science', 'Information Technology', 'Electronics & Communication'];
    }

    let skillList = [];
    if (Array.isArray(skills)) {
      skillList = skills;
    } else if (typeof skills === 'string' && skills.trim()) {
      skillList = skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    const newDrive = {
      id: Date.now(),
      company_id: company.id || 1,
      company_email: email,
      company_name: company.name,
      title: title.trim(),
      job_type: job_type || jobType || 'Full-Time',
      ctc: parsedCtc,
      location: location ? location.trim() : (company.location || 'Bengaluru'),
      min_cgpa: parsedMinCgpa,
      max_backlogs: parsedMaxBacklogs,
      openings: parsedOpenings,
      deadline: deadline,
      drive_date: drive_date || driveDate || null,
      branches: branchList,
      skills: skillList,
      applicant_count: 0,
      status: 'active',
      description: description ? description.trim() : `Exciting career opportunity with ${company.name}.`,
      created_at: new Date().toISOString()
    };

    // Store in-memory
    recruiterStore.drives.unshift(newDrive);

    // Save in Mongo if connected
    if (mongoose.connection.readyState === 1) {
      try {
        await Drive.create({
          company: company._id || company.id,
          title: newDrive.title,
          jobType: newDrive.job_type,
          ctc: newDrive.ctc,
          location: newDrive.location,
          minCgpa: newDrive.min_cgpa,
          maxBacklogs: newDrive.max_backlogs,
          openings: newDrive.openings,
          deadline: new Date(newDrive.deadline),
          driveDate: newDrive.drive_date ? new Date(newDrive.drive_date) : null,
          branches: newDrive.branches,
          skills: newDrive.skills,
          status: 'active',
          description: newDrive.description
        });
      } catch (err) {
        console.warn('[Recruiter Mongo Create Drive]:', err.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Placement drive published successfully.',
      drive: newDrive
    });
  } catch (err) {
    console.error('[Recruiter Create Drive Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create placement drive',
      error: err.message
    });
  }
};

// PUT /api/recruiters/drives/:id (Update Drive)
exports.updateDrive = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const driveId = req.params.id;
    const company = getCompanyByEmail(email);

    const index = recruiterStore.drives.findIndex(
      d => String(d.id) === String(driveId) || String(d._id) === String(driveId)
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Placement drive with ID '${driveId}' not found.`
      });
    }

    const currentDrive = recruiterStore.drives[index];

    // Security & Ownership check
    if (currentDrive.company_email !== email && currentDrive.company_id !== company.id) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not own or have permission to update this placement drive.'
      });
    }

    const {
      title,
      job_type,
      jobType,
      ctc,
      location,
      openings,
      deadline,
      drive_date,
      driveDate,
      description,
      min_cgpa,
      minCgpa,
      max_backlogs,
      maxBacklogs,
      branches,
      skills,
      status
    } = req.body;

    const updatedDrive = {
      ...currentDrive,
      title: title ? title.trim() : currentDrive.title,
      job_type: job_type || jobType || currentDrive.job_type,
      ctc: ctc !== undefined ? parseFloat(ctc) : currentDrive.ctc,
      location: location !== undefined ? location.trim() : currentDrive.location,
      openings: openings !== undefined ? parseInt(openings, 10) : currentDrive.openings,
      deadline: deadline || currentDrive.deadline,
      drive_date: drive_date !== undefined ? drive_date : (driveDate !== undefined ? driveDate : currentDrive.drive_date),
      description: description !== undefined ? description.trim() : currentDrive.description,
      min_cgpa: min_cgpa !== undefined ? parseFloat(min_cgpa) : (minCgpa !== undefined ? parseFloat(minCgpa) : currentDrive.min_cgpa),
      max_backlogs: max_backlogs !== undefined ? parseInt(max_backlogs, 10) : (maxBacklogs !== undefined ? parseInt(maxBacklogs, 10) : currentDrive.max_backlogs),
      branches: Array.isArray(branches) ? branches : currentDrive.branches,
      skills: Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : currentDrive.skills),
      status: status || currentDrive.status
    };

    recruiterStore.drives[index] = updatedDrive;

    return res.status(200).json({
      success: true,
      message: 'Placement drive updated successfully.',
      drive: updatedDrive
    });
  } catch (err) {
    console.error('[Recruiter Update Drive Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update placement drive',
      error: err.message
    });
  }
};

// POST /api/recruiters/drives/:id/close or PUT /api/recruiters/drives/:id/close
exports.closeDrive = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const driveId = req.params.id;
    const company = getCompanyByEmail(email);

    const index = recruiterStore.drives.findIndex(
      d => String(d.id) === String(driveId) || String(d._id) === String(driveId)
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Placement drive with ID '${driveId}' not found.`
      });
    }

    const currentDrive = recruiterStore.drives[index];

    // Security & Ownership check
    if (currentDrive.company_email !== email && currentDrive.company_id !== company.id) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not own or have permission to close this placement drive.'
      });
    }

    currentDrive.status = 'closed';
    recruiterStore.drives[index] = currentDrive;

    return res.status(200).json({
      success: true,
      message: 'Placement drive closed.',
      drive: currentDrive
    });
  } catch (err) {
    console.error('[Recruiter Close Drive Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to close placement drive',
      error: err.message
    });
  }
};

// ==========================================
// Step 7C: Candidate Pipeline & Applicant Review
// ==========================================

// GET /api/recruiters/applicants
exports.getApplicants = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    let company = getCompanyByEmail(email);

    if (mongoose.connection.readyState === 1) {
      try {
        const mongoComp = await Company.findOne({ email }).lean();
        if (mongoComp) company = mongoComp;
      } catch (err) {
        console.warn('[Recruiter Mongo]: Fallback to memory store', err.message);
      }
    }

    // Filter drives belonging to recruiter
    const userDrives = recruiterStore.drives.filter(
      d => d.company_email === email || d.company_id === company.id
    );

    // Filter applicants belonging to recruiter's company
    let apps = recruiterStore.applications.filter(
      a => a.company_email === email || a.company_id === company.id
    );

    const { drive_id, driveId, status, q, search } = req.query;
    const selectedDrive = drive_id || driveId;
    const statusFilter = status;
    const searchKeyword = (q || search || '').toLowerCase().trim();

    if (selectedDrive) {
      apps = apps.filter(a => String(a.drive_id) === String(selectedDrive));
    }

    if (statusFilter && statusFilter.trim()) {
      apps = apps.filter(a => a.status.toLowerCase() === statusFilter.toLowerCase().trim());
    }

    if (searchKeyword) {
      apps = apps.filter(a =>
        (a.student_name && a.student_name.toLowerCase().includes(searchKeyword)) ||
        (a.name && a.name.toLowerCase().includes(searchKeyword)) ||
        (a.student_no && a.student_no.toLowerCase().includes(searchKeyword)) ||
        (a.department && a.department.toLowerCase().includes(searchKeyword)) ||
        (a.drive_title && a.drive_title.toLowerCase().includes(searchKeyword))
      );
    }

    return res.status(200).json({
      success: true,
      count: apps.length,
      applicants: apps,
      drives: userDrives.map(d => ({ id: d.id, title: d.title }))
    });
  } catch (err) {
    console.error('[Recruiter Get Applicants Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve applicants',
      error: err.message
    });
  }
};

// GET /api/recruiters/applicants/:id
exports.getApplicantById = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const company = getCompanyByEmail(email);
    const appId = req.params.id;

    const applicant = recruiterStore.applications.find(
      a => String(a.id) === String(appId) || String(a._id) === String(appId)
    );

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: `Applicant with ID '${appId}' not found.`
      });
    }

    // Ownership check: Recruiter must own the drive/company
    if (applicant.company_email !== email && applicant.company_id !== company.id) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not have permission to view this applicant.'
      });
    }

    return res.status(200).json({
      success: true,
      applicant
    });
  } catch (err) {
    console.error('[Recruiter Get Applicant Detail Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve applicant details',
      error: err.message
    });
  }
};

// PUT or POST /api/recruiters/applicants/:id/status
exports.updateApplicantStatus = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const company = getCompanyByEmail(email);
    const appId = req.params.id;
    const newStatus = req.body.status;

    const validStatuses = [
      'Applied',
      'Under Review',
      'Shortlisted',
      'Interview Scheduled',
      'Selected',
      'Rejected'
    ];

    if (!newStatus || !validStatuses.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status '${newStatus}'. Allowed statuses: ${validStatuses.join(', ')}`
      });
    }

    const index = recruiterStore.applications.findIndex(
      a => String(a.id) === String(appId) || String(a._id) === String(appId)
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Applicant with ID '${appId}' not found.`
      });
    }

    const applicant = recruiterStore.applications[index];

    // Ownership check
    if (applicant.company_email !== email && applicant.company_id !== company.id) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not have permission to update this applicant.'
      });
    }

    // Update in-memory applicant status
    applicant.status = newStatus;
    applicant.updated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
    recruiterStore.applications[index] = applicant;

    // Synchronize with Student Portal store for live reflection
    if (studentStore) {
      // 1. Sync student application status
      if (studentStore.applications && Array.isArray(studentStore.applications)) {
        const studentApp = studentStore.applications.find(
          sa => sa.drive_id === 'drv-1' || String(sa.drive_id) === String(applicant.drive_id) || sa.drive_title === applicant.drive_title
        );
        if (studentApp && (applicant.student_no === 'CS2023001' || applicant.student_name === 'Priya Sharma' || applicant.student_id === 1 || applicant.id === 101)) {
          studentApp.status = newStatus;
        }
      }

      // 2. Push Notification to student notification center
      if (studentStore.notifications && Array.isArray(studentStore.notifications)) {
        studentStore.notifications.unshift({
          id: `notif-${Date.now()}`,
          message: `Your application for '${applicant.drive_title}' at ${company.name} is now: ${newStatus}.`,
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
          is_read: false
        });
      }
    }

    // Update MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        await Application.findByIdAndUpdate(
          applicant._id || applicant.id,
          { $set: { status: newStatus, updatedAt: new Date() } }
        );
      } catch (err) {
        console.warn('[Recruiter Mongo Update Status]:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `${applicant.student_name || applicant.name}'s status updated to ${newStatus}.`,
      applicant
    });
  } catch (err) {
    console.error('[Recruiter Update Applicant Status Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update applicant status',
      error: err.message
    });
  }
};

// ==========================================
// Step 7D: Recruiter Interview Management
// ==========================================

// GET /api/recruiters/interviews
exports.getInterviews = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const company = getCompanyByEmail(email);

    // Filter drives belonging to recruiter
    const userDrives = recruiterStore.drives.filter(
      d => d.company_email === email || d.company_id === company.id
    );

    // Filter interviews belonging to recruiter's company
    let items = (recruiterStore.interviews || []).filter(
      i => i.company_email === email || i.company_id === company.id
    );

    const { drive_id, driveId, status, q, search } = req.query;
    const selectedDrive = drive_id || driveId;
    const statusFilter = status;
    const searchKeyword = (q || search || '').toLowerCase().trim();

    if (selectedDrive) {
      items = items.filter(i => String(i.drive_id) === String(selectedDrive));
    }

    if (statusFilter && statusFilter.trim()) {
      items = items.filter(i => i.status.toLowerCase() === statusFilter.toLowerCase().trim());
    }

    if (searchKeyword) {
      items = items.filter(i =>
        (i.student_name && i.student_name.toLowerCase().includes(searchKeyword)) ||
        (i.student_no && i.student_no.toLowerCase().includes(searchKeyword)) ||
        (i.drive_title && i.drive_title.toLowerCase().includes(searchKeyword)) ||
        (i.round_name && i.round_name.toLowerCase().includes(searchKeyword)) ||
        (i.venue && i.venue.toLowerCase().includes(searchKeyword))
      );
    }

    // Sort by scheduled_date descending
    items.sort((a, b) => new Date(b.scheduled_date || 0) - new Date(a.scheduled_date || 0));

    return res.status(200).json({
      success: true,
      count: items.length,
      interviews: items,
      drives: userDrives.map(d => ({ id: d.id, title: d.title }))
    });
  } catch (err) {
    console.error('[Recruiter Get Interviews Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve scheduled interviews',
      error: err.message
    });
  }
};

// GET /api/recruiters/interviews/:id
exports.getInterviewById = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const company = getCompanyByEmail(email);
    const intId = req.params.id;

    const interview = (recruiterStore.interviews || []).find(
      i => String(i.id) === String(intId) || String(i._id) === String(intId)
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: `Interview with ID '${intId}' not found.`
      });
    }

    // Ownership check: Recruiter must own the company/drive
    if (interview.company_email !== email && interview.company_id !== company.id) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not have permission to view this interview.'
      });
    }

    return res.status(200).json({
      success: true,
      interview
    });
  } catch (err) {
    console.error('[Recruiter Get Interview Detail Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve interview details',
      error: err.message
    });
  }
};

// POST /api/recruiters/interviews (Schedule Interview)
exports.scheduleInterview = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const company = getCompanyByEmail(email);

    const {
      application_id,
      applicationId,
      round_name,
      roundName,
      scheduled_date,
      scheduledDate,
      scheduled_time,
      scheduledTime,
      interview_type,
      interviewType,
      venue
    } = req.body;

    const appId = application_id || applicationId;
    const round = round_name || roundName || 'Technical Round 1';
    const date = scheduled_date || scheduledDate;
    const time = scheduled_time || scheduledTime;
    const format = interview_type || interviewType || 'Online';
    const loc = venue ? venue.trim() : (format === 'Online' ? 'Google Meet link will be shared via email' : 'Campus Placement Cell');

    const errors = [];
    if (!appId) errors.push('Application ID is required.');
    if (!round || !round.trim()) errors.push('Round name / stage is required.');
    if (!date) errors.push('Scheduled date is required.');
    if (!time) errors.push('Scheduled time is required.');

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(' ')
      });
    }

    // Find application in recruiterStore
    const application = (recruiterStore.applications || []).find(
      a => String(a.id) === String(appId) || String(a._id) === String(appId)
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Application with ID '${appId}' not found.`
      });
    }

    // Security & Ownership check
    if (application.company_email !== email && application.company_id !== company.id) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not have permission to schedule interviews for this application.'
      });
    }

    const candName = application.student_name || application.name || 'Candidate';
    const candNo = application.student_no || 'STU';

    const newInterview = {
      id: Date.now(),
      application_id: application.id,
      drive_id: application.drive_id,
      drive_title: application.drive_title || 'Software Engineer',
      company_id: company.id,
      company_email: email,
      company_name: company.name,
      student_id: application.student_id,
      student_name: candName,
      student_no: candNo,
      round_name: round.trim(),
      scheduled_date: date,
      scheduled_time: time.trim(),
      interview_type: format,
      venue: loc,
      status: 'Scheduled',
      created_at: new Date().toISOString()
    };

    if (!recruiterStore.interviews) {
      recruiterStore.interviews = [];
    }
    recruiterStore.interviews.unshift(newInterview);

    // Update application status to 'Interview Scheduled'
    application.status = 'Interview Scheduled';
    application.updated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Synchronize with Student Portal store
    if (studentStore) {
      // 1. Sync student application status
      if (studentStore.applications && Array.isArray(studentStore.applications)) {
        const studentApp = studentStore.applications.find(
          sa => sa.drive_id === 'drv-1' || String(sa.drive_id) === String(application.drive_id) || sa.drive_title === application.drive_title
        );
        if (studentApp && (application.student_no === 'CS2023001' || candName === 'Priya Sharma' || application.student_id === 1 || application.id === 101)) {
          studentApp.status = 'Interview Scheduled';
          studentApp.interview_date = date;
        }
      }

      // 2. Add to student interviews calendar
      if (studentStore.interviews && Array.isArray(studentStore.interviews)) {
        const studentInt = {
          id: `int-${Date.now()}`,
          application_id: newInterview.application_id,
          company_name: company.name,
          drive_title: newInterview.drive_title,
          round_name: newInterview.round_name,
          scheduled_date: newInterview.scheduled_date,
          scheduled_time: newInterview.scheduled_time,
          interview_type: newInterview.interview_type,
          venue: newInterview.venue,
          status: 'Scheduled'
        };
        // Avoid duplicates if same round exists
        const existingIdx = studentStore.interviews.findIndex(
          si => si.drive_title === newInterview.drive_title && si.round_name === newInterview.round_name
        );
        if (existingIdx >= 0) {
          studentStore.interviews[existingIdx] = studentInt;
        } else {
          studentStore.interviews.unshift(studentInt);
        }
      }

      // 3. Push Student Notification
      if (studentStore.notifications && Array.isArray(studentStore.notifications)) {
        studentStore.notifications.unshift({
          id: `notif-${Date.now()}`,
          message: `Interview Scheduled: ${newInterview.round_name} for '${newInterview.drive_title}' with ${company.name} on ${newInterview.scheduled_date} at ${newInterview.scheduled_time}.`,
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
          is_read: false
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: `Interview scheduled for ${candName} and candidate notified.`,
      interview: newInterview
    });
  } catch (err) {
    console.error('[Recruiter Schedule Interview Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to schedule interview',
      error: err.message
    });
  }
};

// PUT /api/recruiters/interviews/:id (Update / Reschedule / Update Status)
exports.updateInterview = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const company = getCompanyByEmail(email);
    const intId = req.params.id;

    const index = (recruiterStore.interviews || []).findIndex(
      i => String(i.id) === String(intId) || String(i._id) === String(intId)
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Interview with ID '${intId}' not found.`
      });
    }

    const current = recruiterStore.interviews[index];

    // Security & Ownership check
    if (current.company_email !== email && current.company_id !== company.id) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not have permission to update this interview.'
      });
    }

    const {
      round_name,
      roundName,
      scheduled_date,
      scheduledDate,
      scheduled_time,
      scheduledTime,
      interview_type,
      interviewType,
      venue,
      status
    } = req.body;

    const validStatuses = ['Scheduled', 'Completed', 'Cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status '${status}'. Allowed statuses: ${validStatuses.join(', ')}`
      });
    }

    const updated = {
      ...current,
      round_name: round_name !== undefined ? round_name.trim() : (roundName !== undefined ? roundName.trim() : current.round_name),
      scheduled_date: scheduled_date || scheduledDate || current.scheduled_date,
      scheduled_time: scheduled_time !== undefined ? scheduled_time.trim() : (scheduledTime !== undefined ? scheduledTime.trim() : current.scheduled_time),
      interview_type: interview_type || interviewType || current.interview_type,
      venue: venue !== undefined ? venue.trim() : current.venue,
      status: status || current.status,
      updated_at: new Date().toISOString()
    };

    recruiterStore.interviews[index] = updated;

    // Sync with Student Portal store
    if (studentStore && studentStore.interviews) {
      const stuInt = studentStore.interviews.find(
        si => si.drive_title === updated.drive_title && (si.round_name === current.round_name || si.round_name === updated.round_name)
      );
      if (stuInt) {
        stuInt.round_name = updated.round_name;
        stuInt.scheduled_date = updated.scheduled_date;
        stuInt.scheduled_time = updated.scheduled_time;
        stuInt.interview_type = updated.interview_type;
        stuInt.venue = updated.venue;
        stuInt.status = updated.status;
      }

      if (status === 'Cancelled') {
        studentStore.notifications.unshift({
          id: `notif-${Date.now()}`,
          message: `Interview Update: Your interview for '${updated.drive_title}' with ${company.name} has been cancelled.`,
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
          is_read: false
        });
      } else if (scheduled_date || scheduled_time) {
        studentStore.notifications.unshift({
          id: `notif-${Date.now()}`,
          message: `Interview Rescheduled: ${updated.round_name} for '${updated.drive_title}' with ${company.name} is now on ${updated.scheduled_date} at ${updated.scheduled_time}.`,
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
          is_read: false
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Interview updated successfully.',
      interview: updated
    });
  } catch (err) {
    console.error('[Recruiter Update Interview Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update interview',
      error: err.message
    });
  }
};

// DELETE or POST /api/recruiters/interviews/:id/cancel
exports.cancelInterview = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const company = getCompanyByEmail(email);
    const intId = req.params.id;

    const index = (recruiterStore.interviews || []).findIndex(
      i => String(i.id) === String(intId) || String(i._id) === String(intId)
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Interview with ID '${intId}' not found.`
      });
    }

    const current = recruiterStore.interviews[index];

    // Security & Ownership check
    if (current.company_email !== email && current.company_id !== company.id) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not have permission to cancel this interview.'
      });
    }

    current.status = 'Cancelled';
    current.updated_at = new Date().toISOString();
    recruiterStore.interviews[index] = current;

    // Sync with Student Portal store
    if (studentStore && studentStore.interviews) {
      const stuInt = studentStore.interviews.find(
        si => si.drive_title === current.drive_title && si.round_name === current.round_name
      );
      if (stuInt) {
        stuInt.status = 'Cancelled';
      }

      studentStore.notifications.unshift({
        id: `notif-${Date.now()}`,
        message: `Interview Cancelled: Your interview round '${current.round_name}' for '${current.drive_title}' with ${company.name} has been cancelled.`,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
        is_read: false
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Interview cancelled.',
      interview: current
    });
  } catch (err) {
    console.error('[Recruiter Cancel Interview Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel interview',
      error: err.message
    });
  }
};

// ==========================================
// Step 7E: Recruiter Placement Results & Offers
// ==========================================

// GET /api/recruiters/results
exports.getResults = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const company = getCompanyByEmail(email);

    // Filter drives belonging to recruiter
    const userDrives = recruiterStore.drives.filter(
      d => d.company_email === email || d.company_id === company.id
    );

    // Filter results belonging to recruiter's company
    let items = (recruiterStore.results || []).filter(
      r => r.company_email === email || r.company_id === company.id
    );

    const { drive_id, driveId, status, q, search } = req.query;
    const selectedDrive = drive_id || driveId;
    const statusFilter = status;
    const searchKeyword = (q || search || '').toLowerCase().trim();

    if (selectedDrive) {
      items = items.filter(r => String(r.drive_id) === String(selectedDrive));
    }

    if (statusFilter && statusFilter.trim()) {
      items = items.filter(r => r.status.toLowerCase() === statusFilter.toLowerCase().trim());
    }

    if (searchKeyword) {
      items = items.filter(r =>
        (r.student_name && r.student_name.toLowerCase().includes(searchKeyword)) ||
        (r.student_no && r.student_no.toLowerCase().includes(searchKeyword)) ||
        (r.department && r.department.toLowerCase().includes(searchKeyword)) ||
        (r.drive_title && r.drive_title.toLowerCase().includes(searchKeyword))
      );
    }

    // Sort by updated_at or placement_date descending
    items.sort((a, b) => new Date(b.updated_at || b.placement_date || 0) - new Date(a.updated_at || a.placement_date || 0));

    return res.status(200).json({
      success: true,
      count: items.length,
      results: items,
      drives: userDrives.map(d => ({ id: d.id, title: d.title }))
    });
  } catch (err) {
    console.error('[Recruiter Get Results Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve placement results',
      error: err.message
    });
  }
};

// GET /api/recruiters/results/:id
exports.getResultById = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const company = getCompanyByEmail(email);
    const resId = req.params.id;

    const result = (recruiterStore.results || []).find(
      r => String(r.id) === String(resId) || String(r._id) === String(resId)
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Placement result with ID '${resId}' not found.`
      });
    }

    // Ownership check
    if (result.company_email !== email && result.company_id !== company.id) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not have permission to view this placement record.'
      });
    }

    return res.status(200).json({
      success: true,
      result
    });
  } catch (err) {
    console.error('[Recruiter Get Result Detail Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve placement result details',
      error: err.message
    });
  }
};

// POST /api/recruiters/results (or /api/recruiters/results/:appId/package)
exports.createOrUpdateResult = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const company = getCompanyByEmail(email);

    const appId = req.params.appId || req.params.app_id || req.body.application_id || req.body.applicationId || req.body.app_id;
    const { package: pkg, placement_date, placementDate, status } = req.body;

    if (!appId) {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required.'
      });
    }

    const parsedPackage = parseFloat(pkg);
    if (isNaN(parsedPackage) || parsedPackage <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Annual compensation package (LPA) must be a positive numeric value.'
      });
    }

    // Find application in recruiterStore
    const application = (recruiterStore.applications || []).find(
      a => String(a.id) === String(appId) || String(a._id) === String(appId)
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Application with ID '${appId}' not found.`
      });
    }

    // Security & Ownership check
    if (application.company_email !== email && application.company_id !== company.id) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not have permission to create placement offers for this application.'
      });
    }

    const candName = application.student_name || application.name || 'Candidate';
    const candNo = application.student_no || 'STU';
    const outcomeStatus = status || 'Selected';
    const outcomeDate = placement_date || placementDate || new Date().toISOString().split('T')[0];

    if (!recruiterStore.results) {
      recruiterStore.results = [];
    }

    // Check if result record already exists for application
    const existingIndex = recruiterStore.results.findIndex(
      r => String(r.application_id) === String(application.id)
    );

    let savedResult = null;
    if (existingIndex >= 0) {
      recruiterStore.results[existingIndex] = {
        ...recruiterStore.results[existingIndex],
        package: parsedPackage,
        placement_date: outcomeDate,
        status: outcomeStatus,
        updated_at: new Date().toISOString()
      };
      savedResult = recruiterStore.results[existingIndex];
    } else {
      savedResult = {
        id: Date.now(),
        application_id: application.id,
        company_id: company.id,
        company_email: email,
        company_name: company.name,
        drive_id: application.drive_id,
        drive_title: application.drive_title || 'Software Engineer',
        student_id: application.student_id,
        student_name: candName,
        student_no: candNo,
        department: application.department || 'Computer Science',
        package: parsedPackage,
        placement_date: outcomeDate,
        status: outcomeStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      recruiterStore.results.unshift(savedResult);
    }

    // Update application status to Selected
    application.status = outcomeStatus;
    application.updated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Synchronize with Student Portal store
    if (studentStore) {
      // 1. Sync student application status
      if (studentStore.applications && Array.isArray(studentStore.applications)) {
        const studentApp = studentStore.applications.find(
          sa => sa.drive_id === 'drv-1' || String(sa.drive_id) === String(application.drive_id) || sa.drive_title === application.drive_title
        );
        if (studentApp && (application.student_no === 'CS2023001' || candName === 'Priya Sharma' || application.student_id === 1 || application.id === 101)) {
          studentApp.status = outcomeStatus;
          studentApp.package_lpa = parsedPackage;
        }
      }

      // 2. Push Student Notification
      if (studentStore.notifications && Array.isArray(studentStore.notifications)) {
        studentStore.notifications.unshift({
          id: `notif-${Date.now()}`,
          message: `Placement Offer: Congratulations! You have received a formal offer for '${savedResult.drive_title}' with ${company.name} at ₹${parsedPackage} LPA.`,
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
          is_read: false
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Placement offer of ₹${parsedPackage} LPA for ${candName} saved successfully.`,
      result: savedResult
    });
  } catch (err) {
    console.error('[Recruiter Set Package Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to save placement offer details',
      error: err.message
    });
  }
};

// PUT /api/recruiters/results/:id (Update Result)
exports.updateResult = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const company = getCompanyByEmail(email);
    const resId = req.params.id;

    const index = (recruiterStore.results || []).findIndex(
      r => String(r.id) === String(resId) || String(r._id) === String(resId)
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Placement result with ID '${resId}' not found.`
      });
    }

    const current = recruiterStore.results[index];

    // Ownership check
    if (current.company_email !== email && current.company_id !== company.id) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not have permission to update this placement record.'
      });
    }

    const { package: pkg, placement_date, placementDate, status } = req.body;
    const parsedPkg = pkg !== undefined ? parseFloat(pkg) : current.package;

    if (pkg !== undefined && (isNaN(parsedPkg) || parsedPkg <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Package must be a positive number.'
      });
    }

    const updated = {
      ...current,
      package: parsedPkg,
      placement_date: placement_date || placementDate || current.placement_date,
      status: status || current.status,
      updated_at: new Date().toISOString()
    };

    recruiterStore.results[index] = updated;

    return res.status(200).json({
      success: true,
      message: 'Placement result updated successfully.',
      result: updated
    });
  } catch (err) {
    console.error('[Recruiter Update Result Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update placement result',
      error: err.message
    });
  }
};

// GET /api/recruiters/notifications
exports.getNotifications = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const company = getCompanyByEmail(email);
    const companyId = company?.id;

    let items = (recruiterStore.notifications || []).filter(
      n => n.company_email === email || n.company_id === companyId || n.user_id === req.user?.id
    );

    // Fallback: If no company-specific items yet, return existing seeded items for demo
    if (items.length === 0 && (email === 'hr@technova.com' || !req.user)) {
      items = recruiterStore.notifications || [];
    }

    // Sort newest first
    items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const unreadCount = items.filter(n => !n.is_read && !n.isRead).length;

    return res.status(200).json({
      success: true,
      total: items.length,
      unread_count: unreadCount,
      data: items
    });
  } catch (err) {
    console.error('[Recruiter Get Notifications Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch recruiter notifications',
      error: err.message
    });
  }
};

// PUT /api/recruiters/notifications/:id/read
exports.markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = (recruiterStore.notifications || []).find(n => String(n.id) === String(id));
    if (notif) {
      notif.is_read = true;
      notif.isRead = true;
    }
    return res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      data: notif
    });
  } catch (err) {
    console.error('[Recruiter Mark Notification Read Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: err.message
    });
  }
};

// POST /api/recruiters/notifications/read-all
exports.markAllNotificationsRead = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const company = getCompanyByEmail(email);
    const companyId = company?.id;

    (recruiterStore.notifications || []).forEach(n => {
      if (n.company_email === email || n.company_id === companyId || n.user_id === req.user?.id || email === 'hr@technova.com') {
        n.is_read = true;
        n.isRead = true;
      }
    });

    return res.status(200).json({
      success: true,
      message: 'All recruiter notifications marked as read.'
    });
  } catch (err) {
    console.error('[Recruiter Mark All Read Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: err.message
    });
  }
};

exports.recruiterStore = recruiterStore;



