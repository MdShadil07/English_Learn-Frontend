import React from 'react';
import { Globe, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type FooterProps = {
  className?: string;
  variant?: string;
  showNewsletter?: boolean;
};

const MinimalFooter = ({ className, variant, showNewsletter }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("w-full py-6 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm", className)}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          
          {/* Left: Brand & Copyright */}
          <div className="flex items-center gap-2 order-2 md:order-1">
            <span className="font-semibold text-slate-700 dark:text-slate-200">CognitoSpeak</span>
            <span>&copy; {currentYear}</span>
            <span className="hidden sm:inline mx-1 text-slate-300 dark:text-slate-700">|</span>
            <span className="hidden sm:inline">All rights reserved.</span>
          </div>

          {/* Right: Links & Status */}
          <div className="flex flex-wrap justify-center items-center gap-6 order-1 md:order-2">
            <a 
              href="#" 
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
            >
              Privacy
            </a>
            <a 
              href="#" 
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
            >
              Terms
            </a>
            <a 
              href="#" 
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
            >
              Help
            </a>
            
            {/* Separator */}
            <div className="w-px h-3 bg-slate-300 dark:bg-slate-700 hidden sm:block"></div>
            
            {/* System Status Indicator */}
            <a href="#" className="flex items-center gap-2 hover:text-slate-700 dark:hover:text-slate-200 transition-colors group">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 group-hover:bg-emerald-500"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 group-hover:bg-emerald-600"></span>
              </div>
              <span className="font-medium">Systems Normal</span>
            </a>

            {/* Language/Region Picker (Visual Only) */}
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                <Globe className="w-3.5 h-3.5" />
                <span className="font-medium">English (US)</span>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default MinimalFooter;