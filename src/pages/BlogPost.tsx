import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import BlogHeader from '@/components/blog/BlogHeader';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
    Calendar,
    Share2,
    Facebook,
    Twitter,
    Linkedin,
    Clock,
    User,
    ChevronLeft,
    Sparkles,
    MessageCircle,
    Instagram,
    MessageSquare,
    HelpCircle,
    Link as LinkIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';
// @ts-ignore
import renderMathInElement from 'katex/dist/contrib/auto-render';
import { getProxiedUrl } from '@/lib/url';

interface BlogPost {
    id: string;
    title: string;
    content: any;
    excerpt: string;
    featured_image: string;
    published_at: string;
    created_at: string;
    status: string;
    author_id: string;
}

export default function BlogPost() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const contentRef = (node: HTMLDivElement | null) => {
        if (node && post) {
            renderMathInElement(node, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            });
        }
    };

    useEffect(() => {
        fetchPost();
    }, [slug]);

    const fetchPost = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !data) {
            navigate('/blog');
            return;
        }

        setPost(data);
        setIsLoading(false);

        // Increment view count safely
        await supabase.rpc('increment_blog_view', { post_id: data.id });
    };

    if (isLoading) {
        return (
            <Layout showHeader={false}>
                <BlogHeader />
                <div className="min-h-screen bg-white container mx-auto px-4 py-20">
                    <div className="max-w-3xl mx-auto animate-pulse">
                        <div className="h-4 bg-slate-50 rounded w-24 mb-8" />
                        <div className="h-12 bg-slate-100 rounded-[2rem] w-full mb-4" />
                        <div className="h-12 bg-slate-100 rounded-[2rem] w-2/3 mb-12" />
                        <div className="aspect-video bg-slate-50 rounded-[3rem] mb-12" />
                    </div>
                </div>
            </Layout>
        );
    }

    if (!post) return null;

    return (
        <Layout showHeader={false}>
            <SEO
                title={`${post.title} | ItaloStudy Blog`}
                description={post.excerpt}
                image={post.featured_image ? getProxiedUrl(post.featured_image) : undefined}
                type="article"
            />
            <div className="min-h-screen bg-[#FAFAFA] pb-32">
                <BlogHeader />

                {/* Simplified Header / Back Button */}
                <div className="container mx-auto px-4 py-8 lg:py-12">
                    <Link
                        to="/blog"
                        className="group inline-flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1, x: -5 }}
                            className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </motion.div>
                        Back to Blog
                    </Link>
                </div>

                <article className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto bg-white border-2 border-slate-100 rounded-[3rem] p-8 lg:p-16 shadow-xl shadow-slate-200/20"
                    >
                        {/* Article Meta */}
                        <div className="flex items-center gap-3 mb-8">
                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-yellow-200">
                                ✨ Pro Tip
                            </span>
                            <div className="h-4 w-[1px] bg-slate-100 mx-2" />
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <Calendar className="w-3.5 h-3.5" />
                                {format(new Date(post.published_at || post.created_at), 'MMMM dd, yyyy')}
                            </div>
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-8">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 pb-12 mb-12 border-b-2 border-dashed border-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold border-2 border-indigo-100">
                                    <User className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Admissions Expert</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                                <Clock className="w-4 h-4" />
                                5 min read
                            </div>
                        </div>

                        {/* Featured Image - Friendly Rounded */}
                        {post.featured_image && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-16 shadow-lg border-4 border-slate-50"
                            >
                                <img
                                    src={getProxiedUrl(post.featured_image)}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        )}

                        {/* Content area */}
                        <div
                            ref={contentRef}
                            className="prose prose-slate max-w-none [&_.katex]:text-lg [&_.katex]:font-serif prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-indigo-600 prose-img:rounded-[2.5rem] prose-img:shadow-xl"
                            style={{
                                fontSize: '16px',
                                lineHeight: '1.6',
                                color: '#000'
                            }}
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                    (() => {
                                        let contentBody = '';
                                        const rawContent = post.content;

                                        if (typeof rawContent === 'object' && rawContent !== null) {
                                            contentBody = rawContent.body || JSON.stringify(rawContent);
                                        } else if (typeof rawContent === 'string') {
                                            try {
                                                // Try to parse if it's a JSON string
                                                const parsed = JSON.parse(rawContent);
                                                contentBody = parsed.body || rawContent;
                                            } catch (e) {
                                                contentBody = rawContent;
                                            }
                                        }

                                        // If it's just plain text, replace newlines with <br />
                                        return contentBody.includes('<')
                                            ? contentBody
                                            : contentBody.replace(/\n/g, '<br />');
                                    })(),
                                    { ADD_ATTR: ['style', 'class', 'target'], ADD_TAGS: ['iframe'] }
                                )
                            }}
                        />

                        {/* Fun Share Box - Designed to match user request */}
                        <div className="mt-20 p-12 rounded-[3.5rem] bg-[#EEF2FF] border-2 border-indigo-100 flex flex-col items-center text-center">
                            <div className="mb-10">
                                <h4 className="text-3xl font-black text-indigo-950 mb-3 flex items-center justify-center gap-3">
                                    Did you find this helpful? 🎒
                                </h4>
                                <p className="text-indigo-600 font-bold text-lg">Share the magic with your study buddies!</p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-4">
                                {[
                                    { name: 'WhatsApp', icon: MessageCircle, color: 'text-[#25D366]', url: `https://api.whatsapp.com/send?text=Check out this amazing study tip on Italostudy! ${window.location.href}` },
                                    { name: 'Instagram', icon: Instagram, color: 'text-[#E4405F]', action: 'copy' },
                                    { name: 'Facebook', icon: Facebook, color: 'text-[#1877F2]', url: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}` },
                                    { name: 'Twitter', icon: Twitter, color: 'text-[#1DA1F2]', url: `https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out this awesome study tip on Italostudy!` },
                                    { name: 'Reddit', icon: MessageSquare, color: 'text-[#FF4500]', url: `https://www.reddit.com/submit?url=${window.location.href}&title=${post.title}` },
                                    { name: 'Quora', icon: HelpCircle, color: 'text-[#B92B27]', url: `https://www.quora.com/share?url=${window.location.href}` },
                                    { name: 'Copy Link', icon: LinkIcon, color: 'text-slate-900', action: 'copy' },
                                ].map((platform) => (
                                    <motion.button
                                        key={platform.name}
                                        whileHover={{ scale: 1.15, y: -8 }}
                                        whileTap={{ scale: 0.9 }}
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
                                        className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg shadow-indigo-100/50 hover:shadow-2xl transition-all duration-300 group"
                                        title={`Share on ${platform.name}`}
                                    >
                                        <platform.icon className={`w-7 h-7 ${platform.color} transition-transform group-hover:scale-110`} />
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </article>

                {/* Simplified Sticky Note CTA */}
                <div className="container mx-auto px-4 mt-20">
                    <motion.div
                        whileHover={{ rotate: 0, scale: 1.02 }}
                        initial={{ rotate: 1 }}
                        className="max-w-3xl mx-auto p-12 bg-yellow-400 rounded-[3rem] shadow-2xl shadow-yellow-500/10 text-center relative overflow-hidden group transition-all duration-500"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />

                        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">Ready to conquer Uni? 🚀</h2>
                        <p className="text-slate-900 font-bold mb-8 text-lg opacity-80">
                            Join thousands of students and start your prep today. It's free!
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to="/auth">
                                <Button className="bg-slate-900 text-white hover:bg-white hover:text-slate-900 rounded-2xl px-10 py-6 h-auto text-sm font-black uppercase tracking-widest transition-all shadow-xl">
                                    Let's Start!
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
