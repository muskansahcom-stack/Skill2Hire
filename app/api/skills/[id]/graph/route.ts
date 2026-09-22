import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const context = db.getSkill360(id);

    if (!context) {
      return NextResponse.json(
        { success: false, error: `Skill '${id}' not found in Global Skill Graph` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ...context
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve skill 360 context' },
      { status: 500 }
    );
  }
}
