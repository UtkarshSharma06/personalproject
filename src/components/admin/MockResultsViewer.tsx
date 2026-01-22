import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
    Trophy,
    Users,
    TrendingUp,
    CheckCircle,
    Clock,
    Award,
    Medal,
    Loader2,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface MockSession {
    id: string;
    title: string;
    start_time: string;
    end_time: string;
}

interface Submission {
    id: string;
    user_id: string;
    overall_band: number;
    reading_band: number;
    listening_band: number;
    writing_band: number;
    status: string;
    started_at: string;
    profiles: {
        display_name: string;
        email: string;
    };
}

export default function MockResultsViewer() {
    const { toast } = useToast();
    const [sessions, setSessions] = useState<MockSession[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string>('');
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchSessions();
    }, []);

    useEffect(() => {
        if (selectedSessionId) {
            fetchSubmissions();

            // Set up real-time subscription
            const channel = supabase
                .channel(`mock_results_${selectedSessionId}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'mock_exam_submissions',
                        filter: `session_id=eq.${selectedSessionId}`
                    },
                    () => {
                        fetchSubmissions();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [selectedSessionId]);

    const fetchSessions = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('mock_sessions')
                .select('id, title, start_time, end_time')
                .order('start_time', { ascending: false });

            if (error) throw error;
            setSessions(data || []);

            // Auto-select the most recent session
            if (data && data.length > 0) {
                setSelectedSessionId(data[0].id);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSubmissions = async () => {
        if (!selectedSessionId) return;

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('mock_exam_submissions')
                .select(`
                    *,
                    profiles(display_name, email)
                `)
                .eq('session_id', selectedSessionId)
                .order('overall_band', { ascending: false, nullsFirst: false });

            if (error) throw error;
            setSubmissions(data as any[] as Submission[]);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const completedSubmissions = submissions.filter(s => s.status === 'completed');
    const averageScore = completedSubmissions.length > 0
        ? completedSubmissions.reduce((sum, s) => sum + (s.overall_band || 0), 0) / completedSubmissions.length
        : 0;
    const highestScore = completedSubmissions.length > 0
        ? Math.max(...completedSubmissions.map(s => s.overall_band || 0))
        : 0;
    const completionRate = submissions.length > 0
        ? (completedSubmissions.length / submissions.length) * 100
        : 0;

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
        if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
        if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
        return <span className="text-sm font-bold text-slate-400">#{rank}</span>;
    };

    const selectedSession = sessions.find(s => s.id === selectedSessionId);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Mock Exam Results</h2>
                    <p className="text-sm text-slate-500 font-medium">View participant scores and rankings</p>
                </div>

                <Select value={selectedSessionId} onValueChange={setSelectedSessionId}>
                    <SelectTrigger className="w-full md:w-[350px] rounded-xl border-slate-200">
                        <SelectValue placeholder="Select a mock session" />
                    </SelectTrigger>
                    <SelectContent>
                        {sessions.map((session) => (
                            <SelectItem key={session.id} value={session.id}>
                                {session.title} - {new Date(session.start_time).toLocaleDateString()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            ) : !selectedSessionId ? (
                <Card className="p-12 text-center">
                    <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No Sessions Available</h3>
                    <p className="text-slate-500">Create a mock session to view results.</p>
                </Card>
            ) : (
                <>
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                            <div className="flex items-center justify-between mb-2">
                                <Users className="w-5 h-5 text-indigo-600" />
                                <span className="text-2xl font-black text-indigo-600">{submissions.length}</span>
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-600">Total Participants</p>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
                            <div className="flex items-center justify-between mb-2">
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                                <span className="text-2xl font-black text-emerald-600">{completedSubmissions.length}</span>
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-600">Completed</p>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-amber-50 to-white border-amber-100">
                            <div className="flex items-center justify-between mb-2">
                                <TrendingUp className="w-5 h-5 text-amber-600" />
                                <span className="text-2xl font-black text-amber-600">{averageScore.toFixed(1)}</span>
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-600">Average Score</p>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-violet-50 to-white border-violet-100">
                            <div className="flex items-center justify-between mb-2">
                                <Trophy className="w-5 h-5 text-violet-600" />
                                <span className="text-2xl font-black text-violet-600">{highestScore.toFixed(1)}</span>
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-600">Highest Score</p>
                        </Card>
                    </div>

                    {/* Leaderboard */}
                    <Card className="overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6">
                            <div className="flex items-center gap-3">
                                <Trophy className="w-6 h-6 text-white" />
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">Leaderboard</h3>
                            </div>
                        </div>

                        {submissions.length === 0 ? (
                            <div className="p-12 text-center">
                                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h4 className="text-lg font-bold text-slate-900 mb-2">No Submissions Yet</h4>
                                <p className="text-slate-500">Waiting for participants to complete the exam.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {submissions.map((submission, index) => (
                                    <div key={submission.id}>
                                        <div
                                            className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                                            onClick={() => toggleRow(submission.id)}
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-4 flex-1">
                                                    {/* Rank */}
                                                    <div className="w-12 flex justify-center">
                                                        {getRankIcon(index + 1)}
                                                    </div>

                                                    {/* Student Info */}
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-slate-900">
                                                            {submission.profiles?.display_name || 'Unknown'}
                                                        </h4>
                                                        <p className="text-xs text-slate-500">{submission.profiles?.email}</p>
                                                    </div>

                                                    {/* Overall Score */}
                                                    <div className="text-center">
                                                        <div className="text-2xl font-black text-indigo-600">
                                                            {submission.overall_band?.toFixed(1) || 'N/A'}
                                                        </div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Overall</p>
                                                    </div>

                                                    {/* Status */}
                                                    <Badge
                                                        variant={submission.status === 'completed' ? 'default' : 'secondary'}
                                                        className={submission.status === 'completed' ? 'bg-emerald-600' : 'bg-amber-500'}
                                                    >
                                                        {submission.status}
                                                    </Badge>

                                                    {/* Expand Icon */}
                                                    {expandedRows.has(submission.id) ? (
                                                        <ChevronUp className="w-5 h-5 text-slate-400" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        {expandedRows.has(submission.id) && (
                                            <div className="px-4 pb-4 bg-slate-50">
                                                <div className="grid grid-cols-3 gap-4 pt-4">
                                                    <div className="text-center p-3 bg-white rounded-xl border border-slate-200">
                                                        <div className="text-xl font-black text-blue-600">
                                                            {submission.reading_band?.toFixed(1) || 'N/A'}
                                                        </div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">Reading</p>
                                                    </div>
                                                    <div className="text-center p-3 bg-white rounded-xl border border-slate-200">
                                                        <div className="text-xl font-black text-purple-600">
                                                            {submission.listening_band?.toFixed(1) || 'N/A'}
                                                        </div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">Listening</p>
                                                    </div>
                                                    <div className="text-center p-3 bg-white rounded-xl border border-slate-200">
                                                        <div className="text-xl font-black text-orange-600">
                                                            {submission.writing_band?.toFixed(1) || 'N/A'}
                                                        </div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">Writing</p>
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-xs text-slate-500 text-center">
                                                    Submitted: {new Date(submission.started_at).toLocaleString()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </>
            )}
        </div>
    );
}
