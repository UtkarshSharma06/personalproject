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
        <section className="pt-0 pb-12 bg-white relative overflow-hidden" id="authority-hub">
            <div className="container mx-auto px-6 max-w-7xl">
                
                {/* Standardized Section Header */}
                <div className="flex flex-col items-center text-center justify-center gap-4 mb-12 md:mb-16">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full mb-8"
                        >
                            <Book className="w-3.5 h-3.5 text-black" />
                            <span className="text-[10px] font-black text-black uppercase tracking-[0.2em]">
                                <EditableText fieldKey="seo_hub_badge" fallback={t('landing.seo_hub.badge', 'Institutional Library')} />
                            </span>
                        </motion.div>
                        
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter leading-[0.9]"
                        >
                            <EditableText
                                fieldKey="seo_hub_title"
                                fallback={t('landing.seo_hub.title', 'The Authority Hub: Ultimate Guides 2026')}
                            />
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mt-8 text-xl text-slate-500 font-bold max-w-2xl mx-auto leading-tight [&_*]:!text-black/70"
                        >
                            <EditableText fieldKey="seo_hub_description" fallback={t('landing.seo_hub.description')} />
                        </motion.p>
                    </div>
                </div>

                {/* Knowledge Vault Clusters */}
                <div className="grid lg:grid-cols-2 gap-12">
                    
                    {/* CEnT-S Cluster */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-6 p-8 bg-slate-50/50 rounded-[3rem] border border-slate-100 relative overflow-hidden group">
                            <div className="w-1.5 h-12 bg-indigo-600 rounded-full" />
                            <div>
                                <h3 className="text-2xl font-black text-black uppercase tracking-tight [&_*]:!text-black">
                                    <EditableText fieldKey="cents_hub_title" fallback="CEnT-S 2026 Master Hub" />
                                </h3>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Syllabus & Strategy Vault</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {centsLinks.map((link, idx) => (
                                <Link
                                    key={link.key}
                                    to={link.path}
                                    className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                                            {getLinkIcon(link.key)}
                                        </div>
                                        <span className="text-[10px] font-black text-black uppercase tracking-[0.1em] group-hover:text-indigo-600 transition-colors [&_*]:!text-black group-hover:[&_*]:!text-indigo-600">
                                            <EditableText fieldKey={`hub_cents_${link.key}`} fallback={link.label} />
                                        </span>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* IMAT Cluster */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-6 p-8 bg-slate-50/50 rounded-[3rem] border border-slate-100 relative overflow-hidden group">
                            <div className="w-1.5 h-12 bg-rose-600 rounded-full" />
                            <div>
                                <h3 className="text-2xl font-black text-black uppercase tracking-tight [&_*]:!text-black">
                                    <EditableText fieldKey="imat_hub_title" fallback="IMAT 2026 Authority Pillar" />
                                </h3>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Official Test Blueprints</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {imatLinks.map((link, idx) => (
                                <Link
                                    key={link.key}
                                    to={link.path}
                                    className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 hover:border-rose-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-rose-600 group-hover:bg-rose-50 transition-colors">
                                            {getLinkIcon(link.key)}
                                        </div>
                                        <span className="text-[10px] font-black text-black uppercase tracking-[0.1em] group-hover:text-rose-600 transition-colors [&_*]:!text-black group-hover:[&_*]:!text-rose-600">
                                            <EditableText fieldKey={`hub_imat_${link.key}`} fallback={link.label} />
                                        </span>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-200 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
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
