import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const filters = db.getSkillDemandFilterOptions();
    return NextResponse.json({
      success: true,
      filters
    });
  } catch (error: any) {
    console.error('Error fetching demand filters:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
