import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ChevronRight } from 'lucide-react';

export default function DoubtsterPartnershipSection() {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    return (
        <section id="doubtster-partnership" className="relative py-16 md:py-24 bg-white text-slate-900 overflow-hidden border-t border-slate-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* 1. Header Lockup */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <img 
                        src="/logo.webp" 
                        alt="ItaloStudy" 
                        className="h-6 sm:h-7 object-contain"
                    />
                    <span className="text-slate-300 font-light text-lg sm:text-xl">×</span>
                    <div className="flex items-center gap-2">
                        <img 
                            src="/doubtster-icon.svg" 
                            alt="Doubtster" 
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-[4px] object-contain shadow-xs"
                        />
                        <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            Doubtster
                        </span>
                    </div>
                </div>

                {/* 2. Main Title */}
                <div className="text-center max-w-3xl mx-auto mb-5">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-black text-slate-950 tracking-tight leading-[1.08]">
                        Every doubt answered.<br className="hidden sm:inline" /> Right where you study.
                    </h2>
                </div>

                {/* 3. Subtitle */}
                <div className="text-center max-w-xl mx-auto mb-8 px-2">
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
                        Doubtster is now built into ItaloStudy. Ask about any question in a mock or practice set and get a step-by-step explanation, or a short video, without leaving the page.
                    </p>
                </div>

                {/* 4. Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-14 md:mb-16">
                    <a
                        href="https://app.italostudy.com/auth"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-full bg-[#111827] hover:bg-black text-white font-semibold text-xs sm:text-sm tracking-tight shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Try it in a practice set
                    </a>
                    <button
                        onClick={() => setIsVideoModalOpen(true)}
                        className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer py-2 px-1"
                    >
                        <span>Learn more</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* 5. Centerpiece Floating Interactive Card */}
                <div className="max-w-4xl mx-auto rounded-[20px] md:rounded-[24px] bg-white border border-slate-200/90 shadow-[0_12px_44px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden mb-14 md:mb-16">
                    
                    {/* Top App Bar Header */}
                    <div className="px-4 sm:px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-white text-xs">
                        <div className="flex items-center gap-3">
                            <img src="/logo.webp" alt="ItaloStudy" className="h-4 object-contain" />
                            <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                                CEnT-S mock 05 · Physics
                            </span>
                            <div className="w-16 sm:w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="w-1/3 h-full bg-indigo-500 rounded-full" />
                            </div>
                        </div>
                        <div className="font-mono text-[11px] sm:text-xs text-slate-600 font-semibold">
                            41:12
                        </div>
                    </div>

                    {/* Split Content: Question Panel (Left) & Doubtster Panel (Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                        
                        {/* LEFT: Question Section */}
                        <div className="lg:col-span-6 p-5 sm:p-7 flex flex-col justify-between">
                            <div>
                                <span className="text-[11px] font-semibold text-indigo-500 block mb-2">
                                    Question 14 of 55
                                </span>
                                <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 leading-snug mb-5">
                                    A sealed rigid container of volume 4.0 L holds 2.0 mol of an ideal monatomic gas at 300 K. If 1200 J of heat is added, what is the final pressure?
                                </h3>

                                {/* Options */}
                                <div className="space-y-2.5 mb-6 text-xs sm:text-[13px]">
                                    {/* Option A (User Selected Wrong) */}
                                    <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border border-rose-200 bg-rose-50/40 text-slate-800">
                                        <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                            A
                                        </span>
                                        <span className="font-medium text-slate-700">1.25 × 10⁵ Pa</span>
                                    </div>

                                    {/* Option B (Correct Answer) */}
                                    <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border border-emerald-300 bg-emerald-50/50 text-slate-900 font-semibold shadow-2xs">
                                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                            B
                                        </span>
                                        <span>1.45 × 10⁵ Pa</span>
                                    </div>

                                    {/* Option C */}
                                    <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border border-slate-200/80 bg-white text-slate-600">
                                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center shrink-0">
                                            C
                                        </span>
                                        <span>1.65 × 10⁵ Pa</span>
                                    </div>

                                    {/* Option D */}
                                    <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border border-slate-200/80 bg-white text-slate-600">
                                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center shrink-0">
                                            D
                                        </span>
                                        <span>1.85 × 10⁵ Pa</span>
                                    </div>
                                </div>
                            </div>

                            {/* Ask Doubtster Trigger Pill Button */}
                            <div className="pt-2">
                                <button
                                    onClick={() => setIsVideoModalOpen(true)}
                                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 hover:bg-blue-100/90 border border-blue-200/90 text-blue-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer group"
                                >
                                    <img 
                                        src="/doubtster-icon.svg" 
                                        alt="Doubtster" 
                                        className="w-4 h-4 rounded-[3px] object-contain shrink-0 group-hover:scale-105 transition-transform" 
                                    />
                                    <span>Why is it B? Ask Doubtster</span>
                                </button>
                            </div>
                        </div>

                        {/* RIGHT: Doubtster Response Drawer */}
                        <div className="lg:col-span-6 p-5 sm:p-7 bg-[#fafbfc] flex flex-col justify-between">
                            <div>
                                {/* Header */}
                                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-200/70">
                                    <div className="flex items-center gap-2">
                                        <img 
                                            src="/doubtster-icon.svg" 
                                            alt="Doubtster" 
                                            className="w-4 h-4 rounded-[3px] object-contain" 
                                        />
                                        <span className="text-xs sm:text-[13px] font-bold text-slate-900">
                                            Doubtster
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 font-medium">
                                        Question 14
                                    </span>
                                </div>

                                {/* Path Explanation */}
                                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                                    You picked A, which skips the temperature rise. Here&apos;s the full path:
                                </p>

                                {/* Steps with vertical blue accent */}
                                <div className="pl-3 border-l-2 border-blue-500/80 space-y-2.5 text-xs text-slate-600 mb-5">
                                    <div>
                                        <p className="font-bold text-blue-700 leading-tight">1. The volume can&apos;t change</p>
                                        <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                                            So no work is done, and all the heat raises internal energy: <span className="font-mono text-slate-800">Q = n · Cv · ΔT</span>
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-bold text-blue-700 leading-tight">2. Find the new temperature</p>
                                        <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                                            With <span className="font-mono text-slate-800">Cv = 3/2 R</span> , <span className="font-mono text-slate-800">ΔT ≈ 48 K</span>, so <span className="font-mono text-slate-800">T ≈ 348 K</span>.
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-bold text-blue-700 leading-tight">3. Use the gas law</p>
                                        <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                                            <span className="font-mono text-slate-800">P = nRT/V ≈ 1.45 × 10⁵ Pa</span>. That&apos;s B.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Micro-Explainer Video Box (Exact Match to Reference Image) */}
                            <div 
                                onClick={() => setIsVideoModalOpen(true)}
                                className="rounded-xl bg-[#f5f2ea] border border-[#e5dfd3] p-3 sm:p-3.5 cursor-pointer hover:border-blue-400 transition-all group relative overflow-hidden shadow-2xs"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex-1 flex items-center justify-around pr-2">
                                        {/* Left Diagram: Particle Chamber */}
                                        <div className="w-16 h-12 bg-white rounded-lg border border-slate-300 relative flex items-center justify-center p-1 shadow-2xs">
                                            {/* Scattered floating particles */}
                                            <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                            <div className="absolute top-4 left-3 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            <div className="absolute bottom-2 left-4 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            <div className="absolute top-2.5 right-4 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                        </div>

                                        {/* Process Arrow */}
                                        <span className="text-slate-700 font-bold text-lg px-2">→</span>

                                        {/* Right Diagram: P vs T Graph */}
                                        <div className="w-16 h-12 bg-white rounded-lg border border-slate-300 relative p-1 shadow-2xs flex flex-col justify-end">
                                            <svg className="w-full h-full" viewBox="0 0 60 40">
                                                {/* Axes */}
                                                <line x1="10" y1="5" x2="10" y2="35" stroke="#94a3b8" strokeWidth="1.5" />
                                                <line x1="10" y1="35" x2="55" y2="35" stroke="#94a3b8" strokeWidth="1.5" />
                                                {/* Labels */}
                                                <text x="3" y="10" fontSize="7" fill="#64748b" fontFamily="sans-serif">P</text>
                                                <text x="50" y="38" fontSize="7" fill="#64748b" fontFamily="sans-serif">T</text>
                                                {/* Linear line */}
                                                <line x1="10" y1="32" x2="48" y2="12" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                                                {/* End point circle */}
                                                <circle cx="48" cy="12" r="3" fill="#fde047" stroke="#1e293b" strokeWidth="1" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Video duration badge */}
                                    <div className="flex items-center gap-1 bg-[#1e293b] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-xs">
                                        <Play className="w-2.5 h-2.5 fill-white" />
                                        <span>0:24</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium pt-1 border-t border-[#e8e2d5]">
                                    <span>Heating a gas at constant volume</span>
                                    <span className="text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5">
                                        Video
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* 6. Bottom 3-Column Features (Exact Match to Reference Image) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-10 text-left">
                    {/* Feature 1 */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                            Ask from any question
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Every question in your mocks and practice sets has an Ask Doubtster button. It already knows which question you&apos;re on.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                            Steps first, then a video
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Read the reasoning step by step. If it still doesn&apos;t click, watch a short animated explainer.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                            One account
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Doubtster is included with your ItaloStudy account. No extra sign-up or app.
                        </p>
                    </div>
                </div>

                {/* 7. Footnote Disclaimer */}
                <div className="text-center">
                    <p className="text-[11px] text-slate-400 font-normal">
                        Doubtster explanations follow the CEnT-S, IMAT and TOLC 2027 syllabi.
                    </p>
                </div>

            </div>

            {/* Video Modal Player */}
            <AnimatePresence>
                {isVideoModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setIsVideoModalOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-3xl bg-slate-950 rounded-2xl border border-white/20 overflow-hidden shadow-2xl"
                        >
                            <div className="flex items-center justify-between p-3.5 border-b border-white/10 bg-slate-900/60">
                                <div className="flex items-center gap-2">
                                    <img src="/doubtster-icon.svg" alt="Doubtster" className="w-5 h-5" />
                                    <span className="text-xs font-bold text-white">Doubtster × ItaloStudy Walkthrough</span>
                                </div>
                                <button 
                                    onClick={() => setIsVideoModalOpen(false)}
                                    className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="aspect-video bg-black flex items-center justify-center">
                                <video 
                                    src="/media/doubtster-sample-explainer.mp4" 
                                    controls 
                                    autoPlay 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
