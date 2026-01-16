import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, Rocket, Zap, ShieldCheck } from "lucide-react";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    feature?: string;
}

export function UpgradeModal({
    isOpen,
    onClose,
    title = "Upgrade to unlock full access",
    description = "You've reached the limit for your current plan. Upgrade to continue your preparation without boundaries.",
    feature
}: UpgradeModalProps) {
    const navigate = useNavigate();

    const handleUpgrade = () => {
        onClose();
        navigate('/onboarding?step=2'); // Redirect to plan selection
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none bg-white dark:bg-card rounded-[2.5rem]">
                <div className="relative">
                    {/* Visual Header */}
                    <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-10 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/20">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none mb-2">Neural Upgrade</h2>
                            <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.3em]">Italostudy Premium Protocol</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-10">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-bold text-sm leading-relaxed pt-2">
                                {description}
                                {feature && (
                                    <span className="block mt-4 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 text-indigo-600 text-xs text-center uppercase tracking-widest font-black">
                                        Locked Feature: {feature}
                                    </span>
                                )}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 mb-8">
                            {[
                                "Unlimited practice questions",
                                "Deep Logic AI explanations",
                                "Official full-length simulations",
                                "Priority university support"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-slate-600">
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
                                        <Check className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                    <span className="text-xs font-bold">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={handleUpgrade}
                                className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all group"
                            >
                                <Zap className="w-4 h-4 mr-2 fill-white group-hover:scale-110 transition-transform" />
                                Upgrade My Plan
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                className="w-full h-12 text-slate-400 hover:text-slate-600 font-black text-[9px] uppercase tracking-widest"
                            >
                                Maybe Later
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
