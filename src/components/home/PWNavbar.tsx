import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth';
import {
    Menu, X, ChevronDown, LayoutDashboard,
    GraduationCap, BookOpen, Stethoscope, FileText, ChevronRight, ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { imatLinks, centsLinks, tolcLinks } from '@/lib/nav-links';

export default function PWNavbar({ subNavigation }: { subNavigation?: React.ReactNode }) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileMenuView, setMobileMenuView] = useState<'main' | 'exams'>('main');
    const [isExamsDropdownOpen, setIsExamsDropdownOpen] = useState(false);
    const [activeExamId, setActiveExamId] = useState('imat');
    const [expandedMobileExam, setExpandedMobileExam] = useState<string | null>(null);
    const [isMocksDropdownOpen, setIsMocksDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mocksDropdownRef = useRef<HTMLDivElement>(null);
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

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="absolute inset-0 bg-white/95 backdrop-blur-md border-b border-slate-200/50 -z-10 pointer-events-none" />
            <div className="container mx-auto px-4 lg:px-8 h-[80px] flex items-center justify-between">
                
                {/* Left Side: Hamburger, Logo, All Exams, Links */}
                <div className="flex items-center gap-4 lg:gap-8">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden text-slate-700 hover:text-slate-900 transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                    
                    <Link to="/" className="flex items-center">
                        <img
                            src="/logo.webp"
                            alt="ItaloStudy Logo"
                            className="h-8 md:h-10 w-auto object-contain"
                        />
                    </Link>

                    {/* All Exams Dropdown (Desktop) */}
                    <div className="hidden lg:block relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsExamsDropdownOpen(!isExamsDropdownOpen)}
                            className="flex items-center gap-2 border border-indigo-200/70 px-5 py-2.5 rounded-lg text-[#5a4bda] font-bold shadow-sm hover:shadow hover:bg-indigo-50/50 transition-all bg-white text-[15px]"
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
                                                <span className="text-[13px] font-semibold text-slate-700 group-hover:text-indigo-700 leading-tight">
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
                    <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
                        {/* Mocks Dropdown */}
                        <div className="relative" ref={mocksDropdownRef}>
                            <button
                                onClick={() => setIsMocksDropdownOpen(!isMocksDropdownOpen)}
                                className="flex items-center gap-1 text-[15px] font-semibold text-slate-700 hover:text-[#5a4bda] transition-colors whitespace-nowrap"
                            >
                                Simulated Mocks
                                <ChevronDown className={cn("w-4 h-4 transition-transform", isMocksDropdownOpen && "rotate-180")} />
                            </button>
                            
                            {isMocksDropdownOpen && (
                                <div className="absolute top-full left-0 mt-3 w-48 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50 flex flex-col py-2">
                                    <Link 
                                        to="/imat-mock" 
                                        onClick={() => setIsMocksDropdownOpen(false)}
                                        className="px-4 py-2 hover:bg-slate-50 text-[14px] font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                                    >
                                        IMAT Mocks
                                    </Link>
                                    <Link 
                                        to="/cent-s-mock" 
                                        onClick={() => setIsMocksDropdownOpen(false)}
                                        className="px-4 py-2 hover:bg-slate-50 text-[14px] font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                                    >
                                        CEnT-S Mocks
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link to="/resources" className="text-[15px] font-semibold text-slate-700 hover:text-[#5a4bda] transition-colors whitespace-nowrap">
                            {t('nav.resources', 'Resources')}
                        </Link>
                        <Link to="/pricing" className="text-[15px] font-semibold text-slate-700 hover:text-[#5a4bda] transition-colors flex items-center gap-1.5 whitespace-nowrap">
                            {t('nav.pricing', 'Pricing')}
                            <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm shadow-emerald-200 whitespace-nowrap">{t('nav.free_beta', 'Free')}</span>
                        </Link>
                        <Link to="/blog" className="text-[15px] font-semibold text-slate-700 hover:text-[#5a4bda] transition-colors whitespace-nowrap">
                            {t('nav.blog', 'Blog')}
                        </Link>
                        <Link to="/about" className="text-[15px] font-semibold text-slate-700 hover:text-[#5a4bda] transition-colors whitespace-nowrap">
                            About Us
                        </Link>
                        <a href="https://store.italostudy.com" className="text-[15px] font-semibold text-slate-700 hover:text-[#5a4bda] transition-colors whitespace-nowrap">
                            {t('nav.store', 'Store')}
                        </a>
                        <Link to="/contact" className="text-[15px] font-semibold text-slate-700 hover:text-[#5a4bda] transition-colors whitespace-nowrap">
                            {t('nav.contact', 'Contact')}
                        </Link>
                    </nav>
                </div>

                {/* Login/Dashboard CTA */}
                <div className="flex items-center">
                    {user ? (
                        <button
                            onClick={() => window.location.href = 'https://app.italostudy.com/'}
                            className="flex items-center gap-2 hover:bg-slate-50 transition-colors px-3 py-1.5 rounded-full border border-slate-200"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                                IS
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                        </button>
                    ) : (
                        <button
                            onClick={() => window.location.href = 'https://app.italostudy.com/auth'}
                            className="bg-gradient-to-r from-[#5a4bda] to-indigo-600 hover:from-[#4a3eb3] hover:to-indigo-700 text-white font-semibold rounded-lg px-7 h-10 md:h-[42px] flex items-center justify-center shadow-[0_4px_14px_0_rgba(90,75,218,0.39)] hover:shadow-[0_6px_20px_rgba(90,75,218,0.23)] hover:-translate-y-0.5 transition-all duration-200 text-[15px] whitespace-nowrap"
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
                                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                                    <img src="/logo.webp" alt="ItaloStudy Logo" className="h-8 md:h-10 w-auto object-contain" />
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
                                        { name: t('nav.resources', 'Resources'), path: "/resources" },
                                        { name: t('nav.pricing', 'Pricing'), path: "/pricing" },
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
                                                    {item.path === "/pricing" && (
                                                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black uppercase tracking-wider">{t('nav.free_beta', 'Free')}</span>
                                                    )}
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
                                                                className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold mb-3"
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
                        
                        {/* Mobile Menu Footer (Fixed at bottom) */}
                        <div className="p-4 bg-white border-t border-[#eaeaea] absolute bottom-0 left-0 right-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] flex justify-center">
                            {user ? (
                                <button onClick={() => window.location.href = 'https://app.italostudy.com/'} className="px-10 bg-[#5a4bda] text-white font-semibold rounded-[6px] h-11 flex items-center justify-center text-[15px]">
                                    {t('nav.dashboard', 'Go to Dashboard')}
                                </button>
                            ) : (
                                <button onClick={() => window.location.href = 'https://app.italostudy.com/auth'} className="px-10 bg-[#5a4bda] text-white font-semibold rounded-[6px] h-11 flex items-center justify-center text-[15px]">
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
