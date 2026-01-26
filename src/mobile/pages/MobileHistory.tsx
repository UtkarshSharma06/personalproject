import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
    BookOpen, Clock, ShieldX, CheckCircle, Calendar,
    ChevronRight, Target, Headphones, FileText, Mic,
    Award, Filter, History as HistoryIcon, Search, Sparkles, ArrowRight
} from 'lucide-react';
import { useExam } from '@/context/ExamContext';
import { Card, CardContent } from "@/components/ui/card";

export default function MobileHistory() {
    const { user, profile, loading } = useAuth();
    const { activeExam } = useExam();
    const navigate = useNavigate();
    const [tests, setTests] = useState<any[]>([]);
    const isIELTS = activeExam?.id === 'ielts-academic';
    const [activeTab, setActiveTab] = useState<string>(isIELTS ? 'writing' : 'practice');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isIELTS) setActiveTab('writing');
        else setActiveTab('practice');
    }, [isIELTS]);

    useEffect(() => {
        if (user) fetchTests();
    }, [user]);

    const fetchTests = async () => {
        setIsLoading(true);
        // Logic identical to web History.tsx for 100% data parity
        const [
            { data: testsData }, { data: writingData }, { data: readingData },
            { data: listeningData }, { data: speakingData }, { data: mockData }
        ] = await Promise.all([
            (supabase as any).from('tests').select('*').eq('exam_type', activeExam.id).order('completed_at', { ascending: false }),
            (supabase as any).from('writing_submissions').select('*, writing_feedback(overall_score)').order('submitted_at', { ascending: false }),
            (supabase as any).from('reading_submissions').select('*').order('created_at', { ascending: false }),
            (supabase as any).from('listening_submissions').select('*').order('created_at', { ascending: false }),
            (supabase as any).from('speaking_sessions').select('*, speaking_scores(overall_score)').eq('candidate_id', user?.id).order('started_at', { ascending: false }),
            (supabase as any).from('mock_exam_submissions').select('*, mock_sessions(title)').order('created_at', { ascending: false })
        ]);

        let unified: any[] = [];
        if (testsData) unified = [...unified, ...testsData.map((t: any) => ({ ...t, type: t.test_type || 'Practice', date: t.completed_at || t.started_at }))];
        if (writingData) unified = [...unified, ...writingData.map((w: any) => ({ id: w.id, subject: 'IELTS Writing', type: 'Writing', score: w.writing_feedback?.[0]?.overall_score || null, status: w.status, date: w.submitted_at || w.created_at, is_manual: true }))];
        if (readingData) unified = [...unified, ...readingData.map((r: any) => ({ id: r.id, subject: 'IELTS Reading', type: 'Reading', score: r.score, status: r.status, date: r.created_at, is_manual: true }))];
        if (listeningData) unified = [...unified, ...listeningData.map((l: any) => ({ id: l.id, subject: 'IELTS Listening', type: 'Listening', score: l.score, status: l.status, date: l.created_at, is_manual: true }))];
        if (speakingData) unified = [...unified, ...speakingData.map((s: any) => ({ id: s.id, subject: 'IELTS Speaking', type: 'Speaking', score: s.speaking_scores?.[0]?.overall_score || null, status: 'completed', date: s.started_at, is_manual: true }))];
        if (mockData) unified = [...unified, ...mockData.map((m: any) => ({ id: m.id, subject: m.mock_sessions?.title || 'Mock Exam', type: 'Full Mock', score: m.overall_band || m.writing_band || null, status: m.status, date: m.started_at, is_manual: true, is_full_mock: true }))];

        unified.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Plan limitation logic
        const isExplorer = profile?.selected_plan === 'explorer';
        if (isExplorer) {
            const skills = ['Reading', 'Listening', 'Writing', 'Speaking'];
            const filtered = skills.flatMap(s => unified.filter(t => t.type === s).slice(0, 2));
            const rest = unified.filter(t => !skills.includes(t.type)).slice(0, 2);
            setTests([...filtered, ...rest]);
        } else {
            setTests(unified);
        }
        setIsLoading(false);
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const currentTests = tests.filter(t => {
        if (activeTab === 'practice') return t.type !== 'mock' && !t.subject.includes('IELTS');
        if (activeTab === 'mock') return t.type === 'mock' || t.is_full_mock;
        return t.type.toLowerCase() === activeTab;
    });

    return (
        <div className="flex flex-col min-h-full bg-background pb-20 animate-in fade-in duration-500">
            {/* Modern Tab System */}
            <div className="px-4 mb-6">
                <div className="flex bg-secondary/30 p-1 rounded-2xl border border-border/50 overflow-x-auto no-scrollbar gap-1">
                    {(isIELTS ? ['writing', 'reading', 'listening', 'speaking', 'mock'] : ['practice', 'mock']).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === tab ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 px-4 space-y-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Retrying Logs...</span>
                    </div>
                ) : currentTests.length > 0 ? (
                    currentTests.map((test, i) => (
                        <Card
                            key={i}
                            onClick={() => navigate(test.is_full_mock ? `/mock-results/${test.id}` : (test.is_manual ? `/${test.type.toLowerCase()}/results/${test.id}` : `/results/${test.id}`))}
                            className="bg-secondary/20 border-border/40 rounded-[2rem] overflow-hidden active:scale-[0.98] transition-all border-b-4 hover:border-primary/30"
                        >
                            <CardContent className="p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-background border border-border/50 flex items-center justify-center text-xl shadow-sm">
                                            {test.subject.includes('Writing') ? '✍️' : test.subject.includes('Reading') ? '📖' : '🧠'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xs uppercase tracking-tight truncate max-w-[150px]">{test.subject}</h3>
                                            <div className="flex items-center gap-2 text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                                                <Calendar className="w-3 h-3" /> {formatDate(test.date)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${test.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                        }`}>
                                        {test.status}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-background/50 p-2.5 rounded-xl border border-border/30 text-center">
                                        <span className="block text-[7px] font-black text-muted-foreground uppercase opacity-40 mb-1">Score</span>
                                        <span className={`text-sm font-black ${test.score >= 7 || test.score >= 70 ? 'text-emerald-500' : 'text-primary'}`}>
                                            {test.score || '—'}{!test.is_manual && test.score ? '%' : ''}
                                        </span>
                                    </div>
                                    <div className="bg-background/50 p-2.5 rounded-xl border border-border/30 text-center">
                                        <span className="block text-[7px] font-black text-muted-foreground uppercase opacity-40 mb-1">Type</span>
                                        <span className="text-[9px] font-black uppercase truncate">{test.type}</span>
                                    </div>
                                    <div className="bg-background/50 p-2.5 rounded-xl border border-border/30 flex items-center justify-center group">
                                        <ChevronRight className="w-5 h-5 text-muted-foreground opacity-30 group-hover:text-primary transition-colors" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20 bg-secondary/10 rounded-[3rem] border border-dashed border-border px-8">
                        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 border border-border/50">
                            <HistoryIcon className="w-8 h-8 text-muted-foreground opacity-20" />
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No field observations recorded</p>
                    </div>
                )}

                {/* Upgrade Banner for Explorer */}
                {profile?.selected_plan === 'explorer' && (
                    <div className="mt-6 p-6 bg-primary rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-primary/20">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles className="w-20 h-20 text-white" /></div>
                        <h3 className="text-white font-black text-lg uppercase tracking-tight relative z-10 leading-tight">Unlock Full Logs</h3>
                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-2 relative z-10">You're seeing 2 recent entries only</p>
                        <Button onClick={() => navigate('/onboarding')} className="mt-4 w-full bg-white text-primary hover:bg-white/90 font-black text-[10px] uppercase tracking-widest rounded-xl">Upgrade Protocol</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
