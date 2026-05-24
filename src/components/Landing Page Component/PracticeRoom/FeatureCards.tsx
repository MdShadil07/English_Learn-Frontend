import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Video, MessageSquare, Users, Mic, Users2, ShieldCheck, Globe2 } from 'lucide-react';

const VerticalCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="flex items-start gap-4 p-4 rounded-2xl bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 backdrop-blur-md transition-colors cursor-pointer group"
  >
    <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-500/30 transition-colors">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-1 transition-colors">{title}</h4>
      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed transition-colors">{desc}</p>
    </div>
  </motion.div>
);

const HorizontalCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 backdrop-blur-xl hover:border-emerald-300 dark:hover:border-emerald-700/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all group"
  >
    <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h4 className="text-emerald-950 dark:text-emerald-50 font-bold text-sm mb-0.5 transition-colors">{title}</h4>
      <p className="text-emerald-700/80 dark:text-emerald-300/70 text-[11px] leading-tight transition-colors">{desc}</p>
    </div>
  </motion.div>
);

export const LeftFeatureCards = () => {
  const cards = [
    { icon: Globe, title: "Global Peer Learning", desc: "Connect with learners from around the world." },
    { icon: Video, title: "HD Audio & Video", desc: "Crystal clear communication for real conversations." },
    { icon: MessageSquare, title: "Topic-wise Discussions", desc: "Join or create rooms based on topics you care about." },
    { icon: Users, title: "Perfect for Meetings", desc: "Use it for study groups, meetings, or collaborative sessions." }
  ];

  return (
    <div className="flex flex-col gap-3 mt-8">
      {cards.map((card, i) => (
        <VerticalCard key={i} {...card} delay={i * 0.1} />
      ))}
    </div>
  );
};

export const BottomFeatureCards = () => {
  const cards = [
    { icon: Mic, title: "Real-time Speech Practice", desc: "Speak, get feedback, and improve in real-time." },
    { icon: Users2, title: "Small & Large Rooms", desc: "Choose private rooms or join large group sessions." },
    { icon: ShieldCheck, title: "Safe & Friendly Environment", desc: "Moderated spaces to ensure respectful learning." },
    { icon: Globe2, title: "Learn Beyond Borders", desc: "Break language barriers and build global connections." }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full relative z-20">
      {cards.map((card, i) => (
        <HorizontalCard key={i} {...card} delay={i * 0.1 + 0.4} />
      ))}
    </div>
  );
};
