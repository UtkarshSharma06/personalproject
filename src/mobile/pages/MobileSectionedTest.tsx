import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { SectionTimer } from '@/components/SectionTimer';
import { SectionProgressTracker } from '@/components/SectionProgressTracker';
import {
    ChevronRight, ChevronLeft, AlertTriangle,
    CheckCircle, Flag, Loader2
} from 'lucide-react';
import { MathText } from '@/components/MathText';
import DiagramRenderer from '@/components/DiagramRenderer';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { EXAMS } from '@/config/exams';

interface Question {
    id: string;
    question_number: number;
    question_text: string;
    options: string[];
    section_number: number;
    section_name: string;
    diagram?: any;
}

interface TestSection {
    number: number;
    name: string;
    questionCount: number;
    durationMinutes: number;
    icon?: string;
}

export default function MobileSectionedTest() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();

    // State
    const [test, setTest] = useState<any>(null);
    const [sections, setSections] = useState<TestSection[]>([]);
    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [currentSection, setCurrentSection] = useState(1);
    const [completedSections, setCompletedSections] = useState<number[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [infractions, setInfractions] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    const [isProctored, setIsProctored] = useState(true); // Default to proctored for mock exams

    // Get current section's questions
    const sectionQuestions = allQuestions.filter(q => q.section_number === currentSection);
    const currentQuestion = sectionQuestions[currentQuestionIndex];
    const currentSectionInfo = sections.find(s => s.number === currentSection);

    useEffect(() => {
        if (user && id) {
            fetchTestData();
        }
    }, [user, id]);

    // Proctoring Logic
    useEffect(() => {
        if (!isProctored || isLoading || isSubmitting) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleInfraction();
            }
        };

        const handleBlur = () => {
            handleInfraction();
        };

        const handleInfraction = () => {
            setInfractions(prev => {
                const next = prev + 1;
                if (next >= 3) {
                    toast({
                        title: "Test Terminated",
                        description: "Maximum infractions reached. Submitting test...",
                        variant: "destructive"
                    });
                    finishTest();
                    return next;
                }
                setShowWarning(true);
                return next;
            });
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);

        // Attempt Fullscreen
        const enterFullscreen = async () => {
            try {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                }
            } catch (e) {
                console.log("Fullscreen request failed", e);
            }
        };

        enterFullscreen();

        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
        };
    }, [isProctored, isLoading, isSubmitting]);

    const fetchTestData = async () => {
        setIsLoading(true);
        try {
            // Fetch test
            const { data: testData, error: testError } = await (supabase as any)
                .from('tests')
                .select('*')
                .eq('id', id)
                .single();

            if (testError) throw testError;
            setTest(testData);

            // Restore state from database
            setCurrentSection(testData.current_section || 1);
            setCompletedSections(testData.sections_completed || []);

            // Fetch questions
            const { data: questionsData, error: questionsError } = await (supabase as any)
                .from('questions')
                .select('*')
                .eq('test_id', id)
                .order('question_number');

            if (questionsError) throw questionsError;
            setAllQuestions(questionsData);

            // Extract sections from questions and resolve durations from config
            const examConfig = EXAMS[testData.exam_type as keyof typeof EXAMS];
            const sectionMap = new Map<number, TestSection>();

            questionsData.forEach((q: any) => {
                if (!sectionMap.has(q.section_number)) {
                    const sectionConfig = examConfig?.sections[q.section_number - 1];
                    sectionMap.set(q.section_number, {
                        number: q.section_number,
                        name: q.section_name,
                        questionCount: questionsData.filter((qu: any) => qu.section_number === q.section_number).length,
                        durationMinutes: sectionConfig?.durationMinutes || 0,
                        icon: sectionConfig?.icon
                    });
                }
            });
            setSections(Array.from(sectionMap.values()).sort((a, b) => a.number - b.number));

            // Fetch existing answers
            const { data: responsesData } = await (supabase as any)
                .from('responses')
                .select('question_id, selected_index')
                .eq('test_id', id);

            if (responsesData) {
                const answersMap: Record<string, number> = {};
                responsesData.forEach((r: any) => {
                    answersMap[r.question_id] = r.selected_index;
                });
                setAnswers(answersMap);
            }

        } catch (e: any) {
            toast({ title: "Error loading test", description: e.message, variant: "destructive" });
            navigate('/dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    const saveAnswer = async (questionId: string, selectedIndex: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: selectedIndex }));

        // Save to database
        await (supabase as any)
            .from('responses')
            .upsert({
                test_id: id,
                question_id: questionId,
                selected_index: selectedIndex,
                user_id: user?.id
            }, { onConflict: 'test_id,question_id' });
    };

    const handleAnswerSelect = (index: number) => {
        if (currentQuestion) {
            Haptics.impact({ style: ImpactStyle.Light }).catch(() => { });
            saveAnswer(currentQuestion.id, index);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < sectionQuestions.length - 1) {
            Haptics.impact({ style: ImpactStyle.Light }).catch(() => { });
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            Haptics.impact({ style: ImpactStyle.Light }).catch(() => { });
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const toggleFlag = () => {
        if (!currentQuestion) return;
        setFlaggedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(currentQuestion.id)) {
                newSet.delete(currentQuestion.id);
            } else {
                newSet.add(currentQuestion.id);
            }
            return newSet;
        });
    };

    const handleSectionTimeExpired = async () => {
        toast({
            title: "Time's Up!",
            description: `Section ${currentSection} time has expired. Moving to next section.`,
            variant: "default"
        });
        await completeSection();
    };

    const completeSection = async () => {
        setIsSubmitting(true);
        try {
            // Mark section as completed
            const newCompletedSections = [...completedSections, currentSection];

            // Update test record
            await (supabase as any)
                .from('tests')
                .update({
                    current_section: currentSection + 1,
                    sections_completed: newCompletedSections
                })
                .eq('id', id);

            // Check if this was the last section
            if (currentSection >= sections.length) {
                await finishTest();
            } else {
                // Move to next section
                setCompletedSections(newCompletedSections);
                setCurrentSection(currentSection + 1);
                setCurrentQuestionIndex(0);
                setShowConfirmModal(false);
            }
        } catch (e: any) {
            toast({ title: "Error", description: e.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const finishTest = async () => {
        setIsSubmitting(true);
        try {
            // Fetch correct answers for comparison
            const { data: questionsData } = await (supabase as any)
                .from('questions')
                .select('id, correct_index, section_number')
                .eq('test_id', id);

            const examConfig = EXAMS[test.exam_type as keyof typeof EXAMS];
            let correct = 0;
            let wrong = 0;
            let skipped = 0;
            let rawScore = 0;

            questionsData?.forEach((q: any) => {
                const userAns = answers[q.id];
                if (userAns === undefined || userAns === null) {
                    skipped++;
                    rawScore += examConfig?.scoring.skipped || 0;
                } else if (userAns === q.correct_index) {
                    correct++;
                    rawScore += examConfig?.scoring.correct || 1;
                } else {
                    wrong++;
                    rawScore += examConfig?.scoring.incorrect || 0;
                }
            });

            const total = questionsData?.length || 1;
            const scorePercentage = Math.max(0, Math.round((correct / total) * 100));

            // Update test record with calculated results
            await (supabase as any)
                .from('tests')
                .update({
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                    score: scorePercentage,
                    correct_answers: correct,
                    wrong_answers: wrong,
                    skipped_answers: skipped,
                    is_ranked: test.test_type === 'mock' // Enable ranking for mocks
                })
                .eq('id', id);

            // Exit fullscreen if active
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => { });
            }

            toast({ title: "Test Complete!", description: "Your results have been calculated." });
            navigate(`/results/${id}`);
        } catch (e: any) {
            toast({ title: "Error finishing test", description: e.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const requestSectionComplete = () => {
        setShowConfirmModal(true);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-sm font-black uppercase text-muted-foreground mt-4 tracking-widest">
                    Loading Test...
                </p>
            </div>
        );
    }

    if (!currentQuestion || !currentSectionInfo) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-center p-8">
                <div>
                    <AlertTriangle className="w-16 h-16 text-muted-foreground opacity-20 mx-auto mb-4" />
                    <h2 className="text-xl font-black uppercase">No Questions Found</h2>
                    <Button onClick={() => navigate('/dashboard')} className="mt-6">Return to Dashboard</Button>
                </div>
            </div>
        );
    }

    const answeredInSection = sectionQuestions.filter(q => answers[q.id] !== undefined).length;
    const isCurrentQuestionAnswered = currentQuestion && answers[currentQuestion.id] !== undefined;

    return (
        <div className="flex flex-col min-h-screen bg-background pb-24">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50 p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                        <h1 className="text-sm font-black uppercase tracking-tight">
                            Section {currentSection}: {currentSectionInfo.name}
                        </h1>
                        <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">
                            Question {currentQuestionIndex + 1} of {sectionQuestions.length}
                        </p>
                    </div>
                    <SectionTimer
                        durationMinutes={currentSectionInfo.durationMinutes}
                        onTimeExpired={handleSectionTimeExpired}
                        warningMinutes={5}
                        onWarning={() => toast({
                            title: "5 Minutes Remaining",
                            description: "Almost out of time for this section!",
                            variant: "default"
                        })}
                    />
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(currentQuestionIndex + 1) / sectionQuestions.length * 100}%` }}
                    />
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {/* Question */}
                <div className="bg-secondary/10 border border-border/40 rounded-3xl p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-black text-xs">
                                {currentQuestion.question_number}
                            </span>
                            <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">
                                {currentSectionInfo.icon} {currentSectionInfo.name}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleFlag}
                            className={flaggedQuestions.has(currentQuestion.id) ? 'text-orange-500' : ''}
                        >
                            <Flag className={`w-4 h-4 ${flaggedQuestions.has(currentQuestion.id) ? 'fill-current' : ''}`} />
                        </Button>
                    </div>

                    {currentQuestion.diagram && (
                        <div className="rounded-3xl border border-border/50 overflow-hidden bg-secondary/10 p-4 mb-6">
                            <DiagramRenderer diagram={currentQuestion.diagram} />
                        </div>
                    )}

                    <div className="prose prose-sm dark:prose-invert mb-6">
                        <MathText content={currentQuestion.question_text} className="text-lg font-bold leading-relaxed" />
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${answers[currentQuestion.id] === index
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border/40 bg-background hover:border-primary/30'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentQuestion.id] === index
                                        ? 'border-primary bg-primary'
                                        : 'border-border/60'
                                        }`}>
                                        {answers[currentQuestion.id] === index && (
                                            <CheckCircle className="w-4 h-4 text-white fill-current" />
                                        )}
                                    </div>
                                    <MathText content={option} className="text-sm font-medium" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section Progress */}
                <SectionProgressTracker
                    sections={sections.map(s => ({ number: s.number, name: s.name, icon: s.icon }))}
                    currentSection={currentSection}
                    completedSections={completedSections}
                />

                {/* Section Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/10 border border-border/40 rounded-2xl p-4 text-center">
                        <p className="text-2xl font-black">{answeredInSection}</p>
                        <p className="text-[8px] font-bold uppercase text-muted-foreground tracking-widest">Answered</p>
                    </div>
                    <div className="bg-secondary/10 border border-border/40 rounded-2xl p-4 text-center">
                        <p className="text-2xl font-black">{sectionQuestions.length - answeredInSection}</p>
                        <p className="text-[8px] font-bold uppercase text-muted-foreground tracking-widest">Remaining</p>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 p-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className="flex-1 h-14 rounded-2xl"
                    >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Previous
                    </Button>

                    {currentQuestionIndex < sectionQuestions.length - 1 ? (
                        <Button
                            onClick={handleNext}
                            className="flex-1 h-14 rounded-2xl"
                        >
                            Next
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={requestSectionComplete}
                            className="flex-1 h-14 rounded-2xl bg-green-600 hover:bg-green-700"
                        >
                            Complete Section
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                <DialogContent className="bg-background border-border/50 rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase">
                            <AlertTriangle className="w-6 h-6 text-orange-500" />
                            Ready to Continue?
                        </DialogTitle>
                        <DialogDescription className="text-sm pt-4 space-y-3">
                            <p>You're about to move to:</p>
                            <div className="bg-primary/10 border-2 border-primary/40 rounded-2xl p-4">
                                <p className="font-black uppercase text-primary">
                                    Section {currentSection + 1}: {sections[currentSection]?.name || 'Next Section'}
                                </p>
                            </div>
                            <div className="bg-red-500/10 border-2 border-red-500/40 rounded-2xl p-4">
                                <p className="font-black uppercase text-red-500 text-xs flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    You CANNOT return to Section {currentSection} once you continue!
                                </p>
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Answered: {answeredInSection} / {sectionQuestions.length} questions
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowConfirmModal(false)}
                            className="flex-1 rounded-xl"
                        >
                            Go Back
                        </Button>
                        <Button
                            onClick={completeSection}
                            disabled={isSubmitting}
                            className="flex-1 rounded-xl bg-primary"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>Continue <ChevronRight className="w-4 h-4 ml-2" /></>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Proctoring Warning Modal */}
            <Dialog open={showWarning} onOpenChange={setShowWarning}>
                <DialogContent className="max-w-[90vw] rounded-[2.5rem] p-8">
                    <DialogHeader className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-destructive/10 rounded-3xl flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-destructive" />
                        </div>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight">Proctoring Warning</DialogTitle>
                        <DialogDescription className="text-sm font-bold leading-relaxed">
                            You have navigated away from the exam window. This is strictly prohibited.
                            <div className="mt-4 p-4 bg-destructive/5 rounded-2xl border border-destructive/10">
                                <span className="text-destructive font-black">Warning {infractions} of 3</span>
                            </div>
                            <div className="mt-4 text-muted-foreground font-medium">
                                The exam will automatically submit after the 3rd infraction.
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-8 flex flex-col gap-3">
                        <Button
                            onClick={() => setShowWarning(false)}
                            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-destructive hover:bg-destructive/90 text-white"
                        >
                            Return to Exam
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
