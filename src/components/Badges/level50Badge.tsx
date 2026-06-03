import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Crown,
    Share,
    Trophy,
    Moon,
    Sun
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
    level = 50,
    badgeName = "Legendary Achiever",
    description = "An extraordinary milestone reached by few and earned by dedication, consistency and unstoppable passion. You're not just learning. You're inspiring!"
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

                    {/* Deep Cinematic Vignette Backdrop */}
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 bg-black/40 dark:bg-black/70 pointer-events-auto"
                        onClick={onClose}
                    />

                    {/* Premium Desktop/Mobile Modal Card */}
                    <motion.div
                        initial={{ y: "100%", scale: 0.95, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: "100%", scale: 0.95, opacity: 0, transition: { duration: 0.3 } }}
                        transition={{ type: "spring", damping: 30, stiffness: 280, mass: 0.9 }}
                        className="relative w-full max-w-none md:max-w-4xl lg:max-w-5xl mt-auto md:mt-0 pointer-events-auto bg-[#FBF9F6] dark:bg-[#121212] rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-[0_0_60px_rgba(0,0,0,0.15)] dark:shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row border border-white/80 dark:border-white/10"
                    >

                        {/* Mobile Drag Handle */}
                        <div className="md:hidden absolute top-3 inset-x-0 flex justify-center z-50">
                            <div className="w-12 h-1.5 bg-slate-300 dark:bg-zinc-700 rounded-full" />
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 md:top-6 md:right-6 w-9 h-9 rounded-full bg-white dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-700 flex items-center justify-center transition-all z-50 shadow-sm border border-slate-200 dark:border-zinc-700"
                        >
                            <X className="w-4 h-4" strokeWidth={2.5} />
                        </button>

                        {/* --- LEFT SIDE: THE GRAND SHOWCASE --- */}
                        <div className="relative w-full h-[380px] md:h-auto md:w-[48%] lg:w-[45%] flex items-center justify-center overflow-hidden pt-10 md:pt-0 bg-gradient-to-b from-[#FFFDF9] to-[#F4EEE6] dark:from-[#1E1A24] dark:to-[#0F0D14]">

                            {/* Majestic Glow Aura & Rays */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 z-0 opacity-60 dark:opacity-40 scale-[2]"
                                style={{
                                    background: 'repeating-conic-gradient(from 0deg, transparent 0deg 12deg, rgba(251, 191, 36, 0.15) 12deg 24deg)'
                                }}
                            />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.8)_0%,_transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,_rgba(251,191,36,0.15)_0%,_transparent_70%)]" />

                            {/* Falling Gold Confetti */}
                            <ConfettiParticles />

                            {/* The Grand Shield Artwork (SVG) */}
                            <motion.div
                                initial={{ y: 40, scale: 0.8, opacity: 0 }}
                                animate={{ y: 0, scale: 1, opacity: 1 }}
                                transition={{ delay: 0.15, duration: 0.8, type: "spring", bounce: 0.4 }}
                                className="relative z-10 w-full max-w-[340px] md:max-w-[400px] aspect-square"
                            >
                                <Level50Artwork level={level} />
                            </motion.div>
                        </div>

                        {/* --- RIGHT SIDE: PREMIUM CONTENT --- */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="w-full md:w-[52%] lg:w-[55%] p-7 md:p-10 lg:p-14 flex flex-col justify-center relative z-10"
                        >

                            <motion.div variants={itemVariants}>
                                {/* Milestone Pill */}
                                <div className="inline-flex items-center gap-1.5 bg-[#FEF4E6] dark:bg-[#3D2914] border border-[#FDE3C2] dark:border-[#5C3D1E] px-3.5 py-1.5 rounded-full mb-5 shadow-sm">
                                    <Trophy className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FBBF24]" />
                                    <span className="text-[11px] font-bold tracking-widest text-[#B45309] dark:text-[#FBBF24] uppercase">
                                        Milestone Unlocked
                                    </span>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                {/* Epic Heading */}
                                <h2 className="text-[2.5rem] md:text-5xl lg:text-[3.5rem] font-black text-[#1C1C1E] dark:text-white mb-4 tracking-tight leading-[1.05]">
                                    Level <span className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-[#FCE182] via-[#EFA629] to-[#C96B10] drop-shadow-sm filter">50</span> Achieved!
                                </h2>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                {/* Title */}
                                <div className="flex items-center gap-2.5 mb-5">
                                    <Crown className="w-6 h-6 text-[#5B21B6] dark:text-[#A78BFA]" fill="currentColor" />
                                    <span className="text-xl md:text-2xl font-bold text-[#5B21B6] dark:text-[#A78BFA] tracking-tight">
                                        {badgeName}
                                    </span>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                {/* Description */}
                                <p className="text-[#5A5A5C] dark:text-[#A1A1AA] text-[15px] md:text-[17px] leading-relaxed mb-8 max-w-[95%]">
                                    {description}
                                </p>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                {/* Plaque-Style Action Card */}
                                <div className="relative bg-[#FCFBFA] dark:bg-[#1A1A1A] border border-[#EFEBE4] dark:border-[#2A2A2A] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm transition-all">

                                    <div className="flex items-center gap-4 pl-1">
                                        {/* Unique Purple Circle Icon */}
                                        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#4C1D95] to-[#2E1065] shadow-inner flex items-center justify-center border border-[#5B21B6]">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#FBBF24]">
                                                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[#1C1C1E] dark:text-zinc-100 text-[15px] font-bold tracking-tight mb-0.5 flex items-center gap-1">
                                                You're in the top 5% of learners! <span className="text-base">🔥</span>
                                            </p>
                                            <p className="text-[#71717A] dark:text-[#A1A1AA] text-[13px] font-medium tracking-tight">
                                                Keep pushing boundaries. The world is your classroom.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={onClose}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-[#27272A] hover:bg-slate-50 dark:hover:bg-[#3F3F46] text-[#1C1C1E] dark:text-white py-2.5 px-5 rounded-xl font-bold transition-all shadow-sm border border-slate-200 dark:border-white/10 active:scale-95 text-[15px]"
                                    >
                                        <Share className="w-4 h-4" strokeWidth={2.5} />
                                        <span>Share</span>
                                    </button>
                                </div>
                            </motion.div>

                        </motion.div>
                    </motion.div>

                </div>
            )}
        </AnimatePresence>
    );
}

// --- GOLD CONFETTI SYSTEM --- //
function ConfettiParticles() {
    const particles = Array.from({ length: 30 });

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {particles.map((_, i) => {
                const left = `${Math.random() * 100}%`;
                const isSquare = Math.random() > 0.5;
                const size = isSquare ? (Math.random() * 6 + 4) : (Math.random() * 8 + 6);
                const duration = Math.random() * 5 + 5;
                const delay = Math.random() * 5;

                return (
                    <motion.div
                        key={i}
                        initial={{ y: '-20%', x: 0, opacity: 0, rotate: 0 }}
                        animate={{
                            y: '120%',
                            x: Math.random() * 100 - 50,
                            opacity: [0, 1, 1, 0],
                            rotate: Math.random() * 360
                        }}
                        transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
                        className={`absolute ${isSquare ? 'bg-[#FBBF24]' : 'bg-[#FDE68A]'}`}
                        style={{
                            left,
                            width: size,
                            height: isSquare ? size : size / 2,
                            borderRadius: isSquare ? '2px' : '0px',
                            boxShadow: '0 0 10px rgba(251, 191, 36, 0.4)'
                        }}
                    />
                );
            })}
        </div>
    );
}

// --- PIXEL-PERFECT LEVEL 50 ARTWORK (SHIELD & WINGS) --- //
function Level50Artwork({ level }: { level: number }) {
    return (
        <div className="w-full h-full relative flex justify-center items-center">
            <svg viewBox="0 0 500 500" className="w-full h-full z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_30px_50px_rgba(0,0,0,0.7)]">
                <defs>
                    {/* Ultra-Realistic 3D Metallic Gold Gradients */}
                    <linearGradient id="goldOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFEAA7" />
                        <stop offset="25%" stopColor="#D4AF37" />
                        <stop offset="45%" stopColor="#8A5A19" />
                        <stop offset="55%" stopColor="#FFF0C2" />
                        <stop offset="75%" stopColor="#C59B27" />
                        <stop offset="100%" stopColor="#4A3000" />
                    </linearGradient>

                    <linearGradient id="goldInner" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFDF73" />
                        <stop offset="35%" stopColor="#B8860B" />
                        <stop offset="50%" stopColor="#FFF8DC" />
                        <stop offset="65%" stopColor="#DAA520" />
                        <stop offset="100%" stopColor="#5C4033" />
                    </linearGradient>

                    {/* Deep Royal Purple Shield Base (Metallic Lacquer) */}
                    <linearGradient id="shieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4C1D95" />
                        <stop offset="30%" stopColor="#2E1065" />
                        <stop offset="50%" stopColor="#7C3AED" />
                        <stop offset="70%" stopColor="#1E0B4B" />
                        <stop offset="100%" stopColor="#0F0524" />
                    </linearGradient>

                    <linearGradient id="shieldGloss" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                        <stop offset="30%" stopColor="rgba(255,255,255,0.05)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>

                    {/* Purple Gem/Jewel Gradients */}
                    <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E9D5FF" />
                        <stop offset="40%" stopColor="#7E22CE" />
                        <stop offset="100%" stopColor="#3B0764" />
                    </linearGradient>

                    <linearGradient id="gemGradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F5D0FE" />
                        <stop offset="50%" stopColor="#A855F7" />
                        <stop offset="100%" stopColor="#4C1D95" />
                    </linearGradient>

                    {/* Pedestal Gradients */}
                    <linearGradient id="pedestalWhite" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#E2E8F0" />
                        <stop offset="20%" stopColor="#FFFFFF" />
                        <stop offset="80%" stopColor="#F8FAFC" />
                        <stop offset="100%" stopColor="#CBD5E1" />
                    </linearGradient>

                    <linearGradient id="pedestalGold" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#92510A" />
                        <stop offset="30%" stopColor="#EAB308" />
                        <stop offset="50%" stopColor="#FFF4D0" />
                        <stop offset="70%" stopColor="#FCD34D" />
                        <stop offset="100%" stopColor="#78350F" />
                    </linearGradient>

                    {/* Shadows */}
                    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="0" stdDeviation="12" floodOpacity="0.7" floodColor="#FBBF24" />
                    </filter>

                    <filter id="gemGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="0" stdDeviation="15" floodOpacity="0.9" floodColor="#A855F7" />
                    </filter>

                    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="12" stdDeviation="8" floodOpacity="0.5" floodColor="#000000" />
                    </filter>

                    {/* Symmetrical Left Wing Definition */}
                    <g id="leftWing">
                        {/* Outer large feathers */}
                        <path d="M190,165 C130,105 50,110 30,150 C80,180 130,205 180,210 Z" fill="url(#goldOuter)" stroke="#4A3000" strokeWidth="1.5" filter="url(#dropShadow)" />
                        <path d="M185,200 C110,155 35,175 25,210 C75,230 130,240 180,245 Z" fill="url(#goldOuter)" stroke="#4A3000" strokeWidth="1.5" filter="url(#dropShadow)" />
                        <path d="M180,235 C100,205 30,235 25,270 C70,275 120,270 185,270 Z" fill="url(#goldOuter)" stroke="#4A3000" strokeWidth="1.5" filter="url(#dropShadow)" />
                        <path d="M180,270 C100,250 40,300 45,335 C80,320 130,295 190,285 Z" fill="url(#goldOuter)" stroke="#4A3000" strokeWidth="1.5" filter="url(#dropShadow)" />

                        {/* Inner layered feathers (lighter) */}
                        <path d="M190,175 C140,125 70,130 55,160 C95,185 140,210 185,215 Z" fill="url(#goldInner)" stroke="#FFF4D0" strokeWidth="0.5" />
                        <path d="M185,210 C125,175 60,190 50,220 C90,235 140,245 185,250 Z" fill="url(#goldInner)" stroke="#FFF4D0" strokeWidth="0.5" />
                        <path d="M180,245 C115,220 55,245 50,275 C85,275 130,275 185,275 Z" fill="url(#goldInner)" stroke="#FFF4D0" strokeWidth="0.5" />

                        {/* Dark Purple Feathers interwoven at base */}
                        <path d="M185,225 C130,195 70,210 60,240 C100,255 140,265 190,265 Z" fill="#3B1C6B" />
                        <path d="M190,260 C120,240 60,280 65,310 C95,295 140,280 195,275 Z" fill="#2E1154" />
                    </g>
                </defs>

                {/* --- PEDESTAL --- */}
                <g transform="translate(0, 90)">
                    {/* Ambient Shadow */}
                    <ellipse cx="250" cy="335" rx="170" ry="40" fill="rgba(0,0,0,0.25)" filter="blur(12px)" />

                    {/* Base bottom lip (Gold) */}
                    <ellipse cx="250" cy="320" rx="130" ry="25" fill="url(#pedestalGold)" />
                    <path d="M 120 300 L 120 320 A 130 25 0 0 0 380 320 L 380 300 Z" fill="url(#pedestalGold)" />

                    {/* Top surface (White Marble) */}
                    <ellipse cx="250" cy="300" rx="130" ry="25" fill="url(#pedestalWhite)" />
                    <ellipse cx="250" cy="300" rx="125" ry="22" fill="none" stroke="#FDE68A" strokeWidth="2.5" opacity="0.9" />

                    {/* Inner Light reflection on pedestal */}
                    <ellipse cx="250" cy="300" rx="85" ry="16" fill="#FFFFFF" filter="blur(12px)" opacity="0.95" />
                </g>

                {/* --- BADGE ASSEMBLY --- */}
                <motion.g
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* WINGS */}
                    <use href="#leftWing" />
                    {/* Right wing mirrored */}
                    <use href="#leftWing" transform="scale(-1, 1) translate(-500, 0)" />

                    {/* --- THE MAIN SHIELD --- */}
                    <g filter="url(#dropShadow)">
                        {/* Base Shadow/Dark Rim */}
                        <path d="M 250 85 L 340 120 C 350 200 320 280 250 340 C 180 280 150 200 160 120 Z" fill="#4A3000" />

                        {/* Thick Gold Outer Bevel */}
                        <path d="M 250 88 L 337 122 C 347 198 318 277 250 336 C 182 277 153 198 163 122 Z" fill="url(#goldOuter)" stroke="#FFF4D0" strokeWidth="1" />

                        {/* Inner Gold Bevel (Reversed gradient for 3D metallic edge) */}
                        <path d="M 250 100 L 325 130 C 330 195 305 265 250 320 C 195 265 170 195 175 130 Z" fill="url(#goldInner)" />

                        {/* Dark Purple Center Background */}
                        <path d="M 250 106 L 319 135 C 324 195 299 259 250 312 C 201 259 176 195 181 135 Z" fill="#150530" />
                        <path d="M 250 110 L 315 138 C 320 195 295 255 250 305 C 205 255 180 195 185 138 Z" fill="url(#shieldBg)" />

                        {/* Glossy Overlay for depth (Specular Highlight) */}
                        <path d="M 250 110 L 315 138 C 315 155 270 185 250 185 C 230 185 185 155 185 138 Z" fill="url(#shieldGloss)" />
                        <path d="M 250 110 L 315 138 C 315 155 270 185 250 185 C 230 185 185 155 185 138 Z" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.3" />

                        {/* --- CROWN --- */}
                        <g transform="translate(250, 85) scale(0.9)">
                            <path d="M -45 0 L -60 -35 L -20 -20 L 0 -55 L 20 -20 L 60 -35 L 45 0 Z" fill="url(#goldOuter)" filter="url(#glow)" stroke="#FFF4D0" strokeWidth="1.5" strokeLinejoin="round" />
                            <ellipse cx="0" cy="5" rx="50" ry="12" fill="url(#goldInner)" stroke="#4A3000" strokeWidth="1" />
                            {/* Crown Diamond */}
                            <polygon points="0,-45 8,-30 0,-15 -8,-30" fill="url(#gemGrad)" filter="url(#gemGlow)" stroke="#E9D5FF" strokeWidth="1" />
                            {/* Crown Specular Highlights */}
                            <circle cx="-60" cy="-35" r="2" fill="#FFFFFF" opacity="0.8" />
                            <circle cx="60" cy="-35" r="2" fill="#FFFFFF" opacity="0.8" />
                        </g>

                        {/* --- STARS ON SHIELD --- */}
                        {/* Left Star */}
                        <g transform="translate(170, 140) scale(0.5) rotate(-15)">
                            <polygon points="0,-15 4,-5 15,-4 7,4 9,14 0,9 -9,14 -7,4 -15,-4 -4,-5" fill="url(#goldOuter)" filter="url(#glow)" stroke="#FFF" strokeWidth="0.5" />
                        </g>
                        {/* Right Star */}
                        <g transform="translate(330, 140) scale(0.5) rotate(15)">
                            <polygon points="0,-15 4,-5 15,-4 7,4 9,14 0,9 -9,14 -7,4 -15,-4 -4,-5" fill="url(#goldOuter)" filter="url(#glow)" stroke="#FFF" strokeWidth="0.5" />
                        </g>

                        {/* --- HUGE 3D EXTRUDED 50 TEXT --- */}
                        {/* Layer 1: Darkest Shadow/Base Extrusion */}
                        <text x="250" y="262" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="115" fontWeight="900" fill="#2E1600" style={{ letterSpacing: '-4px' }}>
                            50
                        </text>
                        {/* Layer 2: Mid Extrusion */}
                        <text x="250" y="259" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="115" fontWeight="900" fill="#8A5A19" style={{ letterSpacing: '-4px' }}>
                            50
                        </text>
                        {/* Layer 3: Main Gold Face */}
                        <text x="250" y="255" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="115" fontWeight="900" fill="url(#goldOuter)" style={{ letterSpacing: '-4px' }}>
                            50
                        </text>
                        {/* Layer 4: Bright Highlight Edge */}
                        <text x="250" y="254" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontSize="115" fontWeight="900" fill="none" stroke="#FFF0C2" strokeWidth="1.5" style={{ letterSpacing: '-4px', opacity: 0.8 }}>
                            50
                        </text>

                        {/* --- LEGENDARY ACHIEVER RIBBON --- */}
                        <g transform="translate(250, 310)">
                            {/* Ribbon Tails (Folded back) */}
                            <path d="M -110 -25 L -145 0 L -100 20 Z" fill="#2E1600" />
                            <path d="M 110 -25 L 145 0 L 100 20 Z" fill="#2E1600" />
                            {/* Main Ribbon */}
                            <path d="M -125 -15 Q 0 -35 125 -15 L 115 15 Q 0 0 -115 15 Z" fill="url(#shieldBg)" stroke="url(#goldOuter)" strokeWidth="3" />
                            <path d="M -125 -15 Q 0 -35 125 -15 L 115 15 Q 0 0 -115 15 Z" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.3" />
                            {/* Ribbon Text */}
                            <text x="0" y="5" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill="#FFF0C2" letterSpacing="1.5">
                                LEGENDARY ACHIEVER
                            </text>
                        </g>

                        {/* --- BOTTOM FLOATING PURPLE DIAMOND --- */}
                        <g transform="translate(250, 360)">
                            <polygon points="0,-22 13,0 0,22 -13,0" fill="url(#gemGradPurple)" filter="url(#gemGlow)" stroke="#F5D0FE" strokeWidth="1" />
                            {/* Diamond 3D Facet highlight */}
                            <polygon points="0,-22 13,0 0,0 -13,0" fill="rgba(255,255,255,0.3)" />
                            <polygon points="-13,0 0,0 0,22" fill="rgba(0,0,0,0.2)" />
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
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <div className="min-h-screen bg-[#F0EBE1] dark:bg-[#0A0A0C] transition-colors duration-300 font-sans flex flex-col items-center justify-center p-6 relative">
            <div className="text-center space-y-6 max-w-md w-full relative z-10">

                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                        Level 50 Achieved
                    </h1>
                    <p className="text-slate-500 dark:text-zinc-400 text-[16px]">
                        View the exact pixel-perfect UI.
                    </p>
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-[#5B21B6] hover:bg-[#4C1D95] text-white px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-[0_10px_40px_rgba(91,33,182,0.4)]"
                >
                    <Crown className="w-5 h-5" />
                    <span>Show Badge UI</span>
                </button>

                <div className="pt-6 border-t border-slate-300 dark:border-zinc-800">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="flex items-center justify-center gap-2 mx-auto text-[15px] font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/10"
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