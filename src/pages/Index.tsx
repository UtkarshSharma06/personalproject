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

export default function Index() {
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
                navigate('/dashboard');
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
                schema={{
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "Organization",
                            "@id": "https://italostudy.com/#organization",
                            "name": "ItaloStudy",
                            "url": "https://italostudy.com",
                            "logo": "https://italostudy.com/logo.png",
                            "sameAs": [
                                "https://www.instagram.com/italostudy",
                                "https://twitter.com/italostudy"
                            ],
                            "description": "The #1 Platform for Abroad Universities Admission and Exam Preparation."
                        },
                        {
                            "@type": "WebSite",
                            "@id": "https://italostudy.com/#website",
                            "url": "https://italostudy.com",
                            "name": "ItaloStudy",
                            "publisher": {
                                "@id": "https://italostudy.com/#organization"
                            },
                            "potentialAction": {
                                "@type": "SearchAction",
                                "target": "https://italostudy.com/search?q={search_term_string}",
                                "query-input": "required name=search_term_string"
                            }
                        },
                        {
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                {
                                    "@type": "ListItem",
                                    "position": 1,
                                    "name": "Home",
                                    "item": "https://italostudy.com"
                                }
                            ]
                        }
                    ]
                }}
            />
            <AcademicBackground />

            {/* Navbar */}
            <header className={cn(
                "fixed left-0 right-0 z-40 transition-all duration-300 px-4 md:px-12",
                scrolled
                    ? "top-0 py-3 md:py-4"
                    : "top-4 md:top-8 py-0"
            )}>
                <div className="container mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src="/logo.png"
                            alt="Italostudy Logo"
                            className="h-12 w-auto object-contain brightness-0 invert"
                            width="180"
                            height="48"
                            loading="eager"
                        />
                    </Link>

                    {/* Pill Navbar (Desktop) */}
                    <nav className={cn(
                        "hidden lg:flex items-center backdrop-blur-2xl border transition-all duration-300 rounded-full px-12 py-3 shadow-2xl",
                        scrolled
                            ? "bg-[#030014]/80 border-white/10"
                            : "bg-white/5 border-white/10"
                    )}>
                        <div className="flex items-center gap-10">
                            {[
                                { name: 'Method', path: '/method' },
                                { name: 'Syllabus', path: '/syllabus' },
                                { name: 'Pricing', path: '/pricing' },
                                { name: 'Institutional', path: '/institutional' },
                                { name: 'Contact', path: '/contact' },
                                { name: 'Get Admission', path: '/get-admission', isSpecial: true }
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={cn(
                                        "text-[12px] font-bold tracking-tight transition-colors",
                                        item.isSpecial
                                            ? "text-blue-400 hover:text-blue-300"
                                            : "text-white/70 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center gap-1.5">
                                        {item.name}
                                        {item.name === 'Pricing' && (
                                            <span className="px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded text-[8px] text-emerald-400 font-black animate-pulse uppercase">
                                                Beta Free
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="hidden sm:flex group relative overflow-hidden h-12 px-8 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black rounded-full shadow-[0_0_20px_rgba(99,102,241,0.3)] text-xs transition-all hover:scale-105 border-none uppercase tracking-widest"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative z-10">Log in</span>
                        </Button>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-3 rounded-2xl bg-white/5 border border-white/10 text-white"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
                            className="absolute top-full left-0 right-0 mt-4 mx-4 p-8 rounded-[2rem] bg-[#030014]/95 backdrop-blur-3xl border border-white/10 lg:hidden flex flex-col gap-6 shadow-2xl z-50"
                        >
                            {[
                                { name: 'Method', path: '/method' },
                                { name: 'Syllabus', path: '/syllabus' },
                                { name: 'Pricing', path: '/pricing' },
                                { name: 'Institutional', path: '/institutional' },
                                { name: 'Contact', path: '/contact' },
                                { name: 'Get Admission', path: '/get-admission', isSpecial: true }
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "text-lg font-black tracking-tight",
                                        item.isSpecial ? "text-blue-400" : "text-white/70"
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
            <section className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden px-6 pt-20">
                <div className="absolute inset-0 pointer-events-none overflow-hidden max-w-7xl mx-auto">
                    <GlassCard className="hidden lg:flex top-[15%] left-[5%] w-36 h-36" delay={0.2} x={-10} y={0}>
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Dna size={60} className="text-[#22d3ee] drop-shadow-[0_0_20px_#22d3ee] opacity-80" />
                            <div className="absolute inset-0 bg-[#22d3ee]/10 blur-[40px] rounded-full" />
                        </div>
                    </GlassCard>

                    <GlassCard className="hidden lg:flex top-[15%] right-[5%] w-40 h-36" delay={0.4} x={10} y={0}>
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Scroll size={70} className="text-white drop-shadow-[0_0_20px_white] opacity-70" />
                            <div className="absolute inset-0 bg-white/5 blur-[40px] rounded-full" />
                        </div>
                    </GlassCard>

                    <GlassCard className="hidden lg:flex bottom-[15%] left-[8%] w-32 h-32" delay={0.6} x={-20} y={20}>
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Globe2 size={50} className="text-white/80 drop-shadow-[0_0_15px_white] opacity-60" />
                            <div className="absolute inset-0 bg-white/5 blur-[30px] rounded-full" />
                        </div>
                    </GlassCard>

                    <GlassCard className="hidden lg:flex bottom-[15%] right-[10%] w-36 h-36" delay={0.8} x={20} y={20}>
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Hourglass size={60} className="text-cyan-300 drop-shadow-[0_0_20px_#22d3ee] opacity-70" />
                            <div className="absolute inset-0 bg-cyan-400/5 blur-[40px] rounded-full" />
                        </div>
                    </GlassCard>
                </div>

                <div className="container mx-auto relative z-10 -mt-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-6 shadow-lg scale-90 md:scale-100"
                    >
                        <Sparkles className="w-3 md:w-4 h-3 md:h-4 text-cyan-400 animate-pulse" />
                        <span className="text-[9px] md:text-[11px] font-black text-white/80 uppercase tracking-[0.15em] md:tracking-[0.2em] whitespace-nowrap">Next-Gen Admission Expert</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.95] md:leading-[0.9]"
                    >
                        ItaloStudy for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500">Education.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-lg lg:text-xl font-bold text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed px-4"
                    >
                        Everything you need to prepare for{" "}
                        <span className="relative inline-block whitespace-nowrap">
                            <span className="relative z-10 text-white/90">IMAT, SAT, CEnT-S, and IELTS</span>
                            <svg className="absolute -bottom-2 left-0 w-full h-3 transition-all duration-300" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <motion.path
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    d="M0,5 Q20,2 40,5 T80,5 Q90,8 100,5"
                                    fill="none"
                                    stroke="#f97316"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>{" "}
                        —practice, analysis, and guidance designed to help you perform at your best.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="h-14 md:h-16 px-8 md:px-10 bg-transparent text-white font-black text-base md:text-lg rounded-full border-2 border-cyan-400/50 hover:bg-cyan-400/10 transition-all group shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                            >
                                FREE GET started
                                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </motion.div>
                        <Link to="/get-admission">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" className="h-14 md:h-16 px-8 md:px-10 bg-white text-slate-900 border-none font-black text-base md:text-lg rounded-full hover:bg-white/90 transition-all shadow-xl">
                                    Get Admission
                                </Button>
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>
            </section >

            {/* Features & Content - Lazy Load on Scroll */}
            <div className="relative z-10">
                {/* Feature Cards */}
                < section className="py-24 bg-transparent border-y border-white/5 overflow-hidden" >
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: <Zap className="w-8 h-8" />, title: "Adaptive Study", desc: "Our system identifies your knowledge gaps and builds a custom path for any exam.", color: "from-amber-400 to-orange-500", glow: "shadow-amber-500/20" },
                                { icon: <Target className="w-8 h-8" />, title: "Exam Simulation", desc: "Practice in an environment identical to the real test. Zero surprises on test day.", color: "from-indigo-500 to-violet-600", glow: "shadow-indigo-500/20" },
                                { icon: <Users className="w-8 h-8" />, title: "Student Ranked", desc: "Compare your performance against thousands of global applicants in real-time.", color: "from-emerald-400 to-teal-500", glow: "shadow-emerald-500/20" }
                            ].map((feat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl hover:border-white/20 transition-all group"
                                >
                                    <div className={cn(
                                        "w-20 h-20 rounded-[1.8rem] bg-gradient-to-br flex items-center justify-center mb-10 shadow-lg text-white group-hover:scale-110 transition-transform",
                                        feat.color,
                                        feat.glow
                                    )}>
                                        {feat.icon}
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">{feat.title}</h3>
                                    <p className="text-lg text-white/50 font-bold leading-relaxed">{feat.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section >

                {/* Testimonials */}
                < section className="py-32 bg-[#030014]/50 relative z-10" >
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-10">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full"
                                >
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <span className="text-[11px] font-black text-white/80 uppercase tracking-widest text-xs">Student Success Stories</span>
                                </motion.div>
                                <h2 className="text-6xl lg:text-8xl font-black text-white tracking-tighter leading-none mb-4">
                                    Join the <br /> <span className="text-indigo-500 font-black">Elite.</span>
                                </h2>
                                <p className="text-xl text-white/40 font-bold leading-relaxed max-w-lg">
                                    More than 12,000 students have transformed their futures with ITALOSTUDY. Your journey to academic excellence begins here.
                                </p>
                            </div>
                            <div className="grid gap-8">
                                {[
                                    { name: "John D.", text: "The adaptive testing changed my study routine. I focused exactly on what I didn't know.", initial: "JD", role: "Medical Student" },
                                    { name: "Anna M.", text: "The exam simulations are incredibly realistic. I felt prepared and confident.", initial: "AM", role: "MBA Candidate" }
                                ].map((t, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 40 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white/5 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-white/10 shadow-2xl hover:border-white/20 transition-all"
                                    >
                                        <p className="text-2xl text-white font-black leading-tight mb-8 font-sans">
                                            "{t.text}"
                                        </p>
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                                                {t.initial}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white uppercase tracking-tight">{t.name}</p>
                                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t.role}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section >

                {/* Footer */}
                < footer className="py-24 bg-[#030014] border-t border-white/5 relative z-10 overflow-hidden" >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20" />

                    <div className="container mx-auto px-6">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 mb-16">
                            <div className="flex flex-col items-center lg:items-start gap-6">
                                <img
                                    src="/logo.png"
                                    alt="Italostudy Logo"
                                    className="h-10 w-auto object-contain brightness-0 invert opacity-60 hover:opacity-100 transition-opacity"
                                    width="150"
                                    height="40"
                                    loading="lazy"
                                />
                                <p className="text-sm font-bold text-white/40 max-w-xs text-center lg:text-left leading-relaxed">
                                    Empowering students worldwide with data-driven academic excellence and simplified admissions.
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-10">
                                {[
                                    { name: 'Method', path: '/method' },
                                    { name: 'Syllabus', path: '/syllabus' },
                                    { name: 'Pricing', path: '/pricing' },
                                    { name: 'Institutional', path: '/institutional' },
                                    { name: 'Contact Us', path: '/contact' }
                                ].map(item => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className="text-xs font-black text-white/40 hover:text-blue-400 transition-colors uppercase tracking-widest"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                                © 2026 ITALOSTUDY SYSTEMS • DESIGNED FOR EXCELLENCE
                            </p>
                            <div className="flex gap-8">
                                <Link to="/privacy" className="text-[10px] font-black text-white/20 hover:text-white transition-colors uppercase tracking-widest">Privacy Policy</Link>
                                <Link to="/terms" className="text-[10px] font-black text-white/20 hover:text-white transition-colors uppercase tracking-widest">Terms of Service</Link>
                            </div>
                        </div>
                    </div>
                </footer >
            </div>
        </div >
    );
}
