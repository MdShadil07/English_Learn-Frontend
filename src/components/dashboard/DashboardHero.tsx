import React from "react";
import {
  ArrowRight,
  Play,
  Trophy,
  Flame,
  Mic,
  BarChart3,
  Settings,
  Laptop,
  Coffee,
  Globe,
  Train,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Context bubbles around the phone
const CONTEXT_NODES = [
  {
    id: 1,
    icon: Laptop,
    label: "Working Professional",
    sub: "Business English",
    color: "text-pink-500",
    position: "top-10 left-2 md:left-6",
  },
  {
    id: 2,
    icon: Coffee,
    label: "Casual Learner",
    sub: "Cafe Conversation",
    color: "text-amber-500",
    position: "bottom-20 left-2 md:left-4",
  },
  {
    id: 3,
    icon: Globe,
    label: "Global Traveler",
    sub: "Cultural Nuances",
    color: "text-blue-500",
    position: "top-16 right-2 md:right-6",
  },
  {
    id: 4,
    icon: Train,
    label: "Daily Commuter",
    sub: "Podcast Listening",
    color: "text-emerald-500",
    position: "bottom-32 right-2 md:right-6",
  },
];

export default function DashboardHero({
  user = { fullName: "Learner" },
  greeting = "Hello",
}) {
  return (
    <div className="relative w-full pt-10 pb-20 md:pt-12 md:pb-24 overflow-visible">
      {/* HERO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center relative z-10">

        {/* LEFT — TEXT + CTA */}
        <div className="space-y-8 text-center lg:text-left">
          
          {/* STATUS BADGE (VERY LIGHT) */}
          <div className="inline-flex items-center justify-center lg:justify-start">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
              bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-600 text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              AI Coaching Active
            </div>
          </div>

          {/* HEADLINE */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900 dark:text-white">
              {greeting}, <br />
              <span className="text-emerald-600">
                {user?.fullName || "Learner"}
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0">
              Your personalized learning hub is live. Track your growth and 
              master fluency with adaptive AI guidance.
            </p>
          </div>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <Button
              size="lg"
              className="h-14 px-8 text-base font-bold rounded-full 
              bg-slate-900 text-white dark:bg-white dark:text-slate-900"
            >
              Start Session <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base font-bold rounded-full border-2"
            >
              <Play className="mr-2 w-5 h-5" /> My Progress
            </Button>
          </div>

          {/* SOCIAL PROOF */}
          <div className="flex items-center justify-center lg:justify-start gap-10 pt-4">
            {/* Streak */}
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-orange-500" />
              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">12</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">
                  Day Streak
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-10 bg-slate-300 dark:bg-slate-700"></div>

            {/* Rank */}
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">
                  Top 5%
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">
                  Global Rank
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — PHONE MOCKUP */}
        <div className="relative flex justify-center lg:justify-end items-center h-[580px] md:h-[650px] w-full mt-10 lg:mt-0">

          {/* FLOATING NODES */}
          {CONTEXT_NODES.map((node) => (
            <div
              key={node.id}
              className={`absolute ${node.position} hidden md:flex items-center gap-3
               bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 
               p-3 pr-5 rounded-xl shadow-md`}
            >
              <node.icon className={`w-5 h-5 ${node.color}`} />
              <div>
                <div className="text-xs font-bold">{node.label}</div>
                <div className="text-[10px] text-slate-500">{node.sub}</div>
              </div>
            </div>
          ))}

          {/* PHONE SHELL */}
          <div className="relative z-20 w-[280px] md:w-[330px] h-[600px] md:h-[650px] 
              bg-white dark:bg-slate-900 rounded-[3rem] border-[8px] border-slate-900 shadow-xl overflow-hidden">

            {/* SCREEN */}
            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 flex flex-col">

              {/* HEADER */}
              <div className="pt-10 pb-4 px-6 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage src="/logo.svg" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-bold">Coach Taylor</div>
                    <div className="text-[10px] text-emerald-500">Live Session</div>
                  </div>
                </div>

                {/* Recording Indicator */}
                <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-[9px] font-bold text-red-500 uppercase">Rec</span>
                </div>
              </div>

              {/* CENTER MIC */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <div className="absolute inset-0 border border-emerald-400/20 rounded-full"></div>
                  <div className="absolute inset-4 border border-emerald-400/20 rounded-full"></div>
                  <div className="absolute inset-8 border border-emerald-400/20 rounded-full"></div>

                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                    <Mic className="w-7 h-7" />
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-3">Listening to you...</p>
              </div>

              {/* TRANSCRIPTION CARD */}
              <div className="bg-white dark:bg-slate-800 p-4 m-5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                  Live Transcript — 98% Accuracy
                </div>

                <div className="text-sm text-slate-700 dark:text-slate-200">
                  “I really enjoyed the <span className="line-through text-red-500">meet</span> yesterday.”
                </div>

                <div className="mt-3 text-xs bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg">
                  <span className="font-bold text-emerald-600">Correction:</span> Use “meeting”.
                </div>
              </div>

              {/* BOTTOM BUTTONS */}
              <div className="h-20 flex items-center justify-around border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <Button size="icon" variant="ghost">
                  <Settings className="w-5 h-5 text-slate-500" />
                </Button>
                <Button size="icon" className="h-14 w-14 rounded-full bg-red-500">
                  <div className="w-4 h-4 bg-white"></div>
                </Button>
                <Button size="icon" variant="ghost">
                  <BarChart3 className="w-5 h-5 text-slate-500" />
                </Button>
              </div>
            </div>
          </div>

          {/* FLOATING — “WORD LEARNED” CARD */}
          <div className="absolute bottom-28 left-5 md:left-10 hidden md:flex bg-white dark:bg-slate-800 p-3 pr-5 rounded-xl shadow-md border">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div className="ml-2">
              <div className="text-xs font-bold">Word Learned</div>
              <div className="text-[10px] text-slate-500">“Serendipity”</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
