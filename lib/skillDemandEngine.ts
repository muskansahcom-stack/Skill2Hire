/**
 * Skill2Hire — Global Employer Skill Demand Engine (Phase 4)
 * 
 * Computes deterministic skill demand metrics STRICTLY from actual platform
 * job records. Generates zero random percentages or fabricated external figures.
 * 
 * Features:
 * - Multi-level geographic drilldown: Global -> Country -> Region -> City -> Industry -> Skill
 * - Required vs. Preferred skill requirement tracking
 * - Minimum proficiency distribution (Beginner, Intermediate, Advanced, Expert)
 * - Bihar-specific platform data provenance tagging with explicit labor market notices
 */

import {
  Job,
  JobSkillRequirement,
  SkillDemandFilter,
  SkillDemandItem,
  SkillDemandAggregateReport,
  SkillDemandFilterOptions,
  SkillLevel
} from './types';

/**
 * Standardizes skill IDs from names if not present
 */
function normalizeSkillId(skillName: string): string {
  const clean = skillName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
  return clean.startsWith('sk_') ? clean : `sk_${clean}`;
}

/**
 * Normalizes proficiency string to valid SkillLevel
 */
function normalizeProficiency(level?: string): SkillLevel {
  if (!level) return 'Intermediate';
  const clean = level.trim().toLowerCase();
  if (clean.startsWith('adv') || clean === 'expert') return 'Advanced';
  if (clean.startsWith('beg')) return 'Beginner';
  return 'Intermediate';
}

/**
 * Central Demand Calculation: aggregates demand purely from actual platform job records.
 */
export function calculateSkillDemand(
  allJobs: Job[],
  filter: SkillDemandFilter = {}
): SkillDemandAggregateReport {
  // Only evaluate published jobs
  const publishedJobs = allJobs.filter(j => j.status === 'published');

  const countryFilter = (filter.country || '').trim().toLowerCase();
  const regionFilter = (filter.region || '').trim().toLowerCase();
  const cityFilter = (filter.city || '').trim().toLowerCase();
  const industryFilter = (filter.industry || '').trim().toLowerCase();
  const roleFilter = (filter.jobRole || '').trim().toLowerCase();
  const employerFilter = (filter.employer || '').trim().toLowerCase();
  const skillFilter = (filter.skill || '').trim().toLowerCase();

  // 1. Filter jobs by scope
  const filteredJobs = publishedJobs.filter(job => {
    // Country filter
    if (countryFilter && countryFilter !== 'all' && countryFilter !== 'global') {
      const jCountry = (job.country || '').toLowerCase();
      const jLoc = (job.location || '').toLowerCase();
      const isCountryMatch = jCountry === countryFilter ||
        (countryFilter === 'india' && (jLoc.includes('india') || jLoc.includes('patna') || jLoc.includes('bihar') || jLoc.includes('bangalore') || jLoc.includes('chennai') || jLoc.includes('pune') || jLoc.includes('hyderabad') || jLoc.includes('noida') || jLoc.includes('gurgaon') || jLoc.includes('muzaffarpur') || jLoc.includes('gaya'))) ||
        (countryFilter === 'united states' && (jLoc.includes('usa') || jLoc.includes('ca') || jLoc.includes('tx') || jLoc.includes('ma') || jLoc.includes('wa') || jLoc.includes('ny') || jLoc.includes('san francisco') || jLoc.includes('austin') || jLoc.includes('palo alto') || jLoc.includes('seattle'))) ||
        (countryFilter === 'china' && (jLoc.includes('china') || jLoc.includes('beijing') || jLoc.includes('shenzhen') || jLoc.includes('shanghai')));
      if (!isCountryMatch) return false;
    }

    // Region / State filter (e.g., Bihar, Tamil Nadu, California)
    if (regionFilter && regionFilter !== 'all') {
      const jRegion = (job.region || '').toLowerCase();
      const jLoc = (job.location || '').toLowerCase();
      const isRegionMatch = jRegion === regionFilter ||
        (regionFilter === 'bihar' && (jLoc.includes('bihar') || jLoc.includes('patna') || jLoc.includes('muzaffarpur') || jLoc.includes('gaya'))) ||
        (regionFilter === 'tamil nadu' && (jLoc.includes('tamil nadu') || jLoc.includes('chennai') || jLoc.includes('coimbatore'))) ||
        (regionFilter === 'karnataka' && (jLoc.includes('karnataka') || jLoc.includes('bangalore') || jLoc.includes('bengaluru'))) ||
        (regionFilter === 'maharashtra' && (jLoc.includes('maharashtra') || jLoc.includes('pune') || jLoc.includes('mumbai'))) ||
        (regionFilter === 'california' && (jLoc.includes('california') || jLoc.includes('ca') || jLoc.includes('san francisco') || jLoc.includes('san jose') || jLoc.includes('palo alto'))) ||
        (regionFilter === 'texas' && (jLoc.includes('texas') || jLoc.includes('tx') || jLoc.includes('austin')));
      if (!isRegionMatch) return false;
    }

    // City / District filter (e.g., Patna, Muzaffarpur, Gaya, Bangalore)
    if (cityFilter && cityFilter !== 'all') {
      const jCity = (job.city || '').toLowerCase();
      const jLoc = (job.location || '').toLowerCase();
      const isCityMatch = jCity === cityFilter || jLoc.includes(cityFilter);
      if (!isCityMatch) return false;
    }

    // Industry filter (e.g., Information Technology, FinTech)
    if (industryFilter && industryFilter !== 'all') {
      const jInd = (job.industry || job.department || '').toLowerCase();
      if (!jInd.includes(industryFilter) && !industryFilter.includes(jInd)) return false;
    }

    // Job Role filter
    if (roleFilter && roleFilter !== 'all') {
      const jRoleId = (job.roleId || '').toLowerCase();
      const jTitle = (job.title || '').toLowerCase();
      const isRoleMatch = jRoleId === roleFilter || jTitle.includes(roleFilter);
      if (!isRoleMatch) return false;
    }

    // Employer filter
    if (employerFilter && employerFilter !== 'all') {
      const jCompName = (job.companyName || '').toLowerCase();
      const jCompId = (job.companyId || '').toLowerCase();
      const isCompMatch = jCompName.includes(employerFilter) || jCompId === employerFilter;
      if (!isCompMatch) return false;
    }

    // Skill filter
    if (skillFilter && skillFilter !== 'all') {
      const hasSkill = job.requiredSkills.some(s => s.skillName.toLowerCase().includes(skillFilter)) ||
        (job.preferredSkills || []).some(s => {
          const sName = typeof s === 'string' ? s : s.skillName;
          return sName.toLowerCase().includes(skillFilter);
        });
      if (!hasSkill) return false;
    }

    return true;
  });

  const totalJobsInScope = filteredJobs.length;

  // 2. Track distinct employers in scope
  const employerSet = new Set<string>();
  const industryCountMap: Record<string, number> = {};
  const roleCountMap: Record<string, number> = {};
  const employerCountMap: Record<string, number> = {};

  filteredJobs.forEach(job => {
    employerSet.add(job.companyName);
    
    const ind = job.industry || job.department || 'Technology';
    industryCountMap[ind] = (industryCountMap[ind] || 0) + 1;

    const role = job.roleTitle || job.title;
    roleCountMap[role] = (roleCountMap[role] || 0) + 1;

    const comp = job.companyName;
    employerCountMap[comp] = (employerCountMap[comp] || 0) + 1;
  });

  // 3. Aggregate Skill Occurrences
  interface SkillAggregator {
    skillId: string;
    skillName: string;
    category: string;
    uniqueJobIds: Set<string>;
    requiredJobIds: Set<string>;
    preferredJobIds: Set<string>;
    proficiencyCounts: {
      Beginner: number;
      Intermediate: number;
      Advanced: number;
      Expert: number;
    };
    industries: Record<string, number>;
    roles: Record<string, number>;
    employers: Record<string, number>;
    locations: Record<string, { country: string; region: string; city: string; count: number }>;
  }

  const skillAggregators: Record<string, SkillAggregator> = {};

  function recordSkill(
    job: Job,
    skillName: string,
    skillId: string | undefined,
    minLevel: SkillLevel,
    isRequired: boolean
  ) {
    const normName = skillName.trim();
    if (!normName) return;

    const key = normName.toLowerCase();
    if (!skillAggregators[key]) {
      skillAggregators[key] = {
        skillId: skillId || normalizeSkillId(normName),
        skillName: normName,
        category: 'Technical',
        uniqueJobIds: new Set(),
        requiredJobIds: new Set(),
        preferredJobIds: new Set(),
        proficiencyCounts: {
          Beginner: 0,
          Intermediate: 0,
          Advanced: 0,
          Expert: 0
        },
        industries: {},
        roles: {},
        employers: {},
        locations: {}
      };
    }

    const agg = skillAggregators[key];
    agg.uniqueJobIds.add(job.id);
    if (isRequired) {
      agg.requiredJobIds.add(job.id);
    } else {
      agg.preferredJobIds.add(job.id);
    }

    const prof = normalizeProficiency(minLevel);
    agg.proficiencyCounts[prof] = (agg.proficiencyCounts[prof] || 0) + 1;

    const ind = job.industry || job.department || 'Technology';
    agg.industries[ind] = (agg.industries[ind] || 0) + 1;

    const role = job.roleTitle || job.title;
    agg.roles[role] = (agg.roles[role] || 0) + 1;

    const emp = job.companyName;
    agg.employers[emp] = (agg.employers[emp] || 0) + 1;

    const locKey = `${job.country || 'Global'}_${job.region || 'Region'}_${job.city || 'City'}`;
    if (!agg.locations[locKey]) {
      agg.locations[locKey] = {
        country: job.country || 'Global',
        region: job.region || 'Region',
        city: job.city || job.location,
        count: 0
      };
    }
    agg.locations[locKey].count += 1;
  }

  // Iterate over every filtered job
  filteredJobs.forEach(job => {
    // Required skills
    (job.requiredSkills || []).forEach(req => {
      recordSkill(job, req.skillName, req.skillId, req.minLevel, true);
    });

    // Preferred skills
    (job.preferredSkills || []).forEach(pref => {
      if (typeof pref === 'string') {
        recordSkill(job, pref, undefined, 'Intermediate', false);
      } else if (pref && typeof pref === 'object') {
        recordSkill(job, pref.skillName, pref.skillId, pref.minLevel, false);
      }
    });
  });

  // 4. Format Skill Demand Items
  const skillsList: SkillDemandItem[] = Object.values(skillAggregators).map(agg => {
    const totalJobCount = agg.uniqueJobIds.size;
    const demandPercent = totalJobsInScope > 0
      ? Math.round((totalJobCount / totalJobsInScope) * 100)
      : 0;

    const topIndustries = Object.entries(agg.industries)
      .map(([industry, count]) => ({ industry, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const topJobRoles = Object.entries(agg.roles)
      .map(([roleTitle, count]) => ({ roleTitle, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const topEmployers = Object.entries(agg.employers)
      .map(([companyName, count]) => ({ companyName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    const topLocations = Object.values(agg.locations)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      skillId: agg.skillId,
      skillName: agg.skillName,
      category: agg.category,
      totalJobCount,
      demandCount: totalJobCount,
      requiredCount: agg.requiredJobIds.size,
      preferredCount: agg.preferredJobIds.size,
      demandPercent,
      percentage: demandPercent,
      proficiencyBreakdown: agg.proficiencyCounts,
      proficiencyDistribution: agg.proficiencyCounts,
      topIndustries,
      topJobRoles,
      topEmployers,
      topLocations
    };
  }).sort((a, b) => {
    if (b.totalJobCount !== a.totalJobCount) {
      return b.totalJobCount - a.totalJobCount;
    }
    return b.requiredCount - a.requiredCount;
  });

  // 5. Detect Bihar Scope
  const isBiharScope =
    regionFilter === 'bihar' ||
    ['patna', 'muzaffarpur', 'gaya', 'bhagalpur', 'darbhanga'].includes(cityFilter);

  // 6. Data Source Provenance Notice
  let dataSourceNotice: SkillDemandAggregateReport['dataSourceNotice'];
  if (isBiharScope) {
    dataSourceNotice = {
      type: 'PLATFORM_DATA',
      badgeText: `Skill2Hire Platform Data (${totalJobsInScope} active jobs in Bihar)`,
      disclaimer: 'Platform data does not represent entire Bihar statewide workforce demand. Figures reflect verified active employer vacancies posted directly on the Skill2Hire platform within Bihar (Patna, Muzaffarpur, Gaya).',
      externalVerificationAvailable: false
    };
  } else {
    dataSourceNotice = {
      type: 'PLATFORM_DATA',
      badgeText: `Skill2Hire Platform Telemetry (${totalJobsInScope} active jobs in scope)`,
      disclaimer: 'Figures reflect real-time skill demand aggregated directly from published employer job specifications on the Skill2Hire platform.',
      externalVerificationAvailable: false
    };
  }

  // 7. Format Top Roll-ups
  const topIndustriesInScope = Object.entries(industryCountMap)
    .map(([industry, jobCount]) => ({ industry, jobCount }))
    .sort((a, b) => b.jobCount - a.jobCount);

  const topRolesInScope = Object.entries(roleCountMap)
    .map(([roleTitle, jobCount]) => ({ roleTitle, jobCount }))
    .sort((a, b) => b.jobCount - a.jobCount);

  const topEmployersInScope = Object.entries(employerCountMap)
    .map(([companyName, jobCount]) => ({ companyName, jobCount }))
    .sort((a, b) => b.jobCount - a.jobCount);

  const totalSkillSignals = skillsList.reduce((acc, s) => acc + s.requiredCount + s.preferredCount, 0);

  const scopeLabelParts: string[] = [];
  if (filter.city && filter.city !== 'all') scopeLabelParts.push(filter.city);
  if (filter.region && filter.region !== 'all') scopeLabelParts.push(filter.region);
  if (filter.country && filter.country !== 'all') scopeLabelParts.push(filter.country);
  if (filter.industry && filter.industry !== 'all') scopeLabelParts.push(filter.industry);
  if (filter.jobRole && filter.jobRole !== 'all') scopeLabelParts.push(filter.jobRole);
  const scopeLabel = scopeLabelParts.length > 0 ? scopeLabelParts.join(' • ') : 'Global Aggregate';

  return {
    scope: {
      country: filter.country || 'Global',
      region: filter.region || 'All Regions',
      city: filter.city || 'All Cities',
      industry: filter.industry || 'All Industries',
      jobRole: filter.jobRole || 'All Roles',
      employer: filter.employer || 'All Employers'
    },
    scopeLabel,
    totalJobsInScope,
    totalActiveJobs: totalJobsInScope,
    totalEmployersInScope: employerSet.size,
    activeEmployersCount: employerSet.size,
    totalUniqueSkillsDemanded: skillsList.length,
    uniqueSkillsTracked: skillsList.length,
    totalSkillSignals,
    skills: skillsList,
    topIndustriesInScope,
    topRolesInScope,
    topEmployersInScope,
    isBiharScope,
    dataSourceNotice,
    biharProvenanceNotice: isBiharScope ? dataSourceNotice.badgeText : undefined,
    laborMarketDisclaimer: isBiharScope ? dataSourceNotice.disclaimer : undefined
  };
}

/**
 * Extracts distinct filter options available from published jobs.
 */
export function extractSkillDemandFilterOptions(allJobs: Job[]): SkillDemandFilterOptions {
  const published = allJobs.filter(j => j.status === 'published');

  const countrySet = new Set<string>();
  const regionMap = new Map<string, string>(); // region -> country
  const cityMap = new Map<string, { region: string; country: string }>();
  const industrySet = new Set<string>();
  const jobRolesMap = new Map<string, string>(); // id -> title
  const employersMap = new Map<string, string>(); // id -> name

  // Always seed standardized primary choices
  countrySet.add('India');
  countrySet.add('United States');
  countrySet.add('China');

  regionMap.set('Bihar', 'India');
  regionMap.set('Tamil Nadu', 'India');
  regionMap.set('Karnataka', 'India');
  regionMap.set('Maharashtra', 'India');
  regionMap.set('Telangana', 'India');
  regionMap.set('California', 'United States');
  regionMap.set('Texas', 'United States');
  regionMap.set('Massachusetts', 'United States');

  cityMap.set('Patna', { region: 'Bihar', country: 'India' });
  cityMap.set('Muzaffarpur', { region: 'Bihar', country: 'India' });
  cityMap.set('Gaya', { region: 'Bihar', country: 'India' });
  cityMap.set('Bangalore', { region: 'Karnataka', country: 'India' });
  cityMap.set('Chennai', { region: 'Tamil Nadu', country: 'India' });
  cityMap.set('Pune', { region: 'Maharashtra', country: 'India' });
  cityMap.set('San Francisco', { region: 'California', country: 'United States' });
  cityMap.set('San Jose', { region: 'California', country: 'United States' });
  cityMap.set('Austin', { region: 'Texas', country: 'United States' });

  industrySet.add('Information Technology');
  industrySet.add('Data & Analytics');
  industrySet.add('FinTech');
  industrySet.add('Healthcare IT');
  industrySet.add('E-Commerce');
  industrySet.add('GovTech & Public Infrastructure');

  published.forEach(j => {
    if (j.country) countrySet.add(j.country);
    if (j.region) {
      regionMap.set(j.region, j.country || 'India');
    }
    if (j.city) {
      cityMap.set(j.city, { region: j.region || 'Region', country: j.country || 'India' });
    }
    if (j.industry) industrySet.add(j.industry);
    if (j.department) industrySet.add(j.department);

    if (j.roleId && j.roleTitle) {
      jobRolesMap.set(j.roleId, j.roleTitle);
    } else if (j.title) {
      jobRolesMap.set(j.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), j.title);
    }

    if (j.companyId && j.companyName) {
      employersMap.set(j.companyId, j.companyName);
    }
  });

  return {
    countries: Array.from(countrySet).sort(),
    regions: Array.from(regionMap.entries()).map(([name, country]) => ({ name, country })),
    cities: Array.from(cityMap.entries()).map(([name, meta]) => ({
      name,
      region: meta.region,
      country: meta.country
    })),
    industries: Array.from(industrySet).sort(),
    jobRoles: Array.from(jobRolesMap.entries()).map(([id, title]) => ({ id, title })),
    employers: Array.from(employersMap.entries()).map(([id, name]) => ({ id, name }))
  };
}
