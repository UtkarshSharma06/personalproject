import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
    Brain, ArrowLeft, PlayCircle, BookOpen,
    Clock, Target, Zap, ChevronLeft, Check, Loader2
} from 'lucide-react';
import { useExam } from '@/context/ExamContext';
import { usePlanAccess } from '@/hooks/usePlanAccess';
import { cn } from '@/lib/utils';

export default function MobileStartTest() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { activeExam } = useExam();
    const { hasReachedSubjectLimit, getRemainingQuestions, isExplorer } = usePlanAccess();
    const [searchParams] = useSearchParams();

    // Mission Params
    const [subject, setSubject] = useState(searchParams.get('subject') || activeExam.sections[0].name);
    const [topic, setTopic] = useState('all');
    const [difficulty, setDifficulty] = useState('medium');
    const [questionCount, setQuestionCount] = useState(Number(searchParams.get('count')) || 10);
    const [timeLimit, setTimeLimit] = useState(30);

    // State
    const [availableTopics, setAvailableTopics] = useState<{ name: string; count: number }[]>([]);
    const [isLoadingTopics, setIsLoadingTopics] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Sync topics when subject changes
    useEffect(() => {
        const fetchTopics = async () => {
            if (!activeExam || !subject) return;
            setIsLoadingTopics(true);
            try {
                const { data } = await (supabase as any)
                    .from('practice_questions')
                    .select('topic')
                    .eq('exam_type', activeExam.id)
                    .eq('subject', subject);

                if (data) {
                    const counts: Record<string, number> = {};
                    data.forEach((q: any) => { if (q.topic) counts[q.topic] = (counts[q.topic] || 0) + 1; });
                    const sorted = Object.entries(counts)
                        .map(([name, count]) => ({ name, count }))
                        .sort((a, b) => b.count - a.count);
                    setAvailableTopics(sorted);
                    if (topic !== 'all' && !counts[topic]) setTopic('all');
                }
            } catch (err) {
                console.error('Error fetching topics:', err);
            } finally {
                setIsLoadingTopics(false);
            }
        };
        fetchTopics();
    }, [subject, activeExam.id]);

    const handleStart = async () => {
        if (!user) {
            toast({ title: "Authentication Required", variant: "destructive" });
            navigate('/auth');
            return;
        }

        if (hasReachedSubjectLimit(subject)) {
            toast({ title: "Limit Reached", description: "Standard daily limits apply. Upgrade to PRO.", variant: "destructive" });
            return;
        }

        setIsGenerating(true);
        try {
            // 1. Fetch Solved IDs
            const { data: solvedData } = await (supabase as any)
                .from('user_practice_responses')
                .select('question_id')
                .eq('user_id', user.id);
            const solvedIds = solvedData?.map((r: any) => r.question_id) || [];

            // 2. Build Query
            let query = (supabase as any)
                .from('practice_questions')
                .select('*')
                .eq('exam_type', activeExam.id)
                .eq('subject', subject);

            if (difficulty !== 'mixed' && difficulty !== 'all') query = query.eq('difficulty', difficulty);
            if (topic && topic !== 'all') query = query.eq('topic', topic);
            if (solvedIds.length > 0) query = query.not('id', 'in', `(${solvedIds.join(',')})`);

            const { data: qPool, error: qError } = await query;
            if (qError || !qPool || qPool.length < questionCount) {
                throw new Error("Insufficient neural fragments found in this sector.");
            }

            // 3. Select & Shuffle
            const selected = qPool.sort(() => Math.random() - 0.5).slice(0, questionCount);

            // 4. Create Test Record
            const { data: test, error: tError } = await supabase
                .from('tests')
                .insert({
                    user_id: user.id,
                    subject: subject,
                    topic: topic !== 'all' ? topic : null,
                    difficulty: difficulty,
                    total_questions: selected.length,
                    time_limit_minutes: timeLimit,
                    status: 'in_progress',
                    exam_type: activeExam.id
                })
                .select()
                .single();

            if (tError) throw tError;

            // 5. Insert Mission Questions
            const questions = selected.map((q: any, i: number) => ({
                test_id: test.id,
                question_number: i + 1,
                question_text: q.question_text,
                options: q.options,
                correct_index: q.correct_index,
                explanation: q.explanation,
                difficulty: q.difficulty || difficulty || 'medium',
                topic: q.topic || subject,
                practice_question_id: q.id
            }));

            const { error: qsError } = await supabase.from('questions').insert(questions);
            if (qsError) {
                console.error('Supabase Questions Insert Error Details:', qsError);
                throw qsError;
            }

            toast({ title: "Test Started", description: "Curriculum loaded." });
            navigate(`/test/${test.id}`);
        } catch (e: any) {
            toast({ title: "Generation Offline", description: e.message, variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };

    if (isGenerating) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-8">
            <div className="relative mb-8">
                <div className="w-24 h-24 border-8 border-primary/10 border-t-primary rounded-full animate-spin" />
                <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary w-10 h-10 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Preparing <span className="text-primary">Test</span></h2>
            <p className="text-[10px] font-black tracking-widest uppercase opacity-40 mt-4">Loading Curriculum Data...</p>
        </div>
    );

    return (
        <div className="flex flex-col min-h-full bg-background pb-32 animate-in fade-in slide-in-from-bottom-5 duration-500 overflow-y-auto">
            <header className="p-8 pt-10 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-muted-foreground"><ChevronLeft /></button>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Practice <span className="text-primary">Setup</span></h1>
                    <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">Configure Your Session</p>
                </div>
            </header>

            <div className="px-6 space-y-10">
                {/* Sector Selection */}
                <section>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Select Subject</h3>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                        {activeExam.sections.map((s) => (
                            <button
                                key={s.name}
                                onClick={() => setSubject(s.name)}
                                className={`shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-3xl border-2 transition-all active:scale-95 relative ${subject === s.name ? 'border-primary bg-primary/5 shadow-lg' : 'border-border/50 bg-secondary/10'}`}
                            >
                                <span className="text-2xl mb-1">{s.icon}</span>
                                <span className="text-[8px] font-black uppercase text-center px-1 leading-tight">{s.name}</span>
                                {subject === s.name && <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center"><Check size={8} className="text-white" /></div>}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Topic Selection */}
                <section>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Select Topic</h3>
                    <div className="flex gap-2 flex-wrap min-h-[40px]">
                        <button
                            onClick={() => setTopic('all')}
                            className={cn(
                                "px-4 py-2 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest transition-all active:scale-95",
                                topic === 'all' ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-secondary/10 text-muted-foreground opacity-60"
                            )}
                        >
                            All Topics
                        </button>
                        {isLoadingTopics ? (
                            <div className="flex items-center ml-2"><Loader2 className="w-4 h-4 animate-spin opacity-20" /></div>
                        ) : availableTopics.map((t) => (
                            <button
                                key={t.name}
                                onClick={() => setTopic(t.name)}
                                className={cn(
                                    "px-4 py-2 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2",
                                    topic === t.name ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-secondary/10 text-muted-foreground opacity-60"
                                )}
                            >
                                {t.name}
                                <span className="text-[7px] opacity-40">{t.count}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Question Count Grid */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Number of Questions</h3>
                        {isExplorer && <span className="text-[9px] font-black text-rose-500 uppercase">Limit: {getRemainingQuestions(subject)} Qs</span>}
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {[5, 10, 15, 20].map((c) => (
                            <button
                                key={c}
                                onClick={() => setQuestionCount(c)}
                                disabled={isExplorer && c > getRemainingQuestions(subject)}
                                className={cn(
                                    "h-14 rounded-2xl border-2 font-black text-xs transition-all active:scale-95",
                                    questionCount === c ? "border-primary bg-primary/5 text-primary" : "border-border/50 bg-secondary/10 opacity-60"
                                )}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Difficulty Blocks */}
                <section>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Select Difficulty</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {['easy', 'medium', 'hard', 'mixed'].map((d) => (
                            <button
                                key={d}
                                onClick={() => setDifficulty(d)}
                                className={cn(
                                    "h-16 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 text-center",
                                    difficulty === d ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-border/50 bg-secondary/10 opacity-60"
                                )}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Mission Start CTA */}
                <Button
                    onClick={handleStart}
                    className="w-full h-20 rounded-[2.5rem] bg-foreground text-background hover:bg-foreground/90 font-black text-sm uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all mt-4"
                >
                    Start Test <PlayCircle className="ml-3 w-6 h-6" />
                </Button>
            </div>
        </div>
    );
}
