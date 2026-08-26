import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Job } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || searchParams.get('query') || '';
    const role = searchParams.get('role') || '';
    const location = searchParams.get('location') || '';
    const workMode = searchParams.get('workMode') || '';
    const employmentType = searchParams.get('employmentType') || '';
    const requiredSkill = searchParams.get('skill') || searchParams.get('requiredSkill') || '';
    const companyId = searchParams.get('companyId') || '';
    const studentId = searchParams.get('studentId') || 'std_1';
    const onlyEligible = searchParams.get('onlyEligible') === 'true';
    const sort = (searchParams.get('sort') as any) || 'relevance';

    const jobs = db.searchJobs({
      query: q || role,
      location,
      workMode,
      employmentType,
      requiredSkill,
      companyId,
      onlyEligible,
      sort,
      studentId
    });

    return NextResponse.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      companyId,
      companyName,
      companyLogo,
      title,
      department,
      description,
      responsibilities,
      requirements,
      requiredSkills,
      location,
      workMode,
      salary,
      employmentType,
      minCgpa,
      graduationYear,
      degree,
      branch,
      openings,
      deadline
    } = body;

    if (!title || !requiredSkills || !Array.isArray(requiredSkills)) {
      return NextResponse.json({ error: 'Job title and required skills array are required.' }, { status: 400 });
    }

    const company = companyId ? db.getCompanyById(companyId) : null;
    const finalCompanyName = companyName || company?.name || 'Partner Recruiter';

    const newJob: Job = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      companyId: companyId || 'comp_1',
      companyName: finalCompanyName,
      companyLogo: companyLogo || company?.logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
      title,
      department: department || 'Engineering',
      description: description || 'Exciting engineering role working on scalable systems.',
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? [responsibilities] : ['Deliver high quality code and participate in sprint planning.']),
      requirements: Array.isArray(requirements) ? requirements : (requirements ? [requirements] : ['Degree in Computer Science or related field.']),
      requiredSkills: requiredSkills.map((s: any) => ({
        skillId: s.skillId || `sk_${(s.skillName || s.name || '').toLowerCase()}`,
        skillName: s.skillName || s.name,
        minLevel: s.minLevel || s.level || 'Intermediate',
        isRequired: s.isRequired !== undefined ? s.isRequired : true,
        weight: s.weight || 1.2
      })),
      location: location || 'Bangalore / Remote',
      workMode: workMode || 'Hybrid',
      salary: salary || '$90,000 - $120,000 / year',
      employmentType: employmentType || 'Full-time',
      minCgpa: minCgpa ? Number(minCgpa) : 7.0,
      graduationYear: graduationYear ? Number(graduationYear) : 2026,
      degree: degree || 'B.S. / B.Tech',
      branch: branch || 'Computer Science / IT',
      openings: openings ? Number(openings) : 3,
      deadline: deadline || '2026-12-31',
      status: 'published',
      createdAt: new Date().toISOString()
    };

    const created = db.createJob(newJob);

    return NextResponse.json({
      success: true,
      message: 'Job published successfully!',
      job: created
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
