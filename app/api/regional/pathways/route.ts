import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceDistrictId = searchParams.get('sourceDistrictId') || 'in-br-patna';
    const destinationCity = searchParams.get('destinationCity') || 'Bengaluru';
    const targetRole = searchParams.get('targetRole') || 'Full Stack Web Developer';
    const studentId = searchParams.get('studentId') || undefined;

    let candidateSkills: any[] = [];
    if (studentId) {
      candidateSkills = db.getVerifiedSkills(studentId);
    }

    const pathway = db.getMigrationPathway(sourceDistrictId, destinationCity, targetRole, candidateSkills);

    const profile = db.getRegionalProfile('in-bihar');
    const allCorridors = profile?.migrationCorridors || [];

    return NextResponse.json({
      success: true,
      currentAnalysis: pathway,
      availableCorridors: allCorridors
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve migration pathway analysis' },
      { status: 500 }
    );
  }
}
