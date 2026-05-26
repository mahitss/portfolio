'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertOctagon, RefreshCw, Home, Terminal } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an analytics service or logger
    console.error('[Error Boundary Caught Exception]:', error);
  }, [error]);

  return (
    <div className="min-h-screen px-6 py-12 relative flex items-center justify-center">
      <div className="max-w-xl w-full glass-panel p-8 rounded-3xl border-rose-500/20 text-center space-y-6 relative overflow-hidden bg-white/5 backdrop-blur-md">
        
        {/* Glow Overlay */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Alarm Icon */}
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/20 shadow-lg animate-pulse">
          <AlertOctagon size={28} className="text-rose-400" />
        </div>

        {/* Warning messages */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] text-rose-400 uppercase tracking-widest block">{'// RUNTIME FAULT DETECTED'}</span>
          <h2 className="text-2xl font-bold text-white">System Component Crashed</h2>
          <p className="text-xs text-slate-400 font-light leading-relaxed max-w-sm mx-auto">
            A critical exception occurred during runtime execution. The active component segment has been isolated to prevent cascade failures.
          </p>
        </div>

        {/* Log details */}
        <div className="text-left font-mono text-[11px] p-4 bg-black/60 border border-white/5 rounded-2xl text-rose-300 leading-relaxed overflow-x-auto relative">
          <div className="flex items-center gap-1.5 text-slate-500 border-b border-white/5 pb-2 mb-2 select-none">
            <Terminal size={12} />
            <span>ERROR_DUMP_STDOUT</span>
          </div>
          <p className="font-bold">{error.name || 'Error'}: {error.message || 'Unknown runtime error'}</p>
          {error.digest && <p className="text-slate-500 mt-1">Digest: {error.digest}</p>}
        </div>

        {/* Control actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 active:scale-[0.99] transition-all shadow-md"
          >
            <RefreshCw size={12} />
            <span>Recompile Component</span>
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            <Home size={12} />
            <span>Return Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
