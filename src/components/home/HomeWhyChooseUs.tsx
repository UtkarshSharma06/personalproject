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
            color: "text-[#5a4bda]"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            titleKey: 'landing.why_us.benefits.adaptive_title',
            descKey: 'landing.why_us.benefits.adaptive_desc',
            fieldKeyPrefix: 'why_choose_step2',
            color: "text-[#5a4bda]"
        },
        {
            icon: <Rocket className="w-6 h-6" />,
            titleKey: 'landing.why_us.benefits.bank_title',
            descKey: 'landing.why_us.benefits.bank_desc',
            fieldKeyPrefix: 'why_choose_step3',
            color: "text-[#5a4bda]"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            titleKey: 'landing.why_us.benefits.simulation_title',
            descKey: 'landing.why_us.benefits.simulation_desc',
            fieldKeyPrefix: 'why_choose_step4',
            color: "text-[#5a4bda]"
        },
        {
            icon: <Users className="w-6 h-6" />,
            titleKey: 'landing.why_us.benefits.videos_title',
            descKey: 'landing.why_us.benefits.videos_desc',
            fieldKeyPrefix: 'why_choose_step5',
            color: "text-[#5a4bda]"
        },
        {
            icon: <Heart className="w-6 h-6" />,
            titleKey: 'landing.why_us.benefits.free_title',
            descKey: 'landing.why_us.benefits.free_desc',
            fieldKeyPrefix: 'why_choose_step6',
            color: "text-[#5a4bda]"
        }
    ];

    return (
        <section className="pt-16 pb-24 bg-[#fcfcfc] relative overflow-hidden border-b border-[#eaeaea]" id="why-choose-us">
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
                                fieldKey="why_choose_title"
                                fallback={t('landing.why_us.title', 'The Preferred Choice for European Admissions')}
                            />
                        </h2>
                    </motion.div>
                </div>

                {/* Institutional Benefit Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {benefits.map((benefit, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.1 }}
                            className="p-6 md:p-8 rounded-2xl bg-white border border-[#eaeaea] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col"
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-6 border border-[#eaeaea]",
                                benefit.color
                            )}>
                                {benefit.icon}
                            </div>
                            
                            <h3 className="text-[18px] font-bold text-[#333333] mb-3">
                                <EditableText fieldKey={`${benefit.fieldKeyPrefix}_title`} fallback={t(benefit.titleKey)} />
                            </h3>
                            
                            <p className="text-[14px] text-[#555555] leading-relaxed">
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
                    className="mt-12 md:mt-16 flex justify-center"
                >
                    <Link to="/blog">
                        <Button className="h-12 px-8 bg-[#5a4bda] text-white font-semibold text-[16px] rounded-[4px] hover:bg-[#483ab8] transition-all group shadow-none">
                            <EditableText fieldKey="why_choose_cta" fallback={t('landing.why_us.cta', 'Explore Our Method')} />
                            <ArrowRight className="ml-2 w-5 h-5 transition-transform" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default HomeWhyChooseUs;
