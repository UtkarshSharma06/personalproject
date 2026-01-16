import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Bookmark, Target, ChevronRight, LayoutGrid, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookmarkedQuestion {
    id: string;
    question_id: string;
    created_at: string;
    question: {
        id: string;
        stem: string;
        subject: string;
        difficulty: string;
    };
}

export default function Bookmarks() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchBookmarks();
        }
    }, [user]);

    const fetchBookmarks = async () => {
        const { data, error } = await (supabase as any)
            .from('bookmarked_questions')
            .select(`
        id,
        question_id,
        created_at,
        question:questions (
          id,
          stem,
          subject,
          difficulty
        )
      `)
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });

        if (data) {
            setBookmarks(data);
        }
        setLoading(false);
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
        if (s.includes('biol')) return '🧬';
        if (s.includes('chem')) return '⚗️';
        if (s.includes('math')) return '📐';
        if (s.includes('phys')) return '⚛️';
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
                                className="bg-white dark:bg-card p-8 rounded-[2.5rem] border border-slate-100 dark:border-border shadow-sm hover:border-slate-900 transition-all group flex flex-col md:flex-row gap-8 items-start relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-muted rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="w-16 h-16 bg-slate-50 dark:bg-muted rounded-3xl border border-slate-100 dark:border-border flex items-center justify-center text-3xl group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                                    {getSubjectEmoji(bookmark.question.subject)}
                                </div>

                                <div className="flex-1 space-y-4 relative z-10">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                                            {bookmark.question.subject}
                                        </span>
                                        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${bookmark.question.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                bookmark.question.difficulty === 'medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                    'bg-rose-50 text-rose-600 border-rose-100'
                                            }`}>
                                            {bookmark.question.difficulty} Level
                                        </span>
                                    </div>
                                    <p className="text-slate-800 font-bold leading-relaxed tracking-tight text-lg">
                                        {bookmark.question.stem.substring(0, 180)}
                                        {bookmark.question.stem.length > 180 && '...'}
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
                                        className="h-12 w-12 rounded-xl text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-50 hover:border-indigo-100 transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
