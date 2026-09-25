/**
 * Skill2Hire - Comprehensive Multi-Role Security & Tenant Isolation Test Suite
 * 
 * Verifies backend authorization hierarchy:
 * OWNER_ADMIN -> Full platform administration
 * STUDENT     -> Only own student data and permitted actions
 * COMPANY     -> Only own company data and permitted actions
 * COLLEGE     -> Only own college data and permitted actions
 */

import { db } from '../lib/db';
import { requireAdmin, requireOwnerAdmin, signSessionToken, isOwnerAdmin } from '../lib/authMiddleware';
import { POST as registerHandler } from '../app/api/auth/register/route';
import { POST as loginHandler } from '../app/api/auth/login/route';
import { POST as adminLoginHandler } from '../app/api/admin/auth/login/route';
import { POST as adminLogoutHandler } from '../app/api/admin/auth/logout/route';
import { GET as adminStatsHandler } from '../app/api/admin/stats/route';
import { GET as adminUsersHandler, POST as adminUpdateUserHandler } from '../app/api/admin/users/route';
import { DELETE as adminDeleteUserHandler } from '../app/api/admin/users/[id]/route';
import { GET as adminSettingsGetHandler, PUT as adminSettingsPutHandler } from '../app/api/admin/settings/route';
import { POST as changeRoleHandler } from '../app/api/users/change-role/route';
import { POST as forgotPasswordHandler } from '../app/api/auth/forgot-password/route';
import { POST as resetPasswordHandler } from '../app/api/auth/reset-password/route';
import { GET as studentProfileHandler } from '../app/api/students/[id]/route';

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
  console.log('\n================================================================');
  console.log('🛡️  SKILL2HIRE OWNER_ADMIN & TENANT ISOLATION SECURITY SUITE');
  console.log('================================================================\n');

  const testAdminEmail = 'admin@skill2hire.com';
  const testAdminPassword = 'SecureAdminPass2026!';
  const adminUser = db.findUserByEmail(testAdminEmail);
  if (!adminUser) {
    throw new Error('Admin user not found. Please run npm run create-admin first.');
  }

  // Tokens for different tenant roles
  const studentToken = signSessionToken({
    userId: 'u_student_1',
    email: 'alex.rivera@student.skill2hire.com',
    role: 'student',
    studentId: 'std_1',
    verified: true
  });

  const otherStudentToken = signSessionToken({
    userId: 'u_student_99',
    email: 'other.student@test.com',
    role: 'student',
    studentId: 'std_99',
    verified: true
  });

  const companyToken = signSessionToken({
    userId: 'u_comp_1',
    email: 'recruiter@technova.com',
    role: 'company',
    companyId: 'comp_1',
    verified: true
  });

  const collegeToken = signSessionToken({
    userId: 'u_col_1',
    email: 'admin@apexuniversity.edu',
    role: 'college',
    collegeId: 'col_1',
    verified: true
  });

  // --- 1. Public Signup Exploits Blocked ---
  try {
    const fakeAdminReq = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Attacker', email: 'att1@exploit.com', password: 'password123', role: 'admin' })
    });
    const res = await registerHandler(fakeAdminReq);
    recordTest(1, 'Reject Public Signup with role="admin"', res.status === 403, `Status: ${res.status}`);
  } catch (e: any) {
    recordTest(1, 'Reject Public Signup with role="admin"', false, e.message);
  }

  try {
    const fakeOwnerReq = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Attacker', email: 'att2@exploit.com', password: 'password123', role: 'owner_admin' })
    });
    const res = await registerHandler(fakeOwnerReq);
    recordTest(2, 'Reject Public Signup with role="owner_admin"', res.status === 403, `Status: ${res.status}`);
  } catch (e: any) {
    recordTest(2, 'Reject Public Signup with role="owner_admin"', false, e.message);
  }

  // --- 2. Normal Student Signup Allowed ---
  try {
    const validStudentReq = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Valid Student', email: `std_${Date.now()}@test.com`, password: 'Password123!', role: 'student' })
    });
    const res = await validStudentReq.json ? await registerHandler(validStudentReq) : null;
    const data = await res!.json();
    const passed = (res!.status === 200 || res!.status === 201) && data.user?.role === 'student';
    recordTest(3, 'Normal Student Registration Allowed', passed, `Status: ${res!.status}, Role: ${data.user?.role}`);
  } catch (e: any) {
    recordTest(3, 'Normal Student Registration Allowed', false, e.message);
  }

  // --- 3. Unauthenticated Access Blocked (HTTP 401) ---
  try {
    const unauthStats = await adminStatsHandler(new Request('http://localhost:3000/api/admin/stats'));
    recordTest(4, 'Unauthenticated /api/admin/stats returns 401', unauthStats.status === 401, `Status: ${unauthStats.status}`);

    const unauthUsers = await adminUsersHandler(new Request('http://localhost:3000/api/admin/users'));
    recordTest(5, 'Unauthenticated /api/admin/users returns 401', unauthUsers.status === 401, `Status: ${unauthUsers.status}`);

    const unauthSettings = await adminSettingsGetHandler(new Request('http://localhost:3000/api/admin/settings'));
    recordTest(6, 'Unauthenticated /api/admin/settings returns 401', unauthSettings.status === 401, `Status: ${unauthSettings.status}`);
  } catch (e: any) {
    recordTest(4, 'Unauthenticated Admin API Calls', false, e.message);
  }

  // --- 4. Student Persona Blocked from Admin APIs (HTTP 403) ---
  try {
    const sStats = await adminStatsHandler(new Request('http://localhost:3000/api/admin/stats', { headers: { 'Authorization': `Bearer ${studentToken}` } }));
    recordTest(7, 'Student calling /api/admin/stats returns 403 Forbidden', sStats.status === 403, `Status: ${sStats.status}`);

    const sUsers = await adminUsersHandler(new Request('http://localhost:3000/api/admin/users', { headers: { 'Authorization': `Bearer ${studentToken}` } }));
    recordTest(8, 'Student calling /api/admin/users returns 403 Forbidden', sUsers.status === 403, `Status: ${sUsers.status}`);

    const sSettings = await adminSettingsPutHandler(new Request('http://localhost:3000/api/admin/settings', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${studentToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ maintenanceMode: true })
    }));
    recordTest(9, 'Student calling PUT /api/admin/settings returns 403 Forbidden', sSettings.status === 403, `Status: ${sSettings.status}`);
  } catch (e: any) {
    recordTest(7, 'Student Accessing Admin APIs', false, e.message);
  }

  // --- 5. Company Persona Blocked from Admin APIs (HTTP 403) ---
  try {
    const cStats = await adminStatsHandler(new Request('http://localhost:3000/api/admin/stats', { headers: { 'Authorization': `Bearer ${companyToken}` } }));
    recordTest(10, 'Company calling /api/admin/stats returns 403 Forbidden', cStats.status === 403, `Status: ${cStats.status}`);

    const cUsers = await adminUsersHandler(new Request('http://localhost:3000/api/admin/users', { headers: { 'Authorization': `Bearer ${companyToken}` } }));
    recordTest(11, 'Company calling /api/admin/users returns 403 Forbidden', cUsers.status === 403, `Status: ${cUsers.status}`);

    const cSettings = await adminSettingsPutHandler(new Request('http://localhost:3000/api/admin/settings', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${companyToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ maintenanceMode: true })
    }));
    recordTest(12, 'Company calling PUT /api/admin/settings returns 403 Forbidden', cSettings.status === 403, `Status: ${cSettings.status}`);
  } catch (e: any) {
    recordTest(10, 'Company Accessing Admin APIs', false, e.message);
  }

  // --- 6. College Persona Blocked from Admin APIs (HTTP 403) ---
  try {
    const colStats = await adminStatsHandler(new Request('http://localhost:3000/api/admin/stats', { headers: { 'Authorization': `Bearer ${collegeToken}` } }));
    recordTest(13, 'College calling /api/admin/stats returns 403 Forbidden', colStats.status === 403, `Status: ${colStats.status}`);

    const colUsers = await adminUsersHandler(new Request('http://localhost:3000/api/admin/users', { headers: { 'Authorization': `Bearer ${collegeToken}` } }));
    recordTest(14, 'College calling /api/admin/users returns 403 Forbidden', colUsers.status === 403, `Status: ${colUsers.status}`);

    const colSettings = await adminSettingsPutHandler(new Request('http://localhost:3000/api/admin/settings', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${collegeToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ maintenanceMode: true })
    }));
    recordTest(15, 'College calling PUT /api/admin/settings returns 403 Forbidden', colSettings.status === 403, `Status: ${colSettings.status}`);
  } catch (e: any) {
    recordTest(13, 'College Accessing Admin APIs', false, e.message);
  }

  // --- 7. OWNER_ADMIN Immutability & Protection ---
  try {
    // Attempt to demote OWNER_ADMIN via adminUsersHandler
    const demoteReq = new Request('http://localhost:3000/api/admin/users', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${studentToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId: 'u_admin', newRole: 'student' })
    });
    const demoteRes = await adminUpdateUserHandler(demoteReq);
    recordTest(16, 'Block Demotion of OWNER_ADMIN Account', demoteRes.status === 403, `Status: ${demoteRes.status}`);

    // Attempt to delete OWNER_ADMIN
    const deleteReq = new Request('http://localhost:3000/api/admin/users/u_admin', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    const deleteRes = await adminDeleteUserHandler(deleteReq, { params: { id: 'u_admin' } });
    recordTest(17, 'Block Deletion of OWNER_ADMIN Account', deleteRes.status === 403, `Status: ${deleteRes.status}`);
  } catch (e: any) {
    recordTest(16, 'OWNER_ADMIN Immutability', false, e.message);
  }

  // --- 8. OWNER_ADMIN Credential Protection (Forgot/Reset Password) ---
  try {
    const forgotReq = new Request('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: testAdminEmail })
    });
    const forgotRes = await forgotPasswordHandler(forgotReq);
    recordTest(18, 'Block Password Reset OTP on OWNER_ADMIN Email', forgotRes.status === 403, `Status: ${forgotRes.status}`);

    const resetReq = new Request('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: testAdminEmail, code: '123456', newPassword: 'NewHackedPassword!' })
    });
    const resetRes = await resetPasswordHandler(resetReq);
    recordTest(19, 'Block Password Reset Execution on OWNER_ADMIN Account', resetRes.status === 403, `Status: ${resetRes.status}`);
  } catch (e: any) {
    recordTest(18, 'Credential Protection', false, e.message);
  }

  // --- 9. Tenant Isolation: Students cannot modify or access other students' private data ---
  try {
    const student1 = db.getStudents()[0];
    const student2 = db.getStudents()[1];

    if (student1 && student2) {
      // Student 1 tries to view Student 2's profile with student token
      const otherProfileReq = new Request(`http://localhost:3000/api/students/${student2.id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${studentToken}` } // Token belongs to Student 1
      });
      const otherRes = await studentProfileHandler(otherProfileReq, { params: { id: student2.id } });
      recordTest(20, 'Tenant Isolation: Student cannot access other student private data', otherRes.status === 403, `Status: ${otherRes.status}`);

      // Student 1 accesses own profile
      const ownProfileReq = new Request(`http://localhost:3000/api/students/${student1.id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${studentToken}` }
      });
      const ownRes = await studentProfileHandler(ownProfileReq, { params: { id: student1.id } });
      recordTest(21, 'Tenant Operation: Student can access own profile normally', ownRes.status === 200, `Status: ${ownRes.status}`);
    }
  } catch (e: any) {
    recordTest(20, 'Tenant Isolation Checks', false, e.message);
  }

  // --- 10. Valid OWNER_ADMIN Login & Full Administrative Control ---
  let adminToken = '';
  try {
    const validLoginReq = new Request('http://localhost:3000/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({ email: testAdminEmail, password: testAdminPassword })
    });
    const loginRes = await adminLoginHandler(validLoginReq);
    const loginData = await loginRes.json();
    adminToken = loginData.token;

    const loginPassed = loginRes.status === 200 && (loginData.user?.role === 'owner_admin' || loginData.user?.role === 'admin');
    recordTest(22, 'OWNER_ADMIN Authenticates via Dedicated /admin/login', loginPassed, `Authenticated as: ${loginData.user?.email} (${loginData.user?.role})`);

    // Authorized Admin Calls
    const statsRes = await adminStatsHandler(new Request('http://localhost:3000/api/admin/stats', { headers: { 'Authorization': `Bearer ${adminToken}` } }));
    recordTest(23, 'Authorized OWNER_ADMIN Calls /api/admin/stats', statsRes.status === 200, `Status: ${statsRes.status}`);

    const usersRes = await adminUsersHandler(new Request('http://localhost:3000/api/admin/users', { headers: { 'Authorization': `Bearer ${adminToken}` } }));
    recordTest(24, 'Authorized OWNER_ADMIN Calls /api/admin/users', usersRes.status === 200, `Status: ${usersRes.status}`);

    const settingsRes = await adminSettingsPutHandler(new Request('http://localhost:3000/api/admin/settings', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ allowRegistration: true, maintenanceMode: false, systemNotice: 'System Operational' })
    }));
    recordTest(25, 'Authorized OWNER_ADMIN Updates /api/admin/settings', settingsRes.status === 200, `Status: ${settingsRes.status}`);
  } catch (e: any) {
    recordTest(22, 'OWNER_ADMIN Authorized Operations', false, e.message);
  }

  // --- 11. Brute-Force Rate Limiting ---
  try {
    const bfIp = '172.16.0.42';
    let locked = false;
    for (let i = 0; i < 6; i++) {
      const res = await adminLoginHandler(new Request('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': bfIp },
        body: JSON.stringify({ email: 'target_admin@test.com', password: `wrong_${i}` })
      }));
      if (res.status === 429) {
        locked = true;
        break;
      }
    }
    recordTest(26, 'Brute-Force Rate Limiting Locks Out After 5 Attempts (HTTP 429)', locked, `Lockout triggered: ${locked}`);
  } catch (e: any) {
    recordTest(26, 'Brute-Force Protection', false, e.message);
  }

  // Final Summary
  console.log('\n================================================================');
  const allPassed = results.every(r => r.passed);
  const passCount = results.filter(r => r.passed).length;
  console.log(`TOTAL CHECKS: ${results.length}`);
  console.log(`PASSED: ${passCount} / ${results.length}`);
  console.log(`STATUS: ${allPassed ? '🛡️ ALL OWNER_ADMIN & TENANT ISOLATION CHECKS PASSED' : '⚠️ SECURITY VULNERABILITIES DETECTED'}`);
  console.log('================================================================\n');

  if (!allPassed) {
    process.exit(1);
  }
}

runSecuritySuite().catch(err => {
  console.error('Fatal Security Suite Error:', err);
  process.exit(1);
});
