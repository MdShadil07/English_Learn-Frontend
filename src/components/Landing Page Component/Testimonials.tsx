import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, MapPin, Sparkles } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Business Professional',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=c0aede',
    content: 'CognitoSpeak transformed my business English skills in just 3 months. The AI conversation practice gave me the confidence to lead international meetings.',
    rating: 5,
    location: 'Germany',
    color: 'emerald'
  },
  {
    id: 2,
    name: 'Miguel Rodriguez',
    role: 'University Student',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel&backgroundColor=b6e3f4',
    content: 'The pronunciation coach feature is a game-changer. I finally mastered sounds I struggled with for years. My professors noticed the improvement immediately!',
    rating: 5,
    location: 'Spain',
    color: 'cyan'
  },
  {
    id: 3,
    name: 'Aiko Tanaka',
    role: 'Software Developer',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiko&backgroundColor=ffdfbf',
    content: 'I love how the AI adapts to my technical vocabulary needs. The writing assistant helped me improve my documentation skills significantly.',
    rating: 5,
    location: 'Japan',
    color: 'teal'
  },
  {
    id: 4,
    name: 'Pavel Ivanov',
    role: 'Marketing Specialist',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pavel&backgroundColor=d1d4f9',
    content: 'The community aspect sets it apart. Connecting with people globally and practicing in rooms has accelerated my progress beyond expectations.',
    rating: 4,
    location: 'Russia',
    color: 'blue'
  },
  {
    id: 5,
    name: 'Lin Wei',
    role: 'Medical Student',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lin&backgroundColor=ffd5dc',
    content: 'As a medical student, I needed specialized vocabulary. The custom modules and AI corrections have been invaluable for my studies.',
    rating: 5,
    location: 'China',
    color: 'emerald'
  },
  {
    id: 6,
    name: 'Emma Wilson',
    role: 'Freelance Designer',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=c0aede',
    content: 'The flexibility is amazing. I can practice for 10 minutes between projects. The "Storyteller Maya" persona makes learning actually fun!',
    rating: 5,
    location: 'UK',
    color: 'teal'
  }
];

const TestimonialCard = ({ item }) => {
  return (
    <div className="w-[320px] md:w-[400px] flex-shrink-0 p-4 select-none">
      <div className="relative h-full group bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-slate-200/20 dark:shadow-none hover:border-teal-300 dark:hover:border-teal-700/50 hover:bg-white dark:hover:bg-slate-800/80 transition-all duration-300">
        
        {/* Subtle Inner Glow on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300 pointer-events-none"></div>

        {/* Decorative Quote Icon */}
        <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-30 group-hover:-translate-y-1 transition-all duration-300 text-teal-500 dark:text-teal-400">
          <Quote className="w-10 h-10 fill-current" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-teal-400 blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-800 bg-gradient-to-br from-teal-400 to-emerald-400 p-[2px] shadow-md relative z-10 transform transition-transform group-hover:scale-105 group-hover:rotate-3">
              <img 
                src={item.avatarUrl} 
                alt={item.name} 
                className="w-full h-full rounded-full object-cover bg-white dark:bg-slate-900"
                crossOrigin="anonymous"
              />
            </div>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">{item.name}</h4>
            <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mt-0.5">{item.role}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex mb-4 relative z-10">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 mr-1 ${i < item.rating ? 'text-amber-400 fill-amber-400 drop-shadow-sm' : 'text-slate-200 dark:text-slate-700'}`} 
            />
          ))}
        </div>

        {/* Content */}
        <p className="text-slate-600 dark:text-slate-300 text-[15px] font-medium leading-relaxed mb-6 relative z-10">
          "{item.content}"
        </p>

        {/* Footer Location Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 relative z-10 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
          <MapPin className="w-3.5 h-3.5" />
          {item.location}
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // We duplicate the array to create a seamless infinite CSS scrolling effect
  const doubledTestimonials = [...testimonials, ...testimonials];

  if (!isMounted) return null;

  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-[#f8fbff] dark:bg-slate-950 relative overflow-hidden transition-colors duration-500 font-sans">
      
      {/* --- Optimized Background Elements (No CSS Blurs) --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-[10%] left-[20%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.06)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(20,184,166,0.04)_0%,transparent_60%)]" style={{ transform: 'translateZ(0)' }}></div>
        <div className="absolute bottom-[20%] right-[10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(6,182,212,0.04)_0%,transparent_60%)]" style={{ transform: 'translateZ(0)' }}></div>
      </div>

      <div className="w-full relative z-10">
        
        {/* Header */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 shadow-sm backdrop-blur-sm transition-colors duration-500">
              <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 tracking-tight">Wall of Love</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-[#0f172a] dark:text-white tracking-tight leading-[1.1]">
              Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500 pb-2">Learners Worldwide</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
              Join a global community of achievers who are mastering English on their own terms. See what they have to say.
            </p>
          </motion.div>
        </div>

        {/* --- Pure CSS Hardware-Accelerated Marquee --- */}
        <div className="relative w-full overflow-hidden flex py-4">
          
          {/* Gradient Fade Masks for seamless entering/exiting (Optimized) */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#f8fbff] dark:from-slate-950 to-transparent z-20 pointer-events-none transition-colors duration-500"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#f8fbff] dark:from-slate-950 to-transparent z-20 pointer-events-none transition-colors duration-500"></div>

          {/* Marquee Track */}
          <div className="flex animate-marquee hover:[animation-play-state:paused]">
            {/* Render duplicated list for infinite loop */}
            {doubledTestimonials.map((item, idx) => (
              <TestimonialCard key={`${item.id}-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* Global Styles for Infinite Marquee */}
        <style>{`
          .animate-marquee {
            /* Width calculation: Card Width (400px on desktop) * Original Array Length (6) = 2400px. 
               We translate by exactly half the total width of the doubled array. */
            animation: scroll 40s linear infinite;
            /* Force hardware acceleration */
            transform: translateZ(0); 
            will-change: transform;
          }

          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          
          /* Adjust for mobile card width (320px) */
          @media (max-width: 768px) {
            .animate-marquee {
               animation-duration: 30s;
            }
          }
        `}</style>

        {/* Trust Indicators (Logos) */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          viewport={{ once: true }}
          className="mt-12 pt-12 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap justify-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 relative z-20 max-w-[1440px] mx-auto px-6"
        >
           {/* High-end typography for placeholder logos */}
           {['Forbes', 'TechCrunch', 'TheVerge', 'Wired', 'Bloomberg'].map((brand) => (
             <span key={brand} className="text-xl md:text-2xl font-black tracking-tighter text-slate-800 dark:text-slate-300 cursor-default select-none transition-colors">
               {brand}
             </span>
           ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Testimonials;