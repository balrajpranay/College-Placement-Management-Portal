/**
 * Campus Connect — Recruiter Approval & Placement Admin Drives View Test Suite
 *
 * Verifies:
 * 1. Recruiter registration defaults to approved: false
 * 2. Recruiter profile and dashboard initially return approved: false (restrictions active)
 * 3. Unapproved recruiter is blocked from posting drives (403)
 * 4. Placement Admin approves the recruiter via PUT /api/admin/recruiters/:id/approve
 * 5. Recruiter profile and dashboard now return approved: true
 * 6. Approved recruiter can now create placement opportunities successfully
 * 7. Logging out and logging back in preserves approved: true
 * 8. Placement Admin can view individual drive details via GET /api/admin/drives/:id
 * 9. GET /api/admin/drives and GET /api/admin/drives/:id provide complete real data
 *    (title, jobType, companyName, location, ctc, minCgpa, maxBacklogs, branches, skills,
 *     responsibilities, recruiter contact, deadline, submissionDate, approvalStatus)
 * 10. Placement Admin can reject/revoke recruiter approval and restrictions re-apply
 * 11. Recruiter company approval remains strictly separate from job-posting approval
 */

const http = require('http');
const assert = require('assert');
const jwt = require('jsonwebtoken');

const app = require('../server/server');
const { recruiterStore } = require('../server/controllers/recruiterController');
const { memoryCompanies } = require('../server/controllers/authController');

const JWT_SECRET = process.env.JWT_SECRET || 'campus_connect_jwt_secret_dev_key';

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
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, body: json });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function makeToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

let passedTests = 0;
let totalTests = 0;

async function runTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log('✅ [PASS] ' + name);
    passedTests++;
  } catch (err) {
    console.error('❌ [FAIL] ' + name);
    console.error('   Error: ' + err.message);
  }
}

async function runAll() {
  console.log('======================================================================');
  console.log('   Campus Connect — Recruiter Approval & Admin View Test Suite       ');
  console.log('======================================================================\n');

  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = 'http://127.0.0.1:' + port;
      console.log('Test server running at ' + baseUrl + '\n');
      resolve();
    });
  });

  const adminToken = makeToken({
    id: '65e000000000000000000001',
    email: 'pranay.b9106@gmail.com',
    role: 'admin',
    name: 'Placement Admin'
  });

  const testRecruiterEmail = 'talent.lead@acmecorp.com';
  let recruiterToken = '';
  let recruiterUserId = '';
  let recruiterCompanyId = '';

  console.log('--- SECTION 1: Recruiter Registration & Initial Pending Approval ---');

  await runTest('Recruiter registers with approved: false', async () => {
    const res = await request('POST', '/api/auth/register/recruiter', {
      name: 'Acme Corporation',
      industry: 'Enterprise Software',
      website: 'https://acme.example.com',
      hrContact: 'Samantha Ray',
      hrPosition: 'Director of Campus Hiring',
      govId: 'ACME-CORP-9876',
      email: testRecruiterEmail,
      phone: '+91 98765 12345',
      location: 'Hyderabad',
      city: 'Hyderabad',
      gender: 'Female',
      description: 'Global cloud solutions and software development.',
      password: 'RecruiterSecure123',
      confirmPassword: 'RecruiterSecure123'
    });

    assert.strictEqual(res.status, 201, 'Should register recruiter successfully');
    assert.strictEqual(res.body.success, true);
    recruiterUserId = res.body.user.id;
  });

  await runTest('Recruiter logs in and receives token with pending verification', async () => {
    const res = await request('POST', '/api/auth/login', {
      email: testRecruiterEmail,
      password: 'RecruiterSecure123',
      role: 'recruiter'
    });

    assert.strictEqual(res.status, 200);
    recruiterToken = res.body.token;
    assert.ok(recruiterToken, 'Should receive valid token');
  });

  await runTest('Recruiter profile returns approved: false', async () => {
    const res = await request('GET', '/api/recruiters/profile', null, {
      Authorization: `Bearer ${recruiterToken}`
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.company.approved, false, 'Initial profile must show approved: false');
    recruiterCompanyId = res.body.company.id;
  });

  await runTest('Recruiter dashboard returns approved: false and Corporate Account Under Review', async () => {
    const res = await request('GET', '/api/recruiters/dashboard', null, {
      Authorization: `Bearer ${recruiterToken}`
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.approved, false, 'Dashboard must indicate unapproved account');
    assert.strictEqual(res.body.message, 'Corporate Account Under Review');
  });

  await runTest('Unapproved recruiter is strictly blocked from posting drives (403)', async () => {
    const res = await request('POST', '/api/recruiters/drives', {
      title: 'Senior Systems Engineer',
      job_type: 'Full-Time',
      ctc: 14.5,
      location: 'Hyderabad',
      openings: 5,
      deadline: '2026-11-30',
      min_cgpa: 7.0,
      max_backlogs: 0,
      branches: ['Computer Science', 'Information Technology'],
      skills: ['Go', 'Kubernetes', 'Microservices'],
      description: 'Building high-scale distributed backend systems.'
    }, {
      Authorization: `Bearer ${recruiterToken}`
    });

    assert.strictEqual(res.status, 403, 'Must return 403 for unapproved recruiter');
    assert.ok(res.body.message.includes('Access Restricted'), 'Must explain verification requirement');
  });

  console.log('\n--- SECTION 2: Placement Admin Approves Recruiter ---');

  await runTest('Admin approves recruiter company via PUT /api/admin/recruiters/:id/approve', async () => {
    const targetId = recruiterCompanyId || recruiterUserId || testRecruiterEmail;
    const res = await request('PUT', `/api/admin/recruiters/${targetId}/approve`, null, {
      Authorization: `Bearer ${adminToken}`
    });

    assert.strictEqual(res.status, 200, 'Admin approval must succeed');
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.approved, true, 'Company record must now have approved: true');
  });

  await runTest('Recruiter portal fetches latest profile: approved is now true', async () => {
    const res = await request('GET', '/api/recruiters/profile', null, {
      Authorization: `Bearer ${recruiterToken}`
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.company.approved, true, 'Profile must reflect approved: true');
  });

  await runTest('Recruiter portal fetches latest dashboard: approved is now true and metrics accessible', async () => {
    const res = await request('GET', '/api/recruiters/dashboard', null, {
      Authorization: `Bearer ${recruiterToken}`
    });

    assert.strictEqual(res.status, 200);
    assert.notStrictEqual(res.body.approved, false, 'Pending approval message must disappear');
    assert.ok(res.body.company.approved === true, 'Dashboard company must be approved');
    assert.ok(res.body.stats !== undefined, 'Hiring metrics must now be returned');
  });

  await runTest('Approved recruiter can now post opportunities without restriction', async () => {
    const res = await request('POST', '/api/recruiters/drives', {
      title: 'Senior Systems Engineer',
      job_type: 'Full-Time',
      ctc: 14.5,
      location: 'Hyderabad',
      openings: 5,
      deadline: '2026-11-30',
      min_cgpa: 7.0,
      max_backlogs: 0,
      branches: ['Computer Science', 'Information Technology'],
      skills: ['Go', 'Kubernetes', 'Microservices'],
      description: 'Building high-scale distributed backend systems.'
    }, {
      Authorization: `Bearer ${recruiterToken}`
    });

    assert.strictEqual(res.status, 201, 'Should create opportunity after approval');
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.drive.title, 'Senior Systems Engineer');
    // Note: The new drive defaults to pending job approval, keeping recruiter approval and drive approval separate
    assert.strictEqual(res.body.drive.approvalStatus || res.body.drive.approval_status, 'pending');
  });

  await runTest('Signing out and signing in again preserves approved: true', async () => {
    const loginRes = await request('POST', '/api/auth/login', {
      email: testRecruiterEmail,
      password: 'RecruiterSecure123',
      role: 'recruiter'
    });
    assert.strictEqual(loginRes.status, 200);
    const newToken = loginRes.body.token;

    const profRes = await request('GET', '/api/recruiters/profile', null, {
      Authorization: `Bearer ${newToken}`
    });
    assert.strictEqual(profRes.status, 200);
    assert.strictEqual(profRes.body.company.approved, true, 'Approval must persist across logins');

    const dashRes = await request('GET', '/api/recruiters/dashboard', null, {
      Authorization: `Bearer ${newToken}`
    });
    assert.strictEqual(dashRes.status, 200);
    assert.ok(dashRes.body.company.approved === true, 'Dashboard must remain approved');
  });

  console.log('\n--- SECTION 3: Placement Admin Drives & View Details Endpoint ---');

  let sampleDriveId = '';

  await runTest('Admin fetches drives list: all required fields are present and company details resolved', async () => {
    const res = await request('GET', '/api/admin/drives', null, {
      Authorization: `Bearer ${adminToken}`
    });

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.data), 'Drives must be an array');
    assert.ok(res.body.data.length > 0, 'Must have at least one drive');

    const sample = res.body.data[0];
    sampleDriveId = sample.id || sample._id;

    assert.ok(sample.title, 'Drive must have title');
    assert.ok(sample.jobType, 'Drive must have jobType');
    assert.ok(sample.companyName, 'Drive must have companyName');
    assert.notStrictEqual(sample.companyName, '', 'Company name must not be empty');
    assert.ok(sample.location, 'Drive must have location');
    assert.ok(sample.ctc !== undefined, 'Drive must have ctc');
    assert.ok(sample.deadline, 'Drive must have deadline');
    assert.ok(sample.submissionDate || sample.createdAt, 'Drive must have submission date');
    assert.ok(sample.recruiterEmail || sample.companyEmail, 'Drive must have recruiter email');
    assert.ok(sample.approvalStatus, 'Drive must have approvalStatus');
    assert.ok(Array.isArray(sample.branches), 'branches must be an array');
    assert.ok(Array.isArray(sample.skills), 'skills must be an array');
  });

  await runTest('Admin fetches single drive details via GET /api/admin/drives/:id', async () => {
    const res = await request('GET', `/api/admin/drives/${sampleDriveId}`, null, {
      Authorization: `Bearer ${adminToken}`
    });

    assert.strictEqual(res.status, 200, 'Drive detail endpoint must return 200');
    assert.strictEqual(res.body.success, true);
    const drive = res.body.data;

    assert.ok(drive.title, 'Must contain title');
    assert.ok(drive.companyName, 'Must contain companyName');
    assert.ok(drive.description, 'Must contain job description');
    assert.ok(drive.location, 'Must contain location');
    assert.ok(drive.ctc !== undefined, 'Must contain salary/package');
    assert.ok(drive.minCgpa !== undefined, 'Must contain min CGPA');
    assert.ok(drive.maxBacklogs !== undefined, 'Must contain max backlogs');
    assert.ok(Array.isArray(drive.branches), 'branches must be array');
    assert.ok(Array.isArray(drive.skills), 'skills must be array');
    assert.ok(drive.deadline, 'Must contain deadline');
    assert.ok(drive.submissionDate, 'Must contain submissionDate');
    assert.ok(drive.recruiterName, 'Must contain recruiter name');
    assert.ok(drive.recruiterEmail, 'Must contain recruiter email');
    assert.ok(drive.approvalStatus, 'Must contain approval status');
  });

  console.log('\n--- SECTION 4: Recruiter Rejection / Revocation Workflow ---');

  await runTest('Admin revokes recruiter approval: status reverts to unapproved', async () => {
    const targetId = recruiterCompanyId || recruiterUserId || testRecruiterEmail;
    const res = await request('PUT', `/api/admin/recruiters/${targetId}/reject`, null, {
      Authorization: `Bearer ${adminToken}`
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.approved, false, 'Status must revert to false');

    const profRes = await request('GET', '/api/recruiters/profile', null, {
      Authorization: `Bearer ${recruiterToken}`
    });
    assert.strictEqual(profRes.body.company.approved, false, 'Profile must reflect revoked status');
  });

  await runTest('Individual job-posting approval remains separate from recruiter approval', async () => {
    // Re-approve recruiter
    const targetId = recruiterCompanyId || recruiterUserId || testRecruiterEmail;
    await request('PUT', `/api/admin/recruiters/${targetId}/approve`, null, {
      Authorization: `Bearer ${adminToken}`
    });

    // Check drives: posting has its own approval status
    const res = await request('GET', '/api/admin/drives', null, {
      Authorization: `Bearer ${adminToken}`
    });
    const pendingDrives = res.body.data.filter(d => (d.approvalStatus || d.approval_status) === 'pending');
    assert.ok(pendingDrives.length >= 1, 'Drive approval must remain independent');
  });

  await new Promise(resolve => server.close(resolve));

  console.log('\n======================================================================');
  console.log(`   Recruiter Approval & Admin View Results: ${passedTests}/${totalTests} Passed (${passedTests === totalTests ? 'ALL PASSED' : 'SOME FAILED'})   `);
  console.log('======================================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runAll().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
