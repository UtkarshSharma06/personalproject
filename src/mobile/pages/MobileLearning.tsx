import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useExam } from '@/context/ExamContext';
import {
    Play, Rocket, ChevronRight, Video,
    BookOpen, Search, Lock, Sparkles,
    ArrowLeft, Loader2, Target, CheckCircle2,
    MessageSquare, Send, Trophy, History, X,
    FileText, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { usePlanAccess } from '@/hooks/usePlanAccess';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { MathText } from '@/components/MathText';
import { UpgradeModal } from '@/components/UpgradeModal';
import { Suspense, lazy } from 'react';

const AnnouncementBar = lazy(() => import('@/components/AnnouncementBar'));

type View = 'selection' | 'dashboard' | 'video' | 'quiz' | 'resources';

export default function MobileLearning() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { activeExam } = useExam();
    const { isExplorer } = usePlanAccess();

    // App View States
    const [view, setView] = useState<View>('selection');
    const [isLoading, setIsLoading] = useState(true);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    // Data States
    const [exams, setExams] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]); // Topics in DB
    const [topics, setTopics] = useState<any[]>([]); // Units in DB

    // Selection States
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [selectedUnit, setSelectedUnit] = useState<any>(null);
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');

    // Quiz States
    const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
    const [showQuizResult, setShowQuizResult] = useState(false);
    const [quizAvailability, setQuizAvailability] = useState<Record<string, boolean>>({});

    // Deep Link State
    const location = useLocation();

    useEffect(() => {
        fetchExams();
    }, [activeExam]);

    // Handle Deep Linking
    useEffect(() => {
        const initDeepLink = async () => {
            if (courses.length > 0 && location.state?.continueLearning && location.state?.courseId) {
                const targetCourse = courses.find(c => c.id === location.state.courseId);
                if (targetCourse) {
                    await handleCourseSelect(targetCourse);

                    if (location.state.contentId) {
                        try {
                            const { data: content } = await (supabase as any)
                                .from('learning_content')
                                .select('*')
                                .eq('id', location.state.contentId)
                                .single();

                            if (content) {
                                // We need to ensure unit is selected effectively, but direct video selection works if state is ready
                                handleVideoSelect(content);
                            }
                        } catch (e) {
                            console.error("Deep link content error", e);
                        }
                    }
                }
            }
        };
        initDeepLink();
    }, [courses.length, location.state]);

    async function fetchExams() {
        setIsLoading(true);
        const { data } = await (supabase as any).from('learning_exams').select('*');
        const fetchedExams = data || [];
        setExams(fetchedExams);

        if (activeExam && fetchedExams.length > 0) {
            const brand = activeExam.id.split('-')[0].toLowerCase();
            const matched = fetchedExams.find((e: any) => e.name.toLowerCase().includes(brand));
            if (matched) {
                const { data: courseData } = await (supabase as any)
                    .from('learning_courses')
                    .select('*')
                    .eq('exam_id', matched.id);
                setCourses(courseData || []);
            }
        }
        setIsLoading(false);
    }

    async function handleCourseSelect(course: any) {
        setIsLoading(true);
        setSelectedCourse(course);
        const { data: topicData } = await (supabase as any)
            .from('learning_topics')
            .select('*')
            .eq('course_id', course.id);

        const activeTopics = (topicData || []).filter((t: any) => t.is_active !== false);
        setUnits(activeTopics);
        setView('dashboard');
        if (activeTopics.length > 0) {
            await fetchUnitDashboard(activeTopics[0], 0);
        }
        setIsLoading(false);
    }

    async function fetchUnitDashboard(topic: any, index?: number) {
        if (isExplorer && index !== undefined && index > 0) {
            setIsUpgradeModalOpen(true);
            return;
        }
        setIsLoading(true);
        setSelectedUnit(topic);

        const { data: unitData } = await (supabase as any)
            .from('learning_units')
            .select('*')
            .eq('topic_id', topic.id);

        const activeUnits = (unitData || []).filter((u: any) => u.is_active !== false);
        const richLessons = await Promise.all(activeUnits.map(async (unit: any) => {
            const { data: subunitData } = await (supabase as any)
                .from('learning_subunits')
                .select('*')
                .eq('unit_id', unit.id);

            const activeSubunits = (subunitData || []).filter((s: any) => s.is_active !== false);
            const subunitsWithContent = await Promise.all(activeSubunits.map(async (sub: any) => {
                const { data: contentData } = await (supabase as any)
                    .from('learning_content')
                    .select('*')
                    .eq('subunit_id', sub.id);
                return { ...sub, content: (contentData || []).filter((c: any) => c.is_active !== false).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0)) };
            }));

            const { data: unitContent } = await (supabase as any)
                .from('learning_content')
                .select('*')
                .eq('unit_id', unit.id);

            return {
                ...unit,
                subunits: subunitsWithContent,
                directContent: (unitContent || []).filter((c: any) => c.is_active !== false).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
            };
        }));

        // Fetch topic-level direct content
        const { data: topicContent } = await (supabase as any)
            .from('learning_content')
            .select('*')
            .eq('topic_id', topic.id);

        const activeTopicContent = (topicContent || []).filter((c: any) => c.is_active !== false).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));

        // If there's topic-level content, prepend a virtual unit for it
        const finalStructure = [...richLessons];
        if (activeTopicContent.length > 0) {
            finalStructure.unshift({
                id: 'topic-direct',
                name: 'Overview & Fundamentals',
                description: 'Introductory content for this topic',
                subunits: [],
                directContent: activeTopicContent
            });
        }

        const { data: quizData } = await (supabase as any)
            .from('learning_quiz_questions')
            .select('topic_id, unit_id, subunit_id')
            .eq('topic_id', topic.id);

        const availability: Record<string, boolean> = {};
        (quizData || []).forEach((q: any) => {
            if (q.topic_id) availability[q.topic_id] = true;
            if (q.unit_id) availability[q.unit_id] = true;
            if (q.subunit_id) availability[q.subunit_id] = true;
        });
        setQuizAvailability(availability);

        setTopics(finalStructure);
        setIsLoading(false);
    }

    async function startQuiz(id: string, level: string) {
        setIsLoading(true);
        const field = level === 'topic' ? 'topic_id' : level === 'unit' ? 'unit_id' : 'subunit_id';
        const { data } = await (supabase as any)
            .from('learning_quiz_questions')
            .select('*')
            .eq(field, id)
            .order('order_index');

        if (data && data.length > 0) {
            setQuizQuestions(data);
            setCurrentQuizIndex(0);
            setQuizAnswers([]);
            setShowQuizResult(false);
            setView('quiz');
        } else {
            toast({ title: "No Quiz Found", description: "Knowledge check for this sector is currently offline." });
        }
        setIsLoading(false);
    }

    const handleQuizAnswer = (index: number) => {
        const newAnswers = [...quizAnswers];
        newAnswers[currentQuizIndex] = index;
        setQuizAnswers(newAnswers);

        if (currentQuizIndex < quizQuestions.length - 1) {
            setCurrentQuizIndex(prev => prev + 1);
        } else {
            setShowQuizResult(true);
        }
    };

    async function handleVideoSelect(video: any) {
        setSelectedVideo(video);
        setView('video');
        fetchComments(video.id);
    }

    async function fetchComments(contentId: string) {
        const { data } = await (supabase as any)
            .from('learning_comments')
            .select('*, profiles(id, display_name, avatar_url)')
            .eq('content_id', contentId)
            .order('created_at', { ascending: true });
        setComments(data || []);
    }

    const handlePostComment = async () => {
        if (!newComment.trim() || !user) return;
        const { data, error } = await (supabase as any)
            .from('learning_comments')
            .insert({
                content_id: selectedVideo.id,
                user_id: user.id,
                comment_text: newComment.trim()
            })
            .select('*, profiles(id, display_name, avatar_url)')
            .single();

        if (!error) {
            setComments([...comments, data]);
            setNewComment('');
        }
    };

    if (isLoading && view === 'selection') {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    const renderSelection = () => (
        <div className="p-6 space-y-8 pb-32">
            <header className="py-4">
                <div className="flex items-center gap-2 mb-2">
                    <Rocket className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Mission Select</span>
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tight leading-none">Intelligence <br /><span className="text-primary">Academy</span></h1>
            </header>

            <div className="grid gap-4">
                {courses.map((course) => (
                    <Card
                        key={course.id}
                        onClick={() => handleCourseSelect(course)}
                        className="bg-secondary/20 border-border/40 rounded-[2.5rem] overflow-hidden active:scale-95 transition-all group"
                    >
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <BookOpen size={24} />
                                </div>
                                <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h3 className="font-black text-xl uppercase tracking-tighter mb-2">{course.name}</h3>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase opacity-60 line-clamp-2">
                                {course.description || 'Deep-dive mastery of course-specific objectives.'}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div className="flex flex-col min-h-full bg-background pb-32">
            <div className="bg-primary/5 p-6 border-b border-border/50 sticky top-0 z-40 backdrop-blur-xl">
                <button onClick={() => setView('selection')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary mb-4 active:scale-95 transition-transform">
                    <ArrowLeft size={14} /> Back to Missions
                </button>
                <h2 className="text-xl font-black uppercase tracking-tighter line-clamp-1">{selectedCourse?.name}</h2>
            </div>

            <div className="flex gap-2 p-4 overflow-x-auto no-scrollbar">
                {units.map((unit, idx) => (
                    <button
                        key={unit.id}
                        onClick={() => fetchUnitDashboard(unit, idx)}
                        className={cn(
                            "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all active:scale-95",
                            selectedUnit?.id === unit.id ? "bg-primary text-white shadow-lg" : "bg-secondary/40 text-muted-foreground",
                            isExplorer && idx > 0 && "opacity-50"
                        )}
                    >
                        {unit.name}
                        {isExplorer && idx > 0 && <Lock className="w-2 h-2 ml-1 inline-block" />}
                    </button>
                ))}
            </div>

            <div className="px-4 space-y-8 mt-4">
                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" /></div>
                ) : (
                    <>
                        {quizAvailability[selectedUnit?.id] && (
                            <Card className="bg-primary border-none rounded-[2rem] shadow-xl shadow-primary/20">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <h4 className="text-white font-black uppercase tracking-tight text-lg">Sector Check</h4>
                                        <p className="text-white/70 text-[10px] font-bold uppercase">Verify mission knowledge</p>
                                    </div>
                                    <Button onClick={() => startQuiz(selectedUnit.id, 'topic')} variant="secondary" className="rounded-xl font-black uppercase text-[10px] tracking-widest">
                                        Begin Diagnostic
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {topics.map((unit, idx) => (
                            <div key={idx} className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-[10px] font-black">{idx + 1}</div>
                                    <div className="flex-1">
                                        <h4 className="font-black uppercase tracking-tight text-sm">{unit.name}</h4>
                                        {quizAvailability[unit.id] && (
                                            <button onClick={() => startQuiz(unit.id, 'unit')} className="text-[8px] font-black text-primary uppercase tracking-widest mt-1 underline">Start Unit Quiz</button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {unit.directContent?.map((content: any) => {
                                        const isActuallyVideo = content.video_url && content.video_url.trim().length > 5;
                                        const isDoc = content.content_type === 'doc' || !isActuallyVideo;
                                        return (
                                            <button
                                                key={content.id}
                                                onClick={() => handleVideoSelect(content)}
                                                className="w-full flex items-center gap-4 p-5 bg-secondary/15 rounded-[2rem] border border-border/10 active:scale-[0.98] transition-all text-left group"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center text-primary shadow-sm group-active:bg-primary/10 transition-colors">
                                                    {isDoc ? <FileText size={20} /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-black uppercase tracking-tight">{content.title}</p>
                                                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.1em] mt-1 opacity-60">
                                                        {isDoc ? 'Intelligence Document' : 'Video Transmission'}
                                                    </p>
                                                </div>
                                                <ChevronRight size={14} className="opacity-10 group-active:opacity-100 group-active:translate-x-1 transition-all" />
                                            </button>
                                        );
                                    })}

                                    {unit.subunits?.map((sub: any) => (
                                        <div key={sub.id} className="ml-4 space-y-3 pl-4 border-l border-border/50">
                                            <div className="flex items-center justify-between pr-4">
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{sub.name}</p>
                                                {quizAvailability[sub.id] && (
                                                    <button onClick={() => startQuiz(sub.id, 'subunit')} className="text-[7px] font-black text-primary uppercase tracking-[0.2em] underline">Quiz</button>
                                                )}
                                            </div>
                                            {sub.content?.map((content: any) => {
                                                const isActuallyVideo = content.video_url && content.video_url.trim().length > 5;
                                                const isDoc = content.content_type === 'doc' || !isActuallyVideo;
                                                return (
                                                    <button
                                                        key={content.id}
                                                        onClick={() => handleVideoSelect(content)}
                                                        className="w-full flex items-center gap-4 p-4 bg-secondary/10 rounded-[1.5rem] active:bg-primary/5 active:scale-[0.98] transition-all text-left border border-transparent active:border-primary/20"
                                                    >
                                                        {isDoc ? (
                                                            <FileText size={16} className="text-primary opacity-60" />
                                                        ) : (
                                                            <Play size={16} className="text-primary opacity-60" fill="currentColor" />
                                                        )}
                                                        <p className="text-[11px] font-black uppercase tracking-tight flex-1">{content.title}</p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );

    const renderVideo = () => (
        <div className="flex flex-col min-h-full bg-background pb-32">
            <button onClick={() => setView('dashboard')} className="p-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary active:scale-95 transition-transform">
                <ArrowLeft size={14} /> Unit Intelligence
            </button>

            {(() => {
                const isActuallyVideo = selectedVideo?.video_url && selectedVideo?.video_url.trim().length > 5;
                const isDoc = selectedVideo?.content_type === 'doc' || !isActuallyVideo;

                if (!isDoc) {
                    return (
                        <div className="aspect-video bg-black relative group shadow-2xl overflow-hidden mb-8 mx-4 rounded-[2rem] border-4 border-secondary/20">
                            <iframe
                                className="w-full h-full"
                                src={(() => {
                                    const url = selectedVideo?.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
                                    if (url.includes('youtube.com/watch')) {
                                        const videoId = new URLSearchParams(new URL(url).search).get('v');
                                        return `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1`;
                                    } else if (url.includes('youtu.be/')) {
                                        const videoId = url.split('youtu.be/')[1].split('?')[0];
                                        return `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1`;
                                    }
                                    return url;
                                })()}
                                title={selectedVideo?.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    );
                } else {
                    return (
                        <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 mx-4 p-10 rounded-[2.5rem] mb-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <FileText size={120} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                                        <FileText size={28} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] opacity-70">Sector Briefing</span>
                                        <h3 className="text-2xl font-black uppercase tracking-tight leading-none mt-1">{selectedVideo.title}</h3>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="px-3 py-1 bg-primary/10 rounded-full text-[8px] font-black uppercase tracking-widest text-primary">Classified Intel</div>
                                    <div className="px-3 py-1 bg-secondary/40 rounded-full text-[8px] font-black uppercase tracking-widest">Document V.1.0</div>
                                </div>
                            </div>
                        </div>
                    );
                }
            })()}

            <div className="px-6 space-y-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        {selectedVideo?.content_type === 'doc' ? (
                            <FileText size={14} className="text-primary" />
                        ) : (
                            <Video size={14} className="text-primary" />
                        )}
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                            {selectedVideo?.content_type === 'doc' ? 'Intelligence Data Decrypted' : 'Neural Stream Loaded'}
                        </span>
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight leading-tight">{selectedVideo?.title}</h2>

                    {/* Main Article Content */}
                    <div className="mt-8 space-y-6 bg-secondary/5 p-6 rounded-[2rem] border border-border/20">
                        <MathText
                            isHtml={true}
                            content={selectedVideo?.text_content || ""}
                            className="text-[13px] font-medium leading-relaxed text-foreground/90 prose prose-invert max-w-none"
                        />
                    </div>

                    <p className="text-[10px] text-muted-foreground mt-8 leading-relaxed font-bold uppercase opacity-60 italic">
                        {selectedVideo?.description || 'Access specialized architectural training data for this mission sector.'}
                    </p>
                </div>

                <div className="h-px bg-border/50 w-full" />

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <MessageSquare size={14} /> Intelligence Feed
                        </h4>
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-full uppercase tracking-widest">
                            {comments.length} Reports
                        </span>
                    </div>

                    <div className="space-y-4">
                        {comments.map((comment, i) => (
                            <div key={i} className="bg-secondary/20 p-4 rounded-3xl border border-border/30">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white">
                                        {comment.profiles?.display_name?.charAt(0) || 'A'}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tight">{comment.profiles?.display_name}</span>
                                </div>
                                <MathText content={comment.comment_text} className="text-xs font-bold leading-relaxed text-foreground/80" />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 sticky bottom-24 p-2 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Input intelligence report..."
                            className="flex-1 bg-transparent border-none text-xs font-bold focus:ring-0 px-2"
                        />
                        <Button onClick={handlePostComment} size="icon" className="rounded-xl w-10 h-10 bg-primary active:scale-90 transition-transform">
                            <Send size={18} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderQuiz = () => {
        const currentQ = quizQuestions[currentQuizIndex];
        const score = quizAnswers.reduce((acc, ans, i) => acc + (ans === quizQuestions[i].correct_index ? 1 : 0), 0);

        if (showQuizResult) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center space-y-8 animate-in zoom-in duration-500">
                    <div className="w-32 h-32 rounded-[3rem] bg-primary/10 flex items-center justify-center text-primary relative">
                        <Trophy size={64} className="relative z-10" />
                        <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black uppercase tracking-tight">Mission Result</h2>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs opacity-60">Competency Assessment complete</p>
                    </div>

                    <div className="w-full bg-secondary/30 rounded-[2.5rem] p-8 space-y-4 border border-border/50">
                        <div className="text-6xl font-black tracking-tighter text-primary">{Math.round((score / quizQuestions.length) * 100)}%</div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">{score} of {quizQuestions.length} Targets Verified</p>
                    </div>

                    <Button onClick={() => setView('dashboard')} className="w-full h-16 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20">
                        Return to Command Center
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex flex-col min-h-full bg-background pb-32">
                <header className="p-6 pb-2">
                    <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary mb-4">
                        <X size={14} /> Abort Check
                    </button>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Diagnostic Step</span>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{currentQuizIndex + 1} / {quizQuestions.length}</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}
                        />
                    </div>
                </header>

                <main className="flex-1 px-6 py-10 space-y-8">
                    <MathText content={currentQ?.question_text} className="text-xl font-black tracking-tight leading-tight" />

                    <div className="space-y-3">
                        {currentQ?.options?.map((option: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => handleQuizAnswer(idx)}
                                className="w-full p-6 text-left bg-secondary/20 border-2 border-transparent hover:border-primary/30 rounded-[2rem] active:scale-95 transition-all group flex gap-4"
                            >
                                <div className="w-6 h-6 rounded-lg bg-background border border-border/50 flex items-center justify-center font-black text-[10px] group-hover:bg-primary group-hover:text-white transition-colors">
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <MathText content={option} className="text-sm font-bold opacity-80" />
                            </button>
                        ))}
                    </div>
                </main>
            </div>
        );
    };

    const renderResources = () => (
        <div className="min-h-full bg-background pb-32">
            <div className="bg-background/95 backdrop-blur-xl p-6 border-b border-border/50 sticky top-0 z-40">
                <button onClick={() => setView('selection')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary mb-4 active:scale-95 transition-transform">
                    <ArrowLeft size={14} /> Back to Missions
                </button>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Resource Library</h2>
            </div>

            <ResourceList activeExam={activeExam} />
        </div>
    );

    return (
        <div className="min-h-full bg-background animate-in fade-in duration-500">
            <Suspense fallback={null}>
                <AnnouncementBar />
            </Suspense>
            {view === 'selection' && renderSelection()}
            {view === 'dashboard' && renderDashboard()}
            {view === 'video' && renderVideo()}
            {view === 'quiz' && renderQuiz()}
            {view === 'resources' && renderResources()}

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                title="Unlock Full Course"
                description="Explorer members can only access the introductory sector. Upgrade to PRO to unlock all mission intel."
                feature="Full Learning Academy"
            />
        </div>
    );
}

function ResourceList({ activeExam }: { activeExam: any }) {
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeExam?.id) fetchResources();
    }, [activeExam]);

    const fetchResources = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('exam_resources')
            .select('*')
            .eq('exam_type', activeExam.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false });
        setResources(data || []);
        setLoading(false);
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;

    if (resources.length === 0) return (
        <div className="p-12 text-center opacity-50">
            <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="text-xs font-bold uppercase">No Resources Found</p>
        </div>
    );

    return (
        <div className="p-6 space-y-4">
            {resources.map((r, i) => (
                <div key={r.id} className="bg-secondary/20 p-5 rounded-[2rem] border border-border/50 flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-600 shrink-0">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm leading-tight mb-1">{r.title}</h4>
                            <p className="text-[10px] text-muted-foreground line-clamp-2">{r.description}</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full rounded-xl h-10 font-bold uppercase text-[10px] tracking-widest hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 dark:hover:bg-pink-900/30"
                        asChild
                    >
                        <a href={r.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="w-3 h-3 mr-2" />
                            Download PDF
                        </a>
                    </Button>
                </div>
            ))}
        </div>
    );
}
