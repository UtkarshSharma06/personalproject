import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, Zap, Sparkles, Brain, X, ChevronRight, Loader2, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import SEO from '@/components/SEO';
import { useCurrency } from '@/hooks/useCurrency';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-100 py-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left group"
            >
                <span className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{question}</span>
                {isOpen ? <Minus className="w-5 h-5 text-slate-400" /> : <Plus className="w-5 h-5 text-slate-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="pt-4 text-slate-500 font-medium leading-relaxed uppercase text-[11px] tracking-widest">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function Pricing() {
    const { user, profile, refreshProfile } = useAuth() as any;
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const handlePlanSelect = async (planId: string) => {
        if (!user) {
            navigate('/auth');
            return;
        }

        if (!profile?.selected_exam) {
            navigate('/onboarding');
            return;
        }

        setIsUpdating(planId);
        try {
            const tierMap: any = { 'explorer': 'initiate', 'pro': 'elite', 'elite': 'global' };
            const { error } = await supabase
                .from('profiles')
                .update({
                    selected_plan: planId,
                    subscription_tier: tierMap[planId] || 'initiate'
                })
                .eq('id', user.id);

            if (error) throw error;

            await refreshProfile();
            toast({
                title: "Plan Updated",
                description: `Success! Your access level has been updated to the ${planId.toUpperCase()} tier.`,
            });
            navigate('/dashboard');
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsUpdating(null);
        }
    };

    const tiers = [
        {
            id: 'explorer',
            name: 'Explorer Plan',
            price: 0,
            description: 'Essential daily study habit.',
            included: ['10-15 Questions Daily', 'Basic Performance Stats', 'Sample Intro Videos', 'Read-only Community'],
            excluded: ['Unlimited Practice Exams', 'Full Subject Modules', 'Mock simulations', 'University Shortlisting', 'Visa Guidance Support'],
            cta: 'START FREE',
            isPopular: false
        },
        {
            id: 'pro',
            name: 'Exam Prep Plan',
            price: 5,
            originalPrice: 5,
            description: 'Everything for exam confidence.',
            included: ['Unlimited Practice Exams', 'Detailed Explanations', 'Full Learning Section', 'Mock Simulations', 'Community Discussion', 'Exam Analytics'],
            excluded: ['University Shortlisting', 'Visa Guidance Support', 'Direct Consultant Channel'],
            cta: 'GET FOR FREE',
            isPopular: true
        },
        {
            id: 'elite',
            name: 'Global Admission Plan',
            price: 10,
            originalPrice: 10,
            description: 'Complete prep-to-admission support.',
            included: ['Everything in PRO', 'Advanced Simulations', 'Priority Community Access', 'University Shortlisting', 'Visa Process Guidance', 'Direct Consultant Channel'],
            excluded: [],
            cta: 'GET FOR FREE',
            isPopular: false
        }
    ];

    const faqs = [
        {
            question: "Is ItaloStudy really free during Beta?",
            answer: "Yes! Every single premium feature, including mock exams and detailed analytics, is completely free while we are in our beta testing phase."
        },
        {
            question: "How do I upgrade to a different plan later?",
            answer: "You can change your plan at any time from your settings panel. During Beta, upgrades are instant and cost nothing."
        },
        {
            question: "What exams do you currently support?",
            answer: "We support IMAT, SAT, CEnT-S, and IELTS. Each plan works across all supported exams once selected in your profile."
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
            <SEO
                title="Pricing Plans | ItaloStudy"
                description="Flexible pricing for students of all levels. Explore the ItaloStudy Explorer, Exam Prep, and Global Admission plans."
            />

            {/* Dark Hero Section (Based on Image) */}
            <div className="bg-[#030014] pt-20 pb-40 px-6 relative overflow-hidden">
                {/* Gradient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full" />

                <div className="container mx-auto flex items-center justify-between relative z-10">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src="/logo.png"
                            alt="Italostudy Logo"
                            className="h-10 w-auto object-contain brightness-0 invert"
                            width="160"
                            height="40"
                            loading="eager"
                        />
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link to="/auth" className="text-xs font-black text-white/70 hover:text-white uppercase tracking-widest transition-colors">Log In</Link>
                        <Link to="/auth">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest h-10 px-6 rounded-lg transition-all">Sign Up</Button>
                        </Link>
                    </div>
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-tight text-center"
                >
                    Pricing plans <br /> for students of all aims
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/40 font-bold max-w-xl mx-auto leading-relaxed uppercase text-[11px] tracking-[0.2em] text-center"
                >
                    Built for those who strive for excellence. <br />
                    Everything you need from initial practice to global enrollment.
                </motion.p>
            </div>

            {/* Pricing Cards Section (Overlapping) */}
            <div className="relative z-20 container mx-auto px-6 -mt-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {tiers.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 + 0.3 }}
                            className={`relative bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 flex flex-col ${plan.isPopular ? 'md:scale-105 z-10 border-2 border-blue-600' : 'z-0 border border-slate-100'}`}
                        >
                            {plan.isPopular && (
                                <div className="bg-blue-600 py-3 text-center shrink-0">
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                        Most popular <Zap className="w-3 h-3 fill-white" />
                                    </span>
                                </div>
                            )}
                            <div className="p-10 md:p-12 flex flex-col flex-1 h-full">
                                <div className="mb-8">
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">{plan.name}</h3>
                                    <div className="flex items-baseline gap-2">
                                        {plan.originalPrice && plan.originalPrice > 0 ? (
                                            <>
                                                <span className="text-4xl font-black text-slate-900 tracking-tighter">FREE</span>
                                                <span className="text-lg font-bold text-slate-300 line-through tracking-tight">{formatPrice(plan.originalPrice)}</span>
                                            </>
                                        ) : (
                                            <span className="text-4xl font-black text-slate-900 tracking-tighter">{formatPrice(plan.price)}</span>
                                        )}
                                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">/ month</span>
                                    </div>
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-4 leading-none">{plan.description}</p>
                                </div>

                                <div className="space-y-5 mb-12 flex-1">
                                    {plan.included.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tight leading-tight">{feature}</span>
                                        </div>
                                    ))}
                                    {plan.excluded?.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3 opacity-30">
                                            <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight leading-tight line-through">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={() => handlePlanSelect(plan.id)}
                                    disabled={isUpdating !== null}
                                    className={`w-full h-14 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${plan.isPopular ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20' : 'bg-slate-50 hover:bg-slate-100 text-blue-600 shadow-sm'}`}
                                >
                                    {isUpdating === plan.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        plan.cta
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* FAQ Section (Based on Image) */}
            <div className="py-32 px-6 bg-white">
                <div className="container mx-auto max-w-3xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-4">Frequently asked questions</h2>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Everything you need to know about the platform.</p>
                    </div>
                    <div className="space-y-2">
                        {faqs.map((faq, idx) => (
                            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Copy */}
            <footer className="py-20 text-center border-t border-slate-50">
                <p className="text-[9px] font-black text-slate-200 uppercase tracking-[0.6em]">
                    Developed for Excellence • Italostudy Systems 2026
                </p>
            </footer>
        </div>
    );
}
