import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
    BarChart3,
    TrendingUp,
    Target,
    Clock,
    Calendar,
    Award,
    ChevronRight,
    Bot,
    ArrowRight,
    Sparkles,
    Brain,
    Calculator,
    FileText,
    Microscope,
    FlaskConical,
    Atom,
    PenTool,
    Mic,
    BookOpen,
    Headphones
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useExam } from '@/context/ExamContext';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const dailyData = [
    { day: 'Mon', score: 0 },
    { day: 'Tue', score: 0 },
    { day: 'Wed', score: 0 },
    { day: 'Thu', score: 0 },
    { day: 'Fri', score: 0 },
    { day: 'Sat', score: 0 },
    { day: 'Sun', score: 0 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">{label}</p>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-8">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Correct Answers</span>
                        <span className="text-xs font-black text-white">{data.score}</span>
                    </div>
                    <div className="flex items-center justify-between gap-8">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Questions Solved</span>
                        <span className="text-xs font-black text-white">{data.questions}</span>
                    </div>
                    <div className="flex items-center justify-between gap-8">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Daily Accuracy</span>
                        <span className="text-xs font-black text-emerald-400">{data.accuracy}%</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export default function Analytics() {
    const { user, profile } = useAuth();
    const { activeExam } = useExam();
    const navigate = useNavigate();
    const [subjectData, setSubjectData] = useState<any[]>([]);
    const [stats, setStats] = useState({
        accuracy: '0%',
        timeSpent: '0h',
        verifiedSkills: '0%',
        percentile: 'Top 50%'
    });
    const [points, setPoints] = useState(0);
    const [rank, setRank] = useState(0);
    const [timeframe, setTimeframe] = useState<'7d' | '30d' | '6m'>('7d');
    const [velocityData, setVelocityData] = useState(dailyData);
    const [projection, setProjection] = useState({ score: 0, target: 60, confidence: 0, trajectory: 'Stable' });

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!user || !activeExam) return;

            // 1. Fetch Subject Progress
            const { data: totalQuestions } = await (supabase as any)
                .from('practice_questions')
                .select('subject')
                .eq('exam_type', activeExam.id);

            const { data: solvedBySubject } = await (supabase as any)
                .from('user_practice_responses')
                .select('subject, is_correct, question_id')
                .eq('user_id', user.id)
                .eq('exam_type', activeExam.id);

            const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

            // IELTS Specific Fetches
            const isIELTS = activeExam.id === 'ielts-academic';
            let ieltsData = [];
            if (isIELTS) {
                const [
                    { data: writingSubs },
                    { data: speakingSubs },
                    { data: readingSubs },
                    { data: listeningSubs }
                ] = await Promise.all([
                    supabase.from('writing_submissions').select('*, writing_feedback(overall_score)').eq('user_id', user.id).eq('status', 'completed'),
                    supabase.from('speaking_sessions').select('*, speaking_scores(overall_score)').eq('candidate_id', user.id),
                    supabase.from('reading_submissions').select('*').eq('user_id', user.id),
                    supabase.from('listening_submissions').select('*').eq('user_id', user.id),
                ]);

                const getAvg = (arr: any[], key: string) => {
                    const vals = arr?.flatMap(x => x[key]).map((v: any) => v.overall_score).filter(v => v) || [];
                    return vals.length > 0 ? Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)) : 0;
                };

                const writingAvg = getAvg(writingSubs || [], 'writing_feedback');
                const speakingAvg = getAvg(speakingSubs || [], 'speaking_scores');
                const readingAvg = readingSubs && readingSubs.length > 0 ? (readingSubs.reduce((a, b) => a + b.score, 0) / readingSubs.length) : 0;
                const listeningAvg = listeningSubs && listeningSubs.length > 0 ? (listeningSubs.reduce((a, b) => a + b.score, 0) / listeningSubs.length) : 0;

                ieltsData = [
                    {
                        subject: 'Writing',
                        score: writingAvg,
                        total: totalQuestions?.filter((q: any) => q.subject === 'Academic Writing').length || 0,
                        solved: (writingSubs?.length || 0) + (new Set(solvedBySubject?.filter((q: any) => q.subject === 'Academic Writing').map(a => a.question_id)).size),
                        accuracy: Math.round(writingAvg * 11.1),
                        color: '#6366f1',
                        icon: PenTool,
                        status: writingAvg >= 7 ? 'Mastered' : writingAvg >= 5 ? 'Improving' : 'Needs Focus'
                    },
                    {
                        subject: 'Speaking',
                        score: speakingAvg,
                        total: totalQuestions?.filter((q: any) => q.subject === 'Speaking').length || 0,
                        solved: (speakingSubs?.length || 0) + (new Set(solvedBySubject?.filter((q: any) => q.subject === 'Speaking').map(a => a.question_id)).size),
                        accuracy: Math.round(speakingAvg * 11.1),
                        color: '#f59e0b',
                        icon: Mic,
                        status: speakingAvg >= 7 ? 'Mastered' : speakingAvg >= 5 ? 'Improving' : 'Needs Focus'
                    },
                    {
                        subject: 'Reading',
                        score: readingAvg,
                        total: totalQuestions?.filter((q: any) => q.subject === 'Academic Reading').length || 0,
                        solved: (readingSubs?.length || 0) + (new Set(solvedBySubject?.filter((q: any) => q.subject === 'Academic Reading').map(a => a.question_id)).size),
                        accuracy: readingAvg > 0 ? Math.round((readingAvg / 40) * 100) : (solvedBySubject?.filter((q: any) => q.subject === 'Academic Reading').length > 0 ? Math.round((solvedBySubject.filter((q: any) => q.subject === 'Academic Reading' && q.is_correct).length / solvedBySubject.filter((q: any) => q.subject === 'Academic Reading').length) * 100) : 0),
                        color: '#10b981',
                        icon: BookOpen,
                        status: readingAvg >= 30 ? 'Mastered' : readingAvg >= 20 ? 'Improving' : 'Needs Focus'
                    },
                    {
                        subject: 'Listening',
                        score: listeningAvg,
                        total: totalQuestions?.filter((q: any) => q.subject === 'Listening').length || 0,
                        solved: (listeningSubs?.length || 0) + (new Set(solvedBySubject?.filter((q: any) => q.subject === 'Listening').map(a => a.question_id)).size),
                        accuracy: listeningAvg > 0 ? Math.round((listeningAvg / 40) * 100) : (solvedBySubject?.filter((q: any) => q.subject === 'Listening').length > 0 ? Math.round((solvedBySubject.filter((q: any) => q.subject === 'Listening' && q.is_correct).length / solvedBySubject.filter((q: any) => q.subject === 'Listening').length) * 100) : 0),
                        color: '#ef4444',
                        icon: Headphones,
                        status: listeningAvg >= 30 ? 'Mastered' : listeningAvg >= 20 ? 'Improving' : 'Needs Focus'
                    },
                ];
            }

            const subjectIcons: Record<string, any> = {
                'Mathematics': Calculator,
                'Reasoning on texts and data': FileText,
                'Biology': Microscope,
                'Chemistry': FlaskConical,
                'Physics': Atom,
                'General': Sparkles
            };

            const dynamicSubjectData = isIELTS ? ieltsData : activeExam.sections.map((section: any, index: number) => {
                const totalInSubject = totalQuestions?.filter((q: any) => q.subject === section.name).length || 0;
                const attemptsInSubject = solvedBySubject?.filter((q: any) => q.subject === section.name) || [];
                const correctCount = attemptsInSubject.filter((q: any) => q.is_correct).length;

                const uniqueSolved = new Set(attemptsInSubject.map(a => a.question_id)).size;
                const completionPercentage = totalInSubject > 0
                    ? Math.round((uniqueSolved / totalInSubject) * 100)
                    : 0;

                return {
                    subject: section.name,
                    total: totalInSubject,
                    score: completionPercentage || 0,
                    accuracy: attemptsInSubject.length > 0 ? Math.round((correctCount / attemptsInSubject.length) * 100) : 0,
                    solved: uniqueSolved,
                    icon: subjectIcons[section.name] || Sparkles,
                    color: colors[index % colors.length],
                    status: attemptsInSubject.length === 0 ? 'Not Started' :
                        (correctCount / attemptsInSubject.length) >= 0.8 ? 'Mastered' :
                            (correctCount / attemptsInSubject.length) >= 0.5 ? 'Improving' : 'Needs Focus'
                };
            });

            // Apply Free Tier Limitation to Subject Data
            const isExplorer = profile?.selected_plan === 'explorer';
            const restrictedSubjectData = isExplorer ? dynamicSubjectData.slice(0, 2) : dynamicSubjectData;
            setSubjectData(restrictedSubjectData);

            // 2. Fetch Ranking & Points from Unified Champions RPC
            const { data: championsData } = await (supabase as any).rpc('get_champions_by_questions_solved', {
                target_exam_id: activeExam.id
            });

            // 3. Fetch User Tests (Needed for Time Spent and Projection Confidence)
            const { data: userTests } = await (supabase as any)
                .from('tests')
                .select('*')
                .eq('user_id', user.id)
                .eq('exam_type', activeExam.id)
                .eq('status', 'completed');

            let userRank = championsData ? (championsData.findIndex((c: any) => c.user_id === user.id) + 1) : 0;
            const sortedScores = championsData?.map((c: any) => c.questions_solved) || [];

            if (championsData) {
                const userChampion = championsData.find((c: any) => c.user_id === user.id);
                if (userChampion) {
                    setPoints(userChampion.questions_solved || 0);
                    if (userRank === 0) userRank = championsData.length + 1;
                    setRank(userRank);
                } else {
                    // Fallback to minimal stats if not in champions list yet
                    const { count: solvedCount } = await (supabase as any)
                        .from('user_practice_responses')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id)
                        .eq('exam_type', activeExam.id);
                    setPoints(solvedCount || 0);
                    userRank = championsData.length + 1;
                    setRank(userRank);
                }
            }

            // 4. Growth Velocity
            const daysToFetch = timeframe === '6m' ? 180 : timeframe === '30d' ? 30 : 7;

            const [{ data: periodTests }, { data: periodPractice }] = await Promise.all([
                (supabase as any).from('tests').select('correct_answers, total_questions, created_at').eq('user_id', user.id).eq('exam_type', activeExam.id).gte('created_at', new Date(Date.now() - daysToFetch * 24 * 60 * 60 * 1000).toISOString()),
                (supabase as any).from('user_practice_responses').select('is_correct, created_at').eq('user_id', user.id).eq('exam_type', activeExam.id).gte('created_at', new Date(Date.now() - daysToFetch * 24 * 60 * 60 * 1000).toISOString())
            ]);

            const velocityPoints = Array.from({ length: daysToFetch }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return {
                    day: timeframe === '6m' ? format(d, 'MMM d') : format(d, 'EEE'),
                    date: format(d, 'yyyy-MM-dd'),
                    score: 0,
                    questions: 0,
                    accuracy: 0,
                    correct: 0
                };
            }).reverse();

            periodTests?.forEach((t: any) => {
                const dayStr = format(new Date(t.created_at), 'yyyy-MM-dd');
                const dayMatch = velocityPoints.find(d => d.date === dayStr);
                if (dayMatch) {
                    dayMatch.score += (t.correct_answers || 0);
                    dayMatch.questions += (t.total_questions || 0);
                    dayMatch.correct += (t.correct_answers || 0);
                }
            });

            periodPractice?.forEach((p: any) => {
                const dayStr = format(new Date(p.created_at), 'yyyy-MM-dd');
                const dayMatch = velocityPoints.find(d => d.date === dayStr);
                if (dayMatch) {
                    dayMatch.questions += 1;
                    if (p.is_correct) {
                        dayMatch.score += 1;
                        dayMatch.correct += 1;
                    }
                }
            });

            velocityPoints.forEach(d => {
                if (d.questions > 0) {
                    d.accuracy = Math.round((d.correct / d.questions) * 100);
                }
            });
            setVelocityData(velocityPoints);

            // 5. Score Projection
            const overallAccuracy = solvedBySubject && solvedBySubject.length > 0
                ? (solvedBySubject.filter((q: any) => q.is_correct).length / solvedBySubject.length)
                : 0;

            const targetScore = activeExam.id === 'ielts-academic' ? 9 : 60;
            const projected = Number((overallAccuracy * targetScore).toFixed(1));

            // Trajectory logic
            const recent3Tests = userTests?.slice(0, 3) || [];
            const recentAvg = recent3Tests.length > 0
                ? recent3Tests.reduce((acc: number, t: any) => acc + (t.correct_answers / t.total_questions), 0) / recent3Tests.length
                : 0;

            setProjection({
                score: projected,
                target: targetScore,
                confidence: Math.min(95, Math.round(overallAccuracy * 100 + (userTests?.length || 0))),
                trajectory: recentAvg > overallAccuracy ? '↑ Improving' : '→ Stable'
            });

            const percentileValue = sortedScores.length > 0
                ? Math.round(((sortedScores.length - userRank) / sortedScores.length) * 100)
                : 0;

            if (isIELTS) {
                const scores = [dynamicSubjectData[0].score, dynamicSubjectData[1].score, dynamicSubjectData[2].score / 11.1, dynamicSubjectData[3].score / 11.1].filter(s => s > 0);
                const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '0';
                setStats({
                    accuracy: `${avg} Band`,
                    timeSpent: `${Math.round((userTests?.reduce((acc: number, t: any) => acc + (t.time_taken_seconds || 0), 0) || 0) / 3600)}h`,
                    verifiedSkills: ieltsData.filter(d => d.score > 0).length + ' Modules',
                    percentile: `Top ${Math.max(1, 100 - percentileValue)}%`
                });
            } else if (solvedBySubject && solvedBySubject.length > 0) {
                const totalCorrect = solvedBySubject.filter((q: any) => q.is_correct).length;
                const accuracyNum = Math.round((totalCorrect / solvedBySubject.length) * 100);
                const masteredModules = dynamicSubjectData.filter(d => d.accuracy >= 70).length;
                setStats({
                    accuracy: `${accuracyNum}%`,
                    timeSpent: `${Math.round((userTests?.reduce((acc: number, t: any) => acc + (t.time_taken_seconds || 0), 0) || 0) / 3600)}h`,
                    verifiedSkills: `${masteredModules} Subjects Mastered`,
                    percentile: `Top ${Math.max(1, 100 - percentileValue)}%`
                });
            }
        };

        fetchAnalytics();
    }, [user, activeExam, timeframe]);

    return (
        <Layout>
            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* Compact Top Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl border border-indigo-500/10 rounded-3xl p-4 sm:p-6 shadow-sm mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none uppercase">Analytical <span className="text-indigo-600">Intelligence</span></h1>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">Real-time Performance Profile</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                        <div className="flex flex-col items-end px-4 border-r border-slate-100 dark:border-border">
                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Global Rank</p>
                            <p className="text-sm font-black text-indigo-600">#{rank}</p>
                        </div>
                        <div className="flex flex-col items-end px-4">
                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Dash Points</p>
                            <p className="text-sm font-black text-slate-900 dark:text-slate-100">{points.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Top Metrics Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Accuracy', value: stats.accuracy, icon: Target, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-100 dark:border-orange-700/30' },
                        { label: 'Time Spent', value: stats.timeSpent, icon: Clock, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-100 dark:border-pink-700/30' },
                        { label: 'Verified Skills', value: stats.verifiedSkills, icon: Award, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-100 dark:border-red-700/30' },
                        { label: 'Percentile', value: stats.percentile, icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-700/30' },
                    ].map((stat, i) => (
                        <div key={i} className={`relative overflow-hidden ${stat.bg} backdrop-blur-xl border ${stat.border} p-6 rounded-[2rem] shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl group`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-8 h-8 rounded-xl ${stat.bg.replace('/5', '/10')} flex items-center justify-center border ${stat.border}`}>
                                    <stat.icon className={`w-4 h-4 ${stat.color} transition-transform group-hover:scale-110`} />
                                </div>
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none">{stat.value}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{stat.label}</p>

                            {/* Decorative Background Element */}
                            <div className={`absolute -right-2 -bottom-2 w-12 h-12 ${stat.color.replace('text-', 'bg-')} opacity-[0.03] rounded-full blur-2xl group-hover:opacity-[0.08] transition-opacity`} />
                        </div>
                    ))}
                </div>

                {/* Main Dashboard Grid */}
                <div className="flex flex-col gap-6">
                    {/* Row 1: Proficiency & Oracle Side-by-Side */}
                    <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                        {/* Module Proficiency */}
                        <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl flex flex-col h-full overflow-hidden">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-8 h-8 bg-emerald-50 dark:bg-muted rounded-xl flex items-center justify-center border border-emerald-100 dark:border-border">
                                    <Award className="w-4 h-4 text-emerald-600" />
                                </div>
                                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">Module Proficiency</h3>
                            </div>

                            <div className="space-y-4 flex-1">
                                <div className="grid grid-cols-12 px-6 py-3 text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50 dark:border-border/50">
                                    <div className="col-span-5">Component</div>
                                    <div className="col-span-3 text-center">Completion</div>
                                    <div className="col-span-2 text-center">Accuracy</div>
                                    <div className="col-span-2 text-right">Status</div>
                                </div>
                                <div className="space-y-2 p-2">
                                    {subjectData.map((item, index) => (
                                        <div key={index} className="grid grid-cols-12 items-center px-4 py-4 rounded-3xl hover:bg-white/40 dark:hover:bg-white/5 transition-all group border border-transparent hover:border-slate-100 dark:hover:border-white/5">
                                            <div className="col-span-5 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: `${item.color}10`, border: `1px solid ${item.color}20` }}>
                                                    <item.icon className="w-4 h-4" style={{ color: item.color }} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-slate-700 dark:text-slate-200 truncate uppercase tracking-tight">{item.subject}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.solved} / {item.total} Solved</p>
                                                </div>
                                            </div>
                                            <div className="col-span-3 px-4">
                                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-50 dark:border-white/5 relative">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                                        style={{
                                                            width: `${item.score}%`,
                                                            backgroundColor: item.color,
                                                            boxShadow: `0 0 10px ${item.color}40`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-2 text-center">
                                                <span className="text-sm font-black text-slate-900 dark:text-white tracking-tighter">{item.accuracy}%</span>
                                            </div>
                                            <div className="col-span-2 text-right">
                                                <span className={`inline-flex px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${item.status === 'Mastered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                    item.status === 'Improving' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                                                        item.status === 'Needs Focus' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                            'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Neural Oracle Projection */}
                        <div className="bg-slate-950 p-8 rounded-[2.5rem] relative overflow-hidden flex flex-col group border border-slate-800 shadow-2xl h-full">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.25),transparent_70%)]" />

                            <div className="relative z-10 flex flex-col h-full items-center justify-between text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 mb-4">
                                    <Bot className="w-4 h-4 text-indigo-400" />
                                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Neural Oracle v2.0</span>
                                </div>

                                {profile?.selected_plan === 'explorer' ? (
                                    <div className="space-y-6 my-auto">
                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mx-auto">
                                            <Brain className="w-8 h-8 text-indigo-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-xl font-black text-white uppercase tracking-tight">Intelligence Locked</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Score Projection is exclusive to PRO members.</p>
                                        </div>
                                        <Button size="sm" onClick={() => navigate('/pricing')} className="h-10 px-6 bg-white/10 hover:bg-white/20 text-white border-white/10 text-[9px] font-black uppercase tracking-widest rounded-xl">Unlock Insights</Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="relative w-32 h-32 flex items-center justify-center my-2">
                                            <svg className="w-full h-full -rotate-90">
                                                <circle cx="50%" cy="50%" r="42%" stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none" />
                                                <circle cx="50%" cy="50%" r="42%" stroke="url(#oracleGrad)" strokeWidth="10" fill="none" strokeDasharray="264" strokeDashoffset={264 - (264 * (projection.score / projection.target))} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                                                <defs>
                                                    <linearGradient id="oracleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="#4f46e5" />
                                                        <stop offset="100%" stopColor="#818cf8" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <p className="text-3xl font-black text-white tracking-tighter leading-none">{projection.score}</p>
                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Target: {projection.target}</p>
                                            </div>
                                        </div>

                                        <div className="w-full space-y-2 mt-4">
                                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 transition-colors hover:bg-white/10">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence</span>
                                                <span className="text-sm font-black text-white">{projection.confidence}%</span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 transition-colors hover:bg-white/10">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trajectory</span>
                                                <span className={`text-xs font-black ${projection.trajectory.includes('↑') ? 'text-emerald-400' : 'text-amber-400'}`}>{projection.trajectory}</span>
                                            </div>
                                        </div>

                                        <Button onClick={() => navigate('/practice')} className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl mt-6 border-none transition-all active:scale-95">Start Simulation</Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Growth Velocity Full-Width */}
                    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl flex flex-col min-h-[320px]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-indigo-50 dark:bg-muted rounded-xl flex items-center justify-center border border-indigo-100 dark:border-border">
                                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                                </div>
                                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">Growth Velocity</h3>
                            </div>
                            <div className="flex bg-slate-100/50 dark:bg-muted/30 p-1 rounded-2xl border border-slate-200/50 dark:border-white/5">
                                {(['7d', '30d', '6m'] as const).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTimeframe(t)}
                                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === t
                                            ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                            }`}
                                    >
                                        {t === '7d' ? '7 Days' : t === '30d' ? '30 Days' : '6 Months'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-[300px] w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.1} />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontWeight: '900', fontSize: 10 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontWeight: '900', fontSize: 10 }}
                                    />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#6366f1"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorScore)"
                                        animationDuration={1500}
                                        activeDot={{
                                            r: 6,
                                            fill: '#6366f1',
                                            stroke: '#fff',
                                            strokeWidth: 3,
                                            className: "shadow-2xl"
                                        }}
                                        dot={{
                                            r: 4,
                                            fill: '#fff',
                                            stroke: '#6366f1',
                                            strokeWidth: 2
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
