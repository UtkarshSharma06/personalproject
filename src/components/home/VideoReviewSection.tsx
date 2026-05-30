import React from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Quote, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EditableText from '@/components/cms/EditableText';
import { usePageContent } from '@/hooks/usePageContent';

export default function VideoReviewSection() {
    const { t } = useTranslation();

    return (
        <section className="py-20 bg-white relative overflow-hidden border-b border-[#eaeaea]">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* ── LEFT: The Clear Story ── */}
                    <div className="flex-1">
                        <h2 className="text-[32px] md:text-[40px] font-bold text-[#333333] leading-tight mb-4">
                            {t('landing.video_review.title', 'Success In')} {t('landing.video_review.title_highlight', 'Real Time')}
                        </h2>
                        
                        <p className="text-[16px] text-[#555555] mb-10">
                            {t('landing.video_review.subtitle', 'Real results from our 2026 students')}
                        </p>

                        <div className="relative p-8 bg-white rounded-[8px] border border-[#eaeaea] mb-10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
                            <Quote className="absolute top-6 right-6 text-[#f1f1f1]" size={40} />
                            <p className="relative z-10 text-[18px] md:text-[20px] font-medium text-[#444444] leading-relaxed mb-8 italic pr-10">
                                "{t('landing.video_review.quote', 'The ItaloStudy method transformed my preparation. I went from being uncertain to a top-tier candidate.')}"
                            </p>
                            
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#eaeaea]">
                                    <img 
                                        src="https://res.cloudinary.com/dy1w1to9c/image/upload/v1772358507/f6qjs0abjlpew5zidj3n.png" 
                                        className="w-full h-full object-cover" 
                                        alt="George Sadrish" 
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-[15px] font-bold text-[#333333] leading-none mb-1.5">George Sadrish Veliyath</p>
                                    <p className="text-[12px] text-[#777777]">{t('landing.video_review.role', 'University of Padua Admission')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Clear Stats Line */}
                        <div className="flex items-center gap-8 bg-[#fcfcfc] p-4 rounded-[8px] border border-[#eaeaea]">
                            <div>
                                <p className="text-[24px] font-bold text-[#5a4bda] mb-0.5 leading-none">40/55</p>
                                <p className="text-[12px] text-[#666666]">{t('landing.video_review.metric_label', 'CEnT-S Score')}</p>
                            </div>
                            <div className="w-px h-10 bg-[#eaeaea]" />
                            <div>
                                <p className="text-[24px] font-bold text-[#5a4bda] mb-0.5 leading-none">Top 1%</p>
                                <p className="text-[12px] text-[#666666]">{t('landing.video_review.global_percentile', 'Global Percentile')}</p>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: The High-Definition Player ── */}
                    <div className="relative w-full max-w-[320px]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative z-10 aspect-[9/16] bg-[#f8f9fe] rounded-2xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[#eaeaea]"
                        >
                            <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
                                <iframe
                                    className="absolute inset-0 w-full h-full object-cover"
                                    src="https://www.youtube.com/embed/Q5-m1_gZoJI?autoplay=0&mute=0&loop=1&playlist=Q5-m1_gZoJI&controls=1&modestbranding=1&rel=0"
                                    title="Student Success Story"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </motion.div>
                        
                        {/* Verified Floating Badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-6 top-1/4 z-20 bg-white p-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[#eaeaea] flex items-center gap-3 hidden lg:flex"
                        >
                            <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#00B67A] flex items-center justify-center">
                                <CheckCircle2 size={16} />
                            </div>
                            <span className="text-[12px] font-bold text-[#333333] pr-2">Verified Proof</span>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
