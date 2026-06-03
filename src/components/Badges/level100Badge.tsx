import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Crown,
    Share,
    Trophy,
    Moon,
    Sun,
    Award,
    FileText,
    Star,
    Globe
} from 'lucide-react';

interface Props {
    open: boolean;
    onClose: () => void;
    level?: number;
    badgeName?: string;
    description?: string;
}

// Staggered Entrance Variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
};

export function LevelUpModal({
    open,
    onClose,
    level = 100,
    badgeName = "Centurion Master",
    description = "An incredible milestone that only a few ever reach. Your relentless dedication, consistency and passion have made you a true master of English. You're an inspiration to thousands of learners worldwide!"
}: Props) {

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [open]);

    if (!open) return null;

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex flex-col md:items-center md:justify-center justify-end md:p-6 pointer-events-none font-sans">

                    {/* Deep Cinematic Red Vignette Backdrop */}
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 bg-black/70 pointer-events-auto"
                        style={{ backgroundImage: 'radial-gradient(circle at center, rgba(69, 10, 10, 0.4) 0%, rgba(0,0,0,0.85) 100%)' }}
                        onClick={onClose}
                    />

                    {/* Premium Desktop/Mobile Modal Card - Scrollable vertically on small screens */}
                    <motion.div
                        initial={{ y: "100%", scale: 0.95, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: "100%", scale: 0.95, opacity: 0, transition: { duration: 0.3 } }}
                        transition={{ type: "spring", damping: 30, stiffness: 280, mass: 0.9 }}
                        className="relative w-full max-w-none md:max-w-4xl lg:max-w-[1050px] mt-auto md:mt-0 pointer-events-auto bg-[#0A0505] rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-[0_0_80px_rgba(220,38,38,0.25)] flex flex-col border border-[#3A1010] max-h-[92vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >

                        {/* Top Light Highlight */}
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent z-50 pointer-events-none" />

                        {/* Mobile Drag Handle */}
                        <div className="md:hidden absolute top-4 inset-x-0 flex justify-center z-50 sticky top-0 bg-gradient-to-b from-[#0A0505] to-transparent pt-4 pb-2">
                            <div className="w-12 h-1.5 bg-white/25 rounded-full" />
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 md:top-6 md:right-6 w-9 h-9 rounded-full bg-black/40 text-white/60 hover:text-white hover:bg-black/60 flex items-center justify-center transition-all z-50 shadow-sm border border-white/10 backdrop-blur-md"
                        >
                            <X className="w-4 h-4" strokeWidth={2.5} />
                        </button>

                        {/* --- TOP SECTION (Badge & Content) --- */}
                        <div className="flex flex-col md:flex-row w-full flex-shrink-0">

                            {/* --- LEFT SIDE: THE GRAND SHOWCASE --- */}
                            <div className="relative w-full h-[320px] md:h-auto md:w-[48%] lg:w-[45%] flex items-center justify-center overflow-hidden pt-6 md:pt-0 bg-gradient-to-b from-[#1A0505] to-[#0A0202]">

                                {/* Majestic Crimson Glow Aura & Rays */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 z-0 opacity-60 scale-[2.2]"
                                    style={{
                                        background: 'repeating-conic-gradient(from 0deg, transparent 0deg 12deg, rgba(220, 38, 38, 0.15) 12deg 24deg)'
                                    }}
                                />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(220,38,38,0.5)_0%,_transparent_70%)]" />

                                {/* Golden/Red Ember Particles */}
                                <SparkleParticles />

                                {/* The Legendary Shield Artwork (SVG) */}
                                <motion.div
                                    initial={{ y: 40, scale: 0.8, opacity: 0 }}
                                    animate={{ y: 0, scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.15, duration: 0.8, type: "spring", bounce: 0.4 }}
                                    className="relative z-10 w-full max-w-[280px] md:max-w-[400px] aspect-square drop-shadow-[0_20px_40px_rgba(220,38,38,0.4)]"
                                >
                                    <Level100Artwork level={level} />
                                </motion.div>
                            </div>

                            {/* --- RIGHT SIDE: PREMIUM CONTENT --- */}
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="w-full md:w-[52%] lg:w-[55%] p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center relative z-10"
                            >

                                <motion.div variants={itemVariants}>
                                    {/* Milestone Pill */}
                                    <div className="inline-flex items-center gap-1.5 bg-[#1F0A0A] border border-[#7F1D1D] px-3.5 py-1.5 rounded-full mb-4 sm:mb-5 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                                        <Trophy className="w-3.5 h-3.5 text-[#FBBF24]" />
                                        <span className="text-[11px] font-bold tracking-widest text-[#FBBF24] uppercase">
                                            Milestone Unlocked
                                        </span>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    {/* Epic Heading */}
                                    <h2 className="text-4xl md:text-5xl lg:text-[3.75rem] font-black text-white mb-3 tracking-tight leading-[1.05]">
                                        Level <span className="inline-block text-[#EF4444] drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">100</span> Achieved!
                                    </h2>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    {/* Title */}
                                    <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
                                        <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-[#FBBF24]" fill="currentColor" />
                                        <span className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold text-[#FBBF24] tracking-tight">
                                            {badgeName}
                                        </span>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    {/* Description */}
                                    <p className="text-[#A1A1AA] text-[15px] sm:text-[16px] leading-relaxed mb-8 max-w-[95%]">
                                        {description}
                                    </p>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    {/* Plaque-Style Action Card */}
                                    <div className="relative bg-[#120404] border border-[#450A0A] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all">

                                        <div className="flex items-center gap-4 pl-1">
                                            {/* Unique Red Diamond Icon */}
                                            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#7F1D1D] to-[#450A0A] shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center border border-[#DC2626] flex-shrink-0">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                                                    <polygon points="12,2 22,12 12,22 2,12" fill="url(#rubyIconGrad)" stroke="#FCA5A5" strokeWidth="1" />
                                                    <defs>
                                                        <linearGradient id="rubyIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#FCA5A5" />
                                                            <stop offset="50%" stopColor="#EF4444" />
                                                            <stop offset="100%" stopColor="#7F1D1D" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-white text-[14px] sm:text-[15px] font-bold tracking-tight mb-0.5 flex flex-wrap items-center gap-1">
                                                    You're in the top 1% of learners worldwide! <span className="text-base">🏆</span>
                                                </p>
                                                <p className="text-[#A1A1AA] text-[12px] sm:text-[13px] font-medium tracking-tight leading-tight">
                                                    Your achievement is a testament to your excellence. The world is your stage. Shine on!
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={onClose}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0A0505] hover:bg-[#1A0505] text-white py-2.5 px-6 rounded-xl font-bold transition-all shadow-[0_0_10px_rgba(220,38,38,0.2)] border border-[#450A0A] hover:border-[#DC2626] active:scale-95 text-[15px] flex-shrink-0"
                                        >
                                            <Share className="w-4 h-4" strokeWidth={2.5} />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </motion.div>

                            </motion.div>
                        </div>

                        {/* --- BOTTOM SECTION: YOUR ADVANTAGE --- */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="w-full border-t border-[#3A1010] bg-gradient-to-b from-[#140505] to-[#0A0202] pt-6 pb-6 md:pb-8 flex-shrink-0"
                        >
                            <h3 className="text-center text-[#FBBF24] text-[11px] md:text-[12px] font-black tracking-[0.2em] uppercase mb-5 md:mb-6 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                                Your Achievement, Your Advantage
                            </h3>

                            {/* Responsive container: 
                  Mobile -> Horizontal Scroll Carousel (snap-x)
                  Tablet -> 2x2 Grid
                  Desktop -> 1x4 Flex Row with dividers */}
                            <div className="w-full px-4 md:px-8">
                                <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:flex lg:flex-row gap-4 md:gap-6 lg:gap-0 pb-4 md:pb-0 snap-x snap-mandatory lg:divide-x lg:divide-[#3A1010] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    <AdvantageItem
                                        icon={Award}
                                        title="Verified Achievement"
                                        desc="Showcase your milestone with a verified badge"
                                    />
                                    <AdvantageItem
                                        icon={FileText}
                                        title="Boost Your Profile"
                                        desc="Strengthen your resume and learning profile"
                                    />
                                    <AdvantageItem
                                        icon={Star}
                                        title="Stand Out"
                                        desc="Impress in placements and interviews"
                                    />
                                    <AdvantageItem
                                        icon={Globe}
                                        title="Inspire Others"
                                        desc="Be a role model in the learning community"
                                    />
                                </div>
                            </div>
                        </motion.div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// Responsive Sub-component for the Advantage Items
function AdvantageItem({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="flex items-center lg:items-start gap-3 md:gap-4 lg:px-6 first:lg:pl-0 last:lg:pr-0 min-w-[260px] md:min-w-0 snap-center">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#1A0505] border border-[#450A0A] flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                <Icon className="w-5 h-5 text-[#FBBF24]" />
            </div>
            <div className="flex-1">
                <h4 className="text-[#FBBF24] text-[14px] md:text-[15px] font-bold mb-0.5 tracking-tight leading-tight">{title}</h4>
                <p className="text-[#A1A1AA] text-[12px] md:text-[13px] font-medium leading-snug">{desc}</p>
            </div>
        </div>
    );
}

// --- RED/GOLD ENERGY PARTICLES --- //
function SparkleParticles() {
    const particles = Array.from({ length: 40 });

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {particles.map((_, i) => {
                const left = `${Math.random() * 100}%`;
                const isGold = Math.random() > 0.4;
                const size = Math.random() * 4 + 2;
                const duration = Math.random() * 6 + 4;
                const delay = Math.random() * 5;

                return (
                    <motion.div
                        key={i}
                        initial={{ y: '120%', x: 0, opacity: 0, scale: 0 }}
                        animate={{
                            y: '-20%',
                            x: Math.random() * 100 - 50,
                            opacity: [0, 1, 1, 0],
                            scale: [0, 1, 1, 0]
                        }}
                        transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
                        className={`absolute rounded-full ${isGold ? 'bg-[#FBBF24]' : 'bg-[#EF4444]'}`}
                        style={{
                            left,
                            width: size,
                            height: size,
                            boxShadow: `0 0 ${size * 3}px ${isGold ? '#FBBF24' : '#EF4444'}`
                        }}
                    />
                );
            })}
        </div>
    );
}

// --- PIXEL-PERFECT LEVEL 100 ARTWORK (CRIMSON SHIELD & DIAMOND) --- //
function Level100Artwork({ level }: { level: number }) {
    return (
        <div className="w-full h-full relative flex justify-center items-center">
            <svg viewBox="0 0 500 500" className="w-full h-full z-10 drop-shadow-[0_30px_50px_rgba(0,0,0,0.8)]">
                <defs>
                    {/* Ultra-Realistic 3D Metallic Gold Gradients */}
                    <linearGradient id="goldOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFF4D0" />
                        <stop offset="25%" stopColor="#F59E0B" />
                        <stop offset="45%" stopColor="#92400E" />
                        <stop offset="55%" stopColor="#FDE68A" />
                        <stop offset="75%" stopColor="#D97706" />
                        <stop offset="100%" stopColor="#451A03" />
                    </linearGradient>

                    <linearGradient id="goldInner" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FEF08A" />
                        <stop offset="35%" stopColor="#B45309" />
                        <stop offset="50%" stopColor="#FFFBEB" />
                        <stop offset="65%" stopColor="#D97706" />
                        <stop offset="100%" stopColor="#78350F" />
                    </linearGradient>

                    {/* Deep Crimson Shield Base (Metallic Lacquer) */}
                    <radialGradient id="shieldBg" cx="50%" cy="30%" r="70%" fx="50%" fy="30%">
                        <stop offset="0%" stopColor="#EF4444" />
                        <stop offset="40%" stopColor="#991B1B" />
                        <stop offset="80%" stopColor="#450A0A" />
                        <stop offset="100%" stopColor="#2E0404" />
                    </radialGradient>

                    <linearGradient id="shieldGloss" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                        <stop offset="30%" stopColor="rgba(255,255,255,0.05)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>

                    {/* Red Ruby/Diamond Gradients */}
                    <linearGradient id="rubyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FCA5A5" />
                        <stop offset="40%" stopColor="#DC2626" />
                        <stop offset="100%" stopColor="#7F1D1D" />
                    </linearGradient>

                    {/* Pedestal Gradients */}
                    <linearGradient id="pedestalRed" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7F1D1D" />
                        <stop offset="20%" stopColor="#EF4444" />
                        <stop offset="80%" stopColor="#DC2626" />
                        <stop offset="100%" stopColor="#450A0A" />
                    </linearGradient>

                    <linearGradient id="pedestalGold" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#78350F" />
                        <stop offset="30%" stopColor="#F59E0B" />
                        <stop offset="50%" stopColor="#FEF08A" />
                        <stop offset="70%" stopColor="#FCD34D" />
                        <stop offset="100%" stopColor="#451A03" />
                    </linearGradient>

                    {/* Shadows & Glows */}
                    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="0" stdDeviation="12" floodOpacity="0.7" floodColor="#FBBF24" />
                    </filter>

                    <filter id="rubyGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="0" stdDeviation="20" floodOpacity="1" floodColor="#EF4444" />
                    </filter>

                    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="15" stdDeviation="10" floodOpacity="0.8" floodColor="#000000" />
                    </filter>

                    {/* Mixed Wreath Definition (Gold & Red Leaves) */}
                    <g id="leftWreath">
                        {/* Gold Leaves */}
                        <path d="M190,165 C130,105 50,110 30,150 C80,180 130,205 180,210 Z" fill="url(#goldOuter)" stroke="#4A3000" strokeWidth="1.5" filter="url(#dropShadow)" />
                        <path d="M185,200 C110,155 35,175 25,210 C75,230 130,240 180,245 Z" fill="url(#goldOuter)" stroke="#4A3000" strokeWidth="1.5" filter="url(#dropShadow)" />
                        <path d="M180,235 C100,205 30,235 25,270 C70,275 120,270 185,270 Z" fill="url(#goldOuter)" stroke="#4A3000" strokeWidth="1.5" filter="url(#dropShadow)" />
                        <path d="M180,270 C100,250 40,300 45,335 C80,320 130,295 190,285 Z" fill="url(#goldOuter)" stroke="#4A3000" strokeWidth="1.5" filter="url(#dropShadow)" />

                        {/* Inner Gold highlights */}
                        <path d="M190,175 C140,125 70,130 55,160 C95,185 140,210 185,215 Z" fill="url(#goldInner)" />
                        <path d="M185,210 C125,175 60,190 50,220 C90,235 140,245 185,250 Z" fill="url(#goldInner)" />
                        <path d="M180,245 C115,220 55,245 50,275 C85,275 130,275 185,275 Z" fill="url(#goldInner)" />

                        {/* Overlapping Crimson Leaves */}
                        <path d="M185,225 C130,195 65,205 55,235 C95,255 140,260 190,265 Z" fill="url(#rubyGrad)" filter="url(#dropShadow)" />
                        <path d="M190,260 C120,240 55,275 60,305 C95,295 140,280 195,275 Z" fill="url(#rubyGrad)" filter="url(#dropShadow)" />
                    </g>
                </defs>

                {/* --- PEDESTAL --- */}
                <g transform="translate(0, 90)">
                    {/* Ambient Shadow */}
                    <ellipse cx="250" cy="340" rx="190" ry="45" fill="rgba(0,0,0,0.6)" filter="blur(15px)" />

                    {/* Base bottom lip (Gold) */}
                    <ellipse cx="250" cy="320" rx="140" ry="28" fill="url(#pedestalGold)" />
                    <path d="M 110 300 L 110 320 A 140 28 0 0 0 390 320 L 390 300 Z" fill="url(#pedestalGold)" />

                    {/* Top surface (Red Energy Ring) */}
                    <ellipse cx="250" cy="300" rx="140" ry="28" fill="url(#pedestalRed)" />
                    <ellipse cx="250" cy="300" rx="135" ry="25" fill="none" stroke="#FBBF24" strokeWidth="3" opacity="0.9" filter="url(#glow)" />

                    {/* Intense Inner Red Light reflection on pedestal */}
                    <ellipse cx="250" cy="300" rx="90" ry="18" fill="#FCA5A5" filter="blur(20px)" opacity="0.95" />
                </g>

                {/* --- BADGE ASSEMBLY --- */}
                <motion.g
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* WREATHS */}
                    <use href="#leftWreath" />
                    {/* Right wreath mirrored */}
                    <use href="#leftWreath" transform="scale(-1, 1) translate(-500, 0)" />

                    {/* --- THE MAIN SHIELD --- */}
                    <g filter="url(#dropShadow)">
                        {/* Base Shadow/Dark Rim */}
                        <path d="M 250 85 L 350 120 C 360 210 330 290 250 350 C 170 290 140 210 150 120 Z" fill="#2E0404" />

                        {/* Thick Gold Outer Bevel */}
                        <path d="M 250 88 L 345 122 C 355 208 325 285 250 344 C 175 285 145 208 155 122 Z" fill="url(#goldOuter)" stroke="#FEF08A" strokeWidth="1" />

                        {/* Inner Gold Bevel (Reversed gradient for 3D metallic edge) */}
                        <path d="M 250 102 L 330 132 C 338 202 312 272 250 326 C 188 272 162 202 170 132 Z" fill="url(#goldInner)" />

                        {/* Dark Crimson Center Background */}
                        <path d="M 250 108 L 322 138 C 328 202 304 268 250 318 C 196 268 172 202 178 138 Z" fill="#2E0404" />
                        <path d="M 250 112 L 318 140 C 322 200 298 262 250 310 C 202 262 178 200 182 140 Z" fill="url(#shieldBg)" />

                        {/* Glossy Overlay for depth (Specular Highlight) */}
                        <path d="M 250 112 L 318 140 C 318 160 270 190 250 190 C 230 190 182 160 182 140 Z" fill="url(#shieldGloss)" />
                        <path d="M 250 112 L 318 140 C 318 160 270 190 250 190 C 230 190 182 160 182 140 Z" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />

                        {/* --- CROWN --- */}
                        <g transform="translate(250, 85) scale(0.95)">
                            <path d="M -45 0 L -60 -35 L -20 -20 L 0 -55 L 20 -20 L 60 -35 L 45 0 Z" fill="url(#goldOuter)" filter="url(#glow)" stroke="#FFF4D0" strokeWidth="1.5" strokeLinejoin="round" />
                            <ellipse cx="0" cy="5" rx="50" ry="12" fill="url(#goldInner)" stroke="#4A3000" strokeWidth="1" />
                            {/* Crown Jewels (Ruby) */}
                            <circle cx="0" cy="-55" r="5" fill="#EF4444" filter="url(#rubyGlow)" />
                            <circle cx="-60" cy="-35" r="4" fill="#EF4444" />
                            <circle cx="60" cy="-35" r="4" fill="#EF4444" />
                        </g>

                        {/* --- HUGE 3D EXTRUDED 100 TEXT --- */}
                        {/* Layer 1: Darkest Shadow/Base Extrusion */}
                        <text x="250" y="258" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="135" fontWeight="900" fill="#2E0404" style={{ letterSpacing: '-6px' }}>
                            100
                        </text>
                        {/* Layer 2: Mid Extrusion */}
                        <text x="250" y="255" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="135" fontWeight="900" fill="#92400E" style={{ letterSpacing: '-6px' }}>
                            100
                        </text>
                        {/* Layer 3: Main Gold Face */}
                        <text x="250" y="250" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="135" fontWeight="900" fill="url(#goldOuter)" style={{ letterSpacing: '-6px' }}>
                            100
                        </text>
                        {/* Layer 4: Bright Highlight Edge */}
                        <text x="250" y="249" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="135" fontWeight="900" fill="none" stroke="#FFF0C2" strokeWidth="2" style={{ letterSpacing: '-6px', opacity: 0.8 }}>
                            100
                        </text>

                        {/* --- CENTURION MASTER RIBBON --- */}
                        <g transform="translate(250, 315)">
                            {/* Ribbon Tails (Folded back) */}
                            <path d="M -130 -25 L -170 0 L -120 20 Z" fill="#450A0A" />
                            <path d="M 130 -25 L 170 0 L 120 20 Z" fill="#450A0A" />
                            {/* Main Ribbon */}
                            <path d="M -145 -15 Q 0 -35 145 -15 L 135 20 Q 0 0 -135 20 Z" fill="url(#rubyGrad)" stroke="url(#goldOuter)" strokeWidth="3" filter="url(#dropShadow)" />
                            <path d="M -145 -15 Q 0 -35 145 -15 L 135 20 Q 0 0 -135 20 Z" fill="none" stroke="#FCA5A5" strokeWidth="1" opacity="0.4" />
                            {/* Ribbon Text */}
                            <text x="0" y="8" textAnchor="middle" fontFamily="sans-serif" fontSize="15" fontWeight="900" fill="#FEF08A" letterSpacing="1.5" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                CENTURION MASTER
                            </text>
                        </g>

                        {/* --- MASSIVE BOTTOM GLOWING RUBY DIAMOND --- */}
                        <g transform="translate(250, 370)">
                            {/* Massive Glow behind Diamond */}
                            <polygon points="0,-35 25,0 0,35 -25,0" fill="#EF4444" filter="url(#rubyGlow)" opacity="0.6" />
                            {/* Physical Diamond */}
                            <polygon points="0,-30 20,0 0,30 -20,0" fill="url(#rubyGrad)" stroke="#FCA5A5" strokeWidth="1.5" />
                            {/* Diamond 3D Facet highlights */}
                            <polygon points="0,-30 20,0 0,0 -20,0" fill="rgba(255,255,255,0.3)" />
                            <polygon points="-20,0 0,0 0,30" fill="rgba(0,0,0,0.3)" />
                            {/* Core Star Sparkle */}
                            <polygon points="0,-10 2,-2 10,0 2,2 0,10 -2,2 -10,0 -2,-2" fill="#FFFFFF" opacity="0.8" />
                        </g>

                    </g>
                </motion.g>
            </svg>
        </div>
    );
}

// --- DEMO APP INTERFACE --- //
export default function App() {
    const [isOpen, setIsOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <div className="min-h-screen bg-[#F0EBE1] dark:bg-[#050000] transition-colors duration-300 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background glow for the demo page */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(220,38,38,0.15)_0%,_transparent_50%)]" />

            <div className="text-center space-y-6 max-w-md w-full relative z-10">

                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight drop-shadow-sm">
                        Level 100 Achieved
                    </h1>
                    <p className="text-slate-500 dark:text-zinc-400 text-[16px]">
                        View the ultimate Centurion Master UI.
                    </p>
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#B91C1C] to-[#991B1B] hover:from-[#991B1B] hover:to-[#7F1D1D] text-white px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-[0_10px_40px_rgba(185,28,28,0.4)] border border-red-500/30"
                >
                    <Crown className="w-5 h-5 text-amber-300" />
                    <span className="tracking-wide">Show Mastery Badge</span>
                </button>

                <div className="pt-6 border-t border-slate-300 dark:border-zinc-800/50">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="flex items-center justify-center gap-2 mx-auto text-[15px] font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/5"
                    >
                        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
                    </button>
                </div>
            </div>

            <LevelUpModal open={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
}