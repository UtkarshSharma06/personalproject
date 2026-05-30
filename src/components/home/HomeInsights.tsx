import { motion } from 'framer-motion';
import { BarChart3, Info } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import EditableText from '@/components/cms/EditableText';

const HomeInsights = () => {
    const { t } = useTranslation();

    return (
        <section className="pt-16 pb-24 bg-[#fcfcfc] overflow-hidden border-b border-[#eaeaea]">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative bg-white rounded-2xl border border-[#eaeaea] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300 p-8 md:p-16 overflow-hidden group"
                >
                    {/* Internal Decor */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-50 rounded-full -mr-32 -mt-32 pointer-events-none" />

                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center relative z-10">
                        <div className="flex-1">
                            <h2 className="text-[28px] md:text-[34px] font-bold text-[#333333] mb-6 leading-tight">
                                <EditableText
                                    fieldKey="insights_title"
                                    fallback={t('landing.insights.title', '85% of Students Struggle with Logic & Reasoning')}
                                />
                            </h2>

                            <p className="text-[15px] md:text-[16px] text-[#555555] leading-relaxed max-w-2xl">
                                <EditableText fieldKey="insights_description" fallback={t('landing.insights.description')} multiline />
                            </p>
                        </div>

                        <div className="flex-shrink-0 w-full lg:w-[380px] bg-white rounded-2xl p-8 md:p-12 border border-[#eaeaea] relative group/stat transition-all duration-300 hover:shadow-sm">
                            <div className="text-center">
                                <div className="text-[64px] md:text-[80px] font-bold text-[#5a4bda] mb-2 leading-none">
                                    <EditableText fieldKey="insights_stat_value" fallback={t('landing.insights.stat_value', '85%')} />
                                </div>
                                <div className="text-[14px] font-medium text-[#555555] mb-8">
                                    <EditableText fieldKey="insights_stat_label" fallback={t('landing.insights.stat_label', 'Difficulty Index')} />
                                </div>
                                <div className="h-2 w-full bg-[#eaeaea] rounded-full overflow-hidden mb-6">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "85%" }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                                        className="h-full bg-[#5a4bda]"
                                    />
                                </div>
                                <div className="flex items-center gap-2 justify-center text-[12px] font-medium text-[#888888] [&_*]:!text-[#888888]">
                                    <Info className="w-4 h-4" />
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
