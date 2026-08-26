import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { matchResumeToJob } from '@/lib/ai';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = params.id;
    const body = await request.json();
    const { jobId, resumeText } = body;

    if (!jobId || !resumeText) {
      return NextResponse.json({ success: false, error: 'jobId and resumeText are required' }, { status: 400 });
    }

    const analysis = matchResumeToJob(resumeText, jobId, studentId);
    db.saveResumeAnalysis(analysis);

    return NextResponse.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Error analyzing resume match:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
