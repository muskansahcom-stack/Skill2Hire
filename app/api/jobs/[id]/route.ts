import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const job = db.getJobById(params.id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId') || 'std_1';

    const matchAnalysis = db.calculateJobMatch(job, studentId);
    const applications = db.getApplicationsByStudentId(studentId);
    const existingApplication = applications.find(a => a.jobId === job.id) || null;

    return NextResponse.json({
      success: true,
      job,
      matchAnalysis,
      existingApplication
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
