import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import {
    AlertTriangle,
    Monitor,
    Camera,
    Mic,
    Maximize,
    ShieldAlert,
    Activity,
    Lock
} from 'lucide-react';
import { Button } from './ui/button';

interface ProctoringSystemProps {
    testId: string;
    onViolationThresholdReached: () => void;
    isActive: boolean;
}

export default function ProctoringSystem({ testId, onViolationThresholdReached, isActive }: ProctoringSystemProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [warnings, setWarnings] = useState(0);
    const [fullscreenActive, setFullscreenActive] = useState(false);
    const [mediaStatus, setMediaStatus] = useState({ camera: false, mic: false });

    const MAX_WARNINGS = 3;
    const proctorInterval = useRef<any>(null);

    useEffect(() => {
        if (!isActive) return;

        // 1. Monitor Visibility / Tab Switching
        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleViolation('tab_switch', 'User switched tabs or minimized the browser');
            }
        };

        // 2. Monitor Window Focus
        const handleBlur = () => {
            handleViolation('focus_lost', 'User clicked outside the exam window');
        };

        // 3. Monitor Fullscreen
        const handleFullscreenChange = () => {
            setFullscreenActive(!!document.fullscreenElement);
            if (!document.fullscreenElement) {
                handleViolation('fullscreen_exit', 'User exited fullscreen mode');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        // Initial Fullscreen Request
        requestFullscreen();

        // Start Media Check (Camera/Mic)
        checkMediaPermissions();

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            if (proctorInterval.current) clearInterval(proctorInterval.current);
        };
    }, [isActive]);

    const requestFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            }
        } catch (err) {
            console.error('Fullscreen request failed:', err);
        }
    };

    const checkMediaPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setMediaStatus({ camera: true, mic: true });

            stream.getTracks().forEach(track => {
                track.onended = () => {
                    handleViolation('media_interruption', `${track.kind} track ended unexpectedly`);
                };
            });
        } catch (err) {
            setMediaStatus({ camera: false, mic: false });
            handleViolation('media_denied', 'Camera or microphone access denied');
        }
    };

    const handleViolation = async (type: string, details: string) => {
        if (!user || !isActive) return;

        const newWarnings = warnings + 1;
        setWarnings(newWarnings);

        // Log to DB
        await (supabase as any).from('proctoring_logs').insert({
            test_id: testId,
            user_id: user.id,
            violation_type: type,
            details: details,
            severity: newWarnings >= MAX_WARNINGS ? 'critical' : 'warning',
        });

        toast({
            title: 'Proctoring Violation',
            description: `${details}. Warning ${newWarnings}/${MAX_WARNINGS}`,
            variant: 'destructive',
        });

        if (newWarnings >= MAX_WARNINGS) {
            onViolationThresholdReached();
        }
    };

    if (!isActive) return null;

    const integrityScore = Math.max(0, 100 - (warnings * 33));

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/80 backdrop-blur-xl border border-slate-100 dark:border-border p-6 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 min-w-[280px]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
                            <ShieldAlert className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-slate-100 dark:text-slate-100">Live IQ Proctor</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 rounded-full border border-red-100">
                        <Activity className="w-2.5 h-2.5 text-red-600 animate-pulse" />
                        <span className="text-[8px] font-black text-red-600 uppercase">Secure</span>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    {[
                        { label: 'Optics System', status: mediaStatus.camera, icon: Camera },
                        { label: 'Audio Stream', status: mediaStatus.mic, icon: Mic },
                        { label: 'Display Lock', status: fullscreenActive, icon: Monitor },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <item.icon className={`w-3.5 h-3.5 ${item.status ? 'text-slate-400' : 'text-rose-500'}`} />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${item.status ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'}`} />
                        </div>
                    ))}
                </div>

                <div className="pt-6 border-t border-slate-50 space-y-3">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Integrity Rating</span>
                        <span className={`text-[10px] font-black ${warnings > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {integrityScore}%
                        </span>
                    </div>
                    <div className="h-1.5 bg-slate-50 dark:bg-muted rounded-full overflow-hidden border border-slate-100 dark:border-border p-0.5">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${warnings === 0 ? 'bg-emerald-500' :
                                    warnings === 1 ? 'bg-orange-500' :
                                        'bg-rose-500'
                                }`}
                            style={{ width: `${integrityScore}%` }}
                        />
                    </div>
                    <p className="text-[8px] font-bold text-slate-400 text-center uppercase tracking-widest leading-none">
                        Warning {warnings} of {MAX_WARNINGS} Locked
                    </p>
                </div>

                {!fullscreenActive && (
                    <Button
                        onClick={requestFullscreen}
                        className="w-full mt-6 bg-slate-900 text-white hover:bg-slate-800 h-10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
                    >
                        RESTORE SESSION LOCK
                    </Button>
                )}
            </div>
        </div>
    );
}
