import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    color: 'blue'
  },
  {
    id: 3,
    name: 'Aiko Tanaka',
    role: 'Software Developer',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiko&backgroundColor=ffdfbf',
    content: 'I love how the AI adapts to my technical vocabulary needs. The writing assistant helped me improve my documentation skills significantly.',
    rating: 5,
    location: 'Japan',
    color: 'purple'
  },
  {
    id: 4,
    name: 'Pavel Ivanov',
    role: 'Marketing Specialist',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pavel&backgroundColor=d1d4f9',
    content: 'The community aspect sets it apart. Connecting with people globally and practicing in rooms has accelerated my progress beyond expectations.',
    rating: 4,
    location: 'Russia',
    color: 'amber'
  },
  {
    id: 5,
    name: 'Lin Wei',
    role: 'Medical Student',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lin&backgroundColor=ffd5dc',
    content: 'As a medical student, I needed specialized vocabulary. The custom modules and AI corrections have been invaluable for my studies.',
    rating: 5,
    location: 'China',
    color: 'teal'
  },
  {
    id: 6,
    name: 'Emma Wilson',
    role: 'Freelance Designer',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=c0aede',
    content: 'The flexibility is amazing. I can practice for 10 minutes between projects. The "Storyteller Maya" persona makes learning actually fun!',
    rating: 5,
    location: 'UK',
    color: 'rose'
  }
];

const TestimonialCard = ({ item }) => {
  return (
    <div className="min-w-[320px] md:min-w-[400px] p-4 select-none">
      <div className={`relative h-full group bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
        {/* Decorative Quote Icon */}
        <div className={`absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity text-${item.color}-500`}>
          <Quote className="w-8 h-8 fill-current" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-0.5 rounded-full bg-gradient-to-br from-${item.color}-400 to-${item.color}-600`}>
            <div className="p-0.5 bg-white dark:bg-slate-900 rounded-full">
              <Avatar className="w-12 h-12">
                <AvatarImage src={item.avatarUrl} alt={item.name} />
                <AvatarFallback>{item.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">{item.name}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">{item.role}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-3.5 h-3.5 ${i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700'}`} 
            />
          ))}
        </div>

        {/* Content */}
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 relative z-10">
          "{item.content}"
        </p>

        {/* Footer */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
          <MapPin className="w-3 h-3" />
          {item.location}
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId;
    
    const scroll = () => {
      if (!isPaused) {
        if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth - scrollContainer.clientWidth)) {
          // Reset to start for infinite loop illusion (requires duplicated content ideally, but simplistic reset here)
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += 1; // Adjust speed here
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>
        <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[40%] right-[10%] w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">
              Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Learners Worldwide</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Join a global community of achievers who are mastering English on their own terms.
            </p>
          </motion.div>
        </div>

        {/* Scrollable Row Container */}
        <div className="relative w-full">
          {/* Gradient Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-20 pointer-events-none"></div>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto no-scrollbar py-4 gap-0 cursor-grab active:cursor-grabbing"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Original List */}
            {testimonials.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
            {/* Duplicated List for Smoother Loop Feel */}
            {testimonials.map((item) => (
              <TestimonialCard key={`dup-${item.id}`} item={item} />
            ))}
          </div>
        </div>

        {/* Smoke Effect Bottom Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10 overflow-hidden">
           {/* Gradient Fade */}
           <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent"></div>
           
           {/* Animated Smoke/Mist Layers */}
           <div className="absolute -bottom-10 left-0 right-0 h-full opacity-30 animate-pulse">
              <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent blur-3xl transform translate-x-[-50%] animate-[drift_20s_linear_infinite]"></div>
           </div>
           <style>{`
             @keyframes drift {
               0% { transform: translateX(-50%); }
               50% { transform: translateX(0%); }
               100% { transform: translateX(-50%); }
             }
           `}</style>
        </div>

        {/* Trust Indicators (Below Smoke) */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-8 pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 relative z-20"
        >
           {/* Placeholder Logos for Social Proof */}
           {['Forbes', 'TechCrunch', 'TheVerge', 'Wired'].map((brand) => (
             <span key={brand} className="text-xl font-bold text-slate-400 dark:text-slate-600 cursor-default">{brand}</span>
           ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Testimonials;