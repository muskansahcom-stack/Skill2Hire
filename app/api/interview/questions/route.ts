import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'Software Developer';
    const category = searchParams.get('category');

    let questions = db.getInterviewQuestionsByRole(role);
    if (questions.length === 0) {
      questions = db.getInterviewQuestions();
    }

    if (category && category !== 'All') {
      questions = questions.filter(q => q.category.toLowerCase() === category.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      questions
    });
  } catch (error) {
    console.error('Error fetching interview questions:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
