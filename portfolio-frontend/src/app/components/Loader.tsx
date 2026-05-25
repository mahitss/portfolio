'use client';

import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
      <div className="relative flex items-center justify-center">
        {/* Spinning Gradient Ring */}
        <div className="w-16 h-16 border-t-2 border-b-2 border-l-2 border-transparent rounded-full animate-spin bg-gradient-to-tr from-purple-500 to-cyan-400 p-[2px]">
          <div className="w-full h-full bg-black rounded-full"></div>
        </div>
        {/* Inner Pulsing Dot */}
        <div className="absolute w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
      </div>
      <p className="mt-6 text-sm font-light tracking-widest text-slate-400 uppercase animate-pulse">
        Initializing 3D Matrix
      </p>
    </div>
  );
};
export default Loader;
