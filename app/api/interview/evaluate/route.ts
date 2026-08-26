import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { evaluateInterviewResponse } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, questionText, answerText, category, studentId = 'std_1' } = body;

    if (!questionText || !answerText) {
      return NextResponse.json({ success: false, error: 'questionText and answerText are required' }, { status: 400 });
    }

    const evaluation = evaluateInterviewResponse(questionText, answerText, category || 'Technical');
    evaluation.studentId = studentId;
    evaluation.questionId = questionId || 'iq_custom';

    db.saveInterviewEvaluation(evaluation);

    return NextResponse.json({
      success: true,
      evaluation
    });
  } catch (error) {
    console.error('Error evaluating interview answer:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
