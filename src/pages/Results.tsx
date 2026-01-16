import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import DiagramRenderer from '@/components/DiagramRenderer';
import AITutor from '@/components/AITutor';
import Layout from '@/components/Layout';
import {
  Brain,
  ArrowLeft,
  CheckCircle,
  XCircle,
  MinusCircle,
  Clock,
  Target,
  TrendingUp,
  Home,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ShieldX,
  ShieldAlert,
  Timer,
  Sparkles,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { useExam } from '@/context/ExamContext';
import { EXAMS } from '@/config/exams';
import { usePlanAccess } from '@/hooks/usePlanAccess';
import { UpgradeModal } from '@/components/UpgradeModal';

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
  explanation: string | null;
  topic: string | null;
  difficulty: string;
  diagram: DiagramData | null;
  time_spent_seconds: number | null;
}

interface TestResult {
  id: string;
  subject: string;
  topic: string | null;
  difficulty: string;
  total_questions: number;
  score: number;
  correct_answers: number;
  wrong_answers: number;
  skipped_answers: number;
  time_taken_seconds: number;
  time_limit_minutes: number;
  completed_at: string;
  test_type: string | null;
  exam_type: string | null;
  proctoring_status: string | null;
  violation_count: number | null;
}

interface AIInsights {
  weakTopics?: string[];
  timeManagement?: string;
  accuracyTrends?: string;
  suggestedFocusAreas?: string[];
  overallAdvice?: string;
  content?: string;
}

export default function Results() {
  const { testId } = useParams<{ testId: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { activeExam } = useExam();

  const [test, setTest] = useState<TestResult | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [rawScore, setRawScore] = useState<number | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const { isExplorer } = usePlanAccess();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (testId && user) {
      fetchResults();
    }
  }, [testId, user]);

  const fetchResults = async () => {
    const { data: testData } = await (supabase as any)
      .from('tests')
      .select('*')
      .eq('id', testId)
      .maybeSingle();

    if (testData) {
      setTest(testData as any as TestResult);
    }

    const { data: questionsData } = await (supabase as any)
      .from('questions')
      .select('*')
      .eq('test_id', testId)
      .order('question_number');

    if (questionsData && testData) {
      const mappedQuestions = questionsData.map((q: any) => ({
        ...q,
        options: q.options as string[],
        diagram: q.diagram as unknown as DiagramData | null,
      }));
      setQuestions(mappedQuestions);

      const examConfig = EXAMS[(testData as any).exam_type || 'cent-s-prep'];
      if (examConfig) {
        let raw = 0;
        mappedQuestions.forEach((q: any) => {
          if (q.user_answer === null) raw += examConfig.scoring.skipped;
          else if (q.user_answer === q.correct_index) raw += examConfig.scoring.correct;
          else raw += examConfig.scoring.incorrect;
        });
        setRawScore(Number(raw.toFixed(1)));
      }
    }
  };

  const generateInsights = async () => {
    if (!test || !questions.length) return;
    setIsLoadingInsights(true);

    try {
      const topicPerformance: Record<string, { correct: number; total: number }> = {};
      const timeByQuestion: number[] = [];

      questions.forEach(q => {
        const topic = q.topic || 'General';
        if (!topicPerformance[topic]) topicPerformance[topic] = { correct: 0, total: 0 };
        topicPerformance[topic].total++;
        if (q.user_answer === q.correct_index) topicPerformance[topic].correct++;
        if (q.time_spent_seconds) timeByQuestion.push(q.time_spent_seconds);
      });

      const avgTime = timeByQuestion.length > 0 ? timeByQuestion.reduce((a, b) => a + b, 0) / timeByQuestion.length : 0;

      const { data, error } = await supabase.functions.invoke('generate-insights', {
        body: {
          examName: activeExam.name,
          subject: test.subject,
          score: test.score,
          topicPerformance,
          avgTimePerQuestion: avgTime,
          totalQuestions: test.total_questions,
          timeTaken: test.time_taken_seconds,
          timeLimit: test.time_limit_minutes * 60,
        },
      });

      if (error) throw error;
      if (data?.insights) setInsights(data.insights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-rose-600';
  };

  if (loading || !test) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-muted flex items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-slate-100 dark:border-border border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  const isDisqualified = test.proctoring_status === 'disqualified';

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 max-w-5xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Header Navigation */}
        <div className="flex items-center gap-4 mb-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="rounded-xl border border-slate-100 dark:border-border hover:bg-white dark:bg-card hover:border-slate-900 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">Mission Summary</h1>
        </div>

        {/* Disqualification Banner */}
        {isDisqualified && (
          <div className="mb-10 p-8 rounded-[2rem] bg-rose-50 border border-rose-100 flex items-start gap-3 shadow-sm animate-in zoom-in-95 duration-500">
            <ShieldX className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <h3 className="font-black text-rose-600 uppercase tracking-widest text-[11px] mb-1">Mission Terminated</h3>
              <p className="text-sm font-bold text-rose-900/60 leading-relaxed">
                This simulation was invalidated due to proctoring violations.
                {test.violation_count && ` (${test.violation_count} instances recorded)`}
              </p>
            </div>
          </div>
        )}

        {/* Hero Score Card (Sleek Modern) */}
        <div className="bg-white dark:bg-card p-12 rounded-[3.5rem] border-2 border-slate-100 dark:border-border border-b-[8px] shadow-xl shadow-slate-200/50 relative overflow-hidden group mb-12">
          <div className="absolute top-0 right-0 w-80 h-80 bg-slate-50 dark:bg-muted rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 transition-transform duration-1000 group-hover:scale-125" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50/50 rounded-full border border-indigo-100/50 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.2em]">{test.exam_type?.split('-')[0]} Performance Profile</span>
            </div>

            <div className={`text-8xl font-black tracking-tighter mb-4 ${isDisqualified ? 'text-slate-200' : getScoreColor(test.score)}`}>
              {isDisqualified ? '—' : `${test.score}%`}
            </div>

            {!isDisqualified && rawScore !== null && (
              <div className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
                Raw Yield: <span className="text-slate-900 dark:text-slate-100 dark:text-slate-100">{rawScore}</span> Points
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
              <span>{test.subject}</span>
              <span className="opacity-30">•</span>
              <span className="capitalize">{test.difficulty} Focus</span>
              {test.test_type === 'mock' && (
                <>
                  <span className="opacity-30">•</span>
                  <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[8px]">Official Simulation</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'SUCCESS', value: test.correct_answers, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50/50' },
            { label: 'FAILED', value: test.wrong_answers, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50/50' },
            { label: 'SKIPPED', value: test.skipped_answers, icon: MinusCircle, color: 'text-slate-400', bg: 'bg-slate-50/50' },
            { label: 'TOTAL TIME', value: formatTime(test.time_taken_seconds), icon: Timer, color: 'text-indigo-600', bg: 'bg-indigo-50/50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-card p-8 rounded-[2.5rem] border-2 border-slate-100 dark:border-border border-b-[6px] shadow-xl shadow-slate-200/50 flex flex-col items-center text-center group hover:border-slate-300 hover:shadow-2xl hover:-translate-y-1 active:border-b-2 active:translate-y-1 transition-all duration-200">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-6 opacity-40 group-hover:opacity-100 transition-opacity`} />
              <p className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none mb-2">{stat.value}</p>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Section Breakdown (Official Only) */}
        {test.test_type === 'mock' && activeExam && (
          <div className="bg-white dark:bg-card p-12 rounded-[3.5rem] border-2 border-slate-100 dark:border-border border-b-[8px] shadow-xl shadow-slate-200/50 mb-12">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">System Breakdown</h3>
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Syllabus Mapping</span>
            </div>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              {(() => {
                let currentStart = 0;
                return activeExam.sections.map((section) => {
                  const sectionQs = questions.slice(currentStart, currentStart + section.questionCount);
                  currentStart += section.questionCount;
                  const correct = sectionQs.filter(q => q.user_answer === q.correct_index).length;
                  const accuracy = sectionQs.length > 0 ? Math.round((correct / sectionQs.length) * 100) : 0;
                  return (
                    <div key={section.name} className="group">
                      <div className="flex items-center justify-between mb-3 font-black text-[11px] uppercase tracking-tight">
                        <span className="text-slate-400 group-hover:text-slate-900 dark:text-slate-100 transition-colors uppercase">{section.name}</span>
                        <span className={accuracy >= 70 ? 'text-emerald-600' : accuracy >= 50 ? 'text-orange-600' : 'text-rose-600'}>
                          {accuracy}% <span className="text-slate-200 ml-1">({correct}/{section.questionCount})</span>
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-50 dark:bg-muted rounded-full overflow-hidden border border-slate-100 dark:border-border p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${accuracy >= 70 ? 'bg-emerald-500' : accuracy >= 50 ? 'bg-orange-500' : 'bg-rose-500'}`}
                          style={{ width: `${accuracy}%` }}
                        />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* AI Insights & Review */}
        <div className="space-y-12">
          {/* Insights Placeholder/Action */}
          <div className="bg-indigo-900 p-12 rounded-[3.5rem] relative overflow-hidden group border-b-[8px] border-indigo-950 active:border-b-0 active:translate-y-2 transition-all duration-200">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent)] opacity-50" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-black text-white tracking-tight mb-2">Refine Strategy</h3>
                <p className="text-indigo-200 font-bold text-sm max-w-sm">Generate AI-driven insights to analyze your weakest areas and time management.</p>
              </div>
              {!insights ? (
                <Button
                  onClick={generateInsights}
                  disabled={isLoadingInsights}
                  className="bg-white dark:bg-card text-indigo-900 hover:bg-slate-50 dark:bg-muted font-black h-16 px-10 rounded-2xl active:scale-95 transition-all shadow-xl"
                >
                  {isLoadingInsights ? <Loader2 className="w-5 h-5 animate-spin" /> : 'UNLOCK INSIGHTS'}
                </Button>
              ) : (
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-white font-bold text-xs uppercase tracking-widest">
                  Analysis Complete
                </div>
              )}
            </div>
          </div>

          {/* Answer Key Review */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Mission Log: Item Review</h3>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Post-Mission Analysis</span>
            </div>

            <div className="space-y-4">
              {questions.map((question) => {
                const isCorrect = question.user_answer === question.correct_index;
                const isSkipped = question.user_answer === null;
                const isExpanded = expandedQuestion === question.id;

                return (
                  <div key={question.id} className="bg-white dark:bg-card rounded-[2rem] border-2 border-slate-100 dark:border-border border-b-[6px] overflow-hidden shadow-lg shadow-slate-200/50 hover:border-slate-300 hover:-translate-y-1 hover:shadow-2xl active:border-b-2 active:translate-y-1 transition-all duration-200 group">
                    <button
                      onClick={() => setExpandedQuestion(isExpanded ? null : question.id)}
                      className="w-full p-6 flex items-center justify-between text-left group"
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${isSkipped ? 'bg-slate-50 dark:bg-muted border-slate-100 dark:border-border text-slate-300' :
                          isCorrect ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                            'bg-rose-50 border-rose-100 text-rose-600'
                          }`}>
                          {isSkipped ? <MinusCircle className="w-4 h-4" /> :
                            isCorrect ? <CheckCircle className="w-4 h-4" /> :
                              <XCircle className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-slate-100 text-[11px] uppercase tracking-widest leading-none mb-2">Item #{question.question_number}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            {question.topic} <span className="opacity-30">•</span> {question.time_spent_seconds}s Spent
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-muted flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-8 pb-10 pt-6 border-t border-slate-50 animate-in slide-in-from-top-4 duration-300">
                        {question.diagram && <DiagramRenderer diagram={question.diagram} className="mb-8" />}

                        <p className="text-slate-800 font-bold mb-8 leading-relaxed text-sm">{question.question_text}</p>

                        <div className="grid gap-3 mb-10">
                          {question.options.map((option, index) => {
                            const isUserAns = index === question.user_answer;
                            const isCorrectAns = index === question.correct_index;
                            return (
                              <div key={index} className={`p-5 rounded-2xl border flex items-center gap-4 transition-all ${isCorrectAns ? 'bg-emerald-50 border-emerald-200' :
                                isUserAns ? 'bg-rose-50 border-rose-200' :
                                  'bg-slate-50 dark:bg-muted border-slate-50 border-transparent'
                                }`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${isCorrectAns ? 'bg-emerald-600 text-white' :
                                  isUserAns ? 'bg-rose-600 text-white' :
                                    'bg-white dark:bg-card text-slate-400 border border-slate-100'
                                  }`}>
                                  {String.fromCharCode(65 + index)}
                                </div>
                                <span className={`text-sm font-bold ${isCorrectAns ? 'text-emerald-900' : isUserAns ? 'text-rose-900' : 'text-slate-500'}`}>
                                  {option}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {question.explanation && (
                          <div className="bg-slate-900 p-8 rounded-[2rem] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                              <Brain className="w-12 h-12 text-white" />
                            </div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Deep Logic Explanation</p>
                            {isExplorer ? (
                              <div className="space-y-4">
                                <p className="text-xs text-slate-400 font-medium italic">Detailed AI explanations are exclusive to PRO and ELITE plans.</p>
                                <Button
                                  onClick={() => setIsUpgradeModalOpen(true)}
                                  size="sm"
                                  className="h-8 bg-white text-indigo-900 hover:bg-indigo-50 font-black text-[9px] uppercase tracking-widest rounded-lg"
                                >
                                  Unlock Now
                                </Button>
                              </div>
                            ) : (
                              <p className="text-xs text-slate-300 font-medium leading-relaxed">{question.explanation}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-10">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="flex-1 h-16 rounded-2xl border border-slate-100 dark:border-border font-black text-[10px] uppercase tracking-widest hover:border-slate-900 transition-all"
            >
              <Home className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Button>
            <Button
              onClick={() => navigate('/practice')}
              className="flex-1 h-16 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Launch New Mission
            </Button>
          </div>
        </div>
      </div>
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        title="Unlock AI Explanations"
        description="Upgrade to PRO to access detailed, step-by-step AI explanations for every question and optimize your study strategy."
        feature="Deep Logic Explanations"
      />
    </Layout>
  );
}
