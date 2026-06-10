'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_063509_7d167302-4fd4-480b-8260-18ab572333d4.mp4';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black select-none">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        autoPlay
        loop
        muted
        playsInline
        src={VIDEO_SRC}
      />

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />

      {/* Floating Pill Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute top-0 left-0 right-0 z-20 px-6 md:px-10 pt-6 flex items-center justify-between gap-4"
      >
        {/* Brand logo pill */}
        <div className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur rounded-full pl-4 pr-6 py-3 border border-white/5">
          <svg viewBox="0 0 256 256" className="h-5 w-5 fill-white">
            <path d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z" />
          </svg>
          <span className="text-white text-sm font-normal tracking-tight lowercase">mahit</span>
        </div>

        {/* Links center pill */}
        <div className="hidden md:flex items-center gap-1 bg-neutral-900/90 backdrop-blur rounded-full px-3 py-2 border border-white/5">
          {[
            { label: 'experience', path: '/experience' },
            { label: 'certificates', path: '/certificates' },
            { label: 'contact', path: '/contact' },
            { label: 'metrics', path: '/metrics' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.path}
              className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full lowercase"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right CTA button */}
        <Link
          href="/contact"
          className="bg-white text-black text-sm font-normal rounded-full px-6 py-3 hover:bg-neutral-200 transition-colors lowercase"
        >
          contact me
        </Link>
      </motion.nav>

      {/* Foreground Interactive Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative h-full w-full z-10 pointer-events-none"
      >
        {/* Giant Staggered Typography Headlines */}
        <motion.h1 
          variants={fadeUp}
          className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] left-4 md:left-10 top-[18%]"
        >
          Build.
        </motion.h1>

        <motion.h1 
          variants={fadeUp}
          className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] right-4 md:right-10 top-[38%]"
        >
          Scale.
        </motion.h1>

        <motion.h1 
          variants={fadeUp}
          className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] left-[18%] md:left-[28%] top-[58%]"
        >
          Automate.
        </motion.h1>

        {/* Description Paragraph */}
        <motion.p 
          variants={fadeUp}
          className="absolute left-6 md:left-10 top-[46%] max-w-[240px] text-[15px] leading-snug text-white/90 pointer-events-auto"
        >
          Building scalable web applications, AI systems, and digital products that deliver performance, reliability, and growth.
        </motion.p>

        {/* Top-Right Stat Block */}
        <motion.div 
          variants={fadeUp}
          className="absolute right-6 md:right-24 top-[14%] flex flex-col items-end"
        >
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight text-white font-mono">5+</span>
          </div>
          <span className="text-xs md:text-sm text-white/70 mt-1 text-right font-mono">Production Projects</span>
        </motion.div>

        {/* Bottom-Left Stat Block */}
        <motion.div 
          variants={fadeUp}
          className="absolute left-6 md:left-20 bottom-20 md:bottom-24 flex flex-col items-start"
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl md:text-5xl font-medium tracking-tight text-white font-mono">7+</span>
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
          </div>
          <span className="text-xs md:text-sm text-white/70 mt-1 font-mono">Certifications</span>
        </motion.div>

        {/* Bottom-Right Stat Block */}
        <motion.div 
          variants={fadeUp}
          className="absolute right-6 md:right-20 bottom-16 md:bottom-20 flex flex-col items-end"
        >
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight text-white font-mono">100%</span>
          </div>
          <span className="text-xs md:text-sm text-white/70 mt-1 text-right font-mono">Type-Safe Code</span>
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black z-10" />
    </section>
  );
}
