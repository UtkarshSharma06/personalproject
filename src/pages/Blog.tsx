import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import BlogHeader from '@/components/blog/BlogHeader';
import BlogCard from '@/components/blog/BlogCard';
import SEO from '@/components/SEO';
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
import Footer from '@/components/Footer';
import { BlogSkeleton } from '@/components/SkeletonLoader';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    featured_image: string;
    published_at: string;
    created_at: string;
    blog_categories?: {
        id: string;
        name: string;
        slug: string;
    };
}

export default function Blog() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const POSTS_PER_PAGE = 15;
    const { toast } = useToast();
    const navigate = useNavigate();

    const filteredPosts = posts.filter(post => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = (
            (post.title?.toLowerCase() || '').includes(query) ||
            (post.excerpt?.toLowerCase() || '').includes(query)
        );

        const matchesCategory = selectedCategory === 'all' ||
            (post.blog_categories?.slug === selectedCategory);

        return matchesSearch && matchesCategory;
    });

    // Pagination logic
    const isExtract = window.location.search.includes('extract=true');
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const currentPosts = isExtract ? filteredPosts : filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    useEffect(() => {
        fetchPosts();
        fetchCategories();
    }, []);

    // Track Zero Result Searches
    useEffect(() => {
        if (searchQuery && searchQuery.length >= 3 && !isLoading && filteredPosts.length === 0) {
            // Tracking removed
        }
    }, [searchQuery, filteredPosts.length, selectedCategory, isLoading]);

    // Reset to page 1 when search or category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('blog_categories')
                .select('id, name, slug')
                .order('name', { ascending: true });

            if (error) {
                console.error('Error fetching categories:', error);
                return;
            }

            if (data) {
                setCategories(data);
            }
        } catch (err) {
            console.error('Unexpected error fetching categories:', err);
        }
    };

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select(`
                    *,
                    blog_categories (
                        id,
                        name,
                        slug
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching blog posts:', error);
                return;
            }

            if (data) {
                console.log('Fetched posts:', data);
                setPosts(data as any);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to get emoji for category
    const getCategoryEmoji = (slug: string): string => {
        const emojiMap: Record<string, string> = {
            'exams': '📝',
            'life-abroad': '🌍',
            'study-tips': '💡',
            'imat': '🏥',
            'tolc': '🎓'
        };
        return emojiMap[slug] || '📌';
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail || !newsletterEmail.includes('@')) {
            toast({ title: "Valid email required", variant: "destructive" });
            return;
        }

        setIsSubscribing(true);
        try {
            const { error } = await supabase
                .from('marketing_leads' as any)
                .insert({
                    email: newsletterEmail,
                    source: 'blog_newsletter',
                    meta_data: {
                        page: 'blog_index'
                    }
                });

            if (error) throw error;

            toast({
                title: "You're in! ✨",
                description: "Welcome to the inner circle. Fresh study magic is coming your way!",
            });
            setNewsletterEmail('');
        } catch (error: any) {
            console.error('Newsletter error:', error);
            toast({
                title: "Oops!",
                description: "Couldn't sign you up just yet. Please try again!",
                variant: "destructive"
            });
        } finally {
            setIsSubscribing(false);
        }
    };

    return (
        <Layout showHeader={false}>
            <SEO
                title="Study Abroad Tips & Exam Guides | ItaloStudy Blog"
                description="Expert tips for CEnT-S, IMAT, SAT, and IELTS. Read our guides on studying in Italy and Europe, exam preparation secrets, and student life abroad."
                keywords="IMAT preparation, IMAT free practice tests, IMAT past papers online, IMAT study guide, IMAT exam tips, IMAT preparation Italy, CEnT-S preparation, CEnT-S free practice, CEnT-S exam guide, CEnT-S past papers, SAT preparation free, SAT practice tests online, SAT study guide free, SAT exam tips, SAT preparation for international students, IELTS preparation free, IELTS practice tests online, IELTS study guide free, IELTS exam tips, IELTS preparation for study abroad, study abroad Italy, free study abroad preparation, international university admissions, Italy medical school admissions, study abroad exam prep, best universities in Italy for medicine, how to apply to Italian universities, study abroad scholarships Italy, study abroad entrance exams, study abroad preparation platform, free exam preparation website, online exam practice free, international exam preparation, global student admissions support, exam prep made simple, free study resources online, online learning for exams, exam success tips, best exam preparation platform, free exam prep for students, how to prepare for IMAT exam free, best free IMAT practice tests online, free SAT preparation for Indian students, IELTS preparation for beginners free, CEnT-S exam preparation step by step, IMAT exam preparation for medical school Italy, SAT preparation tips for international students, IELTS free resources for study abroad, CEnT-S preparation for global students, IMAT exam preparation made simple, Italian university admissions guide, free admissions support Italy, international student admissions Italy, medical school entrance exam Italy, study abroad admissions simplified, how to apply for IMAT exam, admissions preparation for global students, Italy medical school entrance exam prep, international admissions preparation free, study abroad admissions platform, free IMAT preparation online, free SAT practice tests, free IELTS practice tests, free CEnT-S exam prep, study abroad exam preparation free, best free exam prep website, online study abroad preparation free, free exam prep for medical students, admissions support for international students, free exam prep made easy, IMAT blog preparation tips, SAT blog study guide, IELTS blog free resources, CEnT-S blog exam tips, study abroad blog Italy, medical school blog Italy admissions, free exam prep blog, international student blog admissions, study abroad blog prep, global student blog resources, IMAT vs SAT preparation, IELTS vs TOEFL preparation free, CEnT-S vs IMAT exam guide, SAT vs ACT preparation free, study abroad vs local admissions, free exam prep vs paid courses, IMAT exam difficulty guide, SAT exam difficulty tips, IELTS exam difficulty explained, CEnT-S exam difficulty guide, join free IMAT preparation, sign up free SAT prep, register free IELTS practice, enroll free CEnT-S prep, start free exam preparation today, free exam prep for study abroad students, free IMAT preparation for medical school, free SAT preparation for global students, free IELTS preparation for international admissions, free CEnT-S preparation for study abroad, study abroad blog, IMAT tips, CEnT-S guides, SAT strategy, IELTS preparation blog, study in Italy tips, student life in Europe"
            />
            <div className="min-h-screen bg-[#FAFAFA]">
                <BlogHeader />

                {/* Friendly Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-b from-yellow-50/50 via-white to-transparent pt-8 pb-12 lg:pt-20 lg:pb-24">
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
                            className="text-3xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6"
                        >
                            The Study Blog for <br />
                            <span className="text-indigo-600">IMAT, CEnT-S, TOLC & TIL-I</span> 🎒
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
                                    id="blog-search-input"
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
                        {/* All Posts Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory('all')}
                            data-category="all"
                            className={`blog-category-btn px-6 py-3 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all shadow-sm ${selectedCategory === 'all'
                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
                                }`}
                        >
                            📚 All Posts
                        </motion.button>

                        {/* Dynamic Categories from Database */}
                        {categories.map((cat, idx) => (
                            <motion.button
                                key={cat.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + (idx * 0.1) }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCategory(cat.slug)}
                                data-category={cat.slug}
                                className={`blog-category-btn px-6 py-3 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all shadow-sm ${selectedCategory === cat.slug
                                    ? 'bg-indigo-600 border-indigo-600 text-white'
                                    : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
                                    }`}
                            >
                                {getCategoryEmoji(cat.slug)} {cat.name}
                            </motion.button>
                        ))}

                        {/* Free Resources Button (navigates to different page) */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + (categories.length * 0.1) }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.href = '/resources'}
                            className="px-6 py-3 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all shadow-sm bg-white border-slate-100 text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
                        >
                            🎁 Free Resources
                        </motion.button>
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="container mx-auto px-4 pb-32">
                    {isLoading ? (
                        <BlogSkeleton />
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
                        <div className="relative">
                            {/* Animated Connecting Lines Background */}
                            <svg
                                className="absolute inset-0 w-full h-full pointer-events-none opacity-50 -z-10 hidden md:block"
                                style={{ minHeight: '100%' }}
                            >
                                <defs>
                                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: '#fde047', stopOpacity: 1 }}>
                                            <animate attributeName="stop-color"
                                                values="#fde047;#facc15;#eab308;#fde047"
                                                dur="4s"
                                                repeatCount="indefinite" />
                                        </stop>
                                        <stop offset="100%" style={{ stopColor: '#facc15', stopOpacity: 1 }}>
                                            <animate attributeName="stop-color"
                                                values="#facc15;#eab308;#fde047;#facc15"
                                                dur="4s"
                                                repeatCount="indefinite" />
                                        </stop>
                                    </linearGradient>
                                </defs>

                                {/* Horizontal connecting lines */}
                                {filteredPosts.length > 1 && Array.from({ length: Math.ceil(filteredPosts.length / 3) }).map((_, rowIdx) => (
                                    <g key={`row-${rowIdx}`}>
                                        {/* Line connecting cards in the same row */}
                                        {[0, 1].map(colIdx => {
                                            const cardIndex = rowIdx * 3 + colIdx;
                                            if (cardIndex >= filteredPosts.length - 1) return null;

                                            const x1 = `${(colIdx + 1) * 33.33 - 5}%`;
                                            const x2 = `${(colIdx + 1) * 33.33 + 5}%`;
                                            const y = `${rowIdx * 320 + 140}px`;

                                            return (
                                                <line
                                                    key={`h-${rowIdx}-${colIdx}`}
                                                    x1={x1}
                                                    y1={y}
                                                    x2={x2}
                                                    y2={y}
                                                    stroke="url(#lineGradient)"
                                                    strokeWidth="2"
                                                    strokeDasharray="5,5"
                                                >
                                                    <animate
                                                        attributeName="stroke-dashoffset"
                                                        from="0"
                                                        to="10"
                                                        dur="1s"
                                                        repeatCount="indefinite"
                                                    />
                                                </line>
                                            );
                                        })}

                                        {/* Vertical connecting line to next row */}
                                        {rowIdx < Math.ceil(filteredPosts.length / 3) - 1 && (
                                            <line
                                                x1="50%"
                                                y1={`${rowIdx * 320 + 280}px`}
                                                x2="50%"
                                                y2={`${(rowIdx + 1) * 320}px`}
                                                stroke="url(#lineGradient)"
                                                strokeWidth="2"
                                                strokeDasharray="5,5"
                                            >
                                                <animate
                                                    attributeName="stroke-dashoffset"
                                                    from="0"
                                                    to="10"
                                                    dur="1s"
                                                    repeatCount="indefinite"
                                                />
                                            </line>
                                        )}
                                    </g>
                                ))}
                            </svg>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 relative z-10">
                                {currentPosts.map((post, idx) => (
                                    <motion.div
                                        key={post.id}
                                        className="blog-post-card"
                                        data-title={post.title.toLowerCase()}
                                        data-category={post.blog_categories?.slug || 'none'}
                                        style={isExtract && idx >= POSTS_PER_PAGE ? { display: 'none' } : {}}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * idx }}
                                    >
                                        <BlogCard
                                            id={post.id}
                                            title={post.title}
                                            slug={post.slug}
                                            excerpt={post.excerpt}
                                            featured_image={post.featured_image}
                                            published_at={post.published_at}
                                            created_at={post.created_at}
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div id="blog-pagination" className="mt-16 flex justify-center items-center gap-4 relative z-10" data-total={totalPages}>
                                    <Button
                                        id="blog-prev-btn"
                                        variant="outline"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="rounded-2xl border-2 font-black uppercase text-[10px] tracking-widest h-12 px-6 disabled:opacity-30"
                                    >
                                        Prev
                                    </Button>

                                    <div id="blog-page-numbers" className="flex items-center gap-2">
                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <button
                                                key={i}
                                                data-page={i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`blog-page-btn w-10 h-10 rounded-xl font-black text-xs transition-all ${currentPage === i + 1
                                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                                        : 'bg-white text-slate-400 hover:text-indigo-600 border-2 border-slate-100 hover:border-indigo-100'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <Button
                                        id="blog-next-btn"
                                        variant="outline"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="rounded-2xl border-2 font-black uppercase text-[10px] tracking-widest h-12 px-6 disabled:opacity-30"
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

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
                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto lg:mx-0">
                                <input
                                    type="email"
                                    placeholder="yourname@school.com"
                                    className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-400 font-bold"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    disabled={isSubscribing}
                                    required
                                />
                                <Button
                                    type="submit"
                                    className="bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl px-8 py-4 h-auto font-black uppercase tracking-widest shadow-xl shadow-slate-900/10"
                                    disabled={isSubscribing}
                                >
                                    {isSubscribing ? "Joining..." : "Join us!"}
                                </Button>
                            </form>
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

            </div>
        </Layout>
    );
}
