import { NextResponse } from 'next/server';
import { getCareerRecommendations } from '@/lib/ai';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'Software Developer';

    const recommendation = getCareerRecommendations(query);

    return NextResponse.json({
      success: true,
      query,
      recommendation
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
