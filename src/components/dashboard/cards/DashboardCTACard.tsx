import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TrendingUp, BookOpen, Users, ArrowRight } from 'lucide-react';

interface DashboardCTACardProps {
  onGetStarted?: () => void;
  onExploreFeatures?: () => void;
  onStartPractice?: () => void;
}

const DashboardCTACard: React.FC<DashboardCTACardProps> = ({
  onGetStarted,
  onExploreFeatures,
  onStartPractice
}) => {
  return (
    <motion.div
      className="bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-center relative z-10">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Accelerate Your Progress?
          </h3>
          <p className="text-emerald-50 text-base md:text-lg mb-6">
            Continue your learning journey with personalized lessons, practice sessions, and community interactions. Your fluency goals are within reach!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="bg-white text-emerald-600 hover:bg-slate-100 font-semibold"
              onClick={onStartPractice}
            >
              Start Practice
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-black border-white hover:bg-transparent hover:text-black hover:border-white font-semibold"
              onClick={onExploreFeatures}
            >
              Explore Features
            </Button>
          </div>
        </div>

        <div className="hidden md:flex justify-end">
          <div className="relative">
            {/* Outer animated circle */}
            <motion.div
              className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Middle animated circle */}
              <motion.div
                className="w-32 h-32 rounded-full bg-white/30 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, -3, 3, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                {/* Inner animated circle */}
                <motion.div
                  className="w-20 h-20 rounded-full bg-white flex items-center justify-center"
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <div className="text-center">
                    {/* Animated TrendingUp icon with drawing effect */}
                    <motion.div
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        pathLength: { duration: 2, ease: "easeInOut", delay: 1.5 },
                        opacity: { duration: 0.5, delay: 1.5 }
                      }}
                    >
                      <TrendingUp className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                    </motion.div>
                    <motion.div
                      className="text-emerald-600 font-bold text-xs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2, duration: 0.5 }}
                    >
                      Level Up
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Additional floating circular elements */}
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/15"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, 2, 0],
                y: [0, -2, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8
              }}
            />
            <motion.div
              className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-white/10"
              animate={{
                scale: [1, 1.4, 1],
                x: [0, -1, 0],
                y: [0, 1, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2
              }}
            />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-white/10 blur-sm"></div>
      <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/5 blur-lg"></div>
    </motion.div>
  );
};

export default DashboardCTACard;
