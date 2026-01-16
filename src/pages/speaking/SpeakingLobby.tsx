import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Loader2, Users, Mic, Video, ShieldCheck, ArrowRight, Zap, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function SpeakingLobby() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSearching, setIsSearching] = useState(false);
    const [searchTime, setSearchTime] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSearching) {
            interval = setInterval(() => setSearchTime(prev => prev + 1), 1000);
        } else {
            setSearchTime(0);
        }
        return () => clearInterval(interval);
    }, [isSearching]);

    useEffect(() => {
        if (!isSearching || !user) return;

        const channel = supabase
            .channel('speaking_matchmaking')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'speaking_sessions',
                filter: `interviewer_id=eq.${user.id}`,
            }, handleMatch)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'speaking_sessions',
                filter: `candidate_id=eq.${user.id}`,
            }, handleMatch)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isSearching, user]);

    const handleMatch = (payload: any) => {
        setIsSearching(false);
        toast({ title: 'Matching Successful', description: 'Initializing secure uplink...' });
        navigate(`/speaking/${payload.new.id}`);
    };

    const handleFindPartner = async () => {
        if (!user) return;
        setIsSearching(true);
        try {
            await supabase.from('speaking_queue').upsert({
                user_id: user.id,
                exam_id: 'ielts-academic'
            }, { onConflict: 'user_id' });
            await attemptMatchmake();
        } catch (error: any) {
            toast({ title: 'Uplink Error', description: error.message, variant: 'destructive' });
            setIsSearching(false);
        }
    };

    const attemptMatchmake = async () => {
        if (!user) return;
        const { data: others } = await supabase
            .from('speaking_queue')
            .select('*')
            .neq('user_id', user.id)
            .order('created_at', { ascending: true })
            .limit(1);

        if (others && others.length > 0) {
            const partner = others[0];
            const { data: session, error } = await supabase
                .from('speaking_sessions')
                .insert({ interviewer_id: user.id, candidate_id: partner.user_id })
                .select()
                .single();

            if (!error && session) {
                await supabase.from('speaking_queue').delete().in('user_id', [user.id, partner.user_id]);
                navigate(`/speaking/${session.id}`);
            }
        }
    };

    const handleCancel = async () => {
        if (!user) return;
        setIsSearching(false);
        await supabase.from('speaking_queue').delete().eq('user_id', user.id);
    };

    return (
        <Layout showFooter={false}>
            <div className="min-h-[calc(100vh-4.5rem)] flex flex-col items-center justify-center bg-[#020617] relative overflow-hidden selection:bg-indigo-500/30">
                {/* Immersive Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-600/10 rounded-full blur-[150px] opacity-50" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 mix-blend-overlay" />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"
                    />
                </div>

                <div className="container max-w-6xl px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Left side: Hero Info */}
                    <div className="flex-1 space-y-10 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full"
                        >
                            <Globe className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Neural Matchmaking P2P</span>
                        </motion.div>

                        <div className="space-y-6">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase"
                            >
                                SPEAKING <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 italic">ARENA.</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl text-slate-400 font-bold max-w-xl mx-auto lg:mx-0 leading-relaxed tracking-tight"
                            >
                                Connect with peer scholars worldwide for immersive IELTS simulation. Master the art of articulation through collaborative evaluation.
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                            {[
                                { label: 'PEER GRADING', value: 'IELTS Rubric' },
                                { label: 'ZERO LATENCY', value: 'WebRTC Uplink' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + (i * 0.1) }}
                                    className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
                                >
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-sm font-black text-white">{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right side: Action Card */}
                    <div className="w-full max-w-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", damping: 20 }}
                            className="relative"
                        >
                            {/* Card Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />

                            <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] shadow-2xl space-y-10">
                                <AnimatePresence mode="wait">
                                    {isSearching ? (
                                        <motion.div
                                            key="searching"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.1 }}
                                            className="flex flex-col items-center justify-center space-y-10 py-4"
                                        >
                                            <div className="relative">
                                                <motion.div
                                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl"
                                                />
                                                <div className="relative w-24 h-24 rounded-full border-2 border-indigo-500/30 flex items-center justify-center">
                                                    <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                                                </div>
                                            </div>

                                            <div className="text-center space-y-3">
                                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Scanning for Peers</h3>
                                                <div className="flex flex-col items-center gap-1">
                                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Active Duration: {searchTime}s</p>
                                                    <div className="flex gap-1 mt-2">
                                                        {[0, 1, 2].map(i => (
                                                            <motion.div
                                                                key={i}
                                                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                                                className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                onClick={handleCancel}
                                                className="text-slate-500 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-2xl transition-all"
                                            >
                                                Abort Uplink
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="lobby"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.1 }}
                                            className="space-y-10"
                                        >
                                            <div className="flex justify-center">
                                                <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center border border-indigo-500/20">
                                                    <Zap className="w-10 h-10 text-indigo-400" />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <Button
                                                    onClick={handleFindPartner}
                                                    className="w-full h-18 bg-white text-slate-900 hover:bg-slate-100 font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-black/20 group transition-all"
                                                >
                                                    <span className="flex items-center gap-3">
                                                        Enter Arena
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    onClick={() => navigate('/speaking/history')}
                                                    className="w-full h-14 text-slate-400 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all"
                                                >
                                                    View Mission Logs
                                                </Button>
                                            </div>

                                            <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                    Uplink Active
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-3 h-3" />
                                                    Secure P2P
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
