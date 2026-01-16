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
    Atom
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
                .select('subject, is_correct')
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
                    supabase.from('speaking_sessions').select('*, speaking_scores(overall_score)').eq('user_id', user.id),
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
                    { subject: 'Writing', score: writingAvg, accuracy: Math.round(writingAvg * 11.1), color: '#6366f1' }, // 9 -> 100%
                    { subject: 'Speaking', score: speakingAvg, accuracy: Math.round(speakingAvg * 11.1), color: '#f59e0b' },
                    { subject: 'Reading', score: readingAvg, accuracy: readingAvg, color: '#10b981' },
                    { subject: 'Listening', score: listeningAvg, accuracy: listeningAvg, color: '#ef4444' },
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

                // Show percentage of manual bank completed as the 'score' for visual representation
                const completionPercentage = totalInSubject > 0
                    ? Math.round((attemptsInSubject.length / totalInSubject) * 100)
                    : 0;

                return {
                    subject: section.name,
                    score: completionPercentage || 0, // Visual progress
                    accuracy: attemptsInSubject.length > 0 ? Math.round((correctCount / attemptsInSubject.length) * 100) : 0,
                    solved: attemptsInSubject.length,
                    icon: subjectIcons[section.name] || Sparkles,
                    color: colors[index % colors.length]
                };
            });

            // Apply Free Tier Limitation to Subject Data
            const isExplorer = profile?.selected_plan === 'explorer';
            const restrictedSubjectData = isExplorer ? dynamicSubjectData.slice(0, 2) : dynamicSubjectData;
            setSubjectData(restrictedSubjectData);

            // 2. Fetch Overall Metrics
            const { data: userTests } = await (supabase as any)
                .from('tests')
                .select('*')
                .eq('user_id', user.id)
                .eq('exam_type', activeExam.id)
                .eq('status', 'completed');

            const totalPoints = userTests?.reduce((acc: number, t: any) => acc + (t.correct_answers || 0), 0) || 0;
            setPoints(totalPoints);

            // 3. Calculate Rank
            const { data: allExamTests } = await (supabase as any)
                .from('tests')
                .select('user_id, correct_answers')
                .eq('exam_type', activeExam.id)
                .eq('status', 'completed');

            const userScores: Record<string, number> = {};
            allExamTests?.forEach((t: any) => {
                userScores[t.user_id] = (userScores[t.user_id] || 0) + (t.correct_answers || 0);
            });

            const sortedScores = Object.values(userScores).sort((a, b) => b - a);
            const currentUserScore = userScores[user.id] || 0;
            const userRank = sortedScores.indexOf(currentUserScore) + 1;
            setRank(userRank || (sortedScores.length + 1));

            const percentileValue = sortedScores.length > 0
                ? Math.max(1, Math.round(((sortedScores.length - userRank + 1) / sortedScores.length) * 100))
                : 0;

            // 4. Growth Velocity (Last 7 Days)
            const { data: weekTests } = await (supabase as any)
                .from('tests')
                .select('correct_answers, created_at')
                .eq('user_id', user.id)
                .eq('exam_type', activeExam.id)
                .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return {
                    day: format(d, 'EEE'),
                    date: format(d, 'yyyy-MM-dd'),
                    score: 0
                };
            }).reverse();

            weekTests?.forEach((t: any) => {
                const dayStr = format(new Date(t.created_at), 'yyyy-MM-dd');
                const dayMatch = last7Days.find(d => d.date === dayStr);
                if (dayMatch) dayMatch.score += (t.correct_answers || 0);
            });
            setVelocityData(last7Days);

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
    }, [user, activeExam]);

    return (
        <Layout>
            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* Header Area (Sleek Modern) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 sm:mb-16 border-b border-slate-100 dark:border-border pb-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-muted rounded-full border border-indigo-100 dark:border-border">
                            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="text-[9px] font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest">Performance Profile</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                            Deep <span className="text-indigo-600">Analytics</span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-400 font-bold tracking-tight">Real-time breakdown of your preparation progress.</p>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
                        <div className="bg-white dark:bg-card px-6 sm:px-8 py-4 sm:py-5 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-border shadow-sm flex flex-col items-center flex-1 md:flex-none">
                            <p className="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1.5 sm:mb-2">Total Points</p>
                            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{points.toLocaleString()}</p>
                        </div>
                        <div className="bg-slate-900 px-6 sm:px-8 py-4 sm:py-5 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform flex-1 md:flex-none">
                            <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 sm:mb-2 group-hover:text-indigo-400 transition-colors">Global Rank</p>
                            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">#{rank}</p>
                        </div>
                    </div>
                </div>

                {/* Free Tier Upgrade Hero */}
                {profile?.selected_plan === 'explorer' && (
                    <div className="mb-12 p-8 sm:p-12 rounded-[3rem] bg-indigo-600 shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                                    <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Partial Analytics Active</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase leading-none">
                                    Unlock Neural <span className="text-indigo-200">Insights</span>
                                </h3>
                                <p className="text-sm font-medium text-indigo-100 max-w-sm leading-relaxed">
                                    Your current plan only shows basic performance. Upgrade to see score projections, global rank distributions, and deep subject analysis.
                                </p>
                            </div>
                            <Button
                                onClick={() => navigate('/onboarding')}
                                className="h-16 px-10 rounded-2xl bg-white text-indigo-600 hover:bg-slate-50 font-black text-xs uppercase tracking-widest shadow-xl group/btn shrink-0"
                            >
                                Upgrade Plan
                                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Primary Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    {[
                        { label: 'Avg Accuracy', value: stats.accuracy, icon: Target, bg: 'bg-white', text: 'text-slate-900' },
                        { label: 'Time Spent', value: stats.timeSpent, icon: Clock, bg: 'bg-white', text: 'text-slate-900' },
                        { label: 'Verified Skills', value: stats.verifiedSkills, icon: Award, bg: 'bg-emerald-50/50', text: 'text-emerald-900' },
                        { label: 'Percentile', value: stats.percentile, icon: TrendingUp, bg: 'bg-indigo-50/50', text: 'text-indigo-900' },
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.bg} dark:bg-card p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-slate-100 dark:border-border border-b-[6px] shadow-xl shadow-slate-200/50 hover:border-slate-300 hover:-translate-y-1 hover:shadow-2xl active:border-b-2 active:translate-y-1 transition-all duration-200 group`}>
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.text} dark:text-slate-100 opacity-30 group-hover:opacity-100 transition-opacity`} />
                                <ChevronRight className="w-3 h-3 text-slate-200" />
                            </div>
                            <p className={`text-xl sm:text-3xl font-black ${stat.text} dark:text-slate-100 tracking-tighter mb-1`}>{stat.value}</p>
                            <p className="text-[7px] sm:text-[9px] font-black text-slate-300 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 mb-8 sm:mb-12">
                    {/* Activity Chart */}
                    <div className="lg:col-span-8 bg-white dark:bg-card p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-2 border-slate-100 dark:border-border border-b-[8px] shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-50 dark:bg-muted rounded-xl flex items-center justify-center border border-indigo-100 dark:border-border">
                                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">Growth Velocity</h3>
                            </div>
                            <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-slate-400 bg-slate-50 dark:bg-muted px-4 py-2 rounded-full border border-slate-100 dark:border-border uppercase tracking-widest">
                                <Calendar className="w-3 h-3" /> Past 7 Cycles
                            </div>
                        </div>

                        <div className="h-[250px] sm:h-[350px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={velocityData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#cbd5e1', fontWeight: 'bold', fontSize: 10 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#cbd5e1', fontWeight: 'bold', fontSize: 10 }}
                                        dx={-5}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '1.25rem',
                                            border: '1px solid #f1f5f9',
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                            fontWeight: 'bold',
                                            padding: '8px 12px',
                                            fontSize: '10px'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#6366f1"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorScore)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-muted rounded-full blur-3xl opacity-50 group-hover:scale-125 transition-transform duration-1000" />
                    </div>

                    {/* Score Oracle Projection (NEW FEATURE - Restricted for Free) */}
                    <div className={`lg:col-span-4 bg-slate-900 p-8 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group border-b-[8px] border-slate-950 active:border-b-0 active:translate-y-2 transition-all duration-200 ${profile?.selected_plan === 'explorer' ? 'min-h-[400px]' : ''}`}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_70%)]" />

                        {profile?.selected_plan === 'explorer' ? (
                            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center space-y-6">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                    <Brain className="w-8 h-8 text-indigo-400" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-black text-white uppercase tracking-tight">Oracle Locked</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">AI Score Projection is exclusive to PRO members.</p>
                                </div>
                                <Button size="sm" onClick={() => navigate('/onboarding')} className="bg-white/10 hover:bg-white/20 text-white border-white/10 text-[9px] font-black uppercase tracking-widest px-6">
                                    Unlock Now
                                </Button>
                            </div>
                        ) : (
                            <div className="relative z-10 text-center space-y-6 sm:space-y-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 mb-2">
                                    <Bot className="w-3 h-3 text-indigo-400" />
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest text-indigo-300">Neural Oracle v1.0</span>
                                </div>

                                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase">Score Projection</h3>

                                {/* Oracle Gauge Visualization */}
                                <div className="relative w-36 h-36 sm:w-48 sm:h-48 mx-auto flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle cx="50%" cy="50%" r="42%" stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none" />
                                        <circle
                                            cx="50%" cy="50%" r="42%"
                                            stroke="url(#oracleGradient)"
                                            strokeWidth="10"
                                            fill="none"
                                            strokeDasharray="264"
                                            strokeDashoffset={264 - (264 * (projection.score / projection.target))}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                        />
                                        <defs>
                                            <linearGradient id="oracleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#4f46e5" />
                                                <stop offset="100%" stopColor="#818cf8" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <p className="text-4xl sm:text-5xl font-black text-white tracking-tighter">{projection.score}</p>
                                        <p className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mt-1">Target: {projection.target}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/5">
                                        <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence</span>
                                        <span className="text-xs sm:text-sm font-black text-white">{projection.confidence}%</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/5">
                                        <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Trajectory</span>
                                        <span className={`text-xs sm:text-sm font-black ${projection.trajectory.includes('↑') ? 'text-emerald-400' : 'text-amber-400'}`}>{projection.trajectory}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => navigate('/practice')}
                                    className="w-full h-12 sm:h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] rounded-xl sm:rounded-2xl shadow-xl transition-all active:scale-95 border-none"
                                >
                                    EXAM SIMULATION
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Subject Analysis (Adjusted col span) */}
                    <div className="lg:col-span-12 bg-white dark:bg-card p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-2 border-slate-100 dark:border-border border-b-[8px] shadow-xl shadow-slate-200/50">
                        <div className="flex items-center justify-between mb-8 sm:mb-12">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-50 dark:bg-muted rounded-xl flex items-center justify-center border border-emerald-100 dark:border-border">
                                    <Award className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                                    {activeExam.id === 'ielts-academic' ? 'Module Proficiency' : 'Proficiency Breakdown'}
                                </h3>
                            </div>
                            <div className="hidden sm:flex gap-3">
                                <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-muted rounded-lg border border-slate-100 dark:border-border">
                                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                                    <span className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">Elite</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-muted rounded-lg border border-slate-100 dark:border-border">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">Target</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50 dark:border-border/50">
                                <div className="col-span-8">Subject</div>
                                <div className="col-span-2 text-center">Mastery</div>
                                <div className="col-span-2 text-right">Solved</div>
                            </div>
                            {subjectData.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 items-center px-4 py-4 rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-muted/50 transition-all group">
                                    <div className="col-span-8 flex items-center gap-4 sm:gap-6">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0" style={{ backgroundColor: `${item.color}15` }}>
                                            <item.icon className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" style={{ color: item.color }} />
                                            <div className="absolute inset-0 opacity-10" style={{ backgroundColor: item.color }} />
                                        </div>
                                        <span className="text-sm sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight group-hover:translate-x-1 transition-transform">{item.subject}</span>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <span className="text-base sm:text-xl font-black text-rose-500 tracking-tighter">{item.accuracy}%</span>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <span className="text-base sm:text-xl font-black text-slate-300 dark:text-slate-500 tracking-tighter">{item.solved || 0}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {profile?.selected_plan === 'explorer' && (
                            <div className="mt-8 flex items-center justify-between p-6 bg-slate-50 dark:bg-muted rounded-2xl border border-slate-100 dark:border-border">
                                <div className="flex items-center gap-3">
                                    <Bot className="w-5 h-5 text-indigo-600" />
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Showing limited modules. Upgrade for full breakdown.</p>
                                </div>
                                <Button size="sm" onClick={() => navigate('/onboarding')} className="bg-slate-900 text-white font-black text-[9px] uppercase tracking-widest rounded-xl">
                                    Unlock Data
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
