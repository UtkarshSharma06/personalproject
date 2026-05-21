import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    ArrowLeft, BookOpen, Clock, Target,
    BarChart, CheckCircle, ChevronRight,
    Sparkles, Info, Shield, Zap
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import SEO from '@/components/SEO';
import { EXAMS } from '@/config/exams';
import { cn } from "@/lib/utils";
import Footer from '@/components/Footer';

const AcademicBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none select-none bg-slate-50 dark:bg-[#020617] -z-10">
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-violet-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/5 blur-[120px] rounded-full" />
        </div>
    );
};

export default function SyllabusDetail() {
    const { examId } = useParams<{ examId: string }>();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const exam = examId ? EXAMS[examId] : null;

    useEffect(() => {
        if (!exam) {
            navigate('/syllabus');
        }
        window.scrollTo(0, 0);
    }, [exam, navigate]);

    if (!exam) return null;

    // Use translations for syllabus items if available
    const examTranslation = t(`syllabus.exams.${examId}`, { returnObjects: true }) as any;
    const title = examTranslation?.title || exam.name;
    const subtitle = examTranslation?.subtitle || '';

    return (
        <div className="min-h-screen font-sans selection:bg-violet-100 selection:text-violet-900 overflow-x-hidden">
            <SEO
                title={`${title} Syllabus | Complete Breakdown & Topics`}
                description={`Master the ${title} exam with our comprehensive syllabus breakdown. Detailed topics for ${exam.sections.map(s => s.name).join(', ')}.`}
                keywords={`${title} Syllabus, ${title} exam topics, ${title} preparation, study buddy ai`}
            />
            <AcademicBackground />

            {/* Navbar Placeholder space */}
            <header className="h-20" />

            <main className="container mx-auto max-w-7xl px-6 py-12 md:py-20">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link
                        to="/syllabus"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-50 border border-violet-100 text-violet-600 hover:bg-violet-100 transition-all group dark:bg-white/5 dark:border-white/10 dark:text-white/60"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('syllabus.back_home', 'Back to Syllabus')}</span>
                    </Link>
                </motion.div>

                {/* Hero section */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-50 border border-violet-100 rounded-full dark:bg-violet-500/10 dark:border-violet-500/20">
                            <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                            <span className="text-[10px] font-black text-violet-900 uppercase tracking-widest dark:text-violet-300">Official Blueprint</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] uppercase">
                            {title.split(' ')[0]} <br />
                            <span className="text-violet-600 dark:text-violet-500">
                                {title.split(' ').slice(1).join(' ')}
                            </span>
                        </h1>
                        <p className="text-xl text-slate-500 dark:text-white/70 font-bold leading-relaxed max-w-xl italic">
                            {subtitle}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl dark:bg-white/5 dark:border-white/10">
                                <Clock className="w-5 h-5 text-emerald-500" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Duration</span>
                                    <span className="text-slate-900 dark:text-white font-black">{exam.durationMinutes} mins</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl dark:bg-white/5 dark:border-white/10">
                                <Target className="w-5 h-5 text-indigo-500" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Questions</span>
                                    <span className="text-slate-900 dark:text-white font-black">{exam.totalQuestions} items</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative group lg:block hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 blur-[100px] rounded-full group-hover:blur-[120px] transition-all" />
                        <div className="relative p-12 rounded-[3.5rem] bg-white border border-slate-200 shadow-xl dark:bg-white/5 dark:border-white/10">
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Quick Check</h3>
                                    <Zap className="w-6 h-6 text-amber-500" />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-violet-200 transition-all dark:bg-white/5 dark:border-white/5 dark:hover:border-white/10">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                                            <Shield size={20} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-white/80">Proctored Simulation Available</p>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-violet-200 transition-all dark:bg-white/5 dark:border-white/5 dark:hover:border-white/10">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                            <BarChart size={20} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-white/80">Real-time Performance Analysis</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => navigate('/auth')}
                                    className="w-full h-14 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-2xl shadow-lg ring-offset-background group overflow-hidden border-none uppercase"
                                >
                                    LOG IN
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Main Syllabus Content */}
                <div className="space-y-12">
                    <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-8">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white dark:bg-violet-600">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Detailed Breakdown</h2>
                            <p className="text-slate-500 dark:text-white/40 font-bold">Every topic you need to master, section by section.</p>
                        </div>
                    </div>

                    <div className="grid gap-12">
                        {Object.entries(exam.syllabus).map(([sectionName, topics], idx) => (
                            <motion.div
                                key={sectionName}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative"
                            >
                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-violet-500/20 rounded-full" />
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tighter flex items-center gap-4">
                                    <span className="text-slate-300 dark:text-white/20">{String(idx + 1).padStart(2, '0')}</span>
                                    {sectionName}
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {topics.map((topic, tIdx) => (
                                        <div
                                            key={topic.id}
                                            className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-violet-500/30 transition-all hover:shadow-md group shadow-sm dark:bg-white/5 dark:border-white/10"
                                        >
                                            <div className="flex items-center justify-between mb-6">
                                                <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{topic.name}</h4>
                                                <CheckCircle className="w-5 h-5 text-slate-200 dark:text-white/10 group-hover:text-emerald-500 transition-colors" />
                                            </div>
                                            <ul className="space-y-3">
                                                {topic.subtopics.map((sub, sIdx) => (
                                                    <li key={sIdx} className="flex items-center gap-3 text-slate-500 dark:text-white/60 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500/40" />
                                                        <span className="text-sm font-bold">{sub}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32 p-12 md:p-20 rounded-[3.5rem] bg-slate-900 text-center space-y-8 relative overflow-hidden dark:bg-white/5 dark:border dark:border-white/10"
                >
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-6">
                            Ready to start <br />
                            <span className="text-violet-400">your journey?</span>
                        </h2>
                        <p className="text-lg text-white/70 font-bold mb-10">
                            Join thousands of students masters {title} with ItaloStudy's free practice ecosystem.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => navigate('/auth')}
                                className="h-16 px-12 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all text-lg shadow-xl uppercase border-none"
                            >
                                Log in
                            </Button>
                            <a href="/contact">
                                <Button variant="outline" className="h-16 px-12 bg-transparent text-white border-white/20 hover:bg-white/10 font-black rounded-2xl text-lg uppercase">
                                    Talk to Experts
                                </Button>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
