import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth';
import { usePricing } from '@/context/PricingContext';
import {
    Menu,
    X,
    ChevronRight,
    Instagram,
    MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import VoltageButton from '@/components/ui/VoltageButton';
import { Button } from '@/components/ui/button';
import AnnouncementBar from './AnnouncementBar';

export default function PublicNavbar({ subNavigation }: { subNavigation?: React.ReactNode }) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { config } = usePricing();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSyllabusDropdownOpen, setIsSyllabusDropdownOpen] = useState(false);

    const location = useLocation();
    const isLightTheme = location.pathname.startsWith('/cent-s-') ||
        location.pathname.startsWith('/best-books-for-cent-s') ||
        location.pathname.startsWith('/imat-') ||
        location.pathname.startsWith('/study-in-italy') ||
        location.pathname === '/exams' ||
        location.pathname === '/answers' ||
        location.pathname.startsWith('/answers/') ||
        (location.pathname.startsWith('/qa/') && location.pathname !== '/qa') || 
        [
            '/cent-s-exam-ultimate-guide', '/cent-s-syllabus-2026', '/cent-s-exam-pattern-2026', 
            '/cent-s-cutoff-2026', '/cent-s-preparation-strategy-2026', '/cent-s-mock-test-free-2026',
            '/imat-exam-ultimate-guide-2026', '/imat-syllabus-2026', '/imat-exam-pattern-2026',
            '/imat-cutoff-trends-2026', '/imat-preparation-strategy-2026', '/imat-mock-test-free-2026',
            '/imat-vs-cents-2026'
        ].includes(location.pathname);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    interface NavSubItem {
        name: string;
        path: string;
        isStatic?: boolean;
    }

    interface NavItem {
        name: string;
        path: string;
        isDropdown?: boolean;
        items?: NavSubItem[];
        isExternal?: boolean;
        isStatic?: boolean;
    }

    const navItems: NavItem[] = [
        {
            name: 'Exams',
            path: '/exams',
            isDropdown: true,
            items: [
                { name: 'IMAT 2026', path: '/imat-exam-ultimate-guide-2026' },
                { name: 'CEnT-S 2026', path: '/cent-s-exam-ultimate-guide' }
            ]
        },
        { name: 'Resources', path: '/resources', isStatic: true },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Blog', path: '/blog' },
        { name: 'Store', path: 'https://store.italostudy.com', isExternal: true },
        { name: 'Contact', path: '/contact', isStatic: true },
    ];

    const isExternalPath = (path: string | null) => {
        if (!path) return false;
        return path.startsWith('http') || path.startsWith('https://');
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex flex-col",
                scrolled
                    ? (isLightTheme ? "bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 shadow-sm" : "bg-black/80 backdrop-blur-2xl border-b border-white/10 shadow-sm")
                    : "bg-transparent"
            )}
        >
            <div className={cn(
                "container mx-auto flex items-center justify-between transition-all duration-500",
                scrolled ? "h-16 px-4 md:px-12" : "h-24 px-4 md:px-12"
            )}>
                {/* Logo */}
                <div className="flex-1 flex justify-start shrink-0">
                    <Link to="/" className="flex items-center gap-3 group shrink-0 notranslate" translate="no">
                        <img
                            src="/logo.webp"
                            alt="Italostudy Logo"
                            className={cn(
                                "h-9 md:h-11 w-auto object-contain transition-all notranslate",
                                !isLightTheme && (scrolled ? "brightness-0" : "brightness-0 invert")
                            )}
                            translate="no"
                            width="180"
                            height="48"
                            loading="eager"
                        />
                    </Link>
                </div>

                {/* Pill Navbar */}
                <nav className={cn(
                    "hidden lg:flex items-center transition-all duration-500 rounded-full",
                    scrolled
                        ? "bg-transparent border-transparent shadow-none ring-0 px-0 py-0"
                        : cn(
                            "backdrop-blur-3xl border px-12 py-3 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] ring-1",
                            isLightTheme
                                ? "bg-white/70 border-white/40 ring-black/5"
                                : "bg-black/40 border-white/10 ring-white/10"
                        )
                )}>
                    <div className={cn("flex items-center transition-all duration-500", scrolled ? "gap-8" : "gap-9")}>
                        {navItems.map((item) => (
                            item.isDropdown ? (
                                <div
                                    key={item.name}
                                    className="relative"
                                    onMouseEnter={() => setIsSyllabusDropdownOpen(true)}
                                    onMouseLeave={() => setIsSyllabusDropdownOpen(false)}
                                >
                                    <Link
                                        to={item.path!}
                                        className={cn(
                                            "text-[15px] lg:text-[16px] font-semibold tracking-tight transition-colors flex items-center gap-1 py-1",
                                            isLightTheme ? "text-slate-900 hover:text-indigo-600" : "text-white/70 hover:text-white"
                                        )}
                                    >
                                        {item.name}
                                        <motion.span
                                            animate={{ rotate: isSyllabusDropdownOpen ? 180 : 0 }}
                                            className="inline-block"
                                        >
                                            <ChevronRight className="w-3 h-3 rotate-90" />
                                        </motion.span>
                                    </Link>
                                    <AnimatePresence>
                                        {isSyllabusDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className={cn(
                                                    "absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 p-2 rounded-2xl backdrop-blur-2xl border shadow-2xl z-50 before:absolute before:-top-2 before:inset-x-0 before:h-2 before:content-['']",
                                                    isLightTheme ? "bg-white/95 border-slate-200" : "bg-[#030014]/90 border-white/10"
                                                )}
                                            >
                                                {item.items?.map((subItem) => (
                                                    (subItem.isStatic) ? (
                                                        <a
                                                            key={subItem.path}
                                                            href={subItem.path}
                                                            className={cn(
                                                                "flex items-center justify-between px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all group",
                                                                isLightTheme ? "text-slate-500 hover:text-indigo-600 hover:bg-slate-50" : "text-white/60 hover:text-white hover:bg-white/5"
                                                            )}
                                                        >
                                                            {subItem.name}
                                                            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                        </a>
                                                    ) : (
                                                        <Link
                                                            key={subItem.path}
                                                            to={subItem.path}
                                                            className={cn(
                                                                "flex items-center justify-between px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all group",
                                                                isLightTheme ? "text-slate-500 hover:text-indigo-600 hover:bg-slate-50" : "text-white/60 hover:text-white hover:bg-white/5"
                                                            )}
                                                        >
                                                            {subItem.name}
                                                            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                        </Link>
                                                    )
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (item.isExternal || item.isStatic) ? (
                                <a
                                    key={item.name}
                                    href={item.path!}
                                    className={cn(
                                        "text-[15px] lg:text-[16px] font-semibold tracking-tight transition-colors",
                                        isLightTheme ? "text-slate-900 hover:text-indigo-600" : "text-white/70 hover:text-white"
                                    )}
                                >
                                    {item.name}
                                </a>
                            ) : (
                                <Link
                                    key={item.name}
                                    to={item.path!}
                                    className={cn(
                                        "text-[15px] lg:text-[16px] font-semibold tracking-tight transition-colors",
                                        isLightTheme ? "text-slate-900 hover:text-indigo-600" : "text-white/70 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center gap-1.5">
                                        {item.name}
                                    </div>
                                </Link>
                            )
                        ))}
                    </div>
                </nav>

                <div className="flex-1 flex items-center justify-end gap-4">
                    <div className="hidden lg:flex items-center gap-4 mr-2">
                        <a href="https://www.instagram.com/italostudycom" target="_blank" rel="noopener noreferrer" className={cn("transition-colors", isLightTheme ? "text-slate-400 hover:text-pink-600" : "text-white/40 hover:text-pink-500")} aria-label="Follow us on Instagram">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="https://chat.whatsapp.com/CfVh7u9L6vT7ZFpZwwVa4A" target="_blank" rel="noopener noreferrer" className={cn("transition-colors", isLightTheme ? "text-slate-400 hover:text-green-600" : "text-white/40 hover:text-green-500")} aria-label="Join our WhatsApp Community">
                            <MessageCircle className="w-5 h-5" />
                        </a>
                    </div>
                    <div className="hidden sm:block">
                        <a href={user ? "https://app.italostudy.com/" : "https://app.italostudy.com/auth"}>
                            <VoltageButton>
                                {user ? 'Dashboard' : 'Log in'}
                            </VoltageButton>
                        </a>
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={cn(
                            "lg:hidden p-3 rounded-2xl border transition-colors",
                            isLightTheme ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-white/5 border-white/10 text-white"
                        )}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
            
            {/* Secondary Navigation (Authority Pages) */}
            {subNavigation && (
                <div className={cn(
                    "border-t transition-all duration-500",
                    isLightTheme ? "bg-white/95 border-slate-100" : "bg-black/95 border-white/5",
                    scrolled ? "h-12" : "h-14"
                )}>
                    <div className="container mx-auto h-full flex items-center">
                        {subNavigation}
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={cn(
                            "absolute top-full left-0 right-0 mt-4 mx-4 p-8 rounded-[2rem] backdrop-blur-3xl border lg:hidden flex flex-col gap-6 shadow-2xl z-50",
                            isLightTheme ? "bg-white/95 border-slate-200" : "bg-[#030014]/95 border-white/10"
                        )}
                    >
                        {navItems.map((item) => (
                            item.isDropdown ? (
                                <div key={item.name} className="flex flex-col gap-4">
                                    <Link
                                        to={item.path!}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "text-lg font-black tracking-tight transition-opacity",
                                            isLightTheme ? "text-slate-900" : "text-white"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                    <div className="grid grid-cols-2 gap-2 pl-4">
                                        {item.items?.map((subItem) => (
                                            subItem.isStatic ? (
                                                <a
                                                    key={subItem.path}
                                                    href={subItem.path}
                                                    className={cn(
                                                        "text-sm font-bold transition-colors",
                                                        isLightTheme ? "text-slate-500 hover:text-indigo-600" : "text-white/50 hover:text-white"
                                                    )}
                                                >
                                                    {subItem.name}
                                                </a>
                                            ) : (
                                                <Link
                                                    key={subItem.path}
                                                    to={subItem.path}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={cn(
                                                        "text-sm font-bold transition-colors",
                                                        isLightTheme ? "text-slate-500 hover:text-indigo-600" : "text-white/50 hover:text-white"
                                                    )}
                                                >
                                                    {subItem.name}
                                                </Link>
                                            )
                                        ))}
                                    </div>
                                </div>
                            ) : (item.isExternal || item.isStatic) ? (
                                <a
                                    key={item.name}
                                    href={item.path!}
                                    className={cn(
                                        "text-lg font-black tracking-tight",
                                        isLightTheme ? "text-slate-700" : "text-white/70"
                                    )}
                                >
                                    {item.name}
                                </a>
                            ) : (
                                <Link
                                    key={item.name}
                                    to={item.path!}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "text-lg font-black tracking-tight",
                                        isLightTheme ? "text-slate-700" : "text-white/70"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            )
                        ))}
                        <div className={cn("pt-4 border-t flex flex-col gap-4", isLightTheme ? "border-slate-100" : "border-white/10")}>
                            <a href={user ? "https://app.italostudy.com/" : "https://app.italostudy.com/auth"} className="w-full">
                                <Button className={cn("w-full h-14 rounded-2xl font-black uppercase tracking-widest", isLightTheme ? "bg-indigo-600 text-white" : "bg-white text-[#030014]")}>
                                    {user ? 'Dashboard' : 'Log in'}
                                </Button>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
