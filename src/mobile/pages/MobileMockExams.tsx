import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useExam } from '@/context/ExamContext';
import {
    Calendar, Clock, Users, Globe, Play, ChevronRight,
    Zap, Target, ShieldCheck, Loader2, Sparkles, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { differenceInHours, differenceInMinutes, isAfter, isBefore } from 'date-fns';
import { usePlanAccess } from '@/hooks/usePlanAccess';
import { UpgradeModal } from '@/components/UpgradeModal';
import { Card, CardContent } from "@/components/ui/card";

export default function MobileMockExams() {
    const { user } = useAuth();
    const { activeExam } = useExam();
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<any[]>([]);
    const [registrations, setRegistrations] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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
            const processed = data.map((s: any) => {
                const start = new Date(s.start_time);
                const end = new Date(s.end_time);
                return {
                    ...s,
                    isLive: isBefore(start, now) && isAfter(end, now),
                    isPast: isAfter(now, end),
                    isUpcoming: isBefore(now, start)
                };
            });
            setSessions(processed);
        }
        setIsLoading(false);
    };

    const fetchRegistrations = async () => {
        if (!user) return;
        const { data } = await (supabase as any).from('session_registrations').select('session_id').eq('user_id', user.id);
        if (data) setRegistrations(data.map((r: any) => r.session_id));
    };

    const handleRegister = async (sessionId: string) => {
        if (!user) return;
        if (isExplorer) { setIsUpgradeModalOpen(true); return; }
        const { error } = await (supabase as any).from('session_registrations').insert({ user_id: user.id, session_id: sessionId });
        if (!error) setRegistrations([...registrations, sessionId]);
    };

    const formatCountdown = (session: any) => {
        const target = session.isLive ? new Date(session.end_time) : new Date(session.start_time);
        const h = Math.max(0, differenceInHours(target, new Date()));
        const m = Math.max(0, differenceInMinutes(target, new Date()) % 60);
        return `${h}h ${m}m`;
    };

    return (
        <div className="flex flex-col min-h-full bg-background pb-20 animate-in fade-in duration-500">
            <div className="flex-1 px-4 space-y-6 py-6">
                {/* Global Pulse Indicator */}
                <div className="mx-2 bg-secondary/20 rounded-2xl border border-border/50 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-primary opacity-60" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black uppercase text-emerald-500">Live</span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <span className="text-[10px] font-black uppercase text-muted-foreground">Loading Sessions...</span>
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-20 bg-secondary/10 rounded-[3rem] border border-dashed border-border px-8">
                        <AlertCircle className="w-12 h-12 text-muted-foreground opacity-20 mx-auto mb-4" />
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No active sessions found</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sessions.map((session, i) => (
                            <Card key={i} className="bg-secondary/20 border-border/40 rounded-[2.5rem] overflow-hidden border-b-4 shadow-xl">
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 border ${session.isLive ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' : 'bg-secondary text-muted-foreground border-border/50'
                                            }`}>
                                            {session.isLive ? <><div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> Live Now</> : 'Scheduled'}
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[7px] font-black text-muted-foreground uppercase opacity-40 mb-1">{session.isLive ? 'Closes' : 'Starts'} In</span>
                                            <span className="text-sm font-black text-primary font-mono">{formatCountdown(session)}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black uppercase tracking-tight leading-tight">{session.title}</h3>
                                        <div className="flex items-center gap-4 text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="text-[9px] font-black uppercase tracking-widest">{session.duration} MIN</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5" />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Global Entry</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => {
                                            if (session.isPast) {
                                                navigate(`/start-test?mode=mock&full_exam=true&session_id=${session.id}&practice_mode=true`);
                                            } else if (registrations.includes(session.id)) {
                                                navigate(`/waiting-room/${session.id}`);
                                            } else {
                                                handleRegister(session.id);
                                            }
                                        }}
                                        className={`w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg ${registrations.includes(session.id) ? 'bg-primary text-white' : 'bg-background text-foreground border border-border/50'
                                            }`}
                                    >
                                        {session.isPast ? 'Start Practice' : registrations.includes(session.id) ? 'Enter Room' : 'Request Access'}
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* PRO Limitation Section */}
                <div className="p-8 bg-slate-950 rounded-[3rem] border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 text-center space-y-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/10">
                            <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="text-white font-black text-lg uppercase tracking-tight leading-tight">Mock Exams</h4>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest leading-relaxed px-4">
                            Unlock official full-length exams and detailed performance reports.
                        </p>
                        {isExplorer && (
                            <Button onClick={() => navigate('/onboarding')} className="bg-primary text-white w-full rounded-xl py-6 font-black text-[10px] uppercase tracking-widest">Upgrade to PRO</Button>
                        )}
                    </div>
                </div>
            </div>

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                title="Premium Access Required"
                description="Mock Exams are reserved for PRO members. Upgrade your plan to continue."
                feature="Full Exams"
            />
        </div>
    );
}
