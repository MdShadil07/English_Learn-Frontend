import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Share,
    Moon,
    Sun,
    ShieldCheck,
    Activity,
    Type,
    BookOpen,
    Quote,
    FileText,
    Star,
    Feather
} from 'lucide-react';

interface Props {
    open: boolean;
    onClose: () => void;
}

// Staggered Entrance Variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.15 }
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
    onClose
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

                    {/* Ethereal Cinematic Backdrop */}
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 bg-[#0F0C29]/40 dark:bg-black/70 pointer-events-auto"
                        onClick={onClose}
                    />

                    {/* Premium Desktop/Mobile Modal Card */}
                    <motion.div
                        initial={{ y: "100%", scale: 0.95, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: "100%", scale: 0.95, opacity: 0, transition: { duration: 0.3 } }}
                        transition={{ type: "spring", damping: 30, stiffness: 280, mass: 0.9 }}
                        className="relative w-full max-w-none md:max-w-4xl lg:max-w-[1050px] mt-auto md:mt-0 pointer-events-auto bg-gradient-to-br from-[#F8F9FF] to-[#ECEEFE] dark:from-[#130F25] dark:to-[#0B081A] rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-[0_0_80px_rgba(76,29,149,0.15)] dark:shadow-[0_0_80px_rgba(76,29,149,0.4)] flex flex-col border border-white/80 dark:border-purple-900/30 max-h-[92vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >

                        {/* Top Light Highlight */}
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white dark:via-purple-400/50 to-transparent z-50 pointer-events-none" />

                        {/* Mobile Drag Handle */}
                        <div className="md:hidden absolute top-4 inset-x-0 flex justify-center z-50 sticky top-0 pt-4 pb-2 bg-gradient-to-b from-[#F8F9FF] dark:from-[#130F25] to-transparent">
                            <div className="w-12 h-1.5 bg-[#D1D5DB] dark:bg-white/20 rounded-full" />
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 md:top-6 md:right-6 w-9 h-9 rounded-full bg-white/80 dark:bg-black/40 text-[#6B7280] dark:text-white/60 hover:text-[#111827] dark:hover:text-white hover:bg-white dark:hover:bg-black/60 flex items-center justify-center transition-all z-50 shadow-sm border border-black/5 dark:border-white/10 backdrop-blur-md"
                        >
                            <X className="w-4 h-4" strokeWidth={2.5} />
                        </button>

                        {/* --- LAYOUT SECTION --- */}
                        <div className="flex flex-col md:flex-row w-full flex-shrink-0">

                            {/* --- LEFT SIDE: THE ETHEREAL SHOWCASE --- */}
                            <div className="relative w-full h-[360px] md:h-auto md:w-[48%] lg:w-[45%] flex items-center justify-center overflow-hidden pt-6 md:pt-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFFFFF] via-[#F4F4FA] to-[#EAEBFE] dark:from-[#1E153B] dark:via-[#130F25] dark:to-[#0B081A]">

                                {/* Glowing Aura & Stars */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 z-0 opacity-40 scale-[2]"
                                    style={{
                                        background: 'repeating-conic-gradient(from 0deg, transparent 0deg 15deg, rgba(251, 191, 36, 0.1) 15deg 30deg)'
                                    }}
                                />

                                {/* Ethereal Orbs */}
                                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-400/20 dark:bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-amber-200/40 dark:bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

                                {/* Sparkling Stars Animation */}
                                <EtherealSparkles />

                                {/* The Legendary Feather Artwork (SVG) */}
                                <motion.div
                                    initial={{ y: 40, scale: 0.8, opacity: 0 }}
                                    animate={{ y: 0, scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.15, duration: 0.8, type: "spring", bounce: 0.4 }}
                                    className="relative z-10 w-full max-w-[320px] md:max-w-[420px] aspect-square drop-shadow-[0_20px_40px_rgba(76,29,149,0.15)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                                >
                                    <Accuracy100Artwork />
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
                                    {/* Rare Achievement Pill */}
                                    <div className="inline-flex items-center gap-1.5 bg-white/60 dark:bg-[#1E153B] border border-[#E9D5FF] dark:border-[#4C1D95] px-3.5 py-1.5 rounded-full mb-4 sm:mb-5 shadow-sm backdrop-blur-md">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#7C3AED] dark:text-[#C084FC]">
                                            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="currentColor" />
                                        </svg>
                                        <span className="text-[11px] font-bold tracking-widest text-[#6D28D9] dark:text-[#C084FC] uppercase">
                                            Rare Achievement Unlocked
                                        </span>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    {/* Epic Heading */}
                                    <h2 className="text-[2.25rem] sm:text-4xl md:text-[2.75rem] lg:text-[3.25rem] font-black text-[#1E1B4B] dark:text-white mb-3 tracking-tight leading-[1.1]">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FBBF24] via-[#D97706] to-[#92400E] drop-shadow-sm">100%</span> Overall Accuracy!
                                    </h2>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    {/* Subtitle */}
                                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                        <Feather className="w-5 h-5 text-[#D97706] dark:text-[#FBBF24] fill-[#FDE68A] dark:fill-none" />
                                        <span className="text-lg sm:text-xl font-bold text-[#4C1D95] dark:text-[#A78BFA] tracking-tight">
                                            Accuracy Master
                                        </span>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    {/* Description */}
                                    <p className="text-[#4B5563] dark:text-[#9CA3AF] text-[15px] sm:text-[16px] leading-relaxed mb-8 max-w-[95%]">
                                        An extraordinary achievement! You've scored a perfect 100% across all parameters. Your command of English is exceptional and truly inspiring.
                                    </p>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    {/* --- METRICS GRID --- */}
                                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-2 mb-8 w-full border-b border-[#E5E7EB] dark:border-[#2D2A4A] pb-8">
                                        <Metric icon={ShieldCheck} label="Grammar" />
                                        <Metric icon={Activity} label="Fluency" />
                                        <Metric icon={Type} label="Spelling" />
                                        <Metric icon={BookOpen} label="Vocabulary" />
                                        <Metric icon={Quote} label="Punctuation" />
                                        <Metric icon={FileText} label="Readability" />
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    {/* Premium Action Card */}
                                    <div className="relative bg-gradient-to-r from-[#2A1B54] to-[#1E1140] dark:from-[#1A103C] dark:to-[#0F0A24] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-[0_10px_30px_rgba(42,27,84,0.15)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#3B286D] dark:border-[#2D1B54] transition-all">

                                        <div className="flex items-center gap-4 pl-1">
                                            {/* Gold Star Circle */}
                                            <div className="relative w-12 h-12 rounded-full bg-[#130B29] dark:bg-black shadow-inner flex items-center justify-center border border-[#3B286D] dark:border-[#2D1B54] flex-shrink-0">
                                                <Star className="w-6 h-6 text-[#FBBF24] fill-[#FBBF24]" />
                                            </div>
                                            <div>
                                                <p className="text-white text-[14px] sm:text-[15px] font-bold tracking-tight mb-0.5 flex flex-wrap items-center gap-1">
                                                    A true inspiration! You're in the top 1% of learners worldwide. <span className="text-base">👑</span>
                                                </p>
                                                <p className="text-[#A78BFA] dark:text-[#8B5CF6] text-[12px] sm:text-[13px] font-medium tracking-tight leading-tight">
                                                    Keep shining and leading the way!
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={onClose}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#4C1D95] hover:bg-[#5B21B6] dark:bg-[#5B21B6] dark:hover:bg-[#6D28D9] text-white py-2.5 px-6 rounded-xl font-bold transition-all shadow-md border border-[#6D28D9] dark:border-[#7C3AED] active:scale-95 text-[14px] flex-shrink-0"
                                        >
                                            <Share className="w-4 h-4" strokeWidth={2.5} />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </motion.div>

                            </motion.div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// --- SUBCOMPONENTS ---

function Metric({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1E153B] flex items-center justify-center shadow-sm border border-[#E9D5FF] dark:border-[#3B286D]">
                <Icon className="w-5 h-5 text-[#6D28D9] dark:text-[#A78BFA]" />
            </div>
            <div className="text-center mt-1">
                <div className="text-[#1E1B4B] dark:text-white font-black text-[15px] leading-none">100%</div>
                <div className="text-[#6B7280] dark:text-[#9CA3AF] font-medium text-[11px] mt-0.5">{label}</div>
            </div>
        </div>
    );
}

// --- ETHEREAL GOLD & PURPLE SPARKS --- //
function EtherealSparkles() {
    const particles = Array.from({ length: 35 });

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {particles.map((_, i) => {
                const left = `${Math.random() * 100}%`;
                const top = `${Math.random() * 100}%`;
                const size = Math.random() * 3 + 1.5;
                const duration = Math.random() * 4 + 3;
                const delay = Math.random() * 5;

                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 1, 0.8, 0],
                            scale: [0, 1.2, 1, 0],
                            y: [0, -40]
                        }}
                        transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute rounded-full bg-[#FBBF24]"
                        style={{
                            left,
                            top,
                            width: size,
                            height: size,
                            boxShadow: `0 0 ${size * 3}px #FDE68A`
                        }}
                    />
                );
            })}
        </div>
    );
}

// --- PIXEL-PERFECT ACCURACY ARTWORK (FEATHER & PORTAL) --- //
function Accuracy100Artwork() {
    return (
        <div className="w-full h-full relative flex justify-center items-center">
            <svg viewBox="0 0 500 500" className="w-full h-full z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]">
                <defs>
                    {/* Outer Portal Gradients */}
                    <linearGradient id="goldRingOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFF4D0" />
                        <stop offset="25%" stopColor="#D97706" />
                        <stop offset="50%" stopColor="#FDE68A" />
                        <stop offset="75%" stopColor="#92400E" />
                        <stop offset="100%" stopColor="#FEF08A" />
                    </linearGradient>

                    {/* Deep Space Inner Portal Background */}
                    <radialGradient id="portalBg" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#1E153B" />
                        <stop offset="60%" stopColor="#0B081A" />
                        <stop offset="100%" stopColor="#05030A" />
                    </radialGradient>

                    {/* Feather White/Silver Body Gradient */}
                    <linearGradient id="featherBody" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="40%" stopColor="#F8FAFC" />
                        <stop offset="80%" stopColor="#E2E8F0" />
                        <stop offset="100%" stopColor="#CBD5E1" />
                    </linearGradient>

                    {/* Feather Gold Spine & Nib */}
                    <linearGradient id="featherGold" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#D97706" />
                        <stop offset="50%" stopColor="#FCD34D" />
                        <stop offset="100%" stopColor="#78350F" />
                    </linearGradient>

                    {/* Pedestal Gradients */}
                    <linearGradient id="pedestalTop" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="50%" stopColor="#F8FAFC" />
                        <stop offset="100%" stopColor="#E2E8F0" />
                    </linearGradient>
                    <linearGradient id="pedestalBase" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#D4AF37" />
                        <stop offset="50%" stopColor="#FDE68A" />
                        <stop offset="100%" stopColor="#92400E" />
                    </linearGradient>

                    {/* Ribbon Gradients */}
                    <linearGradient id="ribbonBg" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#2D1B69" />
                        <stop offset="100%" stopColor="#130B29" />
                    </linearGradient>

                    {/* Drop Shadows */}
                    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="15" stdDeviation="15" floodOpacity="0.3" floodColor="#000" />
                    </filter>
                    <filter id="featherShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="-5" dy="10" stdDeviation="8" floodOpacity="0.5" floodColor="#000" />
                    </filter>
                    <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="0" stdDeviation="10" floodOpacity="0.8" floodColor="#FBBF24" />
                    </filter>
                </defs>

                {/* --- PEDESTAL --- */}
                <g transform="translate(0, 85)">
                    {/* Ambient Shadow */}
                    <ellipse cx="250" cy="340" rx="180" ry="40" fill="rgba(0,0,0,0.15)" filter="blur(10px)" />

                    {/* Base bottom lip (Gold) */}
                    <ellipse cx="250" cy="330" rx="140" ry="28" fill="url(#pedestalBase)" />
                    <path d="M 110 310 L 110 330 A 140 28 0 0 0 390 330 L 390 310 Z" fill="url(#pedestalBase)" />

                    {/* Top surface (White Marble) */}
                    <ellipse cx="250" cy="310" rx="140" ry="28" fill="url(#pedestalTop)" />
                    <ellipse cx="250" cy="310" rx="135" ry="25" fill="none" stroke="#FDE68A" strokeWidth="2.5" opacity="0.9" />

                    {/* Inner Light reflection on pedestal */}
                    <ellipse cx="250" cy="310" rx="90" ry="16" fill="#FFFFFF" filter="blur(15px)" opacity="0.8" />
                </g>

                {/* --- BADGE ASSEMBLY --- */}
                <motion.g
                    animate={{ y: [-12, 12, -12] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* --- THE COSMIC PORTAL --- */}
                    <g filter="url(#dropShadow)">
                        {/* Outer Thick Gold Ring */}
                        <circle cx="250" cy="180" r="145" fill="none" stroke="url(#goldRingOuter)" strokeWidth="12" />
                        {/* Inner Thin Gold Ring */}
                        <circle cx="250" cy="180" r="132" fill="none" stroke="#FEF08A" strokeWidth="2" opacity="0.8" />

                        {/* Deep Space Background inside Portal */}
                        <circle cx="250" cy="180" r="130" fill="url(#portalBg)" />
                        <circle cx="250" cy="180" r="130" fill="none" stroke="#130B29" strokeWidth="6" inset="0" />

                        {/* Portal Streaks/Orbits */}
                        <g opacity="0.4">
                            <ellipse cx="250" cy="180" rx="120" ry="60" fill="none" stroke="#FDE68A" strokeWidth="1" transform="rotate(30 250 180)" strokeDasharray="10 20 40 10" />
                            <ellipse cx="250" cy="180" rx="110" ry="40" fill="none" stroke="#A78BFA" strokeWidth="0.5" transform="rotate(-45 250 180)" strokeDasharray="50 30" />
                            <ellipse cx="250" cy="180" rx="90" ry="90" fill="none" stroke="#FBBF24" strokeWidth="0.5" strokeDasharray="2 15" />
                        </g>

                        {/* Floating Gold Orbs inside Portal */}
                        <circle cx="160" cy="220" r="4" fill="#FDE68A" filter="url(#goldGlow)" />
                        <circle cx="330" cy="120" r="6" fill="#FBBF24" filter="url(#goldGlow)" />
                        <circle cx="200" cy="100" r="3" fill="#FFF" filter="url(#goldGlow)" />
                        <circle cx="290" cy="240" r="5" fill="#FDE68A" filter="url(#goldGlow)" />
                    </g>

                    {/* Floating Gold Orbs Outside Portal */}
                    <circle cx="90" cy="160" r="7" fill="#FDE68A" filter="url(#goldGlow)" />
                    <circle cx="410" cy="230" r="5" fill="#FBBF24" filter="url(#goldGlow)" />

                    {/* --- THE MASTER FEATHER --- */}
                    <g filter="url(#featherShadow)">
                        {/* Right side of feather (Lighter) */}
                        <path d="M 180 250 C 230 250 300 210 340 100 C 310 140 280 180 260 190 C 275 185 290 170 300 150 C 265 175 230 210 220 220 C 235 210 250 195 260 180 C 220 205 190 230 180 250 Z" fill="url(#featherBody)" />

                        {/* Left side of feather (Slightly darker for depth) */}
                        <path d="M 180 250 C 140 190 190 130 340 100 C 280 120 230 160 210 180 C 225 165 250 140 270 120 C 220 150 180 190 175 210 C 190 190 210 170 230 150 C 180 185 160 220 180 250 Z" fill="#F1F5F9" />

                        {/* Central Gold Spine */}
                        <path d="M 160 275 C 180 250 250 180 340 100" stroke="url(#featherGold)" strokeWidth="4" fill="none" strokeLinecap="round" />

                        {/* Detailed Feather Cuts (Vanes) */}
                        <path d="M 235 155 Q 260 125 285 110" stroke="url(#featherBody)" strokeWidth="1.5" fill="none" />
                        <path d="M 205 185 Q 240 155 265 140" stroke="url(#featherBody)" strokeWidth="1.5" fill="none" />
                        <path d="M 190 220 Q 220 190 250 175" stroke="url(#featherBody)" strokeWidth="1.5" fill="none" />

                        {/* The Gold Nib */}
                        <path d="M 160 275 L 170 245 L 180 255 Z" fill="url(#featherGold)" />
                        <path d="M 160 275 L 175 250" stroke="#78350F" strokeWidth="1.5" fill="none" />
                    </g>

                    {/* --- BOTTOM RIBBON: PERFECTION ACHIEVED --- */}
                    <g transform="translate(250, 300)" filter="url(#dropShadow)">
                        {/* Ribbon Tails */}
                        <path d="M -110 -15 L -140 10 L -100 20 Z" fill="#130B29" />
                        <path d="M 110 -15 L 140 10 L 100 20 Z" fill="#130B29" />
                        {/* Main Ribbon Body */}
                        <path d="M -125 -10 Q 0 -25 125 -10 L 115 20 Q 0 5 -115 20 Z" fill="url(#ribbonBg)" stroke="url(#goldOuter)" strokeWidth="2.5" />
                        <path d="M -125 -10 Q 0 -25 125 -10 L 115 20 Q 0 5 -115 20 Z" fill="none" stroke="#A78BFA" strokeWidth="0.5" opacity="0.5" />
                        {/* Ribbon Text */}
                        <text x="0" y="10" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fontWeight="900" fill="#FEF08A" letterSpacing="1.5">
                            PERFECTION ACHIEVED
                        </text>
                    </g>

                    {/* --- BOTTOM HANGING 4-POINT STAR --- */}
                    <g transform="translate(250, 335) scale(0.9)">
                        <path d="M 0 -15 Q 3 -3 15 0 Q 3 3 0 15 Q -3 3 -15 0 Q -3 -3 0 -15 Z" fill="url(#goldOuter)" filter="url(#goldGlow)" />
                        {/* Star inner shine */}
                        <path d="M 0 -15 Q 1 -1 15 0 Q 1 1 0 15 Z" fill="#FFF" opacity="0.6" />
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
        <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#05030A] transition-colors duration-300 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background glow for the demo page */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(109,40,217,0.08)_0%,_transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,_rgba(109,40,217,0.15)_0%,_transparent_50%)]" />

            <div className="text-center space-y-6 max-w-md w-full relative z-10">

                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight drop-shadow-sm">
                        100% Accuracy
                    </h1>
                    <p className="text-slate-500 dark:text-zinc-400 text-[16px]">
                        View the ethereal Perfection Achieved UI.
                    </p>
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6D28D9] to-[#4C1D95] hover:from-[#5B21B6] hover:to-[#3B0764] text-white px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-[0_10px_30px_rgba(109,40,217,0.3)] border border-purple-500/30"
                >
                    <Feather className="w-5 h-5 text-amber-300" />
                    <span className="tracking-wide">Show Accuracy Badge</span>
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