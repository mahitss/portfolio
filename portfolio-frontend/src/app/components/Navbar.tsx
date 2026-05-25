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
    <header className="sticky top-0 z-50 w-full px-6 py-4">
      <div className="mx-auto max-w-7xl flex items-center justify-between glass-panel rounded-2xl px-6 py-3 transition-all duration-300">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full group-hover:scale-125 transition-transform duration-300 animate-pulse"></div>
          <span className="font-mono text-sm font-bold tracking-[0.25em] text-white">
            SNEHA<span className="text-cyan-400">.</span>DEV
          </span>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 font-mono text-xs">
          {[
            { name: 'Home', path: '/' },
            { name: 'Experience', path: '/experience' },
            { name: 'Certificates', path: '/certificates' },
            { name: 'Contact', path: '/contact' },
          ].map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive(link.path)
                  ? 'bg-white/10 text-white border border-white/10 shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right side widgets: Status, Theme Controls, and Links */}
        <div className="flex items-center space-x-3">
          
          {/* Express API System Status Component */}
          <div 
            onClick={checkApiStatus}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/5 cursor-pointer hover:bg-black/60 transition-all duration-300"
            title="Click to re-ping Express backend API"
          >
            <span className={`relative flex h-2 w-2`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                apiStatus === 'operational' ? 'bg-emerald-400' : apiStatus === 'checking' ? 'bg-amber-400' : 'bg-rose-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                apiStatus === 'operational' ? 'bg-emerald-500' : apiStatus === 'checking' ? 'bg-amber-500' : 'bg-rose-500'
              }`}></span>
            </span>
            <span className="font-mono text-[10px] text-slate-400 select-none hidden lg:inline">
              Express API: {apiStatus === 'operational' ? 'Operational' : apiStatus === 'checking' ? 'Checking...' : 'Offline'}
            </span>
          </div>

          {/* Toggle Control Panel Button */}
          <button
            onClick={() => setShowControls(!showControls)}
            className={`p-2 rounded-xl border transition-all duration-300 ${
              showControls 
                ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Configure Background 3D Theme"
          >
            <Settings size={16} className={showControls ? 'animate-spin' : ''} />
          </button>

          {/* Social Quick Links */}
          <div className="hidden sm:flex items-center space-x-2 border-l border-white/10 pl-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white transition-colors duration-300"
            >
              <Github size={16} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white transition-colors duration-300"
            >
              <Linkedin size={16} />
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
      <div className="md:hidden flex justify-center gap-1.5 mt-3 px-2 font-mono text-[10px]">
        {[
          { name: 'Home', path: '/' },
          { name: 'Experience', path: '/experience' },
          { name: 'Certificates', path: '/certificates' },
          { name: 'Contact', path: '/contact' },
        ].map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={`flex-1 text-center py-2 rounded-lg transition-all duration-300 ${
              isActive(link.path)
                ? 'bg-white/10 text-white border border-white/10'
                : 'text-slate-400 hover:text-white bg-black/20 border border-white/5'
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
