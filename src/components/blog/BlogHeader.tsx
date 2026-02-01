import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Home,
    Sparkles,
    GraduationCap,
    Gift
} from 'lucide-react';

export default function BlogHeader() {
    const location = useLocation();

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b-2 border-slate-50">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo Area */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-4"
                >
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src="/logo.png"
                            alt="Italostudy Logo"
                            className="h-10 w-auto object-contain"
                            loading="eager"
                        />
                    </Link>
                </motion.div>

                {/* Animated Navigation */}
                <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/50">
                    <Link to="/">
                        <motion.div
                            whileHover={{ scale: 1.05, backgroundColor: 'white' }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all flex items-center gap-2"
                        >
                            <Home className="w-3 h-3" />
                            Home
                        </motion.div>
                    </Link>

                    <Link to="/blog">
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
                    </Link>

                    <Link to="/resources">
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
                    </Link>
                </nav>

                {/* Simplified Back button / Dashboard */}
                <div className="flex items-center gap-2">
                    <Link to="/dashboard">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-10 px-6 bg-slate-900 text-white hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10"
                        >
                            Dashboard
                        </motion.button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
