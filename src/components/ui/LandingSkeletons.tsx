import React from 'react';

/**
 * Highly accurate skeletons for the landing page sections.
 * They mimic the layout of each section so that there's no layout shift
 * when the actual chunk loads.
 */

const pulse = "bg-slate-200 dark:bg-slate-800 animate-pulse";

export const HeroSkeleton = () => (
  <section className="relative min-h-screen bg-[#f8fbff] dark:bg-[#070b14] w-full pt-24 pb-20 overflow-hidden flex items-center">
    <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-12 gap-12 items-center">
      
      {/* Left Column Text Skeleton */}
      <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
        <div className={`w-48 h-8 rounded-full ${pulse} mb-6`} />
        <div className={`w-full max-w-[400px] h-16 sm:h-20 md:h-24 rounded-2xl ${pulse} mb-6`} />
        <div className={`w-full max-w-[480px] h-6 rounded-lg ${pulse} mb-3`} />
        <div className={`w-5/6 max-w-[400px] h-6 rounded-lg ${pulse} mb-10`} />
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mb-10">
          <div className={`flex-1 h-14 rounded-full ${pulse}`} />
          <div className={`flex-1 h-14 rounded-full ${pulse}`} />
        </div>
        
        <div className="flex gap-4 items-center">
           <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                 <div key={i} className={`w-10 h-10 rounded-full border-2 border-white dark:border-[#070b14] ${pulse}`} />
              ))}
           </div>
           <div className={`w-32 h-4 rounded-md ${pulse}`} />
        </div>
      </div>

      {/* Right Column Globe Skeleton */}
      <div className="lg:col-span-7 flex items-center justify-center h-[480px] sm:h-[580px] mt-10 lg:mt-0">
        <div className={`w-[260px] h-[260px] rounded-full ${pulse}`} />
      </div>
    </div>
  </section>
);

export const FeaturesSkeleton = () => (
  <section className="py-24 lg:py-32 bg-white dark:bg-slate-950 w-full overflow-hidden">
    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col items-center">
      {/* Title area */}
      <div className={`w-32 h-8 rounded-full ${pulse} mb-6`} />
      <div className={`w-3/4 max-w-2xl h-12 md:h-16 rounded-2xl ${pulse} mb-6`} />
      <div className={`w-2/3 max-w-xl h-6 rounded-lg ${pulse} mb-16`} />
      
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`w-32 h-10 rounded-full ${pulse}`} />
        ))}
      </div>
      
      {/* Content area */}
      <div className="w-full max-w-5xl h-[400px] md:h-[500px] rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse flex items-center justify-center border border-slate-200 dark:border-slate-800">
        <div className={`w-16 h-16 rounded-full ${pulse} opacity-50`} />
      </div>
    </div>
  </section>
);

export const HowItWorksSkeleton = () => (
  <section className="py-24 lg:py-32 bg-[#f8fbff] dark:bg-[#070b14] w-full">
    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col items-center">
      {/* Title */}
      <div className={`w-32 h-8 rounded-full ${pulse} mb-6`} />
      <div className={`w-3/4 max-w-xl h-12 md:h-16 rounded-2xl ${pulse} mb-6`} />
      <div className={`w-2/3 max-w-lg h-6 rounded-lg ${pulse} mb-16`} />
      
      {/* Steps */}
      <div className="w-full max-w-5xl flex flex-col gap-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8`}>
             <div className="flex-1 w-full h-[300px] rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800" />
             <div className="flex-1 w-full flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-xl ${pulse}`} />
                <div className={`w-3/4 h-8 rounded-xl ${pulse}`} />
                <div className={`w-full h-4 rounded-md ${pulse}`} />
                <div className={`w-5/6 h-4 rounded-md ${pulse}`} />
                <div className={`w-4/6 h-4 rounded-md ${pulse}`} />
             </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const PricingSkeleton = () => (
  <section className="py-24 lg:py-32 bg-[#f8fbff] dark:bg-[#070b14] w-full">
    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col items-center">
      {/* Title */}
      <div className={`w-32 h-8 rounded-full ${pulse} mb-6`} />
      <div className={`w-2/3 max-w-lg h-12 md:h-16 rounded-2xl ${pulse} mb-6`} />
      <div className={`w-1/2 max-w-md h-6 rounded-lg ${pulse} mb-10`} />
      <div className={`w-48 h-10 rounded-full ${pulse} mb-16`} />
      
      {/* Cards */}
      <div className="w-full max-w-6xl grid lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-full h-[600px] rounded-[2.5rem] bg-white dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800 p-8 flex flex-col gap-6">
            <div className={`w-14 h-14 rounded-2xl ${pulse}`} />
            <div className={`w-1/2 h-8 rounded-xl ${pulse}`} />
            <div className={`w-full h-4 rounded-md ${pulse}`} />
            <div className={`w-3/4 h-12 rounded-2xl ${pulse} mt-4 mb-4`} />
            <div className={`w-full h-px ${pulse} mb-4`} />
            {[1,2,3,4,5].map(j => (
               <div key={j} className="flex gap-4 items-center">
                  <div className={`w-5 h-5 rounded-md ${pulse}`} />
                  <div className={`w-3/4 h-4 rounded-md ${pulse}`} />
               </div>
            ))}
            <div className={`w-full h-14 rounded-full ${pulse} mt-auto`} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const TestimonialsSkeleton = () => (
  <section className="py-24 lg:py-32 bg-[#f8fbff] dark:bg-slate-950 w-full overflow-hidden">
    <div className="w-full flex flex-col items-center mb-16">
      <div className={`w-32 h-8 rounded-full ${pulse} mb-6`} />
      <div className={`w-2/3 max-w-lg h-12 md:h-16 rounded-2xl ${pulse} mb-6`} />
      <div className={`w-1/2 max-w-md h-6 rounded-lg ${pulse}`} />
    </div>
    
    {/* Marquee area */}
    <div className="w-full flex gap-4 overflow-hidden px-4">
      {[1, 2, 3, 4].map(i => (
         <div key={i} className="min-w-[320px] md:min-w-[400px] h-[300px] rounded-3xl bg-white dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800 p-8 flex flex-col">
            <div className="flex gap-4 mb-6">
               <div className={`w-14 h-14 rounded-full ${pulse}`} />
               <div className="flex flex-col gap-2 justify-center">
                  <div className={`w-32 h-5 rounded-md ${pulse}`} />
                  <div className={`w-24 h-4 rounded-md ${pulse}`} />
               </div>
            </div>
            <div className={`w-full h-4 rounded-md ${pulse} mb-3`} />
            <div className={`w-full h-4 rounded-md ${pulse} mb-3`} />
            <div className={`w-3/4 h-4 rounded-md ${pulse} mb-6`} />
            <div className={`w-24 h-6 rounded-full ${pulse} mt-auto`} />
         </div>
      ))}
    </div>
  </section>
);

export const FAQSkeleton = () => (
  <section className="py-24 lg:py-32 bg-[#f8fbff] dark:bg-[#070b14] w-full">
    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-12 gap-12 lg:gap-20">
      
      {/* Left col */}
      <div className="lg:col-span-5 flex flex-col gap-6">
         <div className={`w-32 h-8 rounded-full ${pulse}`} />
         <div className={`w-full h-12 md:h-16 rounded-2xl ${pulse}`} />
         <div className={`w-3/4 h-12 md:h-16 rounded-2xl ${pulse}`} />
         <div className={`w-5/6 h-6 rounded-lg ${pulse}`} />
         <div className={`w-full h-14 rounded-2xl ${pulse} mt-4`} />
         <div className={`w-full h-[300px] rounded-[2rem] ${pulse} mt-6`} />
      </div>

      {/* Right col */}
      <div className="lg:col-span-7 flex flex-col gap-4">
         {[1, 2, 3, 4, 5, 6].map(i => (
           <div key={i} className={`w-full h-20 rounded-2xl ${pulse}`} />
         ))}
      </div>
    </div>
  </section>
);

export const CTASkeleton = () => (
  <section className="py-24 lg:py-32 bg-[#f8fbff] dark:bg-[#070b14] w-full">
    <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
       {/* Left col */}
       <div className="flex flex-col gap-6">
         <div className={`w-3/4 h-12 md:h-16 rounded-2xl ${pulse}`} />
         <div className={`w-1/2 h-12 md:h-16 rounded-2xl ${pulse}`} />
         <div className={`w-5/6 h-6 rounded-lg ${pulse}`} />
         <div className={`w-4/5 h-6 rounded-lg ${pulse} mb-4`} />
         
         {[1, 2, 3].map(i => (
           <div key={i} className={`w-full max-w-md h-20 rounded-2xl ${pulse}`} />
         ))}
         
         <div className="flex gap-4 mt-6">
            <div className={`w-48 h-14 rounded-full ${pulse}`} />
            <div className={`w-48 h-14 rounded-full ${pulse}`} />
         </div>
       </div>

       {/* Right col */}
       <div className="flex justify-center">
          <div className={`w-[340px] md:w-[380px] h-[560px] rounded-[2.5rem] ${pulse}`} />
       </div>
    </div>
  </section>
);

export const FooterSkeleton = () => (
  <footer className="w-full py-12 bg-slate-900 border-t border-slate-800 flex justify-center">
     <div className="w-full max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
           <div className="col-span-2 lg:col-span-2 flex flex-col gap-4">
              <div className={`w-32 h-10 rounded-lg ${pulse}`} />
              <div className={`w-full max-w-xs h-16 rounded-lg ${pulse}`} />
           </div>
           {[1, 2, 3].map(i => (
             <div key={i} className="flex flex-col gap-3">
                <div className={`w-24 h-6 rounded-md ${pulse} mb-2`} />
                <div className={`w-20 h-4 rounded-md ${pulse}`} />
                <div className={`w-16 h-4 rounded-md ${pulse}`} />
                <div className={`w-24 h-4 rounded-md ${pulse}`} />
                <div className={`w-18 h-4 rounded-md ${pulse}`} />
             </div>
           ))}
        </div>
     </div>
  </footer>
);
