import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
    Plus,
    Trash2,
    Calendar,
    Clock,
    ShieldCheck,
    Loader2,
    AlertCircle,
    FileJson,
    Wand2,
    CheckCircle2,
    X,
    Zap,
    Brain,
    Pencil,
    Lock,
    Unlock
} from 'lucide-react';
import { format } from 'date-fns';
import { EXAMS } from '@/config/exams';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LearningManager from '@/components/admin/LearningManager';
import ReadingManager from '@/components/admin/ReadingManager';
import ListeningManager from '@/components/admin/ListeningManager';
import WritingManager from '@/components/admin/WritingManager';
import PracticeManager from '@/components/admin/PracticeManager';
import LabManager from '@/components/admin/LabManager';
import FeedbackManager from '@/components/admin/FeedbackManager';
import MockEvaluationManager from '@/components/admin/MockEvaluationManager';
import UserManager from '@/components/admin/UserManager';
import ConsultantManager from '@/components/admin/ConsultantManager';
import NotificationManager from '@/components/admin/NotificationManager';
import ResourceManager from '@/components/admin/ResourceManager';
import BlogManager from '@/components/admin/BlogManager';
import MockResultsViewer from '@/components/admin/MockResultsViewer';
import { Layers, Database, BookOpen, Headphones, PenTool, Rocket, MessageSquare, Award, Users as UsersIcon, UserCog, Box, Bell, Trophy, Newspaper } from 'lucide-react';

interface MockSession {
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    exam_type: string;
    is_active: boolean;
    is_official: boolean;
    access_type: 'open' | 'request_required';
    attempts_per_person?: number;
    registration_count?: number;
    config?: {
        reading_test_id?: string;
        listening_test_id?: string;
        writing_task1_id?: string;
        writing_task2_id?: string;
    };
}

interface SessionQuestion {
    section_name: string;
    question_text: string;
    options: string[];
    correct_index: number;
    explanation?: string;
    topic?: string;
}

export default function Admin() {
    const [sessions, setSessions] = useState<MockSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        exam_type: 'cent-s-prep',
        access_type: 'open',
        is_official: false,
        attempts_per_person: 1,
        reading_test_id: '',
        listening_test_id: '',
        writing_task1_id: '',
        writing_task2_id: ''
    });

    const [ieltsOptions, setIeltsOptions] = useState<{
        readingTests: any[];
        listeningTests: any[];
        writingTasks: any[];
    }>({
        readingTests: [],
        listeningTests: [],
        writingTasks: []
    });

    // Question Management State
    const [selectedSession, setSelectedSession] = useState<MockSession | null>(null);
    const [feedingText, setFeedingText] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const [manualQuestions, setManualQuestions] = useState<SessionQuestion[]>([]);
    const [importMode, setImportMode] = useState<'form' | 'json'>('form');
    const [jsonInput, setJsonInput] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState<SessionQuestion>({
        section_name: "General",
        question_text: "",
        options: ["", "", "", ""],
        correct_index: 0,
        explanation: "",
        topic: ""
    });

    useEffect(() => {
        fetchSessions();
        fetchIeltsOptions();

        // Subscribe to real-time registration updates
        const channel = supabase
            .channel('admin_registrations')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'session_registrations'
                },
                () => {
                    fetchSessions();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Fetch questions when a session is selected
    useEffect(() => {
        if (selectedSession) {
            fetchSessionQuestions(selectedSession.id);
        } else {
            setManualQuestions([]);
        }
    }, [selectedSession]);

    const fetchSessionQuestions = async (sessionId: string) => {
        const { data, error } = await supabase
            .from('session_questions')
            .select('*')
            .eq('session_id', sessionId);

        if (error) {
            toast({
                title: "Error fetching questions",
                description: error.message,
                variant: "destructive"
            });
            return;
        }

        if (data) {
            setManualQuestions(data.map((q: any) => ({
                section_name: q.section_name,
                question_text: q.question_text,
                options: q.options,
                correct_index: q.correct_index,
                explanation: q.explanation || "",
                topic: q.topic || ""
            })));
        }
    };

    const fetchIeltsOptions = async () => {
        const [
            { data: reading },
            { data: listening },
            { data: writing }
        ] = await Promise.all([
            supabase.from('reading_tests').select('id, title'),
            supabase.from('listening_tests').select('id, title'),
            supabase.from('writing_tasks').select('id, title, task_type')
        ]);

        setIeltsOptions({
            readingTests: reading || [],
            listeningTests: listening || [],
            writingTasks: writing || []
        });
    };

    const handleAddQuestionToList = () => {
        if (!currentQuestion.question_text.trim() || currentQuestion.options.some(opt => !opt.trim())) {
            toast({
                title: "Incomplete Question",
                description: "Please fill in the question text and all options.",
                variant: "destructive"
            });
            return;
        }

        setManualQuestions([...manualQuestions, { ...currentQuestion }]);
        // Reset form but keep section name
        setCurrentQuestion({
            ...currentQuestion,
            question_text: "",
            options: ["", "", "", ""],
            correct_index: 0,
            explanation: "",
            topic: ""
        });
        toast({ title: "Question Added to List" });
    };

    const handleJsonImport = () => {
        try {
            // Cleanup input if user pasted with markdown markers
            const cleanedInput = jsonInput
                .replace(/^```json\s*/i, '')
                .replace(/```\s*$/i, '')
                .trim();

            let parsed = JSON.parse(cleanedInput);

            // Handle wrapper object { "questions": [...] }
            if (!Array.isArray(parsed) && parsed.questions && Array.isArray(parsed.questions)) {
                parsed = parsed.questions;
            }

            if (!Array.isArray(parsed)) throw new Error("Input must be a JSON array or an object with a 'questions' array.");

            const examConfig = selectedSession ? EXAMS[selectedSession.exam_type as keyof typeof EXAMS] : null;
            const officialSections = examConfig?.sections.map(s => s.name) || [];

            const validated = parsed.map((q: any) => {
                let section = q.section_name || q.section || "General";

                // Smart mapping for common names if not an exact match
                if (selectedSession?.exam_type === 'imat-prep') {
                    if (/math|physics/i.test(section)) section = "Physics & Mathematics";
                    if (/biology/i.test(section)) section = "Biology";
                    if (/chemistry/i.test(section)) section = "Chemistry";
                    if (/logic|reasoning/i.test(section)) section = "Logical Reasoning";
                    if (/reading|knowledge/i.test(section)) section = "Reading Skills & General Knowledge";
                } else if (selectedSession?.exam_type === 'cent-s-prep') {
                    if (/math/i.test(section)) section = "Mathematics";
                    if (/logic|reading|reasoning/i.test(section)) section = "Reasoning on texts and data";
                    if (/biology/i.test(section)) section = "Biology";
                    if (/chemistry/i.test(section)) section = "Chemistry";
                    if (/physics/i.test(section)) section = "Physics";
                }

                return {
                    section_name: section,
                    question_text: q.question_text || q.question || "",
                    options: Array.isArray(q.options) ? q.options : ["", "", "", ""],
                    correct_index: typeof q.correct_index === 'number' ? q.correct_index : (typeof q.correctIndex === 'number' ? q.correctIndex : 0),
                    explanation: q.explanation || "",
                    topic: q.topic || ""
                };
            });

            setManualQuestions([...manualQuestions, ...validated]);
            setJsonInput('');
            setImportMode('form');
            toast({ title: "Bulk Import Success", description: `Added ${validated.length} questions. Section names mapped to official exam categories.` });
        } catch (err: any) {
            toast({ title: "Invalid JSON", description: err.message, variant: "destructive" });
        }
    };

    const handleSaveQuestions = async () => {
        if (!selectedSession || manualQuestions.length === 0) return;

        setIsSubmitting(true);

        // Final sort before injection to guarantee sequence
        const examConfig = EXAMS[selectedSession.exam_type as keyof typeof EXAMS];
        const sectionOrder = examConfig?.sections.map(s => s.name) || [];

        const sortedQuestions = [...manualQuestions].sort((a, b) => {
            const orderA = sectionOrder.indexOf(a.section_name);
            const orderB = sectionOrder.indexOf(b.section_name);
            if (orderA !== -1 && orderB !== -1) return orderA - orderB;
            if (orderA !== -1) return -1;
            if (orderB !== -1) return 1;
            return a.section_name.localeCompare(b.section_name);
        });

        const { error } = await (supabase as any)
            .from('session_questions')
            .insert(
                sortedQuestions.map(q => ({
                    session_id: selectedSession.id,
                    ...q
                }))
            );

        if (error) {
            toast({
                title: "Save Failed",
                description: error.message,
                variant: "destructive"
            });
        } else {
            toast({
                title: "Success",
                description: `Injected ${manualQuestions.length} questions into ${selectedSession.title}`
            });
            setManualQuestions([]);
            setSelectedSession(null);
        }
        setIsSubmitting(false);
    };

    const fetchSessions = async () => {
        setIsLoading(true);
        // 1. Fetch sessions
        const { data: sessionsData, error: sessionsError } = await (supabase as any)
            .from('mock_sessions')
            .select('*')
            .order('created_at', { ascending: false });

        if (sessionsError) {
            toast({
                title: "Error fetching sessions",
                description: sessionsError.message,
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        // 2. Fetch registration counts separately to avoid schema cache relationship errors
        // We fetch session_ids and count them in memory for maximum compatibility
        const { data: countsData, error: countsError } = await (supabase as any)
            .from('session_registrations')
            .select('session_id');

        const registrationCounts: Record<string, number> = {};
        if (countsData) {
            countsData.forEach((reg: any) => {
                registrationCounts[reg.session_id] = (registrationCounts[reg.session_id] || 0) + 1;
            });
        }

        const formattedData = (sessionsData || []).map((s: any) => ({
            ...s,
            registration_count: registrationCounts[s.id] || 0
        }));

        setSessions(formattedData);
        setIsLoading(false);
    };

    const handleSaveSession = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const sessionData = {
            title: formData.title,
            description: formData.description,
            start_time: new Date(formData.start_time).toISOString(),
            end_time: new Date(formData.end_time).toISOString(),
            exam_type: formData.exam_type,
            access_type: formData.access_type,
            is_official: formData.is_official,
            attempts_per_person: formData.attempts_per_person,
            is_active: true,
            config: formData.exam_type === 'ielts-academic' ? {
                reading_test_id: formData.reading_test_id,
                listening_test_id: formData.listening_test_id,
                writing_task1_id: formData.writing_task1_id,
                writing_task2_id: formData.writing_task2_id
            } : {}
        };

        const { error } = editingSessionId
            ? await (supabase as any)
                .from('mock_sessions')
                .update(sessionData)
                .eq('id', editingSessionId)
            : await (supabase as any)
                .from('mock_sessions')
                .insert([sessionData]);

        if (error) {
            toast({
                title: editingSessionId ? "Failed to update session" : "Failed to create session",
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: editingSessionId ? "Session Updated" : "Session Created",
                description: editingSessionId ? "The mock session has been updated." : "The mock session is now live.",
            });
            handleResetForm();
            fetchSessions();
        }
        setIsSubmitting(false);
    };

    const handleResetForm = () => {
        setFormData({
            title: '',
            description: '',
            start_time: '',
            end_time: '',
            exam_type: 'cent-s-prep',
            access_type: 'open',
            is_official: false,
            attempts_per_person: 1,
            reading_test_id: '',
            listening_test_id: '',
            writing_task1_id: '',
            writing_task2_id: ''
        });
        setEditingSessionId(null);
    };

    const handleEditClick = (session: MockSession) => {
        setEditingSessionId(session.id);
        setFormData({
            title: session.title,
            description: session.description,
            start_time: new Date(session.start_time).toISOString().slice(0, 16),
            end_time: new Date(session.end_time).toISOString().slice(0, 16),
            exam_type: session.exam_type,
            access_type: session.access_type || 'open',
            is_official: session.is_official,
            attempts_per_person: session.attempts_per_person || 1,
            reading_test_id: (session as any).config?.reading_test_id || '',
            listening_test_id: (session as any).config?.listening_test_id || '',
            writing_task1_id: (session as any).config?.writing_task1_id || '',
            writing_task2_id: (session as any).config?.writing_task2_id || ''
        });
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteSession = async (id: string) => {
        const { error } = await (supabase as any)
            .from('mock_sessions')
            .delete()
            .eq('id', id);

        if (error) {
            toast({
                title: "Error deleting session",
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Session Deleted",
            });
            fetchSessions();
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Admin Control</h1>
                        <p className="text-muted-foreground">Manage scheduled mock sessions and live exams.</p>
                    </div>
                </div>

                <Tabs defaultValue="sessions" className="space-y-8 relative z-10">
                    <div className="overflow-x-auto -mx-4 px-4 pb-2">
                        <TabsList className="bg-slate-100 p-1.5 rounded-2xl inline-flex w-auto border border-slate-200/50 shadow-sm min-w-min">
                            <TabsTrigger value="sessions" className="rounded-xl font-black text-xs uppercase tracking-widest px-4 lg:px-8 py-2.5 data-[state=active]:bg-white dark:bg-card data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all whitespace-nowrap">
                                Mock Simulations
                            </TabsTrigger>
                            <TabsTrigger value="blog" className="rounded-xl font-black text-xs uppercase tracking-widest px-4 lg:px-8 py-2.5 data-[state=active]:bg-white dark:bg-card data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all whitespace-nowrap">
                                Blog Management
                            </TabsTrigger>
                            <TabsTrigger value="users" className="rounded-xl font-black text-xs uppercase tracking-widest px-4 lg:px-8 py-2.5 data-[state=active]:bg-white dark:bg-card data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all whitespace-nowrap">
                                User Management
                            </TabsTrigger>
                            <TabsTrigger value="consultants" className="rounded-xl font-black text-xs uppercase tracking-widest px-4 lg:px-8 py-2.5 data-[state=active]:bg-white dark:bg-card data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all whitespace-nowrap">
                                Consultant Protocol
                            </TabsTrigger>
                            <TabsTrigger value="learning" className="rounded-xl font-black text-xs uppercase tracking-widest px-4 lg:px-8 py-2.5 data-[state=active]:bg-white dark:bg-card data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all whitespace-nowrap">
                                Knowledge Console
                            </TabsTrigger>
                            <TabsTrigger value="reading" className="rounded-xl font-black text-xs uppercase tracking-widest px-4 lg:px-8 py-2.5 data-[state=active]:bg-white dark:bg-card data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all whitespace-nowrap">
                                Reading Tests
                            </TabsTrigger>
                            <TabsTrigger value="listening" className="rounded-xl font-black text-xs uppercase tracking-widest px-4 lg:px-8 py-2.5 data-[state=active]:bg-white dark:bg-card data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all whitespace-nowrap">
                                Listening Tests
                            </TabsTrigger>
                            <TabsTrigger value="writing-evals" className="rounded-xl font-black text-xs uppercase tracking-widest px-4 lg:px-8 py-2.5 data-[state=active]:bg-white dark:bg-card data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all whitespace-nowrap">
                                Writing Evaluations
                            </TabsTrigger>
                            <TabsTrigger value="mock-evals" className="rounded-xl font-black text-xs uppercase tracking-widest px-4 lg:px-8 py-2.5 data-[state=active]:bg-white dark:bg-card data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all whitespace-nowrap">
                                Mock Evaluations
                            </TabsTrigger>
                            <TabsTrigger value="mock-results" className="rounded-xl font-black text-xs uppercase tracking-widest px-4 lg:px-8 py-2.5 data-[state=active]:bg-white dark:bg-card data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all whitespace-nowrap">
                                Mock Results
                            </TabsTrigger>
                            <TabsTrigger value="writing-tasks" className="rounded-xl font-black text-xs uppercase tracking-widest px-4 lg:px-8 py-2.5 data-[state=active]:bg-white dark:bg-card data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all whitespace-nowrap">
                                Writing Library
                            </TabsTrigger>
                            <TabsTrigger value="practice" className="rounded-xl font-black text-xs uppercase tracking-widest px-4 lg:px-8 py-2.5 data-[state=active]:bg-white dark:bg-card data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all whitespace-nowrap">
                                Practice Bank
                            </TabsTrigger>
                            <TabsTrigger value="feedback" className="rounded-xl font-black text-xs uppercase tracking-widest px-4 lg:px-8 py-2.5 data-[state=active]:bg-white dark:bg-card data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all whitespace-nowrap">
                                User Feedback
                            </TabsTrigger>
                            <TabsTrigger value="3d-labs" className="rounded-xl font-black text-xs uppercase tracking-widest px-4 lg:px-8 py-2.5 data-[state=active]:bg-white dark:bg-card data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all whitespace-nowrap">
                                3D Modules
                            </TabsTrigger>
                            <TabsTrigger value="resources" className="rounded-xl font-black text-xs uppercase tracking-widest px-4 lg:px-8 py-2.5 data-[state=active]:bg-white dark:bg-card data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all whitespace-nowrap">
                                Resource Library
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="rounded-xl font-black text-xs uppercase tracking-widest px-4 lg:px-8 py-2.5 data-[state=active]:bg-white dark:bg-card data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all whitespace-nowrap">
                                Notifications
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="resources">
                        <div className="card-surface p-8 rounded-[3rem]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight uppercase">Resource Library</h2>
                                    <p className="text-sm text-muted-foreground">Manage downloadable study materials and PDFs.</p>
                                </div>
                            </div>
                            <ResourceManager />
                        </div>
                    </TabsContent>

                    <TabsContent value="blog">
                        <div className="card-surface p-8 rounded-[3rem]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Newspaper className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight uppercase">Blog Authority</h2>
                                    <p className="text-sm text-muted-foreground">Create SEO-optimized articles to drive organic traffic.</p>
                                </div>
                            </div>
                            <BlogManager />
                        </div>
                    </TabsContent>

                    <TabsContent value="users">
                        <div className="card-surface p-8 rounded-[3rem]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <UsersIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight uppercase">User Access Control</h2>
                                    <p className="text-sm text-muted-foreground">Manage bans and community privileges.</p>
                                </div>
                            </div>
                            <UserManager />
                        </div>
                    </TabsContent>

                    <TabsContent value="consultants">
                        <div className="card-surface p-8 rounded-[3rem]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <UserCog className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight uppercase">Consultant Access Protocol</h2>
                                    <p className="text-sm text-muted-foreground">Manage admission experts and generate access codes.</p>
                                </div>
                            </div>
                            <ConsultantManager />
                        </div>
                    </TabsContent>

                    <TabsContent value="sessions">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Create Session Form */}
                            <div className="lg:col-span-1">
                                <div className="card-surface p-6 sticky top-8">
                                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                        {editingSessionId ? <Pencil className="w-5 h-5 text-indigo-500" /> : <Plus className="w-5 h-5" />}
                                        {editingSessionId ? 'Modify Session' : 'Schedule New'}
                                    </h2>
                                    <form onSubmit={handleSaveSession} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Session Title</Label>
                                            <Input
                                                id="title"
                                                placeholder="e.g. CEnT-S International Mock"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="exam_type">Exam Type</Label>
                                            <select
                                                id="exam_type"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={formData.exam_type}
                                                onChange={(e) => setFormData({ ...formData, exam_type: e.target.value })}
                                            >
                                                <option value="cent-s-prep">CEnT-S</option>
                                                <option value="imat-prep">IMAT</option>
                                                <option value="sat-prep">SAT (Beta)</option>
                                                <option value="ielts-academic">IELTS Academic</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="access_type">Access Control</Label>
                                            <select
                                                id="access_type"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                value={formData.access_type}
                                                onChange={(e) => setFormData({ ...formData, access_type: e.target.value })}
                                            >
                                                <option value="open">🔓 Open for All</option>
                                                <option value="request_required">🔒 Request Access Required</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="attempts">Attempt Limit (Per Person)</Label>
                                            <Input
                                                id="attempts"
                                                type="number"
                                                min="1"
                                                value={formData.attempts_per_person}
                                                onChange={(e) => setFormData({ ...formData, attempts_per_person: parseInt(e.target.value) || 1 })}
                                                required
                                            />
                                            <p className="text-[10px] text-muted-foreground">Number of times a user can take this exam.</p>
                                        </div>

                                        {formData.exam_type === 'ielts-academic' && (
                                            <div className="space-y-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Reading Module</Label>
                                                    <select
                                                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        value={formData.reading_test_id}
                                                        onChange={(e) => setFormData({ ...formData, reading_test_id: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select Reading Test</option>
                                                        {ieltsOptions.readingTests.map(t => (
                                                            <option key={t.id} value={t.id}>{t.title}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Listening Module</Label>
                                                    <select
                                                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        value={formData.listening_test_id}
                                                        onChange={(e) => setFormData({ ...formData, listening_test_id: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select Listening Test</option>
                                                        {ieltsOptions.listeningTests.map(t => (
                                                            <option key={t.id} value={t.id}>{t.title}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Writing Task 1</Label>
                                                    <select
                                                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        value={formData.writing_task1_id}
                                                        onChange={(e) => setFormData({ ...formData, writing_task1_id: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select Task 1</option>
                                                        {ieltsOptions.writingTasks.filter(t => t.task_type === 'task1').map(t => (
                                                            <option key={t.id} value={t.id}>{t.title || 'Untitled Task 1'}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Writing Task 2</Label>
                                                    <select
                                                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        value={formData.writing_task2_id}
                                                        onChange={(e) => setFormData({ ...formData, writing_task2_id: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select Task 2</option>
                                                        {ieltsOptions.writingTasks.filter(t => t.task_type === 'task2').map(t => (
                                                            <option key={t.id} value={t.id}>{t.title || 'Untitled Task 2'}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                                            <input
                                                type="checkbox"
                                                id="is_official"
                                                className="w-4 h-4 accent-primary"
                                                checked={formData.is_official}
                                                onChange={(e) => setFormData({ ...formData, is_official: e.target.checked })}
                                            />
                                            <Label htmlFor="is_official" className="cursor-pointer">
                                                <div className="font-bold text-xs uppercase tracking-widest text-primary">Official Simulation</div>
                                                <div className="text-[10px] text-muted-foreground">Sets this as the primary Simulation card.</div>
                                            </Label>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Brief overview of the session..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="start">Start Time</Label>
                                            <Input
                                                id="start"
                                                type="datetime-local"
                                                value={formData.start_time}
                                                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="end">End Time</Label>
                                            <Input
                                                id="end"
                                                type="datetime-local"
                                                value={formData.end_time}
                                                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                type="submit"
                                                className={`flex-1 ${editingSessionId ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-destructive hover:bg-destructive/90'} text-white`}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : editingSessionId ? <Pencil className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                                {editingSessionId ? 'Authorize Update' : 'Deploy Session'}
                                            </Button>
                                            {editingSessionId && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={handleResetForm}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Active Sessions List */}
                            <div className="lg:col-span-2">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" /> Active Deployments
                                </h2>

                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                                        <p>Syncing with engine...</p>
                                    </div>
                                ) : sessions.length === 0 ? (
                                    <div className="card-surface p-12 text-center text-muted-foreground border-dashed">
                                        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p>No sessions currently scheduled.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {sessions.map((session) => (
                                            <div key={session.id} className="card-surface p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/50 transition-colors">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${session.exam_type === 'imat-prep' ? 'bg-blue-500/20 text-blue-500' : 'bg-emerald-500/20 text-emerald-500'
                                                            }`}>
                                                            {session.exam_type.split('-')[0]}
                                                        </span>
                                                        <h3 className="font-bold text-lg">{session.title}</h3>
                                                        {session.is_official && (
                                                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500 text-white text-[8px] font-black uppercase tracking-tighter">
                                                                <Zap className="w-2 h-2 fill-current" />
                                                                Official
                                                            </span>
                                                        )}
                                                        {session.access_type === 'request_required' ? (
                                                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 text-white text-[8px] font-black uppercase tracking-tighter">
                                                                <Lock className="w-2 h-2" />
                                                                Locked
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase tracking-tighter">
                                                                <Unlock className="w-2 h-2" />
                                                                Open
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground max-w-md">{session.description}</p>
                                                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            Starts: {format(new Date(session.start_time), 'MMM d, h:mm a')}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-destructive">
                                                            <AlertCircle className="w-3 h-3" />
                                                            Ends: {format(new Date(session.end_time), 'MMM d, h:mm a')}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-emerald-600 font-bold">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            {session.registration_count} Registered
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2"
                                                        onClick={() => handleEditClick(session)}
                                                    >
                                                        <Pencil className="w-4 h-4 text-indigo-500" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2"
                                                        onClick={() => setSelectedSession(session)}
                                                    >
                                                        <FileJson className="w-4 h-4 text-primary" />
                                                        Manage Questions
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() => handleDeleteSession(session.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="learning">
                        <div className="card-surface p-8 rounded-[3rem]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black tracking-tight uppercase">Knowledge Command Console</h2>
                            </div>
                            <LearningManager />
                        </div>
                    </TabsContent>

                    <TabsContent value="reading">
                        <div className="card-surface p-8 rounded-[3rem]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black tracking-tight uppercase">Reading Module Center</h2>
                            </div>
                            <ReadingManager />
                        </div>
                    </TabsContent>

                    <TabsContent value="listening">
                        <div className="card-surface p-8 rounded-[3rem]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Headphones className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black tracking-tight uppercase">Listening Module Center</h2>
                            </div>
                            <ListeningManager />
                        </div>
                    </TabsContent>

                    <TabsContent value="writing-evals">
                        <div className="card-surface p-8 rounded-[3rem]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <PenTool className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black tracking-tight uppercase">Writing Module Center</h2>
                            </div>
                            <WritingManager mode="evaluations" />
                        </div>
                    </TabsContent>

                    <TabsContent value="mock-evals">
                        <div className="card-surface p-8 rounded-[3rem]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Award className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black tracking-tight uppercase">IELTS Mock Evaluation Center</h2>
                            </div>
                            <MockEvaluationManager />
                        </div>
                    </TabsContent>

                    <TabsContent value="mock-results">
                        <div className="card-surface p-8 rounded-[3rem]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight uppercase">Mock Exam Results Dashboard</h2>
                                    <p className="text-sm text-muted-foreground">View participant scores and rankings</p>
                                </div>
                            </div>
                            <MockResultsViewer />
                        </div>
                    </TabsContent>

                    <TabsContent value="writing-tasks">
                        <div className="card-surface p-8 rounded-[3rem]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <PenTool className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black tracking-tight uppercase">Writing Task Library</h2>
                            </div>
                            <WritingManager mode="tasks" />
                        </div>
                    </TabsContent>

                    <TabsContent value="practice">
                        <div className="card-surface p-8 rounded-[3rem]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Rocket className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black tracking-tight uppercase">Practice Intel Console</h2>
                            </div>
                            <PracticeManager />
                        </div>
                    </TabsContent>

                    <TabsContent value="feedback">
                        <div className="card-surface p-8 rounded-[3rem]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Rocket className="w-5 h-5" /> {/* Placeholder icon, replace with appropriate one */}
                                </div>
                                <h2 className="text-xl font-black tracking-tight uppercase">Feedback Manager</h2>
                            </div>
                            <FeedbackManager />
                        </div>
                    </TabsContent>

                    <TabsContent value="3d-labs">
                        <div className="card-surface p-8 rounded-[3rem]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Box className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight uppercase">3D Lab Management</h2>
                                    <p className="text-sm text-muted-foreground">Map 3D components to subjects and topics.</p>
                                </div>
                            </div>
                            <LabManager />
                        </div>
                    </TabsContent>

                    <TabsContent value="notifications">
                        <div className="card-surface p-8 rounded-[3rem]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight uppercase">Site Announcements</h2>
                                    <p className="text-sm text-muted-foreground">Broadcast updates to all users.</p>
                                </div>
                            </div>
                            <NotificationManager />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Global Modal Overlay */}
            {selectedSession && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="w-full max-w-6xl max-h-[90vh] bg-white dark:bg-card rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col">
                        <div className="p-8 border-b border-slate-100 dark:border-border flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                                    <FileJson className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">{selectedSession.title}</h2>
                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">Manual Question Injection Protocol</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedSession(null);
                                    setManualQuestions([]);
                                }}
                                className="w-12 h-12 rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border flex items-center justify-center hover:bg-slate-50 dark:bg-muted transition-colors shadow-sm"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10">
                            <div className="grid lg:grid-cols-2 gap-16">
                                {/* Manual Entry Form */}
                                <div className="space-y-8">
                                    <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
                                        <button
                                            onClick={() => setImportMode('form')}
                                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${importMode === 'form' ? 'bg-white dark:bg-card text-indigo-600 shadow-md' : 'text-slate-400'}`}
                                        >
                                            Step-by-Step Form
                                        </button>
                                        <button
                                            onClick={() => setImportMode('json')}
                                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${importMode === 'json' ? 'bg-white dark:bg-card text-indigo-600 shadow-md' : 'text-slate-400'}`}
                                        >
                                            JSON Bulk Paste
                                        </button>
                                    </div>

                                    {importMode === 'form' ? (
                                        <div className="space-y-8">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section Selector</Label>
                                                    <select
                                                        className="w-full flex h-14 rounded-2xl border border-slate-100 dark:border-border bg-white dark:bg-card px-4 py-2 text-xs font-bold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm"
                                                        value={currentQuestion.section_name}
                                                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, section_name: e.target.value })}
                                                    >
                                                        <option value="General">General</option>
                                                        {selectedSession && EXAMS[selectedSession.exam_type as keyof typeof EXAMS]?.sections.map(s => (
                                                            <option key={s.id} value={s.name}>{s.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scientific Topic</Label>
                                                    <Input
                                                        placeholder="e.g. CELLULAR LOGIC"
                                                        className="h-14 rounded-2xl border-slate-100 dark:border-border text-xs font-bold uppercase tracking-widest"
                                                        value={currentQuestion.topic || ''}
                                                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, topic: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Question Content</Label>
                                                <Textarea
                                                    placeholder="Enter your system query here..."
                                                    className="min-h-[140px] rounded-2xl border-slate-100 dark:border-border text-sm font-medium leading-relaxed resize-none p-6"
                                                    value={currentQuestion.question_text}
                                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Response Matrix (Select Truth)</Label>
                                                <div className="space-y-3">
                                                    {currentQuestion.options.map((opt, idx) => (
                                                        <div key={idx} className="flex items-center gap-4">
                                                            <div
                                                                onClick={() => setCurrentQuestion({ ...currentQuestion, correct_index: idx })}
                                                                className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all ${currentQuestion.correct_index === idx ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-muted text-slate-300 border border-slate-100'}`}
                                                            >
                                                                <span className="text-xs font-black">{String.fromCharCode(65 + idx)}</span>
                                                            </div>
                                                            <Input
                                                                placeholder={`Enter link ${String.fromCharCode(65 + idx)}...`}
                                                                className="h-12 rounded-xl border-slate-100 dark:border-border font-bold text-xs"
                                                                value={opt}
                                                                onChange={(e) => {
                                                                    const newOpts = [...currentQuestion.options];
                                                                    newOpts[idx] = e.target.value;
                                                                    setCurrentQuestion({ ...currentQuestion, options: newOpts });
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <Button
                                                onClick={handleAddQuestionToList}
                                                className="w-full h-16 rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 group"
                                            >
                                                <Plus className="w-5 h-5 mr-4 group-hover:rotate-90 transition-transform" />
                                                Append to Buffer
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            <div className="p-6 rounded-[2rem] bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed font-bold italic">
                                                <strong>Neural Tip:</strong> Paste a valid JSON array matching the system structure. Optimized for bulk GPT imports and archive migration.
                                            </div>
                                            <Textarea
                                                placeholder='[{"question_text": "...", "options": ["A", "B", "C", "D"], "correct_index": 0}]'
                                                className="h-[400px] rounded-[2rem] border-slate-100 dark:border-border font-mono text-xs leading-relaxed p-8"
                                                value={jsonInput}
                                                onChange={(e) => setJsonInput(e.target.value)}
                                            />
                                            <Button
                                                onClick={handleJsonImport}
                                                disabled={!jsonInput.trim()}
                                                className="w-full h-16 rounded-[2rem] bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl"
                                            >
                                                <FileJson className="w-5 h-5 mr-4 font-black" />
                                                Execute Bulk Parse
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Pending List & Preview */}
                                <div className="flex flex-col h-full bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-border p-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            Transmission Buffer ({manualQuestions.length})
                                        </h3>
                                        {manualQuestions.length > 0 && (
                                            <button
                                                onClick={() => setManualQuestions([])}
                                                className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
                                            >
                                                Wipe Buffer
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
                                        {manualQuestions.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-slate-300 italic opacity-40 py-20">
                                                <Rocket className="w-16 h-16 mb-4" />
                                                <p className="text-xs font-black uppercase tracking-widest text-center">Buffer is idle.<br />Add questions to begin uplink.</p>
                                            </div>
                                        ) : (
                                            [...manualQuestions]
                                                .sort((a, b) => {
                                                    const examConfig = selectedSession ? EXAMS[selectedSession.exam_type as keyof typeof EXAMS] : null;
                                                    const sectionOrder = examConfig?.sections.map(s => s.name) || [];
                                                    const orderA = sectionOrder.indexOf(a.section_name);
                                                    const orderB = sectionOrder.indexOf(b.section_name);
                                                    if (orderA !== -1 && orderB !== -1) return orderA - orderB;
                                                    if (orderA !== -1) return -1;
                                                    if (orderB !== -1) return 1;
                                                    return a.section_name.localeCompare(b.section_name);
                                                })
                                                .map((q, idx) => (
                                                    <div key={idx} className="p-6 rounded-[2rem] bg-white dark:bg-card border border-slate-100 dark:border-border shadow-sm group hover:border-indigo-200 transition-all">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <span className="px-3 py-1 rounded-full bg-slate-50 dark:bg-muted text-[10px] uppercase font-black text-slate-400 tracking-widest border border-slate-100 dark:border-border dark:border-border">
                                                                {q.section_name}
                                                            </span>
                                                            <button
                                                                onClick={() => setManualQuestions(manualQuestions.filter((_, i) => i !== idx))}
                                                                className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <p className="text-sm font-bold text-slate-800 line-clamp-3 mb-4">{q.question_text}</p>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-black bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                                                <CheckCircle2 className="w-3 h-3" />
                                                                VERIFIED: {String.fromCharCode(65 + q.correct_index)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                        )}
                                    </div>

                                    {manualQuestions.length > 0 && (
                                        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-border dark:border-border">
                                            <Button
                                                onClick={handleSaveQuestions}
                                                disabled={isSubmitting}
                                                className="w-full h-18 rounded-[2.5rem] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-emerald-200 flex flex-col items-center justify-center gap-1"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
                                                    <span>Authorize Neural Uplink</span>
                                                </div>
                                                <span className="text-[8px] opacity-60 tracking-widest uppercase">Inject {manualQuestions.length} units of intel</span>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
