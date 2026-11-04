import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2, ArrowLeft, GraduationCap, CheckCircle, 
    PlayCircle, BookOpen, Clock, ShieldCheck, ChevronDown, ChevronUp, FileText, Download, CalendarDays, Share2, Play, Users, Tag,
    Atom, Dna, FlaskConical, Calculator, BrainCircuit, Activity, Sparkles, XCircle, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

import SEO from '@/components/SEO';
import ReactMarkdown from 'react-markdown';
import Footer from '@/components/Footer';
import PWNavbar from '@/components/home/PWNavbar';

function extractYouTubeId(url: string) {
    if (!url) return '';
    if (url.includes('youtube.com/watch')) {
        const urlParams = new URL(url).searchParams;
        return urlParams.get('v') || '';
    }
    if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split('?')[0];
    }
    return '';
}

export default function CourseExplore() {
    const { slug } = useParams<{ slug: string }>();
    const [course, setCourse] = useState<any>(null);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [chapters, setChapters] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDemoVideo, setShowDemoVideo] = useState(false);

    const [activeTab, setActiveTab] = useState<'description' | 'classes'>('description');
    
    const getSubjectIcon = (title: string) => {
        const t = title.toLowerCase();
        if (t.includes('physic')) return <Atom className="w-5 h-5 text-[#5A4BDA]" />;
        if (t.includes('chemist')) return <FlaskConical className="w-5 h-5 text-[#5A4BDA]" />;
        if (t.includes('biolog')) return <Dna className="w-5 h-5 text-[#5A4BDA]" />;
        if (t.includes('math')) return <Calculator className="w-5 h-5 text-[#5A4BDA]" />;
        if (t.includes('reason') || t.includes('logic')) return <BrainCircuit className="w-5 h-5 text-[#5A4BDA]" />;
        return <BookOpen className="w-5 h-5 text-[#5A4BDA]" />;
    };

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!slug) return;
            setIsLoading(true);
            try {
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
                let query = supabase.from('courses' as any).select('*').eq('is_active', true);
                if (isUuid) {
                    query = query.eq('id', slug);
                } else {
                    query = query.eq('slug', slug);
                }

                const { data: courseDataRaw, error: courseError } = await query.maybeSingle();
                const courseData = courseDataRaw as any;

                if (courseError || !courseData) {
                    setError('Course not found.');
                    setIsLoading(false);
                    return;
                }
                setCourse(courseData);

                const { data: subjectsDataRaw } = await supabase
                    .from('course_subjects' as any)
                    .select('*')
                    .eq('course_id', courseData.id)
                    .order('position');
                const subjectsData = (subjectsDataRaw || []) as any[];
                setSubjects(subjectsData);

                if (subjectsData.length > 0) {
                    const subjectIds = subjectsData.map((s: any) => s.id);
                    const { data: chaptersDataRaw } = await supabase
                        .from('course_chapters' as any)
                        .select('*')
                        .in('subject_id', subjectIds)
                        .order('position');
                    setChapters((chaptersDataRaw || []) as any[]);
                }
            } catch (err: any) {
                console.error(err);
                setError('An error occurred while loading the course.');
            }
            setIsLoading(false);
        };

        fetchCourseData();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f3f4f6] flex flex-col">
                <PWNavbar />
                <div className="flex-1 flex items-center justify-center pt-24">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-[#f3f4f6] flex flex-col">
                <PWNavbar />
                <div className="flex-1 flex flex-col items-center justify-center pt-24 text-center px-4">
                    <GraduationCap className="w-16 h-16 text-slate-300 mb-4" />
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Course Not Found</h1>
                    <p className="text-slate-500 mb-6">The course you are looking for does not exist or has been removed.</p>
                    <Link to="/courses" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">
                        Browse All Courses
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const hasINR = course.regional_prices?.INR && course.regional_prices.INR > 0;
    const isFree = course.is_free;
    
    // Euro calculation
    const baseEuro = course.price_eur || 0;
    const discountEuro = course.discount_price_eur || baseEuro;
    const finalEuro = discountEuro;
    const origEuro = baseEuro > discountEuro ? baseEuro : Math.round(finalEuro * 1.5);
    const pctEuro = isFree ? 100 : Math.round(((origEuro - finalEuro) / origEuro) * 100);

    // INR calculation
    const baseInr = hasINR ? course.regional_prices.INR : 0;
    const discountInr = (hasINR && course.regional_prices.INR_discount) ? course.regional_prices.INR_discount : baseInr;
    const finalInr = discountInr;
    const origInr = baseInr > discountInr ? baseInr : Math.round(finalInr * 1.5);
    const pctInr = (hasINR && origInr > 0) ? Math.round(((origInr - finalInr) / origInr) * 100) : 0;

    const currencySymbol = hasINR ? '₹' : '€';
    const currentPrice = hasINR ? finalInr : finalEuro;
    const originalPrice = hasINR ? origInr : origEuro;
    const discountPercent = hasINR ? pctInr : pctEuro;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: course.title,
                url: window.location.href
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    const isComingSoon = Boolean(
        course.launch_date && (
            course.launch_date.toLowerCase() === 'coming soon' ||
            (!isNaN(Date.parse(course.launch_date)) && new Date(course.launch_date) > new Date())
        )
    );
    
    const ytId = course.demo_video_url ? extractYouTubeId(course.demo_video_url) : '';

    const DemoVideoModal = showDemoVideo && course.demo_video_url ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowDemoVideo(false)}>
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowDemoVideo(false)} className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
                    <XCircle className="w-6 h-6" />
                </button>
                {course.demo_video_url.endsWith('.mp4') ? (
                    <video src={course.demo_video_url} controls autoPlay className="w-full h-full" />
                ) : ytId ? (
                    <div className="w-full h-full">
                        <iframe src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&modestbranding=1&rel=0`} className="w-full h-full border-none" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen></iframe>
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold">Invalid video URL</div>
                )}
            </div>
        </div>
    ) : null;

    const TABS = [
        { id: 'description', label: 'Description' },
        { id: 'classes', label: 'All Classes' }
    ] as const;

    const features = course.features && course.features.length > 0 ? course.features : [
        `${subjects.length} Subjects included`,
        `${course.expiry_days ? course.expiry_days + ' days' : 'Lifetime'} access validity`,
        'One-time payment',
        'Detailed Chapter Layout',
        'Expert Instruction',
        'Premium Video Player',
        'Progress Tracking'
    ];

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-900 pb-20">
            <SEO
                title={`${course.title} - Online Prep Course | ItaloStudy`}
                description={course.description || `Enroll in ${course.title} to prepare for your Italian medical entrance exam. Get lifetime access to expert-led lessons and practice.`}
            />
            {DemoVideoModal}
            <PWNavbar />

            {/* Top Purple Banner */}
            <div className="bg-gradient-to-r from-[#6b46c1] to-[#805ad5] px-6 py-10 md:py-14 relative overflow-hidden mt-[72px]">
                {/* Optional background shapes */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 translate-x-10" />
                <div className="absolute right-40 top-0 bottom-0 w-1/4 bg-white/5 skew-x-12 translate-x-10" />
                
                <div className="max-w-[1200px] mx-auto px-4 relative z-10 flex items-center">
                    <Link to="/courses" className="mr-4 text-white/80 hover:text-white transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl md:text-[32px] font-bold text-white tracking-wide">
                        {course.title}
                    </h1>
                </div>
            </div>

            {/* Tab Bar Container */}
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-[72px] z-30">
                <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between">
                    <div className="flex gap-8">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "py-4 text-[15px] font-semibold border-b-[3px] transition-all",
                                    activeTab === tab.id
                                        ? "border-[#5a4bda] text-[#5a4bda]"
                                        : "border-transparent text-slate-500 hover:text-slate-800"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Layout (Below Tabs) */}
            <div className="max-w-[1200px] mx-auto px-4 py-8 pb-20">
                <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Left Content */}
                    <div className="flex-1 min-w-0">
                        {activeTab === 'description' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="p-5 md:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer">
                                        <h2 className="text-lg font-bold text-slate-800">Batch Offerings</h2>
                                    </div>
                                    
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                                            {features.map((item: string, idx: number) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <svg className="w-[18px] h-[18px] text-amber-400 mt-[3px] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                    </svg>
                                                    <span className="text-slate-700 font-medium text-[15px]">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {course.description && (
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                        <h3 className="font-bold text-slate-800 mb-4 text-lg">About This Course</h3>
                                        <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                                            <ReactMarkdown>{course.description}</ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'classes' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {subjects.length === 0 ? (
                                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-400">
                                        <p className="font-bold">Content coming soon.</p>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {subjects.map((subject, si) => {
                                                const subjectChapters = chapters.filter(c => c.subject_id === subject.id);
                                                const chapterCount = subjectChapters.length;
                                                return (
                                                    <div
                                                        key={subject.id}
                                                        className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-[#5a4bda] bg-slate-50 text-left transition-all"
                                                    >
                                                        <div className="w-12 h-12 rounded-lg shadow-sm flex items-center justify-center flex-shrink-0 bg-white border border-slate-100">
                                                            {getSubjectIcon(subject.title)}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="font-bold text-slate-900 text-[15px] leading-snug line-clamp-2 group-hover:text-[#5a4bda] transition-colors">
                                                                {subject.title}
                                                            </h3>
                                                            <p className="text-xs text-slate-500 font-medium mt-1">
                                                                {chapterCount} Chapter{chapterCount !== 1 ? 's' : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Right Content (Sticky Card) */}
                    <div className="lg:w-[380px] flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-slate-200 sticky top-[160px] overflow-hidden">
                            <div className="p-3">
                                <div className="rounded-lg overflow-hidden relative mb-4 group">
                                    {course.thumbnail_url || course.banner_url ? (
                                        <img src={course.thumbnail_url || course.banner_url} alt={course.title} className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full aspect-[16/9] bg-[#6b46c1] flex items-center justify-center">
                                            <GraduationCap className="w-16 h-16 text-white/50" />
                                        </div>
                                    )}
                                    {course.demo_video_url && (
                                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none group-hover:bg-black/30 transition-colors">
                                            <button onClick={() => setShowDemoVideo(true)} className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-[0_0_15px_rgba(220,38,38,0.5)] transform hover:scale-105 transition-all ring-2 ring-white/20">
                                                <Play className="w-5 h-5 fill-white" />
                                                Play Demo
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="px-1 pb-2 space-y-4">
                                    <div className="flex items-center justify-between text-xs font-semibold">
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                            <GraduationCap className="w-4 h-4" /> For All Aspirants
                                        </div>
                                        <div className="bg-[#f0f0ff] text-[#5a4bda] px-2 py-1 rounded">
                                            English
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Start Date</span>
                                            <span className="font-bold text-slate-800">{course.launch_date || 'Immediately'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Validity</span>
                                            <span className="font-bold text-slate-800">{course.expiry_days ? `${course.expiry_days} Days` : 'Lifetime'}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-2">
                                        {isFree ? (
                                            <div className="text-[32px] font-black text-[#5a4bda] leading-none mb-1">FREE</div>
                                        ) : (
                                            <>
                                                <div className="flex items-baseline gap-2 mb-1">
                                                    <span className="text-[32px] font-black text-[#5a4bda] leading-none">
                                                        {currencySymbol}{currentPrice}
                                                    </span>
                                                    {discountPercent > 0 && (
                                                        <span className="text-[15px] font-semibold text-slate-400 line-through">
                                                            {currencySymbol}{originalPrice}
                                                        </span>
                                                    )}
                                                </div>
                                                {discountPercent > 0 && (
                                                    <div className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                                        <span className="w-2.5 h-2.5 flex items-center justify-center bg-green-700 text-white rounded-full text-[6px]">%</span>
                                                        {discountPercent}% OFF
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    
                                    <div className="pt-2">
                                        {isComingSoon ? (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg text-sm">
                                                    <Sparkles className="w-4 h-4" />
                                                    <span className="font-bold">Pre-register for early discount</span>
                                                </div>
                                                <a
                                                    href={`https://app.italostudy.com/courses/${slug || course.id}`}
                                                    className="w-full flex items-center justify-center gap-2 bg-[#5a4bda] hover:bg-[#4a3bba] text-white rounded-xl py-3.5 font-bold text-[15px] transition-all uppercase tracking-wide shadow-md shadow-[#5A4BDA]/20"
                                                >
                                                    PRE-REGISTER NOW
                                                </a>
                                            </div>
                                        ) : (
                                            <a
                                                href={`https://app.italostudy.com/courses/${slug || course.id}`}
                                                className="w-full flex items-center justify-center gap-2 bg-[#5a4bda] hover:bg-[#4a3bba] text-white rounded-xl py-3.5 font-bold text-[15px] transition-all uppercase tracking-wide shadow-md shadow-[#5A4BDA]/20"
                                            >
                                                BUY NOW
                                            </a>
                                        )}
                                        <button 
                                            onClick={handleShare}
                                            className="w-full mt-3 flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[15px] py-3.5 rounded-xl transition-colors gap-2 uppercase tracking-wide"
                                        >
                                            <Share2 className="w-4 h-4" /> SHARE BATCH
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            <Footer />
        </div>
    );
}
