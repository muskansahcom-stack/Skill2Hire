import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const parentId = searchParams.get('parentId');

    let skills = db.getSkills();

    if (category && category !== 'All') {
      skills = skills.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }

    if (difficulty && difficulty !== 'All') {
      skills = skills.filter(s => s.difficulty?.toLowerCase() === difficulty.toLowerCase());
    }

    if (status && status !== 'All') {
      skills = skills.filter(s => s.status?.toLowerCase() === status.toLowerCase());
    }

    if (parentId) {
      skills = skills.filter(s => s.parent_skill_id === parentId);
    }

    if (search) {
      const q = search.toLowerCase();
      skills = skills.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.subcategory?.toLowerCase().includes(q)
      );
    }

    const categories = Array.from(new Set(db.getSkills().map(s => s.category)));

    return NextResponse.json({
      success: true,
      count: skills.length,
      categories,
      skills
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}
