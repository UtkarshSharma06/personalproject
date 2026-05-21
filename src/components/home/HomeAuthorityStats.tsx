import { motion } from 'framer-motion';
import { Users, BookOpen, Globe, Star, GraduationCap, TrendingUp, Award, CheckCircle2, Shield, School } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import EditableText from '@/components/cms/EditableText';
import { cn } from '@/lib/utils';
import TrustpilotSection from '@/components/TrustpilotSection';


const HomeAuthorityStats = () => {
    const { t } = useTranslation();

    const stats = [
        {
            icon: <BookOpen className="w-5 h-5" />,
            value: "1,200+",
            label: "Mocks Generated",
            fieldKey: "auth_stat_mocks",
        },
        {
            icon: <Globe className="w-5 h-5" />,
            value: "18+",
            label: "Countries Reached",
            fieldKey: "auth_stat_countries",
        },
        {
            icon: <Users className="w-5 h-5" />,
            value: "5,000+",
            label: "students",
            fieldKey: "auth_stat_students",
        }
    ];

    const topUniversities = [
        "Sapienza Rome", "Uni of Milan", "Uni of Bologna", "Uni of Pavia", "Tor Vergata"
    ];

    return (
        <section className="pt-0 pb-4 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* The Authority Hub - Minimalist Premium Card */}
                <div className="relative rounded-[3.5rem] bg-white border border-white/5 p-8 md:p-20 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] group">
                    {/* Subtle Airy Background Effect */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/50 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
                    
                    <div className="relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Left Side: Minimalist Messaging */}
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full mb-10">
                                    <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.25em]">
                                        <EditableText fieldKey="auth_hub_badge" fallback="Global Performance Leader" />
                                    </span>
                                </div>

                                <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter leading-[0.9] mb-10 uppercase">
                                    <EditableText fieldKey="auth_hub_title" fallback="Proven Success, Global Trust" />
                                </h2>

                                <p className="text-xl md:text-2xl font-bold !text-black/70 leading-tight mb-14 max-w-lg">
                                    <EditableText fieldKey="auth_hub_desc" fallback="Join the elite circle of international medical students who conquered the world's toughest exams." />
                                </p>

                                {/* Stats Bar - Ultra Clean */}
                                <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/5">
                                    {stats.map((stat, i) => (
                                        <div key={i}>
                                            <div className="text-2xl md:text-4xl font-black text-black mb-1">
                                                <EditableText fieldKey={`${stat.fieldKey}_val`} fallback={stat.value} />
                                            </div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                                <EditableText fieldKey={`${stat.fieldKey}_lab`} fallback={stat.label} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Side: Sophisticated Data Card */}
                            <div className="relative">
                                <div className="bg-slate-50/50 rounded-[3rem] p-8 md:p-12 border border-slate-100 relative overflow-hidden">
                                    <div className="flex items-center gap-5 mb-10">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center shadow-lg">
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-black uppercase tracking-tight">Admissions Results</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Verified 2026 Batch</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-10">
                                        {topUniversities.map((uni, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all duration-300 shadow-sm hover:shadow-md group/item">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    <span className="text-sm font-bold text-slate-800">{uni}</span>
                                                </div>
                                                <CheckCircle2 className="w-4 h-4 text-slate-200 group-hover/item:text-emerald-500 transition-colors" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                            <div className="text-3xl font-black text-black mb-1">92%</div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Success Rate</div>
                                        </div>
                                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                            <div className="text-3xl font-black text-black mb-1">2026</div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Cycle</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Integrated Trustpilot Proof */}
                    <div className="mt-20 pt-12 border-t border-white/5">
                        <TrustpilotSection />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeAuthorityStats;
