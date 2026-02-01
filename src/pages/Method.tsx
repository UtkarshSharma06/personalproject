import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Target, TrendingUp, Zap, ChevronRight, Sparkles, BookOpen, GraduationCap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';

export default function Method() {
    const steps = [
        {
            number: '01',
            title: 'Diagnostic Phase',
            icon: Target,
            description: 'We identify your cognitive profile across all scientific domains with a comprehensive initial diagnostic assessment.',
            gradient: 'from-blue-500/10 to-indigo-500/10',
            iconColor: 'bg-blue-500',
            textColor: 'text-blue-600'
        },
        {
            number: '02',
            title: 'Smart Training',
            icon: Brain,
            description: 'Our proprietary learning engine generates personalized item sets targeting your specific knowledge gaps.',
            gradient: 'from-purple-500/10 to-pink-500/10',
            iconColor: 'bg-purple-500',
            textColor: 'text-purple-600'
        },
        {
            number: '03',
            title: 'Knowledge Retention',
            icon: TrendingUp,
            description: 'Items reappear at mathematically optimal intervals to ensure permanent knowledge integration and mastery.',
            gradient: 'from-emerald-500/10 to-teal-500/10',
            iconColor: 'bg-emerald-500',
            textColor: 'text-emerald-600'
        },
        {
            number: '04',
            title: 'Mock Exams',
            icon: Zap,
            description: 'Execute high-pressure mock sessions under official exam conditions with live proctoring systems.',
            gradient: 'from-orange-500/10 to-red-500/10',
            iconColor: 'bg-orange-500',
            textColor: 'text-orange-600'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as const
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
            <SEO
                title="Our Methodology | The ItaloStudy Standard"
                description="Discover our 4-step cognitive framework engineered to accelerate expertise in medical sciences. Diagnostic, Training, Retention, and Mock Exams."
                keywords="ItaloStudy Method, Cognitive Framework, Medical Exam Preparation, Smart Logic Training, Exam Simulation"
            />

            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-200/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-[30%] left-[10%] w-[30%] h-[30%] bg-blue-100/30 blur-[100px] rounded-full" />
            </div>

            {/* Simple Back Button (Floating) */}
            <div className="fixed top-8 left-8 z-50">
                <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-100">
                    <ArrowLeft className="w-4 h-4" /> Back Home
                </Link>
            </div>

            {/* Hero Section */}
            <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6">
                <div className="container mx-auto text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-8 border border-indigo-100 dark:border-indigo-800"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="font-black text-indigo-900 dark:text-indigo-400 uppercase tracking-widest text-[9px]">The ItaloStudy standard</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.95]"
                    >
                        Engineered for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600">Academic Excellence.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed"
                    >
                        Our multi-layered cognitive framework is meticulously designed to accelerate expertise in medical and scientific domains.
                    </motion.p>
                </div>
            </section>

            {/* Steps Section */}
            <section className="pb-32 px-6">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
                    >
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                className="group relative p-8 md:p-12 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-indigo-200 transition-all duration-500 overflow-hidden"
                            >
                                {/* Step Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-10">
                                        <div className={`w-16 h-16 ${step.iconColor} rounded-2xl flex items-center justify-center shadow-lg shadow-black/10 text-white group-hover:scale-110 transition-transform duration-500`}>
                                            <step.icon className="w-8 h-8" />
                                        </div>
                                        <span className="text-5xl font-black text-slate-100 dark:text-slate-800 tracking-tighter leading-none group-hover:text-slate-200 transition-colors">
                                            {step.number}
                                        </span>
                                    </div>
                                    <h3 className={`text-2xl font-black ${step.textColor} mb-4 uppercase tracking-tight`}>{step.title}</h3>
                                    <p className="text-lg text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Link Indicator */}
                                <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-indigo-600 transition-colors">
                                    Detailed Insights <ChevronRight className="w-3 h-3" />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Detail */}
            <section className="py-24 bg-white dark:bg-slate-900 relative">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
                        {[
                            { icon: BookOpen, title: "Adaptive Intensity", desc: "Our algorithms dynamically adjust item complexitiy based on your second-by-second performance data." },
                            { icon: Globe, title: "Global Benchmarking", desc: "Compare your retention velocity and accuracy with over 12,000 students worldwide in real-time." },
                            { icon: Target, title: "Pattern Recognition", desc: "We don't just teach facts; we train your brain to recognize the architectural logic of exam questions." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="space-y-6"
                            >
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mx-auto md:mx-0">
                                    <item.icon className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{item.title}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 md:py-32 px-6">
                <div className="container mx-auto max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden p-12 md:p-24 rounded-[3rem] md:rounded-[4rem] bg-slate-900 text-white text-center group"
                    >
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-600/10 blur-[80px] rounded-full group-hover:scale-125 transition-transform duration-1000" />

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight tracking-tighter uppercase italic">
                                Ready to master the <br /> <span className="text-indigo-400">ItaloStudy</span> Experience?
                            </h2>
                            <p className="text-lg text-slate-400 font-bold mb-12 uppercase tracking-[0.2em] text-[12px]">
                                Join the elite tier of students worldwide.
                            </p>
                            <Link to="/auth">
                                <Button className="h-16 px-12 bg-white text-slate-900 font-black rounded-2xl uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/5">
                                    Initialize Practice
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer Copy */}
            <footer className="py-12 text-center">
                <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.5em]">
                    Developed for Academic Excellence • 2026
                </p>
            </footer>
        </div>
    );
}
