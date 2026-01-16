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
    ChevronRight,
    Video,
    BookOpen,
    Sparkles,
    Loader2,
    ChevronLeft,
    Database,
    Layers,
    Pencil,
    Eye,
    EyeOff,
    ArrowUp,
    ArrowDown,
    Save,
    X,
    Download,
    HelpCircle,
    ListChecks
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MathText } from '@/components/MathText';

type Level = 'exams' | 'courses' | 'topics' | 'units' | 'subunits' | 'content';

export default function LearningManager() {
    const { toast } = useToast();
    const [currentLevel, setCurrentLevel] = useState<Level>('exams');
    const [path, setPath] = useState<{ id: string; name: string; level: Level }[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [newItemName, setNewItemName] = useState('');
    const [newItemDesc, setNewItemDesc] = useState('');
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [newEmbedCode, setNewEmbedCode] = useState('');
    const [newResourceUrl, setNewResourceUrl] = useState('');
    const [newResourceTitle, setNewResourceTitle] = useState('');
    const [newItemContentType, setNewItemContentType] = useState<'video' | 'article'>('video');
    const [newItemTextContent, setNewItemTextContent] = useState('');

    // Edit states
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editVideoUrl, setEditVideoUrl] = useState('');
    const [editEmbedCode, setEditEmbedCode] = useState('');
    const [editResourceUrl, setEditResourceUrl] = useState('');
    const [editResourceTitle, setEditResourceTitle] = useState('');
    const [editContentType, setEditContentType] = useState<'video' | 'article'>('video');
    const [editTextContent, setEditTextContent] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Quiz Management States
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
    const [activeQuizParent, setActiveQuizParent] = useState<any>(null);
    const [activeQuizLevel, setActiveQuizLevel] = useState<Level | null>(null);
    const [newQuizQuestion, setNewQuizQuestion] = useState({
        text: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        explanation: ''
    });
    const [editingQuizQuestion, setEditingQuizQuestion] = useState<any>(null);
    const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
    const [pastedJson, setPastedJson] = useState('');

    useEffect(() => {
        fetchData();
    }, [currentLevel, path]);

    const fetchQuizQuestions = async (parentId: string, level: Level) => {
        let field = '';
        if (level === 'topics') field = 'topic_id';
        else if (level === 'units') field = 'unit_id';
        else if (level === 'subunits') field = 'subunit_id';

        const { data, error } = await (supabase as any)
            .from('learning_quiz_questions')
            .select('*')
            .eq(field, parentId)
            .order('order_index');

        if (!error) setQuizQuestions(data || []);
    };

    const handleOpenQuizManager = (item: any) => {
        setActiveQuizParent(item);
        setActiveQuizLevel(currentLevel);
        fetchQuizQuestions(item.id, currentLevel);
        setIsQuizModalOpen(true);
    };

    const handleAddQuizQuestion = async () => {
        if (!activeQuizParent || !activeQuizLevel) return;

        let field = '';
        if (activeQuizLevel === 'topics') field = 'topic_id';
        else if (activeQuizLevel === 'units') field = 'unit_id';
        else if (activeQuizLevel === 'subunits') field = 'subunit_id';

        if (editingQuizQuestion) {
            const { error } = await (supabase as any).from('learning_quiz_questions').update({
                question_text: newQuizQuestion.text,
                options: newQuizQuestion.options,
                correct_index: newQuizQuestion.correctIndex,
                explanation: newQuizQuestion.explanation,
            }).eq('id', editingQuizQuestion.id);

            if (!error) {
                toast({ title: 'Success', description: 'Question updated.' });
                setNewQuizQuestion({ text: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' });
                setEditingQuizQuestion(null);
                fetchQuizQuestions(activeQuizParent.id, activeQuizLevel);
            }
        } else {
            const { error } = await (supabase as any).from('learning_quiz_questions').insert({
                [field]: activeQuizParent.id,
                question_text: newQuizQuestion.text,
                options: newQuizQuestion.options,
                correct_index: newQuizQuestion.correctIndex,
                explanation: newQuizQuestion.explanation,
                order_index: quizQuestions.length
            });

            if (!error) {
                toast({ title: 'Success', description: 'Question added.' });
                setNewQuizQuestion({ text: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' });
                fetchQuizQuestions(activeQuizParent.id, activeQuizLevel);
            }
        }
    };

    const handleEditQuizQuestion = (q: any) => {
        setEditingQuizQuestion(q);
        setNewQuizQuestion({
            text: q.question_text,
            options: q.options || ['', '', '', ''],
            correctIndex: q.correct_index,
            explanation: q.explanation || ''
        });
    };

    const handleDeleteQuizQuestion = async (id: string) => {
        const { error } = await (supabase as any).from('learning_quiz_questions').delete().eq('id', id);
        if (!error) {
            setQuizQuestions(prev => prev.filter(q => q.id !== id));
            toast({ title: 'Deleted', description: 'Question removed.' });
        }
    };

    const bulkImportQuestions = async (json: any[]) => {
        if (!Array.isArray(json)) throw new Error("JSON must be an array of questions.");

        let field = '';
        if (activeQuizLevel === 'topics') field = 'topic_id';
        else if (activeQuizLevel === 'units') field = 'unit_id';
        else if (activeQuizLevel === 'subunits') field = 'subunit_id';

        const payload = json.map((q: any, idx: number) => {
            // Robustly identify question text
            const question_text = q.question_text || q.question || q.text || '';

            // Robustly identify options
            let options: string[] = [];
            if (Array.isArray(q.options)) {
                options = q.options;
            } else if (typeof q.options === 'object' && q.options !== null) {
                // Map keys A, B, C, D to values
                const keys = Object.keys(q.options).sort();
                options = keys.map(k => q.options[k]);
            }

            // Robustly identify correct index
            let correct_index = 0;
            const answerKey = q.correct_index !== undefined ? 'correct_index' : (q.answer !== undefined ? 'answer' : (q.correct_answer !== undefined ? 'correct_answer' : null));

            if (answerKey === 'correct_index' && typeof q.correct_index === 'number') {
                correct_index = q.correct_index;
            } else if (answerKey) {
                const ans = String(q[answerKey]).trim().toUpperCase();
                // Map "A" -> 0, "B" -> 1, etc.
                if (ans.length === 1 && ans >= 'A' && ans <= 'Z') {
                    correct_index = ans.charCodeAt(0) - 65;
                } else {
                    // Try to match by text content
                    const foundIdx = options.findIndex(opt => String(opt).trim() === String(q[answerKey]).trim());
                    if (foundIdx !== -1) correct_index = foundIdx;
                }
            }

            return {
                [field]: activeQuizParent.id,
                question_text,
                options,
                correct_index,
                explanation: q.explanation || q.rationale || '',
                order_index: idx
            };
        });

        // Filter out invalid items
        const validPayload = payload.filter(p => p.question_text && p.options.length >= 2);
        if (validPayload.length === 0) throw new Error("No valid questions found. Ensure each question has text and at least 2 options.");

        const { error } = await (supabase as any).from('learning_quiz_questions').insert(validPayload);
        if (error) throw error;

        fetchQuizQuestions(activeQuizParent.id, activeQuizLevel as Level);
        return validPayload.length;
    };

    const handleClearAllQuiz = async () => {
        if (!activeQuizParent) return;
        if (!confirm('Are you sure you want to PERMANENTLY delete ALL questions for this section?')) return;

        let field = '';
        if (activeQuizLevel === 'topics') field = 'topic_id';
        else if (activeQuizLevel === 'units') field = 'unit_id';
        else if (activeQuizLevel === 'subunits') field = 'subunit_id';

        const { error } = await (supabase as any).from('learning_quiz_questions').delete().eq(field, activeQuizParent.id);
        if (error) {
            toast({ title: 'Error', description: 'Failed to clear questions.', variant: 'destructive' });
        } else {
            setQuizQuestions([]);
            toast({ title: 'Success', description: 'All questions cleared.' });
        }
    };

    const handleBulkImportQuiz = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                const count = await bulkImportQuestions(json);
                toast({ title: 'Success', description: `${count} questions imported.` });
            } catch (err: any) {
                toast({ title: 'Import Failed', description: err.message, variant: 'destructive' });
            }
        };
        reader.readAsText(file);
    };

    const handlePasteImport = async () => {
        if (!pastedJson.trim()) return;
        try {
            const json = JSON.parse(pastedJson);
            const count = await bulkImportQuestions(json);
            toast({ title: 'Success', description: `${count} questions imported.` });
            setPastedJson('');
            setIsPasteModalOpen(false);
        } catch (err: any) {
            toast({ title: 'Import Failed', description: err.message, variant: 'destructive' });
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        const parentId = path.length > 0 ? path[path.length - 1].id : null;
        let query: any;

        switch (currentLevel) {
            case 'exams':
                query = (supabase as any).from('learning_exams').select('*');
                break;
            case 'courses':
                query = (supabase as any).from('learning_courses').select('*').eq('exam_id', parentId);
                break;
            case 'topics':
                query = (supabase as any).from('learning_topics').select('*').eq('course_id', parentId);
                break;
            case 'units':
                query = (supabase as any).from('learning_units').select('*').eq('topic_id', parentId);
                break;
            case 'subunits':
                query = (supabase as any).from('learning_subunits').select('*').eq('unit_id', parentId);
                break;
            case 'content':
                query = (supabase as any).from('learning_content').select('*');
                const parentLevel = path.length > 0 ? path[path.length - 1].level : null;

                if (parentLevel === 'subunits') query = query.eq('subunit_id', parentId);
                else if (parentLevel === 'units') query = query.eq('unit_id', parentId);
                else if (parentLevel === 'topics') query = query.eq('topic_id', parentId);

                query = query.order('order_index');
                break;
        }

        const { data: result, error } = await query;
        if (error) {
            console.error(error);
            toast({ title: 'Fetch Error', description: error.message, variant: 'destructive' });
        } else {
            setData(result || []);
        }
        setIsLoading(false);
    };

    const handleResourceUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `resources/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('learning-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('learning-assets')
                .getPublicUrl(filePath);

            if (isEdit) {
                setEditResourceUrl(publicUrl);
                if (!editResourceTitle) setEditResourceTitle(file.name);
            } else {
                setNewResourceUrl(publicUrl);
                if (!newResourceTitle) setNewResourceTitle(file.name);
            }
            toast({ title: 'Success', description: 'Resource uploaded successfully.' });
        } catch (error: any) {
            toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('learning-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('learning-assets')
                .getPublicUrl(filePath);

            const markdownImage = `\n![${file.name}](${publicUrl})\n`;

            const textarea = document.getElementById('article-editor') as HTMLTextAreaElement;
            const cursorStart = textarea ? textarea.selectionStart : -1;
            const cursorEnd = textarea ? textarea.selectionEnd : -1;

            if (isEdit) {
                if (cursorStart >= 0) {
                    setEditTextContent(prev => prev.substring(0, cursorStart) + markdownImage + prev.substring(cursorEnd));
                } else {
                    setEditTextContent(prev => prev + markdownImage);
                }
            } else {
                if (cursorStart >= 0) {
                    setNewItemTextContent(prev => prev.substring(0, cursorStart) + markdownImage + prev.substring(cursorEnd));
                } else {
                    setNewItemTextContent(prev => prev + markdownImage);
                }
            }
            toast({ title: 'Image Uploaded', description: 'Embedded into text content.' });
            toast({ title: 'Image Uploaded', description: 'Embedded into text content.' });
        } catch (error: any) {
            toast({ title: 'Upload Failed', description: error.message || 'Ensure "learning-assets" bucket exists.', variant: 'destructive' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddItem = async () => {
        if (!newItemName.trim() && currentLevel !== 'content') return;
        setIsSubmitting(true);

        const parentId = path.length > 0 ? path[path.length - 1].id : null;
        let payload: any = { name: newItemName, description: newItemDesc, is_active: true };
        let table = '';

        switch (currentLevel) {
            case 'exams': table = 'learning_exams'; break;
            case 'courses': table = 'learning_courses'; payload.exam_id = parentId; break;
            case 'topics': table = 'learning_topics'; payload.course_id = parentId; break;
            case 'units': table = 'learning_units'; payload.topic_id = parentId; break;
            case 'subunits': table = 'learning_subunits'; payload.unit_id = parentId; break;
            case 'content':
                table = 'learning_content';
                payload = {
                    title: newItemName,
                    description: newItemDesc,
                    content_type: newItemContentType,
                    video_url: newItemContentType === 'video' ? newVideoUrl : null,
                    text_content: newItemContentType === 'article' ? newItemTextContent : null,
                    resource_url: newResourceUrl || null,
                    resource_title: newResourceTitle || null,
                    subunit_id: currentLevel === 'content' && path[path.length - 1].level === 'subunits' ? parentId : null,
                    unit_id: currentLevel === 'content' && path[path.length - 1].level === 'units' ? parentId : null,
                    topic_id: currentLevel === 'content' && path[path.length - 1].level === 'topics' ? parentId : null,
                    order_index: data.length,
                    is_active: true
                };
                break;
        }

        if (currentLevel === 'topics' || currentLevel === 'units' || currentLevel === 'subunits') {
            payload.resource_url = newResourceUrl || null;
            payload.resource_title = newResourceTitle || null;
        }

        const { error } = await (supabase as any).from(table).insert([payload]);
        if (error) {
            toast({ title: 'Creation Failed', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: 'Success', description: `${currentLevel} item established.` });
            setNewItemName('');
            setNewItemDesc('');
            setNewVideoUrl('');
            setNewEmbedCode('');
            setNewItemTextContent('');
            setNewResourceUrl('');
            setNewResourceTitle('');
            fetchData();
        }
        setIsSubmitting(false);
    };

    const handleUpdateItem = async () => {
        if (!editName.trim() && currentLevel !== 'content') return;
        setIsSubmitting(true);

        let table = '';
        let payload: any = { name: editName, description: editDesc };

        switch (currentLevel) {
            case 'exams': table = 'learning_exams'; break;
            case 'courses': table = 'learning_courses'; break;
            case 'topics': table = 'learning_topics'; break;
            case 'units': table = 'learning_units'; break;
            case 'subunits': table = 'learning_subunits'; break;
            case 'content':
                table = 'learning_content';
                payload = {
                    title: editName,
                    description: editDesc,
                    content_type: editContentType,
                    video_url: editContentType === 'video' ? editVideoUrl : null,
                    text_content: editContentType === 'article' ? editTextContent : null,
                    resource_url: editResourceUrl || null,
                    resource_title: editResourceTitle || null
                };
                break;
        }

        if (currentLevel === 'topics' || currentLevel === 'units' || currentLevel === 'subunits') {
            payload.resource_url = editResourceUrl || null;
            payload.resource_title = editResourceTitle || null;
        }

        const { error } = await (supabase as any).from(table).update(payload).eq('id', editingItem.id);
        if (error) {
            toast({ title: 'Update Failed', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: 'Success', description: 'Item updated.' });
            setEditingItem(null);
            fetchData();
        }
        setIsSubmitting(false);
    };

    const toggleStatus = async (item: any) => {
        let table = '';
        switch (currentLevel) {
            case 'exams': table = 'learning_exams'; break;
            case 'courses': table = 'learning_courses'; break;
            case 'topics': table = 'learning_topics'; break;
            case 'units': table = 'learning_units'; break;
            case 'subunits': table = 'learning_subunits'; break;
            case 'content': table = 'learning_content'; break;
        }

        const { error } = await (supabase as any).from(table).update({ is_active: !item.is_active }).eq('id', item.id);
        if (error) {
            console.error('Toggle Error:', error);
            toast({
                title: 'Toggle Failed',
                description: 'The visibility feature requires a database update. Please ensure migrations are applied.',
                variant: 'destructive'
            });
        } else {
            fetchData();
        }
    };

    const handleReorder = async (item: any, direction: 'up' | 'down') => {
        const currentIndex = data.findIndex(d => d.id === item.id);
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex < 0 || targetIndex >= data.length) return;

        const targetItem = data[targetIndex];
        let table = '';
        switch (currentLevel) {
            case 'exams': table = 'learning_exams'; break;
            case 'courses': table = 'learning_courses'; break;
            case 'topics': table = 'learning_topics'; break;
            case 'units': table = 'learning_units'; break;
            case 'subunits': table = 'learning_subunits'; break;
            case 'content': table = 'learning_content'; break;
        }

        // Simple swap logic
        await (supabase as any).from(table).update({ order_index: targetItem.order_index || targetIndex }).eq('id', item.id);
        await (supabase as any).from(table).update({ order_index: item.order_index || currentIndex }).eq('id', targetItem.id);
        fetchData();
    };

    const handleDelete = async (id: string) => {
        let table = '';
        switch (currentLevel) {
            case 'exams': table = 'learning_exams'; break;
            case 'courses': table = 'learning_courses'; break;
            case 'topics': table = 'learning_topics'; break;
            case 'units': table = 'learning_units'; break;
            case 'subunits': table = 'learning_subunits'; break;
            case 'content': table = 'learning_content'; break;
        }

        const { error } = await (supabase as any).from(table).delete().eq('id', id);
        if (error) {
            toast({ title: 'Delete Failed', description: error.message, variant: 'destructive' });
        } else {
            fetchData();
        }
    };

    const drillDown = (item: any) => {
        const levels: Level[] = ['exams', 'courses', 'topics', 'units', 'subunits', 'content'];
        const currentIdx = levels.indexOf(currentLevel);

        // Custom drill-down for direct content
        if (currentLevel === 'topics' || currentLevel === 'units') {
            // Option to drill down normally or jump to content
            setPath([...path, { id: item.id, name: item.name || item.title, level: currentLevel }]);
            setCurrentLevel(levels[currentIdx + 1]);
        } else if (currentIdx + 1 < levels.length) {
            setPath([...path, { id: item.id, name: item.name || item.title, level: currentLevel }]);
            setCurrentLevel(levels[currentIdx + 1]);
        }
    };

    const jumpToContent = (item: any) => {
        setPath([...path, { id: item.id, name: item.name || item.title, level: currentLevel }]);
        setCurrentLevel('content');
    };

    const drillUp = (index: number) => {
        const newPath = path.slice(0, index + 1);
        setPath(newPath);
        const levels: Level[] = ['exams', 'courses', 'topics', 'units', 'subunits', 'content'];
        setCurrentLevel(levels[index + 1]);
    };

    const reset = () => {
        setPath([]);
        setCurrentLevel('exams');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hierarchy Path */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-b border-slate-100 dark:border-border dark:border-border">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={reset}
                    className={cn("text-[10px] font-black uppercase tracking-widest", currentLevel === 'exams' ? "text-indigo-600" : "text-slate-400")}
                >
                    Exams
                </Button>
                {path.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => drillUp(i)}
                            className={cn("text-[10px] font-black uppercase tracking-widest max-w-[120px] truncate", i === path.length - 1 && currentLevel !== 'exams' ? "text-indigo-600" : "text-slate-400")}
                        >
                            {p.name}
                        </Button>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Form Side */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="p-8 bg-white dark:bg-card rounded-[2.5rem] border border-slate-100 dark:border-border shadow-xl shadow-slate-200/50">
                        <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter mb-6 flex items-center gap-2">
                            {editingItem ? <Pencil className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4 text-indigo-600" />}
                            {editingItem ? `Update ${currentLevel.slice(0, -1)}` : `Initialize ${currentLevel.slice(0, -1)}`}
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    {currentLevel === 'content' ? 'Video Title' : 'Name'}
                                </Label>
                                <Input
                                    value={editingItem ? editName : newItemName}
                                    onChange={(e) => editingItem ? setEditName(e.target.value) : setNewItemName(e.target.value)}
                                    placeholder={`Enter identity...`}
                                    className="rounded-xl border-slate-100 dark:border-border uppercase text-[10px] font-bold tracking-widest h-12"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</Label>
                                <Textarea
                                    value={editingItem ? editDesc : newItemDesc}
                                    onChange={(e) => editingItem ? setEditDesc(e.target.value) : setNewItemDesc(e.target.value)}
                                    placeholder="Intel briefing..."
                                    className="rounded-xl border-slate-100 dark:border-border text-xs font-bold min-h-[100px]"
                                />
                            </div>

                            {currentLevel === 'content' && (
                                <div className="flex gap-2 p-1 bg-slate-100 rounded-lg mb-4">
                                    <button
                                        onClick={() => editingItem ? setEditContentType('video') : setNewItemContentType('video')}
                                        className={cn("flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-md transition-all", (editingItem ? editContentType : newItemContentType) === 'video' ? "bg-white dark:bg-card shadow text-indigo-600" : "text-slate-400")}
                                    >
                                        Video Protocol
                                    </button>
                                    <button
                                        onClick={() => editingItem ? setEditContentType('article') : setNewItemContentType('article')}
                                        className={cn("flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-md transition-all", (editingItem ? editContentType : newItemContentType) === 'article' ? "bg-white dark:bg-card shadow text-emerald-600" : "text-slate-400")}
                                    >
                                        Article Doc
                                    </button>
                                </div>
                            )}

                            {currentLevel === 'content' && (editingItem ? editContentType : newItemContentType) === 'video' && (
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Video URL</Label>
                                    <Input
                                        value={editingItem ? editVideoUrl : newVideoUrl}
                                        onChange={(e) => editingItem ? setEditVideoUrl(e.target.value) : setNewVideoUrl(e.target.value)}
                                        placeholder="YouTube/Vimeo link..."
                                        className="rounded-xl border-slate-100 dark:border-border text-[10px] font-bold h-12"
                                    />
                                </div>
                            )}

                            {(currentLevel === 'topics' || currentLevel === 'units' || currentLevel === 'subunits' || (currentLevel === 'content' && (editingItem ? editContentType : newItemContentType) === 'video')) && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resource URL (Optional)</Label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="file"
                                                    id="resource-upload"
                                                    className="hidden"
                                                    onChange={(e) => handleResourceUpload(e, !!editingItem)}
                                                />
                                                <Label
                                                    htmlFor="resource-upload"
                                                    className={cn("cursor-pointer px-2 py-1 bg-indigo-50 hover:bg-indigo-100 rounded-md text-[8px] font-black uppercase tracking-widest text-indigo-600 transition-colors flex items-center gap-1", isUploading && "opacity-50 pointer-events-none")}
                                                >
                                                    {isUploading ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Plus className="w-2.5 h-2.5" />}
                                                    Upload File
                                                </Label>
                                            </div>
                                        </div>
                                        <Input
                                            value={editingItem ? editResourceUrl : newResourceUrl}
                                            onChange={(e) => editingItem ? setEditResourceUrl(e.target.value) : setNewResourceUrl(e.target.value)}
                                            placeholder="e.g. PDF/Link..."
                                            className="rounded-xl border-slate-100 dark:border-border text-[10px] font-bold h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resource Title</Label>
                                        <Input
                                            value={editingItem ? editResourceTitle : newResourceTitle}
                                            onChange={(e) => editingItem ? setEditResourceTitle(e.target.value) : setNewResourceTitle(e.target.value)}
                                            placeholder="Button Label..."
                                            className="rounded-xl border-slate-100 dark:border-border text-[10px] font-bold h-12"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentLevel === 'content' && (editingItem ? editContentType : newItemContentType) === 'video' && (
                                <div className="h-[1px]" />
                            )}

                            {currentLevel === 'content' && (editingItem ? editContentType : newItemContentType) === 'article' && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Article Content (Markdown)</Label>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                            * Paste text to preserve layout. Use Markdown for bold/headers.
                                        </span>
                                    </div>
                                    <Textarea
                                        id="article-editor"
                                        value={editingItem ? editTextContent : newItemTextContent}
                                        onChange={(e) => editingItem ? setEditTextContent(e.target.value) : setNewItemTextContent(e.target.value)}
                                        placeholder="# Topic Header\n\nContent goes here..."
                                        className="rounded-xl border-slate-100 dark:border-border text-xs font-medium min-h-[600px] font-mono p-6 leading-relaxed"
                                    />
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="file"
                                            id="img-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, !!editingItem)}
                                        />
                                        <Label
                                            htmlFor="img-upload"
                                            className={cn("cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 transition-colors", isUploading && "opacity-50 pointer-events-none")}
                                        >
                                            {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                            Insert Image at Cursor
                                        </Label>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2">
                                {editingItem ? (
                                    <>
                                        <Button
                                            onClick={handleUpdateItem}
                                            disabled={isSubmitting}
                                            className="flex-1 h-12 bg-amber-500 hover:bg-amber-600 rounded-xl font-black text-[10px] uppercase tracking-widest text-white shadow-lg"
                                        >
                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                            Commit Update
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => setEditingItem(null)}
                                            className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-muted text-slate-400"
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        onClick={handleAddItem}
                                        disabled={isSubmitting || (!newItemName.trim() && currentLevel !== 'content')}
                                        className="w-full h-14 bg-slate-900 hover:bg-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-lg"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4 mr-2" />}
                                        Deploy {currentLevel.slice(0, -1)}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {(currentLevel === 'topics' || currentLevel === 'units') && (
                        <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50">
                            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4">Shortcut Protocol</p>
                            <Button
                                variant="ghost"
                                onClick={() => setCurrentLevel('content')}
                                className="w-full h-12 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all font-black text-[9px] uppercase tracking-[0.2em]"
                            >
                                <Video className="w-3.5 h-3.5 mr-2" />
                                Direct Content Access
                            </Button>
                        </div>
                    )}
                </div>

                {/* List Side */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter">
                            Linked {currentLevel} ({data.length})
                        </h3>
                        {path.length > 0 && (currentLevel === 'units' || currentLevel === 'subunits' || currentLevel === 'content') && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const parent = path[path.length - 1];
                                    let parentLevel: Level = 'topics';
                                    if (currentLevel === 'subunits') parentLevel = 'units';
                                    else if (currentLevel === 'content') parentLevel = 'subunits';

                                    setActiveQuizParent(parent);
                                    setActiveQuizLevel(parentLevel);
                                    fetchQuizQuestions(parent.id, parentLevel);
                                    setIsQuizModalOpen(true);
                                }}
                                className="rounded-xl border-indigo-100 bg-indigo-50/50 text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                            >
                                <ListChecks className="w-3.5 h-3.5 mr-2" />
                                Manage {currentLevel === 'content' ? 'Subunit' : currentLevel === 'subunits' ? 'Unit' : 'Topic'} Quiz
                            </Button>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Syncing Archive...</span>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="py-20 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-border flex flex-col items-center justify-center text-slate-400">
                            <Database className="w-12 h-12 mb-4 opacity-10" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No active links found in this sector.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {data.map((item) => (
                                <div key={item.id} className="group p-6 bg-white dark:bg-card rounded-3xl border border-slate-100 dark:border-border flex items-center justify-between hover:border-indigo-200 transition-all shadow-sm hover:shadow-md">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 bg-slate-50 dark:bg-muted rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                            {currentLevel === 'content' ? <Video className="w-5 h-5 text-indigo-600" /> : <Layers className="w-5 h-5 text-indigo-600" />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">{item.name || item.title}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight line-clamp-1">{item.description || 'No system briefing available.'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col gap-1 mr-2">
                                            <button onClick={() => handleReorder(item, 'up')} className="p-1 hover:bg-slate-100 rounded text-slate-400"><ArrowUp className="w-3 h-3" /></button>
                                            <button onClick={() => handleReorder(item, 'down')} className="p-1 hover:bg-slate-100 rounded text-slate-400"><ArrowDown className="w-3 h-3" /></button>
                                        </div>

                                        <button
                                            onClick={() => toggleStatus(item)}
                                            className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                                item.is_active ? "text-emerald-500 hover:bg-emerald-50" : "text-slate-300 hover:bg-slate-100"
                                            )}
                                        >
                                            {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>

                                        <button
                                            onClick={() => {
                                                setEditingItem(item);
                                                setEditName(item.name || item.title);
                                                setEditDesc(item.description || '');
                                                if (currentLevel === 'content') {
                                                    setEditContentType(item.content_type || 'video');
                                                    setEditVideoUrl(item.video_url || '');
                                                    setEditTextContent(item.text_content || '');
                                                    setEditResourceUrl(item.resource_url || '');
                                                    setEditResourceTitle(item.resource_title || '');
                                                }
                                                if (currentLevel === 'topics' || currentLevel === 'units' || currentLevel === 'subunits') {
                                                    setEditResourceUrl(item.resource_url || '');
                                                    setEditResourceTitle(item.resource_title || '');
                                                }
                                            }}
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>

                                        {currentLevel !== 'content' && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => drillDown(item)}
                                                className="rounded-xl border border-slate-50 text-[10px] font-black uppercase tracking-widest hover:text-indigo-600"
                                            >
                                                Drill Down
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        )}

                                        {(currentLevel === 'topics' || currentLevel === 'units' || currentLevel === 'subunits') && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleOpenQuizManager(item)}
                                                className="rounded-xl border-slate-50 text-[10px] font-black uppercase tracking-widest hover:text-indigo-600"
                                                title="Manage Quiz Questions"
                                            >
                                                <ListChecks className="w-4 h-4 mr-2" />
                                                Quiz
                                            </Button>
                                        )}

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(item.id)}
                                            className="w-10 h-10 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-500"
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

            {/* QUIZ MANAGER MODAL */}
            <Dialog open={isQuizModalOpen} onOpenChange={setIsQuizModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black">
                            Quiz Manager: {activeQuizParent?.name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                        {/* Add New Question */}
                        <div className="space-y-4 p-6 bg-slate-50 dark:bg-muted rounded-2xl border border-slate-100 dark:border-border dark:border-border">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">{editingQuizQuestion ? 'Update Question' : 'Add New Question'}</h3>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase">Question Text</Label>
                                <Textarea
                                    value={newQuizQuestion.text}
                                    onChange={(e) => setNewQuizQuestion({ ...newQuizQuestion, text: e.target.value })}
                                    className="text-xs h-24"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {newQuizQuestion.options.map((opt, i) => (
                                    <div key={i} className="space-y-1">
                                        <Label className="text-[10px] font-black uppercase">Option {String.fromCharCode(65 + i)} {newQuizQuestion.correctIndex === i && "✅"}</Label>
                                        <Input
                                            value={opt}
                                            onChange={(e) => {
                                                const newOpts = [...newQuizQuestion.options];
                                                newOpts[i] = e.target.value;
                                                setNewQuizQuestion({ ...newQuizQuestion, options: newOpts });
                                            }}
                                            onClick={() => setNewQuizQuestion({ ...newQuizQuestion, correctIndex: i })}
                                            className={cn("text-xs", newQuizQuestion.correctIndex === i && "border-indigo-500 bg-indigo-50")}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase">Explanation (Optional)</Label>
                                <Input
                                    value={newQuizQuestion.explanation}
                                    onChange={(e) => setNewQuizQuestion({ ...newQuizQuestion, explanation: e.target.value })}
                                    className="text-xs"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button onClick={handleAddQuizQuestion} className={cn("flex-1 text-white font-bold h-10 text-[10px] uppercase", editingQuizQuestion ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 hover:bg-indigo-700")}>
                                    {editingQuizQuestion ? 'Update Question' : 'Add Question'}
                                </Button>
                                {editingQuizQuestion && (
                                    <Button
                                        onClick={() => {
                                            setEditingQuizQuestion(null);
                                            setNewQuizQuestion({ text: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' });
                                        }}
                                        variant="ghost"
                                        className="h-10 text-[10px] uppercase"
                                    >Cancel</Button>
                                )}
                                <Dialog open={isPasteModalOpen} onOpenChange={setIsPasteModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="h-10 text-[10px] uppercase gap-2">
                                            <Layers className="w-3 h-3" /> Paste JSON
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-black">Paste Quiz JSON</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-6 pt-4">
                                            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                                                <p className="text-[10px] font-bold text-indigo-600 leading-relaxed">
                                                    Paste an array of questions. Use <code>{'\\(...\\)'}</code> for inline math (prevents <code>$</code> conflicts). <br />
                                                    Format: <code>{'[{"text": "...", "options": ["...", "..."], "correct_index": 0}]'}</code>
                                                </p>
                                            </div>
                                            <Textarea
                                                placeholder="Paste your JSON array here..."
                                                value={pastedJson}
                                                onChange={(e) => setPastedJson(e.target.value)}
                                                className="min-h-[300px] font-mono text-xs p-6 rounded-2xl"
                                            />
                                            <div className="flex gap-3">
                                                <Button variant="ghost" onClick={() => setIsPasteModalOpen(false)} className="flex-1 h-12 text-[10px] font-black uppercase">
                                                    Cancel
                                                </Button>
                                                <Button onClick={handlePasteImport} className="flex-1 bg-indigo-600 text-white h-12 text-[10px] font-black uppercase shadow-lg shadow-indigo-100">
                                                    Process Questions
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <div className="relative">
                                    <input type="file" id="quiz-import" className="hidden" accept=".json" onChange={handleBulkImportQuiz} />
                                    <Button asChild variant="ghost" className="h-10 text-[10px] uppercase px-2 hover:bg-slate-100">
                                        <label htmlFor="quiz-import" className="cursor-pointer flex items-center gap-2">
                                            <Download className="w-3 h-3" />
                                        </label>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Archive ({quizQuestions.length})</h3>
                                {quizQuestions.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClearAllQuiz}
                                        className="h-7 text-[8px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                    >
                                        <Trash2 className="w-3 h-3 mr-1" /> Clear All
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-3">
                                {quizQuestions.length === 0 ? (
                                    <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-border rounded-3xl">
                                        <p className="text-xs font-bold text-slate-300">No questions deployed yet.</p>
                                    </div>
                                ) : (
                                    quizQuestions.map((q, i) => (
                                        <div key={q.id} className="p-4 bg-white dark:bg-card border border-slate-100 dark:border-border rounded-xl relative group hover:border-indigo-200 transition-colors">
                                            <div className="flex gap-3">
                                                <span className="font-black text-indigo-600 text-xs">#{i + 1}</span>
                                                <div className="flex-1">
                                                    <MathText content={q.question_text} className="text-xs font-bold text-slate-800 mb-2" />
                                                    <div className="grid grid-cols-2 gap-1">
                                                        {q.options?.map((opt: string, idx: number) => (
                                                            <div key={idx} className={cn("text-[10px] px-2 py-1 rounded", idx === q.correct_index ? "bg-emerald-50 text-emerald-700 font-bold" : "text-slate-400")}>
                                                                {String.fromCharCode(65 + idx)}. <MathText content={opt} className="inline" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteQuizQuestion(q.id)}
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-50 text-rose-500 rounded transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleEditQuizQuestion(q)}
                                                className="absolute top-2 right-8 opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-50 text-blue-500 rounded transition-all"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    );
}
