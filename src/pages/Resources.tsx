import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import BlogHeader from '@/components/blog/BlogHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useExam } from '@/context/ExamContext';
import { ResourcesGridSkeleton } from '@/components/SkeletonLoader';
import {
    FileText,
    Search,
    Download,
    BookOpen,
    ArrowRight,
    Sparkles,
    Calendar,
    ChevronLeft,
    MessageCircle,
    Instagram,
    Facebook,
    Twitter,
    MessageSquare,
    HelpCircle,
    Link as LinkIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { getProxiedUrl } from '@/lib/url';

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
    const { toast } = useToast();
    const location = useLocation();
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Check if we came from blog or if we want the "Blog Style"
    const isFromBlog = location.state?.fromBlog || location.pathname.includes('/resources');

    useEffect(() => {
        fetchResources();
    }, [activeExam]);

    const fetchResources = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('exam_resources')
            .select('*')
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
        <Layout showHeader={false}>
            <div className={`min-h-screen ${isFromBlog ? 'bg-[#FAFAFA]' : 'bg-white'}`}>
                <BlogHeader />

                {/* Hero Section - Matching Blog Style */}
                <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-transparent pt-24 pb-16">
                    <div className="container relative mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold border border-indigo-200 shadow-sm mb-8 animate-bounce"
                        >
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            Study Vault
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6"
                        >
                            Knowledge <span className="text-indigo-600">Resources</span> 📚
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto font-medium"
                        >
                            Deep dive into study materials, guides, and official docs for <span className="text-indigo-600 font-bold uppercase">{activeExam.name}</span>.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="relative max-w-xl mx-auto group"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex items-center bg-white border-2 border-slate-100 rounded-[2rem] p-2 shadow-xl shadow-indigo-500/5">
                                <Search className="ml-4 w-6 h-6 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search for guides, PDFs, or materials..."
                                    className="w-full bg-transparent py-4 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none font-bold text-lg"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="container mx-auto px-4 pb-32">
                    {isLoading ? (
                        <ResourcesGridSkeleton />
                    ) : filteredResources.length === 0 ? (
                        <div className="text-center py-24 bg-white border-2 border-dashed border-slate-200 rounded-[3rem]">
                            <div className="text-6xl mb-4">🙊</div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">No resources found</h3>
                            <p className="text-slate-500 font-bold mb-8">Try choosing a different exam section or search query.</p>
                            <Button onClick={() => setSearchQuery('')} variant="outline" className="rounded-2xl border-2 font-black uppercase text-xs tracking-widest">
                                Clear Search
                            </Button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredResources.map((resource, idx) => (
                                <motion.div
                                    key={resource.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * idx }}
                                >
                                    <div className="group flex flex-col bg-white border-2 border-slate-100 rounded-[3rem] p-8 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2 h-full">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border-2 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                                <FileText className="w-7 h-7" />
                                            </div>
                                            <span className="bg-slate-50 text-slate-400 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                MATERIAL
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {format(new Date(resource.created_at), 'MMM dd, yyyy')}
                                        </div>

                                        <h2 className="text-2xl font-black text-slate-900 leading-tight mb-4 group-hover:text-indigo-600 transition-colors">
                                            {resource.title}
                                        </h2>

                                        <p className="text-slate-500 leading-relaxed font-bold text-sm mb-10 line-clamp-3">
                                            {resource.description || "Grab your study buddy and dive into this essential material for your exam prep!"}
                                        </p>

                                        <div className="mt-auto">
                                            <Button
                                                className="w-full bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl h-14 font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 group/btn"
                                                asChild
                                            >
                                                <a href={getProxiedUrl(resource.file_url)} target="_blank" rel="noopener noreferrer">
                                                    <span>Download File</span>
                                                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-indigo-600 transition-all">
                                                        <Download className="w-4 h-4" />
                                                    </div>
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="container mx-auto px-4 pb-32">
                    {/* Sharing Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-20 py-16 px-8 bg-white border-2 border-slate-100 rounded-[3rem] text-center shadow-xl shadow-indigo-500/5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                                Did you find this helpful? 🎒
                            </h2>
                            <p className="text-slate-500 font-bold mb-10 text-lg">
                                Share the magic with your study buddies!
                            </p>

                            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                                {[
                                    { name: 'WhatsApp', icon: MessageCircle, color: 'hover:bg-[#25D366]', url: `https://api.whatsapp.com/send?text=Check out these awesome study resources on Italostudy! ${window.location.href}` },
                                    { name: 'Instagram', icon: Instagram, color: 'hover:bg-[#E4405F]', action: 'copy' },
                                    { name: 'Facebook', icon: Facebook, color: 'hover:bg-[#1877F2]', url: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}` },
                                    { name: 'Twitter', icon: Twitter, color: 'hover:bg-[#1DA1F2]', url: `https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out these awesome study resources on Italostudy!` },
                                    { name: 'Reddit', icon: MessageSquare, color: 'hover:bg-[#FF4500]', url: `https://www.reddit.com/submit?url=${window.location.href}&title=Study Resources for Italostudy` },
                                    { name: 'Quora', icon: HelpCircle, color: 'hover:bg-[#B92B27]', url: `https://www.quora.com/share?url=${window.location.href}` },
                                    { name: 'Copy Link', icon: LinkIcon, color: 'hover:bg-slate-900', action: 'copy' },
                                ].map((platform) => (
                                    <motion.button
                                        key={platform.name}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            if (platform.action === 'copy') {
                                                navigator.clipboard.writeText(window.location.href);
                                                toast({
                                                    title: "Link Copied! ✨",
                                                    description: platform.name === 'Instagram' ? "Paste it in your bio or DM it to friends!" : "Share it anywhere!",
                                                });
                                            } else if (platform.url) {
                                                window.open(platform.url, '_blank');
                                            }
                                        }}
                                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest transition-all ${platform.color} hover:text-white hover:border-transparent group/btn`}
                                    >
                                        <platform.icon className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                                        {platform.name}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
