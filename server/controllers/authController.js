const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');

const isProduction = process.env.NODE_ENV === 'production';
if (isProduction && !process.env.JWT_SECRET) {
  console.error('[Security Error] FATAL: JWT_SECRET environment variable is required in production.');
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET || 'campus_connect_jwt_secret_dev_key';

// In-memory / fallback store for seamless local development when mongod is standalone
const memoryUsers = new Map();
const memoryStudents = new Map();
const memoryCompanies = new Map();

// Initialize Demo Accounts with Bcrypt synchronously on module load
const initDemoAccounts = async () => {
  const adminHash = bcrypt.hashSync('admin123', 10);
  const studentHash = bcrypt.hashSync('student123', 10);
  const recruiterHash = bcrypt.hashSync('recruiter123', 10);


  // Demo Admin
  const adminId = '65e000000000000000000001';
  memoryUsers.set('admin@college.edu', {
    _id: adminId,
    id: adminId,
    email: 'admin@college.edu',
    passwordHash: adminHash,
    role: 'admin',
    isActive: true,
    name: 'Placement Administrator'
  });

  // Demo Student (Priya Sharma)
  const studentId = '65e000000000000000000002';
  memoryUsers.set('priya.sharma@student.edu', {
    _id: studentId,
    id: studentId,
    email: 'priya.sharma@student.edu',
    passwordHash: studentHash,
    role: 'student',
    isActive: true,
    name: 'Priya Sharma'
  });
  memoryStudents.set(studentId, {
    user: studentId,
    studentNo: 'CS2023001',
    name: 'Priya Sharma',
    department: 'Computer Science',
    gradYear: 2026,
    cgpa: 8.9,
    email: 'priya.sharma@student.edu'
  });

  // Demo Recruiter (TechNova Solutions)
  const recruiterId = '65e000000000000000000003';
  memoryUsers.set('hr@technova.com', {
    _id: recruiterId,
    id: recruiterId,
    email: 'hr@technova.com',
    passwordHash: recruiterHash,
    role: 'recruiter',
    isActive: true,
    name: 'TechNova Solutions'
  });
  memoryCompanies.set(recruiterId, {
    user: recruiterId,
    name: 'TechNova Solutions',
    industry: 'Information Technology & Software',
    website: 'https://technova.io',
    hrContact: 'Mr. Rajesh Kumar',
    email: 'hr@technova.com',
    location: 'Bengaluru, India',
    approved: true
  });

  // Demo Recruiter (ApexCloud)
  const apexId = '65e000000000000000000004';
  memoryUsers.set('talent@apexcloud.io', {
    _id: apexId,
    id: apexId,
    email: 'talent@apexcloud.io',
    passwordHash: recruiterHash,
    role: 'recruiter',
    isActive: true,
    name: 'ApexCloud Networks'
  });
  memoryCompanies.set(apexId, {
    user: apexId,
    name: 'ApexCloud Networks',
    industry: 'Cloud Infrastructure',
    website: 'https://apexcloud.io',
    hrContact: 'Ms. Sunita Reddy',
    email: 'talent@apexcloud.io',
    location: 'Hyderabad, India',
    approved: true
  });

  // If MongoDB is connected, also seed into database
  if (mongoose.connection.readyState === 1) {
    try {
      for (const [email, u] of memoryUsers.entries()) {
        const exists = await User.findOne({ email });
        if (!exists) {
          const created = await User.create({
            _id: new mongoose.Types.ObjectId(u._id),
            email: u.email,
            passwordHash: u.passwordHash,
            role: u.role,
            isActive: u.isActive
          });
          if (u.role === 'student' && memoryStudents.has(u._id)) {
            const s = memoryStudents.get(u._id);
            await Student.create({ ...s, user: created._id });
          } else if (u.role === 'recruiter' && memoryCompanies.has(u._id)) {
            const c = memoryCompanies.get(u._id);
            await Company.create({ ...c, user: created._id });
          }
        }
      }
    } catch (e) {
      console.log('[Seed] Notice:', e.message);
    }
  }
};

initDemoAccounts();

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const targetRole = role || 'student';

    let user = null;
    let profile = null;

    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: cleanEmail });
    }
    if (!user && memoryUsers.has(cleanEmail)) {
      user = memoryUsers.get(cleanEmail);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (user.role !== targetRole) {
      return res.status(400).json({
        success: false,
        message: `This account is not registered as a ${targetRole}. Please choose the correct role.`
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Contact the placement office.'
      });
    }

    // Attach student/company profile details
    const userId = (user._id || user.id).toString();
    if (user.role === 'student') {
      if (mongoose.connection.readyState === 1) {
        profile = await Student.findOne({ user: user._id });
      }
      if (!profile && memoryStudents.has(userId)) {
        profile = memoryStudents.get(userId);
      }
    } else if (user.role === 'recruiter') {
      if (mongoose.connection.readyState === 1) {
        profile = await Company.findOne({ user: user._id });
      }
      if (!profile && memoryCompanies.has(userId)) {
        profile = memoryCompanies.get(userId);
      }
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: `Welcome back, you're logged in as ${user.role}.`,
      token,
      user: {
        id: userId,
        email: user.email,
        role: user.role,
        name: profile?.name || user.name || (user.role === 'admin' ? 'Placement Admin' : user.email.split('@')[0]),
        profile: profile || null
      }
    });
  } catch (err) {
    console.error('[Login Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Authentication service encountered an unexpected error.'
    });
  }
};

// POST /api/auth/register/student
exports.registerStudent = async (req, res) => {
  try {
    const {
      name,
      student_no,
      studentNo,
      email,
      department,
      grad_year,
      gradYear,
      cgpa,
      password,
      confirm_password,
      confirmPassword
    } = req.body;

    const studentNum = (student_no || studentNo || '').trim();
    const studentName = (name || '').trim();
    const studentEmail = (email || '').trim().toLowerCase();
    const studentDept = department || 'Computer Science';
    const studentGradYear = parseInt(grad_year || gradYear || 2026, 10);
    const studentCgpa = parseFloat(cgpa || 0);
    const pass = password || '';
    const confirmPass = confirm_password || confirmPassword || '';

    // Validation matching Flask
    if (!studentEmail || !studentEmail.includes('@')) {
      return res.status(400).json({ success: false, message: 'A valid email is required.' });
    }
    if (pass.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    if (pass !== confirmPass) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }
    if (!studentName) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
    if (!studentNum) {
      return res.status(400).json({ success: false, message: 'Student ID is required.' });
    }

    // Duplicate checks
    if (memoryUsers.has(studentEmail)) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }
    for (const s of memoryStudents.values()) {
      if (s.studentNo && s.studentNo.toLowerCase() === studentNum.toLowerCase()) {
        return res.status(400).json({ success: false, message: 'This Student ID is already registered.' });
      }
    }

    if (mongoose.connection.readyState === 1) {
      const emailExists = await User.findOne({ email: studentEmail });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }
      const idExists = await Student.findOne({ studentNo: studentNum });
      if (idExists) {
        return res.status(400).json({ success: false, message: 'This Student ID is already registered.' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(pass, salt);
    const newUserId = new mongoose.Types.ObjectId().toString();

    const newUserObj = {
      _id: newUserId,
      id: newUserId,
      email: studentEmail,
      passwordHash,
      role: 'student',
      isActive: true,
      name: studentName
    };

    const newStudentObj = {
      user: newUserId,
      studentNo: studentNum,
      name: studentName,
      department: studentDept,
      gradYear: studentGradYear,
      cgpa: studentCgpa,
      email: studentEmail
    };

    // Store in memory
    memoryUsers.set(studentEmail, newUserObj);
    memoryStudents.set(newUserId, newStudentObj);

    // Store in MongoDB if available
    if (mongoose.connection.readyState === 1) {
      const dbUser = await User.create({
        email: studentEmail,
        passwordHash,
        role: 'student',
        isActive: true
      });
      await Student.create({
        user: dbUser._id,
        studentNo: studentNum,
        name: studentName,
        department: studentDept,
        gradYear: studentGradYear,
        cgpa: studentCgpa
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Please log in to complete your profile.',
      user: {
        id: newUserId,
        email: studentEmail,
        name: studentName,
        role: 'student'
      }
    });
  } catch (err) {
    console.error('[Student Register Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Registration service encountered an error.'
    });
  }
};

// POST /api/auth/register/recruiter (or /api/auth/register/company)
exports.registerRecruiter = async (req, res) => {
  try {
    const {
      name,
      industry,
      website,
      hr_contact,
      hrContact,
      email,
      phone,
      location,
      description,
      password,
      confirm_password,
      confirmPassword
    } = req.body;

    const companyName = (name || '').trim();
    const hrPerson = (hr_contact || hrContact || '').trim();
    const companyEmail = (email || '').trim().toLowerCase();
    const companyIndustry = (industry || '').trim();
    const companyWebsite = (website || '').trim();
    const companyPhone = (phone || '').trim();
    const companyLocation = (location || '').trim();
    const companyDesc = (description || '').trim();
    const pass = password || '';
    const confirmPass = confirm_password || confirmPassword || '';

    // Validation matching Flask
    if (!companyEmail || !companyEmail.includes('@')) {
      return res.status(400).json({ success: false, message: 'A valid email is required.' });
    }
    if (pass.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    if (pass !== confirmPass) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }
    if (!companyName) {
      return res.status(400).json({ success: false, message: 'Company name is required.' });
    }
    if (!hrPerson) {
      return res.status(400).json({ success: false, message: 'HR contact person name is required.' });
    }

    // Duplicate check
    if (memoryUsers.has(companyEmail)) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }
    if (mongoose.connection.readyState === 1) {
      const emailExists = await User.findOne({ email: companyEmail });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(pass, salt);
    const newUserId = new mongoose.Types.ObjectId().toString();

    const newUserObj = {
      _id: newUserId,
      id: newUserId,
      email: companyEmail,
      passwordHash,
      role: 'recruiter',
      isActive: true,
      name: companyName
    };

    const newCompanyObj = {
      user: newUserId,
      name: companyName,
      industry: companyIndustry,
      website: companyWebsite,
      hrContact: hrPerson,
      email: companyEmail,
      phone: companyPhone,
      location: companyLocation,
      description: companyDesc,
      approved: false // Pending admin approval matching Flask
    };

    memoryUsers.set(companyEmail, newUserObj);
    memoryCompanies.set(newUserId, newCompanyObj);

    if (mongoose.connection.readyState === 1) {
      const dbUser = await User.create({
        email: companyEmail,
        passwordHash,
        role: 'recruiter',
        isActive: true
      });
      await Company.create({
        user: dbUser._id,
        name: companyName,
        industry: companyIndustry,
        website: companyWebsite,
        hrContact: hrPerson,
        email: companyEmail,
        phone: companyPhone,
        location: companyLocation,
        description: companyDesc,
        approved: false
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Registration submitted! Your account is pending approval from the placement office.',
      user: {
        id: newUserId,
        email: companyEmail,
        name: companyName,
        role: 'recruiter',
        approved: false
      }
    });
  } catch (err) {
    console.error('[Recruiter Register Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Recruiter registration encountered an error.'
    });
  }
};

exports.registerCompany = exports.registerRecruiter;

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const userId = req.user._id ? req.user._id.toString() : req.user.id;
    let profile = null;

    if (req.user.role === 'student') {
      if (mongoose.connection.readyState === 1) {
        profile = await Student.findOne({ user: req.user._id });
      }
      if (!profile && memoryStudents.has(userId)) {
        profile = memoryStudents.get(userId);
      }
    } else if (req.user.role === 'recruiter') {
      if (mongoose.connection.readyState === 1) {
        profile = await Company.findOne({ user: req.user._id });
      }
      if (!profile && memoryCompanies.has(userId)) {
        profile = memoryCompanies.get(userId);
      }
    }

    return res.status(200).json({
      success: true,
      user: {
        id: userId,
        email: req.user.email,
        role: req.user.role,
        name: profile?.name || req.user.name || req.user.email.split('@')[0],
        profile
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Could not fetch user profile.'
    });
  }
};
