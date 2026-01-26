import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useExam } from '@/context/ExamContext';
import { MathText } from '@/components/MathText';
import DiagramRenderer from '@/components/DiagramRenderer';
import {
    Clock, ChevronLeft, ChevronRight, Flag, X, Loader2,
    Bookmark, CheckCircle2, AlertCircle, Maximize2
} from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { cn } from '@/lib/utils';

interface Question {
    id: string;
    question_number: number;
    question_text: string;
    options: string[];
    correct_index: number;
    user_answer: number | null;
    is_marked: boolean;
    diagram: any;
    topic: string | null;
    subject?: string | null;
    is_saved?: boolean;
}

export default function MobileTest() {
    const { testId } = useParams<{ testId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { activeExam } = useExam();

    const [test, setTest] = useState<any>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const questionStartTime = useRef<number>(Date.now());

    useEffect(() => {
        if (testId && user) {
            fetchTestData();
        }
    }, [testId, user]);

    const fetchTestData = async () => {
        const { data: testData, error: testError } = await supabase
            .from('tests')
            .select('*')
            .eq('id', testId)
            .maybeSingle();

        if (testError || !testData) {
            toast({ title: 'Test not found', variant: 'destructive' });
            navigate('/mobile/dashboard');
            return;
        }

        if (testData.status === 'completed') {
            navigate(`/results/${testId}`);
            return;
        }

        setTest(testData);

        // Timer calculation (same as web)
        const startTime = new Date(testData.started_at).getTime();
        const endTime = startTime + testData.time_limit_minutes * 60 * 1000;
        setTimeRemaining(Math.max(0, Math.floor((endTime - Date.now()) / 1000)));

        const { data: qData } = await supabase
            .from('questions')
            .select('*')
            .eq('test_id', testId)
            .order('question_number');

        if (qData) {
            setQuestions(qData.map(q => ({
                ...q,
                options: q.options as string[],
                diagram: q.diagram as any
            })));
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (!test) return;
        if (timeRemaining <= 0) {
            submitTest('time_up');
            return;
        }
        const timer = setInterval(() => setTimeRemaining(p => Math.max(0, p - 1)), 1000);
        return () => clearInterval(timer);
    }, [timeRemaining, test]);

    const handleSelectAnswer = async (optionIndex: number) => {
        const question = questions[currentIndex];
        if (!question) return;

        // Native feedback (non-blocking)
        Haptics.impact({ style: ImpactStyle.Light }).catch(() => { });

        setQuestions(prev => prev.map((q, i) => i === currentIndex ? { ...q, user_answer: optionIndex } : q));

        await supabase.from('questions').update({
            user_answer: optionIndex,
            answered_at: new Date().toISOString(),
        }).eq('id', question.id);
    };

    const handleMarkForReview = async () => {
        const question = questions[currentIndex];
        if (!question) return;
        Haptics.impact({ style: ImpactStyle.Medium }).catch(() => { });
        const newMarked = !question.is_marked;
        setQuestions(prev => prev.map((q, i) => i === currentIndex ? { ...q, is_marked: newMarked } : q));
        await supabase.from('questions').update({ is_marked: newMarked }).eq('id', question.id);
    };

    const handleNavigate = (dir: 'next' | 'prev') => {
        if (dir === 'next' && currentIndex < questions.length - 1) setCurrentIndex(c => c + 1);
        if (dir === 'prev' && currentIndex > 0) setCurrentIndex(c => c - 1);
        Haptics.impact({ style: ImpactStyle.Light }).catch(() => { });
    };

    const submitTest = async (reason = 'manual') => {
        setIsSubmitting(true);
        let correct = 0;
        questions.forEach(q => { if (q.user_answer === q.correct_index) correct++; });

        const scorePercentage = Math.round((correct / questions.length) * 100);

        await supabase.from('tests').update({
            status: 'completed',
            score: scorePercentage,
            correct_answers: correct,
            completed_at: new Date().toISOString(),
        }).eq('id', testId);

        navigate(`/results/${testId}`);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center bg-background">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
    );

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
            {/* Top Header - Focused */}
            <header className="p-4 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                    <ChevronLeft className="w-6 h-6" />
                </Button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Time Remaining</span>
                    <span className={`font-mono text-lg font-black ${timeRemaining < 300 ? 'text-destructive animate-pulse' : 'text-primary'}`}>
                        {formatTime(timeRemaining)}
                    </span>
                </div>
                <Button variant="outline" size="sm" onClick={() => submitTest()} className="rounded-full text-[10px] font-black uppercase tracking-widest border-primary/30">
                    Finish
                </Button>
            </header>

            {/* Progress Line */}
            <div className="h-1.5 w-full bg-secondary">
                <div className="h-full bg-primary transition-all duration-500 shadow-[0_0_10px_rgba(var(--primary),0.5)]" style={{ width: `${progress}%` }} />
            </div>

            {/* Question Content */}
            <main className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-secondary rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Question {currentIndex + 1} of {questions.length}
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleMarkForReview} className={`rounded-xl gap-2 ${currentQuestion?.is_marked ? 'bg-orange-500/10 text-orange-500' : 'text-muted-foreground'}`}>
                        <Flag className={`w-4 h-4 ${currentQuestion?.is_marked ? 'fill-current' : ''}`} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Flag</span>
                    </Button>
                </div>

                {currentQuestion?.diagram && (
                    <div className="rounded-3xl border border-border/50 overflow-hidden bg-secondary/10 p-4">
                        <DiagramRenderer diagram={currentQuestion.diagram} />
                    </div>
                )}

                <div className="prose prose-sm dark:prose-invert">
                    <MathText content={currentQuestion?.question_text || ''} className="text-xl font-bold leading-tight" />
                </div>

                {/* Options */}
                <div className="space-y-3 pt-4">
                    {currentQuestion?.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelectAnswer(idx)}
                            className={`w-full p-6 border-2 rounded-[2rem] text-left transition-all active:scale-95 flex gap-4 ${currentQuestion.user_answer === idx
                                ? 'border-primary bg-primary text-white shadow-xl shadow-primary/20'
                                : 'border-secondary bg-secondary/20 text-muted-foreground hover:bg-secondary/40'
                                }`}
                        >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${currentQuestion.user_answer === idx ? 'bg-white text-primary' : 'bg-background border border-border/50'
                                }`}>
                                {String.fromCharCode(65 + idx)}
                            </span>
                            <MathText content={option} className={cn("text-sm font-semibold", currentQuestion.user_answer === idx ? "text-white" : "text-foreground")} />
                        </button>
                    ))}
                </div>
            </main>

            {/* Navigation Footer */}
            <footer className="p-4 bg-background border-t border-border/50 flex gap-3 h-20 items-center">
                <Button
                    variant="secondary"
                    className="flex-1 h-12 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest"
                    onClick={() => handleNavigate('prev')}
                    disabled={currentIndex === 0}
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <Button
                    className="flex-1 h-12 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
                    onClick={() => handleNavigate('next')}
                    disabled={currentIndex === questions.length - 1}
                >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </footer>
        </div>
    );
}
