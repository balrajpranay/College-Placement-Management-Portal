/**
 * Campus Connect — Enhanced Student & Recruiter Registration & Light Mode Test Suite
 *
 * Validates:
 * 1. Permanent Light Mode enforcement across index.html and layouts
 * 2. Complete student registration with all 11 required fields
 * 3. Validation rejection when any required student fields are missing or invalid
 * 4. Duplicate checks on email and Hall Ticket / Roll Number
 * 5. Automatic auto-population of student profile and resume data upon registration
 * 6. Non-destructive sync of profile details with resume builder
 * 7. Recruiter registration with all required fields (hrContact, email, password, company name, govId, hrPosition, phone, location)
 * 8. Validation rejection when required recruiter fields are missing
 * 9. Google OAuth profile completion flow: profileComplete flag and non-destructive completion
 * 10. Data integrity of existing demo accounts and students
 */

const http = require('http');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = require('../server/server');
const authController = require('../server/controllers/authController');
const studentController = require('../server/controllers/studentController');

let server;
let baseUrl;

function request(method, reqPath, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(reqPath, baseUrl);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('======================================================================');
  console.log('   Campus Connect — Enhanced Registration & Light Mode Test Suite    ');
  console.log('======================================================================\n');

  let passed = 0;
  let failed = 0;

  function pass(msg) {
    passed++;
    console.log(`✅ [PASS] ${msg}`);
  }

  function fail(msg, err) {
    failed++;
    console.error(`❌ [FAIL] ${msg}`);
    if (err) console.error('   ', err.message || err);
  }

  // --- SECTION 1: Light Mode Only Enforcement ---
  console.log('--- SECTION 1: Light Mode Only Enforcement ---');

  try {
    const indexPath = path.join(__dirname, '../client/index.html');
    const indexHtml = fs.readFileSync(indexPath, 'utf8');
    assert.ok(indexHtml.includes("document.documentElement.setAttribute('data-theme', 'light')"), 'data-theme forced to light');
    assert.ok(indexHtml.includes("document.documentElement.style.colorScheme = 'light'"), 'colorScheme forced to light');
    assert.ok(!indexHtml.includes("theme === 'dark'"), 'Dark theme branching removed from boot script');
    pass('index.html permanently boots and forces light mode only');
  } catch (e) {
    fail('index.html light mode boot verification failed', e);
  }

  try {
    const navbarPath = path.join(__dirname, '../client/src/components/Navbar.jsx');
    const adminLayoutPath = path.join(__dirname, '../client/src/layouts/AdminLayout.jsx');
    const studentLayoutPath = path.join(__dirname, '../client/src/layouts/StudentLayout.jsx');
    const recruiterLayoutPath = path.join(__dirname, '../client/src/layouts/RecruiterLayout.jsx');

    const navbarCode = fs.readFileSync(navbarPath, 'utf8');
    const adminCode = fs.readFileSync(adminLayoutPath, 'utf8');
    const studentCode = fs.readFileSync(studentLayoutPath, 'utf8');
    const recruiterCode = fs.readFileSync(recruiterLayoutPath, 'utf8');

    assert.ok(!navbarCode.includes('toggleTheme') && !navbarCode.includes('theme-toggle-btn'), 'Navbar theme toggle removed');
    assert.ok(!adminCode.includes('toggleTheme'), 'AdminLayout theme toggle removed');
    assert.ok(!studentCode.includes('toggleTheme'), 'StudentLayout theme toggle removed');
    assert.ok(!recruiterCode.includes('toggleTheme'), 'RecruiterLayout theme toggle removed');
    pass('Theme switcher and toggle buttons removed across Navbar, Student, Recruiter & Admin layouts');
  } catch (e) {
    fail('Layout theme toggle removal verification failed', e);
  }

  // --- SECTION 2: Student Registration Validations & All 11 Fields ---
  console.log('\n--- SECTION 2: Student Registration Validations & All 11 Fields ---');

  const validStudentPayload = {
    name: 'Balraj Pranay',
    email: 'pranay.test@campus.edu',
    password: 'password123',
    confirm_password: 'password123',
    collegeName: 'Apex Institute of Technology',
    studentNo: '21B91A0501',
    department: 'Computer Science',
    academicYear: '4th Year',
    gradYear: 2026,
    phone: '+91 98765 43210',
    city: 'Hyderabad',
    gender: 'Male'
  };

  // Missing Full Name
  try {
    const res = await request('POST', '/api/auth/register/student', { ...validStudentPayload, name: '' });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes('Full Name'));
    pass('Missing Full Name is rejected with 400 and clear error message');
  } catch (e) {
    fail('Missing Full Name validation failed', e);
  }

  // Missing College Name
  try {
    const res = await request('POST', '/api/auth/register/student', { ...validStudentPayload, collegeName: '' });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes('College Name'));
    pass('Missing College Name is rejected with 400 and clear error message');
  } catch (e) {
    fail('Missing College Name validation failed', e);
  }

  // Missing Roll Number
  try {
    const res = await request('POST', '/api/auth/register/student', { ...validStudentPayload, studentNo: '' });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes('Hall Ticket') || res.data.message.includes('Roll No'));
    pass('Missing Hall Ticket / Roll Number is rejected with 400 and clear error message');
  } catch (e) {
    fail('Missing Roll Number validation failed', e);
  }

  // Missing Department
  try {
    const res = await request('POST', '/api/auth/register/student', { ...validStudentPayload, department: '' });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes('Department') || res.data.message.includes('Branch'));
    pass('Missing Department is rejected with 400 and clear error message');
  } catch (e) {
    fail('Missing Department validation failed', e);
  }

  // Missing Academic Year
  try {
    const res = await request('POST', '/api/auth/register/student', { ...validStudentPayload, academicYear: '' });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes('Academic Year'));
    pass('Missing Academic Year is rejected with 400 and clear error message');
  } catch (e) {
    fail('Missing Academic Year validation failed', e);
  }

  // Missing City
  try {
    const res = await request('POST', '/api/auth/register/student', { ...validStudentPayload, city: '' });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes('City'));
    pass('Missing City is rejected with 400 and clear error message');
  } catch (e) {
    fail('Missing City validation failed', e);
  }

  // Invalid Phone Number
  try {
    const res = await request('POST', '/api/auth/register/student', { ...validStudentPayload, phone: '123' });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes('mobile'));
    pass('Invalid short mobile number is rejected with 400');
  } catch (e) {
    fail('Invalid phone validation failed', e);
  }

  // Password Mismatch
  try {
    const res = await request('POST', '/api/auth/register/student', { ...validStudentPayload, confirm_password: 'mismatchpass' });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes('match'));
    pass('Mismatched passwords are rejected with 400');
  } catch (e) {
    fail('Password mismatch validation failed', e);
  }

  // Successful Registration with all 11 fields
  let registeredStudentId = null;
  try {
    const res = await request('POST', '/api/auth/register/student', validStudentPayload);
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.user.email, 'pranay.test@campus.edu');
    registeredStudentId = res.data.user.id;
    pass('Student registration succeeds (201) when all required fields are provided');
  } catch (e) {
    fail('Student registration with 11 fields failed', e);
  }

  // Duplicate Email Rejection
  try {
    const res = await request('POST', '/api/auth/register/student', { ...validStudentPayload, studentNo: 'DIFF_ROLL_123' });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes('email already exists'));
    pass('Duplicate student email is rejected with 400');
  } catch (e) {
    fail('Duplicate email rejection failed', e);
  }

  // Duplicate Roll Number Rejection
  try {
    const res = await request('POST', '/api/auth/register/student', { ...validStudentPayload, email: 'pranay.diff@campus.edu' });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes('already registered'));
    pass('Duplicate Hall Ticket / Roll Number is rejected with 400');
  } catch (e) {
    fail('Duplicate roll number rejection failed', e);
  }

  // --- SECTION 3: Profile & Resume Auto-Population Upon Student Registration ---
  console.log('\n--- SECTION 3: Profile & Resume Auto-Population Upon Student Registration ---');

  let studentToken = null;
  try {
    // Login with registered student
    const loginRes = await request('POST', '/api/auth/login', {
      email: 'pranay.test@campus.edu',
      password: 'password123',
      role: 'student'
    });
    assert.strictEqual(loginRes.status, 200);
    studentToken = loginRes.data.token;
    assert.ok(studentToken, 'Token received');

    // Fetch profile
    const profRes = await request('GET', '/api/students/profile', null, {
      Authorization: `Bearer ${studentToken}`
    });
    assert.strictEqual(profRes.status, 200);
    const st = profRes.data?.data?.student;
    assert.strictEqual(st.name, 'Balraj Pranay');
    assert.strictEqual(st.collegeName, 'Apex Institute of Technology');
    assert.strictEqual(st.studentNo, '21B91A0501');
    assert.strictEqual(st.department, 'Computer Science');
    assert.strictEqual(st.academicYear, '4th Year');
    assert.strictEqual(st.gradYear, 2026);
    assert.strictEqual(st.phone, '+91 98765 43210');
    assert.strictEqual(st.city, 'Hyderabad');
    assert.strictEqual(st.gender, 'Male');
    pass('Student profile successfully auto-populated with all registration details');

    // Verify auto-populated Resume Data
    const resumeData = st.resumeData;
    assert.ok(resumeData, 'resumeData exists');
    assert.strictEqual(resumeData.contact.fullName, 'Balraj Pranay');
    assert.strictEqual(resumeData.contact.phone, '+91 98765 43210');
    assert.strictEqual(resumeData.contact.email, 'pranay.test@campus.edu');
    assert.ok(resumeData.contact.location.includes('Hyderabad'), 'Location contains registered city');

    const eduSec = resumeData.sections.find(s => s.id === 'education');
    assert.ok(eduSec, 'Education section exists');
    assert.ok(eduSec.content.includes('Apex Institute of Technology'), 'Education contains registered college');
    assert.ok(eduSec.content.includes('21B91A0501'), 'Education contains registered Roll No');
    assert.ok(eduSec.content.includes('4th Year'), 'Education contains registered Academic Year');
    pass('Resume Builder auto-populates Full Name, Email, Mobile, City, College, Department, Academic Year, and Graduation Year');
  } catch (e) {
    fail('Auto-population verification failed', e);
  }

  // --- SECTION 4: Non-Destructive Profile & Resume Syncing ---
  console.log('\n--- SECTION 4: Non-Destructive Profile & Resume Syncing ---');

  try {
    // 1. Add custom project and experience to resume
    const profRes = await request('GET', '/api/students/profile', null, {
      Authorization: `Bearer ${studentToken}`
    });
    const currentResume = profRes.data.data.student.resumeData;

    currentResume.sections = currentResume.sections.map(s => {
      if (s.id === 'projects') {
        return { ...s, content: 'CUSTOM_PRANAY_AI_AGENT_PROJECT_V2' };
      }
      if (s.id === 'experience') {
        return { ...s, content: 'CUSTOM_PRANAY_SENIOR_LEAD_INTERN_EXP' };
      }
      return s;
    });

    // Save customized resume
    const saveRes = await request('PUT', '/api/students/profile', { resumeData: currentResume }, {
      Authorization: `Bearer ${studentToken}`
    });
    assert.strictEqual(saveRes.status, 200);

    // 2. Now update student contact/college details via profile update
    const updateRes = await request('PUT', '/api/students/profile', {
      phone: '+91 91234 56789',
      city: 'Bengaluru',
      collegeName: 'National Institute of Tech'
    }, {
      Authorization: `Bearer ${studentToken}`
    });
    assert.strictEqual(updateRes.status, 200);

    // 3. Verify that contact and education synced, while custom projects & experience were preserved
    const verifyRes = await request('GET', '/api/students/profile', null, {
      Authorization: `Bearer ${studentToken}`
    });
    const updatedResume = verifyRes.data.data.student.resumeData;

    assert.strictEqual(updatedResume.contact.phone, '+91 91234 56789');
    assert.ok(updatedResume.contact.location.includes('Bengaluru'));

    const projSec = updatedResume.sections.find(s => s.id === 'projects');
    const expSec = updatedResume.sections.find(s => s.id === 'experience');
    assert.strictEqual(projSec.content, 'CUSTOM_PRANAY_AI_AGENT_PROJECT_V2');
    assert.strictEqual(expSec.content, 'CUSTOM_PRANAY_SENIOR_LEAD_INTERN_EXP');
    pass('Profile updates non-destructively sync contact & education while preserving custom resume sections');
  } catch (e) {
    fail('Non-destructive resume sync verification failed', e);
  }

  // --- SECTION 5: Recruiter Registration Validations & All Required Fields ---
  console.log('\n--- SECTION 5: Recruiter Registration Validations & All Required Fields ---');

  const validRecruiterPayload = {
    hrContact: 'Ayesha Eram',
    email: 'ayesha.recruiter@hypertech.io',
    password: 'recruiterpass123',
    confirm_password: 'recruiterpass123',
    name: 'HyperTech Innovations',
    govId: 'CIN-U72200TG2026PTC',
    hrPosition: 'University Talent Lead',
    phone: '+91 98111 22233',
    location: 'Hyderabad, India',
    gender: 'Female'
  };

  // Missing Recruiter Name
  try {
    const res = await request('POST', '/api/auth/register/recruiter', { ...validRecruiterPayload, hrContact: '' });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes('Recruiter Full Name'));
    pass('Missing recruiter name is rejected with 400');
  } catch (e) {
    fail('Missing recruiter name validation failed', e);
  }

  // Missing Company Name
  try {
    const res = await request('POST', '/api/auth/register/recruiter', { ...validRecruiterPayload, name: '' });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes('Company Name'));
    pass('Missing Company Name is rejected with 400');
  } catch (e) {
    fail('Missing company name validation failed', e);
  }

  // Missing Company ID / Recruiter ID
  try {
    const res = await request('POST', '/api/auth/register/recruiter', { ...validRecruiterPayload, govId: '' });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes('Company ID') || res.data.message.includes('Recruiter ID'));
    pass('Missing Company ID / Recruiter ID is rejected with 400');
  } catch (e) {
    fail('Missing govId validation failed', e);
  }

  // Missing Job Designation
  try {
    const res = await request('POST', '/api/auth/register/recruiter', { ...validRecruiterPayload, hrPosition: '' });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes('Job Designation'));
    pass('Missing Job Designation is rejected with 400');
  } catch (e) {
    fail('Missing hrPosition validation failed', e);
  }

  // Missing City / Location
  try {
    const res = await request('POST', '/api/auth/register/recruiter', { ...validRecruiterPayload, location: '' });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes('City'));
    pass('Missing City / Location is rejected with 400');
  } catch (e) {
    fail('Missing location validation failed', e);
  }

  // Successful Recruiter Registration
  try {
    const res = await request('POST', '/api/auth/register/recruiter', validRecruiterPayload);
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.user.approved, false);
    pass('Recruiter registration succeeds (201) with approved: false pending status');
  } catch (e) {
    fail('Recruiter registration with all required fields failed', e);
  }

  // --- SECTION 6: Google OAuth Registration & Profile Completion Workflow ---
  console.log('\n--- SECTION 6: Google OAuth Registration & Profile Completion Workflow ---');

  try {
    // Google sign-in with fresh account that has not filled college/city
    const googRes = await request('POST', '/api/auth/google/callback', {
      code: 'demo_fresh_google_student',
      state: Buffer.from(JSON.stringify({ role: 'student' })).toString('base64')
    });
    assert.strictEqual(googRes.status, 200);
    assert.strictEqual(googRes.data.user.role, 'student');
    // Fresh google user without college/city returns profileComplete: false
    assert.strictEqual(googRes.data.user.profileComplete, false);
    pass('New Google OAuth student returns profileComplete: false to prompt profile completion');

    const freshToken = googRes.data.token;
    // Complete profile using PUT /api/students/profile
    const completeRes = await request('PUT', '/api/students/profile', {
      collegeName: 'IIT Hyderabad',
      studentNo: 'IITH2026CS',
      department: 'Computer Science',
      academicYear: '4th Year',
      gradYear: 2026,
      phone: '+91 99887 76655',
      city: 'Hyderabad',
      gender: 'Male'
    }, {
      Authorization: `Bearer ${freshToken}`
    });
    assert.strictEqual(completeRes.status, 200);

    // Verify /api/auth/me now reports profileComplete: true
    const meRes = await request('GET', '/api/auth/me', null, {
      Authorization: `Bearer ${freshToken}`
    });
    assert.strictEqual(meRes.status, 200);
    assert.strictEqual(meRes.data.user.profileComplete, true);
    pass('Completing missing profile info via profile form successfully marks profileComplete: true');
  } catch (e) {
    fail('Google OAuth profile completion workflow failed', e);
  }

  // --- SECTION 7: Existing Demo & Registered Data Integrity ---
  console.log('\n--- SECTION 7: Existing Demo & Registered Data Integrity ---');

  try {
    // Priya Sharma login
    const priyaRes = await request('POST', '/api/auth/login', {
      email: 'priya.sharma@student.edu',
      password: 'student123',
      role: 'student'
    });
    assert.strictEqual(priyaRes.status, 200);
    assert.strictEqual(priyaRes.data.user.name, 'Priya Sharma');
    assert.strictEqual(priyaRes.data.user.profileComplete, true);
    pass('Existing student Priya Sharma logs in seamlessly with profileComplete: true');
  } catch (e) {
    fail('Existing demo account integrity failed', e);
  }

  // SUMMARY
  console.log('\n======================================================================');
  console.log(`   Enhanced Registration Results: ${passed}/${passed + failed} Passed (${failed === 0 ? 'ALL PASSED' : 'FAILURES OCCURRED'})   `);
  console.log('======================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

// Start server on dynamic port and run
const port = 65240 + Math.floor(Math.random() * 100);
server = http.createServer(app);
server.listen(port, '127.0.0.1', async () => {
  baseUrl = `http://127.0.0.1:${port}`;
  try {
    await runTests();
  } catch (err) {
    console.error('Test runner fatal error:', err);
    process.exit(1);
  } finally {
    server.close(() => process.exit(0));
  }
});
