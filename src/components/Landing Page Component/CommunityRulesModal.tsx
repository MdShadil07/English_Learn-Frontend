import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  HeartHandshake, 
  MessageSquare, 
  Video, 
  UserX,
  AlertOctagon
} from 'lucide-react';

interface CommunityRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommunityRulesModal: React.FC<CommunityRulesModalProps> = ({ isOpen, onClose }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { type: 'spring', damping: 25, stiffness: 300, duration: 0.4 } 
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95, 
      transition: { duration: 0.2 } 
    }
  };

  const rules = [
    {
      icon: <HeartHandshake className="w-6 h-6 text-rose-500" />,
      title: "Respect & Kindness",
      description: "Treat everyone with dignity. We are a global community of learners at different proficiency levels. Harassment, discrimination, or hate speech will result in an immediate ban."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
      title: "Constructive Feedback",
      description: "When helping others with their English, be encouraging and polite. Frame corrections as helpful suggestions rather than harsh criticisms."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: "Privacy & Safety First",
      description: "Never share sensitive personal information (phone numbers, exact addresses, financial details) in global practice rooms. Protect your own identity and respect others' privacy."
    },
    {
      icon: <Video className="w-6 h-6 text-purple-500" />,
      title: "Audio & Video Etiquette",
      description: "Keep your microphone muted when you are not speaking to reduce background noise. Ensure your background is appropriate if you choose to turn on your camera."
    },
    {
      icon: <UserX className="w-6 h-6 text-amber-500" />,
      title: "No Spam or Self-Promotion",
      description: "Practice rooms are strictly for language learning. Do not use the platform to advertise products, services, or share unrelated external links."
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pt-4 pb-20 sm:p-0">
          
          {/* Backdrop Overlay */}
          <motion.div 
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div 
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 z-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            {/* Header Section */}
            <div className="flex-shrink-0 px-6 py-6 sm:px-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white" id="modal-headline">
                    Community Rules
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Guidelines for a safe and effective learning environment
                  </p>
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content Section */}
            <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8 custom-scrollbar">
              
              <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
                  Welcome to the CognitoSpeak Global Community! Our goal is to foster an inclusive, supportive, and highly effective environment for English learners worldwide. By joining a practice room, you agree to adhere to the following standards:
                </p>
              </div>

              <div className="space-y-6">
                {rules.map((rule, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    key={index} 
                    className="flex gap-4 sm:gap-6 p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-700/50"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        {rule.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {rule.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Enforcement Warning */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8 flex gap-4 p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30"
              >
                <AlertOctagon className="w-6 h-6 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-400/90 leading-relaxed font-medium">
                  <strong>Zero Tolerance Policy:</strong> Moderators and AI sentiment filters monitor public rooms. Violations of these rules may result in temporary suspensions or permanent bans from the platform without prior warning.
                </p>
              </motion.div>

            </div>

            {/* Footer / Action Section */}
            <div className="flex-shrink-0 px-6 py-5 sm:px-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                I Understand
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommunityRulesModal;
