import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { LessonProgress } from '@/lib/types';

export async function POST(
  request: Request,
  { params }: { params: { id: string; lessonId: string } }
) {
  try {
    const body = await request.json();
    const { studentId, status } = body;

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const progress: LessonProgress = {
      id: `lp_${studentId}_${params.lessonId}`,
      studentId,
      courseId: params.id,
      lessonId: params.lessonId,
      status: status || 'completed',
      completedAt: new Date().toISOString()
    };

    db.updateLessonProgress(progress);

    // If assessment score was awarded from video check, update student placement readiness
    if (body.assessmentScore) {
      const student = db.getStudentById(studentId);
      if (student) {
        const bonus = Math.min(100, (student.placementReadiness || 60) + Math.round(body.assessmentScore * 0.05));
        db.updateStudent(student.id, {
          placementReadiness: bonus
        });
      }
    }

    // Calculate total course completion
    const allCourseLessons = db.getLessonsByCourseId(params.id);
    const userProgress = db.getLessonProgress(studentId, params.id);
    const completedCount = userProgress.filter(p => p.status === 'completed').length;
    const isCourseFinished = completedCount >= allCourseLessons.length && allCourseLessons.length > 0;

    let certificate = null;
    if (isCourseFinished) {
      const course = db.getCourseById(params.id);
      const student = db.getStudentById(studentId);
      if (course && student) {
        const certId = `CERT-CRS-${Math.floor(1000 + Math.random() * 9000)}`;
        certificate = {
          id: `cert_${Date.now()}`,
          certificateNumber: certId,
          studentId: student.id,
          studentName: student.fullName,
          skillOrCourseName: course.title,
          type: 'course' as const,
          issuedDate: new Date().toISOString().split('T')[0],
          verificationUrl: `/verify/${certId}`
        };
        db.createCertificate(certificate);

        db.createNotification({
          id: `notif_${Date.now()}`,
          userId: student.userId,
          role: 'student',
          title: `Course Completed: ${course.title}`,
          message: `Congratulations! You completed ${course.title}. Now take the skill assessment to earn your Verified badge!`,
          type: 'success',
          link: `/courses/${course.id}`,
          read: false,
          createdAt: new Date().toISOString()
        });
      }
    }

    return NextResponse.json({
      success: true,
      progress,
      completedCount,
      totalLessons: allCourseLessons.length,
      isCourseFinished,
      certificate
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
