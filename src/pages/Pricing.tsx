import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Zap, Sparkles, Brain, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import SEO from '@/components/SEO';

export default function Pricing() {
    const { user } = useAuth();
    const tiers = [
        {
            id: 'explorer',
            name: 'Explorer Plan',
            price: '€0',
            description: 'Essential daily study habit.',
            icon: Brain,
            color: 'slate',
            features: ['10-15 Questions Daily', 'Basic Performance Stats', 'Sample Intro Videos', 'Read-only Community'],
            cta: 'START FREE'
        },
        {
            id: 'pro',
            name: 'Exam Prep Plan',
            price: '€0',
            description: 'Everything you need for exam confidence.',
            icon: Zap,
            color: 'indigo',
            badge: 'BETA SPECIAL',
            features: ['Unlimited Practice Exams', 'Detailed Explanations', 'Full Learning Section', 'Mock Simulations', 'Community Discussion', 'Exam Analytics'],
            cta: 'GET FOR FREE'
        },
        {
            id: 'elite',
            name: 'Global Admission Plan',
            price: '€0',
            description: 'Complete support from prep to admission.',
            icon: Sparkles,
            color: 'amber',
            badge: 'BETA SPECIAL',
            features: ['Everything in PRO', 'Advanced Simulations', 'Priority Community Access', 'University Shortlisting', 'Visa Process Guidance'],
            cta: 'GET FOR FREE'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-20">
            <SEO
                title="Pricing & Plans | Free IMAT Prep & Mock Exams"
                description="Choose the right plan for your exam preparation. ItaloStudy offers free practice, unlimited free mocks, and comprehensive admission support."
            />

            {/* WhatsApp Style Header */}
            <div className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5 sticky top-0 z-50">
                <div className="max-w-xl mx-auto px-6 py-6 flex items-center gap-4">
                    <Link to="/" className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Membership</h1>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Select Access Protocol</p>
                    </div>
                </div>
            </div>

            <main className="max-w-xl mx-auto px-4 mt-8 space-y-6">
                {/* Hero Note */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white rounded-full mb-3 shadow-lg shadow-emerald-500/20">
                        <Zap size={12} className="fill-current" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Beta Access</span>
                    </div>
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-tight leading-relaxed">
                        All premium protocols are currently unlocked for free during the Beta testing phase.
                    </p>
                </div>

                {/* Vertical Plans List */}
                <div className="space-y-4">
                    {tiers.map((plan) => (
                        <Card key={plan.id} className="p-0 rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200 dark:shadow-none bg-white dark:bg-slate-950 overflow-hidden relative group transition-transform active:scale-[0.98]">
                            <div className="p-8">
                                <div className="flex items-center gap-5 mb-8">
                                    <div className={`w-16 h-16 rounded-2xl bg-${plan.color === 'slate' ? 'slate-100' : plan.id === 'pro' ? 'indigo-100' : 'amber-100'} flex items-center justify-center shadow-inner`}>
                                        <plan.icon className={`w-8 h-8 ${plan.color === 'slate' ? 'text-slate-600' : plan.id === 'pro' ? 'text-indigo-600' : 'text-amber-600'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{plan.name}</h3>
                                            <span className="text-lg font-black text-[#00a884]">{plan.price}</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{plan.description}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-5 h-5 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-[#00a884]" />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link to={user ? "/onboarding" : "/auth"}>
                                    <Button className="w-full h-14 bg-[#00a884] hover:bg-[#008f6f] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 group-hover:translate-x-1 transition-all">
                                        {plan.cta}
                                        <ChevronRight size={18} className="ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="text-center pt-8 pb-12">
                    <p className="text-[9px] font-black text-slate-300 dark:text-white/10 uppercase tracking-[0.4em] leading-relaxed max-w-[280px] mx-auto">
                        Your preparation status is recorded in the global protocol database.
                    </p>
                </div>
            </main>
        </div>
    );
}
