/**
 * Automated OAuth & Authentication Test Suite
 * Covers:
 * 1. Environment-aware Google OAuth Redirect URI Resolution & Protection (preventing localhost in production)
 * 2. Parity between authorization URL and token exchange callback URLs
 * 3. Rejection of untrusted / malicious redirect URIs
 * 4. Google Sign-In user creation & role assignment (defaulting safely to 'student')
 * 5. JWT token generation with valid id, email, and role
 * 6. Privilege escalation prevention
 * 7. Protected student dashboard access
 * 8. Session restoration on page refresh (/api/auth/me)
 * 9. Role-based authorization access controls (403/401 enforcement)
 * 10. Recruiter Google sign-in role preservation
 * 11. Email/password authentication preservation
 */

const http = require('http');
const assert = require('assert');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = require('../server/server');
const authController = require('../server/controllers/authController');
const { resolveGoogleCallbackUrl } = authController;

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

// Environment helper
const initialEnv = { ...process.env };
function resetEnv() {
  process.env = { ...initialEnv };
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
  console.log('===============================================================');
  console.log('   Campus Connect — Google OAuth & Authentication Test Suite   ');
  console.log('===============================================================\n');

  // Start test server on random port
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
    // SECTION 1: Redirect URI Resolution & Protection
    // -------------------------------------------------------------------------
    console.log('--- SECTION 1: Redirect URI Resolution & Protection ---');

    await runTest('Production rejects localhost GOOGLE_CALLBACK_URL and falls back to production request host', async () => {
      resetEnv();
      process.env.NODE_ENV = 'production';
      process.env.GOOGLE_CALLBACK_URL = 'http://localhost:5173/auth/google/callback';
      process.env.CLIENT_ORIGIN = 'https://college-placement-management-portal.vercel.app';

      const req = {
        headers: {
          'x-forwarded-host': 'college-placement-management-portal.vercel.app',
          'x-forwarded-proto': 'https'
        }
      };

      const resolved = resolveGoogleCallbackUrl(req);
      assert.strictEqual(
        resolved,
        'https://college-placement-management-portal.vercel.app/auth/google/callback'
      );
      assert(!resolved.includes('localhost'), 'Must not contain localhost in production!');
    });

    await runTest('Production dynamically resolves from x-forwarded-host without env vars', async () => {
      resetEnv();
      process.env.NODE_ENV = 'production';
      delete process.env.GOOGLE_CALLBACK_URL;
      delete process.env.CLIENT_ORIGIN;
      delete process.env.FRONTEND_URL;

      const req = {
        headers: {
          'x-forwarded-host': 'college-placement-management-portal.vercel.app',
          'x-forwarded-proto': 'https'
        }
      };

      const resolved = resolveGoogleCallbackUrl(req);
      assert.strictEqual(
        resolved,
        'https://college-placement-management-portal.vercel.app/auth/google/callback'
      );
    });

    await runTest('Production rejects untrusted attacker-controlled redirect_uri', async () => {
      resetEnv();
      process.env.NODE_ENV = 'production';
      process.env.CLIENT_ORIGIN = 'https://college-placement-management-portal.vercel.app';

      const req = {
        headers: {
          'x-forwarded-host': 'college-placement-management-portal.vercel.app',
          'x-forwarded-proto': 'https'
        }
      };

      const maliciousCandidate = 'https://attacker.evil.com/auth/google/callback';
      const resolved = resolveGoogleCallbackUrl(req, maliciousCandidate);

      assert.strictEqual(
        resolved,
        'https://college-placement-management-portal.vercel.app/auth/google/callback'
      );
      assert(!resolved.includes('attacker.evil.com'));
    });

    await runTest('Development mode correctly preserves http://localhost:5173/auth/google/callback', async () => {
      resetEnv();
      process.env.NODE_ENV = 'development';
      delete process.env.VERCEL;

      const req = {
        headers: { host: 'localhost:5001' }
      };

      const resolved = resolveGoogleCallbackUrl(req);
      assert.strictEqual(resolved, 'http://localhost:5173/auth/google/callback');
    });

    await runTest('getGoogleAuthUrl endpoint produces production OAuth URL in prod', async () => {
      resetEnv();
      process.env.NODE_ENV = 'production';
      process.env.GOOGLE_CLIENT_ID = 'test-client-id.apps.googleusercontent.com';
      process.env.GOOGLE_CLIENT_SECRET = 'test-secret';
      process.env.CLIENT_ORIGIN = 'https://college-placement-management-portal.vercel.app';

      const req = {
        query: { role: 'student' },
        headers: {
          'x-forwarded-host': 'college-placement-management-portal.vercel.app',
          'x-forwarded-proto': 'https'
        }
      };

      let responseData = null;
      const res = {
        status: (code) => {
          assert.strictEqual(code, 200);
          return { json: (data) => { responseData = data; } };
        }
      };

      await authController.getGoogleAuthUrl(req, res);
      assert(responseData, 'Response data must not be empty');
      assert.strictEqual(responseData.success, true);
      assert.strictEqual(
        responseData.callbackUrl,
        'https://college-placement-management-portal.vercel.app/auth/google/callback'
      );

      const authUrl = new URL(responseData.url);
      assert.strictEqual(
        authUrl.searchParams.get('redirect_uri'),
        'https://college-placement-management-portal.vercel.app/auth/google/callback'
      );
    });

    // -------------------------------------------------------------------------
    // SECTION 2: End-to-End API Authentication, Token Payload & RBAC
    // -------------------------------------------------------------------------
    console.log('\n--- SECTION 2: End-to-End API Authentication, Token Payload & RBAC ---');
    resetEnv();

    let studentToken = null;

    await runTest('Google Sign-In creates new student with valid token and user.role="student"', async () => {
      const googleRes = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_student_verified_99',
        state: Buffer.from(JSON.stringify({ role: 'student' })).toString('base64')
      });

      assert.strictEqual(googleRes.status, 200);
      assert.strictEqual(googleRes.body.success, true);
      assert.ok(googleRes.body.token);
      assert.strictEqual(googleRes.body.user.role, 'student');
      studentToken = googleRes.body.token;
    });

    await runTest('Google Sign-In Account 1 creates distinct student with genuine name and email', async () => {
      const res1 = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_balraj_pranay',
        state: Buffer.from(JSON.stringify({ role: 'student' })).toString('base64')
      });

      assert.strictEqual(res1.status, 200);
      assert.strictEqual(res1.body.success, true);
      assert.ok(res1.body.token);
      assert.strictEqual(res1.body.user.role, 'student');
      assert.strictEqual(res1.body.user.name, 'Balraj Pranay');
      assert.strictEqual(res1.body.user.email, 'balraj.pranay@gmail.com');
      studentToken = res1.body.token;
    });

    await runTest('Account 1 Dashboard returns student.name="Balraj Pranay" and isolated 0 applications', async () => {
      const dashRes = await request('GET', '/api/students/dashboard', null, {
        Authorization: `Bearer ${studentToken}`
      });

      assert.strictEqual(dashRes.status, 200);
      assert.strictEqual(dashRes.body.success, true);
      assert.strictEqual(dashRes.body.data.student.name, 'Balraj Pranay');
      assert.notStrictEqual(dashRes.body.data.student.name, 'Priya Sharma', 'Must not show Priya Sharma');
      assert.strictEqual(dashRes.body.data.app_count, 0, 'New student must start with 0 applications, not Priya demo count');
    });

    await runTest('Account 1 /api/auth/me session restore returns "Balraj Pranay"', async () => {
      const meRes = await request('GET', '/api/auth/me', null, {
        Authorization: `Bearer ${studentToken}`
      });

      assert.strictEqual(meRes.status, 200);
      assert.strictEqual(meRes.body.user.name, 'Balraj Pranay');
      assert.strictEqual(meRes.body.user.email, 'balraj.pranay@gmail.com');
      assert.strictEqual(meRes.body.user.role, 'student');
    });

    let studentToken2 = null;
    await runTest('Google Sign-In Account 2 creates distinct user and student record (different ID and name)', async () => {
      const res2 = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_aarav_mehta',
        state: Buffer.from(JSON.stringify({ role: 'student' })).toString('base64')
      });

      assert.strictEqual(res2.status, 200);
      assert.strictEqual(res2.body.success, true);
      assert.ok(res2.body.token);
      assert.strictEqual(res2.body.user.role, 'student');
      assert.strictEqual(res2.body.user.name, 'Aarav Mehta');
      assert.strictEqual(res2.body.user.email, 'aarav.mehta@gmail.com');
      assert.notStrictEqual(res2.body.user.id, jwt.verify(studentToken, JWT_SECRET).id, 'IDs must be distinct');
      studentToken2 = res2.body.token;
    });

    await runTest('Account 2 Dashboard returns student.name="Aarav Mehta" without cross-contamination', async () => {
      const dashRes2 = await request('GET', '/api/students/dashboard', null, {
        Authorization: `Bearer ${studentToken2}`
      });

      assert.strictEqual(dashRes2.status, 200);
      assert.strictEqual(dashRes2.body.success, true);
      assert.strictEqual(dashRes2.body.data.student.name, 'Aarav Mehta');
      assert.notStrictEqual(dashRes2.body.data.student.name, 'Balraj Pranay');
      assert.notStrictEqual(dashRes2.body.data.student.name, 'Priya Sharma');
      assert.strictEqual(dashRes2.body.data.app_count, 0);
    });

    await runTest('Account 2 /api/auth/me session restore returns "Aarav Mehta"', async () => {
      const meRes2 = await request('GET', '/api/auth/me', null, {
        Authorization: `Bearer ${studentToken2}`
      });

      assert.strictEqual(meRes2.status, 200);
      assert.strictEqual(meRes2.body.user.name, 'Aarav Mehta');
      assert.strictEqual(meRes2.body.user.email, 'aarav.mehta@gmail.com');
    });

    let recruiterToken = null;
    await runTest('Authorized recruiter Google login successfully reaches Recruiter Dashboard', async () => {
      const recRes = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_recruiter_authorized',
        role: 'recruiter',
        state: Buffer.from(JSON.stringify({ role: 'recruiter' })).toString('base64')
      });

      assert.strictEqual(recRes.status, 200);
      assert.strictEqual(recRes.body.success, true);
      assert.ok(recRes.body.token);
      assert.strictEqual(recRes.body.user.role, 'recruiter');
      recruiterToken = recRes.body.token;

      // Access recruiter dashboard with recruiter token
      const recDashRes = await request('GET', '/api/recruiters/dashboard', null, {
        Authorization: `Bearer ${recruiterToken}`
      });
      assert.strictEqual(recDashRes.status, 200);
      assert.strictEqual(recDashRes.body.success, true);
    });

    let adminToken = null;
    await runTest('Authorized admin Google login successfully reaches Admin Portal', async () => {
      const admRes = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_admin_authorized',
        role: 'admin',
        state: Buffer.from(JSON.stringify({ role: 'admin' })).toString('base64')
      });

      assert.strictEqual(admRes.status, 200);
      assert.strictEqual(admRes.body.success, true);
      assert.ok(admRes.body.token);
      assert.strictEqual(admRes.body.user.role, 'admin');
      adminToken = admRes.body.token;

      // Access admin drives endpoint with admin token
      const admDrivesRes = await request('GET', '/api/admin/drives', null, {
        Authorization: `Bearer ${adminToken}`
      });
      assert.strictEqual(admDrivesRes.status, 200);
    });

    await runTest('Student account attempting recruiter login is strictly denied (403)', async () => {
      const deniedRes = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_balraj_pranay',
        role: 'recruiter',
        state: Buffer.from(JSON.stringify({ role: 'recruiter' })).toString('base64')
      });

      assert.strictEqual(deniedRes.status, 403);
      assert.strictEqual(deniedRes.body.success, false);
      assert(deniedRes.body.message.includes('registered as a Student'), 'Must clearly explain student role mismatch');
    });

    await runTest('Student account attempting admin login is strictly denied (403)', async () => {
      const deniedRes = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_balraj_pranay',
        role: 'admin',
        state: Buffer.from(JSON.stringify({ role: 'admin' })).toString('base64')
      });

      assert.strictEqual(deniedRes.status, 403);
      assert.strictEqual(deniedRes.body.success, false);
      assert(deniedRes.body.message.includes('not authorized as a Placement Administrator'));
    });

    await runTest('Unregistered account attempting admin login is strictly denied (403)', async () => {
      const deniedRes = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_random_stranger_unauthorized',
        role: 'admin',
        state: Buffer.from(JSON.stringify({ role: 'admin' })).toString('base64')
      });

      assert.strictEqual(deniedRes.status, 403);
      assert.strictEqual(deniedRes.body.success, false);
      assert(deniedRes.body.message.includes('not authorized'));
    });

    await runTest('Unregistered account attempting recruiter login is strictly denied (403)', async () => {
      const deniedRes = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_random_stranger_unauthorized',
        role: 'recruiter',
        state: Buffer.from(JSON.stringify({ role: 'recruiter' })).toString('base64')
      });

      assert.strictEqual(deniedRes.status, 403);
      assert.strictEqual(deniedRes.body.success, false);
      assert(deniedRes.body.message.includes('not registered or authorized as a Recruiter'));
    });

    await runTest('Missing, invalid, or tampered role in callback/state is rejected safely (400)', async () => {
      const tamperedRes = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_tampered_test',
        role: 'superadmin',
        state: Buffer.from(JSON.stringify({ role: 'superadmin' })).toString('base64')
      });

      assert.strictEqual(tamperedRes.status, 400);
      assert.strictEqual(tamperedRes.body.success, false);

      const invalidUrlRes = await request('GET', '/api/auth/google/url?role=hacker_role');
      assert.strictEqual(invalidUrlRes.status, 400);
    });

    await runTest('Role-based access control blocks student from recruiter dashboard (403)', async () => {
      const forbiddenRes = await request('GET', '/api/recruiters/dashboard', null, {
        Authorization: `Bearer ${studentToken}`
      });

      assert.strictEqual(forbiddenRes.status, 403);
    });

    await runTest('Role-based access control blocks recruiter from admin portal (403)', async () => {
      const forbiddenRes = await request('GET', '/api/admin/drives', null, {
        Authorization: `Bearer ${recruiterToken}`
      });

      assert.strictEqual(forbiddenRes.status, 403);
    });

    await runTest('Traditional email/password login is fully preserved for student, recruiter, and admin', async () => {
      // 1. Student login
      const stuLogin = await request('POST', '/api/auth/login', {
        email: 'priya.sharma@student.edu',
        password: 'student123',
        role: 'student'
      });
      assert.strictEqual(stuLogin.status, 200);
      assert.strictEqual(stuLogin.body.user.role, 'student');
      assert.strictEqual(stuLogin.body.user.name, 'Priya Sharma');

      // 2. Recruiter login
      const recLogin = await request('POST', '/api/auth/login', {
        email: 'hr@technova.com',
        password: 'recruiter123',
        role: 'recruiter'
      });
      assert.strictEqual(recLogin.status, 200);
      assert.strictEqual(recLogin.body.user.role, 'recruiter');

      // 3. Admin login
      const admLogin = await request('POST', '/api/auth/login', {
        email: 'admin@college.edu',
        password: 'admin123',
        role: 'admin'
      });
      assert.strictEqual(admLogin.status, 200);
      assert.strictEqual(admLogin.body.user.role, 'admin');
    });

  } finally {
    resetEnv();
    if (server) {
      server.close();
    }
  }

  console.log('\n===============================================================');
  console.log(`   Test Results: ${passedTests}/${totalTests} Passed (${passedTests === totalTests ? 'ALL PASSED' : 'FAILURES OCCURRED'})   `);
  console.log('===============================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
  process.exit(0);
}

runAll().catch(err => {
  console.error('Test suite runner failed:', err);
  process.exit(1);
});
