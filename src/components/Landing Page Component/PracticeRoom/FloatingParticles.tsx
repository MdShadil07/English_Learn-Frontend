import React from 'react';
import { motion } from 'framer-motion';

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
};

const FloatingParticles = ({ particles }: { particles?: Particle[] }) => {
  const resolvedParticles = particles ?? Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[3rem]">
      {resolvedParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white transform-gpu will-change-transform"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: 0.1 + Math.random() * 0.3,
            boxShadow: `0 0 ${particle.size * 2}px rgba(255,255,255,0.8)`
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.1, 0.6, 0.1]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
