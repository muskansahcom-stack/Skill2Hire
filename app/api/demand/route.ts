import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SkillDemandFilter } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filter: SkillDemandFilter = {
      country: searchParams.get('country') || undefined,
      region: searchParams.get('region') || undefined,
      city: searchParams.get('city') || undefined,
      industry: searchParams.get('industry') || undefined,
      jobRole: searchParams.get('jobRole') || searchParams.get('role') || undefined,
      employer: searchParams.get('employer') || searchParams.get('company') || undefined,
      skill: searchParams.get('skill') || undefined
    };

    const report = db.getSkillDemandReport(filter);

    return NextResponse.json({
      success: true,
      report
    });
  } catch (error: any) {
    console.error('Error computing skill demand:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
