import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const skill = searchParams.get('skill');

    let courses = db.getCourses();

    if (category && category !== 'All') {
      courses = courses.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }

    if (skill) {
      courses = courses.filter(c => c.targetSkills.some(s => s.toLowerCase() === skill.toLowerCase()));
    }

    return NextResponse.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
