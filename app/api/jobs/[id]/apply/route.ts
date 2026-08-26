import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateJobMatch } from '@/lib/ai';
import { Application } from '@/lib/types';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { studentId, notes } = body;

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const job = db.getJobById(params.id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const student = db.getStudentById(studentId);
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Check if already applied
    const existingApps = db.getApplicationsByStudentId(studentId);
    const alreadyApplied = existingApps.find(a => a.jobId === job.id);
    if (alreadyApplied) {
      return NextResponse.json({
        error: 'You have already submitted an application for this position.',
        application: alreadyApplied
      }, { status: 400 });
    }

    // Calculate match percentage at application time
    const matchData = calculateJobMatch(studentId, job.id);

    const newApp: Application = {
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      jobId: job.id,
      studentId: student.id,
      companyId: job.companyId,
      studentName: student.fullName,
      studentEmail: student.email,
      studentCollege: student.collegeName,
      jobTitle: job.title,
      companyName: job.companyName,
      matchPercentage: matchData.matchPercentage,
      status: 'Applied',
      notes: notes || 'Submitted via Skill2Hire verified talent pipeline',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.createApplication(newApp);

    // Create Notification for Recruiter
    const company = db.getCompanyById(job.companyId);
    if (company) {
      db.createNotification({
        id: `notif_${Date.now()}_recruiter`,
        userId: company.userId,
        role: 'company',
        title: `New Verified Applicant for ${job.title}`,
        message: `${student.fullName} (${student.collegeName}) applied with a ${matchData.matchPercentage}% match score.`,
        type: 'success',
        link: `/recruiter/applications`,
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    // Create Notification for Student
    db.createNotification({
      id: `notif_${Date.now()}_student`,
      userId: student.userId,
      role: 'student',
      title: `Application Submitted: ${job.title}`,
      message: `Your application to ${job.companyName} has been received with a verified match score of ${matchData.matchPercentage}%.`,
      type: 'success',
      link: `/student/applications`,
      read: false,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      application: newApp,
      matchPercentage: matchData.matchPercentage,
      message: 'Application submitted successfully! Recruiter has received your verified profile.'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
