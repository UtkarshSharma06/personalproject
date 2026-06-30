import { useState, useRef, useEffect } from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth';
import { useLocation } from 'react-router-dom';
import { 
    Menu, 
    X, 
    ChevronDown, 
    Globe, 
    BookOpen, 
    GraduationCap, 
    Stethoscope, 
    ChevronRight,
    ChevronLeft,
    LayoutDashboard,
    FileText
} from 'lucide-react';

const FlagUK = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className={className}>
        <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
        <clipPath id="t"><path d="M30,15 h30 v15 z v-15 h-30 z h-30 v-15 z v15 h30 z"/></clipPath>
        <g clipPath="url(#s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
        </g>
    </svg>
);

const FlagIT = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className={className}>
        <rect width="1" height="2" fill="#009246"/>
        <rect x="1" width="1" height="2" fill="#ffffff"/>
        <rect x="2" width="1" height="2" fill="#ce2b37"/>
    </svg>
);

const FlagTR = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" className={className}>
        <rect width="1200" height="800" fill="#E30A17"/>
        <circle cx="425" cy="400" r="200" fill="#fff"/>
        <circle cx="475" cy="400" r="160" fill="#E30A17"/>
        <polygon points="583.334,400 735.654,449.52 641.348,319.64 641.348,480.36 735.654,350.48" fill="#fff"/>
    </svg>
);

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { imatLinks, centsLinks, tolcLinks } from '@/lib/nav-links';

export default function PWNavbar({ subNavigation }: { subNavigation?: React.ReactNode }) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileMenuView, setMobileMenuView] = useState<'main' | 'exams'>('main');
    const [isExamsDropdownOpen, setIsExamsDropdownOpen] = useState(false);
    const [activeExamId, setActiveExamId] = useState('imat');
    const [expandedMobileExam, setExpandedMobileExam] = useState<string | null>(null);
    const [isMocksDropdownOpen, setIsMocksDropdownOpen] = useState(false);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mocksDropdownRef = useRef<HTMLDivElement>(null);
    const langDropdownRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsExamsDropdownOpen(false);
            }
            if (mocksDropdownRef.current && !mocksDropdownRef.current.contains(event.target as Node)) {
                setIsMocksDropdownOpen(false);
            }
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
                setIsLangDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const allExamsData = [
        {
            id: 'imat',
            name: t('nav.exam_items.imat', 'IMAT (Medicine)'),
            icon: <Stethoscope className="w-5 h-5" />,
            links: imatLinks,
            path: '/imat-exam-ultimate-guide-2026'
        },
        {
            id: 'cents',
            name: t('nav.exam_items.cents', 'CEnT-S'),
            icon: <FileText className="w-5 h-5" />,
            links: centsLinks,
            path: '/cent-s-exam-ultimate-guide'
        },
        {
            id: 'tolc',
            name: t('nav.exam_items.tolc', 'TOLC (CISIA)'),
            icon: <GraduationCap className="w-5 h-5" />,
            links: tolcLinks,
            path: '/tolc-exam-ultimate-guide-2026'
        }
    ];

    const activeExam = allExamsData.find(e => e.id === activeExamId) || allExamsData[0];

    const cookieString = document.cookie;
    const isTrCookie = cookieString.includes('googtrans=/en/tr') || cookieString.includes('googtrans=/auto/tr');
    const isItCookie = cookieString.includes('googtrans=/en/it') || cookieString.includes('googtrans=/auto/it');
    const isTr = location.pathname.startsWith('/tr') || isTrCookie;
    const isIt = location.pathname.startsWith('/it') || isItCookie;
    const currentLang = isTr ? 'TR' : isIt ? 'IT' : 'EN';

    const handleLanguageChange = (lang: 'EN' | 'IT' | 'TR') => {
        setIsLangDropdownOpen(false);
        setIsMobileMenuOpen(false);
        if (lang === currentLang) return;
        
        // Set an explicit flag to prevent IP-based auto-redirects from overriding user choice
        localStorage.setItem('italo_lang_preference', lang);
        
        let basePath = location.pathname;
        if (basePath.startsWith('/tr')) basePath = basePath.replace(/^\/tr/, '') || '/';
        if (basePath.startsWith('/it')) basePath = basePath.replace(/^\/it/, '') || '/';

        let newPath = basePath;

        if (lang === 'TR') {
            document.cookie = 'googtrans=/en/tr; path=/;';
            // Also explicitly redirect to /tr if we are on the homepage for standard routing
            if (basePath === '/') newPath = '/tr';
        } else if (lang === 'IT') {
            document.cookie = 'googtrans=/en/it; path=/;';
            if (basePath === '/') newPath = '/it';
        } else if (lang === 'EN') {
            const domains = [window.location.hostname, '.' + window.location.hostname, 'localhost', '.localhost', 'italostudy.com', '.italostudy.com'];
            domains.forEach(d => {
                document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${d}`;
                document.cookie = `i18next=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${d}`;
            });
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'i18next=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            localStorage.removeItem('i18nextLng');
            localStorage.removeItem('i18nextLng-italostudy');
            sessionStorage.removeItem('user_country');
        }

        // If we are on /tr or /it and switch to EN, we should redirect back to /
        if (lang === 'EN' && (location.pathname === '/tr' || location.pathname === '/it' || location.pathname.startsWith('/tr/') || location.pathname.startsWith('/it/'))) {
            window.location.href = '/' + location.search;
            return;
        }

        if (newPath !== location.pathname) {
            window.location.href = newPath + location.search;
        } else {
            window.location.reload();
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="absolute inset-0 bg-white/95 backdrop-blur-md border-b border-slate-200/50 -z-10 pointer-events-none" />
            <div className="container mx-auto px-4 lg:px-8 h-[80px] flex items-center justify-between">
                
                {/* Left Side: Hamburger, Logo, All Exams, Links */}
                <div className="flex items-center gap-4 lg:gap-8">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden text-slate-900 hover:text-slate-900 transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                    
                    <Link to="/" className="flex items-center shrink-0 notranslate" translate="no">
                        <img
                            src="/logo.webp"
                            alt="ItaloStudy Logo"
                            className="h-8 md:h-10 w-auto object-contain notranslate"
                            translate="no"
                        />
                    </Link>

                    {/* All Exams Dropdown (Desktop) */}
                    <div className="hidden lg:block relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsExamsDropdownOpen(!isExamsDropdownOpen)}
                            className={`flex items-center gap-2 border border-indigo-200/70 px-5 py-2.5 rounded-lg text-[#5a4bda] font-bold shadow-sm hover:shadow hover:bg-indigo-50/50 transition-all bg-white ${isTr || isIt ? "text-[14px] xl:text-[15px] px-4" : "text-[15px]"}`}
                        >
                            <span>{t('nav.exams', 'Exams')}</span>
                            <ChevronDown className={cn("w-4 h-4 transition-transform", isExamsDropdownOpen && "rotate-180")} />
                        </button>
                        
                        {isExamsDropdownOpen && (
                            <div className="absolute top-full left-0 mt-3 w-[700px] bg-white border border-slate-200 shadow-2xl rounded-xl overflow-hidden z-50 flex h-[400px]">
                                {/* Left Side: Exam List */}
                                <div className="w-1/3 bg-slate-50 border-r border-slate-200 py-3 flex flex-col">
                                    {allExamsData.map((exam) => (
                                        <button
                                            key={exam.id}
                                            onMouseEnter={() => setActiveExamId(exam.id)}
                                            onClick={() => {
                                                window.location.href = exam.path;
                                                setIsExamsDropdownOpen(false);
                                            }}
                                            className={cn(
                                                "flex items-center justify-between px-4 py-3 text-left transition-colors",
                                                activeExamId === exam.id 
                                                    ? "bg-white border-l-4 border-indigo-600 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]" 
                                                    : "border-l-4 border-transparent hover:bg-slate-100"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                                    activeExamId === exam.id ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-500"
                                                )}>
                                                    {exam.icon}
                                                </div>
                                                <span className={cn(
                                                    "font-bold text-[14px]",
                                                    activeExamId === exam.id ? "text-indigo-900" : "text-slate-600"
                                                )}>
                                                    {exam.name}
                                                </span>
                                            </div>
                                            <ChevronRight className={cn(
                                                "w-4 h-4 transition-colors",
                                                activeExamId === exam.id ? "text-indigo-600" : "text-transparent"
                                            )} />
                                        </button>
                                    ))}
                                </div>
                                
                                {/* Right Side: Authority Pages Grid */}
                                <div className="w-2/3 bg-white p-6 overflow-y-auto">
                                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                                        <h3 className="font-black text-slate-900 flex items-center gap-2">
                                            {activeExam.icon}
                                            {activeExam.name} Hub
                                        </h3>
                                        <Link 
                                            to={activeExam.path} 
                                            onClick={() => setIsExamsDropdownOpen(false)}
                                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                                        >
                                            {t('nav.view_main_guide', 'View Main Guide \u2192')}
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {activeExam.links.map((link, i) => (
                                            <Link 
                                                key={i} 
                                                to={link.path}
                                                onClick={() => setIsExamsDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-indigo-400 hover:shadow-md transition-all group"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-500 transition-colors shrink-0" />
                                                <span className="text-[13px] font-semibold text-slate-900 group-hover:text-indigo-700 leading-tight">
                                                    {t(`nav.links.${link.label}`, link.label)}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Desktop Nav Links */}
                    <nav className={cn("hidden lg:flex items-center", isTr || isIt ? "gap-1 xl:gap-3" : "gap-3 xl:gap-5")}>
                        {/* Mocks Dropdown */}
                        <div className="relative" ref={mocksDropdownRef}>
                            <button
                                onClick={() => setIsMocksDropdownOpen(!isMocksDropdownOpen)}
                                className={`flex items-center gap-1 ${isTr || isIt ? "text-[15px] xl:text-[16px]" : "text-[15px] xl:text-[16px]"} font-semibold text-slate-900 hover:text-[#5a4bda] transition-colors whitespace-nowrap`}
                            >
                                Mocks
                                <ChevronDown className={cn("w-4 h-4 transition-transform", isMocksDropdownOpen && "rotate-180")} />
                            </button>
                            
                            {isMocksDropdownOpen && (
                                <div className="absolute top-full left-0 mt-3 w-48 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50 flex flex-col py-2">
                                    <Link 
                                        to="/imat-mock" 
                                        onClick={() => setIsMocksDropdownOpen(false)}
                                        className="px-4 py-2 hover:bg-slate-50 text-[14px] font-medium text-slate-900 hover:text-indigo-600 transition-colors"
                                    >
                                        IMAT Mocks
                                    </Link>
                                    <Link 
                                        to="/cent-s-mock" 
                                        onClick={() => setIsMocksDropdownOpen(false)}
                                        className="px-4 py-2 hover:bg-slate-50 text-[14px] font-medium text-slate-900 hover:text-indigo-600 transition-colors"
                                    >
                                        CEnT-S Mocks
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link to="/resources" className={`${isTr || isIt ? "text-[15px] xl:text-[16px]" : "text-[15px] xl:text-[16px]"} font-semibold text-slate-900 hover:text-[#5a4bda] transition-colors flex items-center gap-1.5 whitespace-nowrap`}>
                            {t('nav.resources', 'Resources')}
                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-black uppercase tracking-wider">Free</span>
                        </Link>
                        <Link to="/pricing" className={`${isTr || isIt ? "text-[15px] xl:text-[16px]" : "text-[15px] xl:text-[16px]"} font-semibold text-slate-900 hover:text-[#5a4bda] transition-colors flex items-center gap-1.5 whitespace-nowrap`}>
                            {t('nav.pricing', 'Pricing')}
                        </Link>
                        <Link to="/courses" className={`${isTr || isIt ? "text-[15px] xl:text-[16px]" : "text-[15px] xl:text-[16px]"} font-semibold text-slate-900 hover:text-[#5a4bda] transition-colors whitespace-nowrap`}>
                            Courses
                        </Link>
                        <Link to="/blog" className={`${isTr || isIt ? "text-[15px] xl:text-[16px]" : "text-[15px] xl:text-[16px]"} font-semibold text-slate-900 hover:text-[#5a4bda] transition-colors whitespace-nowrap`}>
                            {t('nav.blog', 'Blog')}
                        </Link>
                        <Link to="/about" className={`${isTr || isIt ? "text-[15px] xl:text-[16px]" : "text-[15px] xl:text-[16px]"} font-semibold text-slate-900 hover:text-[#5a4bda] transition-colors whitespace-nowrap`}>
                            About
                        </Link>
                        <a href="https://store.italostudy.com" className={`${isTr || isIt ? "text-[15px] xl:text-[16px]" : "text-[15px] xl:text-[16px]"} font-semibold text-slate-900 hover:text-[#5a4bda] transition-colors whitespace-nowrap`}>
                            {t('nav.store', 'Store')}
                        </a>
                        <Link to="/contact" className={`${isTr || isIt ? "text-[15px] xl:text-[16px]" : "text-[15px] xl:text-[16px]"} font-semibold text-slate-900 hover:text-[#5a4bda] transition-colors whitespace-nowrap`}>
                            {t('nav.contact', 'Contact')}
                        </Link>
                    </nav>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 lg:gap-4">
                    {/* Language Switcher Desktop */}
                    <div className="block relative" ref={langDropdownRef}>
                        <button
                            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                            className="flex items-center gap-2 text-slate-600 hover:text-[#5a4bda] transition-colors py-2 px-2"
                        >
                            {currentLang === 'EN' ? <FlagUK className="w-6 lg:w-7 h-auto rounded-[2px] shadow-sm" /> : 
                             currentLang === 'IT' ? <FlagIT className="w-6 lg:w-7 h-auto rounded-[2px] shadow-sm" /> : 
                             <FlagTR className="w-6 lg:w-7 h-auto rounded-[2px] shadow-sm" />}
                            <ChevronDown className={cn("w-4 h-4 lg:w-5 lg:h-5 transition-transform opacity-70", isLangDropdownOpen && "rotate-180")} />
                        </button>
                        
                        {isLangDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 w-40 lg:w-44 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50 py-2 notranslate" translate="no">
                                <button onClick={() => handleLanguageChange('EN')} className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-[15px] hover:bg-slate-50 transition-colors", currentLang === 'EN' ? "font-bold text-indigo-600 bg-indigo-50/30" : "font-medium text-slate-900")}>
                                    <FlagUK className="w-6 lg:w-7 h-auto rounded-[2px] shadow-sm shrink-0" />
                                    English
                                </button>
                                <button onClick={() => handleLanguageChange('IT')} className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-[15px] hover:bg-slate-50 transition-colors", currentLang === 'IT' ? "font-bold text-indigo-600 bg-indigo-50/30" : "font-medium text-slate-900")}>
                                    <FlagIT className="w-6 lg:w-7 h-auto rounded-[2px] shadow-sm shrink-0" />
                                    Italiano
                                </button>
                                <button onClick={() => handleLanguageChange('TR')} className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-[15px] hover:bg-slate-50 transition-colors", currentLang === 'TR' ? "font-bold text-indigo-600 bg-indigo-50/30" : "font-medium text-slate-900")}>
                                    <FlagTR className="w-6 lg:w-7 h-auto rounded-[2px] shadow-sm shrink-0" />
                                    Türkçe
                                </button>
                            </div>
                        )}
                    </div>

                    {user ? (
                        <button
                            onClick={() => window.location.href = 'https://app.italostudy.com/'}
                            className="bg-gradient-to-r from-[#5a4bda] to-indigo-600 hover:from-[#4a3eb3] hover:to-indigo-700 text-white font-bold rounded-lg px-3 lg:px-6 h-9 md:h-[42px] flex items-center justify-center shadow-[0_4px_14px_0_rgba(90,75,218,0.39)] hover:shadow-[0_6px_20px_rgba(90,75,218,0.23)] hover:-translate-y-0.5 transition-all duration-200 text-[13px] lg:text-[15px] whitespace-nowrap"
                        >
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            {t('nav.dashboard', 'Dashboard')}
                        </button>
                    ) : (
                        <button
                            onClick={() => window.location.href = 'https://app.italostudy.com/auth'}
                            className="bg-gradient-to-r from-[#5a4bda] to-indigo-600 hover:from-[#4a3eb3] hover:to-indigo-700 text-white font-bold rounded-lg px-3 lg:px-4 xl:px-5 h-9 md:h-[42px] flex items-center justify-center shadow-[0_4px_14px_0_rgba(90,75,218,0.39)] hover:shadow-[0_6px_20px_rgba(90,75,218,0.23)] hover:-translate-y-0.5 transition-all duration-200 text-[13px] lg:text-[14px] whitespace-nowrap"
                        >
                            {t('nav.login_register', 'Login / Register')}
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Navigation Full-Screen Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="lg:hidden fixed inset-0 z-[100] bg-white flex flex-col"
                    >
                        {/* Mobile Menu Header */}
                        <div className="h-[72px] px-4 flex items-center justify-between border-b border-[#eaeaea] shrink-0">
                            {mobileMenuView === 'main' ? (
                                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="shrink-0 notranslate" translate="no">
                                    <img src="/logo.webp" alt="ItaloStudy Logo" className="h-8 md:h-10 w-auto object-contain notranslate" translate="no" />
                                </Link>
                            ) : (
                                <button onClick={() => setMobileMenuView('main')} className="flex items-center gap-2 text-[#333333] font-bold text-[18px]">
                                    <ChevronLeft className="w-6 h-6" />
                                    {t('nav.exams', 'All Exams')}
                                </button>
                            )}
                            <button onClick={() => { setIsMobileMenuOpen(false); setTimeout(() => setMobileMenuView('main'), 300); }} className="text-[#333333]">
                                <X size={28} />
                            </button>
                        </div>

                        {/* Mobile Menu Body */}
                        <div className="flex-1 overflow-y-auto pb-[80px]">
                            {mobileMenuView === 'main' ? (
                                <div className="flex flex-col">
                                    <button onClick={() => setMobileMenuView('exams')} className="flex items-center justify-between p-4 border-b border-[#eaeaea] text-left hover:bg-slate-50 transition-colors">
                                        <span className="font-bold text-[#333333] text-[16px]">{t('nav.exams', 'All Exams')}</span>
                                        <ChevronRight className="w-5 h-5 text-[#333333]" />
                                    </button>
                                    
                                    {[
                                        { name: 'IMAT Mocks', path: "/imat-mock" },
                                        { name: 'CEnT-S Mocks', path: "/cent-s-mock" },
                                        { name: t('nav.resources', 'Resources'), path: "/resources", badge: 'Free' },
                                        { name: t('nav.pricing', 'Pricing'), path: "/pricing" },
                                        { name: 'Courses', path: "/courses" },
                                        { name: t('nav.blog', 'Blog'), path: "/blog" },
                                        { name: 'About Us', path: "/about" },
                                        { name: t('nav.store', 'Store'), path: "https://store.italostudy.com", isExternal: true },
                                        { name: t('nav.contact', 'Contact'), path: "/contact" }
                                    ].map((item) => (
                                        item.isExternal ? (
                                            <a key={item.name} href={item.path} className="flex items-center justify-between p-4 border-b border-[#eaeaea] hover:bg-slate-50 transition-colors">
                                                <span className="font-bold text-[#333333] text-[16px]">{item.name}</span>
                                            </a>
                                        ) : (
                                            <Link key={item.name} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 border-b border-[#eaeaea] hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-[#333333] text-[16px]">{item.name}</span>
                                                    {item.badge && <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black uppercase tracking-wider">{item.badge}</span>}
                                                </div>
                                            </Link>
                                        )
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    {allExamsData.map((exam) => (
                                        <div key={exam.id} className="border-b border-[#eaeaea]">
                                            <button 
                                                onClick={() => setExpandedMobileExam(expandedMobileExam === exam.id ? null : exam.id)}
                                                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                                        {exam.icon}
                                                    </div>
                                                    <div className="font-bold text-[#333333] text-[16px]">{exam.name}</div>
                                                </div>
                                                <ChevronDown className={cn("w-5 h-5 text-[#777777] transition-transform", expandedMobileExam === exam.id && "rotate-180")} />
                                            </button>
                                            
                                            <AnimatePresence>
                                                {expandedMobileExam === exam.id && (
                                                    <motion.div 
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden bg-slate-50"
                                                    >
                                                        <div className="p-4 border-t border-[#eaeaea]">
                                                            <Link 
                                                                to={exam.path} 
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg font-bold mb-3"
                                                            >
                                                                {t('nav.view_main_exam_guide', 'View Main {{exam}} Guide \u2192', { exam: exam.name })}
                                                            </Link>
                                                            <div className="grid grid-cols-1 gap-1">
                                                                {exam.links.map((link, i) => (
                                                                    <Link 
                                                                        key={i} 
                                                                        to={link.path}
                                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                                        className="flex items-center gap-3 px-4 py-3 text-[#555555] font-medium rounded-lg hover:bg-slate-100 transition-colors"
                                                                    >
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#cbd5e1]" />
                                                                        {t(`nav.links.${link.label}`, link.label)}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Mobile Language Switcher */}
                        <div className="px-4 mt-6 mb-24">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Language</h4>
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => handleLanguageChange('EN')} className={cn("py-2 rounded-lg text-sm font-bold transition-colors border", currentLang === 'EN' ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-200 text-slate-600")}>EN</button>
                                <button onClick={() => handleLanguageChange('IT')} className={cn("py-2 rounded-lg text-sm font-bold transition-colors border", currentLang === 'IT' ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-200 text-slate-600")}>IT</button>
                                <button onClick={() => handleLanguageChange('TR')} className={cn("py-2 rounded-lg text-sm font-bold transition-colors border", currentLang === 'TR' ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-200 text-slate-600")}>TR</button>
                            </div>
                        </div>

                        {/* Mobile Menu Footer (Fixed at bottom) */}
                        <div className="p-4 bg-white border-t border-[#eaeaea] absolute bottom-0 left-0 right-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] flex justify-center">
                            {user ? (
                                <button onClick={() => window.location.href = 'https://app.italostudy.com/'} className="px-10 bg-[#5a4bda] text-white font-bold rounded-[6px] h-11 flex items-center justify-center text-[15px]">
                                    {t('nav.dashboard', 'Go to Dashboard')}
                                </button>
                            ) : (
                                <button onClick={() => window.location.href = 'https://app.italostudy.com/auth'} className="px-10 bg-[#5a4bda] text-white font-bold rounded-[6px] h-11 flex items-center justify-center text-[15px]">
                                    {t('nav.login_register', 'Login / Register')}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Secondary Navigation (Authority Pages) */}
            {subNavigation && (
                <div className="bg-white/95 backdrop-blur-md border-t border-slate-100 h-12">
                    <div className="container mx-auto px-4 lg:px-8 h-full flex items-center">
                        {subNavigation}
                    </div>
                </div>
            )}

            {/* Scroll Progress Bar (PW Style) */}
            <motion.div 
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#fca311] origin-left z-50"
                style={{ scaleX: scrollYProgress }}
            />
        </header>
    );
}
