import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import BlogHeader from '@/components/blog/BlogHeader';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
    Search,
    ArrowRight,
    Calendar,
    Sparkles,
    BookOpen,
    GraduationCap,
    Globe2,
    PenTool
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getProxiedUrl } from '@/lib/url';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    featured_image: string;
    published_at: string;
    created_at: string;
    blog_categories?: {
        name: string;
    };
}

export default function Blog() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching blog posts:', error);
                return;
            }

            if (data) {
                console.log('Fetched posts:', data);
                setPosts(data);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPosts = posts.filter(post => {
        const query = searchQuery.toLowerCase();
        return (
            (post.title?.toLowerCase() || '').includes(query) ||
            (post.excerpt?.toLowerCase() || '').includes(query)
        );
    });

    return (
        <Layout showHeader={false}>
            <div className="min-h-screen bg-[#FAFAFA]">
                <BlogHeader />

                {/* Friendly Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-b from-yellow-50/50 via-white to-transparent pt-24 pb-16 lg:pt-32 lg:pb-24">
                    <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:20px_20px]" />

                    <div className="container relative mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold border border-yellow-200 shadow-sm mb-8 animate-bounce"
                        >
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            Your New Study Secret!
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6"
                        >
                            The Study <span className="text-indigo-600">Corner</span> 🎒
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto font-medium"
                        >
                            Fun guides, simple tips, and all the news you need for your study adventure in Europe! 🇮🇹✨
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
                                    placeholder="Search for tests, tips, or news..."
                                    className="w-full bg-transparent py-4 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none font-bold text-lg"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl px-8 h-12 font-bold uppercase tracking-widest hidden sm:flex">
                                    Search
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Categories Simplified */}
                <div className="container mx-auto px-4 mb-12">
                    <div className="flex flex-wrap justify-center gap-3">
                        {['All Posts', 'Exams', 'Life Abroad'].map((cat, idx) => (
                            <motion.button
                                key={cat}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + (idx * 0.1) }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-3 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-600 transition-all shadow-sm`}
                            >
                                {idx === 0 ? '📚' : idx === 1 ? '📝' : '🌍'} {cat}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="container mx-auto px-4 pb-32">
                    {isLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse bg-white border-2 border-slate-100 rounded-[3rem] p-6">
                                    <div className="aspect-[4/3] bg-slate-50 rounded-[2rem] mb-6" />
                                    <div className="h-4 bg-slate-50 rounded-full w-2/3 mb-4" />
                                    <div className="space-y-2">
                                        <div className="h-3 bg-slate-50 rounded-full w-full" />
                                        <div className="h-3 bg-slate-50 rounded-full w-4/5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-24 bg-white border-2 border-dashed border-slate-200 rounded-[3rem]">
                            <div className="text-6xl mb-4">🙊</div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Oops! No posts found</h3>
                            <p className="text-slate-500 font-bold mb-8">Try searching for something else!</p>
                            <Button onClick={() => setSearchQuery('')} variant="outline" className="rounded-2xl border-2 font-black uppercase text-xs tracking-widest">
                                Show all posts
                            </Button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredPosts.map((post, idx) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * idx }}
                                >
                                    <Link
                                        to={`/blog/${post.slug}`}
                                        className="group flex flex-col bg-white border-2 border-slate-100 rounded-[3rem] p-6 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2 h-full"
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] mb-6 shadow-sm group-hover:shadow-md transition-all">
                                            {post.featured_image ? (
                                                <img
                                                    src={getProxiedUrl(post.featured_image)}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-6xl">
                                                    📖
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm border border-slate-100">
                                                    {(post as any).blog_categories?.name || (post as any).category_name || "Study Tip"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {format(new Date(post.published_at || post.created_at), 'MMM dd, yyyy')}
                                        </div>

                                        <h2 className="text-2xl font-black text-slate-900 leading-tight mb-4 group-hover:text-indigo-600 transition-colors">
                                            {post.title}
                                        </h2>

                                        <p className="text-slate-500 leading-relaxed font-bold text-sm mb-6 line-clamp-2">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
                                            Learn more
                                            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Fun Feature Section */}
                <div className="container mx-auto px-4 pb-32">
                    <div className="bg-white border-2 border-slate-100 rounded-[4rem] p-8 lg:p-20 flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative">
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-400 opacity-10 rounded-full -mr-32 -mb-32 blur-3xl pointer-events-none" />
                        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-400 opacity-10 rounded-full -ml-32 -mt-32 blur-3xl pointer-events-none" />

                        <div className="flex-1 text-center lg:text-left relative z-10">
                            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
                                Never miss a <span className="text-pink-500">spark</span>! ✨
                            </h2>
                            <p className="text-xl text-slate-600 font-bold mb-10 leading-relaxed">
                                Subscribe to our weekly newsletter for the freshest study tips and exam updates. No spam, just pure student magic!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto lg:mx-0">
                                <input
                                    type="email"
                                    placeholder="yourname@school.com"
                                    className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-400 font-bold"
                                />
                                <Button className="bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl px-8 py-4 h-auto font-black uppercase tracking-widest shadow-xl shadow-slate-900/10">
                                    Join us!
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 hidden lg:grid grid-cols-2 gap-4 relative z-10">
                            <div className="p-8 bg-indigo-50 rounded-[3rem] text-center rotate-3 flex flex-col items-center gap-4 border-2 border-indigo-100">
                                <GraduationCap className="w-12 h-12 text-indigo-500" />
                                <div className="font-black text-indigo-600 uppercase tracking-widest text-xs">Exams</div>
                            </div>
                            <div className="p-8 bg-pink-50 rounded-[3rem] text-center -rotate-3 flex flex-col items-center gap-4 border-2 border-pink-100 mt-12">
                                <Globe2 className="w-12 h-12 text-pink-500" />
                                <div className="font-black text-pink-600 uppercase tracking-widest text-xs">Italy</div>
                            </div>
                            <div className="p-8 bg-yellow-50 rounded-[3rem] text-center -rotate-6 flex flex-col items-center gap-4 border-2 border-yellow-100">
                                <PenTool className="w-12 h-12 text-yellow-500" />
                                <div className="font-black text-yellow-600 uppercase tracking-widest text-xs">Guides</div>
                            </div>
                            <div className="p-8 bg-emerald-50 rounded-[3rem] text-center rotate-6 flex flex-col items-center gap-4 border-2 border-emerald-100 mt-12">
                                <BookOpen className="w-12 h-12 text-emerald-500" />
                                <div className="font-black text-emerald-600 uppercase tracking-widest text-xs">Books</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </Layout >
    );
}
