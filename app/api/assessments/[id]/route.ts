import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    let assessment = db.getAssessmentById(params.id);
    if (!assessment) {
      assessment = db.getAssessmentBySkillName(params.id);
    }

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const questions = db.getQuestionsByAssessmentId(assessment.id);

    // Omit correctOptionIndex when sending questions to client to prevent client-side inspection
    const sanitizedQuestions = questions.map(q => ({
      id: q.id,
      assessmentId: q.assessmentId,
      questionText: q.questionText,
      type: q.type,
      options: q.options,
      codeSnippet: q.codeSnippet,
      points: q.points
    }));

    return NextResponse.json({
      success: true,
      assessment,
      questions: sanitizedQuestions,
      totalQuestions: questions.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
