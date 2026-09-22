import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('regionId') || 'in-bihar';
    const cityOrDistrictId = searchParams.get('districtId') || searchParams.get('cityId') || undefined;
    const industryId = searchParams.get('industryId') || undefined;
    const skillId = searchParams.get('skillId') || undefined;

    const records = db.getRegionalIntelligence({
      regionId,
      cityOrDistrictId,
      industryId,
      skillId
    });

    const profile = db.getRegionalProfile(regionId);

    // Compute regional totals
    const totalVacancies = records.reduce((acc, r) => acc + r.demand.activeVacancies, 0);
    const totalRegisteredTalent = records.reduce((acc, r) => acc + r.supply.registeredTalentCount, 0);
    const totalPlacementReady = records.reduce((acc, r) => acc + r.supply.placementReadyCount, 0);
    const avgPlacementRate = Math.round(
      records.reduce((acc, r) => acc + r.employmentOutcomes.historicalPlacementRate, 0) / Math.max(records.length, 1)
    );

    return NextResponse.json({
      success: true,
      regionId,
      profile: profile || null,
      stats: {
        totalRecords: records.length,
        totalVacancies,
        totalRegisteredTalent,
        totalPlacementReady,
        avgPlacementRate
      },
      records
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve regional intelligence' },
      { status: 500 }
    );
  }
}
