import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import PWNavbar from '@/components/home/PWNavbar';
import SEO from '@/components/SEO';
import { SECONDARY_KEYWORDS } from '@/lib/seo-keywords';
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
    Link as LinkIcon,
    Mail,
    Star,
    MousePointer,
    X,
    Send,
    Youtube,
    DownloadCloud
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';
// @ts-ignore
import renderMathInElement from 'katex/dist/contrib/auto-render';
import { getProxiedUrl } from '@/lib/url';

interface CTAConfig {
    id?: string;
    template: string;
    position: 'top' | 'mid' | 'bottom' | 'sticky';
    headline: string;
    subtext: string;
    buttonText: string;
    buttonLink: string;
    badge?: string;
    emailPlaceholder?: string;
}

interface BlogPost {
    id: string;
    slug?: string;
    title: string;
    content: any;
    excerpt: string;
    featured_image: string;
    published_at: string;
    created_at: string;
    updated_at?: string;
    status: string;
    author_id?: string;
    seo_title?: string;
    meta_description?: string;
    focus_keyword?: string;
    faq_schema?: Array<{ id: string; question: string; answer: string }>;
    cta_config?: CTAConfig | CTAConfig[] | null;
}

// ─── CTA Render Component ──────────────────────────────────────────────────────
function BlogCTA({ config }: { config: CTAConfig }) {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [dismissed, setDismissed] = useState(false);
    const { toast } = useToast();

    const handleNav = () => {
        if (!config.buttonLink) return;
        if (config.buttonLink.startsWith('http')) {
            window.open(config.buttonLink, '_blank');
        } else {
            window.location.href = config.buttonLink;
        }
    };

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail || !newsletterEmail.includes('@')) {
            toast({ title: 'Enter a valid email', variant: 'destructive' });
            return;
        }
        try {
            await (supabase as any).from('marketing_leads').insert({
                email: newsletterEmail,
                source: 'blog_cta_newsletter',
            });
            toast({ title: "You're in! ✨", description: 'Welcome to the ItaloStudy community!' });
            setNewsletterEmail('');
        } catch {
            toast({ title: 'Error', description: 'Try again', variant: 'destructive' });
        }
    };

    if (dismissed) return null;

    // ── Sticky Bottom Bar ──────────────────────────────────────────────
    if (config.template === 'sticky-bar') {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 80, opacity: 0 }}
                    transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-400 shadow-2xl shadow-yellow-500/30 px-6 py-4 flex items-center justify-between gap-4"
                >
                    <p className="font-black text-slate-900 text-sm flex-1 leading-tight">{config.headline}</p>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                            onClick={handleNav}
                            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors"
                        >
                            {config.buttonText || 'Go'}
                        </button>
                        <button
                            onClick={() => setDismissed(true)}
                            className="w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center text-slate-900 hover:bg-yellow-200 transition-colors"
                            aria-label="Dismiss"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // ── Hero Banner ────────────────────────────────────────────────────
    if (config.template === 'hero-banner') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="my-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2.5rem] p-10 text-center shadow-2xl shadow-indigo-500/20 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32" />
                <div className="relative z-10">
                    {config.badge && (
                        <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                            <Star className="w-3 h-3" />
                            {config.badge}
                        </div>
                    )}
                    <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">{config.headline}</h2>
                    {config.subtext && <p className="text-white/80 font-bold text-lg mb-8 max-w-lg mx-auto leading-relaxed">{config.subtext}</p>}
                    <button
                        onClick={handleNav}
                        className="bg-white text-indigo-700 hover:bg-indigo-50 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:scale-105"
                    >
                        {config.buttonText || 'Get Started'}
                    </button>
                </div>
            </motion.div>
        );
    }

    // ── Inline Card ────────────────────────────────────────────────────
    if (config.template === 'inline-card') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="my-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl shadow-emerald-500/20 relative overflow-hidden"
            >
                <div className="flex-1 text-center sm:text-left">
                    {config.badge && (
                        <div className="inline-flex text-[9px] font-black uppercase tracking-widest bg-white/20 border border-white/30 text-white px-3 py-1 rounded-lg mb-3">
                            {config.badge}
                        </div>
                    )}
                    <h3 className="text-xl font-black text-white mb-2">{config.headline}</h3>
                    {config.subtext && <p className="text-white/80 text-sm font-medium">{config.subtext}</p>}
                </div>
                <button
                    onClick={handleNav}
                    className="flex-shrink-0 bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all hover:scale-105"
                >
                    {config.buttonText || 'Try It'}
                </button>
            </motion.div>
        );
    }

    // ── Side Float Widget ──────────────────────────────────────────────
    if (config.template === 'side-widget') {
        return (
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 2, type: 'spring', stiffness: 150 }}
                className="fixed right-4 top-1/2 -translate-y-1/2 z-40 w-44 bg-gradient-to-b from-violet-600 to-purple-700 rounded-[2rem] p-5 text-center shadow-2xl shadow-violet-500/30"
            >
                <button
                    onClick={() => setDismissed(true)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                    aria-label="Dismiss"
                >
                    <X className="w-3 h-3 text-white" />
                </button>
                <Star className="w-8 h-8 text-white/80 mx-auto mb-3" />
                <h3 className="text-sm font-black text-white mb-2 leading-tight">{config.headline}</h3>
                {config.subtext && <p className="text-white/70 text-[10px] font-medium mb-4 leading-snug">{config.subtext}</p>}
                <button
                    onClick={handleNav}
                    className="w-full bg-white text-violet-700 hover:bg-violet-50 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all"
                >
                    {config.buttonText || 'Go'}
                </button>
            </motion.div>
        );
    }

    // ── Newsletter Embed ───────────────────────────────────────────────
    if (config.template === 'newsletter') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="my-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-[2rem] p-8 text-center shadow-xl shadow-pink-500/20"
            >
                <Mail className="w-10 h-10 text-white/80 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-white mb-2">{config.headline}</h3>
                {config.subtext && <p className="text-white/80 font-medium mb-2 text-sm">{config.subtext}</p>}
                {config.badge && <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-5">{config.badge}</p>}
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm mx-auto">
                    <input
                        type="email"
                        value={newsletterEmail}
                        onChange={e => setNewsletterEmail(e.target.value)}
                        placeholder={config.emailPlaceholder || 'your@email.com'}
                        className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-slate-800 border-0 outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button
                        type="submit"
                        className="bg-white text-pink-700 hover:bg-pink-50 px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider flex-shrink-0 transition-all"
                    >
                        {config.buttonText || 'Join'}
                    </button>
                </form>
            </motion.div>
        );
    }

    // ── Minimal Text CTA ──────────────────────────────────────────────
    if (config.template === 'minimal-text') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="my-10 p-6 bg-slate-50 rounded-[1.5rem] border-l-4 border-l-indigo-500"
            >
                <h3 className="text-lg font-black text-slate-900 mb-2">{config.headline}</h3>
                {config.subtext && <p className="text-slate-600 text-sm font-medium mb-3 leading-relaxed">{config.subtext}</p>}
                <button
                    onClick={handleNav}
                    className="text-indigo-600 font-black text-sm underline underline-offset-2 hover:text-indigo-800 transition-colors"
                >
                    {config.buttonText || 'Learn more →'}
                </button>
            </motion.div>
        );
    }

    // ── WhatsApp Group ──────────────────────────────────────────────────
    if (config.template === 'whatsapp-group') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="my-10 bg-[#F0FDF4] border-2 border-[#BBF7D0] rounded-[2rem] p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl shadow-green-500/10"
            >
                <div className="w-16 h-16 rounded-3xl bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-inner">
                    <MessageCircle className="w-8 h-8" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                    {config.badge && (
                        <div className="inline-flex text-[9px] font-black uppercase tracking-widest bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] px-3 py-1 rounded-lg mb-3">
                            {config.badge}
                        </div>
                    )}
                    <h3 className="text-xl font-black text-[#166534] mb-2">{config.headline}</h3>
                    {config.subtext && <p className="text-[#166534]/80 text-sm font-medium">{config.subtext}</p>}
                </div>
                <button
                    onClick={handleNav}
                    className="flex-shrink-0 w-full sm:w-auto bg-[#25D366] text-white hover:bg-[#1DA851] px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/20 hover:scale-105 hover:-translate-y-1"
                >
                    {config.buttonText || 'Join WhatsApp'}
                </button>
            </motion.div>
        );
    }

    // ── Telegram Channel ────────────────────────────────────────────────
    if (config.template === 'telegram-group') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="my-10 bg-[#F0F9FF] border-2 border-[#BAE6FD] rounded-[2rem] p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl shadow-sky-500/10"
            >
                <div className="w-16 h-16 rounded-3xl bg-[#0088CC] text-white flex items-center justify-center flex-shrink-0 shadow-inner">
                    <Send className="w-8 h-8 -ml-1 mt-1" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                    {config.badge && (
                        <div className="inline-flex text-[9px] font-black uppercase tracking-widest bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] px-3 py-1 rounded-lg mb-3">
                            {config.badge}
                        </div>
                    )}
                    <h3 className="text-xl font-black text-[#0369A1] mb-2">{config.headline}</h3>
                    {config.subtext && <p className="text-[#0369A1]/80 text-sm font-medium">{config.subtext}</p>}
                </div>
                <button
                    onClick={handleNav}
                    className="flex-shrink-0 w-full sm:w-auto bg-[#0088CC] text-white hover:bg-[#007AB8] px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-sky-500/20 hover:scale-105 hover:-translate-y-1"
                >
                    {config.buttonText || 'Join Telegram'}
                </button>
            </motion.div>
        );
    }

    // ── YouTube Subscribe ───────────────────────────────────────────────
    if (config.template === 'youtube-subscribe') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="my-10 bg-[#FEF2F2] border-2 border-[#FECACA] rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-red-500/10 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF0000]/5 rounded-full -mr-16 -mt-16 blur-xl" />
                
                <div className="w-24 h-24 rounded-full bg-white shadow-xl shadow-red-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Youtube className="w-12 h-12 text-[#FF0000]" />
                </div>
                <div className="flex-1 text-center md:text-left relative z-10">
                    {config.badge && (
                        <div className="inline-flex text-[10px] font-black uppercase tracking-widest bg-white text-[#FF0000] border border-[#FECACA] px-3 py-1 rounded-full mb-4 shadow-sm">
                            {config.badge}
                        </div>
                    )}
                    <h3 className="text-2xl font-black text-[#991B1B] mb-2">{config.headline}</h3>
                    {config.subtext && <p className="text-[#991B1B]/80 text-sm font-medium max-w-lg">{config.subtext}</p>}
                </div>
                <button
                    onClick={handleNav}
                    className="flex-shrink-0 w-full md:w-auto bg-[#FF0000] text-white hover:bg-[#CC0000] px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-red-500/30 hover:scale-105 hover:-translate-y-1 relative z-10"
                >
                    {config.buttonText || 'Subscribe'}
                </button>
            </motion.div>
        );
    }

    // ── Resource Download ───────────────────────────────────────────────
    if (config.template === 'resource-download') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="my-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-orange-500/20 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                
                <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center flex-shrink-0">
                    <DownloadCloud className="w-12 h-12 text-white drop-shadow-md" />
                </div>
                <div className="flex-1 text-center md:text-left relative z-10">
                    {config.badge && (
                        <div className="inline-flex text-[10px] font-black uppercase tracking-widest bg-white/20 border border-white/30 text-white px-3 py-1.5 rounded-full mb-4">
                            {config.badge}
                        </div>
                    )}
                    <h3 className="text-3xl font-black text-white mb-2 leading-tight">{config.headline}</h3>
                    {config.subtext && <p className="text-white/90 text-sm font-bold max-w-lg">{config.subtext}</p>}
                </div>
                <div className="w-full md:w-auto relative z-10">
                    <button
                        onClick={handleNav}
                        className="w-full md:w-auto bg-white text-orange-600 hover:bg-orange-50 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:scale-105 hover:-translate-y-1"
                    >
                        {config.buttonText || 'Download Free'}
                    </button>
                </div>
            </motion.div>
        );
    }

    return null;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getReadTime(html: string): number {
    if (!html) return 1;
    const text = html.replace(/<[^>]+>/g, ' ');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 230));
}

function splitContentAtMidpoint(html: string): [string, string] {
    if (!html) return ['', ''];
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const children = Array.from(doc.body.children);
    if (children.length < 3) return [html, ''];
    const mid = Math.floor(children.length / 2);
    const first = children.slice(0, mid).map(c => c.outerHTML).join('');
    const second = children.slice(mid).map(c => c.outerHTML).join('');
    return [first, second];
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function BlogPostPage() {
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

        setPost(data as any);
        setIsLoading(false);

        // Increment view count safely
        await (supabase as any).rpc('increment_blog_view', { post_id: data.id });
    };

    if (isLoading) {
        return (
            <Layout showHeader={false}>
                <PWNavbar />
                <div className="min-h-screen bg-white container mx-auto px-4 pt-[100px] pb-20">
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

    // ─── Computed Values ───────────────────────────────────────────────
    const rawContent = (() => {
        const recursiveUnwrap = (val: any): string => {
            if (!val) return '';
            if (typeof val === 'object') {
                return val.body ? recursiveUnwrap(val.body) : JSON.stringify(val);
            }
            if (typeof val === 'string') {
                try {
                    const trimmed = val.trim();
                    if (trimmed.startsWith('{') && trimmed.includes('"body"')) {
                        const parsed = JSON.parse(val);
                        return recursiveUnwrap(parsed);
                    }
                } catch { }
                return val;
            }
            return String(val);
        };
        const body = recursiveUnwrap(post.content);
        return body.includes('<') ? body : body.replace(/\n/g, '<br />');
    })();

    const isCustomHtml = (() => {
        if (!post.content) return false;
        if (typeof post.content === 'object' && post.content.is_custom_html) return true;
        if (typeof post.content === 'string') {
            try {
                const parsed = JSON.parse(post.content);
                return !!parsed.is_custom_html;
            } catch(e) {}
        }
        return false;
    })();

    const readTime = getReadTime(rawContent);
    const ctas: CTAConfig[] = Array.isArray(post.cta_config)
        ? post.cta_config
        : (post.cta_config ? [post.cta_config as CTAConfig] : []);

    const hasMidCta = ctas.some(cta => cta.position === 'mid' && cta.template !== 'side-widget');
    const [contentFirst, contentSecond] = hasMidCta
        ? splitContentAtMidpoint(rawContent)
        : [rawContent, ''];

    const publishedDate = post.published_at || post.created_at;
    const postUrl = `https://italostudy.com/blog/${post.slug || slug}`;

    // ─── JSON-LD Schemas ───────────────────────────────────────────────
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.seo_title || post.title,
        "description": post.meta_description || post.excerpt,
        "image": post.featured_image ? getProxiedUrl(post.featured_image) : 'https://italostudy.com/logo.webp',
        "author": {
            "@type": "Organization",
            "name": "ItaloStudy",
            "url": "https://italostudy.com"
        },
        "publisher": {
            "@type": "Organization",
            "name": "ItaloStudy",
            "logo": {
                "@type": "ImageObject",
                "url": "https://italostudy.com/logo.webp"
            }
        },
        "datePublished": publishedDate,
        "dateModified": post.updated_at || publishedDate,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": postUrl
        },
        "wordCount": rawContent.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length,
        "timeRequired": `PT${readTime}M`
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://italostudy.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://italostudy.com/blog"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": postUrl
            }
        ]
    };

    const faqSchemaObj = post.faq_schema && post.faq_schema.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": post.faq_schema
            .filter(faq => faq.question && faq.answer)
            .map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
    } : undefined;

    // FAQ schema is injected BOTH here (via react-helmet for JS crawlers like Googlebot)
    // AND in the SSR function (for non-JS crawlers like Bing bot). react-helmet deduplicates
    // on hydration so there is NO duplicate — the client-side version simply replaces the
    // server-injected one. Without it here, Google Search Console FAQ enhancements don't show
    // because Googlebot reads the final JS-rendered DOM, not the raw HTML.
    const allSchemas = faqSchemaObj
        ? [articleSchema, breadcrumbSchema, faqSchemaObj]
        : [articleSchema, breadcrumbSchema];

    const renderInlineCtas = (position: 'top' | 'mid' | 'bottom') => {
        return ctas
            .filter(cta => cta.position === position && cta.template !== 'side-widget')
            .map((cta, i) => <BlogCTA key={cta.id || i} config={cta} />);
    };

    const renderOverlayCtas = () => {
        return ctas
            .filter(cta => cta.position === 'sticky' || cta.template === 'side-widget')
            .map((cta, i) => <BlogCTA key={cta.id || i} config={cta} />);
    };

    const AutoInjectedCTAs = () => {
        const [targets, setTargets] = useState<{top: HTMLElement | null, mid: HTMLElement | null, bottom: HTMLElement | null}>({top: null, mid: null, bottom: null});
        const [mounted, setMounted] = useState(false);
        
        useEffect(() => {
            setMounted(true);
            const wrapper = document.getElementById('custom-html-wrapper');
            if (!wrapper) return;

            // Try to find user-defined placeholders
            let topTarget = document.getElementById('cta-top');
            let midTarget = document.getElementById('cta-mid');
            let bottomTarget = document.getElementById('cta-bottom');

            const headings = Array.from(wrapper.querySelectorAll('h2'));
            const hasTopCta = ctas.some(c => c.position === 'top' && c.template !== 'sticky-bar' && c.template !== 'side-widget');
            const hasMidCta = ctas.some(c => c.position === 'mid' && c.template !== 'sticky-bar' && c.template !== 'side-widget');
            const hasBottomCta = ctas.some(c => c.position === 'bottom' && c.template !== 'sticky-bar' && c.template !== 'side-widget');

            // Auto-inject Top CTA before the 1st H2 if no placeholder exists
            if (!topTarget && headings.length > 0) {
                topTarget = document.createElement('div');
                if (hasTopCta) topTarget.className = "container mx-auto px-4 my-10 relative z-20";
                headings[0].parentNode?.insertBefore(topTarget, headings[0]);
            }
            
            // Auto-inject Mid CTA before the middle H2 if no placeholder exists and there are enough headings
            if (!midTarget && headings.length >= 2) {
                midTarget = document.createElement('div');
                if (hasMidCta) midTarget.className = "container mx-auto px-4 my-12 relative z-20";
                const midIndex = Math.floor(headings.length / 2);
                headings[midIndex].parentNode?.insertBefore(midTarget, headings[midIndex]);
            }

            // Auto-inject Bottom CTA at the very end of the content
            if (!bottomTarget) {
                bottomTarget = document.createElement('div');
                if (hasBottomCta) bottomTarget.className = "container mx-auto px-4 mt-16 relative z-20";
                wrapper.appendChild(bottomTarget);
            }

            setTargets({ top: topTarget, mid: midTarget, bottom: bottomTarget });

        }, [rawContent]);

        if (!mounted) return null;
        
        return (
            <>
                {targets.top && createPortal(renderInlineCtas('top'), targets.top)}
                {targets.mid && createPortal(renderInlineCtas('mid'), targets.mid)}
                {targets.bottom && createPortal(renderInlineCtas('bottom'), targets.bottom)}
                
                {/* Fallback for explicit ID placeholders like <div id="cta-123"> */}
                {ctas.map((cta, i) => {
                    if (!cta.id) return null;
                    const targetElement = document.getElementById(`cta-${cta.id}`);
                    if (targetElement) {
                        return createPortal(<BlogCTA key={cta.id || i} config={cta} />, targetElement);
                    }
                    return null;
                })}
            </>
        );
    };

    return (
        <Layout showHeader={false}>
            <SEO
                title={post.seo_title || post.title || 'Blog Post | ItaloStudy'}
                description={post.meta_description || post.excerpt || ''}
                keywords={[post.focus_keyword, SECONDARY_KEYWORDS].filter(Boolean).join(', ')}
                image={post.featured_image ? getProxiedUrl(post.featured_image) : undefined}
                type="article"
                schemas={allSchemas}
                publishedTime={publishedDate}
                modifiedTime={post.updated_at || publishedDate}
                url={postUrl}
                canonicalUrl={postUrl}
            />
            <div className={`w-full bg-[#FAFAFA] pt-[80px] ${isCustomHtml ? 'pb-0' : 'pb-32'}`}>
                <PWNavbar />

                {/* Sticky & Side Widget CTAs */}
                {renderOverlayCtas()}

                {isCustomHtml ? (
                    <div className="w-full relative" id="custom-html-wrapper">
                        <div 
                            ref={contentRef}
                            dangerouslySetInnerHTML={{ __html: rawContent }} 
                        />
                        <AutoInjectedCTAs />
                    </div>
                ) : (
                <>
                    {/* Back Button */}
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
                                {format(new Date(publishedDate), 'MMMM dd, yyyy')}
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
                                <span className="text-sm font-black text-slate-900 uppercase tracking-widest">ITALOSTUDY TEAM</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                                <Clock className="w-4 h-4" />
                                {readTime} min read
                            </div>
                        </div>

                        {/* Top CTA */}
                        {renderInlineCtas('top')}

                        {/* Featured Image */}
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

                        {/* Content — first half */}
                        <div
                            ref={contentRef}
                            className="prose prose-slate max-w-none [&_.katex]:text-lg [&_.katex]:font-serif prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-indigo-600 prose-img:rounded-[2.5rem] prose-img:shadow-xl"
                            style={{ fontSize: '16px', lineHeight: '1.6', color: '#000' }}
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                    hasMidCta ? contentFirst : rawContent,
                                    { ADD_ATTR: ['style', 'class', 'target'], ADD_TAGS: ['iframe'] }
                                )
                            }}
                        />

                        {/* Mid-article CTA */}
                        {renderInlineCtas('mid')}

                        {/* Content — second half */}
                        {hasMidCta && contentSecond && (
                            <div
                                className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-indigo-600 prose-img:rounded-[2.5rem] prose-img:shadow-xl"
                                style={{ fontSize: '16px', lineHeight: '1.6', color: '#000' }}
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(contentSecond, { ADD_ATTR: ['style', 'class', 'target'], ADD_TAGS: ['iframe'] })
                                }}
                            />
                        )}

                        {/* Bottom CTA */}
                        {renderInlineCtas('bottom')}

                        {/* FAQ Section */}
                        {post.faq_schema && post.faq_schema.length > 0 && (
                            <div className="mt-20 space-y-6">
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl font-black text-slate-900 mb-3">Frequently Asked Questions</h2>
                                    <p className="text-slate-600 font-bold">Everything you need to know about this topic</p>
                                </div>
                                <div className="space-y-4">
                                    {post.faq_schema.map((faq, index) => (
                                        <details
                                            key={faq.id || index}
                                            className="group bg-white border-2 border-slate-100 rounded-[2rem] overflow-hidden hover:border-indigo-200 transition-all"
                                        >
                                            <summary className="cursor-pointer p-6 font-black text-lg text-slate-900 flex items-center justify-between list-none">
                                                <span className="flex-1 pr-4">{faq.question}</span>
                                                <svg
                                                    className="w-6 h-6 text-indigo-600 transition-transform group-open:rotate-180"
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </summary>
                                            <div className="px-6 pb-6 text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-4">
                                                {faq.answer}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Share Box */}
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
                </>
                )}

                {/* Default sticky CTA (yellow note) - shown only when no custom CTA is configured */}
                {!ctas.length && (
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
                                <a href="https://app.italostudy.com/auth">
                                    <Button className="bg-slate-900 text-white hover:bg-white hover:text-slate-900 rounded-2xl px-10 py-6 h-auto text-sm font-black uppercase tracking-widest transition-all shadow-xl">
                                        Let's Start!
                                    </Button>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
