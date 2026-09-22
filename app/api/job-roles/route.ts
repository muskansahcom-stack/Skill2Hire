import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const industryId = searchParams.get('industryId') || searchParams.get('industry');
    const careerLevel = searchParams.get('careerLevel') || searchParams.get('level');

    let roles = db.getJobRoles(industryId || undefined);

    if (careerLevel && careerLevel !== 'All') {
      roles = roles.filter(
        r => r.careerLevel?.toLowerCase() === careerLevel.toLowerCase() ||
             r.career_level?.toLowerCase() === careerLevel.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      count: roles.length,
      roles
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch job roles' },
      { status: 500 }
    );
  }
}
