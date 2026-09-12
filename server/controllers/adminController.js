const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Drive = require('../models/Drive');
const Application = require('../models/Application');
const PlacementResult = require('../models/PlacementResult');
const Notification = require('../models/Notification');

// Institutional Students Master Data
const institutionalStudents = [
  {
    id: 1,
    studentNo: 'CS2023001',
    name: 'Priya Sharma',
    email: 'priya.sharma@student.edu',
    phone: '+91 98765 43210',
    department: 'Computer Science',
    gradYear: 2026,
    cgpa: 8.9,
    backlogs: 0,
    isActive: true,
    skills: ['Python', 'React', 'Node.js', 'SQL', 'AWS'],
    applicationsCount: 4,
    status: 'Selected'
  },
  {
    id: 2,
    studentNo: 'CS2023002',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@student.edu',
    phone: '+91 98765 43211',
    department: 'Computer Science',
    gradYear: 2026,
    cgpa: 8.4,
    backlogs: 0,
    isActive: true,
    skills: ['Java', 'Spring Boot', 'SQL', 'Docker'],
    applicationsCount: 3,
    status: 'Interview Scheduled'
  },
  {
    id: 3,
    studentNo: 'IT2023015',
    name: 'Ananya Verma',
    email: 'ananya.verma@student.edu',
    phone: '+91 98765 43212',
    department: 'Information Technology',
    gradYear: 2026,
    cgpa: 9.1,
    backlogs: 0,
    isActive: true,
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
    applicationsCount: 4,
    status: 'Selected'
  },
  {
    id: 4,
    studentNo: 'EC2023042',
    name: 'Vikram Malhotra',
    email: 'vikram.m@student.edu',
    phone: '+91 98765 43213',
    department: 'Electronics & Comm.',
    gradYear: 2026,
    cgpa: 7.8,
    backlogs: 1,
    isActive: true,
    skills: ['C++', 'Embedded C', 'IoT', 'Python'],
    applicationsCount: 2,
    status: 'Shortlisted'
  },
  {
    id: 5,
    studentNo: 'CS2023009',
    name: 'Sneha Patel',
    email: 'sneha.patel@student.edu',
    phone: '+91 98765 43214',
    department: 'Computer Science',
    gradYear: 2026,
    cgpa: 8.7,
    backlogs: 0,
    isActive: true,
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    applicationsCount: 3,
    status: 'Selected'
  },
  {
    id: 6,
    studentNo: 'ME2023088',
    name: 'Aditya Rao',
    email: 'aditya.rao@student.edu',
    phone: '+91 98765 43215',
    department: 'Mechanical Engineering',
    gradYear: 2026,
    cgpa: 7.5,
    backlogs: 0,
    isActive: true,
    skills: ['AutoCAD', 'SolidWorks', 'Python', 'Ansys'],
    applicationsCount: 2,
    status: 'Applied'
  },
  {
    id: 7,
    studentNo: 'IT2023028',
    name: 'Kavita Nair',
    email: 'kavita.n@student.edu',
    phone: '+91 98765 43216',
    department: 'Information Technology',
    gradYear: 2026,
    cgpa: 8.2,
    backlogs: 0,
    isActive: true,
    skills: ['Cloud Computing', 'AWS', 'Linux', 'Python'],
    applicationsCount: 3,
    status: 'Interview Scheduled'
  },
  {
    id: 8,
    studentNo: 'EE2023055',
    name: 'Rahul Deshmukh',
    email: 'rahul.d@student.edu',
    phone: '+91 98765 43217',
    department: 'Electrical Engineering',
    gradYear: 2026,
    cgpa: 7.9,
    backlogs: 0,
    isActive: true,
    skills: ['MATLAB', 'Power Systems', 'C++', 'IoT'],
    applicationsCount: 2,
    status: 'Shortlisted'
  }
];

// Institutional Recruiters / Companies Master Data
let institutionalCompanies = [
  {
    id: 1,
    name: 'TechNova Solutions',
    industry: 'Software / IT',
    website: 'https://technova.example.com',
    hrContact: 'Anita Rao',
    email: 'hr@technova.com',
    phone: '9363328006',
    location: 'Bengaluru',
    description: 'Premier technology consulting firm specializing in high-throughput enterprise systems.',
    approved: true,
    activeDrives: 2,
    createdAt: '2026-08-27'
  },
  {
    id: 2,
    name: 'DataEdge Analytics',
    industry: 'Data & AI',
    website: 'https://dataedge.example.com',
    hrContact: 'Vikram Mehta',
    email: 'talent@dataedge.com',
    phone: '9876543220',
    location: 'Hyderabad',
    description: 'Enterprise analytics and machine learning intelligence platforms.',
    approved: true,
    activeDrives: 1,
    createdAt: '2026-08-28'
  },
  {
    id: 3,
    name: 'Apex Cloud Systems',
    industry: 'Cloud Infrastructure',
    website: 'https://apexcloud.example.com',
    hrContact: 'Arun Kumar',
    email: 'talent@apexcloud.io',
    phone: '9876543210',
    location: 'Bengaluru',
    description: 'Leading next-gen enterprise multi-cloud management platform.',
    approved: true,
    activeDrives: 1,
    createdAt: '2026-09-11'
  },
  {
    id: 4,
    name: 'CyberGuard Security',
    industry: 'Cybersecurity',
    website: 'https://cyberguard.example.com',
    hrContact: 'Meera Sen',
    email: 'careers@cyberguard.io',
    phone: '9876543230',
    location: 'Bengaluru',
    description: 'Zero-trust enterprise security solutions and automated threat response.',
    approved: true,
    activeDrives: 1,
    createdAt: '2026-08-30'
  },
  {
    id: 5,
    name: 'NextGen Mobility',
    industry: 'Automotive / EV Tech',
    website: 'https://nextgenmobility.example.com',
    hrContact: 'Sunil Joshi',
    email: 'recruiting@nextgenmobility.com',
    phone: '9876543240',
    location: 'Chennai',
    description: 'Electric vehicle telemetry, battery management, and smart mobility software.',
    approved: true,
    activeDrives: 1,
    createdAt: '2026-09-01'
  },
  {
    id: 6,
    name: 'BioHealth Informatics',
    industry: 'Healthcare / Biotech',
    website: 'https://biohealth.example.com',
    hrContact: 'Dr. Shalini Roy',
    email: 'jobs@biohealth.org',
    phone: '9876543250',
    location: 'Mumbai',
    description: 'Clinical genomics data pipelines and health AI analytics.',
    approved: true,
    activeDrives: 1,
    createdAt: '2026-09-02'
  },
  {
    id: 7,
    name: 'Stellar FinTech Labs',
    industry: 'Financial Technology',
    website: 'https://stellarfintech.example.com',
    hrContact: 'Pooja Hegde',
    email: 'talent@stellarfintech.com',
    phone: '9876543260',
    location: 'Mumbai',
    description: 'High-frequency algorithmic trading infrastructure and digital banking solutions.',
    approved: true,
    activeDrives: 0,
    createdAt: '2026-09-03'
  },
  {
    id: 8,
    name: 'InnovateAI Solutions',
    industry: 'Artificial Intelligence',
    website: 'https://innovateai.example.com',
    hrContact: 'Karthik Raman',
    email: 'contact@innovateai.com',
    phone: '9876543270',
    location: 'Pune',
    description: 'Generative AI workflows and custom LLM deployment for enterprise clients.',
    approved: false,
    activeDrives: 0,
    createdAt: '2026-09-12'
  }
];

// Institutional Placement Drives Master Data
const institutionalDrives = [
  {
    id: 1,
    title: 'Software Engineer - New Grad',
    companyName: 'TechNova Solutions',
    companyEmail: 'hr@technova.com',
    jobType: 'Full-Time',
    ctc: 12.0,
    location: 'Bengaluru',
    minCgpa: 7.0,
    maxBacklogs: 1,
    openings: 20,
    deadline: '2026-09-15',
    driveDate: '2026-09-26',
    applicantCount: 5,
    status: 'active',
    branches: ['Computer Science', 'Information Technology', 'Electronics & Comm.'],
    description: 'We are hiring for Software Engineer - New Grad roles to build enterprise cloud services.'
  },
  {
    id: 2,
    title: 'Data Platform Engineer',
    companyName: 'DataEdge Analytics',
    companyEmail: 'talent@dataedge.com',
    jobType: 'Full-Time',
    ctc: 14.5,
    location: 'Hyderabad',
    minCgpa: 7.5,
    maxBacklogs: 0,
    openings: 10,
    deadline: '2026-09-20',
    driveDate: '2026-09-28',
    applicantCount: 4,
    status: 'active',
    branches: ['Computer Science', 'Information Technology'],
    description: 'Building high-throughput real-time distributed data ingestion architectures.'
  },
  {
    id: 3,
    title: 'Cloud Infrastructure Associate',
    companyName: 'Apex Cloud Systems',
    companyEmail: 'talent@apexcloud.io',
    jobType: 'Full-Time',
    ctc: 11.0,
    location: 'Pune',
    minCgpa: 6.8,
    maxBacklogs: 1,
    openings: 15,
    deadline: '2026-09-22',
    driveDate: '2026-09-30',
    applicantCount: 3,
    status: 'active',
    branches: ['Computer Science', 'Information Technology', 'Electrical Engineering'],
    description: 'Infrastructure automation with Kubernetes, Terraform, and cloud networking.'
  },
  {
    id: 4,
    title: 'Graduate DevOps Engineer',
    companyName: 'CyberGuard Security',
    companyEmail: 'careers@cyberguard.io',
    jobType: 'Full-Time',
    ctc: 10.5,
    location: 'Bengaluru',
    minCgpa: 7.0,
    maxBacklogs: 0,
    openings: 8,
    deadline: '2026-09-25',
    driveDate: '2026-10-02',
    applicantCount: 3,
    status: 'active',
    branches: ['Computer Science', 'Information Technology', 'Electronics & Comm.'],
    description: 'Automated CI/CD security pipelines and vulnerability auditing.'
  },
  {
    id: 5,
    title: 'Full Stack Developer',
    companyName: 'NextGen Mobility',
    companyEmail: 'recruiting@nextgenmobility.com',
    jobType: 'Full-Time',
    ctc: 13.0,
    location: 'Chennai',
    minCgpa: 7.2,
    maxBacklogs: 0,
    openings: 12,
    deadline: '2026-09-28',
    driveDate: '2026-10-05',
    applicantCount: 5,
    status: 'active',
    branches: ['Computer Science', 'Information Technology'],
    description: 'React and Node.js microservices for next-generation vehicle telematics.'
  },
  {
    id: 6,
    title: 'Bioinformatics Research Engineer',
    companyName: 'BioHealth Informatics',
    companyEmail: 'jobs@biohealth.org',
    jobType: 'Full-Time',
    ctc: 11.5,
    location: 'Mumbai',
    minCgpa: 7.5,
    maxBacklogs: 0,
    openings: 6,
    deadline: '2026-09-30',
    driveDate: '2026-10-08',
    applicantCount: 2,
    status: 'active',
    branches: ['Computer Science', 'Information Technology', 'Biotechnology'],
    description: 'Genomic sequence analysis and computational biology pipelines.'
  },
  {
    id: 7,
    title: 'Graduate Cloud Engineer 2026',
    companyName: 'TechNova Solutions',
    companyEmail: 'hr@technova.com',
    jobType: 'Full-Time',
    ctc: 12.5,
    location: 'Bengaluru',
    minCgpa: 7.5,
    maxBacklogs: 0,
    openings: 10,
    deadline: '2026-09-18',
    driveDate: '2026-09-29',
    applicantCount: 4,
    status: 'active',
    branches: ['Computer Science', 'Information Technology'],
    description: 'Deploying robust cloud microservices on AWS and GCP.'
  }
];

// Institutional Applications Master Data
const institutionalApplications = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Priya Sharma',
    studentNo: 'CS2023001',
    studentEmail: 'priya.sharma@student.edu',
    department: 'Computer Science',
    cgpa: 8.9,
    driveId: 1,
    driveTitle: 'Software Engineer - New Grad',
    companyName: 'TechNova Solutions',
    ctc: 12.0,
    status: 'Selected',
    appliedAt: '2026-09-01 10:30'
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'Rohan Gupta',
    studentNo: 'CS2023002',
    studentEmail: 'rohan.gupta@student.edu',
    department: 'Computer Science',
    cgpa: 8.4,
    driveId: 1,
    driveTitle: 'Software Engineer - New Grad',
    companyName: 'TechNova Solutions',
    ctc: 12.0,
    status: 'Interview Scheduled',
    appliedAt: '2026-09-01 11:15'
  },
  {
    id: 3,
    studentId: 3,
    studentName: 'Ananya Verma',
    studentNo: 'IT2023015',
    studentEmail: 'ananya.verma@student.edu',
    department: 'Information Technology',
    cgpa: 9.1,
    driveId: 2,
    driveTitle: 'Data Platform Engineer',
    companyName: 'DataEdge Analytics',
    ctc: 14.5,
    status: 'Selected',
    appliedAt: '2026-09-02 09:45'
  },
  {
    id: 4,
    studentId: 5,
    studentName: 'Sneha Patel',
    studentNo: 'CS2023009',
    studentEmail: 'sneha.patel@student.edu',
    department: 'Computer Science',
    cgpa: 8.7,
    driveId: 5,
    driveTitle: 'Full Stack Developer',
    companyName: 'NextGen Mobility',
    ctc: 13.0,
    status: 'Selected',
    appliedAt: '2026-09-03 14:20'
  },
  {
    id: 5,
    studentId: 4,
    studentName: 'Vikram Malhotra',
    studentNo: 'EC2023042',
    studentEmail: 'vikram.m@student.edu',
    department: 'Electronics & Comm.',
    cgpa: 7.8,
    driveId: 3,
    driveTitle: 'Cloud Infrastructure Associate',
    companyName: 'Apex Cloud Systems',
    ctc: 11.0,
    status: 'Shortlisted',
    appliedAt: '2026-09-03 16:00'
  },
  {
    id: 6,
    studentId: 7,
    studentName: 'Kavita Nair',
    studentNo: 'IT2023028',
    studentEmail: 'kavita.n@student.edu',
    department: 'Information Technology',
    cgpa: 8.2,
    driveId: 4,
    driveTitle: 'Graduate DevOps Engineer',
    companyName: 'CyberGuard Security',
    ctc: 10.5,
    status: 'Interview Scheduled',
    appliedAt: '2026-09-04 11:30'
  },
  {
    id: 7,
    studentId: 8,
    studentName: 'Rahul Deshmukh',
    studentNo: 'EE2023055',
    studentEmail: 'rahul.d@student.edu',
    department: 'Electrical Engineering',
    cgpa: 7.9,
    driveId: 3,
    driveTitle: 'Cloud Infrastructure Associate',
    companyName: 'Apex Cloud Systems',
    ctc: 11.0,
    status: 'Shortlisted',
    appliedAt: '2026-09-05 15:40'
  }
];

// Institutional Admin Notifications
let institutionalNotifications = [
  {
    id: 'notif-1',
    title: 'New Recruiter Verification Required',
    message: 'InnovateAI Solutions has submitted employer registration for placement season review.',
    type: 'company_approval',
    isRead: false,
    createdAt: '2026-09-12 09:00'
  },
  {
    id: 'notif-2',
    title: 'Drive Deadline Approaching',
    message: 'TechNova Solutions placement drive registration closes in 3 days.',
    type: 'drive_alert',
    isRead: false,
    createdAt: '2026-09-11 14:30'
  },
  {
    id: 'notif-3',
    title: 'Batch Result Published',
    message: '5 candidates have accepted final offers across TechNova and DataEdge.',
    type: 'placement_success',
    isRead: true,
    createdAt: '2026-09-10 17:00'
  },
  {
    id: 'notif-4',
    title: 'System Health & ATS Sync',
    message: 'Institutional candidate resumes and ATS scoring pipelines synchronized successfully.',
    type: 'system',
    isRead: true,
    createdAt: '2026-09-09 08:00'
  }
];

// Helper: Format Drive for Admin responses
function formatAdminDrive(d) {
  if (!d) return null;
  const idStr = (d._id || d.id || '').toString();
  const companyObj = d.company && typeof d.company === 'object' ? d.company : null;
  const compName = companyObj?.name || d.companyName || d.company_name || 'Corporate Partner';
  const compEmail = companyObj?.email || d.companyEmail || d.company_email || '';

  const deadlineStr = d.deadline instanceof Date
    ? d.deadline.toISOString().split('T')[0]
    : (d.deadline ? String(d.deadline).split('T')[0] : '');
  const driveDateStr = d.driveDate instanceof Date
    ? d.driveDate.toISOString().split('T')[0]
    : (d.driveDate ? String(d.driveDate).split('T')[0] : (d.drive_date ? String(d.drive_date).split('T')[0] : ''));

  const jobType = d.jobType || d.job_type || 'Full-Time';
  const minCgpa = d.minCgpa !== undefined ? Number(d.minCgpa) : (d.min_cgpa !== undefined ? Number(d.min_cgpa) : 0);
  const maxBacklogs = d.maxBacklogs !== undefined ? Number(d.maxBacklogs) : (d.max_backlogs !== undefined ? Number(d.max_backlogs) : 0);
  const openings = d.openings !== undefined ? Number(d.openings) : 1;
  const ctc = d.ctc !== undefined ? Number(d.ctc) : 0;
  const applicantCount = d.applicantCount !== undefined ? Number(d.applicantCount) : (d.applicant_count !== undefined ? Number(d.applicant_count) : 0);

  return {
    id: idStr,
    _id: idStr,
    title: d.title || '',
    companyName: compName,
    company_name: compName,
    companyEmail: compEmail,
    company_email: compEmail,
    jobType: jobType,
    job_type: jobType,
    ctc: ctc,
    package: ctc,
    location: d.location || 'Bengaluru',
    minCgpa: minCgpa,
    min_cgpa: minCgpa,
    maxBacklogs: maxBacklogs,
    max_backlogs: maxBacklogs,
    openings: openings,
    deadline: deadlineStr,
    driveDate: driveDateStr,
    drive_date: driveDateStr,
    applicantCount: applicantCount,
    applicant_count: applicantCount,
    status: d.status || 'active',
    branches: Array.isArray(d.branches) ? d.branches : [],
    skills: Array.isArray(d.skills) ? d.skills : [],
    description: d.description || ''
  };
}

// GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const pendingCount = institutionalCompanies.filter(c => !c.approved).length;

    let activeDrivesCount = institutionalDrives.length;
    let recentDrivesList = institutionalDrives.slice(0, 5);

    if (mongoose.connection.readyState === 1) {
      try {
        const count = await Drive.countDocuments({ status: 'active' });
        const mongoDrives = await Drive.find().populate('company').sort({ createdAt: -1 }).limit(5).lean();
        if (mongoDrives && mongoDrives.length > 0) {
          activeDrivesCount = count;
          recentDrivesList = mongoDrives.map(d => formatAdminDrive(d));
        }
      } catch (err) {
        console.warn('[Admin Mongo Dashboard Warning]:', err.message);
      }
    }

    const stats = {
      totalStudents: institutionalStudents.length + 5, // 13 enrolled
      totalCompanies: institutionalCompanies.length, // 8 companies
      activeDrives: activeDrivesCount,
      totalApplications: 20,
      placedStudents: 5,
      placementRate: '38.5%',
      avgPackage: '11.20',
      highestPackage: '18.00',
      pendingCompanies: pendingCount,
      recentDrives: recentDrivesList
    };

    return res.status(200).json({
      success: true,
      message: 'Admin dashboard statistics retrieved successfully.',
      data: {
        stats,
        user: {
          id: req.user._id || req.user.id,
          email: req.user.email,
          role: req.user.role,
          name: req.user.name || 'Placement Administrator'
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/students
exports.getStudents = async (req, res) => {
  try {
    const { q, department } = req.query;
    let students = [...institutionalStudents];

    if (q) {
      const queryStr = q.toLowerCase();
      students = students.filter(s =>
        s.name.toLowerCase().includes(queryStr) ||
        s.email.toLowerCase().includes(queryStr) ||
        s.studentNo.toLowerCase().includes(queryStr)
      );
    }

    if (department && department !== 'All') {
      students = students.filter(s => s.department === department);
    }

    return res.status(200).json({
      success: true,
      total: students.length,
      data: students
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/students/:id
exports.getStudentById = async (req, res) => {
  try {
    const student = institutionalStudents.find(s => String(s.id) === String(req.params.id));
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }
    const apps = institutionalApplications.filter(a => a.studentId === student.id);
    return res.status(200).json({
      success: true,
      data: { ...student, applications: apps }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/recruiters (or /companies)
exports.getCompanies = async (req, res) => {
  try {
    const { q, status } = req.query;
    let companies = [...institutionalCompanies];

    if (q) {
      const queryStr = q.toLowerCase();
      companies = companies.filter(c =>
        c.name.toLowerCase().includes(queryStr) ||
        c.email.toLowerCase().includes(queryStr) ||
        c.industry.toLowerCase().includes(queryStr)
      );
    }

    if (status === 'pending') {
      companies = companies.filter(c => !c.approved);
    } else if (status === 'approved') {
      companies = companies.filter(c => c.approved);
    }

    return res.status(200).json({
      success: true,
      total: companies.length,
      data: companies
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/recruiters/:id
exports.getCompanyById = async (req, res) => {
  try {
    const company = institutionalCompanies.find(c => String(c.id) === String(req.params.id));
    if (!company) {
      return res.status(404).json({ success: false, message: 'Recruiter company record not found.' });
    }
    const drives = institutionalDrives.filter(d => d.companyEmail === company.email || d.companyName === company.name);
    return res.status(200).json({
      success: true,
      data: { ...company, drives }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/recruiters/:id/approve
exports.approveCompany = async (req, res) => {
  try {
    const company = institutionalCompanies.find(c => String(c.id) === String(req.params.id));
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }
    company.approved = true;
    return res.status(200).json({
      success: true,
      message: `${company.name} has been approved successfully for campus recruitment.`,
      data: company
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/recruiters/:id/reject
exports.rejectCompany = async (req, res) => {
  try {
    const company = institutionalCompanies.find(c => String(c.id) === String(req.params.id));
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }
    company.approved = false;
    return res.status(200).json({
      success: true,
      message: `${company.name} registration was rejected.`,
      data: company
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/drives
exports.getDrives = async (req, res) => {
  try {
    const { q, jobType, status } = req.query;
    let drives = [];

    // 1. Read from MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const mongoDrives = await Drive.find().populate('company').sort({ createdAt: -1 }).lean();
        if (mongoDrives && mongoDrives.length > 0) {
          drives = mongoDrives.map(d => formatAdminDrive(d));
        }
      } catch (err) {
        console.warn('[Admin Mongo Get Drives Warning]:', err.message);
      }
    }

    // 2. Fallback to in-memory institutionalDrives
    if (drives.length === 0) {
      drives = institutionalDrives.map(d => formatAdminDrive(d));
    }

    if (q) {
      const queryStr = q.toLowerCase();
      drives = drives.filter(d =>
        d.title.toLowerCase().includes(queryStr) ||
        d.companyName.toLowerCase().includes(queryStr) ||
        d.location.toLowerCase().includes(queryStr)
      );
    }

    if (jobType && jobType !== 'All') {
      drives = drives.filter(d => d.jobType.toLowerCase() === jobType.toLowerCase());
    }

    if (status && status !== 'All') {
      drives = drives.filter(d => d.status.toLowerCase() === status.toLowerCase());
    }

    return res.status(200).json({
      success: true,
      total: drives.length,
      data: drives
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/drives/:id
exports.getDriveById = async (req, res) => {
  try {
    const { id } = req.params;
    let drive = null;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const doc = await Drive.findById(id).populate('company').lean();
        if (doc) {
          drive = formatAdminDrive(doc);
        }
      } catch (err) {
        console.warn('[Admin Mongo Get Drive Detail Warning]:', err.message);
      }
    }

    if (!drive) {
      const fallback = institutionalDrives.find(d => String(d.id) === String(id) || String(d._id) === String(id));
      if (fallback) {
        drive = formatAdminDrive(fallback);
      }
    }

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found.' });
    }

    const apps = institutionalApplications.filter(a => String(a.driveId) === String(drive.id) || String(a.drive_id) === String(drive.id));
    return res.status(200).json({
      success: true,
      data: { ...drive, applications: apps }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/applications
exports.getApplications = async (req, res) => {
  try {
    const { q, status } = req.query;
    let apps = [...institutionalApplications];

    if (q) {
      const queryStr = q.toLowerCase();
      apps = apps.filter(a =>
        a.studentName.toLowerCase().includes(queryStr) ||
        a.companyName.toLowerCase().includes(queryStr) ||
        a.driveTitle.toLowerCase().includes(queryStr)
      );
    }

    if (status && status !== 'All') {
      apps = apps.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }

    return res.status(200).json({
      success: true,
      total: apps.length,
      data: apps
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/notifications
exports.getNotifications = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      total: institutionalNotifications.length,
      data: institutionalNotifications
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/notifications/:id/read
exports.markNotificationRead = async (req, res) => {
  try {
    const notif = institutionalNotifications.find(n => String(n.id) === String(req.params.id));
    if (notif) notif.isRead = true;
    return res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      data: notif
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getReports = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Institutional placement reports generated.'
  });
};
