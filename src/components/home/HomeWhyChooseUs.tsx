import { motion } from 'framer-motion';
import { Target, Zap, Users, Shield, Rocket, Heart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from '@/components/ui/button';
import EditableText from '@/components/cms/EditableText';

const HomeWhyChooseUs = () => {
    const { t } = useTranslation();

    const benefits = [
        {
            icon: <Target className="w-6 h-6" />,
            titleKey: 'landing.why_us.benefits.calibration_title',
            descKey: 'landing.why_us.benefits.calibration_desc',
            fieldKeyPrefix: 'why_choose_step1',
            color: "bg-indigo-50 text-indigo-600 border-indigo-100"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            titleKey: 'landing.why_us.benefits.adaptive_title',
            descKey: 'landing.why_us.benefits.adaptive_desc',
            fieldKeyPrefix: 'why_choose_step2',
            color: "bg-amber-50 text-amber-600 border-amber-100"
        },
        {
            icon: <Rocket className="w-6 h-6" />,
            titleKey: 'landing.why_us.benefits.bank_title',
            descKey: 'landing.why_us.benefits.bank_desc',
            fieldKeyPrefix: 'why_choose_step3',
            color: "bg-rose-50 text-rose-600 border-rose-100"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            titleKey: 'landing.why_us.benefits.simulation_title',
            descKey: 'landing.why_us.benefits.simulation_desc',
            fieldKeyPrefix: 'why_choose_step4',
            color: "bg-emerald-50 text-emerald-600 border-emerald-100"
        },
        {
            icon: <Users className="w-6 h-6" />,
            titleKey: 'landing.why_us.benefits.videos_title',
            descKey: 'landing.why_us.benefits.videos_desc',
            fieldKeyPrefix: 'why_choose_step5',
            color: "bg-violet-50 text-violet-600 border-violet-100"
        },
        {
            icon: <Heart className="w-6 h-6" />,
            titleKey: 'landing.why_us.benefits.free_title',
            descKey: 'landing.why_us.benefits.free_desc',
            fieldKeyPrefix: 'why_choose_step6',
            color: "bg-cyan-50 text-cyan-600 border-cyan-100"
        }
    ];

    return (
        <section className="pt-0 pb-12 bg-white relative overflow-hidden" id="why-choose-us">
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
                            <Shield className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                <EditableText fieldKey="why_choose_badge" fallback={t('landing.why_us.badge', 'Platform Distinction')} />
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
                                fieldKey="why_choose_title"
                                fallback={t('landing.why_us.title', 'The Preferred Choice for')}
                            />
                        </motion.h2>
                    </div>
                </div>

                {/* Institutional Benefit Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {benefits.map((benefit, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-10 rounded-[3rem] bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group flex flex-col"
                        >
                            <div className={cn(
                                "w-14 h-14 rounded-2xl border flex items-center justify-center mb-10 transition-transform group-hover:scale-110 shadow-sm",
                                benefit.color
                            )}>
                                {benefit.icon}
                            </div>
                            
                            <h3 className="text-lg font-black !text-black mb-4 uppercase tracking-tight group-hover:text-indigo-600 transition-colors [&_*]:!text-black">
                                <EditableText fieldKey={`${benefit.fieldKeyPrefix}_title`} fallback={t(benefit.titleKey)} />
                            </h3>
                            
                            <p className="text-[13px] !text-black/70 font-bold leading-relaxed [&_*]:!text-black/70">
                                <EditableText fieldKey={`${benefit.fieldKeyPrefix}_desc`} fallback={t(benefit.descKey)} multiline />
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Final Professional CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 md:mt-24 flex justify-center"
                >
                    <Link to="/blog">
                        <Button className="h-12 md:h-16 px-8 md:px-10 bg-slate-900 text-white rounded-full font-black text-[10px] md:text-sm uppercase tracking-widest shadow-2xl shadow-slate-200 hover:bg-black hover:scale-105 transition-all group">
                            <EditableText fieldKey="why_choose_cta" fallback={t('landing.why_us.cta', 'Explore Our Method')} />
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default HomeWhyChooseUs;
