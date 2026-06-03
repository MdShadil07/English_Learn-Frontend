import React from 'react';

const AuthSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50 dark:from-slate-950 dark:via-emerald-950/10 dark:to-teal-950/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs (optimized) */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-[40%] -right-[60%] w-[100rem] h-[100rem] rounded-full bg-[radial-gradient(circle,rgba(167,243,208,0.3)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(6,78,59,0.2)_0%,transparent_70%)]" style={{ transform: 'translateZ(0)' }}></div>
        <div className="absolute -bottom-[30%] -left-[60%] w-[80rem] h-[80rem] rounded-full bg-[radial-gradient(circle,rgba(167,243,208,0.3)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(6,78,59,0.2)_0%,transparent_70%)]" style={{ transform: 'translateZ(0)' }}></div>
      </div>

      <div className="w-full max-w-lg mx-auto relative z-10">
        <div className="relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-0 shadow-2xl rounded-xl p-8 md:p-10 lg:p-12">
          {/* Header Skeleton */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse mb-4"></div>
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-3"></div>
            <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
          </div>

          {/* Social Buttons Skeleton */}
          <div className="space-y-3 mb-6">
            <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse"></div>
            <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse"></div>
          </div>

          {/* Divider Skeleton */}
          <div className="flex items-center my-6 opacity-50">
            <div className="flex-1 border-t border-slate-200 dark:border-slate-700"></div>
            <div className="px-4 h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
            <div className="flex-1 border-t border-slate-200 dark:border-slate-700"></div>
          </div>

          {/* Input Fields Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
              <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
              <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse"></div>
            </div>
            
            <div className="h-12 w-full bg-emerald-500/50 dark:bg-emerald-600/50 rounded-md animate-pulse mt-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSkeleton;
