import React from 'react';
import { motion } from 'framer-motion';

const AmbientLighting = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[3rem] z-0">
      {/* Base removed so it inherits the light/dark mode background cleanly */}
      
      {/* Soft Bottom-Left Cyan Glow */}
      <motion.div 
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-1/4 -left-1/4 w-[80%] h-[80%] bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_60%)] rounded-full blur-3xl transform-gpu"
      />

      {/* Intense Emerald/Teal Neon Glow Top-Right */}
      <motion.div 
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.05, 1] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -top-1/4 -right-1/4 w-[90%] h-[90%] bg-[radial-gradient(circle,rgba(16,185,129,0.2)_0%,transparent_60%)] rounded-full blur-3xl transform-gpu"
      />

      {/* Center Depth Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.05)_0%,transparent_80%)] rounded-full blur-3xl transform-gpu" />

      {/* Hardware Accelerated Bottom Neon Border Strip */}
      <div className="absolute bottom-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_-5px_20px_rgba(16,185,129,0.5)] opacity-60" />
    </div>
  );
};

export default AmbientLighting;
