'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const NAV_LINKS = ['Gallery', 'Styles', 'API', 'Pricing', 'Blog'];
const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_080827_a9e5ad52-b6ee-4e79-b393-d936f179cfd7.mp4';

const LogoMark: React.FC = () => (
  <svg width="44" height="26" viewBox="0 0 44 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="3" width="14" height="20" rx="3" fill="white" />
    <rect x="16" y="3" width="12" height="20" rx="3" fill="white" />
    <rect x="30" y="3" width="14" height="20" rx="3" fill="white" />
  </svg>
);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [framesReady, setFramesReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoBgRef = useRef<HTMLDivElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLCanvasElement[]>([]);

  // Effect 0: Mount fade-in trigger
  useEffect(() => {
    setMounted(true);
  }, []);

  // Effect 1: Frame capture (boomerang setup)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let capturing = true;
    let lastTime = -1;
    let callbackId: number = 0;
    let rafId: number = 0;
    const frames: HTMLCanvasElement[] = [];

    const captureFrame = () => {
      if (!capturing) return;
      if (video.readyState < 2) {
        scheduleNext();
        return;
      }
      if (video.currentTime === lastTime) {
        scheduleNext();
        return;
      }
      lastTime = video.currentTime;
      const w = video.videoWidth;
      const h = video.videoHeight;
      const scale = Math.min(1, 960 / w);
      const scaledW = w * scale;
      const scaledH = h * scale;

      const canvas = document.createElement('canvas');
      canvas.width = scaledW;
      canvas.height = scaledH;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, scaledW, scaledH);
        frames.push(canvas);
      }
      scheduleNext();
    };

    const scheduleNext = () => {
      const vid = video as unknown as {
        requestVideoFrameCallback?: (cb: () => void) => number;
        cancelVideoFrameCallback?: (id: number) => void;
      };
      if (typeof vid.requestVideoFrameCallback === 'function') {
        callbackId = vid.requestVideoFrameCallback(captureFrame);
      } else {
        rafId = requestAnimationFrame(captureFrame);
      }
    };

    const onLoaded = () => {
      video.play().catch(() => {});
      scheduleNext();
    };

    const onEnded = () => {
      capturing = false;
      framesRef.current = frames;
      setFramesReady(true);
    };

    video.addEventListener('ended', onEnded);

    if (video.readyState >= 1) {
      onLoaded();
    } else {
      video.addEventListener('loadedmetadata', onLoaded);
    }

    return () => {
      capturing = false;
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('ended', onEnded);
      const vid = video as unknown as {
        requestVideoFrameCallback?: (cb: () => void) => number;
        cancelVideoFrameCallback?: (id: number) => void;
      };
      if (callbackId && typeof vid.cancelVideoFrameCallback === 'function') {
        vid.cancelVideoFrameCallback(callbackId);
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Effect 2: Boomerang render loop
  useEffect(() => {
    if (!framesReady || framesRef.current.length === 0) return;
    const canvas = displayCanvasRef.current;
    if (!canvas) return;

    const frames = framesRef.current;
    canvas.width = frames[0].width;
    canvas.height = frames[0].height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let index = 0;
    let direction = 1;
    let last = performance.now();
    const interval = 1000 / 30; // 30 FPS
    let rafId: number;

    const render = (now: number) => {
      if (now - last >= interval) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(frames[index], 0, 0);

        index += direction;
        if (index >= frames.length - 1) {
          index = frames.length - 1;
          direction = -1;
        } else if (index <= 0) {
          index = 0;
          direction = 1;
        }
        last = now;
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [framesReady]);

  // Effect 3: Parallax mouse tracking (gsap)
  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const strength = 20;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = ((e.clientX - cx) / cx) * strength;
      targetY = ((e.clientY - cy) / cy) * strength;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let rafId: number;
    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      if (videoBgRef.current) {
        gsap.set(videoBgRef.current, { x: currentX, y: currentY });
      }

      rafId = requestAnimationFrame(updateParallax);
    };

    rafId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-body overflow-x-hidden relative">
      {/* 1. Video background layer */}
      <div
        ref={videoBgRef}
        className="fixed top-0 left-0 w-full h-full z-0 scale-[1.08] origin-center pointer-events-none"
      >
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className="w-full h-full object-cover"
          style={{ display: framesReady ? 'none' : 'block' }}
        />
        <canvas
          ref={displayCanvasRef}
          className="w-full h-full object-cover"
          style={{ display: framesReady ? 'block' : 'none' }}
        />
      </div>

      {/* 2. Hero title */}
      <div
        className={`fixed left-0 right-0 z-20 w-full px-4 transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
        style={{ top: '126px' }}
      >
        <h1 className="hero-title select-none">MicroVisuals</h1>
      </div>

      {/* 3. Nav */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap">
        <div className="liquid-glass flex items-center gap-6 rounded px-4 py-2.5">
          <LogoMark />
          <div className="flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm font-body font-light text-white/70 hover:text-white transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3 ml-4">
            <a
              href="#"
              className="text-sm font-body font-light text-white/70 hover:text-white transition-colors duration-200"
            >
              Sign in
            </a>
            <button
              className="liquid-glass-strong text-sm font-body font-medium text-white rounded px-4 py-1.5 transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_16px_2px_rgba(255,255,255,0.12)] active:scale-[0.97]"
            >
              Try it free
            </button>
          </div>
        </div>
      </nav>

      {/* 4. Bottom row */}
      <div
        className={`fixed bottom-12 left-0 right-0 px-10 flex items-end justify-between z-20 transition-all duration-1000 delay-300 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <p className="text-sm font-body font-light text-white/75 max-w-[220px] leading-relaxed">
          Forma&apos;s AI understands context, composition, and style like a creative director would.
        </p>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex items-center gap-3">
          <button
            className="group relative bg-white text-black text-sm font-body font-medium rounded px-6 py-3 overflow-hidden active:scale-[0.97] transition-all duration-200 shadow-[0_0_0_0_rgba(255,255,255,0)] hover:shadow-[0_0_24px_4px_rgba(255,255,255,0.25)] hover:scale-[1.03]"
          >
            <span className="relative z-10">Start generating</span>
            <span className="absolute inset-0 bg-gradient-to-b from-white to-white/85 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>
          <button
            className="liquid-glass group text-white text-sm font-body font-medium rounded px-6 py-3 active:scale-[0.97] transition-all duration-200 hover:scale-[1.03] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_20px_2px_rgba(255,255,255,0.07)]"
          >
            See templates
          </button>
        </div>

        <p className="text-sm font-body font-light text-white/75 max-w-[220px] leading-relaxed text-right">
          Describe what you see in your head — get images that actually match.
        </p>
      </div>
    </div>
  );
}
