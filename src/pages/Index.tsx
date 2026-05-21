
import { lazy, Suspense, useEffect, useState, memo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth';
// Only import the icons actually used in the EAGER bundle
import {
    Menu, X, ChevronRight, ArrowRight,
    Instagram, MessageCircle, LayoutDashboard, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
const AnnouncementBar = lazy(() => import('@/components/AnnouncementBar'));
import { cn } from '@/lib/utils';
import { getCountryCode } from '@/utils/countryDetection';
import { useLiveEdit } from '@/contexts/LiveEditContext';
import { usePageContent } from '@/hooks/usePageContent';
import EditableText from '@/components/cms/EditableText';
import FAQSection from '@/components/home/FAQSection';
// HeroSection is the LCP element — must be EAGER, never lazy
import HeroSection from '@/components/home/HeroSection';
import faqData from '@/data/italy-faqs-2026.json';
import { getEducationalOrganizationSchema } from '@/utils/seo-schemas';

// Non-critical components — lazy loaded
const Footer = lazy(() => import('@/components/Footer'));
const TrustpilotSection = lazy(() => import('@/components/TrustpilotSection'));
const UniversityMarquee = lazy(() => import('@/components/home/UniversityMarquee'));
const GlobalChallenge = lazy(() => import('@/components/home/GlobalChallenge'));
const ExamMarketingSection = lazy(() => import('@/components/home/ExamMarketingSection'));
const HomeAboutCENTS = lazy(() => import('@/components/home/HomeAboutCENTS'));
const HomeHowItWorks = lazy(() => import('@/components/home/HomeHowItWorks'));
const HomeWhyChooseUs = lazy(() => import('@/components/home/HomeWhyChooseUs'));
const ExamCountdown = lazy(() => import('@/components/home/ExamCountdown'));
const HomeAuthorityStats = lazy(() => import('@/components/home/HomeAuthorityStats'));
const HomeSEOHub = lazy(() => import('@/components/home/HomeSEOHub'));
const HomeInsights = lazy(() => import('@/components/home/HomeInsights'));
const StudyItalyClusterSection = lazy(() => import('@/components/home/StudyItalyClusterSection'));
const VideoReviewSection = lazy(() => import('@/components/home/VideoReviewSection'));
const VoltageButton = lazy(() => import('@/components/ui/VoltageButton').then(m => ({ default: m.default })));
// Admin-only — only loaded for admins in edit mode
const LiveEditToolbar = lazy(() => import('@/components/cms/LiveEditToolbar'));

// Heavy auth + regional pages — lazy
const IndexTurkey = lazy(() => import('./IndexTurkey'));
const IndexItaly = lazy(() => import('./IndexItaly'));

const CountryCodes = [
    'US', 'DE', 'IT', 'NG', 'EG', 'AT', 'RS', 'KW', 'BR',
    'GB', 'TR', 'IN', 'PK', 'HU', 'MA', 'BD', 'NP', 'KR'
];

const AcademicBackground = memo(() => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none select-none bg-white -z-10 transform-gpu">
            {/* Light Radial Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-600/5 blur-[120px] rounded-full" />

            {/* Network Particles Effect - Lightened */}
            <div className="absolute inset-0 opacity-[0.4]">
                <svg className="w-full h-full text-indigo-100" aria-hidden="true">
                    <pattern id="light-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#light-grid)" />
                </svg>
            </div>

            {/* Static Connection Points - Optimized for Mobile */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-indigo-200 rounded-full blur-[1px] opacity-0 md:opacity-100"
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




export default function Index() {
    const navigate = useNavigate();
    const { pathname } = window.location;
    const { t, i18n } = useTranslation();
    const { user, loading: authLoading, aal, hasMFA, profile } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSyllabusDropdownOpen, setIsSyllabusDropdownOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const countryOverride = searchParams.get('country')?.toUpperCase();
    const [countryCode, setCountryCode] = useState<string | null>(null);
    // Non-blocking: start false so the page renders immediately
    const [countryLoading, setCountryLoading] = useState(false);

    // 1. Language/Path sync
    useEffect(() => {
        if (pathname === '/it' && i18n.language !== 'it') {
            i18n.changeLanguage('it');
        } else if (pathname === '/tr' && i18n.language !== 'tr') {
            i18n.changeLanguage('tr');
        }
    }, [pathname, i18n]);

    useEffect(() => {
        const override = searchParams.get('country');
        if (override) {
            setCountryCode(override.toUpperCase());
            setCountryLoading(false);
            return;
        }

        getCountryCode()
            .then(code => {
                setCountryCode(code);
                // Auto-redirect if on root and in specific regions
                if (pathname === '/') {
                    if (code === 'TR') {
                        i18n.changeLanguage('tr');
                    } else if (code === 'IT' || code === 'CH' || code === 'SM' || code === 'VA') {
                        i18n.changeLanguage('it');
                    }
                }
            })
            .catch(() => setCountryCode('XX'))
            .finally(() => setCountryLoading(false));
    }, [searchParams, pathname]);

    // Fast-path redirect: check localStorage session cache to avoid waiting for Supabase round-trip
    useEffect(() => {
        try {
            const cachedProfile = localStorage.getItem('italostudy_auth_profile_v1');
            if (cachedProfile) {
                const parsed = JSON.parse(cachedProfile);
                if (parsed && parsed.role !== 'admin' && parsed.role !== 'sub_admin') {
                    window.location.href = 'https://app.italostudy.com/';
                    return;
                }
            }
        } catch { /* silent fail */ }
    }, []);

    // Secondary auth redirect (once Supabase confirms the session)
    useEffect(() => {
        if (!authLoading && user && profile?.role !== 'admin' && profile?.role !== 'sub_admin') {
            window.location.href = 'https://app.italostudy.com/';
        }
    }, [user, authLoading, profile]);

    const { setPageSlug, isEditMode } = useLiveEdit();
    // Only fire DB call for admins in edit mode — saves a DB round-trip for every visitor
    const { getField } = usePageContent(isEditMode ? 'landing-global' : '');

    useEffect(() => { if (isEditMode) setPageSlug('landing-global'); }, [isEditMode]);

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

    // Do NOT block on authLoading — render immediately with user=null (public visitor state).
    // Auth state updates silently when Supabase resolves; public pages don't need auth to render.

    const activeCountry = countryOverride || countryCode;

    // Show localized versions based on PATH first, then COUNTRY
    if (pathname === '/tr' || activeCountry === 'TR') {
        return (
            <Suspense fallback={null}>
                <IndexTurkey />
            </Suspense>
        );
    }

    if (pathname === '/it' || (activeCountry === 'IT' || activeCountry === 'CH' || activeCountry === 'SM' || activeCountry === 'VA')) {
        return (
            <Suspense fallback={null}>
                <IndexItaly />
            </Suspense>
        );
    }

    const currentLocale = i18n.language === 'it' ? 'it_IT' : i18n.language === 'tr' ? 'tr_TR' : 'en_US';

    return (
        <div className="min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden relative bg-white">
            <SEO
                title={getField('seo_title', t('landing.seo.title', 'ItaloStudy | Free CEnT-S & IMAT Prep 2026: Unlimited Mocks & Lectures'))}
                description={getField('seo_description', t('landing.seo.description', 'Experience the world\'s most advanced study simulator for IMAT, SAT, CEnT-S and IELTS preparation. Europe\'s choice for admissions success.'))}
                keywords={getField('seo_keywords', t('landing.seo.keywords', 'italostudy, IMAT preparation, CEnT-S exam guide, European admissions, global study prep'))}
                locale={currentLocale}
                schema={getEducationalOrganizationSchema()}
            />


            <AcademicBackground />
            
            {/* Global Announcement System (Banners & Popups) */}
            <Suspense fallback={null}>
                <AnnouncementBar />
            </Suspense>

            {/* Status Announcement Bar - Next Level UI (Mobile Optimized) */}
            <div className={cn(
                "fixed top-0 left-0 right-0 z-[60] min-h-9 md:h-10 flex items-center justify-center overflow-hidden border-b border-blue-200/30 transition-transform duration-500",
                scrolled ? "-translate-y-full" : "translate-y-0"
            )}>
                {/* Animated Background Layer */}
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
                            Status Hub: <span className="text-slate-500 font-medium italic hidden sm:inline">Discover 2026 roadmap & features</span>
                            <span className="text-slate-500 font-medium italic sm:hidden">2026 Roadmap Live</span>
                        </span>
                    </div>

                    <div className="hidden sm:flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-200 group-hover:translate-x-1 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-2">
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </Link>

                {/* Decorative Shimmer Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
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
                                alt={t('common.logo_alt', 'ItaloStudy Logo - University Entrance Exam Preparation')}
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
                            {[
                                {
                                    name: t('nav.exams'),
                                    path: '/exams',
                                    isDropdown: true,
                                    items: [
                                        { name: t('nav.exam_items.imat'), path: '/imat-exam-ultimate-guide-2026' },
                                        { name: t('nav.exam_items.cents'), path: '/cent-s-exam-ultimate-guide' },
                                    ]
                                },
                                { name: t('nav.resources'), path: '/resources', isStatic: true },
                                { name: t('nav.pricing'), path: '/pricing' },
                                { name: t('nav.blog'), path: '/blog' },
                                { name: 'Store', path: 'https://store.italostudy.com', isExternal: true },
                                { name: t('nav.contact'), path: '/contact', isStatic: true },
                            ].map((item) => (
                                item.isDropdown ? (
                                    <div
                                        key={item.name}
                                        className="relative"
                                        onMouseEnter={() => setIsSyllabusDropdownOpen(true)}
                                        onMouseLeave={() => setIsSyllabusDropdownOpen(false)}
                                    >
                                        <Link
                                            to={item.path!}
                                            className="text-[12px] font-bold tracking-tight transition-colors text-slate-500 hover:text-indigo-600 flex items-center gap-1 py-1"
                                        >
                                            {item.name}
                                            <ChevronRight className={cn("w-3 h-3 rotate-90 transition-transform", isSyllabusDropdownOpen && "rotate-[270deg]")} />
                                        </Link>
                                        {isSyllabusDropdownOpen && (
                                            <div
                                                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-2 rounded-2xl bg-white border border-slate-100 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                                            >
                                                {item.items?.map((subItem) => (
                                                    <Link
                                                        key={subItem.path}
                                                        to={subItem.path}
                                                        className="flex items-center justify-between px-4 py-2.5 rounded-xl text-[11px] font-bold text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all group"
                                                    >
                                                        {subItem.name}
                                                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                    </Link>
                                                ))}
                                            </div>
                                        )}                                    </div>
                                ) : (item.isExternal || item.isStatic) ? (
                                    <a
                                        key={item.name}
                                        href={item.path!}
                                        className="text-[12px] font-bold tracking-tight transition-colors text-slate-500 hover:text-indigo-600"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            {item.name}
                                        </div>
                                    </a>
                                ) : (
                                    <Link
                                        key={item.name}
                                        to={item.path!}
                                        className="text-[12px] font-bold tracking-tight transition-colors text-slate-500 hover:text-indigo-600"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            {item.name}
                                            {item.path === '/pricing' && (
                                                <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 rounded text-[8px] text-emerald-600 font-black animate-pulse uppercase">
                                                    {t('landing.header.beta_free', 'BETA FREE')}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                )
                            ))}
                        </div>
                    </nav>

                    <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
                        <div className="hidden lg:flex items-center gap-4 mr-2">
                            <a href="https://www.instagram.com/italostudycom" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://chat.whatsapp.com/CfVh7u9L6vT7ZFpZwwVa4A" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-500 transition-colors">
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        </div>
                        {user ? (
                            <button
                                onClick={() => window.location.href = 'https://app.italostudy.com/'}
                                className="flex bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-4 md:px-6 py-2 items-center gap-2 transition-colors text-xs md:text-sm"
                            >
                                <LayoutDashboard className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                {t('nav.dashboard')}
                            </button>
                        ) : (
                            <button
                                onClick={() => window.location.href = 'https://app.italostudy.com/auth'}
                                className="flex bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-4 md:px-6 h-9 md:h-10 items-center justify-center transition-all text-xs md:text-sm"
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
                        <div
                            className={cn(
                                "absolute top-full left-0 right-0 mt-4 mx-4 p-8 rounded-[2rem] bg-white border border-slate-100 lg:hidden flex flex-col gap-6 shadow-2xl z-50",
                                "animate-in slide-in-from-top-2 fade-in duration-200"
                            )}
                        >
                            {[
                                {
                                    name: t('nav.exams'),
                                    path: '/exams',
                                    isDropdown: true,
                                    items: [
                                        { name: t('nav.exam_items.imat'), path: '/imat-exam-ultimate-guide-2026' },
                                        { name: t('nav.exam_items.cents'), path: '/cent-s-exam-ultimate-guide' },
                                    ]
                                },
                                { name: t('nav.resources'), path: '/resources', isStatic: true },
                                { name: t('nav.pricing'), path: '/pricing' },
                                { name: t('nav.blog'), path: '/blog' },
                                { name: 'Store', path: 'https://store.italostudy.com', isExternal: true },
                                { name: t('nav.contact'), path: '/contact', isStatic: true },
                            ].map((item) => (
                                item.isDropdown ? (
                                    <div key={item.name} className="flex flex-col gap-4">
                                        <Link
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-lg font-black tracking-tight text-slate-900"
                                        >
                                            {item.name}
                                        </Link>
                                        <div className="grid grid-cols-2 gap-2 pl-4">
                                            {item.items.map((subItem) => (
                                                <Link
                                                    key={subItem.path}
                                                    to={subItem.path}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (item.isExternal || item.isStatic) ? (
                                    <a
                                        key={item.name}
                                        href={item.path!}
                                        className="text-lg font-black tracking-tight text-slate-700"
                                    >
                                        {item.name}
                                    </a>
                                ) : (
                                    <Link
                                        key={item.name}
                                        to={item.path!}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-lg font-black tracking-tight text-slate-700"
                                    >
                                        <div className="flex items-center gap-2">
                                            {item.name}
                                            {item.path === '/pricing' && (
                                                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded text-[10px] text-emerald-600 font-black animate-pulse uppercase">
                                                    {t('landing.header.beta_free', 'Beta Free')}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                )
                            ))}
                        </div>
                    )}
            </header>

            {/* 1. Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-0">
                <div className="container mx-auto relative z-10 w-full max-w-7xl">
                    <HeroSection />
                </div>
            </section>

            {/* University Branding - Global Presence */}
            <Suspense fallback={null}>
                <UniversityMarquee />
            </Suspense>

            {/* 2. Ultimate Guide (EXAMS) */}
            <Suspense fallback={<div className="h-[600px] bg-white animate-pulse" />}>
                <ExamMarketingSection />
            </Suspense>

            {/* Trustpilot Proof - Premium Carousel */}
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
                    className="h-14 md:h-18 px-8 md:px-12 bg-indigo-600 text-white font-black text-xs md:text-base lg:text-lg rounded-full hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all group w-full max-w-sm md:w-auto flex items-center justify-center"
                >
                    {t('common.start_free')}
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </button>
            </section>

            {/* Footer — directly at page root, no white section wrapping it */}
            <Footer />

            {/* LiveEditToolbar — only loaded for admins in edit mode */}
            {isEditMode && (
                <Suspense fallback={null}>
                    <LiveEditToolbar />
                </Suspense>
            )}
        </div>
    );
}
