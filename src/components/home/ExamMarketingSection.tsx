import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, ExternalLink, BookOpen, GraduationCap, ArrowRight, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import EditableText from '@/components/cms/EditableText';
import { cn } from '@/lib/utils';

interface ExamMarketingSectionProps {
    className?: string;
}

const ExamMarketingSection = ({ className }: ExamMarketingSectionProps) => {
    const { t } = useTranslation();

    const exams = [
        {
            key: 'imat',
            title: t('landing.imat_marketing.title'),
            badge: t('landing.imat_marketing.badge'),
            badgeIcon: Stethoscope,
            description: t('landing.imat_marketing.subtitle'),
            features: [
                t('landing.imat_marketing.feature1'),
                t('landing.imat_marketing.feature2'),
                t('landing.imat_marketing.feature3')
            ],
            cta: t('landing.imat_marketing.cta'),
            path: '/imat',
            accent: 'indigo',
            gradient: 'from-indigo-600 to-blue-600',
            bgGradient: 'from-indigo-50/50 to-white'
        },
        {
            key: 'cents',
            title: t('landing.cents_marketing.title'),
            badge: t('landing.cents_marketing.badge'),
            badgeIcon: GraduationCap,
            description: t('landing.cents_marketing.subtitle'),
            features: [
                t('landing.cents_marketing.feature1'),
                t('landing.cents_marketing.feature2'),
                t('landing.cents_marketing.feature3')
            ],
            cta: t('landing.cents_marketing.cta'),
            path: '/cent-s',
            accent: 'slate',
            gradient: 'from-slate-800 to-slate-600',
            bgGradient: 'from-slate-50/50 to-white'
        }
    ];

    return (
        <section className={`pt-2 pb-0 relative overflow-hidden bg-white ${className}`}>
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header - Compact & Premium */}
                <div className="text-center mb-10 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full mb-4">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                            {t('landing.exam_marketing_hub.badge')}
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-black mb-6 uppercase tracking-tighter leading-[0.9]">
                        <EditableText
                            fieldKey="exam_marketing_hub_title"
                            fallback={t('landing.exam_marketing_hub.title')}
                        />
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                    {exams.map((exam, idx) => (
                        <motion.div
                            key={exam.key}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative"
                        >
                            <div className={cn(
                                "h-full rounded-[2.5rem] p-8 md:p-12 transition-all duration-500",
                                "bg-gradient-to-br border border-white/5 shadow-sm",
                                "hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1 hover:border-indigo-100",
                                exam.bgGradient
                            )}>
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                                            exam.accent === 'indigo' ? "bg-indigo-600 text-white" : "bg-slate-900 text-white"
                                        )}>
                                            <exam.badgeIcon className="w-6 h-6" />
                                        </div>
                                        <div className="px-3 py-1 bg-white/50 backdrop-blur-md border border-white/50 rounded-full">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {exam.badge}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-3xl md:text-4xl font-black text-black mb-4 tracking-tighter leading-tight">
                                        <EditableText fieldKey={`${exam.key}_marketing_title`} fallback={exam.title} />
                                    </h3>

                                    <p className="text-slate-500 font-bold text-sm md:text-base leading-relaxed mb-8 flex-1">
                                        <EditableText fieldKey={`${exam.key}_marketing_description`} fallback={exam.description} multiline />
                                    </p>

                                    <div className="space-y-3 mb-10">
                                        {exam.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                                    <CheckCircle className="w-3 text-emerald-500" />
                                                </div>
                                                <span className="text-[13px] md:text-sm text-slate-600 font-bold">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link to={exam.path}>
                                        <Button className={cn(
                                            "w-full h-14 md:h-16 rounded-2xl font-black text-sm md:text-base transition-all group/btn",
                                            exam.accent === 'indigo' 
                                                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-100" 
                                                : "bg-slate-900 hover:bg-black text-white shadow-xl shadow-slate-100"
                                        )}>
                                            <EditableText fieldKey={`${exam.key}_marketing_cta`} fallback={exam.cta} />
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExamMarketingSection;
