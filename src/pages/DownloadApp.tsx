import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    ShieldCheck,
    Download,
    ChevronDown,
    CheckCircle2,
    Shield,
    Smartphone,
    Search,
    Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function DownloadApp() {
    const navigate = useNavigate();
    const [installOpen, setInstallOpen] = useState(false);

    const trustCards = [
        {
            icon: ShieldCheck,
            title: "Security Verified",
            desc: "Google Play Protect scanned for your safety.",
            tag: "Safe Install"
        },
        {
            icon: Search,
            title: "Built for Students",
            desc: "Verified university data and real counselor support.",
            tag: "Verified"
        },
        {
            icon: Smartphone,
            title: "Offline Ready",
            desc: "Access your documents anytime, anywhere.",
            tag: "No Latency"
        }
    ];

    return (
        <div className="h-screen overflow-hidden bg-[#0B0F1A] text-slate-200 font-sans selection:bg-indigo-500/30 relative flex flex-col">
            {/* Soft Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
                <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-[#5C6CFF]/5 blur-[120px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-[5%] right-[-10%] w-[50%] h-[50%] bg-[#5C6CFF]/10 blur-[150px] rounded-full animate-pulse-slow delay-1000" />
            </div>

            {/* Header */}
            <header className="fixed top-0 w-full z-50">
                <div className="container mx-auto px-12 h-24 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group backdrop-blur-md"
                    >
                        <ArrowLeft size={16} className="text-slate-400 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[11px] font-bold tracking-wider text-slate-300">Return to Portal</span>
                    </button>
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">System v2.4.0 • STABLE</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-12 flex items-center justify-center relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 w-full max-w-7xl items-center">

                    {/* Left side: Content */}
                    <div className="lg:col-span-6 space-y-10">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="space-y-4"
                            >
                                <h1 className="text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.05]">
                                    Download the <br />
                                    <span className="text-[#5C6CFF]">ItaloStudy</span> App
                                </h1>
                                <p className="text-xl text-slate-400 max-w-xl leading-relaxed font-medium">
                                    Apply to European universities, track applications, and get verified guidance — in one secure app.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="space-y-6 pt-4"
                            >
                                <div className="flex flex-col gap-4 items-start">
                                    <Button
                                        className="h-[72px] px-12 bg-[#5C6CFF] hover:bg-[#4B59FF] text-white rounded-[24px] font-bold text-lg flex items-center gap-4 shadow-2xl shadow-[#5C6CFF]/20 hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group"
                                        asChild
                                    >
                                        <a href="/ItaloStudy.apk" download>
                                            <Download size={24} className="group-hover:translate-y-0.5 transition-transform" />
                                            Download Android APK
                                        </a>
                                    </Button>
                                    <div className="flex items-center gap-6 text-[12px] font-medium text-slate-500 px-2 uppercase tracking-widest">
                                        <span className="flex items-center gap-2">
                                            <CheckCircle2 size={14} className="text-emerald-500" /> APK verified
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Lock size={14} className="text-emerald-500" /> No trackers
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Shield size={14} className="text-emerald-500" /> Safe install
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Trust Cards Grid */}
                        <div className="grid grid-cols-3 gap-4 pt-10">
                            {trustCards.map((card, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 + idx * 0.1 }}
                                    className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.08] transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-[#5C6CFF]/10 flex items-center justify-center text-[#5C6CFF] mb-4 group-hover:scale-110 transition-transform">
                                        <card.icon size={20} />
                                    </div>
                                    <h4 className="text-xs font-bold text-white mb-2">{card.title}</h4>
                                    <p className="text-[10px] text-slate-500 leading-normal font-medium">{card.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right side: 3D Phone Mockup */}
                    <div className="lg:col-span-6 flex items-center justify-center relative">
                        <div className="relative w-full max-w-xl aspect-square flex items-center justify-center">
                            {/* Ambient Glow behind phone */}
                            <div className="absolute inset-20 bg-[#5C6CFF]/20 blur-[100px] rounded-full animate-pulse-slow" />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                                animate={{ opacity: 1, scale: 1, rotate: -3 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                whileHover={{ rotate: 0, scale: 1.05 }}
                                className="relative z-10 w-[90%] drop-shadow-[0_40px_100px_rgba(0,0,0,0.6)] cursor-pointer"
                            >
                                <img
                                    src="/images/android-phone-mockup.png"
                                    alt="ItaloStudy App Preview"
                                    className="w-full h-auto animate-float-gentle"
                                />
                            </motion.div>

                            {/* Soft Shadow on 'floor' */}
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[60%] h-8 bg-black/40 blur-2xl rounded-full scale-y-[0.2] animate-pulse-slow" />
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Footer / Info */}
            <footer className="h-32 flex items-center justify-center relative pointer-events-none">
                <div className="text-center space-y-4 pointer-events-auto">
                    <button
                        onClick={() => setInstallOpen(!installOpen)}
                        className="flex items-center gap-2 mx-auto text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors group"
                    >
                        <ChevronDown size={14} className={cn("transition-transform duration-300", installOpen && "rotate-180")} />
                        How to install the APK safely
                    </button>

                    <AnimatePresence>
                        {installOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-3 gap-12 max-w-3xl mx-auto pt-4 pb-8 border-t border-white/10">
                                    <div className="text-left space-y-1">
                                        <p className="text-[10px] font-bold text-[#5C6CFF] uppercase tracking-widest">Step 01</p>
                                        <p className="text-[11px] text-slate-300 font-medium">Download the APK file above</p>
                                    </div>
                                    <div className="text-left space-y-1">
                                        <p className="text-[10px] font-bold text-[#5C6CFF] uppercase tracking-widest">Step 02</p>
                                        <p className="text-[11px] text-slate-300 font-medium">Allow "Unknown Sources" in settings</p>
                                    </div>
                                    <div className="text-left space-y-1">
                                        <p className="text-[10px] font-bold text-[#5C6CFF] uppercase tracking-widest">Step 03</p>
                                        <p className="text-[11px] text-slate-300 font-medium">Open file and tap install</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!installOpen && (
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-700">© 2026 ITALOSTUDY ADMISSIONS</p>
                    )}
                </div>
            </footer>

            {/* Global Stylings */}
            <style>{`
                @keyframes float-gentle {
                    0%, 100% { transform: translateY(0) rotate(-3deg); }
                    50% { transform: translateY(-15px) rotate(-1deg); }
                }
                .animate-float-gentle {
                    animation: float-gentle 6s ease-in-out infinite;
                }
                .animate-pulse-slow {
                    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
}
