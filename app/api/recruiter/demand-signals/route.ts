import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CompanyDemandSignal } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    let signals = db.getDemandSignals();
    if (companyId) {
      signals = db.getDemandSignalsByCompanyId(companyId);
    }

    return NextResponse.json({
      success: true,
      signals
    });
  } catch (error) {
    console.error('Error fetching demand signals:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyId = 'comp_1',
      companyName = 'TechNova',
      targetRole,
      requiredSkills,
      expectedHiringCount,
      targetBatchYear = 2026,
      targetGraduationDate = 'May 2026',
      minCgpa = 7.5,
      offeredSalaryBand = '$95,000 - $125,000 / year',
      messageToColleges
    } = body;

    const signal: CompanyDemandSignal = {
      id: `ds_${Date.now()}`,
      companyId,
      companyName,
      targetRole,
      requiredSkills: requiredSkills || [
        { skill: 'Python', level: 'Intermediate' },
        { skill: 'DSA', level: 'Intermediate' }
      ],
      expectedHiringCount: Number(expectedHiringCount) || 20,
      targetBatchYear: Number(targetBatchYear),
      targetGraduationDate,
      minCgpa: Number(minCgpa),
      offeredSalaryBand,
      status: 'active',
      postedAt: new Date().toISOString(),
      messageToColleges: messageToColleges || `Hiring ${expectedHiringCount} candidates with verified skills.`
    };

    db.createDemandSignal(signal);

    return NextResponse.json({
      success: true,
      signal
    });
  } catch (error) {
    console.error('Error creating demand signal:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
