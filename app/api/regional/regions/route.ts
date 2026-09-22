import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get('countryId') || undefined;

    const countries = db.getCountries();
    const regions = db.getRegions(countryId);
    const profiles = db.getRegionalProfiles();

    // Map profiles to regions for rich metadata
    const regionsWithProfiles = regions.map(reg => {
      const profile = profiles.find(p => p.regionId === reg.id);
      return {
        ...reg,
        tagline: profile?.tagline || null,
        districtsCount: profile?.districts.length || 0,
        schemesCount: profile?.publicSchemes.length || 0,
        corridorsCount: profile?.migrationCorridors.length || 0
      };
    });

    return NextResponse.json({
      success: true,
      countries,
      regions: regionsWithProfiles
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve regions' },
      { status: 500 }
    );
  }
}
