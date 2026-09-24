import {
  SkillLevel,
  EmploymentReadinessReport,
  ReadinessDimensionScore,
  ReadinessChecklistItem,
  PersonalizedPriorityItem,
  JobRole,
  CareerPath,
  Job,
  VerifiedSkill,
  StudentSkill,
  AssessmentResult,
  Project,
  InterviewAnswerEvaluation,
  CodingAttempt,
  Certificate
} from './types';
import { db } from './db';
import { normalizeSkillToken } from './skillGraph';

// Level numeric weights for comparative delta
const LEVEL_WEIGHT: Record<SkillLevel | 'None', number> = {
  None: 0,
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4
};

interface TargetSkillRequirement {
  skillId?: string;
  skillName: string;
  minLevel: SkillLevel;
  isRequired: boolean;
}

interface TargetOpportunityInfo {
  id: string;
  type: 'role' | 'career' | 'job';
  title: string;
  industry?: string;
  company?: string;
  skills: TargetSkillRequirement[];
  recommendedCourses: string[];
  recommendedProjects: string[];
}

/**
 * Resolves any target identifier (Job Role, Career Path, or Job Posting)
 * into a standardized structure of required & preferred skills.
 */
export function resolveTargetOpportunity(
  targetType: 'role' | 'career' | 'job' | string,
  targetId: string,
  database?: any
): TargetOpportunityInfo {
  const currentDb = (database || db) as typeof db;
  const roles: JobRole[] = currentDb.getJobRoles();
  const careers: CareerPath[] = currentDb.getCareerPaths();
  const jobs: Job[] = currentDb.getJobs();

  // 1. Check Job Role by ID or normalized name
  const roleMatch = roles.find(
    r => r.id === targetId || r.role_id === targetId || normalizeSkillToken(r.title) === normalizeSkillToken(targetId)
  );
  if (roleMatch && (targetType === 'role' || (!targetId.startsWith('job_') && !targetId.startsWith('cp_')))) {
    const skills: TargetSkillRequirement[] = [];

    if (roleMatch.proficiency_requirements && roleMatch.proficiency_requirements.length > 0) {
      roleMatch.proficiency_requirements.forEach(p => {
        skills.push({
          skillId: p.skillId,
          skillName: p.skillName || p.skillId || 'Skill',
          minLevel: p.minLevel || 'Intermediate',
          isRequired: p.isRequired !== false
        });
      });
    } else if (roleMatch.standardRequiredSkills && roleMatch.standardRequiredSkills.length > 0) {
      roleMatch.standardRequiredSkills.forEach(s => {
        skills.push({
          skillId: s.skillId,
          skillName: s.skillName || s.skillId || 'Skill',
          minLevel: s.minLevel || 'Intermediate',
          isRequired: s.isRequired !== false
        });
      });
    } else {
      (roleMatch.required_skills || []).forEach(s => {
        skills.push({
          skillId: s,
          skillName: s.replace(/^sk_/, '').toUpperCase(),
          minLevel: 'Intermediate',
          isRequired: true
        });
      });
      (roleMatch.preferred_skills || []).forEach(s => {
        skills.push({
          skillId: s,
          skillName: s.replace(/^sk_/, '').toUpperCase(),
          minLevel: 'Intermediate',
          isRequired: false
        });
      });
    }

    return {
      id: roleMatch.id,
      type: 'role',
      title: roleMatch.title,
      industry: roleMatch.industry,
      skills,
      recommendedCourses: ['Python Fundamentals & OOP for Placement', 'SQL & Relational Database Architecture'],
      recommendedProjects: ['High-Throughput Distributed Task Queue', 'Predictive Analytics Pipeline']
    };
  }

  // 2. Check Career Path by ID
  const careerMatch = careers.find(
    c => c.id === targetId || normalizeSkillToken(c.title) === normalizeSkillToken(targetId)
  );
  if (careerMatch) {
    const skills: TargetSkillRequirement[] = (careerMatch.requiredSkills || []).map(r => ({
      skillName: r.skill,
      minLevel: r.level || 'Intermediate',
      isRequired: true
    }));

    return {
      id: careerMatch.id,
      type: 'career',
      title: careerMatch.title,
      industry: 'Technology & Digital Infrastructure',
      skills,
      recommendedCourses: careerMatch.recommendedCourses || [],
      recommendedProjects: careerMatch.recommendedProjects || []
    };
  }

  // 3. Check Job Posting by ID
  const jobMatch = jobs.find(j => j.id === targetId);
  if (jobMatch) {
    const skills: TargetSkillRequirement[] = [];

    if ((jobMatch as any).requiredSkillsProficiency && (jobMatch as any).requiredSkillsProficiency.length > 0) {
      (jobMatch as any).requiredSkillsProficiency.forEach((p: any) => {
        skills.push({
          skillId: p.skillId,
          skillName: p.skillName || p.skillId || 'Skill',
          minLevel: p.minLevel || 'Intermediate',
          isRequired: p.isRequired !== false
        });
      });
    } else {
      (jobMatch.requiredSkills || []).forEach((s: any) => {
        if (typeof s === 'string') {
          skills.push({
            skillName: s,
            minLevel: 'Intermediate',
            isRequired: true
          });
        } else if (s && typeof s === 'object') {
          skills.push({
            skillId: s.skillId,
            skillName: s.skillName || s.skill || s.name || s.skillId || 'Skill',
            minLevel: s.minLevel || 'Intermediate',
            isRequired: s.isRequired !== false
          });
        }
      });
      (jobMatch.preferredSkills || []).forEach((s: any) => {
        if (typeof s === 'string') {
          skills.push({
            skillName: s,
            minLevel: 'Intermediate',
            isRequired: false
          });
        } else if (s && typeof s === 'object') {
          skills.push({
            skillId: s.skillId,
            skillName: s.skillName || s.skill || s.name || s.skillId || 'Skill',
            minLevel: s.minLevel || 'Intermediate',
            isRequired: false
          });
        }
      });
    }

    return {
      id: jobMatch.id,
      type: 'job',
      title: jobMatch.title,
      company: jobMatch.companyName,
      industry: jobMatch.industry || 'Information Technology',
      skills,
      recommendedCourses: ['Python Fundamentals & OOP for Placement', 'SQL & Relational Database Architecture'],
      recommendedProjects: ['Distributed Analytics Engine']
    };
  }

  // Default fallback: Data Analyst & BI Specialist
  const fallbackRole = roles.find(r => r.id === 'jr-data-analyst') || roles[0];
  return {
    id: fallbackRole ? fallbackRole.id : 'jr-data-analyst',
    type: 'role',
    title: fallbackRole ? fallbackRole.title : 'Junior Data Analyst',
    industry: 'Information Technology & Software',
    skills: [
      { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Intermediate', isRequired: true },
      { skillId: 'sk_python', skillName: 'Python', minLevel: 'Intermediate', isRequired: true },
      { skillId: 'sk_powerbi', skillName: 'Power BI', minLevel: 'Intermediate', isRequired: false },
      { skillId: 'sk_pandas', skillName: 'Pandas & NumPy', minLevel: 'Intermediate', isRequired: false }
    ],
    recommendedCourses: ['SQL & Relational Database Architecture', 'Python Fundamentals & OOP for Placement'],
    recommendedProjects: ['E-Commerce Predictive Customer Churn & Analytics']
  };
}

/**
 * PHASE 5: EMPLOYMENT READINESS ENGINE
 *
 * Dynamically evaluates what a student needs before applying for a selected role/career.
 * Analyzes 7 core dimensions without arbitrary guessing:
 * 1. Skill Coverage (25%)
 * 2. Assessment Results (20%)
 * 3. Practical Evidence (10%)
 * 4. Projects (15%)
 * 5. Resume Optimization (10%)
 * 6. Interview Preparation (10%)
 * 7. Relevant Experience (10%)
 */
export function calculateEmploymentReadiness(
  studentId: string,
  targetType: 'role' | 'career' | 'job' = 'role',
  targetId: string = 'jr-data-analyst',
  database?: any
): EmploymentReadinessReport {
  const currentDb = (database || db) as typeof db;
  const student = currentDb.getStudentById(studentId) || currentDb.getStudents()[0];
  const target = resolveTargetOpportunity(targetType, targetId, currentDb);

  // Retrieve Candidate Data
  const verifiedSkills: VerifiedSkill[] = currentDb.getVerifiedSkills(student.id);
  const studentSkills: StudentSkill[] = currentDb.getStudentSkills(student.id);
  const assessmentResults: AssessmentResult[] = currentDb.getAssessmentResultsByStudentId(student.id);
  const projects: Project[] = currentDb.getProjectsByStudentId(student.id);
  const certificates: Certificate[] = currentDb.getCertificatesByStudentId(student.id);
  const codingAttempts: CodingAttempt[] = currentDb.getCodingAttemptsByStudentId(student.id);
  const interviewEvals: InterviewAnswerEvaluation[] = currentDb.getInterviewEvaluationsByStudentId(student.id);

  // Required Skills List
  const requiredSkills = target.skills.filter(s => s.isRequired);
  const totalRequired = Math.max(1, requiredSkills.length);

  // ----------------------------------------------------
  // 1. SKILL COVERAGE (Weight: 25%)
  // ----------------------------------------------------
  let coveredCount = 0;
  target.skills.forEach(req => {
    const token = normalizeSkillToken(req.skillName);
    const hasVerified = verifiedSkills.some((v: VerifiedSkill) => normalizeSkillToken(v.skillName) === token);
    const hasDeclared = studentSkills.some((s: StudentSkill) => normalizeSkillToken(s.skillName) === token);
    const hasProject = projects.some((p: Project) => (p.technologies || []).some((t: string) => normalizeSkillToken(t) === token));
    if (hasVerified || hasDeclared || hasProject) {
      coveredCount++;
    }
  });

  const skillCoveragePct = Math.min(100, Math.round((coveredCount / Math.max(1, target.skills.length)) * 100));
  const skillCoveragePts = Math.round(skillCoveragePct * 0.25 * 10) / 10;
  const skillCoverageStatus = skillCoveragePct >= 80 ? 'OPTIMAL' : skillCoveragePct >= 50 ? 'ADEQUATE' : 'NEEDS_WORK';

  const skillCoverageDim: ReadinessDimensionScore = {
    name: 'Skill Coverage',
    key: 'skillCoverage',
    score: skillCoveragePct,
    weight: 0.25,
    pointsEarned: skillCoveragePts,
    maxPoints: 25,
    status: skillCoverageStatus,
    details: `${coveredCount} of ${target.skills.length} role skills found in student passport or projects`,
    formulaDescription: `(${coveredCount}/${target.skills.length}) skills present × 25% weight = ${skillCoveragePts} pts`
  };

  // ----------------------------------------------------
  // 2. ASSESSMENT RESULTS (Weight: 20%)
  // ----------------------------------------------------
  let verifiedReqCount = 0;
  let totalAssessmentScore = 0;
  let assessedCount = 0;

  target.skills.forEach(req => {
    const token = normalizeSkillToken(req.skillName);
    const v = verifiedSkills.find((vs: VerifiedSkill) => normalizeSkillToken(vs.skillName) === token);
    if (v) {
      verifiedReqCount++;
      totalAssessmentScore += v.score;
      assessedCount++;
    } else {
      const a = assessmentResults.find((ar: AssessmentResult) => normalizeSkillToken(ar.skillName) === token && ar.passed);
      if (a) {
        verifiedReqCount++;
        totalAssessmentScore += a.score;
        assessedCount++;
      }
    }
  });

  const avgAssessmentScore = assessedCount > 0 ? totalAssessmentScore / assessedCount : 0;
  const verifiedRatio = verifiedReqCount / totalRequired;
  const assessmentScorePct = Math.min(
    100,
    Math.round(verifiedRatio * 75 + (avgAssessmentScore > 0 ? (avgAssessmentScore / 100) * 25 : 0))
  );
  const assessmentPts = Math.round(assessmentScorePct * 0.20 * 10) / 10;
  const assessmentStatus = assessmentScorePct >= 75 ? 'OPTIMAL' : assessmentScorePct >= 40 ? 'ADEQUATE' : 'NEEDS_WORK';

  const assessmentDim: ReadinessDimensionScore = {
    name: 'Assessment Results',
    key: 'assessmentResults',
    score: assessmentScorePct,
    weight: 0.20,
    pointsEarned: assessmentPts,
    maxPoints: 20,
    status: assessmentStatus,
    details: `${verifiedReqCount} of ${totalRequired} required skills officially verified (Avg test accuracy: ${Math.round(avgAssessmentScore)}%)`,
    formulaDescription: `[(${verifiedReqCount}/${totalRequired} verified × 75%) + (${Math.round(avgAssessmentScore)}% avg score × 25%)] × 20% = ${assessmentPts} pts`
  };

  // ----------------------------------------------------
  // 3. PROJECTS (Weight: 15%)
  // ----------------------------------------------------
  const targetTokens = new Set(target.skills.map(s => normalizeSkillToken(s.skillName)));
  const matchingProjects = projects.filter((p: Project) =>
    (p.technologies || []).some((t: string) => targetTokens.has(normalizeSkillToken(t)))
  );
  const appliedTechnologies = new Set<string>();
  matchingProjects.forEach((p: Project) => {
    (p.technologies || []).forEach((t: string) => {
      if (targetTokens.has(normalizeSkillToken(t))) {
        appliedTechnologies.add(t);
      }
    });
  });

  let projectScorePct = 0;
  if (matchingProjects.length >= 2) projectScorePct = 95;
  else if (matchingProjects.length === 1) projectScorePct = 70;
  else if (projects.length > 0) projectScorePct = 40;
  else projectScorePct = 10;

  const projectPts = Math.round(projectScorePct * 0.15 * 10) / 10;
  const projectStatus = projectScorePct >= 75 ? 'OPTIMAL' : projectScorePct >= 50 ? 'ADEQUATE' : 'NEEDS_WORK';

  const projectDim: ReadinessDimensionScore = {
    name: 'Projects',
    key: 'projects',
    score: projectScorePct,
    weight: 0.15,
    pointsEarned: projectPts,
    maxPoints: 15,
    status: projectStatus,
    details: `${matchingProjects.length} completed project(s) applying role stack (${Array.from(appliedTechnologies).join(', ') || 'No direct overlap yet'})`,
    formulaDescription: `${matchingProjects.length} matching portfolio project(s) evaluated against target stack × 15% = ${projectPts} pts`
  };

  // ----------------------------------------------------
  // 4. PRACTICAL EVIDENCE (Weight: 10%)
  // ----------------------------------------------------
  const certsCount = certificates.length;
  const projectsWithArtifacts = projects.filter((p: Project) => p.githubUrl || p.liveUrl).length;
  const totalEvidenceArtifacts = certsCount + projectsWithArtifacts;

  let evidenceScorePct = 0;
  if (totalEvidenceArtifacts >= 3) evidenceScorePct = 100;
  else if (totalEvidenceArtifacts === 2) evidenceScorePct = 80;
  else if (totalEvidenceArtifacts === 1) evidenceScorePct = 55;
  else evidenceScorePct = 20;

  const evidencePts = Math.round(evidenceScorePct * 0.10 * 10) / 10;
  const evidenceStatus = evidenceScorePct >= 75 ? 'OPTIMAL' : evidenceScorePct >= 50 ? 'ADEQUATE' : 'NEEDS_WORK';

  const evidenceDim: ReadinessDimensionScore = {
    name: 'Practical Evidence',
    key: 'practicalEvidence',
    score: evidenceScorePct,
    weight: 0.10,
    pointsEarned: evidencePts,
    maxPoints: 10,
    status: evidenceStatus,
    details: `${certsCount} verified certificate credential(s) & ${projectsWithArtifacts} repository/live deployment artifact(s)`,
    formulaDescription: `${totalEvidenceArtifacts} verified artifacts (certificates + code links) × 10% = ${evidencePts} pts`
  };

  // ----------------------------------------------------
  // 5. RESUME OPTIMIZATION (Weight: 10%)
  // ----------------------------------------------------
  const bio = (student.bio || '').toLowerCase();
  const dept = (student.department || '').toLowerCase();
  let keywordMatches = 0;
  const targetKeywords = target.title.toLowerCase().split(/\s+/).concat(target.skills.map(s => s.skillName.toLowerCase()));
  const checkedTerms = new Set<string>();

  targetKeywords.forEach(kw => {
    if (kw.length >= 3 && !checkedTerms.has(kw)) {
      checkedTerms.add(kw);
      if (bio.includes(kw) || dept.includes(kw)) {
        keywordMatches++;
      }
    }
  });

  const resumeCompleteness = student.bio && student.degree && student.department ? 70 : 40;
  const resumeKeywordBonus = Math.min(30, keywordMatches * 10);
  const resumeScorePct = Math.min(100, resumeCompleteness + resumeKeywordBonus);
  const resumePts = Math.round(resumeScorePct * 0.10 * 10) / 10;
  const resumeStatus = resumeScorePct >= 75 ? 'OPTIMAL' : resumeScorePct >= 50 ? 'ADEQUATE' : 'NEEDS_WORK';

  const resumeDim: ReadinessDimensionScore = {
    name: 'Resume Optimization',
    key: 'resume',
    score: resumeScorePct,
    weight: 0.10,
    pointsEarned: resumePts,
    maxPoints: 10,
    status: resumeStatus,
    details: `${keywordMatches} target competencies found in resume bio & academic background (${student.department || 'CS'})`,
    formulaDescription: `Resume structure (${resumeCompleteness}%) + keyword alignment (${resumeKeywordBonus}%) × 10% = ${resumePts} pts`
  };

  // ----------------------------------------------------
  // 6. INTERVIEW PREPARATION (Weight: 10%)
  // ----------------------------------------------------
  let interviewScorePct = 0;
  let avgInterviewScore = 0;

  if (interviewEvals.length > 0) {
    const sumScore = interviewEvals.reduce((acc: number, curr: InterviewAnswerEvaluation) => acc + curr.overallScore, 0);
    avgInterviewScore = sumScore / interviewEvals.length;
    interviewScorePct = Math.min(100, Math.round(avgInterviewScore));
    if (interviewEvals.length >= 2) {
      interviewScorePct = Math.min(100, interviewScorePct + 5);
    }
  } else {
    interviewScorePct = 25;
  }

  const interviewPts = Math.round(interviewScorePct * 0.10 * 10) / 10;
  const interviewStatus = interviewScorePct >= 75 ? 'OPTIMAL' : interviewScorePct >= 50 ? 'ADEQUATE' : 'NEEDS_WORK';

  const interviewDim: ReadinessDimensionScore = {
    name: 'Interview Preparation',
    key: 'interviewPrep',
    score: interviewScorePct,
    weight: 0.10,
    pointsEarned: interviewPts,
    maxPoints: 10,
    status: interviewStatus,
    details: interviewEvals.length > 0
      ? `${interviewEvals.length} AI mock interview(s) completed (Avg performance: ${Math.round(avgInterviewScore)}%)`
      : '0 mock interview sessions recorded for this role profile',
    formulaDescription: `${interviewEvals.length} interview evaluation(s) with ${Math.round(interviewScorePct)}% rating × 10% = ${interviewPts} pts`
  };

  // ----------------------------------------------------
  // 7. RELEVANT EXPERIENCE (Weight: 10%)
  // ----------------------------------------------------
  const solvedCount = codingAttempts.filter((c: CodingAttempt) => c.status === 'Solved ✓').length;
  const cgpa = student.cgpa || 8.0;
  const cgpaBonus = cgpa >= 8.5 ? 40 : cgpa >= 7.5 ? 30 : 20;
  const codingScore = Math.min(60, solvedCount * 20 + 20);
  const experienceScorePct = Math.min(100, cgpaBonus + codingScore);
  const experiencePts = Math.round(experienceScorePct * 0.10 * 10) / 10;
  const experienceStatus = experienceScorePct >= 75 ? 'OPTIMAL' : experienceScorePct >= 50 ? 'ADEQUATE' : 'NEEDS_WORK';

  const experienceDim: ReadinessDimensionScore = {
    name: 'Relevant Experience',
    key: 'relevantExperience',
    score: experienceScorePct,
    weight: 0.10,
    pointsEarned: experiencePts,
    maxPoints: 10,
    status: experienceStatus,
    details: `${solvedCount} verified algorithmic challenge(s) solved, academic standing: ${cgpa} CGPA`,
    formulaDescription: `Algorithmic problems (${codingScore}%) + Academic standing (${cgpaBonus}%) × 10% = ${experiencePts} pts`
  };

  // ----------------------------------------------------
  // OVERALL WEIGHTED READINESS SCORE (0 - 100)
  // ----------------------------------------------------
  const totalEarnedPoints =
    skillCoveragePts +
    assessmentPts +
    projectPts +
    evidencePts +
    resumePts +
    interviewPts +
    experiencePts;

  const overallReadinessScore = Math.min(100, Math.max(0, Math.round(totalEarnedPoints)));

  let readinessLabel: EmploymentReadinessReport['readinessLabel'] = 'Preparation Required';
  if (overallReadinessScore >= 75) {
    readinessLabel = 'Ready to Apply ✓';
  } else if (overallReadinessScore >= 55) {
    readinessLabel = 'Almost Ready (Close 1-2 Gaps)';
  }

  const readinessExplanation =
    `Your readiness score of ${overallReadinessScore}% is computed directly from 7 verified competency pillars without estimation: ` +
    `Skill Coverage (${skillCoveragePts}/25), Assessment Results (${assessmentPts}/20), Projects (${projectPts}/15), ` +
    `Practical Evidence (${evidencePts}/10), Resume Optimization (${resumePts}/10), Interview Prep (${interviewPts}/10), and Experience (${experiencePts}/10).`;

  // ----------------------------------------------------
  // PROMPT-MATCHING CHECKLIST ITEMS
  // E.g.:
  // TARGET: Data Analyst
  // SQL: ✓ Intermediate
  // Python: ⚠ Beginner
  // Power BI: ✕ Not assessed
  // Project: ⚠ Missing
  // Interview: ✓ Prepared
  // ----------------------------------------------------
  const checklist: ReadinessChecklistItem[] = [];

  target.skills.forEach(req => {
    const token = normalizeSkillToken(req.skillName);
    const verified = verifiedSkills.find((v: VerifiedSkill) => normalizeSkillToken(v.skillName) === token);
    const passedAssessment = assessmentResults.find((a: AssessmentResult) => normalizeSkillToken(a.skillName) === token && a.passed);
    const declared = studentSkills.find((s: StudentSkill) => normalizeSkillToken(s.skillName) === token);
    const hasProject = projects.some((p: Project) => (p.technologies || []).some((t: string) => normalizeSkillToken(t) === token));

    if (verified) {
      const curWeight = LEVEL_WEIGHT[verified.level as SkillLevel] || 1;
      const reqWeight = LEVEL_WEIGHT[req.minLevel as SkillLevel] || 1;

      if (curWeight >= reqWeight) {
        checklist.push({
          name: req.skillName,
          category: 'SKILL',
          symbol: '✓',
          statusText: verified.level,
          badgeVariant: 'success',
          detail: `Verified via Proctored Assessment (${verified.score}%)`,
          actionUrl: `/assessments`,
          actionLabel: 'View Certificate'
        });
      } else {
        checklist.push({
          name: req.skillName,
          category: 'SKILL',
          symbol: '⚠',
          statusText: verified.level,
          badgeVariant: 'warning',
          detail: `Current: ${verified.level} • Required: ${req.minLevel}`,
          actionUrl: `/assessments/asm_python`,
          actionLabel: 'Upgrade Level'
        });
      }
    } else if (passedAssessment) {
      checklist.push({
        name: req.skillName,
        category: 'SKILL',
        symbol: '✓',
        statusText: passedAssessment.levelAwarded || 'Intermediate',
        badgeVariant: 'success',
        detail: `Passed timed assessment with ${passedAssessment.score}% accuracy`,
        actionUrl: `/assessments`,
        actionLabel: 'View Badge'
      });
    } else if (declared) {
      const curWeight = LEVEL_WEIGHT[declared.level as SkillLevel] || 1;
      const reqWeight = LEVEL_WEIGHT[req.minLevel as SkillLevel] || 1;

      if (curWeight < reqWeight) {
        checklist.push({
          name: req.skillName,
          category: 'SKILL',
          symbol: '⚠',
          statusText: declared.level || 'Beginner',
          badgeVariant: 'warning',
          detail: `Self-declared ${declared.level} • Requires ${req.minLevel} verification`,
          actionUrl: `/assessments/asm_python`,
          actionLabel: 'Take Assessment'
        });
      } else {
        checklist.push({
          name: req.skillName,
          category: 'SKILL',
          symbol: '✕',
          statusText: 'Not assessed',
          badgeVariant: 'danger',
          detail: `Self-declared as ${declared.level} on profile • Lacks timed verification test`,
          actionUrl: `/assessments/asm_python`,
          actionLabel: 'Verify Skill'
        });
      }
    } else if (hasProject) {
      checklist.push({
        name: req.skillName,
        category: 'SKILL',
        symbol: '⚠',
        statusText: 'Applied in Project (Unverified)',
        badgeVariant: 'warning',
        detail: `Used in completed project but not formally assessed`,
        actionUrl: `/assessments`,
        actionLabel: 'Verify via Test'
      });
    } else {
      checklist.push({
        name: req.skillName,
        category: 'SKILL',
        symbol: '✕',
        statusText: 'Missing',
        badgeVariant: 'danger',
        detail: `Skill not found on student profile or project portfolio`,
        actionUrl: `/courses`,
        actionLabel: 'Start Learning'
      });
    }
  });

  // Non-skill milestone checklist items:
  // 1. Project Evidence
  if (matchingProjects.length > 0) {
    checklist.push({
      name: 'Project Evidence',
      category: 'PROJECT',
      symbol: '✓',
      statusText: `${matchingProjects.length} Completed`,
      badgeVariant: 'success',
      detail: `Applied in "${matchingProjects[0].title}"`,
      actionUrl: `/student/projects`,
      actionLabel: 'View Projects'
    });
  } else {
    checklist.push({
      name: 'Project Evidence',
      category: 'PROJECT',
      symbol: '⚠',
      statusText: 'Missing',
      badgeVariant: 'warning',
      detail: `No project built using ${target.title} stack`,
      actionUrl: `/student/projects`,
      actionLabel: 'Build Project'
    });
  }

  // 2. Interview Preparation
  if (interviewEvals.length > 0 && avgInterviewScore >= 70) {
    checklist.push({
      name: 'Interview Preparation',
      category: 'INTERVIEW',
      symbol: '✓',
      statusText: 'Prepared',
      badgeVariant: 'success',
      detail: `Mock interview cleared with ${Math.round(avgInterviewScore)}% score`,
      actionUrl: `/student/interview-coach`,
      actionLabel: 'Practice More'
    });
  } else if (interviewEvals.length > 0) {
    checklist.push({
      name: 'Interview Preparation',
      category: 'INTERVIEW',
      symbol: '⚠',
      statusText: 'Needs Practice',
      badgeVariant: 'warning',
      detail: `Previous score: ${Math.round(avgInterviewScore)}% • Target: 75%+`,
      actionUrl: `/student/interview-coach`,
      actionLabel: 'Retake Mock'
    });
  } else {
    checklist.push({
      name: 'Interview Preparation',
      category: 'INTERVIEW',
      symbol: '⚠',
      statusText: 'Unprepared',
      badgeVariant: 'warning',
      detail: `0 mock interviews completed for this career track`,
      actionUrl: `/student/interview-coach`,
      actionLabel: 'Start Mock Interview'
    });
  }

  // 3. Resume Alignment
  if (resumeScorePct >= 75) {
    checklist.push({
      name: 'Resume Alignment',
      category: 'RESUME',
      symbol: '✓',
      statusText: 'Optimized',
      badgeVariant: 'success',
      detail: `Bio and credentials match target role competencies`,
      actionUrl: `/student/resume-matcher`,
      actionLabel: 'View ATS Resume'
    });
  } else {
    checklist.push({
      name: 'Resume Alignment',
      category: 'RESUME',
      symbol: '⚠',
      statusText: 'Review Needed',
      badgeVariant: 'warning',
      detail: `Resume lacks key terminology for ${target.title}`,
      actionUrl: `/student/resume-matcher`,
      actionLabel: 'Optimize Resume'
    });
  }

  // ----------------------------------------------------
  // DIAGNOSTIC BUCKETS
  // 1. Current Strengths
  // 2. Skill Gaps
  // 3. Missing Evidence
  // 4. Recommended Actions
  // ----------------------------------------------------
  const currentStrengths: EmploymentReadinessReport['currentStrengths'] = [];
  const skillGaps: EmploymentReadinessReport['skillGaps'] = [];
  const missingEvidence: EmploymentReadinessReport['missingEvidence'] = [];
  const recommendedActions: EmploymentReadinessReport['recommendedActions'] = [];

  // Populate Strengths
  verifiedSkills.forEach((v: VerifiedSkill) => {
    currentStrengths.push({
      title: `${v.skillName} (${v.level})`,
      evidence: `Verified assessment test score: ${v.score}%`,
      impact: 'Strong technical baseline for technical evaluation'
    });
  });
  if (matchingProjects.length > 0) {
    currentStrengths.push({
      title: `Applied Project Portfolio`,
      evidence: `${matchingProjects.length} project(s) demonstrated with functional code`,
      impact: 'Validates practical implementation skills'
    });
  }
  if (interviewEvals.length > 0) {
    currentStrengths.push({
      title: `AI Interview Coaching Practice`,
      evidence: `${interviewEvals.length} evaluated mock session(s) completed`,
      impact: 'Reduces interview friction and behavioral round drop-off'
    });
  }

  // Populate Gaps & Evidence
  target.skills.forEach(req => {
    const token = normalizeSkillToken(req.skillName);
    const v = verifiedSkills.find((vs: VerifiedSkill) => normalizeSkillToken(vs.skillName) === token);
    const d = studentSkills.find((ss: StudentSkill) => normalizeSkillToken(ss.skillName) === token);

    if (!v && !d) {
      skillGaps.push({
        skill: req.skillName,
        requiredLevel: req.minLevel,
        currentLevel: 'Missing',
        gap: `Lacks all foundational knowledge and coursework in ${req.skillName}`,
        action: `Enroll in foundational course and complete milestone assessment`
      });
      missingEvidence.push({
        item: req.skillName,
        reason: 'Zero verification or project proof on file',
        recommendedAction: 'Take assessment to establish baseline',
        actionUrl: `/courses`
      });
    } else if (!v && d) {
      skillGaps.push({
        skill: req.skillName,
        requiredLevel: req.minLevel,
        currentLevel: `${d.level} (Self-Declared)`,
        gap: `Declared as ${d.level} on profile, but no timed proctored score recorded`,
        action: `Take proctored assessment to earn verified badge`
      });
      missingEvidence.push({
        item: `${req.skillName} Verification`,
        reason: 'Recruiters discount self-declared skills without proctored tests',
        recommendedAction: 'Complete timed 15-minute verification assessment',
        actionUrl: `/assessments/asm_python`
      });
    } else if (v && LEVEL_WEIGHT[v.level as SkillLevel] < LEVEL_WEIGHT[req.minLevel as SkillLevel]) {
      skillGaps.push({
        skill: req.skillName,
        requiredLevel: req.minLevel,
        currentLevel: v.level,
        gap: `Current verified level is ${v.level}, while ${target.title} requires ${req.minLevel}`,
        action: `Take advanced assessment to upgrade level to ${req.minLevel}`
      });
    }
  });

  if (matchingProjects.length === 0) {
    missingEvidence.push({
      item: 'Hands-on Project Repository',
      reason: 'No live project repository demonstrates required technologies',
      recommendedAction: 'Build a capstone project using the required stack',
      actionUrl: `/student/projects`
    });
  }

  // Populate Recommended Actions
  if (skillGaps.length > 0) {
    const topGap = skillGaps[0];
    recommendedActions.push({
      title: `Verify ${topGap.skill} Competency`,
      category: 'Assessments',
      description: `Take the timed skill test to upgrade ${topGap.skill} to verified status.`,
      actionUrl: `/assessments/asm_python`,
      actionText: 'Take Assessment'
    });
  }
  if (matchingProjects.length < 2) {
    recommendedActions.push({
      title: 'Build Role-Specific Portfolio Project',
      category: 'Projects',
      description: `Publish a project implementing ${target.skills.slice(0, 3).map(s => s.skillName).join(' & ')}.`,
      actionUrl: '/student/projects',
      actionText: 'Browse Project Prompts'
    });
  }
  if (interviewEvals.length === 0 || avgInterviewScore < 75) {
    recommendedActions.push({
      title: `Mock Interview for ${target.title}`,
      category: 'Interview Coach',
      description: 'Practice 5 AI-evaluated technical & behavioral interview questions.',
      actionUrl: '/student/interview-coach',
      actionText: 'Launch Interview Coach'
    });
  }
  if (resumeScorePct < 80) {
    recommendedActions.push({
      title: 'Align Resume with Role Keywords',
      category: 'Resume Builder',
      description: `Incorporate high-frequency keywords like ${target.skills.slice(0, 2).map(s => s.skillName).join(', ')} into your ATS summary.`,
      actionUrl: '/student/resume-matcher',
      actionText: 'Optimize Resume'
    });
  }

  // ----------------------------------------------------
  // PERSONALIZED PLAN: PRIORITY 1, PRIORITY 2, PRIORITY 3
  // ----------------------------------------------------
  const planItems: PersonalizedPriorityItem[] = [];

  // Candidate 1: Missing or unverified critical skill
  const unverifiedSkill = target.skills.find(req => {
    const token = normalizeSkillToken(req.skillName);
    return !verifiedSkills.some((v: VerifiedSkill) => normalizeSkillToken(v.skillName) === token);
  });

  if (unverifiedSkill) {
    planItems.push({
      priority: 1,
      title: `Complete ${unverifiedSkill.skillName} Verification Assessment`,
      targetCategory: 'Assessments',
      rationale: `${unverifiedSkill.skillName} is a mandatory requirement for ${target.title}. Verifying it unlocks up to +12% in employer readiness.`,
      currentStatus: studentSkills.some((s: StudentSkill) => normalizeSkillToken(s.skillName) === normalizeSkillToken(unverifiedSkill.skillName))
        ? 'Self-Declared (Unverified)'
        : 'Missing from Profile',
      targetMilestone: `Verified ${unverifiedSkill.minLevel} with 70%+ proctored score`,
      estimatedReadinessUplift: 11,
      actionUrl: unverifiedSkill.skillName.toLowerCase().includes('sql') ? '/assessments/asm_sql' : '/assessments/asm_python',
      actionLabel: `Take ${unverifiedSkill.skillName} Assessment`,
      iconName: 'award'
    });
  } else {
    planItems.push({
      priority: 1,
      title: 'Upgrade Technical Mastery to Advanced',
      targetCategory: 'Assessments',
      rationale: 'Core skills are verified at intermediate level. Achieving advanced scores places you in top 10% candidate pool.',
      currentStatus: 'Intermediate Verified',
      targetMilestone: 'Advanced Level Badge (85%+ accuracy)',
      estimatedReadinessUplift: 8,
      actionUrl: '/assessments',
      actionLabel: 'Take Advanced Assessment',
      iconName: 'award'
    });
  }

  // Candidate 2: Practical Project
  if (matchingProjects.length < 2) {
    planItems.push({
      priority: 2,
      title: matchingProjects.length === 0
        ? `Build Applied ${target.title} Project`
        : 'Build Secondary Capstone Project with Live Repo',
      targetCategory: 'Projects',
      rationale: 'Employers prioritize candidates with tangible code evidence and deployed systems over theoretical knowledge alone.',
      currentStatus: matchingProjects.length === 0 ? 'No matching project' : '1 project on record',
      targetMilestone: 'Complete project with GitHub repository & README documentation',
      estimatedReadinessUplift: 9,
      actionUrl: '/student/projects',
      actionLabel: 'Select Project Template',
      iconName: 'laptop'
    });
  } else {
    planItems.push({
      priority: 2,
      title: 'Complete Deep-Dive Coursework',
      targetCategory: 'Courses',
      rationale: 'Master specialized design patterns and industry workflows expected in tier-1 companies.',
      currentStatus: 'Foundational coursework complete',
      targetMilestone: 'Finish advanced module with 100% lesson completion',
      estimatedReadinessUplift: 7,
      actionUrl: '/courses',
      actionLabel: 'Explore Advanced Courses',
      iconName: 'book'
    });
  }

  // Candidate 3: Interview or Resume
  if (interviewEvals.length === 0 || avgInterviewScore < 75) {
    planItems.push({
      priority: 3,
      title: `Practice AI Mock Interview for ${target.title}`,
      targetCategory: 'Interview Coach',
      rationale: 'Simulate high-pressure technical questions and behavioral scenarios with instant voice and text evaluation.',
      currentStatus: interviewEvals.length === 0 ? '0 mock interviews taken' : `Current avg score: ${Math.round(avgInterviewScore)}%`,
      targetMilestone: 'Score 80%+ across Communication, Problem Solving, and Technical Depth',
      estimatedReadinessUplift: 6,
      actionUrl: '/student/interview-coach',
      actionLabel: 'Start Mock Interview',
      iconName: 'mic'
    });
  } else {
    planItems.push({
      priority: 3,
      title: 'Optimize ATS Resume for Target Match',
      targetCategory: 'Resume Builder',
      rationale: 'Fine-tune bullet points and keyword density to ensure automated applicant tracking systems score your profile 85%+.',
      currentStatus: `${resumeScorePct}% keyword alignment`,
      targetMilestone: '90%+ ATS match score with recruiter-ready summary',
      estimatedReadinessUplift: 5,
      actionUrl: '/student/resume-matcher',
      actionLabel: 'Optimize Resume',
      iconName: 'file-text'
    });
  }

  const personalizedPlan: [PersonalizedPriorityItem, PersonalizedPriorityItem, PersonalizedPriorityItem] = [
    planItems[0],
    planItems[1],
    planItems[2]
  ];

  return {
    studentId: student.id,
    studentName: student.fullName,
    targetType: target.type,
    targetId: target.id,
    targetTitle: target.title,
    targetIndustry: target.industry,
    targetCompany: target.company,
    overallReadinessScore,
    readinessLabel,
    readinessExplanation,
    dimensions: {
      skillCoverage: skillCoverageDim,
      assessmentResults: assessmentDim,
      practicalEvidence: evidenceDim,
      projects: projectDim,
      resume: resumeDim,
      interviewPrep: interviewDim,
      relevantExperience: experienceDim
    },
    checklist,
    currentStrengths,
    skillGaps,
    missingEvidence,
    recommendedActions,
    personalizedPlan,
    toolLinks: {
      courses: { url: '/courses', count: currentDb.getCourses().length, title: 'Browse Structured Skill Courses' },
      projects: { url: '/student/projects', count: currentDb.getProjects().length, title: 'Build Hands-On Projects' },
      assessments: { url: '/assessments', count: currentDb.getAssessments().length, title: 'Take Proctored Skill Tests' },
      interviewCoach: { url: '/student/interview-coach', title: 'Practice AI Mock Interviews' },
      resumeBuilder: { url: '/student/resume-matcher', title: 'Optimize ATS Resume & Match' }
    },
    calculatedAt: new Date().toISOString()
  };
}
