import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'Software Developer';

    let recommendations = db.getProjectRecommendationsByRole(role);
    if (recommendations.length === 0) {
      recommendations = db.getProjectRecommendations();
    }

    return NextResponse.json({
      success: true,
      role,
      recommendations
    });
  } catch (error) {
    console.error('Error fetching project recommendations:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
