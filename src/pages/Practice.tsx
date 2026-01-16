import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useExam } from '@/context/ExamContext';
import { BookOpen, ChevronRight, Zap, Target, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { EXAMS } from '@/config/exams';

import { supabase } from '@/integrations/supabase/client';
import { usePlanAccess } from '@/hooks/usePlanAccess';
import { UpgradeModal } from '@/components/UpgradeModal';

export default function Practice() {
    const navigate = useNavigate();
    const { activeExam, setActiveExam } = useExam();
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [step, setStep] = useState(1);
    const [availableTests, setAvailableTests] = useState<any[]>([]);
    const [userSubmissions, setUserSubmissions] = useState<any[]>([]);
    const [isLoadingTests, setIsLoadingTests] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const { hasReachedSubjectLimit, refreshLimit, isExplorer, getRemainingQuestions } = usePlanAccess();

    const remaining = getRemainingQuestions(selectedSubject);

    const handleSubjectSelect = async (subject: string) => {
        setSelectedSubject(subject);

        if (activeExam.id === 'ielts-academic') {
            if (subject === 'Speaking') {
                navigate('/speaking');
                return;
            }

            // For Reading and Listening, we now show a selection list
            if (subject === 'Academic Reading' || subject === 'Listening') {
                setIsLoadingTests(true);
                setStep(3);
                const table = subject === 'Academic Reading' ? 'reading_tests' : 'listening_tests';
                const subTable = subject === 'Academic Reading' ? 'reading_submissions' : 'listening_submissions';

                const [testsRes, subsRes] = await Promise.all([
                    (supabase as any).from(table).select('*').eq('is_mock_only', false).order('created_at', { ascending: false }),
                    (supabase as any).from(subTable).select('test_id, status').eq('user_id', (await supabase.auth.getUser()).data.user?.id)
                ]);

                if (testsRes.data) setAvailableTests(testsRes.data);
                if (subsRes.data) setUserSubmissions(subsRes.data);
                setIsLoadingTests(false);
                return;
            }

            if (subject === 'Academic Writing') {
                setIsLoadingTests(true);
                setStep(3);
                const [tasksRes, subsRes] = await Promise.all([
                    (supabase as any).from('writing_tasks').select('*').eq('is_mock_only', false).order('created_at', { ascending: false }),
                    (supabase as any).from('writing_submissions').select('task_id, status').eq('user_id', (await supabase.auth.getUser()).data.user?.id)
                ]);

                if (tasksRes.data) setAvailableTests(tasksRes.data);
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
        <Layout>
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl">
                {/* Header (Screenshot 3 style) */}
                <div className="text-center mb-8 sm:mb-10 space-y-4 animate-in fade-in duration-700">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 dark:text-slate-100 leading-tight">
                        <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                            Practice Arena
                        </span>
                    </h1>
                    <p className="text-base sm:text-lg text-slate-400 font-bold tracking-tight">
                        Build your perfect study session
                    </p>

                    {/* Step Indicator Dots (Screenshot 3 style) */}
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <div className={`w-8 sm:w-10 h-1 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-orange-500 shadow-md shadow-orange-200' : 'bg-slate-200'}`} />
                        <div className={`w-8 sm:w-10 h-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-orange-400 shadow-md shadow-orange-100' : 'bg-slate-200'}`} />
                    </div>
                </div>

                <div className="bg-white dark:bg-card p-5 sm:p-8 md:p-12 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-slate-100 dark:border-border border-b-[8px] shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-1000" />

                    {step === 1 ? (
                        <div className="relative z-10 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="flex flex-col items-center mb-10 sm:mb-12">
                                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 mb-6 text-indigo-600">
                                    <Target className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight text-center">Select a Subject</h2>
                                <p className="text-slate-400 font-bold text-[11px] sm:text-sm mt-3 uppercase tracking-widest opacity-60">Step 01 / 02</p>
                            </div>



                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                {subjects.map((subject) => (
                                    <button
                                        key={subject.name}
                                        onClick={() => handleSubjectSelect(subject.name)}
                                        className="p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-slate-100 dark:border-border border-b-[6px] bg-slate-50/30 shadow-lg shadow-slate-200/20 hover:bg-white dark:bg-card hover:border-slate-900 hover:shadow-2xl hover:-translate-y-1 active:border-b-2 active:translate-y-1 transition-all duration-300 text-center group/card flex flex-col items-center"
                                    >
                                        <div className="text-3xl sm:text-4xl mb-4 sm:mb-6 group-hover/card:scale-125 transition-transform duration-500 ease-out drop-shadow-sm">
                                            {subject.icon}
                                        </div>
                                        <h3 className="font-black text-slate-800 dark:text-slate-100 text-xs sm:text-sm mb-2 tracking-tight group-hover/card:text-indigo-600 transition-colors uppercase">{subject.name}</h3>
                                        <div className="flex items-center justify-center gap-1.5">
                                            <span className="text-[9px] sm:text-[10px] font-black text-slate-200 uppercase tracking-widest group-hover/card:text-indigo-200 transition-colors">
                                                0/{subject.total} <span className="text-[8px] opacity-40">ITEM</span>
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : step === 3 ? (
                        <div className="relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex flex-col items-center mb-10 sm:mb-12">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] hover:text-indigo-700 transition-colors mb-6 sm:mb-8 group"
                                >
                                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Subjects
                                </button>
                                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 mb-6 text-indigo-600">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight text-center">Select Test</h2>
                                <p className="text-slate-400 font-bold text-[11px] sm:text-sm mt-3 uppercase tracking-widest opacity-60 mb-6">Available {selectedSubject} Missions</p>

                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const type = selectedSubject.toLowerCase().includes('writing') ? 'writing' :
                                            selectedSubject.toLowerCase().includes('reading') ? 'reading' :
                                                selectedSubject.toLowerCase().includes('listening') ? 'listening' : 'speaking';
                                        navigate(`/${type}/history`);
                                    }}
                                    className="rounded-xl border-2 border-indigo-100 text-indigo-600 font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-indigo-50 h-auto py-2 px-4"
                                >
                                    <Clock className="w-3 h-3 mr-2 shrink-0" /> View My {selectedSubject} History
                                </Button>
                            </div>

                            {isLoadingTests ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                                    {availableTests.map((test) => {
                                        const testSubs = userSubmissions.filter(s => (s.test_id || s.task_id) === test.id);
                                        const isCompleted = testSubs.some(s => s.status === 'completed');
                                        const isInProgress = !isCompleted && testSubs.some(s => s.status === 'in-progress');

                                        return (
                                            <button
                                                key={test.id}
                                                onClick={() => handleTestSelect(test.id)}
                                                className="p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-slate-100 dark:border-border border-b-[6px] bg-slate-50/30 hover:bg-white dark:bg-card shadow-lg hover:border-slate-900 hover:-translate-y-1 transition-all duration-300 text-left group"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="p-3 bg-white dark:bg-card rounded-xl border border-slate-100 group-hover:border-indigo-100 transition-colors">
                                                        <BookOpen className="w- w-5 h-5 text-indigo-600" />
                                                    </div>
                                                    {isCompleted ? (
                                                        <span className="text-[9px] sm:text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">Completed</span>
                                                    ) : isInProgress ? (
                                                        <span className="text-[9px] sm:text-[10px] font-black text-amber-500 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest">Midway</span>
                                                    ) : (
                                                        <span className="text-[9px] sm:text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-widest">New</span>
                                                    )}
                                                </div>
                                                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">{test.title || `Writing Task: ${test.task_type}`}</h3>
                                                <p className="text-[11px] sm:text-sm text-slate-500 font-medium line-clamp-2 md:line-clamp-none">{test.description || test.prompt || 'Practice your skills with this specialized IELTS test module.'}</p>
                                            </button>
                                        );
                                    })}
                                    {availableTests.length === 0 && (
                                        <div className="col-span-full text-center py-20 text-slate-400 font-bold">
                                            No tests found for this subject.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="relative z-10 text-center animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex flex-col items-center mb-10 sm:mb-12">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] hover:text-indigo-700 transition-colors mb-6 sm:mb-8 group"
                                >
                                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Subjects
                                </button>
                                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50 mb-6 text-orange-600">
                                    <Zap className="w-8 h-8 fill-orange-600 animate-pulse" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Mission Length</h2>
                                <p className="text-slate-400 font-bold text-[11px] sm:text-sm mt-3 uppercase tracking-widest">Targeting {selectedSubject}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto mb-12 sm:mb-8">
                                {[5, 10, 15, 20].map((count) => {
                                    const isDisabled = isExplorer && count > remaining;
                                    return (
                                        <button
                                            key={count}
                                            disabled={isDisabled}
                                            onClick={() => handleStartPractice(count)}
                                            className={`p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-b-[6px] shadow-lg shadow-slate-200/20 transition-all duration-300 font-black text-3xl sm:text-4xl group/btn overflow-hidden relative ${isDisabled
                                                ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-200'
                                                : 'border-slate-100 dark:border-border hover:border-slate-900 bg-slate-50/30 hover:bg-white dark:bg-card hover:shadow-2xl hover:-translate-y-1 active:border-b-2 active:translate-y-1'
                                                }`}
                                        >
                                            <div className="relative z-10">
                                                {count}
                                                <span className="block text-[8px] sm:text-[10px] text-slate-300 font-black uppercase tracking-[0.2em] mt-2 group-hover/btn:text-orange-500 transition-colors">Questions</span>
                                            </div>
                                            {!isDisabled && (
                                                <div className="absolute top-0 right-0 w-12 h-12 bg-orange-50 rounded-bl-[2rem] opacity-0 group-hover/btn:opacity-100 transition-all duration-500 scale-150 rotate-12" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {isExplorer && (
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-12">
                                    Remaining Daily Limit: <span className="text-orange-600">{remaining}</span> / 15 Questions
                                </p>
                            )}

                            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-muted rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-border inline-flex items-center gap-3">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Duration: {selectedSubject === 'Mathematics' ? '25 mins' : '15 mins'}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                title="Daily Practice Limit Reached"
                description="You've used your 15 daily questions for the Explorer Plan. Upgrade to PRO for unlimited practice and simulated exams."
                feature="Unlimited Practice"
            />
        </Layout>
    );
}
