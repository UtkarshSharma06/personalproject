import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check, X, Zap, Sparkles, Brain, ArrowRight, ShieldCheck,
    ArrowLeft, Globe, BadgeCheck, Loader2, Plus, Minus, Layers, Layout,
    CreditCard, Calendar, Star, Crown
} from 'lucide-react';
import { add } from 'date-fns';
import { usePricing, PricingConfig, Plan, Feature } from '@/context/PricingContext';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCurrency, SUPPORTED_CURRENCIES } from '@/hooks/useCurrency';
import { usePlanAccess } from '@/hooks/usePlanAccess';
import { Clock } from 'lucide-react';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';


const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 py-5 first:pt-0 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left group"
            >
                <span className="text-base font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{question}</span>
                <div className={cn(
                    "p-2 rounded-full bg-slate-100 transition-all duration-300 group-hover:bg-indigo-50",
                    isOpen && "rotate-45 bg-indigo-100 text-indigo-600"
                )}>
                    <Plus className={cn("w-4 h-4 text-slate-500", isOpen && "text-indigo-600")} />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <p className="pt-3 pb-2 text-slate-600 leading-relaxed text-sm">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const IconMap: any = {
    Brain: Brain,
    Zap: Zap,
    Sparkles: Sparkles,
    Layers: Layers,
    Layout: Layout
};

import SEO from '@/components/SEO';

export default function Pricing() {
    const { config, couponMessage, isLoading: isConfigLoading } = usePricing();
    const { user, profile, refreshProfile } = useAuth() as any;
    const { expiryDate, isExplorer } = usePlanAccess();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { formatPrice, getRegionalPrice } = useCurrency();
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('monthly');

    const handlePlanSelect = async (planId: string) => {
        window.location.href = `https://app.italostudy.com/auth?redirect=pricing&plan=${planId}`;
    };

    const handleLiveCheckout = (planId: string) => {
        handlePlanSelect(planId);
    };

    const getPlanCycle = (plan: any) => {
        if (plan.cycles && plan.cycles.length > 0) {
            const index = billingCycle === 'monthly' ? 0 : 1;
            return plan.cycles[Math.min(index, plan.cycles.length - 1)];
        }
        return null;
    };

    const currentPrice = (plan: any) => {
        const cycle = getPlanCycle(plan);
        const basePrice = cycle ? cycle.price : (billingCycle === 'monthly' ? plan.monthlyPrice : plan.quarterlyPrice);
        const regionalPrices = cycle ? cycle.regionalPrices : plan.regionalPrices;

        const info = getRegionalPrice(basePrice, regionalPrices);
        return formatPrice(info.amount, info.currency);
    };

    if (isConfigLoading || !config) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    const basePlans = config.plans.filter((p: any) => p.isVisible !== false);
    
    // Inject the Courses Card
    const coursesPlan = {
        id: 'courses',
        name: 'Explore Courses',
        description: 'Structured video courses designed specifically for your exam.',
        isPopular: true,
        ribbonText: 'MOST RECOMMENDED',
        monthlyPrice: 0,
        quarterlyPrice: 0,
        regionalPrices: {}
    };
    
    // Set isPopular for Global and Courses
    const mappedBase = basePlans.map((p: any) => ({ 
        ...p, 
        isPopular: p.id === 'global' || p.name?.toLowerCase().includes('global'),
        ribbonText: (p.id === 'global' || p.name?.toLowerCase().includes('global')) ? 'MOST POPULAR' : undefined
    }));
    const plans = [...mappedBase, coursesPlan];

    const faqs = [
        {
            question: "How does the free trial work?",
            answer: "Start with our free Explorer plan — no credit card required. Upgrade to a paid plan anytime for full access."
        },
        {
            question: "Can I change or cancel my plan anytime?",
            answer: "We will notify you well in advance. You can choose to upgrade to a paid plan or continue with our free Explorer tier."
        },
        {
            question: "Is my payment information secure?",
            answer: "Yes, we use industry-standard encryption and secure payment processors. All transactions are protected with bank-level security."
        },
        {
            question: "How do I cancel my subscription?",
            answer: "You can cancel anytime from your dashboard settings. Your access will continue until the end of your current billing period."
        }
    ];

    return (
        <div className="min-h-screen bg-[#Fdfdfd] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 relative overflow-x-hidden">
            <SEO
                title="Pricing & Membership Plans | ItaloStudy"
                description="Join ItaloStudy and unlock premium exam prep tools. Choose from our flexible plans for IMAT, CEnT-S, SAT, and IELTS. Flexible monthly and quarterly plans starting from free."
                keywords="ItaloStudy pricing, membership, free IMAT prep, premium study tools, CEnT-S pro, elite study plan, Italy study abroad cost, IMAT course fee, TOLC preparation price, TIL-I course cost, best affordable Italian medical preparation"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "name": "ItaloStudy Premium Membership",
                    "description": "Premium study platform access for IMAT, CEnT-S, TOLC, and TIL-I preparation.",
                    "category": "Educational Software",
                    "offers": {
                        "@type": "AggregateOffer",
                        "priceCurrency": "EUR",
                        "lowPrice": "0",
                        "highPrice": "49",
                        "offerCount": "3",
                        "offers": [
                            {
                                "@type": "Offer",
                                "name": "Explorer",
                                "price": "0",
                                "priceCurrency": "EUR",
                                "availability": "https://schema.org/InStock"
                            }
                        ]
                    }
                }}
            />


            {/* Background Decorative Elements - Soft Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-100/40 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-pink-100/30 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
                <div className="container mx-auto flex items-center justify-between">
                    <a href="/" className="flex items-center gap-3">
                        <img src="/logo.webp" alt="ItaloStudy Logo" className="h-10 w-auto" />
                    </a>
                    <div className="flex gap-2 items-center">
                        <a href="/">
                            <Button variant="ghost" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full px-6 transition-all">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Button>
                        </a>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-24 pb-8 px-4 sm:px-6">
                <div className="container mx-auto max-w-6xl">

                    {/* Hero Section */}
                    <div className="text-center mb-8 max-w-3xl mx-auto">
                        {/* Explorer Free Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full mb-4 shadow-sm">
                            <Sparkles size={14} className="text-green-600 fill-green-600" />
                            <span className="text-xs font-bold text-green-900 uppercase tracking-wider">🎉 Explorer Plan — Always Free</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                            Your daily study partner —<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                practice, mock, improve
                            </span>
                        </h1>

                        <p className="text-sm text-slate-600 mb-6 font-medium">
                            Don't study blindly. Track your real progress every day.<br className="hidden md:block"/> Start Free → Upgrade when ready.
                        </p>

                        {/* Billing Toggle */}
                        <div className="flex items-center justify-center gap-3 bg-white p-1 rounded-full inline-flex shadow-sm border border-slate-200">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={cn(
                                    "px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300",
                                    billingCycle === 'monthly'
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "text-slate-500 hover:text-slate-800"
                                )}
                            >
                                MONTHLY
                            </button>
                            <button
                                onClick={() => setBillingCycle('quarterly')}
                                className={cn(
                                    "px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300",
                                    billingCycle === 'quarterly'
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "text-slate-500 hover:text-slate-800"
                                )}
                            >
                                QUARTERLY
                            </button>
                        </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className={cn(
                        "grid gap-6 items-stretch mb-8 mx-auto",
                        plans.length === 1 ? "max-w-md" : plans.length === 2 ? "max-w-3xl lg:grid-cols-2" : "max-w-5xl lg:grid-cols-3"
                    )}>
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={cn(
                                    "relative p-6 rounded-3xl transition-all duration-300 flex flex-col h-full border",
                                    plan.isPopular
                                        ? "bg-white shadow-xl border-indigo-100"
                                        : "bg-white/70 backdrop-blur-md shadow-md border-white/60 hover:bg-white"
                                )}
                            >
                                {plan.isPopular && (
                                    <div className="absolute top-0 right-4 -translate-y-1/2">
                                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                                            {(plan as any).ribbonText || 'MOST POPULAR'}
                                        </div>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        {plan.id === 'courses' ? (
                                            <div className="flex flex-col mb-6 mt-1">
                                                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                                    Target Batches
                                                </span>
                                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                                    Valid till exam date
                                                </span>
                                            </div>
                                        ) : config.mode === 'beta' ? (
                                            <>
                                                <span className="text-3xl font-extrabold text-green-600 tracking-tight">
                                                    FREE
                                                </span>
                                                {(() => {
                                                    const cycle = getPlanCycle(plan);
                                                    const basePrice = cycle ? cycle.price : (billingCycle === 'monthly' ? (plan as any).monthlyPrice : (plan as any).quarterlyPrice);
                                                    const regionalPrices = cycle ? cycle.regionalPrices : plan.regionalPrices;

                                                    if (basePrice > 0) {
                                                        const info = getRegionalPrice(basePrice, regionalPrices);
                                                        return (
                                                            <span className="text-lg font-bold text-slate-400 line-through">
                                                                {formatPrice(info.amount, info.currency)}
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                })()}
                                            </>
                                        ) : (
                                            <div className="flex items-baseline justify-center gap-1 mb-6 flex-wrap">
                                                <span className={cn(
                                                    "font-black text-slate-900 dark:text-white tracking-tighter",
                                                    currentPrice(plan).length > 8 ? "text-3xl lg:text-4xl" : "text-5xl"
                                                )}>
                                                    {currentPrice(plan)}
                                                </span>
                                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px] whitespace-nowrap">
                                                    / {billingCycle === 'monthly' ? 'month' : 'quarter'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 mb-1">
                                        {plan.name}
                                    </h3>
                                    <p className="text-slate-500 text-xs leading-relaxed">
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="flex-1 space-y-2.5 mb-5">
                                    {plan.id === 'courses' ? (
                                        <>
                                            <div className="flex items-start gap-2">
                                                <div className="mt-0.5 p-0.5 rounded-full bg-violet-50 text-violet-600 shrink-0">
                                                    <Check className="w-3 h-3" strokeWidth={3} />
                                                </div>
                                                <span className="text-xs text-slate-700 font-medium leading-tight">
                                                    <span className="font-bold text-slate-900">Live & Recorded Lectures</span> for complete coverage
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="mt-0.5 p-0.5 rounded-full bg-indigo-50 text-indigo-600 shrink-0">
                                                    <Check className="w-3 h-3" strokeWidth={3} />
                                                </div>
                                                <span className="text-xs text-slate-700 font-medium leading-tight">
                                                    <span className="font-bold text-slate-900">Structured Batches</span> valid till exam date
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="mt-0.5 p-0.5 rounded-full bg-indigo-50 text-indigo-600 shrink-0">
                                                    <Check className="w-3 h-3" strokeWidth={3} />
                                                </div>
                                                <span className="text-xs text-slate-700 font-medium leading-tight">
                                                    Targeted exam strategies & notes
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        config.comparison.map((feat, idx) => {
                                            const value = (feat as any)[plan.id];
                                            if (value === undefined || value === false) return null;
                                            return (
                                                <div key={idx} className="flex items-start gap-2">
                                                    <div className="mt-0.5 p-0.5 rounded-full bg-indigo-50 text-indigo-600 shrink-0">
                                                        <Check className="w-3 h-3" strokeWidth={3} />
                                                    </div>
                                                    <span className="text-xs text-slate-700 font-medium leading-tight">
                                                        {typeof value === 'boolean' ? feat.name : <span ><span className="font-bold text-slate-900">{value}</span> {feat.name.split(':')[0]}</span>}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                <Button
                                    onClick={() => {
                                        if (plan.id === 'courses') {
                                            window.location.href = '/courses';
                                        } else if (config.mode === 'live') {
                                            handleLiveCheckout(plan.id);
                                        } else {
                                            handlePlanSelect(plan.id);
                                        }
                                    }}
                                    disabled={isUpdating !== null || profile?.selected_plan === plan.id || (() => {
                                        const currentPlanIndex = plans.findIndex(p => p.id === profile?.selected_plan);
                                        const targetPlanIndex = plans.findIndex(p => p.id === plan.id);
                                        return currentPlanIndex !== -1 && targetPlanIndex !== -1 && targetPlanIndex < currentPlanIndex;
                                    })()}
                                    className={cn(
                                        "w-full h-10 rounded-xl font-bold text-xs tracking-wide transition-all shadow-md",
                                        plan.isPopular
                                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-200"
                                            : "bg-slate-700 text-white hover:bg-slate-800",
                                        (() => {
                                            const currentPlanIndex = plans.findIndex(p => p.id === profile?.selected_plan);
                                            const targetPlanIndex = plans.findIndex(p => p.id === plan.id);
                                            return currentPlanIndex !== -1 && targetPlanIndex !== -1 && targetPlanIndex < currentPlanIndex;
                                        })() && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {(() => {
                                        const currentPlanIndex = plans.findIndex(p => p.id === profile?.selected_plan);
                                        const targetPlanIndex = plans.findIndex(p => p.id === plan.id);
                                        const isDowngrade = currentPlanIndex !== -1 && targetPlanIndex !== -1 && targetPlanIndex < currentPlanIndex;

                                        if (isUpdating === plan.id) return <Loader2 className="w-4 h-4 animate-spin" />;
                                        if (profile?.selected_plan === plan.id) return "Current Plan";
                                        if (isDowngrade) return "Downgrade Unavailable";
                                        if (plan.id === 'courses') return "Browse Courses";
                                        if (config.mode === 'live') return `Subscribe to ${plan.name}`;
                                        return `Upgrade to ${plan.name}`;
                                    })()}
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Cross Promotion: Courses */}
                    <div className="max-w-4xl mx-auto mt-12 bg-indigo-900 rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl" />
                        <div className="relative z-10">
                            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                                Want even more? Add a Course.
                            </h2>
                            <p className="text-indigo-200 text-sm md:text-base mb-8 max-w-xl mx-auto">
                                Get a course for structured learning <strong className="text-white">and</strong> a Global subscription for daily practice. Pay for both in one checkout — two separate, secure payments.
                            </p>
                            <a href="/courses" className="inline-flex items-center gap-2 bg-white text-indigo-900 font-black text-sm uppercase tracking-widest px-8 py-3.5 rounded-xl hover:scale-105 transition-transform shadow-lg">
                                Browse Courses <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* FAQ Section - Compact */}
                    <div className="max-w-4xl mx-auto mt-8 bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-lg">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">Frequently Asked Questions</h3>
                        <div className="space-y-1">
                            {faqs.map((faq, i) => (
                                <FAQItem key={i} question={faq.question} answer={faq.answer} />
                            ))}
                        </div>
                    </div>

                    {/* Trust Footer - Minimal */}
                    <div className="text-center py-8 border-t border-slate-200 mt-10">
                        <div className="flex items-center justify-center gap-2 text-slate-900 mb-6">
                            <ShieldCheck size={18} className="text-indigo-600" />
                            <span className="text-sm font-black uppercase tracking-widest">Secure Payments</span>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-6">
                            {['visa', 'mastercard', 'amex', 'paypal', 'applepay', 'googlepay', 'ideal', 'pix', 'upi', 'cashapp'].map(logo => (
                                <img 
                                    key={logo}
                                    src={`/payments/${logo}.webp`} 
                                    alt={logo} 
                                    className="h-5 md:h-6 w-auto object-contain transition-transform hover:scale-110"
                                />
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">SSL Encrypted • Bank-Level Security • Instant Access</p>
                    </div>

                </div>
            </main>

            <Footer />

        </div >
    );
}
