import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import EditableText from '@/components/cms/EditableText';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { ArrowRight } from 'lucide-react';

export default function PWStudyResources() {
    const { t } = useTranslation();

    const resources = [
        {
            title: t('about.pw_resources.prep_books.title', "Preparation Books"),
            description: t('about.pw_resources.prep_books.desc', "Our academic experts have authored comprehensive study materials that distil complex concepts into easily digestible content."),
            bgColor: "bg-[#f4fbff]",
            image: "/images/prep_books.png",
            mobileImage: "/images/prep_books_mobile.png",
            link: "https://store.italostudy.com",
            showExploreBtn: true
        },
        {
            title: t('about.pw_resources.past_papers.title', "Past Papers & Solutions"),
            description: t('about.pw_resources.past_papers.desc', "Achieve academic excellence with ItaloStudy's official past papers, providing you with detailed, step-by-step solutions."),
            bgColor: "bg-[#fffaf0]",
            image: "/images/past_papers.png",
            mobileImage: "/images/past_papers_mobile.png",
            link: "https://italostudy.com/resources",
            showExploreBtn: false
        },
        {
            title: t('about.pw_resources.revision_notes.title', "Revision Notes"),
            description: t('about.pw_resources.revision_notes.desc', "Utilise ItaloStudy's detailed revision notes designed to simplify complex theories into clear, accessible language."),
            bgColor: "bg-[#f2fdf7]",
            image: "/images/revision_notes.png",
            mobileImage: "/images/revision_notes_mobile.png",
            link: "https://italostudy.com/resources",
            showExploreBtn: false
        }
    ];

    return (
        <section className="pt-16 pb-24 bg-white relative overflow-hidden border-b border-[#eaeaea]">
            <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
                
                {/* Header */}
                <div className="flex flex-col items-center text-center justify-center gap-2 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="max-w-4xl"
                    >
                        <h2 className="text-[28px] md:text-[36px] font-bold text-[#333333] mb-4">
                            <EditableText
                                fieldKey="study_resources_title"
                                fallback={t('landing.study_resources.title', 'Study Resources')}
                            />
                        </h2>

                        <p className="text-[16px] md:text-[18px] text-[#555555] max-w-2xl mx-auto">
                            <EditableText 
                                fieldKey="study_resources_description" 
                                fallback={t('landing.study_resources.description', 'A diverse array of learning materials to enhance your educational journey.')} 
                            />
                        </p>
                    </motion.div>
                </div>

                {/* Cards Grid / Scrollable on Mobile */}
                <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                    {resources.map((resource, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
                            className="w-[85vw] max-w-[340px] md:w-auto md:max-w-none flex-shrink-0 snap-center"
                        >
                            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="block h-full group">
                                <div className={`relative flex flex-col h-full rounded-2xl overflow-hidden ${resource.bgColor} transition-transform duration-300`}>
                                    
                                    {/* Text Content */}
                                    <div className="p-6 md:p-8 pb-2 md:pb-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-[20px] md:text-[24px] font-bold text-[#333333]">
                                                {resource.title}
                                            </h3>
                                            <ArrowRight className="w-5 h-5 text-[#555555] group-hover:translate-x-1 transition-transform" />
                                        </div>
                                        <p className="text-[14px] md:text-[15px] text-[#555555] leading-relaxed pr-2">
                                            {resource.description}
                                        </p>
                                    </div>

                                    {/* Image Content */}
                                    <div className="relative mt-auto pt-4 pb-6 flex justify-center items-end flex-1 min-h-[160px] md:min-h-[180px]">
                                        {/* Desktop Image */}
                                        <img 
                                            src={resource.image} 
                                            alt={resource.title} 
                                            className="hidden md:block w-[55%] max-h-[200px] object-contain transform group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                                        />
                                        {/* Mobile Image */}
                                        <img 
                                            src={resource.mobileImage} 
                                            alt={resource.title} 
                                            className="block md:hidden w-[80%] max-h-[140px] object-contain transform group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                                        />
                                        
                                        {resource.showExploreBtn && (
                                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                                                <button className="px-5 py-1.5 bg-[#1a1a1a] text-white text-[14px] font-semibold rounded-[6px] shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
                                                    {t('about.pw_resources.explore', "Explore")}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
