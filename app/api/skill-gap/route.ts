import { NextRequest, NextResponse } from 'next/server';
import { db, getDb } from '@/lib/db';
import { calculateExplainableSkillGap } from '@/lib/skillGapEngine';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId') || 'std_1';
    const jobId = searchParams.get('jobId') || undefined;
    const roleId = searchParams.get('roleId') || undefined;
    const roleTitle = searchParams.get('roleTitle') || undefined;

    const report = db.getSkillGapReport(studentId, { jobId, roleId, roleTitle });

    return NextResponse.json({
      success: true,
      report
    });
  } catch (error: any) {
    console.error('Error computing explainable skill gap:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId = 'std_1', jobId, roleId, roleTitle, candidate, target } = body;

    // If explicit candidate and target payload provided
    if (candidate && target) {
      const dbState = getDb();
      const report = calculateExplainableSkillGap(candidate, target, dbState);
      return NextResponse.json({
        success: true,
        report
      });
    }

    // Default flow resolving against DB
    const report = db.getSkillGapReport(studentId, { jobId, roleId, roleTitle });

    return NextResponse.json({
      success: true,
      report
    });
  } catch (error: any) {
    console.error('Error evaluating custom skill gap:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}
