import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, ZapOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FocusWarningsProps {
  isVisible: boolean;
  warningCount: number;
  onReturnToFocus: () => void;
}

export const FocusWarnings: React.FC<FocusWarningsProps> = ({ isVisible, warningCount, onReturnToFocus }) => {
  
  const getWarningContent = () => {
    if (warningCount >= 3) {
      return {
        icon: <ZapOff className="w-16 h-16 text-rose-500 mb-6 animate-pulse" />,
        title: "Focus Broken. Penalty Applied.",
        message: "You have repeatedly left the focus screen. A penalty of -50 XP has been applied to your account. Discipline is the bridge between goals and accomplishment.",
        buttonText: "Accept Penalty & Return",
        colorClass: "from-rose-500/20 to-red-600/20",
        borderClass: "border-rose-500/50"
      };
    } else if (warningCount === 2) {
      return {
        icon: <ShieldAlert className="w-16 h-16 text-orange-500 mb-6 animate-bounce" />,
        title: "Final Warning",
        message: "If you leave the focus screen one more time, you will lose 50 XP. Stay focused and finish your session strong!",
        buttonText: "I Will Stay Focused",
        colorClass: "from-orange-500/20 to-amber-600/20",
        borderClass: "border-orange-500/50"
      };
    } else {
      return {
        icon: <AlertTriangle className="w-16 h-16 text-amber-500 mb-6" />,
        title: "Distraction Detected",
        message: "You switched tabs or left the application. Enterprise Focus Mode requires your full attention. Please return to your session.",
        buttonText: "Return to Session",
        colorClass: "from-amber-500/20 to-yellow-600/20",
        borderClass: "border-amber-500/50"
      };
    }
  };

  const content = getWarningContent();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xl p-6"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className={cn(
              "max-w-lg w-full bg-slate-900 border-2 rounded-[2rem] p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden",
              content.borderClass
            )}
          >
            {/* Background Glow */}
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-30 pointer-events-none blur-2xl", content.colorClass)}></div>

            <div className="relative z-10 flex flex-col items-center">
              {content.icon}
              <h2 className="text-3xl font-black text-white tracking-tight mb-4 uppercase">{content.title}</h2>
              <p className="text-lg text-slate-300 font-medium leading-relaxed mb-8">
                {content.message}
              </p>
              
              <Button 
                onClick={onReturnToFocus}
                size="lg"
                className="w-full h-14 text-lg font-bold bg-white text-slate-900 hover:bg-slate-200 transition-colors rounded-xl"
              >
                {content.buttonText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
