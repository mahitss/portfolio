'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Infinity, Menu, X } from 'lucide-react';

const BG_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_230229_7c9bc431-46cf-489a-948d-e8144d8eb5d4.mp4';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/', active: true },
    { label: 'Experience', path: '/experience' },
    { label: 'Certificates', path: '/certificates' },
    { label: 'Metrics', path: '/metrics', dropdown: true }
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background looping video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        src={BG_VIDEO}
      />

      {/* Background dim overlay for text readability */}
      <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 sm:px-8 py-5">
        {/* Logo (left) */}
        <Link href="/" className="flex items-center gap-2 text-white font-medium text-base z-30">
          <Infinity size={22} strokeWidth={1.5} />
          <span>MAHIT</span>
        </Link>

        {/* Nav pill (center) */}
        <div className="liquid-glass hidden md:flex items-center gap-1 rounded-xl px-2 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.path}
              className={`flex items-center gap-0.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                link.active
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span>{link.label}</span>
              {link.dropdown && <ChevronDown size={13} className="mt-px" />}
            </Link>
          ))}
        </div>

        {/* CTAs (right) */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/mahitss"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass text-white text-sm font-medium px-4 py-2.5 rounded-full hover:bg-white/5 transition-colors"
          >
            GitHub
          </a>
          <Link
            href="/contact"
            className="bg-white text-black text-sm font-medium px-4 py-2.5 rounded-full hover:bg-white/90 transition-colors"
          >
            Contact Me
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="liquid-glass text-white p-2 rounded-lg md:hidden z-30"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-[72px] left-4 right-4 z-30 md:hidden liquid-glass rounded-2xl p-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm transition-colors ${
                link.active
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{link.label}</span>
              {link.dropdown && <ChevronDown size={13} />}
            </Link>
          ))}

          {/* Mobile CTA row */}
          <div className="flex gap-2 mt-2 pt-3 border-t border-white/10">
            <a
              href="https://github.com/mahitss"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center liquid-glass text-white text-sm font-medium px-4 py-2.5 rounded-full hover:bg-white/5 transition-colors"
            >
              GitHub
            </a>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center bg-white text-black text-sm font-medium px-4 py-2.5 rounded-full hover:bg-white/90 transition-colors"
            >
              Contact Me
            </Link>
          </div>
        </div>
      )}

      {/* Hero content (bottom-left) */}
      <div className="absolute bottom-0 left-0 z-20 px-6 sm:px-12 pb-10 sm:pb-16 max-w-2xl">
        <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight tracking-tight mb-4">
          Engineering Systems from Pixel to Database
        </h1>
        <p className="text-white/60 text-sm leading-relaxed mb-7 max-w-md">
          Crafting high-performance web applications, interactive 3D WebGL interfaces, and secure API servers. Designed with premium aesthetics and engineered for full-stack reliability.
        </p>

        {/* Buttons row */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/experience"
            className="bg-white text-black text-sm sm:text-base font-medium px-6 sm:px-7 py-3 rounded-full hover:bg-white/90 transition-colors inline-block"
          >
            Explore Experience
          </Link>
          <Link
            href="/certificates"
            className="liquid-glass text-white text-sm sm:text-base font-medium px-6 sm:px-7 py-3 rounded-full hover:bg-white/5 transition-colors inline-block"
          >
            View Credentials
          </Link>
        </div>
      </div>
    </div>
  );
}
