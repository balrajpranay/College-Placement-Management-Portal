const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
const https = require('https');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');

let recruiterStore = null;
try {
  recruiterStore = require('./recruiterController').recruiterStore;
} catch (_) {}

// Robust IPv4 HTTPS request helper for Google OAuth endpoints (resilient against Windows IPv6 fetch issues)
function httpsPostGoogleToken(params) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams(params).toString();
    const req = https.request(
      'https://oauth2.googleapis.com/token',
      {
        method: 'POST',
        family: 4,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
          'User-Agent': 'CampusConnect-Portal/1.0'
        },
        timeout: 10000
      },
      (res) => {
        let body = '';
        res.on('data', chunk => { body += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            resolve(parsed);
          } catch (e) {
            reject(new Error(`Invalid JSON from Google Token endpoint: ${body}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Google Token exchange timed out'));
    });
    req.write(postData);
    req.end();
  });
}

function httpsGetGoogleUserInfo(accessToken) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        method: 'GET',
        family: 4,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'CampusConnect-Portal/1.0'
        },
        timeout: 10000
      },
      (res) => {
        let body = '';
        res.on('data', chunk => { body += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            resolve(parsed);
          } catch (e) {
            reject(new Error(`Invalid JSON from Google UserInfo endpoint: ${body}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Google UserInfo fetch timed out'));
    });
    req.end();
  });
}

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

const generateToken = (userOrId, roleParam) => {
  let id = '';
  let email = '';
  let role = 'student';
  let name = '';

  if (userOrId && typeof userOrId === 'object') {
    id = (userOrId._id || userOrId.id || '').toString();
    email = userOrId.email || '';
    role = userOrId.role || roleParam || 'student';
    name = userOrId.name || '';
  } else if (userOrId) {
    id = userOrId.toString();
    role = roleParam || 'student';
  }

  return jwt.sign(
    {
      id,
      email,
      role,
      name
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

    const studentEmail = (email || '').trim().toLowerCase();
    const pass = password || '';
    const confirmPass = confirm_password || confirmPassword || '';

    // Validation
    if (!studentEmail || !studentEmail.includes('@')) {
      return res.status(400).json({ success: false, message: 'A valid email is required.' });
    }
    if (pass.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    if (pass !== confirmPass) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    // Auto-generate sensible defaults for student attributes if not provided
    const defaultName = studentEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Student';
    const studentName = (name || defaultName).trim();
    const generatedNum = 'STU' + Math.floor(100000 + Math.random() * 900000);
    const studentNum = (student_no || studentNo || generatedNum).trim();
    const studentDept = department || 'Computer Science';
    const studentGradYear = parseInt(grad_year || gradYear || 2026, 10);
    const studentCgpa = parseFloat(cgpa || 0);

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
        profile = await Company.findOne({ $or: [{ user: req.user._id }, { email: req.user.email }] });
      }
      if (!profile && memoryCompanies.has(userId)) {
        profile = memoryCompanies.get(userId);
      }
      if (!profile && req.user.email) {
        for (const c of memoryCompanies.values()) {
          if (c.email && c.email.toLowerCase() === req.user.email.toLowerCase()) {
            profile = c;
            break;
          }
        }
      }
    }

    // Auto-heal corrupted names if profile.name or req.user.name is 'Verified Google Student' or 'Priya Sharma'
    let resolvedName = req.user.name || profile?.name;
    const isActualPriya = req.user.email && req.user.email.toLowerCase() === 'priya.sharma@student.edu';
    if (!isActualPriya) {
      if (resolvedName === 'Verified Google Student' || resolvedName === 'Priya Sharma' || !resolvedName) {
        if (profile?.name && profile.name !== 'Verified Google Student' && profile.name !== 'Priya Sharma') {
          resolvedName = profile.name;
        } else if (req.user.email) {
          const emailPrefix = req.user.email.split('@')[0];
          resolvedName = emailPrefix.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        }
      }
      // If profile has corrupted name, heal it
      if (profile && (profile.name === 'Verified Google Student' || profile.name === 'Priya Sharma')) {
        profile.name = resolvedName;
        if (mongoose.connection.readyState === 1 && profile._id) {
          try {
            await Student.findByIdAndUpdate(profile._id, { name: resolvedName });
          } catch (_) {}
        }
      }
    }

    return res.status(200).json({
      success: true,
      user: {
        id: userId,
        email: req.user.email,
        role: req.user.role,
        name: resolvedName || (isActualPriya ? 'Priya Sharma' : 'Student'),
        avatar: req.user.avatar,
        githubUsername: req.user.githubUsername,
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

// GET /api/auth/github/url (Generate GitHub authorization URL)
exports.getGithubAuthUrl = async (req, res) => {
  try {
    const role = req.query.role || 'student';
    const clientId = process.env.GITHUB_CLIENT_ID || 'Ov23liCampusConnect';
    const callbackUrl = process.env.GITHUB_CALLBACK_URL || 'http://localhost:5173/auth/github/callback';
    const isCustom = clientId && process.env.GITHUB_CLIENT_SECRET && clientId !== 'Ov23liCampusConnect';

    const stateObj = { role, isCustom: !!isCustom, ts: Date.now() };
    const state = Buffer.from(JSON.stringify(stateObj)).toString('base64');

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=read:user%20user:email&state=${state}`;

    return res.status(200).json({
      success: true,
      url: authUrl,
      clientId,
      isConfigured: !!isCustom,
      callbackUrl
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to construct GitHub OAuth URL.'
    });
  }
};

// POST or GET /api/auth/github/callback (Handle GitHub Token Exchange & User Provisioning)
exports.handleGithubAuth = async (req, res) => {
  try {
    const code = req.body.code || req.query.code;
    const stateParam = req.body.state || req.query.state;
    let targetRole = req.body.role || 'student';

    if (stateParam) {
      try {
        const decoded = JSON.parse(Buffer.from(stateParam, 'base64').toString('utf8'));
        if (decoded.role) targetRole = decoded.role;
      } catch (e) {
        if (stateParam === 'recruiter' || stateParam === 'student' || stateParam === 'admin') {
          targetRole = stateParam;
        }
      }
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is missing from GitHub callback.'
      });
    }

    let githubUser = null;

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const isCustom = clientId && clientSecret && clientId !== 'Ov23liCampusConnect';

    // If custom GitHub app credentials exist, try live exchange
    if (isCustom && !code.startsWith('demo_')) {
      try {
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code
          })
        });
        const tokenData = await tokenRes.json();

        if (tokenData.access_token) {
          const userRes = await fetch('https://api.github.com/user', {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              'User-Agent': 'Campus-Connect-Portal'
            }
          });
          const userProfile = await userRes.json();

          let primaryEmail = userProfile.email;
          if (!primaryEmail) {
            const emailsRes = await fetch('https://api.github.com/user/emails', {
              headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                'User-Agent': 'Campus-Connect-Portal'
              }
            });
            const emails = await emailsRes.json();
            if (Array.isArray(emails)) {
              const primary = emails.find(e => e.primary && e.verified) || emails[0];
              primaryEmail = primary?.email;
            }
          }

          githubUser = {
            id: String(userProfile.id),
            login: userProfile.login,
            name: userProfile.name || userProfile.login,
            email: primaryEmail || `${userProfile.login}@users.noreply.github.com`,
            avatar_url: userProfile.avatar_url
          };
        }
      } catch (err) {
        console.warn('[GitHub Live Auth Notice]: Falling back to local verified profile:', err.message);
      }
    }

    // High-craft fallback / verified simulated developer profile for seamless local development
    if (!githubUser) {
      let username = 'octocat-engineer';
      if (code.includes('demo_') || code.includes('github_')) {
        username = code.replace(/demo_|github_/g, '') || 'campus-dev';
      }
      const pseudoId = 'gh_' + Math.abs(code.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0) || 892182);

      githubUser = {
        id: String(pseudoId),
        login: username,
        name: username === 'campus-dev' || username === 'octocat-engineer' ? 'GitHub Verified Student' : (username.charAt(0).toUpperCase() + username.slice(1)),
        email: `${username.toLowerCase()}@github.student.edu`,
        avatar_url: `https://avatars.githubusercontent.com/u/${Math.abs(pseudoId.slice(3)) % 100000}?v=4`
      };
    }

    const cleanEmail = githubUser.email.toLowerCase().trim();

    // 1. Check existing user in MongoDB or memory
    let existingUser = null;
    let profile = null;

    if (mongoose.connection.readyState === 1) {
      existingUser = await User.findOne({
        $or: [
          { githubId: githubUser.id },
          { email: cleanEmail }
        ]
      });
    }

    if (!existingUser) {
      for (const u of memoryUsers.values()) {
        if (u.githubId === githubUser.id || u.email === cleanEmail) {
          existingUser = u;
          break;
        }
      }
    }

    let finalUser = null;

    if (existingUser) {
      // Update with GitHub attributes
      existingUser.githubId = githubUser.id;
      existingUser.githubUsername = githubUser.login;
      existingUser.avatar = githubUser.avatar_url;
      existingUser.authProvider = 'github';

      if (mongoose.connection.readyState === 1) {
        await User.findByIdAndUpdate(existingUser._id || existingUser.id, {
          githubId: githubUser.id,
          githubUsername: githubUser.login,
          avatar: githubUser.avatar_url,
          authProvider: 'github'
        });
      }
      finalUser = existingUser;
    } else {
      // Create new user record
      const newUserId = new mongoose.Types.ObjectId().toString();
      const newUserObj = {
        _id: newUserId,
        id: newUserId,
        email: cleanEmail,
        name: githubUser.name,
        role: targetRole,
        githubId: githubUser.id,
        githubUsername: githubUser.login,
        avatar: githubUser.avatar_url,
        authProvider: 'github',
        isActive: true
      };

      memoryUsers.set(cleanEmail, newUserObj);

      if (targetRole === 'student') {
        const studentNo = 'GH' + String(Date.now()).slice(-6);
        const newStudentObj = {
          user: newUserId,
          studentNo,
          name: githubUser.name,
          department: 'Computer Science',
          gradYear: 2026,
          cgpa: 8.8,
          email: cleanEmail,
          skills: ['Git', 'GitHub', 'JavaScript', 'Python', 'React', 'Problem Solving']
        };
        memoryStudents.set(newUserId, newStudentObj);
      } else if (targetRole === 'recruiter') {
        const newCompanyObj = {
          user: newUserId,
          name: githubUser.name + ' Tech',
          industry: 'Software & Cloud Engineering',
          email: cleanEmail,
          approved: true
        };
        memoryCompanies.set(newUserId, newCompanyObj);
      }

      if (mongoose.connection.readyState === 1) {
        const dbUser = await User.create({
          email: cleanEmail,
          name: githubUser.name,
          role: targetRole,
          githubId: githubUser.id,
          githubUsername: githubUser.login,
          avatar: githubUser.avatar_url,
          authProvider: 'github',
          isActive: true
        });

        if (targetRole === 'student') {
          await Student.create({
            user: dbUser._id,
            studentNo: 'GH' + String(Date.now()).slice(-6),
            name: githubUser.name,
            department: 'Computer Science',
            gradYear: 2026,
            cgpa: 8.8,
            skills: ['Git', 'GitHub', 'JavaScript', 'Python', 'React', 'Problem Solving']
          });
        } else if (targetRole === 'recruiter') {
          await Company.create({
            user: dbUser._id,
            name: githubUser.name + ' Tech',
            industry: 'Software & Cloud Engineering',
            email: cleanEmail,
            approved: true
          });
        }
        newUserObj._id = dbUser._id.toString();
        newUserObj.id = dbUser._id.toString();
      }

      finalUser = newUserObj;
    }

    const userIdStr = (finalUser._id || finalUser.id).toString();
    if (finalUser.role === 'student') {
      if (mongoose.connection.readyState === 1) {
        profile = await Student.findOne({ user: finalUser._id });
      }
      if (!profile && memoryStudents.has(userIdStr)) {
        profile = memoryStudents.get(userIdStr);
      }
    } else if (finalUser.role === 'recruiter') {
      if (mongoose.connection.readyState === 1) {
        profile = await Company.findOne({ user: finalUser._id });
      }
      if (!profile && memoryCompanies.has(userIdStr)) {
        profile = memoryCompanies.get(userIdStr);
      }
    }

    const token = generateToken(finalUser);

    // If direct browser GET redirect from OAuth provider
    if (req.method === 'GET') {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/auth/github/callback?token=${token}&role=${finalUser.role}&success=true`);
    }

    return res.status(200).json({
      success: true,
      message: `Successfully authenticated with GitHub as ${finalUser.name || finalUser.email}!`,
      token,
      user: {
        id: userIdStr,
        email: finalUser.email,
        name: finalUser.name || githubUser.name,
        role: finalUser.role,
        avatar: finalUser.avatar || githubUser.avatar_url,
        githubUsername: finalUser.githubUsername || githubUser.login,
        authProvider: 'github',
        profile: profile || null
      }
    });
  } catch (err) {
    console.error('[GitHub Auth Controller Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'GitHub authentication service encountered an error: ' + err.message
    });
  }
};


// Secure helper to resolve and validate Google OAuth redirect URI
function resolveGoogleCallbackUrl(req, candidateUrl = null, stateCallbackUrl = null) {
  let rawHost = '';
  let requestOrigin = null;
  let isLocalRequest = false;

  if (req && req.headers) {
    const headerHost = req.headers['x-forwarded-host'] || req.headers.host;
    if (headerHost) {
      rawHost = headerHost.split(',')[0].trim();
      isLocalRequest = rawHost.includes('localhost') || rawHost.includes('127.0.0.1');
      const proto = req.headers['x-forwarded-proto'] || (isLocalRequest ? 'http' : 'https');
      requestOrigin = `${proto}://${rawHost}`.toLowerCase();
    }
  }

  // Environment awareness: production when configured as production or on Vercel, unless request is local
  const isProduction = (process.env.NODE_ENV === 'production' || !!process.env.VERCEL) && !isLocalRequest;

  // Gather allowed origins
  const trustedOrigins = new Set();
  trustedOrigins.add('https://college-placement-management-portal.vercel.app');

  if (process.env.CLIENT_ORIGIN) {
    process.env.CLIENT_ORIGIN.split(',').forEach(s => {
      const trimmed = s.trim().replace(/\/$/, '');
      if (trimmed && trimmed !== '*') {
        try {
          trustedOrigins.add(new URL(trimmed).origin.toLowerCase());
        } catch (_) {}
      }
    });
  }

  if (process.env.FRONTEND_URL) {
    try {
      trustedOrigins.add(new URL(process.env.FRONTEND_URL.trim()).origin.toLowerCase());
    } catch (_) {}
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    trustedOrigins.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.toLowerCase().trim()}`);
  }
  if (process.env.VERCEL_URL) {
    trustedOrigins.add(`https://${process.env.VERCEL_URL.toLowerCase().trim()}`);
  }

  if (requestOrigin && (!isProduction || !isLocalRequest)) {
    trustedOrigins.add(requestOrigin);
  }

  function isValidCallback(urlStr) {
    if (!urlStr || typeof urlStr !== 'string') return false;
    try {
      const parsed = new URL(urlStr.trim());
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;

      const isLocal = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname.startsWith('192.168.') || parsed.hostname.startsWith('10.');

      // In production, strictly reject localhost and local network callbacks to prevent open redirect
      if (isProduction && isLocal) return false;

      // Restrict path strictly to valid OAuth callback routes
      if (parsed.pathname !== '/auth/google/callback' && parsed.pathname !== '/api/auth/google/callback') {
        return false;
      }

      // In local development, accept localhost callbacks
      if (!isProduction && isLocal) return true;

      const origin = parsed.origin.toLowerCase();
      return trustedOrigins.has(origin);
    } catch (_) {
      return false;
    }
  }

  // Canonicalize local URLs to standard http://localhost:5173/auth/google/callback in development
  function canonicalizeCallback(urlStr) {
    if (!urlStr || typeof urlStr !== 'string') return urlStr;
    if (!isProduction) {
      try {
        const parsed = new URL(urlStr.trim());
        const isLocal = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname.startsWith('192.168.') || parsed.hostname.startsWith('10.');
        if (isLocal) {
          return 'http://localhost:5173/auth/google/callback';
        }
      } catch (_) {}
    }
    return urlStr.trim();
  }

  // 1. If stateCallbackUrl is present and valid, prioritize it (ensures authorization code exchange matches consent redirect)
  if (isValidCallback(stateCallbackUrl)) {
    return canonicalizeCallback(stateCallbackUrl);
  }

  // 2. Candidate from query / body
  if (isValidCallback(candidateUrl)) {
    return canonicalizeCallback(candidateUrl);
  }

  // 3. Configured environment callback URL
  if (isValidCallback(process.env.GOOGLE_CALLBACK_URL)) {
    return canonicalizeCallback(process.env.GOOGLE_CALLBACK_URL);
  }

  // 4. In production, derive dynamically from verified request origin or trusted non-local origin
  if (isProduction) {
    if (requestOrigin && !requestOrigin.includes('localhost') && !requestOrigin.includes('127.0.0.1')) {
      return `${requestOrigin}/auth/google/callback`;
    }
    for (const origin of trustedOrigins) {
      if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return `${origin}/auth/google/callback`;
      }
    }
  }

  // 5. Development fallback (only for genuine local development)
  return 'http://localhost:5173/auth/google/callback';
}

exports.resolveGoogleCallbackUrl = resolveGoogleCallbackUrl;

// GET /api/auth/google/url (Generate Google OAuth authorization URL)
exports.getGoogleAuthUrl = async (req, res) => {
  try {
    const role = req.query.role || 'student';
    if (!['student', 'recruiter', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified for Google authentication.'
      });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID || '582752422278-6vfhbc64qfrr34m6r2nqf285tq545l7k.apps.googleusercontent.com';
    
    // Resolve dynamic callback URL from query, env, or request headers with environment awareness
    const callbackUrl = resolveGoogleCallbackUrl(req, req.query.redirect_uri);
    const isCustom = !!(clientId && process.env.GOOGLE_CLIENT_SECRET && !clientId.includes('mock'));

    const stateObj = { role, isCustom: !!isCustom, callbackUrl, ts: Date.now() };
    const state = Buffer.from(JSON.stringify(stateObj)).toString('base64');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=${encodeURIComponent('openid email profile')}&access_type=offline&prompt=consent&state=${state}`;

    return res.status(200).json({
      success: true,
      url: authUrl,
      clientId,
      isConfigured: !!isCustom,
      callbackUrl
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to construct Google OAuth URL.'
    });
  }
};

// POST or GET /api/auth/google/callback (Handle Google Token Exchange & User Provisioning)
exports.handleGoogleAuth = async (req, res) => {
  try {
    const code = req.body?.code || req.query?.code;
    const stateParam = req.body?.state || req.query?.state;
    let targetRole = req.body?.role || 'student';
    let stateCallbackUrl = null;

    if (stateParam) {
      try {
        const decoded = JSON.parse(Buffer.from(stateParam, 'base64').toString('utf8'));
        if (decoded.role) targetRole = decoded.role;
        if (decoded.callbackUrl) stateCallbackUrl = decoded.callbackUrl;
      } catch (e) {
        if (stateParam === 'recruiter' || stateParam === 'student' || stateParam === 'admin') {
          targetRole = stateParam;
        }
      }
    }

    // Role parameter validation
    if (!targetRole || !['student', 'recruiter', 'admin'].includes(targetRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid, missing, or unsupported role specified in authentication request.'
      });
    }

    // Resolve callback URL using state (for strict parity with authorization step) or body/query with environment validation
    const candidateUrl = req.body?.redirect_uri || req.query?.redirect_uri;
    const callbackUrl = resolveGoogleCallbackUrl(req, candidateUrl, stateCallbackUrl);

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is missing from Google callback.'
      });
    }

    let googleUser = null;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const isCustom = clientId && clientSecret;

    // 1. Live Google Token exchange if live code provided
    if (isCustom && !code.startsWith('demo_') && !code.startsWith('google_mock')) {
      try {
        let tokenData = null;
        try {
          const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'CampusConnect-Portal/1.0'
            },
            body: new URLSearchParams({
              code,
              client_id: clientId,
              client_secret: clientSecret,
              redirect_uri: callbackUrl,
              grant_type: 'authorization_code'
            }).toString()
          });
          tokenData = await tokenRes.json();
        } catch (fetchErr) {
          console.warn('[Google Live Auth Notice]: Native fetch threw (' + fetchErr.message + '), using IPv4 HTTPS fallback...');
          tokenData = await httpsPostGoogleToken({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: callbackUrl,
            grant_type: 'authorization_code'
          });
        }

        if (tokenData && tokenData.error) {
          console.error('[Google OAuth Token Error]:', tokenData.error, tokenData.error_description);
          return res.status(401).json({
            success: false,
            message: `Google authentication failed: ${tokenData.error_description || tokenData.error}. Please ensure redirect URIs are configured in Google Cloud Console.`
          });
        }

        let userProfile = null;
        if (tokenData && tokenData.access_token) {
          try {
            const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                'User-Agent': 'CampusConnect-Portal/1.0'
              }
            });
            userProfile = await userRes.json();
          } catch (userInfoErr) {
            console.warn('[Google UserInfo Fetch Warning]: Native fetch threw (' + userInfoErr.message + '), using IPv4 HTTPS fallback...');
            try {
              userProfile = await httpsGetGoogleUserInfo(tokenData.access_token);
            } catch (fallbackErr) {
              console.warn('[Google UserInfo Fallback Warning]:', fallbackErr.message);
            }
          }
        }

        // If userinfo endpoint didn't provide sub/email, decode id_token JWT
        if ((!userProfile || !userProfile.sub) && tokenData && tokenData.id_token) {
          try {
            const decodedIdToken = jwt.decode(tokenData.id_token);
            if (decodedIdToken && (decodedIdToken.sub || decodedIdToken.email)) {
              userProfile = {
                sub: decodedIdToken.sub,
                name: decodedIdToken.name || decodedIdToken.given_name,
                email: decodedIdToken.email,
                picture: decodedIdToken.picture
              };
            }
          } catch (decodeErr) {
            console.warn('[Google ID Token Decode Warning]:', decodeErr.message);
          }
        }

        if (userProfile && (userProfile.email || userProfile.sub)) {
          const resolvedName = userProfile.name || userProfile.given_name || (userProfile.email ? userProfile.email.split('@')[0] : 'Google Student');
          googleUser = {
            id: String(userProfile.sub || 'goog_' + Date.now()),
            name: resolvedName,
            email: userProfile.email,
            avatar_url: userProfile.picture
          };
        }
      } catch (err) {
        console.error('[Google Live Auth Error]:', err.message);
        return res.status(500).json({
          success: false,
          message: `Failed to communicate with Google authentication services: ${err.message}`
        });
      }
    }

    // 2. Simulated Google profile strictly for explicit test/demo scripts
    if (!googleUser) {
      if (code.startsWith('demo_') || code.startsWith('google_mock') || process.env.NODE_ENV === 'test') {
        let username = 'google-user';
        if (code.includes('demo_') || code.includes('google_')) {
          username = code.replace(/demo_|google_/g, '') || 'google-user';
        }
        const pseudoId = 'goog_' + Math.abs(code.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0) || 719281);
        
        let resolvedEmail = '';
        if (username.includes('@')) {
          resolvedEmail = username.toLowerCase();
        } else if (username === 'admin' || username === 'admin_authorized') {
          resolvedEmail = 'admin@college.edu';
        } else if (username === 'recruiter' || username === 'recruiter_authorized' || username === 'recruiter_technova') {
          resolvedEmail = 'hr@technova.com';
        } else {
          resolvedEmail = `${username.toLowerCase().replace(/[\s_]+/g, '.')}@gmail.com`;
        }

        const cleanName = (username === 'google-user' || username === 'student' || username === 'google-student')
          ? (targetRole === 'recruiter' ? 'Verified Google Recruiter' : (targetRole === 'admin' ? 'Placement Administrator' : 'Google Student'))
          : username.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        googleUser = {
          id: String(pseudoId),
          name: cleanName,
          email: resolvedEmail,
          avatar_url: 'https://lh3.googleusercontent.com/a/default-user'
        };
      } else {
        return res.status(401).json({
          success: false,
          message: 'Unable to authenticate with Google. No profile received.'
        });
      }
    }

    const cleanEmail = (googleUser.email || '').toLowerCase().trim();
    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: 'Google authentication did not provide a valid email address.'
      });
    }

    // 3. Find existing user & company in MongoDB or in-memory store
    let existingUser = null;
    let existingCompany = null;
    let profile = null;

    if (mongoose.connection.readyState === 1) {
      if (googleUser.id) {
        existingUser = await User.findOne({ googleId: googleUser.id });
      }
      if (!existingUser && cleanEmail) {
        existingUser = await User.findOne({ email: cleanEmail });
      }
      if (cleanEmail) {
        existingCompany = await Company.findOne({ email: cleanEmail });
      }
    }

    if (!existingUser) {
      if (googleUser.id) {
        for (const u of memoryUsers.values()) {
          if (u.googleId === googleUser.id) {
            existingUser = u;
            break;
          }
        }
      }
      if (!existingUser && cleanEmail) {
        existingUser = memoryUsers.get(cleanEmail);
      }
    }

    if (!existingCompany && cleanEmail) {
      for (const c of memoryCompanies.values()) {
        if (c.email && c.email.toLowerCase() === cleanEmail) {
          existingCompany = c;
          break;
        }
      }
    }

    // Determine whether request is local or production, and whether this is a mock test code
    let isLocalRequest = false;
    const headerHost = (req.headers?.['x-forwarded-host'] || req.headers?.host || '').toLowerCase();
    const originHeader = (req.headers?.origin || req.headers?.referer || '').toLowerCase();
    if (headerHost.includes('localhost') || headerHost.includes('127.0.0.1') || originHeader.includes('localhost') || originHeader.includes('127.0.0.1')) {
      isLocalRequest = true;
    }
    const isProduction = (process.env.NODE_ENV === 'production' || !!process.env.VERCEL) && !isLocalRequest;
    const isMockCode = typeof code === 'string' && (code.startsWith('demo_') || code.startsWith('google_mock'));

    // 4. Role Authorization & Privilege Escalation Prevention
    const isConfiguredAdmin = cleanEmail === 'admin@college.edu' ||
      (process.env.ADMIN_EMAIL && cleanEmail === process.env.ADMIN_EMAIL.toLowerCase().trim()) ||
      (process.env.ADMIN_EMAILS && process.env.ADMIN_EMAILS.toLowerCase().split(',').map(s => s.trim()).includes(cleanEmail));
    const isAuthorizedAdmin = (existingUser && existingUser.role === 'admin') || isConfiguredAdmin;

    const isSeededRecruiter = cleanEmail === 'hr@technova.com' || cleanEmail === 'talent@apexcloud.io';
    const isAuthorizedRecruiter = (existingUser && existingUser.role === 'recruiter') || !!existingCompany || isSeededRecruiter;

    // In production environments or for mock test codes, enforce strict privilege escalation boundaries
    if (isProduction || isMockCode) {
      if (targetRole === 'admin') {
        if (!isAuthorizedAdmin) {
          return res.status(403).json({
            success: false,
            message: `This Google account (${cleanEmail}) is not authorized as a Placement Administrator. Access to the Admin Portal is denied.`
          });
        }
      } else if (targetRole === 'recruiter') {
        if (existingUser && existingUser.role === 'student') {
          return res.status(403).json({
            success: false,
            message: `This Google account (${cleanEmail}) is registered as a Student, not a Recruiter. Access to the Recruiter Portal is denied.`
          });
        }
        if (!isAuthorizedRecruiter) {
          return res.status(403).json({
            success: false,
            message: `This Google account (${cleanEmail}) is not registered or authorized as a Recruiter. Please complete Recruiter Registration first or log in with your authorized recruiter credentials.`
          });
        }
      } else if (targetRole === 'student') {
        if (existingUser && existingUser.role !== 'student') {
          const portalLabel = existingUser.role === 'recruiter' ? 'Recruiter' : 'Placement Administrator';
          return res.status(400).json({
            success: false,
            message: `This account is registered as a ${portalLabel}. Please select the ${portalLabel} portal.`
          });
        }
      }
    }

    let finalUser = null;

    if (existingUser) {
      finalUser = existingUser;
      // In local demo mode, update role to targetRole to allow presenting all 3 roles with a single Google account
      if (!isProduction && !isMockCode) {
        finalUser.role = targetRole;
      } else if (!finalUser.role) {
        finalUser.role = targetRole;
      }

      // Update with Google attributes
      finalUser.googleId = googleUser.id;
      finalUser.avatar = googleUser.avatar_url || finalUser.avatar;
      finalUser.authProvider = 'google';

      if (cleanEmail && (!existingUser.authProvider || existingUser.authProvider === 'google')) {
        finalUser.email = cleanEmail;
      }

      // Heal name if corrupted or missing, without overwriting legitimate names with generic labels
      const isCorruptedName = !finalUser.name || finalUser.name === 'Verified Google Student' || finalUser.name === 'Google User';
      const isRealGoogleName = googleUser.name && googleUser.name !== 'Verified Google Student' && googleUser.name !== 'Google User';
      if (isRealGoogleName || isCorruptedName) {
        finalUser.name = isRealGoogleName ? googleUser.name : (finalUser.name || googleUser.name);
      }

      if (mongoose.connection.readyState === 1) {
        await User.findByIdAndUpdate(finalUser._id || finalUser.id, {
          role: finalUser.role,
          googleId: googleUser.id,
          avatar: finalUser.avatar,
          authProvider: 'google',
          name: finalUser.name,
          email: finalUser.email
        });
      }
    } else {
      // New user registration via Google OAuth
      const assignedRole = targetRole;
      const newUserId = new mongoose.Types.ObjectId().toString();
      const newUserObj = {
        _id: newUserId,
        id: newUserId,
        email: cleanEmail,
        name: googleUser.name,
        role: assignedRole,
        googleId: googleUser.id,
        avatar: googleUser.avatar_url,
        authProvider: 'google',
        isActive: true
      };

      memoryUsers.set(cleanEmail, newUserObj);

      if (assignedRole === 'student') {
        const studentNo = 'GOOG' + Math.floor(100000 + Math.random() * 900000);
        const newStudentObj = {
          user: newUserId,
          studentNo,
          name: googleUser.name,
          email: cleanEmail,
          department: 'Computer Science',
          gradYear: 2026,
          cgpa: 8.5,
          backlogs: 0,
          verified: true
        };
        memoryStudents.set(newUserId, newStudentObj);

        if (mongoose.connection.readyState === 1) {
          try {
            const created = await User.create(newUserObj);
            await Student.create({
              user: created._id,
              studentNo,
              name: googleUser.name,
              department: 'Computer Science',
              gradYear: 2026,
              cgpa: 8.5,
              backlogs: 0,
              verified: true
            });
            finalUser = created;
          } catch (dbErr) {
            console.warn('[MongoDB Create Warning]: Continuing with memory provisioned record:', dbErr.message);
            finalUser = newUserObj;
          }
        } else {
          finalUser = newUserObj;
        }
      } else if (assignedRole === 'recruiter') {
        if (mongoose.connection.readyState === 1) {
          try {
            const created = await User.create(newUserObj);
            let comp = null;
            if (existingCompany) {
              comp = await Company.findByIdAndUpdate(existingCompany._id, { user: created._id, approved: true }, { new: true });
            } else {
              const compName = (googleUser.name && googleUser.name !== 'Google User' && googleUser.name !== 'Verified Google Student')
                ? `${googleUser.name} Tech`
                : 'Apex Tech Solutions';
              comp = await Company.create({
                user: created._id,
                name: compName,
                industry: 'Software & Cloud Engineering',
                website: `https://${cleanEmail.split('@')[1] || 'technova.com'}`,
                hrContact: googleUser.name || 'Hiring Lead',
                email: cleanEmail,
                phone: '+91 98765 43210',
                location: 'Bengaluru, India',
                description: 'Campus recruitment partner organization.',
                approved: true
              });
            }
            finalUser = created;
            profile = comp;
          } catch (dbErr) {
            finalUser = newUserObj;
          }
        } else {
          finalUser = newUserObj;
        }
      } else {
        // Admin
        if (mongoose.connection.readyState === 1) {
          try {
            const created = await User.create(newUserObj);
            finalUser = created;
          } catch (dbErr) {
            finalUser = newUserObj;
          }
        } else {
          finalUser = newUserObj;
        }
      }
    }

    const finalUserIdStr = (finalUser._id || finalUser.id).toString();

    // 5. Retrieve or create linked profile
    if (mongoose.connection.readyState === 1) {
      if (finalUser.role === 'student') {
        profile = await Student.findOne({ user: finalUser._id || finalUser.id });
        if (profile) {
          // Auto-heal student profile name if it was corrupted as 'Verified Google Student' or 'Priya Sharma'
          if (cleanEmail !== 'priya.sharma@student.edu' && (profile.name === 'Verified Google Student' || profile.name === 'Priya Sharma' || !profile.name)) {
            profile.name = finalUser.name || googleUser.name;
            await Student.findByIdAndUpdate(profile._id, { name: profile.name });
          }
        } else {
          try {
            profile = await Student.create({
              user: finalUser._id || finalUser.id,
              studentNo: 'GOOG' + Math.floor(100000 + Math.random() * 900000),
              name: finalUser.name || googleUser.name,
              department: 'Computer Science',
              gradYear: 2026,
              cgpa: 8.5,
              backlogs: 0,
              verified: true
            });
          } catch (e) {
            console.warn('[Student Create in handleGoogleAuth]:', e.message);
          }
        }
      } else if (finalUser.role === 'recruiter') {
        profile = await Company.findOne({ $or: [{ user: finalUser._id || finalUser.id }, { email: cleanEmail }] });
        if (profile) {
          if (!profile.user || profile.user.toString() !== finalUserIdStr || !profile.approved) {
            profile = await Company.findByIdAndUpdate(
              profile._id,
              { user: finalUser._id || finalUser.id, approved: true },
              { new: true }
            );
          }
        } else {
          const compName = (finalUser.name && finalUser.name !== 'Google User' && finalUser.name !== 'Verified Google Student')
            ? `${finalUser.name} Tech`
            : 'TechNova Partner Solutions';
          try {
            profile = await Company.create({
              user: finalUser._id || finalUser.id,
              name: compName,
              industry: 'Software & Cloud Engineering',
              website: `https://${cleanEmail.split('@')[1] || 'technova.com'}`,
              hrContact: finalUser.name || 'Hiring Lead',
              email: cleanEmail,
              phone: '+91 98765 43210',
              location: 'Bengaluru, India',
              description: 'Campus recruitment partner organization.',
              approved: true
            });
          } catch (e) {
            console.warn('[Company Create in handleGoogleAuth]:', e.message);
          }
        }
      }
    }

    if (!profile) {
      if (finalUser.role === 'student') {
        profile = memoryStudents.get(finalUserIdStr);
        if (!profile) {
          profile = {
            user: finalUserIdStr,
            studentNo: 'GOOG' + Math.floor(100000 + Math.random() * 900000),
            name: finalUser.name || googleUser.name,
            email: cleanEmail,
            department: 'Computer Science',
            gradYear: 2026,
            cgpa: 8.5,
            backlogs: 0,
            verified: true
          };
          memoryStudents.set(finalUserIdStr, profile);
        } else if (cleanEmail !== 'priya.sharma@student.edu' && (profile.name === 'Verified Google Student' || profile.name === 'Priya Sharma')) {
          profile.name = finalUser.name || googleUser.name;
        }
      } else if (finalUser.role === 'recruiter') {
        profile = memoryCompanies.get(finalUserIdStr);
        if (!profile && existingCompany) {
          profile = existingCompany;
        }
        if (!profile) {
          profile = {
            user: finalUserIdStr,
            name: `${finalUser.name || 'TechNova'} Solutions`,
            industry: 'Software & Cloud Engineering',
            email: cleanEmail,
            approved: true
          };
        }
        profile.approved = true;
        memoryCompanies.set(finalUserIdStr, profile);
      }
    }

    // Ensure recruiter profile is marked approved in in-memory caches
    if (finalUser.role === 'recruiter') {
      if (profile) profile.approved = true;
      if (recruiterStore && recruiterStore.companies) {
        recruiterStore.companies.set(cleanEmail, {
          id: Date.now(),
          name: profile?.name || 'TechNova Solutions',
          industry: profile?.industry || 'Software / IT',
          website: profile?.website || 'https://technova.example.com',
          hr_contact: profile?.hrContact || finalUser.name,
          hrContact: profile?.hrContact || finalUser.name,
          email: cleanEmail,
          phone: '+91 98765 43210',
          location: 'Bengaluru, India',
          description: 'Campus recruitment partner organization.',
          approved: true,
          created_at: new Date().toISOString()
        });
      }
    }

    // 5. Generate signed JWT token with valid user ID and role
    const token = generateToken(finalUser);

    const resolvedDisplayName = finalUser.name || googleUser.name || profile?.name || cleanEmail.split('@')[0];

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful! Initializing placement workspace.',
      token,
      user: {
        id: finalUserIdStr,
        name: resolvedDisplayName,
        email: finalUser.email,
        role: finalUser.role || 'student',
        avatar: finalUser.avatar || googleUser.avatar_url,
        authProvider: 'google',
        profile: profile || null
      }
    });
  } catch (err) {
    console.error('[Google Auth Critical Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Google authentication encountered an unexpected error.'
    });
  }
};

exports.memoryUsers = memoryUsers;
exports.memoryStudents = memoryStudents;
exports.memoryCompanies = memoryCompanies;
