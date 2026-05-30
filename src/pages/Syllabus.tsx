import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
    ChevronRight, 
    Target, 
    LineChart, 
    Search,
    Clock,
    Calendar,
    Globe,
    Users,
    ShieldCheck,
    Infinity,
    CheckCircle2,
    Calculator,
    Microscope,
    Zap,
    BookOpen
} from 'lucide-react';
import { cn } from "@/lib/utils";
import SEO from '@/components/SEO';
import PWNavbar from '@/components/home/PWNavbar';

const Footer = lazy(() => import('@/components/Footer'));

const Syllabus = () => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <SEO
                title="Official 2026 Exam Guides | ItaloStudy"
                description="Your gateway to top universities in Italy. Official information and preparation resources for IMAT and CEnT-S."
            />

            <PWNavbar />

            <div className="pt-16"> {/* Offset for fixed navbar */}
                {/* Header Section */}
                <header className="relative pt-12 md:pt-16 pb-6 md:pb-8 px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] items-center gap-8">
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-600 text-white text-[9px] font-black rounded uppercase tracking-widest mb-6">
                                Official 2026 Exam Guides
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-[52px] font-black tracking-tight text-slate-900 mb-4 leading-[1.1]">
                                Your Gateway to <br className="hidden md:block" />
                                Top Universities <br className="hidden md:block" />
                                in <span className="text-indigo-600">Italy</span>
                            </h1>
                            <p className="text-sm md:text-base text-slate-500 font-bold mb-8 max-w-lg leading-relaxed">
                                Official information and preparation resources for IMAT and CEnT-S. 
                                Understand the exams. Practice smarter. Get selected.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {[
                                    { icon: <Target className="text-indigo-600" size={16} />, title: "Exam Focused", desc: "100% relevant content" },
                                    { icon: <LineChart className="text-indigo-600" size={16} />, title: "Real Practice", desc: "Exam-level questions" },
                                    { icon: <Search className="text-indigo-600" size={16} />, title: "Track Progress", desc: "Analyze. Improve. Succeed." }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-900 leading-none mb-0.5">{item.title}</div>
                                            <div className="text-[8px] text-slate-400 font-bold">{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative hidden lg:flex justify-end pr-8">
                            <img 
                                src="/italian-building.webp" 
                                alt="Italian Architecture" 
                                className="w-full max-w-[420px] object-contain"
                            />
                        </div>
                    </div>
                </header>

                {/* Main Selection Grid */}
                <main className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-8">
                    <h2 className="text-2xl font-black text-center mb-8 text-slate-900 tracking-tight">Choose Your Exam</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
                        {/* IMAT Card */}
                        <Link to="/imat-exam-ultimate-guide-2026" className="block group">
                            <div className="flex flex-col bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-500/5 group-hover:border-indigo-200 group-hover:shadow-indigo-500/10 transition-all duration-300 h-full">
                                <div className="h-2 bg-indigo-600" />
                                <div className="p-6 md:p-8 flex flex-col flex-1">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                                                <Microscope size={20} className="md:w-6 md:h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg md:text-xl font-black text-slate-900 leading-none mb-1">IMAT 2026</h3>
                                                <div className="text-[8px] font-black text-indigo-600 uppercase tracking-[0.15em]">Medical Admissions Test</div>
                                            </div>
                                        </div>
                                        <div className="px-2 py-0.5 bg-indigo-50 rounded-full text-[8px] font-black text-indigo-600 uppercase tracking-widest">English</div>
                                    </div>
                                    
                                    <p className="text-xs text-slate-500 font-bold mb-6 leading-relaxed">For admission to Medicine and Dentistry taught in English in Italy.</p>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-50">
                                        {[
                                            { icon: <CheckCircle2 size={14} />, label: "FORMAT", val: "60 Qs" },
                                            { icon: <Clock size={14} />, label: "TIME", val: "100 Min" },
                                            { icon: <Calendar size={14} />, label: "INTAKE", val: "Sept" },
                                            { icon: <Globe size={14} />, label: "LANG", val: "English" }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex flex-col items-center text-center">
                                                <div className="text-indigo-600 mb-2">{item.icon}</div>
                                                <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</div>
                                                <div className="text-[9px] font-black text-slate-900">{item.val}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-3 mb-8">
                                        <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest">Sections:</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {["Biology", "Chemistry", "Maths", "Logic"].map((s, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-slate-50 text-[8px] font-bold text-slate-600 rounded-md">{s}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <Button className="w-full h-11 md:h-12 bg-indigo-600 group-hover:bg-indigo-700 text-white rounded-xl font-black uppercase tracking-[0.25em] text-[9px] transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]">
                                            Explore IMAT Guide <ChevronRight size={14} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* CEnT-S Card */}
                        <Link to="/cent-s-exam-ultimate-guide" className="block group">
                            <div className="flex flex-col bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-500/5 group-hover:border-emerald-200 group-hover:shadow-emerald-500/10 transition-all duration-300 h-full">
                                <div className="h-2 bg-emerald-600" />
                                <div className="p-6 md:p-8 flex flex-col flex-1">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-emerald-100">
                                                <Calculator size={20} className="md:w-6 md:h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg md:text-xl font-black text-slate-900 leading-none mb-1">CEnT-S 2026</h3>
                                                <div className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.15em]">Entrance Test for Science</div>
                                            </div>
                                        </div>
                                        <div className="px-2 py-0.5 bg-emerald-50 rounded-full text-[8px] font-black text-emerald-600 uppercase tracking-widest">Italian</div>
                                    </div>
                                    
                                    <p className="text-xs text-slate-500 font-bold mb-6 leading-relaxed">For admission to Engineering, Computer Science, and STEM programs in Italy.</p>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-50">
                                        {[
                                            { icon: <CheckCircle2 size={14} />, label: "FORMAT", val: "55 Qs" },
                                            { icon: <Clock size={14} />, label: "TIME", val: "100 Min" },
                                            { icon: <Calendar size={14} />, label: "ATTEMPTS", val: "Multiple" },
                                            { icon: <Globe size={14} />, label: "LANG", val: "Italian" }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex flex-col items-center text-center">
                                                <div className="text-emerald-600 mb-2">{item.icon}</div>
                                                <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</div>
                                                <div className="text-[9px] font-black text-slate-900">{item.val}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-3 mb-8">
                                        <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest">Sections:</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {["Mathematics", "Logic", "Science"].map((s, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-slate-50 text-[8px] font-bold text-slate-600 rounded-md">{s}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <Button className="w-full h-11 md:h-12 bg-emerald-600 group-hover:bg-emerald-700 text-white rounded-xl font-black uppercase tracking-[0.25em] text-[9px] transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]">
                                            Explore CEnT-S Guide <ChevronRight size={14} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">
                        {/* ItaloStudy Success Path - Ecosystem Themed Card */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">The ItaloStudy Success Path</h3>
                                <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">2026 Methodology</span>
                            </div>
                            
                            <div className="bg-white border border-slate-100 rounded-[2rem] p-1 shadow-sm overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100">
                                    {[
                                        { 
                                            step: "01",
                                            title: "Initial Diagnostic", 
                                            desc: "Start with a baseline mock test to identify your high-yield topics and critical weaknesses.",
                                            icon: <Target className="text-indigo-600" size={20} />,
                                            color: "bg-indigo-50"
                                        },
                                        { 
                                            step: "02",
                                            title: "Micro-Topic Mastery", 
                                            desc: "Access 3,500+ questions categorized by syllabus sub-topics for surgical precision in prep.",
                                            icon: <Zap className="text-amber-500" size={20} />,
                                            color: "bg-amber-50"
                                        },
                                        { 
                                            step: "03",
                                            title: "Official Simulations", 
                                            desc: "Practice with timed, full-length simulations that replicate the exact digital interface of the exam.",
                                            icon: <Clock className="text-emerald-600" size={20} />,
                                            color: "bg-emerald-50"
                                        },
                                        { 
                                            step: "04",
                                            title: "Global Rank Tracking", 
                                            desc: "See where you stand globally with percentile rankings and data-driven score predictions.",
                                            icon: <LineChart className="text-blue-600" size={20} />,
                                            color: "bg-blue-50"
                                        }
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-white p-6 md:p-8 h-full">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300", item.color)}>
                                                    {item.icon}
                                                </div>
                                                <span className="text-2xl font-black text-slate-100 group-hover:text-slate-200 transition-colors">{item.step}</span>
                                            </div>
                                            <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-wider mb-2">{item.title}</h4>
                                            <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Trustpilot Section */}
                            <a 
                                href="https://www.trustpilot.com/review/italostudy.com?utm_medium=trustbox&utm_source=TrustBoxReviewCollector" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block group"
                            >
                                <div className="mt-6 p-5 bg-[#F2F2F2] rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className="bg-[#00B67A] p-1.5 rounded-sm">
                                                <Target className="text-white" size={14} fill="white" />
                                            </div>
                                            <span className="text-[14px] font-black tracking-tight text-slate-900">Trustpilot</span>
                                        </div>
                                        <div className="h-6 w-[1px] bg-slate-300" />
                                        <div className="flex items-center gap-1">
                                            {[1,2,3,4].map(i => (
                                                <div key={i} className="w-5 h-5 bg-[#00B67A] flex items-center justify-center text-white">
                                                    <CheckCircle2 size={12} fill="white" />
                                                </div>
                                            ))}
                                            <div className="w-5 h-5 bg-[#DCDCE6] flex items-center justify-center text-white">
                                                <CheckCircle2 size={12} fill="white" />
                                            </div>
                                            <span className="ml-2 text-[12px] font-black text-slate-900">4.3</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">See all reviews</span>
                                        <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-900" />
                                    </div>
                                </div>
                            </a>
                        </div>

                        {/* Why ItaloStudy Sidebar - Minimalist & Detailed Redesign */}
                        <div className="sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Why ItaloStudy?</h3>
                                <div className="px-2.5 py-1 bg-indigo-600 text-white text-[8px] font-black rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-indigo-100">
                                    <ShieldCheck size={10} /> 2026 Official
                                </div>
                            </div>
                            
                            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-7 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                                {/* Connector Line */}
                                <div className="absolute left-[43px] md:left-[47px] top-[100px] bottom-[100px] w-[1px] bg-slate-100" />
                                
                                <div className="space-y-8 relative z-10">
                                    {[
                                        { 
                                            icon: <ShieldCheck className="text-indigo-600" size={18} />, 
                                            title: "Syllabus Authenticity", 
                                            desc: "Directly aligned with the 2026 Ministry regulations for IMAT and CEnT-S, ensuring zero irrelevant content." 
                                        },
                                        { 
                                            icon: <BookOpen className="text-indigo-600" size={18} />, 
                                            title: "Hyper-Realistic Questions", 
                                            desc: "Every question is hand-curated by top scorers to match the exact difficulty and wording of the real Italian entrance exams." 
                                        },
                                        { 
                                            icon: <LineChart className="text-indigo-600" size={18} />, 
                                            title: "AI-Powered Diagnostics", 
                                            desc: "Identify your weak points instantly with deep-dive analytics that compare your performance against global candidates." 
                                        },
                                        { 
                                            icon: <Infinity className="text-indigo-600" size={18} />, 
                                            title: "Global Accessibility", 
                                            desc: "We believe in equal opportunity. Our premium-tier exam resources are provided 100% free to students worldwide." 
                                        }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-5 items-start">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 relative z-10">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1.5">{item.title}</h4>
                                                <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {[
                                            "https://i.pravatar.cc/100?u=1",
                                            "https://i.pravatar.cc/100?u=2",
                                            "https://i.pravatar.cc/100?u=3"
                                        ].map((url, i) => (
                                            <img 
                                                key={i} 
                                                src={url} 
                                                alt="Student" 
                                                className="w-6 h-6 rounded-full border-2 border-white object-cover" 
                                            />
                                        ))}
                                        <div className="w-6 h-6 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-[7px] font-black text-indigo-600">5,000+</div>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 italic">5,000+ Students</span>
                                </div>

                                <a 
                                    href="https://chat.whatsapp.com/CfVh7u9L6vT7ZFpZwwVa4A" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <Button className="w-full h-11 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] mt-6 flex items-center justify-center gap-2 group shadow-xl">
                                        Join the Community <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Blue CTA Section */}
                <section className="bg-indigo-600 py-12 px-6 md:px-12 lg:px-24 text-white overflow-hidden relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
                    <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                            <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center backdrop-blur-md">
                                <Zap size={32} fill="white" className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black mb-1 tracking-tight">Ready to start preparation?</h2>
                                <p className="text-indigo-100 font-bold text-xs">Join 5,000+ students already practicing with ItaloStudy.</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <a href="https://app.italostudy.com/auth" className="w-full">
                                <Button className="h-12 px-6 bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl font-black uppercase tracking-[0.2em] text-[9px] w-full shadow-xl">
                                    Take Free Mock Test
                                </Button>
                            </a>
                            <a href="https://app.italostudy.com/auth" className="w-full">
                                <Button variant="outline" className="h-12 px-6 border-white/20 hover:bg-white/10 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[9px] w-full">
                                    Create Account
                                </Button>
                            </a>
                        </div>
                    </div>
                </section>

                <Suspense fallback={null}>
                    <Footer />
                </Suspense>
            </div>
        </div>
    );
};

export default Syllabus;
