import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const course = db.getCourseById(params.id);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    const modules = db.getModulesByCourseId(course.id);
    const lessons = db.getLessonsByCourseId(course.id);
    const associatedAssessment = db.getAssessments().find(a => a.courseId === course.id || course.targetSkills.includes(a.skillName));

    let progress: any[] = [];
    let completedCount = 0;

    if (studentId) {
      progress = db.getLessonProgress(studentId, course.id);
      completedCount = progress.filter(p => p.status === 'completed').length;
    }

    const modulesWithLessons = modules.map(m => {
      const modLessons = lessons.filter(l => l.moduleId === m.id);
      return {
        ...m,
        lessons: modLessons.map(l => {
          const prog = progress.find(p => p.lessonId === l.id);
          return {
            ...l,
            isCompleted: prog?.status === 'completed',
            progressStatus: prog?.status || 'not_started'
          };
        })
      };
    });

    const completionPercentage = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

    return NextResponse.json({
      success: true,
      course,
      modules: modulesWithLessons,
      lessons,
      associatedAssessment,
      userProgress: {
        completedCount,
        totalLessons: lessons.length,
        completionPercentage,
        isCompleted: completionPercentage === 100
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
