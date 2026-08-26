import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const category = searchParams.get('category') || 'ALL';
    const studentId = searchParams.get('studentId') || 'std_1';

    const searchResults = db.searchGlobal(query, category, studentId);

    return NextResponse.json({
      success: true,
      ...searchResults
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
