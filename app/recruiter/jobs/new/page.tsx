'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  Building2,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRight,
  Send,
  Zap,
  Check,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Info,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { JobSkillRequirement, SkillLevel } from '@/lib/types';

interface PresetTemplate {
  name: string;
  title: string;
  roleId: string;
  roleTitle: string;
  industry: string;
  country: string;
  region: string;
  city: string;
  workMode: 'Hybrid' | 'Remote' | 'On-site';
  experienceLevel: string;
  educationRequirement: string;
  salary: string;
  description: string;
  requiredSkills: JobSkillRequirement[];
  preferredSkills: JobSkillRequirement[];
}

const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    name: 'Junior Data Analyst (Prompt Specification)',
    title: 'Junior Data Analyst',
    roleId: 'role_data_analyst',
    roleTitle: 'Junior Data Analyst',
    industry: 'Data & AI',
    country: 'India',
    region: 'Bihar',
    city: 'Patna',
    workMode: 'Hybrid',
    experienceLevel: 'Fresher (0-1 yrs)',
    educationRequirement: 'B.S. / B.Tech or B.Sc (Data/Math/CS)',
    salary: '₹5,50,000 - ₹8,00,000 / year',
    description: 'We are seeking a Junior Data Analyst to model, query, and transform enterprise datasets. Must have hands-on SQL for relational querying, Advanced Excel for cohort analysis, and Python for data pipelines.',
    requiredSkills: [
      { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Intermediate', isRequired: true, weight: 1.5 },
      { skillId: 'sk_excel', skillName: 'Excel', minLevel: 'Advanced', isRequired: true, weight: 1.5 },
      { skillId: 'sk_python', skillName: 'Python', minLevel: 'Intermediate', isRequired: true, weight: 1.2 }
    ],
    preferredSkills: [
      { skillId: 'sk_powerbi', skillName: 'Power BI', minLevel: 'Intermediate', isRequired: false, weight: 0.8 },
      { skillId: 'sk_git', skillName: 'Git', minLevel: 'Beginner', isRequired: false, weight: 0.6 }
    ]
  },
  {
    name: 'Software Developer (Full Stack)',
    title: 'Software Developer',
    roleId: 'role_swe',
    roleTitle: 'Software Developer',
    industry: 'Information Technology',
    country: 'India',
    region: 'Bihar',
    city: 'Patna',
    workMode: 'Hybrid',
    experienceLevel: 'Fresher (0-1 yrs)',
    educationRequirement: 'B.Tech in Computer Science / IT',
    salary: '₹6,00,000 - ₹9,50,000 / year',
    description: 'Join our Patna engineering cluster building cloud-native web applications. Requires strong Python, data structures, SQL fundamentals and Git revision control.',
    requiredSkills: [
      { skillId: 'sk_python', skillName: 'Python', minLevel: 'Intermediate', isRequired: true, weight: 1.5 },
      { skillId: 'sk_dsa', skillName: 'DSA', minLevel: 'Intermediate', isRequired: true, weight: 1.5 },
      { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Intermediate', isRequired: true, weight: 1.2 },
      { skillId: 'sk_git', skillName: 'Git', minLevel: 'Beginner', isRequired: true, weight: 1.0 }
    ],
    preferredSkills: [
      { skillId: 'sk_aws', skillName: 'AWS', minLevel: 'Beginner', isRequired: false, weight: 0.8 },
      { skillId: 'sk_docker', skillName: 'Docker', minLevel: 'Beginner', isRequired: false, weight: 0.7 }
    ]
  },
  {
    name: 'Frontend Engineer (React)',
    title: 'Frontend Engineer',
    roleId: 'role_frontend',
    roleTitle: 'Frontend Engineer',
    industry: 'Information Technology',
    country: 'India',
    region: 'Karnataka',
    city: 'Bangalore',
    workMode: 'Hybrid',
    experienceLevel: '1-3 yrs',
    educationRequirement: 'B.Tech / B.E. / BCA / MCA',
    salary: '₹8,00,000 - ₹14,00,000 / year',
    description: 'Build fast, responsive interfaces using React, TypeScript, and modern state architectures.',
    requiredSkills: [
      { skillId: 'sk_react', skillName: 'React', minLevel: 'Intermediate', isRequired: true, weight: 1.5 },
      { skillId: 'sk_typescript', skillName: 'TypeScript', minLevel: 'Intermediate', isRequired: true, weight: 1.3 },
      { skillId: 'sk_git', skillName: 'Git', minLevel: 'Intermediate', isRequired: true, weight: 1.0 }
    ],
    preferredSkills: [
      { skillId: 'sk_tailwind', skillName: 'Tailwind CSS', minLevel: 'Intermediate', isRequired: false, weight: 0.8 },
      { skillId: 'sk_nextjs', skillName: 'Next.js', minLevel: 'Beginner', isRequired: false, weight: 0.8 }
    ]
  }
];

export default function NewJobPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const companyId = profile?.id || 'comp_1';
  const companyName = profile?.name || 'TechNova';

  // 1. Role & Industry
  const [title, setTitle] = useState('Junior Data Analyst');
  const [roleTitle, setRoleTitle] = useState('Junior Data Analyst');
  const [roleId, setRoleId] = useState('role_data_analyst');
  const [department, setDepartment] = useState('Analytics & Business Intelligence');
  const [industry, setIndustry] = useState('Data & AI');

  // 2. Geographic Granularity
  const [country, setCountry] = useState('India');
  const [region, setRegion] = useState('Bihar');
  const [city, setCity] = useState('Patna');
  const [workMode, setWorkMode] = useState<'Hybrid' | 'Remote' | 'On-site'>('Hybrid');

  // 3. Experience & Academic
  const [experienceLevel, setExperienceLevel] = useState('Fresher (0-1 yrs)');
  const [educationRequirement, setEducationRequirement] = useState('B.S. / B.Tech or B.Sc (Data/Math/CS)');
  const [salary, setSalary] = useState('₹5,50,000 - ₹8,00,000 / year');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [minCgpa, setMinCgpa] = useState(7.0);
  const [graduationYear, setGraduationYear] = useState(2026);
  const [openings, setOpenings] = useState(5);
  const [deadline, setDeadline] = useState('2026-10-31');

  // 4. Skills: Required vs. Preferred with Minimum Proficiency
  const [requiredSkills, setRequiredSkills] = useState<JobSkillRequirement[]>([
    { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Intermediate', isRequired: true, weight: 1.5 },
    { skillId: 'sk_excel', skillName: 'Excel', minLevel: 'Advanced', isRequired: true, weight: 1.5 },
    { skillId: 'sk_python', skillName: 'Python', minLevel: 'Intermediate', isRequired: true, weight: 1.2 }
  ]);

  const [preferredSkills, setPreferredSkills] = useState<JobSkillRequirement[]>([
    { skillId: 'sk_powerbi', skillName: 'Power BI', minLevel: 'Intermediate', isRequired: false, weight: 0.8 },
    { skillId: 'sk_git', skillName: 'Git', minLevel: 'Beginner', isRequired: false, weight: 0.6 }
  ]);

  // Description & AI Parser
  const [description, setDescription] = useState(
    'We are seeking a Junior Data Analyst to model, query, and transform enterprise datasets. Must have hands-on SQL for relational querying, Advanced Excel for cohort analysis, and Python for data pipelines. Preferred knowledge of Power BI dashboards.'
  );

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionSuccess, setExtractionSuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  // Quick template loader
  const handleApplyTemplate = (tpl: PresetTemplate) => {
    setTitle(tpl.title);
    setRoleTitle(tpl.roleTitle);
    setRoleId(tpl.roleId);
    setIndustry(tpl.industry);
    setCountry(tpl.country);
    setRegion(tpl.region);
    setCity(tpl.city);
    setWorkMode(tpl.workMode);
    setExperienceLevel(tpl.experienceLevel);
    setEducationRequirement(tpl.educationRequirement);
    setSalary(tpl.salary);
    setDescription(tpl.description);
    setRequiredSkills(tpl.requiredSkills);
    setPreferredSkills(tpl.preferredSkills);
  };

  // AI Extraction handler
  const handleAIExtract = async () => {
    if (!description.trim()) return;
    setIsExtracting(true);
    setExtractionSuccess(false);

    try {
      const res = await fetch('/api/ai/extract-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });
      const data = await res.json();
      if (data.skills && data.skills.length > 0) {
        // Split extracted skills into required and preferred based on isRequired
        const req: JobSkillRequirement[] = [];
        const pref: JobSkillRequirement[] = [];
        data.skills.forEach((s: JobSkillRequirement) => {
          if (s.isRequired !== false) {
            req.push({ ...s, isRequired: true });
          } else {
            pref.push({ ...s, isRequired: false });
          }
        });
        if (req.length > 0) setRequiredSkills(req);
        if (pref.length > 0) setPreferredSkills(pref);
        if (data.department) setDepartment(data.department);
        setExtractionSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExtracting(false);
    }
  };

  // Required skill handlers
  const handleRequiredLevelChange = (index: number, level: SkillLevel) => {
    const updated = [...requiredSkills];
    updated[index].minLevel = level;
    setRequiredSkills(updated);
  };

  const handleRequiredNameChange = (index: number, name: string) => {
    const updated = [...requiredSkills];
    updated[index].skillName = name;
    updated[index].skillId = `sk_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
    setRequiredSkills(updated);
  };

  const handleRemoveRequiredSkill = (index: number) => {
    setRequiredSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddRequiredSkill = () => {
    setRequiredSkills(prev => [
      ...prev,
      { skillId: `sk_custom_${Date.now()}`, skillName: 'New Skill', minLevel: 'Intermediate', isRequired: true, weight: 1.2 }
    ]);
  };

  // Preferred skill handlers
  const handlePreferredLevelChange = (index: number, level: SkillLevel) => {
    const updated = [...preferredSkills];
    updated[index].minLevel = level;
    setPreferredSkills(updated);
  };

  const handlePreferredNameChange = (index: number, name: string) => {
    const updated = [...preferredSkills];
    updated[index].skillName = name;
    updated[index].skillId = `sk_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
    setPreferredSkills(updated);
  };

  const handleRemovePreferredSkill = (index: number) => {
    setPreferredSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddPreferredSkill = () => {
    setPreferredSkills(prev => [
      ...prev,
      { skillId: `sk_custom_${Date.now()}`, skillName: 'Preferred Skill', minLevel: 'Intermediate', isRequired: false, weight: 0.8 }
    ]);
  };

  // Submit and Publish
  const handlePublishJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);

    const fullLocation = `${city}, ${region}, ${country}`;

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          companyName,
          title,
          roleId,
          roleTitle: roleTitle || title,
          department,
          industry,
          country,
          region,
          city,
          location: fullLocation,
          workMode,
          experienceLevel,
          educationRequirement,
          salary,
          employmentType,
          description,
          responsibilities: [
            `Apply ${requiredSkills.map(s => s.skillName).join(', ')} to production systems and workflows.`,
            'Partner with multidisciplinary product and technical teams.',
            'Maintain high standards of code, analytics, and operational documentation.'
          ],
          requirements: [
            `${educationRequirement}.`,
            `Demonstrated proficiency in: ${requiredSkills.map(s => `${s.skillName} (${s.minLevel})`).join(', ')}.`,
            experienceLevel
          ],
          requiredSkills,
          preferredSkills,
          minCgpa: Number(minCgpa),
          graduationYear: Number(graduationYear),
          degree: educationRequirement,
          branch: 'Computer Science / IT / Related STEM',
          openings: Number(openings),
          deadline
        })
      });

      const data = await res.json();
      if (data.success) {
        setPublished(true);
        setTimeout(() => {
          router.push(`/jobs/${data.job.id}`);
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link href="/recruiter/dashboard" className="text-xs font-bold text-slate-500 hover:text-primary-600">
            ← Back to Recruiter Dashboard
          </Link>
          <Link href="/college/industry-demand" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>View Skill Demand Radar</span>
          </Link>
        </div>

        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary-600" />
              <span>Phase 4 Global Employer Skill Demand Engine</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Create Skill-Centric Job Opening
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In Skill2Hire, skills form the central structure of every job opening. Every published role directly feeds the global and regional Skill Demand Engine with verified employer market signals.
          </p>

          {/* Preset Template Selector */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              ⚡ Quick Fill Job Template (Click to pre-fill):
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_TEMPLATES.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                    title === tpl.title
                      ? 'bg-primary-50 text-primary-700 border-primary-300 ring-2 ring-primary-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-Time Demand Engine Contribution Banner */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-4 flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-900 space-y-1">
            <p className="font-bold">
              Demand Engine Contribution Notice:
            </p>
            <p className="text-indigo-800">
              When published, this opening will add active demand signals for <span className="font-bold">{region}, {country}</span> in the <span className="font-bold">{industry}</span> industry across {requiredSkills.length} required and {preferredSkills.length} preferred competencies.
            </p>
          </div>
        </div>

        <form onSubmit={handlePublishJob} className="space-y-8">
          
          {/* 1. ROLE & INDUSTRY */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Briefcase className="w-5 h-5 text-primary-600" />
              <h2>1. Job Role & Industry</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!roleTitle || roleTitle === title) setRoleTitle(e.target.value);
                  }}
                  placeholder="e.g. Junior Data Analyst"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Standardized Role</label>
                <select
                  value={roleId}
                  onChange={(e) => {
                    setRoleId(e.target.value);
                    const opt = e.target.selectedOptions[0];
                    if (opt) setRoleTitle(opt.text);
                  }}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="role_data_analyst">Junior Data Analyst</option>
                  <option value="role_swe">Software Developer</option>
                  <option value="role_frontend">Frontend Engineer</option>
                  <option value="role_backend">Backend Engineer</option>
                  <option value="role_data_scientist">Data Scientist</option>
                  <option value="role_devops">DevOps / Cloud Engineer</option>
                  <option value="role_iot">IoT & Embedded Engineer</option>
                  <option value="role_qa">Quality & Automation Engineer</option>
                  <option value="role_other">Other / Custom Technical Role</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="Data & AI">Data & AI</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                  <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                  <option value="AgriTech & Rural Tech">AgriTech & Rural Tech</option>
                  <option value="Clean Energy & Utilities">Clean Energy & Utilities</option>
                  <option value="Electronics & Hardware">Electronics & Hardware</option>
                  <option value="Finance & FinTech">Finance & FinTech</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Analytics & Data Engineering"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. GEOGRAPHIC GRANULARITY & WORK MODE */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Globe className="w-5 h-5 text-indigo-600" />
                <h2>2. Location & Regional Scope</h2>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold border border-emerald-200">
                Bihar Corridor Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="Germany">Germany</option>
                  <option value="Singapore">Singapore</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Region / State</label>
                <select
                  value={region}
                  onChange={(e) => {
                    const r = e.target.value;
                    setRegion(r);
                    if (r === 'Bihar') setCity('Patna');
                    else if (r === 'Karnataka') setCity('Bangalore');
                    else if (r === 'Tamil Nadu') setCity('Chennai');
                    else if (r === 'Maharashtra') setCity('Pune');
                    else if (r === 'Telangana') setCity('Hyderabad');
                    else if (r === 'California') setCity('San Francisco');
                  }}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <optgroup label="India (Key Hubs & Corridors)">
                    <option value="Bihar">Bihar (Priority Ecosystem)</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                  </optgroup>
                  <optgroup label="International">
                    <option value="California">California (US)</option>
                    <option value="Bavaria">Bavaria (DE)</option>
                    <option value="Singapore">Singapore</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / District</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Patna, Muzaffarpur, Gaya"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. EXPERIENCE & EDUCATION */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <h2>3. Experience & Education Requirements</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="Fresher (0-1 yrs)">Fresher (0-1 yrs)</option>
                  <option value="Entry Level (1-2 yrs)">Entry Level (1-2 yrs)</option>
                  <option value="Mid Level (2-4 yrs)">Mid Level (2-4 yrs)</option>
                  <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Education Requirement</label>
                <input
                  type="text"
                  required
                  value={educationRequirement}
                  onChange={(e) => setEducationRequirement(e.target.value)}
                  placeholder="e.g. B.Tech / B.S. / B.Sc in STEM"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Salary Range</label>
                <input
                  type="text"
                  required
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. ₹5,50,000 - ₹8,00,000 / year"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Minimum CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Openings</label>
                <input
                  type="number"
                  required
                  value={openings}
                  onChange={(e) => setOpenings(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 4. CENTRAL SKILL REQUIREMENTS: REQUIRED & PREFERRED WITH MIN PROFICIENCY */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span>4. Skill Requirements & Minimum Proficiency</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Specify mandatory competencies and preferred value-add skills with minimum required proficiency.
                </p>
              </div>
            </div>

            {/* REQUIRED SKILLS BLOCK */}
            <div className="space-y-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                    Required Skills (Mandatory for Candidate Matching)
                  </span>
                  <p className="text-[11px] text-slate-500">Candidates must meet or exceed this minimum proficiency.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddRequiredSkill}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Required Skill</span>
                </button>
              </div>

              <div className="space-y-2">
                {requiredSkills.map((req, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                      <input
                        type="text"
                        value={req.skillName}
                        onChange={(e) => handleRequiredNameChange(idx, e.target.value)}
                        placeholder="e.g. SQL, Python, Excel"
                        className="font-bold text-xs text-slate-900 px-3 py-1.5 border border-slate-300 rounded-lg flex-1 min-w-[120px]"
                      />
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-slate-500">Min Proficiency:</span>
                        <select
                          value={req.minLevel}
                          onChange={(e) => handleRequiredLevelChange(idx, e.target.value as SkillLevel)}
                          className="px-2.5 py-1.5 text-xs border border-rose-300 rounded-lg bg-rose-50/50 font-bold text-rose-800"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveRequiredSkill(idx)}
                      disabled={requiredSkills.length <= 1}
                      className="text-slate-400 hover:text-rose-600 p-1 disabled:opacity-30"
                      title="Remove skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* PREFERRED SKILLS BLOCK */}
            <div className="space-y-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Preferred Skills (Optional / Bonus Weight)
                  </span>
                  <p className="text-[11px] text-slate-500">Provides bonus ranking score to candidates possessing these skills.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddPreferredSkill}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Preferred Skill</span>
                </button>
              </div>

              <div className="space-y-2">
                {preferredSkills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No preferred skills added yet. Click &quot;Add Preferred Skill&quot; above.</p>
                ) : (
                  preferredSkills.map((pref, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                        <input
                          type="text"
                          value={pref.skillName}
                          onChange={(e) => handlePreferredNameChange(idx, e.target.value)}
                          placeholder="e.g. Power BI, Git, Docker"
                          className="font-bold text-xs text-slate-900 px-3 py-1.5 border border-slate-300 rounded-lg flex-1 min-w-[120px]"
                        />
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-slate-500">Min Proficiency:</span>
                          <select
                            value={pref.minLevel}
                            onChange={(e) => handlePreferredLevelChange(idx, e.target.value as SkillLevel)}
                            className="px-2.5 py-1.5 text-xs border border-blue-300 rounded-lg bg-blue-50/50 font-bold text-blue-800"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemovePreferredSkill(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 5. NATURAL LANGUAGE DESCRIPTION & AI PARSER */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  <span>5. Natural Language Description & AI Skill Parser</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Type or paste requirements to extract required technologies and proficiency levels.
                </p>
              </div>
            </div>

            <div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='e.g. "We are looking for software developers with Python, SQL, data structures, Git and basic AWS knowledge."'
                className="w-full p-4 text-sm bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleAIExtract}
                disabled={isExtracting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{isExtracting ? 'Extracting with AI...' : 'AI Extract & Synchronize Skills'}</span>
              </button>

              {extractionSuccess && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Skills extracted and synchronized!</span>
                </span>
              )}
            </div>
          </div>

          {/* Publish Action Button */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <Link
              href="/recruiter/dashboard"
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isPublishing || published}
              className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2"
            >
              {published ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Job Published & Demand Engine Updated! ✓</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{isPublishing ? 'Publishing...' : 'Publish Job & Update Skill Demand'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
