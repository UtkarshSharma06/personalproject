import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
    Plus,
    Trash2,
    Database,
    Zap,
    FileJson,
    X,
    CheckCircle2,
    Loader2,
    Search,
    Brain,
    Rocket,
    Edit
} from 'lucide-react';
import { EXAMS } from '@/config/exams';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, VisuallyHidden } from "@/components/ui/dialog";
import { MathText } from '@/components/MathText';
import { cn } from '@/lib/utils';

export default function PracticeManager() {
    const { toast } = useToast();
    const [selectedExamId, setSelectedExamId] = useState<string>(Object.keys(EXAMS)[0]);
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [selectedTopic, setSelectedTopic] = useState<string>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [questions, setQuestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [importMode, setImportMode] = useState<'form' | 'json'>('form');
    const [jsonInput, setJsonInput] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState({
        question_text: '',
        options: ['', '', '', '', ''],
        correct_index: 0,
        explanation: '',
        difficulty: 'medium',
        topic: ''
    });

    const activeExam = EXAMS[selectedExamId];
    const subjects = activeExam?.sections.map(s => s.name) || [];
    const availableTopics = activeExam?.syllabus[selectedSubject]?.map(t => t.name) || [];

    useEffect(() => {
        if (subjects.length > 0 && !selectedSubject) {
            setSelectedSubject(subjects[0]);
        }
    }, [selectedExamId, subjects]);

    useEffect(() => {
        setSelectedTopic('all');
    }, [selectedSubject]);

    useEffect(() => {
        if (selectedExamId && selectedSubject) {
            fetchQuestions();
        }
    }, [selectedExamId, selectedSubject, selectedTopic, selectedDifficulty]);

    const fetchQuestions = async () => {
        setIsLoading(true);
        let query = (supabase as any)
            .from('practice_questions')
            .select('*')
            .eq('exam_type', selectedExamId)
            .eq('subject', selectedSubject);

        if (selectedTopic !== 'all') {
            query = query.eq('topic', selectedTopic);
        }

        if (selectedDifficulty !== 'all') {
            query = query.eq('difficulty', selectedDifficulty);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            toast({ title: "Error fetching questions", description: error.message, variant: "destructive" });
        } else {
            setQuestions(data || []);
        }
        setIsLoading(false);
    };

    const handleAddQuestion = async () => {
        if (!currentQuestion.question_text.trim() || currentQuestion.options.some(opt => !opt.trim())) {
            toast({ title: "Incomplete Question", description: "Please fill in all fields.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        const finalTopic = currentQuestion.topic || (selectedTopic !== 'all' ? selectedTopic : availableTopics[0]);
        const finalDifficulty = currentQuestion.difficulty || (selectedDifficulty !== 'all' ? selectedDifficulty : "medium");

        const dataToInsert = {
            exam_type: selectedExamId,
            subject: selectedSubject,
            ...currentQuestion,
            topic: finalTopic,
            difficulty: finalDifficulty
        };

        if (editingId) {
            const { error } = await (supabase as any)
                .from('practice_questions')
                .update(dataToInsert)
                .eq('id', editingId);

            if (error) {
                toast({ title: "Update Failed", description: error.message, variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Question updated." });
                setQuestions(questions.map(q => q.id === editingId ? { ...q, ...dataToInsert } : q));
                closeModal();
            }
        } else {
            // Processing intelligence injection

            const { error } = await (supabase as any)
                .from('practice_questions')
                .insert([dataToInsert]);

            if (error) {
                toast({ title: "Save Failed", description: error.message, variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Question added to bank." });
                setQuestions([{ ...currentQuestion, topic: finalTopic, difficulty: finalDifficulty, id: Math.random().toString() }, ...questions]); // Optimistic update of sorts, basically just putting it at top, assuming id logic handled by fetch usually but here we mock it or wait for fetch. actually fetchQuestions is called.
                closeModal();
            }
        }
        fetchQuestions();
        setIsSubmitting(false);
    };

    const closeModal = () => {
        setCurrentQuestion({
            question_text: '',
            options: ['', '', '', '', ''],
            correct_index: 0,
            explanation: '',
            difficulty: 'medium',
            topic: ''
        });
        setEditingId(null);
        setIsAddModalOpen(false);
    };

    const handleEditStart = (q: any) => {
        setCurrentQuestion({
            question_text: q.question_text,
            options: q.options || ['', '', '', '', ''],
            correct_index: q.correct_index,
            explanation: q.explanation || '',
            difficulty: q.difficulty,
            topic: q.topic || ''
        });
        setEditingId(q.id);
        setImportMode('form');
        setIsAddModalOpen(true);
    };

    const handleBulkImport = async () => {
        try {
            const cleanedInput = jsonInput.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
            let parsed = JSON.parse(cleanedInput);

            if (!Array.isArray(parsed) && parsed.questions) parsed = parsed.questions;
            if (!Array.isArray(parsed)) throw new Error("Input must be a JSON array.");

            const validated = parsed.map((q: any) => ({
                exam_type: selectedExamId,
                subject: selectedSubject,
                question_text: q.question_text || q.question || q.text || "",
                options: Array.isArray(q.options) ? q.options : ["", "", "", "", ""],
                correct_index: q.correct_index ?? (q.correctIndex ?? 0),
                explanation: q.explanation || "",
                difficulty: q.difficulty || (selectedDifficulty !== 'all' ? selectedDifficulty : "medium"),
                topic: q.topic || (selectedTopic !== 'all' ? selectedTopic : "")
            }));

            // Executing bulk intel deployment

            setIsSubmitting(true);
            const { error } = await (supabase as any)
                .from('practice_questions')
                .insert(validated);

            if (error) throw error;

            toast({ title: "Bulk Import Success", description: `Added ${validated.length} questions to ${selectedSubject}${selectedTopic !== 'all' ? ` (${selectedTopic})` : ''}.` });
            setJsonInput('');
            setIsAddModalOpen(false);
            fetchQuestions();
        } catch (err: any) {
            toast({ title: "Import Failed", description: err.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        const { error } = await (supabase as any)
            .from('practice_questions')
            .delete()
            .eq('id', id);

        if (error) {
            toast({ title: "Delete Failed", description: error.message, variant: "destructive" });
        } else {
            setQuestions(questions.filter(q => q.id !== id));
            toast({ title: "Question Removed" });
        }
    };

    const handleClearAll = async () => {
        if (!confirm(`Wipe all ${questions.length} questions for ${selectedSubject}?`)) return;

        setIsSubmitting(true);
        const { error } = await (supabase as any)
            .from('practice_questions')
            .delete()
            .eq('exam_type', selectedExamId)
            .eq('subject', selectedSubject);

        if (error) {
            toast({ title: "Clear Failed", description: error.message, variant: "destructive" });
        } else {
            setQuestions([]);
            toast({ title: "Bank Cleared", description: `All items for ${selectedSubject} removed.` });
        }
        setIsSubmitting(false);
    };

    return (
        <div className="space-y-8">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6 items-end justify-between bg-white/50 p-6 rounded-3xl border border-slate-100 dark:border-border dark:border-border">
                <div className="flex flex-wrap gap-6 items-end">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Exam</Label>
                        <select
                            value={selectedExamId}
                            onChange={(e) => {
                                setSelectedExamId(e.target.value);
                                setSelectedSubject('');
                            }}
                            className="h-12 w-48 rounded-xl border-slate-200 dark:border-border bg-white dark:bg-card text-xs font-bold px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                        >
                            {Object.values(EXAMS).map(exam => (
                                <option key={exam.id} value={exam.id}>{exam.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject domain</Label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="h-12 w-48 rounded-xl border-slate-200 dark:border-border bg-white dark:bg-card text-xs font-bold px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                        >
                            {subjects.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Topic filtering</Label>
                        <select
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                            className="h-12 w-48 rounded-xl border-slate-200 dark:border-border bg-white dark:bg-card text-xs font-bold px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                        >
                            <option value="all">All Topics</option>
                            {availableTopics.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Grade Level</Label>
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="h-12 w-48 rounded-xl border-slate-200 dark:border-border bg-white dark:bg-card text-xs font-bold px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                        >
                            <option value="all">Mixed Levels</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3">
                    {questions.length > 0 && (
                        <Button
                            variant="ghost"
                            onClick={handleClearAll}
                            className="h-12 px-6 rounded-xl text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-100 transition-all"
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Wipe Bank
                        </Button>
                    )}
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 active:scale-95 transition-all">
                                <Plus className="w-4 h-4 mr-2" /> Add Intel Point
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-0 border-none shadow-2xl">
                            <DialogHeader className="p-0">
                                <VisuallyHidden>
                                    <DialogTitle>New Question Entry</DialogTitle>
                                </VisuallyHidden>
                                <div className="p-8 border-b border-slate-100 dark:border-border flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                                            <Database className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tight uppercase">{editingId ? 'Edit Question Analysis' : 'New Question Entry'}</h2>
                                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em]">Deploying to {selectedSubject} ({activeExam.name})</p>
                                        </div>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="p-10 space-y-8">
                                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                                    <button
                                        onClick={() => setImportMode('form')}
                                        className={cn(
                                            "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                                            importMode === 'form' ? "bg-white dark:bg-card text-indigo-600 shadow-md" : "text-slate-400"
                                        )}
                                    >Step-by-Step Form</button>
                                    <button
                                        onClick={() => setImportMode('json')}
                                        className={cn(
                                            "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                                            importMode === 'json' ? "bg-white dark:bg-card text-indigo-600 shadow-md" : "text-slate-400"
                                        )}
                                    >JSON Bulk Uplink</button>
                                </div>

                                {importMode === 'form' ? (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Logical Topic</Label>
                                                <select
                                                    value={currentQuestion.topic || (selectedTopic !== 'all' ? selectedTopic : availableTopics[0])}
                                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, topic: e.target.value })}
                                                    className="w-full h-14 rounded-2xl border border-slate-100 dark:border-border bg-white dark:bg-card px-4 text-xs font-bold uppercase tracking-widest"
                                                >
                                                    {availableTopics.map(t => (
                                                        <option key={t} value={t}>{t}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Difficulty Grade</Label>
                                                <select
                                                    value={currentQuestion.difficulty || (selectedDifficulty !== 'all' ? selectedDifficulty : "medium")}
                                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, difficulty: e.target.value })}
                                                    className="w-full h-14 rounded-2xl border border-slate-100 dark:border-border bg-white dark:bg-card px-4 text-xs font-bold uppercase tracking-widest"
                                                >
                                                    <option value="easy">Easy</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="hard">Hard</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Question Content (Intel)</Label>
                                            <Textarea
                                                placeholder="Ask the candidate..."
                                                className="min-h-[120px] rounded-2xl border-slate-100 dark:border-border text-sm font-medium p-6 resize-none"
                                                value={currentQuestion.question_text}
                                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Response Options (Assign Truth)</Label>
                                            <div className="space-y-3">
                                                {currentQuestion.options.map((opt, idx) => (
                                                    <div key={idx} className="flex gap-4">
                                                        <button
                                                            onClick={() => setCurrentQuestion({ ...currentQuestion, correct_index: idx })}
                                                            className={cn(
                                                                "w-12 h-12 rounded-xl border flex items-center justify-center font-black text-xs transition-all",
                                                                currentQuestion.correct_index === idx ? "bg-emerald-500 border-transparent text-white shadow-lg" : "bg-white dark:bg-card border-slate-100 dark:border-border text-slate-400"
                                                            )}
                                                        >{String.fromCharCode(65 + idx)}</button>
                                                        <Input
                                                            placeholder={`Option ${String.fromCharCode(65 + idx)} content...`}
                                                            className="h-12 rounded-xl border-slate-100 dark:border-border text-sm font-bold"
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

                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Explanation Archive</Label>
                                            <Textarea
                                                placeholder="Provide the reasoning for the correct response..."
                                                className="h-24 rounded-2xl border-slate-100 dark:border-border text-sm font-medium p-6 resize-none"
                                                value={currentQuestion.explanation}
                                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                                            />
                                        </div>

                                        <Button
                                            onClick={handleAddQuestion}
                                            disabled={isSubmitting}
                                            className="w-full h-16 rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : (editingId ? "Update Intelligence" : "Authorize Injection")}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100 text-[11px] font-bold text-indigo-900 italic">
                                            <strong>Developer Protocol:</strong> Paste an array of question objects. Matches AI output schema for instant synchronization.
                                        </div>
                                        <Textarea
                                            placeholder='[{"question_text": "...", "options": ["A","B","C","D","E"], "correct_index": 0}]'
                                            className="h-[300px] rounded-[2rem] border-slate-100 dark:border-border font-mono text-xs p-8"
                                            value={jsonInput}
                                            onChange={(e) => setJsonInput(e.target.value)}
                                        />
                                        <Button
                                            onClick={handleBulkImport}
                                            disabled={!jsonInput.trim() || isSubmitting}
                                            className="w-full h-16 rounded-[2rem] bg-indigo-950 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Deploy Bulk Intel"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* List */}
            <div className="relative">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-slate-300">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Accessing Secure Archive...</p>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-slate-50 dark:bg-muted rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-border text-slate-400">
                        <Rocket className="w-16 h-16 mb-6 opacity-20" />
                        <p className="text-sm font-bold">No intel detected for this sector.</p>
                        <p className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-50">Awaiting Manual Deployment</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {questions.map((q) => (
                            <div key={q.id} className="group bg-white dark:bg-card p-8 rounded-[2.5rem] border border-slate-100 dark:border-border hover:border-indigo-200 transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditStart(q)}
                                        className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors flex items-center justify-center mb-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteQuestion(q.id)}
                                        className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors flex items-center justify-center"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 mb-6">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                        q.difficulty === 'easy' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                            q.difficulty === 'hard' ? "bg-rose-50 text-rose-600 border border-rose-100" :
                                                "bg-orange-50 text-orange-600 border border-orange-100"
                                    )}>
                                        {q.difficulty}
                                    </span>
                                    {q.topic && (
                                        <span className="px-3 py-1 rounded-full bg-slate-50 dark:bg-muted text-slate-400 text-[9px] font-black uppercase tracking-widest border border-slate-100 dark:border-border dark:border-border">
                                            {q.topic}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="text-sm font-bold text-slate-800 leading-relaxed mb-6">
                                        <MathText content={q.question_text} />
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                        {q.options.map((opt: string, i: number) => (
                                            <div key={i} className={cn(
                                                "p-4 rounded-xl text-xs font-bold border flex items-center gap-3",
                                                i === q.correct_index
                                                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                                    : "bg-slate-50/50 border-slate-100 dark:border-border text-slate-500"
                                            )}>
                                                <div className={cn(
                                                    "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black",
                                                    i === q.correct_index ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
                                                )}>
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                                <MathText content={opt} />
                                            </div>
                                        ))}
                                    </div>

                                    {q.explanation && (
                                        <div className="mt-8 pt-8 border-t border-slate-50">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Internal Logic</div>
                                            <div className="text-[11px] font-medium text-slate-500 leading-relaxed italic">
                                                <MathText content={q.explanation} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
