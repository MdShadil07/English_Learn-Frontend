import React from 'react';

const pulse = "bg-slate-200 dark:bg-slate-800 animate-pulse";

export const AIChatSkeleton = () => {
  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 overflow-hidden w-full">
      {/* Left Sidebar Skeleton (Hidden on mobile) */}
      <div className="hidden lg:flex w-[280px] border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex-col p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 mt-2">
          <div className={`w-10 h-10 rounded-xl ${pulse}`} />
          <div className="flex flex-col gap-2 flex-1">
             <div className={`w-24 h-4 rounded-md ${pulse}`} />
             <div className={`w-16 h-3 rounded-md ${pulse}`} />
          </div>
        </div>
        
        {/* Stats Area */}
        <div className="flex flex-col gap-4 mb-6">
           <div className={`w-full h-24 rounded-xl ${pulse}`} />
           <div className="grid grid-cols-2 gap-3">
              <div className={`h-20 rounded-xl ${pulse}`} />
              <div className={`h-20 rounded-xl ${pulse}`} />
           </div>
        </div>
        
        {/* Conversations List */}
        <div className={`w-32 h-4 rounded-md ${pulse} mb-4 mt-2`} />
        <div className="flex flex-col gap-2 flex-1 overflow-hidden">
           {[1, 2, 3, 4, 5].map(i => (
             <div key={i} className={`w-full h-14 rounded-xl ${pulse}`} />
           ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Chat Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
             {/* Mobile menu button placeholder */}
             <div className={`lg:hidden w-10 h-10 rounded-md ${pulse}`} />
             
             {/* Personality Info */}
             <div className={`w-10 h-10 rounded-full ${pulse}`} />
             <div className="flex flex-col gap-1.5">
                <div className={`w-32 h-4 rounded-md ${pulse}`} />
                <div className={`w-24 h-3 rounded-md ${pulse}`} />
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className={`hidden sm:block w-24 h-8 rounded-full ${pulse}`} />
             <div className={`w-10 h-10 rounded-full ${pulse}`} />
          </div>
        </header>

        {/* Chat Messages Area */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col gap-6 overflow-hidden">
          {/* AI Message */}
          <div className="flex gap-4 w-full max-w-3xl">
             <div className={`w-10 h-10 rounded-full shrink-0 ${pulse}`} />
             <div className="flex flex-col gap-2 w-full">
                <div className={`w-3/4 h-24 rounded-2xl rounded-tl-none ${pulse}`} />
             </div>
          </div>
          
          {/* User Message */}
          <div className="flex gap-4 w-full max-w-3xl self-end flex-row-reverse">
             <div className={`w-10 h-10 rounded-full shrink-0 ${pulse}`} />
             <div className="flex flex-col gap-2 w-full items-end">
                <div className={`w-2/3 h-16 rounded-2xl rounded-tr-none ${pulse}`} />
             </div>
          </div>
          
          {/* AI Message */}
          <div className="flex gap-4 w-full max-w-3xl">
             <div className={`w-10 h-10 rounded-full shrink-0 ${pulse}`} />
             <div className="flex flex-col gap-2 w-full">
                <div className={`w-1/2 h-32 rounded-2xl rounded-tl-none ${pulse}`} />
             </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-950 shrink-0 border-t border-slate-200 dark:border-slate-800">
           <div className={`w-full max-w-4xl mx-auto h-16 sm:h-20 rounded-2xl ${pulse}`} />
        </div>
      </div>
      
      {/* Right Settings Sidebar Skeleton (Hidden by default, so we can omit it or render conditionally. 
          Usually it's off-canvas. We'll leave it out of the main skeleton to match default state). */}
    </div>
  );
};

export default AIChatSkeleton;
