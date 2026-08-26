import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { skill: string } }) {
  try {
    const skillName = decodeURIComponent(params.skill);
    const ecosystem = db.getSkillEcosystem(skillName);

    return NextResponse.json({
      success: true,
      ecosystem
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
