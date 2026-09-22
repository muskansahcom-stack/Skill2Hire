import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get('districtId');
    const regionId = searchParams.get('regionId') || 'in-bihar';

    let profile = db.getRegionalProfile(regionId);
    if (!profile || (districtId && !profile.districts.some(d => d.id === districtId))) {
      const allProfiles = db.getRegionalProfiles();
      const matchingProfile = allProfiles.find(p => p.districts.some(d => d.id === districtId));
      if (matchingProfile) {
        profile = matchingProfile;
      }
    }

    if (!profile) {
      return NextResponse.json(
        { success: false, error: `Regional profile not found` },
        { status: 404 }
      );
    }

    if (districtId) {
      // Return granular gap analysis for specific district
      const gapAnalysis = db.getDistrictSkillGap(districtId);
      const districtMeta = profile.districts.find(d => d.id === districtId);

      const topEmployersMap: Record<string, string[]> = {
        'in-br-patna': ['Beltron State Projects', 'TCS Patna Center', 'DeHaat Technologies', 'Bihar State Power'],
        'in-br-muzaffarpur': ['Muzaffarpur IT Park', 'Prabhat Khabar Digital', 'Kanti Thermal Power', 'North Bihar Power'],
        'in-br-gaya': ['Magadh University Tech Hub', 'Bodh Gaya Tourism Tech', 'PowerGrid Gaya', 'Railway Regional Division'],
        'in-br-bhagalpur': ['Silk City IT Hub', 'Bhagalpur Smart City Corp', 'NTPC Kahalgaon', 'TMBU Systems'],
        'in-tn-chennai': ['Zoho Corporation', 'Freshworks', 'Cognizant', 'TCS Siruseri'],
        'in-tn-coimbatore': ['KGISL Technologies', 'Robert Bosch', 'Cognizant CBE', 'Pricol Limited'],
        'in-tg-hyderabad': ['Microsoft India', 'Google Hyderabad', 'T-Hub Startups', 'Infosys Cyberabad'],
        'in-mh-mumbai': ['Jio Platforms', 'Tata Consultancy Services', 'Morgan Stanley', 'L&T Infotech'],
        'in-mh-pune': ['Infosys Hinjawadi', 'Wipro Hinjawadi', 'Persistent Systems', 'Bajaj Finserv'],
        'kr-seoul-pangyo': ['Kakao Corp', 'Naver', 'NCSOFT', 'Krafton'],
        'cn-gd-nanshan': ['Tencent Holdings', 'DJI Innovations', 'ZTE Corporation', 'ByteDance Shenzhen']
      };

      return NextResponse.json({
        success: true,
        district: districtMeta || null,
        regionId: profile.regionId,
        districtName: districtMeta?.name || gapAnalysis.districtName,
        gapIndex: gapAnalysis.overallGapIndex,
        demandMetrics: {
          activeVacancies: gapAnalysis.totalDemandVacancies,
          yoyGrowthRate: 28
        },
        supplyMetrics: {
          totalTalent: gapAnalysis.totalSupplyPool,
          placementReady: gapAnalysis.criticalDeficitSkills.reduce((acc, s) => acc + s.supplyCount, 0)
        },
        trainingCapacity: {
          seatCapacity: gapAnalysis.criticalDeficitSkills.reduce((acc, s) => acc + s.localTrainingSeatCapacity, 0) || 1200,
          activeInstitutions: gapAnalysis.localTrainingPartners.length > 0
            ? gapAnalysis.localTrainingPartners
            : (districtMeta ? [`${districtMeta.name} Polytechnic`, `${districtMeta.name} ITI Institute`, `Accredited Skill Hub`] : ['Certified Regional Center'])
        },
        employmentOutcomes: {
          placementRate: 74,
          avgStartingSalary: profile.countryId === 'kr' ? '₩42,000,000/yr' : profile.countryId === 'cn' ? '¥180,000/yr' : '₹28,000/mo'
        },
        criticalDeficitSkills: gapAnalysis.criticalDeficitSkills.map(s => ({
          skillName: s.skillName,
          demandIndex: s.demandIndex,
          supplyReady: s.supplyCount,
          urgency: s.deficitSeverity === 'Critical Deficit' ? 'Critical' : 'High Deficit',
          recommendedIntervention: s.recommendedAction
        })),
        topEmployers: topEmployersMap[districtId] || ['Regional Tech Enterprise', 'State Digital Projects', 'Local Enterprise Hub'],
        gapAnalysis,
        metadata: gapAnalysis.metadata || districtMeta?.metadata || null
      });
    }

    // Return overview of all districts in region with gap indices
    const allDistrictsGapOverview = profile.districts.map(dist => {
      const gap = db.getDistrictSkillGap(dist.id);
      return {
        ...dist,
        overallGapIndex: gap.overallGapIndex,
        totalDemandVacancies: gap.totalDemandVacancies,
        totalSupplyPool: gap.totalSupplyPool,
        criticalDeficitsCount: gap.criticalDeficitSkills.filter(s => s.deficitSeverity === 'Critical Deficit').length,
        metadata: gap.metadata || null
      };
    });

    return NextResponse.json({
      success: true,
      regionId: profile.regionId,
      districts: allDistrictsGapOverview
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve district intelligence' },
      { status: 500 }
    );
  }
}
