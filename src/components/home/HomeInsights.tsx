import { motion } from 'framer-motion';
import { BarChart3, Info } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import EditableText from '@/components/cms/EditableText';

const HomeInsights = () => {
    const { t } = useTranslation();

    return (
        <section className="pt-0 pb-12 bg-white overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-white rounded-[4.5rem] border border-slate-100 shadow-[0_80px_120px_-40px_rgba(0,0,0,0.06)] p-10 md:p-24 overflow-hidden group"
                >
                    {/* Internal Decor */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-50/50 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none" />

                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center relative z-10">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full mb-8">
                                <BarChart3 className="w-3.5 h-3.5 text-black" />
                                <span className="text-[10px] font-black text-black uppercase tracking-[0.2em]">
                                    <EditableText fieldKey="insights_badge" fallback={t('landing.insights.badge', 'Institutional Data')} />
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black text-black mb-10 uppercase tracking-tighter leading-[0.9]">
                                <EditableText
                                    fieldKey="insights_title"
                                    fallback={t('landing.insights.title', '85% of Students Struggle with Logic & Reasoning')}
                                />
                            </h2>

                            <p className="text-xl md:text-2xl text-slate-500 font-bold leading-tight max-w-2xl [&_*]:!text-black/70">
                                <EditableText fieldKey="insights_description" fallback={t('landing.insights.description')} multiline />
                            </p>
                        </div>

                        <div className="flex-shrink-0 w-full lg:w-[380px] bg-slate-50/50 rounded-[3.5rem] p-10 md:p-14 border border-slate-100 relative group/stat hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                            <div className="text-center">
                                <div className="text-6xl md:text-8xl font-black text-black mb-4 tracking-tighter [&_*]:!text-black">
                                    <EditableText fieldKey="insights_stat_value" fallback={t('landing.insights.stat_value', '85%')} />
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10 [&_*]:!text-black/40">
                                    <EditableText fieldKey="insights_stat_label" fallback={t('landing.insights.stat_label', 'Difficulty Index')} />
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "85%" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        className="h-full bg-black"
                                    />
                                </div>
                                <div className="flex items-center gap-2 justify-center text-[10px] font-black uppercase tracking-widest text-slate-400 [&_*]:!text-black/30">
                                    <Info className="w-3.5 h-3.5" />
                                    <EditableText fieldKey="insights_source" fallback={t('landing.insights.source', 'Official 2026 Session Data')} />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HomeInsights;
