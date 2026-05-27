import type { Metadata } from 'next';
import { Theme3DProvider } from '../context/Theme3DContext';
import { ClientLayout } from './components/ClientLayout';
import './globals.css';


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
    <html lang="en" className="scroll-smooth">

      <body className="font-sans antialiased text-white bg-black selection:bg-cyan-500/30 selection:text-cyan-200">
        <Theme3DProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Theme3DProvider>
      </body>
    </html>
  );
}
