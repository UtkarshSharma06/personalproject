import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
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
    Loader2
} from 'lucide-react';
import { format, differenceInSeconds } from 'date-fns';
import { EXAMS } from '@/config/exams';

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
    const { user } = useAuth();
    const { toast } = useToast();
    const [session, setSession] = useState<MockSession | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isLocked, setIsLocked] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isStarting, setIsStarting] = useState(false);

    useEffect(() => {
        fetchActiveSession();
    }, []);

    const handleStartTest = async () => {
        if (!session || !user) return;

        setIsStarting(true);
        try {
            // 1. Mandatory Registration Check
            const { data: regData } = await (supabase as any)
                .from('session_registrations')
                .select('id')
                .eq('user_id', user.id)
                .eq('session_id', session.id)
                .maybeSingle();

            if (!regData) {
                toast({
                    title: "Access Denied",
                    description: "You must register for this session on the dashboard before starting.",
                    variant: "destructive"
                });
                setIsStarting(false);
                return;
            }

            // 2. One-Attempt Limit Check
            const { data: existingTests, error: checkError } = await (supabase as any)
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
                    session_id: session.id, // Linking to session
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

            // 4. Sort and Clone questions into the main questions table
            // Get official section order for this exam type
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
        const { data, error } = await (supabase as any)
            .from('mock_sessions')
            .select('*')
            .eq('id', sessionId)
            .single();

        if (data) {
            setSession(data);
            calculateTimeLeft(data.start_time);
        } else {
            // Fallback: If specific ID not found, maybe show a generic error or find latest
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
        return `${d}d ${h}h ${m}m ${s}s`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-20 text-center">
                    <Info className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-20" />
                    <h1 className="text-2xl font-bold mb-2">No Active Sessions</h1>
                    <p className="text-muted-foreground mb-8">There are no international mock simulations scheduled at this time.</p>
                    <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4">
                {/* Header Section */}
                <div className="w-full max-w-3xl card-surface p-12 text-center relative overflow-hidden">
                    {/* Abstract BG */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-orange-500" />

                    <div className="flex flex-col items-center gap-4 mb-4">
                        <div className="flex items-center gap-6 mb-2">
                            <div className="h-8 flex items-center">
                                <span className="font-bold text-xl tracking-tighter">italy<span className="text-orange-500 italic">prep</span></span>
                            </div>
                            <div className="h-8 w-[1px] bg-border mx-2" />
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Exam Format</p>
                                <p className="font-bold text-lg">{session.exam_type.toUpperCase().replace('-PREP', '')}</p>
                            </div>
                        </div>

                        <div className="px-4 py-1 rounded-full bg-secondary text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                            <Lock className="w-3 h-3" />
                            {isLocked ? 'Session Locked' : 'Session Ready'}
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
                        {session.title}
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                        {session.description}
                    </p>

                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] mb-4">
                        Available Window: {format(new Date(session.start_time), 'MMM d, yyyy').toUpperCase()} — {format(new Date(session.end_time), 'MMM d, yyyy').toUpperCase()}
                    </div>

                    {/* Countdown Timer */}
                    <div className="text-5xl md:text-7xl font-mono font-bold text-foreground mb-2">
                        {timeLeft > 0 ? formatTime(timeLeft) : '00:00:00'}
                    </div>
                    <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest mb-12">
                        Time Until Launch
                    </p>

                    {/* System Readiness Box */}
                    <div className="max-w-md mx-auto bg-secondary/30 rounded-2xl p-6 border border-border text-left">
                        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">
                            <Monitor className="w-4 h-4" />
                            System Readiness
                        </div>

                        <div className="space-y-3">
                            {[
                                { icon: Globe, label: 'Browser Environment', status: 'PASS' },
                                { icon: ShieldCheck, label: 'Network Connectivity', status: 'PASS' },
                                { icon: Monitor, label: 'Display Resolution', status: 'PASS' },
                                { icon: Lock, label: 'Local Storage', status: 'PASS' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-sm font-medium">
                                        <item.icon className="w-4 h-4 text-muted-foreground" />
                                        {item.label}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500">
                                        <CheckCircle2 className="w-3 h-3" />
                                        {item.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12">
                        <Button
                            size="lg"
                            disabled={isLocked || isStarting}
                            onClick={handleStartTest}
                            className={`px-12 py-6 rounded-xl font-bold transition-all ${isLocked
                                ? 'bg-secondary text-muted-foreground'
                                : 'bg-foreground text-background hover:scale-105 shadow-xl'
                                }`}
                        >
                            {isStarting ? (
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            ) : isLocked ? (
                                `Session Locked (Opens ${format(new Date(session.start_time), 'MMM d')})`
                            ) : (
                                'Enter Examination Hall'
                            )}
                            {!isLocked && !isStarting && <ChevronRight className="w-5 h-5 ml-2" />}
                        </Button>
                    </div>

                    <p className="mt-8 text-[10px] text-muted-foreground leading-relaxed max-w-sm mx-auto">
                        Reference ID: {session.id.slice(0, 8).toUpperCase()}<br />
                        This platform is not affiliated with, endorsed by, or connected to CINECA. All trademarks belong to their respective owners.
                    </p>
                </div>
            </div>
        </Layout>
    );
}
