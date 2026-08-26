'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  Zap,
  BookOpen,
  Briefcase,
  Award,
  ChevronDown
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  actions?: { label: string; href: string }[];
}

export default function AiAdvisorWidget() {
  const { profile, role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const studentName = profile?.name || 'Alex';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_init',
      sender: 'ai',
      text: `Hello ${studentName}! I am your **Skill2Hire AI Career Advisor**. I analyze your verified skills, course milestones, and live job requirements in real-time. How can I help you become job-ready today?`,
      time: 'Just now',
      actions: [
        { label: 'Check My Readiness', href: '/student/academic-report' },
        { label: 'Diagnose Skill Gaps', href: '/student/skills' },
        { label: 'Find Matching Jobs', href: '/jobs' }
      ]
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (userQuery?: string) => {
    const query = userQuery || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!userQuery) setInput('');
    setIsTyping(true);

    // AI dynamic responses based on query keywords
    setTimeout(() => {
      let replyText = '';
      let replyActions: { label: string; href: string }[] = [];

      const q = query.toLowerCase();

      if (q.includes('gap') || q.includes('miss') || q.includes('weak')) {
        replyText = `Based on your profile, your biggest skill gap is **Data Structures & Algorithms (Intermediate)** and **AWS Cloud**. 18 open software developer jobs currently require these skills.`;
        replyActions = [
          { label: 'Start DSA Course', href: '/courses/crs_dsa_prep/learn' },
          { label: 'Improve Skills', href: '/student/skills' }
        ];
      } else if (q.includes('readiness') || q.includes('score') || q.includes('eligib')) {
        replyText = `Your overall **Job Readiness Score is 84%**. You have **2 verified skills** (Python Advanced, SQL Intermediate) and a CGPA of 8.6. Verifying DSA will boost your readiness above 90%!`;
        replyActions = [
          { label: 'View Skill Passport', href: '/student/academic-report' },
          { label: 'Take DSA Assessment', href: '/assessments/asm_python' }
        ];
      } else if (q.includes('technova') || q.includes('software developer') || q.includes('job')) {
        replyText = `For the **Software Developer role at TechNova**, you match 78% of requirements. You meet Python and SQL criteria, but need **DSA Intermediate** and **AWS Basics** to reach 100% eligibility.`;
        replyActions = [
          { label: 'View TechNova Job', href: '/jobs/job_1' },
          { label: 'Start Preparation Track', href: '/courses/crs_python/learn' }
        ];
      } else if (q.includes('project') || q.includes('resume')) {
        replyText = `I recommend building a **Full-Stack REST Microservice** or a **Sales Data Analytics Dashboard**. These directly validate your Python & SQL skills for recruiters.`;
        replyActions = [
          { label: 'Browse Projects', href: '/student/projects' },
          { label: 'AI Resume Matcher', href: '/student/resume-matcher' }
        ];
      } else {
        replyText = `I analyzed your request. You can boost your placement readiness by completing video courses, solving coding arena problems, and passing official verified assessments.`;
        replyActions = [
          { label: 'Explore Courses', href: '/courses' },
          { label: 'Coding Practice Arena', href: '/student/coding-practice' }
        ];
      }

      const aiMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: replyActions
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 print:hidden">
      
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 rounded-full bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-2xl shadow-primary-600/40 hover:scale-105 transition-all group"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
          </div>
          <span>AI Career Advisor</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>
      )}

      {/* Floating Chat Window Modal */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col justify-between overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Top Bar */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary-500/30 border border-primary-400/40 flex items-center justify-center text-cyan-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black flex items-center gap-1.5">
                  <span>Skill2Hire AI Advisor</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] text-cyan-300 font-medium">Placement & Readiness Engine</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 space-y-3.5 overflow-y-auto bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-primary-600 text-white flex items-center justify-center shrink-0 text-xs mt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`space-y-2 max-w-[82%]`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary-600 text-white rounded-tr-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                    <div className={`text-[9px] mt-1 text-right font-mono ${msg.sender === 'user' ? 'text-primary-200' : 'text-slate-400'}`}>
                      {msg.time}
                    </div>
                  </div>

                  {/* Clickable Actions */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {msg.actions.map((act, i) => (
                        <Link
                          key={i}
                          href={act.href}
                          onClick={() => setIsOpen(false)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-bold text-primary-700 flex items-center gap-1 shadow-2xs transition-colors"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-2.5 h-2.5 text-primary-500" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-8">
                <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce delay-200" />
                <span className="text-[10px]">Analyzing career data...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              'What are my skill gaps?',
              'How to become eligible for TechNova?',
              'Calculate my Job Readiness'
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-primary-50 hover:text-primary-700 text-slate-600 text-[10px] font-semibold transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your readiness & jobs..."
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
