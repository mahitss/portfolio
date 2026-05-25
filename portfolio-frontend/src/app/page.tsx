'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Terminal } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // Custom cubic bezier for smooth premium feel
      },
    },
  };

  const tickerItems = [
    'Next.js 14', 'TypeScript', 'Node.js', 'Express.js', 
    'React Three Fiber', 'Three.js', 'Tailwind CSS', 'Framer Motion', 
    'PostgreSQL', 'Docker', 'RESTful APIs', 'Nodemailer'
  ];

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col justify-center px-6 lg:px-16 py-12 relative overflow-hidden">
      
      {/* Decorative subtle ambient lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none pulse-glow" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Typography & CTAs */}
        <motion.div 
          className="lg:col-span-7 flex flex-col space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Subtle Tag */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-md"
          >
            <Terminal size={12} className="text-cyan-400" />
            <span className="font-mono text-[10px] tracking-wider uppercase text-slate-300">
              System Architect & Full-Stack Engineer
            </span>
          </motion.div>

          {/* Heading Hook Line */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            Building <span className="text-gradient">high-performance</span> web applications from pixel to database.
          </motion.h1>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-base md:text-lg text-slate-400 font-light max-w-xl leading-relaxed"
          >
            Specializing in building real-time decoupled architectures, 3D WebGL interfaces, and secure API servers that combine rich aesthetics with reliable engineering.
          </motion.p>

          {/* Call to Actions */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <Link href="/experience">
              <span className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 p-[1px] inline-block font-mono text-xs font-semibold cursor-pointer shadow-lg hover:shadow-cyan-500/15 transition-all duration-300">
                <span className="flex items-center space-x-2 px-6 py-3 rounded-[11px] bg-black text-white hover:bg-transparent transition-colors duration-300">
                  <span>Explore Experience</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </span>
            </Link>
            <Link href="/contact">
              <span className="px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white font-mono text-xs font-semibold cursor-pointer backdrop-blur-md transition-all duration-300">
                Let&apos;s Connect
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column: Spacer to allow the persistent 3D Canvas element to be primary on desktop */}
        <div className="lg:col-span-5 h-[300px] lg:h-[500px] pointer-events-none select-none flex items-center justify-center">
          {/* Mobile indicator layout overlay */}
          <div className="block lg:hidden w-full max-w-sm glass-panel p-6 rounded-2xl border-white/10 text-center pointer-events-auto">
            <Cpu className="mx-auto text-purple-400 mb-3 animate-pulse" size={24} />
            <p className="font-mono text-xs text-slate-400">
              Interactive 3D Engine running. Swipe routes to see it transform, or use settings to adjust configurations.
            </p>
          </div>
        </div>

      </div>

      {/* Tech Stack Ticker (Infinite horizontal scroll) */}
      <div className="mt-auto pt-16 relative z-10 w-full overflow-hidden select-none">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />
        
        <div className="flex w-[200%] gap-6 py-4 border-y border-white/5 bg-white/[0.01] backdrop-blur-[2px]">
          <div className="flex animate-marquee gap-16 shrink-0 justify-around min-w-full font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
            {tickerItems.map((tech, idx) => (
              <span key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50"></span>
                {tech}
              </span>
            ))}
          </div>
          {/* Duplicate loop to support infinite scroll seamlessly */}
          <div className="flex animate-marquee gap-16 shrink-0 justify-around min-w-full font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
            {tickerItems.map((tech, idx) => (
              <span key={`dup-${idx}`} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50"></span>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
