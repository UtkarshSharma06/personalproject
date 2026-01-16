import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Brain,
  ArrowLeft,
  PlayCircle,
  BookOpen,
  Clock,
  Target,
  ChevronDown,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { useExam } from '@/context/ExamContext';
import { usePlanAccess } from '@/hooks/usePlanAccess';
import Layout from '@/components/Layout';

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', description: 'Basic concepts', color: 'text-emerald-500' },
  { value: 'medium', label: 'Medium', description: 'Moderate difficulty', color: 'text-orange-500' },
  { value: 'hard', label: 'Hard', description: 'Advanced problems', color: 'text-rose-500' },
  { value: 'mixed', label: 'Mixed', description: 'All levels', color: 'text-indigo-500' },
];

export default function StartTest() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeExam } = useExam();
  const [searchParams] = useSearchParams();
  const { hasReachedSubjectLimit, getRemainingQuestions, isExplorer } = usePlanAccess();

  const [subject, setSubject] = useState(searchParams.get('subject') || 'Mathematics');
  const [topic, setTopic] = useState('');
  const [availableTopics, setAvailableTopics] = useState<{ name: string; count: number }[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(Number(searchParams.get('count')) || 10);
  const [timeLimit, setTimeLimit] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch unique topics for the selected subject
  useEffect(() => {
    const fetchTopics = async () => {
      if (!activeExam || !subject) return;
      setIsLoadingTopics(true);

      try {
        const { data, error } = await (supabase as any)
          .from('practice_questions')
          .select('topic')
          .eq('exam_type', activeExam.id)
          .eq('subject', subject);

        if (!error && data) {
          const counts: Record<string, number> = {};
          data.forEach((q: any) => {
            if (q.topic) {
              counts[q.topic] = (counts[q.topic] || 0) + 1;
            }
          });

          const sortedTopics = Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

          setAvailableTopics(sortedTopics);
          // Only reset topic if current topic is not in the new list and not 'all'
          if (topic !== 'all' && !counts[topic]) {
            setTopic('all');
          }
        }
      } catch (err) {
        console.error('Error fetching topics:', err);
      } finally {
        setIsLoadingTopics(false);
      }
    };

    fetchTopics();
  }, [subject, activeExam.id]);

  // Auto-start for Mock Simulation or Direct "Consult" Missions
  useEffect(() => {
    const mode = searchParams.get('mode');
    const fullExam = searchParams.get('full_exam') === 'true';
    const autoLaunch = searchParams.get('auto') === 'true';

    if (user && !loading) {
      if (fullExam || autoLaunch) {
        handleStartTest(fullExam);
      }
      // Practice mode不再自动开始，允许用户在Custom Practice页面进行二次筛选
    }
  }, [user, loading, searchParams]); // Run when user is ready or params change

  const handleStartTest = async (isFullMock = false) => {
    if (!user) return;

    if (hasReachedSubjectLimit(isFullMock ? 'Mock Simulation' : subject)) {
      toast({
        title: 'Daily Limit Reached',
        description: `You have reached your 15-question daily limit for ${isFullMock ? 'Mock Simulations' : subject}. Upgrade to PRO for unlimited practice!`,
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const finalCount = isFullMock ? activeExam.totalQuestions : questionCount;
      const finalTime = isFullMock ? activeExam.durationMinutes : timeLimit;
      const finalSubject = isFullMock ? 'All Subjects' : subject;

      let questions: any[] = [];

      // 0. Fetch solved question IDs to avoid repeats
      const { data: solvedData } = await (supabase as any)
        .from('user_practice_responses')
        .select('question_id')
        .eq('user_id', user.id);

      const solvedIds = solvedData?.map((r: any) => r.question_id) || [];

      // 1. Fetch from Manual Practice Bank
      if (isFullMock) {
        // Assembling Full Mock from Manual Bank
        for (const section of activeExam.sections) {
          const { data: sectionQuestions, error: sectionError } = await (supabase as any)
            .from('practice_questions')
            .select('*')
            .eq('exam_type', activeExam.id)
            .eq('subject', section.name)
            .not('id', 'in', `(${solvedIds.join(',')})`)
            .limit(section.questionCount);

          if (sectionError) throw sectionError;

          if (!sectionQuestions || sectionQuestions.length < section.questionCount) {
            throw new Error(`Insufficient manual questions for section: ${section.name}. Need ${section.questionCount}, found ${sectionQuestions?.length || 0}.`);
          }

          questions = [...questions, ...sectionQuestions.map(q => ({
            question_text: q.question_text,
            options: q.options,
            correctIndex: q.correct_index,
            explanation: q.explanation,
            difficulty: q.difficulty,
            topic: q.topic,
            practice_question_id: q.id
          }))];
        }
      } else {
        // Fetching from Manual Practice Bank
        let query = (supabase as any)
          .from('practice_questions')
          .select('*')
          .eq('exam_type', activeExam.id)
          .eq('subject', subject);

        if (difficulty !== 'mixed' && difficulty !== 'all') {
          query = query.eq('difficulty', difficulty);
        }

        if (topic && topic !== 'all') {
          query = query.eq('topic', topic);
        }

        if (solvedIds.length > 0) {
          query = query.not('id', 'in', `(${solvedIds.join(',')})`);
        }

        const { data: manualQuestions, error: manualError } = await query;

        if (manualError) throw manualError;

        if (!manualQuestions || manualQuestions.length < finalCount) {
          throw new Error(`Insufficient questions in the manual bank. Need ${finalCount}, found ${manualQuestions?.length || 0}. Update the bank in Admin.`);
        }

        let pool = [...manualQuestions];
        // Shuffle for variety
        pool = pool.sort(() => Math.random() - 0.5);

        // Manual questions identified
        questions = pool.slice(0, finalCount).map(q => ({
          question_text: q.question_text,
          options: q.options,
          correctIndex: q.correct_index,
          explanation: q.explanation,
          difficulty: q.difficulty,
          topic: q.topic,
          practice_question_id: q.id
        }));
      }

      if (!questions || questions.length === 0) throw new Error('No questions available in the manual bank.');

      // Create test record
      const { data: test, error: testError } = await supabase
        .from('tests')
        .insert({
          user_id: user.id,
          subject: finalSubject,
          topic: topic && topic !== 'all' ? topic : null,
          difficulty: isFullMock ? 'mixed' : (difficulty === 'all' ? 'mixed' : difficulty),
          total_questions: questions.length,
          time_limit_minutes: finalTime,
          status: 'in_progress',
          exam_type: activeExam.id,
          is_mock: isFullMock
        })
        .select()
        .single();

      if (testError) {
        console.error('Supabase Test Insert Error:', testError);
        throw testError;
      }

      // Insert questions
      const questionsToInsert = questions.map((q: any, index: number) => ({
        test_id: test.id,
        question_number: index + 1,
        question_text: q.question_text,
        options: q.options,
        correct_index: q.correctIndex,
        explanation: q.explanation,
        difficulty: q.difficulty,
        topic: q.topic || (topic !== 'all' ? topic : null) || finalSubject,
        practice_question_id: q.practice_question_id || null
      }));

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (questionsError) {
        console.error('Supabase Questions Insert Error:', questionsError);
        throw questionsError;
      }

      toast({
        title: isFullMock ? 'Simulation Initialized!' : 'Practice Ready!',
        description: `Preparing ${questions.length} refined questions. Good luck!`,
      });

      navigate(`/test/${test.id}`);

    } catch (error: any) {
      console.error('Error starting test:', error);
      toast({
        title: 'Mission Interface Error',
        description: error?.message || error?.details || 'Please verify database connection and schema.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading || isGenerating) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-muted flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          <Zap className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2">
          {isGenerating ? 'Assembling Mission...' : 'Syncing Data...'}
        </h2>
        <p className="text-slate-400 font-bold text-sm max-w-xs mx-auto uppercase tracking-widest">
          {isGenerating ? 'Assembling your curriculum based on official mission parameters.' : 'Connecting to prep-server.'}
        </p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4 mb-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-100 dark:border-border hover:bg-white dark:bg-card hover:border-slate-900 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Custom Practice</h1>
        </div>

        <div className="bg-white dark:bg-card p-10 rounded-[2.5rem] border border-slate-100 dark:border-border shadow-xl shadow-slate-200/50 space-y-12">
          {/* Step 1: Subject Selection */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step 1: Domain Selection</h3>
              </div>
              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">{subject} Selected</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {activeExam.sections.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setSubject(s.name)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${subject === s.name
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm'
                    : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200'
                    }`}
                >
                  <span className="text-xl">{s.icon}</span>
                  <span className="font-bold text-[10px] uppercase tracking-tight text-center leading-tight">{s.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Step 2: Topic Selection */}
          <section className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step 2: Topic Targeting</h3>
              </div>
              {isLoadingTopics && <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTopic('all')}
                className={`px-6 py-3 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${topic === 'all' || !topic
                  ? 'border-slate-900 bg-slate-900 text-white shadow-lg'
                  : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200'
                  }`}
              >
                All Topics
              </button>
              {availableTopics.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTopic(t.name)}
                  className={`px-6 py-3 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${topic === t.name
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm'
                    : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200'
                    }`}
                >
                  {t.name}
                  <span className={`px-2 py-0.5 rounded-full text-[8px] ${topic === t.name ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {t.count}
                  </span>
                </button>
              ))}
              {!isLoadingTopics && availableTopics.length === 0 && (
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest py-2">No specific topics discovered in this sector.</p>
              )}
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Step 3: Question Count */}
            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-600" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step 3: Mission Scale</h3>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[5, 10, 15, 20, 25].map((count) => {
                  const remaining = getRemainingQuestions(subject);
                  const isDisabled = isExplorer && count > remaining;
                  return (
                    <button
                      key={count}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => setQuestionCount(count)}
                      className={`w-12 h-12 rounded-xl border-2 font-black text-xs transition-all ${isDisabled
                        ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-200'
                        : questionCount === count
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm'
                          : 'border-slate-50 bg-slate-50/30 text-slate-400 hover:border-slate-200'
                        }`}
                    >
                      {count}
                    </button>
                  );
                })}
              </div>
              {isExplorer && (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">
                  Remaining Limit: <span className="text-orange-600">{getRemainingQuestions(subject)}</span> / 15 Questions
                </p>
              )}
            </section>

            {/* Step 4: Difficulty */}
            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step 4: Difficulty</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDifficulty(d.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${difficulty === d.value
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                      }`}
                  >
                    <span className={`font-black text-[10px] uppercase tracking-tight ${d.color}`}>{d.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="pt-10 border-t border-slate-50">
            <Button
              onClick={() => handleStartTest(false)}
              disabled={isGenerating || !subject}
              className="w-full bg-slate-900 text-white hover:bg-slate-800 font-black h-20 rounded-[2rem] text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-100 active:scale-[0.98] transition-all"
            >
              Initialize Practice Mission
            </Button>
            <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-8">
              Verified Curriculum Data • 100% Human-Curated Content
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
