import { NextRequest, NextResponse } from 'next/server';
import { matchTalentBySkillsQuery } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { queryText, minCgpa, collegeId } = body;

    if (!queryText) {
      return NextResponse.json({ success: false, error: 'queryText is required' }, { status: 400 });
    }

    const result = matchTalentBySkillsQuery(queryText, {
      minCgpa: minCgpa ? Number(minCgpa) : undefined,
      collegeId: collegeId || undefined
    });

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error searching talent by skills:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
