import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
    Timer,
    ShieldCheck,
    Globe,
    Monitor,
    Lock,
    ChevronRight,
    Info,
    CheckCircle2,
    Loader2,
    Sparkles,
    Zap,
    Users,
    ArrowLeft,
    LogIn
} from 'lucide-react';
import { format, differenceInSeconds } from 'date-fns';
import { EXAMS } from '@/config/exams';
import { motion, AnimatePresence } from 'framer-motion';

interface MockSession {
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    exam_type: string;
    config?: {
        reading_test_id?: string;
        listening_test_id?: string;
        writing_task1_id?: string;
        writing_task2_id?: string;
    };
}

export default function InternationalMockWaitingRoom() {
    const navigate = useNavigate();
    const { sessionId } = useParams();
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [session, setSession] = useState<MockSession | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isLocked, setIsLocked] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isStarting, setIsStarting] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        fetchActiveSession();
    }, [sessionId]);

    useEffect(() => {
        if (user && session) {
            checkRegistration();
        }
    }, [user, session]);

    const checkRegistration = async () => {
        if (!user || !session) return;
        const { data } = await (supabase as any)
            .from('session_registrations')
            .select('id')
            .eq('user_id', user.id)
            .eq('session_id', session.id)
            .maybeSingle();

        setIsRegistered(!!data);
    };

    const handleRegister = async () => {
        if (!user) {
            navigate('/auth');
            return;
        }

        setIsRegistering(true);
        const { error } = await (supabase as any)
            .from('session_registrations')
            .insert({
                user_id: user.id,
                session_id: session?.id
            });

        if (error) {
            toast({
                title: "Registration Failed",
                description: error.message,
                variant: "destructive"
            });
        } else {
            setIsRegistered(true);
            toast({
                title: "Successfully Registered",
                description: "You are now eligible to join this session when it goes live."
            });
        }
        setIsRegistering(false);
    };

    const handleStartTest = async () => {
        if (!session || !user) {
            navigate('/auth', { state: { from: { pathname: window.location.pathname } } });
            return;
        }

        setIsStarting(true);
        try {
            // 1. Mandatory Registration Check
            if (!isRegistered) {
                const { data: regData } = await (supabase as any)
                    .from('session_registrations')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('session_id', session.id)
                    .maybeSingle();

                if (!regData) {
                    toast({
                        title: "Access Denied",
                        description: "You must register for this session before starting.",
                        variant: "destructive"
                    });
                    setIsStarting(false);
                    return;
                }
            }

            // 2. One-Attempt Limit Check
            const { data: existingTests } = await (supabase as any)
                .from('tests')
                .select('id, status')
                .eq('user_id', user.id)
                .eq('session_id', session.id)
                .maybeSingle();

            if (existingTests) {
                if (existingTests.status === 'in_progress') {
                    navigate(`/test/${existingTests.id}`);
                } else {
                    toast({
                        title: "Attempt Limit Reached",
                        description: "You have already completed your one allowed attempt for this session.",
                        variant: "destructive"
                    });
                }
                setIsStarting(false);
                return;
            }

            if (session.exam_type === 'ielts-academic') {
                navigate(`/ielts-flow/${session.id}`);
                setIsStarting(false);
                return;
            }

            // 3. Fetch pre-fed questions for this session
            const { data: sessionQuestions, error: qError } = await (supabase as any)
                .from('session_questions')
                .select('*')
                .eq('session_id', session.id)
                .order('section_name', { ascending: true })
                .order('created_at', { ascending: true });

            if (qError || !sessionQuestions || sessionQuestions.length === 0) {
                toast({
                    title: "Engine Error",
                    description: "No questions have been fed into this session yet. Please contact admin.",
                    variant: "destructive"
                });
                setIsStarting(false);
                return;
            }

            // 4. Create the test record linked to session_id
            const { data: test, error: testError } = await (supabase as any)
                .from('tests')
                .insert({
                    user_id: user.id,
                    session_id: session.id,
                    subject: 'International Mock',
                    difficulty: 'mixed',
                    total_questions: sessionQuestions.length,
                    time_limit_minutes: 100,
                    status: 'in_progress',
                    test_type: 'mock',
                    exam_type: session.exam_type,
                    proctoring_status: 'passed',
                })
                .select()
                .single();

            if (testError) throw testError;

            // 4. Sort and Clone questions
            const examConfig = EXAMS[session.exam_type as keyof typeof EXAMS];
            const sectionOrder = examConfig?.sections.map(s => s.name) || [];

            const sortedSessionQuestions = [...sessionQuestions].sort((a, b) => {
                const getOrder = (name: string) => {
                    const direct = sectionOrder.indexOf(name);
                    if (direct !== -1) return direct;
                    if (session.exam_type === 'imat-prep') {
                        if (/math|physics/i.test(name)) return sectionOrder.indexOf("Physics & Mathematics");
                        if (/biology/i.test(name)) return sectionOrder.indexOf("Biology");
                        if (/chemistry/i.test(name)) return sectionOrder.indexOf("Chemistry");
                        if (/logic|reasoning/i.test(name)) return sectionOrder.indexOf("Logical Reasoning");
                        if (/reading|knowledge/i.test(name)) return sectionOrder.indexOf("Reading Skills & General Knowledge");
                    }
                    if (session.exam_type === 'cent-s-prep') {
                        if (/math/i.test(name)) return sectionOrder.indexOf("Mathematics");
                        if (/logic|reading|reasoning/i.test(name)) return sectionOrder.indexOf("Reasoning on texts and data");
                    }
                    return -1;
                };

                const orderA = getOrder(a.section_name);
                const orderB = getOrder(b.section_name);
                if (orderA !== -1 && orderB !== -1) return orderA - orderB;
                if (orderA !== -1) return -1;
                if (orderB !== -1) return 1;
                return a.section_name.localeCompare(b.section_name);
            });

            const questionsToInsert = sortedSessionQuestions.map((sq: any, idx: number) => ({
                test_id: test.id,
                question_number: idx + 1,
                question_text: sq.question_text,
                options: sq.options,
                correct_index: sq.correct_index,
                explanation: sq.explanation,
                difficulty: 'mixed',
                topic: sq.topic,
                subject: sq.section_name,
                exam_type: session.exam_type,
            }));

            const { error: insertError } = await (supabase as any)
                .from('questions')
                .insert(questionsToInsert);

            if (insertError) throw insertError;

            toast({
                title: "Launch Sequence Complete",
                description: "Good luck with your examination."
            });

            navigate(`/test/${test.id}`);
        } catch (error: any) {
            console.error("Start Test Error:", error);
            toast({
                title: "Launch Failed",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsStarting(false);
        }
    };

    const fetchActiveSession = async () => {
        setIsLoading(true);
        const { data } = await (supabase as any)
            .from('mock_sessions')
            .select('*')
            .eq('id', sessionId)
            .single();

        if (data) {
            setSession(data);
            calculateTimeLeft(data.start_time);
        } else {
            toast({
                title: "Session Not Found",
                description: "The requested mock session could not be located.",
                variant: "destructive"
            });
        }
        setIsLoading(false);
    };

    const calculateTimeLeft = (startTime: string) => {
        const start = new Date(startTime);
        const now = new Date();
        const diff = differenceInSeconds(start, now);

        if (diff <= 0) {
            setTimeLeft(0);
            setIsLocked(false);
        } else {
            setTimeLeft(diff);
            setIsLocked(true);
        }
    };

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsLocked(false);
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        const pad = (n: number) => n.toString().padStart(2, '0');

        if (d > 0) return `${d}D ${pad(h)}H ${pad(m)}M ${pad(s)}S`;
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    };

    if (isLoading || authLoading) {
        return (
            <div className="min-h-screen bg-[#030014] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) {
        return (
            <Layout>
                <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center text-destructive mb-6">
                        <Info className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black mb-4 tracking-tighter">Session Missing</h1>
                    <p className="text-muted-foreground text-lg mb-8 max-w-md">The simulation room you're looking for doesn't exist or has been archived.</p>
                    <Button onClick={() => navigate('/dashboard')} className="rounded-full px-8 py-6 h-auto font-black uppercase text-xs tracking-widest bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20">Return Home</Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout showHeader={!!user} showFooter={!!user}>
            <div className="min-h-screen bg-slate-50 relative overflow-x-hidden flex flex-col items-center py-10 md:py-16 px-4 selection:bg-indigo-600 selection:text-white">
                {/* Visual Background Elements - More spatial and subtle */}
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-indigo-600/5 blur-[160px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/5 blur-[140px] rounded-full pointer-events-none" />

                {/* Content Container */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-5xl relative z-10 flex flex-col items-center"
                >
                    {/* Minimal Branding */}
                    <div className="flex flex-col items-center mb-10 space-y-3">
                        <Link to="/">
                            <img src="/logo.png" alt="ItaloStudy" className="h-8 w-auto object-contain opacity-90" />
                        </Link>
                        {!user && (
                            <div className="flex items-center gap-2 py-1 px-3 bg-indigo-50 border border-indigo-100 rounded-full">
                                <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                                <span className="text-[9px] font-black text-indigo-600/60 uppercase tracking-[0.2em]">Simulation Engine v4</span>
                            </div>
                        )}
                    </div>

                    {/* Main Command Card - Light & Spatial */}
                    <div className="w-full bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden group">
                        {/* Interactive Sparkle Elements */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

                        <div className="flex flex-col items-center text-center">
                            {/* Mission Badge */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-5 py-1.5 bg-indigo-500/5 border border-indigo-500/10 rounded-full mb-8"
                            >
                                <Sparkles className="w-3 h-3 text-indigo-500" />
                                <span className="text-[8px] font-black text-indigo-600/70 uppercase tracking-[0.3em]">{session.exam_type.replace('-prep', '').toUpperCase()} PROTOCOL</span>
                            </motion.div>

                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
                                {session.title}
                            </h1>

                            <p className="text-slate-500 text-sm md:text-base font-medium max-w-xl mx-auto mb-10 leading-relaxed">
                                {session.description}
                            </p>

                            {/* Timer Block */}
                            <div className="relative mb-14">
                                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.4em] block mb-4">T-Minus to Launch</span>

                                <div className="text-6xl md:text-8xl font-black text-indigo-600 tracking-tighter font-mono tabular-nums leading-none select-none">
                                    {timeLeft > 0 ? formatTime(timeLeft) : '00:00:00'}
                                </div>

                                {!isLocked && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 inline-flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]" />
                                        Authorization Granted
                                    </motion.div>
                                )}
                            </div>

                            {/* Info Tiles - Compact Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl mb-14">
                                {[
                                    { icon: Users, label: 'Access', value: 'GLOBAL' },
                                    { icon: ShieldCheck, label: 'Standard', value: 'OFFICIAL' },
                                    { icon: Lock, label: 'Encryption', value: 'AES-256' },
                                    { icon: Monitor, label: 'Compatible', value: 'WEB-PC' }
                                ].map((stat, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-2 hover:bg-slate-100/50 transition-all">
                                        <stat.icon className="w-4 h-4 text-indigo-500" />
                                        <div className="flex flex-col">
                                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                                            <span className="text-[10px] font-black text-slate-900">{stat.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Action Button - Balanced Sizing */}
                            <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                                {!user ? (
                                    <Button
                                        onClick={() => navigate('/auth', { state: { from: { pathname: window.location.pathname } } })}
                                        className="w-full h-16 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <LogIn className="w-3.5 h-3.5 mr-2.5" />
                                        Sign in to Access
                                    </Button>
                                ) : !isRegistered ? (
                                    <Button
                                        onClick={handleRegister}
                                        disabled={isRegistering}
                                        className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-indigo-600/10 border-b-[4px] border-indigo-800 active:border-b-0 active:translate-y-[1px] transition-all disabled:opacity-50"
                                    >
                                        {isRegistering ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Zap className="w-4 h-4 mr-2.5 fill-white" />
                                                Register For Protocol
                                            </>
                                        )}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleStartTest}
                                        disabled={isLocked || isStarting}
                                        className={cn(
                                            "w-full h-16 rounded-[20rem] font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3",
                                            isLocked
                                                ? "bg-slate-50 text-slate-500 border border-slate-300/50 cursor-not-allowed"
                                                : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
                                        )}
                                    >
                                        {isStarting ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : isLocked ? (
                                            <>
                                                <Lock className="w-3.5 h-3.5 text-slate-400" />
                                                Locked Until Start
                                            </>
                                        ) : (
                                            <>
                                                <span>Enter Hall</span>
                                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                )}

                                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-[0.1em] leading-relaxed max-w-xs">
                                    {isLocked
                                        ? "Module sequence is active. Entry authorization at T-0."
                                        : "Personnel authorization complete. Environment synchronized."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Technical Footer */}
                    <div className="mt-16 w-full max-w-3xl flex justify-between items-center px-6 border-t border-slate-100 pt-10 opacity-60 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-4">
                            <ShieldCheck className="w-5 h-5 text-indigo-500" />
                            <div className="text-left">
                                <p className="text-[9px] font-black text-slate-900 uppercase tracking-wider">Secure Protocol</p>
                                <p className="text-[7px] font-bold text-slate-400 tracking-tight">ENCRYPTED CONNECTION v4</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em] block">ID: #SYS-IM-{session.id.slice(0, 8).toUpperCase()}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
