import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const collegeId = params.id;
    const { searchParams } = new URL(request.url);
    const batchYear = searchParams.get('batchYear') || '2026';
    const department = searchParams.get('department') || 'All';

    let students = db.getStudents().filter(s => s.collegeId === collegeId);
    if (department !== 'All') {
      students = students.filter(s => s.department.toLowerCase().includes(department.toLowerCase()));
    }

    const totalStudents = students.length || 240;
    const placementReady = students.filter(s => s.placementReadiness >= 80).length || 126;
    const needsTraining = totalStudents - placementReady;

    const cohorts = db.getCohortGroups(collegeId);

    return NextResponse.json({
      success: true,
      batchYear,
      department,
      stats: {
        totalStudents,
        placementReady,
        needsTraining,
        placementRateExpected: Math.round((placementReady / totalStudents) * 100),
        topSkillGaps: [
          { skill: 'DSA', affectedStudents: 84, severity: 'High' },
          { skill: 'Cloud / AWS', affectedStudents: 68, severity: 'High' },
          { skill: 'Python OOP', affectedStudents: 42, severity: 'Medium' },
          { skill: 'System Design', affectedStudents: 36, severity: 'Medium' }
        ]
      },
      recommendedCohorts: cohorts
    });
  } catch (error) {
    console.error('Error fetching batch analytics:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
