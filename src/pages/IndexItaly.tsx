
import { lazy, Suspense, useEffect, useState, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useAuth } from '@/lib/auth';
import {
    Zap, Target, Users, ArrowRight,
    Menu, X, Sparkles, Star,
    Instagram, MessageCircle, Facebook, Linkedin, Youtube,
    ChevronRight, Shield, BookOpen, Trophy, CheckCircle2, LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import TrustpilotSection from '@/components/TrustpilotSection';
import { useLiveEdit, LiveEditProvider } from '@/contexts/LiveEditContext';
import LiveEditToolbar from '@/components/cms/LiveEditToolbar';
import { usePageContent } from '@/hooks/usePageContent';
import { getEducationalOrganizationSchema } from '@/utils/seo-schemas';
import FAQSchema from '@/components/seo/FAQSchema';
import EditableText from '@/components/cms/EditableText';
import FAQSection from '@/components/home/FAQSection';

const AnnouncementBar = lazy(() => import('@/components/AnnouncementBar'));
const UniversityMarquee = lazy(() => import('@/components/home/UniversityMarquee'));
const HomeSEOHub = lazy(() => import('@/components/home/HomeSEOHub'));
const HomeInsights = lazy(() => import('@/components/home/HomeInsights'));
const ExamMarketingSection = lazy(() => import('@/components/home/ExamMarketingSection'));
const HomeHowItWorks = lazy(() => import('@/components/home/HomeHowItWorks'));
const HomeWhyChooseUs = lazy(() => import('@/components/home/HomeWhyChooseUs'));
const GlobalChallenge = lazy(() => import('@/components/home/GlobalChallenge'));
const VideoReviewSection = lazy(() => import('@/components/home/VideoReviewSection'));
const StudyItalyClusterSection = lazy(() => import('@/components/home/StudyItalyClusterSection'));

import HeroSection from '@/components/home/HeroSection';
import faqData from '@/data/italy-faqs-2026.json';
import seoData from '@/data/seo/seo-it.json';

const AcademicBackground = memo(() => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none select-none bg-white -z-10 transform-gpu">
            {/* Italian flag inspired colors - Green accents - Lightened */}
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-green-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/5 blur-[120px] rounded-full" />

            <div className="absolute inset-0 opacity-[0.4]">
                <svg className="w-full h-full text-green-100" aria-hidden="true">
                    <pattern id="light-grid-it" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#light-grid-it)" />
                </svg>
            </div>

            <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-green-200 rounded-full blur-[1px] opacity-0 md:opacity-100"
                        style={{
                            top: `${(i * 153) % 100}%`,
                            left: `${(i * 277) % 100}%`
                        }}
                    />
                ))}
            </div>
        </div>
    );
});
AcademicBackground.displayName = 'AcademicBackground';



export default function IndexItaly() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { user, loading: authLoading, aal, hasMFA, profile } = useAuth();
    const { setPageSlug } = useLiveEdit();
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSyllabusDropdownOpen, setIsSyllabusDropdownOpen] = useState(false);

    const { getField } = usePageContent('landing-it');

    useEffect(() => {
        i18n.changeLanguage('it');
        setPageSlug('landing-it');
    }, [i18n]);

    useEffect(() => {
        if (!authLoading && user && profile?.role !== 'admin') {
            window.location.href = 'https://app.italostudy.com/';
        }
    }, [user, authLoading, profile]);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 20);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <LiveEditProvider slug="landing-it" fieldPrefix="it_">
            <div className="min-h-screen font-sans selection:bg-green-100 selection:text-green-900 overflow-x-hidden relative bg-white">
                <SEO
                    title={getField('it_seo_title', seoData.title)}
                    description={getField('it_seo_description', seoData.description)}
                    keywords={getField('it_seo_keywords', t('landing.seo.keywords', 'italostudy, IMAT preparation, CEnT-S exam guide, European admissions, global study prep'))}
                    locale="it_IT"
                    canonicalUrl="https://italostudy.com/it"
                    schema={getEducationalOrganizationSchema()}
                />
                <AcademicBackground />

                {/* Global Announcement System */}
                <Suspense fallback={null}>
                    <AnnouncementBar />
                </Suspense>

                {/* Status Announcement Bar */}
                <div className={cn(
                    "fixed top-0 left-0 right-0 z-[60] min-h-9 md:h-10 flex items-center justify-center overflow-hidden border-b border-blue-200/30 transition-transform duration-500",
                    scrolled ? "-translate-y-full" : "translate-y-0"
                )}>
                    <div className="absolute inset-0 bg-[linear-gradient(110deg,#eff6ff,45%,#dbeafe,55%,#eff6ff)] bg-[length:200%_100%] animate-shimmer backdrop-blur-md" />
                    <Link to="/status" className="relative flex items-center gap-2 md:gap-4 group transition-all px-4 md:px-6 py-1.5 md:py-1 w-full justify-center">
                        <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 bg-white/40 backdrop-blur-md rounded-full border border-blue-200/50 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:scale-105 transition-transform duration-300 shrink-0">
                            <div className="relative">
                                <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-25" />
                                <span className="relative block w-1.5 md:w-2 h-1.5 md:h-2 bg-emerald-500 rounded-full" />
                            </div>
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.15em] text-blue-700">Live</span>
                        </div>
                        <div className="flex items-center gap-1.5 md:gap-2 overflow-hidden">
                            <Sparkles className="w-3 md:w-3.5 h-3 md:h-3.5 text-blue-400 animate-pulse shrink-0" />
                            <span className="text-[10px] md:text-[12px] font-bold tracking-tight text-slate-700 group-hover:text-blue-600 transition-colors truncate">
                                Status Hub: <span className="text-slate-500 font-medium italic hidden sm:inline">Scopri la roadmap e le funzionalità del 2026</span>
                                <span className="text-slate-500 font-medium italic sm:hidden">Roadmap 2026 Live</span>
                            </span>
                        </div>
                    </Link>
                </div>

                <style>{`
                    @keyframes shimmer {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }
                `}</style>

                {/* Navbar - Light Version */}
                <header className={cn(
                    "fixed left-0 right-0 z-50 transition-all duration-500 px-4 md:px-12 transform-gpu will-change-[padding,background-color,top]",
                    scrolled
                        ? "top-0 py-2 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm"
                        : "top-[32px] py-5 bg-transparent"
                )}>
                    <div className="container mx-auto flex items-center justify-between">
                        <div className="flex-1 flex justify-start">
                            <Link to="/" className="flex items-center gap-3">
                                <img
                                    src="/logo.webp"
                                    alt={t('common.logo_alt', 'ItaloStudy Logo')}
                                    className="h-9 md:h-11 w-auto object-contain transition-all"
                                    width="160"
                                    height="40"
                                    loading="eager"
                                    {...({ fetchpriority: "high" } as any)}
                                />
                            </Link>
                        </div>

                        <nav className={cn(
                            "hidden lg:flex items-center transition-all duration-300 rounded-full transform-gpu",
                            scrolled
                                ? "bg-transparent border-transparent shadow-none ring-0 px-0 py-0"
                                : "bg-white/70 backdrop-blur-3xl border border-white/40 px-12 py-3 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] ring-1 ring-black/5"
                        )}>
                            <div className="flex items-center gap-10">
                                <div
                                    className="relative"
                                    onMouseEnter={() => setIsSyllabusDropdownOpen(true)}
                                    onMouseLeave={() => setIsSyllabusDropdownOpen(false)}
                                >
                                    <a href="/exams" className="text-[12px] font-bold tracking-tight transition-colors text-slate-500 hover:text-green-600 flex items-center gap-1 py-1">
                                        {t('nav.exams')}
                                        <ChevronRight className={cn("w-3 h-3 rotate-90 transition-transform", isSyllabusDropdownOpen && "rotate-[270deg]")} />
                                    </a>
                                    {isSyllabusDropdownOpen && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-2 rounded-2xl bg-white border border-slate-100 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                            <a href="/imat" className="flex items-center justify-between px-4 py-2.5 rounded-xl text-[11px] font-bold text-slate-400 hover:text-green-600 hover:bg-slate-50 transition-all group">
                                                {t('nav.exam_items.imat')}
                                                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </a>
                                            <a href="/cent-s" className="flex items-center justify-between px-4 py-2.5 rounded-xl text-[11px] font-bold text-slate-400 hover:text-green-600 hover:bg-slate-50 transition-all group">
                                                {t('nav.exam_items.cents')}
                                                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <a href="/resources" className="text-[12px] font-bold tracking-tight transition-colors text-slate-500 hover:text-green-600">
                                    {t('nav.resources')}
                                </a>
                                <a href="/pricing" className="text-[12px] font-bold tracking-tight transition-colors text-slate-500 hover:text-green-600">
                                    <div className="flex items-center gap-1.5">
                                        {t('nav.pricing')}
                                        <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 rounded text-[8px] text-emerald-600 font-black uppercase" style={{ background: 'transparent' }}>
                                            BETA GRATUITO
                                        </span>
                                    </div>
                                </a>
                                <a href="/blog" className="text-[12px] font-bold tracking-tight transition-colors text-slate-500 hover:text-green-600">
                                    {t('nav.blog')}
                                </a>
                                <a href="https://store.italostudy.com" target="_blank" rel="noopener noreferrer" className="text-[12px] font-bold tracking-tight transition-colors text-slate-500 hover:text-green-600">
                                    Negozio
                                </a>
                                <a href="/contact" className="text-[12px] font-bold tracking-tight transition-colors text-slate-500 hover:text-green-600">
                                    {t('nav.contact')}
                                </a>
                            </div>
                        </nav>

                        <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
                            {user ? (
                                <button
                                    onClick={() => window.location.href = 'https://app.italostudy.com/'}
                                    className="flex bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl px-4 md:px-6 py-2 items-center gap-2 transition-colors text-xs md:text-sm"
                                >
                                    <LayoutDashboard className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    {t('nav.dashboard')}
                                </button>
                            ) : (
                                <button
                                    onClick={() => window.location.href = 'https://app.italostudy.com/auth'}
                                    className="flex bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl px-4 md:px-6 items-center justify-center h-9 md:h-10 text-xs md:text-sm"
                                >
                                    {t('nav.login')}
                                </button>
                            )}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2.5 md:p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900"
                            >
                                {isMobileMenuOpen ? <X size={20} className="md:w-6 md:h-6" /> : <Menu size={20} className="md:w-6 md:h-6" />}
                            </button>
                        </div>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="absolute top-full left-0 right-0 mt-4 mx-4 p-8 rounded-[2rem] bg-white border border-slate-100 lg:hidden flex flex-col gap-6 shadow-2xl z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-4">
                                    <a href="/exams" className="text-lg font-black tracking-tight text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>
                                        {t('nav.exams')}
                                    </a>
                                    <div className="grid grid-cols-2 gap-2 pl-4">
                                        <a href="/imat" className="text-sm font-bold text-slate-400 hover:text-green-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                            {t('nav.exam_items.imat')}
                                        </a>
                                        <a href="/cent-s" className="text-sm font-bold text-slate-400 hover:text-green-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                            {t('nav.exam_items.cents')}
                                        </a>
                                    </div>
                                </div>
                                <a href="/resources" className="text-lg font-black tracking-tight text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>
                                    {t('nav.resources')}
                                </a>
                                <a href="/pricing" className="text-lg font-black tracking-tight text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className="flex items-center gap-2">
                                        {t('nav.pricing')}
                                        <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded text-[10px] text-emerald-600 font-black uppercase">
                                            BETA GRATUITO
                                        </span>
                                    </div>
                                </a>
                                <a href="/blog" className="text-lg font-black tracking-tight text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>
                                    {t('nav.blog')}
                                </a>
                                <a href="https://store.italostudy.com" target="_blank" rel="noopener noreferrer" className="text-lg font-black tracking-tight text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>
                                    Negozio
                                </a>
                                <a href="/contact" className="text-lg font-black tracking-tight text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>
                                    {t('nav.contact')}
                                </a>
                            </div>
                        </div>
                    )}
                </header>

                {/* 1. Hero Section */}
                <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-0">
                    <div className="container mx-auto relative z-10 w-full max-w-7xl">
                        <HeroSection />
                    </div>
                </section>

                {/* University Branding */}
                <Suspense fallback={null}>
                    <UniversityMarquee />
                </Suspense>

                {/* 2. Ultimate Guide (EXAMS) */}
                <Suspense fallback={<div className="h-[600px] bg-white animate-pulse" />}>
                    <ExamMarketingSection />
                </Suspense>

                {/* Trustpilot Proof */}
                <Suspense fallback={null}>
                    <TrustpilotSection />
                </Suspense>

                {/* 3.5 Student Success Video Story */}
                <Suspense fallback={null}>
                    <VideoReviewSection />
                </Suspense>

                {/* 4. Simulator Differentiation */}
                <Suspense fallback={<div className="h-96" />}>
                    <HomeWhyChooseUs />
                </Suspense>

                {/* 5. How It Works */}
                <Suspense fallback={<div className="h-96" />}>
                    <HomeHowItWorks />
                </Suspense>

                {/* 6. Data Insight */}
                <Suspense fallback={null}>
                    <HomeInsights />
                </Suspense>

                {/* 7. Resource Pillar */}
                <Suspense fallback={null}>
                    <HomeSEOHub />
                </Suspense>

                {/* Study in Italy Guide Section */}
                <Suspense fallback={null}>
                    <StudyItalyClusterSection />
                </Suspense>

                {/* 8. Global League */}
                <Suspense fallback={<div className="h-96" />}>
                    <GlobalChallenge onPracticeMore={() => window.open('https://app.italostudy.com/auth', '_blank', 'noopener,noreferrer')} />
                </Suspense>

                {/* FAQ Section with JSON-LD */}
                <Suspense fallback={null}>
                    <FAQSection />
                </Suspense>

                {/* 10. Final CTA Section */}
                <section className="py-12 md:py-16 bg-slate-50 border-t border-slate-100 flex flex-col items-center text-center px-6">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-8 uppercase tracking-tight max-w-2xl">
                        <EditableText fieldKey="footer_cta_title" fallback={t('footer.cta_title')} />
                    </h2>
                    <button 
                        onClick={() => window.open('https://app.italostudy.com/auth', '_blank', 'noopener,noreferrer')}
                        className="h-14 md:h-18 px-8 md:px-12 bg-green-600 text-white font-black text-xs md:text-base lg:text-lg rounded-full hover:bg-green-700 shadow-2xl shadow-green-200 transition-all group w-full max-w-sm md:w-auto flex items-center justify-center"
                    >
                        {t('common.start_free')}
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                    </button>
                </section>

                <Footer />
                <LiveEditToolbar />
            </div>
        </LiveEditProvider>
    );
}
