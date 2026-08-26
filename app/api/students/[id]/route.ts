import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const student = db.getStudentById(params.id);
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const studentSkills = db.getStudentSkills(params.id);
    const verifiedSkills = db.getVerifiedSkills(params.id);
    const applications = db.getApplicationsByStudentId(params.id);
    const certificates = db.getCertificatesByStudentId(params.id);
    const projects = db.getProjectsByStudentId(params.id);
    const assessmentResults = db.getAssessmentResultsByStudentId(params.id);

    return NextResponse.json({
      student,
      skills: studentSkills,
      verifiedSkills,
      applications,
      certificates,
      projects,
      assessmentResults
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = db.updateStudent(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, student: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
