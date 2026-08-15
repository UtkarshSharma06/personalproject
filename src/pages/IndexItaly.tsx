
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
const HomeHowItWorks = lazy(() => import('@/components/home/HomeHowItWorks'));
const HomeWhyChooseUs = lazy(() => import('@/components/home/HomeWhyChooseUs'));
const GlobalChallenge = lazy(() => import('@/components/home/GlobalChallenge'));
const VideoReviewSection = lazy(() => import('@/components/home/VideoReviewSection'));
const StudyItalyClusterSection = lazy(() => import('@/components/home/StudyItalyClusterSection'));

import PWHeroSlider from '@/components/home/PWHeroSlider';
import PWTrustedSection from '@/components/home/PWTrustedSection';
import PWExamCategories from '@/components/home/PWExamCategories';
import PWNavbar from '@/components/home/PWNavbar';
import PWStudyResources from '@/components/home/PWStudyResources';
import PWCourses from '@/components/home/PWCourses';

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

                <PWNavbar />

                {/* 1. PW Hero Slider */}
                <PWHeroSlider />

                {/* 1.2 PW Trusted Section */}
                <PWTrustedSection />

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

                <Footer />
                <LiveEditToolbar />
            </div>
        </LiveEditProvider>
    );
}
