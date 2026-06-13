'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from 'framer-motion';

interface Card3DProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  maxTilt?: number; // Maximum rotation in degrees (default: 8)
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  maxTilt = 8,
  style = {},
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for normalized cursor coordinates (0 to 1)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth springs to animate the rotation angles nicely
  const rotateX = useSpring(useTransform(y, [0, 1], [maxTilt, -maxTilt]), {
    damping: 30,
    stiffness: 200,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxTilt, maxTilt]), {
    damping: 30,
    stiffness: 200,
  });

  // Motion values for custom cursor-following shine effect (in pixels)
  const shineX = useMotionValue(0);
  const shineY = useMotionValue(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    const normalizedX = (event.clientX - rect.left) / rect.width;
    const normalizedY = (event.clientY - rect.top) / rect.height;
    
    x.set(normalizedX);
    y.set(normalizedY);

    const pxX = event.clientX - rect.left;
    const pxY = event.clientY - rect.top;
    
    shineX.set(pxX);
    shineY.set(pxY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5); // Reset back to center
    y.set(0.5);
  };

  // Create a moving gradient background for the glossy shine
  const shineBackground = useTransform(
    [shineX, shineY],
    ([cx, cy]) =>
      `radial-gradient(circle 200px at ${cx}px ${cy}px, rgba(255, 255, 255, 0.06), transparent 75%)`
  );

  return (
    <motion.div
      ref={cardRef}
      {...props}
      onMouseMove={(e) => {
        handleMouseMove(e);
        props.onMouseMove?.(e);
      }}
      onMouseEnter={(e) => {
        handleMouseEnter();
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        handleMouseLeave();
        props.onMouseLeave?.(e);
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
        ...style,
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Glossy mouse-following shine overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
        style={{
          background: shineBackground,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {children}
    </motion.div>
  );
};

export default Card3D;
