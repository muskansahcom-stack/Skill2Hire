import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AssessmentResult, VerifiedSkill, Certificate, SkillLevel } from '@/lib/types';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { studentId, answers } = body; // answers: Record<questionId, number>

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    let assessment = db.getAssessmentById(params.id);
    if (!assessment) {
      assessment = db.getAssessmentBySkillName(params.id);
    }

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const student = db.getStudentById(studentId);
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const questions = db.getQuestionsByAssessmentId(assessment.id);
    if (questions.length === 0) {
      return NextResponse.json({ error: 'No questions found for this assessment' }, { status: 400 });
    }

    let totalPoints = 0;
    let earnedPoints = 0;
    let correctCount = 0;
    const questionFeedback: any[] = [];

    const isViolation = body.violation === true;

    questions.forEach(q => {
      totalPoints += q.points;
      const studentAnswer = answers ? answers[q.id] : undefined;
      const isCorrect = studentAnswer === q.correctOptionIndex;

      if (isCorrect && !isViolation) {
        earnedPoints += q.points;
        correctCount += 1;
      }

      questionFeedback.push({
        questionId: q.id,
        questionText: q.questionText,
        selectedOptionIndex: studentAnswer,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect: isViolation ? false : isCorrect,
        explanation: q.explanation
      });
    });

    const calculatedScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    // Enforce strict 75% minimum passing threshold across all certifications
    const finalScore = isViolation ? 0 : calculatedScore;
    const passed = isViolation ? false : finalScore >= 75;

    // Determine skill level awarded
    let awardedLevel: SkillLevel = assessment.targetLevel || 'Intermediate';
    if (finalScore >= 95) awardedLevel = 'Advanced';
    else if (finalScore >= 80) awardedLevel = 'Intermediate';
    else if (finalScore >= 60) awardedLevel = 'Beginner';

    const result: AssessmentResult = {
      id: `res_${Date.now()}`,
      studentId: student.id,
      assessmentId: assessment.id,
      skillId: assessment.skillId,
      skillName: assessment.skillName,
      score: finalScore,
      passed,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      accuracy: Math.round((correctCount / questions.length) * 100),
      levelAwarded: awardedLevel,
      submittedAt: new Date().toISOString()
    };

    db.saveAssessmentResult(result);

    let certificate: Certificate | null = null;
    let verifiedSkill: VerifiedSkill | null = null;

    if (passed) {
      const certId = `CERT-${assessment.skillName.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Issue certificate
      certificate = {
        id: `cert_${Date.now()}`,
        certificateNumber: certId,
        studentId: student.id,
        studentName: student.fullName,
        skillOrCourseName: `${assessment.skillName} (${awardedLevel})`,
        type: 'skill',
        level: awardedLevel,
        score: finalScore,
        issuedDate: new Date().toISOString().split('T')[0],
        verificationUrl: `/verify/${certId}`
      };
      db.createCertificate(certificate);

      // 2. Add verified skill to student passport
      verifiedSkill = {
        id: `vs_${Date.now()}`,
        studentId: student.id,
        skillId: assessment.skillId,
        skillName: assessment.skillName,
        level: awardedLevel,
        score: finalScore,
        credibilityScore: Math.round(finalScore * 0.95 + 4),
        verificationDate: new Date().toISOString(),
        assessmentId: assessment.id,
        certificateId: certId
      };
      db.verifySkill(verifiedSkill);

      // 3. Notify Student
      db.createNotification({
        id: `notif_${Date.now()}_skill_pass`,
        userId: student.userId,
        role: 'student',
        title: `Skill Verified: ${assessment.skillName} — ${awardedLevel} ✓`,
        message: `Congratulations! You scored ${finalScore}% and earned the verified skill badge for ${assessment.skillName}. Your placement readiness has increased!`,
        type: 'success',
        link: `/student/skills`,
        read: false,
        createdAt: new Date().toISOString()
      });

      // 4. Notify College Placement Cell
      const college = db.getCollegeById(student.collegeId);
      if (college) {
        db.createNotification({
          id: `notif_${Date.now()}_col_update`,
          userId: college.userId,
          role: 'college',
          title: `Student Skill Verified: ${student.fullName}`,
          message: `${student.fullName} has verified ${assessment.skillName} (${awardedLevel}) with a score of ${finalScore}%.`,
          type: 'info',
          link: `/college/students`,
          read: false,
          createdAt: new Date().toISOString()
        });
      }
    }

    // Refresh student data to return updated readiness
    const refreshedStudent = db.getStudentById(student.id);

    return NextResponse.json({
      success: true,
      result,
      passed,
      score: finalScore,
      awardedLevel,
      certificate,
      verifiedSkill,
      feedback: questionFeedback,
      updatedStudent: refreshedStudent
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
