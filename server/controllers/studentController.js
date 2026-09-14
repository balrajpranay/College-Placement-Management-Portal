const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
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
    resume_original_name: 'Priya_Sharma_SDE_Resume.pdf',
    resumeData: {
      contact: {
        fullName: 'First Name Last Name',
        phone: 'Phone Number',
        email: 'xyz@gmail.com',
        location: 'City, State'
      },
      sections: [
        {
          id: 'prof_profiles',
          title: 'Professional profiles',
          content: "Click the 'Edit' button to add content to this section."
        },
        {
          id: 'summary',
          title: 'Summary',
          content: "Click the 'Edit' button to add content to this section."
        },
        {
          id: 'skills',
          title: 'Skills',
          content: 'List 3-4 special, work-related, talents skills.'
        },
        {
          id: 'experience',
          title: 'Experience',
          content: `Company A | Location\nSales Representative | Start and end date\nEnter key responsibilities and accomplishments.\n\nCompany B | Location\nSales Associate | Start and end date\nShow that you create value with your work by listing your responsibilities and quantifiable achievements in the experience.\n\nCompany C | Location\nSales Assistant | Start and end date\nUse AI to assist you in creating a work description using your experience and desired job information.`
        },
        {
          id: 'education',
          title: 'Education',
          content: `Graduated school | Location\nField of study | Graduation Date\nEnter any colleges, universities, or training programs that you have attended.`
        },
        {
          id: 'certificates',
          title: 'Certificates',
          content: 'Show your certificates, licenses, and training in your field.'
        },
        {
          id: 'achievements',
          title: 'Achievements',
          content: 'Mention any prizes, honors, contests etc.'
        },
        {
          id: 'projects',
          title: 'Projects',
          content: "Click the 'Edit' button to add content to this section."
        },
        {
          id: 'interests',
          title: 'Interests',
          content: "Click the 'Edit' button to add content to this section."
        }
      ]
    },
    resumeLatex: `\\documentclass[11pt,a4paper]{article}

\\usepackage[margin=0.7in]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage[hidelinks]{hyperref}
\\usepackage{parskip}

\\pagestyle{empty}

% Section formatting
\\titleformat{\\section}
  {\\large\\bfseries}
  {}
  {0em}
  {}
  [\\titlerule]

\\setlist[itemize]{
  leftmargin=1.5em,
  itemsep=2pt,
  topsep=2pt
}

\\begin{document}

%===================
% HEADER
%===================
\\begin{center}
  {\\LARGE\\textbf{Priya Sharma}}\\\\[4pt]
  \\small priya.sharma@student.edu \\quad | \\quad +91 98765 43210 \\quad | \\quad Bengaluru, India\\\\
  \\href{https://github.com}{github.com/priyasharma} \\quad | \\quad \\href{https://linkedin.com}{linkedin.com/in/priyasharma}
\\end{center}

\\vspace{2pt}

%===================
% SUMMARY
%===================
\\section{Summary}
Motivated Computer Science graduate with strong foundations in Data Structures, Algorithms, and Full-Stack Engineering. Proven experience architecting reactive web platforms, microservices, and distributed task queues with modern cloud deployments.

%===================
% EDUCATION
%===================
\\section{Education}
\\textbf{Bachelor of Technology in Computer Science \\& Engineering} \\hfill 2022 -- 2026\\\\
Apex Institute of Technology, Bengaluru \\hfill Current CGPA: 8.9 / 10.0\\\\
\\textit{Relevant Coursework}: Data Structures \\& Algorithms, Operating Systems, Database Management Systems, Computer Networks.

%===================
% TECHNICAL SKILLS
%===================
\\section{Technical Skills}
\\begin{itemize}
  \\item \\textbf{Languages}: Python, Java, C++, JavaScript (ES6+), TypeScript, SQL
  \\item \\textbf{Frameworks \\& Libraries}: React, Node.js, Express, Next.js, Spring Boot, Tailwind CSS
  \\item \\textbf{Databases \\& Cloud}: PostgreSQL, MongoDB, Redis, AWS (S3, EC2), Docker, Git
  \\item \\textbf{Core Competencies}: Distributed Systems, REST APIs, Microservices, System Design
\\end{itemize}

%===================
% EXPERIENCE
%===================
\\section{Experience}
\\textbf{Software Engineering Intern} \\hfill 05/2025 -- 07/2025\\\\
\\textit{WebCraft Systems} \\hfill Bengaluru, India
\\begin{itemize}
  \\item Architected high-throughput microservices using Node.js and Redis, reducing API response latency by 35\\%.
  \\item Collaborated with senior engineers in daily agile sprints, implementing CI/CD pipelines with GitHub Actions.
  \\item Authored automated unit test suites in Jest achieving 88\\% code coverage across payment gateways.
\\end{itemize}

%===================
% PROJECTS
%===================
\\section{Projects}
\\textbf{Campus Connect Placement Portal} \\hfill React, Node.js, Express, MongoDB
\\begin{itemize}
  \\item Engineered unified campus recruitment platform managing drives, automated shortlisting, and candidate tracking.
  \\item Implemented real-time qualification match algorithms and Overleaf-inspired LaTeX live resume compilation engine.
\\end{itemize}

\\textbf{Distributed Task Scheduler} \\hfill Go, Redis, Docker
\\begin{itemize}
  \\item Developed fault-tolerant job queue system capable of executing 5,000+ background tasks/minute with zero data loss.
  \\item Configured worker pools, heartbeat health checks, and automatic dead-letter queue retries.
\\end{itemize}

%===================
% CERTIFICATIONS
%===================
\\section{Certifications}
\\begin{itemize}
  \\item AWS Certified Solutions Architect -- Associate (2025)
  \\item Deep Learning Specialization -- DeepLearning.AI (Coursera)
\\end{itemize}

\\end{document}`
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

// Format student profile for consistent frontend response matching React shape
function formatStudentResponse(s, fallbackEmail) {
  if (!s) return null;
  const technicalSkills = Array.isArray(s.skills) && s.skills.length > 0
    ? s.skills
    : (Array.isArray(s.technical_skills) ? s.technical_skills : []);
  const studentNum = s.studentNo || s.student_no || 'CS2023001';
  const gradY = Number(s.gradYear || s.grad_year || 2026);
  const resFilename = s.resumeFilename || s.resume_filename || null;
  const resOrigName = s.resumeOriginalName || s.resume_original_name || null;

  return {
    id: (s._id || s.id || '').toString(),
    _id: (s._id || s.id || '').toString(),
    user: (s.user?._id || s.user || '').toString(),
    name: s.name || '',
    studentNo: studentNum,
    student_no: studentNum,
    email: s.email || fallbackEmail || 'priya.sharma@student.edu',
    phone: s.phone || '',
    department: s.department || 'Computer Science',
    gradYear: gradY,
    grad_year: gradY,
    cgpa: s.cgpa !== undefined && s.cgpa !== null ? Number(s.cgpa) : 0,
    tenthPct: s.tenthPct !== undefined && s.tenthPct !== null ? Number(s.tenthPct) : null,
    twelfthPct: s.twelfthPct !== undefined && s.twelfthPct !== null ? Number(s.twelfthPct) : null,
    backlogs: Number(s.backlogs || 0),
    technical_skills: technicalSkills,
    skills: technicalSkills,
    softSkills: s.softSkills || '',
    certifications: s.certifications || '',
    internships: s.internships || '',
    projects: s.projects || '',
    resume_filename: resFilename,
    resume_original_name: resOrigName,
    resumeFilename: resFilename,
    resumeOriginalName: resOrigName,
    resumeLatex: s.resumeLatex || s.resume_latex || studentStore.profile.resumeLatex || '',
    resume_latex: s.resumeLatex || s.resume_latex || studentStore.profile.resumeLatex || '',
    resumeData: s.resumeData || studentStore.profile.resumeData || null,
    resume_data: s.resumeData || studentStore.profile.resumeData || null
  };
}

// Helper: Query student profile from MongoDB with graceful in-memory fallback
async function getStudentProfileForUser(userId, fallbackEmail) {
  if (mongoose.connection.readyState === 1 && userId) {
    try {
      const doc = await Student.findOne({ user: userId }).lean();
      if (doc) {
        return formatStudentResponse(doc, fallbackEmail);
      }
    } catch (err) {
      console.warn('[Student Mongo]: Fallback to memory store', err.message);
    }
  }
  return studentStore.profile;
}

// Helper: Format Drive for student consumption matching React frontend expectations
function formatDriveForStudent(d) {
  if (!d) return null;
  const idStr = (d._id || d.id || '').toString();
  const companyObj = d.company && typeof d.company === 'object' ? d.company : null;
  const compName = companyObj?.name || d.company_name || d.companyName || 'Corporate Partner';
  const logo = companyObj?.logoFilename ? `/static/images/companies/${companyObj.logoFilename}` : (d.logo || null);

  const deadlineStr = d.deadline instanceof Date
    ? d.deadline.toISOString().split('T')[0]
    : (d.deadline ? String(d.deadline).split('T')[0] : '');
  const driveDateStr = d.driveDate instanceof Date
    ? d.driveDate.toISOString().split('T')[0]
    : (d.drive_date ? String(d.drive_date).split('T')[0] : (d.driveDate ? String(d.driveDate).split('T')[0] : ''));

  const jobType = d.jobType || d.job_type || 'Full-Time';
  const minCgpa = d.minCgpa !== undefined ? Number(d.minCgpa) : (d.min_cgpa !== undefined ? Number(d.min_cgpa) : 0);
  const maxBacklogs = d.maxBacklogs !== undefined ? Number(d.maxBacklogs) : (d.max_backlogs !== undefined ? Number(d.max_backlogs) : 0);
  const openings = d.openings !== undefined ? Number(d.openings) : 1;
  const ctc = d.ctc !== undefined ? Number(d.ctc) : 0;

  return {
    id: idStr,
    _id: idStr,
    title: d.title || '',
    company_name: compName,
    companyName: compName,
    logo: logo,
    ctc: ctc,
    package: ctc,
    location: d.location || '',
    job_type: jobType,
    jobType: jobType,
    min_cgpa: minCgpa,
    minCgpa: minCgpa,
    max_backlogs: maxBacklogs,
    maxBacklogs: maxBacklogs,
    openings: openings,
    deadline: deadlineStr,
    drive_date: driveDateStr,
    driveDate: driveDateStr,
    branches: Array.isArray(d.branches) ? d.branches : [],
    skills: Array.isArray(d.skills) ? d.skills : [],
    status: d.status || 'active',
    description: d.description || '',
    company_desc: companyObj?.description || d.company_desc || ''
  };
}


// Helper: Get or create Mongoose Student document for authenticated user
async function getOrCreateMongoStudent(userId, fallbackEmail) {
  if (mongoose.connection.readyState !== 1) return null;
  try {
    let studentDoc = null;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      studentDoc = await Student.findOne({ user: userId });
    }
    if (!studentDoc && fallbackEmail) {
      const User = require('../models/User');
      const userDoc = await User.findOne({ email: fallbackEmail });
      if (userDoc) {
        studentDoc = await Student.findOne({ user: userDoc._id });
      }
    }
    if (!studentDoc) {
      const fallback = studentStore.profile;
      const userObjId = userId && mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : new mongoose.Types.ObjectId('65e000000000000000000002');
      studentDoc = await Student.create({
        user: userObjId,
        studentNo: fallback.studentNo || fallback.student_no || 'CS2023001',
        name: fallback.name || 'Priya Sharma',
        phone: fallback.phone || '+91 98765 43210',
        department: fallback.department || 'Computer Science',
        gradYear: Number(fallback.gradYear || fallback.grad_year || 2026),
        cgpa: Number(fallback.cgpa || 8.9),
        tenthPct: Number(fallback.tenthPct || 92.5),
        twelfthPct: Number(fallback.twelfthPct || 89.0),
        backlogs: Number(fallback.backlogs || 0),
        skills: Array.isArray(fallback.skills) ? fallback.skills : ['Python', 'SQL', 'React', 'Node.js'],
        softSkills: fallback.softSkills || '',
        certifications: fallback.certifications || '',
        projects: fallback.projects || '',
        internships: fallback.internships || '',
        resumeFilename: fallback.resume_filename || null,
        resumeOriginalName: fallback.resume_original_name || null
      });
    }
    return studentDoc;
  } catch (err) {
    console.warn('[Student Mongo getOrCreateMongoStudent Warning]:', err.message);
    return null;
  }
}

// Helper: Format Application for student consumption matching React frontend expectations
function formatApplicationForStudent(appDoc) {
  if (!appDoc) return null;
  const drive = appDoc.drive && typeof appDoc.drive === 'object' ? appDoc.drive : {};
  const company = drive.company && typeof drive.company === 'object' ? drive.company : {};
  const compName = company.name || drive.company_name || drive.companyName || appDoc.company_name || appDoc.companyName || 'Corporate Partner';
  const ctcVal = drive.ctc !== undefined ? Number(drive.ctc) : (appDoc.package_lpa !== undefined ? Number(appDoc.package_lpa) : 12.0);
  const appliedAtStr = appDoc.createdAt instanceof Date
    ? appDoc.createdAt.toISOString()
    : (appDoc.applied_at || appDoc.appliedAt || new Date().toISOString());

  const driveIdStr = drive._id ? String(drive._id) : (drive.id ? String(drive.id) : String(appDoc.drive || ''));
  const appIdStr = appDoc._id ? String(appDoc._id) : String(appDoc.id || '');

  return {
    id: appIdStr,
    _id: appIdStr,
    drive_id: driveIdStr,
    driveId: driveIdStr,
    drive_title: drive.title || appDoc.drive_title || appDoc.driveTitle || 'Campus Drive',
    driveTitle: drive.title || appDoc.drive_title || appDoc.driveTitle || 'Campus Drive',
    company_name: compName,
    companyName: compName,
    package_lpa: ctcVal,
    packageLpa: ctcVal,
    applied_at: appliedAtStr,
    appliedAt: appliedAtStr,
    status: appDoc.status || 'Applied',
    interview_date: appDoc.interview_date || null
  };
}

// Helper: Format Interview for student views matching React expectations
function formatStudentInterview(intDoc) {
  if (!intDoc) return null;
  const app = intDoc.application && typeof intDoc.application === 'object' ? intDoc.application : {};
  const student = intDoc.student && typeof intDoc.student === 'object' ? intDoc.student : (app.student && typeof app.student === 'object' ? app.student : {});
  const drive = intDoc.drive && typeof intDoc.drive === 'object' ? intDoc.drive : (app.drive && typeof app.drive === 'object' ? app.drive : {});
  const comp = intDoc.company && typeof intDoc.company === 'object' ? intDoc.company : (drive.company && typeof drive.company === 'object' ? drive.company : {});

  const compName = comp.name || intDoc.company_name || intDoc.companyName || 'TechNova Solutions';
  const driveTitle = drive.title || intDoc.drive_title || intDoc.driveTitle || 'Software Engineer';
  const roundStr = intDoc.round_name || intDoc.roundName || 'Technical Round 1';

  let dateStr = intDoc.scheduled_date || intDoc.scheduledDate;
  if (intDoc.scheduledDate instanceof Date) {
    dateStr = intDoc.scheduledDate.toISOString().split('T')[0];
  } else if (typeof dateStr === 'string' && dateStr.includes('T')) {
    dateStr = dateStr.split('T')[0];
  }

  const timeStr = intDoc.scheduled_time || intDoc.scheduledTime || '10:00 AM';
  const typeStr = intDoc.interview_type || intDoc.interviewType || 'Online';
  const venueStr = intDoc.venue || (typeStr === 'Online' ? 'Google Meet link will be shared via email' : 'Campus Placement Cell');
  const statusStr = intDoc.status || 'Scheduled';
  const intIdStr = intDoc._id ? String(intDoc._id) : String(intDoc.id || '');
  const appIdStr = app._id ? String(app._id) : (app.id ? String(app.id) : String(intDoc.application_id || intDoc.applicationId || ''));

  return {
    id: intIdStr,
    _id: intIdStr,
    application_id: appIdStr,
    applicationId: appIdStr,
    company_name: compName,
    companyName: compName,
    drive_title: driveTitle,
    driveTitle: driveTitle,
    round_name: roundStr,
    roundName: roundStr,
    scheduled_date: dateStr,
    scheduledDate: dateStr,
    scheduled_time: timeStr,
    scheduledTime: timeStr,
    interview_type: typeStr,
    interviewType: typeStr,
    venue: venueStr,
    instructions: intDoc.instructions || null,
    status: statusStr
  };
}

// Format Notification for student consumption
function formatStudentNotification(doc) {
  if (!doc) return null;
  const id = (doc._id || doc.id || '').toString();
  const createdAt = doc.createdAt
    ? new Date(doc.createdAt).toISOString().slice(0, 16).replace('T', ' ')
    : (doc.created_at || new Date().toISOString().slice(0, 16).replace('T', ' '));
  const isRead = doc.isRead !== undefined ? Boolean(doc.isRead) : (doc.is_read !== undefined ? Boolean(doc.is_read) : false);

  return {
    id,
    _id: id,
    message: doc.message || doc.title || '',
    title: doc.title || '',
    type: doc.type || 'system',
    link: doc.link || '/student/notifications',
    meet_url: doc.meetUrl || doc.meet_url || null,
    meetUrl: doc.meetUrl || doc.meet_url || null,
    round_name: doc.roundName || doc.round_name || null,
    roundName: doc.roundName || doc.round_name || null,
    scheduled_date: doc.scheduledDate || doc.scheduled_date || null,
    scheduledDate: doc.scheduledDate || doc.scheduled_date || null,
    scheduled_time: doc.scheduledTime || doc.scheduled_time || null,
    scheduledTime: doc.scheduledTime || doc.scheduled_time || null,
    instructions: doc.instructions || null,
    is_read: isRead,
    isRead: isRead,
    created_at: createdAt,
    createdAt: doc.createdAt || createdAt
  };
}

async function seedDemoNotificationsIfEmpty() {
  if (mongoose.connection?.readyState !== 1 || !Notification) return;
  try {
    const count = await Notification.countDocuments();
    if (count === 0) {
      await Notification.create([
        {
          recipientRole: 'student',
          title: 'Interview Scheduled',
          message: 'Interview Scheduled: Technical Coding & DSA Round with TechNova Solutions on Sep 18 at 11:00 AM.',
          type: 'interview',
          link: '/student/interviews',
          isRead: false
        },
        {
          recipientRole: 'student',
          title: 'New Placement Drive',
          message: 'New Placement Drive Announced: Microsoft Cloud Solutions & AI Trainee (₹18.5 LPA). Apply before Sep 22.',
          type: 'drive',
          link: '/student/drives',
          isRead: false
        },
        {
          recipientRole: 'student',
          title: 'Profile Verified',
          message: 'Profile Verification: Your academic metrics (CGPA 8.9) have been verified by the Placement Cell.',
          type: 'system',
          link: '/student/profile',
          isRead: true
        }
      ]);
    }
  } catch (err) {
    console.warn('[Student Seed Notifications Warning]:', err.message);
  }
}

// 1. GET Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const userEmail = req.user?.email || 'priya.sharma@student.edu';
    const student = await getStudentProfileForUser(userId, userEmail);

    const completion = calculateCompletion(student);
    let app_count = studentStore.applications.length;
    let shortlisted = studentStore.applications.filter(a => ['Shortlisted', 'Interview Scheduled', 'Under Review'].includes(a.status)).length;
    let selected = studentStore.selectedOffers || [];
    let upcoming_interviews = (studentStore.interviews || []).filter(i => i.status === 'Scheduled').map(formatStudentInterview);
    const recent_notifications = studentStore.notifications.slice(0, 5);

    // Read application and interview metrics from MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const studentDoc = await getOrCreateMongoStudent(userId, userEmail);
        if (studentDoc) {
          const mongoApps = await Application.find({
            student: studentDoc._id,
            status: { $ne: 'Withdrawn' }
          }).lean();
          if (mongoApps && mongoApps.length > 0) {
            app_count = mongoApps.length;
            shortlisted = mongoApps.filter(a => ['Shortlisted', 'Interview Scheduled', 'Under Review'].includes(a.status)).length;
          }

          const appIds = (mongoApps || []).map(a => a._id);
          const mongoUpcoming = await Interview.find({
            $or: [
              { student: studentDoc._id },
              { application: { $in: appIds } }
            ],
            status: 'Scheduled'
          })
            .populate({
              path: 'application',
              populate: [
                { path: 'student' },
                { path: 'drive', populate: { path: 'company' } }
              ]
            })
            .populate('drive')
            .populate('company')
            .sort({ scheduledDate: 1, createdAt: -1 })
            .lean();

          if (mongoUpcoming && mongoUpcoming.length > 0) {
            upcoming_interviews = mongoUpcoming.map(formatStudentInterview);
          }

          if (PlacementResult) {
            const results = await PlacementResult.find({
              $or: [
                { student: studentDoc._id },
                { application: { $in: appIds } }
              ],
              status: 'Selected'
            })
              .populate({
                path: 'application',
                populate: [
                  { path: 'drive', populate: { path: 'company' } }
                ]
              })
              .populate({ path: 'drive', populate: { path: 'company' } })
              .populate('company')
              .sort({ updatedAt: -1, createdAt: -1 })
              .lean();

            if (results && results.length > 0) {
              selected = results.map(r => {
                const drive = r.drive || r.application?.drive || {};
                const comp = r.company || drive.company || {};
                const dateStr = r.placementDate instanceof Date
                  ? r.placementDate.toISOString().split('T')[0]
                  : (r.placement_date ? String(r.placement_date).split('T')[0] : '');

                return {
                  id: r._id ? r._id.toString() : String(r.id),
                  _id: r._id ? r._id.toString() : String(r.id),
                  company_name: comp.name || 'TechNova Solutions',
                  companyName: comp.name || 'TechNova Solutions',
                  drive_title: drive.title || 'Software Engineer - New Grad',
                  driveTitle: drive.title || 'Software Engineer - New Grad',
                  package_lpa: r.package !== undefined ? Number(r.package) : 12.0,
                  packageLpa: r.package !== undefined ? Number(r.package) : 12.0,
                  package: r.package !== undefined ? Number(r.package) : 12.0,
                  placement_date: dateStr,
                  placementDate: dateStr,
                  status: r.status || 'Selected'
                };
              });
            }
          }
        }
      } catch (err) {
        console.warn('[Student Mongo Dashboard Warning]:', err.message);
      }
    }

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
        skills: student.technical_skills || student.skills || []
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 2. GET Profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const userEmail = req.user?.email || 'priya.sharma@student.edu';
    const student = await getStudentProfileForUser(userId, userEmail);

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
        skills_string: Array.isArray(student.technical_skills) ? student.technical_skills.join(', ') : (student.technical_skills || '')
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
    const userId = req.user?._id || req.user?.id;
    const userEmail = req.user?.email || 'priya.sharma@student.edu';

    // Parse technical skills
    let parsedSkills = [];
    if (body.technical_skills !== undefined) {
      if (Array.isArray(body.technical_skills)) {
        parsedSkills = body.technical_skills;
      } else if (typeof body.technical_skills === 'string') {
        parsedSkills = body.technical_skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    } else if (body.skills !== undefined) {
      if (Array.isArray(body.skills)) {
        parsedSkills = body.skills;
      } else if (typeof body.skills === 'string') {
        parsedSkills = body.skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    // Build update object
    const updateData = {};
    if (body.studentNo !== undefined && String(body.studentNo).trim()) {
      updateData.studentNo = String(body.studentNo).trim();
    } else if (body.student_no !== undefined && String(body.student_no).trim()) {
      updateData.studentNo = String(body.student_no).trim();
    }
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.phone !== undefined) updateData.phone = body.phone.trim();
    if (body.department !== undefined) updateData.department = body.department.trim();
    if (body.gradYear !== undefined || body.grad_year !== undefined) {
      updateData.gradYear = Number(body.gradYear || body.grad_year || 2026);
    }
    if (body.cgpa !== undefined) updateData.cgpa = Number(body.cgpa);
    if (body.tenthPct !== undefined && body.tenthPct !== '') updateData.tenthPct = Number(body.tenthPct);
    if (body.twelfthPct !== undefined && body.twelfthPct !== '') updateData.twelfthPct = Number(body.twelfthPct);
    if (body.backlogs !== undefined) updateData.backlogs = Number(body.backlogs);
    if (body.softSkills !== undefined) {
      updateData.softSkills = Array.isArray(body.softSkills) ? body.softSkills.join(', ') : String(body.softSkills);
    }
    if (body.certifications !== undefined) updateData.certifications = body.certifications;
    if (body.projects !== undefined) updateData.projects = body.projects;
    if (body.internships !== undefined) updateData.internships = body.internships;
    if (parsedSkills.length > 0 || body.technical_skills !== undefined || body.skills !== undefined) {
      updateData.skills = parsedSkills;
    }
    if (body.resumeLatex !== undefined) updateData.resumeLatex = body.resumeLatex;
    if (body.resume_latex !== undefined) updateData.resumeLatex = body.resume_latex;
    if (body.resumeData !== undefined) updateData.resumeData = body.resumeData;
    if (body.resume_data !== undefined) updateData.resumeData = body.resume_data;

    let updatedStudent = null;

    // 1. Persist to MongoDB if connected
    if (mongoose.connection.readyState === 1 && userId) {
      try {
        const studentNo = body.studentNo || body.student_no || studentStore.profile.studentNo || 'CS2023001';
        const setFields = { ...updateData, user: userId };
        const insertFields = {};
        if (!setFields.studentNo) insertFields.studentNo = studentNo;
        if (!setFields.name) insertFields.name = studentStore.profile.name;
        if (!setFields.department) insertFields.department = studentStore.profile.department;
        if (!setFields.gradYear) insertFields.gradYear = 2026;

        const updateOps = { $set: setFields };
        if (Object.keys(insertFields).length > 0) {
          updateOps.$setOnInsert = insertFields;
        }

        const doc = await Student.findOneAndUpdate(
          { user: userId },
          updateOps,
          { new: true, upsert: true, runValidators: false }
        ).lean();

        if (doc) {
          updatedStudent = formatStudentResponse(doc, userEmail);
        }
      } catch (dbErr) {
        console.warn('[Student Mongo UpdateProfile Warning]:', dbErr.message);
      }
    }

    // 2. Also keep in-memory fallback updated
    const student = studentStore.profile;
    if (updateData.studentNo !== undefined) student.studentNo = updateData.studentNo;
    if (updateData.name !== undefined) student.name = updateData.name;
    if (updateData.phone !== undefined) student.phone = updateData.phone;
    if (updateData.department !== undefined) student.department = updateData.department;
    if (updateData.gradYear !== undefined) student.gradYear = updateData.gradYear;
    if (updateData.cgpa !== undefined) student.cgpa = updateData.cgpa;
    if (updateData.tenthPct !== undefined) student.tenthPct = updateData.tenthPct;
    if (updateData.twelfthPct !== undefined) student.twelfthPct = updateData.twelfthPct;
    if (updateData.backlogs !== undefined) student.backlogs = updateData.backlogs;
    if (updateData.softSkills !== undefined) student.softSkills = updateData.softSkills;
    if (updateData.certifications !== undefined) student.certifications = updateData.certifications;
    if (updateData.projects !== undefined) student.projects = updateData.projects;
    if (updateData.internships !== undefined) student.internships = updateData.internships;
    if (updateData.resumeLatex !== undefined) student.resumeLatex = updateData.resumeLatex;
    if (updateData.resumeData !== undefined) student.resumeData = updateData.resumeData;
    if (updateData.skills !== undefined) {
      student.technical_skills = updateData.skills;
    }

    if (!updatedStudent) {
      updatedStudent = student;
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        student: updatedStudent,
        completion: calculateCompletion(updatedStudent)
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
    const resumeFile = filename || 'student_1_uploaded_resume.pdf';
    const resumeOriginal = filename || 'Verified_Student_Resume.pdf';

    studentStore.profile.resume_filename = resumeFile;
    studentStore.profile.resume_original_name = resumeOriginal;

    const userId = req.user?._id || req.user?.id;
    if (mongoose.connection.readyState === 1 && userId) {
      try {
        await Student.findOneAndUpdate(
          { user: userId },
          {
            $set: {
              resumeFilename: resumeFile,
              resumeOriginalName: resumeOriginal
            }
          }
        );
      } catch (dbErr) {
        console.warn('[Student Mongo UploadResume Warning]:', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Resume updated successfully.',
      data: {
        resume_filename: resumeFile,
        resume_original_name: resumeOriginal
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5. GET Drives
exports.getDrives = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const userEmail = req.user?.email || 'priya.sharma@student.edu';
    const student = await getStudentProfileForUser(userId, userEmail);
    const { q, eligible } = req.query;

    let driveList = [];

    // 1. If MongoDB is connected, read from Drive collection
    if (mongoose.connection.readyState === 1) {
      try {
        const mongoDrives = await Drive.find({ status: 'active' }).populate('company').sort({ deadline: 1 }).lean();
        if (mongoDrives && mongoDrives.length > 0) {
          driveList = mongoDrives.map(d => formatDriveForStudent(d));
        }
      } catch (err) {
        console.warn('[Student Mongo Get Drives Warning]:', err.message);
      }
    }

    // 2. Fallback to in-memory studentStore.drives
    if (driveList.length === 0) {
      driveList = studentStore.drives.map(d => formatDriveForStudent(d));
    }

    let items = driveList.map(d => {
      const eligibility = checkEligibility(student, d);
      const app = studentStore.applications.find(a => String(a.drive_id) === String(d.id));
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
    const userId = req.user?._id || req.user?.id;
    const userEmail = req.user?.email || 'priya.sharma@student.edu';
    const student = await getStudentProfileForUser(userId, userEmail);

    let drive = null;

    // 1. Check MongoDB if connected
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const doc = await Drive.findById(id).populate('company').lean();
        if (doc) {
          drive = formatDriveForStudent(doc);
        }
      } catch (err) {
        console.warn('[Student Mongo Get Drive Detail Warning]:', err.message);
      }
    }

    // 2. Fallback in-memory
    if (!drive) {
      const fallback = studentStore.drives.find(d => String(d.id) === String(id) || String(d._id) === String(id));
      if (fallback) {
        drive = formatDriveForStudent(fallback);
      }
    }

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found.' });
    }

    const eligibility = checkEligibility(student, drive);
    let appliedApp = null;

    if (mongoose.connection.readyState === 1) {
      try {
        const studentDoc = await getOrCreateMongoStudent(userId, userEmail);
        let driveObjectId = null;
        if (mongoose.Types.ObjectId.isValid(drive.id)) {
          driveObjectId = drive.id;
        } else {
          const dDoc = await Drive.findOne({ title: drive.title });
          if (dDoc) driveObjectId = dDoc._id;
        }

        if (studentDoc && driveObjectId) {
          const mApp = await Application.findOne({
            student: studentDoc._id,
            drive: driveObjectId,
            status: { $ne: 'Withdrawn' }
          }).populate({ path: 'drive', populate: { path: 'company' } }).lean();
          if (mApp) appliedApp = formatApplicationForStudent(mApp);
        }
      } catch (e) {}
    }

    if (!appliedApp) {
      const appFallback = studentStore.applications.find(a => String(a.drive_id) === String(drive.id) && a.status !== 'Withdrawn');
      if (appFallback) appliedApp = formatApplicationForStudent(appFallback);
    }

    return res.status(200).json({
      success: true,
      data: {
        drive,
        eligible: eligibility.eligible,
        reasons: eligibility.reasons,
        applied: appliedApp || null
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
    const userId = req.user?._id || req.user?.id;
    const userEmail = req.user?.email || 'priya.sharma@student.edu';
    const student = await getStudentProfileForUser(userId, userEmail);

    let drive = null;
    let driveDoc = null;

    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        try {
          driveDoc = await Drive.findById(id).populate('company');
          if (driveDoc) drive = formatDriveForStudent(driveDoc);
        } catch (err) {
          console.warn('[Student Mongo Apply Find Drive Warning]:', err.message);
        }
      }
      if (!drive) {
        driveDoc = await Drive.findOne({ title: 'Software Engineer - New Grad' }).populate('company');
        if (driveDoc && String(driveDoc.id) === String(id)) {
          drive = formatDriveForStudent(driveDoc);
        }
      }
    }

    if (!drive) {
      const fallback = studentStore.drives.find(d => String(d.id) === String(id) || String(d._id) === String(id));
      if (fallback) drive = formatDriveForStudent(fallback);
    }

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found.' });
    }

    const eligibility = checkEligibility(student, drive);
    if (!eligibility.eligible) {
      return res.status(400).json({
        success: false,
        message: 'You are not eligible to apply for this drive: ' + eligibility.reasons.join(', ')
      });
    }

    let studentDoc = null;
    if (mongoose.connection.readyState === 1) {
      studentDoc = await getOrCreateMongoStudent(userId, userEmail);
      if (!driveDoc && drive) {
        if (mongoose.Types.ObjectId.isValid(drive.id)) {
          driveDoc = await Drive.findById(drive.id).populate('company');
        } else {
          driveDoc = await Drive.findOne({ title: drive.title }).populate('company');
        }
      }

      // Check existing application in MongoDB
      if (studentDoc && driveDoc) {
        const existingMongoApp = await Application.findOne({
          student: studentDoc._id,
          drive: driveDoc._id
        });
        if (existingMongoApp && existingMongoApp.status !== 'Withdrawn') {
          return res.status(400).json({
            success: false,
            message: 'You have already submitted an application for this drive.'
          });
        }
      }
    }

    // Check existing application in fallback store
    const existingApp = studentStore.applications.find(
      a => String(a.drive_id) === String(drive.id) && a.status !== 'Withdrawn'
    );
    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this drive.'
      });
    }

    let createdMongoApp = null;
    if (mongoose.connection.readyState === 1 && studentDoc && driveDoc) {
      try {
        const doc = await Application.create({
          student: studentDoc._id,
          drive: driveDoc._id,
          status: 'Applied'
        });
        createdMongoApp = await Application.findById(doc._id)
          .populate('student')
          .populate({ path: 'drive', populate: { path: 'company' } })
          .lean();
      } catch (dbErr) {
        if (dbErr.code === 11000) {
          return res.status(400).json({
            success: false,
            message: 'You have already submitted an application for this drive.'
          });
        }
        console.warn('[Student Mongo Apply Create Warning]:', dbErr.message);
      }
    }

    const newApp = createdMongoApp
      ? formatApplicationForStudent(createdMongoApp)
      : {
          id: `app-${Date.now()}`,
          _id: `app-${Date.now()}`,
          drive_id: drive.id,
          driveId: drive.id,
          drive_title: drive.title,
          driveTitle: drive.title,
          company_name: drive.company_name,
          companyName: drive.company_name,
          package_lpa: drive.ctc,
          packageLpa: drive.ctc,
          applied_at: new Date().toISOString(),
          appliedAt: new Date().toISOString(),
          status: 'Applied',
          interview_date: null
        };

    // Update in-memory fallback stores
    studentStore.applications.unshift(newApp);

    // Also sync to recruiterStore.applications for live reflection in fallback
    try {
      const { recruiterStore } = require('./recruiterController');
      if (recruiterStore && recruiterStore.applications) {
        recruiterStore.applications.unshift({
          id: newApp.id,
          _id: newApp.id,
          student_id: 1,
          studentId: 1,
          student_name: student.name || 'Priya Sharma',
          studentName: student.name || 'Priya Sharma',
          name: student.name || 'Priya Sharma',
          student_no: student.studentNo || student.student_no || 'CS2023001',
          studentNo: student.studentNo || student.student_no || 'CS2023001',
          student_email: userEmail,
          studentEmail: userEmail,
          department: student.department || 'Computer Science',
          cgpa: student.cgpa !== undefined ? Number(student.cgpa) : 8.9,
          drive_id: drive.id,
          driveId: drive.id,
          drive_title: drive.title,
          driveTitle: drive.title,
          company_id: 1,
          company_email: 'hr@technova.com',
          company_name: drive.company_name || 'TechNova Solutions',
          status: 'Applied',
          applied_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
          updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
        });
      }
    } catch (e) {}

    // Add notification
    studentStore.notifications.unshift({
      id: `notif-${Date.now()}`,
      message: `Application submitted successfully for '${drive.title}' at ${drive.company_name}.`,
      created_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
      is_read: false
    });

    if (mongoose.connection?.readyState === 1 && Notification) {
      try {
        await Notification.create({
          user: userId,
          recipientRole: 'student',
          student: studentDoc?._id,
          company: driveDoc?.company?._id || driveDoc?.company,
          title: 'Application Submitted',
          message: `Application submitted successfully for '${drive.title}' at ${drive.company_name}.`,
          type: 'application',
          link: '/student/applications',
          isRead: false
        });

        await Notification.create({
          recipientRole: 'recruiter',
          student: studentDoc?._id,
          company: driveDoc?.company?._id || driveDoc?.company,
          title: 'New Applicant',
          message: `New applicant ${student.name || 'Priya Sharma'} applied for '${drive.title}'.`,
          type: 'application',
          link: '/recruiter/applicants',
          isRead: false
        });
      } catch (e) {
        console.warn('[Student Apply Mongo Notification Warning]:', e.message);
      }
    }

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
    const userId = req.user?._id || req.user?.id;
    const userEmail = req.user?.email || 'priya.sharma@student.edu';

    // 1. If MongoDB is connected, query Application collection
    if (mongoose.connection.readyState === 1) {
      try {
        const studentDoc = await getOrCreateMongoStudent(userId, userEmail);
        if (studentDoc) {
          const mongoApps = await Application.find({
            student: studentDoc._id,
            status: { $ne: 'Withdrawn' }
          })
            .populate({ path: 'drive', populate: { path: 'company' } })
            .sort({ createdAt: -1 })
            .lean();

          if (mongoApps && mongoApps.length > 0) {
            const formatted = mongoApps.map(formatApplicationForStudent);
            return res.status(200).json({
              success: true,
              data: formatted
            });
          }
        }
      } catch (dbErr) {
        console.warn('[Student Mongo Get Applications Warning]:', dbErr.message);
      }
    }

    // 2. Fallback in-memory
    const activeApps = studentStore.applications.filter(a => a.status !== 'Withdrawn');
    return res.status(200).json({
      success: true,
      data: activeApps.map(formatApplicationForStudent)
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 9. POST Withdraw Application
exports.withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id;
    const userEmail = req.user?.email || 'priya.sharma@student.edu';

    let foundInMongo = false;

    // 1. If MongoDB is connected, find and update in MongoDB
    if (mongoose.connection.readyState === 1) {
      try {
        const studentDoc = await getOrCreateMongoStudent(userId, userEmail);
        let mongoApp = null;
        if (mongoose.Types.ObjectId.isValid(id)) {
          mongoApp = await Application.findById(id);
        }
        if (!mongoApp && studentDoc) {
          mongoApp = await Application.findOne({
            student: studentDoc._id,
            $or: [
              { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
              { drive: mongoose.Types.ObjectId.isValid(id) ? id : null }
            ]
          });
        }

        if (mongoApp) {
          foundInMongo = true;
          if (!['Applied', 'Under Review'].includes(mongoApp.status)) {
            return res.status(400).json({
              success: false,
              message: 'Cannot withdraw an application that has progressed past review.'
            });
          }

          mongoApp.status = 'Withdrawn';
          await mongoApp.save();
        }
      } catch (dbErr) {
        console.warn('[Student Mongo Withdraw Warning]:', dbErr.message);
      }
    }

    // 2. Update fallback in-memory store
    const index = studentStore.applications.findIndex(
      a => String(a.id) === String(id) || String(a._id) === String(id) || String(a.drive_id) === String(id)
    );

    if (index !== -1) {
      const app = studentStore.applications[index];
      if (!foundInMongo && !['Applied', 'Under Review'].includes(app.status)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot withdraw an application that has progressed past review.'
        });
      }
      app.status = 'Withdrawn';
      studentStore.applications.splice(index, 1);
    } else if (!foundInMongo) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (mongoose.connection?.readyState === 1 && Notification) {
      try {
        await Notification.create({
          user: userId,
          recipientRole: 'student',
          title: 'Application Withdrawn',
          message: 'You have withdrawn your application.',
          type: 'application',
          link: '/student/applications',
          isRead: false
        });
      } catch (e) {
        console.warn('[Student Withdraw Mongo Notification Warning]:', e.message);
      }
    }

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
    const userId = req.user?._id || req.user?.id;
    const userEmail = req.user?.email || 'priya.sharma@student.edu';

    // 1. If MongoDB is connected, query Interview collection
    if (mongoose.connection.readyState === 1) {
      try {
        const studentDoc = await getOrCreateMongoStudent(userId, userEmail);
        if (studentDoc) {
          const apps = await Application.find({ student: studentDoc._id }).lean();
          const appIds = (apps || []).map(a => a._id);

          const mongoInterviews = await Interview.find({
            $or: [
              { student: studentDoc._id },
              { application: { $in: appIds } }
            ]
          })
            .populate({
              path: 'application',
              populate: [
                { path: 'student' },
                { path: 'drive', populate: { path: 'company' } }
              ]
            })
            .populate('drive')
            .populate('company')
            .sort({ scheduledDate: 1, createdAt: -1 })
            .lean();

          if (mongoInterviews && mongoInterviews.length > 0) {
            return res.status(200).json({
              success: true,
              data: mongoInterviews.map(formatStudentInterview)
            });
          }
        }
      } catch (dbErr) {
        console.warn('[Student Mongo Get Interviews Warning]:', dbErr.message);
      }
    }

    // 2. Fallback in-memory
    return res.status(200).json({
      success: true,
      data: (studentStore.interviews || []).map(formatStudentInterview)
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 11. GET Notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const userEmail = req.user?.email || 'priya.sharma@student.edu';

    // 1. If MongoDB is connected, query Notification collection
    if (mongoose.connection?.readyState === 1 && Notification) {
      try {
        await seedDemoNotificationsIfEmpty();

        let studentDoc = null;
        if (userId) {
          studentDoc = await Student.findOne({ user: userId }).lean();
        }

        const query = {
          $or: [
            { recipientRole: 'student' },
            { recipientRole: 'all' },
            ...(userId ? [{ user: userId }] : []),
            ...(studentDoc ? [{ student: studentDoc._id }] : [])
          ]
        };

        const docs = await Notification.find(query).sort({ createdAt: -1 }).lean();
        if (docs && docs.length > 0) {
          const items = docs.map(formatStudentNotification);
          return res.status(200).json({
            success: true,
            data: items
          });
        }
      } catch (dbErr) {
        console.warn('[Student Mongo Get Notifications Warning]:', dbErr.message);
      }
    }

    // 2. Fallback in-memory
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

    if (mongoose.connection?.readyState === 1 && Notification) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          await Notification.findByIdAndUpdate(id, { isRead: true });
        }
      } catch (err) {
        console.warn('[Student Mongo Mark Read Warning]:', err.message);
      }
    }

    const notif = studentStore.notifications.find(n => String(n.id) === String(id) || String(n._id) === String(id));
    if (notif) {
      notif.is_read = true;
      notif.isRead = true;
    }
    return res.status(200).json({
      success: true,
      message: 'Notification marked as read.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Mark all notifications read
exports.markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (mongoose.connection?.readyState === 1 && Notification) {
      try {
        let studentDoc = null;
        if (userId) {
          studentDoc = await Student.findOne({ user: userId }).lean();
        }

        const query = {
          $or: [
            { recipientRole: 'student' },
            { recipientRole: 'all' },
            ...(userId ? [{ user: userId }] : []),
            ...(studentDoc ? [{ student: studentDoc._id }] : [])
          ]
        };

        await Notification.updateMany(query, { $set: { isRead: true } });
      } catch (err) {
        console.warn('[Student Mongo Mark All Read Warning]:', err.message);
      }
    }

    (studentStore.notifications || []).forEach(n => {
      n.is_read = true;
      n.isRead = true;
    });

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 12. GET Placement Status
exports.getPlacementStatus = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const userEmail = req.user?.email || 'priya.sharma@student.edu';
    const student = await getStudentProfileForUser(userId, userEmail);

    let offers = studentStore.selectedOffers || [];

    if (mongoose.connection?.readyState === 1 && PlacementResult) {
      try {
        const studentDoc = await getOrCreateMongoStudent(userId, userEmail);
        if (studentDoc) {
          const docs = await PlacementResult.find({
            student: studentDoc._id,
            status: 'Selected'
          })
            .populate({
              path: 'application',
              populate: [
                { path: 'drive', populate: { path: 'company' } }
              ]
            })
            .populate({ path: 'drive', populate: { path: 'company' } })
            .populate('company')
            .sort({ updatedAt: -1, createdAt: -1 })
            .lean();

          if (docs && docs.length > 0) {
            offers = docs.map(r => {
              const drive = r.drive || r.application?.drive || {};
              const comp = r.company || drive.company || {};
              const dateStr = r.placementDate instanceof Date
                ? r.placementDate.toISOString().split('T')[0]
                : (r.placement_date ? String(r.placement_date).split('T')[0] : '');

              return {
                id: r._id ? r._id.toString() : String(r.id),
                _id: r._id ? r._id.toString() : String(r.id),
                company_name: comp.name || 'TechNova Solutions',
                companyName: comp.name || 'TechNova Solutions',
                drive_title: drive.title || 'Software Engineer - New Grad',
                driveTitle: drive.title || 'Software Engineer - New Grad',
                package_lpa: r.package !== undefined ? Number(r.package) : 12.0,
                packageLpa: r.package !== undefined ? Number(r.package) : 12.0,
                package: r.package !== undefined ? Number(r.package) : 12.0,
                placement_date: dateStr,
                placementDate: dateStr,
                status: r.status || 'Selected'
              };
            });
          }
        }
      } catch (err) {
        console.warn('[Student Mongo Placement Status Warning]:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        student: student || studentStore.profile,
        results: offers
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.studentStore = studentStore;

