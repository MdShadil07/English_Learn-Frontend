import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Check, Bold, Italic, Type } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- HIGH-FIDELITY BANNER PRESETS ---
export const BANNER_PRESETS = [
    {
        id: 'cosmic-blue',
        name: 'Cosmic Blue',
        bgClass: 'bg-[#0B0F19]',
        thumbClass: 'bg-gradient-to-br from-blue-600 to-indigo-900',
        elements: (
            <>
                <div className="absolute -top-20 -right-10 w-64 h-64 bg-blue-600/40 blur-[50px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-indigo-600/40 blur-[50px] rounded-full pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            </>
        )
    },
    {
        id: 'emerald-aurora',
        name: 'Emerald Aurora',
        bgClass: 'bg-[#05110D]',
        thumbClass: 'bg-gradient-to-br from-emerald-500 to-teal-900',
        elements: (
            <>
                <div className="absolute top-[-30%] left-[10%] w-72 h-40 bg-emerald-500/30 blur-[45px] rounded-full pointer-events-none rotate-12" />
                <div className="absolute bottom-[-30%] right-[10%] w-72 h-40 bg-teal-500/30 blur-[45px] rounded-full pointer-events-none -rotate-12" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            </>
        )
    },
    {
        id: 'crimson-dawn',
        name: 'Crimson Dawn',
        bgClass: 'bg-[#170808]',
        thumbClass: 'bg-gradient-to-br from-rose-500 to-orange-900',
        elements: (
            <>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-32 bg-orange-500/20 blur-[50px] rounded-full pointer-events-none rotate-45" />
                <div className="absolute -bottom-10 right-0 w-48 h-48 bg-rose-600/30 blur-[40px] rounded-full pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none opacity-50" />
            </>
        )
    },
    {
        id: 'ethereal-void',
        name: 'Ethereal Void',
        bgClass: 'bg-[#0B0714]',
        thumbClass: 'bg-gradient-to-br from-fuchsia-600 to-violet-900',
        elements: (
            <>
                <div className="absolute -top-16 left-0 w-56 h-56 bg-fuchsia-600/30 blur-[45px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-16 right-0 w-56 h-56 bg-violet-600/30 blur-[45px] rounded-full pointer-events-none" />
            </>
        )
    }
];

// --- FONT PRESETS ---
const FONT_FAMILIES = [
    { id: 'sans', label: 'Modern', value: 'system-ui, -apple-system, sans-serif' },
    { id: 'serif', label: 'Elegant', value: 'Georgia, serif' },
    { id: 'cursive', label: 'Cursive', value: '"Caveat", cursive' },
    { id: 'display', label: 'Display', value: '"Righteous", cursive' },
];

export interface BannerSettings {
    text: string;
    fontFamily: string;
    isBold: boolean;
    isItalic: boolean;
    fontSize: number;
}

interface RoomBannerSelectorProps {
    selectedBannerId?: string;
    onSelectBanner?: (id: string) => void;
    onUploadClick?: () => void;
    customImageUrl?: string | null;
    bannerSettings: BannerSettings;
    onBannerSettingsChange: (settings: BannerSettings) => void;
}

// --- THE REUSABLE BANNER SELECTOR COMPONENT ---
export function RoomBannerSelector({
    selectedBannerId = BANNER_PRESETS[0].id,
    onSelectBanner,
    onUploadClick,
    customImageUrl,
    bannerSettings,
    onBannerSettingsChange
}: RoomBannerSelectorProps) {

    const activeIndex = BANNER_PRESETS.findIndex(b => b.id === selectedBannerId);
    const activeBanner = BANNER_PRESETS[activeIndex >= 0 ? activeIndex : 0];

    const {
        text: bannerText,
        fontFamily,
        isBold,
        isItalic,
        fontSize
    } = bannerSettings;

    const updateSetting = (key: keyof BannerSettings, value: any) => {
        onBannerSettingsChange({ ...bannerSettings, [key]: value });
    };

    return (
        <div className="space-y-3 w-full">
            {/* Inject Google Fonts for special display/cursive fonts */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Righteous&display=swap');
      `}} />

            <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Room Banner</label>
                <span className="text-[10px] text-white/30 font-medium">{activeBanner.name}</span>
            </div>

            {/* Active Banner Preview Area */}
            <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-white/10 shadow-inner group">

                <AnimatePresence mode="wait">
                    {customImageUrl ? (
                        <motion.img
                            key="custom-image"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            src={customImageUrl}
                            alt="Custom Banner"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <motion.div
                            key={activeBanner.id}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className={cn("absolute inset-0 w-full h-full", activeBanner.bgClass)}
                        >
                            {/* Decorative Elements */}
                            {activeBanner.elements}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Universal Noise Overlay */}
                <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAApb+/ZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAADUExURf///6f99X8AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAFpJREFUOE/t1TESwDAIA0D8/6fT5iaN5CidInYmYisYAsYBA2N7R9Xat7W9t7Rvtbe3u693X/e9ve93X/e9ve93X/e9ve93X/e9ve93X/e9ve93X/e9ve93X+8/8B9A9AByAwE/4E6sYAAAAABJRU5ErkJggg==')] opacity-10 mix-blend-overlay z-10 pointer-events-none"></div>

                {/* Custom Text Overlay */}
                <div className="absolute inset-0 z-20 flex items-center justify-center p-6 text-center pointer-events-none">
                    <h2
                        className={cn(
                            "text-white drop-shadow-xl transition-all duration-300 break-words max-w-full",
                            isBold ? "font-bold" : "font-normal",
                            isItalic ? "italic" : "not-italic"
                        )}
                        style={{
                            fontFamily: fontFamily,
                            fontSize: `${fontSize}px`,
                            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
                        }}
                    >
                        {bannerText || " "}
                    </h2>
                </div>

                {/* Upload Overlay Button */}
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-300">
                    <button
                        type="button"
                        onClick={onUploadClick}
                        className="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center shadow-2xl"
                    >
                        <ImageIcon className="w-4 h-4 mr-2" /> Upload Custom Cover
                    </button>
                </div>
            </div>

            {/* Thumbnail Selector */}
            <div className="flex items-center gap-3 mt-4">
                {BANNER_PRESETS.map((banner) => {
                    const isSelected = selectedBannerId === banner.id;
                    return (
                        <button
                            key={banner.id}
                            type="button"
                            onClick={() => onSelectBanner?.(banner.id)}
                            className={cn(
                                "relative w-12 h-12 rounded-xl overflow-hidden transition-all duration-300 group",
                                isSelected
                                    ? "ring-2 ring-white ring-offset-2 ring-offset-[#1A1A1A] scale-100 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                                    : "ring-1 ring-white/10 hover:ring-white/30 scale-95 hover:scale-100 opacity-60 hover:opacity-100"
                            )}
                        >
                            <div className={cn("absolute inset-0", banner.thumbClass)}></div>
                            <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAApb+/ZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAADUExURf///6f99X8AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAFpJREFUOE/t1TESwDAIA0D8/6fT5iaN5CidInYmYisYAsYBA2N7R9Xat7W9t7Rvtbe3u693X/e9ve93X/e9ve93X/e9ve93X/e9ve93X/e9ve93X/e9ve93X+8/8B9A9AByAwE/4E6sYAAAAABJRU5ErkJggg==')] opacity-10 mix-blend-overlay pointer-events-none"></div>

                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
                                    >
                                        <Check className="w-5 h-5 text-white drop-shadow-md" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    );
                })}
            </div>

            {/* --- Text Customization Controls --- */}
            <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-xl space-y-3">
                {/* Text Input */}
                <div className="flex items-center bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus-within:border-blue-500/50 transition-colors">
                    <Type className="w-4 h-4 text-white/40 mr-2 shrink-0" />
                    <input
                        type="text"
                        value={bannerText}
                        onChange={(e) => updateSetting('text', e.target.value)}
                        placeholder="Banner Text..."
                        className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-white/30"
                    />
                </div>

                {/* Formatting Toolbar */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Font Family Select */}
                    <select
                        value={fontFamily}
                        onChange={(e) => updateSetting('fontFamily', e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none cursor-pointer hover:bg-white/5 transition-colors appearance-none flex-1 min-w-[100px]"
                    >
                        {FONT_FAMILIES.map(font => (
                            <option key={font.id} value={font.value} className="bg-slate-900 text-white">
                                {font.label}
                            </option>
                        ))}
                    </select>

                    {/* Style Toggles */}
                    <div className="flex bg-black/40 border border-white/10 rounded-lg overflow-hidden">
                        <button
                            type="button"
                            onClick={() => updateSetting('isBold', !isBold)}
                            className={cn(
                                "p-1.5 px-2.5 transition-colors border-r border-white/10",
                                isBold ? "bg-white/20 text-white" : "text-white/50 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => updateSetting('isItalic', !isItalic)}
                            className={cn(
                                "p-1.5 px-2.5 transition-colors",
                                isItalic ? "bg-white/20 text-white" : "text-white/50 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <Italic className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Font Size Slider */}
                    <div className="flex items-center gap-2 flex-1 min-w-[100px] bg-black/40 border border-white/10 rounded-lg px-3 py-1.5">
                        <span className="text-[10px] text-white/50 font-bold">A</span>
                        <input
                            type="range"
                            min="16"
                            max="48"
                            value={fontSize}
                            onChange={(e) => updateSetting('fontSize', Number(e.target.value))}
                            className="flex-1 accent-white h-1 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                        />
                        <span className="text-xs text-white/50 font-bold">A</span>
                    </div>
                </div>
            </div>

        </div>
    );
}

// --- DEMO WRAPPER FOR PREVIEW ---
export default function BannerSelectorDemo() {
    const [selectedBanner, setSelectedBanner] = useState(BANNER_PRESETS[0].id);

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md bg-[#1A1A1A]/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-6 ring-1 ring-white/5">

                <div className="mb-6 pb-4 border-b border-white/5">
                    <h2 className="text-white font-bold">Create Room Mockup</h2>
                    <p className="text-xs text-white/40">Demonstrating the BannerSelector component</p>
                </div>

                {/* Embed the component just like this in your CreateRoomModal */}
                <RoomBannerSelector
                    selectedBannerId={selectedBanner}
                    onSelectBanner={setSelectedBanner}
                    onUploadClick={() => alert('Trigger file upload input')}
                />

            </div>
        </div>
    );
}