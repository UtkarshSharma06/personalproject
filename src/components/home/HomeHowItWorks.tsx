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
            color: "text-emerald-600"
        },
        {
            icon: <Cpu className="w-6 h-6" />,
            titleKey: 'landing.how_it_works.steps.diagnostic_title',
            descKey: 'landing.how_it_works.steps.diagnostic_desc',
            fieldKeyPrefix: 'how_it_works_step2',
            color: "text-rose-600"
        },
        {
            icon: <BookOpen className="w-6 h-6" />,
            titleKey: 'landing.how_it_works.steps.mastery_title',
            descKey: 'landing.how_it_works.steps.mastery_desc',
            fieldKeyPrefix: 'how_it_works_step3',
            color: "text-pink-600"
        },
        {
            icon: <Layout className="w-6 h-6" />,
            titleKey: 'landing.how_it_works.steps.bank_title',
            descKey: 'landing.how_it_works.steps.bank_desc',
            fieldKeyPrefix: 'how_it_works_step4',
            color: "text-violet-600"
        },
        {
            icon: <ShieldCheck className="w-6 h-6" />,
            titleKey: 'landing.how_it_works.steps.mocks_title',
            descKey: 'landing.how_it_works.steps.mocks_desc',
            fieldKeyPrefix: 'how_it_works_step5',
            color: "text-blue-700"
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            titleKey: 'landing.how_it_works.steps.precision_title',
            descKey: 'landing.how_it_works.steps.precision_desc',
            fieldKeyPrefix: 'how_it_works_step6',
            color: "text-teal-600"
        }
    ];

    return (
        <section className="pt-0 pb-12 bg-white relative overflow-hidden" id="how-it-works">
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
                            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                <EditableText fieldKey="how_it_works_badge" fallback={t('landing.how_it_works.badge', 'Total Mastery')} />
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
                                fieldKey="how_it_works_title"
                                fallback={t('landing.how_it_works.title', 'One Ecosystem. Total Mastery.')}
                            />
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mt-10 text-xl md:text-2xl text-slate-500 font-bold max-w-2xl mx-auto leading-tight [&_*]:!text-black/70"
                        >
                            <EditableText fieldKey="how_it_works_description" fallback={t('landing.how_it_works.description')} multiline />
                        </motion.p>
                    </div>
                </div>

                {/* Strategic Ecosystem Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="h-full"
                        >
                            <div className="h-full bg-white rounded-[3rem] p-10 border border-slate-100 hover:border-indigo-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col group">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-10 relative group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                                    <div className="text-slate-600 group-hover:text-indigo-600 transition-colors">
                                        {step.icon}
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-black text-[10px] shadow-lg">
                                        {i + 1}
                                    </div>
                                </div>

                                <h3 className="text-lg font-black text-black mb-4 uppercase tracking-tight group-hover:text-indigo-600 transition-colors [&_*]:!text-black">
                                    <EditableText fieldKey={`${step.fieldKeyPrefix}_title`} fallback={t(step.titleKey)} />
                                </h3>
                                
                                <p className="text-[13px] text-slate-500 font-bold leading-relaxed [&_*]:!text-black/70">
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
