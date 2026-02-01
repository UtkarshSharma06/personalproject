import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Play, BookOpen, Trophy, ArrowRight, Zap, Target,
    Loader2, Sparkles, Clock as HistoryIcon, User,
    BarChart3, Bookmark, FlaskConical, GraduationCap,
    Award, ChevronRight, Bell, Dna, Brain, Calculator,
    Languages, Database, Microscope, ClipboardList,
    Headphones, PenTool, Mic, MessageSquare, MessageCircle
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useExam } from '@/context/ExamContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { usePlanAccess } from '@/hooks/usePlanAccess';
import { UpgradeModal } from '@/components/UpgradeModal';
import { FeedbackDialog } from '@/components/FeedbackDialog';

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
    exam_total: number;
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

    const displayName = React.useMemo(() => {
        return profile?.display_name ||
            user?.user_metadata?.full_name ||
            user?.user_metadata?.name ||
            user?.user_metadata?.given_name ||
            user?.email?.split('@')[0] ||
            "Student";
    }, [profile, user]);

    const firstName = React.useMemo(() => displayName.split(' ')[0], [displayName]);

    const { activeExam } = useExam();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { isExplorer } = usePlanAccess();
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    const getSubjectIcon = (subject: string) => {
        const s = subject.toLowerCase();
        if (s.includes('biol')) return <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg"><Dna size={16} /></div>;
        if (s.includes('chem')) return <div className="p-2 bg-rose-500/20 text-rose-500 rounded-lg"><FlaskConical size={16} /></div>;
        if (s.includes('phys')) return <div className="p-2 bg-cyan-500/20 text-cyan-500 rounded-lg"><Database size={16} /></div>;
        if (s.includes('math')) return <div className="p-2 bg-amber-500/20 text-amber-500 rounded-lg"><Calculator size={16} /></div>;
        if (s.includes('logic')) return <div className="p-2 bg-indigo-500/20 text-indigo-500 rounded-lg"><Brain size={16} /></div>;

        // IELTS Specific Colorful Icons
        if (s.includes('read')) return <div className="p-2 bg-sky-500/20 text-sky-500 rounded-lg"><BookOpen size={16} /></div>;
        if (s.includes('listen')) return <div className="p-2 bg-amber-500/20 text-amber-500 rounded-lg"><Headphones size={16} /></div>;
        if (s.includes('writ')) return <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg"><PenTool size={16} /></div>;
        if (s.includes('speak')) return <div className="p-2 bg-rose-500/20 text-rose-500 rounded-lg"><Mic size={16} /></div>;
        if (s.includes('comm')) return <div className="p-2 bg-violet-500/20 text-violet-500 rounded-lg"><MessageSquare size={16} /></div>;

        if (s.includes('read') || s.includes('listen') || s.includes('writ') || s.includes('speak')) return <div className="p-2 bg-violet-500/20 text-violet-500 rounded-lg"><Languages size={16} /></div>;
        return <div className="p-2 bg-slate-500/20 text-slate-500 rounded-lg"><BookOpen size={16} /></div>;
    };

    const [stats, setStats] = useState({
        solved: 0,
        accuracy: 0,
        streak: 0,
        totalQuestions: 0,
        mockSolved: 0
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
            // Run high-level independent queries in parallel
            const [
                _progress,
                totalPlatformRes,
                testsRes,
                solvedRes,
                championsRes,
                ieltsExtraRes
            ] = await Promise.all([
                fetchLastProgress(),
                (supabase as any).from('practice_questions').select('*', { count: 'exact', head: true }).eq('exam_type', activeExam.id),
                (supabase as any).from('tests').select('total_questions, created_at, test_type, status').eq('exam_type', activeExam.id),
                (supabase as any).from('user_practice_responses').select('subject, is_correct, question_id').eq('user_id', user!.id).eq('exam_type', activeExam.id),
                (supabase as any).rpc('get_champions_by_questions_solved', { target_exam_id: activeExam.id }),
                activeExam.id === 'ielts-academic' ? Promise.all([
                    supabase.from('reading_submissions').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
                    supabase.from('listening_submissions').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
                    supabase.from('writing_submissions').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
                    supabase.from('writing_submissions').select('writing_feedback(overall_score)').eq('user_id', user!.id).eq('status', 'completed')
                ]) : Promise.resolve(null)
            ]);

            // 1. Platform Total
            setPlatformTotalQuestions(totalPlatformRes.count || 0);

            // 2. User Stats (Tests)
            if (testsRes.data) {
                const totalQ = (testsRes.data as any[]).reduce((acc: number, t: any) => acc + (t.total_questions || 0), 0);

                // Calculate streak
                const { data: learningProgress } = await supabase
                    .from('learning_progress')
                    .select('last_accessed_at')
                    .eq('user_id', user!.id);

                const activeDates = new Set([
                    ...(testsRes.data as any[]).map((t: any) => format(new Date(t.created_at), 'yyyy-MM-dd')),
                    ...(learningProgress || []).map((p: any) => format(new Date(p.last_accessed_at), 'yyyy-MM-dd'))
                ]);

                let streak = 0;
                let checkDate = new Date();

                // Check if user was active today or yesterday to continue/start streak
                const today = format(new Date(), 'yyyy-MM-dd');
                const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

                if (activeDates.has(today)) {
                    // Streak is active including today
                    while (activeDates.has(format(checkDate, 'yyyy-MM-dd'))) {
                        streak++;
                        checkDate = subDays(checkDate, 1);
                    }
                } else if (activeDates.has(yesterday)) {
                    // Streak was active until yesterday, but not today (yet)
                    checkDate = subDays(new Date(), 1);
                    while (activeDates.has(format(checkDate, 'yyyy-MM-dd'))) {
                        streak++;
                        checkDate = subDays(checkDate, 1);
                    }
                } else {
                    // No activity today or yesterday, streak is 0
                    streak = 0;
                }

                const mockSolved = (testsRes.data as any[]).filter((t: any) => t.test_type === 'mock').length;

                setStats(prev => ({
                    ...prev,
                    totalQuestions: totalQ,
                    streak: streak,
                    mockSolved: mockSolved
                }));
            }

            // 3. Practice Performance & Mastery
            const solvedBySubject = solvedRes.data || [];

            // Optimization: Get counts for all subjects in one query instead of a loop
            const { data: questionCounts } = await (supabase as any)
                .from('practice_questions')
                .select('subject')
                .eq('exam_type', activeExam.id);

            const subjectCountsMap: Record<string, number> = {};
            questionCounts?.forEach((q: any) => {
                subjectCountsMap[q.subject] = (subjectCountsMap[q.subject] || 0) + 1;
            });

            let calculatedAccuracy = 0;
            let calculatedSolved = 0;

            const mastery = activeExam.sections.map((section: any) => {
                const realTotal = subjectCountsMap[section.name] || 0;
                const attemptsInSubject = solvedBySubject.filter((q: any) => q.subject === section.name);
                const uniqueSolvedIds = new Set(attemptsInSubject.map(a => a.question_id));
                const uniqueSolved = uniqueSolvedIds.size;
                const correctCount = attemptsInSubject.filter((q: any) => q.is_correct).length;
                const acc = attemptsInSubject.length > 0 ? Math.round((correctCount / attemptsInSubject.length) * 100) : 0;

                calculatedAccuracy += acc;
                calculatedSolved += uniqueSolved;

                return {
                    subject: section.name,
                    solved: uniqueSolved,
                    total: realTotal,
                    accuracy: acc,
                };
            });

            const totalAttempts = solvedBySubject.length;
            const totalCorrect = solvedBySubject.filter((q: any) => q.is_correct).length;
            const globalAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

            setSubjectMastery(mastery);
            setStats(prev => ({
                ...prev,
                solved: calculatedSolved,
                accuracy: globalAccuracy
            }));

            // 4. Champions League
            console.log("Mobile Champions Raw Data:", championsRes.data);
            if (championsRes.data) {
                const mappedChampions = championsRes.data.slice(0, 10).map((c: any) => ({
                    id: c.user_id,
                    display_name: c.display_name || 'Student',
                    avatar_url: c.avatar_url,
                    total_score: c.questions_solved,
                    exam_total: c.total_questions,
                    accuracy: c.accuracy
                }));
                console.log("Mapped Mobile Champions:", mappedChampions);
                setTopStudents(mappedChampions);
            }

            // 5. IELTS Specifics
            if (ieltsExtraRes) {
                const [rC, lC, wC, wScores] = ieltsExtraRes;
                const scores = (wScores.data as any[])?.flatMap(w => w.writing_feedback).map((f: any) => f.overall_score).filter(s => !!s) || [];
                const avgBand = scores.length > 0 ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : 0;

                setIeltsStats({
                    reading: rC.count || 0,
                    listening: lC.count || 0,
                    writing: wC.count || 0,
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
        try {
            // Optimized: Fetch recent progress with joined content and related unit/topic data
            // To keep it simple but efficient, we fetch the 5 most recent and filter
            const { data: progresses, error } = await supabase
                .from('learning_progress')
                .select(`
                    *,
                    content:learning_content(
                        *,
                        subunit:learning_subunits(
                            unit:learning_units(
                                topic:learning_topics(
                                    course_id,
                                    course:learning_courses(
                                        learning_exams(name)
                                    )
                                )
                            )
                        ),
                        unit:learning_units(
                            topic:learning_topics(
                                course_id,
                                course:learning_courses(
                                    learning_exams(name)
                                )
                            )
                        ),
                        topic:learning_topics(
                            course_id,
                            course:learning_courses(
                                learning_exams(name)
                            )
                        )
                    )
                `)
                .eq('user_id', user?.id)
                .order('last_accessed_at', { ascending: false })
                .limit(5);

            if (error || !progresses || progresses.length === 0) return;

            const brand = activeExam.id.split('-')[0].toLowerCase();

            for (const progress of progresses) {
                const c = progress.content as any;
                if (!c) continue;

                // Determine course info through the hierarchy
                let courseInfo = null;
                if (c.subunit?.unit?.topic?.course) {
                    courseInfo = c.subunit.unit.topic.course;
                } else if (c.unit?.topic?.course) {
                    courseInfo = c.unit.topic.course;
                } else if (c.topic?.course) {
                    courseInfo = c.topic.course;
                }

                if (courseInfo && courseInfo.learning_exams) {
                    const examName = courseInfo.learning_exams.name.toLowerCase();
                    if (examName.includes(brand)) {
                        // Extract courseId for the state
                        let courseId = null;
                        if (c.subunit?.unit?.topic?.course_id) courseId = c.subunit.unit.topic.course_id;
                        else if (c.unit?.topic?.course_id) courseId = c.unit.topic.course_id;
                        else if (c.topic?.course_id) courseId = c.topic.course_id;

                        setLastProgress({ ...progress, courseId });
                        return;
                    }
                }
            }
        } catch (err) {
            console.error("Error fetching progress:", err);
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

                <div className="relative z-20 w-full flex flex-row flex-wrap gap-2 mb-8">
                    {lastProgress ? (
                        <>
                            <Button
                                onClick={() => navigate('/learning', {
                                    state: {
                                        continueLearning: true,
                                        courseId: lastProgress.courseId,
                                        contentId: lastProgress.content_id
                                    }
                                })}
                                className="flex-[1.5] min-w-[120px] h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all px-4"
                            >
                                <Play size={14} className="mr-2 fill-current" /> Resume
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/mobile/practice')}
                                className="flex-1 min-w-[100px] h-14 rounded-2xl border-border bg-background/50 backdrop-blur-sm text-foreground hover:bg-muted font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all px-4"
                            >
                                <ClipboardList size={14} className="mr-2" /> Practice
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={() => navigate('/mobile/practice')}
                            className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest text-[11px] shadow-lg active:scale-95 transition-all"
                        >
                            <Zap size={16} className="mr-2 fill-current" /> Start Learning
                        </Button>
                    )}
                </div>
            </header>

            {/* Quick Stats Row (glass) */}
            <div className="px-4 -mt-6 relative z-30">
                <div className="grid grid-cols-5 gap-1 bg-card/60 backdrop-blur-xl border border-border/10 p-2 rounded-2xl shadow-xl">
                    <MiniStat icon={Target} val={`${stats.accuracy}%`} label="Acc" color="text-emerald-500" />
                    <MiniStat icon={Zap} val={`${stats.streak}d`} label="Streak" color="text-amber-500" />
                    <MiniStat icon={Play} val={stats.solved} label="Solved" color="text-indigo-500" />
                    <MiniStat icon={ClipboardList} val={stats.mockSolved} label="Mocks" color="text-rose-500" />
                    <MiniStat icon={HistoryIcon} val={stats.totalQuestions} label="Total" color="text-cyan-500" />
                </div>
            </div>

            {/* Horizontal Scroll: Trending / Champions */}
            <section className="mt-8 space-y-4">
                <h2 className="px-6 font-black text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Trophy size={14} className="text-amber-500" /> Top Performers
                </h2>
                <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-4 snap-x min-h-[160px] items-center">
                    {topStudents.length > 0 ? (
                        topStudents.map((student, i) => (
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

                                {/* Crown for #1 */}
                                {i === 0 && (
                                    <div className="absolute -top-4 -right-1 z-30 transform rotate-12 drop-shadow-lg text-3xl animate-pulse">
                                        👑
                                    </div>
                                )}

                                <div className="w-full h-full rounded-xl overflow-hidden relative bg-card">
                                    <StudentAvatar student={student} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <h4 className="font-bold text-[10px] text-white truncate">{student.display_name}</h4>
                                        <p className="text-[8px] font-black text-emerald-400">
                                            {student.total_score} / {student.exam_total ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full py-8 text-center bg-card/50 rounded-[2rem] border border-dashed border-border/50">
                            <Sparkles className="w-8 h-8 mx-auto text-primary/30 mb-2 animate-pulse" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Data still calculating...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Horizontal Scroll: Subject Mastery (Netflix Categories) */}
            <section className="mt-4 space-y-4">
                <div className="flex justify-between items-center px-6">
                    <h2 className="font-black text-xs uppercase tracking-[0.2em] text-muted-foreground">Learning Progress</h2>
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

            {/* Premium Upsell for Explorer Users */}
            {isExplorer && (
                <section className="mt-8 px-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all" onClick={() => setIsUpgradeModalOpen(true)}>
                        <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12"><Sparkles size={100} /></div>
                        <div className="relative z-10 space-y-4">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                                <Zap className="text-white w-6 h-6 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight leading-none">Upgrade to <span className="text-amber-400">PRO</span></h3>
                                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-2">Unlock unlimited practice & expert insights.</p>
                            </div>
                            <Button className="w-full bg-white text-indigo-600 hover:bg-white/90 font-black text-[10px] uppercase tracking-widest h-12 rounded-xl">
                                Unlock Premium Access
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* Quick Grid Tools */}
            <section className="mt-10 px-4 space-y-4">
                <h2 className="px-2 font-black text-xs uppercase tracking-[0.2em] text-muted-foreground">Tools</h2>
                <div className="grid grid-cols-2 gap-3">
                    <HubItem
                        icon={<HistoryIcon size={18} />}
                        label={t('menu.history')}
                        sub="Records"
                        onClick={() => navigate('/history')}
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

            {/* Compact WhatsApp & Feedback Hub (Mobile) */}
            <section className="mt-10 px-4 pb-10 space-y-3">
                <div
                    onClick={() => window.open('https://chat.whatsapp.com/HMrIISJM6LUEIxgTxSMQp7', '_blank')}
                    className="group relative flex items-center justify-between p-4 rounded-3xl bg-[#075E54] text-white cursor-pointer shadow-xl shadow-emerald-900/10 active:scale-[0.98] transition-all border border-white/10 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 blur-2xl rounded-full -mr-12 -mt-12" />

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="shrink-0 w-11 h-11 rounded-2xl bg-white text-[#075E54] flex items-center justify-center shadow-lg group-active:rotate-12 transition-transform">
                            <MessageCircle size={22} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <h4 className="text-sm font-black uppercase tracking-tight">WhatsApp Squad</h4>
                                <div className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                            </div>
                            <p className="text-[10px] font-bold text-emerald-100/60 uppercase tracking-widest truncate">
                                2000+ Students Preparing 🎒
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>

                {/* Compact Feedback Form Card */}
                <FeedbackDialog trigger={
                    <div
                        className="group relative flex items-center gap-4 p-4 rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-slate-900 text-white cursor-pointer shadow-xl shadow-indigo-900/10 active:scale-[0.98] transition-all border border-white/5 overflow-hidden"
                    >
                        <div className="shrink-0 w-12 h-12 rounded-2xl bg-white text-indigo-600 flex items-center justify-center shadow-lg group-active:scale-110 transition-transform">
                            <ClipboardList size={24} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="text-sm font-black uppercase tracking-tight">Help us Improve</h4>
                                <div className="h-1 w-1 rounded-full bg-indigo-400 animate-pulse" />
                            </div>
                            <p className="text-[9px] font-bold text-indigo-100/60 uppercase tracking-widest truncate">
                                Share your Feedback 🌟
                            </p>
                        </div>

                        <div className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <ChevronRight size={16} />
                        </div>
                    </div>
                } />
            </section>

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                title="Premium Platform"
                description="Your current access level is Explorer. Upgrade to PRO to access full performance analysis and unlimited practice sessions."
                feature="Full Platform Access"
            />
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
        className="p-3 bg-card/50 rounded-[1.5rem] border border-border/10 active:bg-secondary/20 transition-all flex items-center gap-2 group min-w-0"
    >
        <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform group-active:scale-90", color)}>
            {React.cloneElement(icon as React.ReactElement, { size: 16 })}
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-tight truncate text-foreground leading-tight">{label}</p>
            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mt-0.5 truncate opacity-60 leading-tight">{sub}</p>
        </div>
        <ChevronRight size={10} className="ml-auto text-muted-foreground/20 group-hover:text-foreground transition-all shrink-0" />
    </div>
);

const StudentAvatar = ({ student }: { student: TopStudent }) => {
    const [hasError, setHasError] = useState(false);

    if (student.avatar_url && !hasError) {
        return (
            <img
                src={student.avatar_url}
                onError={() => setHasError(true)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
        );
    }

    return (
        <div className={cn("w-full h-full flex items-center justify-center", generateAvatarColor(student.display_name))}>
            <span className="font-black text-2xl uppercase opacity-80">{(student.display_name || 'Student').charAt(0)}</span>
        </div>
    );
};

export default MobileDashboard;
