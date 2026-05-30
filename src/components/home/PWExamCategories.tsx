import { Link } from 'react-router-dom';
import { ArrowRight, Stethoscope, Microscope, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function PWExamCategories() {
    const { t } = useTranslation();

    const exams = [
        {
            title: t('about.exams.imat.title', "IMAT"),
            badges: [t('about.exams.imat.badges.0', "Medicine"), t('about.exams.imat.badges.1', "Surgery"), t('about.exams.imat.badges.2', "Dentistry")],
            icon: <Stethoscope className="w-12 h-12 text-[#ff4b4b]" />,
            bgColor: "bg-[#fff0f0]",
            artColor: "#ff4b4b",
            link: "/imat-exam-ultimate-guide-2026"
        },
        {
            title: t('about.exams.cents.title', "CEnT-S"),
            badges: [t('about.exams.cents.badges.0', "Engineering"), t('about.exams.cents.badges.1', "Science"), t('about.exams.cents.badges.2', "Architecture")],
            icon: <Microscope className="w-12 h-12 text-[#f2994a]" />,
            bgColor: "bg-[#fff8f0]",
            artColor: "#f2994a",
            link: "/cent-s-exam-ultimate-guide"
        },
        {
            title: t('about.exams.tolc.title', "TOLC"),
            badges: [t('about.exams.tolc.badges.0', "Economics"), t('about.exams.tolc.badges.1', "Humanities"), t('about.exams.tolc.badges.2', "Pharmacy")],
            icon: <BookOpen className="w-12 h-12 text-[#4b7cff]" />,
            bgColor: "bg-[#f0f4ff]",
            artColor: "#4b7cff",
            link: "/tolc-exam-ultimate-guide-2026"
        }
    ];

    return (
        <section className="w-full bg-[#fcfcfc] pt-12 pb-24">
            <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="text-center mb-10"
                >
                    <h2 className="text-[28px] md:text-[34px] font-bold text-[#333333] mb-3">
                        {t('about.exams.title', "Exam Categories")}
                    </h2>
                    <p className="text-[15px] md:text-[16px] text-[#555555]">
                        {t('about.exams.subtitle', "ItaloStudy is preparing students for top Italian university exams. Scroll down to find the one you are preparing for")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exams.map((exam, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
                        >
                            <Link
                                to={exam.link}
                                className="relative bg-white border border-[#eaeaea] rounded-2xl p-6 overflow-hidden flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow min-h-[220px]"
                            >
                            {/* Artistic Background Artwork */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl z-0">
                                {/* SVG Abstract blobs & dots */}
                                <svg className="absolute inset-0 w-full h-full opacity-[0.03]" style={{ color: exam.artColor }} xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id={`dots-${index}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                            <circle fill="currentColor" cx="2" cy="2" r="2"></circle>
                                        </pattern>
                                    </defs>
                                    <rect x="0" y="0" width="100%" height="100%" fill={`url(#dots-${index})`}></rect>
                                    <circle cx="90%" cy="10%" r="60" fill="currentColor" opacity="0.4" />
                                    <circle cx="10%" cy="90%" r="40" fill="currentColor" opacity="0.6" />
                                    <path d="M 0 100 Q 50 150 100 100 T 200 100 L 200 220 L 0 220 Z" fill="currentColor" opacity="0.2" transform="scale(1.5) translate(0, 50)" />
                                </svg>
                            </div>

                            {/* Right side background circle shape */}
                            <div className={`absolute -right-6 top-1/2 -translate-y-1/2 w-[160px] h-[220px] rounded-l-[100px] ${exam.bgColor} flex items-center justify-center z-10 transition-transform group-hover:scale-105 duration-300`}>
                                {exam.icon}
                            </div>

                            {/* Left Content */}
                            <div className="relative z-10 flex flex-col h-full">
                                <div>
                                    <h3 className="text-[22px] font-bold text-[#333333] mb-5">
                                        {exam.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mb-8 pr-12">
                                        {exam.badges.map(badge => (
                                            <span 
                                                key={badge} 
                                                className="border border-[#e2e8f0] text-[#64748b] text-[12px] px-3 py-1 rounded-full bg-white"
                                            >
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 text-[#4b4b4b] text-[15px] mt-auto group">
                                    {t('about.exams.explore', "Explore Category")} 
                                    <div className="w-[26px] h-[26px] rounded-full bg-[#f1f5f9] flex items-center justify-center transition-colors">
                                        <ArrowRight className="w-[14px] h-[14px]" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
