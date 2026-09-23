import {
  SkillLevel,
  Student,
  VerifiedSkill,
  StudentSkill,
  AssessmentResult,
  Project,
  Job,
  JobRole,
  SkillGapStatus,
  SkillEvidenceType,
  SkillGapItem,
  SkillGapAction,
  ExplainableSkillGapReport,
  Course,
  Assessment
} from './types';
import { DatabaseSchema } from './db';
import { normalizeSkillToken } from './skillGraph';

// Level numeric weights for comparative delta
const LEVEL_WEIGHT: Record<SkillLevel | 'None', number> = {
  None: 0,
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4
};

const NUM_TO_LEVEL: Record<number, SkillLevel> = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert'
};

// Contextual role rationales for skills across industries
const SKILL_ROLE_RATIONALE: Record<string, Record<string, string>> = {
  python: {
    default: 'Core programming language required for writing maintainable logic, data structures, and automation.',
    'data analyst': 'Used for data manipulation, cleaning messy datasets, and building automated statistical transformation scripts.',
    'software developer': 'Primary backend programming language for structuring business logic, REST APIs, and async processing.',
    'ai & machine learning engineer': 'Industry-standard language for training machine learning models, neural networks, and feature pipelines.',
    'cloud & devops associate': 'Essential for infrastructure automation, CLI scripting, and writing deployment helper tools.'
  },
  sql: {
    default: 'Standard query language required for managing and retrieving records from relational databases.',
    'data analyst': 'Primary language for aggregate reporting, window functions, and extracting insights from relational data warehouses.',
    'software developer': 'Required to design normalized database schemas, optimize indexed queries, and manage transactional integrity.',
    'cloud & devops associate': 'Needed to manage database migrations, replication health, and cloud-hosted managed databases.'
  },
  dsa: {
    default: 'Essential for algorithmic problem solving, time-space efficiency, and passing technical evaluation rounds.',
    'software developer': 'Core requirement for writing high-performance code, choosing optimal collections, and scaling algorithms.',
    'ai & machine learning engineer': 'Crucial for implementing graph traversals, matrix math, and custom algorithmic optimization.'
  },
  react: {
    default: 'Industry standard library for component-based user interfaces and interactive web applications.',
    'software developer': 'Used to build high-performance client interfaces, responsive state architectures, and dynamic dashboards.'
  },
  aws: {
    default: 'Leading cloud platform for hosting scalable web applications, serverless functions, and storage.',
    'cloud & devops associate': 'Core competency for configuring VPC subnets, deploying EC2 instances, S3 buckets, and IAM policies.',
    'software developer': 'Needed to understand cloud hosting environments, environment variables, and microservice architectures.'
  },
  git: {
    default: 'Essential version control tool for collaboration, branching, and pull-request code reviews.',
    'software developer': 'Daily requirement for branch management, merge conflict resolution, and CI/CD pull request workflows.'
  },
  docker: {
    default: 'Containerization technology for packaging applications with consistent runtime dependencies.',
    'cloud & devops associate': 'Fundamental for building lightweight containers, writing Dockerfiles, and orchestration.',
    'software developer': 'Used to run reproducible local environments and deploy consistent containerized services.'
  },
  'ai/ml': {
    default: 'Machine learning fundamentals for supervised/unsupervised modeling and predictive algorithms.',
    'ai & machine learning engineer': 'Core foundation for building classifiers, regressors, hyperparameter tuning, and model deployment.'
  },
  'pandas & numpy': {
    default: 'Fundamental Python libraries for numerical computing, vectorization, and tabular DataFrames.',
    'data analyst': 'Essential for loading CSV/Parquet data, applying group-by aggregations, and cleaning data outliers.'
  },
  cpp: {
    default: 'High-performance systems programming language with manual memory control and RAII.',
    'software developer': 'Used for latency-critical applications, embedded systems, and systems-level programming.'
  },
  java: {
    default: 'Object-oriented language for enterprise backends, Spring Boot microservices, and large-scale applications.',
    'software developer': 'Core enterprise backend language for building secure multithreaded REST APIs.'
  },
  excel: {
    default: 'Spreadsheet software for rapid financial modeling, pivot tables, and operational analysis.',
    'data analyst': 'Used for ad-hoc business reporting, executive summaries, VLOOKUP/XLOOKUP, and pivot table modeling.'
  }
};

// Curated hands-on project recommendations
const SKILL_PROJECT_RECOMMENDATIONS: Record<string, { title: string; description: string; technologies: string[] }> = {
  python: {
    title: 'Distributed Task Queue & Cache Manager',
    description: 'Build an asynchronous task worker in Python using Redis streams, automatic retries, and dead-letter queueing.',
    technologies: ['Python', 'Redis', 'Docker', 'PostgreSQL']
  },
  sql: {
    title: 'Multi-Tenant Analytics Database Schema',
    description: 'Design a 3rd-normal-form relational schema with indexing, partitioning, and complex analytical window queries.',
    technologies: ['SQL', 'PostgreSQL', 'Database Design']
  },
  dsa: {
    title: 'Real-Time Pathfinding Visualizer & Graph Navigator',
    description: 'Implement Dijkstra and A* pathfinding algorithms with visual grid traversal and benchmarked heap queue structures.',
    technologies: ['DSA', 'Algorithms', 'TypeScript', 'Data Structures']
  },
  react: {
    title: 'Collaborative Real-Time Workspace Canvas',
    description: 'Build a responsive React application with state management, virtualized lists, and optimistic UI updates.',
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'WebSockets']
  },
  aws: {
    title: 'High-Availability Cloud Architecture Blueprint',
    description: 'Deploy a multi-tier application behind an Application Load Balancer with Auto-Scaling Groups in custom VPC subnets.',
    technologies: ['AWS', 'EC2', 'VPC', 'S3', 'Cloud Architecture']
  },
  git: {
    title: 'Open Source Module with GitHub Actions CI/CD',
    description: 'Publish a public repository with semantic versioning, pull request templates, and automated test runners.',
    technologies: ['Git', 'GitHub', 'CI/CD', 'Automated Testing']
  },
  docker: {
    title: 'Microservices Multi-Container Docker Compose Stack',
    description: 'Containerize frontend, backend API, and Redis database into orchestrated Docker Compose multi-stage builds.',
    technologies: ['Docker', 'Docker Compose', 'Microservices', 'Linux']
  },
  'ai/ml': {
    title: 'Predictive Candidate Placement Classifier',
    description: 'Train and validate a supervised classification pipeline using scikit-learn with cross-validation and feature importances.',
    technologies: ['Python', 'AI/ML', 'scikit-learn', 'Pandas']
  },
  'pandas & numpy': {
    title: 'E-Commerce Churn & Revenue Analytics Engine',
    description: 'Clean raw transaction logs, calculate cohort retention metrics, and visualize revenue trends using vectorized operations.',
    technologies: ['Pandas & NumPy', 'Python', 'Data Analytics', 'Matplotlib']
  },
  cpp: {
    title: 'Custom Memory-Managed Double-Ended Queue (Deque)',
    description: 'Implement a cache-friendly templated container with explicit pointer semantics, iterators, and zero memory leaks.',
    technologies: ['C++', 'Memory Management', 'Data Structures', 'Pointers']
  },
  java: {
    title: 'Enterprise Banking Transaction Engine with Concurrency',
    description: 'Develop a multithreaded transaction processor utilizing ReentrantLocks, thread pools, and transactional rollback.',
    technologies: ['Java', 'Multithreading', 'OOP', 'Spring Boot']
  },
  excel: {
    title: 'Executive Financial Model & Interactive Dashboard',
    description: 'Build an automated workbook using dynamic array formulas, nested XLOOKUP, Scenario Manager, and pivot slicers.',
    technologies: ['Excel', 'Financial Modeling', 'Pivot Tables', 'Data Analysis']
  }
};

/**
 * Normalizes skill level strings to standardized SkillLevel
 */
export function normalizeLevel(levelStr?: string): SkillLevel {
  if (!levelStr) return 'Intermediate';
  const clean = levelStr.trim().toLowerCase();
  if (clean.includes('expert') || clean.includes('lead')) return 'Expert';
  if (clean.includes('adv')) return 'Advanced';
  if (clean.includes('beg') || clean.includes('basic') || clean.includes('fund')) return 'Beginner';
  return 'Intermediate';
}

/**
 * Calculates level delta description
 */
function getLevelDeltaDescription(currentLevel: SkillLevel | 'None', requiredLevel: SkillLevel): { delta: number; text: string } {
  const curWeight = LEVEL_WEIGHT[currentLevel];
  const reqWeight = LEVEL_WEIGHT[requiredLevel];
  const delta = curWeight - reqWeight;

  if (delta >= 0 && currentLevel !== 'None') {
    return { delta: 0, text: `Satisfied (${currentLevel} ≥ ${requiredLevel})` };
  }
  if (currentLevel === 'None') {
    return { delta: -reqWeight, text: `Missing (Needs ${requiredLevel})` };
  }
  const diff = reqWeight - curWeight;
  return { delta: -diff, text: `Needs +${diff} Level (${currentLevel} → ${requiredLevel})` };
}

/**
 * Generates an explainable skill gap report for a candidate evaluated against a target job or role
 */
export function calculateExplainableSkillGap(
  candidate: {
    student: Student;
    verifiedSkills: VerifiedSkill[];
    studentSkills: StudentSkill[];
    assessmentResults: AssessmentResult[];
    projects: Project[];
  },
  target: {
    type: 'JOB_ROLE' | 'JOB';
    id: string;
    title: string;
    companyName?: string;
    requiredSkills: Array<{ name: string; level: SkillLevel }>;
    preferredSkills: Array<{ name: string; level: SkillLevel }>;
  },
  dbState: DatabaseSchema
): ExplainableSkillGapReport {
  const { student, verifiedSkills, studentSkills, assessmentResults, projects } = candidate;
  const targetTitleLower = target.title.toLowerCase();

  // Combine target skills list with deduplication
  const targetSkillMap = new Map<string, { isRequired: boolean; level: SkillLevel; originalName: string }>();

  target.requiredSkills.forEach(req => {
    const token = normalizeSkillToken(req.name);
    targetSkillMap.set(token, { isRequired: true, level: req.level, originalName: req.name });
  });

  target.preferredSkills.forEach(pref => {
    const token = normalizeSkillToken(pref.name);
    if (!targetSkillMap.has(token)) {
      targetSkillMap.set(token, { isRequired: false, level: pref.level, originalName: pref.name });
    }
  });

  const skillGapItems: SkillGapItem[] = [];

  let matchedCount = 0;
  let partialCount = 0;
  let missingCount = 0;
  let unassessedCount = 0;

  // Process every skill required or preferred by the target
  targetSkillMap.forEach((reqInfo, token) => {
    const skillRecord = (dbState.skills || []).find(s => normalizeSkillToken(s.name) === token || normalizeSkillToken(s.id) === token);
    const skillName = skillRecord?.name || (reqInfo.originalName.startsWith('sk_') ? reqInfo.originalName.replace(/^sk_/, '').toUpperCase() : reqInfo.originalName);
    const requiredLevel = reqInfo.level;
    const isRequired = reqInfo.isRequired;

    // 1. Check Verified Skills
    const verified = verifiedSkills.find(v => {
      return normalizeSkillToken(v.skillName) === token || (v.skillId && normalizeSkillToken(v.skillId) === token);
    });

    // 2. Check Assessment Results
    const assessmentResult = assessmentResults.find(a => {
      return normalizeSkillToken(a.skillName) === token || normalizeSkillToken(a.skillId) === token;
    });

    // 3. Check Projects where skill was utilized
    const matchingProject = projects.find(p => {
      return (p.technologies || []).some(t => normalizeSkillToken(t) === token);
    });

    // 4. Check Self-Declared Profile Skills
    const declared = studentSkills.find(s => {
      return normalizeSkillToken(s.skillName) === token || (s.skillId && normalizeSkillToken(s.skillId) === token);
    });

    // Determine current level and evidence
    let currentLevel: SkillLevel | 'None' = 'None';
    let status: SkillGapStatus = 'MISSING';
    let evidenceType: SkillEvidenceType = 'NONE';
    let evidenceSummary = 'No assessment or project evidence found on passport.';
    let evidenceScore: number | undefined;
    let evidenceCert: string | undefined;
    let evidenceProject: string | undefined;
    let declaredLevel: SkillLevel | undefined;

    if (verified) {
      currentLevel = verified.level;
      evidenceType = 'VERIFIED_ASSESSMENT';
      evidenceScore = verified.score;
      evidenceCert = verified.certificateId;
      evidenceSummary = `Verified Assessment: ${verified.score}% score • Certificate #${verified.certificateId}`;

      const curWeight = LEVEL_WEIGHT[currentLevel];
      const reqWeight = LEVEL_WEIGHT[requiredLevel];

      if (curWeight >= reqWeight) {
        status = 'MATCHED';
      } else {
        status = 'PARTIAL';
      }
    } else if (assessmentResult && assessmentResult.passed) {
      currentLevel = assessmentResult.levelAwarded || 'Intermediate';
      evidenceType = 'VERIFIED_ASSESSMENT';
      evidenceScore = assessmentResult.score;
      evidenceSummary = `Passed Assessment: ${assessmentResult.score}% accuracy (${assessmentResult.correctAnswers}/${assessmentResult.totalQuestions})`;

      const curWeight = LEVEL_WEIGHT[currentLevel];
      const reqWeight = LEVEL_WEIGHT[requiredLevel];

      if (curWeight >= reqWeight) {
        status = 'MATCHED';
      } else {
        status = 'PARTIAL';
      }
    } else if (matchingProject) {
      declaredLevel = declared?.level ? normalizeLevel(declared.level) : 'Beginner';
      currentLevel = declaredLevel;
      evidenceType = 'PROJECT_EVIDENCE';
      evidenceProject = matchingProject.title;
      evidenceSummary = `Applied Project: "${matchingProject.title}" (${(matchingProject.technologies || []).join(', ')})`;

      const curWeight = LEVEL_WEIGHT[currentLevel];
      const reqWeight = LEVEL_WEIGHT[requiredLevel];

      if (declared && curWeight >= reqWeight) {
        status = 'UNASSESSED'; // Applied in project and claimed, but no timed assessment verification
        evidenceSummary += ' • Pending official timed assessment verification.';
      } else {
        status = 'PARTIAL';
      }
    } else if (declared) {
      declaredLevel = normalizeLevel(declared.level);
      currentLevel = declaredLevel;
      evidenceType = 'SELF_DECLARED';
      evidenceSummary = `Self-declared as ${declaredLevel} on student profile • Untested`;

      const curWeight = LEVEL_WEIGHT[currentLevel];
      const reqWeight = LEVEL_WEIGHT[requiredLevel];

      if (curWeight >= reqWeight) {
        status = 'UNASSESSED'; // Meets level requirement on paper, but unassessed!
      } else {
        status = 'PARTIAL';
      }
    } else {
      currentLevel = 'None';
      status = 'MISSING';
      evidenceType = 'NONE';
      evidenceSummary = 'Skill not added to candidate portfolio or verified skills.';
    }

    // Tally stats
    if (status === 'MATCHED') matchedCount++;
    else if (status === 'PARTIAL') partialCount++;
    else if (status === 'UNASSESSED') unassessedCount++;
    else if (status === 'MISSING') missingCount++;

    const deltaInfo = getLevelDeltaDescription(currentLevel, requiredLevel);

    // Contextual Rationale for Why this skill is required
    const tokenLookups = SKILL_ROLE_RATIONALE[token] || {};
    let matchedRoleKey = Object.keys(tokenLookups).find(k => k !== 'default' && targetTitleLower.includes(k));
    let whyRequired = (matchedRoleKey && tokenLookups[matchedRoleKey]) || tokenLookups.default;

    if (!whyRequired) {
      whyRequired = `Required technical competency for ${target.title} to deliver enterprise projects and meet hiring benchmarks.`;
    }

    // Recommended Course Lookup
    const matchedCourse = (dbState.courses || []).find(c => {
      const matchInTitle = normalizeSkillToken(c.title).includes(token);
      const matchInTargetSkills = (c.targetSkills || []).some(ts => normalizeSkillToken(ts) === token);
      return matchInTitle || matchInTargetSkills;
    });

    const recommendedCourse = matchedCourse ? {
      id: matchedCourse.id,
      title: matchedCourse.title,
      duration: matchedCourse.duration || '12 Hours',
      url: `/courses/${matchedCourse.id}/learn`
    } : {
      id: `crs_${token}`,
      title: `${skillName} Placement Masterclass`,
      duration: '10 Hours',
      url: `/learn/${encodeURIComponent(skillName)}`
    };

    // Recommended Assessment Lookup
    const matchedAssessment = (dbState.assessments || []).find(a => {
      const matchInTitle = normalizeSkillToken(a.title).includes(token);
      const matchInSkillName = a.skillName && normalizeSkillToken(a.skillName) === token;
      const matchInSkillId = a.skillId && normalizeSkillToken(a.skillId) === token;
      return matchInTitle || matchInSkillName || matchInSkillId;
    });

    const recommendedAssessment = matchedAssessment ? {
      id: matchedAssessment.id,
      title: matchedAssessment.title,
      questionsCount: matchedAssessment.totalQuestions || 15,
      url: `/assessments/${matchedAssessment.id}`
    } : {
      id: `asm_${token}`,
      title: `${skillName} Core Certification Assessment`,
      questionsCount: 15,
      url: `/assessments/asm_${token}`
    };

    // Recommended Project Lookup
    const projectRec = SKILL_PROJECT_RECOMMENDATIONS[token] || {
      title: `${skillName} Production Application`,
      description: `Build and deploy an enterprise-grade project demonstrating ${skillName} architecture, error handling, and testing.`,
      technologies: [skillName, 'Git', 'Clean Architecture']
    };

    // Category Lookup
    const category = skillRecord?.category || 'Technical Competency';

    skillGapItems.push({
      skillId: skillRecord?.id || `sk_${token}`,
      skillName,
      category,
      isRequired,
      requiredLevel,
      currentLevel,
      levelDelta: deltaInfo.delta,
      gapDescription: deltaInfo.text,
      status,
      evidence: {
        type: evidenceType,
        summary: evidenceSummary,
        assessmentId: verified?.assessmentId || assessmentResult?.assessmentId,
        assessmentScore: evidenceScore,
        certificateId: evidenceCert,
        projectTitle: evidenceProject,
        declaredLevel
      },
      explanation: {
        whyRequired,
        currentLevelDetail: currentLevel === 'None' ? 'Not present in portfolio' : `${currentLevel} proficiency demonstrated`,
        requiredLevelDetail: `${requiredLevel} proficiency required by employer for ${target.title}`,
        recommendedCourse,
        recommendedAssessment,
        recommendedProject: projectRec
      }
    });
  });

  // Calculate Weighted Match Percentage
  const totalSkills = skillGapItems.length;
  let totalPoints = 0;
  let maxPoints = 0;

  skillGapItems.forEach(item => {
    const weight = item.isRequired ? 1.5 : 1.0;
    maxPoints += weight * 100;

    if (item.status === 'MATCHED') {
      totalPoints += weight * 100;
    } else if (item.status === 'UNASSESSED') {
      totalPoints += weight * 70; // 70% credit for claimed/project evidence awaiting timed test
    } else if (item.status === 'PARTIAL') {
      totalPoints += weight * 45; // 45% credit for partial level
    } else {
      totalPoints += 0; // Missing gets 0
    }
  });

  const overallMatchScore = maxPoints > 0 ? Math.min(100, Math.round((totalPoints / maxPoints) * 100)) : 0;
  const isEligible = matchedCount >= Math.ceil(target.requiredSkills.length * 0.75) && missingCount === 0;

  // Synthesize Transparent Executive Diagnostic Explanation
  let matchScoreExplanation = '';
  if (overallMatchScore >= 85) {
    matchScoreExplanation = `${overallMatchScore}% Match: Outstanding fit. ${matchedCount} of ${totalSkills} skills fully matched with verified credentials. Ready for fast-track interview scheduling.`;
  } else if (overallMatchScore >= 65) {
    matchScoreExplanation = `${overallMatchScore}% Match: Strong foundation. ${matchedCount} Matched, ${partialCount} Partial, ${unassessedCount} Unassessed, and ${missingCount} Missing. Complete recommended assessments to unlock interview readiness.`;
  } else {
    matchScoreExplanation = `${overallMatchScore}% Match: Significant skill gaps detected (${missingCount} missing, ${partialCount} partial level gaps). Follow the prioritized preparation actions below to achieve eligibility.`;
  }

  // Synthesize Ordered Priority Actions
  const priorityActions: SkillGapAction[] = [];
  let actionStep = 1;

  // 1. Unassessed skills with high impact (fastest win: take assessment to verify)
  skillGapItems
    .filter(i => i.status === 'UNASSESSED' && i.isRequired)
    .forEach(item => {
      priorityActions.push({
        step: actionStep++,
        skillName: item.skillName,
        actionType: 'ASSESS',
        title: `Verify ${item.skillName} Competency via ${item.explanation.recommendedAssessment.title}`,
        url: item.explanation.recommendedAssessment.url,
        impact: '+12% Match Score & Verified Badge',
        duration: '20 Mins'
      });
    });

  // 2. Partial skills with level gaps (bridge gap via course + test)
  skillGapItems
    .filter(i => i.status === 'PARTIAL' && i.isRequired)
    .forEach(item => {
      priorityActions.push({
        step: actionStep++,
        skillName: item.skillName,
        actionType: 'LEARN',
        title: `Upgrade ${item.skillName} (${item.gapDescription}) via ${item.explanation.recommendedCourse.title}`,
        url: item.explanation.recommendedCourse.url,
        impact: '+15% Match Score & Level Upgrade',
        duration: item.explanation.recommendedCourse.duration
      });
    });

  // 3. Missing skills (start foundational learning)
  skillGapItems
    .filter(i => i.status === 'MISSING' && i.isRequired)
    .forEach(item => {
      priorityActions.push({
        step: actionStep++,
        skillName: item.skillName,
        actionType: 'BUILD_PROJECT',
        title: `Build ${item.explanation.recommendedProject.title} to demonstrate ${item.skillName}`,
        url: item.explanation.recommendedCourse.url,
        impact: '+18% Match Score & Portfolio Evidence',
        duration: 'Practical Sandbox'
      });
    });

  return {
    candidateId: student.id,
    candidateName: student.fullName,
    targetType: target.type,
    targetId: target.id,
    targetTitle: target.title,
    targetCompany: target.companyName,
    overallMatchScore,
    matchScoreExplanation,
    isEligible,
    stats: {
      totalSkills,
      matched: matchedCount,
      partial: partialCount,
      missing: missingCount,
      unassessed: unassessedCount
    },
    skills: skillGapItems,
    priorityActions
  };
}
