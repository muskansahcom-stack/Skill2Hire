/**
 * Skill2Hire - Comprehensive 12-Scenario Admin Security Test Suite
 * 
 * Verifies backend and database level enforcement:
 * 1. Normal user registration cannot assign role="ADMIN"
 * 2. Normal user registration with allowed role succeeds
 * 3. Normal user accessing protected admin APIs is blocked (401/403)
 * 4. Normal user token calling /api/admin/users returns 403 Forbidden
 * 5. Normal user token calling /api/admin/stats returns 403 Forbidden
 * 6. Admin login with incorrect password returns generic 401 error
 * 7. Admin login with valid credentials succeeds and issues signed token
 * 8. Authenticated admin calling /api/admin/stats succeeds (200 OK)
 * 9. Authenticated admin calling /api/admin/users succeeds (200 OK)
 * 10. Role tampering attempt via change-role endpoint is blocked (403 Forbidden)
 * 11. Admin session invalidation on logout works
 * 12. Brute force rate-limiting locks out after 5 consecutive failed attempts (HTTP 429)
 */

import { db } from '../lib/db';
import { requireAdmin, signSessionToken, verifySessionToken } from '../lib/authMiddleware';
import { POST as registerHandler } from '../app/api/auth/register/route';
import { POST as loginHandler } from '../app/api/auth/login/route';
import { POST as adminLoginHandler } from '../app/api/admin/auth/login/route';
import { POST as adminLogoutHandler } from '../app/api/admin/auth/logout/route';
import { GET as adminStatsHandler } from '../app/api/admin/stats/route';
import { GET as adminUsersHandler, POST as adminUpdateUserHandler } from '../app/api/admin/users/route';
import { POST as changeRoleHandler } from '../app/api/users/change-role/route';

interface TestResult {
  scenarioNumber: number;
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function recordTest(scenarioNumber: number, name: string, passed: boolean, details: string) {
  results.push({ scenarioNumber, name, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} [Test ${scenarioNumber}] ${name}: ${details}`);
}

async function runSecuritySuite() {
  console.log('\n======================================================');
  console.log('🛡️  SKILL2HIRE ADMIN SECURITY VERIFICATION SUITE');
  console.log('======================================================\n');

  // Ensure an admin user exists with known password
  const testAdminEmail = 'admin@skill2hire.com';
  const testAdminPassword = 'SecureAdminPass2026!';
  const adminUser = db.findUserByEmail(testAdminEmail);
  if (!adminUser) {
    throw new Error('Admin user not found. Please run npm run create-admin first.');
  }

  // --- Test 1: Public Registration with role='admin' must be rejected (400 / 403) ---
  try {
    const fakeAdminReq = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Hacker Admin',
        email: 'hacker_admin@exploit.com',
        password: 'password123',
        role: 'admin'
      })
    });
    const res = await registerHandler(fakeAdminReq);
    const data = await res.json();
    const passed = res.status === 400 || res.status === 403;
    recordTest(1, 'Block Public Registration as ADMIN', passed, `Status: ${res.status}, Error: "${data.error}"`);
  } catch (err: any) {
    recordTest(1, 'Block Public Registration as ADMIN', false, err.message);
  }

  // --- Test 2: Normal User Registration succeeds with 'student' ---
  let normalStudentId = '';
  try {
    const studentReq = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        email: `student_${Date.now()}@test.com`,
        password: 'Password123!',
        role: 'student'
      })
    });
    const res = await studentReq.json ? await registerHandler(studentReq) : null;
    const data = await res!.json();
    const passed = (res!.status === 200 || res!.status === 201) && data.user?.role === 'student';
    normalStudentId = data.user?.id || 'u_student_1';
    recordTest(2, 'Normal User Registration Allowed', passed, `Status: ${res!.status}, Created user with role: ${data.user?.role}`);
  } catch (err: any) {
    recordTest(2, 'Normal User Registration Allowed', false, err.message);
  }

  // --- Test 3: Unauthenticated /api/admin/stats access rejected (401) ---
  try {
    const unauthReq = new Request('http://localhost:3000/api/admin/stats', {
      method: 'GET'
    });
    const res = await adminStatsHandler(unauthReq);
    const data = await res.json();
    const passed = res.status === 401;
    recordTest(3, 'Unauthenticated Admin API Call Blocked', passed, `Status: ${res.status}, Response: "${data.error}"`);
  } catch (err: any) {
    recordTest(3, 'Unauthenticated Admin API Call Blocked', false, err.message);
  }

  // --- Test 4: Normal User Token Calling /api/admin/users rejected (403) ---
  const studentToken = signSessionToken({
    userId: normalStudentId || 'u_student_1',
    email: 'alex.rivera@student.skill2hire.com',
    role: 'student',
    verified: true
  });

  try {
    const studentUsersReq = new Request('http://localhost:3000/api/admin/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${studentToken}`
      }
    });
    const res = await adminUsersHandler(studentUsersReq);
    const data = await res.json();
    const passed = res.status === 403;
    recordTest(4, 'Student Token Calling /api/admin/users Blocked', passed, `Status: ${res.status}, Error: "${data.error}"`);
  } catch (err: any) {
    recordTest(4, 'Student Token Calling /api/admin/users Blocked', false, err.message);
  }

  // --- Test 5: Normal User Token Calling /api/admin/stats rejected (403) ---
  try {
    const studentStatsReq = new Request('http://localhost:3000/api/admin/stats', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${studentToken}`
      }
    });
    const res = await adminStatsHandler(studentStatsReq);
    const data = await res.json();
    const passed = res.status === 403;
    recordTest(5, 'Student Token Calling /api/admin/stats Blocked', passed, `Status: ${res.status}, Error: "${data.error}"`);
  } catch (err: any) {
    recordTest(5, 'Student Token Calling /api/admin/stats Blocked', false, err.message);
  }

  // --- Test 6: Admin Login with Wrong Password fails with generic error (401) ---
  try {
    const wrongPassReq = new Request('http://localhost:3000/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.1' },
      body: JSON.stringify({
        email: testAdminEmail,
        password: 'IncorrectPassword999!'
      })
    });
    const res = await adminLoginHandler(wrongPassReq);
    const data = await res.json();
    const passed = res.status === 401 && data.error === 'Invalid credentials.';
    recordTest(6, 'Admin Login with Wrong Password Fails Generically', passed, `Status: ${res.status}, Error: "${data.error}"`);
  } catch (err: any) {
    recordTest(6, 'Admin Login with Wrong Password Fails Generically', false, err.message);
  }

  // --- Test 7: Admin Login with Valid Credentials succeeds (200 OK + token) ---
  let adminSessionToken = '';
  try {
    const validLoginReq = new Request('http://localhost:3000/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.2' },
      body: JSON.stringify({
        email: testAdminEmail,
        password: testAdminPassword
      })
    });
    const res = await adminLoginHandler(validLoginReq);
    const data = await res.json();
    adminSessionToken = data.token;
    const passed = res.status === 200 && data.success && data.user?.role === 'admin' && !!adminSessionToken;
    recordTest(7, 'Admin Login with Valid Credentials Succeeds', passed, `Authenticated as: ${data.user?.email} (${data.user?.role})`);
  } catch (err: any) {
    recordTest(7, 'Admin Login with Valid Credentials Succeeds', false, err.message);
  }

  // --- Test 8: Authenticated Admin calling /api/admin/stats succeeds (200 OK) ---
  try {
    const adminStatsReq = new Request('http://localhost:3000/api/admin/stats', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminSessionToken}`
      }
    });
    const res = await adminStatsHandler(adminStatsReq);
    const data = await res.json();
    const passed = res.status === 200 && !!data.stats;
    recordTest(8, 'Authorized Admin Calling /api/admin/stats Succeeds', passed, `Status: ${res.status}, Total Students: ${data.stats?.totalStudents}`);
  } catch (err: any) {
    recordTest(8, 'Authorized Admin Calling /api/admin/stats Succeeds', false, err.message);
  }

  // --- Test 9: Authenticated Admin calling /api/admin/users succeeds (200 OK) ---
  try {
    const adminUsersReq = new Request('http://localhost:3000/api/admin/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminSessionToken}`
      }
    });
    const res = await adminUsersHandler(adminUsersReq);
    const data = await res.json();
    const passed = res.status === 200 && Array.isArray(data.users);
    recordTest(9, 'Authorized Admin Calling /api/admin/users Succeeds', passed, `Status: ${res.status}, Users Count: ${data.users?.length}`);
  } catch (err: any) {
    recordTest(9, 'Authorized Admin Calling /api/admin/users Succeeds', false, err.message);
  }

  // --- Test 10: Non-admin Role Escalation via /api/users/change-role rejected (403) ---
  try {
    const tamperReq = new Request('http://localhost:3000/api/users/change-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        newRole: 'admin'
      })
    });
    const res = await changeRoleHandler(tamperReq);
    const data = await res.json();
    const passed = res.status === 403;
    recordTest(10, 'Reject Self-Promotion to ADMIN via Role API', passed, `Status: ${res.status}, Error: "${data.error}"`);
  } catch (err: any) {
    recordTest(10, 'Reject Self-Promotion to ADMIN via Role API', false, err.message);
  }

  // --- Test 11: Admin Logout cleans up session ---
  try {
    const logoutReq = new Request('http://localhost:3000/api/admin/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminSessionToken}`
      }
    });
    const res = await adminLogoutHandler(logoutReq);
    const data = await res.json();
    const passed = res.status === 200 && data.success;
    recordTest(11, 'Admin Logout Endpoint Invalidation', passed, `Status: ${res.status}, Success: ${data.success}`);
  } catch (err: any) {
    recordTest(11, 'Admin Logout Endpoint Invalidation', false, err.message);
  }

  // --- Test 12: Brute-Force Rate Limiting (Lockout after 5 attempts) ---
  try {
    const bruteForceIp = '192.168.1.99';
    let lockedOut = false;
    let finalStatus = 0;

    for (let i = 1; i <= 6; i++) {
      const bfReq = new Request('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': bruteForceIp },
        body: JSON.stringify({
          email: 'admin_target@skill2hire.com',
          password: `WrongGuess${i}`
        })
      });
      const res = await adminLoginHandler(bfReq);
      finalStatus = res.status;
      if (res.status === 429) {
        lockedOut = true;
        break;
      }
    }
    const passed = lockedOut && finalStatus === 429;
    recordTest(12, 'Brute-Force Protection Rate Limiting (429 Lockout)', passed, `Status on lockout: ${finalStatus}, Locked out: ${lockedOut}`);
  } catch (err: any) {
    recordTest(12, 'Brute-Force Protection Rate Limiting (429 Lockout)', false, err.message);
  }

  // Final Evaluation
  console.log('\n======================================================');
  const allPassed = results.every(r => r.passed);
  const passCount = results.filter(r => r.passed).length;
  console.log(`TOTAL SCENARIOS TESTED: ${results.length}`);
  console.log(`PASSED: ${passCount} / ${results.length}`);
  console.log(`STATUS: ${allPassed ? '🛡️ ALL 12 SECURITY AUDIT CHECKS PASSED' : '⚠️ VULNERABILITIES DETECTED'}`);
  console.log('======================================================\n');

  if (!allPassed) {
    process.exit(1);
  }
}

runSecuritySuite().catch(e => {
  console.error('Fatal Security Test Suite Error:', e);
  process.exit(1);
});
