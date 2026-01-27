import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { useExam } from '@/context/ExamContext';
import {
    FileText,
    Search,
    Download,
    Loader2,
    BookOpen,
    Filter
} from 'lucide-react';

interface Resource {
    id: string;
    title: string;
    description: string;
    file_url: string;
    exam_type: string;
    created_at: string;
}

export default function Resources() {
    const { activeExam } = useExam();
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (activeExam?.id) {
            fetchResources();
        }
    }, [activeExam]);

    const fetchResources = async () => {
        setIsLoading(true);
        // Clean exam ID to match exam_type format if needed (though usually activeExam.id is 'cent-s-prep' etc)
        // If activeExam.id includes extras, we might need to split. Assuming it matches exam_type directly or prefix.
        // The EXAMS config usually has id like 'cent-s-prep'.

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

    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Knowledge Resources
                            </h1>
                            <p className="text-slate-500 font-medium">
                                Curated study materials and official documentation for <span className="text-indigo-600 font-bold uppercase">{activeExam.name}</span>.
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search resources..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 rounded-2xl bg-white dark:bg-card border-slate-200 shadow-sm"
                        />
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
                        <p className="text-slate-400 font-medium">Accessing secure archives...</p>
                    </div>
                ) : filteredResources.length === 0 ? (
                    <div className="bg-white dark:bg-card rounded-[2rem] p-12 text-center border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Resources Found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            There are currently no documents available for this exam section. Check back later or contact your supervisor.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map((resource) => (
                            <div key={resource.id} className="group bg-white dark:bg-card rounded-3xl p-6 border border-slate-100 dark:border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50/50 to-transparent rounded-bl-[3rem] -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                                <div className="relative flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <span className="bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 px-2 py-1 rounded-lg">
                                        PDF
                                    </span>
                                </div>

                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2">
                                    {resource.title}
                                </h3>

                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-3 min-h-[3rem]">
                                    {resource.description || "No description provided."}
                                </p>

                                <Button
                                    className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-indigo-600 hover:text-white rounded-xl font-bold transition-all shadow-lg shadow-slate-200/50 dark:shadow-none"
                                    asChild
                                >
                                    <a href={resource.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                        <Download className="w-4 h-4" />
                                        <span>Download Material</span>
                                    </a>
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
