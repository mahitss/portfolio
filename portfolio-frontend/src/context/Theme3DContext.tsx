'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ColorTheme = 'purple-cyan' | 'emerald' | 'sunset';
type MotionMode = 'orbit' | 'explode';
type ApiStatus = 'operational' | 'offline' | 'checking';

interface Theme3DContextProps {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  motionMode: MotionMode;
  setMotionMode: (mode: MotionMode) => void;
  apiStatus: ApiStatus;
  checkApiStatus: () => Promise<void>;
}

const Theme3DContext = createContext<Theme3DContextProps | undefined>(undefined);

export const Theme3DProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>('purple-cyan');
  const [motionMode, setMotionMode] = useState<MotionMode>('orbit');
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');

  const checkApiStatus = async () => {
    setApiStatus('checking');
    try {
      // Fetch from Express health-check endpoint
      const res = await fetch('http://localhost:5000/health');
      if (res.ok) {
        setApiStatus('operational');
      } else {
        setApiStatus('offline');
      }
    } catch {
      setApiStatus('offline');
    }
  };

  // Run initial API health check
  useEffect(() => {
    checkApiStatus();
    // Re-check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Theme3DContext.Provider
      value={{
        colorTheme,
        setColorTheme,
        motionMode,
        setMotionMode,
        apiStatus,
        checkApiStatus,
      }}
    >
      {children}
    </Theme3DContext.Provider>
  );
};

export const useTheme3D = () => {
  const context = useContext(Theme3DContext);
  if (!context) {
    throw new Error('useTheme3D must be used within a Theme3DProvider');
  }
  return context;
};
