import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Bookmark, Target, ChevronRight, LayoutGrid, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { MathText } from '@/components/MathText';

interface BookmarkedQuestion {
    id: string;
    question_id: string;
    created_at: string;
    display: {
        subject: string;
        text: string;
        difficulty: string;
        options?: string[];
        correct_index?: number;
        explanation?: string;
    };
}

export default function Bookmarks() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>([]);
    const [selectedBookmark, setSelectedBookmark] = useState<BookmarkedQuestion | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchBookmarks();
        }
    }, [user]);

    const fetchBookmarks = async () => {
        setLoading(true);
        try {
            const { data: rawBookmarks, error: bError } = await (supabase as any)
                .from('bookmarked_questions')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (bError) throw bError;
            if (!rawBookmarks || rawBookmarks.length === 0) {
                setBookmarks([]);
                return;
            }

            const questionIds = rawBookmarks.map((b: any) => b.question_id);

            // Fetch from all possible question tables
            const [questionsRes, readingRes, listeningRes] = await Promise.all([
                supabase.from('questions').select('id, question_text, subject, difficulty, topic, options, correct_index, explanation').in('id', questionIds),
                supabase.from('reading_questions').select('id, question_text').in('id', questionIds),
                supabase.from('listening_questions').select('id, question_text').in('id', questionIds)
            ]);

            const merged = rawBookmarks.map((b: any) => {
                const q = questionsRes.data?.find(x => x.id === b.question_id);
                const r = readingRes.data?.find(x => x.id === b.question_id);
                const l = listeningRes.data?.find(x => x.id === b.question_id);

                let display: BookmarkedQuestion['display'] = {
                    subject: 'Archive',
                    text: 'Question content no longer available',
                    difficulty: 'Standard'
                };

                if (q) {
                    // Use topic if subject is generic 'Practice'
                    const subjectDisplay = (q.subject === 'Practice' && q.topic) ? q.topic : (q.subject || 'Practice');
                    display = {
                        subject: subjectDisplay,
                        text: q.question_text,
                        difficulty: q.difficulty || 'Standard',
                        options: q.options,
                        correct_index: q.correct_index,
                        explanation: q.explanation
                    };
                } else if (r) {
                    display = {
                        subject: 'Reading',
                        text: r.question_text,
                        difficulty: 'IELTS'
                    };
                } else if (l) {
                    display = {
                        subject: 'Listening',
                        text: l.question_text,
                        difficulty: 'IELTS'
                    };
                }

                return { ...b, display };
            });

            setBookmarks(merged);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeBookmark = async (bookmarkId: string) => {
        await (supabase as any)
            .from('bookmarked_questions')
            .delete()
            .eq('id', bookmarkId);

        fetchBookmarks();
    };

    const getSubjectEmoji = (subject: string) => {
        const s = subject.toLowerCase();
        if (s.includes('math') || s.includes('alg') || s.includes('geom')) return '📐';
        if (s.includes('phys')) return '⚛️';
        if (s.includes('chem')) return '⚗️';
        if (s.includes('biol')) return '🧬';
        if (s.includes('read')) return '📖';
        if (s.includes('listen')) return '🎧';
        if (s.includes('writ')) return '✍️';
        if (s.includes('speak')) return '🎙️';
        return '🧠';
    };

    return (
        <Layout>
            <div className="container mx-auto px-6 py-16 max-w-5xl">
                {/* Header (Sleek Modern) */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100 mb-4 scale-90">
                        <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Knowledge Base</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-tight">Saved <span className="text-indigo-600">Assets</span></h1>
                    <p className="text-lg text-slate-400 font-bold tracking-tight">Access your curated collection of complex items.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-10 h-10 border-4 border-slate-100 dark:border-border border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                ) : bookmarks.length === 0 ? (
                    <div className="text-center py-32 bg-white dark:bg-card rounded-[3rem] border border-slate-100 dark:border-border shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-50/50">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-muted rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-100 dark:border-border group transition-all">
                            <Bookmark className="w-8 h-8 text-slate-200 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-3 tracking-tight">Archive Empty</h3>
                        <p className="text-slate-400 font-bold mb-10 max-w-xs mx-auto text-lg leading-relaxed">
                            No items have been secured yet. Start a mission to find items worth saving.
                        </p>
                        <Button
                            onClick={() => navigate('/practice')}
                            className="h-16 px-12 font-black bg-slate-900 hover:bg-slate-800 text-white rounded-2xl active:scale-95 transition-all shadow-xl"
                        >
                            START NEW MISSION
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookmarks.map((bookmark) => (
                            <div
                                key={bookmark.id}
                                className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-indigo-600 dark:hover:border-indigo-500 transition-all duration-500 group flex flex-col md:flex-row gap-8 items-start relative overflow-hidden hover:-translate-y-1"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-muted rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 flex items-center justify-center text-3xl group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6 transition-all shrink-0">
                                    {getSubjectEmoji(bookmark.display.subject)}
                                </div>

                                <div className="flex-1 space-y-4 relative z-10">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                                            {bookmark.display.subject}
                                        </span>
                                        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${bookmark.display.difficulty.toLowerCase() === 'easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            bookmark.display.difficulty.toLowerCase() === 'medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                'bg-indigo-50 text-indigo-600 border-indigo-100'
                                            }`}>
                                            {bookmark.display.difficulty}
                                        </span>
                                    </div>
                                    <p className="text-slate-800 font-bold leading-relaxed tracking-tight text-lg">
                                        {bookmark.display.text.substring(0, 180)}
                                        {bookmark.display.text.length > 180 && '...'}
                                    </p>
                                </div>

                                <div className="flex md:flex-col gap-3 shrink-0 relative z-10 w-full md:w-auto mt-4 md:mt-0">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeBookmark(bookmark.id)}
                                        className="h-12 w-12 rounded-xl text-rose-300 hover:text-rose-600 hover:bg-rose-50 border border-slate-50 hover:border-rose-100 transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedBookmark(bookmark)}
                                        className="h-12 w-12 rounded-xl text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-50 hover:border-indigo-100 transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Dialog open={!!selectedBookmark} onOpenChange={(open) => !open && setSelectedBookmark(null)}>
                    <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 border-none rounded-[2rem] shadow-2xl">
                        <DialogHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                                    {selectedBookmark?.display.subject}
                                </span>
                                <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-100">
                                    {selectedBookmark?.display.difficulty}
                                </span>
                            </div>
                            <DialogTitle className="text-2xl font-black text-slate-900 dark:text-slate-100">
                                Question Preview
                            </DialogTitle>
                        </DialogHeader>

                        <div className="py-6 space-y-8 max-h-[70vh] overflow-y-auto pr-2">
                            {/* Question Text */}
                            <div className="text-lg font-medium text-slate-800 dark:text-slate-200">
                                <MathText content={selectedBookmark?.display.text || ''} />
                            </div>

                            {/* Options */}
                            {selectedBookmark?.display.options && (
                                <div className="space-y-3">
                                    {selectedBookmark.display.options.map((option, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${index === selectedBookmark?.display.correct_index
                                                ? 'border-emerald-100 bg-emerald-50/50'
                                                : 'border-slate-50 bg-slate-50/30'
                                                }`}
                                        >
                                            <div
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${index === selectedBookmark?.display.correct_index
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-white text-slate-300 border border-slate-100'
                                                    }`}
                                            >
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            <div className="flex-1">
                                                <MathText content={option} className={`text-sm font-medium ${index === selectedBookmark?.display.correct_index ? 'text-emerald-900' : 'text-slate-600'
                                                    }`} />
                                            </div>
                                            {index === selectedBookmark?.display.correct_index && (
                                                <Target className="w-5 h-5 text-emerald-500" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Explanation */}
                            {selectedBookmark?.display.explanation && (
                                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                                    <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        Explanation
                                    </h4>
                                    <MathText content={selectedBookmark.display.explanation} className="text-sm text-blue-800 leading-relaxed" />
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
}
