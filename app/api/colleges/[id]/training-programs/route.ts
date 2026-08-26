import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { TrainingProgram } from '@/lib/types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const programs = db.getTrainingProgramsByCollegeId(params.id);
    return NextResponse.json({ success: true, programs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { title, description, durationWeeks, targetSkills, targetStudentCount, modules } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const newProgram: TrainingProgram = {
      id: `tp_${Date.now()}`,
      collegeId: params.id,
      title,
      description: description || `Dedicated training program for ${title}`,
      durationWeeks: Number(durationWeeks) || 8,
      targetSkills: Array.isArray(targetSkills) ? targetSkills : ['Python', 'DSA', 'SQL'],
      targetStudentCount: Number(targetStudentCount) || 200,
      enrolledStudentCount: 45,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + (Number(durationWeeks) || 8) * 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'active',
      modules: Array.isArray(modules) ? modules : [
        'Python Basics & Syntax',
        'Conditions & Loops',
        'Functions & Collections',
        'Data Structures & Algorithms in Python',
        'Object-Oriented Programming',
        'File Handling & Exception Controls',
        'Placement Coding Practice',
        'Final Assessment'
      ]
    };

    db.createTrainingProgram(newProgram);

    // Notify students of the college
    const collegeStudents = db.getStudents().filter(s => s.collegeId === params.id);
    collegeStudents.slice(0, 5).forEach(std => {
      db.createNotification({
        id: `notif_${Date.now()}_${std.id}`,
        userId: std.userId,
        role: 'student',
        title: `New Training Program: ${newProgram.title}`,
        message: `Your college has launched ${newProgram.title} (${newProgram.durationWeeks} weeks) to bridge industry skill gaps.`,
        type: 'info',
        link: `/student/skills`,
        read: false,
        createdAt: new Date().toISOString()
      });
    });

    return NextResponse.json({
      success: true,
      program: newProgram,
      message: 'Training program created and students notified successfully.'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
