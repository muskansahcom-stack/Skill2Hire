import { NextResponse } from 'next/server';
import { generatePersonalizedRoadmap } from '@/lib/ai';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId') || undefined;
    const targetRole = searchParams.get('targetRole') || undefined;

    const roadmap = generatePersonalizedRoadmap(params.id, jobId, targetRole);

    return NextResponse.json({
      success: true,
      roadmap
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
