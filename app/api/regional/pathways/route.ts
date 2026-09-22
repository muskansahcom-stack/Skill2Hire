import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceDistrictId = searchParams.get('sourceDistrictId') || 'in-br-patna';
    const destinationCity = searchParams.get('destinationCity') || 'Bengaluru';
    const targetRole = searchParams.get('targetRole') || 'Full Stack Web Developer';
    const studentId = searchParams.get('studentId') || undefined;

    const regionId = searchParams.get('regionId') || undefined;

    let candidateSkills: any[] = [];
    if (studentId) {
      candidateSkills = db.getVerifiedSkills(studentId);
    }

    const pathway = db.getMigrationPathway(sourceDistrictId, destinationCity, targetRole, candidateSkills, regionId);

    const allProfiles = db.getRegionalProfiles();
    let corridorsToReturn: any[] = [];
    if (regionId && regionId !== 'global') {
      const p = allProfiles.find(prof => prof.regionId === regionId);
      corridorsToReturn = p?.migrationCorridors || [];
    } else {
      corridorsToReturn = allProfiles.flatMap(p => p.migrationCorridors);
    }

    return NextResponse.json({
      success: true,
      currentAnalysis: pathway,
      availableCorridors: corridorsToReturn,
      corridors: corridorsToReturn
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve migration pathway analysis' },
      { status: 500 }
    );
  }
}
