import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Microscope, Calculator, Globe, GraduationCap, Target, Users, Zap } from 'lucide-react';
import { cn } from "@/lib/utils";
import SEO from '@/components/SEO';

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

const syllabusData = [
    {
        title: "IMAT",
        subtitle: "Medical Entrance (International)",
        topics: [
            { icon: <Microscope className="w-5 h-5" />, label: "Biology & Chemistry", desc: "Core medical foundations and molecular logic." },
            { icon: <Calculator className="w-5 h-5" />, label: "Math & Physics", desc: "Quantitative reasoning and mechanical principles." },
            { icon: <BookOpen className="w-5 h-5" />, label: "Critical Thinking", desc: "Logical reasoning and general knowledge modules." }
        ],
        color: "violet"
    },
    {
        title: "SAT",
        subtitle: "The College Board Standard",
        topics: [
            { icon: <BookOpen className="w-5 h-5" />, label: "Reading & Writing", desc: "Evidence-based reading and grammar mastery." },
            { icon: <Calculator className="w-5 h-5" />, label: "Math Core", desc: "Algebra, geometry, and advanced quantitative tools." },
            { icon: <Globe className="w-5 h-5" />, label: "Essay Analysis", desc: "Rhetorical strategies and textual evaluation." }
        ],
        color: "cyan"
    },
    {
        title: "IELTS",
        subtitle: "English Proficiency Protocol",
        topics: [
            { icon: <Globe className="w-5 h-5" />, label: "Listening & Reading", desc: "Advanced comprehension in academic contexts." },
            { icon: <BookOpen className="w-5 h-5" />, label: "Writing Mastery", desc: "Data interpretation and discursive argumentation." },
            { icon: <Users className="w-5 h-5" />, label: "Speaking Fluency", desc: "Coherent communication and vocabulary range." }
        ],
        color: "indigo"
    },
    {
        title: "CEnT-S",
        subtitle: "Technical & Industrial Excellence",
        topics: [
            { icon: <GraduationCap className="w-5 h-5" />, label: "Engineering Logic", desc: "Problem-solving for modern technical challenges." },
            { icon: <Microscope className="w-5 h-5" />, label: "Applied Sciences", desc: "Physics and materials for industrial certification." },
            { icon: <Target className="w-5 h-5" />, label: "Methodology", desc: "Structural analysis and exam-specific protocols." }
        ],
        color: "slate"
    }
];

const Syllabus = () => {
    return (
        <div className="min-h-screen py-20 md:py-32 px-6">
            <SEO
                title="Exam Syllabus | IMAT, SAT, IELTS & CEnT-S"
                description="Master your exam with the complete blueprint. Detailed syllabus and free practice resources for IMAT, SAT, IELTS, and CEnT-S."
                keywords="IMAT Syllabus, SAT Exam Pattern, IELTS Syllabus, CEnT-S Blueprint, Free Practice Resources, Study in Italy Syllabus"
            />
            <AcademicBackground />

            <div className="container mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 rounded-full"
                        >
                            <BookOpen className="w-3.5 h-3.5 text-violet-600" />
                            <span className="text-[10px] font-black text-violet-900 dark:text-violet-300 uppercase tracking-widest">Master Your Syllabus</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none"
                        >
                            The <span className="text-violet-600">Blueprint.</span>
                        </motion.h1>
                    </div>
                    <Link to="/">
                        <Button variant="outline" className="h-14 px-8 border-2 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all border-slate-100 dark:border-white/10 dark:text-white">
                            Back to Home
                        </Button>
                    </Link>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                    {syllabusData.map((exam, i) => (
                        <motion.div
                            key={exam.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-sm relative overflow-hidden group"
                        >
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">{exam.title}</h2>
                                <p className="text-base md:text-lg font-bold text-slate-500 dark:text-slate-400 mb-8 md:mb-10">{exam.subtitle}</p>

                                <div className="space-y-8">
                                    {exam.topics.map((topic, j) => (
                                        <div key={j} className="flex gap-6 items-start">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                                                exam.color === 'violet' ? 'bg-violet-100 text-violet-600' :
                                                    exam.color === 'cyan' ? 'bg-cyan-100 text-cyan-600' :
                                                        exam.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                                                            'bg-slate-100 text-slate-600'
                                            )}>
                                                {topic.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{topic.label}</h4>
                                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed">{topic.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Syllabus;
