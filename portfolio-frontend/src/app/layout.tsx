import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import { Suspense } from 'react';
import { Theme3DProvider } from '../context/Theme3DContext';
import { ThreeBackground } from './components/ThreeBackground';
import { Navbar } from './components/Navbar';
import { Loader } from './components/Loader';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mahit // Portfolio Engine',
  description: 'Full-stack portfolio engineered with Next.js, Express, TypeScript, and interactive React Three Fiber.',
  keywords: ['Full-stack developer', 'WebGL', 'Three.js', 'Next.js', 'Express', 'React Three Fiber', 'TypeScript'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-white bg-black selection:bg-cyan-500/30 selection:text-cyan-200">
        <Theme3DProvider>
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
          </div>
        </Theme3DProvider>
      </body>
    </html>
  );
}
