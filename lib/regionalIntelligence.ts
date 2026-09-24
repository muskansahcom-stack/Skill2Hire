import {
  RegionalProfile,
  RegionalIntelligenceRecord,
  DistrictSkillGapAnalysis,
  MigrationPathwayAnalysis,
  RegionalPublicScheme,
  SkillLevel,
  DataSourceMetadata
} from './types';

/**
 * Regional Language Dictionaries for Localized Accessibility
 * Supports English, Hindi (हिन्दी), and vernacular regional contexts (Bhojpuri / Maithili terminology)
 */
export const REGIONAL_DICTIONARIES: Record<string, Record<string, string>> = {
  en: {
    platformTitle: 'Skill2Hire Global Skills Intelligence',
    regionalPortal: 'Regional Intelligence Portal',
    districtIntelligence: 'District Skill Intelligence',
    employerDemand: 'Local Employer Demand',
    trainingEcosystem: 'Local Training Ecosystem',
    migrationPathways: 'Employment & Migration Corridors',
    publicSchemes: 'Public Employment & Skill Schemes',
    skills: 'Skills',
    vacancies: 'Open Vacancies',
    trainingCapacity: 'Annual Training Capacity',
    placementRate: 'Placement Rate',
    readinessScore: 'Job Readiness Score',
    applyNow: 'Apply for Opportunity',
    explorePathways: 'Explore Career Pathways',
    verifiedCenters: 'BSDM / Accredited Centers'
  },
  hi: {
    platformTitle: 'स्किल2हायर वैश्विक कौशल मंच',
    regionalPortal: 'क्षेत्रीय कौशल आसूचना पोर्टल (Regional Intelligence)',
    districtIntelligence: 'जिला स्तरीय कौशल मांग एवं आपूर्ति',
    employerDemand: 'स्थानीय नियोक्ता मांग (Local Employer Demand)',
    trainingEcosystem: 'प्रशिक्षण एवं कौशल विकास केंद्र (Training Ecosystem)',
    migrationPathways: 'रोजगार एवं प्रवास कॉरिडोर (Employment Corridors)',
    publicSchemes: 'सरकारी कौशल योजनाएं (BSDM, KYP व अन्य)',
    skills: 'कौशल',
    vacancies: 'उपलब्ध रिक्तियां',
    trainingCapacity: 'वार्षिक प्रशिक्षण क्षमता',
    placementRate: 'रोजगार दर (Placement Rate)',
    readinessScore: 'रोजगार तत्परता स्कोर',
    applyNow: 'आवेदन करें',
    explorePathways: 'कैरियर पथ देखें',
    verifiedCenters: 'प्रमाणित कौशल विकास केंद्र'
  },
  bho: {
    platformTitle: 'स्किल2हायर - रोजगार आ हुनर मंच',
    regionalPortal: 'इलाकाई हुनर आ रोजगार पोर्टल',
    districtIntelligence: 'जिलावार हुनर के मांग',
    employerDemand: 'लोकल कंपनी के मांग',
    trainingEcosystem: 'हुनर सिखावे वाला केंद्र',
    migrationPathways: 'कमाई आ पलायन के रस्ता',
    publicSchemes: 'सरकारी रोजगार योजना',
    skills: 'हुनर',
    vacancies: 'खाली पद',
    trainingCapacity: 'सीखे के सीट',
    placementRate: 'नौकरी लगला के दर',
    readinessScore: 'नौकरी के तैयारी',
    applyNow: 'तुरंत आवेदन करीं',
    explorePathways: 'कैरियर के रस्ता देखीं',
    verifiedCenters: 'मान्यता प्राप्त केंद्र'
  },
  ta: {
    platformTitle: 'ஸ்கில்2ஹையர் உலகளாவிய திறன் தளம்',
    regionalPortal: 'பிராந்திய திறன் நுண்ணறிவு போர்டல் (Regional Intelligence)',
    districtIntelligence: 'மாவட்ட அளவிலான திறன் தேவை மற்றும் வழங்கல்',
    employerDemand: 'உள்ளூர் நிறுவனங்களின் தேவை (Local Employer Demand)',
    trainingEcosystem: 'பயிற்சி மற்றும் திறன் மேம்பாட்டு சூழல் (Training Ecosystem)',
    migrationPathways: 'வேலைவாய்ப்பு மற்றும் இடம்பெயர்வு பாதைகள் (Employment Corridors)',
    publicSchemes: 'அரசு திறன் திட்டங்கள் (நான் முதல்வன், ஸ்டார்ட்அப் தமிழ்நாடு)',
    skills: 'திறன்கள்',
    vacancies: 'காலியிடங்கள்',
    trainingCapacity: 'ஆண்டு பயிற்சி திறன்',
    placementRate: 'வேலைவாய்ப்பு விகிதம் (Placement Rate)',
    readinessScore: 'வேலை தயார்நிலை மதிப்பெண்',
    applyNow: 'விண்ணப்பிக்கவும்',
    explorePathways: 'தொழில் பாதைகளை ஆராயுங்கள்',
    verifiedCenters: 'அங்கீகரிக்கப்பட்ட பயிற்சி மையங்கள்'
  },
  te: {
    platformTitle: 'స్కిల్2హైర్ గ్లోబల్ స్కిల్స్ ఇంటెలిజెన్స్',
    regionalPortal: 'ప్రాంతీయ నైపుణ్యాల నిఘా పోర్టల్ (Regional Intelligence)',
    districtIntelligence: 'జిల్లా స్థాయి నైపుణ్య డిమాండ్ మరియు సరఫరా',
    employerDemand: 'స్థానిక కంపెనీల డిమాండ్ (Local Employer Demand)',
    trainingEcosystem: 'శిక్షణ మరియు నైపుణ్యాభివృద్ధి పర్యావరణ వ్యవస్థ',
    migrationPathways: 'ఉపాధి మరియు కెరీర్ కారిడార్లు (Employment Corridors)',
    publicSchemes: 'ప్రభుత్వ నైపుణ్య పథకాలు (TASK, T-Hub, నైపుణ్య మిషన్)',
    skills: 'నైపుణ్యాలు',
    vacancies: 'ఓపెన్ ఖాళీలు',
    trainingCapacity: 'వార్షిక శిక్షణ సామర్థ్యం',
    placementRate: 'ప్లేస్‌మెంట్ రేటు (Placement Rate)',
    readinessScore: 'ఉద్యోగ సంసిద్ధత స్కోరు',
    applyNow: 'దరఖాస్తు చేసుకోండి',
    explorePathways: 'కెరీర్ మార్గాలను అన్వేషించండి',
    verifiedCenters: 'ధృవీకరించబడిన శిక్షణ కేంద్రాలు'
  },
  mr: {
    platformTitle: 'स्किल2हायर ग्लोबल स्किल्स इंटेलिजेंस',
    regionalPortal: 'प्रादेशिक कौशल्य माहिती पोर्टल (Regional Intelligence)',
    districtIntelligence: 'जिल्हास्तरीय कौशल्य मागणी आणि पुरवठा',
    employerDemand: 'स्थानिक कंपन्यांची मागणी (Local Employer Demand)',
    trainingEcosystem: 'प्रशिक्षण व कौशल्य विकास परिसंस्था (Training Ecosystem)',
    migrationPathways: 'रोजगार आणि स्थलांतर कॉरिडॉर (Employment Corridors)',
    publicSchemes: 'शासकीय कौशल्य योजना (MSSDS, महाराष्ट्र स्टार्टअप मिशन)',
    skills: 'कौशल्ये',
    vacancies: 'उपलब्ध नोकऱ्या',
    trainingCapacity: 'वार्षिक प्रशिक्षण क्षमता',
    placementRate: 'प्लेसमेंट दर (Placement Rate)',
    readinessScore: 'नोकरी सज्जता गुण',
    applyNow: 'अर्ज करा',
    explorePathways: 'करिअर मार्ग शोधा',
    verifiedCenters: 'प्रमाणित प्रशिक्षण केंद्रे'
  }
};

/**
 * Calculate comprehensive District Skill Gap Analysis
 */
export function calculateDistrictSkillGap(
  districtId: string,
  records: RegionalIntelligenceRecord[]
): DistrictSkillGapAnalysis {
  const districtRecords = records.filter(r => r.cityOrDistrictId === districtId);

  const districtName = districtRecords[0]?.districtName || 'Selected District';
  const regionId = districtRecords[0]?.regionId || 'in-bihar';

  let totalDemandVacancies = 0;
  let totalSupplyPool = 0;
  const criticalDeficitSkills: DistrictSkillGapAnalysis['criticalDeficitSkills'] = [];

  const trainingPartnersSet = new Set<string>();
  const governmentSchemesSet = new Set<string>();

  districtRecords.forEach(rec => {
    totalDemandVacancies += rec.demand.activeVacancies;
    totalSupplyPool += rec.supply.registeredTalentCount;

    // Deficit calculation: (demand.index - supply.readinessAverage) normalized
    const gapScore = Math.max(0, rec.demand.index - (rec.supply.placementReadyCount / Math.max(rec.supply.registeredTalentCount, 1)) * 50);

    let deficitSeverity: 'Critical Deficit' | 'Moderate Gap' | 'Balanced' = 'Balanced';
    if (gapScore > 65 || rec.demand.urgency === 'Critical') {
      deficitSeverity = 'Critical Deficit';
    } else if (gapScore > 35 || rec.demand.urgency === 'High') {
      deficitSeverity = 'Moderate Gap';
    }

    let recommendedAction = 'Maintain active talent pipeline and campus recruitment drives.';
    if (deficitSeverity === 'Critical Deficit') {
      recommendedAction = `Launch targeted 6-week intensive bootcamp with local training centers for ${rec.skillName}.`;
    } else if (deficitSeverity === 'Moderate Gap') {
      recommendedAction = `Incorporate ${rec.skillName} practical modules into semester polytechnic curriculum.`;
    }

    criticalDeficitSkills.push({
      skillName: rec.skillName,
      demandIndex: rec.demand.index,
      supplyCount: rec.supply.placementReadyCount,
      deficitSeverity,
      localTrainingSeatCapacity: rec.trainingCapacity.annualSeatCapacity,
      recommendedAction
    });

    rec.trainingCapacity.topTrainingInstitutions.forEach(inst => trainingPartnersSet.add(inst));
    if (rec.dataSource.includes('BSDM') || rec.trainingCapacity.bsdmCertifiedCenters) {
      governmentSchemesSet.add('Bihar Skill Development Mission (BSDM) Certified Training');
      governmentSchemesSet.add('Kushal Yuva Program (KYP) Digital Skills');
    }
  });

  // Calculate Overall District Gap Index (0 - 100)
  const averageDemand = districtRecords.reduce((acc, r) => acc + r.demand.index, 0) / Math.max(districtRecords.length, 1);
  const averageReadiness = districtRecords.reduce((acc, r) => acc + r.supply.readinessAverage, 0) / Math.max(districtRecords.length, 1);
  const overallGapIndex = Math.round(Math.max(10, Math.min(95, averageDemand * 0.7 + (100 - averageReadiness) * 0.3)));

  return {
    districtId,
    districtName,
    regionId,
    overallGapIndex,
    totalDemandVacancies,
    totalSupplyPool,
    criticalDeficitSkills: criticalDeficitSkills.sort((a, b) => b.demandIndex - a.demandIndex),
    localTrainingPartners: Array.from(trainingPartnersSet),
    governmentInitiativeTieIns: Array.from(governmentSchemesSet),
    metadata: {
      source_name: 'Skill2Hire Regional Telemetry & Industry Demand Model',
      source_type: 'SYNTHETIC_MODEL',
      data_period: '2026-Q1',
      geographic_scope: `District (${districtName})`,
      last_updated: '2026-09-22',
      verification_status: 'CALCULATED',
      disclaimer: 'Illustrative gap index derived from synthetic regional telemetry — not official statistics'
    }
  };
}

/**
 * Migration Corridor Skill Gap & Economic Mobility Analyzer
 * Compares local baseline capability with destination tech hubs (e.g. Patna -> Bengaluru / Delhi-NCR)
 */
export function calculateMigrationPathway(
  sourceDistrictId: string,
  destinationCity: string,
  targetRole: string,
  profile: RegionalProfile,
  candidateSkills: { skillName: string; level: SkillLevel }[] = []
): MigrationPathwayAnalysis {
  const corridor = profile.migrationCorridors.find(c => 
    c.destinationCity.toLowerCase().includes(destinationCity.toLowerCase())
  ) || profile.migrationCorridors[0];

  const district = profile.districts.find(d => d.id === sourceDistrictId) || profile.districts[0];

  // Benchmark salaries
  const localSalary = '₹22,000 - ₹35,000 / mo';
  const multiplier = corridor ? corridor.averageSalaryMultiplier : 2.5;
  const destinationSalary = `₹${Math.round(25000 * multiplier / 1000) * 1000} - ₹${Math.round(38000 * multiplier / 1000) * 1000} / mo`;

  // Bridge competencies required
  const candidateSkillMap = new Map(candidateSkills.map(s => [s.skillName.toLowerCase(), s.level]));
  
  const bridgeCompetenciesNeeded: MigrationPathwayAnalysis['bridgeCompetenciesNeeded'] = (corridor?.topRequiredBridgeSkills || [
    'Docker & Containerization',
    'Cloud Architecture (AWS/GCP)',
    'System Design & Microservices'
  ]).map(skillName => {
    const current = candidateSkillMap.get(skillName.toLowerCase()) || 'Unverified';
    return {
      skillName,
      currentLevel: current,
      requiredLevel: 'Intermediate' as SkillLevel,
      courseRecommendation: `Mastering ${skillName} for Tier-1 Tech Ecosystems`
    };
  });

  const verifiedBridgeCount = bridgeCompetenciesNeeded.filter(b => b.currentLevel !== 'Unverified').length;
  const currentReadinessScore = Math.min(95, Math.round(55 + (verifiedBridgeCount / bridgeCompetenciesNeeded.length) * 35));
  const destinationReadinessScore = 85;
  const transitionGapPercentage = Math.max(5, destinationReadinessScore - currentReadinessScore);

  return {
    sourceDistrictId: district.id,
    sourceDistrictName: district.name,
    destinationRegionId: corridor?.destinationRegion || 'in-karnataka',
    destinationRegionName: corridor?.destinationRegion || 'Karnataka',
    destinationCity: corridor?.destinationCity || 'Bengaluru',
    targetRole,
    localBaselineSalaryMonthly: localSalary,
    destinationExpectedSalaryMonthly: destinationSalary,
    salaryMultiplier: multiplier,
    currentReadinessScore,
    destinationReadinessScore,
    transitionGapPercentage,
    bridgeCompetenciesNeeded,
    metadata: {
      source_name: 'Skill2Hire Career Mobility Benchmark Model',
      source_type: 'SYNTHETIC_MODEL',
      data_period: '2026-Q1',
      geographic_scope: `${district.name} ➔ ${corridor?.destinationCity || 'Destination'}`,
      last_updated: '2026-09-22',
      verification_status: 'CALCULATED',
      disclaimer: 'Illustrative career mobility benchmarks based on regional salary delta model'
    }
  };
}

/**
 * Match Relevant Public Employment & Skill Development Schemes
 */
export function matchPublicSchemes(
  profile: RegionalProfile,
  candidateDegree?: string,
  placementStatus?: string
): RegionalPublicScheme[] {
  return profile.publicSchemes.filter(scheme => {
    if (scheme.code === 'BSDM') return true; // Global regional baseline
    if (scheme.code === 'KYP') return placementStatus === 'Needs Training' || placementStatus === 'In Training';
    if (scheme.code === 'STARTUP_POLICY') return candidateDegree?.toLowerCase().includes('tech') || candidateDegree?.toLowerCase().includes('engineering');
    return true;
  });
}
