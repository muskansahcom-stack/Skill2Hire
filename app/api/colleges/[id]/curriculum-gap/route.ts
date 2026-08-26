import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analyzeCurriculumGaps } from '@/lib/ai';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const college = db.getCollegeById(params.id);
    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    const curriculum = db.getCollegeCurriculum(college.id);
    const gapAnalysis = analyzeCurriculumGaps(college.id);

    return NextResponse.json({
      success: true,
      college,
      currentCurriculum: curriculum,
      ...gapAnalysis
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
