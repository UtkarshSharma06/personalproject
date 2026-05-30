import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import {
    BookOpen,
    CheckCircle2,
    Star,
    Sparkles,
    ChevronRight,
    HelpCircle,
    Book,
    Bookmark,
    Target,
    Zap,
    Download,
    BrainCircuit,
    Beaker
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import FAQSchema from '@/components/seo/FAQSchema';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import { tolcLinks } from '@/lib/nav-links';
import PageNavigation from '@/components/exams/PageNavigation';

const sections = [
    { id: 'overview', label: 'Best Books Overview' },
    { id: 'alpha-test', label: 'Alpha Test Series' },
    { id: 'editest', label: 'EdiTEST Manuals' },
    { id: 'hoepli', label: 'Hoepli Test' },
    { id: 'italostudy', label: 'ItaloStudy Digital' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'Which publisher makes the best books for TOLC-MED?', answer: 'For the medical and scientific TOLCs (TOLC-MED, TOLC-F), the EdiTEST series is widely considered the most rigorous, especially for Biology and Chemistry. However, Alpha Test is often preferred for its clearer, more accessible theoretical explanations.' },
    { question: 'Are there good preparation books for TOLC in English?', answer: 'This is a significant challenge. Most traditional Italian publishers (Alpha Test, EdiTEST, Hoepli) only publish their comprehensive manuals in Italian. For English TOLC exams (like English TOLC-I or English TOLC-E), students generally rely on international resources (like SAT or BMAT books) for logic and math, combined with specialized digital platforms like ItaloStudy that offer dedicated English TOLC simulators.' },
    { question: 'Do I need to buy all three book types (Theory, Practice, Quizzes)?', answer: 'If you are starting from scratch, yes, buying a bundle (Teoria, Esercizi, Quiz) is highly recommended. The Theory book builds your foundation, the Practice book teaches you application, and the Quiz book provides the necessary volume of questions to build speed and stamina.' },
    { question: 'Are older editions of TOLC preparation books still useful?', answer: 'Generally, yes. The fundamental syllabus (physics, math, biology) does not change dramatically from year to year. However, older books may not reflect recent structural changes (like the shift to TOLC-MED formats or changing question weightings). It is best to use a book no older than 2-3 years.' },
    { question: 'Is reading high school textbooks enough to pass the TOLC?', answer: 'While high school textbooks contain all the necessary scientific information, they do not train you for the specific format, logic, and extreme time pressure of the TOLC. You absolutely need dedicated preparation materials that simulate the CISIA multiple-choice format.' },
    { question: 'What is the best book for TOLC-I (Engineering)?', answer: 'For TOLC-I, the Hoepli Test series is highly regarded for its challenging mathematics and physics sections, which align well with the rigorous demands of engineering faculties. Alpha Test is also excellent for a broader overview.' },
    { question: 'How much do TOLC preparation books typically cost?', answer: 'Individual manuals usually range from €25 to €40. Complete kits (bundles containing Theory, Practice, and Quiz books) usually cost between €70 and €100 depending on the publisher and the specific exam variant.' },
    { question: 'Can I find free PDF versions of these books?', answer: 'While pirated copies occasionally circulate online, relying on them is illegal and risky (as they are often outdated). A much better free alternative is to use the official sample materials provided by CISIA on their website or utilize free trials on digital simulators.' },
    { question: 'How long before the exam should I buy my books?', answer: 'You should acquire your preparation materials at least 3 to 4 months before your intended test date. This allows sufficient time to complete the theory manual and dedicate the final month entirely to timed practice quizzes.' },
    { question: 'Does CISIA publish their own official preparation books?', answer: 'No, CISIA does not publish traditional paperback preparation manuals. However, they do provide limited official mock tests (simulazioni) and syllabus outlines directly on their portal, which are essential tools to use alongside third-party books.' }
];

export default function TolcBooks() {
    const { getField } = usePageContent('tolc-books-2026');
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element && element.offsetTop <= scrollPosition && element.offsetTop + element.offsetHeight > scrollPosition) {
                    setActiveSection(section.id);
                    break;
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <CmsPageWrapper slug="tolc-books-2026">
            <Layout
                variant="public"
                subNavigation={
                    <PageNavigation
                        sections={sections}
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    />
                }
            >
                <SEOHead
                    title="Best Books for TOLC 2026: Official Preparation Guide"
                    description="The ultimate guide to the best preparation books for TOLC-I, TOLC-E, TOLC-F, and TOLC-MED. Comprehensive reviews of Alpha Test, EdiTEST, and Hoepli manuals."
                    keywords="TOLC preparation books, best books for TOLC, Alpha Test TOLC, EdiTEST TOLC-MED, Hoepli TOLC-I, study materials for TOLC"
                />

                <FAQSchema items={faqs} />

                <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
                    <main className="container mx-auto px-4 pt-0 pb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            
                            <div className="lg:col-span-4 hidden lg:block">
                                <div className="sticky top-32 self-start">
                                    <KnowledgeHubSidebar examType="tolc" />
                                </div>
                            </div>

                            <div className="lg:col-span-8 space-y-16">

                                {/* Hero */}
                                <section id="overview" className="scroll-mt-[120px]">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                                        <Book size={12} className="text-indigo-600" />
                                        Updated for 2026 Admissions
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                                        {getField('hero_headline', 'The Best Preparation Books for TOLC')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "Choosing the right preparation materials is the most critical investment you will make for your university admission. Because the TOLC encompasses multiple distinct exams (Engineering, Medicine, Economics), generic study guides are completely ineffective. You need targeted manuals that align with the specific CISIA syllabus for your faculty. Below, we provide an exhaustive, unbiased review of the top Italian publishers—Alpha Test, EdiTEST, and Hoepli—and break down exactly which books you need based on your academic goals.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'publishers', label: 'Top Publishers', value: '3 Major', icon: BookOpen },
                                            { key: 'cost', label: 'Avg Kit Cost', value: '€70-90', icon: Target },
                                            { key: 'types', label: 'Book Types', value: 'Theory+Quiz', icon: Bookmark },
                                            { key: 'digital', label: 'Alternatives', value: 'Simulators', icon: Zap }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-indigo-200 transition-colors">
                                                <item.icon className="text-indigo-600 mb-3 group-hover:scale-110 transition-transform" size={24} />
                                                <EditableText fieldKey={`stat_val_${item.key}`} as="div" className="text-2xl font-black text-slate-900">
                                                    {getField(`stat_val_${item.key}`, item.value)}
                                                </EditableText>
                                                <EditableText fieldKey={`stat_label_${item.key}`} as="div" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    {getField(`stat_label_${item.key}`, item.label)}
                                                </EditableText>
                                            </div>
                                        ))}
                                    </div>

                                    <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                        When purchasing physical preparation materials for the TOLC, you will generally encounter three types of books offered by every major publisher. Understanding this "trinity" of resources is essential. First is the <strong>Theory Manual (Manuale di Teoria)</strong>, which condenses high school subjects into targeted, exam-focused chapters. Second is the <strong>Practice Book (Eserciziario)</strong>, which provides guided examples and strategies for solving specific question types. Finally, the <strong>Quiz Collection (Raccolta di Quiz/Simulazioni)</strong> contains thousands of raw multiple-choice questions for endurance training. For optimal preparation, purchasing the complete "Kit" containing all three is highly recommended.
                                    </p>
                                </section>

                                {/* Alpha Test Section */}
                                <section id="alpha-test" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-rose-100 p-3 rounded-2xl">
                                            <BookOpen className="text-rose-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Alpha Test Series: The Industry Standard</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <EditableText fieldKey="alpha_desc" multiline as="p" className="text-slate-600 font-medium leading-relaxed">
                                                {getField('alpha_desc', "Alpha Test is arguably the most famous and widely utilized publisher for university admission tests in Italy. Their TOLC specific manuals are known for being incredibly accessible, making them ideal for students who need to rebuild their foundational knowledge from scratch.")}
                                            </EditableText>
                                            <div className="space-y-4">
                                                {[
                                                    { key: 'alpha_pro1', label: 'Extremely clear, simplified theoretical explanations' },
                                                    { key: 'alpha_pro2', label: 'Excellent logical reasoning (Logica) sections' },
                                                    { key: 'alpha_pro3', label: 'High volume of practice questions in their "3200 Quiz" editions' },
                                                    { key: 'alpha_con1', label: 'Sometimes considered slightly easier than the actual exam' }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-start gap-3 text-sm font-bold text-slate-600">
                                                        <CheckCircle2 size={18} className={i < 3 ? "text-emerald-500 shrink-0" : "text-rose-500 shrink-0"} />
                                                        <EditableText fieldKey={`alpha_item_${item.key}`} as="span">
                                                            {getField(`alpha_item_${item.key}`, item.label)}
                                                        </EditableText>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <Card className="p-8 bg-rose-50 border-rose-100 border-2 rounded-[2.5rem] relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                                                <Star size={150} className="text-rose-900" />
                                            </div>
                                            <h4 className="text-rose-900 font-black mb-4">Best For:</h4>
                                            <p className="text-sm text-rose-800 font-medium leading-relaxed">
                                                TOLC-E (Economics) and TOLC-SU (Humanities). Alpha Test excels in breaking down verbal comprehension and logical reasoning, which are the core pillars of these specific exams. They are also an excellent starting point for TOLC-MED students who struggle with fundamental sciences.
                                            </p>
                                        </Card>
                                    </div>
                                </section>

                                {/* EdiTEST Section */}
                                <section id="editest" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-emerald-100 p-3 rounded-2xl">
                                            <Bookmark className="text-emerald-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">EdiTEST (EdiSES): The Rigorous Choice</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <Card className="p-8 bg-emerald-50 border-emerald-100 border-2 rounded-[2.5rem] relative overflow-hidden group order-2 md:order-1">
                                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                                                <Beaker size={150} className="text-emerald-900" />
                                            </div>
                                            <h4 className="text-emerald-900 font-black mb-4">Best For:</h4>
                                            <p className="text-sm text-emerald-800 font-medium leading-relaxed">
                                                TOLC-MED (Medicine) and TOLC-F (Pharmacy). If you need deep, uncompromising scientific preparation, EdiTEST is the undisputed leader. Their biology and chemistry manuals are practically mini-university textbooks.
                                            </p>
                                        </Card>
                                        <div className="space-y-6 order-1 md:order-2">
                                            <EditableText fieldKey="editest_desc" multiline as="p" className="text-slate-600 font-medium leading-relaxed">
                                                {getField('editest_desc', "EdiTEST (published by EdiSES) is renowned for its academic rigor. Their manuals do not cut corners. The theoretical sections are dense, highly detailed, and designed to over-prepare students for the hardest possible iterations of the TOLC.")}
                                            </EditableText>
                                            <div className="space-y-4">
                                                {[
                                                    { key: 'edi_pro1', label: 'Unmatched depth in Biology and Chemistry' },
                                                    { key: 'edi_pro2', label: 'Questions are often harder than the real test (great for training)' },
                                                    { key: 'edi_pro3', label: 'Excellent diagrams and scientific illustrations' },
                                                    { key: 'edi_con1', label: 'Can be overwhelmingly dense for weaker students' }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-start gap-3 text-sm font-bold text-slate-600">
                                                        <CheckCircle2 size={18} className={i < 3 ? "text-emerald-500 shrink-0" : "text-rose-500 shrink-0"} />
                                                        <EditableText fieldKey={`edi_item_${item.key}`} as="span">
                                                            {getField(`edi_item_${item.key}`, item.label)}
                                                        </EditableText>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Hoepli Section */}
                                <section id="hoepli" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-amber-100 p-3 rounded-2xl">
                                            <Calculator className="text-amber-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Hoepli Test: The Engineering Specialist</h2>
                                    </div>
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12 mb-8">
                                        <EditableText fieldKey="hoepli_desc" multiline as="p" className="text-lg text-slate-600 leading-relaxed font-medium mb-8">
                                            {getField('hoepli_desc', "Hoepli is a historic Italian publisher with deep roots in technical and scientific literature. Their \"Hoepli Test\" division brings this mathematical rigor to university admissions. While they offer books for all faculties, their engineering and hard-science manuals are exceptional.")}
                                        </EditableText>
                                        
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                                                <h4 className="font-black text-amber-900 mb-3">TOLC-I (Engineering) Champion</h4>
                                                <p className="text-sm text-amber-800 leading-relaxed">
                                                    If you are taking the TOLC-I, the Hoepli Test engineering kit is arguably your best choice. Their mathematics and physics practice problems perfectly mirror the analytical depth required by top-tier polytechnic universities (like PoliMi and PoliTo).
                                                </p>
                                            </div>
                                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                                                <h4 className="font-black text-slate-900 mb-3">Unique Features</h4>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Hoepli books often include unique \"diagnostic\" tests at the beginning to help you identify your weak areas immediately. Their mathematical explanations tend to skip fewer steps compared to competitors, making complex algebraic derivations easier to follow.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* The Digital Alternative: ItaloStudy */}
                                <section id="italostudy" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Zap size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl font-black mb-8 flex items-center gap-4">
                                                <Zap className="text-indigo-400" />
                                                The Problem with Books
                                            </h2>
                                            <p className="text-xl text-slate-300 leading-relaxed font-medium mb-8 max-w-3xl">
                                                While physical books are excellent for learning theory, they have a massive flaw: <strong>The TOLC is a computer-based test (CBT) with a strict countdown timer on a screen.</strong> Practicing exclusively with pencil and paper creates a false sense of security.
                                            </p>
                                            
                                            <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm border border-white/20 mb-8">
                                                <h3 className="text-2xl font-bold text-white mb-4">Why you must use a Digital Simulator</h3>
                                                <ul className="space-y-4 text-slate-300">
                                                    <li className="flex items-start gap-3">
                                                        <CheckCircle2 className="text-emerald-400 shrink-0 mt-1" />
                                                        <span><strong>Screen Fatigue:</strong> Reading complex logic texts on a glowing monitor is significantly harder than reading paper. You must train your eyes.</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <CheckCircle2 className="text-emerald-400 shrink-0 mt-1" />
                                                        <span><strong>Time Mechanics:</strong> A book cannot force you to move to the next section when time expires. A simulator replicates the ruthless pacing of the real TOLC.</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <CheckCircle2 className="text-emerald-400 shrink-0 mt-1" />
                                                        <span><strong>The English Problem:</strong> Traditional Italian publishers don't provide English TOLC materials. If you are an international student, platforms like ItaloStudy are your only viable option for accurate, translated practice.</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <button onClick={() => window.open('https://app.italostudy.com/auth', '_blank')} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-3 transition-colors">
                                                Try ItaloStudy's Free TOLC Simulator
                                                <ChevronRight />
                                            </button>
                                        </div>
                                    </div>
                                </section>

                                {/* FAQs */}
                                <section id="faqs" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-12">
                                        <div className="bg-slate-200 p-3 rounded-2xl">
                                            <HelpCircle className="text-slate-600" size={32} />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
                                    </div>
                                    <div className="space-y-6">
                                        {faqs.map((faq, i) => (
                                            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="text-xl font-black text-slate-900 mb-4 flex gap-4">
                                                    <span className="text-indigo-600">Q{i + 1}:</span>
                                                    <EditableText fieldKey={`faq_q_${i}`} as="div">
                                                        {getField(`faq_q_${i}`, faq.question)}
                                                    </EditableText>
                                                </div>
                                                <div className="text-slate-600 leading-relaxed font-medium pl-12 border-l-2 border-slate-50">
                                                    <EditableText fieldKey={`faq_a_${i}`} multiline as="div">
                                                        {getField(`faq_a_${i}`, faq.answer)}
                                                    </EditableText>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Bottom Grid */}
                                <section className="pt-20 border-t border-slate-200">
                                    <h3 className="text-2xl font-black text-slate-900 mb-8">Explore the Full TOLC Cluster 📚</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {tolcLinks.map((link, i) => (
                                            <Link key={i} to={link.path} className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-600 transition-colors flex items-center justify-between">
                                                <span className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{link.label}</span>
                                                <ChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        ))}
                                    </div>
                                </section>

                                <CTASection fieldKeyPrefix="tolc_books_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}
