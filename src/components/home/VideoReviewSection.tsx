import React from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Quote, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EditableText from '@/components/cms/EditableText';
import { usePageContent } from '@/hooks/usePageContent';

export default function VideoReviewSection() {
    const { t } = useTranslation();

    return (
        <section className="pt-2 pb-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* ── LEFT: The Clear Story ── */}
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full mb-8">
                            <Award size={14} className="text-indigo-600" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('landing.video_review.badge', 'Featured Admission Story')}</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter leading-[0.9] mb-6 uppercase">
                            {t('landing.video_review.title', 'Success In')}<br/>{t('landing.video_review.title_highlight', 'Real Time')}
                        </h2>
                        
                        <p className="text-lg font-black text-indigo-600 uppercase tracking-[0.2em] mb-12">
                            {t('landing.video_review.subtitle', 'Real results from our 2026 students')}
                        </p>

                        <div className="relative p-10 bg-white rounded-[3rem] border border-white/5 mb-12 group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                            <Quote className="absolute top-8 right-8 text-slate-100" size={56} />
                            <p className="relative z-10 text-xl md:text-2xl font-bold !text-black/80 leading-tight mb-10 italic">
                                "{t('landing.video_review.quote', 'The ItaloStudy method transformed my preparation. I went from being uncertain to a top-tier candidate.')}"
                            </p>
                            
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                                    <img 
                                        src="https://res.cloudinary.com/dy1w1to9c/image/upload/v1772358507/f6qjs0abjlpew5zidj3n.png" 
                                        className="w-full h-full object-cover" 
                                        alt="George Sadrish" 
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-lg font-black text-black leading-none mb-1">George Sadrish Veliyath</p>
                                    <p className="text-[10px] font-bold !text-black/60 uppercase tracking-widest">{t('landing.video_review.role', 'University of Padua Admission')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Clear Stats Line */}
                        <div className="flex items-center gap-12">
                            <div>
                                <p className="text-3xl font-black text-black mb-0.5 tracking-tighter">40/55</p>
                                <p className="text-[9px] font-black !text-black/60 uppercase tracking-widest">{t('landing.video_review.metric_label', 'CEnT-S Score')}</p>
                            </div>
                            <div className="w-px h-10 bg-slate-100" />
                            <div>
                                <p className="text-3xl font-black text-black mb-0.5 tracking-tighter">Top 1%</p>
                                <p className="text-[9px] font-black !text-black/60 uppercase tracking-widest">{t('landing.video_review.global_percentile', 'Global Percentile')}</p>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: The High-Definition Player ── */}
                    <div className="relative w-full max-w-[340px]">
                        {/* Soft Glow Ambient Backdrop */}
                        <div className="absolute -inset-10 bg-indigo-50/50 blur-[80px] rounded-full pointer-events-none" />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative z-10 aspect-[9/16] bg-slate-950 rounded-[4.5rem] p-3 shadow-[0_60px_100px_-30px_rgba(0,0,0,0.15)] border-[10px] border-slate-50"
                        >
                            <div className="relative w-full h-full rounded-[3.8rem] overflow-hidden bg-black">
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
                            className="absolute -right-8 top-1/4 z-20 bg-white p-5 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center gap-2 hidden lg:flex"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                <CheckCircle2 size={20} />
                            </div>
                            <span className="text-[9px] font-black text-black uppercase tracking-widest text-center">Verified Proof</span>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
