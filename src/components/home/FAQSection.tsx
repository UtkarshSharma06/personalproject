import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, MessageCircleQuestion } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EditableText from '@/components/cms/EditableText';

import FAQSchema from '@/components/seo/FAQSchema';

const FAQItem = ({ questionKey, answerKey, fallbackQuestion, fallbackAnswer, isOpen, onClick }: any) => {
    return (
        <div 
            className={`group rounded-2xl border transition-all duration-300 ${
                isOpen 
                ? 'bg-white border-[#eaeaea] shadow-[0_8px_30px_rgb(0,0,0,0.06)]' 
                : 'bg-[#fcfcfc] border-[#eaeaea] hover:bg-white hover:shadow-sm'
            }`}
        >
            <button
                onClick={onClick}
                className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-4 focus:outline-none"
            >
                <div className="flex items-center gap-4 md:gap-6">
                    <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        isOpen ? 'bg-[#5a4bda] text-white' : 'bg-white text-[#888888] group-hover:text-[#5a4bda] border border-[#eaeaea] shadow-sm'
                    }`}>
                        <HelpCircle size={20} className="md:w-6 md:h-6" />
                    </div>
                    <h3 className={`text-[16px] md:text-[18px] font-bold leading-tight transition-colors duration-300 ${
                        isOpen ? 'text-[#333333]' : 'text-[#555555] group-hover:text-[#333333]'
                    }`}>
                        <EditableText fieldKey={questionKey} fallback={fallbackQuestion} />
                    </h3>
                </div>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isOpen ? 'bg-[#f4f7ff] text-[#5a4bda] rotate-180' : 'bg-[#fcfcfc] text-[#888888] group-hover:bg-[#f4f7ff] group-hover:text-[#5a4bda]'
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
                            <div className="h-px w-full bg-[#eaeaea] mb-6" />
                            <div className="text-[#555555] font-medium leading-relaxed text-[15px] max-w-3xl">
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
        <section className="pt-16 pb-24 bg-[#fcfcfc] relative overflow-hidden border-b border-[#eaeaea]">
            {/* SEO FAQ Schema */}
            <FAQSchema items={faqSchemaItems} />
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <motion.h2 
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="text-[28px] md:text-[34px] font-bold text-[#333333] mb-4 leading-tight"
                        >
                            <EditableText fieldKey="faq_hub_title" fallback={t('landing.faq.title')} />
                        </motion.h2>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                            className="text-[15px] md:text-[16px] text-[#555555] max-w-2xl mx-auto"
                        >
                            <EditableText fieldKey="faq_hub_description" fallback={t('landing.faq.description')} />
                        </motion.p>
                    </div>

                    <div className="flex flex-col gap-4 md:gap-6">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
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
                        transition={{ delay: 0.4 }}
                        className="mt-16 text-center p-8 md:p-12 rounded-[8px] bg-[#f8f9fe] border border-[#eaeaea]"
                    >
                        <h4 className="text-[24px] font-bold text-[#333333] mb-4">Still have questions?</h4>
                        <p className="text-[#555555] font-medium mb-8">Our admission experts are here to help you 24/7.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a 
                                href="/contact" 
                                className="flex items-center justify-center px-8 h-12 bg-white border border-[#eaeaea] text-[#333333] font-semibold rounded-[4px] hover:bg-[#fcfcfc] transition-colors shadow-sm"
                            >
                                Contact Support
                            </a>
                            <a 
                                href="https://chat.whatsapp.com/CfVh7u9L6vT7ZFpZwwVa4A" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center px-8 h-12 bg-[#25D366] text-white font-semibold rounded-[4px] hover:bg-[#1ebd5a] transition-colors shadow-sm gap-2"
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
