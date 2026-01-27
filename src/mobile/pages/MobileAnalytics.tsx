import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useExam } from '@/context/ExamContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import {
    BarChart3, TrendingUp, Target, Clock, Award, Bot, Sparkles,
    Brain, ChevronRight, PenTool, Mic, BookOpen, Headphones,
    Calculator, FileText, Microscope, FlaskConical, Atom
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const dailyData = [
    { day: 'Mon', score: 0 }, { day: 'Tue', score: 0 }, { day: 'Wed', score: 0 },
    { day: 'Thu', score: 0 }, { day: 'Fri', score: 0 }, { day: 'Sat', score: 0 },
    { day: 'Sun', score: 0 },
];

export default function MobileAnalytics() {
    const { user, profile } = useAuth();
    const { activeExam } = useExam();
    const navigate = useNavigate();
    const [subjectData, setSubjectData] = useState<any[]>([]);
    const [stats, setStats] = useState({
        accuracy: '0%', timeSpent: '0h', verifiedSkills: '0%', percentile: 'Top 50%'
    });
    const [points, setPoints] = useState(0);
    const [rank, setRank] = useState(0);
    const [timeframe, setTimeframe] = useState<'7d' | '30d' | '6m'>('7d');
    const [velocityData, setVelocityData] = useState<any[]>([]);
    const [projection, setProjection] = useState({ score: 0, target: 60, confidence: 0, trajectory: 'Stable' });

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!user || !activeExam) return;

            // ... (Existing subject mastery code preserved) ...
            // 1. Fetch Data Logic (Identical to Web)
            const { data: totalQuestions } = await (supabase as any).from('practice_questions').select('subject').eq('exam_type', activeExam.id);
            const { data: solvedBySubject } = await (supabase as any).from('user_practice_responses').select('subject, is_correct, question_id, created_at').eq('user_id', user.id).eq('exam_type', activeExam.id);

            const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
            const isIELTS = activeExam.id === 'ielts-academic';

            let processedData = [];
            if (isIELTS) {
                // ... (IELTS Logic preserved)
                const [
                    { data: writingSubs }, { data: speakingSubs },
                    { data: readingSubs }, { data: listeningSubs }
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

                processedData = [
                    { subject: 'Writing', score: writingAvg, solved: writingSubs?.length || 0, accuracy: Math.round(writingAvg * 11.1), color: '#6366f1', icon: PenTool },
                    { subject: 'Speaking', score: speakingAvg, solved: speakingSubs?.length || 0, accuracy: Math.round(speakingAvg * 11.1), color: '#f59e0b', icon: Mic },
                    { subject: 'Reading', score: readingAvg, solved: readingSubs?.length || 0, accuracy: readingAvg > 0 ? Math.round((readingAvg / 40) * 100) : 0, color: '#10b981', icon: BookOpen },
                    { subject: 'Listening', score: listeningAvg, solved: listeningSubs?.length || 0, accuracy: listeningAvg > 0 ? Math.round((listeningAvg / 40) * 100) : 0, color: '#ef4444', icon: Headphones },
                ];
            } else {
                const subjectIcons: any = { 'Mathematics': Calculator, 'Biology': Microscope, 'Chemistry': FlaskConical, 'Physics': Atom };
                processedData = activeExam.sections.map((section: any, index: number) => {
                    const attempts = solvedBySubject?.filter((q: any) => q.subject === section.name) || [];
                    const correct = attempts.filter((q: any) => q.is_correct).length;
                    return {
                        subject: section.name,
                        score: attempts.length > 0 ? Math.round((correct / attempts.length) * 100) : 0,
                        accuracy: attempts.length > 0 ? Math.round((correct / attempts.length) * 100) : 0,
                        solved: new Set(attempts.map(a => a.question_id)).size,
                        icon: subjectIcons[section.name] || Sparkles,
                        color: colors[index % colors.length]
                    };
                });
            }

            setSubjectData(profile?.selected_plan === 'explorer' ? processedData.slice(0, 2) : processedData);

            // Fetch Overall Stats
            const { data: userTests } = await (supabase as any).from('tests').select('*').eq('user_id', user.id).eq('exam_type', activeExam.id).eq('status', 'completed');
            setPoints(userTests?.reduce((acc: number, t: any) => acc + (t.correct_answers || 0), 0) || 0);


            // --- NEW GROWTH VELOCITY LOGIC ---
            const days = timeframe === '30d' ? 30 : 7;
            const now = new Date();
            const past = new Date();
            past.setDate(now.getDate() - days);

            // Filter responses by date
            const recentResponses = solvedBySubject?.filter((r: any) => new Date(r.created_at) >= past) || [];

            // Also fetch tests if needed, but responses are usually enough for "activity"

            const groupedData: Record<string, number> = {};
            // Initialize all days with 0
            for (let i = 0; i < days; i++) {
                const d = new Date();
                d.setDate(d.getDate() - (days - 1 - i));
                const dateKey = format(d, 'MMM d'); // Using date format instead of Day name for clearer 30d view
                groupedData[dateKey] = 0;
            }

            // Fill with real data
            recentResponses.forEach((r: any) => {
                const dateKey = format(new Date(r.created_at), 'MMM d');
                if (groupedData[dateKey] !== undefined) {
                    groupedData[dateKey]++;
                }
            });

            // Convert to array
            const velocityChartData = Object.entries(groupedData).map(([day, score]) => ({ day, score }));
            setVelocityData(velocityChartData);


            // Stats calculation
            const overallAccuracy = solvedBySubject && solvedBySubject.length > 0 ? Math.round((solvedBySubject.filter((q: any) => q.is_correct).length / solvedBySubject.length) * 100) : 0;
            setStats({
                accuracy: `${overallAccuracy}%`,
                timeSpent: `${Math.round((userTests?.reduce((acc: number, t: any) => acc + (t.time_taken_seconds || 0), 0) || 0) / 3600)}h`,
                verifiedSkills: `${processedData.filter(d => d.accuracy >= 70).length} Mastered`,
                percentile: 'Top 10%'
            });

            const targetScore = isIELTS ? 9 : 60;
            setProjection({ score: Number(((overallAccuracy / 100) * targetScore).toFixed(1)), target: targetScore, confidence: 85, trajectory: 'Improving' });
        };

        fetchAnalytics();
    }, [user, activeExam, timeframe]);

    return (
        <div className="flex flex-col min-h-full bg-background pb-10">
            {/* Metrics Grid */}
            <div className="p-6 grid grid-cols-2 gap-3">
                <StatBox label="Accuracy" value={stats.accuracy} icon={<Target className="text-orange-400" />} />
                <StatBox label="Time Spent" value={stats.timeSpent} icon={<Clock className="text-pink-400" />} />
                <StatBox label="Skills" value={stats.verifiedSkills} icon={<Award className="text-emerald-400" />} />
                <StatBox label="Percentile" value={stats.percentile} icon={<TrendingUp className="text-indigo-400" />} />
            </div>

            <div className="flex-1 px-4 space-y-6">
                {/* AI Score Predictor - Floating Glass Card */}
                <Card className="bg-slate-950 border-white/10 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
                    <CardHeader className="pb-2 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 mx-auto mb-2">
                            <Bot className="w-3 h-3 text-primary animate-pulse" />
                            <span className="text-[8px] font-black text-primary-foreground uppercase tracking-[0.2em]">AI Predictor v1</span>
                        </div>
                        <CardTitle className="text-white text-md uppercase tracking-tighter">Projected Final Score</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 relative z-10 flex flex-col items-center gap-4">
                        <div className="text-5xl font-black text-white tracking-tighter">{projection.score}</div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)]" style={{ width: `${(projection.score / projection.target) * 100}%` }} />
                        </div>
                        <div className="grid grid-cols-2 w-full gap-2">
                            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                                <div className="text-[8px] uppercase font-black text-muted-foreground tracking-widest mb-1">Confidence</div>
                                <div className="text-sm font-black text-white">{projection.confidence}%</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                                <div className="text-[8px] uppercase font-black text-muted-foreground tracking-widest mb-1">Trajectory</div>
                                <div className="text-sm font-black text-emerald-400">{projection.trajectory}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Module List */}
                <section className="space-y-3">
                    <div className="flex justify-between items-center px-2">
                        <h2 className="font-black text-sm uppercase tracking-widest opacity-60">Module Mastery</h2>
                    </div>
                    <div className="space-y-2">
                        {subjectData.map((item, i) => (
                            <div key={i} className="bg-secondary/30 backdrop-blur-sm p-4 rounded-3xl border border-border/50 flex items-center gap-4 active:scale-95 transition-all">
                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-border/50 bg-background" style={{ color: item.color }}>
                                    <item.icon className="w-5 h-5 shadow-sm" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="font-black text-xs uppercase tracking-tight truncate">{item.subject}</span>
                                        <span className="text-[10px] font-black">{item.accuracy}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${item.accuracy}%`, backgroundColor: item.color }} />
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-30" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Charts Area */}
                <Card className="bg-secondary/20 border-border/40 rounded-[2.5rem] p-6 min-h-[300px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-[10px] uppercase tracking-[0.2em] opacity-60">Growth Velocity</h3>
                        <div className="flex gap-2 bg-background/50 p-1 rounded-full border border-border/50">
                            {['7d', '30d'].map(t => (
                                <button key={t} onClick={() => setTimeframe(t as any)} className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${timeframe === t ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground'}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={velocityData}>
                                <defs>
                                    <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                                    interval="preserveStartEnd"
                                />
                                <RechartsTooltip
                                    cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontWeight: 'bold', color: 'hsl(var(--foreground))' }}
                                    itemStyle={{ color: '#6366f1' }}
                                    labelStyle={{ color: 'hsl(var(--muted-foreground))', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                    formatter={(value: any) => [`${value} Solved`, 'Activity']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorMobile)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}

const StatBox = ({ label, value, icon }: { label: string, value: string, icon: any }) => (
    <div className="bg-secondary/30 backdrop-blur-md p-4 rounded-3xl border border-border/50 flex flex-col gap-2 relative overflow-hidden group">
        <div className="w-7 h-7 bg-background/50 rounded-xl flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div className="space-y-0.5">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{label}</span>
            <div className="text-md font-black text-foreground tracking-tighter leading-none">{value}</div>
        </div>
    </div>
);
