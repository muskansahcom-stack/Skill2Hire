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
  HelpCircle,
  Zap,
  Check
} from 'lucide-react';
import { JobSkillRequirement, SkillLevel } from '@/lib/types';

export default function NewJobPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const companyId = profile?.id || 'comp_1';
  const companyName = profile?.name || 'TechNova';

  const [title, setTitle] = useState('Software Developer');
  const [department, setDepartment] = useState('Core Engineering');
  const [location, setLocation] = useState('San Francisco, CA (Hybrid)');
  const [workMode, setWorkMode] = useState<'Hybrid' | 'Remote' | 'On-site'>('Hybrid');
  const [salary, setSalary] = useState('$95,000 - $125,000 / year');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [minCgpa, setMinCgpa] = useState(7.5);
  const [graduationYear, setGraduationYear] = useState(2026);
  const [openings, setOpenings] = useState(8);
  const [deadline, setDeadline] = useState('2026-09-30');

  // Job Description for AI Extraction (Section 15 specification)
  const [description, setDescription] = useState(
    'We are looking for software developers with Python, SQL, data structures, Git and basic AWS knowledge.'
  );

  const [extractedSkills, setExtractedSkills] = useState<JobSkillRequirement[]>([
    { skillId: 'sk_python', skillName: 'Python', minLevel: 'Intermediate', isRequired: true, weight: 1.5 },
    { skillId: 'sk_dsa', skillName: 'DSA', minLevel: 'Intermediate', isRequired: true, weight: 1.5 },
    { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Intermediate', isRequired: true, weight: 1.2 },
    { skillId: 'sk_git', skillName: 'Git', minLevel: 'Beginner', isRequired: true, weight: 1.0 },
    { skillId: 'sk_aws', skillName: 'AWS', minLevel: 'Beginner', isRequired: false, weight: 0.8 }
  ]);

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionSuccess, setExtractionSuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  // Trigger AI Extraction (Section 15 & 49 Step 2)
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
        setExtractedSkills(data.skills);
        if (data.department) setDepartment(data.department);
        setExtractionSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleLevelChange = (index: number, level: SkillLevel) => {
    const updated = [...extractedSkills];
    updated[index].minLevel = level;
    setExtractedSkills(updated);
  };

  const handleRemoveSkill = (index: number) => {
    setExtractedSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSkillManual = () => {
    setExtractedSkills(prev => [
      ...prev,
      { skillId: `sk_${Date.now()}`, skillName: 'New Skill', minLevel: 'Intermediate', isRequired: true, weight: 1.0 }
    ]);
  };

  const handlePublishJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          companyName,
          title,
          department,
          description,
          responsibilities: [
            'Design, build, and maintain efficient, reusable, and reliable code.',
            'Implement optimized database queries, schema migrations, and indexing strategies with SQL.',
            'Collaborate with product and DevOps teams using Git workflows and cloud deployment pipelines.',
            'Solve complex algorithmic and data structure problems with clean code standards.'
          ],
          requirements: [
            'B.S. or B.Tech in Computer Science, IT, or related technical field.',
            'Strong fundamentals in Data Structures & Algorithms and Object-Oriented Programming.',
            'Demonstrated proficiency in required verified technical skills.',
            `Minimum CGPA of ${minCgpa}.`
          ],
          requiredSkills: extractedSkills,
          location,
          workMode,
          salary,
          employmentType,
          minCgpa: Number(minCgpa),
          graduationYear: Number(graduationYear),
          degree: 'B.S. / B.Tech',
          branch: 'Computer Science / IT',
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
        <div>
          <Link href="/recruiter/dashboard" className="text-xs font-bold text-slate-500 hover:text-primary-600">
            ← Back to Recruiter Dashboard
          </Link>
        </div>

        {/* Header Banner (Section 32) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary-600" />
              <span>AI-Powered Job Publishing Engine</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Create Job Opening with Instant Skill Extraction
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Enter your natural text job description. Skill2Hire AI automatically parses required technical competencies and proficiency levels.
          </p>
        </div>

        <form onSubmit={handlePublishJob} className="space-y-8">
          
          {/* 1. CORE JOB METADATA */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900">1. Job Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Salary Range</label>
                <input
                  type="text"
                  required
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
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
            </div>
          </div>

          {/* 2. AI JOB DESCRIPTION & SKILL EXTRACTION (Section 15) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  <span>2. Natural Language Description & AI Skill Parser</span>
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
                <span>{isExtracting ? 'Extracting with AI...' : 'AI Extract Skills & Requirements (Step 2)'}</span>
              </button>

              {extractionSuccess && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Extracted {extractedSkills.length} skills successfully!</span>
                </span>
              )}
            </div>

            {/* Extracted Skills Review Table */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Extracted Skills & Proficiency Levels (Review & Edit):
                </span>
                <button
                  type="button"
                  onClick={handleAddSkillManual}
                  className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="space-y-2">
                {extractedSkills.map((req, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xs text-slate-900 w-32 truncate">{req.skillName}</span>
                      <select
                        value={req.minLevel}
                        onChange={(e) => handleLevelChange(idx, e.target.value as SkillLevel)}
                        className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={req.isRequired}
                          onChange={(e) => {
                            const updated = [...extractedSkills];
                            updated[idx].isRequired = e.target.checked;
                            setExtractedSkills(updated);
                          }}
                          className="rounded text-primary-600"
                        />
                        <span>Required</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. ACADEMIC ELIGIBILITY CRITERIA */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900">3. Academic Eligibility Thresholds</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Graduation Year</label>
                <input
                  type="number"
                  required
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
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
              className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2"
            >
              {published ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Job Published to Ecosystem! ✓</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{isPublishing ? 'Publishing...' : 'Publish Job opening (Step 1)'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
