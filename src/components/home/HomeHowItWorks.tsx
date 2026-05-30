import { motion } from 'framer-motion';
import { UserPlus, Cpu, BookOpen, Layout, ShieldCheck, BarChart3, Search } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { cn } from '@/lib/utils';
import EditableText from '@/components/cms/EditableText';

const HomeHowItWorks = () => {
    const { t } = useTranslation();

    const steps = [
        {
            icon: <UserPlus className="w-6 h-6" />,
            titleKey: 'landing.how_it_works.steps.registration_title',
            descKey: 'landing.how_it_works.steps.registration_desc',
            fieldKeyPrefix: 'how_it_works_step1',
            color: "text-[#5a4bda]"
        },
        {
            icon: <Cpu className="w-6 h-6" />,
            titleKey: 'landing.how_it_works.steps.diagnostic_title',
            descKey: 'landing.how_it_works.steps.diagnostic_desc',
            fieldKeyPrefix: 'how_it_works_step2',
            color: "text-[#5a4bda]"
        },
        {
            icon: <BookOpen className="w-6 h-6" />,
            titleKey: 'landing.how_it_works.steps.mastery_title',
            descKey: 'landing.how_it_works.steps.mastery_desc',
            fieldKeyPrefix: 'how_it_works_step3',
            color: "text-[#5a4bda]"
        },
        {
            icon: <Layout className="w-6 h-6" />,
            titleKey: 'landing.how_it_works.steps.bank_title',
            descKey: 'landing.how_it_works.steps.bank_desc',
            fieldKeyPrefix: 'how_it_works_step4',
            color: "text-[#5a4bda]"
        },
        {
            icon: <ShieldCheck className="w-6 h-6" />,
            titleKey: 'landing.how_it_works.steps.mocks_title',
            descKey: 'landing.how_it_works.steps.mocks_desc',
            fieldKeyPrefix: 'how_it_works_step5',
            color: "text-[#5a4bda]"
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            titleKey: 'landing.how_it_works.steps.precision_title',
            descKey: 'landing.how_it_works.steps.precision_desc',
            fieldKeyPrefix: 'how_it_works_step6',
            color: "text-[#5a4bda]"
        }
    ];

    return (
        <section className="pt-16 pb-24 bg-[#fcfcfc] relative overflow-hidden border-b border-[#eaeaea]" id="how-it-works">
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
                                fieldKey="how_it_works_title"
                                fallback={t('landing.how_it_works.title', 'One Ecosystem. Total Mastery.')}
                            />
                        </h2>

                        <p className="mt-4 text-[15px] md:text-[16px] text-[#555555] max-w-2xl mx-auto leading-relaxed">
                            <EditableText fieldKey="how_it_works_description" fallback={t('landing.how_it_works.description')} multiline />
                        </p>
                    </motion.div>
                </div>

                {/* Strategic Ecosystem Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.1 }}
                            className="h-full"
                        >
                            <div className="h-full bg-white rounded-2xl p-6 md:p-8 border border-[#eaeaea] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col group">
                                <div className={cn("w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-6 relative border border-[#eaeaea]", step.color)}>
                                    <div className="text-current">
                                        {step.icon}
                                    </div>
                                </div>

                                <h3 className="text-[18px] font-bold text-[#333333] mb-3">
                                    <EditableText fieldKey={`${step.fieldKeyPrefix}_title`} fallback={t(step.titleKey)} />
                                </h3>
                                
                                <p className="text-[14px] text-[#555555] leading-relaxed">
                                    <EditableText fieldKey={`${step.fieldKeyPrefix}_desc`} fallback={t(step.descKey)} multiline />
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeHowItWorks;
