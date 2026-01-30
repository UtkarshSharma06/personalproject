import { useEffect, useState, memo, useCallback } from 'react';
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
    TrendingUp,
    GraduationCap,
    Brain,
    Sparkles,
    BarChart3,
    Award,
    Bookmark,
    FlaskConical,
    FileText,
    ClipboardList
} from 'lucide-react';
import { subDays } from 'date-fns';
import { useExam } from '@/context/ExamContext';
import LatestNotificationPopup from '@/components/LatestNotificationPopup';

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
    avatar_url?: string | null;
    accuracy?: number;
}

// --- Memoized Sub-Components ---

const StatCard = memo(({ label, value, icon: Icon, color, bg, border }: any) => (
    <div className={`relative group overflow-hidden ${bg} ${border} backdrop-blur-xl border-2 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:-translate-y-1 h-full flex flex-col justify-center`}>
        <div className="relative z-10">
            <div className="flex items-center justify-center mb-3">
                <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                <Icon className={`w-4 h-4 ${color} opacity-80`} />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter text-center">{value}</p>
        </div>
    </div>
));

const SubjectMasteryItem = memo(({ subject }: { subject: SubjectMastery }) => (
    <div className="group relative">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {subject.subject === 'Mathematics' ? '📐' :
                        subject.subject === 'Biology' ? '🧬' :
                            subject.subject === 'Chemistry' ? '⚗️' :
                                subject.subject.includes('Reasoning') ? '🧠' : '⚛️'}
                </div>
                <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{subject.subject}</span>
            </div>
            <div className="text-right">
                <span className="text-base font-black text-slate-900 dark:text-white leading-none">{subject.accuracy}%</span>
                <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Stability</p>
            </div>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-50 dark:border-white/5 relative">
            <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                style={{ width: `${subject.accuracy}%` }}
            />
        </div>
    </div>
));

const ChampionItem = memo(({ student, index }: { student: TopStudent, index: number }) => (
    <Link
        to={`/student/${student.id}`}
        className={`group flex items-center gap-3 p-3.5 rounded-3xl transition-all duration-300 hover:-translate-y-1 ${index === 0
            ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-950/20 border-2 border-amber-200 dark:border-amber-800 shadow-xl shadow-amber-200/20'
            : 'bg-white/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/50 hover:shadow-lg'
            }`}
    >
        <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-md ring-1 ring-white/20 transition-transform group-hover:scale-110 ${index === 0 ? 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 text-white' :
            index === 1 ? 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 text-slate-800' :
                index === 2 ? 'bg-gradient-to-br from-amber-700 via-amber-800 to-orange-900 text-white' :
                    'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
            }`}>
            {index === 0 ? '👑' : index + 1}
        </div>
        <div className="shrink-0 relative">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border transition-all ${index === 0 ? 'border-amber-400 shadow-md ring-2 ring-amber-100 dark:ring-amber-900/40' : 'border-slate-200 dark:border-slate-700'
                }`}>
                {student.avatar_url ? (
                    <img src={student.avatar_url} alt={student.display_name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center text-sm font-black ${index === 0 ? 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                        }`}>
                        {(student.display_name || 'S').slice(0, 1).toUpperCase()}
                    </div>
                )}
            </div>
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="text-sm font-black text-slate-900 dark:text-white truncate tracking-tight">{student.display_name}</h4>
            <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest opacity-60">
                @{(student.display_name || 'student').toLowerCase().replace(/\s+/g, '')}
            </p>
        </div>
        <div className="text-right shrink-0">
            <div className={`text-base font-black ${index === 0 ? 'text-amber-600 dark:text-amber-400' :
                (student.accuracy || 0) > 80 ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'
                }`}>
                {student.accuracy ? `${student.accuracy}%` : '0%'}
            </div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter opacity-70">
                {student.total_score}/{student.tests_taken || 0}
            </p>
        </div>
    </Link>
));

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
        mockExams: 0,
        accuracy: 0,
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
            // 1. Critical data first (User Stats)
            await fetchDashboardData();

            // 2. Secondary data staggered to improve INP
            setTimeout(async () => {
                await Promise.all([
                    fetchTopStudents(),
                    fetchLastProgress()
                ]);
            }, 100);

        } catch (error) {
            console.error("Dashboard Sync Error:", error);
        } finally {
            // Slight delay for smooth transition
            setTimeout(() => setIsDashboardLoading(false), 300);
        }
    };

    const fetchTopStudents = async () => {
        try {
            const { data: championsData, error } = await supabase
                .rpc('get_champions_by_questions_solved', { target_exam_id: activeExam.id });

            if (error) {
                console.error("Error fetching champions:", error);
                return;
            }

            console.log("Champions data received:", championsData);

            if (!championsData || championsData.length === 0) {
                console.log("No champions data available");
                setTopStudents([]);
                return;
            }

            const studentsWithScores: TopStudent[] = championsData.map((champion: any) => ({
                id: champion.user_id,
                display_name: champion.display_name || 'Student',
                email: null,
                avatar_url: champion.avatar_url,
                total_score: champion.questions_solved, // Questions solved
                tests_taken: champion.total_questions, // Total available questions
                accuracy: champion.accuracy, // Real accuracy percentage
            }));

            setTopStudents(studentsWithScores.slice(0, 5));
        } catch (err) {
            console.error("Failed to load champions", err);
        }
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

            const mockSolved = tests.filter((t: any) => t.test_type === 'mock').length;

            setStats(prev => ({
                ...prev,
                totalQuestions,
                streak,
                avgTime,
                mockExams: mockSolved,
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
            .select('subject, is_correct, question_id')
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
                const uniqueSolved = new Set(attemptsInSubject.map(a => a.question_id)).size;
                const correctCount = attemptsInSubject.filter((q: any) => q.is_correct).length;

                // Add session counts for IELTS
                let additionalSolved = 0;
                if (activeExam.id === 'ielts-academic') {
                    if (section.name === 'Academic Reading') additionalSolved = (readingCount || 0);
                    if (section.name === 'Listening') additionalSolved = (listeningCount || 0);
                    if (section.name === 'Academic Writing') additionalSolved = (writingCount || 0);
                }

                const finalTotal = realTotal || 0;

                return {
                    subject: section.name,
                    solved: uniqueSolved + additionalSolved,
                    total: finalTotal,
                    accuracy: attemptsInSubject.length > 0
                        ? Math.round((correctCount / attemptsInSubject.length) * 100)
                        : 0,
                };
            }));
            setSubjectMastery(mastery);

            // Calculate overall accuracy for stats
            const totalAttempts = solvedBySubject?.length || 0;
            const totalCorrect = solvedBySubject?.filter((q: any) => q.is_correct).length || 0;
            const globalAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

            setStats(prev => ({
                ...prev,
                accuracy: globalAccuracy
            }));
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

    const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Student';

    // Calculate Dynamic Insights
    const weakestSubject = subjectMastery.length > 0
        ? [...subjectMastery].sort((a, b) => a.accuracy - b.accuracy)[0]
        : null;

    const overallAccuracy = stats.accuracy;
    const oracleProjection = overallAccuracy.toString();

    const missionText = weakestSubject && weakestSubject.solved > 0
        ? (
            <>
                Focus on <span className="underline decoration-indigo-300 underline-offset-4 decoration-2">{weakestSubject.subject}</span>.
                Recent data suggests a {100 - weakestSubject.accuracy}% logic gap in this sector.
            </>
        ) : (
            "Complete 3 practice missions to unlock advanced performance insights."
        );

    const handleConsultMission = useCallback(() => {
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
    }, [weakestSubject, toast]);

    if (loading || isDashboardLoading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl animate-pulse">
                    <div className="grid lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-12">
                            {/* Hero Skeleton */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100 dark:border-border">
                                <div className="space-y-4">
                                    <div className="h-12 w-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                                    <div className="h-6 w-48 bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
                                </div>
                                <div className="h-16 w-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                            </div>

                            {/* Stats Skeleton */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800/40 rounded-[2rem]" />
                                ))}
                            </div>

                            {/* Main Content Skeleton */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="h-[400px] bg-slate-100 dark:bg-slate-800/40 rounded-[2.5rem]" />
                                <div className="h-[400px] bg-slate-100 dark:bg-slate-800/40 rounded-[2.5rem]" />
                            </div>
                        </div>

                        {/* Sidebar Skeleton */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                            <div className="h-64 bg-slate-100 dark:bg-slate-800/40 rounded-[2.5rem]" />
                            <div className="h-64 bg-slate-100 dark:bg-slate-800/40 rounded-[2.5rem]" />
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <LatestNotificationPopup />
            <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl w-full">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* Hero Section (Sleek/Open) */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100 dark:border-border">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none mb-4">
                                    Hi, <span className="text-indigo-600 capitalize">{displayName}</span>
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
                                        className="h-14 sm:h-20 w-full sm:w-28 rounded-2xl border-2 border-slate-100 dark:border-border hover:border-indigo-100 hover:bg-indigo-50 flex sm:flex-col flex-row gap-2 items-center justify-center group"
                                    >
                                        <Zap className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-tight sm:tracking-normal text-slate-400 group-hover:text-indigo-600 text-center leading-tight">Practice Arena</span>
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
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                            {[
                                { label: 'TOTAL SOLVED', value: stats.totalQuestions, icon: Search, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100/50 dark:border-indigo-500/20' },
                                { label: 'MOCK SOLVED', value: stats.mockExams, icon: ClipboardList, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-100/50 dark:border-rose-500/20' },
                                { label: 'STREAK', value: `${stats.streak} d`, icon: Zap, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-100/50 dark:border-orange-500/20' },
                                { label: 'AVG TIME', value: `${stats.avgTime} s`, icon: Clock, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-100/50 dark:border-cyan-500/20' },
                                { label: 'STABILITY', value: `${oracleProjection}%`, icon: Trophy, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-100/50 dark:border-pink-500/20' },
                            ].map((stat, i) => (
                                <StatCard key={i} {...stat} />
                            ))}
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


                        {/* Highlights Row: Subject Mastery & Top Champions */}
                        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                            {/* Subject Mastery Card */}
                            <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl flex flex-col h-full">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200/50 transition-transform hover:rotate-12">
                                            <GraduationCap className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-black uppercase tracking-tighter text-slate-900 dark:text-white">Subject Mastery</h2>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Competency Breakdown</p>
                                        </div>
                                    </div>
                                    <Link to="/subjects" className="px-5 py-2 rounded-full border border-slate-100 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                                        Expand
                                    </Link>
                                </div>

                                <div className="flex-1 space-y-8">
                                    {subjectMastery.slice(0, 5).map((subject, i) => (
                                        <SubjectMasteryItem key={i} subject={subject} />
                                    ))}
                                </div>
                            </div>

                            {/* Top Champions Card */}
                            <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col h-full ring-1 ring-slate-900/5 transition-all">
                                {/* Header */}
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 transform hover:rotate-3 transition-transform">
                                        <Trophy className="w-8 h-8 text-white drop-shadow-md" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Top Students</h3>
                                        <p className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em] opacity-80">Champions League</p>
                                    </div>
                                </div>

                                {/* Champions List */}
                                <div className="flex-1 space-y-3">
                                    {topStudents.slice(0, 5).map((student, i) => (
                                        <ChampionItem key={student.id} student={student} index={i} />
                                    ))}

                                    {topStudents.length === 0 && (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center py-20 grayscale opacity-50">
                                            <Trophy className="w-24 h-24 text-slate-200 dark:text-slate-800 mb-6" />
                                            <h4 className="text-lg font-black text-slate-400 uppercase tracking-widest">No Champions Yet</h4>
                                            <p className="text-sm text-slate-400/80 mt-2">Solve practice questions to claim the throne!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                        {/* Apply University - Standalone Premium Button */}
                        <button
                            onClick={() => navigate('/apply-university')}
                            className="w-full group relative flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-white transition-all shadow-xl shadow-amber-200/20 active:scale-95 hover:scale-[1.02] overflow-hidden border-2 border-amber-300/30"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative z-10 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:rotate-12 transition-transform">
                                    <Award className="w-5 h-5 text-white shadow-sm" />
                                </div>
                                <div className="text-left">
                                    <span className="block text-[9px] font-black uppercase tracking-widest text-amber-100 group-hover:text-white transition-colors">Admission Protocol</span>
                                    <span className="text-sm font-black tracking-tighter">Apply University</span>
                                </div>
                            </div>
                            <ChevronRight className="relative z-10 w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>

                        {/* Power Hub Card */}
                        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Power Hub</h3>
                            <div className="grid gap-4">
                                <button
                                    onClick={() => navigate('/bookmarks')}
                                    className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-card hover:bg-slate-900 hover:text-white transition-all border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors border border-orange-100/50">
                                            <Bookmark className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-black uppercase tracking-tight">Saved Assets</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-all" />
                                </button>

                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { label: 'Resource Library', path: '/resources', icon: FileText, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/30', border: 'border-pink-100/50' },
                                        { label: '3D Labs', path: '/labs', icon: FlaskConical, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/30', border: 'border-indigo-100/50' },
                                        { label: 'Mission History', path: '/history', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30', border: 'border-emerald-100/50' },
                                        { label: 'Performance', path: '/analytics', icon: BarChart3, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/30', border: 'border-rose-100/50' },
                                    ].map((item) => (
                                        <button
                                            key={item.label}
                                            onClick={() => navigate(item.path)}
                                            className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-card hover:bg-slate-900 hover:text-white transition-all border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color} group-hover:bg-white/10 group-hover:text-white transition-colors border ${item.border}`}>
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm font-black uppercase tracking-tight">{item.label}</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Compact Evaluations Integration (Only for IELTS) */}
                        {activeExam.id === 'ielts-academic' && recentEvaluations.length > 0 && (
                            <div className="bg-slate-50/80 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
                                            <Sparkles className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">Evaluations</h3>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Writing Feedback</p>
                                        </div>
                                    </div>
                                    <Link to="/writing/history" className="px-5 py-2 rounded-full border border-slate-100 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                                        View All
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {recentEvaluations.map((evalItem: any) => (
                                        <div
                                            key={evalItem.id}
                                            className="group p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-indigo-200 transition-all cursor-pointer flex items-center gap-4"
                                            onClick={() => navigate(`/ writing / results / ${evalItem.id} `)}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 group-hover:rotate-6 transition-transform">
                                                ✍️
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-black text-slate-900 dark:text-white truncate uppercase mb-0.5">Writing Task</p>
                                                <div className="flex items-center gap-2">
                                                    <div className={`h - 1.5 w - 1.5 rounded - full ${evalItem.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'} `} />
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{evalItem.status}</p>
                                                </div>
                                            </div>
                                            {evalItem.status === 'completed' && evalItem.writing_feedback?.[0] && (
                                                <div className="text-right">
                                                    <p className="text-xl font-black text-indigo-600 leading-none">{evalItem.writing_feedback[0].overall_score}</p>
                                                    <p className="text-[7px] font-black text-slate-300 uppercase mt-1">Band</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Unified WhatsApp & Leaderboard Space */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-[#128C7E] p-8 md:p-10 rounded-[2.5rem] text-white relative overflow-hidden group hover:bg-[#075E54] transition-colors border-b-8 border-slate-900/20 active:border-b-0 active:translate-y-2">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-6 text-left">
                                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tighter leading-none">Community</h3>
                                            <p className="text-[9px] font-black text-emerald-100 uppercase mt-1.5 opacity-60">Collaborate now</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => window.open('https://chat.whatsapp.com/HMrIISJM6LUEIxgTxSMQp7', '_blank')}
                                        className="w-full h-14 bg-white text-[#075E54] hover:bg-slate-50 font-black uppercase tracking-widest rounded-2xl border-none text-xs"
                                    >
                                        Join WhatsApp
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
