import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
    CheckCircle, XCircle, MinusCircle,
    Timer, Target, Home, RotateCcw, ChevronDown, ChevronUp
} from 'lucide-react';
import { useExam } from '@/context/ExamContext';
import { EXAMS } from '@/config/exams';
import { MathText } from '@/components/MathText';
import DiagramRenderer from '@/components/DiagramRenderer';

export default function MobileResults() {
    const { testId } = useParams<{ testId: string }>();
    const navigate = useNavigate();
    const { activeExam } = useExam();
    const [test, setTest] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

    useEffect(() => {
        if (testId) fetchResults();
    }, [testId]);

    const fetchResults = async () => {
        const { data: testData } = await (supabase as any).from('tests').select('*').eq('id', testId).maybeSingle();
        if (testData) setTest(testData);

        const { data: questionsData } = await (supabase as any).from('questions').select('*').eq('test_id', testId).order('question_number');
        if (questionsData) setQuestions(questionsData);
    };

    if (!test) return <div className="flex items-center justify-center h-screen bg-background"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

    const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

    return (
        <div className="flex flex-col min-h-screen bg-background pb-32 animate-in fade-in duration-500">
            {/* Native Score Header */}
            <div className="bg-primary p-12 pt-20 rounded-b-[4rem] text-white text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Target size={120} /></div>
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Test Summary</p>
                    <h1 className="text-7xl font-black tracking-tighter">{test.score}%</h1>
                    <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest opacity-80">
                        <span>{test.subject}</span>
                        <span>•</span>
                        <span>{test.total_questions} Items</span>
                    </div>
                </div>
            </div>

            <main className="px-6 -mt-8 space-y-6 relative z-10">
                {/* Meta Metrics */}
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { icon: CheckCircle, color: 'text-emerald-500', val: test.correct_answers },
                        { icon: XCircle, color: 'text-rose-500', val: test.wrong_answers },
                        { icon: MinusCircle, color: 'text-slate-400', val: test.skipped_answers },
                        { icon: Timer, color: 'text-primary', val: Math.floor(test.time_taken_seconds / 60) + 'm' }
                    ].map((m, i) => (
                        <div key={i} className="bg-card border border-border/50 p-4 rounded-3xl flex flex-col items-center shadow-lg">
                            <m.icon className={`${m.color} w-4 h-4 mb-2`} />
                            <span className="font-black text-xs">{m.val}</span>
                        </div>
                    ))}
                </div>

                {/* Review List */}
                <div className="space-y-4">
                    <h3 className="px-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Review Questions</h3>
                    <div className="space-y-2">
                        {questions.map((q) => {
                            const isCorrect = q.user_answer === q.correct_index;
                            const isExpanded = expandedQuestion === q.id;
                            return (
                                <div key={q.id} className="bg-secondary/10 border border-border/40 rounded-[2rem] overflow-hidden transition-all">
                                    <button
                                        onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                                        className="w-full flex items-center justify-between p-5 active:bg-secondary/30"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                                {isCorrect ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-black text-[11px] uppercase tracking-tight">Question #{q.question_number}</p>
                                                <p className="text-[9px] font-bold text-muted-foreground truncate max-w-[150px]">{q.topic}</p>
                                            </div>
                                        </div>
                                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    {isExpanded && (
                                        <div className="px-6 pb-6 pt-2 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                            {q.diagram && (
                                                <div className="mb-4 rounded-2xl border border-border/50 overflow-hidden bg-secondary/10 p-2">
                                                    <DiagramRenderer diagram={q.diagram} />
                                                </div>
                                            )}
                                            <MathText content={q.question_text} className="text-xs font-bold leading-relaxed" />
                                            <div className="space-y-2">
                                                {q.options.map((opt: string, idx: number) => (
                                                    <div key={idx} className={`p-3 rounded-xl border text-[10px] font-bold ${idx === q.correct_index ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-700' :
                                                        idx === q.user_answer ? 'bg-rose-500/10 border-rose-500/50 text-rose-700' : 'bg-secondary/20 border-border/20'
                                                        }`}>
                                                        <MathText content={opt} />
                                                    </div>
                                                ))}
                                            </div>
                                            {q.explanation && (
                                                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                                    <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Detailed Explanation</p>
                                                    <MathText content={q.explanation} className="text-[10px] text-muted-foreground leading-relaxed font-medium" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Final Actions */}
                <div className="grid grid-cols-2 gap-4 pb-12">
                    <Button variant="ghost" onClick={() => navigate('/dashboard')} className="h-14 rounded-2xl border-border/50 font-black text-[10px] uppercase tracking-widest"><Home className="mr-2 w-4 h-4" /> Exit</Button>
                    <Button onClick={() => navigate('/practice')} className="h-14 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20"><RotateCcw className="mr-2 w-4 h-4" /> Retake</Button>
                </div>
            </main>
        </div>
    );
}
