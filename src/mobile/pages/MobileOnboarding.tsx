import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useExam } from '@/context/ExamContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
    Check, ArrowRight, Brain, Globe,
    GraduationCap, Target, Sparkles, Zap, ChevronLeft
} from 'lucide-react';

const exams = [
    { id: 'imat-prep', name: 'IMAT', fullName: 'Medicine Admission', icon: Target, color: 'bg-violet-600' },
    { id: 'sat-prep', name: 'SAT', fullName: 'US Undergrad', icon: GraduationCap, color: 'bg-cyan-600' },
    { id: 'ielts-academic', name: 'IELTS', fullName: 'English Mastery', icon: Globe, color: 'bg-indigo-600' },
    { id: 'cent-s-prep', name: 'CEnT-S', fullName: 'Tech Science', icon: Brain, color: 'bg-slate-800' }
];

const plans = [
    {
        id: 'explorer',
        name: 'Explorer Plan',
        price: 'FREE',
        icon: Brain,
        color: 'bg-slate-500',
        features: ['15 Questions Daily', 'Basic Stats', 'Community Access']
    },
    {
        id: 'pro',
        name: 'Exam Prep Plan',
        price: 'BETA €0',
        icon: Zap,
        color: 'bg-indigo-600',
        features: ['Unlimited Practice', 'Full Simulations', 'AI Explanations', 'All Lectures']
    },
    {
        id: 'elite',
        name: 'Global Admission Plan',
        price: 'BETA €0',
        icon: Sparkles,
        color: 'bg-amber-500',
        features: ['Everything in Pro', 'Admission Support', 'Visa Guidance', 'University Shortlist']
    }
];

export default function MobileOnboarding() {
    const { user, profile, refreshProfile } = useAuth() as any;
    const { setActiveExam } = useExam();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [selectedExam, setSelectedExam] = useState<string | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (profile?.selected_exam && profile?.selected_plan) {
            navigate('/mobile/dashboard');
            return;
        }
        if (profile?.selected_exam) setStep(2);
    }, [profile, navigate]);

    const handleConfirm = async () => {
        if (!selectedExam || !selectedPlan || !user) return;
        setIsSubmitting(true);
        try {
            const tierMap: any = { 'explorer': 'initiate', 'pro': 'elite', 'elite': 'global' };
            const { error } = await supabase.from('profiles').update({
                selected_exam: selectedExam,
                selected_plan: selectedPlan,
                subscription_tier: tierMap[selectedPlan] || 'initiate'
            }).eq('id', user.id);
            if (error) throw error;
            await refreshProfile();
            await setActiveExam(selectedExam);
            toast({ title: "Protocol Armed", description: "Your journey begins now." });
            navigate('/dashboard');
        } catch (e: any) {
            toast({ title: "Setup Failed", description: e.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background p-6 pb-12 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {step === 1 ? (
                <div className="flex-1 flex flex-col pt-10">
                    <header className="mb-10 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                            <GraduationCap className="text-primary w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight uppercase">Choose <span className="text-primary">Path</span></h1>
                        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground opacity-50 mt-2">Protocol Identification</p>
                    </header>

                    <div className="space-y-4 flex-1">
                        {exams.map((e) => (
                            <button
                                key={e.id}
                                onClick={() => setSelectedExam(e.id)}
                                className={`w-full flex items-center gap-4 p-5 rounded-[2.5rem] border-2 transition-all active:scale-95 ${selectedExam === e.id ? 'border-primary bg-primary/5' : 'border-border/50 bg-secondary/20'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${e.color}`}>
                                    <e.icon className="text-white w-6 h-6" />
                                </div>
                                <div className="text-left flex-1">
                                    <h3 className="font-black text-lg leading-none uppercase">{e.name}</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{e.fullName}</p>
                                </div>
                                {selectedExam === e.id && <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"><Check className="text-white w-4 h-4" /></div>}
                            </button>
                        ))}
                    </div>

                    <Button
                        disabled={!selectedExam}
                        onClick={() => setStep(2)}
                        className="mt-8 h-16 rounded-[2rem] bg-foreground text-background font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
                    >
                        Continue <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            ) : (
                <div className="flex-1 flex flex-col pt-10">
                    <header className="mb-8 text-center relative">
                        <button onClick={() => setStep(1)} className="absolute left-0 top-0 p-2 text-muted-foreground"><ChevronLeft /></button>
                        <h1 className="text-4xl font-black tracking-tight uppercase">Select <span className="text-primary">Access</span></h1>
                        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground opacity-50 mt-2">Resource Allocation</p>
                    </header>

                    <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar pb-6">
                        {plans.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedPlan(p.id)}
                                className={`w-full p-6 rounded-[2.5rem] border-2 transition-all active:scale-98 text-left relative overflow-hidden ${selectedPlan === p.id ? 'border-primary bg-primary/5' : 'border-border/50 bg-secondary/20'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.color}`}>
                                            <p.icon className="text-white w-5 h-5" />
                                        </div>
                                        <h3 className="font-black text-xl uppercase leading-none">{p.name}</h3>
                                    </div>
                                    <span className="text-primary font-black text-xs">{p.price}</span>
                                </div>
                                <div className="space-y-2">
                                    {p.features.map((f, i) => (
                                        <div key={i} className="flex items-center gap-2 opacity-70">
                                            <Check className="w-3 h-3 text-primary" />
                                            <span className="text-[10px] font-bold uppercase">{f}</span>
                                        </div>
                                    ))}
                                </div>
                                {selectedPlan === p.id && <div className="absolute top-4 right-4"><Check className="text-primary" /></div>}
                            </button>
                        ))}
                    </div>

                    <Button
                        disabled={!selectedPlan || isSubmitting}
                        onClick={handleConfirm}
                        className="h-16 rounded-[2rem] bg-primary text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 active:scale-95 transition-all"
                    >
                        {isSubmitting ? 'Armed...' : 'Begin Protocol'}
                    </Button>
                </div>
            )}
        </div>
    );
}
