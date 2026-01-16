import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Timer } from 'lucide-react';

const AcademicBackground = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none select-none bg-[#fafafa] dark:bg-[#020617] -z-10">
            <motion.div
                animate={{
                    x: mousePos.x - 400,
                    y: mousePos.y - 400,
                }}
                transition={{ type: 'spring', damping: 50, stiffness: 200, mass: 0.5 }}
                className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-violet-500/10 to-cyan-500/10 blur-[120px] opacity-40 dark:opacity-20"
            />
            <div className="absolute inset-0 opacity-[0.2] dark:opacity-[0.1]"
                style={{ backgroundImage: 'radial-gradient(#7c3aed 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
        </div>
    );
};

const Institutional = () => {
    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-6 text-center">
            <AcademicBackground />

            <div className="max-w-2xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-20 h-20 bg-violet-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-violet-500/20"
                >
                    <Building2 className="w-10 h-10 text-white" />
                </motion.div>

                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 rounded-full"
                    >
                        <Timer className="w-3.5 h-3.5 text-violet-600" />
                        <span className="text-[10px] font-black text-violet-900 dark:text-violet-300 uppercase tracking-widest">Institutional Portal</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase"
                    >
                        Coming <span className="text-violet-600 font-black">Soon.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-500 dark:text-slate-400 font-bold max-w-lg mx-auto"
                    >
                        We're building a dedicated ecosystem for schools and universities to manage global exam preparation at scale.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link to="/">
                        <Button className="h-14 px-10 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black text-base rounded-2xl hover:scale-105 transition-all shadow-lg border-none group">
                            <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Button>
                    </Link>
                </motion.div>
            </div>

            <footer className="absolute bottom-10 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                © {new Date().getFullYear()} ITALOSTUDY INSTITUTIONAL SYSTEMS
            </footer>
        </div>
    );
};

export default Institutional;
