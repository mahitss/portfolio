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
  const { colorTheme, motionMode } = useTheme3D();
  const { viewport } = useThree();

  const particleCount = 2000;

  // Generate initial particle positions (spherical distribution)
  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = Math.acos(THREE.MathUtils.randFloat(-1, 1));
      const distance = THREE.MathUtils.randFloat(1.2, 1.8);

      arr[i * 3] = distance * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = distance * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = distance * Math.cos(phi);
    }
    return arr;
  }, []);

  // Compute color values based on selected theme
  const particleColors = useMemo(() => {
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      let r = 1, g = 1, b = 1;
      if (colorTheme === 'purple-cyan') {
        // Blends between bright purple and cyan
        const factor = Math.random();
        r = THREE.MathUtils.lerp(0.65, 0.1, factor);
        g = THREE.MathUtils.lerp(0.2, 0.8, factor);
        b = THREE.MathUtils.lerp(0.9, 0.95, factor);
      } else if (colorTheme === 'emerald') {
        // Blends between mint green and deep emerald
        const factor = Math.random();
        r = THREE.MathUtils.lerp(0.05, 0.2, factor);
        g = THREE.MathUtils.lerp(0.9, 0.6, factor);
        b = THREE.MathUtils.lerp(0.5, 0.4, factor);
      } else {
        // Sunset: Orange/Gold to magenta
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

  // Target spatial states to transition towards
  const layout = useMemo(() => {
    // Dynamic positions based on current path
    if (pathname === '/') {
      return {
        position: new THREE.Vector3(0, 0, 0),
        scale: 1.3,
        rotationSpeed: 0.15,
      };
    } else if (pathname === '/experience' || pathname === '/certificates') {
      // Scale down and shift to the right hemisphere
      const xOffset = viewport.width > 7 ? 2.2 : 0; // Center if small screen but not mobile
      const yOffset = viewport.width > 7 ? 0 : -1.2;
      return {
        position: new THREE.Vector3(xOffset, yOffset, -0.5),
        scale: 0.75,
        rotationSpeed: 0.05,
      };
    } else if (pathname === '/contact') {
      // Scale up, push back, slow ambient glow
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

    // 1. Lerp position and scale towards route targets
    pointsRef.current.position.lerp(layout.position, 0.05);
    
    // Ambient pulsation scale modifier for contact page, standard lerp for others
    const pulseFactor = pathname === '/contact' ? Math.sin(time * 1.5) * 0.15 : 0;
    const targetScale = layout.scale + pulseFactor;
    pointsRef.current.scale.setScalar(THREE.MathUtils.lerp(pointsRef.current.scale.x, targetScale, 0.05));

    // 2. Perform rotation and mode-based deformation
    const baseRotationY = time * layout.rotationSpeed;
    const parallaxX = mouse.current.x * 0.2;
    const parallaxY = mouse.current.y * 0.2;

    pointsRef.current.rotation.y = baseRotationY + parallaxX;
    pointsRef.current.rotation.x = parallaxY;

    // Explode vs Orbit animation behavior
    const geometry = pointsRef.current.geometry;
    const positionAttribute = geometry.attributes.position;
    const originalPos = positions;

    if (motionMode === 'explode') {
      // Push particles outward dynamically based on time-sine wave
      const explodeFactor = Math.sin(time * 2.0) * 0.4 + 1.2;
      for (let i = 0; i < particleCount; i++) {
        positionAttribute.setX(i, originalPos[i * 3] * explodeFactor);
        positionAttribute.setY(i, originalPos[i * 3 + 1] * explodeFactor);
        positionAttribute.setZ(i, originalPos[i * 3 + 2] * explodeFactor);
      }
    } else {
      // Standard morphing orb deformation
      const pulseSpeed = 1.5;
      const waveAmt = 0.08;
      for (let i = 0; i < particleCount; i++) {
        const x = originalPos[i * 3];
        const y = originalPos[i * 3 + 1];
        const z = originalPos[i * 3 + 2];

        // Complex noise simulation
        const factor = Math.sin(x * 2 + time * pulseSpeed) * Math.cos(y * 2 + time * pulseSpeed) * waveAmt;
        positionAttribute.setX(i, x + (x / 1.5) * factor);
        positionAttribute.setY(i, y + (y / 1.5) * factor);
        positionAttribute.setZ(i, z + (z / 1.5) * factor);
      }
    }
    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
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
