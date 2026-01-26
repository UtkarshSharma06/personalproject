import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
    Timer, ChevronLeft, ChevronRight, CheckCircle2,
    Loader2, Users, Trophy, BookOpen, Clock, AlertCircle
} from 'lucide-react';
import { differenceInSeconds } from 'date-fns';
import { EXAMS } from '@/config/exams';

interface MockSession {
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    exam_type: string;
}

export default function MobileMockWaitingRoom() {
    const navigate = useNavigate();
    const { sessionId } = useParams();
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();

    const [session, setSession] = useState<MockSession | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isLocked, setIsLocked] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isStarting, setIsStarting] = useState(false);

    useEffect(() => {
        if (sessionId) fetchSession();
    }, [sessionId]);

    const fetchSession = async () => {
        setIsLoading(true);
        const { data } = await (supabase as any)
            .from('mock_sessions')
            .select('*')
            .eq('id', sessionId)
            .single();

        if (data) {
            setSession(data);
            const start = new Date(data.start_time);
            const now = new Date();
            const diff = differenceInSeconds(start, now);
            setTimeLeft(Math.max(0, diff));
            setIsLocked(diff > 0);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
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

    const handleStart = async () => {
        if (!session || !user) return;
        setIsStarting(true);
        try {
            // Check if attempt exists
            const { data: existing } = await (supabase as any)
                .from('tests')
                .select('id, status')
                .eq('user_id', user.id)
                .eq('session_id', session.id)
                .maybeSingle();

            if (existing) {
                if (existing.status === 'in_progress') navigate(`/test/${existing.id}`);
                else toast({ title: "Attempt Complete", description: "You have already finished this exam.", variant: "destructive" });
                return;
            }

            // Fetch questions
            const { data: sQs } = await (supabase as any)
                .from('session_questions')
                .select('*')
                .eq('session_id', session.id);

            if (!sQs || sQs.length === 0) {
                toast({ title: "No Questions Found", description: "Please contact support.", variant: "destructive" });
                return;
            }

            // Create test
            const { data: test, error } = await (supabase as any)
                .from('tests')
                .insert({
                    user_id: user.id,
                    session_id: session.id,
                    subject: session.title,
                    difficulty: 'mixed',
                    total_questions: sQs.length,
                    time_limit_minutes: 100,
                    status: 'in_progress',
                    test_type: 'mock',
                    exam_type: session.exam_type,
                })
                .select().single();

            if (error) throw error;

            // Clone questions
            const questions = sQs.map((sq: any, i: number) => ({
                test_id: test.id,
                question_number: i + 1,
                question_text: sq.question_text,
                options: sq.options,
                correct_index: sq.correct_index,
                explanation: sq.explanation,
                difficulty: 'mixed',
                topic: sq.topic,
                subject: sq.section_name,
                exam_type: session.exam_type,
            }));

            await (supabase as any).from('questions').insert(questions);
            navigate(`/test/${test.id}`);
        } catch (e: any) {
            toast({ title: "Error starting exam", description: e.message, variant: "destructive" });
        } finally {
            setIsStarting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center bg-background">
            <Loader2 className="w-10 h-10 text-primary animate-spin opacity-20" />
        </div>
    );

    if (!session) return (
        <div className="h-screen flex flex-col items-center justify-center p-8 text-center bg-background">
            <AlertCircle className="w-16 h-16 text-muted-foreground opacity-20 mb-4" />
            <h2 className="text-xl font-black uppercase">Session Not Found</h2>
            <Button onClick={() => navigate(-1)} className="mt-6 rounded-full">Go Back</Button>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-background pb-32">
            <header className="p-6 pt-10 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-muted-foreground"><ChevronLeft /></button>
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight">Exam <span className="text-primary">Hall</span></h1>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Waiting Area</p>
                </div>
            </header>

            <main className="flex-1 px-6 pt-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-8">
                    <Clock className="w-8 h-8 text-primary" />
                </div>

                <div className="space-y-2 mb-12">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Starts In</p>
                    <h2 className="text-6xl font-black tracking-tighter tabular-nums text-foreground">
                        {formatTime(timeLeft)}
                    </h2>
                </div>

                <div className="w-full bg-secondary/10 border border-border/40 rounded-[2.5rem] p-8 space-y-8 mb-10">
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{session.title}</h3>
                        <p className="text-xs font-bold text-muted-foreground px-4">{session.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-background rounded-2xl border border-border/40">
                            <Users className="w-4 h-4 text-primary mx-auto mb-2" />
                            <span className="text-[8px] font-black uppercase text-muted-foreground block">Entry</span>
                            <span className="text-[10px] font-black uppercase">Open</span>
                        </div>
                        <div className="p-4 bg-background rounded-2xl border border-border/40">
                            <Trophy className="w-4 h-4 text-emerald-500 mx-auto mb-2" />
                            <span className="text-[8px] font-black uppercase text-muted-foreground block">Status</span>
                            <span className="text-[10px] font-black uppercase">{isLocked ? 'Locked' : 'Active'}</span>
                        </div>
                    </div>
                </div>

                <div className="w-full px-4 space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Your seat is reserved</p>
                    </div>

                    <Button
                        onClick={handleStart}
                        disabled={isLocked || isStarting}
                        className="w-full h-20 rounded-[2.5rem] text-sm font-black uppercase tracking-[0.3em] shadow-2xl active:scale-[0.98] transition-all"
                    >
                        {isStarting ? <Loader2 className="animate-spin" /> : (isLocked ? 'Waiting for Start' : 'Enter Exam')}
                        {!isStarting && !isLocked && <ChevronRight className="ml-2 w-5 h-5" />}
                    </Button>
                </div>
            </main>

            <footer className="p-8 text-center">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-30 leading-relaxed">
                    Please do not close this window. <br />The exam will start automatically once the timer ends.
                </p>
            </footer>
        </div>
    );
}
