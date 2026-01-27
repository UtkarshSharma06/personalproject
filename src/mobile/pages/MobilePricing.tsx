import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Zap, Sparkles, Brain, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function MobilePricing() {
    const { user, profile, refreshProfile } = useAuth() as any;
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const handlePlanSelect = async (planId: string) => {
        if (!user) {
            navigate('/auth');
            return;
        }

        // Only show onboarding if user hasn't selected an exam yet (first time)
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
                description: `You now have full access to the ${planId.toUpperCase()} tier features.`,
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
            icon: Brain,
            color: 'bg-slate-500',
            features: ['15 Questions Daily', 'Basic Stats', 'Community Access'],
            cta: 'Start Free'
        },
        {
            id: 'pro',
            name: 'Exam Prep Plan',
            icon: Zap,
            color: 'bg-indigo-600',
            badge: 'BETA UNLOCKED',
            features: ['Unlimited Practice', 'Full Simulations', 'All Lectures', 'AI Feedback'],
            cta: 'Try Beta Free'
        },
        {
            id: 'elite',
            name: 'Global Admission Plan',
            icon: Sparkles,
            color: 'bg-amber-500',
            badge: 'ADMISSION PLUS',
            features: ['Everything in Pro', 'Visa Guidance', 'Admission Support', 'University Shortlist'],
            cta: 'Try Beta Free'
        }
    ];

    return (
        <div className="flex flex-col min-h-full bg-background pb-32 animate-in fade-in duration-500">
            {/* Native App Header */}
            <div className="bg-primary p-10 pt-16 rounded-b-[4rem] text-white space-y-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Sparkles size={120} /></div>
                <div className="relative z-10 text-center">
                    <h1 className="text-4xl font-black uppercase tracking-tight">Premium <span className="text-white/60">Plans</span></h1>
                    <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-70 mt-2">Unlock your full potential</p>
                </div>
            </div>

            <main className="px-6 -mt-8 space-y-6 relative z-10">
                {/* Hero Note */}
                <div className="bg-card border border-border/50 p-5 rounded-[2rem] flex items-center gap-4 shadow-xl">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0">
                        <Zap className="text-emerald-500 w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-tight leading-tight">Beta Exclusive Notice</p>
                        <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">All plans are currently free for testing.</p>
                    </div>
                </div>

                {/* Tier Cards */}
                <div className="space-y-4">
                    {tiers.map((t) => (
                        <Card key={t.id} className="rounded-[2.5rem] border-border/40 overflow-hidden bg-secondary/10 shadow-sm border-b-4 active:scale-[0.98] transition-all">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.color}`}>
                                            <t.icon className="text-white w-6 h-6" />
                                        </div>
                                        <h3 className="font-black text-xl uppercase">{t.name}</h3>
                                    </div>
                                    {t.badge && <span className="bg-primary text-white text-[8px] font-black py-1 px-3 rounded-full uppercase tracking-widest">{t.badge}</span>}
                                </div>

                                <div className="space-y-3 mb-8">
                                    {t.features.map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 text-muted-foreground">
                                            <Check className="w-4 h-4 text-primary" />
                                            <span className="text-[11px] font-black uppercase tracking-tight">{f}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={() => handlePlanSelect(t.id)}
                                    disabled={isUpdating !== null}
                                    className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-black text-xs uppercase tracking-widest shadow-xl"
                                >
                                    {isUpdating === t.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <>
                                            {t.cta}
                                            <ChevronRight className="ml-2 w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
