import { NextRequest, NextResponse } from 'next/server';
import { explainWhyNotEligible } from '@/lib/ai';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = params.id;
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({ success: false, error: 'jobId query parameter required' }, { status: 400 });
    }

    const diagnostic = explainWhyNotEligible(studentId, jobId);

    return NextResponse.json({
      success: true,
      diagnostic
    });
  } catch (error) {
    console.error('Error fetching eligibility diagnostic:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
