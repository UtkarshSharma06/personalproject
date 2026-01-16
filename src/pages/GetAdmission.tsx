import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap, Shield, Globe, GraduationCap,
    ArrowRight, CheckCircle2, Lock,
    FileText, CreditCard, Sparkles,
    University, School, Map, Landmark, Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

const GetAdmission = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const steps = [
        {
            icon: <School className="w-8 h-8" />,
            title: "University Selection",
            desc: "Our AI helps you shortlist dream universities based on your profile, with a focus on high-ranking but affordable options.",
            color: "from-blue-500 to-indigo-600"
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: "Application & Docs",
            desc: "We handle your entire application process, including document translation, apostille, and submission to multiple universities.",
            color: "from-violet-500 to-purple-600"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Visa & Enrollment",
            desc: "Complete guidance through the DOV (Declaration of Value) process and personal assistance for your study visa application.",
            color: "from-emerald-500 to-teal-600"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] selection:bg-indigo-100 selection:text-indigo-900 relative overflow-x-hidden">
            {/* Navbar */}
            <header className={`fixed left-0 right-0 z-[100] transition-all duration-300 px-4 md:px-6 ${scrolled ? "top-0 bg-white/70 backdrop-blur-md border-b border-slate-200 py-3 md:py-4 shadow-sm" : "top-4 md:top-6 bg-transparent"
                }`}>
                <div className="container mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/logo.png" alt="Italostudy Logo" className="h-10 w-auto object-contain" />
                    </Link>

                    <nav className={`hidden lg:flex items-center backdrop-blur-md border transition-all duration-300 rounded-full px-8 py-2.5 shadow-sm ${scrolled ? "bg-slate-50/50 border-slate-200" : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-white/10"
                        }`}>
                        <div className="flex items-center gap-8">
                            {[
                                { name: 'Method', path: '/method' },
                                { name: 'Syllabus', path: '/syllabus' },
                                { name: 'Pricing', path: '/pricing' },
                                { name: 'Institutional', path: '/institutional' },
                                { name: 'Get Admission', path: '/get-admission', active: true }
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`text-[13px] font-bold transition-colors ${item.active ? "text-indigo-600" : "text-slate-600 dark:text-slate-400 hover:text-violet-600"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {user ? (
                        <Link to="/dashboard">
                            <Button className="h-11 px-6 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                                My Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <Link to="/auth">
                            <Button className="h-11 px-6 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all">
                                Sign In
                            </Button>
                        </Link>
                    )}
                </div>
            </header>

            {/* 3D Floating Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
                <motion.div
                    animate={{
                        y: [0, -40, 0],
                        rotate: [0, 45, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-[10%] w-64 h-64 bg-indigo-500/10 rounded-[3rem] blur-3xl"
                />
                <motion.div
                    animate={{
                        y: [0, 60, 0],
                        rotate: [0, -45, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-20 right-[15%] w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-6 pt-32 md:pt-48 pb-20 md:pb-24 relative z-10">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full mb-8 shadow-sm"
                    >
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest">The Ultimate Admission Gateway</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-8"
                    >
                        Your Dream Uni, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Made Possible.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-12"
                    >
                        From initial university selection to your final visa approval, we manage the entire complexity of international admissions at a fraction of the traditional cost.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Button
                            onClick={() => navigate(user ? '/dashboard' : '/auth')}
                            className="h-14 md:h-16 px-8 md:px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base md:text-lg rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none hover:-translate-y-1 transition-all group w-full sm:w-auto"
                        >
                            Get Admission Now
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/pricing')}
                            className="h-14 md:h-16 px-8 md:px-10 border-2 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-black text-base md:text-lg rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all w-full sm:w-auto"
                        >
                            Explore Plans
                        </Button>
                    </motion.div>
                </div>

                {/* How We Work Section (3D Cards) */}
                <div className="grid md:grid-cols-3 gap-8 mb-32">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-white dark:bg-card border-2 border-slate-100 dark:border-border border-b-[8px] md:border-b-[10px] shadow-2xl shadow-slate-200/50 hover:border-indigo-200 transition-all group"
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-10 shadow-lg text-white group-hover:scale-110 transition-transform`}>
                                {step.icon}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">{step.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Cost & Efficiency Section */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-full">
                            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-[10px] font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-widest">Affordable Excellence</span>
                        </div>
                        <h2 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                            Dream Education, <br />
                            <span className="text-indigo-600">Local Pricing.</span>
                        </h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-lg">
                            We believe in democratizing high-quality education. By leveraging AI and a streamlined consultant protocol, we've slashed traditional consultancy fees by 80%.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                "Zero Hidden Fees",
                                "Scholarship Assistance",
                                "Budget-friendly Options",
                                "Direct Uni-Payments"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/10">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative p-8 bg-indigo-600 rounded-[3.5rem] shadow-2xl overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 text-white space-y-8 p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-black uppercase tracking-tight">Access Restricted Data</h4>
                            </div>
                            <div className="space-y-4">
                                <p className="text-4xl font-black tracking-tighter">€40,000+ SAVED</p>
                                <p className="text-indigo-100 font-bold leading-relaxed uppercase text-sm tracking-widest">
                                    Average student savings on agency fees and university tuition via our Optimized Direct channel.
                                </p>
                            </div>
                            <Button
                                onClick={() => navigate('/pricing')}
                                className="w-full h-14 bg-white text-indigo-600 hover:bg-slate-50 font-black uppercase tracking-widest rounded-2xl"
                            >
                                Compare Savings
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Security & Document Vault Section */}
                <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.2),transparent_70%)]" />

                    <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
                        <div className="space-y-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-white">
                                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Military-Grade Security</span>
                            </div>
                            <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter leading-none">
                                Your Documents. <br />
                                <span className="text-indigo-400 font-black">Our Priority.</span>
                            </h2>
                            <p className="text-lg text-slate-400 font-bold leading-relaxed max-w-md">
                                Every document you upload is encrypted and stored in our ultra-secure digital vault. We never share your sensitive data with third parties—only directly with the universities you choose.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-white">
                                    <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-black uppercase tracking-widest">Encrypted Data Protocol</p>
                                </div>
                                <div className="flex items-center gap-4 text-white">
                                    <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                                        <Database className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-black uppercase tracking-widest">Sovereign Data Storage</p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Vault Visualization */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="relative flex items-center justify-center"
                        >
                            <div className="w-64 h-64 md:w-80 md:h-80 bg-indigo-500/10 rounded-full blur-[100px] absolute" />
                            <div className="relative w-full max-w-sm aspect-square bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl p-10 flex flex-col items-center justify-center gap-8 border-b-8 border-indigo-500/20">
                                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center shadow-2xl">
                                    <Lock className="w-12 h-12 text-white" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-white font-black text-2xl tracking-tighter uppercase">ITALO-VAULT ACTIVE</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-indigo-400 font-bold text-[10px] uppercase tracking-[0.2em]">Zero-Knowledge Protection</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Public Footer */}
            <footer className="bg-white dark:bg-card border-t border-slate-100 py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <img src="/logo.png" alt="italostudy" className="h-6 w-auto opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
                        <div className="flex gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
                            <a href="#" className="hover:text-slate-900 transition-colors">Support</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default GetAdmission;
