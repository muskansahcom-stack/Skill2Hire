import {
  Skill,
  JobRole,
  CareerPath,
  Job,
  Course,
  Assessment,
  Project,
  SkillRelationship,
  SkillGraphData,
  SkillGraphNode,
  SkillGraphEdge,
  Skill360Response,
  EmploymentOutcome,
  SkillLevel
} from './types';

/**
 * Normalizes skill string tokens for resilient name/ID matching
 */
export function normalizeSkillToken(nameOrId: string): string {
  if (!nameOrId) return '';
  return nameOrId
    .toLowerCase()
    .replace(/^sk_/, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Checks whether a given skill matches a target identifier or name
 */
export function isSkillMatch(skill: Skill, query: string): boolean {
  if (!query) return false;
  if (skill.id.toLowerCase() === query.toLowerCase()) return true;
  if (skill.name.toLowerCase() === query.toLowerCase()) return true;
  return normalizeSkillToken(skill.id) === normalizeSkillToken(query) ||
         normalizeSkillToken(skill.name) === normalizeSkillToken(query);
}

/**
 * Builds the full 360-degree relationship context for a single skill
 */
export function buildSkill360Context(
  skillIdOrName: string,
  data: {
    skills: Skill[];
    job_roles: JobRole[];
    career_paths: CareerPath[];
    jobs: Job[];
    courses: Course[];
    assessments: Assessment[];
    projects: Project[];
    student_skills?: any[];
    verified_skills?: any[];
    employment_outcomes?: EmploymentOutcome[];
    skill_relationships?: SkillRelationship[];
  }
): Skill360Response | null {
  const {
    skills,
    job_roles = [],
    career_paths = [],
    jobs = [],
    courses = [],
    assessments = [],
    projects = [],
    student_skills = [],
    verified_skills = [],
    employment_outcomes = [],
    skill_relationships = []
  } = data;

  const targetSkill = skills.find(s => isSkillMatch(s, skillIdOrName));
  if (!targetSkill) return null;

  const targetToken = normalizeSkillToken(targetSkill.name);

  // 1. Parent Skill
  let parentSkill: Skill | null = null;
  if (targetSkill.parent_skill_id) {
    parentSkill = skills.find(s => s.id === targetSkill.parent_skill_id) || null;
  }
  if (!parentSkill) {
    const parentEdge = skill_relationships.find(
      r => r.targetSkillId === targetSkill.id && r.relationshipType === 'PARENT_OF'
    );
    if (parentEdge) {
      parentSkill = skills.find(s => s.id === parentEdge.sourceSkillId) || null;
    }
  }

  // 2. Child Skills
  const childSkills = skills.filter(s => {
    if (s.parent_skill_id === targetSkill.id) return true;
    return skill_relationships.some(
      r => r.sourceSkillId === targetSkill.id && r.targetSkillId === s.id && r.relationshipType === 'PARENT_OF'
    );
  });

  // 3. Prerequisite Skills
  const prereqIds = new Set<string>(targetSkill.prerequisite_skills || []);
  skill_relationships
    .filter(r => (r.sourceSkillId === targetSkill.id && r.relationshipType === 'DEPENDS_ON') ||
                 (r.targetSkillId === targetSkill.id && r.relationshipType === 'PREREQUISITE_FOR'))
    .forEach(r => {
      prereqIds.add(r.relationshipType === 'DEPENDS_ON' ? r.targetSkillId : r.sourceSkillId);
    });
  const prerequisiteSkills = skills.filter(s => prereqIds.has(s.id) && s.id !== targetSkill.id);

  // 4. Related Skills
  const relatedIds = new Set<string>(targetSkill.related_skills || []);
  skill_relationships
    .filter(r => (r.sourceSkillId === targetSkill.id || r.targetSkillId === targetSkill.id) && r.relationshipType === 'RELATED_TO')
    .forEach(r => {
      const otherId = r.sourceSkillId === targetSkill.id ? r.targetSkillId : r.sourceSkillId;
      relatedIds.add(otherId);
    });
  const relatedSkills = skills.filter(s => relatedIds.has(s.id) && s.id !== targetSkill.id);

  // 5. Complementary Skills
  const compIds = new Set<string>(targetSkill.complementary_skills || []);
  skill_relationships
    .filter(r => (r.sourceSkillId === targetSkill.id || r.targetSkillId === targetSkill.id) && r.relationshipType === 'COMPLEMENTARY_TO')
    .forEach(r => {
      const otherId = r.sourceSkillId === targetSkill.id ? r.targetSkillId : r.sourceSkillId;
      compIds.add(otherId);
    });
  const complementarySkills = skills.filter(s => compIds.has(s.id) && s.id !== targetSkill.id);

  // 6. Related Jobs
  const relatedJobs = jobs.filter(j => {
    return j.requiredSkills.some(req => {
      return req.skillId === targetSkill.id ||
             normalizeSkillToken(req.skillName) === targetToken ||
             req.skillName.toLowerCase().includes(targetSkill.name.toLowerCase());
    });
  });

  // 7. Related Job Roles
  const relatedJobRoles = job_roles.filter(role => {
    const hasInReqSkills = (role.required_skills || []).some(
      skId => skId === targetSkill.id || normalizeSkillToken(skId) === targetToken
    );
    const hasInStandard = (role.standardRequiredSkills || []).map(s => s.skillId).includes(targetSkill.id);
    const hasInProf = (role.proficiency_requirements || []).some(
      p => p.skillId === targetSkill.id || (p.skillName && normalizeSkillToken(p.skillName) === targetToken)
    );
    return hasInReqSkills || hasInStandard || hasInProf;
  });

  // 8. Required Careers
  const requiredCareers = career_paths.filter(cp => {
    return cp.requiredSkills.some(req => {
      return normalizeSkillToken(req.skill) === targetToken ||
             req.skill.toLowerCase().includes(targetSkill.name.toLowerCase());
    });
  });

  // 9. Courses
  const matchingCourses = courses.filter(c => {
    return (c.targetSkills || []).some(ts => {
      return normalizeSkillToken(ts) === targetToken ||
             ts.toLowerCase().includes(targetSkill.name.toLowerCase());
    });
  });

  // 10. Assessments
  const matchingAssessments = assessments.filter(a => {
    return a.skillId === targetSkill.id ||
           normalizeSkillToken(a.skillName) === targetToken ||
           a.skillName.toLowerCase().includes(targetSkill.name.toLowerCase());
  });

  // 11. Projects
  const matchingProjects = projects.filter(p => {
    return (p.technologies || []).some(t => {
      return normalizeSkillToken(t) === targetToken ||
             t.toLowerCase().includes(targetSkill.name.toLowerCase());
    });
  });

  // 12. Competency Stats
  const candidateSkills = student_skills.filter(ss => {
    return ss.skillId === targetSkill.id || normalizeSkillToken(ss.skillName) === targetToken;
  });
  const verifiedCount = candidateSkills.filter(ss => ss.status === 'Verified').length;
  const avgScore = candidateSkills.length > 0
    ? Math.round(candidateSkills.reduce((acc, s) => acc + (s.score || 75), 0) / candidateSkills.length)
    : 82;

  let topLevel: SkillLevel = 'Intermediate';
  if (candidateSkills.some(s => s.level === 'Expert')) topLevel = 'Expert';
  else if (candidateSkills.some(s => s.level === 'Advanced')) topLevel = 'Advanced';

  // 13. Employment Outcomes
  const matchingOutcomes = employment_outcomes.filter(eo => {
    const roleMatch = relatedJobRoles.some(jr => jr.id === eo.jobId || jr.title.toLowerCase() === eo.roleTitle.toLowerCase());
    const jobMatch = relatedJobs.some(j => j.id === eo.jobId);
    return roleMatch || jobMatch;
  });

  return {
    skill: targetSkill,
    parentSkill,
    childSkills,
    prerequisiteSkills,
    relatedSkills,
    complementarySkills,
    relatedJobs,
    relatedJobRoles,
    requiredCareers,
    courses: matchingCourses,
    assessments: matchingAssessments,
    projects: matchingProjects,
    competencyStats: {
      verifiedCandidatesCount: verifiedCount,
      averageScore: avgScore,
      topLevel
    },
    employmentOutcomes: matchingOutcomes
  };
}

/**
 * Builds the complete multi-entity graph representation for interactive visualization
 */
export function buildGlobalSkillGraphData(data: {
  skills: Skill[];
  job_roles: JobRole[];
  career_paths: CareerPath[];
  courses: Course[];
  assessments: Assessment[];
  projects: Project[];
  skill_relationships?: SkillRelationship[];
}): SkillGraphData {
  const {
    skills,
    job_roles = [],
    career_paths = [],
    courses = [],
    assessments = [],
    projects = [],
    skill_relationships = []
  } = data;

  const nodes: SkillGraphNode[] = [];
  const edges: SkillGraphEdge[] = [];
  const categoriesSet = new Set<string>();

  // 1. Add Skill Nodes
  skills.forEach(s => {
    categoriesSet.add(s.category);
    
    // Count connections
    const relatedCount = (s.related_skills?.length || 0) +
                         (s.prerequisite_skills?.length || 0) +
                         (s.complementary_skills?.length || 0);

    nodes.push({
      id: s.id,
      label: s.name,
      type: 'skill',
      category: s.category,
      subcategory: s.subcategory,
      difficulty: s.difficulty || 'Intermediate',
      status: s.status || 'active',
      connectionsCount: relatedCount,
      data: {
        description: s.description,
        demandLevel: s.demandLevel || 'High',
        parent_skill_id: s.parent_skill_id
      }
    });

    // Internal Skill Edges from model properties
    if (s.parent_skill_id) {
      edges.push({
        id: `e_${s.parent_skill_id}_parent_${s.id}`,
        source: s.parent_skill_id,
        target: s.id,
        relationship: 'PARENT_OF',
        label: 'Parent Of'
      });
    }

    (s.prerequisite_skills || []).forEach(prereqId => {
      edges.push({
        id: `e_${prereqId}_prereq_${s.id}`,
        source: prereqId,
        target: s.id,
        relationship: 'PREREQUISITE_FOR',
        label: 'Prerequisite'
      });
    });

    (s.related_skills || []).forEach(relId => {
      // Ensure undirected edge uniqueness
      if (s.id < relId) {
        edges.push({
          id: `e_${s.id}_related_${relId}`,
          source: s.id,
          target: relId,
          relationship: 'RELATED_TO',
          label: 'Related'
        });
      }
    });

    (s.complementary_skills || []).forEach(compId => {
      if (s.id < compId) {
        edges.push({
          id: `e_${s.id}_comp_${compId}`,
          source: s.id,
          target: compId,
          relationship: 'COMPLEMENTARY_TO',
          label: 'Synergistic'
        });
      }
    });
  });

  // Add explicit skill_relationships if not already present
  skill_relationships.forEach(rel => {
    const edgeId = `e_rel_${rel.id}`;
    if (!edges.some(e => e.source === rel.sourceSkillId && e.target === rel.targetSkillId)) {
      edges.push({
        id: edgeId,
        source: rel.sourceSkillId,
        target: rel.targetSkillId,
        relationship: rel.relationshipType,
        label: rel.relationshipType.replace(/_/g, ' ')
      });
    }
  });

  // 2. Add Job Role Nodes & Edges
  job_roles.forEach(role => {
    const roleNodeId = `role_${role.id}`;
    nodes.push({
      id: roleNodeId,
      label: role.title,
      type: 'job_role',
      category: role.industry || role.category,
      difficulty: role.career_level || role.careerLevel,
      data: {
        description: role.description,
        salaryBand: role.standardSalaryBandGlobal
      }
    });

    // Connect required skills to job role
    const reqSkills = role.required_skills || (role.standardRequiredSkills || []).map(s => s.skillId);
    reqSkills.forEach(skId => {
      if (skills.some(s => s.id === skId)) {
        edges.push({
          id: `e_${skId}_req_role_${role.id}`,
          source: skId,
          target: roleNodeId,
          relationship: 'REQUIRED_FOR_ROLE',
          label: 'Requires'
        });
      }
    });
  });

  // 3. Add Career Path Nodes & Edges
  career_paths.forEach(career => {
    const careerNodeId = `career_${career.id}`;
    nodes.push({
      id: careerNodeId,
      label: career.title,
      type: 'career',
      category: 'Career Path',
      data: {
        description: career.description,
        targetRole: career.targetRole,
        matchOpportunities: career.matchOpportunities
      }
    });

    // Connect skills to Career
    career.requiredSkills.forEach(req => {
      const matchedSkill = skills.find(s => isSkillMatch(s, req.skill));
      if (matchedSkill) {
        edges.push({
          id: `e_${matchedSkill.id}_career_${career.id}`,
          source: matchedSkill.id,
          target: careerNodeId,
          relationship: 'REQUIRED_FOR_CAREER',
          label: `${req.level} Required`
        });
      }
    });
  });

  // 4. Add Course Nodes & Edges
  courses.forEach(c => {
    const courseNodeId = `course_${c.id}`;
    nodes.push({
      id: courseNodeId,
      label: c.title,
      type: 'course',
      category: c.category,
      difficulty: c.level,
      data: {
        duration: c.duration,
        lessonsCount: c.lessonsCount
      }
    });

    (c.targetSkills || []).forEach(ts => {
      const matchedSkill = skills.find(s => isSkillMatch(s, ts));
      if (matchedSkill) {
        edges.push({
          id: `e_${matchedSkill.id}_course_${c.id}`,
          source: matchedSkill.id,
          target: courseNodeId,
          relationship: 'TAUGHT_IN',
          label: 'Teaches'
        });
      }
    });
  });

  // 5. Add Assessment Nodes & Edges
  assessments.forEach(asm => {
    const asmNodeId = `asm_${asm.id}`;
    nodes.push({
      id: asmNodeId,
      label: asm.title,
      type: 'assessment',
      category: (asm as any).category || asm.skillName || 'Assessment',
      difficulty: asm.targetLevel,
      data: {
        passingScore: asm.passingScore,
        durationMinutes: asm.durationMinutes
      }
    });

    const matchedSkill = skills.find(s => s.id === asm.skillId || isSkillMatch(s, asm.skillName));
    if (matchedSkill) {
      edges.push({
        id: `e_${matchedSkill.id}_asm_${asm.id}`,
        source: matchedSkill.id,
        target: asmNodeId,
        relationship: 'EVALUATED_BY',
        label: 'Verifies'
      });
    }
  });

  // 6. Add Project Nodes & Edges
  projects.forEach(proj => {
    const projNodeId = `proj_${proj.id}`;
    nodes.push({
      id: projNodeId,
      label: proj.title,
      type: 'project',
      category: 'Portfolio Project',
      data: {
        description: proj.description
      }
    });

    (proj.technologies || []).forEach(tech => {
      const matchedSkill = skills.find(s => isSkillMatch(s, tech));
      if (matchedSkill) {
        edges.push({
          id: `e_${matchedSkill.id}_proj_${proj.id}`,
          source: matchedSkill.id,
          target: projNodeId,
          relationship: 'APPLIED_IN',
          label: 'Applies'
        });
      }
    });
  });

  return {
    nodes,
    edges,
    categories: Array.from(categoriesSet),
    summary: {
      totalSkills: skills.length,
      totalJobRoles: job_roles.length,
      totalCareers: career_paths.length,
      totalCourses: courses.length,
      totalAssessments: assessments.length,
      totalProjects: projects.length,
      totalRelationships: edges.length
    }
  };
}
