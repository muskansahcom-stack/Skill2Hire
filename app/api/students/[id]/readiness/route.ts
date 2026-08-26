import { NextRequest, NextResponse } from 'next/server';
import { calculateComprehensiveJobReadiness } from '@/lib/ai';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = params.id;
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId') || undefined;

    const readiness = calculateComprehensiveJobReadiness(studentId, jobId);

    return NextResponse.json({
      success: true,
      readiness
    });
  } catch (error) {
    console.error('Error fetching student readiness:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
