'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointMaterial } from '@react-three/drei';
import { usePathname } from 'next/navigation';
import { useTheme3D } from '../../context/Theme3DContext';
import * as THREE from 'three';

// Subcomponent to render and animate the particles inside the WebGL canvas
const InteractiveScene: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const pathname = usePathname();
  const { colorTheme, motionMode, geometryType, rotationSpeed } = useTheme3D();
  const { viewport } = useThree();

  const particleCount = 2000;

  // 1. Generate Static Positions for all 4 shapes once
  const geometries = useMemo(() => {
    const sphere = new Float32Array(particleCount * 3);
    const cube = new Float32Array(particleCount * 3);
    const torus = new Float32Array(particleCount * 3);
    const plane = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // --- Sphere ---
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = Math.acos(THREE.MathUtils.randFloat(-1, 1));
      const distSphere = THREE.MathUtils.randFloat(1.2, 1.8);
      sphere[i * 3] = distSphere * Math.sin(phi) * Math.cos(theta);
      sphere[i * 3 + 1] = distSphere * Math.sin(phi) * Math.sin(theta);
      sphere[i * 3 + 2] = distSphere * Math.cos(phi);

      // --- Cube ---
      const face = THREE.MathUtils.randInt(1, 6);
      const size = 1.3;
      const r1 = THREE.MathUtils.randFloat(-size, size);
      const r2 = THREE.MathUtils.randFloat(-size, size);
      if (face === 1) { cube[i * 3] = size; cube[i * 3 + 1] = r1; cube[i * 3 + 2] = r2; }
      else if (face === 2) { cube[i * 3] = -size; cube[i * 3 + 1] = r1; cube[i * 3 + 2] = r2; }
      else if (face === 3) { cube[i * 3] = r1; cube[i * 3 + 1] = size; cube[i * 3 + 2] = r2; }
      else if (face === 4) { cube[i * 3] = r1; cube[i * 3 + 1] = -size; cube[i * 3 + 2] = r2; }
      else if (face === 5) { cube[i * 3] = r1; cube[i * 3 + 1] = r2; cube[i * 3 + 2] = size; }
      else { cube[i * 3] = r1; cube[i * 3 + 1] = r2; cube[i * 3 + 2] = -size; }

      // --- Torus ---
      const u = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const v = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const R = 1.2;
      const r = 0.45;
      torus[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
      torus[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
      torus[i * 3 + 2] = r * Math.sin(v);

      // --- Plane ---
      plane[i * 3] = THREE.MathUtils.randFloat(-1.8, 1.8);
      plane[i * 3 + 1] = THREE.MathUtils.randFloat(-1.8, 1.8);
      plane[i * 3 + 2] = THREE.MathUtils.randFloat(-0.25, 0.25);
    }

    return { sphere, cube, torus, plane };
  }, []);

  // 2. Buffer to hold the active rendering positions (starts as sphere)
  const currentPositions = useMemo(() => {
    return new Float32Array(geometries.sphere);
  }, [geometries]);

  // Compute color values based on selected theme
  const particleColors = useMemo(() => {
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      let r = 1, g = 1, b = 1;
      if (colorTheme === 'purple-cyan') {
        const factor = Math.random();
        r = THREE.MathUtils.lerp(0.65, 0.1, factor);
        g = THREE.MathUtils.lerp(0.2, 0.8, factor);
        b = THREE.MathUtils.lerp(0.9, 0.95, factor);
      } else if (colorTheme === 'emerald') {
        const factor = Math.random();
        r = THREE.MathUtils.lerp(0.05, 0.2, factor);
        g = THREE.MathUtils.lerp(0.9, 0.6, factor);
        b = THREE.MathUtils.lerp(0.5, 0.4, factor);
      } else {
        const factor = Math.random();
        r = THREE.MathUtils.lerp(0.95, 0.9, factor);
        g = THREE.MathUtils.lerp(0.6, 0.1, factor);
        b = THREE.MathUtils.lerp(0.15, 0.5, factor);
      }
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }
    return colors;
  }, [colorTheme]);

  // Target spatial states to transition towards based on route
  const layout = useMemo(() => {
    if (pathname === '/') {
      return {
        position: new THREE.Vector3(0, 0, 0),
        scale: 1.3,
        rotationSpeed: 0.15,
      };
    } else if (pathname === '/experience' || pathname === '/certificates') {
      const xOffset = viewport.width > 7 ? 2.2 : 0;
      const yOffset = viewport.width > 7 ? 0 : -1.2;
      return {
        position: new THREE.Vector3(xOffset, yOffset, -0.5),
        scale: 0.75,
        rotationSpeed: 0.05,
      };
    } else if (pathname === '/contact' || pathname === '/metrics') {
      return {
        position: new THREE.Vector3(0, -0.2, -1.5),
        scale: 2.2,
        rotationSpeed: 0.02,
      };
    }
    return {
      position: new THREE.Vector3(0, 0, 0),
      scale: 1.0,
      rotationSpeed: 0.1,
    };
  }, [pathname, viewport.width]);

  // Track cursor position for parallax
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();

    // 1. Lerp layout position and scale towards route targets
    pointsRef.current.position.lerp(layout.position, 0.05);
    
    const isContactOrMetrics = pathname === '/contact' || pathname === '/metrics';
    const pulseFactor = isContactOrMetrics ? Math.sin(time * 1.5) * 0.15 : 0;
    const targetScale = layout.scale + pulseFactor;
    pointsRef.current.scale.setScalar(THREE.MathUtils.lerp(pointsRef.current.scale.x, targetScale, 0.05));

    // 2. Perform rotation and mode-based deformation
    // Multiplied by rotationSpeed modifier (from "God Mode" dock)
    const baseRotationY = time * layout.rotationSpeed * rotationSpeed;
    const parallaxX = mouse.current.x * 0.2;
    const parallaxY = mouse.current.y * 0.2;

    pointsRef.current.rotation.y = baseRotationY + parallaxX;
    pointsRef.current.rotation.x = parallaxY;

    // 3. Select active geometry positions array
    let targetPositions = geometries.sphere;
    if (geometryType === 'cube') targetPositions = geometries.cube;
    else if (geometryType === 'torus') targetPositions = geometries.torus;
    else if (geometryType === 'plane') targetPositions = geometries.plane;

    const geometry = pointsRef.current.geometry;
    const positionAttribute = geometry.attributes.position;
    
    // 4. Smoothly morph (lerp) individual particle positions
    const morphSpeed = 0.06;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      
      // Current particle positions
      let currentX = currentPositions[idx];
      let currentY = currentPositions[idx + 1];
      let currentZ = currentPositions[idx + 2];

      // Target positions from active geometry
      const tx = targetPositions[idx];
      const ty = targetPositions[idx + 1];
      const tz = targetPositions[idx + 2];

      // Interpolate
      currentX += (tx - currentX) * morphSpeed;
      currentY += (ty - currentY) * morphSpeed;
      currentZ += (tz - currentZ) * morphSpeed;

      // Save back to tracking buffer
      currentPositions[idx] = currentX;
      currentPositions[idx + 1] = currentY;
      currentPositions[idx + 2] = currentZ;

      // Add deformation wave if mode is orbit, else blow out if explode
      if (motionMode === 'explode') {
        const explodeFactor = Math.sin(time * 2.0) * 0.4 + 1.2;
        positionAttribute.setX(i, currentX * explodeFactor);
        positionAttribute.setY(i, currentY * explodeFactor);
        positionAttribute.setZ(i, currentZ * explodeFactor);
      } else {
        const pulseSpeed = 1.5;
        const waveAmt = 0.08;
        const factor = Math.sin(currentX * 2 + time * pulseSpeed) * Math.cos(currentY * 2 + time * pulseSpeed) * waveAmt;
        
        positionAttribute.setX(i, currentX + (currentX / 1.5) * factor);
        positionAttribute.setY(i, currentY + (currentY / 1.5) * factor);
        positionAttribute.setZ(i, currentZ + (currentZ / 1.5) * factor);
      }
    }
    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[currentPositions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particleColors, 3]}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        vertexColors
        size={0.035}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const ThreeBackground: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const pathname = usePathname();

  // Record page view on path change
  useEffect(() => {
    const recordPageView = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      try {
        await fetch(`${backendUrl}/api/analytics/pageview`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: pathname }),
        });
      } catch (err) {
        console.warn('[Analytics] Failed to record page view:', err);
      }
    };
    recordPageView();
  }, [pathname]);

  // Viewport breakpoint checker
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  if (isMobile === null) {
    return <div className="fixed inset-0 bg-black z-[-1]" />;
  }

  // Mobile fallback: static radial gradient backdrop instead of WebGL rendering
  if (isMobile) {
    return (
      <div 
        className="fixed inset-0 bg-black z-[-1] transition-all duration-1000"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.05) 50%, rgba(0, 0, 0, 1) 100%)'
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-[-1] overflow-hidden pointer-events-none">
      {/* Soft background ambient gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.85)_100%)] z-[1]" />
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <InteractiveScene />
      </Canvas>
    </div>
  );
};
