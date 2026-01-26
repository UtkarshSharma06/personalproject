import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
    Brain, Zap, Target, ArrowRight,
    Sparkles, Rocket, Shield, Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileIndex() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        const checkMode = async () => {
            if (loading) return;

            // If already logged in, we let the main router/dashboard redirect handle it (or do it here)
            // But usually App.tsx or protected routes handle auth -> dashboard.
            // If we are here at '/', it means not redirected yet.

            if (user) {
                navigate('/mobile/dashboard', { replace: true });
                return;
            }

            // Check if Native App
            try {
                const { Device } = await import('@capacitor/device');
                const info = await Device.getInfo();
                if (info.platform === 'android' || info.platform === 'ios') {
                    // Native App: Skip Landing Page, go strictly to Auth
                    navigate('/auth', { replace: true });
                }
            } catch (e) {
                // Ignore, assume web
            }
        };
        checkMode();
    }, [user, loading, navigate]);

    const features = [
        { icon: Zap, title: "Adaptive Feed", desc: "AI-driven curriculum gaps identification.", color: 'bg-amber-500' },
        { icon: Target, title: "Mock Engine", desc: "Live simulations with global rankings.", color: 'bg-indigo-600' },
        { icon: Brain, title: "Labs 3D", desc: "Interactive visualization for tech modules.", color: 'bg-emerald-500' }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#030014] text-white overflow-x-hidden font-sans pb-20">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[60%] bg-indigo-600/10 blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-full h-[40%] bg-violet-600/10 blur-[100px]" />
            </div>

            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center text-center p-8 pt-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md"
                >
                    <Sparkles size={14} className="text-cyan-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Next-Gen Prep Matrix</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl font-black tracking-tighter leading-[0.9] mb-6 uppercase"
                >
                    Mastery <br /> <span className="text-primary">Simulated.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm font-bold text-white/40 uppercase tracking-tight leading-relaxed max-w-xs mx-auto mb-10"
                >
                    The #1 adaptive ecosystem for IMAT, SAT, and IELTS prep. Achieve global success with data-driven training.
                </motion.p>

                <div className="w-full space-y-4">
                    <Button
                        onClick={() => navigate('/auth')}
                        className="w-full h-18 rounded-[2rem] bg-primary text-white font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(99,102,241,0.3)] border-none active:scale-95 transition-all"
                    >
                        Initialize Account
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/institutional')}
                        className="w-full h-16 rounded-[2rem] border border-white/10 text-white/60 font-black text-[10px] uppercase tracking-widest active:bg-white/5"
                    >
                        Institutional Gateway <ArrowRight size={14} className="ml-2" />
                    </Button>
                </div>
            </section>

            {/* Feature Stream */}
            <section className="px-8 space-y-4 relative z-10 mt-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 px-2">Core Protocols</h3>
                {features.map((f, i) => (
                    <div key={i} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md transition-all active:scale-[0.98]">
                        <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                            <f.icon className="text-white w-6 h-6" />
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tight mb-2">{f.title}</h4>
                        <p className="text-[11px] font-bold text-white/40 uppercase leading-relaxed">{f.desc}</p>
                    </div>
                ))}
            </section>

            {/* Footer Pride */}
            <footer className="mt-20 px-8 text-center opacity-20">
                <p className="text-[8px] font-black uppercase tracking-[0.5em]">Italostudy Systems © 2026</p>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] mt-2">Verified Academic Excellence</p>
            </footer>
        </div>
    );
}
