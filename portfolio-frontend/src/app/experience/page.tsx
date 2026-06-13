'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Globe, Heart, ExternalLink } from 'lucide-react';
import Card3D from '../components/Card3D';

interface ProjectItem {
  title: string;
  tech: string[];
  description: string;
  githubUrl?: string;
}

interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  grade?: string;
}

const PROJECTS: ProjectItem[] = [
  {
    title: 'Streamify - OTT Streaming Platform',
    tech: ['Next.js', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    description: 'Full-stack OTT platform with JWT authentication, personalized watchlists, advanced search & filter, responsive UI, and scalable REST API backend.',
    githubUrl: 'https://github.com/mahitss/Streamify'
  },
  {
    title: 'Logicra - AI Productivity SaaS Platform',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'OpenAI', 'Gemini', 'Stripe', 'PostgreSQL'],
    description: 'AI-powered SaaS platform featuring real-time AI chat, content generation, subscription billing via Stripe, user dashboards, and workflow automation.'
  },
  {
    title: 'GrindLock - AI Study Tracking Platform',
    tech: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Gemini API', 'Clerk'],
    description: 'Productivity platform for students with AI-assisted study planning, daily tracking, goal management, productivity streaks, and analytics dashboard.'
  },
  {
    title: 'Beacon - AI Customer Acquisition Platform',
    tech: ['Next.js', 'TypeScript', 'Node.js', 'OpenAI', 'LangChain', 'MongoDB', 'Clerk'],
    description: 'Intelligent sales automation platform with AI-driven lead qualification, 24/7 virtual sales agent, appointment booking, CRM integration, and conversion analytics.'
  },
  {
    title: 'My Chat App - Real-Time Messaging Platform',
    tech: ['Next.js', 'TypeScript', 'Node.js', 'Socket.io', 'MongoDB', 'JWT'],
    description: 'Full-stack real-time chat application featuring WebSocket-based instant messaging, secure JWT authentication, and responsive cross-device UI.'
  }
];

const EDUCATION: EducationItem[] = [
  {
    degree: 'Bachelor of Computer Applications (BCA) - AI & ML',
    institution: 'Shri Ramswaroop Memorial University, Lucknow',
    period: '2025 - 2028'
  }
];

const ACHIEVEMENTS: string[] = [
  'Participated in SnowStorm Hackathon organized by Tech4Hack, demonstrating innovation and collaborative problem-solving in a high-intensity coding sprint.',
  'Active participant in multiple hackathons and coding competitions, consistently applying full-stack and AI skills to real-world challenges.'
];

const SKILL_CATEGORIES = [
  {
    title: 'Languages',
    skills: ['Python', 'JavaScript', 'TypeScript']
  },
  {
    title: 'Frontend',
    skills: ['HTML5', 'CSS3', 'React.js', 'Next.js', 'Tailwind CSS', 'Shadcn/UI']
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Express.js', 'REST APIs', 'Server Actions', 'WebSockets']
  },
  {
    title: 'Databases',
    skills: ['MongoDB', 'PostgreSQL', 'Mongoose ODM', 'Prisma ORM']
  },
  {
    title: 'AI Engineering',
    skills: ['OpenAI API', 'Google Gemini API', 'LangChain', 'AI Agents', 'RAG']
  },
  {
    title: 'Cloud & DevOps',
    skills: ['Docker', 'Kubernetes', 'AWS EC2', 'Vercel', 'Railway']
  },
  {
    title: 'Auth & Payments',
    skills: ['JWT', 'OAuth 2.0', 'Clerk', 'Auth.js (NextAuth)', 'Stripe']
  },
  {
    title: 'Tools',
    skills: ['Git', 'GitHub', 'Postman', 'VS Code', 'Linux', 'Socket.IO']
  }
];

const INTERESTS = ['Software Development', 'Artificial Intelligence', 'Cloud Technologies', 'Open Source', 'DevOps'];

const LANGUAGES = [
  { name: 'English', level: 'Professional Proficiency' },
  { name: 'Hindi', level: 'Native' }
];

export default function Experience() {
  const [activeTab, setActiveTab] = useState<'projects' | 'education'>('projects');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen px-6 lg:px-16 py-12 relative">
      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Header Title */}
        <div className="mb-12">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-2">{'// PORTFOLIO DIRECTORY'}</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Projects, Skills & <span className="text-gradient">Academics</span>
          </h1>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Interactive Projects & Academics (7 Columns) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Tabs */}
            <div className="flex border-b border-white/10 pb-px">
              <button
                onClick={() => setActiveTab('projects')}
                className={`pb-4 px-6 font-mono text-xs uppercase tracking-wider transition-colors relative ${
                  activeTab === 'projects' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Projects
                {activeTab === 'projects' && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`pb-4 px-6 font-mono text-xs uppercase tracking-wider transition-colors relative ${
                  activeTab === 'education' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Education & Achievements
                {activeTab === 'education' && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                  />
                )}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-2">
              <AnimatePresence mode="wait">
                {activeTab === 'projects' ? (
                  <motion.div
                    key="projects"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-8"
                  >
                    {PROJECTS.map((proj, idx) => (
                      <motion.div
                        key={idx}
                        variants={itemVariants}
                      >
                        <Card3D className="glass-panel p-6 rounded-2xl border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300 relative group overflow-hidden">
                          <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-purple-500/80 to-cyan-400/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          <div className="flex items-start justify-between gap-4" style={{ transform: 'translateZ(20px)' }}>
                            <div className="space-y-2.5">
                              <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-cyan-400 transition-colors">
                                {proj.title}
                              </h3>
                              {/* Tech Badges */}
                              <div className="flex flex-wrap gap-1.5">
                                {proj.tech.map((t) => (
                                  <span
                                    key={t}
                                    className="font-mono text-[9px] text-cyan-400/90 bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-500/10"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                              <p className="text-xs md:text-sm text-slate-400 font-light leading-relaxed">
                                {proj.description}
                              </p>
                            </div>

                            {proj.githubUrl && (
                              <a
                                href={proj.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-lg hover:scale-105 transition-all"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                          </div>
                        </Card3D>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="education"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-10"
                  >
                    {/* Education Timeline */}
                    <div className="relative border-l border-white/10 pl-6 space-y-8 ml-3">
                      {EDUCATION.map((edu, idx) => (
                        <div key={idx} className="relative space-y-2">
                          {/* Timeline dot */}
                          <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-black border-2 border-purple-500 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <h3 className="text-base font-bold text-white tracking-wide">{edu.degree}</h3>
                              <span className="font-mono text-xs text-slate-400">{edu.institution}</span>
                            </div>
                            <span className="font-mono text-[10px] bg-white/5 border border-white/10 text-slate-300 px-3 py-1 rounded-full">
                              {edu.period} {edu.grade && `| Grade: ${edu.grade}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Achievements List */}
                    <div className="pt-4 space-y-4">
                      <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Trophy size={14} className="text-cyan-400 animate-pulse" />
                        Achievements & Activities
                      </h3>
                      <ul className="space-y-3 pl-1">
                        {ACHIEVEMENTS.map((ach, idx) => (
                          <li key={idx} className="relative pl-5 text-xs md:text-sm text-slate-400 font-light leading-relaxed">
                            <span className="absolute left-0 text-purple-400 select-none">↳</span>
                            {ach}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Right Column: Skill Matrix (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div>
              <span className="font-mono text-xs text-slate-500 uppercase tracking-widest block mb-1">{'// TECHNICAL DIRECTORY'}</span>
              <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider">Skills Directory</h2>
            </div>

            {/* Skills grid list */}
            <div className="space-y-4">
              {SKILL_CATEGORIES.map((cat, idx) => (
                <Card3D
                  key={idx}
                  className="glass-panel p-4 rounded-xl border-white/5 hover:border-white/10 hover:bg-white/[0.01] transition-all duration-300"
                >
                  <div style={{ transform: 'translateZ(15px)' }}>
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-2.5 font-bold">
                      {cat.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map((skill) => (
                        <span
                          key={skill}
                          className="font-mono text-[10px] text-slate-300 bg-white/5 border border-white/5 hover:border-white/10 px-2 py-1 rounded-lg transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card3D>
              ))}
            </div>

            {/* Languages & Interests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Languages */}
              <Card3D className="glass-panel p-4 rounded-xl border-white/5">
                <div style={{ transform: 'translateZ(15px)' }}>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5 font-bold">
                    <Globe size={12} className="text-cyan-400" />
                    Languages
                  </h3>
                  <div className="space-y-2 font-mono text-[10px]">
                    {LANGUAGES.map((lang) => (
                      <div key={lang.name} className="flex justify-between border-b border-white/[0.03] pb-1">
                        <span className="text-slate-300">{lang.name}</span>
                        <span className="text-slate-500">{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card3D>

              {/* Interests */}
              <Card3D className="glass-panel p-4 rounded-xl border-white/5">
                <div style={{ transform: 'translateZ(15px)' }}>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5 font-bold">
                    <Heart size={12} className="text-purple-400" />
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {INTERESTS.map((item) => (
                      <span
                        key={item}
                        className="font-mono text-[9px] text-slate-400 bg-white/5 px-2 py-0.5 rounded"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Card3D>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
