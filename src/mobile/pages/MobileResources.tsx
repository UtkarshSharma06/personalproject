import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useExam } from '@/context/ExamContext';
import { FileText, Download, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Resource {
    id: string;
    title: string;
    description: string;
    file_url: string;
    exam_type: string;
    created_at: string;
}

export default function MobileResources() {
    const { activeExam } = useExam();
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (activeExam?.id) {
            fetchResources();
        }
    }, [activeExam]);

    const fetchResources = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('exam_resources')
            .select('*')
            .eq('exam_type', activeExam.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching resources:', error);
        } else {
            setResources(data || []);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-full bg-background animate-in fade-in duration-500 pb-32">
            <div className="bg-background/95 backdrop-blur-xl p-6 border-b border-border/50 sticky top-0 z-40">
                <button
                    onClick={() => navigate('/mobile/dashboard')}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary mb-4 active:scale-95 transition-transform"
                >
                    <ArrowLeft size={14} /> Back to Command
                </button>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Resource Library</h2>
            </div>

            {isLoading ? (
                <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
            ) : resources.length === 0 ? (
                <div className="p-12 text-center opacity-50">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-xs font-bold uppercase">No Resources Found</p>
                </div>
            ) : (
                <div className="p-6 space-y-4">
                    {resources.map((r) => (
                        <div key={r.id} className="bg-secondary/20 p-5 rounded-[2rem] border border-border/50 flex flex-col gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-600 shrink-0">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm leading-tight mb-1">{r.title}</h4>
                                    <p className="text-[10px] text-muted-foreground line-clamp-2">{r.description}</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full rounded-xl h-10 font-bold uppercase text-[10px] tracking-widest hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 dark:hover:bg-pink-900/30"
                                asChild
                            >
                                <a href={r.file_url} target="_blank" rel="noopener noreferrer">
                                    <Download className="w-3 h-3 mr-2" />
                                    Download PDF
                                </a>
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
