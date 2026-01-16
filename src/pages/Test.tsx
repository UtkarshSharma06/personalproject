import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import DiagramRenderer from '@/components/DiagramRenderer';
import { useExam } from '@/context/ExamContext';
import ProctoringSystem from '@/components/ProctoringSystem';
import { MathText } from '@/components/MathText';
import {
  Brain,
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle,
  AlertTriangle,
  Maximize,
  X,
  Camera,
  Lock,
  ArrowRight,
  Star,
  Loader2,
  Columns,
  ShieldAlert,
  Target,
} from 'lucide-react';

interface DiagramData {
  type: 'svg' | 'description' | 'coordinates';
  description?: string;
  svg?: string;
  coordinates?: object;
}

interface Question {
  id: string;
  question_number: number;
  question_text: string;
  options: string[];
  correct_index: number;
  user_answer: number | null;
  is_marked: boolean;
  diagram: DiagramData | null;
  topic: string | null;
  subject?: string | null;
  is_saved?: boolean;
  difficulty?: string; // Added difficulty to Question interface
  explanation?: string; // Added explanation to Question interface
}

interface Test {
  id: string;
  subject: string;
  topic: string | null;
  difficulty: string;
  total_questions: number;
  time_limit_minutes: number;
  started_at: string;
  test_type: string;
  mode?: 'standard' | 'adaptive' | 'weak_area';
  current_stage?: number;
  exam_type?: string; // Added exam_type to Test interface
}

interface Section {
  name: string;
  icon: string;
  startIndex: number;
  endIndex: number;
  questionCount: number;
  durationMinutes: number;
}

export default function TestPage() {
  const { testId } = useParams<{ testId: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { activeExam } = useExam();
  const [test, setTest] = useState<any | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showSectionComplete, setShowSectionComplete] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const questionStartTime = useRef<number>(Date.now());

  // Build sections based on active exam or topics
  const sections = useMemo<Section[]>(() => {
    if (!test || questions.length === 0) return [];

    if (test.test_type === 'mock') {
      // Use official sections from ExamConfig
      let currentStart = 0;
      return activeExam.sections.map((sec) => {
        const section: Section = {
          name: sec.name,
          icon: '📝',
          startIndex: currentStart,
          endIndex: currentStart + sec.questionCount - 1,
          questionCount: sec.questionCount,
          durationMinutes: sec.durationMinutes,
        };
        currentStart += sec.questionCount;
        return section;
      });
    }

    // Practice / Adaptive Mode: Dynamic sections by topic
    const sectionMap: Record<string, number[]> = {};
    questions.forEach((q, idx) => {
      const topic = q.topic || 'General';
      if (!sectionMap[topic]) sectionMap[topic] = [];
      sectionMap[topic].push(idx);
    });

    let currentStart = 0;
    return Object.entries(sectionMap).map(([name, indices]) => {
      const section: Section = {
        name,
        icon: '📝',
        startIndex: currentStart,
        endIndex: currentStart + indices.length - 1,
        questionCount: indices.length,
        durationMinutes: 0, // Not applicable for practice
      };
      currentStart += indices.length;
      return section;
    });
  }, [test, questions, activeExam]);

  const isMockExam = test?.test_type === 'mock';
  const currentSection = sections[currentSectionIndex];

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (testId && user) {
      fetchTestData();
    }
  }, [testId, user]);

  const fetchTestData = async () => {
    const { data: testData, error: testError } = await supabase
      .from('tests')
      .select('*')
      .eq('id', testId)
      .maybeSingle();

    if (testError || !testData) {
      toast({
        title: 'Test not found',
        description: 'The requested test could not be found.',
        variant: 'destructive',
      });
      navigate('/dashboard');
      return;
    }

    if (testData.status === 'completed') {
      navigate(`/ results / ${testId} `);
      return;
    }

    setTest(testData as Test);
    if (testData.test_type === 'mock') {
      const stage = typeof (testData as any).current_stage === 'number' ? (testData as any).current_stage : 1;
      setCurrentSectionIndex(stage - 1);

      // Find which index to start at? Probably 0 if new, or leave at 0 and let user navigate.
      // Actually, let's start at the beginning of the resumed section.
      const currentSec = activeExam.sections[stage - 1];
      if (currentSec) {
        setSectionTimeRemaining(currentSec.durationMinutes * 60);
      }
    }

    // Calculate remaining time
    const startTime = new Date(testData.started_at).getTime();
    const endTime = startTime + testData.time_limit_minutes * 60 * 1000;
    const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    setTimeRemaining(remaining);


    const { data: questionsData } = await supabase
      .from('questions')
      .select('*')
      .eq('test_id', testId)
      .order('question_number');

    if (questionsData) {
      setQuestions(questionsData.map(q => ({
        ...q,
        options: q.options as string[],
        diagram: q.diagram as unknown as DiagramData | null,
      })));
    }
  };

  // Timer logic for both global and section-specific time
  useEffect(() => {
    if (!test) return;

    if (timeRemaining <= 0) {
      handleAutoSubmit();
      return;
    }

    // Auto-complete section if section timer is enabled and hits 0
    if (isMockExam && sectionTimeRemaining <= 0 && currentSection) {
      handleCompleteSection();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));

      if (isMockExam) {
        setSectionTimeRemaining((prev) => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, sectionTimeRemaining, test, isMockExam, currentSectionIndex]);

  const handleDisqualification = async () => {
    setIsDisqualified(true);
    toast({
      title: 'Exam Terminated',
      description: 'Multiple proctoring violations detected. Test submitted automatically.',
      variant: 'destructive',
    });
    await submitTest('disqualified');
  };

  const handleAutoSubmit = async () => {
    toast({
      title: "Time's up!",
      description: 'Your test has been automatically submitted.',
      variant: 'destructive',
    });
    await submitTest('time_up');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} `;
  };

  // Track time spent on question when navigating
  const trackQuestionTime = async () => {
    const question = questions[currentIndex];
    if (!question) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime.current) / 1000);

    await supabase
      .from('questions')
      .update({ time_spent_seconds: timeSpent })
      .eq('id', question.id);
  };

  const handleSelectAnswer = async (optionIndex: number) => {
    const question = questions[currentIndex];
    if (!question) return;

    // Update local state
    setQuestions(prev => prev.map((q, i) =>
      i === currentIndex ? { ...q, user_answer: optionIndex } : q
    ));

    // Update in database
    await supabase
      .from('questions')
      .update({
        user_answer: optionIndex,
        answered_at: new Date().toISOString(),
      })
      .eq('id', question.id);

    // Record in user_practice_responses if it's a manual question
    if ((question as any).practice_question_id && user) {
      await (supabase as any)
        .from('user_practice_responses')
        .upsert({
          user_id: user.id,
          question_id: (question as any).practice_question_id,
          exam_type: test!.exam_type || 'standard',
          subject: test!.subject,
          topic: question.topic,
          is_correct: optionIndex === question.correct_index,
          created_at: new Date().toISOString()
        }, { onConflict: 'user_id,question_id' });
    }
  };

  const handleMarkForReview = async () => {
    const question = questions[currentIndex];
    if (!question) return;

    const newMarked = !question.is_marked;

    setQuestions(prev => prev.map((q, i) =>
      i === currentIndex ? { ...q, is_marked: newMarked } : q
    ));

    await supabase
      .from('questions')
      .update({ is_marked: newMarked })
      .eq('id', question.id);
  };

  const handleBookmark = async () => {
    const question = questions[currentIndex];
    if (!question || !user) return;

    if (question.is_saved) {
      toast({ title: 'Already saved', description: 'This question is already in your bookmarks.' });
      return;
    }

    try {
      const { error } = await supabase.from('saved_questions').insert({
        user_id: user.id,
        question_id: question.id,
        question_data: question as any,
        notes: ''
      });

      if (error) throw error;

      setQuestions(prev => prev.map((q, i) =>
        i === currentIndex ? { ...q, is_saved: true } : q
      ));

      toast({
        title: 'Question Saved',
        description: 'Added to your bookmarks.',
      });
    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        title: 'Failed to save',
        description: 'Could not save question.',
        variant: 'destructive'
      });
    }
  };

  const handleNavigate = async (newIndex: number) => {
    // For mock exams, only allow navigation within current section or to completed sections
    if (isMockExam && sections.length > 0) {
      const targetSectionIdx = sections.findIndex(
        s => newIndex >= s.startIndex && newIndex <= s.endIndex
      );

      // Don't allow going back to previous sections once completed
      if (targetSectionIdx < currentSectionIndex && completedSections.includes(targetSectionIdx)) {
        toast({
          title: 'Section Locked',
          description: 'You cannot return to a completed section.',
          variant: 'destructive',
        });
        return;
      }

      // Don't allow skipping ahead to future sections
      if (targetSectionIdx > currentSectionIndex) {
        toast({
          title: 'Complete Current Section',
          description: 'Please complete or skip the current section first.',
          variant: 'destructive',
        });
        return;
      }
    }

    await trackQuestionTime();
    setCurrentIndex(newIndex);
    questionStartTime.current = Date.now();
  };

  const handleCompleteSection = async () => {
    if (!currentSection) return;

    await trackQuestionTime();
    setCompletedSections(prev => [...prev, currentSectionIndex]);
    setShowSectionComplete(false);

    // Move to next section
    if (currentSectionIndex < sections.length - 1) {
      const nextSection = sections[currentSectionIndex + 1];
      const nextStage = currentSectionIndex + 2; // stage is 1-based, next index is curr+1

      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentIndex(nextSection.startIndex);
      setSectionTimeRemaining(nextSection.durationMinutes * 60);
      questionStartTime.current = Date.now();

      // Persist to DB
      await (supabase as any).from('tests').update({ current_stage: nextStage }).eq('id', testId);

      toast({
        title: `Section Complete!`,
        description: `Moving to ${nextSection.name}. You have ${nextSection.durationMinutes} minutes.`,
      });
    } else {
      // All sections done, show submit
      setShowSubmitConfirm(true);
    }
  };

  const handleSkipSection = async () => {
    if (!currentSection) return;

    await trackQuestionTime();
    setCompletedSections(prev => [...prev, currentSectionIndex]);
    setShowSectionComplete(false);

    // Move to next section
    if (currentSectionIndex < sections.length - 1) {
      const nextSection = sections[currentSectionIndex + 1];
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentIndex(nextSection.startIndex);
      setSectionTimeRemaining(nextSection.durationMinutes * 60);
      questionStartTime.current = Date.now();

      toast({
        title: `Section Skipped`,
        description: `Moving to ${nextSection.name}. You have ${nextSection.durationMinutes} minutes.`,
      });
    } else {
      setShowSubmitConfirm(true);
    }
  };


  const submitTest = async (reason = 'manual') => {
    if (!test || !testId) return;

    setIsSubmitting(true);

    try {
      await trackQuestionTime();

      const { data: allQuestions } = await supabase
        .from('questions')
        .select('*')
        .eq('test_id', testId) as { data: any[] };

      if (!allQuestions) throw new Error('Failed to fetch questions');

      let correct = 0;
      let wrong = 0;
      let skipped = 0;
      let finalScore = 0;

      // Scoring Rules from Active Exam
      const { correct: corrPts, incorrect: incorrPts, skipped: skipPts } = activeExam.scoring;

      allQuestions.forEach(q => {
        if (q.user_answer === null) {
          skipped++;
          finalScore += skipPts;
        } else if (q.user_answer === q.correct_index) {
          correct++;
          finalScore += corrPts;
        } else {
          wrong++;
          finalScore += incorrPts;
        }
      });

      // Calculate percentage for standardized display
      const maxPossibleScore = allQuestions.length * corrPts;
      const scorePercentage = Math.round((finalScore / maxPossibleScore) * 100);
      const timeTaken = test.time_limit_minutes * 60 - timeRemaining;

      // Update test record
      await supabase
        .from('tests')
        .update({
          status: 'completed',
          score: scorePercentage, // Standardized percentage
          correct_answers: correct,
          wrong_answers: wrong,
          skipped_answers: skipped,
          time_taken_seconds: timeTaken,
          completed_at: new Date().toISOString(),
          proctoring_status: reason === 'disqualified' ? 'failed' : (test.test_type === 'mock' ? 'passed' : 'not_required'),
        })
        .eq('id', testId);

      // Update topic performance
      const topicGroups: Record<string, { correct: number; total: number; subject: string }> = {};

      allQuestions.forEach(q => {
        const subject = q.subject || test.subject;
        const topic = q.topic || subject;
        const key = `${subject}:${topic} `;

        if (!topicGroups[key]) {
          topicGroups[key] = { correct: 0, total: 0, subject };
        }
        topicGroups[key].total++;
        if (q.user_answer === q.correct_index) {
          topicGroups[key].correct++;
        }
      });

      for (const [key, data] of Object.entries(topicGroups)) {
        const [subject, topic] = key.split(':');
        // ... rest of logic
        const accuracy = (data.correct / data.total) * 100;

        // Upsert topic performance
        const { data: existing } = await (supabase.from('topic_performance') as any)
          .select('*')
          .eq('user_id', user!.id)
          .eq('subject', data.subject)
          .eq('topic', topic)
          .eq('exam_type', test.exam_type || activeExam.id)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('topic_performance')
            .update({
              total_questions: existing.total_questions + data.total,
              correct_answers: existing.correct_answers + data.correct,
              accuracy_percentage: ((existing.correct_answers + data.correct) / (existing.total_questions + data.total)) * 100,
              last_attempted_at: new Date().toISOString(),
            })
            .eq('id', existing.id);
        } else {
          await supabase
            .from('topic_performance')
            .insert({
              user_id: user!.id,
              exam_type: test.exam_type || activeExam.id,
              subject: test.subject,
              topic,
              total_questions: data.total,
              correct_answers: data.correct,
              accuracy_percentage: accuracy,
            });
        }
      }

      // Exit fullscreen if active
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }

      navigate(`/results/${testId}`);
    } catch (error) {
      console.error('Error submitting test:', error);
      toast({
        title: 'Submission failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Prevent copy/paste
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast({
        title: 'Copy disabled',
        description: 'Copying is not allowed during the test.',
        variant: 'destructive',
      });
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  if (loading || !test || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-muted-foreground">Loading test...</span>
        </div>
      </div>
    );
  }

  if (isDisqualified) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Exam Terminated</h1>
        <p className="text-muted-foreground mb-6">
          Multiple proctoring violations were detected. Your session has been automatically submitted for review.
        </p>
        <Button onClick={() => navigate('/mock-exams')}>Return to Mock Exams</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = questions.filter(q => q.user_answer !== null).length;
  const markedCount = questions.filter(q => q.is_marked).length;

  return (
    <div className="min-h-screen bg-background flex flex-col select-none">
      {/* Proctoring System */}
      <ProctoringSystem
        testId={testId!}
        isActive={test.test_type === 'mock'}
        onViolationThresholdReached={handleDisqualification}
      />
      {/* Header (Sleek Modern) */}
      <header className="border-b border-slate-100 dark:border-border bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-muted flex items-center justify-center border border-slate-100 dark:border-border dark:border-border">
              <Brain className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Mission Source</p>
              <h1 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                {test.subject} {test.topic && <span className="text-slate-300 ml-1">/ {test.topic}</span>}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {test.test_type === 'mock' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-widest">
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Active Proctor</span>
              </div>
            )}

            <div className={`flex items - center gap - 3 px - 5 py - 2.5 rounded - 2xl border transition - colors ${(isMockExam ? sectionTimeRemaining : timeRemaining) < 300
              ? 'bg-rose-50 border-rose-100 text-rose-600'
              : 'bg-slate-50 dark:bg-muted border-slate-100 dark:border-border text-slate-600'
              } `}>
              <Clock className="w-4 h-4 opacity-50" />
              <div className="flex flex-col items-center">
                <span className="font-mono text-lg font-black leading-none">{formatTime(isMockExam ? sectionTimeRemaining : timeRemaining)}</span>
                {isMockExam && (
                  <span className="text-[8px] font-black uppercase opacity-40 mt-0.5 tracking-widest">Section</span>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="w-10 h-10 rounded-xl border border-slate-100 dark:border-border hover:bg-slate-50 dark:bg-muted dark:bg-muted"
            >
              <Maximize className="w-4 h-4 text-slate-400" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Main Content (Sleek Modern) */}
        <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Section Header */}
            {isMockExam && currentSection && (
              <div className="mb-8 p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100/50 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-card rounded-2xl flex items-center justify-center text-xl shadow-sm border border-indigo-100 group-hover:scale-110 transition-transform">
                    {currentSection.icon}
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1.5">Current Domain</p>
                    <h2 className="text-lg font-black text-indigo-900 tracking-tight uppercase">
                      {currentSection.name}
                    </h2>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Progress</p>
                  <p className="text-sm font-black text-indigo-600">
                    STAGE {currentSectionIndex + 1} <span className="text-slate-300 mx-1">/</span> {sections.length}
                  </p>
                </div>
              </div>
            )}

            {/* Diagram if present */}
            {currentQuestion.diagram && (
              <DiagramRenderer
                diagram={currentQuestion.diagram}
                className="mb-6"
              />
            )}

            {/* Question (Premium Typography) */}
            <div className="bg-white dark:bg-card p-10 rounded-[2.5rem] border border-slate-100 dark:border-border shadow-sm mb-10 group hover:border-slate-300 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-100 transition-opacity">
                <Brain className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded-lg">Item {currentIndex + 1}</div>
                    <div className="px-3 py-1 bg-slate-50 dark:bg-muted text-slate-400 text-[8px] font-black uppercase tracking-widest rounded-lg border border-slate-100 dark:border-border dark:border-border">{currentQuestion.difficulty || 'Standard'} Mode</div>
                  </div>
                </div>
                {/* Question Text rendering handled by MathText */}
                {currentQuestion.question_text ? (
                  <MathText
                    content={currentQuestion.question_text}
                    className="text-xl font-bold text-slate-800 leading-relaxed tracking-tight"
                  />
                ) : (
                  <p className="text-xl font-bold text-red-600 leading-relaxed tracking-tight">
                    [Question text missing - Debug: {JSON.stringify(Object.keys(currentQuestion))}]
                  </p>
                )}
              </div>
            </div>

            {/* Options (Sleek Selection) */}
            <div className="space-y-4 mb-12">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className={`w-full p-6 rounded-[1.75rem] border-2 transition-all text-left flex items-center gap-6 group/opt ${currentQuestion.user_answer === index
                    ? 'border-indigo-600 bg-indigo-50/30 shadow-indigo-100 shadow-lg -translate-y-0.5'
                    : 'border-slate-50 bg-slate-50/50 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:border-border hover:bg-white'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all shadow-sm ${currentQuestion.user_answer === index
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-card text-slate-300 border border-slate-100 dark:border-border group-hover/opt:text-slate-900'
                    }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <MathText
                    content={option}
                    className={`font-bold tracking-tight ${currentQuestion.user_answer === index ? 'text-indigo-900' : 'text-slate-600'}`}
                  />
                </button>
              ))}
            </div>

            {/* Navigation (Sleek Buttons) */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-50">
              <Button
                variant="ghost"
                onClick={() => {
                  if (isMockExam && currentSection && currentIndex === currentSection.startIndex) return;
                  handleNavigate(Math.max(0, currentIndex - 1));
                }}
                disabled={currentIndex === 0 || (isMockExam && currentSection && currentIndex === currentSection.startIndex)}
                className="h-14 px-8 rounded-2xl border border-slate-100 dark:border-border font-black text-[10px] uppercase tracking-widest hover:border-slate-900 transition-all"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Step Back
              </Button>

              {isMockExam && currentSection && currentIndex === currentSection.endIndex ? (
                currentSectionIndex === sections.length - 1 ? (
                  <Button
                    onClick={() => setShowSubmitConfirm(true)}
                    className="h-14 px-10 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100/50"
                  >
                    FINAL SUBMISSION
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowSectionComplete(true)}
                    className="h-14 px-10 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100/50"
                  >
                    LOCK & PROCEED
                  </Button>
                )
              ) : currentIndex === questions.length - 1 ? (
                <Button
                  onClick={() => setShowSubmitConfirm(true)}
                  className="h-14 px-10 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100/50"
                >
                  SUBMIT MISSION
                </Button>
              ) : (
                <Button
                  onClick={() => handleNavigate(Math.min(questions.length - 1, currentIndex + 1))}
                  className="h-14 px-10 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
                >
                  Confirm & Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </main>

        {/* Sidebar (Sleek Modern) */}
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-border bg-slate-50/50 p-8 overflow-y-auto h-full space-y-12">
          {/* Section Navigator */}
          {isMockExam && sections.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Domains</h3>
              <div className="space-y-3">
                {sections.map((section, idx) => {
                  const isCompleted = completedSections.includes(idx);
                  const isCurrent = idx === currentSectionIndex;
                  const isLocked = idx < currentSectionIndex && isCompleted;
                  const isFuture = idx > currentSectionIndex;

                  return (
                    <div
                      key={section.name}
                      className={`p-4 rounded-2xl border transition-all ${isCurrent
                        ? 'border-indigo-600 bg-white dark:bg-card shadow-lg shadow-indigo-50'
                        : isLocked
                          ? 'border-slate-100 dark:border-border bg-slate-50 dark:bg-muted opacity-40'
                          : 'border-slate-50 bg-slate-50/50 opacity-80'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{section.icon}</span>
                          <span className="text-[10px] font-black uppercase tracking-tight text-slate-900 dark:text-slate-100 dark:text-slate-100">
                            {section.name.split(' ')[0]}
                          </span>
                        </div>
                        {isLocked ? <Lock className="w-3.5 h-3.5 text-slate-300" /> : isCompleted ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : null}
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-indigo-500 transition-all`} style={{ width: `${(questions.slice(section.startIndex, section.endIndex + 1).filter(q => q.user_answer !== null).length / section.questionCount) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Matrix Navigator</h3>
              <div className="flex gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.3)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.3)]" />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {(isMockExam && currentSection
                ? questions.slice(currentSection.startIndex, currentSection.endIndex + 1)
                : questions
              ).map((q, i) => {
                const actualIndex = isMockExam && currentSection ? currentSection.startIndex + i : i;
                const isLocked = isMockExam && sections.length > 0 && (
                  sections.findIndex(s => actualIndex >= s.startIndex && actualIndex <= s.endIndex) !== currentSectionIndex
                );

                return (
                  <button
                    key={q.id}
                    onClick={() => !isLocked && handleNavigate(actualIndex)}
                    disabled={isLocked}
                    className={`aspect-square rounded-xl text-[11px] font-black transition-all ${isLocked
                      ? 'bg-slate-50 dark:bg-muted text-slate-200 cursor-not-allowed border border-transparent'
                      : actualIndex === currentIndex
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 -translate-y-0.5'
                        : q.user_answer !== null
                          ? q.is_marked
                            ? 'bg-orange-50 text-orange-600 border border-orange-100'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : q.is_marked
                            ? 'bg-orange-50 text-orange-600 border border-orange-100'
                            : 'bg-white dark:bg-card text-slate-400 border border-slate-100 dark:border-border hover:border-slate-900 hover:text-slate-900'
                      }`}
                  >
                    {actualIndex + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-8">
              <Button
                onClick={() => setShowSubmitConfirm(true)}
                className="w-full h-12 bg-white dark:bg-card text-rose-600 border border-rose-100 hover:bg-rose-50 hover:border-rose-200 font-black text-[9px] uppercase tracking-widest rounded-xl transition-all"
              >
                Abort & Submit Early
              </Button>
            </div>
          </div>
        </aside>
      </div >

      {/* Section Complete Modal (Sleek Modern) */}
      {
        showSectionComplete && currentSection && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-card rounded-[3rem] p-10 max-w-md w-full border border-slate-100 dark:border-border shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="text-center mb-10">
                <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 flex items-center justify-center mx-auto mb-6 border border-indigo-100 text-3xl shadow-sm">
                  {currentSection.icon}
                </div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Milestone Complete</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">Close Domain: {currentSection.name}?</h3>
              </div>

              {(() => {
                const sectionQuestions = questions.slice(currentSection.startIndex, currentSection.endIndex + 1);
                const sectionAnswered = sectionQuestions.filter(q => q.user_answer !== null).length;
                const sectionUnanswered = currentSection.questionCount - sectionAnswered;

                return (
                  <div className="space-y-6 mb-10">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-muted p-4 rounded-2xl border border-slate-100 dark:border-border dark:border-border">
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Answered</p>
                        <p className="text-xl font-black text-indigo-600">{sectionAnswered}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-muted p-4 rounded-2xl border border-slate-100 dark:border-border dark:border-border">
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Pending</p>
                        <p className="text-xl font-black text-slate-400">{sectionUnanswered}</p>
                      </div>
                    </div>

                    {sectionUnanswered > 0 && (
                      <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-50 border border-amber-100">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs font-bold text-amber-900/60 leading-relaxed">
                          You have {sectionUnanswered} items unresolved. Proceeding will lock this domain permanently.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="grid gap-4">
                <Button
                  onClick={handleCompleteSection}
                  className="w-full h-16 bg-slate-900 text-white hover:bg-slate-800 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl active:scale-95 transition-all"
                >
                  COMMIT & PROCEED
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowSectionComplete(false)}
                  className="w-full h-14 rounded-2xl border border-slate-100 dark:border-border font-bold text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:bg-muted transition-all"
                >
                  Review Current Work
                </Button>
              </div>
            </div>
          </div>
        )
      }

      {/* Submit Confirmation Modal (Sleek Modern) */}
      {
        showSubmitConfirm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-card rounded-[3.5rem] p-12 max-w-lg w-full border border-slate-100 dark:border-border shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <CheckCircle className="w-32 h-32" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100">
                      <Target className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Final Phase</p>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Mission Submission</h3>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSubmitConfirm(false)}
                    className="w-10 h-10 rounded-xl hover:bg-slate-50 dark:bg-muted dark:bg-muted"
                  >
                    <X className="w-5 h-5 text-slate-300" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-10">
                  <div className="bg-slate-50 dark:bg-muted p-6 rounded-[2rem] border border-slate-100 dark:border-border dark:border-border">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-2">Answered</p>
                    <p className="text-2xl font-black text-emerald-600 leading-none">{answeredCount}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-muted p-6 rounded-[2rem] border border-slate-100 dark:border-border dark:border-border">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-2">Pending</p>
                    <p className="text-2xl font-black text-slate-300 leading-none">{questions.length - answeredCount}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-muted p-6 rounded-[2rem] border border-slate-100 dark:border-border dark:border-border">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-2">Marked</p>
                    <p className="text-2xl font-black text-orange-500 leading-none">{markedCount}</p>
                  </div>
                </div>

                {questions.length - answeredCount > 0 && (
                  <div className="flex items-start gap-5 p-6 rounded-[2rem] bg-rose-50 border border-rose-100 mb-10">
                    <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-bold text-rose-900/60 leading-relaxed">
                      Attention: {questions.length - answeredCount} items are still pending verification. Submitting now will generate results based on current progress.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowSubmitConfirm(false)}
                    className="h-16 rounded-2xl border border-slate-100 dark:border-border font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:bg-muted dark:bg-muted"
                  >
                    RETURN TO MISSION
                  </Button>
                  <Button
                    onClick={() => submitTest('manual')}
                    disabled={isSubmitting}
                    className="h-16 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 active:scale-95 transition-all"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'EXECUTE SUBMIT'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
