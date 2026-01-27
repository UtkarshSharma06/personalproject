import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldX,
  CheckCircle,
  Calendar,
  ChevronRight,
  Target,
  Headphones,
  FileText,
  Mic,
  Award
} from 'lucide-react';
import { useExam } from '@/context/ExamContext';

interface TestResult {
  id: string;
  subject: string;
  topic: string | null;
  difficulty: string;
  total_questions: number;
  score: number | null;
  correct_answers: number | null;
  wrong_answers: number | null;
  skipped_answers: number | null;
  time_taken_seconds: number | null;
  time_limit_minutes: number;
  completed_at: string | null;
  test_type: string | null;
  proctoring_status: string | null;
  status: string;
  date: string;
  type?: string;
  is_manual?: boolean;
  is_full_mock?: boolean;
  overall_band?: number;
}

export default function History() {
  const { user, profile, loading } = useAuth();
  const { activeExam } = useExam();
  const navigate = useNavigate();
  const [tests, setTests] = useState<TestResult[]>([]);
  const isIELTS = activeExam?.id === 'ielts-academic';
  const [activeTab, setActiveTab] = useState<string>(isIELTS ? 'writing' : 'practice');

  useEffect(() => {
    if (isIELTS) {
      setActiveTab('writing');
    } else {
      setActiveTab('practice');
    }
  }, [isIELTS]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTests();
    }
  }, [user]);

  const fetchTests = async () => {
    // 1. Fetch from 'tests' table (standard quizzes)
    const { data: testsData } = await (supabase as any)
      .from('tests')
      .select('*')
      .eq('exam_type', activeExam.id)
      .order('completed_at', { ascending: false });

    // 2. Fetch from 'writing_submissions'
    const { data: writingData } = await (supabase as any)
      .from('writing_submissions')
      .select('*, writing_feedback(overall_score)')
      .order('submitted_at', { ascending: false });

    // 3. Fetch from 'reading_submissions' and 'listening_submissions'
    const { data: readingData } = await (supabase as any)
      .from('reading_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: listeningData } = await (supabase as any)
      .from('listening_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: speakingData } = await (supabase as any)
      .from('speaking_sessions')
      .select('*, speaking_scores(overall_score)')
      .eq('candidate_id', user?.id)
      .order('started_at', { ascending: false });

    // 4. Fetch 'mock_exam_submissions'
    const { data: mockData } = await (supabase as any)
      .from('mock_exam_submissions')
      .select('*, mock_sessions(title)')
      .order('created_at', { ascending: false });

    let unifiedTests: any[] = [];

    if (testsData) {
      unifiedTests = [...unifiedTests, ...testsData.map((t: any) => ({
        ...t,
        type: t.test_type || 'Practice',
        display_raw_score: t.score,
        date: t.completed_at || t.started_at
      }))];
    }

    if (writingData) {
      unifiedTests = [...unifiedTests, ...writingData.map((w: any) => ({
        id: w.id,
        subject: 'IELTS Writing',
        type: 'Writing',
        score: w.writing_feedback?.[0]?.overall_score || null,
        status: w.status,
        date: w.submitted_at || w.created_at,
        is_manual: true
      }))];
    }

    if (readingData) {
      unifiedTests = [...unifiedTests, ...readingData.map((r: any) => ({
        id: r.id,
        subject: 'IELTS Reading',
        type: 'Reading',
        score: r.score,
        status: r.status,
        date: r.created_at,
        is_manual: true
      }))];
    }

    if (listeningData) {
      unifiedTests = [...unifiedTests, ...listeningData.map((l: any) => ({
        id: l.id,
        subject: 'IELTS Listening',
        type: 'Listening',
        score: l.score,
        status: l.status,
        date: l.created_at,
        is_manual: true
      }))];
    }

    if (speakingData) {
      unifiedTests = [...unifiedTests, ...speakingData.map((s: any) => ({
        id: s.id,
        subject: 'IELTS Speaking',
        type: 'Speaking',
        score: s.speaking_scores?.[0]?.overall_score || null,
        status: 'completed',
        date: s.started_at,
        is_manual: true
      }))];
    }

    if (mockData) {
      unifiedTests = [...unifiedTests, ...mockData.map((m: any) => ({
        id: m.id,
        subject: m.mock_sessions?.title || 'IELTS Mock Exam',
        type: 'Full Mock',
        score: m.writing_band ? m.writing_band : null, // Display writing band as overall score for now or overall_band if available
        overall_band: m.overall_band, // Keep explicit overall band
        status: m.status,
        date: m.started_at,
        is_manual: true,
        is_full_mock: true
      }))];
    }

    // Sort all by date
    unifiedTests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Apply Free Tier Limitation
    const isExplorer = profile?.selected_plan === 'explorer';
    if (isExplorer) {
      if (isIELTS) {
        // For IELTS, slice each specific skill tab
        const reading = unifiedTests.filter(t => t.type === 'Reading').slice(0, 2);
        const listening = unifiedTests.filter(t => t.type === 'Listening').slice(0, 2);
        const writing = unifiedTests.filter(t => t.type === 'Writing').slice(0, 2);
        const speaking = unifiedTests.filter(t => t.type === 'Speaking').slice(0, 2);
        const mocks = unifiedTests.filter(t => t.is_full_mock).slice(0, 2);
        setTests([...reading, ...listening, ...writing, ...speaking, ...mocks]);
      } else {
        // Standard split
        const practice = unifiedTests.filter(t => t.type !== 'mock' && !t.subject.includes('IELTS')).slice(0, 2);
        const official = unifiedTests.filter(t => t.type === 'mock' || t.subject.includes('IELTS')).slice(0, 2);
        setTests([...practice, ...official]);
      }
    } else {
      setTests(unifiedTests);
    }
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return '—';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (result: any) => {
    if (result.status === 'pending') {
      return (
        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border border-amber-100 animate-pulse">
          <Clock className="w-2.5 h-2.5" />
          Pending Evaluator
        </span>
      );
    }
    if (result.proctoring_status === 'disqualified') {
      return (
        <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border border-red-100">
          <ShieldX className="w-2.5 h-2.5" />
          Flagged
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border border-emerald-100">
        <CheckCircle className="w-2.5 h-2.5" />
        Completed
      </span>
    );
  };

  const practiceTests = tests.filter(t => t.type !== 'mock' && !t.subject.includes('IELTS'));
  const officialTests = tests.filter(t => t.type === 'mock' || (isIELTS && t.subject.includes('IELTS')));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-muted flex items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-slate-100 dark:border-border border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  const EmptyState = ({ icon, title, href }: { icon: any, title: string, href: string }) => (
    <div className="text-center py-24 bg-white dark:bg-card rounded-[3rem] border-2 border-slate-100 dark:border-border border-b-[8px] shadow-xl shadow-slate-200/50 w-full">
      <div className="w-20 h-20 bg-slate-50 dark:bg-muted rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-100 dark:border-border">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 font-bold mb-10 max-w-xs mx-auto uppercase text-[10px] tracking-widest">No history recorded for this module yet.</p>
      <Button onClick={() => navigate(href)} className="bg-slate-900 text-white hover:bg-slate-800 font-black px-10 py-7 rounded-2xl h-14">
        Start Practicing
      </Button>
    </div>
  );

  const TestCard = ({ result }: { result: any }) => (
    <div
      className="bg-white dark:bg-card p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-slate-100 dark:border-border border-b-[6px] shadow-xl shadow-slate-200/50 hover:border-slate-300 hover:-translate-y-1 hover:shadow-2xl active:border-b-2 active:translate-y-1 transition-all duration-200 cursor-pointer group"
      onClick={() => {
        if (result.is_full_mock) {
          navigate(`/mock-results/${result.id}`);
          return;
        }
        if (result.is_manual) {
          if (result.type === 'Writing') navigate(`/writing/results/${result.id}`);
          if (result.type === 'Reading') navigate(`/reading/results/${result.id}`);
          if (result.type === 'Listening') navigate(`/listening/results/${result.id}`);
          if (result.type === 'Speaking') navigate(`/speaking/${result.id}`);
        } else {
          navigate(`/results/${result.id}`);
        }
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 dark:bg-muted rounded-xl sm:rounded-2xl border border-slate-100 dark:border-border flex items-center justify-center text-lg sm:text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shrink-0">
            {result.subject.includes('Writing') ? '✍️' :
              result.subject.includes('Reading') ? '📖' :
                result.subject.includes('Listening') ? '🎧' :
                  result.subject.includes('Speaking') ? '🗣️' :
                    result.subject === 'Biology' ? '🧬' :
                      result.subject === 'Chemistry' ? '⚗️' :
                        result.subject === 'Mathematics' ? '📐' : '🧠'}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none uppercase text-xs sm:text-sm truncate">{result.subject}</h3>
              <span className="text-[7px] sm:text-[8px] px-1.5 py-0.5 bg-slate-100 dark:bg-muted rounded-md font-black text-slate-400 uppercase shrink-0">{result.type}</span>
            </div>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1.5">
              <Calendar className="w-3 h-3" /> {formatDate(result.date)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-0 pt-3 sm:pt-0 border-slate-50">
          {getStatusBadge(result)}
          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-muted flex items-center justify-center group-hover:translate-x-1 transition-transform sm:ml-2">
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 font-black">
        <div className="bg-slate-50/50 dark:bg-muted/30 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-50/50 dark:border-border/50">
          <p className="text-[7px] sm:text-[8px] text-slate-300 dark:text-slate-500 uppercase tracking-widest mb-1 sm:mb-1.5 leading-none">Band / Score</p>
          <p className={`text-base sm:text-lg tracking-tight leading-none ${result.proctoring_status === 'disqualified'
            ? 'text-red-600'
            : (result.score || 0) >= 70 || (result.type === 'Writing' && result.score >= 7)
              ? 'text-emerald-600'
              : 'text-slate-900 dark:text-slate-100'
            }`}>
            {result.status === 'pending' ? '...' : (result.score === null ? '—' : `${result.score}${result.is_manual ? '' : '%'}`)}
          </p>
        </div>
        <div className="bg-slate-50/50 dark:bg-muted/30 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-50/50 dark:border-border/50">
          <p className="text-[7px] sm:text-[8px] text-slate-300 dark:text-slate-500 uppercase tracking-widest mb-1 sm:mb-1.5 leading-none">Metric</p>
          <p className="text-[9px] sm:text-[10px] text-slate-900 dark:text-slate-100 tracking-tight uppercase leading-none truncate">
            {result.type === 'Writing' ? 'Manual Rev.' :
              result.type === 'Reading' ? 'Auto Grade' :
                result.type === 'Listening' ? 'Auto Grade' : 'Smart Analysis'}
          </p>
        </div>
        <div className="bg-slate-50/50 dark:bg-muted/30 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-50/50 dark:border-border/50 col-span-2 sm:col-span-1">
          <p className="text-[7px] sm:text-[8px] text-slate-300 dark:text-slate-500 uppercase tracking-widest mb-1 sm:mb-1.5 leading-none">Session ID</p>
          <p className="text-[9px] sm:text-[10px] text-slate-900 dark:text-slate-100 tracking-tight truncate leading-none">{result.id.split('-')[0]}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 max-w-5xl">
        <div className="text-center mb-10 sm:mb-16 space-y-4 animate-in fade-in duration-700">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-tight">
            History <span className="text-indigo-600">Logs</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 font-bold tracking-tight">Review your evolution through every mission.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8 sm:mb-12">
            <TabsList className="bg-slate-100 dark:bg-muted p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-200/50 h-12 sm:h-14 w-full sm:w-auto overflow-x-auto overflow-y-hidden no-scrollbar justify-start sm:justify-center">
              {isIELTS ? (
                <>
                  <TabsTrigger value="reading" className="px-4 sm:px-6 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[11px] uppercase tracking-widest data-[state=active]:bg-white dark:bg-card data-[state=active]:text-slate-900 dark:text-slate-100 data-[state=active]:shadow-sm flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <BookOpen className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> Reading
                  </TabsTrigger>
                  <TabsTrigger value="listening" className="px-4 sm:px-6 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[11px] uppercase tracking-widest data-[state=active]:bg-white dark:bg-card data-[state=active]:text-slate-900 dark:text-slate-100 data-[state=active]:shadow-sm flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <Headphones className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> Listening
                  </TabsTrigger>
                  <TabsTrigger value="writing" className="px-4 sm:px-6 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[11px] uppercase tracking-widest data-[state=active]:bg-white dark:bg-card data-[state=active]:text-slate-900 dark:text-slate-100 data-[state=active]:shadow-sm flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <FileText className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> Writing
                  </TabsTrigger>
                  <TabsTrigger value="speaking" className="px-4 sm:px-6 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[11px] uppercase tracking-widest data-[state=active]:bg-white dark:bg-card data-[state=active]:text-slate-900 dark:text-slate-100 data-[state=active]:shadow-sm flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <Mic className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> Speaking
                  </TabsTrigger>
                  <TabsTrigger value="mock-exams" className="px-4 sm:px-6 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[11px] uppercase tracking-widest data-[state=active]:bg-white dark:bg-card data-[state=active]:text-slate-900 dark:text-slate-100 data-[state=active]:shadow-sm flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <Award className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> Mock
                  </TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger value="practice" className="px-6 sm:px-8 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest data-[state=active]:bg-white dark:bg-card data-[state=active]:text-slate-900 dark:text-slate-100 data-[state=active]:shadow-sm shrink-0">
                    Practice ({practiceTests.length})
                  </TabsTrigger>
                  <TabsTrigger value="mock" className="px-6 sm:px-8 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest data-[state=active]:bg-white dark:bg-card data-[state=active]:text-slate-900 dark:text-slate-100 data-[state=active]:shadow-sm shrink-0">
                    Mock Simulations ({officialTests.length})
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </div>

          {isIELTS ? (
            <>
              <TabsContent value="reading" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid gap-4 sm:gap-6">
                  {tests.filter(t => t.type === 'Reading').length > 0 ? (
                    tests.filter(t => t.type === 'Reading').map(test => (
                      <TestCard key={test.id} result={test} />
                    ))
                  ) : (
                    <EmptyState icon={<BookOpen className="w-8 h-8 text-slate-200" />} title="No Reading Sessions" href="/practice" />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="listening" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid gap-4 sm:gap-6">
                  {tests.filter(t => t.type === 'Listening').length > 0 ? (
                    tests.filter(t => t.type === 'Listening').map(test => (
                      <TestCard key={test.id} result={test} />
                    ))
                  ) : (
                    <EmptyState icon={<Headphones className="w-8 h-8 text-slate-200" />} title="No Listening Sessions" href="/practice" />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="writing" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid gap-4 sm:gap-6">
                  {tests.filter(t => t.type === 'Writing').length > 0 ? (
                    tests.filter(t => t.type === 'Writing').map(test => (
                      <TestCard key={test.id} result={test} />
                    ))
                  ) : (
                    <EmptyState icon={<FileText className="w-8 h-8 text-slate-200" />} title="No Writing Evaluations" href="/writing/lobby" />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="speaking" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid gap-4 sm:gap-6">
                  {tests.filter(t => t.type === 'Speaking').length > 0 ? (
                    tests.filter(t => t.type === 'Speaking').map(test => (
                      <TestCard key={test.id} result={test} />
                    ))
                  ) : (
                    <EmptyState icon={<Mic className="w-8 h-8 text-slate-200" />} title="No Speaking Sessions" href="/speaking" />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="mock-exams" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid gap-4 sm:gap-6">
                  {tests.filter(t => t.is_full_mock).length > 0 ? (
                    tests.filter(t => t.is_full_mock).map(test => (
                      <TestCard key={test.id} result={test} />
                    ))
                  ) : (
                    <EmptyState icon={<Award className="w-8 h-8 text-slate-200" />} title="No Mock Exams" href="/mock-exams" />
                  )}
                </div>
              </TabsContent>
            </>
          ) : (
            <>
              <TabsContent value="practice" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {practiceTests.length > 0 ? (
                  <div className="grid gap-4 sm:gap-6">
                    {practiceTests.map(test => (
                      <TestCard key={test.id} result={test} />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={<Target className="w-8 h-8 text-slate-200" />} title="No Practice Missions" href="/practice" />
                )}
              </TabsContent>

              <TabsContent value="mock" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {officialTests.length > 0 ? (
                  <div className="grid gap-4 sm:gap-6">
                    {officialTests.map(test => (
                      <TestCard key={test.id} result={test} />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={<FileText className="w-8 h-8 text-slate-200" />} title="No Mock Simulations" href="/mock-exams" />
                )}
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Free Tier Upgrade Prompt */}
        {profile?.selected_plan === 'explorer' && (
          <div className="mt-12 p-8 sm:p-12 rounded-[3rem] bg-indigo-600 shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Unlock Full Logs</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase leading-none">
                  Viewing Limited <span className="text-indigo-200 text-lg sm:text-xl"> (2 Recent)</span>
                </h3>
                <p className="text-sm font-medium text-indigo-100 max-w-sm leading-relaxed">
                  Upgrade to Exam Prep or Global plan to see your entire performance history across all subjects.
                </p>
              </div>
              <Button
                onClick={() => navigate('/pricing')}
                className="h-16 px-10 rounded-2xl bg-white text-indigo-600 hover:bg-slate-50 font-black text-xs uppercase tracking-widest shadow-xl group/btn shrink-0"
              >
                Upgrade Now
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
