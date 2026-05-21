import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import BlogHeader from '@/components/blog/BlogHeader';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
    ChevronLeft,
    Calendar,
    Facebook,
    MessageCircle,
    Link as LinkIcon,
    FileDown,
    ShieldCheck,
    Zap,
} from 'lucide-react';
import { getProxiedUrl } from '@/lib/url';
import ResourcePreview from '@/components/resources/ResourcePreview';
import { ResourceDetailSkeleton } from '@/components/SkeletonLoader';
import { useAuth } from '@/lib/auth';

interface Resource {
    id: string;
    title: string;
    description: string;
    file_url: string;
    slug: string;
    exam_type: string;
    created_at: string;
}

export default function ResourceDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user: currentUser } = useAuth();
    const [resource, setResource] = useState<Resource | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Auth-gate state

    useEffect(() => {
        fetchResource();
    }, [slug]);

    // Handle auto-download after login/redirect back from app.italostudy.com
    useEffect(() => {
        if (currentUser && resource) {
            // Use localStorage (not sessionStorage — sessionStorage is same-origin only
            // and is wiped when the user crosses from app.italostudy.com back here)
            const pendingDownload = localStorage.getItem('pending_resource_download');
            if (pendingDownload === resource.slug) {
                localStorage.removeItem('pending_resource_download');
                window.open(getProxiedUrl(resource.file_url), '_blank');
            }
        }
    }, [currentUser, resource]);

    const fetchResource = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('exam_resources')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !data) {
            console.error('Error fetching resource:', error);
            window.location.href = '/resources';
            return;
        }

        setResource(data as Resource);
        setIsLoading(false);
    };

    const handleDownloadClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (currentUser) {
            // Logged in — open file directly
            if (resource) window.open(getProxiedUrl(resource.file_url), '_blank');
            return;
        }
        // Save download intent in localStorage (survives cross-origin navigation,
        // unlike sessionStorage which is same-origin only)
        if (resource) localStorage.setItem('pending_resource_download', resource.slug);
        // Redirect to app auth, passing return_url so Auth.tsx can send the user back here
        const returnUrl = encodeURIComponent(window.location.href);
        window.location.href = `https://app.italostudy.com/auth?return_url=${returnUrl}`;
    };


    if (isLoading) {
        return (
            <Layout showHeader={false}>
                <BlogHeader />
                <ResourceDetailSkeleton />
            </Layout>
        );
    }

    if (!resource) return null;

    return (
        <Layout showHeader={false}>
            <SEO
                title={`${resource.title} | Study Resources`}
                description={resource.description || `Download ${resource.title} and other free study materials for ${resource.exam_type.toUpperCase()} on ItaloStudy.`}
                type="article"
            />
            <div className="min-h-screen bg-[#FAFAFA] pb-32">
                <BlogHeader />

                {/* Back Link */}
                <div className="container mx-auto px-4 py-8 lg:py-12">
                    <a
                        href="/resources"
                        className="group inline-flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1, x: -5 }}
                            className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </motion.div>
                        Back to Library
                    </a>
                </div>

                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col lg:flex-row gap-8 lg:gap-12"
                        >
                            {/* Main Column: Title and Preview */}
                            <div className="flex-1 space-y-8">
                                <div className="bg-white border-2 border-slate-100 rounded-[3.5rem] p-8 lg:p-12 shadow-xl shadow-slate-200/10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-200">
                                            {resource.exam_type.replace(/-/g, ' ')}
                                        </span>
                                        <div className="h-4 w-[1px] bg-slate-100 mx-2" />
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {format(new Date(resource.created_at), 'MMMM dd, yyyy')}
                                        </div>
                                    </div>

                                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                                        {resource.title}
                                    </h1>

                                    <p className="text-lg text-slate-600 leading-relaxed mb-8 font-medium">
                                        {resource.description || "This resource is designed to help you excel in your examination. High-quality prep material provided free by ItaloStudy."}
                                    </p>

                                    {/* PDF Previewer - Primary Position */}
                                    <div className="pt-4 border-t border-slate-50">
                                        <ResourcePreview
                                            fileUrl={resource.file_url}
                                            title={resource.title}
                                            onDownload={() => handleDownloadClick({ preventDefault: () => {} } as any)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar: Download and Actions */}
                            <div className="lg:w-96 space-y-6">
                                <div className="sticky top-24 space-y-6">
                                    <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-center text-white shadow-2xl shadow-indigo-200 overflow-hidden relative group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all duration-700" />

                                        <div className="w-20 h-20 rounded-[2rem] bg-white/10 flex items-center justify-center mx-auto mb-8 border border-white/20 relative z-10 backdrop-blur-sm">
                                            <FileDown className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-xl font-black mb-2 tracking-tight relative z-10">Get Your Copy</h3>
                                        <p className="text-indigo-100 text-sm font-bold mb-8 relative z-10">High-quality PDF material. Ready for offline study.</p>

                                        <Button
                                            className="w-full h-16 bg-white hover:bg-slate-900 text-indigo-600 hover:text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl group/btn relative z-10"
                                            onClick={handleDownloadClick}
                                        >
                                            Download Now
                                        </Button>
                                    </div>

                                    <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/10">
                                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6 text-center">Trust & Security</h4>
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm text-emerald-500">
                                                        <ShieldCheck className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase text-slate-500">Verified</span>
                                                </div>
                                                <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase">Official</div>
                                            </div>
                                            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm text-amber-500">
                                                        <Zap className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase text-slate-500">Speed</span>
                                                </div>
                                                <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg uppercase">Instant</div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-slate-50">
                                            <p className="text-center text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Share with friends</p>
                                            <div className="flex justify-center gap-2">
                                                {[
                                                    { icon: MessageCircle, color: 'text-[#25D366]', url: `https://api.whatsapp.com/send?text=Check out this! ${window.location.href}` },
                                                    { icon: Facebook, color: 'text-[#1877F2]', url: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}` },
                                                    { icon: LinkIcon, color: 'text-slate-900', action: 'copy' },
                                                ].map((platform, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => {
                                                            if (platform.action === 'copy') {
                                                                navigator.clipboard.writeText(window.location.href);
                                                                toast({ title: "Link Copied!" });
                                                            } else if (platform.url) {
                                                                window.open(platform.url, '_blank');
                                                            }
                                                        }}
                                                        className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-white hover:shadow-md transition-all border border-slate-100"
                                                    >
                                                        <platform.icon className={`w-4 h-4 ${platform.color}`} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

            </div>
        </Layout>
    );
}
