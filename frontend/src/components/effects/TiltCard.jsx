import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * 3D Parallax Tilt & Magnetic Hover Card with dynamic cursor-following radial glow
 * Implements CSS 3D perspective and Framer Motion spring physics.
 */
export default function TiltCard({
  children,
  className = '',
  maxTilt = 7, // Maximum tilt in degrees
  perspective = 1000,
  glowColor = 'emerald', // 'emerald' | 'amber' | 'cyan' | 'purple'
  onClick,
  ...props
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position normalized between -0.5 and 0.5
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Absolute cursor coordinates within the card for radial glow
  const glowX = useMotionValue(-500);
  const glowY = useMotionValue(-500);

  // Spring physics for buttery-smooth tilt interpolation
  const springX = useSpring(x, { stiffness: 220, damping: 22 });
  const springY = useSpring(y, { stiffness: 220, damping: 22 });

  // Map normalized mouse coordinates to 3D rotation angles
  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Relative mouse position within card
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    glowX.set(mouseX);
    glowY.set(mouseY);

    // Normalized between -0.5 and 0.5
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly return card to neutral resting position
    x.set(0);
    y.set(0);
    glowX.set(-500);
    glowY.set(-500);
  };

  // Color options for the radial specular spotlight
  const glowMap = {
    emerald: 'rgba(16, 185, 129, 0.22)',
    amber: 'rgba(245, 158, 11, 0.22)',
    cyan: 'rgba(6, 182, 212, 0.22)',
    purple: 'rgba(139, 92, 246, 0.22)',
  };

  const activeGlowRgba = glowMap[glowColor] || glowMap.emerald;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ perspective: `${perspective}px` }}
      className={`relative ${className}`}
      {...props}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full relative"
      >
        {/* Soft cursor-following specular radial glow overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[inherit] z-20 overflow-hidden transition-opacity duration-500"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          <motion.div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              left: glowX,
              top: glowY,
              width: '420px',
              height: '420px',
              background: `radial-gradient(circle closest-side, ${activeGlowRgba}, transparent 80%)`,
            }}
          />
        </motion.div>

        {/* Card Content with 3D Depth */}
        {children}
      </motion.div>
    </div>
  );
}
