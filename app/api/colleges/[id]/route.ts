import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateIndustrySkillDemand } from '@/lib/ai';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const college = db.getCollegeById(params.id);
    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    const students = db.getStudents().filter(s => s.collegeId === college.id);
    const placementReadyCount = students.filter(s => s.placementReadiness >= 80 || s.placementStatus === 'Placement Ready').length;
    const needsTrainingCount = students.length - placementReadyCount;

    const companies = db.getCompanies();
    const activeJobs = db.getJobs().filter(j => j.status === 'published');
    const applications = db.getApplications().filter(a => students.some(s => s.id === a.studentId));
    const placements = applications.filter(a => a.status === 'Selected').length;

    const industryDemand = calculateIndustrySkillDemand();
    const trainingPrograms = db.getTrainingProgramsByCollegeId(college.id);
    const placementDrives = db.getPlacementDrivesByCollegeId(college.id);

    return NextResponse.json({
      success: true,
      college,
      stats: {
        totalStudents: 2500, // as specified in section 17
        activeEnrolledInDb: students.length,
        placementReady: 1420 + placementReadyCount, // specified in section 17
        needsTraining: 1080 - placementReadyCount,
        companiesCount: 125,
        activeJobsCount: 86,
        applicationsCount: 4200 + applications.length,
        placementsCount: 820 + placements
      },
      students,
      industryDemand: industryDemand.slice(0, 8),
      trainingPrograms,
      placementDrives
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
