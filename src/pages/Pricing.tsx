import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Zap, Sparkles, Brain, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

export default function Pricing() {
    const { user } = useAuth();
    const tiers = [
        {
            id: 'explorer',
            name: 'Explorer Plan',
            price: '€0',
            description: 'Build your study habit with essential daily practice.',
            icon: Brain,
            color: 'from-slate-400 to-slate-600',
            features: ['10-15 Questions Daily', 'Basic Performance Stats', 'Sample Intro Videos', 'Read-only Community'],
            limitations: ['No Mock Exams', 'No Full Lectures', 'Correct/Incorrect Only'],
            cta: 'START FREE'
        },
        {
            id: 'pro',
            name: 'Exam Prep Plan',
            price: '€25',
            description: 'Everything you need to crack the exam with confidence.',
            icon: Zap,
            color: 'from-indigo-500 to-violet-600',
            badge: 'POPULAR',
            features: ['Unlimited Practice Exams', 'Detailed Explanations', 'Full Learning Section', 'Mock Simulations', 'Community Discussion', 'Exam Analytics'],
            cta: 'GET PRO'
        },
        {
            id: 'elite',
            name: 'Global Admission Plan',
            price: '€50',
            description: 'Complete support from preparation to university admission.',
            icon: Sparkles,
            color: 'from-amber-500 to-orange-600',
            badge: 'ELITE',
            features: ['Everything in PRO', 'Advanced Simulations', 'Priority Community Access', 'University Shortlisting', 'Visa Process Guidance', 'Elite Badge'],
            cta: 'APPLY GLOBAL'
        }
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#020617] font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden relative">
            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Nav */}
            <div className="bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-5">
                    <Link to="/" className="inline-flex items-center gap-3 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Back to Base
                    </Link>
                </div>
            </div>

            {/* Hero */}
            <section className="container mx-auto px-6 py-20 text-center relative">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full mb-8 shadow-sm">
                    <Zap className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest text-[9px]">Mission Investment</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-tight">
                    CHOOSE YOUR <span className="text-indigo-600">PLAN.</span>
                </h1>
                <p className="text-xl text-slate-400 font-bold max-w-2xl mx-auto mb-6 tracking-tight leading-relaxed">
                    Access our high-performance simulation infrastructure with transparent licensing tiers.
                </p>
            </section>

            {/* Pricing Matrix */}
            <section className="container mx-auto px-6 pb-32">
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tiers.map((plan, i) => (
                        <div
                            key={plan.id}
                            className={`relative p-8 rounded-[3rem] border-2 bg-white dark:bg-slate-900 transition-all duration-300 group flex flex-col shadow-xl border-slate-100 dark:border-white/10 hover:border-indigo-600 hover:-translate-y-2 hover:shadow-2xl`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase">
                                    {plan.badge}
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                                    <plan.icon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none mb-1 uppercase tracking-tight">{plan.name}</h3>
                                    <p className="text-3xl font-black text-indigo-600 leading-none">{plan.price}</p>
                                </div>
                            </div>

                            <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight mb-8">
                                {plan.description}
                            </p>

                            <div className="space-y-3 flex-1 mb-10">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                        <div className="mt-1 w-3.5 h-3.5 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-900 dark:text-slate-200 uppercase tracking-tighter leading-tight">{feature}</span>
                                    </div>
                                ))}
                                {plan.limitations?.map((limit: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-2 opacity-40">
                                        <div className="mt-1 w-3.5 h-3.5 bg-rose-500/10 rounded-full flex items-center justify-center shrink-0">
                                            <X className="w-2.5 h-2.5 text-rose-600" />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-tight line-through">{limit}</span>
                                    </div>
                                ))}
                            </div>

                            <Link to={user ? "/onboarding" : "/auth"}>
                                <Button
                                    className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
                                >
                                    {plan.cta}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
