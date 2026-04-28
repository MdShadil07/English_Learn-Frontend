import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smile, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- HIGH-FIDELITY EMOJI DATA (Microsoft Fluent 3D Emojis) ---
const BASE_URL = "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis";

// Curated list of top reactions for the compact picker
const QUICK_REACTIONS = [
  { id: 'heart', name: 'Love', src: `${BASE_URL}/Smilies/Red%20Heart.png` },
  { id: 'thumbs_up', name: 'Thumbs Up', src: `${BASE_URL}/Hand%20gestures/Thumbs%20Up%20Medium-Light%20Skin%20Tone.png` },
  { id: 'tada', name: 'Celebrate', src: `${BASE_URL}/Activities/Party%20Popper.png` },
  { id: 'joy', name: 'Haha', src: `${BASE_URL}/Smilies/Face%20with%20Tears%20of%20Joy.png` },
  { id: 'clap', name: 'Clap', src: `${BASE_URL}/Hand%20gestures/Clapping%20Hands%20Medium-Light%20Skin%20Tone.png` },
  { id: 'raise_hand', name: 'Raise Hand', src: `${BASE_URL}/Hand%20gestures/Raising%20Hand%20Medium-Light%20Skin%20Tone.png` },
  { id: 'fire', name: 'Fire', src: `${BASE_URL}/Travel%20and%20places/Fire.png` },
  { id: 'star_struck', name: 'Wow', src: `${BASE_URL}/Smilies/Star-Struck.png` },
  { id: '100', name: '100%', src: `${BASE_URL}/Symbols/Hundred%20Points.png` },
  { id: 'mind_blown', name: 'Mind Blown', src: `${BASE_URL}/Smilies/Exploding%20Head.png` },
  { id: 'pray', name: 'Thanks', src: `${BASE_URL}/Hand%20gestures/Folded%20Hands%20Medium-Light%20Skin%20Tone.png` },
  { id: 'thumbs_down', name: 'Thumbs Down', src: `${BASE_URL}/Hand%20gestures/Thumbs%20Down%20Medium-Light%20Skin%20Tone.png` },
  { id: 'rocket', name: 'Rocket', src: `${BASE_URL}/Travel%20and%20places/Rocket.png` },
  { id: 'thinking', name: 'Thinking', src: `${BASE_URL}/Smilies/Thinking%20Face.png` },
  { id: 'sweat_smile', name: 'Phew', src: `${BASE_URL}/Smilies/Smiling%20Face%20with%20Tear.png` },
  { id: 'check_mark', name: 'Correct', src: `${BASE_URL}/Symbols/Check%20Mark%20Button.png` },
];

// --- 1. The Floating Reaction Animation ---
const FloatingReaction = ({ id, src, onComplete }) => {
  const randomX = (Math.random() - 0.5) * 60;
  const randomRotate = (Math.random() - 0.5) * 40;
  const scaleStart = Math.random() * 0.3 + 0.8; // 0.8 to 1.1

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, x: 0, scale: scaleStart, rotate: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        y: -150 - Math.random() * 100, 
        x: randomX,
        rotate: randomRotate,
        scale: [scaleStart, scaleStart * 1.5, scaleStart * 1.2]
      }}
      transition={{ duration: 2.2, ease: "easeOut" }}
      onAnimationComplete={() => onComplete(id)}
      className="absolute bottom-16 pointer-events-none z-50"
    >
      <img src={src} alt="reaction" className="w-14 h-14 object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)]" />
    </motion.div>
  );
};

// --- 2. The Compact Horizontal Popover ---
export const EmojiSelectorPopover = ({ 
  isOpen, 
  onClose, 
  onSelect,
  className 
}) => {
  const scrollContainerRef = useRef(null);
  
  const [hoveredEmoji, setHoveredEmoji] = useState(null);
  
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Handle Scroll Buttons
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [isOpen]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      setTimeout(checkScroll, 350); // Re-check after animation
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10, transformOrigin: 'bottom center' }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={cn(
            "fixed bottom-20 inset-x-0 ml-4 sm:absolute sm:bottom-[calc(100%+12px)] sm:inset-x-auto sm:ml-0 sm:left-0 w-[calc(100vw-32px)] max-w-[420px]",
            "bg-[#1A1A1A]/85 backdrop-blur-2xl rounded-2xl sm:rounded-[24px] border border-white/10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] z-50 flex items-center p-1.5",
            className
          )}
        >
          <div className="relative z-10 flex items-center w-full h-12 sm:h-14">
             
             {/* Tooltip for Hovered Emoji */}
             <div className="absolute -top-10 inset-x-0 flex justify-center pointer-events-none z-20 h-0">
                <AnimatePresence>
                  {hoveredEmoji && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.9 }}
                      className="bg-slate-800/95 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl border border-white/10 whitespace-nowrap"
                    >
                      {hoveredEmoji}
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             {/* Left Scroll Arrow */}
             {canScrollLeft && (
               <motion.button 
                 initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                 onClick={(e) => { e.stopPropagation(); scroll('left'); }}
                 className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors mr-1"
               >
                 <ChevronLeft className="w-5 h-5" />
               </motion.button>
             )}

             {/* Horizontal Scroll Area */}
             <div 
               ref={scrollContainerRef}
               onScroll={checkScroll}
               className="flex-1 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1"
             >
               {QUICK_REACTIONS.map((emoji) => (
                 <motion.button
                   key={emoji.id}
                   whileHover={{ scale: 1.3, y: -2 }}
                   whileTap={{ scale: 0.9 }}
                   onMouseEnter={() => setHoveredEmoji(emoji.name)}
                   onMouseLeave={() => setHoveredEmoji(null)}
                   onClick={(e) => {
                     e.stopPropagation();
                     onSelect(emoji);
                     setHoveredEmoji(null);
                     // Optional: auto-close on select
                     // onClose(); 
                   }}
                   className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors group outline-none"
                 >
                   <img 
                     src={emoji.src} 
                     alt={emoji.name} 
                     className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-md group-hover:drop-shadow-xl transition-all duration-300"
                   />
                 </motion.button>
               ))}
             </div>

             {/* Right Scroll Arrow */}
             {canScrollRight && (
               <motion.button 
                 initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                 onClick={(e) => { e.stopPropagation(); scroll('right'); }}
                 className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors ml-1"
               >
                 <ChevronRight className="w-5 h-5" />
               </motion.button>
             )}
          </div>
          
          {/* Custom Scrollbar override for this component to hide it completely */}
          <style dangerouslySetInnerHTML={{__html: `
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};


// --- 3. MAIN DEMO COMPONENT (The Control Panel Wrapper) ---
export default function EmojiSelectorDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [reactions, setReactions] = useState([]);

  const handleReactionSelect = (emoji) => {
    const id = Date.now() + Math.random(); // ensure unique ID for rapid clicks
    setReactions(prev => [...prev, { id, src: emoji.src }]);
    
    // Auto-remove the reaction after animation completes
    setTimeout(() => {
       setReactions(prev => prev.filter(r => r.id !== id));
    }, 2500); 
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-end pb-12 sm:pb-24 font-sans relative overflow-hidden">
      
      {/* Background Room Mockup */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
         <div className="w-[90%] max-w-[800px] aspect-video border border-white/20 rounded-3xl bg-slate-900 shadow-2xl flex items-center justify-center">
            <Smile className="w-24 h-24 text-slate-800" />
         </div>
      </div>

      <div className="absolute top-10 text-center z-10 w-full px-4">
         <h1 className="text-white font-bold text-2xl md:text-3xl mb-2">Compact Reaction Picker</h1>
         <p className="text-slate-500 text-sm">A horizontal, mobile-friendly design inspired by Google Meet.</p>
      </div>

      {/* --- Control Bar Integration --- */}
      <div className="relative z-30 w-full flex justify-center px-4">
         
         {/* The Control Bar */}
         <div className="flex items-center justify-between sm:justify-center gap-2 p-2 bg-[#1A1A1A]/80 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl w-full sm:w-auto">
            
            <div className="flex items-center gap-2">
               <button className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
               </button>
               <button className="hidden sm:flex w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 items-center justify-center text-white/70 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
               </button>
            </div>

            {/* --- The Integration Point --- */}
            <div className="relative flex justify-center">
               
               {/* Floating Animations Area (Attached to the button) */}
               <AnimatePresence>
                 {reactions.map(reaction => (
                   <FloatingReaction 
                     key={reaction.id} 
                     id={reaction.id} 
                     src={reaction.src} 
                     onComplete={(id) => setReactions(prev => prev.filter(r => r.id !== id))} 
                   />
                 ))}
               </AnimatePresence>

               {/* The Popover Component */}
               <EmojiSelectorPopover 
                 isOpen={isOpen} 
                 onClose={() => setIsOpen(false)}
                 onSelect={handleReactionSelect}
               />

               {/* Trigger Button */}
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => setIsOpen(!isOpen)}
                 className={cn(
                   "w-12 h-12 sm:w-auto sm:px-4 sm:h-12 rounded-xl flex items-center justify-center sm:gap-2 transition-all duration-300 relative font-bold text-sm",
                   isOpen 
                     ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                     : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
                 )}
               >
                 <Smile className="w-5 h-5" />
                 <span className="hidden sm:inline">React</span>
                 
                 {isOpen && (
                   <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-200"></span>
                   </span>
                 )}
               </motion.button>
            </div>

            <div className="flex items-center gap-2">
               <button className="hidden sm:flex w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 items-center justify-center text-white/70 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
               </button>
               <button className="px-5 sm:px-6 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors shadow-lg shadow-red-500/20">
                  Leave
               </button>
            </div>

         </div>
      </div>

    </div>
  );
}