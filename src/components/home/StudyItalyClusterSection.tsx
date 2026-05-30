import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Globe,
    BookOpen,
    Euro,
    ShieldCheck,
    ArrowRight,
    ExternalLink,
    Sparkles,
    GraduationCap,
    MapPin,
    CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditableText from '@/components/cms/EditableText';
import { useTranslation } from 'react-i18next';

const StudyItalyClusterSection = () => {
    const { t } = useTranslation();

    const pillars = [
        {
            icon: Globe,
            titleKey: 'landing.italy_cluster.pillar1_title',
            descKey: 'landing.italy_cluster.pillar1_desc',
            defaultTitle: 'Admissions Strategy',
            defaultDesc: 'Master the UniversItaly portal and the mandatory DOV/CIMEA legalization process for 2026.',
            path: '/study-in-italy-guide-2026',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100'
        },
        {
            icon: MapPin,
            titleKey: 'landing.italy_cluster.pillar2_title',
            descKey: 'landing.italy_cluster.pillar2_desc',
            defaultTitle: 'University Selection',
            defaultDesc: 'Compare 90+ public and private institutions across Italy\'s top student cities like Milan, Rome, and Pavia.',
            path: '/study-in-italy/universities-2026',
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-100'
        },
        {
            icon: CreditCard,
            titleKey: 'landing.italy_cluster.pillar3_title',
            descKey: 'landing.italy_cluster.pillar3_desc',
            defaultTitle: 'Financial Planning',
            defaultDesc: 'Unlock DSU scholarships up to €7,000/year and understand income-based public university tuition.',
            path: '/study-in-italy/tuition-fees-2026',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100'
        },
        {
            icon: ShieldCheck,
            titleKey: 'landing.italy_cluster.pillar4_title',
            descKey: 'landing.italy_cluster.pillar4_desc',
            defaultTitle: 'Visa Protocol',
            defaultDesc: 'Navigate the Type D Student Visa requirements and embassy interview strategies with precision.',
            path: '/study-in-italy-guide-2026#visa',
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            border: 'border-rose-100'
        }
    ];

    return (
        <section className="py-12 bg-[#fcfcfc] relative overflow-hidden border-b border-[#eaeaea]">
            <div className="container mx-auto px-6 max-w-[1200px]">
                
                {/* ── THE MASTER STRATEGY CARD ── */}
                <div className="relative bg-white rounded-[8px] border border-[#eaeaea] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300 p-8 md:p-16 overflow-hidden group/main">

                    {/* Header Section */}
                    <div className="max-w-4xl mb-12 md:mb-16 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-8"
                        >
                            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                                <EditableText fieldKey="italy_cluster_badge" fallback={t('landing.italy_cluster.badge', 'Global Admission Strategy')} />
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-[32px] md:text-[40px] font-bold text-[#333333] mb-6 leading-tight"
                        >
                            <span className="text-black">
                                <EditableText
                                    fieldKey="italy_cluster_title"
                                    fallback={t('landing.italy_cluster.title', 'Study in Italy Guide')}
                                />
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-[16px] text-[#555555] leading-relaxed max-w-2xl"
                        >
                            <EditableText
                                fieldKey="italy_cluster_desc"
                                fallback={t('landing.italy_cluster.desc', 'The most precise, data-backed admission strategy for international students aiming for Italian excellence in 2026.')}
                            />
                        </motion.p>
                    </div>

                    {/* Roadmap Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                        {pillars.map((pillar, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="h-full"
                            >
                                <Link to={pillar.path} className="block h-full group/card">
                                    <div className="h-full bg-[#f8f9fe] rounded-[8px] p-6 border border-[#eaeaea] hover:border-[#5a4bda]/30 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col">
                                        <div className={`w-14 h-14 rounded-full ${pillar.bg} flex items-center justify-center mb-6 group-hover/card:scale-110 transition-transform duration-300`}>
                                            <pillar.icon className={`${pillar.color} w-6 h-6`} />
                                        </div>

                                        <h3 className="text-[18px] font-bold text-[#333333] mb-3 group-hover/card:text-[#5a4bda] transition-colors">
                                            <EditableText
                                                fieldKey={pillar.titleKey}
                                                fallback={t(pillar.titleKey, pillar.defaultTitle)}
                                            />
                                        </h3>

                                        <p className="text-[14px] text-[#555555] leading-relaxed mb-6">
                                            <EditableText
                                                fieldKey={pillar.descKey}
                                                fallback={t(pillar.descKey, pillar.defaultDesc)}
                                                multiline
                                            />
                                        </p>

                                        <div className="mt-auto pt-4 flex items-center gap-2 text-[#5a4bda] font-semibold text-[13px] opacity-0 group-hover/card:opacity-100 group-hover/card:translate-x-1 transition-all">
                                            <span>Access Strategy</span>
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Additional Quick Links */}
                    <div className="mt-16 pt-12 border-t border-white/5 relative z-10 flex flex-wrap justify-center gap-6">
                        <Link 
                            to="/study-in-italy/without-ielts" 
                            className="flex items-center gap-2 px-6 py-3 bg-[#f8f9fe] rounded-[8px] text-[14px] font-semibold text-[#555555] hover:text-[#5a4bda] hover:bg-[#f4f7ff] hover:border-[#5a4bda]/30 border border-[#eaeaea] transition-all"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            Study Without IELTS
                        </Link>
                        <Link 
                            to="/study-in-italy/how-to-apply" 
                            className="flex items-center gap-2 px-6 py-3 bg-[#f8f9fe] rounded-[8px] text-[14px] font-semibold text-[#555555] hover:text-[#5a4bda] hover:bg-[#f4f7ff] hover:border-[#5a4bda]/30 border border-[#eaeaea] transition-all"
                        >
                            <ExternalLink className="w-4 h-4" />
                            How to Apply (Steps)
                        </Link>
                        <Link 
                            to="/study-in-italy/universities-2026" 
                            className="flex items-center gap-2 px-6 py-3 bg-[#f8f9fe] rounded-[8px] text-[14px] font-semibold text-[#555555] hover:text-[#5a4bda] hover:bg-[#f4f7ff] hover:border-[#5a4bda]/30 border border-[#eaeaea] transition-all"
                        >
                            <MapPin className="w-4 h-4" />
                            90+ Public Universities List
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StudyItalyClusterSection;
