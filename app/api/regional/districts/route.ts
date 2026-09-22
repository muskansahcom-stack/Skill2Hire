import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get('districtId');
    const regionId = searchParams.get('regionId') || 'in-bihar';

    const profile = db.getRegionalProfile(regionId);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: `Regional profile for ${regionId} not found` },
        { status: 404 }
      );
    }

    if (districtId) {
      // Return granular gap analysis for specific district
      const gapAnalysis = db.getDistrictSkillGap(districtId);
      const districtMeta = profile.districts.find(d => d.id === districtId);

      return NextResponse.json({
        success: true,
        district: districtMeta || null,
        gapAnalysis
      });
    }

    // Return overview of all districts in region with gap indices
    const allDistrictsGapOverview = profile.districts.map(dist => {
      const gap = db.getDistrictSkillGap(dist.id);
      return {
        ...dist,
        overallGapIndex: gap.overallGapIndex,
        totalDemandVacancies: gap.totalDemandVacancies,
        totalSupplyPool: gap.totalSupplyPool,
        criticalDeficitsCount: gap.criticalDeficitSkills.filter(s => s.deficitSeverity === 'Critical Deficit').length
      };
    });

    return NextResponse.json({
      success: true,
      regionId,
      districts: allDistrictsGapOverview
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve district intelligence' },
      { status: 500 }
    );
  }
}
