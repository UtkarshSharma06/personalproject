import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
    Zap,
    Clock,
    Trophy,
    Play,
    Users,
    CreditCard,
    ChevronRight,
    Search,
    BookOpen,
    Brain,
    Sparkles,
    BarChart3,
    Award
} from 'lucide-react';
import { subDays } from 'date-fns';
import { useExam } from '@/context/ExamContext';

interface SubjectMastery {
    subject: string;
    solved: number;
    total: number;
    accuracy: number;
}

interface TopStudent {
    id: string;
    display_name: string;
    email: string | null;
    total_score: number;
    tests_taken: number;
}

export default function Dashboard() {
    const { user, loading, profile } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const { activeExam } = useExam();
    const [stats, setStats] = useState({
        totalQuestions: 0,
        streak: 0,
        avgTime: 0,
        mockExams: 2,
    });
    const [subjectMastery, setSubjectMastery] = useState<SubjectMastery[]>([]);
    const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
    const [ieltsStats, setIeltsStats] = useState({
        reading: 0,
        listening: 0,
        writing: 0,
        avgBand: 0
    });
    const [recentEvaluations, setRecentEvaluations] = useState<any[]>([]);
    const [isDashboardLoading, setIsDashboardLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/auth');
        } else if (!loading && user && profile && (!profile.selected_exam || !profile.selected_plan) && location.pathname !== '/onboarding') {
            navigate('/onboarding');
        }
    }, [user, loading, profile, navigate, location.pathname]);

    useEffect(() => {
        if (user && activeExam) {
            loadAllDashboardData();
        }
    }, [user, activeExam.id]);

    const loadAllDashboardData = async () => {
        setIsDashboardLoading(true);
        try {
            // Run all independent fetches
            await Promise.all([
                fetchDashboardData(),
                fetchTopStudents(),
                fetchLastProgress()
            ]);
        } catch (error) {
            console.error("Dashboard Sync Error:", error);
        } finally {
            // Slight delay for smooth transition
            setTimeout(() => setIsDashboardLoading(false), 500);
        }
    };

    const fetchTopStudents = async () => {
        const { data: testsData } = await (supabase as any)
            .from('tests')
            .select('user_id, score, correct_answers')
            .eq('status', 'completed')
            .eq('exam_type', activeExam.id)
            .not('score', 'is', null);

        if (!testsData || testsData.length === 0) return;

        const userScores: Record<string, { totalScore: number; testsTaken: number }> = {};
        testsData.forEach((test: any) => {
            if (!userScores[test.user_id]) {
                userScores[test.user_id] = { totalScore: 0, testsTaken: 0 };
            }
            userScores[test.user_id].totalScore += (test.correct_answers || 0);
            userScores[test.user_id].testsTaken += 1;
        });

        const topUserIds = Object.entries(userScores)
            .sort((a, b) => b[1].totalScore - a[1].totalScore)
            .slice(0, 5)
            .map(([userId]) => userId);

        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, display_name, email')
            .in('id', topUserIds);

        const studentsWithScores: TopStudent[] = topUserIds.map(userId => {
            const profile = profiles?.find((p: any) => p.id === userId);
            const scores = userScores[userId];
            return {
                id: userId,
                display_name: profile?.display_name || profile?.email?.split('@')[0] || 'Anonymous',
                email: profile?.email,
                total_score: scores.totalScore,
                tests_taken: scores.testsTaken,
            };
        });

        setTopStudents(studentsWithScores);
    };

    const fetchDashboardData = async () => {
        // 1. Fetch Tests
        const { data: tests } = await (supabase as any).from('tests')
            .select('*')
            .eq('exam_type', activeExam.id)
            .order('created_at', { ascending: false });

        if (tests) {
            const completedTests = tests.filter((t: any) => t.status === 'completed');
            const totalQuestions = tests.reduce((acc: number, t: any) => acc + (t.total_questions || 0), 0);
            const avgTime = completedTests.length > 0
                ? Math.round(completedTests.reduce((acc: number, t: any) => acc + (t.time_taken_seconds || 0), 0) / completedTests.length)
                : 0;

            const activeDates = new Set(tests.map((t: any) => format(new Date(t.created_at), 'yyyy-MM-dd')));
            let streak = 0;
            let checkDate = new Date();
            while (activeDates.has(format(checkDate, 'yyyy-MM-dd'))) {
                streak++;
                checkDate = subDays(checkDate, 1);
            }

            setStats(prev => ({
                ...prev,
                totalQuestions,
                streak,
                avgTime,
            }));
        }

        // 1.5 Fetch IELTS Module Stats
        const [
            { count: readingCount },
            { count: listeningCount },
            { count: writingCount }
        ] = await Promise.all([
            supabase.from('reading_submissions').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
            supabase.from('listening_submissions').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
            supabase.from('writing_submissions').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
        ]);

        // Fetch Avg Band for Writing
        // We join via writing_submissions to filter by user_id
        const { data: userWritingScores } = await supabase
            .from('writing_submissions')
            .select('id, created_at, status, writing_feedback(overall_score)')
            .eq('user_id', user!.id)
            .in('status', ['pending', 'completed'])
            .order('created_at', { ascending: false });

        const scores = userWritingScores
            ?.filter(w => w.status === 'completed')
            ?.flatMap(w => w.writing_feedback)
            .map((f: any) => f.overall_score)
            .filter(s => s !== null && s !== undefined) || [];

        const avgBandScore = scores.length > 0
            ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
            : 0;

        setIeltsStats({
            reading: readingCount || 0,
            listening: listeningCount || 0,
            writing: writingCount || 0,
            avgBand: avgBandScore
        });

        setRecentEvaluations(userWritingScores?.slice(0, 3) || []);

        // 2. Fetch Performance & Manual Practice Progress
        const { data: totalQuestionsBySubject } = await (supabase as any)
            .from('practice_questions')
            .select('subject')
            .eq('exam_type', activeExam.id);

        const { data: solvedBySubject } = await (supabase as any)
            .from('user_practice_responses')
            .select('subject, is_correct')
            .eq('user_id', user!.id)
            .eq('exam_type', activeExam.id);

        if (totalQuestionsBySubject) {
            const mastery = await Promise.all(activeExam.sections.map(async (section: any) => {
                const { count: realTotal } = await (supabase as any)
                    .from('practice_questions')
                    .select('*', { count: 'exact', head: true })
                    .eq('subject', section.name)
                    .eq('exam_type', activeExam.id);

                const attemptsInSubject = solvedBySubject?.filter((q: any) => q.subject === section.name) || [];
                const solvedCount = attemptsInSubject.length;
                const correctCount = attemptsInSubject.filter((q: any) => q.is_correct).length;

                const finalTotal = realTotal || (section.questionCount * 10);

                return {
                    subject: section.name,
                    solved: solvedCount,
                    total: finalTotal,
                    accuracy: solvedCount > 0
                        ? Math.round((correctCount / solvedCount) * 100)
                        : 0,
                };
            }));
            setSubjectMastery(mastery);
        } else {
            setSubjectMastery(activeExam.sections.map((s: any) => ({
                subject: s.name,
                solved: 0,
                total: s.questionCount * 10,
                accuracy: 0,
            })));
        }

        // 3. Fetch Continue Learning (Last Progress)
        fetchLastProgress();
    };

    const handleConsultMission = () => {
        if (!weakestSubject) return;

        const params = new URLSearchParams({
            subject: weakestSubject.subject,
            count: '10',
            mode: 'practice',
            auto: 'true'
        });

        const url = `/start-test?${params.toString()}`;
        const width = 1200;
        const height = 800;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        window.open(
            url,
            'ItalostudyMissionWindow',
            `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
        );

        toast({
            title: 'Italostudy Mission Initialization',
            description: `Initializing targeted remediation for ${weakestSubject.subject}.`,
        });
    };

    const [lastProgress, setLastProgress] = useState<any>(null);

    const fetchLastProgress = async () => {
        setLastProgress(null); // Clear previous to prevent cross-exam bleed

        // Fetch last 10 progress entries to find one matching current exam
        const { data: progresses } = await (supabase as any)
            .from('learning_progress')
            .select('*, content:learning_content(*)')
            .eq('user_id', user?.id)
            .order('last_accessed_at', { ascending: false })
            .limit(10);

        if (!progresses || progresses.length === 0) return;

        // Find match for current exam
        for (const progress of progresses) {
            if (!progress.content) continue;

            // Resolve Course ID logic
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
                // Verify if this course belongs to the active exam
                const { data: course } = await (supabase as any)
                    .from('learning_courses')
                    .select('id, learning_exams(name)')
                    .eq('id', courseId)
                    .single();

                if (course && course.learning_exams) {
                    const brand = activeExam.id.split('-')[0].toLowerCase();
                    const examName = course.learning_exams.name.toLowerCase();

                    if (examName.includes(brand)) {
                        setLastProgress({
                            ...progress,
                            courseId
                        });
                        return; // Found our match
                    }
                }
            }
        }
    };

    const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Student';

    // Calculate Dynamic Insights
    const weakestSubject = subjectMastery.length > 0
        ? [...subjectMastery].sort((a, b) => a.accuracy - b.accuracy)[0]
        : null;

    const overallAccuracy = subjectMastery.reduce((acc, curr) => acc + curr.accuracy, 0) / (subjectMastery.length || 1);
    const oracleProjection = overallAccuracy.toFixed(1);

    const missionText = weakestSubject && weakestSubject.solved > 0
        ? (
            <>
                Focus on <span className="underline decoration-indigo-300 underline-offset-4 decoration-2">{weakestSubject.subject}</span>.
                Recent data suggests a {100 - weakestSubject.accuracy}% logic gap in this sector.
            </>
        ) : (
            "Complete 3 practice missions to unlock advanced performance insights."
        );

    if (loading || isDashboardLoading) {
        return (
            <Layout>
                <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
                    <div className="relative mb-8">
                        <div className="w-24 h-24 border-4 border-indigo-100 dark:border-indigo-900 rounded-full animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Brain className="w-10 h-10 text-indigo-600 animate-bounce" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2">Syncing Study Data</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Optimizing your personalized curriculum...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl w-full">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* Hero Section (Sleek/Open) */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100 dark:border-border">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none mb-4">
                                    Hi, <span className="text-indigo-600">{displayName}</span>
                                </h1>
                                <p className="text-xl font-bold text-slate-400">Ready to work!</p>
                            </div>

                            {lastProgress ? (
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                    <button
                                        onClick={() => navigate('/learning', {
                                            state: {
                                                continueLearning: true,
                                                courseId: lastProgress.courseId,
                                                contentId: lastProgress.content_id
                                            }
                                        })}
                                        className="group relative overflow-hidden bg-slate-900 text-white rounded-2xl pl-6 pr-8 py-4 flex items-center gap-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all w-full sm:w-auto"
                                    >
                                        <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="relative z-10 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                            <Play className="w-5 h-5 fill-white" />
                                        </div>

                                        <div className="relative z-10 text-left">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-indigo-300 group-hover:text-white/80 mb-1">Continue Learning</p>
                                            <p className="text-sm font-bold leading-tight max-w-[150px] truncate">{lastProgress.content?.title || 'Unknown Lesson'}</p>
                                        </div>
                                    </button>

                                    <Button
                                        variant="outline"
                                        onClick={() => navigate('/practice')}
                                        className="h-14 sm:h-20 w-full sm:w-20 rounded-2xl border-2 border-slate-100 dark:border-border hover:border-indigo-100 hover:bg-indigo-50 flex sm:flex-col flex-row gap-2 items-center justify-center group"
                                    >
                                        <Zap className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600">Practice Arena</span>
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    onClick={() => navigate('/practice')}
                                    className="bg-slate-900 text-white hover:bg-slate-800 font-bold px-6 md:px-10 py-7 rounded-2xl flex items-center gap-3 active:scale-95 transition-all shadow-sm group h-14 w-full md:w-auto"
                                >
                                    <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
                                    Start Practicing
                                </Button>
                            )}
                        </div>

                        {/* Stats Cards (Thin Borders) */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            {[
                                { label: 'TOTAL QUESTIONS', value: stats.totalQuestions, icon: Search, color: 'text-indigo-600', bg: 'bg-indigo-50/50' },
                                { label: 'STREAK', value: `${stats.streak} days`, icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50/50' },
                                { label: 'AVG TIME', value: `${stats.avgTime}s`, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
                                { label: 'PERFORMANCE INDEX', value: oracleProjection, icon: Trophy, color: 'text-indigo-600', bg: 'bg-slate-900', isDark: true },
                            ].map((stat, i) => (
                                <div key={i} className={`
                                    ${stat.isDark ? 'bg-slate-900 border-slate-950 border-b-4 shadow-slate-900/20' : 'bg-white dark:bg-card border-slate-200 dark:border-border border-b-4 shadow-slate-200'}
                                    p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative`}>
                                    {!stat.isDark && <div className={`absolute -top-1 -right-1 w-12 h-12 ${stat.bg} rounded-bl-[2rem] opacity-50 transition-transform group-hover:scale-125`} />}
                                    <p className={`text-[10px] font-black ${stat.isDark ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-widest mb-2`}>{stat.label}</p>
                                    <div className="flex items-center justify-between">
                                        <p className={`text-xl sm:text-2xl font-black ${stat.isDark ? 'text-white' : 'text-slate-900'} tracking-tight`}>{stat.value}</p>
                                        <stat.icon className={`w-4 h-4 ${stat.isDark ? 'text-indigo-400' : stat.color} opacity-40`} />
                                    </div>
                                </div>
                            ))}
                        </div>









                        {/* AI Strategic Summary (NEW) */}
                        <div className="bg-indigo-600 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] text-white relative overflow-hidden group shadow-2xl shadow-indigo-200 border-b-[8px] border-indigo-800 active:border-b-0 active:translate-y-2 transition-all duration-200">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(255,255,255,0.2),transparent_70%)]" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
                                        <Trophy className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-tight">Curriculum Mission Report</h3>
                                        <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest opacity-60">Strategic Performance</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-lg md:text-xl font-bold tracking-tight leading-relaxed">
                                        "{missionText}"
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                        <Button
                                            onClick={handleConsultMission}
                                            className="bg-white dark:bg-card text-indigo-600 hover:bg-indigo-50 font-black rounded-xl h-10 px-4 md:px-6 text-[10px] uppercase tracking-widest border-none items-center gap-2 w-full sm:w-auto"
                                        >
                                            <Brain className="w-3 h-3" />
                                            Consult AI Mission
                                        </Button>
                                        <Link to="/analytics" className="w-full sm:w-auto">
                                            <Button variant="ghost" className="text-white hover:bg-white/10 font-black rounded-xl h-10 px-4 md:px-6 text-[10px] uppercase tracking-widest border border-white/20 w-full">
                                                Full Intel
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* IELTS Mission Stats (Only for IELTS) */}
                        {activeExam.id === 'ielts-academic' && (
                            <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm">
                                        <Award className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">IELTS Mission Stats</h2>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Completion Breakdown</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                    {
                                        [
                                            { label: 'Reading Missions', count: ieltsStats.reading, icon: '📖', color: 'blue' },
                                            { label: 'Listening Missions', count: ieltsStats.listening, icon: '🎧', color: 'purple' },
                                            { label: 'Writing Missions', count: ieltsStats.writing, icon: '✍️', color: 'green' },
                                            { label: 'Writing Band', count: ieltsStats.avgBand || '—', icon: '🏆', color: 'orange' }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white dark:bg-card p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-slate-100 dark:border-border border-b-[6px] shadow-xl shadow-slate-200/50 group hover:border-slate-300 transition-all">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="text-2xl">{stat.icon}</div>
                                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                                </div>
                                                <p className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-1 tracking-tight">{stat.count}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Subject Mastery Section */}
                        <div className="bg-white dark:bg-card p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border-2 border-slate-100 dark:border-border border-b-[6px] shadow-xl shadow-slate-200/50">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Subject Mastery</h2>
                                <Link to="/subjects" className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-1">
                                    View Full Report <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>

                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                                {subjectMastery.slice(0, 4).map((subject, i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-muted border border-slate-100 dark:border-border flex items-center justify-center text-lg group-hover:bg-white dark:bg-card group-hover:border-slate-300 transition-all duration-300">
                                                    {subject.subject === 'Mathematics' ? '📐' :
                                                        subject.subject === 'Biology' ? '🧬' :
                                                            subject.subject === 'Chemistry' ? '⚗️' :
                                                                subject.subject.includes('Reasoning') ? '🧠' : '⚛️'}
                                                </div>
                                                <span className="font-bold text-slate-800 text-sm tracking-tight">{subject.subject}</span>
                                            </div>
                                            <span className="text-[13px] font-black text-slate-900 dark:text-slate-100 dark:text-slate-100">{subject.accuracy}%</span>
                                        </div>
                                        <div className="h-2.5 bg-slate-50 dark:bg-muted rounded-full overflow-hidden border border-slate-100/50 p-[2px]">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                                                style={{ width: `${subject.accuracy}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
                        {/* Recent Writing Evaluations */}
                        {activeExam.id === 'ielts-academic' && recentEvaluations.length > 0 && (
                            <div className="bg-white dark:bg-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-2 border-slate-100 dark:border-border shadow-xl shadow-slate-200/50 overflow-hidden border-b-[6px]">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm">
                                        <Sparkles className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 leading-none tracking-tight">Recent Evaluations</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 opacity-60">Writing Progress</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {recentEvaluations.map((evalItem: any) => (
                                        <div
                                            key={evalItem.id}
                                            className="group flex flex-col gap-3 transition-all hover:translate-x-1 border-b border-slate-50 dark:border-slate-800 pb-4 last:border-0 last:pb-0 cursor-pointer"
                                            onClick={() => navigate(`/writing/results/${evalItem.id}`)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-muted border border-slate-100 dark:border-border flex items-center justify-center text-lg shrink-0 group-hover:bg-indigo-600 transition-colors group-hover:text-white">
                                                    ✍️
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[11px] font-black text-slate-900 dark:text-slate-100 truncate uppercase tracking-tight mb-0.5">IELTS Writing</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                                        {format(new Date(evalItem.created_at), 'MMM d, h:mm a')}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    {evalItem.status === 'completed' && evalItem.writing_feedback?.[0] ? (
                                                        <>
                                                            <p className="text-lg font-black text-indigo-600 leading-none">
                                                                {evalItem.writing_feedback[0].overall_score}
                                                            </p>
                                                            <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest mt-1">Band Score</p>
                                                        </>
                                                    ) : (
                                                        <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse ml-auto" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border ${evalItem.status === 'completed'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-amber-100 text-amber-700 border-amber-200'
                                                    }`}>
                                                    {evalItem.status === 'completed' ? 'Evaluated' : 'In Review'}
                                                </div>
                                                <p className="text-[8px] font-bold text-slate-300 uppercase opacity-50">ID: {evalItem.id.split('-')[0]}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        variant="ghost"
                                        onClick={() => navigate('/writing/history')}
                                        className="w-full text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 mt-2"
                                    >
                                        View All Evaluations
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* WhatsApp Join Card (Sleek Green) */}
                        <div className="bg-[#25D366] p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] text-white text-center relative overflow-hidden group transition-all hover:-translate-y-1 shadow-xl shadow-emerald-500/20 border-b-[6px] border-[#1da851] active:border-b-0 active:translate-y-1">
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30 group-hover:scale-110 transition-transform">
                                    <Users className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-black mb-1 leading-tight tracking-tight">WhatsApp Community</h3>
                                <p className="font-bold text-emerald-50 text-[10px] uppercase tracking-[0.2em] mb-8">Join other students</p>
                                <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 font-black py-4 rounded-xl border border-white/10 shadow-lg active:scale-95 transition-all h-14 text-xs tracking-widest uppercase">
                                    Join Now
                                </Button>
                            </div>
                        </div>

                        {/* Top Students Leaderboard (Champions League Style) */}
                        <div className="bg-white dark:bg-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-2 border-slate-100 dark:border-border shadow-xl shadow-slate-200/50 overflow-hidden border-b-[6px]">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-100">
                                    <Trophy className="w-5 h-5 text-orange-500" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 leading-none tracking-tight">Top Students</h3>
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1.5 opacity-60">Champions League</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {topStudents.map((student, i) => (
                                    <div key={student.id} className="flex items-center gap-4 transition-all hover:translate-x-1 border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                                        <div className={`w-8 h-8 rounded-full border border-slate-200 dark:border-border flex items-center justify-center text-[10px] font-black shrink-0 ${i === 0 ? 'bg-yellow-400 border-yellow-500 text-slate-900 dark:text-slate-100 shadow-sm shadow-yellow-200' : 'bg-slate-50 dark:bg-muted text-slate-400'
                                            }`}>
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-black text-slate-900 dark:text-slate-100 truncate uppercase tracking-tight mb-1">{student.display_name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Solved {student.tests_taken} Missions</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[13px] font-black text-emerald-600 leading-none">{((student.total_score / (student.tests_taken * 10)) * 100).toFixed(1)}%</p>
                                            <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest mt-1">Accuracy</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}
