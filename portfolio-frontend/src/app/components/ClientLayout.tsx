'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { ThreeBackground } from './ThreeBackground';
import { ThemeController } from './ThemeController';
import { Loader } from './Loader';

export const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isHeroPage = pathname === '/';

  if (isHeroPage) {
    return <>{children}</>;
  }

  return (
    <>
      {/* WebGL Persistent Background Canvas wrapped in a Suspense boundary */}
      <Suspense fallback={<Loader />}>
        <ThreeBackground />
      </Suspense>

      {/* Core App Layout */}
      <div className="relative min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow relative z-10 w-full">
          {children}
        </main>
        {/* Floating 3D God Mode Controls Dock */}
        <ThemeController />
      </div>
    </>
  );
};

export default ClientLayout;
