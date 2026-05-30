import React from 'react';
import SEO from '@/components/SEO';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import PWNavbar from '@/components/home/PWNavbar';
import Footer from '@/components/Footer';

export default function About() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            <SEO
                title="About Us - ItaloStudy"
                description="ItaloStudy is a student's lifelong learning partner that is democratizing education for Italian university admissions."
            />

            <PWNavbar />

            <main className="pt-[72px]">
                {/* 1. Hero Section (PW Style) */}
                <div className="relative w-full min-h-[500px] md:h-[500px] flex flex-col justify-center items-center text-center px-4 py-20 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.76), rgba(0, 0, 0, 0.84)), url(/cityview.webp)`
                    }}>
                    
                    <div className="mx-auto px-4 py-[4px] rounded-full bg-white mb-6 w-fit text-center">
                        <span className="text-[12px] font-bold text-[#09090B] tracking-wider uppercase">
                            {t('about.pw_hero_title', 'ABOUT ITALOSTUDY')}
                        </span>
                    </div>

                    <h1 className="text-[28px] md:text-[42px] font-medium text-white leading-tight mt-4">
                        {t('about.pw_hero_slogan_p1', 'Ace the Test, Be Your Best.')}
                    </h1>
                    <div className="mt-2 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                        <div className="text-[32px] md:text-[48px] font-medium text-[#B2A9FF]">
                            {t('about.pw_hero_slogan_p2_highlight', 'Unlock')}
                        </div>
                        <div className="text-[28px] md:text-[48px] font-medium text-white text-center">
                            {t('about.pw_hero_slogan_p2', 'your Italian degrees')}
                        </div>
                    </div>

                    <p className="text-[15px] md:text-[18px] font-medium text-white/90 mt-6 lg:mx-32 max-w-4xl leading-relaxed">
                        {t('about.pw_hero_desc', "ItaloStudy serves as the premier academic bridge for international students aspiring to enter the European Higher Education Area. With a dedicated focus on Italian excellence, we provide world-class, accessible preparation to help ambitious students secure their place at Italy's most prestigious universities.")}
                    </p>
                </div>

                {/* 2. Our Vision Section */}
                <div className="w-full bg-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.pw.live/_next/static/media/vision-bg.f009a243.svg')] bg-no-repeat bg-bottom bg-cover opacity-50 hidden sm:block pointer-events-none"></div>
                    
                    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                        <div className="lg:w-1/2 w-full text-left mt-8 lg:mt-0">
                            <h2 className="text-[32px] md:text-[42px] font-bold text-slate-900 mb-8">
                                {t('about.pw_vision_title', 'Our Vision')}
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-7 h-7 text-indigo-600 shrink-0 mt-0.5" />
                                    <p className="text-[18px] text-[#3d3d3d] leading-relaxed">
                                        {t('about.pw_vision_point1', 'To make European academic excellence universally accessible to ambitious students worldwide.')}
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-7 h-7 text-indigo-600 shrink-0 mt-0.5" />
                                    <p className="text-[18px] text-[#3d3d3d] leading-relaxed">
                                        {t('about.pw_vision_point2', 'To provide unparalleled, high-quality preparation that removes barriers to international student mobility.')}
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-7 h-7 text-indigo-600 shrink-0 mt-0.5" />
                                    <p className="text-[18px] text-[#3d3d3d] leading-relaxed">
                                        {t('about.pw_vision_point3', 'To guide every student in realizing their aspiration of studying in Italy, supporting their journey toward academic and professional distinction.')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="xl:w-1/2 w-full flex justify-center xl:justify-end">
                            <img 
                                src="/scene.webp" 
                                alt="Our Vision" 
                                className="w-full max-w-[500px] h-auto object-contain rounded-2xl shadow-xl"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Our Founders Section */}
                <div className="w-full bg-[#f8f9fa] py-16 md:py-24 border-t border-slate-200">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-[32px] md:text-[42px] font-bold text-slate-900 mb-12 text-center md:text-left">
                            {t('about.pw_founders_title', 'Our Founders')}
                        </h2>

                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            {/* Founder Card (Left Side) */}
                            <div className="flex flex-col bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden w-full lg:w-[400px] shrink-0 mx-auto lg:mx-0">
                                <div className="w-full px-4 md:px-8 pt-10 pb-6 flex flex-col items-center text-center">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-indigo-50 mb-6 shadow-sm shrink-0">
                                        <img 
                                            src="/founder pic.webp" 
                                            alt="Utkarsh Sharma" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/founder pic.jpg';
                                            }}
                                        />
                                    </div>
                                    <h3 className="text-[24px] font-bold text-slate-900 mb-2">
                                        {t('about.pw_founder1_name', 'Utkarsh Sharma')}
                                    </h3>
                                    <span className="text-[16px] font-medium text-slate-600 mb-4 block">
                                        {t('about.pw_founder1_role', 'Founder and CEO')}
                                    </span>
                                    <h4 className="text-[18px] font-semibold text-slate-800 italic leading-relaxed mb-2">
                                        "{t('about.pw_founder1_quote', 'My aim is to bridge the gap between international talent and European academic institutions, elevating the standard of global mobility.')}"
                                    </h4>
                                </div>
                                
                            </div>

                            {/* Founder Bio (Right Side / Below on Mobile) */}
                            <div className="w-full lg:flex-1">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 lg:p-8 h-full">
                                    <h3 className="text-[24px] font-bold text-slate-900 mb-6 hidden lg:block">
                                        {t('about.pw_founder1_name', 'Utkarsh Sharma')}
                                    </h3>
                                    <div className="text-[15px] lg:text-[16px] leading-relaxed text-slate-700 font-medium space-y-4">
                                        <p>
                                            Utkarsh Sharma, the Founder and CEO of ItaloStudy, established the platform with a clear vision: to bridge the gap between international talent and European academic institutions. Driven by a deep appreciation for Italy's educational heritage and modern technology, he created a pathway that makes world-class preparation accessible globally.
                                        </p>
                                        <p>
                                            Under his leadership, ItaloStudy has grown into a distinguished platform for Italian university admissions, offering rigorous curricula for the IMAT, CEnT-S, and TOLC examinations. 
                                        </p>
                                        <p>
                                            Utkarsh remains dedicated to academic mentorship, continuously innovating to uphold a standard of excellence and ensure that international study remains an attainable goal for dedicated students.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Our Presence Section (PW Style) */}
                <div className="w-full bg-[#fdfaf2] py-16 md:py-24">
                    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 lg:gap-24">
                        <div className="w-full md:w-5/12 text-left">
                            <h2 className="text-[32px] md:text-[42px] font-bold text-slate-900 mb-4">
                                Our Presence
                            </h2>
                            <p className="text-[16px] md:text-[18px] text-[#3d3d3d] leading-relaxed mb-8">
                                Our community extends globally, creating a widespread academic network that connects ambitious students from across the world to Italy's elite institutions.
                            </p>
                            
                            <div className="flex flex-col gap-5">
                                <div className="bg-[#fef2cd] rounded-full px-6 py-4 flex items-center">
                                    <span className="text-[20px] font-bold text-slate-900">85+</span>
                                    <span className="text-[18px] text-slate-800 ml-2">Countries</span>
                                </div>
                                <div className="bg-[#fef2cd] rounded-full px-6 py-4 flex items-center">
                                    <span className="text-[20px] font-bold text-slate-900">5,000+</span>
                                    <span className="text-[18px] text-slate-800 ml-2">Students</span>
                                </div>
                                <div className="bg-[#fef2cd] rounded-full px-6 py-4 flex items-center">
                                    <span className="text-[20px] font-bold text-slate-900">3+</span>
                                    <span className="text-[18px] text-slate-800 ml-2">Exam Categories</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-full md:w-7/12 flex justify-center">
                            <img 
                                src="/worldmap2.webp" 
                                alt="Our Global Presence" 
                                className="w-full max-w-[600px] h-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
