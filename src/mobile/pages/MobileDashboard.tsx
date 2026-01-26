import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Play, BookOpen, Trophy, ArrowRight, Zap, Target,
    Loader2, Sparkles, Clock as HistoryIcon, User,
    BarChart3, Bookmark, FlaskConical, GraduationCap,
    Award, ChevronRight, MessageSquare
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
    total_score: number;
    tests_taken: number;
    avatar_url?: string | null;
    accuracy?: number;
}

const MobileDashboard: React.FC = () => {
    const { user, profile } = useAuth();
    const { activeExam } = useExam();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // States
    const [recentTests, setRecentTests] = useState<any[]>([]);
    const [stats, setStats] = useState({
        solved: 0,
        accuracy: 0,
        streak: 0,
        totalQuestions: 0
    });
    const [subjectMastery, setSubjectMastery] = useState<SubjectMastery[]>([]);
    const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
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
            // 0. Fetch Continue Learning
            await fetchLastProgress();

            // 1. Fetch Tests for Stats & Activity
            const { data: tests } = await (supabase as any).from('tests')
                .select('*')
                .eq('exam_type', activeExam.id)
                .order('created_at', { ascending: false });

            if (tests) {
                const completed = tests.filter((t: any) => t.status === 'completed');
                const totalQ = tests.reduce((acc: number, t: any) => acc + (t.total_questions || 0), 0);
                setStats(prev => ({
                    ...prev,
                    totalQuestions: totalQ,
                    streak: profile?.streak || 0
                }));
                setRecentTests(tests.slice(0, 3));
            }

            // 2. Performance Tracking
            const { data: perfData } = await (supabase as any)
                .from('topic_performance')
                .select('*')
                .eq('exam_type', activeExam.id);

            if (perfData) {
                const totalSolved = perfData.reduce((acc: number, p: any) => acc + p.total_questions, 0);
                const totalCorrect = perfData.reduce((acc: number, p: any) => acc + p.correct_answers, 0);
                setStats(prev => ({
                    ...prev,
                    solved: totalSolved,
                    accuracy: totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0
                }));
            }

            // 3. Champions League
            const { data: championsData } = await (supabase as any).rpc('get_champions_by_questions_solved');
            if (championsData) {
                setTopStudents(championsData.map((c: any) => ({
                    id: c.user_id,
                    display_name: c.display_name || 'Student',
                    avatar_url: c.avatar_url,
                    total_score: c.questions_solved,
                    tests_taken: c.total_questions,
                    accuracy: c.accuracy
                })));
            }

            // 4. Subject Mastery (Real Totals)
            const { data: solvedBySubject } = await (supabase as any)
                .from('user_practice_responses')
                .select('subject, is_correct, question_id')
                .eq('user_id', user!.id)
                .eq('exam_type', activeExam.id);

            const mastery = await Promise.all(activeExam.sections.map(async (section: any) => {
                const { count: realTotal } = await (supabase as any)
                    .from('practice_questions')
                    .select('*', { count: 'exact', head: true })
                    .eq('subject', section.name)
                    .eq('exam_type', activeExam.id);

                const attemptsInSubject = solvedBySubject?.filter((q: any) => q.subject === section.name) || [];
                const correctCount = attemptsInSubject.filter((q: any) => q.is_correct).length;
                return {
                    subject: section.name,
                    solved: new Set(attemptsInSubject.map(a => a.question_id)).size,
                    total: realTotal || 0,
                    accuracy: attemptsInSubject.length > 0 ? Math.round((correctCount / attemptsInSubject.length) * 100) : 0,
                };
            }));
            setSubjectMastery(mastery);

            // 5. IELTS Specifics
            if (activeExam.id === 'ielts-academic') {
                const [{ count: rC }, { count: lC }, { count: wC }] = await Promise.all([
                    supabase.from('reading_submissions').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
                    supabase.from('listening_submissions').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
                    supabase.from('writing_submissions').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
                ]);

                // Writing Band
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
            setIsDashboardLoading(false);
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
                        const { data: topic } = await (supabase as any).from('learning_topics').select('course_id').eq('id', unit.topic_id).single();
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

    const [isDashboardLoading, setIsDashboardLoading] = useState(false);

    const weakestSubject = subjectMastery.length > 0
        ? [...subjectMastery].sort((a, b) => a.accuracy - b.accuracy)[0]
        : null;

    if (isLoading) return (
        <div className="flex items-center justify-center h-[80vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
        </div>
    );

    return (
        <div className="flex flex-col min-h-full bg-background pb-32 animate-in fade-in duration-500 overflow-y-auto">
            {/* Greeting */}
            <header className="p-6 pt-10">
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t('menu.online')}</span>
                </div>
                <h1 className="text-4xl font-black uppercase tracking-tight leading-none">Hello, <br /><span className="text-primary">{profile?.display_name?.split(' ')[0] || 'Student'}</span></h1>


                {/* Continue Learning Button */}
                {lastProgress && (
                    <div className="mt-4">
                        <button
                            onClick={() => navigate('/learning', {
                                state: {
                                    continueLearning: true,
                                    courseId: lastProgress.courseId,
                                    contentId: lastProgress.content_id
                                }
                            })}
                            className="w-full flex items-center gap-4 p-4 rounded-[2rem] bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 active:scale-[0.98] transition-all relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity" />
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
                                <Play className="w-5 h-5 fill-white" />
                            </div>
                            <div className="text-left flex-1 min-w-0">
                                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200 mb-0.5">Continue Learning</p>
                                <p className="text-sm font-black truncate">{lastProgress.content?.title || 'Resume Course'}</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-indigo-200" />
                        </button>
                    </div>
                )}
            </header>

            {/* Quick Action Card */}
            <div className="px-4">
                <Card
                    onClick={() => navigate('/mobile/practice')}
                    className="relative overflow-hidden border-none bg-foreground text-background shadow-2xl rounded-[2.5rem] active:scale-[0.98] transition-all group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 transition-transform duration-700">
                        <Zap size={150} />
                    </div>
                    <CardHeader className="pt-8 px-8 pb-2">
                        <CardTitle className="text-2xl font-black uppercase tracking-tighter">{t('dashboard.start_practicing')}</CardTitle>
                        <p className="text-background/50 text-[10px] font-black uppercase tracking-widest">Reach your target score</p>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <Button variant="secondary" className="w-full mt-4 h-14 rounded-2xl bg-background text-foreground hover:bg-background/90 font-black uppercase text-[10px] tracking-[0.2em] shadow-xl">
                            {t('dashboard.continue')}
                            <Play className="ml-2 w-4 h-4 fill-current" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Core Stats Grid */}
            <div className="grid grid-cols-2 gap-3 px-4 mt-8">
                <StatCard label={t('dashboard.accuracy')} value={stats.accuracy + '%'} icon={Target} color="text-emerald-500" />
                <StatCard label={t('dashboard.streak')} value={stats.streak + ' Days'} icon={Zap} color="text-amber-500" />
                <StatCard label={t('dashboard.solved')} value={stats.solved.toString()} icon={Play} color="text-primary" />
                <StatCard label={t('dashboard.total_q')} value={stats.totalQuestions.toString()} icon={HistoryIcon} color="text-cyan-500" />
            </div>

            {/* IELTS Grid (Conditional) */}
            {activeExam.id === 'ielts-academic' && (
                <section className="mt-10 px-4 space-y-4">
                    <h3 className="px-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">IELTS Analytics</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-secondary/10 p-5 rounded-3xl border border-border/40">
                            <span className="text-[20px] block mb-2">✍️</span>
                            <span className="text-xl font-black block">{ieltsStats.avgBand || '—'}</span>
                            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Avg Band Score</span>
                        </div>
                        <div className="bg-secondary/10 p-5 rounded-3xl border border-border/40">
                            <span className="text-[20px] block mb-2">📖</span>
                            <span className="text-xl font-black block">{ieltsStats.reading}</span>
                            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Reading Tests</span>
                        </div>
                    </div>
                </section>
            )}

            {/* Subject Mastery List */}
            <section className="mt-10 px-4 space-y-6">
                <div className="flex justify-between items-center px-2">
                    <h2 className="font-black text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <GraduationCap size={16} /> {t('dashboard.mastery')}
                    </h2>
                    <Button onClick={() => navigate('/mobile/dashboard')} variant="ghost" size="sm" className="text-[9px] font-black uppercase tracking-widest opacity-40">{t('dashboard.continue')}</Button>
                </div>
                <div className="space-y-6 bg-secondary/10 p-6 rounded-[2.5rem] border border-border/40 shadow-inner">
                    {subjectMastery.map((sub, i) => (
                        <div key={i} className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-tight">{sub.subject}</span>
                                <span className="text-xs font-black text-primary">{sub.accuracy}%</span>
                            </div>
                            <div className="h-2 bg-background rounded-full overflow-hidden border border-border/30">
                                <div className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)] transition-all duration-1000" style={{ width: sub.accuracy + '%' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Champions League (Horizontal Scroller) */}
            <section className="mt-10 space-y-6">
                <h2 className="px-6 font-black text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Trophy size={16} className="text-amber-500" /> {t('dashboard.champions_league')}
                </h2>
                <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-4">
                    {topStudents.map((student, i) => (
                        <div key={student.id} className="shrink-0 w-40 bg-secondary/10 p-5 rounded-[2rem] border border-border/40 relative overflow-hidden group">
                            {i === 0 && <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center rotate-12"><Trophy size={14} className="text-amber-500" /></div>}
                            <div className="w-12 h-12 rounded-xl bg-background border border-border/50 flex items-center justify-center overflow-hidden mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                {student.avatar_url ? <img src={student.avatar_url} className="w-full h-full object-cover" /> : <User className="text-muted-foreground opacity-30" />}
                            </div>
                            <h4 className="font-black text-[11px] uppercase truncate tracking-tight">{student.display_name}</h4>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-[9px] font-black text-primary">{student.accuracy}%</span>
                                <span className="text-[8px] font-bold text-muted-foreground uppercase opacity-40">{student.total_score} pts</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Study Tools Navigation */}
            <section className="mt-10 px-4 space-y-6">
                <h2 className="px-2 font-black text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Sparkles size={16} /> Study Tools
                </h2>
                <div className="grid grid-cols-2 gap-3">
                    <HubItem
                        icon={<HistoryIcon size={18} />}
                        label={t('menu.history')}
                        sub="Practice Records"
                        onClick={() => navigate('/mobile/history')}
                        color="bg-emerald-500/10 text-emerald-500"
                    />
                    <HubItem
                        icon={<BarChart3 size={18} />}
                        label="Analytics"
                        sub="Statistics"
                        onClick={() => navigate('/mobile/analytics')}
                        color="bg-rose-500/10 text-rose-500"
                    />
                    <HubItem
                        icon={<FlaskConical size={18} />}
                        label={t('menu.labs')}
                        sub="Practice Lab"
                        onClick={() => navigate('/mobile/labs')}
                        color="bg-indigo-500/10 text-indigo-500"
                    />
                    <HubItem
                        icon={<Bookmark size={18} />}
                        label={t('menu.bookmarks')}
                        sub="Saved Assets"
                        onClick={() => navigate('/bookmarks')}
                        color="bg-amber-500/10 text-amber-500"
                    />
                </div>
            </section>

            {/* Apply University Premium Banner */}
            <div className="px-4 mt-12 pb-12">
                <Card
                    onClick={() => navigate('/apply-university')}
                    className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 border-none rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl shadow-indigo-500/30 active:scale-[0.98] transition-all group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                        <GraduationCap size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                <Award className="text-white" size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100">Premium Admission Protocol</span>
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight mb-2">Apply University</h3>
                        <p className="text-indigo-100/60 text-xs font-bold uppercase tracking-tight leading-relaxed max-w-[200px]">Strategic consultation for global academic placement.</p>
                        <Button variant="secondary" className="mt-8 rounded-xl bg-white text-indigo-900 hover:bg-white/90 font-black uppercase text-[10px] tracking-widest px-6 h-12 shadow-inner">
                            Consult Admission
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) => (
    <Card className="bg-secondary/10 border-border/40 backdrop-blur-sm rounded-[2rem] overflow-hidden shadow-sm active:scale-95 transition-all">
        <CardContent className="p-5 flex flex-col items-center">
            <div className={cn("mb-2 p-3 rounded-2xl bg-background border border-border/50", color)}><Icon size={18} /></div>
            <div className="text-lg font-black tracking-tighter">{value}</div>
            <div className="text-[8px] uppercase tracking-widest text-muted-foreground font-black mt-1">
                {label}
            </div>
        </CardContent>
    </Card>
);

const HubItem = ({ icon, label, sub, onClick, color }: { icon: any, label: string, sub: string, onClick: () => void, color: string }) => (
    <div
        onClick={onClick}
        className="p-5 bg-secondary/10 rounded-[2rem] border border-border/40 active:bg-secondary/20 transition-all flex items-center gap-4 group"
    >
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-active:scale-90", color)}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-tight truncate">{label}</p>
            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest opacity-40 mt-0.5 truncate">{sub}</p>
        </div>
        <ChevronRight size={12} className="ml-auto opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </div>
);


export default MobileDashboard;
