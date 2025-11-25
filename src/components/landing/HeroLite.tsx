import React from 'react';
import { Button } from '@/components/ui/button';

export default function HeroLite({ userName = 'Learner' }: { userName?: string }) {
  return (
    <section className="relative w-full pt-12 pb-12 md:pt-20 md:pb-28">
      <div className="container mx-auto px-4 text-center lg:text-left">
        <div className="max-w-3xl mx-auto lg:mx-0">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.05] tracking-tight">
            Good Afternoon,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600">
              {userName}
            </span>
          </h1>

          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Your personalized learning hub is live. Track progress, join live sessions, and level up with targeted AI coaching.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Button size="lg" className="h-14 px-8 text-base font-bold rounded-full bg-emerald-600 text-white">
              Start Session
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base font-bold rounded-full">
              My Progress
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
