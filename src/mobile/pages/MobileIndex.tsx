import { lazy, Suspense, useEffect, useState, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import {
    Brain, Zap, Target, BarChart3, Users, Globe, ArrowRight, CheckCircle,
    Menu, X, Sparkles, Shield, Play, Lightbulb, Rocket, Monitor,
    Layers, Cpu, LayoutDashboard, Database, Trophy, Star, Search,
    BookOpen, GraduationCap, PenTool, Calculator, School,
    Pencil, Ruler, Scissors, Apple, Paperclip, Send, Smile, Heart,
    Dna, Scroll, Globe2, Hourglass, Landmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '@/components/SEO';
import GlobalChallenge from '@/components/home/GlobalChallenge';

// Lazy load heavy components
const AuthModal = lazy(() => import('@/components/auth/AuthModal'));

const CountryCodes = [
    'US', 'DE', 'IT', 'NG', 'EG', 'AT', 'RS', 'KW', 'BR',
    'GB', 'TR', 'IN', 'PK', 'HU', 'MA', 'BD', 'NP', 'KR'
];

const AcademicBackground = memo(() => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none select-none bg-[#030014] -z-10 transform-gpu">
            {/* Dark Radial Glows - Using CSS for better performance */}
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-600/5 blur-[120px] rounded-full" />

            {/* Network Particles Effect - Simplified for all devices */}
            <div className="absolute inset-0 opacity-[0.08]">
                <svg className="w-full h-full text-indigo-400" aria-hidden="true">
                    <pattern id="network-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#network-grid)" />
                </svg>
            </div>

            {/* Static Connection Points instead of many animated divs */}
            <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400/30 rounded-full blur-[1px]"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`
                        }}
                    />
                ))}
            </div>
        </div>
    );
});
AcademicBackground.displayName = 'AcademicBackground';

const GlassCard = memo(({ children, className, delay = 0, x = 0, y = 0 }: { children: React.ReactNode, className?: string, delay?: number, x?: number, y?: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9, x, y }}
        animate={{
            opacity: 1,
            scale: 1,
            y: [y, y - 20, y],
        }}
        transition={{
            delay,
            y: { duration: 5, repeat: Infinity, ease: "linear" }
        }}
        className={cn(
            "absolute p-8 rounded-[2.5rem] bg-white/5 border border-white/10 shadow-2xl",
            className
        )}
    >
        <div className="relative z-10">{children}</div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[2.5rem] -z-10" />
    </motion.div>
));
GlassCard.displayName = 'GlassCard';

export default function MobileIndex() {
    const navigate = useNavigate();
    const { user, loading: authLoading, aal, hasMFA } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Redirect logged-in users to dashboard only if fully authenticated
    useEffect(() => {
        if (!authLoading && user && !isAuthModalOpen) {
            // Only redirect if no MFA or AAL is already 2
            const needsMFA = hasMFA && aal !== 'aal2';
            if (!needsMFA) {
                navigate('/mobile/dashboard', { replace: true });
            }
        }
    }, [user, authLoading, navigate, aal, hasMFA, isAuthModalOpen]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    // Show loading state while checking authentication
    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#030014] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans selection:bg-violet-100 selection:text-violet-900 overflow-x-hidden relative">
            <Suspense fallback={null}>
                <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            </Suspense>

            <SEO
                title="ItaloStudy | Free IMAT Practice & Unlimited Free Mocks"
                description="Experience the world's most advanced study simulator for IMAT, SAT, CEnT-S and IELTS preparation. Get free practice questions and unlimited free mocks for your exam success."
                keywords="Free IMAT Practice, Unlimited Free IMAT Mocks, Free SAT Prep, Free IELTS Preparation, Study in Italy, Medical Admission Italy, Free Academic Practice, ItaloStudy Free Mocks"
            />
            <AcademicBackground />

            {/* Navbar */}
            <header className={cn(
                "fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 py-3 bg-[#030014]/80 backdrop-blur-3xl border-b border-white/10 shadow-2xl"
            )}>
                <div className="flex items-center justify-between">
                    {/* Logo (Centered for Mobile) */}
                    <Link to="/" className="flex items-center gap-3">
                        <img
                            src="/logo.png"
                            alt="Italostudy Logo"
                            className="h-10 w-auto object-contain brightness-0 invert"
                            loading="eager"
                        />
                    </Link>

                    {/* Right Section */}
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="group relative h-10 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black rounded-full text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/20"
                        >
                            Log in
                        </Button>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Backdrop & Content */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-full left-0 right-0 mt-4 mx-4 p-8 rounded-[2rem] bg-[#030014]/95 backdrop-blur-3xl border border-white/10 flex flex-col gap-6 shadow-2xl z-50"
                        >
                            {[
                                { name: 'Method', path: '/method' },
                                { name: 'Syllabus', path: '/syllabus' },
                                { name: 'Pricing', path: '/pricing' },
                                { name: 'Blog', path: '/blog' },
                                { name: 'Contact', path: '/contact' },
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "text-lg font-black tracking-tight text-white/70"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        {item.name}
                                        {item.name === 'Pricing' && (
                                            <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded text-[10px] text-emerald-400 font-black animate-pulse uppercase">
                                                Beta Free
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                            <Button
                                onClick={() => {
                                    setIsAuthModalOpen(true);
                                    setIsMobileMenuOpen(false);
                                }}
                                className="group relative overflow-hidden w-full h-14 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black rounded-2xl uppercase text-sm tracking-widest mt-4"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative z-10">Log in</span>
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-6 pb-20 pt-32">
                <div className="container mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-8"
                    >
                        <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                        <span className="text-[9px] font-black text-white/80 uppercase tracking-[0.2em]">Next-Gen Admission Expert</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl font-black text-white mb-6 tracking-tighter leading-[0.95]"
                    >
                        Master Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500">Global Admissions.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base font-bold text-white/50 mb-12 leading-relaxed max-w-xs mx-auto"
                    >
                        Everything you need for <span className="text-white/80">IMAT, SAT, CEnT-S, and IELTS</span> —practice, analysis, and guidance.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col items-center justify-center gap-4 w-full"
                    >
                        <Button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="w-full h-16 bg-indigo-600 text-white font-black text-xs rounded-full hover:bg-indigo-700 transition-all uppercase tracking-widest shadow-[0_0_30px_rgba(79,70,229,0.3)] mb-4"
                        >
                            FREE GET started
                            <ArrowRight className="w-4 h-4 ml-3" />
                        </Button>
                        <Link to="/blog" className="w-full">
                            <Button variant="outline" className="w-full h-16 bg-white/10 backdrop-blur-md text-white border-white/20 font-black text-xs rounded-full uppercase tracking-widest">
                                Read Blog
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section >

            {/* Feature Cards */}
            < section className="py-20 bg-transparent border-y border-white/5" >
                <div className="container mx-auto px-6 space-y-6">
                    {[
                        { icon: <Zap className="w-6 h-6" />, title: "Adaptive Study", desc: "Our system identifies your knowledge gaps and builds a custom path.", color: "from-amber-400 to-orange-500" },
                        { icon: <Target className="w-6 h-6" />, title: "Exam Simulation", desc: "Practice in an environment identical to the real test.", color: "from-indigo-500 to-violet-600" },
                        { icon: <Users className="w-6 h-6" />, title: "Student Ranked", desc: "Compare your performance against global applicants.", color: "from-emerald-400 to-teal-500" }
                    ].map((feat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10"
                        >
                            <div className={cn(
                                "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-8 shadow-lg text-white",
                                feat.color
                            )}>
                                {feat.icon}
                            </div>
                            <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">{feat.title}</h3>
                            <p className="text-sm text-white/40 font-bold leading-relaxed">{feat.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Global Challenge Section */}
            <GlobalChallenge onPracticeMore={() => setIsAuthModalOpen(true)} />

            {/* Testimonials */}
            < section className="py-24" >
                <div className="container mx-auto px-6 text-center space-y-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-[9px] font-black text-white/80 uppercase tracking-widest">Student Stories</span>
                        </div>
                        <h2 className="text-5xl font-black text-white tracking-tighter leading-none">
                            Join the <br /> <span className="text-indigo-500 font-black">Elite.</span>
                        </h2>
                    </div>

                    <div className="grid gap-6">
                        {[
                            { name: "John D.", text: "The adaptive testing changed my study routine completely." },
                            { name: "Anna M.", text: "The simulations are incredibly realistic. I felt so confident." }
                        ].map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 text-left"
                            >
                                <p className="text-lg text-white font-black leading-tight mb-8">"{t.text}"</p>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t.name}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Footer */}
            < footer className="py-20 bg-[#030014] border-t border-white/10 px-8 text-center" >
                <div className="flex flex-col items-center gap-12">
                    <img src="/logo.png" className="h-8 w-auto brightness-0 invert opacity-40" />
                    <div className="flex flex-wrap justify-center gap-6">
                        {['Method', 'Syllabus', 'Pricing', 'Blog', 'Contact'].map(item => (
                            <Link key={item} to={`/${item.toLowerCase()}`} className="text-[9px] font-black text-white/30 hover:text-blue-400 transition-colors uppercase tracking-widest">{item}</Link>
                        ))}
                    </div>
                    <div className="space-y-4 opacity-20">
                        <p className="text-[8px] font-black uppercase tracking-[0.4em]">© 2026 ITALOSTUDY SYSTEMS</p>
                        <p className="text-[8px] font-black uppercase tracking-[0.2em]">Verified Academic Excellence</p>
                    </div>
                </div>
            </footer >
        </div >
    );
}
