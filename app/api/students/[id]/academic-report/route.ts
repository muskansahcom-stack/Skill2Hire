import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const studentId = params.id;
    const report = db.getAcademicReport(studentId);

    if (!report) {
      return NextResponse.json({ error: 'Academic report not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      report
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch academic report' }, { status: 500 });
  }
}
