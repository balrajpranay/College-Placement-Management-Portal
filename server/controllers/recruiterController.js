const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const Drive = require('../models/Drive');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const Notification = require('../models/Notification');
const Student = require('../models/Student');
const PlacementResult = require('../models/PlacementResult');
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

// Helper: Get or create Mongoose Company document for authenticated recruiter
async function getOrCreateMongoCompany(userId, email) {
  if (mongoose.connection.readyState !== 1) return null;
  try {
    let comp = null;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      comp = await Company.findOne({ user: userId });
    }
    if (!comp && email) {
      comp = await Company.findOne({ email });
    }
    if (!comp) {
      const fallback = getCompanyByEmail(email);
      const userObjId = userId && mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : new mongoose.Types.ObjectId('65e000000000000000000003');
      comp = await Company.create({
        user: userObjId,
        name: fallback.name || 'TechNova Solutions',
        industry: fallback.industry || 'Software / IT',
        website: fallback.website || 'https://technova.example.com',
        hrContact: fallback.hrContact || fallback.hr_contact || 'Anita Rao',
        email: email,
        phone: fallback.phone || '9363328006',
        location: fallback.location || 'Bengaluru',
        description: fallback.description || 'TechNova Solutions is a premier technology consulting firm.',
        approved: true
      });
    }
    return comp;
  } catch (err) {
    console.warn('[Recruiter Mongo getOrCreateMongoCompany Warning]:', err.message);
    return null;
  }
}

// Helper: Seed initial demo drives if MongoDB is connected and Drive collection is empty
async function seedDemoDrivesIfEmpty() {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const count = await Drive.countDocuments();
    if (count === 0) {
      let technova = await Company.findOne({ email: 'hr@technova.com' });
      if (!technova) {
        technova = await Company.create({
          user: new mongoose.Types.ObjectId('65e000000000000000000003'),
          name: 'TechNova Solutions',
          industry: 'Software / IT',
          website: 'https://technova.example.com',
          hrContact: 'Anita Rao',
          email: 'hr@technova.com',
          phone: '9363328006',
          location: 'Bengaluru',
          description: 'TechNova Solutions is a premier technology consulting firm.',
          approved: true
        });
      }

      for (const d of recruiterStore.drives) {
        await Drive.create({
          company: technova._id,
          title: d.title,
          jobType: d.job_type || d.jobType || 'Full-Time',
          ctc: d.ctc,
          location: d.location || 'Bengaluru',
          minCgpa: d.min_cgpa || d.minCgpa || 7.0,
          maxBacklogs: d.max_backlogs !== undefined ? d.max_backlogs : (d.maxBacklogs || 0),
          openings: d.openings || 10,
          deadline: d.deadline ? new Date(d.deadline) : new Date(Date.now() + 30 * 86400000),
          driveDate: d.drive_date ? new Date(d.drive_date) : null,
          branches: Array.isArray(d.branches) ? d.branches : ['Computer Science', 'Information Technology', 'Electronics & Comm.'],
          skills: Array.isArray(d.skills) ? d.skills : ['Python', 'Java', 'Data Structures', 'REST APIs'],
          status: d.status || 'active',
        });
      }
    }
  } catch (err) {
    console.warn('[Seed Demo Drives Notice]:', err.message);
  }
}

// Helper: Seed initial demo applications if MongoDB is connected and Application collection is empty
async function seedDemoApplicationsIfEmpty() {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const appCount = await Application.countDocuments();
    if (appCount === 0) {
      const studentDoc = await Student.findOne({ studentNo: 'CS2023001' });
      const driveDoc = await Drive.findOne({ title: 'Software Engineer - New Grad' });
      if (studentDoc && driveDoc) {
        await Application.create({
          student: studentDoc._id,
          drive: driveDoc._id,
          status: 'Interview Scheduled'
        });
      }
    }
  } catch (err) {
    console.warn('[Seed Demo Applications Notice]:', err.message);
  }
}

// Helper: Format Application for recruiter applicant reviews matching React expectations
function formatRecruiterApplicant(appDoc, company) {
  if (!appDoc) return null;
  const student = appDoc.student && typeof appDoc.student === 'object' ? appDoc.student : {};
  const drive = appDoc.drive && typeof appDoc.drive === 'object' ? appDoc.drive : {};
  const comp = drive.company && typeof drive.company === 'object' ? drive.company : (company || {});

  const candName = student.name || appDoc.student_name || appDoc.studentName || appDoc.name || 'Candidate';
  const candNo = student.studentNo || student.student_no || appDoc.student_no || appDoc.studentNo || 'STU1001';
  const candEmail = student.email || appDoc.student_email || appDoc.studentEmail || 'student@college.edu';
  const dept = student.department || appDoc.department || 'Computer Science';
  const cgpaVal = student.cgpa !== undefined ? Number(student.cgpa) : (appDoc.cgpa !== undefined ? Number(appDoc.cgpa) : 8.0);
  const resumeFile = student.resumeFilename || student.resume_filename || appDoc.resume_filename || null;

  const driveIdStr = drive._id ? String(drive._id) : (drive.id ? String(drive.id) : String(appDoc.drive_id || appDoc.driveId || ''));
  const driveTitleStr = drive.title || appDoc.drive_title || appDoc.driveTitle || 'Software Engineer';
  const compIdStr = comp._id ? String(comp._id) : (comp.id ? String(comp.id) : String(appDoc.company_id || appDoc.companyId || 1));
  const compEmailStr = comp.email || appDoc.company_email || appDoc.companyEmail || 'hr@technova.com';
  const compNameStr = comp.name || appDoc.company_name || appDoc.companyName || 'TechNova Solutions';

  const appIdStr = appDoc._id ? String(appDoc._id) : String(appDoc.id || '');
  const appliedAtStr = appDoc.createdAt instanceof Date
    ? appDoc.createdAt.toISOString().replace('T', ' ').substring(0, 19)
    : (appDoc.applied_at || appDoc.appliedAt || '2026-09-01 10:00:00');
  const updatedAtStr = appDoc.updatedAt instanceof Date
    ? appDoc.updatedAt.toISOString().replace('T', ' ').substring(0, 19)
    : (appDoc.updated_at || appDoc.updatedAt || appliedAtStr);

  return {
    id: appIdStr,
    _id: appIdStr,
    student_id: student._id ? String(student._id) : (student.id ? String(student.id) : String(appDoc.student_id || appDoc.studentId || 1)),
    studentId: student._id ? String(student._id) : (student.id ? String(student.id) : String(appDoc.student_id || appDoc.studentId || 1)),
    student_name: candName,
    studentName: candName,
    name: candName,
    student_no: candNo,
    studentNo: candNo,
    student_email: candEmail,
    studentEmail: candEmail,
    department: dept,
    cgpa: cgpaVal,
    drive_id: driveIdStr,
    driveId: driveIdStr,
    drive_title: driveTitleStr,
    driveTitle: driveTitleStr,
    company_id: compIdStr,
    companyId: compIdStr,
    company_email: compEmailStr,
    companyEmail: compEmailStr,
    company_name: compNameStr,
    companyName: compNameStr,
    status: appDoc.status || 'Applied',
    resume_filename: resumeFile,
    resumeFilename: resumeFile,
    applied_at: appliedAtStr,
    appliedAt: appliedAtStr,
    updated_at: updatedAtStr,
    updatedAt: updatedAtStr
  };
}

// Helper: Seed initial demo interviews if MongoDB is connected and Interview collection is empty
async function seedDemoInterviewsIfEmpty() {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const intCount = await Interview.countDocuments();
    if (intCount === 0) {
      await seedDemoApplicationsIfEmpty();
      const studentDoc = await Student.findOne({ studentNo: 'CS2023001' });
      const driveDoc = await Drive.findOne({ title: 'Software Engineer - New Grad' });
      if (studentDoc && driveDoc) {
        let appDoc = await Application.findOne({ student: studentDoc._id, drive: driveDoc._id });
        if (!appDoc) {
          appDoc = await Application.create({
            student: studentDoc._id,
            drive: driveDoc._id,
            status: 'Interview Scheduled'
          });
        }
        if (appDoc) {
          await Interview.create({
            application: appDoc._id,
            student: studentDoc._id,
            drive: driveDoc._id,
            company: driveDoc.company,
            roundName: 'Technical Coding & DSA Round',
            scheduledDate: new Date('2026-09-18T11:00:00Z'),
            scheduledTime: '11:00 AM - 12:00 PM',
            interviewType: 'Online',
            venue: 'https://meet.google.com/abc-tnov-xyz',
            status: 'Scheduled'
          });
        }
      }
    }
  } catch (err) {
    console.warn('[Seed Demo Interviews Notice]:', err.message);
  }
}

// Helper: Format Interview document for recruiter responses matching React expectations
function formatRecruiterInterview(intDoc, company) {
  if (!intDoc) return null;
  const app = intDoc.application && typeof intDoc.application === 'object' ? intDoc.application : {};
  const student = intDoc.student && typeof intDoc.student === 'object' ? intDoc.student : (app.student && typeof app.student === 'object' ? app.student : {});
  const drive = intDoc.drive && typeof intDoc.drive === 'object' ? intDoc.drive : (app.drive && typeof app.drive === 'object' ? app.drive : {});
  const comp = intDoc.company && typeof intDoc.company === 'object' ? intDoc.company : (drive.company && typeof drive.company === 'object' ? drive.company : (company || {}));

  const candName = student.name || intDoc.student_name || intDoc.studentName || 'Candidate';
  const candNo = student.studentNo || student.student_no || intDoc.student_no || intDoc.studentNo || 'STU1001';
  const candEmail = student.email || intDoc.student_email || intDoc.studentEmail || 'student@college.edu';
  const dept = student.department || intDoc.department || 'Computer Science';

  const driveIdStr = drive._id ? String(drive._id) : (drive.id ? String(drive.id) : String(intDoc.drive_id || intDoc.driveId || ''));
  const driveTitleStr = drive.title || intDoc.drive_title || intDoc.driveTitle || 'Software Engineer';
  const compIdStr = comp._id ? String(comp._id) : (comp.id ? String(comp.id) : String(intDoc.company_id || intDoc.companyId || 1));
  const compEmailStr = comp.email || intDoc.company_email || intDoc.companyEmail || 'hr@technova.com';
  const compNameStr = comp.name || intDoc.company_name || intDoc.companyName || 'TechNova Solutions';

  const appIdStr = app._id ? String(app._id) : (app.id ? String(app.id) : String(intDoc.application_id || intDoc.applicationId || ''));
  const intIdStr = intDoc._id ? String(intDoc._id) : String(intDoc.id || '');

  let dateStr = intDoc.scheduled_date || intDoc.scheduledDate;
  if (intDoc.scheduledDate instanceof Date) {
    dateStr = intDoc.scheduledDate.toISOString().split('T')[0];
  } else if (typeof dateStr === 'string' && dateStr.includes('T')) {
    dateStr = dateStr.split('T')[0];
  }

  const timeStr = intDoc.scheduled_time || intDoc.scheduledTime || '10:00 AM';
  const typeStr = intDoc.interview_type || intDoc.interviewType || 'Online';
  const roundStr = intDoc.round_name || intDoc.roundName || 'Technical Round 1';
  const venueStr = intDoc.venue || (typeStr === 'Online' ? 'Google Meet link will be shared via email' : 'Campus Placement Cell');
  const statusStr = intDoc.status || 'Scheduled';

  const createdAtStr = intDoc.createdAt instanceof Date
    ? intDoc.createdAt.toISOString().replace('T', ' ').substring(0, 19)
    : (intDoc.created_at || intDoc.createdAt || new Date().toISOString());

  const updatedAtStr = intDoc.updatedAt instanceof Date
    ? intDoc.updatedAt.toISOString().replace('T', ' ').substring(0, 19)
    : (intDoc.updated_at || intDoc.updatedAt || createdAtStr);

  return {
    id: intIdStr,
    _id: intIdStr,
    application_id: appIdStr,
    applicationId: appIdStr,
    drive_id: driveIdStr,
    driveId: driveIdStr,
    drive_title: driveTitleStr,
    driveTitle: driveTitleStr,
    company_id: compIdStr,
    companyId: compIdStr,
    company_email: compEmailStr,
    companyEmail: compEmailStr,
    company_name: compNameStr,
    companyName: compNameStr,
    student_id: student._id ? String(student._id) : (student.id ? String(student.id) : String(intDoc.student_id || intDoc.studentId || 1)),
    studentId: student._id ? String(student._id) : (student.id ? String(student.id) : String(intDoc.student_id || intDoc.studentId || 1)),
    student_name: candName,
    studentName: candName,
    student_no: candNo,
    studentNo: candNo,
    student_email: candEmail,
    studentEmail: candEmail,
    department: dept,
    round_name: roundStr,
    roundName: roundStr,
    scheduled_date: dateStr,
    scheduledDate: dateStr,
    scheduled_time: timeStr,
    scheduledTime: timeStr,
    interview_type: typeStr,
    interviewType: typeStr,
    venue: venueStr,
    status: statusStr,
    created_at: createdAtStr,
    createdAt: createdAtStr,
    updated_at: updatedAtStr,
    updatedAt: updatedAtStr
  };
}

// Helper: Format Drive document with complete camelCase and snake_case compatibility
function formatRecruiterDrive(d, company) {
  if (!d) return null;
  const idStr = (d._id || d.id || '').toString();
  const companyObj = d.company && typeof d.company === 'object' ? d.company : company;
  const compId = companyObj?._id ? companyObj._id.toString() : (companyObj?.id || 1);
  const compName = companyObj?.name || d.company_name || d.companyName || 'TechNova Solutions';
  const compEmail = companyObj?.email || d.company_email || d.companyEmail || 'hr@technova.com';

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
  const applicantCount = d.applicantCount !== undefined ? Number(d.applicantCount) : (d.applicant_count !== undefined ? Number(d.applicant_count) : 0);

  return {
    _id: idStr,
    id: idStr,
    title: d.title,
    company_id: compId,
    companyId: compId,
    company_email: compEmail,
    companyEmail: compEmail,
    company_name: compName,
    companyName: compName,
    job_type: jobType,
    jobType: jobType,
    ctc: ctc,
    package: ctc,
    location: d.location || 'Bengaluru',
    min_cgpa: minCgpa,
    minCgpa: minCgpa,
    max_backlogs: maxBacklogs,
    maxBacklogs: maxBacklogs,
    openings: openings,
    deadline: deadlineStr,
    drive_date: driveDateStr,
    driveDate: driveDateStr,
    applicant_count: applicantCount,
    applicantCount: applicantCount,
    status: d.status || 'active',
    description: d.description || '',
    branches: Array.isArray(d.branches) ? d.branches : [],
    skills: Array.isArray(d.skills) ? d.skills : []
  };
}

// Helper: Seed initial demo notifications if MongoDB is connected and collection is empty
async function seedDemoNotificationsIfEmpty() {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const count = await Notification.countDocuments();
    if (count === 0) {
      const studentDoc = await Student.findOne({ studentNo: 'CS2023001' });
      const driveDoc = await Drive.findOne({ title: 'Software Engineer - New Grad' }).populate('company');
      const companyDoc = driveDoc?.company;

      const initialNotifs = [
        // Student notifications
        {
          student: studentDoc?._id,
          recipientRole: 'student',
          title: 'Interview Scheduled',
          message: 'Interview Scheduled: Technical Coding & DSA Round with TechNova Solutions on Sep 18 at 11:00 AM.',
          link: '/student/interviews',
          isRead: false
        },
        {
          student: studentDoc?._id,
          recipientRole: 'student',
          title: 'New Placement Drive',
          message: 'New Placement Drive Announced: Microsoft Cloud Solutions & AI Trainee (₹18.5 LPA). Apply before Sep 22.',
          link: '/student/drives',
          isRead: false
        },
        {
          student: studentDoc?._id,
          recipientRole: 'student',
          title: 'Application Submitted',
          message: 'Application Submitted: Application successfully received for Software Engineer - New Grad at TechNova Solutions.',
          link: '/student/applications',
          isRead: true
        },
        // Recruiter notifications
        {
          company: companyDoc?._id,
          recipientRole: 'recruiter',
          title: 'New Applicant',
          message: "Priya Sharma applied to your drive 'Software Engineer - New Grad'.",
          link: '/recruiter/applicants',
          isRead: false
        },
        {
          company: companyDoc?._id,
          recipientRole: 'recruiter',
          title: 'New Applicant',
          message: "Rahul Verma applied to your drive 'Software Engineer - New Grad'.",
          link: '/recruiter/applicants',
          isRead: true
        },
        {
          company: companyDoc?._id,
          recipientRole: 'recruiter',
          title: 'Drive Approved',
          message: "Your campus hiring drive 'Software Engineer - New Grad' was approved by the placement cell.",
          link: '/recruiter/drives',
          isRead: true
        },
        {
          company: companyDoc?._id,
          recipientRole: 'recruiter',
          title: 'Profile Verified',
          message: 'Corporate partner profile verified by the Institutional Placement Officer.',
          link: '/recruiter/profile',
          isRead: true
        },
        // Admin notifications
        {
          recipientRole: 'admin',
          title: 'New Recruiter Verification Required',
          message: 'InnovateAI Solutions has submitted employer registration for placement season review.',
          type: 'company_approval',
          link: '/admin/companies',
          isRead: false
        },
        {
          recipientRole: 'admin',
          title: 'Drive Deadline Approaching',
          message: 'TechNova Solutions placement drive registration closes in 3 days.',
          type: 'drive_alert',
          link: '/admin/drives',
          isRead: false
        },
        {
          recipientRole: 'admin',
          title: 'Batch Result Published',
          message: '5 candidates have accepted final offers across TechNova and DataEdge.',
          type: 'placement_success',
          link: '/admin/applications',
          isRead: true
        },
        {
          recipientRole: 'admin',
          title: 'System Health & ATS Sync',
          message: 'Institutional candidate resumes and ATS scoring pipelines synchronized successfully.',
          type: 'system',
          link: '/admin/reports',
          isRead: true
        }
      ];

      await Notification.insertMany(initialNotifs);
    }
  } catch (err) {
    console.warn('[Seed Demo Notifications Notice]:', err.message);
  }
}

// Helper: Format Notification for Recruiter responses matching React expectations
function formatRecruiterNotification(doc, company) {
  if (!doc) return null;
  const idStr = doc._id ? String(doc._id) : String(doc.id || '');
  const createdAtStr = doc.createdAt instanceof Date
    ? doc.createdAt.toISOString().replace('T', ' ').substring(0, 19)
    : (doc.created_at || doc.createdAt || '2026-09-10 10:30:00');
  const isRead = Boolean(doc.isRead !== undefined ? doc.isRead : (doc.is_read !== undefined ? doc.is_read : false));
  const compId = doc.company ? String(doc.company._id || doc.company) : String(company?._id || company?.id || 1);
  const compEmail = company?.email || doc.company_email || doc.companyEmail || 'hr@technova.com';

  return {
    id: idStr,
    _id: idStr,
    company_id: compId,
    companyId: compId,
    company_email: compEmail,
    companyEmail: compEmail,
    user_id: doc.user ? String(doc.user) : '65e000000000000000000003',
    message: doc.message || '',
    link: doc.link || '/recruiter/notifications',
    is_read: isRead,
    isRead: isRead,
    created_at: createdAtStr,
    createdAt: createdAtStr
  };
}

// GET /api/recruiters/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const userId = req.user?._id || req.user?.id;
    let company = null;

    if (mongoose.connection.readyState === 1) {
      try {
        company = await getOrCreateMongoCompany(userId, email);
      } catch (err) {
        console.warn('[Recruiter Mongo Dashboard]: Fallback to memory store', err.message);
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
    let userDrives = [];
    if (mongoose.connection.readyState === 1 && company?._id) {
      try {
        const mongoDrives = await Drive.find({ company: company._id }).populate('company').sort({ createdAt: -1 }).lean();
        if (mongoDrives && mongoDrives.length > 0) {
          userDrives = mongoDrives.map(d => formatRecruiterDrive(d, company));
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Dashboard Drives Warning]:', err.message);
      }
    }

    if (userDrives.length === 0) {
      userDrives = recruiterStore.drives.filter(
        d => d.company_email === email || d.company_id === company.id
      );
    }

    const active_drives = userDrives.filter(d => d.status === 'active').length;
    let total_applicants = 0;
    userDrives.forEach(d => {
      total_applicants += (d.applicant_count || d.applicantCount || 0);
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
    const userId = req.user?._id || req.user?.id;

    if (mongoose.connection.readyState === 1) {
      try {
        const company = await getOrCreateMongoCompany(userId, email);
        if (company) {
          await seedDemoDrivesIfEmpty();
          const mongoDrives = await Drive.find({ company: company._id }).populate('company').sort({ createdAt: -1 }).lean();
          if (mongoDrives && mongoDrives.length > 0) {
            const formatted = mongoDrives.map(d => formatRecruiterDrive(d, company));
            return res.status(200).json({
              success: true,
              count: formatted.length,
              drives: formatted
            });
          }
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Get Drives Warning]:', err.message);
      }
    }

    // Fallback in-memory
    const company = getCompanyByEmail(email);
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
    const userId = req.user?._id || req.user?.id;
    const driveId = req.params.id;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(driveId)) {
      try {
        const company = await getOrCreateMongoCompany(userId, email);
        const driveDoc = await Drive.findById(driveId).populate('company').lean();
        if (driveDoc) {
          const docCompanyId = driveDoc.company?._id ? driveDoc.company._id.toString() : driveDoc.company?.toString();
          const docCompanyEmail = driveDoc.company?.email;
          const userCompId = company?._id?.toString();

          // Ownership check: Recruiter must own this drive
          if (docCompanyId !== userCompId && docCompanyEmail !== email) {
            return res.status(403).json({
              success: false,
              message: 'Access Denied: You do not own or have permission to manage this placement drive.'
            });
          }

          return res.status(200).json({
            success: true,
            drive: formatRecruiterDrive(driveDoc, company)
          });
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Get Drive Detail Warning]:', err.message);
      }
    }

    // Fallback in-memory
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
    const userId = req.user?._id || req.user?.id;
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
    if (!title || !title.trim()) errors.push('Job title is required.');
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

    const resolvedJobType = job_type || jobType || 'Full-Time';
    const resolvedDriveDate = drive_date || driveDate || null;
    const resolvedLocation = location ? location.trim() : (company.location || 'Bengaluru');
    const resolvedDesc = description ? description.trim() : `Exciting career opportunity with ${company.name}.`;

    let createdDrive = null;

    // 1. Persist to MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const mongoComp = await getOrCreateMongoCompany(userId, email);
        if (mongoComp) {
          const doc = await Drive.create({
            company: mongoComp._id,
            title: title.trim(),
            jobType: resolvedJobType,
            ctc: parsedCtc,
            location: resolvedLocation,
            minCgpa: parsedMinCgpa,
            maxBacklogs: parsedMaxBacklogs,
            openings: parsedOpenings,
            deadline: new Date(deadline),
            driveDate: resolvedDriveDate ? new Date(resolvedDriveDate) : null,
            branches: branchList,
            skills: skillList,
            status: 'active',
            description: resolvedDesc
          });
          if (doc) {
            const populated = await Drive.findById(doc._id).populate('company').lean();
            createdDrive = formatRecruiterDrive(populated, mongoComp);
          }
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Create Drive Warning]:', err.message);
      }
    }

    // 2. Also synchronize in-memory fallback
    const newDrive = createdDrive || {
      id: Date.now(),
      _id: String(Date.now()),
      company_id: company.id || 1,
      companyId: company.id || 1,
      company_email: email,
      companyEmail: email,
      company_name: company.name,
      companyName: company.name,
      title: title.trim(),
      job_type: resolvedJobType,
      jobType: resolvedJobType,
      ctc: parsedCtc,
      location: resolvedLocation,
      min_cgpa: parsedMinCgpa,
      minCgpa: parsedMinCgpa,
      max_backlogs: parsedMaxBacklogs,
      maxBacklogs: parsedMaxBacklogs,
      openings: parsedOpenings,
      deadline: deadline,
      drive_date: resolvedDriveDate,
      driveDate: resolvedDriveDate,
      branches: branchList,
      skills: skillList,
      applicant_count: 0,
      applicantCount: 0,
      status: 'active',
      description: resolvedDesc,
      created_at: new Date().toISOString()
    };

    recruiterStore.drives.unshift(newDrive);

    // Keep student fallback store aligned
    studentStore.drives.unshift({
      id: String(newDrive.id || newDrive._id),
      _id: String(newDrive._id || newDrive.id),
      title: newDrive.title,
      company_name: newDrive.company_name || newDrive.companyName,
      logo: null,
      location: newDrive.location,
      ctc: newDrive.ctc,
      job_type: newDrive.job_type,
      min_cgpa: newDrive.min_cgpa,
      max_backlogs: newDrive.max_backlogs,
      branches: newDrive.branches,
      skills: newDrive.skills,
      openings: newDrive.openings,
      deadline: newDrive.deadline,
      drive_date: newDrive.drive_date,
      description: newDrive.description,
      company_desc: ''
    });

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
    const userId = req.user?._id || req.user?.id;
    const driveId = req.params.id;

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

    let updatedDoc = null;

    // 1. If MongoDB is connected
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(driveId)) {
      try {
        const mongoComp = await getOrCreateMongoCompany(userId, email);
        const existing = await Drive.findById(driveId).populate('company');
        if (!existing) {
          return res.status(404).json({
            success: false,
            message: `Placement drive with ID '${driveId}' not found.`
          });
        }

        // Ownership check
        const docCompanyId = existing.company?._id ? existing.company._id.toString() : existing.company?.toString();
        const docCompanyEmail = existing.company?.email;
        const userCompId = mongoComp?._id?.toString();
        if (docCompanyId !== userCompId && docCompanyEmail !== email) {
          return res.status(403).json({
            success: false,
            message: 'Access Denied: You do not own or have permission to update this placement drive.'
          });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title.trim();
        if (job_type !== undefined || jobType !== undefined) updateData.jobType = job_type || jobType;
        if (ctc !== undefined) updateData.ctc = parseFloat(ctc);
        if (location !== undefined) updateData.location = location.trim();
        if (openings !== undefined) updateData.openings = parseInt(openings, 10);
        if (deadline !== undefined) updateData.deadline = new Date(deadline);
        if (drive_date !== undefined || driveDate !== undefined) {
          const dd = drive_date || driveDate;
          updateData.driveDate = dd ? new Date(dd) : null;
        }
        if (description !== undefined) updateData.description = description.trim();
        if (min_cgpa !== undefined || minCgpa !== undefined) updateData.minCgpa = parseFloat(min_cgpa ?? minCgpa);
        if (max_backlogs !== undefined || maxBacklogs !== undefined) updateData.maxBacklogs = parseInt(max_backlogs ?? maxBacklogs, 10);
        if (branches !== undefined) updateData.branches = Array.isArray(branches) ? branches : branches.split(',').map(b => b.trim()).filter(Boolean);
        if (skills !== undefined) updateData.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean);
        if (status !== undefined) updateData.status = status;

        const saved = await Drive.findByIdAndUpdate(driveId, { $set: updateData }, { new: true }).populate('company').lean();
        if (saved) {
          updatedDoc = formatRecruiterDrive(saved, mongoComp);
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Update Drive Warning]:', err.message);
      }
    }

    // 2. Also update in-memory fallback
    const index = recruiterStore.drives.findIndex(
      d => String(d.id) === String(driveId) || String(d._id) === String(driveId)
    );

    if (index !== -1) {
      const currentDrive = recruiterStore.drives[index];
      const company = getCompanyByEmail(email);

      // In-memory ownership check
      if (currentDrive.company_email !== email && currentDrive.company_id !== company.id) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: You do not own or have permission to update this placement drive.'
        });
      }

      const updatedDrive = {
        ...currentDrive,
        title: title ? title.trim() : currentDrive.title,
        job_type: job_type || jobType || currentDrive.job_type,
        jobType: job_type || jobType || currentDrive.job_type,
        ctc: ctc !== undefined ? parseFloat(ctc) : currentDrive.ctc,
        location: location !== undefined ? location.trim() : currentDrive.location,
        openings: openings !== undefined ? parseInt(openings, 10) : currentDrive.openings,
        deadline: deadline || currentDrive.deadline,
        drive_date: drive_date !== undefined ? drive_date : (driveDate !== undefined ? driveDate : currentDrive.drive_date),
        driveDate: drive_date !== undefined ? drive_date : (driveDate !== undefined ? driveDate : currentDrive.drive_date),
        description: description !== undefined ? description.trim() : currentDrive.description,
        min_cgpa: min_cgpa !== undefined ? parseFloat(min_cgpa) : (minCgpa !== undefined ? parseFloat(minCgpa) : currentDrive.min_cgpa),
        minCgpa: min_cgpa !== undefined ? parseFloat(min_cgpa) : (minCgpa !== undefined ? parseFloat(minCgpa) : currentDrive.min_cgpa),
        max_backlogs: max_backlogs !== undefined ? parseInt(max_backlogs, 10) : (maxBacklogs !== undefined ? parseInt(maxBacklogs, 10) : currentDrive.max_backlogs),
        maxBacklogs: max_backlogs !== undefined ? parseInt(max_backlogs, 10) : (maxBacklogs !== undefined ? parseInt(maxBacklogs, 10) : currentDrive.max_backlogs),
        branches: Array.isArray(branches) ? branches : currentDrive.branches,
        skills: Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : currentDrive.skills),
        status: status || currentDrive.status
      };

      recruiterStore.drives[index] = updatedDrive;
      if (!updatedDoc) updatedDoc = updatedDrive;
    } else if (!updatedDoc) {
      return res.status(404).json({
        success: false,
        message: `Placement drive with ID '${driveId}' not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Placement drive updated successfully.',
      drive: updatedDoc
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
    const userId = req.user?._id || req.user?.id;
    const driveId = req.params.id;

    let closedDoc = null;

    // 1. If MongoDB is connected
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(driveId)) {
      try {
        const mongoComp = await getOrCreateMongoCompany(userId, email);
        const existing = await Drive.findById(driveId).populate('company');
        if (!existing) {
          return res.status(404).json({
            success: false,
            message: `Placement drive with ID '${driveId}' not found.`
          });
        }

        // Ownership check
        const docCompanyId = existing.company?._id ? existing.company._id.toString() : existing.company?.toString();
        const docCompanyEmail = existing.company?.email;
        const userCompId = mongoComp?._id?.toString();
        if (docCompanyId !== userCompId && docCompanyEmail !== email) {
          return res.status(403).json({
            success: false,
            message: 'Access Denied: You do not own or have permission to close this placement drive.'
          });
        }

        const saved = await Drive.findByIdAndUpdate(driveId, { $set: { status: 'closed' } }, { new: true }).populate('company').lean();
        if (saved) {
          closedDoc = formatRecruiterDrive(saved, mongoComp);
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Close Drive Warning]:', err.message);
      }
    }

    // 2. Also update in-memory fallback
    const index = recruiterStore.drives.findIndex(
      d => String(d.id) === String(driveId) || String(d._id) === String(driveId)
    );

    if (index !== -1) {
      const currentDrive = recruiterStore.drives[index];
      const company = getCompanyByEmail(email);

      if (currentDrive.company_email !== email && currentDrive.company_id !== company.id) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: You do not own or have permission to close this placement drive.'
        });
      }

      currentDrive.status = 'closed';
      recruiterStore.drives[index] = currentDrive;
      if (!closedDoc) closedDoc = currentDrive;
    } else if (!closedDoc) {
      return res.status(404).json({
        success: false,
        message: `Placement drive with ID '${driveId}' not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Placement drive closed.',
      drive: closedDoc
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
    const userId = req.user?._id || req.user?.id;
    let company = getCompanyByEmail(email);

    if (mongoose.connection.readyState === 1) {
      await seedDemoApplicationsIfEmpty();
      const mongoComp = await getOrCreateMongoCompany(userId, email);
      if (mongoComp) company = mongoComp;
    }

    let apps = [];
    let userDrives = [];

    // 1. If MongoDB is connected, query Application collection
    if (mongoose.connection.readyState === 1 && company._id) {
      try {
        const mongoDrives = await Drive.find({ company: company._id }).lean();
        userDrives = mongoDrives.map(d => ({
          id: String(d._id),
          _id: String(d._id),
          title: d.title
        }));

        const driveIds = mongoDrives.map(d => d._id);
        const mongoApps = await Application.find({
          drive: { $in: driveIds },
          status: { $ne: 'Withdrawn' }
        })
          .populate('student')
          .populate('drive')
          .sort({ createdAt: -1 })
          .lean();

        if (mongoApps && mongoApps.length > 0) {
          apps = mongoApps.map(a => formatRecruiterApplicant(a, company));
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Get Applicants Warning]:', err.message);
      }
    }

    // 2. Fallback to in-memory store if needed
    if (apps.length === 0) {
      userDrives = recruiterStore.drives.filter(
        d => d.company_email === email || d.company_id === company.id
      ).map(d => ({ id: d.id, _id: d.id, title: d.title }));

      apps = recruiterStore.applications.filter(
        a => (a.company_email === email || a.company_id === company.id) && a.status !== 'Withdrawn'
      ).map(a => formatRecruiterApplicant(a, company));
    }

    const { drive_id, driveId, status, q, search } = req.query;
    const selectedDrive = drive_id || driveId;
    const statusFilter = status;
    const searchKeyword = (q || search || '').toLowerCase().trim();

    if (selectedDrive) {
      apps = apps.filter(a => String(a.drive_id) === String(selectedDrive) || String(a.driveId) === String(selectedDrive));
    }

    if (statusFilter && statusFilter.trim() && statusFilter !== 'All') {
      apps = apps.filter(a => a.status.toLowerCase() === statusFilter.toLowerCase().trim());
    }

    if (searchKeyword) {
      apps = apps.filter(a =>
        (a.student_name && a.student_name.toLowerCase().includes(searchKeyword)) ||
        (a.studentName && a.studentName.toLowerCase().includes(searchKeyword)) ||
        (a.name && a.name.toLowerCase().includes(searchKeyword)) ||
        (a.student_no && a.student_no.toLowerCase().includes(searchKeyword)) ||
        (a.studentNo && a.studentNo.toLowerCase().includes(searchKeyword)) ||
        (a.department && a.department.toLowerCase().includes(searchKeyword)) ||
        (a.drive_title && a.drive_title.toLowerCase().includes(searchKeyword)) ||
        (a.driveTitle && a.driveTitle.toLowerCase().includes(searchKeyword))
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
    const userId = req.user?._id || req.user?.id;
    let company = getCompanyByEmail(email);
    if (mongoose.connection.readyState === 1) {
      const mongoComp = await getOrCreateMongoCompany(userId, email);
      if (mongoComp) company = mongoComp;
    }
    const appId = req.params.id;

    // 1. Check MongoDB if connected
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(appId)) {
      try {
        const appDoc = await Application.findById(appId)
          .populate('student')
          .populate('drive')
          .lean();

        if (appDoc) {
          const driveCompId = appDoc.drive?.company ? String(appDoc.drive.company) : '';
          const myCompId = company._id ? String(company._id) : String(company.id);
          if (driveCompId && myCompId && driveCompId !== myCompId) {
            return res.status(403).json({
              success: false,
              message: 'Access Denied: You do not have permission to view this applicant.'
            });
          }

          return res.status(200).json({
            success: true,
            applicant: formatRecruiterApplicant(appDoc, company)
          });
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Get Applicant Detail Warning]:', err.message);
      }
    }

    // 2. Fallback to in-memory store
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
      applicant: formatRecruiterApplicant(applicant, company)
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
    const userId = req.user?._id || req.user?.id;
    let company = getCompanyByEmail(email);
    if (mongoose.connection.readyState === 1) {
      const mongoComp = await getOrCreateMongoCompany(userId, email);
      if (mongoComp) company = mongoComp;
    }

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

    let updatedMongoApp = null;

    // 1. Update in MongoDB if connected
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(appId)) {
      try {
        const appDoc = await Application.findById(appId).populate('drive').populate('student');
        if (appDoc) {
          const driveCompId = appDoc.drive?.company ? String(appDoc.drive.company) : '';
          const myCompId = company._id ? String(company._id) : String(company.id);
          if (driveCompId && myCompId && driveCompId !== myCompId) {
            return res.status(403).json({
              success: false,
              message: 'Access Denied: You do not have permission to update this applicant.'
            });
          }

          appDoc.status = newStatus;
          await appDoc.save();
          updatedMongoApp = appDoc.toObject();
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Update Status]:', err.message);
      }
    }

    // 2. Also keep fallback store updated
    const index = recruiterStore.applications.findIndex(
      a => String(a.id) === String(appId) || String(a._id) === String(appId)
    );

    let applicant = null;
    if (index !== -1) {
      applicant = recruiterStore.applications[index];
      if (!updatedMongoApp && applicant.company_email !== email && applicant.company_id !== company.id) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: You do not have permission to update this applicant.'
        });
      }
      applicant.status = newStatus;
      applicant.updated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
      recruiterStore.applications[index] = applicant;
    } else if (updatedMongoApp) {
      applicant = formatRecruiterApplicant(updatedMongoApp, company);
    } else {
      return res.status(404).json({
        success: false,
        message: `Applicant with ID '${appId}' not found.`
      });
    }

    // 3. Synchronize with Student Portal store & notifications for live reflection
    if (studentStore) {
      if (studentStore.applications && Array.isArray(studentStore.applications)) {
        const studentApp = studentStore.applications.find(
          sa => String(sa.id) === String(appId) || String(sa.drive_id) === String(applicant.drive_id) || sa.drive_title === applicant.drive_title
        );
        if (studentApp) {
          studentApp.status = newStatus;
        }
      }

      if (studentStore.notifications && Array.isArray(studentStore.notifications)) {
        studentStore.notifications.unshift({
          id: `notif-${Date.now()}`,
          message: `Your application for '${applicant.drive_title || applicant.driveTitle || 'Campus Drive'}' at ${company.name} is now: ${newStatus}.`,
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
          is_read: false
        });
      }

      // Persist notification to MongoDB if connected
      if (mongoose.connection.readyState === 1) {
        try {
          const studentRef = updatedMongoApp?.student?._id || updatedMongoApp?.student || applicant.student_id;
          await Notification.create({
            student: mongoose.Types.ObjectId.isValid(studentRef) ? studentRef : null,
            recipientRole: 'student',
            title: 'Application Status Update',
            message: `Your application for '${applicant.drive_title || applicant.driveTitle || 'Campus Drive'}' at ${company.name} is now: ${newStatus}.`,
            link: '/student/applications',
            isRead: false
          });
        } catch (notifErr) {
          console.warn('[Recruiter Status Update Notif Warning]:', notifErr.message);
        }
      }
    }

    const formatted = formatRecruiterApplicant(updatedMongoApp || applicant, company);
    return res.status(200).json({
      success: true,
      message: `${formatted.student_name || formatted.name}'s status updated to ${newStatus}.`,
      applicant: formatted
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
    const userId = req.user?._id || req.user?.id;
    let company = getCompanyByEmail(email);

    let items = [];
    let userDrives = [];

    // 1. If MongoDB is connected, query Interview collection
    if (mongoose.connection.readyState === 1) {
      try {
        await seedDemoInterviewsIfEmpty();
        const mongoComp = await getOrCreateMongoCompany(userId, email);
        if (mongoComp) company = mongoComp;

        const mongoDrives = await Drive.find({ company: company._id }).lean();
        userDrives = mongoDrives.map(d => ({
          id: String(d._id),
          _id: String(d._id),
          title: d.title
        }));

        const driveIds = mongoDrives.map(d => d._id);
        const appDocs = await Application.find({ drive: { $in: driveIds } }).select('_id').lean();
        const appIds = appDocs.map(a => a._id);

        const mongoInterviews = await Interview.find({
          $or: [
            { company: company._id },
            { drive: { $in: driveIds } },
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
          .populate('student')
          .populate('drive')
          .populate('company')
          .sort({ scheduledDate: -1, createdAt: -1 })
          .lean();

        if (mongoInterviews && mongoInterviews.length > 0) {
          items = mongoInterviews.map(i => formatRecruiterInterview(i, company));
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Get Interviews Warning]:', err.message);
      }
    }

    // 2. Fallback to in-memory store if needed
    if (items.length === 0) {
      userDrives = recruiterStore.drives.filter(
        d => d.company_email === email || d.company_id === company.id
      ).map(d => ({ id: d.id, _id: d.id, title: d.title }));

      items = (recruiterStore.interviews || []).filter(
        i => i.company_email === email || i.company_id === company.id
      ).map(i => formatRecruiterInterview(i, company));
    }

    const { drive_id, driveId, status, q, search } = req.query;
    const selectedDrive = drive_id || driveId;
    const statusFilter = status;
    const searchKeyword = (q || search || '').toLowerCase().trim();

    if (selectedDrive) {
      items = items.filter(i => String(i.drive_id) === String(selectedDrive) || String(i.driveId) === String(selectedDrive));
    }

    if (statusFilter && statusFilter.trim() && statusFilter !== 'All') {
      items = items.filter(i => i.status.toLowerCase() === statusFilter.toLowerCase().trim());
    }

    if (searchKeyword) {
      items = items.filter(i =>
        (i.student_name && i.student_name.toLowerCase().includes(searchKeyword)) ||
        (i.studentName && i.studentName.toLowerCase().includes(searchKeyword)) ||
        (i.student_no && i.student_no.toLowerCase().includes(searchKeyword)) ||
        (i.studentNo && i.studentNo.toLowerCase().includes(searchKeyword)) ||
        (i.drive_title && i.drive_title.toLowerCase().includes(searchKeyword)) ||
        (i.driveTitle && i.driveTitle.toLowerCase().includes(searchKeyword)) ||
        (i.round_name && i.round_name.toLowerCase().includes(searchKeyword)) ||
        (i.roundName && i.roundName.toLowerCase().includes(searchKeyword)) ||
        (i.venue && i.venue.toLowerCase().includes(searchKeyword))
      );
    }

    // Sort by scheduled_date descending
    items.sort((a, b) => new Date(b.scheduled_date || b.scheduledDate || 0) - new Date(a.scheduled_date || a.scheduledDate || 0));

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
    const userId = req.user?._id || req.user?.id;
    let company = getCompanyByEmail(email);
    if (mongoose.connection.readyState === 1) {
      const mongoComp = await getOrCreateMongoCompany(userId, email);
      if (mongoComp) company = mongoComp;
    }
    const intId = req.params.id;

    // 1. Check MongoDB if connected
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(intId)) {
      try {
        const intDoc = await Interview.findById(intId)
          .populate({
            path: 'application',
            populate: [
              { path: 'student' },
              { path: 'drive', populate: { path: 'company' } }
            ]
          })
          .populate('student')
          .populate('drive')
          .populate('company')
          .lean();

        if (intDoc) {
          const docCompId = intDoc.company?._id ? String(intDoc.company._id) : (intDoc.company ? String(intDoc.company) : '');
          const driveCompId = intDoc.drive?.company?._id ? String(intDoc.drive.company._id) : (intDoc.drive?.company ? String(intDoc.drive.company) : '');
          const appCompId = intDoc.application?.drive?.company?._id ? String(intDoc.application.drive.company._id) : '';
          const myCompId = company._id ? String(company._id) : String(company.id);

          const isOwner = (docCompId && docCompId === myCompId) ||
                          (driveCompId && driveCompId === myCompId) ||
                          (appCompId && appCompId === myCompId) ||
                          (intDoc.company_email === email);

          if (!isOwner) {
            return res.status(403).json({
              success: false,
              message: 'Access Denied: You do not have permission to view this interview.'
            });
          }

          return res.status(200).json({
            success: true,
            interview: formatRecruiterInterview(intDoc, company)
          });
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Get Interview Detail Warning]:', err.message);
      }
    }

    // 2. Fallback to in-memory store
    const interview = (recruiterStore.interviews || []).find(
      i => String(i.id) === String(intId) || String(i._id) === String(intId)
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: `Interview with ID '${intId}' not found.`
      });
    }

    // Ownership check
    if (interview.company_email !== email && interview.company_id !== company.id) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not have permission to view this interview.'
      });
    }

    return res.status(200).json({
      success: true,
      interview: formatRecruiterInterview(interview, company)
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
    const userId = req.user?._id || req.user?.id;
    let company = getCompanyByEmail(email);
    if (mongoose.connection.readyState === 1) {
      const mongoComp = await getOrCreateMongoCompany(userId, email);
      if (mongoComp) company = mongoComp;
    }

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

    let createdMongoInt = null;
    let application = null;

    // 1. If MongoDB is connected, find application and persist interview
    if (mongoose.connection.readyState === 1) {
      try {
        let appDoc = null;
        if (mongoose.Types.ObjectId.isValid(appId)) {
          appDoc = await Application.findById(appId)
            .populate('student')
            .populate({ path: 'drive', populate: { path: 'company' } });
        }

        if (!appDoc) {
          // If appId is numeric / demo string (e.g. "1" or "101"), find matching demo application
          const inMemApp = (recruiterStore.applications || []).find(
            a => String(a.id) === String(appId) || String(a._id) === String(appId)
          );
          if (inMemApp) {
            const studentDoc = await Student.findOne({ studentNo: inMemApp.student_no || inMemApp.studentNo || 'CS2023001' });
            const driveDoc = await Drive.findOne({ title: inMemApp.drive_title || inMemApp.driveTitle || 'Software Engineer - New Grad' });
            if (studentDoc && driveDoc) {
              appDoc = await Application.findOne({ student: studentDoc._id, drive: driveDoc._id })
                .populate('student')
                .populate({ path: 'drive', populate: { path: 'company' } });
              if (!appDoc) {
                appDoc = await Application.create({
                  student: studentDoc._id,
                  drive: driveDoc._id,
                  status: 'Interview Scheduled'
                });
                appDoc = await Application.findById(appDoc._id)
                  .populate('student')
                  .populate({ path: 'drive', populate: { path: 'company' } });
              }
            }
          }
        }

        if (appDoc) {
          // Ownership check
          const driveCompId = appDoc.drive?.company?._id ? String(appDoc.drive.company._id) : (appDoc.drive?.company ? String(appDoc.drive.company) : '');
          const myCompId = company._id ? String(company._id) : String(company.id);
          if (driveCompId && myCompId && driveCompId !== myCompId) {
            return res.status(403).json({
              success: false,
              message: 'Access Denied: You do not have permission to schedule interviews for this application.'
            });
          }

          // Update application status
          appDoc.status = 'Interview Scheduled';
          await appDoc.save();

          // Create Interview in MongoDB
          const scheduledDateObj = new Date(date);
          const newDoc = await Interview.create({
            application: appDoc._id,
            student: appDoc.student?._id || appDoc.student,
            drive: appDoc.drive?._id || appDoc.drive,
            company: appDoc.drive?.company?._id || appDoc.drive?.company || company._id,
            roundName: round.trim(),
            scheduledDate: isNaN(scheduledDateObj.getTime()) ? new Date() : scheduledDateObj,
            scheduledTime: time.trim(),
            interviewType: format,
            venue: loc,
            status: 'Scheduled'
          });

          const populatedDoc = await Interview.findById(newDoc._id)
            .populate({
              path: 'application',
              populate: [
                { path: 'student' },
                { path: 'drive', populate: { path: 'company' } }
              ]
            })
            .populate('student')
            .populate('drive')
            .populate('company')
            .lean();

          if (populatedDoc) {
            createdMongoInt = formatRecruiterInterview(populatedDoc, company);
          }
          application = formatRecruiterApplicant(appDoc, company);
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Schedule Interview Warning]:', err.message);
      }
    }

    // 2. Also keep in-memory fallback store updated
    if (!application) {
      application = (recruiterStore.applications || []).find(
        a => String(a.id) === String(appId) || String(a._id) === String(appId)
      );
    }

    if (!application && !createdMongoInt) {
      return res.status(404).json({
        success: false,
        message: `Application with ID '${appId}' not found.`
      });
    }

    if (application && application.company_email !== email && application.company_id !== company.id && !createdMongoInt) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not have permission to schedule interviews for this application.'
      });
    }

    const candName = application?.student_name || application?.studentName || application?.name || createdMongoInt?.student_name || 'Candidate';
    const candNo = application?.student_no || application?.studentNo || createdMongoInt?.student_no || 'STU';
    const driveTitle = application?.drive_title || application?.driveTitle || createdMongoInt?.drive_title || 'Placement Drive';
    const driveId = application?.drive_id || application?.driveId || createdMongoInt?.drive_id || 1;

    const newInterview = createdMongoInt || {
      id: Date.now(),
      _id: Date.now(),
      application_id: appId,
      applicationId: appId,
      drive_id: driveId,
      driveId: driveId,
      drive_title: driveTitle,
      driveTitle: driveTitle,
      company_id: company.id,
      companyId: company.id,
      company_email: email,
      companyEmail: email,
      company_name: company.name,
      companyName: company.name,
      student_id: application?.student_id || application?.studentId || 1,
      studentId: application?.student_id || application?.studentId || 1,
      student_name: candName,
      studentName: candName,
      student_no: candNo,
      studentNo: candNo,
      round_name: round.trim(),
      roundName: round.trim(),
      scheduled_date: date,
      scheduledDate: date,
      scheduled_time: time.trim(),
      scheduledTime: time.trim(),
      interview_type: format,
      interviewType: format,
      venue: loc,
      status: 'Scheduled',
      created_at: new Date().toISOString()
    };

    if (!recruiterStore.interviews) {
      recruiterStore.interviews = [];
    }
    recruiterStore.interviews.unshift(newInterview);

    if (application) {
      application.status = 'Interview Scheduled';
      application.updated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }

    // Synchronize with Student Portal store
    if (studentStore) {
      // 1. Sync student application status
      if (studentStore.applications && Array.isArray(studentStore.applications)) {
        const studentApp = studentStore.applications.find(
          sa => sa.drive_id === 'drv-1' || String(sa.drive_id) === String(driveId) || sa.drive_title === driveTitle
        );
        if (studentApp) {
          studentApp.status = 'Interview Scheduled';
          studentApp.interview_date = date;
        }
      }

      // 2. Add to student interviews calendar
      if (studentStore.interviews && Array.isArray(studentStore.interviews)) {
        const studentInt = {
          id: newInterview.id ? `int-${newInterview.id}` : `int-${Date.now()}`,
          _id: newInterview._id || newInterview.id,
          application_id: newInterview.application_id,
          applicationId: newInterview.applicationId,
          company_name: company.name,
          companyName: company.name,
          drive_title: driveTitle,
          driveTitle: driveTitle,
          round_name: newInterview.round_name,
          roundName: newInterview.roundName,
          scheduled_date: newInterview.scheduled_date,
          scheduledDate: newInterview.scheduledDate,
          scheduled_time: newInterview.scheduled_time,
          scheduledTime: newInterview.scheduledTime,
          interview_type: newInterview.interview_type,
          interviewType: newInterview.interviewType,
          venue: newInterview.venue,
          status: 'Scheduled'
        };
        const existingIdx = studentStore.interviews.findIndex(
          si => (si.drive_title === driveTitle || si.driveTitle === driveTitle) &&
                (si.round_name === newInterview.round_name || si.roundName === newInterview.roundName)
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
          message: `Interview Scheduled: ${newInterview.round_name || newInterview.roundName} for '${driveTitle}' with ${company.name} on ${newInterview.scheduled_date} at ${newInterview.scheduled_time}.`,
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
          is_read: false
        });
      }

      // Persist notifications to MongoDB if connected
      if (mongoose.connection.readyState === 1) {
        try {
          const studentRef = application?.student_id || application?.studentId || createdMongoInt?.student_id;
          await Notification.create({
            student: mongoose.Types.ObjectId.isValid(studentRef) ? studentRef : null,
            recipientRole: 'student',
            title: 'Interview Scheduled',
            message: `Interview Scheduled: ${newInterview.round_name || newInterview.roundName} for '${driveTitle}' with ${company.name} on ${newInterview.scheduled_date} at ${newInterview.scheduled_time}.`,
            link: '/student/interviews',
            isRead: false
          });

          await Notification.create({
            company: company._id || (mongoose.Types.ObjectId.isValid(company.id) ? company.id : null),
            recipientRole: 'recruiter',
            title: 'Interview Scheduled',
            message: `Interview scheduled for ${candName} on ${newInterview.scheduled_date} at ${newInterview.scheduled_time}.`,
            link: '/recruiter/interviews',
            isRead: false
          });
        } catch (notifErr) {
          console.warn('[Recruiter Schedule Interview Notif Warning]:', notifErr.message);
        }
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
    const userId = req.user?._id || req.user?.id;
    let company = getCompanyByEmail(email);
    if (mongoose.connection.readyState === 1) {
      const mongoComp = await getOrCreateMongoCompany(userId, email);
      if (mongoComp) company = mongoComp;
    }
    const intId = req.params.id;

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

    let updatedMongoInt = null;

    // 1. Update in MongoDB if connected
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(intId)) {
      try {
        const intDoc = await Interview.findById(intId)
          .populate({
            path: 'application',
            populate: [
              { path: 'student' },
              { path: 'drive', populate: { path: 'company' } }
            ]
          })
          .populate('student')
          .populate('drive')
          .populate('company');

        if (intDoc) {
          // Ownership check
          const docCompId = intDoc.company?._id ? String(intDoc.company._id) : (intDoc.company ? String(intDoc.company) : '');
          const driveCompId = intDoc.drive?.company?._id ? String(intDoc.drive.company._id) : (intDoc.drive?.company ? String(intDoc.drive.company) : '');
          const appCompId = intDoc.application?.drive?.company?._id ? String(intDoc.application.drive.company._id) : '';
          const myCompId = company._id ? String(company._id) : String(company.id);

          const isOwner = (docCompId && docCompId === myCompId) ||
                          (driveCompId && driveCompId === myCompId) ||
                          (appCompId && appCompId === myCompId) ||
                          (intDoc.company_email === email);

          if (!isOwner) {
            return res.status(403).json({
              success: false,
              message: 'Access Denied: You do not have permission to update this interview.'
            });
          }

          if (round_name !== undefined || roundName !== undefined) {
            intDoc.roundName = (round_name !== undefined ? round_name : roundName).trim();
          }
          if (scheduled_date || scheduledDate) {
            const parsed = new Date(scheduled_date || scheduledDate);
            if (!isNaN(parsed.getTime())) intDoc.scheduledDate = parsed;
          }
          if (scheduled_time !== undefined || scheduledTime !== undefined) {
            intDoc.scheduledTime = (scheduled_time !== undefined ? scheduled_time : scheduledTime).trim();
          }
          if (interview_type || interviewType) {
            intDoc.interviewType = interview_type || interviewType;
          }
          if (venue !== undefined) {
            intDoc.venue = venue.trim();
          }
          if (status) {
            intDoc.status = status;
          }

          await intDoc.save();

          const refreshed = await Interview.findById(intDoc._id)
            .populate({
              path: 'application',
              populate: [
                { path: 'student' },
                { path: 'drive', populate: { path: 'company' } }
              ]
            })
            .populate('student')
            .populate('drive')
            .populate('company')
            .lean();

          if (refreshed) {
            updatedMongoInt = formatRecruiterInterview(refreshed, company);
          }
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Update Interview Warning]:', err.message);
      }
    }

    // 2. Also update in-memory fallback
    const index = (recruiterStore.interviews || []).findIndex(
      i => String(i.id) === String(intId) || String(i._id) === String(intId)
    );

    let current = null;
    if (index !== -1) {
      current = recruiterStore.interviews[index];
      if (!updatedMongoInt && current.company_email !== email && current.company_id !== company.id) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: You do not have permission to update this interview.'
        });
      }

      current = {
        ...current,
        round_name: round_name !== undefined ? round_name.trim() : (roundName !== undefined ? roundName.trim() : current.round_name),
        scheduled_date: scheduled_date || scheduledDate || current.scheduled_date,
        scheduled_time: scheduled_time !== undefined ? scheduled_time.trim() : (scheduledTime !== undefined ? scheduledTime.trim() : current.scheduled_time),
        interview_type: interview_type || interviewType || current.interview_type,
        venue: venue !== undefined ? venue.trim() : current.venue,
        status: status || current.status,
        updated_at: new Date().toISOString()
      };
      recruiterStore.interviews[index] = current;
    } else if (updatedMongoInt) {
      current = updatedMongoInt;
    } else {
      return res.status(404).json({
        success: false,
        message: `Interview with ID '${intId}' not found.`
      });
    }

    const updated = updatedMongoInt || formatRecruiterInterview(current, company);

    // Sync with Student Portal store
    if (studentStore && studentStore.interviews) {
      const stuInt = studentStore.interviews.find(
        si => (String(si.id) === String(intId) || String(si._id) === String(intId)) ||
              (si.drive_title === updated.drive_title && (si.round_name === updated.round_name || si.roundName === updated.round_name))
      );
      if (stuInt) {
        stuInt.round_name = updated.round_name;
        stuInt.roundName = updated.roundName;
        stuInt.scheduled_date = updated.scheduled_date;
        stuInt.scheduledDate = updated.scheduledDate;
        stuInt.scheduled_time = updated.scheduled_time;
        stuInt.scheduledTime = updated.scheduledTime;
        stuInt.interview_type = updated.interview_type;
        stuInt.interviewType = updated.interviewType;
        stuInt.venue = updated.venue;
        stuInt.status = updated.status;
      }

      if (status === 'Cancelled') {
        studentStore.notifications.unshift({
          id: `notif-${Date.now()}`,
          message: `Interview Update: Your interview for '${updated.drive_title || updated.driveTitle}' with ${company.name} has been cancelled.`,
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
          is_read: false
        });

        if (mongoose.connection.readyState === 1) {
          try {
            const studentRef = updated.student_id || updated.studentId;
            await Notification.create({
              student: mongoose.Types.ObjectId.isValid(studentRef) ? studentRef : null,
              recipientRole: 'student',
              title: 'Interview Cancelled',
              message: `Interview Update: Your interview for '${updated.drive_title || updated.driveTitle}' with ${company.name} has been cancelled.`,
              link: '/student/interviews',
              isRead: false
            });
          } catch (e) {}
        }
      } else if (scheduled_date || scheduledDate || scheduled_time || scheduledTime) {
        studentStore.notifications.unshift({
          id: `notif-${Date.now()}`,
          message: `Interview Rescheduled: ${updated.round_name || updated.roundName} for '${updated.drive_title || updated.driveTitle}' with ${company.name} is now on ${updated.scheduled_date} at ${updated.scheduled_time}.`,
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
          is_read: false
        });

        if (mongoose.connection.readyState === 1) {
          try {
            const studentRef = updated.student_id || updated.studentId;
            await Notification.create({
              student: mongoose.Types.ObjectId.isValid(studentRef) ? studentRef : null,
              recipientRole: 'student',
              title: 'Interview Rescheduled',
              message: `Interview Rescheduled: ${updated.round_name || updated.roundName} for '${updated.drive_title || updated.driveTitle}' with ${company.name} is now on ${updated.scheduled_date} at ${updated.scheduled_time}.`,
              link: '/student/interviews',
              isRead: false
            });
          } catch (e) {}
        }
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
    const userId = req.user?._id || req.user?.id;
    let company = getCompanyByEmail(email);
    if (mongoose.connection.readyState === 1) {
      const mongoComp = await getOrCreateMongoCompany(userId, email);
      if (mongoComp) company = mongoComp;
    }
    const intId = req.params.id;

    let cancelledMongoInt = null;

    // 1. Update in MongoDB if connected
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(intId)) {
      try {
        const intDoc = await Interview.findById(intId)
          .populate({
            path: 'application',
            populate: [
              { path: 'student' },
              { path: 'drive', populate: { path: 'company' } }
            ]
          })
          .populate('student')
          .populate('drive')
          .populate('company');

        if (intDoc) {
          // Ownership check
          const docCompId = intDoc.company?._id ? String(intDoc.company._id) : (intDoc.company ? String(intDoc.company) : '');
          const driveCompId = intDoc.drive?.company?._id ? String(intDoc.drive.company._id) : (intDoc.drive?.company ? String(intDoc.drive.company) : '');
          const appCompId = intDoc.application?.drive?.company?._id ? String(intDoc.application.drive.company._id) : '';
          const myCompId = company._id ? String(company._id) : String(company.id);

          const isOwner = (docCompId && docCompId === myCompId) ||
                          (driveCompId && driveCompId === myCompId) ||
                          (appCompId && appCompId === myCompId) ||
                          (intDoc.company_email === email);

          if (!isOwner) {
            return res.status(403).json({
              success: false,
              message: 'Access Denied: You do not have permission to cancel this interview.'
            });
          }

          intDoc.status = 'Cancelled';
          await intDoc.save();

          const refreshed = await Interview.findById(intDoc._id)
            .populate({
              path: 'application',
              populate: [
                { path: 'student' },
                { path: 'drive', populate: { path: 'company' } }
              ]
            })
            .populate('student')
            .populate('drive')
            .populate('company')
            .lean();

          if (refreshed) {
            cancelledMongoInt = formatRecruiterInterview(refreshed, company);
          }
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Cancel Interview Warning]:', err.message);
      }
    }

    // 2. Fallback in-memory
    const index = (recruiterStore.interviews || []).findIndex(
      i => String(i.id) === String(intId) || String(i._id) === String(intId)
    );

    let current = null;
    if (index !== -1) {
      current = recruiterStore.interviews[index];
      if (!cancelledMongoInt && current.company_email !== email && current.company_id !== company.id) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: You do not have permission to cancel this interview.'
        });
      }
      current.status = 'Cancelled';
      current.updated_at = new Date().toISOString();
      recruiterStore.interviews[index] = current;
    } else if (cancelledMongoInt) {
      current = cancelledMongoInt;
    } else {
      return res.status(404).json({
        success: false,
        message: `Interview with ID '${intId}' not found.`
      });
    }

    const cancelled = cancelledMongoInt || formatRecruiterInterview(current, company);

    // Sync with Student Portal store
    if (studentStore && studentStore.interviews) {
      const stuInt = studentStore.interviews.find(
        si => (String(si.id) === String(intId) || String(si._id) === String(intId)) ||
              (si.drive_title === cancelled.drive_title && (si.round_name === cancelled.round_name || si.roundName === cancelled.roundName))
      );
      if (stuInt) {
        stuInt.status = 'Cancelled';
      }

      studentStore.notifications.unshift({
        id: `notif-${Date.now()}`,
        message: `Interview Cancelled: Your interview round '${cancelled.round_name || cancelled.roundName}' for '${cancelled.drive_title || cancelled.driveTitle}' with ${company.name} has been cancelled.`,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
        is_read: false
      });
    }

    if (mongoose.connection?.readyState === 1 && Notification) {
      try {
        await Notification.create({
          recipientRole: 'student',
          student: cancelled.student_id || cancelled.studentId || (cancelled.student?._id ? cancelled.student._id : undefined),
          company: company._id || company.id,
          title: 'Interview Cancelled',
          message: `Interview Cancelled: Your interview round '${cancelled.round_name || cancelled.roundName}' for '${cancelled.drive_title || cancelled.driveTitle}' with ${company.name} has been cancelled.`,
          type: 'interview',
          link: '/student/interviews',
          isRead: false
        });
      } catch (e) {
        console.warn('[Recruiter Cancel Interview Notif Warning]:', e.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Interview cancelled.',
      interview: cancelled
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

function formatRecruiterPlacementResult(doc, company) {
  if (!doc) return null;
  const app = doc.application && typeof doc.application === 'object' ? doc.application : {};
  const student = doc.student && typeof doc.student === 'object'
    ? doc.student
    : (app.student && typeof app.student === 'object' ? app.student : {});
  const drive = doc.drive && typeof doc.drive === 'object'
    ? doc.drive
    : (app.drive && typeof app.drive === 'object' ? app.drive : {});
  const comp = doc.company && typeof doc.company === 'object'
    ? doc.company
    : (drive.company && typeof drive.company === 'object' ? drive.company : (company || {}));

  const candName = student.name || 'Priya Sharma';
  const candNo = student.studentNo || student.student_no || 'CS2023001';
  const candDept = student.department || 'Computer Science';
  const driveTitle = drive.title || 'Software Engineer - New Grad';
  const compName = comp.name || company?.name || 'TechNova Solutions';
  const compEmail = comp.email || company?.email || 'hr@technova.com';

  const idStr = doc._id ? doc._id.toString() : String(doc.id || '');
  const appIdStr = app._id ? app._id.toString() : (doc.application ? doc.application.toString() : String(doc.application_id || ''));
  const driveIdStr = drive._id ? drive._id.toString() : (drive.id ? String(drive.id) : String(doc.drive_id || ''));
  const compIdStr = comp._id ? comp._id.toString() : (comp.id ? String(comp.id) : String(doc.company_id || '1'));
  const stuIdStr = student._id ? student._id.toString() : (student.id ? String(student.id) : String(doc.student_id || '1'));

  let dateStr = '';
  if (doc.placementDate instanceof Date) {
    dateStr = doc.placementDate.toISOString().split('T')[0];
  } else if (doc.placement_date) {
    dateStr = String(doc.placement_date).split('T')[0];
  } else if (doc.createdAt instanceof Date) {
    dateStr = doc.createdAt.toISOString().split('T')[0];
  }

  const pkgVal = doc.package !== undefined ? Number(doc.package) : 12.0;
  const statusStr = doc.status || 'Selected';

  const createdAtStr = doc.createdAt instanceof Date
    ? doc.createdAt.toISOString().slice(0, 19).replace('T', ' ')
    : (doc.created_at || new Date().toISOString().slice(0, 19).replace('T', ' '));
  const updatedAtStr = doc.updatedAt instanceof Date
    ? doc.updatedAt.toISOString().slice(0, 19).replace('T', ' ')
    : (doc.updated_at || createdAtStr);

  return {
    id: idStr,
    _id: idStr,
    application_id: appIdStr,
    applicationId: appIdStr,
    company_id: compIdStr,
    companyId: compIdStr,
    company_email: compEmail,
    companyEmail: compEmail,
    company_name: compName,
    companyName: compName,
    drive_id: driveIdStr,
    driveId: driveIdStr,
    drive_title: driveTitle,
    driveTitle: driveTitle,
    student_id: stuIdStr,
    studentId: stuIdStr,
    student_name: candName,
    studentName: candName,
    student_no: candNo,
    studentNo: candNo,
    department: candDept,
    package: pkgVal,
    placement_date: dateStr,
    placementDate: dateStr,
    status: statusStr,
    created_at: createdAtStr,
    createdAt: doc.createdAt || createdAtStr,
    updated_at: updatedAtStr,
    updatedAt: doc.updatedAt || updatedAtStr
  };
}

async function seedDemoResultsIfEmpty() {
  if (mongoose.connection?.readyState !== 1 || !PlacementResult) return;
  try {
    const count = await PlacementResult.countDocuments();
    if (count === 0) {
      let app = await Application.findOne()
        .populate('student')
        .populate({ path: 'drive', populate: { path: 'company' } });

      if (app) {
        await PlacementResult.create({
          application: app._id,
          student: app.student?._id || app.student,
          drive: app.drive?._id || app.drive,
          company: app.drive?.company?._id || app.drive?.company,
          package: 12.0,
          placementDate: new Date('2026-09-12'),
          status: 'Selected'
        });
      }
    }
  } catch (err) {
    console.warn('[Recruiter Seed Results Warning]:', err.message);
  }
}

// GET /api/recruiters/results
exports.getResults = async (req, res) => {
  try {
    const email = req.user?.email || 'hr@technova.com';
    const company = getCompanyByEmail(email);
    const { drive_id, driveId, status, q, search } = req.query;
    const selectedDrive = drive_id || driveId;
    const statusFilter = status;
    const searchKeyword = (q || search || '').toLowerCase().trim();

    if (mongoose.connection?.readyState === 1 && PlacementResult) {
      try {
        await seedDemoResultsIfEmpty();

        const compDoc = await Company.findOne({ email }).lean();
        const myCompId = compDoc ? String(compDoc._id) : (company._id ? String(company._id) : String(company.id));

        const mongoDrives = await Drive.find({
          $or: [
            ...(compDoc ? [{ company: compDoc._id }] : []),
            ...(company._id && mongoose.Types.ObjectId.isValid(company._id) ? [{ company: company._id }] : [])
          ]
        }).lean();
        const driveIds = mongoDrives.map(d => d._id);

        const query = {
          $or: [
            ...(compDoc ? [{ company: compDoc._id }] : []),
            ...(company._id && mongoose.Types.ObjectId.isValid(company._id) ? [{ company: company._id }] : []),
            { drive: { $in: driveIds } }
          ]
        };

        const docs = await PlacementResult.find(query)
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
          let items = docs.map(d => formatRecruiterPlacementResult(d, company));

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

          const dropdownDrives = mongoDrives.length > 0
            ? mongoDrives.map(d => ({ id: d._id.toString(), title: d.title }))
            : recruiterStore.drives.filter(d => d.company_email === email || d.company_id === company.id).map(d => ({ id: d.id, title: d.title }));

          return res.status(200).json({
            success: true,
            count: items.length,
            results: items,
            drives: dropdownDrives
          });
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Get Results Warning]:', err.message);
      }
    }

    // Fallback: in-memory
    const userDrives = recruiterStore.drives.filter(
      d => d.company_email === email || d.company_id === company.id
    );
    let items = (recruiterStore.results || []).filter(
      r => r.company_email === email || r.company_id === company.id
    );

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

    if (mongoose.connection?.readyState === 1 && PlacementResult) {
      try {
        let doc = null;
        if (mongoose.Types.ObjectId.isValid(resId)) {
          doc = await PlacementResult.findById(resId)
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
            .lean();
        }

        if (doc) {
          const compDoc = await Company.findOne({ email }).lean();
          const myCompId = compDoc ? String(compDoc._id) : (company._id ? String(company._id) : String(company.id));
          const docCompId = doc.company?._id ? String(doc.company._id) : (doc.company ? String(doc.company) : '');
          const driveCompId = doc.drive?.company?._id ? String(doc.drive.company._id) : '';

          const isOwner = (docCompId && docCompId === myCompId) ||
                          (driveCompId && driveCompId === myCompId) ||
                          (doc.company?.email === email);

          if (!isOwner) {
            return res.status(403).json({
              success: false,
              message: 'Access Denied: You do not have permission to view this placement record.'
            });
          }

          return res.status(200).json({
            success: true,
            result: formatRecruiterPlacementResult(doc, company)
          });
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Get Result Detail Warning]:', err.message);
      }
    }

    // In-memory fallback
    const result = (recruiterStore.results || []).find(
      r => String(r.id) === String(resId) || String(r._id) === String(resId)
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Placement result with ID '${resId}' not found.`
      });
    }

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

    const outcomeStatus = status || 'Selected';
    const outcomeDate = placement_date || placementDate || new Date().toISOString().split('T')[0];

    let savedMongoResult = null;

    // 1. Persist to MongoDB if connected
    if (mongoose.connection?.readyState === 1 && PlacementResult) {
      try {
        let appDoc = null;
        if (mongoose.Types.ObjectId.isValid(appId)) {
          appDoc = await Application.findById(appId)
            .populate('student')
            .populate({ path: 'drive', populate: { path: 'company' } });
        }
        if (!appDoc) {
          appDoc = await Application.findOne()
            .populate('student')
            .populate({ path: 'drive', populate: { path: 'company' } });
        }

        if (appDoc) {
          const compDoc = await Company.findOne({ email }).lean();
          const myCompId = compDoc ? String(compDoc._id) : (company._id ? String(company._id) : String(company.id));
          const appCompId = appDoc.drive?.company?._id ? String(appDoc.drive.company._id) : '';

          if (appCompId && myCompId && appCompId !== myCompId && appDoc.drive?.company?.email !== email) {
            return res.status(403).json({
              success: false,
              message: 'Access Denied: You do not have permission to create placement offers for this application.'
            });
          }

          let resDoc = await PlacementResult.findOne({ application: appDoc._id });
          if (resDoc) {
            resDoc.package = parsedPackage;
            resDoc.placementDate = outcomeDate ? new Date(outcomeDate) : new Date();
            resDoc.status = outcomeStatus;
            await resDoc.save();
          } else {
            resDoc = await PlacementResult.create({
              application: appDoc._id,
              student: appDoc.student?._id || appDoc.student,
              drive: appDoc.drive?._id || appDoc.drive,
              company: appDoc.drive?.company?._id || appDoc.drive?.company || compDoc?._id,
              package: parsedPackage,
              placementDate: outcomeDate ? new Date(outcomeDate) : new Date(),
              status: outcomeStatus
            });
          }

          appDoc.status = outcomeStatus;
          await appDoc.save();

          if (Notification) {
            try {
              await Notification.create({
                recipientRole: 'student',
                student: appDoc.student?._id || appDoc.student,
                company: appDoc.drive?.company?._id || compDoc?._id,
                title: 'Placement Offer',
                message: `Placement Offer: Congratulations! You have received a formal offer for '${appDoc.drive?.title || 'Software Engineer'}' with ${company.name} at ₹${parsedPackage} LPA.`,
                type: 'offer',
                link: '/student/applications',
                isRead: false
              });
            } catch (ne) {
              console.warn('[Recruiter Mongo Result Notif Warning]:', ne.message);
            }
          }

          const populatedDoc = await PlacementResult.findById(resDoc._id)
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
            .lean();

          if (populatedDoc) {
            savedMongoResult = formatRecruiterPlacementResult(populatedDoc, company);
          }
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Create Result Warning]:', err.message);
      }
    }

    // 2. Also keep in-memory fallback updated
    const application = (recruiterStore.applications || []).find(
      a => String(a.id) === String(appId) || String(a._id) === String(appId)
    );

    let savedResult = savedMongoResult;
    const candName = application?.student_name || application?.name || savedMongoResult?.student_name || 'Candidate';
    const candNo = application?.student_no || savedMongoResult?.student_no || 'CS2023001';

    if (application) {
      if (!savedMongoResult && application.company_email !== email && application.company_id !== company.id) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: You do not have permission to create placement offers for this application.'
        });
      }

      if (!recruiterStore.results) recruiterStore.results = [];
      const existingIndex = recruiterStore.results.findIndex(
        r => String(r.application_id) === String(application.id) || String(r._id) === String(application.id)
      );

      if (existingIndex >= 0) {
        recruiterStore.results[existingIndex] = {
          ...recruiterStore.results[existingIndex],
          package: parsedPackage,
          placement_date: outcomeDate,
          status: outcomeStatus,
          updated_at: new Date().toISOString()
        };
        if (!savedResult) savedResult = recruiterStore.results[existingIndex];
      } else {
        const memResult = {
          id: savedMongoResult?.id || Date.now(),
          _id: savedMongoResult?.id || String(Date.now()),
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
        recruiterStore.results.unshift(memResult);
        if (!savedResult) savedResult = memResult;
      }

      application.status = outcomeStatus;
      application.updated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }

    if (studentStore) {
      if (studentStore.applications && Array.isArray(studentStore.applications)) {
        const studentApp = studentStore.applications.find(
          sa => sa.drive_id === 'drv-1' || String(sa.drive_id) === String(application?.drive_id) || sa.drive_title === application?.drive_title
        );
        if (studentApp) {
          studentApp.status = outcomeStatus;
          studentApp.package_lpa = parsedPackage;
        }
      }

      if (!studentStore.selectedOffers) studentStore.selectedOffers = [];
      const existingOfferIndex = studentStore.selectedOffers.findIndex(
        o => o.drive_title === (savedResult?.drive_title || 'Software Engineer - New Grad')
      );
      const offerObj = {
        id: savedResult?.id || `offer-${Date.now()}`,
        _id: savedResult?.id || `offer-${Date.now()}`,
        company_name: company.name,
        companyName: company.name,
        drive_title: savedResult?.drive_title || 'Software Engineer - New Grad',
        driveTitle: savedResult?.drive_title || 'Software Engineer - New Grad',
        package_lpa: parsedPackage,
        packageLpa: parsedPackage,
        package: parsedPackage,
        placement_date: outcomeDate,
        placementDate: outcomeDate,
        status: outcomeStatus
      };
      if (existingOfferIndex >= 0) {
        studentStore.selectedOffers[existingOfferIndex] = offerObj;
      } else {
        studentStore.selectedOffers.unshift(offerObj);
      }

      if (studentStore.notifications && Array.isArray(studentStore.notifications)) {
        studentStore.notifications.unshift({
          id: `notif-${Date.now()}`,
          message: `Placement Offer: Congratulations! You have received a formal offer for '${savedResult?.drive_title || 'Software Engineer'}' with ${company.name} at ₹${parsedPackage} LPA.`,
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
    const { package: pkg, placement_date, placementDate, status } = req.body;

    const parsedPkg = pkg !== undefined ? parseFloat(pkg) : undefined;
    if (parsedPkg !== undefined && (isNaN(parsedPkg) || parsedPkg <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Package must be a positive number.'
      });
    }

    let updatedMongoResult = null;

    if (mongoose.connection?.readyState === 1 && PlacementResult) {
      try {
        let resDoc = null;
        if (mongoose.Types.ObjectId.isValid(resId)) {
          resDoc = await PlacementResult.findById(resId)
            .populate({
              path: 'application',
              populate: [
                { path: 'student' },
                { path: 'drive', populate: { path: 'company' } }
              ]
            })
            .populate('company')
            .populate('drive');
        }

        if (resDoc) {
          const compDoc = await Company.findOne({ email }).lean();
          const myCompId = compDoc ? String(compDoc._id) : (company._id ? String(company._id) : String(company.id));
          const docCompId = resDoc.company?._id ? String(resDoc.company._id) : (resDoc.company ? String(resDoc.company) : '');
          const driveCompId = resDoc.drive?.company?._id ? String(resDoc.drive.company._id) : '';

          const isOwner = (docCompId && docCompId === myCompId) ||
                          (driveCompId && driveCompId === myCompId) ||
                          (resDoc.company?.email === email);

          if (!isOwner) {
            return res.status(403).json({
              success: false,
              message: 'Access Denied: You do not have permission to update this placement record.'
            });
          }

          if (parsedPkg !== undefined) resDoc.package = parsedPkg;
          if (placement_date || placementDate) resDoc.placementDate = new Date(placement_date || placementDate);
          if (status) resDoc.status = status;
          await resDoc.save();

          if (resDoc.application) {
            if (status) resDoc.application.status = status;
            await resDoc.application.save();
          }

          const refreshed = await PlacementResult.findById(resDoc._id)
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
            .lean();

          if (refreshed) {
            updatedMongoResult = formatRecruiterPlacementResult(refreshed, company);
          }
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Update Result Warning]:', err.message);
      }
    }

    // Fallback: in-memory
    const index = (recruiterStore.results || []).findIndex(
      r => String(r.id) === String(resId) || String(r._id) === String(resId)
    );

    let current = null;
    if (index !== -1) {
      current = recruiterStore.results[index];
      if (!updatedMongoResult && current.company_email !== email && current.company_id !== company.id) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: You do not have permission to update this placement record.'
        });
      }

      const updated = {
        ...current,
        package: parsedPkg !== undefined ? parsedPkg : current.package,
        placement_date: placement_date || placementDate || current.placement_date,
        status: status || current.status,
        updated_at: new Date().toISOString()
      };
      recruiterStore.results[index] = updated;
      current = updated;
    } else if (updatedMongoResult) {
      current = updatedMongoResult;
    } else {
      return res.status(404).json({
        success: false,
        message: `Placement result with ID '${resId}' not found.`
      });
    }

    const result = updatedMongoResult || current;

    return res.status(200).json({
      success: true,
      message: 'Placement result updated successfully.',
      result
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

    if (mongoose.connection?.readyState === 1 && Notification) {
      try {
        await seedDemoNotificationsIfEmpty();

        const isMongoId = (val) => val && (val instanceof mongoose.Types.ObjectId || (typeof val === 'string' && /^[0-9a-fA-F]{24}$/.test(val)));
        const validCompanyId = isMongoId(company?._id) ? company._id : (isMongoId(companyId) ? companyId : null);
        const validUserId = isMongoId(req.user?._id) ? req.user._id : (isMongoId(req.user?.id) ? req.user.id : null);

        const query = {
          $or: [
            { recipientRole: 'recruiter' },
            { recipientRole: 'all' },
            ...(validCompanyId ? [{ company: validCompanyId }] : []),
            ...(validUserId ? [{ user: validUserId }] : [])
          ]
        };

        const docs = await Notification.find(query).sort({ createdAt: -1 }).lean();
        if (docs && docs.length > 0) {
          const items = docs.map(d => formatRecruiterNotification(d, company));
          const unreadCount = items.filter(n => !n.is_read && !n.isRead).length;

          return res.status(200).json({
            success: true,
            total: items.length,
            unread_count: unreadCount,
            data: items
          });
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Get Notifications Warning]:', err.message);
      }
    }

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
    let foundDoc = null;

    if (mongoose.connection?.readyState === 1 && Notification) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          foundDoc = await Notification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
          ).lean();
        }
      } catch (err) {
        console.warn('[Recruiter Mongo Mark Read Warning]:', err.message);
      }
    }

    const notif = (recruiterStore.notifications || []).find(n => String(n.id) === String(id) || String(n._id) === String(id));
    if (notif) {
      notif.is_read = true;
      notif.isRead = true;
    }

    const email = req.user?.email || 'hr@technova.com';
    const company = getCompanyByEmail(email);
    const resultData = foundDoc ? formatRecruiterNotification(foundDoc, company) : notif;

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      data: resultData
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

    if (mongoose.connection?.readyState === 1 && Notification) {
      try {
        const isMongoId = (val) => val && (val instanceof mongoose.Types.ObjectId || (typeof val === 'string' && /^[0-9a-fA-F]{24}$/.test(val)));
        const validCompanyId = isMongoId(company?._id) ? company._id : (isMongoId(companyId) ? companyId : null);
        const validUserId = isMongoId(req.user?._id) ? req.user._id : (isMongoId(req.user?.id) ? req.user.id : null);

        const query = {
          $or: [
            { recipientRole: 'recruiter' },
            { recipientRole: 'all' },
            ...(validCompanyId ? [{ company: validCompanyId }] : []),
            ...(validUserId ? [{ user: validUserId }] : [])
          ]
        };
        await Notification.updateMany(query, { $set: { isRead: true } });
      } catch (err) {
        console.warn('[Recruiter Mongo Mark All Read Warning]:', err.message);
      }
    }

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



