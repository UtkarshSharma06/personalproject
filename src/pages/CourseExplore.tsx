import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2, ArrowLeft, GraduationCap, CheckCircle, 
    PlayCircle, BookOpen, Clock, ShieldCheck, ChevronDown, ChevronUp, FileText, Download, CalendarDays, Share2, Play, Users, Tag,
    Atom, Dna, FlaskConical, Calculator, BrainCircuit, Activity, Sparkles
} from 'lucide-react';

import SEO from '@/components/SEO';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import Footer from '@/components/Footer';
import PWNavbar from '@/components/home/PWNavbar';

export default function CourseExplore() {
    const { slug } = useParams<{ slug: string }>();
    const [course, setCourse] = useState<any>(null);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [chapters, setChapters] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

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
            <div className="min-h-screen bg-[#f4f3ff] flex flex-col">
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
            <div className="min-h-screen bg-[#f4f3ff] flex flex-col">
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

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-900 pb-20">
            <SEO
                title={`${course.title} - Online Prep Course | ItaloStudy`}
                description={course.description || `Enroll in ${course.title} to prepare for your Italian medical entrance exam. Get lifetime access to expert-led lessons and practice.`}
            />
            <PWNavbar />

            {/* Breadcrumb Area */}
            <div className="bg-white border-b border-slate-200 pt-24 pb-4">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-500">
                        <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                        <span>›</span>
                        <Link to="/courses" className="hover:text-indigo-600 transition-colors">Batches</Link>
                        <span>›</span>
                        <span className="text-slate-800">{course.title}</span>
                    </div>
                </div>
            </div>

            <main className="container mx-auto max-w-6xl px-4 mt-6">
                <div className="flex flex-col lg:flex-row gap-6 relative items-start">
                    
                    {/* Left Column - Details */}
                    <div className="flex-1 space-y-6">
                        
                        {/* Header Box */}
                        <div className="bg-white rounded-[1rem] p-6 shadow-sm border border-slate-200">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                {course.lecture_type && (
                                    <span className={`text-[11px] font-bold px-2 py-1 rounded flex items-center gap-1 ${course.lecture_type === 'Live' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-100 text-slate-700'}`}>
                                        {course.lecture_type === 'Live' && <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>}
                                        {course.lecture_type.toUpperCase()} BATCH
                                    </span>
                                )}
                                {course.language && (
                                    <span className="bg-amber-50 text-amber-700 text-[11px] font-bold px-2 py-1 rounded uppercase">{course.language}</span>
                                )}
                            </div>
                            
                            <h1 className="text-[28px] md:text-[32px] font-black text-[#1b2124] leading-tight mb-6">
                                {course.title}
                            </h1>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                                        <CalendarDays className="w-3.5 h-3.5" /> Start Date
                                    </div>
                                    <div className="text-sm font-bold text-slate-800">{course.launch_date || 'Immediately'}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                                        <Clock className="w-3.5 h-3.5" /> Validity
                                    </div>
                                    <div className="text-sm font-bold text-slate-800">{course.expiry_days ? `${course.expiry_days} Days` : 'Lifetime'}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                                        <BookOpen className="w-3.5 h-3.5" /> Subjects
                                    </div>
                                    <div className="text-sm font-bold text-slate-800">{subjects.length}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                                        <PlayCircle className="w-3.5 h-3.5" /> Lectures
                                    </div>
                                    <div className="text-sm font-bold text-slate-800">{course.lectures_count || chapters.length}</div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="bg-white rounded-[1rem] shadow-sm border border-slate-200 overflow-hidden sticky top-[72px] z-20">
                            <div className="flex border-b border-slate-200">
                                <button 
                                    onClick={() => setActiveTab('description')}
                                    className={`flex-1 py-4 text-[15px] font-bold border-b-2 transition-colors ${activeTab === 'description' ? 'border-[#5A4BDA] text-[#5A4BDA]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                                >
                                    About
                                </button>
                                <button 
                                    onClick={() => setActiveTab('classes')}
                                    className={`flex-1 py-4 text-[15px] font-bold border-b-2 transition-colors ${activeTab === 'classes' ? 'border-[#5A4BDA] text-[#5A4BDA]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                                >
                                    Subjects
                                </button>
                            </div>
                            
                            <div className="p-6 bg-[#fafafa]">
                                {activeTab === 'classes' ? (
                                    <div className="space-y-3">
                                        {subjects.length === 0 ? (
                                            <div className="text-center py-10 text-slate-500 font-semibold">
                                                No subjects added to this batch yet.
                                            </div>
                                        ) : (
                                            subjects.map((subject) => {
                                                const subjectChapters = chapters.filter(c => c.subject_id === subject.id);
                                                
                                                return (
                                                    <div key={subject.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-shadow">
                                                        <div className="w-full flex items-center justify-between p-4 text-left">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-full bg-[#f4f3ff] flex items-center justify-center shrink-0">
                                                                    {getSubjectIcon(subject.title)}
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-bold text-slate-800 text-[15px]">{subject.title}</h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                                <h3 className="font-bold text-slate-800 text-base">Batch Offerings</h3>
                                            </div>
                                            <div className="p-4">
                                                <div className="grid grid-cols-1 gap-3">
                                                    {(course.features && course.features.length > 0 ? course.features : [
                                                        `${subjects.length} Subjects included`,
                                                        `${course.expiry_days ? course.expiry_days + ' days' : 'Lifetime'} access validity`,
                                                        'One-time payment',
                                                        'Detailed Chapter Layout',
                                                        'Expert Instruction',
                                                        'Premium Video Player',
                                                        'Progress Tracking'
                                                    ]).map((item: string, idx: number) => (
                                                        <div key={idx} className="flex items-start gap-3">
                                                            <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                            </svg>
                                                            <span className="text-slate-700 font-medium text-sm">{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {course.description && (
                                            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                                <h3 className="font-bold text-slate-800 mb-3 text-base">About This Course</h3>
                                                <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                                                    <ReactMarkdown>{course.description}</ReactMarkdown>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right Column - Buy Card (Sticky) */}
                    <div className="w-full lg:w-[380px] shrink-0">
                        <div className="bg-white rounded-[1rem] border border-slate-200 shadow-md lg:sticky lg:top-[90px] overflow-hidden">
                            {/* Thumbnail */}
                            {course.banner_url ? (
                                <div className="w-full aspect-[16/9] bg-slate-900 relative">
                                    <img src={course.banner_url} alt={course.title} className="w-full h-full object-cover" />
                                </div>
                            ) : course.thumbnail_url ? (
                                <div className="w-full aspect-[16/9] bg-slate-900 relative">
                                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-full aspect-[16/9] bg-gradient-to-tr from-[#1b2124] to-[#5A4BDA]/80 flex flex-col items-center justify-center relative">
                                    <GraduationCap className="w-12 h-12 text-white/50 mb-2" />
                                    <div className="text-white font-black text-xl uppercase tracking-widest opacity-80">{course.title}</div>
                                </div>
                            )}

                            <div className="p-6">
                                {/* Pricing */}
                                <div className="mb-6">
                                    {isFree ? (
                                        <div className="text-3xl font-black text-[#1b7938]">FREE</div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="text-[32px] font-black text-[#1b2124] leading-none">{currencySymbol}{currentPrice}</div>
                                            <div className="flex flex-col">
                                                <div className="text-[14px] font-semibold text-slate-400 line-through leading-none mb-1">{currencySymbol}{originalPrice}</div>
                                                <div className="text-[11px] font-bold text-[#1b7938] bg-[#eef8f1] px-1.5 py-0.5 rounded leading-none w-fit">
                                                    {discountPercent}% OFF
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div className="space-y-3">
                                    {isComingSoon ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between gap-2 text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4" />
                                                    <span className="font-bold">Pre-register for early discount</span>
                                                </div>
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
                                            className="w-full flex items-center justify-center font-bold text-[15px] py-3.5 rounded-xl transition-all shadow-md bg-[#5A4BDA] hover:bg-[#4a3bba] text-white shadow-[#5A4BDA]/20"
                                        >
                                            BUY NOW
                                        </a>
                                    )}
                                    <button 
                                        onClick={handleShare}
                                        className="w-full flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[15px] py-3.5 rounded-xl transition-colors gap-2"
                                    >
                                        <Share2 className="w-4 h-4" /> SHARE BATCH
                                    </button>
                                </div>

                                {/* Features List */}
                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <h4 className="font-bold text-slate-800 text-sm mb-4">This Batch Includes:</h4>
                                    <ul className="space-y-3">
                                        {[
                                            'Full syllabus completion',
                                            'Expert-led interactive classes',
                                            'Class notes & formula sheets',
                                            'Topic-wise mock tests',
                                            'Anytime, anywhere access'
                                        ].map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
                                                <CheckCircle className="w-4 h-4 text-[#1b7938] shrink-0 mt-0.5" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            
        </div>
    );
}
