import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Zap, Sparkles, Brain, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import SEO from '@/components/SEO';
import { useCurrency } from '@/hooks/useCurrency';

export default function Pricing() {
    const { user } = useAuth();
    const { currency, formatPrice } = useCurrency();
    const tiers = [
        {
            id: 'explorer',
            name: 'Explorer Plan',
            price: 0,
            description: 'Essential daily study habit.',
            icon: Brain,
            color: 'slate',
            included: ['10-15 Questions Daily', 'Basic Performance Stats', 'Sample Intro Videos', 'Read-only Community'],
            excluded: ['Unlimited Practice Exams', 'Full Learning Section', 'Mock Simulations', 'University Shortlisting'],
            cta: 'START FREE'
        },
        {
            id: 'pro',
            name: 'Exam Prep Plan',
            price: 999,
            originalPrice: 999,
            description: 'Everything you need for exam confidence.',
            icon: Zap,
            color: 'indigo',
            badge: 'BETA SPECIAL',
            included: ['Unlimited Practice Exams', 'Detailed Explanations', 'Full Learning Section', 'Mock Simulations', 'Community Discussion', 'Exam Analytics'],
            excluded: ['Priority Community Access', 'University Shortlisting', 'Visa Process Guidance'],
            cta: 'GET FOR FREE'
        },
        {
            id: 'elite',
            name: 'Global Admission Plan',
            price: 2499,
            originalPrice: 2499,
            description: 'Complete support from prep to admission.',
            icon: Sparkles,
            color: 'amber',
            badge: 'BETA SPECIAL',
            included: ['Everything in PRO', 'Advanced Simulations', 'Priority Community Access', 'University Shortlisting', 'Visa Process Guidance'],
            excluded: [],
            cta: 'GET FOR FREE'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-20">
            <SEO
                title="Pricing & Plans | Free IMAT Prep & Mock Exams"
                description="Choose the right plan for your exam preparation. ItaloStudy offers free practice, unlimited free mocks, and comprehensive admission support."
                schema={{
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    "itemListElement": tiers.map((tier, index) => ({
                        "@type": "Product",
                        "position": index + 1,
                        "name": `ItaloStudy ${tier.name}`,
                        "description": tier.description,
                        "brand": {
                            "@type": "Brand",
                            "name": "ItaloStudy"
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "EUR",
                            "availability": "https://schema.org/InStock",
                            "url": "https://italostudy.com/pricing"
                        }
                    })),
                    "breadcrumb": {
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://italostudy.com"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Pricing",
                                "item": "https://italostudy.com/pricing"
                            }
                        ]
                    }
                }}
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

            <main className="max-w-7xl mx-auto px-4 py-6 h-[calc(100vh-80px)] flex flex-col">
                {/* Hero Note */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white rounded-full mb-2 shadow-lg shadow-emerald-500/20">
                        <Zap size={12} className="fill-current" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Beta Access</span>
                    </div>
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-tight leading-relaxed">
                        All premium protocols are currently unlocked for free during the Beta testing phase.
                    </p>
                </div>

                {/* Horizontal Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                    {tiers.map((plan) => (
                        <Card key={plan.id} className="p-0 rounded-2xl border-0 shadow-xl shadow-slate-200 dark:shadow-none bg-white dark:bg-slate-950 overflow-hidden relative group transition-transform hover:scale-[1.02] flex flex-col">
                            <div className="p-5 flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-${plan.color === 'slate' ? 'slate-100' : plan.id === 'pro' ? 'indigo-100' : 'amber-100'} flex items-center justify-center shadow-inner`}>
                                        <plan.icon className={`w-6 h-6 ${plan.color === 'slate' ? 'text-slate-600' : plan.id === 'pro' ? 'text-indigo-600' : 'text-amber-600'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{plan.name}</h3>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{plan.description}</p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center gap-2">
                                        {plan.originalPrice && plan.originalPrice > 0 ? (
                                            <>
                                                <span className="text-sm font-bold text-slate-400 line-through">{formatPrice(plan.originalPrice)}</span>
                                                <span className="text-xl font-black text-[#00a884]">FREE</span>
                                            </>
                                        ) : (
                                            <span className="text-xl font-black text-[#00a884]">{formatPrice(plan.price)}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4 flex-1">
                                    {plan.included.map((feature, idx) => (
                                        <div key={`inc-${idx}`} className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                                                <Check className="w-2.5 h-2.5 text-[#00a884]" />
                                            </div>
                                            <span className="text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight leading-tight">{feature}</span>
                                        </div>
                                    ))}
                                    {plan.excluded.map((feature, idx) => (
                                        <div key={`exc-${idx}`} className="flex items-center gap-2 opacity-40">
                                            <div className="w-4 h-4 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center shrink-0">
                                                <X className="w-2.5 h-2.5 text-red-500" />
                                            </div>
                                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tight line-through decoration-red-500/30 leading-tight">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link to={user ? "/onboarding" : "/auth"} className="mt-auto">
                                    <Button className="w-full h-12 bg-[#00a884] hover:bg-[#008f6f] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 transition-all">
                                        {plan.cta}
                                        <ChevronRight size={16} className="ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="text-center py-3">
                    <p className="text-[9px] font-black text-slate-300 dark:text-white/10 uppercase tracking-[0.4em] leading-relaxed">
                        Your preparation status is recorded in the global protocol database.
                    </p>
                </div>
            </main>
        </div>
    );
}
