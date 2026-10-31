/**
 * Campus Connect — Placement Admin Security Test Suite
 *
 * Exhaustively validates:
 * 1. Exactly 3 authorized admin email addresses permitted
 * 2. Authorized Admin 1 (pranay.b9106@gmail.com) Google login -> admin access (200)
 * 3. Authorized Admin 2 (ayeshaeram2005@gmail.com) Google login -> admin access (200)
 * 4. Authorized Admin 3 (kethapagabhavani9980@gmail.com) Google login -> admin access (200)
 * 5. Case-insensitivity & whitespace trimming during authorization
 * 6. Google email_verified claim requirement (unverified Google accounts rejected with 403)
 * 7. Unauthorized Google accounts denied admin access (403)
 * 8. Email/password login: password verification strictly precedes allowlist check
 * 9. Authorized admin without password receives 401 informing them to use Google
 * 10. Authorized admin with provisioned password logs in successfully (200)
 * 11. Unauthorized email attempting admin email/password login is rejected (401/403)
 * 12. Direct access to /api/admin/* without token rejected (401)
 * 13. Student & Recruiter tokens rejected from /api/admin/* (403)
 * 14. Forged / stale token with role='admin' for unauthorized email rejected at middleware (403)
 * 15. Role demotion in /api/auth/me for revoked / unauthorized admin tokens
 * 16. Preservation of Student login and features
 * 17. Preservation of Recruiter login and features
 */

const http = require('http');
const assert = require('assert');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = require('../server/server');
const authController = require('../server/controllers/authController');
const { isAuthorizedAdminEmail, getAuthorizedAdminEmails } = require('../server/config/adminAllowlist');

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
      res.on('data', chunk => { data += chunk; });
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

let passedTests = 0;
let totalTests = 0;

async function runTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}`);
    console.error(`   Error: ${err.message}`);
  }
}

async function runAll() {
  console.log('======================================================================');
  console.log('   Campus Connect — Placement Admin Security & Allowlist Test Suite   ');
  console.log('======================================================================\n');

  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      console.log(`Test server running at ${baseUrl}\n`);
      resolve();
    });
  });

  try {
    // -------------------------------------------------------------------------
    // SECTION 1: Allowlist Configuration & Normalization
    // -------------------------------------------------------------------------
    console.log('--- SECTION 1: Allowlist Configuration & Normalization ---');

    await runTest('Allowlist contains exactly 3 authorized email addresses', () => {
      const emails = getAuthorizedAdminEmails();
      assert.strictEqual(emails.length, 3, 'Must contain exactly 3 emails');
      assert.ok(emails.includes('pranay.b9106@gmail.com'));
      assert.ok(emails.includes('ayeshaeram2005@gmail.com'));
      assert.ok(emails.includes('kethapagabhavani9980@gmail.com'));
    });

    await runTest('isAuthorizedAdminEmail normalizes uppercase and whitespace', () => {
      assert.strictEqual(isAuthorizedAdminEmail('  PRANAY.B9106@GMAIL.COM  '), true);
      assert.strictEqual(isAuthorizedAdminEmail('AyeshaEram2005@Gmail.Com'), true);
      assert.strictEqual(isAuthorizedAdminEmail('  kethapagabhavani9980@gmail.com '), true);
      assert.strictEqual(isAuthorizedAdminEmail('admin@college.edu'), false, 'Old admin must not be authorized');
      assert.strictEqual(isAuthorizedAdminEmail('attacker@evil.com'), false);
      assert.strictEqual(isAuthorizedAdminEmail(''), false);
      assert.strictEqual(isAuthorizedAdminEmail(null), false);
    });

    // -------------------------------------------------------------------------
    // SECTION 2: Google Authentication Admin Authorization
    // -------------------------------------------------------------------------
    console.log('\n--- SECTION 2: Google Authentication Admin Authorization ---');

    let admin1Token = null;
    await runTest('Admin 1 (pranay.b9106@gmail.com) Google login succeeds and gets role="admin"', async () => {
      const res = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_admin1',
        role: 'admin',
        state: Buffer.from(JSON.stringify({ role: 'admin' })).toString('base64')
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.user.role, 'admin');
      assert.strictEqual(res.body.user.email, 'pranay.b9106@gmail.com');
      assert.ok(res.body.token);
      admin1Token = res.body.token;

      // Access admin endpoint
      const driveRes = await request('GET', '/api/admin/drives', null, {
        Authorization: `Bearer ${admin1Token}`
      });
      assert.strictEqual(driveRes.status, 200);
    });

    let admin2Token = null;
    await runTest('Admin 2 (ayeshaeram2005@gmail.com) Google login succeeds and gets role="admin"', async () => {
      const res = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_admin2',
        role: 'admin',
        state: Buffer.from(JSON.stringify({ role: 'admin' })).toString('base64')
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.user.role, 'admin');
      assert.strictEqual(res.body.user.email, 'ayeshaeram2005@gmail.com');
      assert.ok(res.body.token);
      admin2Token = res.body.token;

      const driveRes = await request('GET', '/api/admin/drives', null, {
        Authorization: `Bearer ${admin2Token}`
      });
      assert.strictEqual(driveRes.status, 200);
    });

    let admin3Token = null;
    await runTest('Admin 3 (kethapagabhavani9980@gmail.com) Google login succeeds and gets role="admin"', async () => {
      const res = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_admin3',
        role: 'admin',
        state: Buffer.from(JSON.stringify({ role: 'admin' })).toString('base64')
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.user.role, 'admin');
      assert.strictEqual(res.body.user.email, 'kethapagabhavani9980@gmail.com');
      assert.ok(res.body.token);
      admin3Token = res.body.token;

      const driveRes = await request('GET', '/api/admin/drives', null, {
        Authorization: `Bearer ${admin3Token}`
      });
      assert.strictEqual(driveRes.status, 200);
    });

    await runTest('Unverified Google email for an authorized address is rejected with 403', async () => {
      const res = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_admin1_unverified',
        role: 'admin',
        state: Buffer.from(JSON.stringify({ role: 'admin' })).toString('base64')
      });

      assert.strictEqual(res.status, 403);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes('not verified'));
    });

    await runTest('Unauthorized 4th Google account attempting admin access is rejected with 403', async () => {
      const res = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_fourth_unauthorized_person',
        role: 'admin',
        state: Buffer.from(JSON.stringify({ role: 'admin' })).toString('base64')
      });

      assert.strictEqual(res.status, 403);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes('not authorized as a Placement Administrator'));
    });

    await runTest('Legacy admin@college.edu attempting Google admin login is rejected with 403', async () => {
      const res = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_admin@college.edu',
        role: 'admin',
        state: Buffer.from(JSON.stringify({ role: 'admin' })).toString('base64')
      });

      assert.strictEqual(res.status, 403);
      assert.strictEqual(res.body.success, false);
    });

    // -------------------------------------------------------------------------
    // SECTION 3: Email and Password Login & Order of Verification
    // -------------------------------------------------------------------------
    console.log('\n--- SECTION 3: Email & Password Login Controls ---');

    await runTest('Authorized admin without configured password receives clear 401 notice', async () => {
      // ayeshaeram2005@gmail.com is in allowlist but has no local password configured
      const res = await request('POST', '/api/auth/login', {
        email: 'ayeshaeram2005@gmail.com',
        password: 'SomeRandomPassword123!',
        role: 'admin'
      });

      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes('does not have a local password configured'));
      assert.ok(res.body.message.includes('Continue with Google'));
    });

    await runTest('Password verification precedes allowlist check for email/password', async () => {
      // Provision an admin account with a known password hash
      const hash = await bcrypt.hash('SecretAdminPass123!', 10);
      authController.memoryUsers.set('pranay.b9106@gmail.com', {
        _id: '507f1f77bcf86cd799439011',
        id: '507f1f77bcf86cd799439011',
        email: 'pranay.b9106@gmail.com',
        name: 'Pranay Balraj',
        passwordHash: hash,
        role: 'admin',
        isActive: true
      });

      // Wrong password attempt
      const wrongPassRes = await request('POST', '/api/auth/login', {
        email: 'pranay.b9106@gmail.com',
        password: 'IncorrectPassword!',
        role: 'admin'
      });

      assert.strictEqual(wrongPassRes.status, 401);
      assert.strictEqual(wrongPassRes.body.message, 'Invalid email or password.');
    });

    await runTest('Authorized admin with correct password logs in successfully (200)', async () => {
      const loginRes = await request('POST', '/api/auth/login', {
        email: 'pranay.b9106@gmail.com',
        password: 'SecretAdminPass123!',
        role: 'admin'
      });

      assert.strictEqual(loginRes.status, 200);
      assert.strictEqual(loginRes.body.success, true);
      assert.strictEqual(loginRes.body.user.role, 'admin');
      assert.ok(loginRes.body.token);

      // Verify token payload
      const decoded = jwt.verify(loginRes.body.token, JWT_SECRET);
      assert.strictEqual(decoded.role, 'admin');
      assert.strictEqual(decoded.email, 'pranay.b9106@gmail.com');
    });

    await runTest('Unauthorized user with password cannot login as admin (403)', async () => {
      // Student Priya has password student123
      const unauthAdminAttempt = await request('POST', '/api/auth/login', {
        email: 'priya.sharma@student.edu',
        password: 'student123',
        role: 'admin'
      });

      assert.strictEqual(unauthAdminAttempt.status, 403);
      assert.strictEqual(unauthAdminAttempt.body.success, false);
      assert.ok(unauthAdminAttempt.body.message.includes('not authorized as a Placement Administrator'));
    });

    await runTest('Non-existent unauthorized email gets 401', async () => {
      const res = await request('POST', '/api/auth/login', {
        email: 'stranger@nowhere.com',
        password: 'password123',
        role: 'admin'
      });

      assert.strictEqual(res.status, 401);
    });

    // -------------------------------------------------------------------------
    // SECTION 4: API Endpoint Protection & Token Tampering Prevention
    // -------------------------------------------------------------------------
    console.log('\n--- SECTION 4: API Endpoint Protection & Stale Token Defense ---');

    await runTest('Unauthenticated access to /api/admin/drives returns 401', async () => {
      const res = await request('GET', '/api/admin/drives');
      assert.strictEqual(res.status, 401);
    });

    let studentToken = null;
    await runTest('Student login succeeds and student token is rejected at /api/admin/* (403)', async () => {
      const stuLogin = await request('POST', '/api/auth/login', {
        email: 'priya.sharma@student.edu',
        password: 'student123',
        role: 'student'
      });
      assert.strictEqual(stuLogin.status, 200);
      studentToken = stuLogin.body.token;

      const adminRes = await request('GET', '/api/admin/drives', null, {
        Authorization: `Bearer ${studentToken}`
      });
      assert.strictEqual(adminRes.status, 403);
    });

    let recruiterToken = null;
    await runTest('Recruiter login succeeds and recruiter token is rejected at /api/admin/* (403)', async () => {
      const recLogin = await request('POST', '/api/auth/login', {
        email: 'hr@technova.com',
        password: 'recruiter123',
        role: 'recruiter'
      });
      assert.strictEqual(recLogin.status, 200);
      recruiterToken = recLogin.body.token;

      const adminRes = await request('GET', '/api/admin/drives', null, {
        Authorization: `Bearer ${recruiterToken}`
      });
      assert.strictEqual(adminRes.status, 403);
    });

    await runTest('Forged JWT token claiming role="admin" for unauthorized email is blocked outright (403)', async () => {
      // Craft a forged token signed with JWT_SECRET but with an unauthorized email
      const forgedToken = jwt.sign(
        {
          id: 'fake_attacker_id_999',
          email: 'attacker@evil.com',
          role: 'admin',
          name: 'Hacker'
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      const res = await request('GET', '/api/admin/drives', null, {
        Authorization: `Bearer ${forgedToken}`
      });

      assert.strictEqual(res.status, 403);
      assert.ok(res.body.message.includes('Administrator privileges are unauthorized'));
    });

    await runTest('Unauthorized admin token sent to /api/auth/me is rejected outright with 403 (no role demotion)', async () => {
      const forgedToken = jwt.sign(
        {
          id: 'fake_attacker_id_999',
          email: 'attacker@evil.com',
          role: 'admin',
          name: 'Hacker'
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      const res = await request('GET', '/api/auth/me', null, {
        Authorization: `Bearer ${forgedToken}`
      });

      assert.strictEqual(res.status, 403);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes('Administrator privileges are unauthorized'));
    });

    await runTest('Unauthorized admin token cannot access student endpoints through role demotion (403)', async () => {
      const forgedToken = jwt.sign(
        {
          id: 'fake_attacker_id_999',
          email: 'attacker@evil.com',
          role: 'admin',
          name: 'Hacker'
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      const res = await request('GET', '/api/students/dashboard', null, {
        Authorization: `Bearer ${forgedToken}`
      });

      assert.strictEqual(res.status, 403);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes('Administrator privileges are unauthorized'));
    });

    // -------------------------------------------------------------------------
    // SECTION 5: Student and Recruiter Preservation
    // -------------------------------------------------------------------------
    console.log('\n--- SECTION 5: Student & Recruiter Flow Preservation ---');

    await runTest('Student Google sign-in works normally', async () => {
      const res = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_student_test_security',
        role: 'student',
        state: Buffer.from(JSON.stringify({ role: 'student' })).toString('base64')
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.user.role, 'student');
      assert.ok(res.body.token);

      const dashRes = await request('GET', '/api/students/dashboard', null, {
        Authorization: `Bearer ${res.body.token}`
      });
      assert.strictEqual(dashRes.status, 200);
    });

    await runTest('Recruiter Google sign-in works normally', async () => {
      const res = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_recruiter_technova',
        role: 'recruiter',
        state: Buffer.from(JSON.stringify({ role: 'recruiter' })).toString('base64')
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.user.role, 'recruiter');
      assert.ok(res.body.token);

      const dashRes = await request('GET', '/api/recruiters/dashboard', null, {
        Authorization: `Bearer ${res.body.token}`
      });
      assert.strictEqual(dashRes.status, 200);
    });

  } finally {
    if (server) {
      server.close();
    }
  }

  console.log('\n======================================================================');
  console.log(`   Admin Security Results: ${passedTests}/${totalTests} Passed (${passedTests === totalTests ? 'ALL PASSED' : 'FAILURES OCCURRED'})   `);
  console.log('======================================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
  process.exit(0);
}

runAll().catch(err => {
  console.error('Admin security test runner failed:', err);
  process.exit(1);
});
