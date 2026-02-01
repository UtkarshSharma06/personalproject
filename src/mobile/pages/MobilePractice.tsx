import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useExam } from '@/context/ExamContext';
import { BookOpen, ChevronRight, Zap, Target, Clock, ArrowLeft, Loader2, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePlanAccess } from '@/hooks/usePlanAccess';
import { UpgradeModal } from '@/components/UpgradeModal';
import { Card, CardContent } from '@/components/ui/card';

export default function MobilePractice() {
    const navigate = useNavigate();
    const { activeExam } = useExam();
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [step, setStep] = useState(1);
    const [availableTests, setAvailableTests] = useState<any[]>([]);
    const [userSubmissions, setUserSubmissions] = useState<any[]>([]);
    const [isLoadingTests, setIsLoadingTests] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const { hasReachedSubjectLimit, getRemainingQuestions, isExplorer, getSubjectCount } = usePlanAccess();

    const remaining = getRemainingQuestions(selectedSubject);

    const handleSubjectSelect = async (subject: string) => {
        setSelectedSubject(subject);

        if (activeExam.id === 'ielts-academic') {
            if (subject === 'Speaking') {
                navigate('/speaking');
                return;
            }

            if (subject === 'Academic Reading' || subject === 'Listening' || subject === 'Academic Writing') {
                setIsLoadingTests(true);
                setStep(3);
                const table = subject === 'Academic Reading' ? 'reading_tests' : subject === 'Listening' ? 'listening_tests' : 'writing_tasks';
                const subTable = subject === 'Academic Reading' ? 'reading_submissions' : subject === 'Listening' ? 'listening_submissions' : 'writing_submissions';
                const idKey = subject === 'Academic Writing' ? 'task_id' : 'test_id';

                const [testsRes, subsRes] = await Promise.all([
                    (supabase as any).from(table).select('*').eq('is_mock_only', false).order('created_at', { ascending: false }),
                    (supabase as any).from(subTable).select(`${idKey}, status`).eq('user_id', (await supabase.auth.getUser()).data.user?.id)
                ]);

                if (testsRes.data) setAvailableTests(testsRes.data);
                if (subsRes.data) setUserSubmissions(subsRes.data);
                setIsLoadingTests(false);
                return;
            }
        }
        setStep(2);
    };

    const handleTestSelect = (testId: string) => {
        if (hasReachedSubjectLimit(selectedSubject)) {
            setIsUpgradeModalOpen(true);
            return;
        }
        let type = 'reading';
        if (selectedSubject === 'Listening') type = 'listening';
        if (selectedSubject === 'Academic Writing') type = 'writing';

        navigate(`/${type}/${testId}`);
    };

    const handleStartPractice = (count: number) => {
        if (hasReachedSubjectLimit(selectedSubject)) {
            setIsUpgradeModalOpen(true);
            return;
        }

        const params = new URLSearchParams({
            subject: selectedSubject,
            count: count.toString(),
            mode: 'practice'
        });
        navigate(`/start-test?${params.toString()}`);
    };

    const subjects = activeExam.sections.map(section => ({
        name: section.name,
        icon: section.icon,
        total: section.questionCount * 10
    }));

    return (
        <div className="flex flex-col min-h-full bg-background pb-10">
            {/* Step Indicator Integrated into page top */}
            <div className="px-6 py-4">
                <div className="flex gap-2">
                    <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]' : 'bg-secondary'}`} />
                    <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]' : 'bg-secondary'}`} />
                </div>
            </div>

            <div className="flex-1 px-4">
                {step === 1 ? (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {subjects.map((subject) => (
                            <button
                                key={subject.name}
                                onClick={() => handleSubjectSelect(subject.name)}
                                className="group relative flex flex-col items-center p-6 bg-secondary/30 backdrop-blur-sm border border-border/50 rounded-[2.5rem] transition-all hover:bg-secondary/50 active:scale-95 overflow-hidden"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-500 drop-shadow-md">
                                    {subject.icon}
                                </div>
                                <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-center line-clamp-2">
                                    {subject.name}
                                </h3>
                                <div className="mt-3 text-[10px] font-black text-muted-foreground uppercase opacity-60">
                                    {getSubjectCount(subject.name)}/{subject.total} <span className="text-[8px]">DONE</span>
                                </div>
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="w-4 h-4 text-primary" />
                                </div>
                            </button>
                        ))}
                    </div>
                ) : step === 2 ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 py-6">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                                <Zap className="w-8 h-8 text-primary fill-primary animate-pulse" />
                            </div>
                            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Practice length</h2>
                            <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-60">Targeting {selectedSubject}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                            {[5, 10, 15, 20].map((count) => {
                                const isDisabled = isExplorer && count > remaining;
                                return (
                                    <button
                                        key={count}
                                        disabled={isDisabled}
                                        onClick={() => handleStartPractice(count)}
                                        className={`group relative p-8 rounded-[2rem] border-2 transition-all duration-300 active:scale-95 flex flex-col items-center justify-center gap-1 ${isDisabled
                                            ? 'bg-secondary/20 border-border/50 opacity-40 grayscale cursor-not-allowed'
                                            : 'bg-secondary/40 border-border/50 hover:bg-secondary/60 hover:border-primary/50 text-foreground'
                                            }`}
                                    >
                                        <span className="text-4xl font-black tracking-tighter">{count}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:text-primary transition-colors">Tasks</span>
                                        {!isDisabled && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse blur-[2px]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {isExplorer && (
                            <div className="text-center px-6">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                    Remaining Daily Limit: <span className="text-primary">{remaining}</span> / 15
                                </p>
                            </div>
                        )}

                        <div className="flex justify-center pt-4">
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-secondary/30 rounded-full border border-border/50">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    EST. Time: {selectedSubject === 'Mathematics' ? '25 mins' : '15 mins'}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20 text-primary">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Select Test</h2>
                            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-60">Available {selectedSubject} Tasks</p>
                        </div>

                        {isLoadingTests ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">Loading...</span>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {availableTests.map((test) => {
                                    const testSubs = userSubmissions.filter(s => (s.test_id || s.task_id) === test.id);
                                    const isCompleted = testSubs.some(s => s.status === 'completed');
                                    const isInProgress = !isCompleted && testSubs.some(s => s.status === 'in-progress');

                                    return (
                                        <Card
                                            key={test.id}
                                            onClick={() => handleTestSelect(test.id)}
                                            className="bg-secondary/30 border-border/50 rounded-3xl overflow-hidden active:scale-[0.98] transition-all cursor-pointer group"
                                        >
                                            <CardContent className="p-5 flex items-center gap-4">
                                                <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center border border-border/50 group-hover:border-primary/30 transition-colors">
                                                    <Trophy className={`w-6 h-6 ${isCompleted ? 'text-yellow-500' : 'text-primary opacity-40'}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-sm truncate uppercase tracking-tight">
                                                        {test.title || `Task Type: ${test.task_type}`}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {isCompleted ? (
                                                            <span className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Mastered</span>
                                                        ) : isInProgress ? (
                                                            <span className="text-[8px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">In Progress</span>
                                                        ) : (
                                                            <span className="text-[8px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Available</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                                {availableTests.length === 0 && (
                                    <div className="text-center py-20 bg-secondary/20 rounded-[3rem] border border-dashed border-border">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No matching questions found</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                title="Limit Reached"
                description="You've reached your daily practice limit. Upgrade to PRO for unlimited practice sessions."
                feature="Unlimited Practice"
            />
        </div>
    );
}
