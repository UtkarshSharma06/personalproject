import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import {
    Home,
    Sparkles,
    GraduationCap,
    Gift,
    Menu,
    X,
    LayoutDashboard,
    ArrowRight,
    Instagram,
    MessageCircle
} from 'lucide-react';
import { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function BlogHeader() {
    const location = useLocation();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/', icon: Home, isExternal: true },
        { name: 'Blog', path: '/blog', icon: Sparkles, isExternal: true },
        { name: 'Free Resources', path: '/resources', icon: Gift, isExternal: true },
        { name: user ? 'Dashboard' : 'Log in', path: user ? 'https://app.italostudy.com/' : 'https://app.italostudy.com/auth', icon: LayoutDashboard, isExternal: true },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b-2 border-slate-50 pt-[env(safe-area-inset-top,0px)]">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo Area */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-4"
                >
                    <a href="/" className="flex items-center gap-3 group">
                        <img
                            src="/logo.webp"
                            alt="Italostudy Logo"
                            className="h-10 w-auto object-contain"
                            loading="eager"
                        />
                    </a>
                </motion.div>

                {/* Animated Navigation (Desktop) */}
                <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/50">
                    <a href="/">
                        <motion.div
                            whileHover={{ scale: 1.05, backgroundColor: 'white' }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all flex items-center gap-2"
                        >
                            <Home className="w-3 h-3" />
                            Home
                        </motion.div>
                    </a>

                    <a href="/blog">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${location.pathname === '/blog'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                                }`}
                        >
                            <Sparkles className="w-3 h-3" />
                            Blog
                        </motion.div>
                    </a>

                    <a href="/resources">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-pink-600 bg-pink-50 hover:bg-pink-100 transition-all flex items-center gap-2 border border-pink-100"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <Gift className="w-3 h-3 text-pink-500" />
                            </motion.div>
                            FREE Resources
                        </motion.div>
                    </a>
                </nav>

                {/* Simplified Back button / Dashboard (Desktop) / Mobile Menu Trigger */}
                <div className="flex items-center gap-2">
                    <div className="hidden lg:flex items-center gap-4 mr-4">
                        <motion.a
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            href="https://www.instagram.com/italostudycom"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-pink-500 hover:bg-pink-50 transition-all border border-slate-100"
                        >
                            <Instagram className="w-5 h-5" />
                        </motion.a>
                        <motion.a
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            href="https://chat.whatsapp.com/CfVh7u9L6vT7ZFpZwwVa4A"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-green-500 hover:bg-green-50 transition-all border border-slate-100"
                        >
                            <MessageCircle className="w-5 h-5" />
                        </motion.a>
                    </div>

                    <a href={user ? "https://app.italostudy.com/" : "https://app.italostudy.com/auth"} className="hidden md:block">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-10 px-6 bg-slate-900 text-white hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10"
                        >
                            {user ? 'Dashboard' : 'Log in'}
                        </motion.button>
                    </a>

                    {/* Mobile Menu Trigger */}
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
                                    <Menu className="w-6 h-6 text-slate-900" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] p-0 border-l-0 bg-white flex flex-col">
                                <SheetHeader className="p-6 border-b border-slate-50">
                                    <SheetTitle className="text-left font-black uppercase tracking-widest text-[10px] text-slate-400">Main Menu</SheetTitle>
                                </SheetHeader>
                                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                    {navLinks.map((link) => (
                                        link.isExternal ? (
                                            <a
                                                key={link.path}
                                                href={link.path}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${location.pathname === link.path
                                                    ? 'bg-indigo-50 text-indigo-600'
                                                    : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${location.pathname === link.path ? 'bg-white shadow-sm' : 'bg-slate-100'
                                                        }`}>
                                                        <link.icon className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-black uppercase tracking-tight text-xs">{link.name}</span>
                                                </div>
                                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        ) : (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${location.pathname === link.path
                                                    ? 'bg-indigo-50 text-indigo-600'
                                                    : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${location.pathname === link.path ? 'bg-white shadow-sm' : 'bg-slate-100'
                                                        }`}>
                                                        <link.icon className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-black uppercase tracking-tight text-xs">{link.name}</span>
                                                </div>
                                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        )
                                    ))}
                                </div>
                                <div className="p-6 border-t border-slate-50 bg-slate-50/50">
                                    <div className="flex items-center justify-between p-4 bg-indigo-600 rounded-[2rem] text-white shadow-lg shadow-indigo-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                                <Sparkles className="w-5 h-5 text-indigo-100" />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black uppercase tracking-widest opacity-80 leading-none mb-1">Stay Updated</p>
                                                <p className="font-black text-[10px] uppercase tracking-tight">ItaloStudy Team</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <a href="https://www.instagram.com/italostudycom" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                                                <Instagram className="w-4 h-4" />
                                            </a>
                                            <a href="https://chat.whatsapp.com/CfVh7u9L6vT7ZFpZwwVa4A" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                                                <MessageCircle className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
