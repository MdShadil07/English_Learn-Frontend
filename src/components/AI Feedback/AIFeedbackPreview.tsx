import React from 'react';

const AIFeedback = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[800px] w-full max-w-5xl px-5 py-20 mx-auto font-sans">
      
      {/* Injecting the float animation styles locally since it's a custom keyframe */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        /* Delays for natural feel */
        .delay-0 { animation-delay: 0s; }
        .delay-1000 { animation-delay: 1s; }
        .delay-2000 { animation-delay: 2s; }
      `}</style>

      {/* --- Phone Mockup --- */}
      {/* Using 'dark:' classes to handle the theme toggle */}
      <div className="relative w-[320px] h-[650px] bg-black rounded-[45px] border-[8px] border-slate-800 shadow-2xl overflow-hidden z-10 transition-all duration-300">
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-slate-800 rounded-b-2xl z-20"></div>
        
        {/* Screen Content */}
        <div className="h-full w-full pt-[60px] px-5 pb-5 bg-gray-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200 transition-colors duration-300">
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-1">Sprint planning</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Oct 18 at 05:32 PM • Meets • 45m</span>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2 text-base font-semibold mb-5">
              <div className="w-6 h-6 bg-indigo-500 rounded-full"></div>
              Tutor recommendations
            </div>

            {/* List Items (Opacity transition for hover effect) */}
            <div className="mb-5 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default">
              <div className="flex items-center mb-1">
                <span className="inline-block w-2 h-2 rounded-full mr-2 bg-orange-500"></span>
                <h4 className="text-sm font-semibold">Pronunciation</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 ml-4 leading-relaxed">
                Practice clarity on specific sounds...
              </p>
            </div>

            <div className="mb-5 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default">
              <div className="flex items-center mb-1">
                <span className="inline-block w-2 h-2 rounded-full mr-2 bg-blue-500"></span>
                <h4 className="text-sm font-semibold">Vocabulary</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 ml-4 leading-relaxed">
                Work on expanding precise descriptors...
              </p>
            </div>

            <div className="mb-5 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default">
              <div className="flex items-center mb-1">
                <span className="inline-block w-2 h-2 rounded-full mr-2 bg-fuchsia-500"></span>
                <h4 className="text-sm font-semibold">Grammar</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 ml-4 leading-relaxed">
                Pay special attention to verb tenses...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Floating Cards (Glassmorphism) --- */}
      
      {/* 1. Grammar Card (Right Top) */}
      <div className="absolute top-[180px] left-1/2 ml-5 md:ml-20 w-[220px] p-4 rounded-2xl shadow-xl z-20 border 
                      bg-white/80 border-white/40 text-slate-900 
                      dark:bg-slate-900/70 dark:border-white/10 dark:text-white
                      backdrop-blur-md animate-float delay-1000 transition-colors duration-300 flex justify-between items-center">
        <div>
          <h4 className="text-sm font-semibold mb-1">Grammar</h4>
          <p className="text-[11px] leading-tight text-slate-500 dark:text-slate-400 w-24">
            Your grammar score is <span className="text-fuchsia-500 font-bold">15% lower</span> than average.
          </p>
        </div>
        <div className="relative w-[50px] h-[50px]">
          <svg width="50" height="50" viewBox="0 0 36 36" className="transform -rotate-90">
            <path className="text-slate-200 dark:text-slate-700" fill="none" stroke="currentColor" strokeWidth="4" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="text-fuchsia-500 drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="100" strokeDashoffset="50" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
            <span className="text-sm font-bold">50</span>
            <span className="text-[8px] text-slate-500 dark:text-slate-400 uppercase">Score</span>
          </div>
        </div>
      </div>

      {/* 2. Pronunciation Card (Bottom) */}
      <div className="absolute top-[420px] left-1/2 ml-2 md:ml-12 w-[240px] p-4 rounded-2xl shadow-xl z-20 border
                      bg-white/80 border-white/40 text-slate-900 
                      dark:bg-slate-900/70 dark:border-white/10 dark:text-white
                      backdrop-blur-md animate-float delay-2000 transition-colors duration-300">
        <span className="inline-block px-2 py-1 rounded-md text-[10px] font-bold bg-orange-500 text-white mb-2">
          Pronunciation
        </span>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          Practice sound <strong className="text-slate-900 dark:text-white">/ɛ/</strong>. Focus on tricky words like <span className="font-bold text-slate-900 dark:text-white">"percentile"</span>.
        </p>
      </div>

      {/* 3. Vocabulary Card (Left) */}
      <div className="absolute top-[280px] right-1/2 mr-10 md:mr-36 w-[200px] p-4 rounded-2xl shadow-xl z-20 border
                      bg-white/80 border-white/40 text-slate-900 
                      dark:bg-slate-900/70 dark:border-white/10 dark:text-white
                      backdrop-blur-md animate-float delay-0 transition-colors duration-300">
        <span className="inline-block px-2 py-1 rounded-md text-[10px] font-bold bg-blue-500 text-white mb-2">
          Vocabulary
        </span>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          Use more advanced words to make your language more...
        </p>
      </div>

      {/* --- Main Headline --- */}
      <div className="mt-16 text-center z-10 transition-colors duration-300">
        <h2 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900 dark:text-white">
          Get AI feedback<br />
          on your <span className="text-blue-600 dark:text-blue-500">real-life</span> calls
        </h2>
      </div>

    </div>
  );
};

export default AIFeedback;