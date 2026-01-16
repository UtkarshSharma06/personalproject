import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Mic, MicOff, Video, VideoOff, PhoneOff, RefreshCcw, FileText, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// Setup WebRTC config
const rtcConfig = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export default function SpeakingSession() {
    const { sessionId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Session State
    const [sessionData, setSessionData] = useState<any>(null);
    const [role, setRole] = useState<'interviewer' | 'candidate' | 'observer'>('observer');
    const [connectionStatus, setConnectionStatus] = useState('Initializing...');

    // Media State
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const localStream = useRef<MediaStream | null>(null);

    // Scoring State (Interviewer Only)
    const [scores, setScores] = useState({ fluency: 6.0, vocab: 6.0, grammar: 6.0, pron: 6.0 });

    useEffect(() => {
        if (!sessionId || !user) return;
        initializeSession();
        return () => cleanupSession();
    }, [sessionId, user]);

    const initializeSession = async () => {
        try {
            // 1. Fetch Session Data
            const { data, error } = await supabase.from('speaking_sessions').select('*').eq('id', sessionId).single();
            if (error) throw error;
            setSessionData(data);

            // 2. Determine Role
            // Explicitly cast to anyone if the type system is lagging, but we've added the types now
            const session = data as any;
            if (user?.id === session.interviewer_id) setRole('interviewer');
            else if (user?.id === session.candidate_id) setRole('candidate');

            // 3. Initialize Media
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Camera/Microphone access is only available in secure contexts (HTTPS or localhost). Please check your browser settings or use a secure connection.");
            }

            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStream.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            // 4. Setup Peer Connection
            setupWebRTC(session.interviewer_id === user?.id);

        } catch (err: any) {
            console.error(err);
            toast({ title: 'Connection Error', description: err.message, variant: 'destructive' });
            navigate('/speaking');
        }
    };

    const setupWebRTC = (isInitiator: boolean) => {
        const pc = new RTCPeerConnection(rtcConfig);
        peerConnection.current = pc;

        // Add Local Tracks
        localStream.current?.getTracks().forEach(track => pc.addTrack(track, localStream.current!));

        // Handle Remote Stream
        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        // Handle ICE Candidates
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendSignal('ice-candidate', event.candidate);
            }
        };

        pc.onconnectionstatechange = () => setConnectionStatus(pc.connectionState);

        // Listen for Signaling
        const channel = supabase.channel(`speaking_${sessionId}`)
            .on('broadcast', { event: 'signal' }, async ({ payload }) => {
                if (!peerConnection.current) return;

                if (payload.type === 'offer' && !isInitiator) {
                    await pc.setRemoteDescription(new RTCSessionDescription(payload.data));
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    sendSignal('answer', answer);
                } else if (payload.type === 'answer' && isInitiator) {
                    await pc.setRemoteDescription(new RTCSessionDescription(payload.data));
                } else if (payload.type === 'ice-candidate') {
                    await pc.addIceCandidate(new RTCIceCandidate(payload.data));
                } else if (payload.type === 'swap-roles') {
                    // Logic to swap local role state
                    setRole(prev => prev === 'interviewer' ? 'candidate' : 'interviewer');
                    toast({ title: 'Roles Swapped', description: 'You are now the ' + (role === 'interviewer' ? 'Candidate' : 'Interviewer') });
                }
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED' && isInitiator) {
                    // Create Offer
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    sendSignal('offer', offer);
                }
            });
    };

    const sendSignal = async (type: string, data: any) => {
        await supabase.channel(`speaking_${sessionId}`).send({
            type: 'broadcast',
            event: 'signal',
            payload: { type, data }
        });
    };

    const cleanupSession = () => {
        localStream.current?.getTracks().forEach(track => track.stop());
        peerConnection.current?.close();
        supabase.removeAllChannels();
    };

    const handleSwapRoles = () => {
        sendSignal('swap-roles', {});
        setRole(prev => prev === 'interviewer' ? 'candidate' : 'interviewer');
    };

    const handleLeave = () => {
        cleanupSession();
        navigate('/speaking');
    };

    return (
        <Layout showFooter={false}>
            <div className="h-[calc(100vh-4.5rem)] flex flex-col md:flex-row bg-slate-950">
                {/* VIDEO AREA (Left/Top) */}
                <div className="flex-1 relative bg-black flex items-center justify-center p-4">
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-contain rounded-2xl bg-slate-900" />

                    {/* Local PIP */}
                    <div className="absolute top-8 right-8 w-48 aspect-video rounded-xl overflow-hidden shadow-2xl border-2 border-slate-800/50">
                        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    </div>

                    {/* Controls Overlay */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 p-4 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10">
                        <Button size="icon" variant={isMuted ? "destructive" : "ghost"} className="rounded-full text-white hover:bg-white/20" onClick={() => {
                            localStream.current?.getAudioTracks().forEach(t => t.enabled = !t.enabled);
                            setIsMuted(!isMuted);
                        }}>
                            {isMuted ? <MicOff /> : <Mic />}
                        </Button>
                        <Button size="icon" variant={isVideoOff ? "destructive" : "ghost"} className="rounded-full text-white hover:bg-white/20" onClick={() => {
                            localStream.current?.getVideoTracks().forEach(t => t.enabled = !t.enabled);
                            setIsVideoOff(!isVideoOff);
                        }}>
                            {isVideoOff ? <VideoOff /> : <Video />}
                        </Button>
                        <Button size="icon" variant="destructive" className="rounded-full" onClick={handleLeave}>
                            <PhoneOff />
                        </Button>
                    </div>

                    <div className="absolute top-8 left-8 bg-black/50 px-3 py-1 rounded-full text-xs font-mono text-white/50">
                        Status: <span className={connectionStatus === 'connected' ? 'text-green-400' : 'text-yellow-400'}>{connectionStatus}</span>
                    </div>
                </div>

                {/* SIDEBAR (Right/Bottom) */}
                <div className="w-full md:w-[400px] lg:w-[480px] bg-slate-50 dark:bg-muted border-l border-slate-200 dark:border-border flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200 dark:border-border bg-white dark:bg-card flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 dark:text-slate-100">IELTS Practice</h2>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                {role === 'interviewer' ? 'You are the Interviewer' : 'You are the Candidate'}
                            </p>
                        </div>
                        <Button size="sm" variant="outline" onClick={handleSwapRoles} className="gap-2">
                            <RefreshCcw className="w-3 h-3" /> Swap
                        </Button>
                    </div>

                    <div className="flex-1 overflow-auto p-6 space-y-8">
                        {role === 'interviewer' ? (
                            <>
                                {/* Script Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs tracking-widest">
                                        <FileText className="w-4 h-4" /> Part 1: Introduction
                                    </div>
                                    <Card className="p-6 bg-white dark:bg-card shadow-sm border-slate-100 dark:border-border dark:border-border">
                                        <p className="mb-4 font-semibold text-slate-600 dark:text-slate-400">Ask the candidate:</p>
                                        <ul className="list-disc pl-4 space-y-2 text-slate-800">
                                            <li>Can you tell me your full name?</li>
                                            <li>Do you work or are you a student?</li>
                                            <li>What do you like most about your hometown?</li>
                                            <li>Do you prefer home-cooked meals or eating out?</li>
                                        </ul>
                                    </Card>
                                </div>

                                {/* Scoring Section */}
                                <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-border dark:border-border">
                                    <h3 className="font-black text-slate-900 dark:text-slate-100 dark:text-slate-100">Live Scoring</h3>
                                    {[
                                        { label: 'Fluency & Coherence', key: 'fluency' },
                                        { label: 'Lexical Resource', key: 'vocab' },
                                        { label: 'Grammar', key: 'grammar' },
                                        { label: 'Pronunciation', key: 'pron' }
                                    ].map(metric => (
                                        <div key={metric.key} className="space-y-3">
                                            <div className="flex justify-between text-sm font-medium">
                                                <span className="text-slate-600 dark:text-slate-400">{metric.label}</span>
                                                <span className="text-indigo-600 font-bold">{(scores as any)[metric.key]}</span>
                                            </div>
                                            <Slider
                                                value={[(scores as any)[metric.key]]}
                                                min={0} max={9} step={0.5}
                                                onValueChange={([val]) => setScores(p => ({ ...p, [metric.key]: val }))}
                                                className="[&>.relative>.absolute]:bg-indigo-600"
                                            />
                                        </div>
                                    ))}
                                    <Button
                                        onClick={async () => {
                                            try {
                                                await (supabase as any).from('speaking_scores').insert({
                                                    session_id: sessionId,
                                                    scorer_id: user?.id,
                                                    candidate_id: sessionData?.candidate_id === user?.id ? sessionData?.interviewer_id : sessionData?.candidate_id,
                                                    fluency_score: scores.fluency,
                                                    vocabulary_score: scores.vocab,
                                                    grammar_score: scores.grammar,
                                                    pronunciation_score: scores.pron
                                                });

                                                toast({ title: 'Score Saved!', description: 'Swapping roles...' });
                                                sendSignal('swap-roles', {});
                                                setRole('candidate');
                                                setScores({ fluency: 6.0, vocab: 6.0, grammar: 6.0, pron: 6.0 });
                                            } catch (error: any) {
                                                console.error(error);
                                                toast({ title: 'Error', description: 'Failed to save score', variant: 'destructive' });
                                            }
                                        }}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-indigo-200"
                                    >
                                        Submit Score & Swap Roles
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
                                <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center animate-pulse">
                                    <Video className="w-10 h-10 text-indigo-300" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 dark:text-slate-100">Candidate Mode</h3>
                                    <p className="text-slate-500 max-w-xs mx-auto mt-2">
                                        Focus on the interviewer's video. Listen carefully to the questions.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
