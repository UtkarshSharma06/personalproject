import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
    Plus,
    Trash2,
    Loader2,
    Pencil,
    Save,
    Image as ImageIcon,
    Sparkles,
    Eye
} from 'lucide-react';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';
import 'katex/dist/contrib/auto-render';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: any;
    status: 'draft' | 'published';
    featured_image: string;
    published_at: string;
    created_at: string;
}

export default function BlogManager() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        status: 'draft',
        featured_image: ''
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast({
                title: "Error fetching posts",
                description: error.message,
                variant: "destructive",
            });
        } else {
            setPosts(data || []);
        }
        setIsLoading(false);
    };

    const handleSavePost = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const postData = {
            title: formData.title,
            slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            excerpt: formData.excerpt,
            content: { body: formData.content },
            status: formData.status,
            featured_image: formData.featured_image,
            published_at: formData.status === 'published' ? new Date().toISOString() : null
        };

        console.log('Saving Post Data:', postData);
        console.log('Content Body:', postData.content.body);

        const { error } = editingPost
            ? await supabase
                .from('blog_posts')
                .update(postData)
                .eq('id', editingPost.id)
            : await supabase
                .from('blog_posts')
                .insert([postData]);

        if (error) {
            toast({
                title: "Failed to save post",
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: editingPost ? "Post Updated! ✨" : "Yay! Post Created! 🎉",
                description: "Your study secret has been saved.",
            });
            handleResetForm();
            fetchPosts();
        }
        setIsSubmitting(false);
    };

    const handleResetForm = () => {
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            status: 'draft',
            featured_image: ''
        });
        setEditingPost(null);
    };

    const handleEditClick = (post: BlogPost) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || '',
            content: typeof post.content === 'object' && post.content?.body
                ? post.content.body
                : typeof post.content === 'string'
                    ? post.content
                    : '',
            status: post.status,
            featured_image: post.featured_image || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeletePost = async (id: string) => {
        if (!confirm("Are you sure you want to delete this magic? 🙊")) return;

        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', id);

        if (error) {
            toast({
                title: "Error deleting post",
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Post Deleted 🗑️",
            });
            fetchPosts();
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Editor Form */}
                <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-800">
                        {editingPost ? <Pencil className="w-6 h-6 text-indigo-500" /> : <Sparkles className="w-6 h-6 text-yellow-500" />}
                        {editingPost ? 'Edit Your Masterpiece' : 'Write Something Fun!'}
                    </h3>
                    <form onSubmit={handleSavePost} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="post-title" className="font-bold text-slate-500 uppercase tracking-widest text-xs ml-1">Catchy Title</Label>
                            <Input
                                id="post-title"
                                placeholder="How to ace the IMAT without crying..."
                                className="rounded-2xl border-2 border-slate-50 py-6 px-6 font-bold text-lg focus:border-indigo-400 focus:ring-0 transition-all"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="post-slug" className="font-bold text-slate-500 uppercase tracking-widest text-xs ml-1">URL Slug</Label>
                                <Input
                                    id="post-slug"
                                    placeholder="study-italy-tips"
                                    className="rounded-2xl border-2 border-slate-50 py-6 px-6 font-bold focus:border-indigo-400 focus:ring-0 transition-all"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="post-status" className="font-bold text-slate-500 uppercase tracking-widest text-xs ml-1">Live Status</Label>
                                <select
                                    id="post-status"
                                    className="flex h-[52px] w-full rounded-2xl border-2 border-slate-50 bg-background px-6 py-2 text-sm font-bold focus:border-indigo-400 focus:ring-0 transition-all"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                                >
                                    <option value="draft">📁 Draft (Hidden)</option>
                                    <option value="published">🚀 Published (Live!)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="post-image" className="font-bold text-slate-500 uppercase tracking-widest text-xs ml-1">Cool Header Image URL</Label>
                            <Input
                                id="post-image"
                                placeholder="Paste an image link here..."
                                className="rounded-2xl border-2 border-slate-50 py-6 px-6 font-bold focus:border-indigo-400 focus:ring-0 transition-all"
                                value={formData.featured_image}
                                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="post-excerpt" className="font-bold text-slate-500 uppercase tracking-widest text-xs ml-1">Short Preview</Label>
                            <Textarea
                                id="post-excerpt"
                                placeholder="A quick summary to grab attention..."
                                className="rounded-2xl border-2 border-slate-50 py-4 px-6 font-bold focus:border-indigo-400 focus:ring-0 transition-all min-h-[100px]"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="post-content" className="font-bold text-slate-500 uppercase tracking-widest text-xs ml-1">The Full Story (Rich Text & Math)</Label>
                            <div className="rounded-2xl border-2 border-slate-50 overflow-hidden focus-within:border-indigo-400 focus-within:ring-0 transition-all">
                                <Editor
                                    apiKey="tmv2dp3b1x6h8p2mcuucu51vh0g9kdkoa6xd6fh5cdnz66lh"
                                    value={formData.content}
                                    onEditorChange={(content) => {
                                        console.log('TinyMCE Content:', content);
                                        setFormData({ ...formData, content });
                                    }}
                                    init={{
                                        height: 500,
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                            'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic forecolor backcolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help | code',
                                        content_style: 'body { font-family:Inter,sans-serif; font-size:16px }',
                                        placeholder: "Write your hearts out! Use $...$ for inline math...",

                                        // Preserve ALL HTML and styles
                                        verify_html: false,
                                        cleanup: false,
                                        convert_urls: false,
                                        remove_trailing_brs: false,

                                        // Allow all elements and attributes
                                        extended_valid_elements: '*[*]',
                                        valid_elements: '*[*]',
                                        valid_styles: '*[*]',

                                        // Paste configuration
                                        paste_as_text: false,
                                        paste_webkit_styles: 'all',
                                        paste_retain_style_properties: 'all',
                                        paste_remove_styles_if_webkit: false,
                                        paste_merge_formats: false,

                                        // Don't strip any styles
                                        invalid_styles: {},
                                        allow_html_in_named_anchor: true,

                                        // Force root block to preserve formatting
                                        forced_root_block: 'p'
                                    }}
                                />
                            </div>
                            <p className="text-xs text-slate-400 font-bold px-2">
                                Pro Tip: Wrap math formulas in single dollar signs (e.g. $E=mc^2$) for inline math.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl h-16 font-black uppercase tracking-widest shadow-xl shadow-indigo-500/10 transition-all"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                                {editingPost ? 'Save Updates' : 'Share with Students!'}
                            </Button>
                            {editingPost && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-2xl h-16 px-8 border-2 font-bold"
                                    onClick={handleResetForm}
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>

                    {/* Live Preview Card */}
                    <div className="mt-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] p-8">
                        <h4 className="font-black text-slate-400 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                            <Eye className="w-4 h-4" /> Live Preview
                        </h4>
                        <div
                            className="[&_.katex]:text-lg bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
                            style={{
                                fontSize: '16px',
                                lineHeight: '1.6',
                                color: '#000'
                            }}
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                    formData.content.includes('<')
                                        ? formData.content
                                        : formData.content.replace(/\n/g, '<br />'),
                                    { ADD_ATTR: ['style', 'class', 'target'], ADD_TAGS: ['iframe'] }
                                )
                            }}
                            ref={(node) => {
                                if (node) {
                                    // @ts-ignore
                                    if (window.renderMathInElement) {
                                        // @ts-ignore
                                        window.renderMathInElement(node, {
                                            delimiters: [
                                                { left: '$$', right: '$$', display: true },
                                                { left: '$', right: '$', display: false }
                                            ],
                                            throwOnError: false
                                        });
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Posts List */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-black flex items-center gap-3 text-slate-800">
                        <ImageIcon className="w-6 h-6 text-pink-500" /> All Your Secrets
                    </h3>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <Loader2 className="w-8 h-8 animate-spin mb-4" />
                            <p className="font-bold">Gathering your notes...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-24 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                            <p className="text-slate-400 font-bold">Nothing here yet. Time to write! ✍️</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {posts.map((post) => (
                                <div key={post.id} className="bg-white border-2 border-slate-100 rounded-[2rem] p-4 flex items-center justify-between group hover:border-indigo-100 transition-all shadow-sm">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex-shrink-0 overflow-hidden border-2 border-slate-50 group-hover:border-indigo-50 transition-all">
                                            {post.featured_image ? (
                                                <img src={post.featured_image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl">
                                                    🎒
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{post.title}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${post.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'
                                                    }`}>
                                                    {post.status}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400">
                                                    {format(new Date(post.created_at), 'MMM dd')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link to={`/blog/${post.slug}`} target="_blank">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="rounded-xl w-10 h-10 hover:bg-slate-50"
                                            >
                                                <Eye className="w-4 h-4 text-slate-400" />
                                            </Button>
                                        </Link>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleEditClick(post)}
                                            className="rounded-xl w-10 h-10 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDeletePost(post.id)}
                                            className="rounded-xl w-10 h-10 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
