import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter'); // 'placement_ready' | 'needs_training' | 'all'
    const department = searchParams.get('department');

    let students = db.getStudents().filter(s => s.collegeId === params.id);

    if (filter === 'placement_ready') {
      students = students.filter(s => s.placementReadiness >= 80 || s.placementStatus === 'Placement Ready');
    } else if (filter === 'needs_training') {
      students = students.filter(s => s.placementReadiness < 80 && s.placementStatus !== 'Placed');
    } else if (filter === 'placed') {
      students = students.filter(s => s.placementStatus === 'Placed');
    }

    if (department && department !== 'All') {
      students = students.filter(s => s.department.toLowerCase() === department.toLowerCase());
    }

    const studentsWithSkills = students.map(student => {
      const studentSkills = db.getStudentSkills(student.id);
      const verifiedSkills = db.getVerifiedSkills(student.id);
      const studentApps = db.getApplicationsByStudentId(student.id);
      return {
        ...student,
        skillsCount: studentSkills.length,
        verifiedSkillsCount: verifiedSkills.length,
        verifiedSkillsList: verifiedSkills.map(v => `${v.skillName} (${v.level})`),
        allSkills: studentSkills,
        applicationsCount: studentApps.length,
        applications: studentApps
      };
    });

    return NextResponse.json({
      success: true,
      count: studentsWithSkills.length,
      students: studentsWithSkills
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
