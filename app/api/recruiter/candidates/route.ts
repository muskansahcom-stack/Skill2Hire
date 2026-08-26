import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateJobMatch } from '@/lib/ai';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill')?.toLowerCase();
    const collegeId = searchParams.get('collegeId');
    const minCgpa = searchParams.get('minCgpa') ? Number(searchParams.get('minCgpa')) : 0;
    const onlyVerified = searchParams.get('verified') === 'true';
    const jobId = searchParams.get('jobId');

    let students = db.getStudents();

    if (collegeId && collegeId !== 'All') {
      students = students.filter(s => s.collegeId === collegeId);
    }

    if (minCgpa > 0) {
      students = students.filter(s => s.cgpa >= minCgpa);
    }

    const candidateCards = students.map(student => {
      const studentSkills = db.getStudentSkills(student.id);
      const verifiedSkills = db.getVerifiedSkills(student.id);
      const projects = db.getProjectsByStudentId(student.id);
      const assessments = db.getAssessmentResultsByStudentId(student.id);

      let jobMatch = 0;
      if (jobId) {
        const matchData = calculateJobMatch(student.id, jobId);
        jobMatch = matchData.matchPercentage;
      } else {
        // General match based on readiness
        jobMatch = student.placementReadiness;
      }

      return {
        ...student,
        skills: studentSkills,
        verifiedSkills,
        projects,
        assessments,
        jobMatch,
        hasVerifiedSkills: verifiedSkills.length > 0
      };
    });

    let filtered = candidateCards;

    if (onlyVerified) {
      filtered = filtered.filter(c => c.verifiedSkills.length > 0);
    }

    if (skill) {
      filtered = filtered.filter(c => 
        c.skills.some(s => s.skillName.toLowerCase().includes(skill)) ||
        c.verifiedSkills.some(v => v.skillName.toLowerCase().includes(skill))
      );
    }

    // Sort by match / readiness descending
    filtered.sort((a, b) => b.jobMatch - a.jobMatch);

    return NextResponse.json({
      success: true,
      count: filtered.length,
      candidates: filtered
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
