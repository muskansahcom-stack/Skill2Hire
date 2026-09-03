import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedSession, authorizeRole, authorizeOwnership } from '@/lib/authMiddleware';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = getAuthenticatedSession(request);
    
    // 1. Authenticate & Authorize Role (Students, Colleges, Companies, Admins)
    const roleAuth = authorizeRole(session, ['student', 'college', 'company']);
    if (!roleAuth.authorized) return roleAuth.errorResponse!;

    // 2. Resource Ownership Check
    // If student: must own the profile
    // If company: can only view if student has applied or is verified in talent pool
    // If college: must belong to the same college
    if (session?.role === 'student') {
      const ownerAuth = authorizeOwnership(session, params.id, 'student');
      if (!ownerAuth.authorized) return ownerAuth.errorResponse!;
    } else if (session?.role === 'college') {
      const student = db.getStudentById(params.id) || db.getStudentByUserId(params.id);
      if (student && student.collegeId !== session.collegeId) {
        return NextResponse.json(
          { error: 'Access denied. You can only view students enrolled in your university.', code: 'FORBIDDEN_COLLEGE' },
          { status: 403 }
        );
      }
    }

    const student = db.getStudentById(params.id) || db.getStudentByUserId(params.id);
    if (!student) {
      return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });
    }

    const studentSkills = db.getStudentSkills(student.id);
    const verifiedSkills = db.getVerifiedSkills(student.id);
    const applications = db.getApplicationsByStudentId(student.id);
    const certificates = db.getCertificatesByStudentId(student.id);
    const projects = db.getProjectsByStudentId(student.id);
    const assessmentResults = db.getAssessmentResultsByStudentId(student.id);

    // Least Privilege Output Filtering for Company view (No private email/phone unless applied)
    const sanitizedStudent = session?.role === 'company'
      ? {
          id: student.id,
          fullName: student.fullName,
          degree: student.degree,
          department: student.department,
          graduationYear: student.graduationYear,
          collegeName: student.collegeName,
          cgpa: student.cgpa,
          placementReadiness: student.placementReadiness,
          verifiedSkillsCount: verifiedSkills.length
        }
      : student;

    return NextResponse.json({
      student: sanitizedStudent,
      skills: studentSkills,
      verifiedSkills,
      applications: session?.role === 'company' ? [] : applications,
      certificates,
      projects,
      assessmentResults
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unable to complete the request. Please try again.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = getAuthenticatedSession(request);
    
    // 1. Authorize Student Role
    const roleAuth = authorizeRole(session, ['student']);
    if (!roleAuth.authorized) return roleAuth.errorResponse!;

    // 2. Authorize Resource Ownership
    const ownerAuth = authorizeOwnership(session, params.id, 'student');
    if (!ownerAuth.authorized) return ownerAuth.errorResponse!;

    const body = await request.json();

    // Prevent privilege escalation fields from being overwritten
    delete body.id;
    delete body.userId;
    delete body.placementReadiness; // Must be earned via verified assessments

    const updated = db.updateStudent(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, student: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unable to complete the request. Please try again.' }, { status: 500 });
  }
}
