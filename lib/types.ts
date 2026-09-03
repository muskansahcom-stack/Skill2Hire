export type UserRole = 'student' | 'college' | 'company' | 'admin';

export type AccountStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface User {
  id: string;
  firebaseUid?: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  name: string;
  avatar?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  account_status?: AccountStatus;
  verification_status?: VerificationStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface OtpRecord {
  id: string;
  identifier: string; // email or phone
  type: 'email' | 'phone';
  purpose: 'registration' | 'forgot_password' | 'contact_update' | 'login';
  otpHash: string; // Only secure SHA-256 hash stored
  expiresAt: string; // 5 min expiry
  attempts: number;
  maxAttempts: number;
  resendAvailableAt: string; // 60s cooldown
  verified: boolean;
  createdAt: string;
}

export interface AcademicSubject {
  code: string;
  name: string;
  credits: number;
  grade: string; // 'O' | 'A+' | 'A' | 'B+' | 'B'
  gradePoint: number; // 10, 9, 8, 7, 6
  type: 'Theory' | 'Lab' | 'Project';
}

export interface AcademicSemester {
  semesterNumber: number;
  semesterName: string;
  academicYear: string;
  sgpa: number;
  totalCredits: number;
  earnedCredits: number;
  subjects: AcademicSubject[];
}

export interface StudentAcademicReport {
  studentId: string;
  rollNumber: string;
  registrationNumber: string;
  studentName: string;
  phone: string;
  email: string;
  collegeId: string;
  collegeName: string;
  degree: string;
  department: string;
  admissionYear: number;
  graduationYear: number;
  currentSemester: number;
  cgpa: number;
  overallAttendancePercentage: number;
  totalCreditsEarned: number;
  totalCreditsRequired: number;
  activeBacklogs: number;
  semesters: AcademicSemester[];
  verifiedSkills: {
    skillName: string;
    level: string;
    score: number;
    credibilityScore: number;
    certificateId: string;
    verifiedDate: string;
  }[];
  placementStatus: 'Needs Training' | 'In Training' | 'Placement Ready' | 'Placed';
  placementReadinessScore: number;
  institutionalRemarks: string;
  issuedDate: string;
  verificationHash: string;
}

export interface Student {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  collegeId: string;
  collegeName: string;
  degree: string;
  department: string;
  graduationYear: number;
  cgpa: number;
  location: string;
  bio?: string;
  resumeUrl?: string;
  resumeText?: string;
  placementStatus: 'Needs Training' | 'In Training' | 'Placement Ready' | 'Placed';
  placementReadiness: number; // 0 - 100
}

export interface College {
  id: string;
  userId: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  establishedYear: number;
  totalStudents: number;
  placementRate: number;
  bio: string;
  logo?: string;
}

export interface Company {
  id: string;
  userId: string;
  name: string;
  industry: string;
  location: string;
  website: string;
  phone?: string;
  size: string;
  description: string;
  logo?: string;
  verified: boolean;
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type SkillDemandLevel = 'Low' | 'Medium' | 'High' | 'Very High';

export interface Skill {
  id: string;
  name: string;
  category: 'Programming' | 'Data Structures' | 'Databases' | 'Web Development' | 'AI/ML' | 'Cloud' | 'DevOps' | 'Cybersecurity' | 'Tools' | 'Soft Skills';
  description: string;
  industryDemandPercent: number;
  demandLevel: SkillDemandLevel;
  icon?: string;
}

export interface JobSkillRequirement {
  skillId: string;
  skillName: string;
  minLevel: SkillLevel;
  isRequired: boolean;
  weight: number;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  department: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  requiredSkills: JobSkillRequirement[];
  location: string;
  workMode: 'Remote' | 'On-site' | 'Hybrid';
  salary: string;
  employmentType: 'Full-time' | 'Internship' | 'Part-time';
  minCgpa: number;
  graduationYear: number;
  degree: string;
  branch: string;
  openings: number;
  deadline: string;
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
}

export interface StudentSkill {
  id: string;
  studentId: string;
  skillId: string;
  skillName: string;
  category: string;
  status: 'Self-Declared' | 'Verified';
  level: SkillLevel;
  score?: number;
  credibilityScore?: number; // 0 - 100%
  verifiedAt?: string;
  assessmentId?: string;
}

export interface VerifiedSkill {
  id: string;
  studentId: string;
  skillId: string;
  skillName: string;
  level: SkillLevel;
  score: number;
  credibilityScore: number; // 0 - 100%
  verificationDate: string;
  assessmentId: string;
  certificateId: string;
  projectsCount?: number;
  courseCompleted?: boolean;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  category: string;
  level: SkillLevel;
  duration: string;
  description: string;
  thumbnail: string;
  modulesCount: number;
  lessonsCount: number;
  enrolledCount: number;
  rating: number;
  targetSkills: string[];
  overview: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  description: string;
  isLocked?: boolean;
}

export interface LessonCheckQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonResource {
  title: string;
  url: string;
  type: 'pdf' | 'doc' | 'github' | 'cheatsheet';
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  orderIndex: number;
  durationMinutes: number;
  videoUrl?: string;
  videoDuration?: string;
  contentMarkdown: string;
  notesMarkdown?: string;
  codeExample?: string;
  practiceTask?: string;
  resources?: LessonResource[];
  checkQuestion?: LessonCheckQuestion;
  checkQuestions?: LessonCheckQuestion[];
}

export interface LessonProgress {
  id: string;
  studentId: string;
  courseId: string;
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  videoWatchedSeconds?: number;
  completedAt?: string;
}

export interface GlobalSearchResult {
  query: string;
  totalCount: number;
  detectedType?: 'JOBS' | 'SKILLS' | 'COURSES' | 'VIDEOS' | 'COMPANIES' | 'ALL';
  jobs: (Job & { matchScore?: number; isEligible?: boolean; missingSkills?: string[] })[];
  courses: Course[];
  skills: Skill[];
  videos: { id: string; title: string; courseId: string; courseTitle: string; duration: string; thumbnail: string; skillName: string; }[];
  companies: Company[];
}

export interface JobMatchAnalysis {
  job: Job;
  studentId: string;
  matchScore: number; // 0 - 100
  isEligible: boolean;
  cgpaEligible: boolean;
  requiredSkillsCount: number;
  verifiedSkillsCount: number;
  missingSkillsCount: number;
  skillsAnalysis: {
    skillId: string;
    skillName: string;
    requiredLevel: SkillLevel;
    studentLevel: SkillLevel | 'Unverified';
    status: 'VERIFIED' | 'LEVEL_GAP' | 'MISSING';
    score?: number;
    courseId?: string;
  }[];
  readinessSteps: {
    stepNumber: number;
    action: string;
    skillName: string;
    courseId?: string;
    assessmentId?: string;
  }[];
}

export interface SkillEcosystem {
  skill: Skill;
  levels: {
    beginner: Course[];
    intermediate: Course[];
    advanced: Course[];
  };
  videos: { id: string; title: string; courseTitle: string; duration: string; url?: string; thumbnail: string; }[];
  notes: { id: string; title: string; preview: string; downloadUrl?: string; }[];
  practiceProblems: CodingProblem[];
  assessments: Assessment[];
  projects: Project[];
  unlockedJobs: Job[];
}

export interface Assessment {
  id: string;
  skillId: string;
  skillName: string;
  title: string;
  description: string;
  targetLevel: SkillLevel;
  passingScore: number;
  durationMinutes: number;
  totalQuestions: number;
  courseId?: string;
}

export interface Question {
  id: string;
  assessmentId: string;
  questionText: string;
  type: 'mcq' | 'code' | 'practical';
  options: string[];
  correctOptionIndex: number;
  codeSnippet?: string;
  expectedOutput?: string;
  points: number;
  explanation: string;
}

export interface AssessmentResult {
  id: string;
  studentId: string;
  assessmentId: string;
  skillId: string;
  skillName: string;
  score: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  levelAwarded: SkillLevel;
  submittedAt: string;
}

export type ApplicationStatus = 'Applied' | 'Under Review' | 'Shortlisted' | 'Assessment' | 'Interview' | 'Selected' | 'Rejected';

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  companyId: string;
  studentName: string;
  studentEmail: string;
  studentCollege: string;
  jobTitle: string;
  companyName: string;
  matchPercentage: number;
  status: ApplicationStatus;
  notes?: string;
  interviewFeedback?: {
    technicalRating: 'Strong' | 'Good' | 'Needs Improvement';
    dsaRating: 'Strong' | 'Good' | 'Needs Improvement';
    communicationRating: 'Strong' | 'Good' | 'Needs Improvement';
    overallVerdict: string;
  };
  appliedAt: string;
  updatedAt: string;
}

export interface TrainingProgram {
  id: string;
  collegeId: string;
  title: string;
  description: string;
  durationWeeks: number;
  targetSkills: string[];
  targetStudentCount: number;
  enrolledStudentCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
  modules: string[];
}

export interface TrainingEnrollment {
  id: string;
  programId: string;
  studentId: string;
  studentName: string;
  progressPercent: number;
  assessmentScore?: number;
  status: 'enrolled' | 'in_progress' | 'completed';
  completedAt?: string;
}

export interface CollegeCurriculum {
  id: string;
  collegeId: string;
  department: string;
  subjectName: string;
  semester: number;
  coveredSkills: string[];
  coverageLevel: 'None' | 'Low' | 'Medium' | 'High';
}

export interface IndustrySkillDemand {
  id: string;
  skillName: string;
  category: string;
  demandPercent: number;
  demandLevel: SkillDemandLevel;
  jobPostingsCount: number;
  growthRate: number;
  industry: string;
}

export interface Notification {
  id: string;
  userId: string;
  role: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  skillOrCourseName: string;
  type: 'skill' | 'course';
  level?: SkillLevel;
  score?: number;
  issuedDate: string;
  verificationUrl: string;
}

export interface Project {
  id: string;
  studentId: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  verified: boolean;
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  targetRole: string;
  requiredSkills: { skill: string; level: SkillLevel }[];
  recommendedCourses: string[];
  recommendedProjects: string[];
  matchOpportunities: number;
}

export interface PlacementDrive {
  id: string;
  companyId: string;
  collegeId: string;
  companyName: string;
  collegeName: string;
  title: string;
  date: string;
  venue: string;
  minCgpa: number;
  eligibleDepartments: string[];
  status: 'scheduled' | 'ongoing' | 'completed';
}

// ==========================================
// ADVANCED INTELLIGENCE & DIFFERENTIATION TYPES
// ==========================================

export interface JobReadinessPillar {
  name: string;
  score: number; // 0 - 100
  weight: number; // e.g. 0.40
  weightedScore: number;
  status: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical Gap';
  details: string;
}

export interface ReadinessImprovementAction {
  id: string;
  title: string;
  description: string;
  impactScoreUplift: number; // e.g. +8%
  category: 'technical' | 'coding' | 'aptitude' | 'interview' | 'project' | 'resume';
  actionUrl: string;
  actionText: string;
}

export interface ReadinessTimelinePoint {
  milestone: string;
  readinessPercentage: number;
  isReached: boolean;
}

export interface ComprehensiveJobReadiness {
  studentId: string;
  targetJobId?: string;
  targetRole: string;
  overallReadiness: number; // 0 - 100
  status: 'Placement Ready ✓' | 'In Training' | 'Needs Training';
  pillars: {
    technicalSkills: JobReadinessPillar;
    coding: JobReadinessPillar;
    aptitude: JobReadinessPillar;
    interview: JobReadinessPillar;
    projects: JobReadinessPillar;
    resumeMatch: JobReadinessPillar;
  };
  timeline: ReadinessTimelinePoint[];
  improvementActions: ReadinessImprovementAction[];
}

export interface WhyNotEligibleDiagnostic {
  jobId: string;
  jobTitle: string;
  companyName: string;
  isEligible: boolean;
  matchPercentage: number;
  missingSkills: {
    skill: string;
    requiredLevel: SkillLevel;
    currentLevel: string;
    gapSeverity: 'Critical' | 'Moderate' | 'Minor';
    recommendedCourse: string;
    courseId: string;
    assessmentId: string;
  }[];
  passedRequirements: {
    requirement: string;
    value: string;
    status: 'Verified ✓' | 'Satisfied';
  }[];
  unmetAcademicCriteria: string[];
  readinessGap: number; // e.g. 28% gap to reach 90%+
  projectedScoreAfterActions: number; // e.g. 92%
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: 'Arrays' | 'Strings' | 'Linked Lists' | 'Trees' | 'Graphs' | 'Dynamic Programming' | 'Math/Logic';
  description: string;
  initialCode: {
    python: string;
    javascript: string;
    cpp: string;
  };
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
  hints: string[];
  recommendedForSkills: string[];
}

export interface CodingAttempt {
  id: string;
  studentId: string;
  problemId: string;
  problemTitle: string;
  topic: string;
  language: string;
  code: string;
  status: 'Solved ✓' | 'Failed' | 'In Progress';
  accuracy: number;
  executionTimeMs: number;
  submittedAt: string;
}

export interface CodingTopicStats {
  topic: string;
  attempted: number;
  solved: number;
  accuracy: number;
  proficiencyScore: number;
  status: 'Strong' | 'Moderate' | 'Weak Area';
}

export interface InterviewQuestion {
  id: string;
  targetRole: string;
  skillName: string;
  category: 'Technical' | 'Behavioral' | 'HR' | 'Situational' | 'Coding Architecture';
  question: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sampleStrongAnswer: string;
  keyEvaluationCriteria: string[];
}

export interface InterviewAnswerEvaluation {
  id: string;
  studentId: string;
  questionId: string;
  questionText: string;
  category: string;
  answerText: string;
  overallScore: number; // 0 - 100
  criteriaScores: {
    technicalCorrectness: number;
    relevance: number;
    structure: number;
    communication: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    suggestedRefinement: string;
  };
  submittedAt: string;
}

export interface ResumeMatchAnalysis {
  studentId: string;
  jobId: string;
  jobTitle: string;
  resumeMatchScore: number; // 0 - 100%
  matchedSkills: string[];
  missingSkills: string[];
  weakEvidenceSkills: {
    skill: string;
    observation: string;
    recommendation: string;
  }[];
  projectRecommendations: {
    title: string;
    description: string;
    targetTechnologies: string[];
    strengthensAreas: string;
  }[];
  resumeStrengths: string[];
  actionableFeedback: string[];
}

export interface CompanyDemandSignal {
  id: string;
  companyId: string;
  companyName: string;
  targetRole: string;
  requiredSkills: { skill: string; level: SkillLevel }[];
  expectedHiringCount: number;
  targetBatchYear: number;
  targetGraduationDate: string;
  minCgpa: number;
  offeredSalaryBand: string;
  status: 'active' | 'fulfilled' | 'closed';
  postedAt: string;
  messageToColleges: string;
}

export interface CollegeSkillHeatmapItem {
  skillName: string;
  category: string;
  industryDemandPercent: number; // e.g. 87%
  studentCohortProficiency: number; // e.g. 58%
  gapPercentage: number; // e.g. 29%
  status: 'Severe Deficit' | 'Moderate Gap' | 'Well Balanced' | 'Leading';
  affectedStudentCount: number;
  recommendedBootcamp: string;
}

export interface NextBestAction {
  id: string;
  studentId: string;
  priority: 'Immediate' | 'High' | 'Medium';
  title: string;
  reason: string;
  estimatedTime: string;
  impactScoreUplift: number; // e.g. +12%
  category: 'assessment' | 'course' | 'coding' | 'interview' | 'apply' | 'project';
  targetUrl: string;
  buttonLabel: string;
}

export interface StudentCohortGroup {
  id: string;
  collegeId: string;
  name: string; // e.g. "DSA Foundation Group"
  targetSkill: string;
  studentCount: number;
  studentIds: string[];
  reason: string;
  targetLevel: SkillLevel;
  recommendedDurationWeeks: number;
  assignedBootcampId?: string;
}

export interface ProjectRecommendationItem {
  id: string;
  title: string;
  targetRole: string;
  technologies: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  features: string[];
  learningOutcomes: string[];
  githubTemplateUrl?: string;
}

export interface JobMatchCalculation {
  jobId: string;
  studentId: string;
  matchPercentage: number;
  isEligible: boolean;
  skillMatchPercentage: number;
  matchedSkills: string[];
  missingSkills: { skill: string; currentLevel: string; requiredLevel: string }[];
  whyYouMatch: string[];
  whatYouNeed: string[];
  criteriaBreakdown: {
    skills: { weight: number; score: number; max: number };
    cgpa: { weight: number; score: number; max: number; passed: boolean };
    education: { weight: number; score: number; max: number; passed: boolean };
    overallMatch: number;
  };
}

export interface PersonalizedRoadmapStep {
  stepNumber: number;
  title: string;
  skillName: string;
  currentLevel: string;
  targetLevel: SkillLevel;
  courseId?: string;
  courseTitle?: string;
  assessmentId?: string;
  estimatedHours: number;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface PersonalizedRoadmap {
  jobId?: string;
  jobTitle: string;
  studentId: string;
  targetRole: string;
  totalEstimatedHours: number;
  steps: PersonalizedRoadmapStep[];
  currentReadiness: number;
  projectedReadiness: number;
}

export interface CurriculumGapResult {
  skillName: string;
  industryDemand: SkillDemandLevel;
  demandPercent: number;
  curriculumCoverage: 'None' | 'Low' | 'Medium' | 'High';
  gapStatus: 'Critical Gap' | 'Moderate Gap' | 'Aligned' | 'Curriculum Leading';
  recommendation: string;
  suggestedAction: string;
}

