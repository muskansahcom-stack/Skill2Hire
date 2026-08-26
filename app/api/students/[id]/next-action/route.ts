import { NextRequest, NextResponse } from 'next/server';
import { getNextBestAction } from '@/lib/ai';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = params.id;
    const nextAction = getNextBestAction(studentId);

    return NextResponse.json({
      success: true,
      nextAction
    });
  } catch (error) {
    console.error('Error fetching next best action:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
