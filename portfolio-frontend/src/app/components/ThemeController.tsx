'use client';

import React, { useState } from 'react';
import { useTheme3D } from '../../context/Theme3DContext';
import { Sliders, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemeController: React.FC = () => {
  const {
    colorTheme,
    setColorTheme,
    geometryType,
    setGeometryType,
    rotationSpeed,
    setRotationSpeed,
    motionMode,
    setMotionMode,
  } = useTheme3D();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 font-mono text-[10px] pointer-events-auto">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-72 glass-panel p-5 rounded-2xl border-white/10 shadow-2xl flex flex-col space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase tracking-widest">
                <Sliders size={12} className="animate-pulse" />
                {'// God Mode Panel'}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Collapse dock"
              >
                <Minimize2 size={10} />
              </button>
            </div>

            {/* Shape Morphing Controller */}
            <div className="space-y-1.5">
              <span className="text-slate-500 uppercase tracking-wider block">Geometry morpher:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: 'sphere' as const, label: 'Sphere' },
                  { key: 'cube' as const, label: 'Cube' },
                  { key: 'torus' as const, label: 'Torus' },
                  { key: 'plane' as const, label: 'Plane' },
                ].map((geom) => (
                  <button
                    key={geom.key}
                    onClick={() => setGeometryType(geom.key)}
                    className={`py-1.5 rounded-lg border transition-all text-center ${
                      geometryType === geom.key
                        ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-cyan-500/40 text-cyan-300 font-bold'
                        : 'bg-black/40 border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    {geom.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Glow Waves */}
            <div className="space-y-1.5">
              <span className="text-slate-500 uppercase tracking-wider block">Color wave glow:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'purple-cyan' as const, label: 'Nebula', bg: 'bg-purple-500' },
                  { key: 'emerald' as const, label: 'Aurora', bg: 'bg-emerald-500' },
                  { key: 'sunset' as const, label: 'Solaris', bg: 'bg-amber-500' },
                ].map((theme) => (
                  <button
                    key={theme.key}
                    onClick={() => setColorTheme(theme.key)}
                    className={`py-1.5 rounded-lg border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                      colorTheme === theme.key
                        ? 'bg-white/10 border-white/20 text-white font-bold'
                        : 'bg-black/40 border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${theme.bg}`} />
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>


            {/* Speed Slider */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-slate-500">
                <span className="uppercase tracking-wider">Acceleration multiplier:</span>
                <span className="text-white font-mono">{rotationSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={rotationSpeed}
                onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Extra: Motion Mode Selector */}
            <div className="flex justify-between items-center border-t border-white/5 pt-3">
              <span className="text-slate-500 uppercase tracking-wider">Space Deform:</span>
              <button
                onClick={() => setMotionMode(motionMode === 'orbit' ? 'explode' : 'orbit')}
                className={`px-3 py-1 rounded-lg border font-bold uppercase transition-all ${
                  motionMode === 'explode'
                    ? 'bg-rose-500/20 border-rose-500/30 text-rose-400'
                    : 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                }`}
              >
                {motionMode === 'explode' ? 'Explode' : 'Orbit'}
              </button>
            </div>
          </motion.div>
        ) : (
          /* Small Gear Button to open */
          <motion.button
            key="controls-collapsed"
            layoutId="controls-dock"
            onClick={() => setIsOpen(true)}
            className="p-3 rounded-full glass-panel border-white/10 hover:border-white/20 hover:scale-110 text-cyan-400 hover:text-white transition-all shadow-2xl flex items-center justify-center cursor-pointer bg-white/5"
            title="Configure Background 3D Controls"
          >
            <Sliders size={16} className="animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ThemeController;
