import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isSkillMatch } from '@/lib/skillGraph';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const allSkills = db.getSkills();
    const skill = allSkills.find(s => isSkillMatch(s, id));

    if (!skill) {
      return NextResponse.json(
        { success: false, error: `Skill '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      skill
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch skill details' },
      { status: 500 }
    );
  }
}
