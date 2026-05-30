import React, { useState } from 'react';
import SEO from '@/components/SEO';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import PWNavbar from '@/components/home/PWNavbar';
import Footer from '@/components/Footer';

const LinkedInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="#0A66C2">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
);

export default function About() {
    const { t } = useTranslation();
    const [isBioExpanded, setIsBioExpanded] = useState(false);
    const [isArpitBioExpanded, setIsArpitBioExpanded] = useState(false);

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                            {/* --------------------- Founder Card 1 - Utkarsh --------------------- */}
                            <div className="w-full h-[460px]">
                                {/* Click to expand */}
                                <div className="flex flex-col bg-white rounded-md shadow-md w-full h-full overflow-hidden border border-slate-100 relative">
                                    <div className={`flex-1 w-full px-6 pt-6 pb-4 ${isBioExpanded ? 'overflow-y-auto' : 'overflow-hidden flex flex-col justify-center'}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                        {!isBioExpanded ? (
                                            <div className="flex flex-col items-center text-center animate-in fade-in duration-500 pb-[60px]">
                                                <div className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-full overflow-hidden mb-4 shrink-0 border-4 border-indigo-50 shadow-sm">
                                                    <img src="/founder pic.webp" alt="Utkarsh Sharma" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/founder pic.jpg'; }} />
                                                </div>
                                                <h3 className="text-[20px] md:text-[24px] font-bold text-slate-900 mb-1 flex items-center justify-center gap-2">
                                                    {t('about.pw_founder1_name', 'Utkarsh Sharma')}
                                                    <a href="https://www.linkedin.com/in/utkarshzsharma/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                        <LinkedInIcon />
                                                    </a>
                                                </h3>
                                                <span className="text-[14px] md:text-[16px] font-medium text-slate-700 mb-4 block">{t('about.pw_founder1_role', 'Founder and CEO')}</span>
                                                <h4 className="text-[15px] md:text-[18px] font-semibold text-slate-800 italic leading-relaxed">
                                                    "{t('about.pw_founder1_quote', 'My aim is to bridge the gap between international talent and European academic institutions, elevating the standard of global mobility.')}"
                                                </h4>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col text-left animate-in fade-in duration-500 pb-[60px]">
                                                <h3 className="text-[20px] md:text-[24px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                    {t('about.pw_founder1_name', 'Utkarsh Sharma')}
                                                    <a href="https://www.linkedin.com/in/utkarshzsharma/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                        <LinkedInIcon />
                                                    </a>
                                                </h3>
                                                <div className="text-[14px] md:text-[15px] leading-[24px] font-medium text-slate-700 space-y-4">
                                                    <p>Utkarsh Sharma, the Founder and CEO of ItaloStudy, established the platform with a clear vision: to bridge the gap between international talent and European academic institutions. Driven by a deep appreciation for Italy's educational heritage and modern technology, he created a pathway that makes world-class preparation accessible globally.</p>
                                                    <p>Under his leadership, ItaloStudy has grown into a distinguished platform for Italian university admissions, offering rigorous curricula for the IMAT, CEnT-S, and TOLC examinations.</p>
                                                    <p>Utkarsh remains dedicated to academic mentorship, continuously innovating to uphold a standard of excellence and ensure that international study remains an attainable goal for dedicated students.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div onClick={() => setIsBioExpanded(!isBioExpanded)} className="absolute bottom-0 left-0 w-full py-4 border-t border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition-colors flex justify-center items-center">
                                        <span className="text-[#5a4bda] font-bold text-[14px] md:text-[15px] uppercase tracking-wider">{isBioExpanded ? "Read Less" : "Read More"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* --------------------- Founder Card 2 - Arpit --------------------- */}
                            <div className="w-full h-[460px]">
                                {/* Click to expand */}
                                <div className="flex flex-col bg-white rounded-md shadow-md w-full h-full overflow-hidden border border-slate-100 relative">
                                    <div className={`flex-1 w-full px-6 pt-6 pb-4 ${isArpitBioExpanded ? 'overflow-y-auto' : 'overflow-hidden flex flex-col justify-center'}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                        {!isArpitBioExpanded ? (
                                            <div className="flex flex-col items-center text-center animate-in fade-in duration-500 pb-[60px]">
                                                <div className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-full overflow-hidden mb-4 shrink-0 border-4 border-indigo-50 shadow-sm">
                                                    <img src="/arpit.webp" alt="Arpit Gulpadiya" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/arpit.jpg'; }} />
                                                </div>
                                                <h3 className="text-[20px] md:text-[24px] font-bold text-slate-900 mb-1 flex items-center justify-center gap-2">
                                                    Arpit Gulpadiya
                                                    <a href="https://www.linkedin.com/in/arpit-gulpadiya/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                        <LinkedInIcon />
                                                    </a>
                                                </h3>
                                                <span className="text-[14px] md:text-[16px] font-medium text-slate-700 mb-4 block">Co-Founder</span>
                                                <h4 className="text-[15px] md:text-[18px] font-semibold text-slate-800 italic leading-relaxed">
                                                    "My aim is to build a flawless technological ecosystem that empowers students to achieve global academic excellence."
                                                </h4>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col text-left animate-in fade-in duration-500 pb-[60px]">
                                                <h3 className="text-[20px] md:text-[24px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                    Arpit Gulpadiya
                                                    <a href="https://www.linkedin.com/in/arpit-gulpadiya/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                        <LinkedInIcon />
                                                    </a>
                                                </h3>
                                                <div className="text-[14px] md:text-[15px] leading-[24px] font-medium text-slate-700 space-y-4">
                                                    <p>Arpit brings a powerful intersection of technical architecture, finance, and cross-border academic experience to the platform. Having studied at emlyon business school in Europe, alongside a gold-medal Economics background from Manipal University, he deeply understands the transformative impact of European education.</p>
                                                    <p>At ItaloStudy, Arpit drove the technological vision, building the cross-platform ecosystem spanning web, mobile, and digital commerce. He architected the platform's advanced product telemetry, user-acquisition pipelines using Supabase, and automated global multi-currency billing systems.</p>
                                                    <p>Demonstrating his technical prowess, he also co-developed a browser-based AI proctoring system utilizing TensorFlow.js and Google MediaPipe vision APIs to track real-time gaze and face presence, ensuring absolute academic integrity for all simulated mock exams.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div onClick={() => setIsArpitBioExpanded(!isArpitBioExpanded)} className="absolute bottom-0 left-0 w-full py-4 border-t border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition-colors flex justify-center items-center">
                                        <span className="text-[#5a4bda] font-bold text-[14px] md:text-[15px] uppercase tracking-wider">{isArpitBioExpanded ? "Read Less" : "Read More"}</span>
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
