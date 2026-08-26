import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
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

    // Enrich with verified skills and student details
    const enriched = applications.map(app => {
      const student = db.getStudentById(app.studentId);
      const verifiedSkills = db.getVerifiedSkills(app.studentId);
      const studentSkills = db.getStudentSkills(app.studentId);
      return {
        ...app,
        student,
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { applicationId, status, notes } = body;

    if (!applicationId || !status) {
      return NextResponse.json({ error: 'Application ID and status are required' }, { status: 400 });
    }

    const updated = db.updateApplicationStatus(applicationId, status, notes);
    if (!updated) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Notify student of stage update
    const student = db.getStudentById(updated.studentId);
    if (student) {
      db.createNotification({
        id: `notif_${Date.now()}_app_status`,
        userId: student.userId,
        role: 'student',
        title: `Application Update: ${updated.jobTitle}`,
        message: `Your application to ${updated.companyName} has moved to stage: "${status}".`,
        type: status === 'Selected' || status === 'Shortlisted' ? 'success' : 'info',
        link: `/student/applications`,
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      application: updated,
      message: `Candidate application status updated to ${status}.`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
