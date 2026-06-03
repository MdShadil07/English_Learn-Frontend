import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Crown,
    Upload,
    Zap,
    Moon,
    Sun,
    Sparkles
} from 'lucide-react';

interface Props {
    open: boolean;
    onClose: () => void;
    level?: number;
    badgeName?: string;
    description?: string;
}

// Animation Variants for staggered entrance
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
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
    level = 20,
    badgeName = "Vocab Vanguard",
    description = "Your vocabulary is expanding faster than a dictionary! You're weaving through complex sentences with terrifying ease."
}: Props) {

    // Prevent scrolling when the modal is open
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

                    {/* Apple-style Cinematic Backdrop with deep blur */}
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 bg-black/40 dark:bg-black/70 pointer-events-auto"
                        onClick={onClose}
                    />

                    {/* Premium iOS-Style Drawer / Card */}
                    <motion.div
                        initial={{ y: "100%", scale: 0.95, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: "100%", scale: 0.95, opacity: 0 }}
                        transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 280,
                            mass: 0.9
                        }}
                        className="relative w-full max-w-none md:max-w-4xl mt-auto md:mt-0 pointer-events-auto bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-3xl rounded-t-[3rem] md:rounded-[3rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col md:flex-row border border-white/60 dark:border-white/10 before:absolute before:inset-0 before:rounded-t-[3rem] md:before:rounded-[3rem] before:shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:before:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] before:pointer-events-none"
                    >

                        {/* Mobile Drag Handle */}
                        <div className="md:hidden absolute top-4 inset-x-0 flex justify-center z-50">
                            <div className="w-14 h-1.5 bg-black/15 dark:bg-white/20 rounded-full" />
                        </div>

                        {/* Close Button (Desktop & Mobile) */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 md:top-6 md:right-6 w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 text-black/50 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center transition-all z-50 backdrop-blur-md"
                        >
                            <X className="w-5 h-5" strokeWidth={2.5} />
                        </button>

                        {/* --- LEFT SIDE: ARTWORK & CELEBRATION SHOWCASE --- */}
                        <div className="relative w-full h-[360px] md:h-auto md:w-[45%] lg:w-[45%] flex items-center justify-center overflow-hidden pt-12 md:pt-0 bg-gradient-to-b from-[#F0F5FF]/80 to-transparent dark:from-[#0F172A]/80 dark:to-transparent">

                            {/* Dynamic Confetti Explosion */}
                            <ConfettiBurst />

                            {/* Glowing Aura Behind Badge */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [1, 1.3, 1.2], opacity: [0, 1, 0.6] }}
                                transition={{ duration: 2.5, ease: "easeOut" }}
                                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.25)_0%,_transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.15)_0%,_transparent_65%)]"
                            />

                            {/* Multi-Wave Shockwave Rings */}
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, opacity: 0.8, borderWidth: "4px" }}
                                    animate={{ scale: 2.5, opacity: 0, borderWidth: "0px" }}
                                    transition={{
                                        duration: 2,
                                        ease: "easeOut",
                                        delay: i * 0.4,
                                        repeat: i === 0 ? 0 : Infinity,
                                        repeatDelay: 3
                                    }}
                                    className="absolute w-32 h-32 rounded-full border-blue-400/50 dark:border-blue-500/30 z-0"
                                />
                            ))}

                            {/* The Badge Artwork (SVG) */}
                            <motion.div
                                initial={{ y: 40, scale: 0.7, opacity: 0, rotateX: 30 }}
                                animate={{ y: 0, scale: 1, opacity: 1, rotateX: 0 }}
                                transition={{
                                    delay: 0.1,
                                    duration: 0.8,
                                    type: "spring",
                                    bounce: 0.5
                                }}
                                className="relative z-10 w-full max-w-[300px] md:max-w-[340px] aspect-square drop-shadow-[0_20px_40px_rgba(30,58,138,0.3)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                                style={{ perspective: 1000 }}
                            >
                                <BadgeArtwork level={level} />
                            </motion.div>
                        </div>

                        {/* --- RIGHT SIDE: CONTENT & TEXT (Staggered Animation) --- */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="w-full md:w-[55%] lg:w-[55%] p-7 md:p-10 lg:p-14 flex flex-col justify-center relative z-10"
                        >

                            <motion.div variants={itemVariants}>
                                {/* Premium Animated Milestone Pill */}
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-200/60 dark:border-blue-500/20 px-3.5 py-1.5 rounded-full mb-6 backdrop-blur-sm shadow-sm relative overflow-hidden group">
                                    <motion.div
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent skew-x-12"
                                    />
                                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                    <span className="text-[11px] font-bold tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 uppercase">
                                        Milestone Unlocked
                                    </span>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                {/* Heading (SF Pro Style - tight, bold) */}
                                <h2 className="text-[2.5rem] md:text-5xl lg:text-[3.25rem] font-black text-[#1D1D1F] dark:text-white mb-4 tracking-tight leading-[1.05]">
                                    Level <span className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 animate-pulse">20</span> Achieved!
                                </h2>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                {/* Subtitle / Role */}
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                                        <Crown className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" />
                                    </div>
                                    <span className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                                        {badgeName}
                                    </span>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                {/* Description */}
                                <p className="text-[#86868B] dark:text-[#A1A1A6] text-[16px] md:text-[17px] leading-relaxed mb-10 max-w-[95%] font-medium">
                                    {description}
                                </p>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                {/* Action / Info Card (Deep iOS Frosted Glass style) */}
                                <div className="bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 rounded-3xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all hover:bg-black/[0.05] dark:hover:bg-white/[0.05]">
                                    <div className="flex items-center gap-4 pl-1">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-amber-500 blur-md opacity-40 rounded-full" />
                                            <div className="relative w-12 h-12 rounded-full bg-gradient-to-b from-white to-amber-50 dark:from-zinc-800 dark:to-zinc-900 shadow-md flex items-center justify-center border border-black/5 dark:border-white/10">
                                                <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[#1D1D1F] dark:text-zinc-100 text-[15px] font-bold flex items-center gap-1.5 tracking-tight">
                                                You're on fire! <span className="text-lg leading-none">🔥</span>
                                            </p>
                                            <p className="text-[#86868B] dark:text-[#A1A1A6] text-[13px] font-medium mt-1 tracking-tight">
                                                Consistency today, fluency tomorrow.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={onClose}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-[#1D1D1F] dark:bg-white hover:bg-black dark:hover:bg-slate-100 text-white dark:text-black py-3 px-6 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95 tracking-tight"
                                    >
                                        <Upload className="w-4 h-4" strokeWidth={2.5} />
                                        <span className="text-[15px]">Share</span>
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

// --- 3D CELEBRATION PARTICLE SYSTEM --- //
function ConfettiBurst() {
    // Upgraded colors to match Platinum/Sapphire theme with Gold accents
    const colors = ['#60A5FA', '#818CF8', '#C084FC', '#FBBF24', '#E2E8F0', '#38BDF8'];
    const particles = Array.from({ length: 60 });

    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
            {particles.map((_, i) => {
                const angle = Math.random() * 360;
                const distance = 100 + Math.random() * 250;
                const x = Math.cos((angle * Math.PI) / 180) * distance;
                const y = Math.sin((angle * Math.PI) / 180) * distance;

                const shapeType = Math.random();
                let shapeClass = 'w-1.5 h-4 rounded-full'; // ribbon
                if (shapeType > 0.6) shapeClass = 'w-2.5 h-2.5 rounded-sm'; // square
                if (shapeType > 0.8) shapeClass = 'w-2 h-2 rounded-full'; // circle

                return (
                    <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotateX: 0, rotateY: 0 }}
                        animate={{
                            x,
                            y: y + (Math.random() * 80),
                            scale: Math.random() * 0.8 + 0.5,
                            opacity: [1, 1, 0],
                            rotateX: Math.random() * 1080,
                            rotateY: Math.random() * 1080,
                            rotateZ: Math.random() * 720
                        }}
                        transition={{
                            duration: 2.5 + Math.random(),
                            ease: [0.19, 1, 0.22, 1]
                        }}
                        className={`absolute ${shapeClass}`}
                        style={{ backgroundColor: colors[i % colors.length] }}
                    />
                );
            })}
        </div>
    );
}

// --- HIGH-FIDELITY 3D BADGE ARTWORK (PLATINUM/SAPPHIRE) --- //
function BadgeArtwork({ level }: { level: number }) {
    return (
        <div className="w-full h-full relative flex justify-center items-center">

            {/* Dynamic Rotating Light Rays (Cool Blue) */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 z-0 opacity-[0.4] scale-[1.8]"
                style={{
                    background: 'repeating-conic-gradient(from 0deg, transparent 0deg 12deg, rgba(59, 130, 246, 0.15) 12deg 24deg)'
                }}
            />

            <svg viewBox="0 0 400 400" className="w-full h-full z-10">
                <defs>
                    {/* Platinum / Silver Outer Gradients */}
                    <linearGradient id="platinumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="25%" stopColor="#E2E8F0" />
                        <stop offset="50%" stopColor="#94A3B8" />
                        <stop offset="85%" stopColor="#475569" />
                        <stop offset="100%" stopColor="#1E293B" />
                    </linearGradient>

                    <linearGradient id="platinumInnerGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F8FAFC" />
                        <stop offset="40%" stopColor="#CBD5E1" />
                        <stop offset="100%" stopColor="#64748B" />
                    </linearGradient>

                    {/* Deep Sapphire Blue Center */}
                    <linearGradient id="sapphireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1E3A8A" />
                        <stop offset="50%" stopColor="#172554" />
                        <stop offset="100%" stopColor="#020617" />
                    </linearGradient>

                    {/* Gold Accents for Wreaths and Stars */}
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFF7C5" />
                        <stop offset="25%" stopColor="#FAD36C" />
                        <stop offset="50%" stopColor="#E99D20" />
                        <stop offset="85%" stopColor="#A85705" />
                        <stop offset="100%" stopColor="#6C3500" />
                    </linearGradient>

                    {/* Obsidian / Dark Marble Pedestal Top & Base */}
                    <linearGradient id="pedestalTop" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F8FAFC" />
                        <stop offset="15%" stopColor="#FFFFFF" />
                        <stop offset="85%" stopColor="#E2E8F0" />
                        <stop offset="100%" stopColor="#CBD5E1" />
                    </linearGradient>

                    <linearGradient id="pedestalBase" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1E293B" />
                        <stop offset="25%" stopColor="#334155" />
                        <stop offset="75%" stopColor="#0F172A" />
                        <stop offset="100%" stopColor="#020617" />
                    </linearGradient>

                    {/* Deep Realistic Shadows */}
                    <filter id="dropShadow" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="28" stdDeviation="24" floodOpacity="0.4" floodColor="#0F172A" />
                    </filter>
                    <filter id="glowShadow" x="-40%" y="-40%" width="180%" height="180%">
                        <feDropShadow dx="0" dy="0" stdDeviation="15" floodOpacity="0.9" floodColor="#3B82F6" />
                    </filter>
                    <filter id="goldGlow" x="-40%" y="-40%" width="180%" height="180%">
                        <feDropShadow dx="0" dy="0" stdDeviation="10" floodOpacity="0.8" floodColor="#FBBF24" />
                    </filter>
                </defs>

                {/* --- PEDESTAL --- */}
                <g transform="translate(0, 50)">
                    {/* Ambient Ground Shadow */}
                    <ellipse cx="200" cy="285" rx="140" ry="32" fill="rgba(0,0,0,0.18)" filter="blur(10px)" />
                    {/* Base bottom lip */}
                    <ellipse cx="200" cy="270" rx="100" ry="25" fill="url(#pedestalBase)" />
                    {/* Base wall */}
                    <path d="M 100 255 L 100 270 A 100 25 0 0 0 300 270 L 300 255 Z" fill="url(#pedestalBase)" />
                    {/* Top surface */}
                    <ellipse cx="200" cy="255" rx="100" ry="25" fill="url(#pedestalTop)" />
                    {/* Inner Highlight Line */}
                    <ellipse cx="200" cy="255" rx="97" ry="24" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.9" />
                    <ellipse cx="200" cy="255" rx="95" ry="22" fill="none" stroke="#CBD5E1" strokeWidth="1" />
                    {/* Inner ambient glow on pedestal */}
                    <ellipse cx="200" cy="255" rx="65" ry="16" fill="#EFF6FF" filter="blur(12px)" opacity="0.9" />
                </g>

                {/* --- LEVITATING HEXAGON BADGE (PLATINUM) --- */}
                <motion.g
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* --- LAUREL WREATHS (GOLD ACCENT) --- */}
                    <g stroke="url(#goldGrad)" fill="none" strokeWidth="4" strokeLinecap="round" transform="translate(0, -10)">
                        {/* Left Branch */}
                        <path d="M 85 240 Q 45 180 90 100" />
                        <path d="M 80 220 Q 45 210 65 185" fill="url(#goldGrad)" stroke="none" />
                        <path d="M 70 190 Q 35 170 65 145" fill="url(#goldGrad)" stroke="none" />
                        <path d="M 75 155 Q 40 130 80 110" fill="url(#goldGrad)" stroke="none" />
                        <path d="M 90 125 Q 60 100 100 85" fill="url(#goldGrad)" stroke="none" />

                        {/* Right Branch */}
                        <path d="M 315 240 Q 355 180 310 100" />
                        <path d="M 320 220 Q 355 210 335 185" fill="url(#goldGrad)" stroke="none" />
                        <path d="M 330 190 Q 365 170 335 145" fill="url(#goldGrad)" stroke="none" />
                        <path d="M 325 155 Q 360 130 320 110" fill="url(#goldGrad)" stroke="none" />
                        <path d="M 310 125 Q 340 100 300 85" fill="url(#goldGrad)" stroke="none" />
                    </g>

                    <g transform="translate(0, -15)" filter="url(#dropShadow)">
                        {/* Outer Platinum Frame */}
                        <polygon
                            points="200,40 288,92 288,196 200,248 112,196 112,92"
                            fill="url(#platinumGrad)"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                        {/* Inner Platinum Bevel */}
                        <polygon
                            points="200,50 278,97 278,189 200,236 122,189 122,97"
                            fill="url(#platinumInnerGrad)"
                        />
                        {/* Deep Sapphire Center */}
                        <polygon
                            points="200,58 270,100 270,183 200,226 130,183 130,100"
                            fill="url(#sapphireGrad)"
                        />

                        {/* Glossy top highlight on dark center */}
                        <polygon
                            points="200,58 270,100 270,115 200,75 130,115 130,100"
                            fill="rgba(255,255,255,0.08)"
                        />
                        {/* Soft inner shadow inside the frame */}
                        <polygon
                            points="200,58 270,100 270,183 200,226 130,183 130,100"
                            fill="none"
                            stroke="rgba(0,0,0,0.5)"
                            strokeWidth="3"
                        />

                        {/* Large Level Text (20) */}
                        <text
                            x="200"
                            y="172"
                            textAnchor="middle"
                            fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
                            fontSize="96"
                            fontWeight="900"
                            fill="#FFFFFF"
                            style={{
                                textShadow: '0px 8px 20px rgba(0,0,0,0.8), 0px 0px 15px rgba(59,130,246,0.6)',
                                letterSpacing: '-4px'
                            }}
                        >
                            {level}
                        </text>

                        {/* --- 3-STAR PRESTIGE CLUSTER (Level 20 Upgrade) --- */}

                        {/* Left Small Star */}
                        <g transform="translate(165, 195) scale(0.5) rotate(-15)">
                            <polygon
                                points="0,-15 4,-5 15,-4 7,4 9,14 0,9 -9,14 -7,4 -15,-4 -4,-5"
                                fill="url(#goldGrad)"
                                filter="url(#goldGlow)"
                            />
                        </g>

                        {/* Center Large Star */}
                        <g transform="translate(200, 210) scale(0.8)">
                            <polygon
                                points="0,-15 4,-5 15,-4 7,4 9,14 0,9 -9,14 -7,4 -15,-4 -4,-5"
                                fill="url(#goldGrad)"
                                filter="url(#goldGlow)"
                            />
                        </g>

                        {/* Right Small Star */}
                        <g transform="translate(235, 195) scale(0.5) rotate(15)">
                            <polygon
                                points="0,-15 4,-5 15,-4 7,4 9,14 0,9 -9,14 -7,4 -15,-4 -4,-5"
                                fill="url(#goldGrad)"
                                filter="url(#goldGlow)"
                            />
                        </g>

                    </g>
                </motion.g>
            </svg>
        </div>
    );
}

// --- DEMO APP INTERFACE (To preview the component) --- //
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
        <div className="min-h-screen bg-[#F2F2F7] dark:bg-black transition-colors duration-300 font-sans flex flex-col items-center justify-center p-6 relative">
            <div className="text-center space-y-6 max-w-md w-full relative z-10">

                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                        Level 20 Prestige UI
                    </h1>
                    <p className="text-slate-500 dark:text-zinc-400 text-[15px]">
                        Trigger the upgraded Platinum & Sapphire showcase.
                    </p>
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-[#007AFF] hover:bg-[#006DEB] text-white px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-[0_8px_30px_rgba(0,122,255,0.3)]"
                >
                    <span>Trigger Prestige Drawer</span>
                </button>

                <div className="pt-6 border-t border-slate-200 dark:border-zinc-800">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="flex items-center justify-center gap-2 mx-auto text-[15px] font-medium text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/10"
                    >
                        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
                    </button>
                </div>
            </div>

            {/* Renders the upgraded Level 20 Badge */}
            <LevelUpModal open={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
}