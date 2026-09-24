import { NextRequest, NextResponse } from 'next/server';
import { calculateComprehensiveJobReadiness } from '@/lib/ai';
import { calculateEmploymentReadiness } from '@/lib/employmentReadinessEngine';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = params.id;
    const { searchParams } = new URL(request.url);
    
    // Target parameters
    const jobId = searchParams.get('jobId') || undefined;
    const roleId = searchParams.get('roleId') || undefined;
    const careerId = searchParams.get('careerId') || undefined;
    let targetType = (searchParams.get('targetType') as 'role' | 'career' | 'job') || undefined;
    let targetId = searchParams.get('targetId') || undefined;

    if (!targetId) {
      if (jobId) {
        targetId = jobId;
        targetType = 'job';
      } else if (roleId) {
        targetId = roleId;
        targetType = 'role';
      } else if (careerId) {
        targetId = careerId;
        targetType = 'career';
      } else {
        targetId = 'jr-data-analyst';
        targetType = 'role';
      }
    }

    if (!targetType) {
      if (targetId.startsWith('job_')) targetType = 'job';
      else if (targetId.startsWith('cp_')) targetType = 'career';
      else targetType = 'role';
    }

    // Phase 5 Employment Readiness Engine
    const report = calculateEmploymentReadiness(studentId, targetType, targetId);

    // Legacy backward-compatibility
    const legacyJobId = targetType === 'job' ? targetId : jobId;
    const readiness = calculateComprehensiveJobReadiness(studentId, legacyJobId);

    return NextResponse.json({
      success: true,
      report,
      readiness
    });
  } catch (error) {
    console.error('Error fetching student readiness:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

