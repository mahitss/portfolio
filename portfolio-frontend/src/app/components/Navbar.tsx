'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme3D } from '../../context/Theme3DContext';
import { Palette, Sparkles, Settings, Github, Linkedin } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { colorTheme, setColorTheme, motionMode, setMotionMode, apiStatus, checkApiStatus } = useTheme3D();
  const [showControls, setShowControls] = useState(false);

  // Helper to determine if a route is active
  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4 select-none">
      <div className="mx-auto max-w-7xl flex items-center justify-between bg-neutral-950/60 backdrop-blur-md rounded-full px-4 py-2.5 border border-white/5 shadow-2xl transition-all duration-300">
        
        {/* Brand logo pill */}
        <Link href="/" className="flex items-center gap-2 bg-neutral-900/40 hover:bg-neutral-800/60 backdrop-blur rounded-full pl-3 pr-4 py-2 border border-white/5 transition-colors group">
          <svg viewBox="0 0 256 256" className="h-4 w-4 fill-white group-hover:rotate-12 transition-transform duration-300">
            <path d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z" />
          </svg>
          <span className="text-white text-xs font-normal tracking-tight lowercase">mahit</span>
        </Link>

        {/* Center Navigation Links - pill style */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-900/40 backdrop-blur rounded-full px-2 py-1.5 border border-white/5">
          {[
            { name: 'home', path: '/' },
            { name: 'experience', path: '/experience' },
            { name: 'certificates', path: '/certificates' },
            { name: 'contact', path: '/contact' },
            { name: 'metrics', path: '/metrics' },
          ].map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`transition-all duration-300 text-xs px-5 py-2 rounded-full lowercase ${
                isActive(link.path)
                  ? 'bg-white text-black font-normal shadow-md'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>


        {/* Right side widgets: Status, Theme Controls, and Links */}
        <div className="flex items-center space-x-2">
          
          {/* Express API System Status Component */}
          <div 
            onClick={checkApiStatus}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/5 cursor-pointer hover:bg-black/60 transition-all duration-300"
            title="Click to re-ping Express backend API"
          >
            <span className={`relative flex h-1.5 w-1.5`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                apiStatus === 'operational' ? 'bg-emerald-400' : apiStatus === 'checking' ? 'bg-amber-400' : 'bg-rose-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                apiStatus === 'operational' ? 'bg-emerald-500' : apiStatus === 'checking' ? 'bg-amber-500' : 'bg-rose-500'
              }`}></span>
            </span>
            <span className="font-mono text-[9px] text-slate-400 select-none hidden lg:inline">
              api: {
                apiStatus === 'operational'
                  ? 'online'
                  : apiStatus === 'checking'
                  ? 'pinging'
                  : 'offline'
              }
            </span>
          </div>

          {/* Toggle Control Panel Button */}
          <button
            onClick={() => setShowControls(!showControls)}
            className={`p-2 rounded-full border transition-all duration-300 ${
              showControls 
                ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Configure Background 3D Theme"
          >
            <Settings size={12} className={showControls ? 'animate-spin' : ''} />
          </button>

          {/* Social Quick Links */}
          <div className="hidden sm:flex items-center space-x-1 border-l border-white/10 pl-2">
            <a
              href="https://github.com/mahitss"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white transition-colors duration-300"
            >
              <Github size={12} />
            </a>
            <a
              href="https://linkedin.com/in/mahit-saxena-74561a377"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white transition-colors duration-300"
            >
              <Linkedin size={12} />
            </a>
          </div>

        </div>
      </div>

      {/* Floating 3D Theme Interactive Controls (Sub-menu) */}
      {showControls && (
        <div className="absolute right-6 mt-2 max-w-sm glass-panel rounded-2xl p-4 shadow-2xl animate-fade-in font-mono text-xs space-y-4">
          <div>
            <h4 className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Palette size={12} />
              Particle Color Palette
            </h4>
            <div className="flex gap-2">
              {[
                { key: 'purple-cyan', label: 'Nebula', classes: 'from-purple-500 to-cyan-400' },
                { key: 'emerald', label: 'Aurora', classes: 'from-emerald-500 to-teal-400' },
                { key: 'sunset', label: 'Solaris', classes: 'from-amber-400 to-rose-500' }
              ].map((theme) => (
                <button
                  key={theme.key}
                  onClick={() => setColorTheme(theme.key as 'purple-cyan' | 'emerald' | 'sunset')}
                  className={`flex-1 px-2.5 py-1.5 rounded-lg border transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    colorTheme === theme.key
                      ? 'bg-white/10 border-white/20 text-white shadow-md'
                      : 'bg-black/30 border-transparent text-slate-400 hover:bg-black/50 hover:text-white'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${theme.classes}`} />
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Sparkles size={12} />
              Deformation Mode
            </h4>
            <div className="flex gap-2">
              {[
                { key: 'orbit', label: 'Morphing Orb' },
                { key: 'explode', label: 'Explode Space' }
              ].map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => setMotionMode(mode.key as 'orbit' | 'explode')}
                  className={`flex-1 py-1.5 rounded-lg border transition-all duration-300 ${
                    motionMode === mode.key
                      ? 'bg-white/10 border-white/20 text-white shadow-md'
                      : 'bg-black/30 border-transparent text-slate-400 hover:bg-black/50 hover:text-white'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[9px] text-slate-500">
            <span>BACKGROUND ENGINE: R3F + DREI</span>
            <span>SHADERS ACTIVE</span>
          </div>
        </div>
      )}

      {/* Mobile navigation row (visible only on small devices) */}
      <div className="md:hidden flex justify-center gap-1 mt-3 px-1 text-[9px] bg-neutral-900/40 backdrop-blur border border-white/5 rounded-full py-1.5 shadow-xl">
        {[
          { name: 'home', path: '/' },
          { name: 'experience', path: '/experience' },
          { name: 'certificates', path: '/certificates' },
          { name: 'contact', path: '/contact' },
          { name: 'metrics', path: '/metrics' },
        ].map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={`flex-1 text-center py-1.5 rounded-full transition-all duration-300 lowercase ${
              isActive(link.path)
                ? 'bg-white text-black font-normal'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

    </header>
  );
};
export default Navbar;
