import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Star, Users, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LocalizedLink as Link } from '@/components/LocalizedLink';

export default function PWCourses() {
    const { t } = useTranslation();
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data, error } = await (supabase as any)
                    .from('courses')
                    .select('*')
                    .eq('is_active', true);

                if (error) throw error;

                // Sort: Launched courses first, then 'Coming Soon', then by creation date
                const sortedCourses = (data || []).sort((a: any, b: any) => {
                    const aLaunched = a.launch_date?.toLowerCase() !== 'coming soon';
                    const bLaunched = b.launch_date?.toLowerCase() !== 'coming soon';
                    
                    if (aLaunched && !bLaunched) return -1;
                    if (!aLaunched && bLaunched) return 1;
                    
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                }).slice(0, 3); // Only show top 3 on the landing page

                setCourses(sortedCourses);
            } catch (err) {
                console.error("Error fetching courses:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Fallback abstract arts for courses without banners
    const abstractArts = [
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=800&auto=format&fit=crop",
    ];

    if (isLoading || courses.length === 0) {
        return null; // Don't show the section if loading or no courses
    }

    return (
        <section className="w-full bg-white py-16 md:py-24 border-t border-slate-100">
            <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="max-w-2xl"
                    >
                        <span className="text-[#5a4bda] font-bold text-sm tracking-wider uppercase mb-2 block">
                            {t('home.courses.label', "Premium Courses")}
                        </span>
                        <h2 className="text-[32px] md:text-[42px] font-bold text-slate-900 mb-4 leading-tight">
                            {t('home.courses.heading', "Accelerate your preparation with our expertly crafted courses")}
                        </h2>
                        <p className="text-[16px] md:text-[18px] text-slate-600">
                            {t('home.courses.subheading', "Join thousands of students who achieved their dream of studying in Italy through our structured video lectures and mock tests.")}
                        </p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, x: 15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
                        className="mt-6 md:mt-0"
                    >
                        <Button 
                            onClick={() => window.location.href = 'https://italostudy.com/courses'}
                            className="bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 font-semibold px-6 py-6 h-auto text-[16px]"
                        >
                            {t('home.courses.view_all', "View All Courses")} <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {courses.map((course, idx) => {
                        const isComingSoon = course.launch_date?.toLowerCase() === 'coming soon';
                        const fallbackArt = abstractArts[idx % abstractArts.length];
                        
                        return (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.1 }}
                                className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col"
                            >
                                {/* Course Header/Banner */}
                                <div className={`flex justify-center items-center relative overflow-hidden h-48 bg-slate-900`}>
                                    <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[12px] font-bold text-slate-800 shadow-sm">
                                        {isComingSoon ? 'Coming Soon' : (course.badge || 'New')}
                                    </div>
                                    
                                    {course.banner_url ? (
                                        <img src={course.banner_url} alt={course.title} className="w-full h-full object-cover z-10 opacity-90 group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <>
                                            <img src={fallbackArt} alt="Abstract Art" className="w-full h-full object-cover absolute inset-0 opacity-60 mix-blend-overlay group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-tr from-[#1b2124]/90 to-[#5A4BDA]/40 pointer-events-none z-10" />
                                            <div className="z-20 text-white flex flex-col items-center p-4 text-center">
                                                <h3 className="text-[20px] font-black uppercase tracking-tight drop-shadow-lg">{course.title}</h3>
                                            </div>
                                        </>
                                    )}
                                </div>
                                
                                {/* Course Content */}
                                <div className="p-6 md:p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-[13px] text-slate-500 font-medium mb-3">
                                        <div className="flex items-center gap-1">
                                            <PlayCircle className="w-4 h-4 text-[#5A4BDA]" />
                                            {course.lecture_type || 'Recorded'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="w-4 h-4" /> 
                                            {course.language || 'English'}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-[20px] md:text-[22px] font-bold text-slate-900 mb-3 group-hover:text-[#5a4bda] transition-colors line-clamp-2">
                                        {course.title}
                                    </h3>
                                    
                                    <p className="text-slate-600 text-[15px] leading-relaxed mb-6 flex-1 line-clamp-3">
                                        {course.description || "Master your entrance exam with structured video lectures, comprehensive study materials, and expert guidance."}
                                    </p>
                                    
                                    <Button 
                                        onClick={() => {
                                            if (!isComingSoon) {
                                                window.location.href = `https://italostudy.com/courses/${course.slug || course.id}`;
                                            }
                                        }}
                                        className={`w-full font-bold py-6 h-auto text-[15px] transition-colors ${
                                            isComingSoon 
                                            ? 'bg-[#e2e8f0] text-slate-500 hover:bg-[#e2e8f0] cursor-not-allowed' 
                                            : 'bg-[#5A4BDA] text-white hover:bg-[#483aab]'
                                        }`}
                                    >
                                        {isComingSoon ? "Coming Soon" : "Enroll Now"}
                                    </Button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
