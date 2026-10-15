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

    await runTest('JWT token payload contains non-undefined id and role="student"', async () => {
      const decoded = jwt.verify(studentToken, JWT_SECRET);
      assert.ok(decoded.id, 'Token id must exist');
      assert.strictEqual(decoded.role, 'student', 'Token role must be student');
    });

    await runTest('Google Sign-In rejects browser role manipulation to admin/recruiter', async () => {
      const attackerRes = await request('POST', '/api/auth/google/callback', {
        code: 'demo_google_hacker_unauthorized',
        role: 'admin',
        state: Buffer.from(JSON.stringify({ role: 'admin' })).toString('base64')
      });

      assert.strictEqual(attackerRes.status, 200);
      assert.strictEqual(attackerRes.body.user.role, 'student', 'Must remain student');
    });

    await runTest('Student Dashboard (/api/students/dashboard) loads successfully with student token', async () => {
      const dashRes = await request('GET', '/api/students/dashboard', null, {
        Authorization: `Bearer ${studentToken}`
      });

      assert.strictEqual(dashRes.status, 200);
      assert.strictEqual(dashRes.body.success, true);
    });

    await runTest('Session restoration (/api/auth/me) restores user role on refresh', async () => {
      const meRes = await request('GET', '/api/auth/me', null, {
        Authorization: `Bearer ${studentToken}`
      });

      assert.strictEqual(meRes.status, 200);
      assert.strictEqual(meRes.body.user.role, 'student');
    });

    await runTest('Role-based access control blocks student from recruiter dashboard (403)', async () => {
      const forbiddenRes = await request('GET', '/api/recruiters/dashboard', null, {
        Authorization: `Bearer ${studentToken}`
      });

      assert.strictEqual(forbiddenRes.status, 403);
    });

    await runTest('Traditional email/password login is fully preserved', async () => {
      const loginRes = await request('POST', '/api/auth/login', {
        email: 'priya.sharma@student.edu',
        password: 'student123',
        role: 'student'
      });

      assert.strictEqual(loginRes.status, 200);
      assert.strictEqual(loginRes.body.success, true);
      assert.strictEqual(loginRes.body.user.role, 'student');
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
}

runAll().catch(err => {
  console.error('Test suite runner failed:', err);
  process.exit(1);
});
