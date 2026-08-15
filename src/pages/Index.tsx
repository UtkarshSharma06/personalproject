import { lazy, Suspense, useEffect, useState, memo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
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
import PWHeroSlider from '@/components/home/PWHeroSlider';
import PWTrustedSection from '@/components/home/PWTrustedSection';
import PWExamCategories from '@/components/home/PWExamCategories';
import PWNavbar from '@/components/home/PWNavbar';
import PWStudyResources from '@/components/home/PWStudyResources';
import PWCourses from '@/components/home/PWCourses';
import faqData from '@/data/italy-faqs-2026.json';
import { getEducationalOrganizationSchema } from '@/utils/seo-schemas';

// Non-critical components — lazy loaded
const Footer = lazy(() => import('@/components/Footer'));
const TrustpilotSection = lazy(() => import('@/components/TrustpilotSection'));
const UniversityMarquee = lazy(() => import('@/components/home/UniversityMarquee'));
const GlobalChallenge = lazy(() => import('@/components/home/GlobalChallenge'));
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
                    // Check if user has explicitly chosen a language in this session to prevent infinite loop trap
                    const langPref = localStorage.getItem('italo_lang_preference');
                    if (langPref) return;

                    if (code === 'TR') {
                        i18n.changeLanguage('tr');
                        navigate('/tr', { replace: true });
                    } else if (code === 'IT' || code === 'CH' || code === 'SM' || code === 'VA') {
                        i18n.changeLanguage('it');
                        navigate('/it', { replace: true });
                    }
                }
            })
            .catch(() => setCountryCode('XX'))
            .finally(() => setCountryLoading(false));
    }, [searchParams, pathname, navigate, i18n]);

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
    
    // If user has explicitly chosen a language, their choice overrides IP detection entirely
    const userLangPref = localStorage.getItem('italo_lang_preference');
    const effectiveCountry = userLangPref ? null : activeCountry;

    // Show localized versions based on PATH first, then COUNTRY
    if (pathname === '/tr' || effectiveCountry === 'TR') {
        return (
            <Suspense fallback={null}>
                <IndexTurkey />
            </Suspense>
        );
    }

    if (pathname === '/it' || (effectiveCountry === 'IT' || effectiveCountry === 'CH' || effectiveCountry === 'SM' || effectiveCountry === 'VA')) {
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
            
            {/* Global Announcement System (Banners & Popups) */}
            <Suspense fallback={null}>
                <AnnouncementBar />
            </Suspense>


            {/* H1 — required for SEO; visually hidden since hero uses banner images */}
            <h1 className="sr-only">ItaloStudy — Free Prep for CEnT-S, IMAT, SAT &amp; IELTS</h1>

            <PWNavbar />

            {/* Wrapped in lavender background to guarantee seamless blending between slider and trusted section */}
            <div className="bg-[#f6f4fa] w-full">
                {/* 1. PW Hero Slider */}
                <PWHeroSlider />

                {/* 1.2 PW Trusted Section */}
                <PWTrustedSection />
            </div>

            {/* 1.5 PW Exam Categories */}
            <PWExamCategories />

            {/* 1.6 PW Courses */}
            <PWCourses />

            {/* University Branding - Global Presence */}
            <Suspense fallback={null}>
                <UniversityMarquee />
            </Suspense>

            {/* Study Resources */}
            <PWStudyResources />

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
            <section className="py-16 md:py-24 bg-white flex flex-col items-center text-center px-6 border-t border-[#eaeaea]">
                <h2 className="text-[28px] md:text-[36px] font-bold text-[#333333] mb-8 max-w-2xl">
                    <EditableText fieldKey="footer_cta_title" fallback={t('footer.cta_title')} />
                </h2>
                <button 
                    onClick={() => window.open('https://app.italostudy.com/auth', '_blank', 'noopener,noreferrer')}
                    className="h-14 md:h-14 px-10 md:px-12 bg-[#5a4bda] text-white font-semibold text-[16px] rounded-[4px] hover:bg-[#483ab8] transition-all w-full max-w-sm md:w-auto flex items-center justify-center"
                >
                    {t('common.start_free')}
                    <ArrowRight className="w-5 h-5 ml-2" />
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
