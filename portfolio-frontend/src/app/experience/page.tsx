'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Settings } from 'lucide-react';

interface TimelineItem {
  role: string;
  company: string;
  period: string;
  tags: string[];
  achievements: string[];
}

const EXPERIENCES: TimelineItem[] = [
  {
    role: 'Lead Full-Stack Developer',
    company: 'Quantum Tech Solutions',
    period: '2024 - Present',
    tags: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Docker'],
    achievements: [
      'Architected a decoupled React/Next.js dashboard and Express API server, improving load speeds by 35% through query caching.',
      'Designed and deployed an interactive 3D product visualizer using React Three Fiber, boosting user engagement duration by 45%.',
      'Configured CI/CD automation pipelines utilizing GitHub Actions and Docker, reducing production deployment cycles from hours to minutes.'
    ]
  },
  {
    role: 'Senior Software Engineer (Backend Focus)',
    company: 'Synergy Systems',
    period: '2022 - 2024',
    tags: ['TypeScript', 'Node.js', 'Express', 'MongoDB', 'Redis', 'AWS', 'RESTful APIs'],
    achievements: [
      'Optimized database indexing and Express route handlers, reducing API endpoints latency by 40% under peak simulation loads.',
      'Integrated third-party payment gateways and transactional email engines (Nodemailer/SES) with 99.98% successful dispatch rates.',
      'Mentored 4 junior engineers on backend development standards, clean code practices, and security headers implementation.'
    ]
  },
  {
    role: 'Frontend Engineer',
    company: 'PixelForge Studios',
    period: '2020 - 2022',
    tags: ['React', 'JavaScript', 'Tailwind CSS', 'Framer Motion', 'Redux', 'Git'],
    achievements: [
      'Refactored legacy CSS systems into modular Tailwind components, trimming production bundle size by 28% and ensuring mobile responsive consistency.',
      'Developed 15+ custom React UI components incorporating complex micro-interactions, leading to a 20% increase in layout scroll depth.',
      'Conducted end-to-end browser testing and optimized SEO tags, achieving 98+ scores across all Google Lighthouse metrics.'
    ]
  }
];

const SKILL_CATEGORIES = [
  {
    title: 'Frontend Engine',
    icon: <Code size={16} className="text-purple-400" />,
    skills: ['Next.js', 'React.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Three.js / R3F']
  },
  {
    title: 'Backend & Data',
    icon: <Database size={16} className="text-cyan-400" />,
    skills: ['Node.js', 'Express.js', 'RESTful APIs', 'PostgreSQL', 'MongoDB', 'GraphQL / Redis']
  },
  {
    title: 'DevOps & Tools',
    icon: <Settings size={16} className="text-emerald-400" />,
    skills: ['Git / GitHub', 'Docker', 'Vercel / AWS', 'Linux / Bash', 'Postman', 'Helmet / CORS']
  }
];

export default function Experience() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen px-6 lg:px-16 py-12 relative">
      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Header Title */}
        <div className="mb-16">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-2">{'// PROFESSIONAL HISTORY'}</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Experience & <span className="text-gradient">Skill Matrices</span>
          </h1>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Interactive Timeline (8 Columns) */}
          <motion.div 
            className="lg:col-span-7 space-y-12 relative border-l border-white/10 pl-6 md:pl-8 ml-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {EXPERIENCES.map((exp, idx) => (
              <motion.div 
                key={idx} 
                className="relative space-y-4"
                variants={itemVariants}
              >
                {/* Timeline Dot Indicator */}
                <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 bg-black border-2 border-purple-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide">{exp.role}</h3>
                    <span className="font-mono text-xs text-slate-400">{exp.company}</span>
                  </div>
                  <span className="font-mono text-[10px] bg-white/5 border border-white/10 text-slate-300 px-3 py-1 rounded-full backdrop-blur-md">
                    {exp.period}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {exp.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="font-mono text-[9px] text-cyan-400/90 bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-500/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Achievements List (using X-Y-Z formula) */}
                <ul className="space-y-2 text-xs md:text-sm text-slate-400 font-light leading-relaxed pl-1 list-none">
                  {exp.achievements.map((bullet, bIdx) => (
                    <li key={bIdx} className="relative pl-5">
                      <span className="absolute left-0 text-purple-400 select-none">↳</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column: Skill Matrix Recruiter Checklist (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="mb-4">
              <span className="font-mono text-xs text-slate-500 uppercase tracking-widest block mb-1">{'// TECHNICAL CHECKLIST'}</span>
              <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider">Skills Directory</h2>
            </div>

            {SKILL_CATEGORIES.map((category, catIdx) => (
              <div 
                key={catIdx} 
                className="glass-panel p-5 rounded-2xl border-white/5 hover:border-white/15 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-2.5 mb-4">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-slate-200 font-bold">{category.title}</h3>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {category.skills.map((skill) => (
                    <div 
                      key={skill} 
                      className="flex items-center space-x-2 p-2 rounded-lg bg-black/30 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all duration-300"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span className="font-mono text-[10px] text-slate-300">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Quick Summary stat panel */}
            <div className="glass-panel p-5 rounded-2xl border-white/5 bg-gradient-to-r from-purple-900/10 to-cyan-900/10">
              <h4 className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-2">Architectural Philosophy</h4>
              <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                Prioritizing modular decoupled services, type-safe boundaries, and visual fluid dynamics to maximize customer retention and code maintainability.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
