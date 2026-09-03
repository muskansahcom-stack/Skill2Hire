import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedSession, authorizeRole, authorizeOwnership } from '@/lib/authMiddleware';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = getAuthenticatedSession(request);
    
    // 1. Authorize Role (Students, Colleges, Admins)
    const roleAuth = authorizeRole(session, ['student', 'college']);
    if (!roleAuth.authorized) return roleAuth.errorResponse!;

    // 2. Authorize Ownership
    // If student: must own this report
    // If college: must belong to the college institution
    if (session?.role === 'student') {
      const ownerAuth = authorizeOwnership(session, params.id, 'student');
      if (!ownerAuth.authorized) return ownerAuth.errorResponse!;
    } else if (session?.role === 'college') {
      const student = db.getStudentById(params.id) || db.getStudentByUserId(params.id);
      if (student && student.collegeId !== session.collegeId) {
        return NextResponse.json(
          { error: 'Access denied. You can only view academic reports for students of your college.', code: 'FORBIDDEN_COLLEGE' },
          { status: 403 }
        );
      }
    }

    const studentId = params.id;
    const report = db.getAcademicReport(studentId);

    if (!report) {
      return NextResponse.json({ error: 'Academic report not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      report
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unable to complete the request. Please try again.' }, { status: 500 });
  }
}
