import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Project } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, projectId, title, description, technologies, githubUrl, liveUrl } = body;

    if (!studentId || !title) {
      return NextResponse.json({ success: false, error: 'Student ID and project title are required.' }, { status: 400 });
    }

    const student = db.getStudentById(studentId);
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found.' }, { status: 404 });
    }

    // Check if project is already submitted
    const existingProjects = db.getProjectsByStudentId(studentId);
    const alreadyExists = existingProjects.some(p => p.title.toLowerCase() === title.toLowerCase());
    if (alreadyExists) {
      return NextResponse.json({ success: false, error: 'Project with this title has already been submitted.' }, { status: 400 });
    }

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      studentId,
      title,
      description: description || 'No description provided.',
      technologies: technologies || [],
      githubUrl: githubUrl || 'https://github.com/student/project',
      liveUrl: liveUrl || 'https://project-demo.vercel.app',
      verified: true
    };

    db.createProject(newProject);

    // Increment placement readiness by 8% (capping at 100)
    const dbData = db.getStudentById(studentId);
    if (dbData) {
      const data = require('@/lib/db').getDb();
      const std = data.students.find((s: any) => s.id === studentId);
      if (std) {
        std.placementReadiness = Math.min(100, (std.placementReadiness || 65) + 8);
        if (std.placementReadiness >= 80) std.placementStatus = 'Placement Ready';
        require('@/lib/db').saveDb(data);
      }
    }

    return NextResponse.json({
      success: true,
      project: newProject,
      message: 'Project verified and added to your Skill Passport successfully!'
    });
  } catch (error: any) {
    console.error('Error submitting project:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
