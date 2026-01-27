import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import {
    Bookmark, Trash2, ChevronRight, Search,
    Filter, LayoutGrid, List, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MathText } from '@/components/MathText';
import { cn } from '@/lib/utils';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

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

export default function MobileBookmarks() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>([]);
    const [filteredBookmarks, setFilteredBookmarks] = useState<BookmarkedQuestion[]>([]);
    const [selectedBookmark, setSelectedBookmark] = useState<BookmarkedQuestion | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    useEffect(() => {
        if (user) {
            fetchBookmarks();
        }
    }, [user]);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        setFilteredBookmarks(
            bookmarks.filter(b =>
                b.display.text.toLowerCase().includes(query) ||
                b.display.subject.toLowerCase().includes(query)
            )
        );
    }, [searchQuery, bookmarks]);

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

    const removeBookmark = async (e: React.MouseEvent, bookmarkId: string) => {
        e.stopPropagation();
        Haptics.impact({ style: ImpactStyle.Medium }).catch(() => { });
        await (supabase as any)
            .from('bookmarked_questions')
            .delete()
            .eq('id', bookmarkId);

        setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    };

    const handleOpenBookmark = (bookmark: BookmarkedQuestion) => {
        Haptics.impact({ style: ImpactStyle.Light }).catch(() => { });
        setSelectedBookmark(bookmark);
    };

    const getSubjectBadgeColor = (subject: string) => {
        const s = subject.toLowerCase();
        if (s.includes('math')) return 'bg-blue-500/10 text-blue-600 border-blue-200';
        if (s.includes('phys')) return 'bg-rose-500/10 text-rose-600 border-rose-200';
        if (s.includes('chem')) return 'bg-orange-500/10 text-orange-600 border-orange-200';
        if (s.includes('biol')) return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
        return 'bg-indigo-500/10 text-indigo-600 border-indigo-200';
    };

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Header */}
            <header className="p-6 pt-12 bg-card border-b border-border/50 sticky top-0 z-20 backdrop-blur-xl bg-card/80">
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-2xl font-black tracking-tighter uppercase tracking-[0.1em]">Bookmarks</h1>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                            className="rounded-xl bg-secondary/30"
                        >
                            {viewMode === 'list' ? <LayoutGrid size={18} /> : <List size={18} />}
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search your saved assets..."
                        className="pl-12 h-14 bg-secondary/30 border-none rounded-2xl font-bold placeholder:font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            <main className="p-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-50">
                        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Scanning Archive...</p>
                    </div>
                ) : filteredBookmarks.length === 0 ? (
                    <div className="text-center py-24 bg-secondary/10 rounded-[3rem] border-2 border-dashed border-border/50">
                        <div className="w-20 h-20 bg-background rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Bookmark className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                        <h3 className="text-xl font-black mb-2 tracking-tight uppercase">Archive Empty</h3>
                        <p className="text-sm text-muted-foreground font-medium max-w-[200px] mx-auto leading-relaxed">
                            No items have been secured in your knowledge base yet.
                        </p>
                    </div>
                ) : (
                    <div className={cn(
                        "grid gap-4",
                        viewMode === 'grid' ? "grid-cols-2" : "grid-cols-1"
                    )}>
                        {filteredBookmarks.map((bookmark) => (
                            <div
                                key={bookmark.id}
                                onClick={() => handleOpenBookmark(bookmark)}
                                className={cn(
                                    "bg-card border border-border/50 p-6 rounded-[2.5rem] shadow-sm active:scale-[0.98] transition-all relative overflow-hidden group",
                                    viewMode === 'list' ? "flex flex-col gap-4" : "flex flex-col justify-between aspect-square"
                                )}
                            >
                                <div className="flex items-start justify-between">
                                    <span className={cn(
                                        "px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full border",
                                        getSubjectBadgeColor(bookmark.display.subject)
                                    )}>
                                        {bookmark.display.subject}
                                    </span>
                                    <button
                                        onClick={(e) => removeBookmark(e, bookmark.id)}
                                        className="p-2 text-muted-foreground/30 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className={cn(
                                    "font-bold text-foreground leading-snug",
                                    viewMode === 'list' ? "text-sm line-clamp-3" : "text-xs line-clamp-4"
                                )}>
                                    <MathText content={bookmark.display.text} />
                                </div>

                                <div className="flex items-center justify-between text-[8px] font-black text-muted-foreground uppercase tracking-widest mt-auto pt-2">
                                    <span>{new Date(bookmark.created_at).toLocaleDateString()}</span>
                                    <div className="flex items-center gap-1 text-primary">
                                        View <ChevronRight size={10} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Preview Dialog */}
            <Dialog open={!!selectedBookmark} onOpenChange={(open) => !open && setSelectedBookmark(null)}>
                <DialogContent className="max-w-[90vw] w-[400px] bg-background border-none rounded-[3rem] p-0 overflow-hidden shadow-2xl">
                    <div className="max-h-[80vh] overflow-y-auto">
                        <div className="p-8 pb-4">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={cn(
                                    "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border",
                                    selectedBookmark && getSubjectBadgeColor(selectedBookmark.display.subject)
                                )}>
                                    {selectedBookmark?.display.subject}
                                </span>
                            </div>
                            <h2 className="text-2xl font-black tracking-tighter uppercase mb-6 leading-none">Question Preview</h2>

                            <div className="prose prose-sm dark:prose-invert">
                                <MathText
                                    content={selectedBookmark?.display.text || ''}
                                    className="text-lg font-bold leading-relaxed text-foreground"
                                />
                            </div>
                        </div>

                        {selectedBookmark?.display.options && (
                            <div className="px-8 pb-8 space-y-3">
                                {selectedBookmark.display.options.map((option, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "p-5 rounded-[2rem] border-2 transition-all flex items-center gap-4",
                                            index === selectedBookmark?.display.correct_index
                                                ? 'border-emerald-500/50 bg-emerald-500/5'
                                                : 'border-secondary bg-secondary/20'
                                        )}
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0",
                                            index === selectedBookmark?.display.correct_index
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-background border border-border/50 text-muted-foreground'
                                        )}>
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <div className="flex-1">
                                            <MathText content={option} className={cn(
                                                "text-xs font-bold",
                                                index === selectedBookmark?.display.correct_index ? "text-emerald-700" : "text-foreground/80"
                                            )} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedBookmark?.display.explanation && (
                            <div className="mx-8 mb-8 p-6 bg-primary/5 rounded-[2rem] border border-primary/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Expert Analysis</span>
                                </div>
                                <MathText
                                    content={selectedBookmark.display.explanation}
                                    className="text-xs text-muted-foreground leading-relaxed font-medium"
                                />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
