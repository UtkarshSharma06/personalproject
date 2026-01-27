import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useExam } from '@/context/ExamContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, X, ArrowRight, Brain, Globe, GraduationCap, Target, Zap, Sparkles } from 'lucide-react';

const exams = [
    {
        id: 'imat-prep',
        name: 'IMAT',
        fullName: 'International Medical Admissions Test',
        icon: Target,
        color: 'from-violet-500 to-indigo-600',
        label: 'Medical'
    },
    {
        id: 'sat-prep',
        name: 'SAT',
        fullName: 'Scholastic Aptitude Test',
        icon: GraduationCap,
        color: 'from-cyan-500 to-blue-600',
        label: 'Undergrad'
    },
    {
        id: 'ielts-academic',
        name: 'IELTS',
        fullName: 'English Language Protocol',
        icon: Globe,
        color: 'from-indigo-500 to-purple-600',
        label: 'Proficiency'
    },
    {
        id: 'cent-s-prep',
        name: 'CEnT-S',
        fullName: 'Technical & Industrial Science',
        icon: Brain,
        color: 'from-slate-700 to-slate-900',
        label: 'Technical'
    }
];

const plans = [
    {
        id: 'explorer',
        name: 'Explorer Plan',
        price: '€0',
        description: 'Build your study habit with essential daily practice.',
        icon: Brain,
        color: 'from-slate-400 to-slate-600',
        features: ['10-15 Questions Daily', 'Basic Performance Stats', 'Sample Intro Videos', 'Read-only Community'],
        limitations: ['No Mock Exams', 'No Full Lectures', 'Correct/Incorrect Only']
    },
    {
        id: 'pro',
        name: 'Exam Prep Plan',
        price: '€0',
        description: 'Everything you need to crack the exam with confidence.',
        icon: Zap,
        color: 'from-indigo-500 to-violet-600',
        badge: 'BETA SPECIAL',
        features: ['Unlimited Practice Exams', 'Detailed Explanations', 'Full Learning Section', 'Mock Simulations', 'Community Discussion', 'Exam Analytics']
    },
    {
        id: 'elite',
        name: 'Global Admission Plan',
        price: '€0',
        description: 'Complete support from preparation to university admission.',
        icon: Sparkles,
        color: 'from-amber-500 to-orange-600',
        badge: 'BETA SPECIAL',
        features: ['Everything in PRO', 'Advanced Simulations', 'Priority Community Access', 'University Shortlisting', 'Visa Process Guidance', 'Elite Badge']
    }
];

export default function Onboarding() {
    const { user, profile, refreshProfile } = useAuth();
    const { setActiveExam } = useExam();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState(1); // 1: Exam, 2: Plan
    const [selectedExam, setSelectedExam] = useState<string | null>(profile?.selected_exam || null);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(profile?.selected_plan || null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If profile already complete, we can pre-set step 2 if they have exam but no plan
    useEffect(() => {
        if (profile?.selected_exam && profile?.selected_plan) {
            navigate('/dashboard');
            return;
        }
        if (profile?.selected_exam) {
            setStep(2);
        }
    }, [profile, navigate]);

    const handleNextStep = () => {
        if (selectedExam) setStep(2);
    };

    const handleConfirm = async () => {
        if (!selectedExam || !selectedPlan || !user) return;

        setIsSubmitting(true);
        // Initiating plan update

        try {
            // Map plan ID to subscription tier
            const tierMap: Record<string, string> = {
                'explorer': 'initiate',
                'pro': 'elite',
                'elite': 'global'
            };

            const targetTier = tierMap[selectedPlan] || 'initiate';
            // targetTier identified

            // Update profile with both exam and plan
            const { error } = await supabase
                .from('profiles')
                .update({
                    selected_exam: selectedExam,
                    selected_plan: selectedPlan,
                    subscription_tier: targetTier
                })
                .eq('id', user.id);

            if (error) {
                console.error('Database update failed:', error);
                throw error;
            }

            // Database update successful

            // 1. Refresh the central profile state first
            await refreshProfile();
            // Profile refreshed

            // 2. Immediately sync local context to prevent redirect loop/mismatch
            await setActiveExam(selectedExam);

            toast({
                title: "Protocol Initialized",
                description: `Successfully configured for ${selectedPlan.toUpperCase()} access.`,
            });

            // 3. Check for pending redirect from waiting room
            const pendingRedirect = sessionStorage.getItem('onboarding_redirect');
            if (pendingRedirect) {
                sessionStorage.removeItem('onboarding_redirect');
                navigate(pendingRedirect);
            } else {
                navigate('/dashboard');
            }
        } catch (error: any) {
            toast({
                title: "Setup Failed",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#020617] flex flex-col items-center justify-center p-6 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-5xl space-y-12">
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-12"
                        >
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full">
                                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                                    <span className="text-[10px] font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest">Step 1: Choose Your Path</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                                    SELECT YOUR <span className="text-indigo-600">EXAM.</span>
                                </h1>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {exams.map((exam, i) => (
                                    <motion.div
                                        key={exam.id}
                                        onClick={() => setSelectedExam(exam.id)}
                                        className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-300 cursor-pointer group
                                            ${selectedExam === exam.id
                                                ? 'bg-white dark:bg-slate-900 border-indigo-600 shadow-2xl -translate-y-2'
                                                : 'bg-white/50 dark:bg-white/5 border-slate-100 dark:border-white/10 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${exam.color} flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110`}>
                                            <exam.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-2">{exam.name}</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{exam.fullName}</p>
                                        {selectedExam === exam.id && (
                                            <div className="absolute top-6 right-6 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                                                <Check className="w-3.5 h-3.5 text-white" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex justify-center pt-8">
                                <Button
                                    disabled={!selectedExam}
                                    onClick={handleNextStep}
                                    className="h-16 px-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm uppercase tracking-[0.2em] transition-all"
                                >
                                    Continue to Plans
                                    <ArrowRight className="w-4 h-4 ml-3" />
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full">
                                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                    <span className="text-[10px] font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest">Step 2: Access Tier</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                                    CHOOSE YOUR <span className="text-indigo-600">PLAN.</span>
                                </h1>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                                {plans.map((plan, i) => (
                                    <motion.div
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan.id)}
                                        className={`relative p-8 rounded-[3rem] border-2 transition-all duration-300 cursor-pointer group flex flex-col
                                            ${selectedPlan === plan.id
                                                ? 'bg-white dark:bg-slate-900 border-indigo-600 shadow-2xl -translate-y-2'
                                                : 'bg-white/50 dark:bg-white/5 border-slate-100 dark:border-white/10 hover:border-slate-300'
                                            }`}
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

                                        <div className="space-y-3 flex-1">
                                            {plan.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-2">
                                                    <div className="mt-1 w-3.5 h-3.5 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                                                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-900 dark:text-slate-200 uppercase tracking-tighter leading-tight">{feature}</span>
                                                </div>
                                            ))}
                                            {(plan as any).limitations?.map((limit: string, idx: number) => (
                                                <div key={idx} className="flex items-start gap-2 opacity-40">
                                                    <div className="mt-1 w-3.5 h-3.5 bg-rose-500/10 rounded-full flex items-center justify-center shrink-0">
                                                        <X className="w-2.5 h-2.5 text-rose-600" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-tight line-through">{limit}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {selectedPlan === plan.id && (
                                            <div className="absolute top-6 right-6 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex flex-col items-center gap-4 pt-8">
                                <Button
                                    disabled={!selectedPlan || isSubmitting}
                                    onClick={handleConfirm}
                                    className="h-16 px-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm uppercase tracking-[0.2em] transition-all w-full md:w-auto"
                                >
                                    {isSubmitting ? 'Configuring Mission...' : 'Begin Preparation'}
                                </Button>
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
                                >
                                    Change Exam
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
