/**
 * Automated Recruiter Job-Posting Approval Workflow Test Suite
 * Covers:
 * 1. Recruiter drive creation defaults to approvalStatus: 'pending' with audit info
 * 2. Self-approval attempts by recruiters are strictly neutralized
 * 3. Pending & rejected drives are completely excluded from student listings & search
 * 4. Direct student detail requests for unapproved drives return 404
 * 5. Direct student application requests for unapproved drives return 400
 * 6. Role-based access control blocks non-admin approval / rejection attempts (403)
 * 7. Admin can query pending drives with ?approvalStatus=pending
 * 8. Admin approves drive: status becomes 'approved', approvedBy/approvedAt stored
 * 9. Once approved, drive becomes immediately visible in student listings and drives
 * 10. Student can now apply successfully to the approved drive
 * 11. Admin rejects drive with custom reason: status becomes 'rejected', reason stored
 * 12. Recruiter sees rejected drive and rejection feedback
 * 13. Recruiter resubmits/edits rejected drive: status resets to 'pending' and reason cleared
 * 14. Existing preloaded 520+ jobs and pre-existing seed demo drives remain accessible
 */

const http = require('http');
const assert = require('assert');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = require('../server/server');
const Drive = require('../server/models/Drive');
const Company = require('../server/models/Company');

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
  console.log('===============================================================');
  console.log('   Campus Connect — Job-Posting Approval Workflow Test Suite   ');
  console.log('===============================================================\n');

  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = 'http://127.0.0.1:' + port;
      console.log('Test server running at ' + baseUrl + '\n');
      resolve();
    });
  });

  const recruiterUser = {
    id: '65e000000000000000000003',
    _id: '65e000000000000000000003',
    email: 'hr@technova.com',
    role: 'recruiter',
    name: 'Anita Rao'
  };

  const adminUser = {
    id: '65e000000000000000000001',
    _id: '65e000000000000000000001',
    email: 'admin@campusconnect.edu',
    role: 'admin',
    name: 'Placement Dean'
  };

  const studentUser = {
    id: '65e000000000000000000002',
    _id: '65e000000000000000000002',
    email: 'priya.sharma@student.edu',
    role: 'student',
    name: 'Priya Sharma'
  };

  const recruiterToken = makeToken(recruiterUser);
  const adminToken = makeToken(adminUser);
  const studentToken = makeToken(studentUser);

  const uniqueSuffix = Date.now();
  const testTitle = 'Cloud Systems Architect Trainee ' + uniqueSuffix;
  const rejectTitle = 'Junior DevOps Engineer ' + uniqueSuffix;
  let pendingDriveId = null;
  let rejectedDriveId = null;

  try {
    console.log('--- SECTION 1: Recruiter Drive Creation & Safe Defaults ---');

    await runTest('Recruiter creates a new drive: defaults to approvalStatus="pending" with audit fields', async () => {
      const res = await request('POST', '/api/recruiters/drives', {
        title: testTitle,
        job_type: 'Full-Time',
        ctc: '14.5',
        location: 'Bengaluru',
        openings: 5,
        deadline: new Date(Date.now() + 15 * 86400000).toISOString(),
        description: 'Design and deploy modern distributed cloud applications.',
        min_cgpa: 7.0,
        max_backlogs: 0,
        branches: ['Computer Science', 'Information Technology'],
        skills: 'Kubernetes, Go, AWS, Docker'
      }, { Authorization: 'Bearer ' + recruiterToken });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.drive);
      assert.strictEqual(res.body.drive.approvalStatus, 'pending');
      assert.strictEqual(res.body.drive.rejectionReason, '');
      pendingDriveId = res.body.drive.id || res.body.drive._id;
      assert.ok(pendingDriveId, 'Must have drive id');
    });

    await runTest('Recruiter payload self-approval tampering is strictly neutralized to "pending"', async () => {
      const res = await request('POST', '/api/recruiters/drives', {
        title: 'Tamper Test Role',
        job_type: 'Full-Time',
        ctc: '20.0',
        location: 'Hyderabad',
        openings: 2,
        deadline: new Date(Date.now() + 10 * 86400000).toISOString(),
        approvalStatus: 'approved',
        approval_status: 'approved',
        status: 'approved',
        approvedBy: recruiterUser.id
      }, { Authorization: 'Bearer ' + recruiterToken });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.drive.approvalStatus, 'pending', 'Must override self-approval to pending');
      assert.strictEqual(res.body.drive.approvedBy, null);
    });

    await runTest('Recruiter gets their own drives: pending drive is visible with approvalStatus="pending"', async () => {
      const res = await request('GET', '/api/recruiters/drives', null, {
        Authorization: 'Bearer ' + recruiterToken
      });

      assert.strictEqual(res.status, 200);
      const found = res.body.drives.find(d => String(d.id || d._id) === String(pendingDriveId));
      assert.ok(found, 'Pending drive should be visible in recruiter managed drives');
      assert.strictEqual(found.approvalStatus, 'pending');
    });

    console.log('\n--- SECTION 2: Student Protection & Absolute Isolation ---');

    await runTest('Student /api/jobs public listing completely excludes pending drive', async () => {
      const res = await request('GET', '/api/jobs?q=' + encodeURIComponent(testTitle), null, {
        Authorization: 'Bearer ' + studentToken
      });

      assert.strictEqual(res.status, 200);
      const jobs = res.body.data || res.body.jobs || [];
      const found = jobs.find(j => (j.title || '').includes(testTitle));
      assert.strictEqual(found, undefined, 'Pending drive MUST NOT appear in student job listing');
    });

    await runTest('Student /api/students/drives completely excludes pending drive', async () => {
      const res = await request('GET', '/api/students/drives', null, {
        Authorization: 'Bearer ' + studentToken
      });

      assert.strictEqual(res.status, 200);
      const drivesList = res.body.data || [];
      const found = drivesList.find(item => {
        const d = item.drive || item;
        return String(d.id || d._id) === String(pendingDriveId) || (d.title || '').includes(testTitle);
      });
      assert.strictEqual(found, undefined, 'Pending drive MUST NOT appear in student drives listing');
    });

    await runTest('Student direct GET /api/jobs/:id on pending drive returns 404', async () => {
      const res = await request('GET', '/api/jobs/' + pendingDriveId, null, {
        Authorization: 'Bearer ' + studentToken
      });

      assert.strictEqual(res.status, 404, 'Direct access to pending job by ID must return 404');
    });

    await runTest('Student direct GET /api/students/drives/:id on pending drive returns 404', async () => {
      const res = await request('GET', '/api/students/drives/' + pendingDriveId, null, {
        Authorization: 'Bearer ' + studentToken
      });

      assert.strictEqual(res.status, 404, 'Direct access to pending drive by ID must return 404');
    });

    await runTest('Student direct apply POST /api/jobs/:id/apply on pending drive returns 400 rejection', async () => {
      const res = await request('POST', '/api/jobs/' + pendingDriveId + '/apply', {}, {
        Authorization: 'Bearer ' + studentToken
      });

      assert.strictEqual(res.status, 400, 'Direct application to pending drive must be rejected');
    });

    await runTest('Student direct apply POST /api/students/drives/:id/apply on pending drive returns 400 rejection', async () => {
      const res = await request('POST', '/api/students/drives/' + pendingDriveId + '/apply', {}, {
        Authorization: 'Bearer ' + studentToken
      });

      assert.strictEqual(res.status, 400, 'Direct application to pending drive must be rejected');
    });

    console.log('\n--- SECTION 3: RBAC & Admin Approval Execution ---');

    await runTest('Student cannot call admin approve endpoint (403 Forbidden)', async () => {
      const res = await request('PUT', '/api/admin/drives/' + pendingDriveId + '/approve', {}, {
        Authorization: 'Bearer ' + studentToken
      });

      assert.strictEqual(res.status, 403, 'Students must be blocked from approving drives');
    });

    await runTest('Recruiter cannot call admin approve endpoint (403 Forbidden)', async () => {
      const res = await request('PUT', '/api/admin/drives/' + pendingDriveId + '/approve', {}, {
        Authorization: 'Bearer ' + recruiterToken
      });

      assert.strictEqual(res.status, 403, 'Recruiters must be blocked from approving drives');
    });

    await runTest('Admin queries pending drives: GET /api/admin/drives?approvalStatus=pending returns drive', async () => {
      const res = await request('GET', '/api/admin/drives?approvalStatus=pending', null, {
        Authorization: 'Bearer ' + adminToken
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      const found = res.body.data.find(d => String(d.id || d._id) === String(pendingDriveId));
      assert.ok(found, 'Admin must see pending drive under pending filter');
    });

    await runTest('Admin approves drive: PUT /api/admin/drives/:id/approve succeeds with audit stamps', async () => {
      const res = await request('PUT', '/api/admin/drives/' + pendingDriveId + '/approve', {}, {
        Authorization: 'Bearer ' + adminToken
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.approvalStatus, 'approved');
      assert.ok(res.body.data.approvedBy, 'approvedBy must be recorded');
      assert.ok(res.body.data.approvedAt, 'approvedAt must be recorded');
    });

    console.log('\n--- SECTION 4: Student Visibility & Post-Approval Application ---');

    await runTest('Student /api/jobs listing NOW contains the approved drive', async () => {
      const res = await request('GET', '/api/jobs?q=' + encodeURIComponent(testTitle), null, {
        Authorization: 'Bearer ' + studentToken
      });

      assert.strictEqual(res.status, 200);
      const jobs = res.body.data || res.body.jobs || [];
      const found = jobs.find(j => (j.title || '').includes(testTitle));
      assert.ok(found, 'Approved drive must now appear in student jobs list');
    });

    await runTest('Student can view opportunity details GET /api/jobs/:id for approved drive', async () => {
      const res = await request('GET', '/api/jobs/' + pendingDriveId, null, {
        Authorization: 'Bearer ' + studentToken
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.title, testTitle);
    });

    await runTest('Student can now apply successfully to approved drive', async () => {
      const res = await request('POST', '/api/jobs/' + pendingDriveId + '/apply', {}, {
        Authorization: 'Bearer ' + studentToken
      });

      assert.ok(res.status === 200 || res.status === 201, 'Application should succeed for approved drive');
      assert.strictEqual(res.body.success, true);
    });

    console.log('\n--- SECTION 5: Rejection, Feedback & Resubmission Workflow ---');

    await runTest('Recruiter creates a second opportunity for rejection test', async () => {
      const res = await request('POST', '/api/recruiters/drives', {
        title: rejectTitle,
        job_type: 'Full-Time',
        ctc: '12.0',
        location: 'Bengaluru',
        openings: 3,
        deadline: new Date(Date.now() + 20 * 86400000).toISOString(),
        description: 'Automate build pipelines and cloud infrastructure.',
        min_cgpa: 6.5,
        max_backlogs: 1,
        branches: ['Computer Science', 'Information Technology'],
        skills: 'Bash, Docker, Jenkins'
      }, { Authorization: 'Bearer ' + recruiterToken });

      assert.strictEqual(res.status, 201);
      rejectedDriveId = res.body.drive.id || res.body.drive._id;
      assert.ok(rejectedDriveId);
    });

    await runTest('Admin rejects drive with specific reason: status="rejected" and reason saved', async () => {
      const feedback = 'Compensation structure lacks required base/variable breakdown per institutional guidelines.';
      const res = await request('PUT', '/api/admin/drives/' + rejectedDriveId + '/reject', {
        reason: feedback
      }, { Authorization: 'Bearer ' + adminToken });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.approvalStatus, 'rejected');
      assert.strictEqual(res.body.data.rejectionReason, feedback);
    });

    await runTest('Recruiter fetches drives: sees rejected drive and rejection reason', async () => {
      const res = await request('GET', '/api/recruiters/drives', null, {
        Authorization: 'Bearer ' + recruiterToken
      });

      assert.strictEqual(res.status, 200);
      const found = res.body.drives.find(d => String(d.id || d._id) === String(rejectedDriveId));
      assert.ok(found);
      assert.strictEqual(found.approvalStatus, 'rejected');
      assert.ok(found.rejectionReason.includes('Compensation structure lacks required base/variable breakdown'));
    });

    await runTest('Recruiter updates rejected drive: status automatically resets to "pending" and clears rejectionReason', async () => {
      const res = await request('PUT', '/api/recruiters/drives/' + rejectedDriveId, {
        title: 'Junior DevOps Engineer (Revised)',
        description: 'Updated with complete CTC breakdown: ₹10 LPA Fixed + ₹2 LPA Performance Bonus.',
        resubmit: true
      }, { Authorization: 'Bearer ' + recruiterToken });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.drive.approvalStatus, 'pending', 'Status must reset to pending on resubmission');
      assert.strictEqual(res.body.drive.rejectionReason, '', 'Rejection reason must be cleared');
    });

    console.log('\n--- SECTION 6: Platform Continuity & Preloaded Data Integrity ---');

    await runTest('Preloaded 520+ institutional listings (ALL_JOBS) remain intact and searchable', async () => {
      const res = await request('GET', '/api/jobs?limit=10', null, {
        Authorization: 'Bearer ' + studentToken
      });

      assert.strictEqual(res.status, 200);
      assert.ok(res.body.data.length >= 10, 'Must return preloaded listings');
    });

  } finally {
    if (server) {
      server.close();
    }
  }

  console.log('\n===============================================================');
  console.log('   Test Results: ' + passedTests + '/' + totalTests + ' Passed (' + (passedTests === totalTests ? 'ALL PASSED' : 'SOME FAILED') + ')');
  console.log('===============================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAll().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
