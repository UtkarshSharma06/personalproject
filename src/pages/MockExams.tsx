import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useExam } from '@/context/ExamContext';
import { Calendar, Clock, Users, Globe, Play, ChevronRight, Zap, Target, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { differenceInHours, differenceInMinutes, isAfter, isBefore } from 'date-fns';
import { usePlanAccess } from '@/hooks/usePlanAccess';
import { UpgradeModal } from '@/components/UpgradeModal';

export default function MockExams() {
    const { user } = useAuth();
    const { activeExam } = useExam();
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<any[]>([]);
    const [registrations, setRegistrations] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const { isExplorer } = usePlanAccess();

    useEffect(() => {
        if (user && activeExam) {
            fetchSessions();
            fetchRegistrations();
        }
    }, [user, activeExam.id]);

    const fetchSessions = async () => {
        const now = new Date();
        const { data } = await (supabase as any)
            .from('mock_sessions')
            .select('*')
            .eq('is_active', true)
            .eq('exam_type', activeExam.id)
            .order('start_time', { ascending: true });

        if (data) {
            const processedSessions = data.map((s: any) => {
                const startTime = new Date(s.start_time);
                const endTime = new Date(s.end_time);
                const isLive = isBefore(startTime, now) && isAfter(endTime, now);
                const isPast = isAfter(now, endTime);

                return {
                    ...s,
                    isLive,
                    isPast,
                    isUpcoming: !isLive && !isPast
                };
            });
            setSessions(processedSessions);
        }
        setLoading(false);
    };

    const fetchRegistrations = async () => {
        if (!user) return;
        const { data } = await (supabase as any)
            .from('session_registrations')
            .select('session_id')
            .eq('user_id', user.id);

        if (data) {
            setRegistrations(data.map((r: any) => r.session_id));
        }
    };

    const handleRegister = async (sessionId: string) => {
        if (!user) return;
        if (isExplorer) {
            setIsUpgradeModalOpen(true);
            return;
        }

        const { error } = await (supabase as any)
            .from('session_registrations')
            .insert({
                user_id: user.id,
                session_id: sessionId
            });

        if (!error) {
            setRegistrations([...registrations, sessionId]);
        }
    };

    const handleStartOfficialSimulation = () => {
        if (isExplorer) {
            setIsUpgradeModalOpen(true);
            return;
        }
        const params = new URLSearchParams({
            mode: 'mock',
            full_exam: 'true',
            auto: 'true'  // Added to trigger auto-start
        });
        navigate(`/start-test?${params.toString()}`);
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl">
                {/* Header (Sleek Style) */}
                <div className="text-center mb-10 sm:mb-12 space-y-4 animate-in fade-in duration-700">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 dark:text-slate-100 leading-tight">
                        <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                            Official Simulation
                        </span>
                    </h1>
                    <p className="text-base sm:text-lg text-slate-400 font-bold tracking-tight">
                        Experience the real test environment, anytime.
                    </p>
                </div>

                {/* Official Simulation Section - REMOVED per user request
                <div className="mb-12 sm:mb-16">
                    <div className="bg-white dark:bg-card p-6 sm:p-10 rounded-[2rem] sm:rounded-[3.5rem] border-2 border-slate-100 dark:border-border border-b-[8px] shadow-2xl shadow-indigo-100/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />

                        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
                            <div className="flex-1 space-y-6 sm:space-y-8 w-full">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100 shrink-0">
                                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                                    <span className="text-[9px] sm:text-[10px] font-black text-indigo-900 uppercase tracking-widest leading-none">Verified Exam Model</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-100 leading-tight tracking-tight">
                                    Full {activeExam.id.split('-')[0].toUpperCase()} Simulated Exam
                                </h2>
                                <p className="text-sm sm:text-base text-slate-400 font-bold leading-relaxed">
                                    A controlled environment with the exact timing, question distribution, and scoring system of the official {activeExam.name.split(' (')[0]}.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-muted flex items-center justify-center border border-slate-100 dark:border-border">
                                            <Clock className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-widest">Duration</p>
                                            <p className="text-[13px] sm:text-sm font-black text-slate-900 dark:text-slate-100">{activeExam.durationMinutes} Mins</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-muted flex items-center justify-center border border-slate-100 dark:border-border">
                                            <Target className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-widest">Questions</p>
                                            <p className="text-[13px] sm:text-sm font-black text-slate-900 dark:text-slate-100">{activeExam.totalQuestions} Items</p>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleStartOfficialSimulation}
                                    className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 font-bold px-8 sm:px-12 py-6 sm:py-8 rounded-2xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl h-14 sm:h-16 group/btn text-xs sm:text-sm"
                                >
                                    <Play className="w-5 h-5 fill-white group-hover/btn:scale-110 transition-transform shrink-0" />
                                    <span>START SIMULATION</span>
                                </Button>
                            </div>

                            <div className="hidden lg:block w-72 h-72 relative shrink-0">
                                <div className="absolute inset-0 bg-indigo-600 rounded-[3rem] rotate-6 opacity-5" />
                                <div className="absolute inset-0 bg-white dark:bg-card border border-slate-100 dark:border-border rounded-[3rem] shadow-xl flex items-center justify-center">
                                    <div className="text-center">
                                        <Zap className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                                        <p className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none mb-1">PRO</p>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Environment</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                */}

                {/* Global Sessions Section */}
                <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between px-2 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100 shadow-sm shrink-0">
                                <Globe className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Global Mock Sessions</h3>
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest">Scheduled Events</span>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-10">
                            <div className="w-8 h-8 border-2 border-slate-100 dark:border-border border-t-indigo-600 rounded-full animate-spin" />
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="bg-slate-50/50 p-10 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-slate-100 dark:border-border border-b-[6px] text-center">
                            <p className="text-slate-400 font-bold text-sm tracking-tight leading-relaxed">No live global sessions currently scheduled.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-12">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="bg-white dark:bg-card p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-slate-100 dark:border-border border-b-[6px] shadow-xl shadow-slate-200/50 hover:border-slate-300 hover:-translate-y-1 hover:shadow-2xl active:border-b-2 active:translate-y-1 transition-all duration-300 group"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6 sm:mb-8">
                                        <div className={`px-3 py-1.5 rounded-full border text-[8px] sm:text-[9px] font-black uppercase tracking-widest leading-none ${session.isLive
                                            ? 'bg-red-50 border-red-100 text-red-600 animate-pulse'
                                            : session.isPast
                                                ? 'bg-slate-50 dark:bg-muted border-slate-200 dark:border-border text-slate-500'
                                                : 'bg-slate-50 dark:bg-muted border-slate-100 dark:border-border text-slate-400'
                                            }`}>
                                            {session.isLive ? '🔴 Live Mission' : session.isPast ? '📝 Practice Mode' : '📅 Scheduled'}
                                        </div>
                                        {!session.isPast && (
                                            <div className="text-right ml-auto">
                                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">
                                                    {session.isLive ? 'Closes In' : 'Starts In'}
                                                </p>
                                                <p className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                                                    {(() => {
                                                        const targetDate = session.isLive ? new Date(session.end_time) : new Date(session.start_time);
                                                        const h = Math.max(0, differenceInHours(targetDate, new Date()));
                                                        const m = Math.max(0, differenceInMinutes(targetDate, new Date()) % 60);
                                                        return `${h}h ${m}m`;
                                                    })()}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mb-6 group-hover:text-indigo-600 transition-colors uppercase tracking-tight leading-tight">{session.title}</h3>

                                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 py-4 border-y border-slate-50">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{session.duration} MIN</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Users className="w-3.5 h-3.5" />
                                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Global Entry</span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => {
                                            if (session.isPast) {
                                                // Past sessions: direct to test start with session context
                                                const params = new URLSearchParams({
                                                    mode: 'mock',
                                                    full_exam: 'true',
                                                    session_id: session.id,
                                                    practice_mode: 'true'
                                                });
                                                navigate(`/start-test?${params.toString()}`);
                                            } else if (registrations.includes(session.id)) {
                                                navigate(`/waiting-room/${session.id}`);
                                            } else {
                                                handleRegister(session.id);
                                            }
                                        }}
                                        className={`w-full h-12 sm:h-14 font-black rounded-2xl text-[9px] sm:text-[10px] uppercase tracking-[0.15em] transition-all shadow-sm flex items-center justify-center gap-2 ${session.isPast
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            : registrations.includes(session.id)
                                                ? 'bg-slate-900 text-white hover:bg-slate-800'
                                                : 'bg-white dark:bg-card text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-border hover:border-slate-900'
                                            }`}
                                    >
                                        <span>{session.isPast ? 'Start Practice' : registrations.includes(session.id) ? 'Enter Command Room' : 'Request Access'}</span>
                                        <ChevronRight className="w-4 h-4 shrink-0" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                title="Pro Feature Locked"
                description="Official Mock Simulations and Global Sessions are exclusive to PRO and ELITE plans. Upgrade now to experience building-grade exam preparation."
                feature="Official Mock Exams"
            />
        </Layout>
    );
}
