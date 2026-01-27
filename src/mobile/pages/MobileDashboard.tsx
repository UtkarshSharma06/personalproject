import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Play, BookOpen, Trophy, ArrowRight, Zap, Target,
    Loader2, Sparkles, Clock as HistoryIcon, User,
    BarChart3, Bookmark, FlaskConical, GraduationCap,
    Award, ChevronRight, Bell, Dna, Brain, Calculator,
    Languages, Database, Microscope, ClipboardList
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useExam } from '@/context/ExamContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface SubjectMastery {
    subject: string;
    solved: number;
    total: number;
    accuracy: number;
}

interface TopStudent {
    id: string;
    display_name: string;
    total_score: number; // This is questions_solved
    tests_taken: number;
    avatar_url?: string | null;
    accuracy?: number;
}

const COLORS = [
    "bg-red-200 text-red-700",
    "bg-orange-200 text-orange-700",
    "bg-amber-200 text-amber-700",
    "bg-yellow-200 text-yellow-700",
    "bg-lime-200 text-lime-700",
    "bg-green-200 text-green-700",
    "bg-emerald-200 text-emerald-700",
    "bg-teal-200 text-teal-700",
    "bg-cyan-200 text-cyan-700",
    "bg-sky-200 text-sky-700",
    "bg-blue-200 text-blue-700",
    "bg-indigo-200 text-indigo-700",
    "bg-violet-200 text-violet-700",
    "bg-purple-200 text-purple-700",
    "bg-fuchsia-200 text-fuchsia-700",
    "bg-pink-200 text-pink-700",
    "bg-rose-200 text-rose-700",
];

const generateAvatarColor = (name: string) => {
    if (!name) return COLORS[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COLORS.length;
    return COLORS[index];
};

const MobileDashboard: React.FC = () => {
    const { user, profile } = useAuth();
    const { activeExam } = useExam();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const getSubjectIcon = (subject: string) => {
        const s = subject.toLowerCase();
        if (s.includes('biol')) return <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg"><Dna size={16} /></div>;
        if (s.includes('chem')) return <div className="p-2 bg-rose-500/20 text-rose-500 rounded-lg"><FlaskConical size={16} /></div>;
        if (s.includes('phys')) return <div className="p-2 bg-cyan-500/20 text-cyan-500 rounded-lg"><Database size={16} /></div>;
        if (s.includes('math')) return <div className="p-2 bg-amber-500/20 text-amber-500 rounded-lg"><Calculator size={16} /></div>;
        if (s.includes('logic')) return <div className="p-2 bg-indigo-500/20 text-indigo-500 rounded-lg"><Brain size={16} /></div>;
        if (s.includes('read') || s.includes('listen') || s.includes('writ') || s.includes('speak')) return <div className="p-2 bg-violet-500/20 text-violet-500 rounded-lg"><Languages size={16} /></div>;
        return <div className="p-2 bg-slate-500/20 text-slate-500 rounded-lg"><BookOpen size={16} /></div>;
    };

    // ... (rest of state definitions)
    const [stats, setStats] = useState({
        solved: 0,
        accuracy: 0,
        streak: 0,
        totalQuestions: 0
    });
    const [subjectMastery, setSubjectMastery] = useState<SubjectMastery[]>([]);
    const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
    const [platformTotalQuestions, setPlatformTotalQuestions] = useState(0);

    const [ieltsStats, setIeltsStats] = useState({
        reading: 0,
        listening: 0,
        writing: 0,
        avgBand: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user && activeExam) fetchDashboardData();
    }, [user, activeExam.id]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            await fetchLastProgress();

            // 1. Get Platform Total Questions for this exam (for denominator)
            const { count: totalPlatformQ } = await (supabase as any)
                .from('practice_questions')
                .select('*', { count: 'exact', head: true })
                .eq('exam_type', activeExam.id);
            setPlatformTotalQuestions(totalPlatformQ || 0);

            // 2. Fetch User Stats (Tests)
            const { data: tests } = await (supabase as any).from('tests')
                .select('*')
                .eq('exam_type', activeExam.id)
                .order('created_at', { ascending: false });

            if (tests) {
                const totalQ = tests.reduce((acc: number, t: any) => acc + (t.total_questions || 0), 0);
                setStats(prev => ({
                    ...prev,
                    totalQuestions: totalQ,
                    streak: profile?.streak || 0
                }));
            }

            // 3. User Practice Performance
            const { data: solvedBySubject } = await (supabase as any)
                .from('user_practice_responses')
                .select('subject, is_correct, question_id')
                .eq('user_id', user!.id)
                .eq('exam_type', activeExam.id);

            const { data: totalQuestionsBySubject } = await (supabase as any)
                .from('practice_questions')
                .select('subject')
                .eq('exam_type', activeExam.id);

            let calculatedAccuracy = 0;
            let calculatedSolved = 0;

            if (totalQuestionsBySubject) {
                const mastery = await Promise.all(activeExam.sections.map(async (section: any) => {
                    const { count: realTotal } = await (supabase as any)
                        .from('practice_questions')
                        .select('*', { count: 'exact', head: true })
                        .eq('subject', section.name)
                        .eq('exam_type', activeExam.id);

                    const attemptsInSubject = solvedBySubject?.filter((q: any) => q.subject === section.name) || [];
                    const uniqueSolved = new Set(attemptsInSubject.map(a => a.question_id)).size;
                    const correctCount = attemptsInSubject.filter((q: any) => q.is_correct).length;
                    const acc = attemptsInSubject.length > 0 ? Math.round((correctCount / attemptsInSubject.length) * 100) : 0;

                    calculatedAccuracy += acc;
                    calculatedSolved += uniqueSolved;

                    return {
                        subject: section.name,
                        solved: uniqueSolved,
                        total: realTotal || 0,
                        accuracy: acc,
                    };
                }));

                calculatedAccuracy = Math.round(calculatedAccuracy / (activeExam.sections.length || 1));
                setSubjectMastery(mastery);
                setStats(prev => ({
                    ...prev,
                    solved: calculatedSolved,
                    accuracy: calculatedAccuracy
                }));
            }

            // 4. Champions League (Top 10)
            const { data: championsData } = await (supabase as any).rpc('get_champions_by_questions_solved');
            if (championsData) {
                setTopStudents(championsData.slice(0, 10).map((c: any) => ({
                    id: c.user_id,
                    display_name: c.display_name || 'Student',
                    avatar_url: c.avatar_url,
                    total_score: c.questions_solved, // Mapped to total_score for simplicity
                    tests_taken: c.total_questions,
                    accuracy: c.accuracy
                })));
            }

            // 5. IELTS Specifics
            if (activeExam.id === 'ielts-academic') {
                const [{ count: rC }, { count: lC }, { count: wC }] = await Promise.all([
                    supabase.from('reading_submissions').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
                    supabase.from('listening_submissions').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
                    supabase.from('writing_submissions').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
                ]);

                const { data: wScores } = await supabase
                    .from('writing_submissions')
                    .select('writing_feedback(overall_score)')
                    .eq('user_id', user!.id)
                    .eq('status', 'completed');

                const scores = wScores?.flatMap(w => w.writing_feedback).map((f: any) => f.overall_score).filter(s => !!s) || [];
                const avgBand = scores.length > 0 ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : 0;

                setIeltsStats({
                    reading: rC || 0,
                    listening: lC || 0,
                    writing: wC || 0,
                    avgBand
                });
            }

        } catch (e) {
            console.error("Dashboard Sync Error:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const [lastProgress, setLastProgress] = useState<any>(null);

    const fetchLastProgress = async () => {
        setLastProgress(null);
        const { data: progresses } = await (supabase as any)
            .from('learning_progress')
            .select('*, content:learning_content(*)')
            .eq('user_id', user?.id)
            .order('last_accessed_at', { ascending: false })
            .limit(10);

        if (!progresses || progresses.length === 0) return;

        for (const progress of progresses) {
            if (!progress.content) continue;
            let courseId = null;
            const c = progress.content;

            if (c.topic_id) {
                const { data: topic } = await (supabase as any).from('learning_topics').select('course_id').eq('id', c.topic_id).single();
                if (topic) courseId = topic.course_id;
            } else if (c.unit_id) {
                const { data: unit } = await (supabase as any).from('learning_units').select('topic_id').eq('id', c.unit_id).single();
                if (unit) {
                    const { data: topic } = await (supabase as any).from('learning_topics').select('course_id').eq('id', unit.topic_id).single();
                    if (topic) courseId = topic.course_id;
                }
            } else if (c.subunit_id) {
                const { data: subunit } = await (supabase as any).from('learning_subunits').select('unit_id').eq('id', c.subunit_id).single();
                if (subunit) {
                    const { data: unit } = await (supabase as any).from('learning_units').select('topic_id').eq('id', subunit.unit_id).single();
                    if (unit) {
                        const { data: topic } = await (supabase as any).from('learning_topics').select('course_id').eq('id', (unit as any).topic_id).single();
                        if (topic) courseId = topic.course_id;
                    }
                }
            }

            if (courseId) {
                const { data: course } = await (supabase as any).from('learning_courses').select('id, learning_exams(name)').eq('id', courseId).single();
                if (course && course.learning_exams) {
                    const brand = activeExam.id.split('-')[0].toLowerCase();
                    const examName = course.learning_exams.name.toLowerCase();
                    if (examName.includes(brand)) {
                        setLastProgress({ ...progress, courseId });
                        return;
                    }
                }
            }
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-[80vh] bg-background">
            <Loader2 className="w-8 h-8 animate-spin text-foreground opacity-20" />
        </div>
    );

    return (
        <div className="flex flex-col min-h-full bg-background animate-in fade-in duration-700 overflow-y-auto">
            {/* Cinematic Hero Section - Semantic Colors, No Image */}
            <header className="relative w-full h-[45vh] overflow-hidden bg-background flex flex-col justify-between p-6 pb-8 pt-12">
                {/* Gradient Mesh Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-background" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />

                <div className="relative z-20 flex justify-between items-start">
                    <h1 className="text-7xl font-black uppercase tracking-tighter text-foreground leading-[0.85] drop-shadow-sm">
                        {firstName} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Ready?</span>
                    </h1>
                </div>

                <div className="relative z-20 w-full space-y-4">
                    {lastProgress ? (
                        <div className="flex gap-4">
                            <Button
                                onClick={() => navigate('/learning', {
                                    state: {
                                        continueLearning: true,
                                        courseId: lastProgress.courseId,
                                        contentId: lastProgress.content_id
                                    }
                                })}
                                className="flex-1 h-16 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all"
                            >
                                <Play size={16} className="mr-2 fill-current" /> Resume Learning
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/mobile/practice')}
                                className="h-16 px-8 rounded-2xl border-border bg-background/50 backdrop-blur-sm text-foreground hover:bg-muted font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all"
                            >
                                <ClipboardList size={16} className="mr-2" /> Practice
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={() => navigate('/mobile/practice')}
                            className="w-full h-16 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all"
                        >
                            <Zap size={16} className="mr-2 fill-current" /> Start Learning
                        </Button>
                    )}
                </div>
            </header>

            {/* Quick Stats Row (glass) */}
            <div className="px-4 -mt-6 relative z-30">
                <div className="grid grid-cols-4 gap-2 bg-card/60 backdrop-blur-xl border border-border/10 p-3 rounded-2xl shadow-xl">
                    <MiniStat icon={Target} val={`${stats.accuracy}%`} label="Acc" color="text-emerald-500" />
                    <MiniStat icon={Zap} val={stats.streak} label="Streak" color="text-amber-500" />
                    <MiniStat icon={Play} val={stats.solved} label="Solved" color="text-indigo-500" />
                    <MiniStat icon={HistoryIcon} val={stats.totalQuestions} label="Total" color="text-cyan-500" />
                </div>
            </div>

            {/* Horizontal Scroll: Trending / Champions */}
            <section className="mt-8 space-y-4">
                <h2 className="px-6 font-black text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Trophy size={14} className="text-amber-500" /> Top Performers
                </h2>
                <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-4 snap-x">
                    {topStudents.map((student, i) => (
                        <div
                            key={student.id}
                            onClick={() => navigate(`/mobile/student/${student.id}`)}
                            className="snap-start shrink-0 w-32 aspect-[3/4] bg-gradient-to-b from-muted/50 to-transparent p-1 rounded-2xl relative group overflow-visible border border-border/10 active:scale-95 transition-all"
                        >
                            {/* Ranking Badge */}
                            <div className={cn(
                                "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs z-20 border shadow-lg",
                                i === 0 ? "bg-amber-500 text-black border-amber-300 shadow-amber-500/20" :
                                    i === 1 ? "bg-slate-300 text-black border-slate-100" :
                                        i === 2 ? "bg-orange-700 text-white border-orange-500" : "bg-background text-foreground border-border"
                            )}>
                                {i + 1}
                            </div>

                            {/* Crown for #1 - Explicitly visible outside overflow if needed, but we used overflow-visible above */}
                            {i === 0 && (
                                <div className="absolute -top-4 -right-1 z-30 transform rotate-12 drop-shadow-lg text-3xl animate-pulse">
                                    👑
                                </div>
                            )}

                            <div className="w-full h-full rounded-xl overflow-hidden relative bg-card">
                                {student.avatar_url ? (
                                    <img src={student.avatar_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className={cn("w-full h-full flex items-center justify-center", generateAvatarColor(student.display_name))}>
                                        <span className="font-black text-2xl uppercase opacity-80">{(student.display_name || '?').charAt(0)}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3">
                                    <h4 className="font-bold text-[10px] text-white truncate">{student.display_name}</h4>
                                    <p className="text-[8px] font-black text-emerald-400">
                                        {student.total_score} / {platformTotalQuestions || '?'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Horizontal Scroll: Subject Mastery (Netflix Categories) */}
            <section className="mt-4 space-y-4">
                <div className="flex justify-between items-center px-6">
                    <h2 className="font-black text-xs uppercase tracking-[0.2em] text-muted-foreground">Mission Status</h2>
                    <button onClick={() => navigate('/subjects')} className="text-[9px] font-bold text-primary uppercase tracking-widest hover:text-primary/80 transition-colors">View All</button>
                </div>

                <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-4 snap-x">
                    {subjectMastery.map((sub, i) => (
                        <div key={i} onClick={() => navigate('/subjects')} className="snap-start shrink-0 w-64 bg-card p-5 rounded-3xl border border-border/5 active:scale-95 transition-all relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                {getSubjectIcon(sub.subject)}
                                <span className={cn("text-xl font-black", sub.accuracy >= 80 ? "text-emerald-500" : sub.accuracy >= 50 ? "text-amber-500" : "text-rose-500")}>{sub.accuracy}%</span>
                            </div>
                            <h4 className="font-bold text-[13px] text-foreground uppercase tracking-tight mb-1 relative z-10">{sub.subject}</h4>
                            <div className="w-full bg-muted h-1 rounded-full overflow-hidden relative z-10">
                                <div
                                    className={cn("h-full transition-all duration-1000", sub.accuracy >= 80 ? "bg-emerald-500" : sub.accuracy >= 50 ? "bg-amber-500" : "bg-rose-500")}
                                    style={{ width: `${sub.accuracy}%` }}
                                />
                            </div>
                            <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest mt-2">{sub.solved} Solved</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Action Banner */}
            <div className="px-4 mt-6">
                <div
                    onClick={() => navigate('/apply-university')}
                    className="w-full h-40 rounded-[2rem] bg-gradient-to-r from-violet-600 to-indigo-900 relative overflow-hidden flex items-center px-8 active:scale-[0.98] transition-all shadow-xl shadow-indigo-900/20"
                >
                    <div className="absolute right-0 top-0 h-full w-1/2 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 [mask-image:linear-gradient(to_left,black,transparent)]" />
                    <div className="relative z-10 space-y-2">
                        <div className="inline-block px-2 py-1 rounded-md bg-white/20 backdrop-blur-md border border-white/10 text-[8px] font-black text-white uppercase tracking-widest">Premium Access</div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter max-w-[150px] leading-none">Apply University</h3>
                        <p className="text-[9px] text-indigo-200 font-bold max-w-[180px]">Get matched with top global universities.</p>
                    </div>
                </div>
            </div>

            {/* Quick Grid Tools */}
            <section className="mt-10 px-4 space-y-4">
                <h2 className="px-2 font-black text-xs uppercase tracking-[0.2em] text-muted-foreground">Tools</h2>
                <div className="grid grid-cols-2 gap-3">
                    <HubItem
                        icon={<HistoryIcon size={18} />}
                        label={t('menu.history')}
                        sub="Records"
                        onClick={() => navigate('/mobile/history')}
                        color="bg-emerald-500/20 text-emerald-500"
                    />
                    <HubItem
                        icon={<BarChart3 size={18} />}
                        label="Analytics"
                        sub="Data"
                        onClick={() => navigate('/mobile/analytics')}
                        color="bg-rose-500/20 text-rose-500"
                    />
                    <HubItem
                        icon={<FlaskConical size={18} />}
                        label={t('menu.labs')}
                        sub="Sims"
                        onClick={() => navigate('/mobile/labs')}
                        color="bg-cyan-500/20 text-cyan-500"
                    />
                    <HubItem
                        icon={<Bookmark size={18} />}
                        label={t('menu.bookmarks')}
                        sub="Saved"
                        onClick={() => navigate('/bookmarks')}
                        color="bg-amber-500/20 text-amber-500"
                    />
                </div>
            </section>
        </div>
    );
};

const MiniStat = ({ icon: Icon, val, label, color }: any) => (
    <div className="flex flex-col items-center">
        <span className={cn("text-sm font-black tracking-tighter text-foreground", color)}>{val}</span>
        <span className="text-[7px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">{label}</span>
    </div>
);

const HubItem = ({ icon, label, sub, onClick, color }: { icon: any, label: string, sub: string, onClick: () => void, color: string }) => (
    <div
        onClick={onClick}
        className="p-5 bg-card/50 rounded-[2rem] border border-border/10 active:bg-secondary/20 transition-all flex items-center gap-4 group"
    >
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-active:scale-90", color)}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-tight truncate text-foreground">{label}</p>
            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mt-0.5 truncate">{sub}</p>
        </div>
        <ChevronRight size={12} className="ml-auto text-muted-foreground/20 group-hover:text-foreground transition-all" />
    </div>
);

export default MobileDashboard;
