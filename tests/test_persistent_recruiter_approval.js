/**
 * Test Suite: Persistent Recruiter Approval Workflow
 *
 * Verifies:
 * 1. Recruiter signs in using Google for the first time -> profile created with PENDING approval status (approved: false)
 * 2. Recruiter dashboard returns Corporate Account Under Review (approved: false)
 * 3. Unapproved recruiter is blocked from posting drives (403)
 * 4. Placement Admin approves the recruiter via PUT /api/admin/recruiters/:id/approve
 * 5. Approval status is saved in database/store (approved: true)
 * 6. Recruiter signs out
 * 7. Recruiter signs in again using the same Google email
 * 8. System recognizes the existing account and its APPROVED status (approved: true)
 * 9. Recruiter directly accesses the dashboard without requesting approval again
 * 10. Recruiter can post opportunities
 * 11. Third login still preserves approval
 * 12. Rejected recruiter remains rejected upon subsequent Google logins
 */

const http = require('http');
const assert = require('assert');
const jwt = require('jsonwebtoken');

const app = require('../server/server');
const { recruiterStore } = require('../server/controllers/recruiterController');
const { memoryCompanies, memoryUsers } = require('../server/controllers/authController');

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
  console.log('   Campus Connect — Persistent Recruiter Approval Test Suite         ');
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

  const recruiterCode = 'demo_google_recruiter_persistentcorp';
  let firstRecruiterToken = '';
  let recruiterCompanyId = '';
  let recruiterUserId = '';

  console.log('--- STEP 1 & 2: First-time Recruiter Google Sign-In & Pending Approval ---');

  await runTest('1. First Google login creates profile with PENDING approval status', async () => {
    const res = await request('POST', '/api/auth/google/callback', {
      code: recruiterCode,
      role: 'recruiter',
      state: Buffer.from(JSON.stringify({ role: 'recruiter' })).toString('base64')
    });

    assert.strictEqual(res.status, 200, 'Google login should succeed');
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.role, 'recruiter');
    assert.strictEqual(res.body.user.profile.approved, false, 'First-time recruiter profile must have approved: false');
    firstRecruiterToken = res.body.token;
    recruiterUserId = res.body.user.id;
    recruiterCompanyId = res.body.user.profile.id || res.body.user.profile._id;
  });

  await runTest('2. Recruiter dashboard initially returns Corporate Account Under Review (approved: false)', async () => {
    const res = await request('GET', '/api/recruiters/dashboard', null, {
      Authorization: `Bearer ${firstRecruiterToken}`
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.approved, false, 'Dashboard must indicate unapproved account');
    assert.strictEqual(res.body.message, 'Corporate Account Under Review');
  });

  await runTest('3. Unapproved recruiter cannot post opportunities (403)', async () => {
    const res = await request('POST', '/api/recruiters/drives', {
      title: 'Cloud DevOps Engineer',
      job_type: 'Full-Time',
      ctc: 12.0,
      location: 'Hyderabad',
      openings: 3,
      deadline: '2026-12-15',
      min_cgpa: 7.0,
      max_backlogs: 0,
      branches: ['Computer Science'],
      skills: ['AWS', 'Docker', 'Linux'],
      description: 'Managing cloud infrastructure and CI/CD pipelines.'
    }, {
      Authorization: `Bearer ${firstRecruiterToken}`
    });

    assert.strictEqual(res.status, 403, 'Must return 403 for unapproved recruiter');
  });

  console.log('\n--- STEP 3 & 4: Placement Admin Approves Recruiter ---');

  await runTest('4. Placement Admin approves the recruiter via PUT /api/admin/recruiters/:id/approve', async () => {
    const targetId = recruiterCompanyId || recruiterUserId || 'recruiter.persistentcorp@gmail.com';
    const res = await request('PUT', `/api/admin/recruiters/${targetId}/approve`, null, {
      Authorization: `Bearer ${adminToken}`
    });

    assert.strictEqual(res.status, 200, 'Admin approval must succeed');
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.approved, true, 'Company record must now have approved: true');
  });

  console.log('\n--- STEP 5, 6, 7 & 8: Recruiter Signs Out and Signs Back In Via Google ---');

  let secondRecruiterToken = '';
  await runTest('5 & 6. Recruiter signs in again using the same Google email', async () => {
    const res = await request('POST', '/api/auth/google/callback', {
      code: recruiterCode,
      role: 'recruiter',
      state: Buffer.from(JSON.stringify({ role: 'recruiter' })).toString('base64')
    });

    assert.strictEqual(res.status, 200, 'Subsequent Google login should succeed');
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.role, 'recruiter');
    assert.strictEqual(res.body.user.profile.approved, true, 'Subsequent login MUST recognize APPROVED status (approved: true)');
    secondRecruiterToken = res.body.token;
  });

  await runTest('7 & 8. Recruiter directly accesses dashboard without requesting approval again', async () => {
    const res = await request('GET', '/api/recruiters/dashboard', null, {
      Authorization: `Bearer ${secondRecruiterToken}`
    });

    assert.strictEqual(res.status, 200);
    assert.notStrictEqual(res.body.approved, false, 'Pending approval message must NOT appear');
    assert.strictEqual(res.body.company.approved, true, 'Dashboard company must be approved');
    assert.ok(res.body.stats !== undefined, 'Hiring metrics must be accessible');
  });

  await runTest('9. Approved recruiter can now post opportunities', async () => {
    const res = await request('POST', '/api/recruiters/drives', {
      title: 'Cloud DevOps Engineer',
      job_type: 'Full-Time',
      ctc: 12.0,
      location: 'Hyderabad',
      openings: 3,
      deadline: '2026-12-15',
      min_cgpa: 7.0,
      max_backlogs: 0,
      branches: ['Computer Science'],
      skills: ['AWS', 'Docker', 'Linux'],
      description: 'Managing cloud infrastructure and CI/CD pipelines.'
    }, {
      Authorization: `Bearer ${secondRecruiterToken}`
    });

    assert.strictEqual(res.status, 201, 'Should create opportunity after approval');
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.drive.title, 'Cloud DevOps Engineer');
  });

  await runTest('10. Third Google login still preserves approved: true permanently', async () => {
    const res = await request('POST', '/api/auth/google/callback', {
      code: recruiterCode,
      role: 'recruiter',
      state: Buffer.from(JSON.stringify({ role: 'recruiter' })).toString('base64')
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.user.profile.approved, true, 'Third login MUST maintain approved: true');

    const dashRes = await request('GET', '/api/recruiters/dashboard', null, {
      Authorization: `Bearer ${res.body.token}`
    });
    assert.strictEqual(dashRes.status, 200);
    assert.strictEqual(dashRes.body.company.approved, true);
  });

  console.log('\n--- STEP 9: Rejection Workflow ---');

  await runTest('11. Rejected recruiter remains rejected upon subsequent Google logins', async () => {
    const targetId = recruiterCompanyId || recruiterUserId || 'recruiter.persistentcorp@gmail.com';
    const rejectRes = await request('PUT', `/api/admin/recruiters/${targetId}/reject`, null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert.strictEqual(rejectRes.status, 200);
    assert.strictEqual(rejectRes.body.data.approved, false);

    // Recruiter signs in again via Google
    const reLoginRes = await request('POST', '/api/auth/google/callback', {
      code: recruiterCode,
      role: 'recruiter',
      state: Buffer.from(JSON.stringify({ role: 'recruiter' })).toString('base64')
    });
    assert.strictEqual(reLoginRes.status, 200);
    assert.strictEqual(reLoginRes.body.user.profile.approved, false, 'Rejected recruiter must stay approved: false');

    // Dashboard returns review message
    const dashRes = await request('GET', '/api/recruiters/dashboard', null, {
      Authorization: `Bearer ${reLoginRes.body.token}`
    });
    assert.strictEqual(dashRes.status, 200);
    assert.strictEqual(dashRes.body.approved, false);
  });

  if (server) server.close();
  console.log('\n======================================================================');
  console.log(`   Persistent Recruiter Approval Results: ${passedTests}/${totalTests} Passed`);
  console.log('======================================================================\n');
  if (passedTests !== totalTests) {
    process.exit(1);
  }
  process.exit(0);
}

runAll().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
