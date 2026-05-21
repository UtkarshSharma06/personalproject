import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, MessageCircleQuestion } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EditableText from '@/components/cms/EditableText';

import FAQSchema from '@/components/seo/FAQSchema';

const FAQItem = ({ questionKey, answerKey, fallbackQuestion, fallbackAnswer, isOpen, onClick }: any) => {
    return (
        <div 
            className={`group rounded-[2rem] border transition-all duration-300 ${
                isOpen 
                ? 'bg-white border-indigo-100 shadow-[0_20px_50px_-12px_rgba(79,70,229,0.08)]' 
                : 'bg-slate-50/50 border-slate-100 hover:border-slate-200 hover:bg-white'
            }`}
        >
            <button
                onClick={onClick}
                className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-4 focus:outline-none"
            >
                <div className="flex items-center gap-4 md:gap-6">
                    <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                        isOpen ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 group-hover:text-indigo-600 border border-slate-100 shadow-sm'
                    }`}>
                        <HelpCircle size={20} className="md:w-6 md:h-6" />
                    </div>
                    <h3 className={`text-base md:text-lg lg:text-xl font-black tracking-tight leading-tight transition-colors duration-300 ${
                        isOpen ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'
                    }`}>
                        <EditableText fieldKey={questionKey} fallback={fallbackQuestion} />
                    </h3>
                </div>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isOpen ? 'bg-indigo-50 text-indigo-600 rotate-180' : 'bg-slate-200/50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                }`}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 md:px-8 pb-8 md:pb-10 ml-0 md:ml-[4.5rem]">
                            <div className="h-px w-full bg-slate-100 mb-6" />
                            <div className="text-slate-500 font-bold leading-relaxed text-sm md:text-base lg:text-lg max-w-3xl">
                                <EditableText fieldKey={answerKey} fallback={fallbackAnswer} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQSection = () => {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

    // Generate FAQ Schema items
    const faqSchemaItems = Array.from({ length: 10 }).map((_, index) => ({
        question: t(`landing.faq.q${index + 1}`),
        answer: t(`landing.faq.a${index + 1}`)
    }));

    return (
        <section className="py-24 md:py-32 bg-white relative overflow-hidden">
            {/* SEO FAQ Schema */}
            <FAQSchema items={faqSchemaItems} />
            
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/30 blur-[120px] rounded-full -mt-48 pointer-events-none" />
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16 md:mb-24">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-6 border border-indigo-100"
                        >
                            <MessageCircleQuestion className="w-4 h-4 text-indigo-600" />
                            <span className="text-[10px] md:text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">
                                Support Hub
                            </span>
                        </motion.div>
                        
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-slate-900 mb-8 uppercase tracking-tighter leading-[0.9]"
                        >
                            <EditableText fieldKey="faq_hub_title" fallback={t('landing.faq.title')} />
                        </motion.h2>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-500 font-bold max-w-2xl mx-auto"
                        >
                            <EditableText fieldKey="faq_hub_description" fallback={t('landing.faq.description')} />
                        </motion.p>
                    </div>

                    <div className="flex flex-col gap-4 md:gap-6">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <FAQItem
                                    questionKey={`faq_2026_q${index + 1}`}
                                    answerKey={`faq_2026_a${index + 1}`}
                                    fallbackQuestion={t(`landing.faq.q${index + 1}`)}
                                    fallbackAnswer={t(`landing.faq.a${index + 1}`)}
                                    isOpen={openIndex === index}
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Still have questions CTA */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="mt-20 text-center p-12 rounded-[3rem] bg-slate-50 border border-slate-100"
                    >
                        <h4 className="text-xl md:text-2xl font-black text-slate-900 mb-4">Still have questions?</h4>
                        <p className="text-slate-500 font-bold mb-8">Our admission experts are here to help you 24/7.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a 
                                href="/contact" 
                                className="px-8 py-4 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                Contact Support
                            </a>
                            <a 
                                href="https://chat.whatsapp.com/CfVh7u9L6vT7ZFpZwwVa4A" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200 flex items-center gap-2"
                            >
                                Chat on WhatsApp
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
