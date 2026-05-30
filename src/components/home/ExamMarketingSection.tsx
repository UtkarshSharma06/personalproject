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
        <section className={`py-12 relative overflow-hidden bg-white border-b border-[#eaeaea] ${className}`}>
            <div className="container mx-auto px-6 max-w-[1200px]">
                {/* Header - Compact & Premium */}
                <div className="text-center mb-10 relative z-10">
                    <div className="hidden">
                        {/* Hidden badge to keep editable text structure if needed */}
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                            {t('landing.exam_marketing_hub.badge')}
                        </span>
                    </div>
                    <h2 className="text-[32px] md:text-[40px] font-bold text-[#333333] mb-4 leading-tight">
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
                                "h-full rounded-[8px] p-8 md:p-10 transition-all duration-300",
                                "bg-white border border-[#eaeaea]",
                                "hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                            )}>
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300",
                                            "bg-[#f8f9fe] text-[#5a4bda] border border-[#eaeaea]"
                                        )}>
                                            <exam.badgeIcon className="w-6 h-6" />
                                        </div>
                                        <div className="px-4 py-1.5 bg-[#f4f7ff] border border-[#5a4bda]/20 rounded-full">
                                            <span className="text-[12px] font-bold text-[#5a4bda]">
                                                {exam.badge}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-[24px] md:text-[28px] font-bold text-[#333333] mb-3 leading-tight">
                                        <EditableText fieldKey={`${exam.key}_marketing_title`} fallback={exam.title} />
                                    </h3>

                                    <p className="text-[#555555] text-[15px] leading-relaxed mb-6 flex-1">
                                        <EditableText fieldKey={`${exam.key}_marketing_description`} fallback={exam.description} multiline />
                                    </p>

                                    <div className="space-y-3 mb-10">
                                        {exam.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                                    <CheckCircle className="w-4 h-4" />
                                                </div>
                                                <span className="text-[14px] text-[#555555]">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link to={exam.path}>
                                        <Button className="w-full h-12 bg-[#5a4bda] text-white font-semibold text-[16px] rounded-[4px] hover:bg-[#483ab8] transition-all group/btn shadow-none">
                                            <EditableText fieldKey={`${exam.key}_marketing_cta`} fallback={exam.cta} />
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
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
