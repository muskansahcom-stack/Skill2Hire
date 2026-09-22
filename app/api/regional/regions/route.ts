import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get('countryId') || undefined;

    const countries = db.getCountries();
    const regions = db.getRegions(countryId);
    const profiles = db.getRegionalProfiles();

    // Map profiles to regions for rich metadata and credibility status
    const regionsWithProfiles = regions.map(reg => {
      const profile = profiles.find(p => p.regionId === reg.id);
      return {
        ...reg,
        tagline: profile?.tagline || null,
        deploymentStatus: reg.deploymentStatus || (reg.id === 'in-bihar' ? 'ACTIVE_FLAGSHIP' : reg.hasRegionalIntelligence ? 'EXPANSION_DEMO' : 'PLANNED'),
        districtsCount: profile?.districts.length || 0,
        schemesCount: profile?.publicSchemes.length || 0,
        corridorsCount: profile?.migrationCorridors.length || 0,
        dataSourceMetadata: profile?.metadata || reg.metadata || null
      };
    });

    return NextResponse.json({
      success: true,
      countries,
      regions: regionsWithProfiles,
      profiles
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve regions' },
      { status: 500 }
    );
  }
}
