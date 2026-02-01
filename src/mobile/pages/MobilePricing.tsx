import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, Zap, Sparkles, Brain, ChevronRight, Loader2, X, ShieldCheck, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/hooks/useCurrency';
import { motion, AnimatePresence } from 'framer-motion';

const MobileFAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-100 py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left"
            >
                <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{question}</span>
                {isOpen ? <Minus className="w-4 h-4 text-slate-400" /> : <Plus className="w-4 h-4 text-slate-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pt-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function MobilePricing() {
    const { user, profile, refreshProfile } = useAuth() as any;
    const navigate = useNavigate();
    const { toast } = useToast();
    const { formatPrice } = useCurrency();
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
                description: `Success! Your access level has been updated to ${planId.toUpperCase()}.`,
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
            icon: Brain,
            color: 'bg-slate-100',
            iconColor: 'text-slate-600',
            description: 'Essential daily items.',
            features: ['15 Questions Daily', 'Basic Stats', 'Community Read'],
            excluded: ['Unlimited Practice', 'Full Simulations', 'Admission Help'],
            cta: 'Start Free'
        },
        {
            id: 'pro',
            name: 'Exam Prep Plan',
            price: 5,
            icon: Zap,
            color: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
            badge: 'BETA UNLOCKED',
            description: 'Full exam preparation.',
            features: ['Unlimited Practice', 'Full Simulations', 'All Modules', 'Analytics'],
            excluded: ['Visa Guidance', 'Admission Help', 'University Shortlisting'],
            cta: 'Try Beta Free',
            isPopular: true
        },
        {
            id: 'elite',
            name: 'Global Admission Plan',
            price: 10,
            icon: Sparkles,
            color: 'bg-amber-50',
            iconColor: 'text-amber-600',
            badge: 'ADMISSION PLUS',
            description: 'Support to enrollment.',
            features: ['Everything in Pro', 'Visa Guidance', 'Admission Help', 'Shortlisting'],
            excluded: [],
            cta: 'Try Beta Free'
        }
    ];

    const faqs = [
        {
            question: "Is ItaloStudy free during Beta?",
            answer: "Yes! Every single premium feature is completely free while we are in our beta testing phase."
        },
        {
            question: "How do I upgrade later?",
            answer: "You can change your plan at any time from your settings panel. During Beta, upgrades are instant."
        },
        {
            question: "What exams are supported?",
            answer: "We support IMAT, SAT, CEnT-S, and IELTS preparation globally."
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-32">
            {/* Native-Feel Header */}
            <div className="bg-[#030014] px-6 pt-16 pb-12 border-b border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/10 blur-[60px] rounded-full" />

                <div className="flex items-center justify-between relative z-10 mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 -ml-2 text-white/50 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src="/logo.png"
                            alt="Italostudy Logo"
                            className="h-8 w-auto object-contain brightness-0 invert"
                            width="140"
                            height="32"
                            loading="eager"
                        />
                    </Link>
                    <div className="w-10"></div> {/* Spacer */}
                </div>

                <div className="relative z-10 text-center">
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white leading-none">Upgrade Plan</h1>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-3 leading-none">Choose your path to success</p>
                </div>
            </div>

            <main className="px-6 -mt-10 space-y-6 relative z-10">
                {/* Tier Cards (Mobile) */}
                <div className="space-y-4">
                    {tiers.map((t, i) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="h-full flex flex-col"
                        >
                            <Card className={`rounded-[2.5rem] border-slate-100 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all flex-1 flex flex-col ${t.isPopular ? 'border-2 border-blue-600 shadow-blue-500/5' : ''}`}>
                                {t.isPopular && (
                                    <div className="bg-blue-600 py-2 text-center shrink-0">
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest flex items-center justify-center gap-2">
                                            Most popular <Zap className="w-2.5 h-2.5 fill-white" />
                                        </span>
                                    </div>
                                )}
                                <CardContent className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.color}`}>
                                                <t.icon className={`w-6 h-6 ${t.iconColor}`} />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white leading-none">{t.name}</h3>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6 ml-[3.75rem]">
                                        <div className="flex items-center gap-2">
                                            {t.price > 0 ? (
                                                <>
                                                    <span className="text-xl font-black text-emerald-500 italic">FREE</span>
                                                    <span className="text-sm font-bold text-slate-300 line-through tracking-tight">
                                                        {formatPrice(t.price)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-xl font-black text-emerald-500 italic">FREE</span>
                                            )}
                                            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">/ mo</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-8 ml-[3.75rem]">
                                        {t.features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                <span className="text-[10px] font-black uppercase tracking-tight">{f}</span>
                                            </div>
                                        ))}
                                        {t.excluded?.map((f, i) => (
                                            <div key={i} className="flex items-center gap-3 opacity-30 text-slate-400">
                                                <X className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                                <span className="text-[10px] font-black uppercase tracking-tight line-through">{f}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        onClick={() => handlePlanSelect(t.id)}
                                        disabled={isUpdating !== null}
                                        className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center ${t.isPopular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-50 hover:bg-slate-100 text-blue-600'}`}
                                    >
                                        {isUpdating === t.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                {t.cta}
                                                <ChevronRight className={`ml-2 w-4 h-4 ${t.isPopular ? 'text-white' : 'text-blue-600'}`} />
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section (Mobile) */}
                <div className="py-12 px-2 bg-white rounded-[2.5rem] mt-8 shadow-inner border border-slate-50">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">Questions?</h2>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Quick answers about our plans.</p>
                    </div>
                    <div className="space-y-1">
                        {faqs.map((faq, idx) => (
                            <MobileFAQItem key={idx} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>

                <div className="text-center py-6">
                    <p className="text-[8px] font-black text-slate-200 uppercase tracking-[0.5em] leading-relaxed">
                        Educational support • 2026
                    </p>
                </div>
            </main>
        </div>
    );
}
