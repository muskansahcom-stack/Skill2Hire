import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedSession, authorizeRole } from '@/lib/authMiddleware';

export async function GET(request: Request) {
  try {
    const session = getAuthenticatedSession(request);
    
    // 1. Only Company and Admin roles can view recruiter applications
    const roleAuth = authorizeRole(session, ['company', 'admin']);
    if (!roleAuth.authorized) return roleAuth.errorResponse!;

    const { searchParams } = new URL(request.url);
    const companyId = session?.role === 'company' && session.companyId ? session.companyId : searchParams.get('companyId');
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');

    let applications = db.getApplications();

    if (companyId) {
      applications = applications.filter(a => a.companyId === companyId);
    }

    if (jobId) {
      applications = applications.filter(a => a.jobId === jobId);
    }

    if (status && status !== 'All') {
      applications = applications.filter(a => a.status === status);
    }

    // Enrich with verified skills and student details (Company least-privilege view)
    const enriched = applications.map(app => {
      const student = db.getStudentById(app.studentId);
      const verifiedSkills = db.getVerifiedSkills(app.studentId);
      const studentSkills = db.getStudentSkills(app.studentId);
      return {
        ...app,
        student: student ? {
          id: student.id,
          fullName: student.fullName,
          email: student.email,
          phone: student.phone,
          collegeName: student.collegeName,
          degree: student.degree,
          department: student.department,
          graduationYear: student.graduationYear,
          cgpa: student.cgpa,
          resumeUrl: student.resumeUrl
        } : null,
        verifiedSkills,
        studentSkills
      };
    });

    return NextResponse.json({
      success: true,
      count: enriched.length,
      applications: enriched
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unable to complete the request. Please try again.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = getAuthenticatedSession(request);
    
    // 1. Only Company and Admin roles can update application status
    const roleAuth = authorizeRole(session, ['company', 'admin']);
    if (!roleAuth.authorized) return roleAuth.errorResponse!;

    const body = await request.json();
    const { applicationId, status, notes } = body;

    if (!applicationId || !status) {
      return NextResponse.json({ error: 'Application ID and status are required' }, { status: 400 });
    }

    const app = db.getApplicationById(applicationId);
    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Verify company owns this application's job posting
    if (session?.role === 'company' && session.companyId && app.companyId !== session.companyId) {
      return NextResponse.json(
        { error: 'Access denied. You cannot modify applications for other companies.', code: 'FORBIDDEN_COMPANY' },
        { status: 403 }
      );
    }

    const updated = db.updateApplicationStatus(applicationId, status, notes);
    return NextResponse.json({
      success: true,
      application: updated,
      message: `Candidate application status updated to ${status}`
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unable to complete the request. Please try again.' }, { status: 500 });
  }
}
