import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { matchPublicSchemes } from '@/lib/regionalIntelligence';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('regionId') || 'in-bihar';
    const studentId = searchParams.get('studentId') || undefined;

    if (regionId === 'global') {
      const allProfiles = db.getRegionalProfiles();
      const allSchemes = allProfiles.flatMap(p => p.publicSchemes);
      return NextResponse.json({
        success: true,
        regionId: 'global',
        regionName: 'Global View',
        totalSchemes: allSchemes.length,
        matchedSchemes: allSchemes,
        allSchemes,
        schemes: allSchemes
      });
    }

    const profile = db.getRegionalProfile(regionId);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: `Regional profile for ${regionId} not found` },
        { status: 404 }
      );
    }

    let matched = profile.publicSchemes;
    if (studentId) {
      const student = db.getStudentById(studentId);
      if (student) {
        matched = matchPublicSchemes(profile, student.degree, student.placementStatus);
      }
    }

    return NextResponse.json({
      success: true,
      regionId,
      regionName: profile.regionName,
      totalSchemes: profile.publicSchemes.length,
      matchedSchemes: matched,
      allSchemes: profile.publicSchemes,
      schemes: matched
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve public schemes' },
      { status: 500 }
    );
  }
}
