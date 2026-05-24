import React from 'react';
import { motion } from 'framer-motion';
import { Maximize } from 'lucide-react';
import { LeftFeatureCards } from './FeatureCards';

const LeftContent = () => {
  return (
    <div className="flex flex-col z-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-semibold text-slate-300 uppercase tracking-widest w-max mb-6"
      >
        <Maximize className="w-3.5 h-3.5" />
        Practice Room
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        viewport={{ once: true }}
        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6"
      >
        <span className="text-indigo-400">Practice.</span> Connect.<br />
        Grow Together.
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
        className="text-lg text-slate-400 leading-relaxed max-w-lg mb-4"
      >
        Step into our 3D Practice Room and experience real conversations with global learners. Practice speaking, discuss topics, or meet new peers—face to face.
      </motion.p>

      <LeftFeatureCards />
    </div>
  );
};

export default LeftContent;
