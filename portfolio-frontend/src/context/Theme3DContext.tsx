'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ColorTheme = 'purple-cyan' | 'emerald' | 'sunset';
type MotionMode = 'orbit' | 'explode';
type GeometryType = 'sphere' | 'cube' | 'torus' | 'plane';
type ApiStatus = 'operational' | 'offline' | 'checking';

interface Theme3DContextProps {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  motionMode: MotionMode;
  setMotionMode: (mode: MotionMode) => void;
  geometryType: GeometryType;
  setGeometryType: (geom: GeometryType) => void;
  rotationSpeed: number;
  setRotationSpeed: (speed: number) => void;
  apiStatus: ApiStatus;
  apiLatency: number | null;
  apiUptime: string | null;
  checkApiStatus: () => Promise<void>;
}

const Theme3DContext = createContext<Theme3DContextProps | undefined>(undefined);

export const Theme3DProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>('purple-cyan');
  const [motionMode, setMotionMode] = useState<MotionMode>('orbit');
  const [geometryType, setGeometryType] = useState<GeometryType>('sphere');
  const [rotationSpeed, setRotationSpeed] = useState<number>(1.0); // Speed multiplier

  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [apiUptime, setApiUptime] = useState<string | null>(null);

  const checkApiStatus = async () => {
    setApiStatus('checking');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const startTime = Date.now();
    try {
      const res = await fetch(`${backendUrl}/api/health`, { cache: 'no-store' });
      const latency = Date.now() - startTime;
      if (res.ok) {
        const data = await res.json();
        setApiStatus('operational');
        setApiLatency(latency);
        
        // Convert uptime seconds to human readable percentage or format
        const uptimeSec = data.uptime || 0;
        const hours = Math.floor(uptimeSec / 3600);
        const mins = Math.floor((uptimeSec % 3600) / 60);
        const secs = Math.floor(uptimeSec % 60);
        setApiUptime(`${hours}h ${mins}m ${secs}s`);
      } else {
        setApiStatus('offline');
        setApiLatency(null);
        setApiUptime(null);
      }
    } catch {
      setApiStatus('offline');
      setApiLatency(null);
      setApiUptime(null);
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
        geometryType,
        setGeometryType,
        rotationSpeed,
        setRotationSpeed,
        apiStatus,
        apiLatency,
        apiUptime,
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
