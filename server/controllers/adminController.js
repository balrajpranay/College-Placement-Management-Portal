const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Drive = require('../models/Drive');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const PlacementResult = require('../models/PlacementResult');
const Notification = require('../models/Notification');

let recruiterStore = null;
try {
  recruiterStore = require('./recruiterController').recruiterStore;
} catch (e) {}

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
  const compWebsite = companyObj?.website || '';
  const compLocation = companyObj?.location || '';
  const compHrContact = companyObj?.hrContact || '';
  const compPhone = companyObj?.phone || '';

  const deadlineStr = d.deadline instanceof Date
    ? d.deadline.toISOString().split('T')[0]
    : (d.deadline ? String(d.deadline).split('T')[0] : '');
  const driveDateStr = d.driveDate instanceof Date
    ? d.driveDate.toISOString().split('T')[0]
    : (d.driveDate ? String(d.driveDate).split('T')[0] : (d.drive_date ? String(d.drive_date).split('T')[0] : ''));

  const jobType = d.jobType || d.job_type || 'Full-Time';
  const oppType = d.opportunityType || d.opportunity_type || (jobType.toLowerCase().includes('intern') ? 'Internship' : (jobType.toLowerCase().includes('skill') ? 'Skill' : 'Placement'));
  const category = d.category || (oppType === 'Internship' ? 'Internships' : (oppType === 'Skill' ? 'Skill Up' : 'Placements'));
  const workMode = d.workMode || d.work_mode || (d.location?.toLowerCase().includes('remote') ? 'Remote' : (d.location?.toLowerCase().includes('hybrid') ? 'Hybrid' : 'On-Site'));
  const minCgpa = d.minCgpa !== undefined ? Number(d.minCgpa) : (d.min_cgpa !== undefined ? Number(d.min_cgpa) : 0);
  const maxBacklogs = d.maxBacklogs !== undefined ? Number(d.maxBacklogs) : (d.max_backlogs !== undefined ? Number(d.max_backlogs) : 0);
  const openings = d.openings !== undefined ? Number(d.openings) : 1;
  const ctc = d.ctc !== undefined ? Number(d.ctc) : 0;
  const applicantCount = d.applicantCount !== undefined ? Number(d.applicantCount) : (d.applicant_count !== undefined ? Number(d.applicant_count) : 0);

  const approvalStatus = d.approvalStatus || d.approval_status || 'approved';
  const rejectionReason = d.rejectionReason || d.rejection_reason || '';
  const approvedBy = d.approvedBy || d.approved_by || null;
  const approvedAt = d.approvedAt || d.approved_at || null;
  const recruiterObj = d.recruiter && typeof d.recruiter === 'object' ? d.recruiter : null;
  const recruiter = recruiterObj || d.recruiter || null;
  const recruiterName = recruiterObj?.name || compHrContact || 'Recruiter Lead';
  const recruiterEmail = recruiterObj?.email || compEmail || '';
  const createdAtStr = d.createdAt
    ? (d.createdAt instanceof Date ? d.createdAt.toISOString().split('T')[0] : String(d.createdAt).split('T')[0])
    : (d.created_at ? String(d.created_at).split('T')[0] : '2026-09-01');

  const responsibilities = Array.isArray(d.responsibilities) && d.responsibilities.length > 0
    ? d.responsibilities
    : (typeof d.responsibilities === 'string' && d.responsibilities.trim() ? d.responsibilities.split('\n').map(r => r.trim()).filter(Boolean) : []);

  const graduationYear = d.gradYear || d.grad_year || d.graduationYear || d.graduationRequirements || '2025–2026 Batch';

  return {
    id: idStr,
    _id: idStr,
    title: d.title || '',
    company: companyObj,
    companyName: compName,
    company_name: compName,
    companyEmail: compEmail,
    company_email: compEmail,
    companyWebsite: compWebsite,
    hrContact: compHrContact,
    companyPhone: compPhone,
    companyIndustry: companyObj?.industry || '',
    companyDescription: companyObj?.description || '',
    companyApproved: Boolean(companyObj?.approved),
    companyLocation: compLocation || d.location || 'Bengaluru',
    recruiter: recruiter,
    recruiterName: recruiterName,
    recruiter_name: recruiterName,
    recruiterEmail: recruiterEmail,
    recruiter_email: recruiterEmail,
    createdAt: createdAtStr,
    created_at: createdAtStr,
    submissionDate: createdAtStr,
    submission_date: createdAtStr,
    jobType: jobType,
    job_type: jobType,
    opportunityType: oppType,
    opportunity_type: oppType,
    category: category,
    workMode: workMode,
    work_mode: workMode,
    ctc: ctc,
    package: ctc,
    location: d.location || compLocation || 'Bengaluru',
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
    approvalStatus: approvalStatus,
    approval_status: approvalStatus,
    rejectionReason: rejectionReason,
    rejection_reason: rejectionReason,
    approvedBy: approvedBy,
    approved_by: approvedBy,
    approvedAt: approvedAt,
    approved_at: approvedAt,
    branches: Array.isArray(d.branches) ? d.branches : [],
    skills: Array.isArray(d.skills) ? d.skills : [],
    responsibilities: responsibilities,
    graduationYear: graduationYear,
    description: d.description || ''
  };
}

// Helper: Format Application for admin master ledger
function formatAdminApplication(a) {
  if (!a) return null;
  const student = a.student && typeof a.student === 'object' ? a.student : {};
  const drive = a.drive && typeof a.drive === 'object' ? a.drive : {};
  const company = drive.company && typeof drive.company === 'object' ? drive.company : {};

  const candName = student.name || a.studentName || a.student_name || 'Candidate';
  const candNo = student.studentNo || student.student_no || a.studentNo || a.student_no || 'STU1001';
  const candEmail = student.email || a.studentEmail || a.student_email || 'student@college.edu';
  const dept = student.department || a.department || 'Computer Science';
  const cgpaVal = student.cgpa !== undefined ? Number(student.cgpa) : (a.cgpa !== undefined ? Number(a.cgpa) : 8.0);

  const driveIdStr = drive._id ? String(drive._id) : (drive.id ? String(drive.id) : String(a.driveId || a.drive_id || ''));
  const driveTitleStr = drive.title || a.driveTitle || a.drive_title || 'Campus Drive';
  const compNameStr = company.name || a.companyName || a.company_name || 'Corporate Partner';
  const ctcVal = drive.ctc !== undefined ? Number(drive.ctc) : (a.ctc !== undefined ? Number(a.ctc) : 12.0);

  const appIdStr = a._id ? String(a._id) : String(a.id || '');
  const appliedAtStr = a.createdAt instanceof Date
    ? a.createdAt.toISOString().slice(0, 16).replace('T', ' ')
    : (a.appliedAt || a.applied_at || '2026-09-01 10:30');

  return {
    id: appIdStr,
    _id: appIdStr,
    studentId: student._id ? String(student._id) : (student.id ? String(student.id) : String(a.studentId || 1)),
    studentName: candName,
    studentNo: candNo,
    studentEmail: candEmail,
    department: dept,
    cgpa: cgpaVal,
    driveId: driveIdStr,
    driveTitle: driveTitleStr,
    companyName: compNameStr,
    ctc: ctcVal,
    status: a.status || 'Applied',
    appliedAt: appliedAtStr
  };
}

// Helper: Format Placement Result for admin reporting
function formatAdminPlacementResult(r) {
  if (!r) return null;
  const app = r.application && typeof r.application === 'object' ? r.application : {};
  const student = r.student && typeof r.student === 'object'
    ? r.student
    : (app.student && typeof app.student === 'object' ? app.student : {});
  const drive = r.drive && typeof r.drive === 'object'
    ? r.drive
    : (app.drive && typeof app.drive === 'object' ? app.drive : {});
  const company = r.company && typeof r.company === 'object'
    ? r.company
    : (drive.company && typeof drive.company === 'object' ? drive.company : {});

  const dateStr = r.placementDate instanceof Date
    ? r.placementDate.toISOString().split('T')[0]
    : (r.placement_date ? String(r.placement_date).split('T')[0] : '');

  const idStr = r._id ? r._id.toString() : String(r.id || '');

  return {
    id: idStr,
    _id: idStr,
    studentId: student._id ? student._id.toString() : (student.id ? String(student.id) : '1'),
    studentName: student.name || 'Candidate',
    studentNo: student.studentNo || student.student_no || 'CS2023001',
    department: student.department || 'Computer Science',
    driveId: drive._id ? drive._id.toString() : (drive.id ? String(drive.id) : '1'),
    driveTitle: drive.title || 'Placement Drive',
    companyName: company.name || 'Corporate Partner',
    package: r.package !== undefined ? Number(r.package) : 12.0,
    placementDate: dateStr,
    status: r.status || 'Selected'
  };
}

// GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    let totalStudents = 0;
    let totalCompanies = 0;
    let activeDrivesCount = 0;
    let pendingDrivesCount = 0;
    let totalAppsCount = 0;
    let placedCount = 0;
    let highestPkg = '0.00';
    let avgPkg = '0.00';
    let pendingCompaniesCount = 0;
    let recentDrivesList = [];

    if (mongoose.connection.readyState === 1) {
      try {
        totalStudents = await Student.countDocuments();
        totalCompanies = await Company.countDocuments();
        activeDrivesCount = await Drive.countDocuments({ status: 'active', approvalStatus: 'approved' });
        pendingDrivesCount = await Drive.countDocuments({ approvalStatus: 'pending' });
        pendingCompaniesCount = await Company.countDocuments({ approved: false });
        totalAppsCount = await Application.countDocuments({ status: { $ne: 'Withdrawn' } });

        const placedDocs = await Application.find({ status: 'Selected' }).lean();
        placedCount = placedDocs.length;

        const mongoDrives = await Drive.find().populate('company').sort({ createdAt: -1 }).limit(5).lean();
        if (mongoDrives && mongoDrives.length > 0) {
          recentDrivesList = mongoDrives.map(d => formatAdminDrive(d));
        }

        const approvedDrives = await Drive.find({ approvalStatus: 'approved' }).lean();
        const pkgs = approvedDrives.map(d => Number(d.ctc || 0)).filter(p => p > 0);
        if (pkgs.length > 0) {
          highestPkg = Math.max(...pkgs).toFixed(2);
          avgPkg = (pkgs.reduce((a, b) => a + b, 0) / pkgs.length).toFixed(2);
        }
      } catch (err) {
        console.warn('[Admin Mongo Dashboard Warning]:', err.message);
      }
    } else {
      // In-memory fallback if standalone mode
      try {
        const { memoryStudents, memoryCompanies } = require('./authController');
        if (memoryStudents) totalStudents = memoryStudents.size;
        if (memoryCompanies) totalCompanies = memoryCompanies.size;
      } catch (_) {}
      if (recruiterStore && Array.isArray(recruiterStore.drives)) {
        activeDrivesCount = recruiterStore.drives.filter(d => d.status === 'active' && (d.approvalStatus === 'approved' || d.approval_status === 'approved')).length;
        pendingDrivesCount = recruiterStore.drives.filter(d => (d.approvalStatus || d.approval_status) === 'pending').length;
        recentDrivesList = recruiterStore.drives.slice(0, 5).map(d => formatAdminDrive(d));
      }
    }

    const placementRate = totalStudents > 0
      ? `${((placedCount / totalStudents) * 100).toFixed(1)}%`
      : '0.0%';

    const stats = {
      totalStudents,
      totalCompanies,
      activeDrives: activeDrivesCount,
      pendingDrives: pendingDrivesCount,
      totalApplications: totalAppsCount,
      placedStudents: placedCount,
      placementRate,
      avgPackage: avgPkg,
      highestPackage: highestPkg,
      pendingCompanies: pendingCompaniesCount,
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
    let students = [];

    if (mongoose.connection.readyState === 1) {
      try {
        const studentDocs = await Student.find()
          .populate('user', 'name email role isActive')
          .sort({ createdAt: -1 })
          .lean();

        if (studentDocs && studentDocs.length > 0) {
          const studentIds = studentDocs.map(s => s._id);
          const apps = await Application.find({
            student: { $in: studentIds },
            status: { $ne: 'Withdrawn' }
          }).lean();

          const appCountMap = new Map();
          const appStatusMap = new Map();
          for (const a of apps) {
            const sid = String(a.student);
            appCountMap.set(sid, (appCountMap.get(sid) || 0) + 1);
            const current = appStatusMap.get(sid);
            if (a.status === 'Selected') {
              appStatusMap.set(sid, 'Selected');
            } else if (a.status === 'Interview Scheduled' && current !== 'Selected') {
              appStatusMap.set(sid, 'Interview Scheduled');
            } else if (!current) {
              appStatusMap.set(sid, a.status || 'Applied');
            }
          }

          students = studentDocs.map(s => {
            const sid = String(s._id);
            const email = s.user?.email || s.email || '';
            const name = s.name || s.user?.name || 'Candidate';
            const status = appStatusMap.get(sid) || (s.cgpa >= 7 ? 'Eligible' : 'Active');
            return {
              id: sid,
              _id: sid,
              studentNo: s.studentNo || 'N/A',
              name: name,
              email: email,
              phone: s.phone || '',
              department: s.department || 'General',
              gradYear: s.gradYear || new Date().getFullYear(),
              cgpa: s.cgpa !== undefined ? Number(s.cgpa) : 0,
              backlogs: s.backlogs || 0,
              isActive: s.user?.isActive !== false,
              skills: Array.isArray(s.skills) ? s.skills : [],
              applicationsCount: appCountMap.get(sid) || 0,
              status: status
            };
          });
        }
      } catch (dbErr) {
        console.warn('[Admin Mongo getStudents Warning]:', dbErr.message);
      }
    } else {
      try {
        const { memoryStudents } = require('./authController');
        if (memoryStudents) {
          for (const [id, s] of memoryStudents.entries()) {
            students.push({
              id: String(id),
              _id: String(id),
              studentNo: s.studentNo || 'N/A',
              name: s.name || 'Candidate',
              email: s.email || '',
              phone: s.phone || '',
              department: s.department || 'General',
              gradYear: s.gradYear || 2026,
              cgpa: s.cgpa || 0,
              backlogs: s.backlogs || 0,
              isActive: true,
              skills: Array.isArray(s.skills) ? s.skills : [],
              applicationsCount: 0,
              status: 'Active'
            });
          }
        }
      } catch (_) {}
    }

    if (q) {
      const queryStr = q.toLowerCase();
      students = students.filter(s =>
        (s.name && s.name.toLowerCase().includes(queryStr)) ||
        (s.email && s.email.toLowerCase().includes(queryStr)) ||
        (s.studentNo && s.studentNo.toLowerCase().includes(queryStr))
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
    const rawId = req.params.id;
    const cleanId = String(rawId).trim();
    let student = null;
    let apps = [];

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(cleanId)) {
      try {
        const sDoc = await Student.findById(cleanId).populate('user', 'name email role isActive').lean();
        if (sDoc) {
          const rawApps = await Application.find({ student: cleanId, status: { $ne: 'Withdrawn' } })
            .populate({ path: 'drive', populate: { path: 'company' } })
            .sort({ createdAt: -1 })
            .lean();

          apps = rawApps.map(formatAdminApplication);

          student = {
            id: String(sDoc._id),
            _id: String(sDoc._id),
            studentNo: sDoc.studentNo || 'N/A',
            name: sDoc.name || sDoc.user?.name || 'Candidate',
            email: sDoc.user?.email || sDoc.email || '',
            phone: sDoc.phone || '',
            department: sDoc.department || 'General',
            gradYear: sDoc.gradYear || new Date().getFullYear(),
            cgpa: sDoc.cgpa !== undefined ? Number(sDoc.cgpa) : 0,
            backlogs: sDoc.backlogs || 0,
            isActive: sDoc.user?.isActive !== false,
            skills: Array.isArray(sDoc.skills) ? sDoc.skills : [],
            applicationsCount: apps.length,
            status: apps.some(a => a.status === 'Selected') ? 'Selected' : (apps.length > 0 ? 'Applied' : 'Active'),
            applications: apps
          };
        }
      } catch (err) {
        console.warn('[Admin Mongo getStudentById Warning]:', err.message);
      }
    }

    if (!student) {
      try {
        const { memoryStudents } = require('./authController');
        if (memoryStudents && memoryStudents.has(cleanId)) {
          const s = memoryStudents.get(cleanId);
          student = {
            id: cleanId,
            _id: cleanId,
            studentNo: s.studentNo || 'N/A',
            name: s.name || 'Candidate',
            email: s.email || '',
            phone: s.phone || '',
            department: s.department || 'General',
            gradYear: s.gradYear || 2026,
            cgpa: s.cgpa || 0,
            backlogs: s.backlogs || 0,
            isActive: true,
            skills: Array.isArray(s.skills) ? s.skills : [],
            applicationsCount: 0,
            status: 'Active',
            applications: []
          };
        }
      } catch (_) {}
    }

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    return res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/recruiters (or /companies)
exports.getCompanies = async (req, res) => {
  try {
    const { q, status } = req.query;
    let companies = [];

    // 1. Fetch from MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const mongoDocs = await Company.find().sort({ createdAt: -1 }).lean();
        if (mongoDocs && mongoDocs.length > 0) {
          companies = mongoDocs.map(c => ({
            id: String(c._id),
            _id: String(c._id),
            name: c.name,
            industry: c.industry || 'Technology',
            website: c.website || '',
            hr_contact: c.hrContact || 'HR Lead',
            hrContact: c.hrContact || 'HR Lead',
            email: c.email || '',
            phone: c.phone || '',
            location: c.location || 'Bengaluru, India',
            description: c.description || '',
            approved: Boolean(c.approved),
            created_at: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString()
          }));
        }
      } catch (dbErr) {
        console.warn('[Admin Mongo getCompanies Warning]:', dbErr.message);
      }
    } else {
      try {
        const { memoryCompanies } = require('./authController');
        if (memoryCompanies) {
          for (const [id, c] of memoryCompanies.entries()) {
            companies.push({
              id: String(id),
              _id: String(id),
              name: c.name,
              industry: c.industry || 'Technology',
              website: c.website || '',
              hr_contact: c.hrContact || 'HR Lead',
              hrContact: c.hrContact || 'HR Lead',
              email: c.email || '',
              phone: c.phone || '',
              location: c.location || 'Bengaluru, India',
              description: c.description || '',
              approved: Boolean(c.approved),
              created_at: new Date().toISOString()
            });
          }
        }
      } catch (_) {}
    }

    if (q) {
      const queryStr = q.toLowerCase();
      companies = companies.filter(c =>
        (c.name && c.name.toLowerCase().includes(queryStr)) ||
        (c.email && c.email.toLowerCase().includes(queryStr)) ||
        (c.industry && c.industry.toLowerCase().includes(queryStr))
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
    const rawId = req.params.id;
    const compId = String(rawId).trim();
    let company = null;
    let drives = [];

    if (mongoose.connection.readyState === 1) {
      try {
        if (mongoose.Types.ObjectId.isValid(compId)) {
          company = await Company.findById(compId).lean();
        }
        if (!company) {
          company = await Company.findOne({ email: compId }).lean();
        }
        if (company) {
          const compDrives = await Drive.find({ company: company._id }).populate('company').sort({ createdAt: -1 }).lean();
          if (compDrives && compDrives.length > 0) {
            drives = compDrives.map(d => formatAdminDrive(d));
          }
        }
      } catch (e) {
        console.warn('[Admin Mongo getCompanyById Warning]:', e.message);
      }
    } else {
      try {
        const { memoryCompanies } = require('./authController');
        if (memoryCompanies && (memoryCompanies.has(compId) || memoryCompanies.has(rawId))) {
          company = memoryCompanies.get(compId) || memoryCompanies.get(rawId);
        }
      } catch (_) {}
    }

    if (!company) {
      return res.status(404).json({ success: false, message: 'Recruiter company record not found.' });
    }

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
    const compId = req.params.id;
    let found = null;

    // 1. Update in MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        if (mongoose.Types.ObjectId.isValid(compId)) {
          found = await Company.findByIdAndUpdate(compId, { approved: true }, { new: true }).lean();
        }
        if (!found) {
          found = await Company.findOneAndUpdate({ email: compId }, { approved: true }, { new: true }).lean();
        }
      } catch (err) {
        console.warn('[Admin Mongo Approve Company Warning]:', err.message);
      }
    } else {
      try {
        const { memoryCompanies } = require('./authController');
        if (memoryCompanies && memoryCompanies.has(compId)) {
          const c = memoryCompanies.get(compId);
          c.approved = true;
          found = c;
        }
      } catch (_) {}
    }

    // Recruiter Notification
    try {
      if (found?.email && Notification && mongoose.connection.readyState === 1) {
        await Notification.create({
          company: found._id,
          recipientRole: 'recruiter',
          title: 'Company Verified by Admin',
          message: `Congratulations! ${found.name || 'Your organization'} has been verified by the Placement Administrator. You can now post placements, jobs, internships, and skill opportunities, and select candidates.`,
          link: '/recruiter/drives/create',
          isRead: false
        });
      }
    } catch (notifErr) {
      console.warn('[Admin Approve Notification Warning]:', notifErr.message);
    }

    if (!found) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    const companyName = found?.name || 'Company';
    return res.status(200).json({
      success: true,
      message: `${companyName} has been verified and approved successfully for campus recruitment.`,
      data: found
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/recruiters/:id/reject
exports.rejectCompany = async (req, res) => {
  try {
    const compId = req.params.id;
    let found = null;

    if (mongoose.connection.readyState === 1) {
      try {
        if (mongoose.Types.ObjectId.isValid(compId)) {
          found = await Company.findByIdAndUpdate(compId, { approved: false }, { new: true }).lean();
        }
        if (!found) {
          found = await Company.findOneAndUpdate({ email: compId }, { approved: false }, { new: true }).lean();
        }
      } catch (err) {
        console.warn('[Admin Mongo Reject Company Warning]:', err.message);
      }
    } else {
      try {
        const { memoryCompanies } = require('./authController');
        if (memoryCompanies && memoryCompanies.has(compId)) {
          const c = memoryCompanies.get(compId);
          c.approved = false;
          found = c;
        }
      } catch (_) {}
    }

    if (!found) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    const companyName = found?.name || 'Company';
    return res.status(200).json({
      success: true,
      message: `${companyName} verification has been revoked / set to pending review.`,
      data: found
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/drives
exports.getDrives = async (req, res) => {
  try {
    const { q, jobType, status, approvalStatus, approval_status } = req.query;
    let drives = [];

    // 1. Read from MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const mongoDrives = await Drive.find()
          .populate('company')
          .populate('recruiter', 'name email role')
          .sort({ createdAt: -1 })
          .lean();
        if (mongoDrives && mongoDrives.length > 0) {
          drives = mongoDrives.map(d => formatAdminDrive(d));
        }
      } catch (err) {
        console.warn('[Admin Mongo Get Drives Warning]:', err.message);
      }
    }

    // 2. Merge in-memory recruiter submissions if any
    if (recruiterStore && Array.isArray(recruiterStore.drives)) {
      const seenIds = new Set(drives.map(d => String(d.id || d._id)));
      for (const memD of recruiterStore.drives) {
        const memId = String(memD.id || memD._id);
        if (!seenIds.has(memId)) {
          drives.unshift(formatAdminDrive(memD));
          seenIds.add(memId);
        }
      }
    }

    const pendingCount = drives.filter(d => (d.approvalStatus || d.approval_status) === 'pending').length;

    if (q) {
      const queryStr = q.toLowerCase();
      drives = drives.filter(d =>
        d.title.toLowerCase().includes(queryStr) ||
        d.companyName.toLowerCase().includes(queryStr) ||
        d.location.toLowerCase().includes(queryStr) ||
        (d.recruiterName && d.recruiterName.toLowerCase().includes(queryStr)) ||
        (d.recruiterEmail && d.recruiterEmail.toLowerCase().includes(queryStr))
      );
    }

    if (jobType && jobType !== 'All') {
      drives = drives.filter(d => d.jobType.toLowerCase() === jobType.toLowerCase());
    }

    if (status && status !== 'All') {
      drives = drives.filter(d => d.status.toLowerCase() === status.toLowerCase());
    }

    const targetApproval = approvalStatus || approval_status;
    if (targetApproval && targetApproval !== 'All' && targetApproval !== 'all') {
      drives = drives.filter(d => (d.approvalStatus || 'approved').toLowerCase() === targetApproval.toLowerCase());
    }

    return res.status(200).json({
      success: true,
      total: drives.length,
      pendingCount,
      data: drives
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT/POST /api/admin/drives/:id/approve
exports.approveDrive = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user?._id || req.user?.id;
    let drive = null;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const updated = await Drive.findByIdAndUpdate(
          id,
          {
            $set: {
              approvalStatus: 'approved',
              approvedBy: adminId && mongoose.Types.ObjectId.isValid(adminId) ? adminId : null,
              approvedAt: new Date(),
              rejectionReason: ''
            }
          },
          { new: true }
        ).populate('company');

        if (updated) {
          drive = formatAdminDrive(updated);

          // Dispatch notification to recruiter/company
          try {
            await Notification.create({
              company: updated.company?._id,
              recipientRole: 'recruiter',
              title: 'Placement Drive Approved',
              message: `Your campus hiring drive '${updated.title}' has been approved by the Placement Cell and is now live for student applications.`,
              link: '/recruiter/drives',
              isRead: false
            });
          } catch (notifErr) {
            console.warn('[Admin Approve Drive Notification Notice]:', notifErr.message);
          }
        }
      } catch (err) {
        console.warn('[Admin Mongo Approve Drive Warning]:', err.message);
      }
    }

    // In-memory fallback
    if (recruiterStore && Array.isArray(recruiterStore.drives)) {
      const memIndex = recruiterStore.drives.findIndex(
        d => String(d.id) === String(id) || String(d._id) === String(id)
      );
      if (memIndex !== -1) {
        recruiterStore.drives[memIndex].approvalStatus = 'approved';
        recruiterStore.drives[memIndex].approval_status = 'approved';
        recruiterStore.drives[memIndex].approvedBy = adminId;
        recruiterStore.drives[memIndex].approvedAt = new Date().toISOString();
        recruiterStore.drives[memIndex].rejectionReason = '';
        if (!drive) drive = formatAdminDrive(recruiterStore.drives[memIndex]);
      }
    }

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `Placement drive '${drive.title}' has been approved and published to students.`,
      data: drive,
      drive: drive
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT/POST /api/admin/drives/:id/reject
exports.rejectDrive = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user?._id || req.user?.id;
    const { reason } = req.body;

    const rejectionReason = (reason && reason.trim()) ? reason.trim() : 'Does not meet institutional placement standards or missing mandatory specifications.';
    let drive = null;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const updated = await Drive.findByIdAndUpdate(
          id,
          {
            $set: {
              approvalStatus: 'rejected',
              rejectionReason: rejectionReason,
              approvedBy: adminId && mongoose.Types.ObjectId.isValid(adminId) ? adminId : null,
              approvedAt: null
            }
          },
          { new: true }
        ).populate('company');

        if (updated) {
          drive = formatAdminDrive(updated);

          // Dispatch notification to recruiter/company
          try {
            await Notification.create({
              company: updated.company?._id,
              recipientRole: 'recruiter',
              title: 'Placement Drive Needs Revision',
              message: `Your campus hiring drive '${updated.title}' was reviewed and rejected by the Placement Cell. Reason: ${rejectionReason}`,
              link: `/recruiter/drives/${updated._id}/edit`,
              isRead: false
            });
          } catch (notifErr) {
            console.warn('[Admin Reject Drive Notification Notice]:', notifErr.message);
          }
        }
      } catch (err) {
        console.warn('[Admin Mongo Reject Drive Warning]:', err.message);
      }
    }

    // In-memory fallback
    if (recruiterStore && Array.isArray(recruiterStore.drives)) {
      const memIndex = recruiterStore.drives.findIndex(
        d => String(d.id) === String(id) || String(d._id) === String(id)
      );
      if (memIndex !== -1) {
        recruiterStore.drives[memIndex].approvalStatus = 'rejected';
        recruiterStore.drives[memIndex].approval_status = 'rejected';
        recruiterStore.drives[memIndex].rejectionReason = rejectionReason;
        recruiterStore.drives[memIndex].rejection_reason = rejectionReason;
        recruiterStore.drives[memIndex].approvedBy = adminId;
        if (!drive) drive = formatAdminDrive(recruiterStore.drives[memIndex]);
      }
    }

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `Placement drive '${drive.title}' has been rejected.`,
      data: drive,
      drive: drive
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/drives/:id
exports.getDriveById = async (req, res) => {
  try {
    const rawId = req.params.id;
    const cleanId = String(rawId).replace(/^drive-/, '');
    let drive = null;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(cleanId)) {
      try {
        const doc = await Drive.findById(cleanId)
          .populate('company')
          .populate('recruiter', 'name email role')
          .populate('approvedBy', 'name email role')
          .lean();
        if (doc) {
          drive = formatAdminDrive(doc);
        }
      } catch (err) {
        console.warn('[Admin Mongo Get Drive Detail Warning]:', err.message);
      }
    }

    if (!drive && recruiterStore && Array.isArray(recruiterStore.drives)) {
      const memDrive = recruiterStore.drives.find(d => String(d.id) === cleanId || String(d._id) === cleanId || String(d.id) === String(rawId));
      if (memDrive) {
        drive = formatAdminDrive(memDrive);
      }
    }

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found.' });
    }

    let apps = [];
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(cleanId)) {
      try {
        const mongoApps = await Application.find({
          drive: cleanId,
          status: { $ne: 'Withdrawn' }
        })
          .populate({ path: 'student', populate: { path: 'user', select: 'name email role' } })
          .populate({ path: 'drive', populate: { path: 'company' } })
          .sort({ createdAt: -1 })
          .lean();

        if (mongoApps && mongoApps.length > 0) {
          apps = mongoApps.map(formatAdminApplication);
        }
      } catch (e) {}
    }

    drive.applicantCount = apps.length;
    drive.applicant_count = apps.length;

    const driveResult = { ...drive, applications: apps };
    return res.status(200).json({
      success: true,
      data: driveResult,
      drive: driveResult
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/applications
exports.getApplications = async (req, res) => {
  try {
    const { q, status } = req.query;
    let apps = [];

    // 1. Read from MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const mongoApps = await Application.find({ status: { $ne: 'Withdrawn' } })
          .populate('student')
          .populate({ path: 'drive', populate: { path: 'company' } })
          .sort({ createdAt: -1 })
          .lean();

        if (mongoApps && mongoApps.length > 0) {
          apps = mongoApps.map(formatAdminApplication);
        }
      } catch (err) {
        console.warn('[Admin Mongo Get Applications Warning]:', err.message);
      }
    }

    if (q) {
      const queryStr = q.toLowerCase();
      apps = apps.filter(a =>
        (a.studentName && a.studentName.toLowerCase().includes(queryStr)) ||
        (a.companyName && a.companyName.toLowerCase().includes(queryStr)) ||
        (a.driveTitle && a.driveTitle.toLowerCase().includes(queryStr))
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

// Helper: Seed initial demo notifications if MongoDB is connected and collection is empty (disabled for clean presentation)
async function seedDemoNotificationsIfEmpty() {
  return;
}

// Helper: Format Notification for Admin responses
function formatAdminNotification(doc) {
  if (!doc) return null;
  const idStr = doc._id ? String(doc._id) : String(doc.id || '');
  const createdAtStr = doc.createdAt instanceof Date
    ? doc.createdAt.toISOString().slice(0, 16).replace('T', ' ')
    : (doc.createdAt || doc.created_at || '2026-09-12 09:00');
  const isRead = Boolean(doc.isRead !== undefined ? doc.isRead : (doc.is_read !== undefined ? doc.is_read : false));

  return {
    id: idStr,
    _id: idStr,
    title: doc.title || 'System Notice',
    message: doc.message || '',
    type: doc.type || 'info',
    link: doc.link || '/admin/notifications',
    isRead: isRead,
    is_read: isRead,
    createdAt: createdAtStr,
    created_at: createdAtStr
  };
}

// GET /api/admin/notifications
exports.getNotifications = async (req, res) => {
  try {
    let notifs = [];

    // 1. Read from MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const mongoNotifs = await Notification.find({
          $or: [
            { recipientRole: { $in: ['admin', 'all'] } }
          ]
        }).sort({ createdAt: -1 }).lean();

        if (mongoNotifs && mongoNotifs.length > 0) {
          notifs = mongoNotifs.map(formatAdminNotification);
        }
      } catch (err) {
        console.warn('[Admin Mongo Get Notifications Warning]:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      total: notifs.length,
      data: notifs,
      notifications: notifs
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT or POST /api/admin/notifications/:id/read
exports.markNotificationRead = async (req, res) => {
  try {
    const id = req.params.id;

    // 1. Update in MongoDB if connected
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      try {
        await Notification.findByIdAndUpdate(id, { $set: { isRead: true } });
      } catch (err) {
        console.warn('[Admin Mongo Mark Read Warning]:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      data: { id, isRead: true }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST or PUT /api/admin/notifications/read-all
exports.markAllNotificationsRead = async (req, res) => {
  try {
    // 1. Update in MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        await Notification.updateMany(
          { recipientRole: { $in: ['admin', 'all'] }, isRead: false },
          { $set: { isRead: true } }
        );
      } catch (err) {
        console.warn('[Admin Mongo Mark All Read Warning]:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'All admin notifications marked as read.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    let results = [];
    if (mongoose.connection.readyState === 1 && PlacementResult) {
      try {
        const docs = await PlacementResult.find()
          .populate({
            path: 'application',
            populate: [
              { path: 'student' },
              { path: 'drive', populate: { path: 'company' } }
            ]
          })
          .populate('student')
          .populate({ path: 'drive', populate: { path: 'company' } })
          .populate('company')
          .sort({ updatedAt: -1, createdAt: -1 })
          .lean();

        if (docs && docs.length > 0) {
          results = docs.map(formatAdminPlacementResult);
        }
      } catch (err) {
        console.warn('[Admin Mongo Get Reports Warning]:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Institutional placement reports generated.',
      total: results.length,
      data: results,
      results
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
