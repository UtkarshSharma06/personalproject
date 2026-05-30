import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Book, FileText, BarChart, Settings, History, HelpCircle, Calendar, GraduationCap, Scale, BookOpen, ClipboardCheck, Zap, Globe, Target, Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EditableText from '@/components/cms/EditableText';
import { usePageContent } from '@/hooks/usePageContent';
import { imatLinks, centsLinks, studyItalyLinks, tolcLinks } from '@/lib/nav-links';

const HomeSEOHub = () => {
    const { t } = useTranslation();
    const { getField } = usePageContent('landing-global');

    // Helper to get consistent icons based on key
    const getLinkIcon = (key: string) => {
        switch (key) {
            case 'ultimate': return <GraduationCap className="w-4 h-4" />;
            case 'syllabus': return <BookOpen className="w-4 h-4" />;
            case 'pattern': return <Settings className="w-4 h-4" />;
            case 'cutoff': return <BarChart className="w-4 h-4" />;
            case 'prep': case 'strategy': return <FileText className="w-4 h-4" />;
            case 'mock': return <Target className="w-4 h-4" />;
            case 'papers': return <History className="w-4 h-4" />;
            case 'books': return <Book className="w-4 h-4" />;
            case 'eligibility': return <ShieldCheck className="w-4 h-4" />;
            case 'registration': case 'register': return <ClipboardCheck className="w-4 h-4" />;
            case 'dates': return <Calendar className="w-4 h-4" />;
            case 'difficulty': return <Zap className="w-4 h-4" />;
            case 'passing': return <Calculator className="w-4 h-4" />;
            case 'vs': return <Scale className="w-4 h-4" />;
            default: return <ArrowRight className="w-4 h-4" />;
        }
    };

    return (
        <section className="pt-16 pb-24 bg-[#fcfcfc] relative overflow-hidden border-b border-[#eaeaea]" id="authority-hub">
            <div className="container mx-auto px-6 max-w-[1200px]">
                
                {/* Standardized Section Header */}
                <div className="flex flex-col items-center text-center justify-center gap-2 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="max-w-4xl"
                    >
                        <h2 className="text-[28px] md:text-[34px] font-bold text-[#333333] leading-tight">
                            <EditableText
                                fieldKey="seo_hub_title"
                                fallback={t('landing.seo_hub.title', 'The Authority Hub: Ultimate Guides 2026')}
                            />
                        </h2>

                        <p className="mt-4 text-[15px] md:text-[16px] text-[#555555] max-w-2xl mx-auto leading-relaxed">
                            <EditableText fieldKey="seo_hub_description" fallback={t('landing.seo_hub.description')} />
                        </p>
                    </motion.div>
                </div>

                {/* Knowledge Vault Clusters */}
                <div className="grid lg:grid-cols-2 gap-12">
                    
                    {/* CEnT-S Cluster */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-[#eaeaea] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow">
                            <div className="w-1.5 h-10 bg-[#5a4bda] rounded-full" />
                            <div>
                                <h3 className="text-[20px] font-bold text-[#333333]">
                                    <EditableText fieldKey="cents_hub_title" fallback="CEnT-S 2026 Master Hub" />
                                </h3>
                                <p className="text-[13px] text-[#555555] mt-1">Syllabus & Strategy Vault</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {centsLinks.map((link, idx) => (
                                <Link
                                    key={link.key}
                                    to={link.path}
                                    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#eaeaea] hover:border-[#eaeaea] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all group relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[#333333] border border-[#eaeaea] group-hover:bg-[#5a4bda] group-hover:text-white transition-colors">
                                            {getLinkIcon(link.key)}
                                        </div>
                                        <span className="text-[14px] font-semibold text-[#333333]">
                                            <EditableText fieldKey={`hub_cents_${link.key}`} fallback={link.label} />
                                        </span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-[#cccccc] group-hover:text-[#5a4bda] group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* IMAT Cluster */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-[#eaeaea] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow">
                            <div className="w-1.5 h-10 bg-[#5a4bda] rounded-full" />
                            <div>
                                <h3 className="text-[20px] font-bold text-[#333333]">
                                    <EditableText fieldKey="imat_hub_title" fallback="IMAT 2026 Authority Pillar" />
                                </h3>
                                <p className="text-[13px] text-[#555555] mt-1">Official Test Blueprints</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {imatLinks.map((link, idx) => (
                                <Link
                                    key={link.key}
                                    to={link.path}
                                    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#eaeaea] hover:border-[#eaeaea] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all group relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[#333333] border border-[#eaeaea] group-hover:bg-[#5a4bda] group-hover:text-white transition-colors">
                                            {getLinkIcon(link.key)}
                                        </div>
                                        <span className="text-[14px] font-semibold text-[#333333]">
                                            <EditableText fieldKey={`hub_imat_${link.key}`} fallback={link.label} />
                                        </span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-[#cccccc] group-hover:text-[#5a4bda] group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

// Simple icon fallback for ShieldCheck which might be missing from some lucide versions or imports
const ShieldCheck = ({ className, size }: { className?: string, size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || 24}
        height={size || 24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

export default HomeSEOHub;
