import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Book,
    BookOpen,
    ChevronRight,
    FileText,
    Zap,
    Star,
    CheckCircle2,
    ShoppingBag,
    TrendingUp,
    Globe,
    HelpCircle,
    Activity,
    Grid,
    ShieldCheck,
    Sparkles,
    Library
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import EditableImage from '@/components/cms/EditableImage';
import FAQSchema from '@/components/seo/FAQSchema';
import { useLiveEdit } from '@/contexts/LiveEditContext';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import { imatLinks } from '@/lib/nav-links';
import { getBreadcrumbSchema } from '@/utils/seo-schemas';
import PageNavigation from '@/components/exams/PageNavigation';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'selection', label: 'The Selection' },
    { id: 'strategy', label: 'Study Strategy' },
    { id: 'faqs', label: 'FAQs' }
];

const STATIC_BOOKS = [
    { key: 'pearson', subject: 'Science Core', highlight: 'The Gold Standard', title: 'Pearson Biology/Chemistry (AS & A Level)', desc: "The official choice for scientific depth. IMAT science stays very close to the Cambridge A-Level curriculum, making these Pearson editions indispensable for conceptual clarity." },
    { key: 'bmat', subject: 'Section 1', highlight: 'Logic Master', title: 'The Ultimate BMAT Guide', desc: "Since IMAT Section 1 is derivative of BMAT, this guide is the primary resource for mastering critical thinking and problem-solving techniques." },
    { key: 'practice', subject: 'Question Bank', highlight: 'Practice King', title: '1200 IMAT Practice Questions', desc: "Specifically calibrated to current IMAT difficulty levels. Essential for the last 60 days of preparation to build speed." },
    { key: 'gk', subject: 'Global Context', highlight: 'Knowledge Atlas', title: 'Cambridge AS General Paper', desc: "Excellent for building the breadth required for the General Knowledge section, covering global history, politics, and literature." }
];

const faqs = [
    { question: 'Do I really need Italian manuals for the IMAT?', answer: 'While the exam is in English, Italian manuals like Alphatest or Editest are excellent for the "Italian flavor" of logic. However, for Biology and Chemistry, English resources like Pearson are often superior and more clear.' },
    { question: 'Is the BMAT Guide useful for the 2026 IMAT?', answer: 'Yes, because the Logical Reasoning section of the IMAT was originally developed by Cambridge Assessment (who make the BMAT). The question styles remain very similar.' },
    { question: 'Should I buy the 7000 or 12000 question banks?', answer: 'Focus on quality over quantity. A 1200-question bank that is specifically calibrated to IMAT difficulty is much more useful than a 10000-question bank full of old or irrelevant chemistry trivia.' },
    { question: 'Can I use IB/A-Level textbooks for science prep?', answer: 'Absolutely. Pearson Biology and Chemistry (International A-Level) are among our top recommendations because the IMAT syllabus is heavily aligned with standard English-medium pre-university curricula.' },
    { question: 'What is the best resource for the General Knowledge section?', answer: 'The Cambridge AS Level General Paper is excellent for building the breadth of global awareness, history, and politics required for the modern IMAT GK section.' },
    { question: 'Are Kindle or e-book versions of study guides sufficient?', answer: 'Digital versions are great for reading theory. However, for practice tests and question banks, we strongly recommend paper or a tablet with a stylus to simulate the physical marking process of the real exam.' },
    { question: 'Should I prioritize the official 2026 editions of prep books?', answer: 'If the Ministerial decree (Bando) introduces significant syllabus changes, prioritize 2026 editions. Otherwise, 2024 or 2025 editions of core science manuals remain 99% accurate.' },
    { question: 'How many practice questions should I aim to solve before the exam?', answer: 'Successful candidates typically solve between 3,000 to 5,000 unique practice questions. Ensure at least 1,500 of these are solved under strict 100-minute timed conditions.' },
    { question: 'Is it worth buying separate books for Physics and Mathematics?', answer: 'Only if these are significant weak points. For most students, the science core of Biology and Chemistry takes priority, and standard A-Level or IB summary guides for Physics/Math are more than enough.' },
    { question: 'Where can I find worked solutions for these recommended books?', answer: 'Most international editions come with online resource portals. For IMAT-specific banks, we provide detailed derivations and logical explanations in our dedicated resource hubs.' }
];

export default function ImatBooks() {
    return (
        <CmsPageWrapper slug="imat-best-books-2026">
            <ImatBooksContent />
        </CmsPageWrapper>
    );
}

function ImatBooksContent() {
    const { getField } = usePageContent('imat-best-books-2026');
    const { isEditMode } = useLiveEdit();
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

    const rawIds = getField('book_list', '[]');
    let bookIds: string[] = [];
    try { bookIds = JSON.parse(rawIds); } catch { bookIds = []; }

    const displayBooks = bookIds.length > 0
        ? bookIds.map(id => ({ id, isDynamic: true }))
        : STATIC_BOOKS.map(b => ({ id: b.key, isDynamic: false, ...b }));

    return (
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
                title="Best Books for IMAT 2026 – Recommended Resources & Study Material"
                description="Expert review of the best books for IMAT 2026. From Pearson Science to BMAT Logic guides, discover the only resources you need to rank high."
                keywords="best books for IMAT 2026, IMAT study material, Pearson Biology IMAT, BMAT guide for IMAT, IMAT preparation books"
            />

            <FAQSchema items={faqs} />

            <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
                <main className="container mx-auto px-4 pt-0 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        
                        {/* Sidebar Hub */}
                        <div className="lg:col-span-4 hidden lg:block">
                            <div className="sticky top-32 self-start">
                                <KnowledgeHubSidebar examType="imat" />
                            </div>
                        </div>

                        <div className="lg:col-span-8 space-y-16">

                            {/* Hero */}
                            <section id="overview" className="scroll-mt-[120px]">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                                    <Sparkles size={12} className="text-indigo-600 animate-pulse" />
                                    Official 2026 Academic Roadmap
                                </div>

                                <EditableText fieldKey="hero_headline" as="h1" className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                                    {getField('hero_headline', 'Best Books for IMAT 2026')}
                                </EditableText>

                                <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                    {getField('hero_desc', 'Stop the resource overload. We identify the specific scientific and logical manuals that match the 2026 IMAT difficulty and syllabus.')}
                                </EditableText>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                    {[
                                        { key: 'books', label: 'Essential Books', value: 'Top 4', icon: Book },
                                        { key: 'qs', label: 'Practice Questions', value: '5000+', icon: FileText },
                                        { key: 'logic', label: 'Logic Focus', value: 'Cambridge', icon: Zap },
                                        { key: 'verify', label: 'Status', value: '2026 Verified', icon: ShieldCheck }
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
                            </section>

                            {/* The Selection */}
                            <section id="selection" className="scroll-mt-40">
                                <EditableText fieldKey="selection_title" as="h2" className="text-4xl font-black text-slate-900 mb-12 flex items-center gap-4">
                                    <Star className="text-amber-500" fill="currentColor" />
                                    {getField('selection_title', 'The Essential Library')}
                                </EditableText>
                                <div className="space-y-8">
                                    {displayBooks.map((book, i) => {
                                        const k = (key: string) => book.isDynamic ? `book_list_${book.id}_${key}` : `book_${key}_${book.id}`;
                                        return (
                                            <div key={book.id || i} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm group hover:border-indigo-600 transition-all flex flex-col md:flex-row gap-10 items-center">
                                                <EditableImage
                                                    fieldKey={k('img')}
                                                    currentUrl={getField(k('img'), '')}
                                                    alt={(book as any).title || 'Book'}
                                                    containerClassName="w-32 h-44 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-indigo-50 transition-colors relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                                        <BookOpen size={60} />
                                                    </div>
                                                    <Book className="text-slate-300 group-hover:text-indigo-600 relative z-10" size={56} />
                                                </EditableImage>
                                                <div className="flex-1 text-center md:text-left">
                                                    <div className="flex flex-wrap items-center gap-2 mb-4 justify-center md:justify-start">
                                                        <EditableText fieldKey={k('sub')} as="span" className="text-xs font-black uppercase tracking-widest bg-slate-900 text-white px-3 py-1 rounded-full">
                                                            {getField(k('sub'), (book as any).subject || 'Subject')}
                                                        </EditableText>
                                                        <EditableText fieldKey={k('high')} as="span" className="text-xs font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                                                            {getField(k('high'), (book as any).highlight || 'Highlight')}
                                                        </EditableText>
                                                    </div>
                                                    <EditableText fieldKey={k('title')} as="h3" className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                                                        {getField(k('title'), (book as any).title || 'Book Title')}
                                                    </EditableText>
                                                    <EditableText fieldKey={k('desc')} multiline as="p" className="text-lg text-slate-600 font-medium leading-relaxed">
                                                        {getField(k('desc'), (book as any).desc || 'Description...')}
                                                    </EditableText>
                                                </div>
                                                <div className="flex flex-col gap-3 min-w-[180px]">
                                                    <Button
                                                        variant="outline"
                                                        className="rounded-2xl border-2 border-slate-900 px-8 py-7 h-auto font-black group-hover:bg-slate-900 group-hover:text-white transition-all text-lg"
                                                        onClick={() => {
                                                            const rawUrl = getField(k('link'), '#');
                                                            const url = rawUrl.replace(/<[^>]*>?/gm, '').trim();
                                                            if (url && url !== '#') window.open(url, '_blank');
                                                        }}
                                                    >
                                                        <EditableText fieldKey={k('btn')} as="span">
                                                            {getField(k('btn'), 'Check Price')}
                                                        </EditableText>
                                                        <ShoppingBag className="ml-2" size={20} />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Strategic Insight */}
                            <section id="strategy" className="scroll-mt-40">
                                <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <TrendingUp size={200} />
                                    </div>
                                    <div className="relative z-10">
                                        <h2 className="text-4xl font-black mb-8 flex items-center gap-4 text-emerald-400">
                                            <Zap />
                                            Study Strategy 2026
                                        </h2>
                                        <p className="text-xl text-slate-300 leading-relaxed font-medium mb-12 max-w-3xl">
                                            Don't just read. The IMAT is a test of <span className="text-white font-black underline decoration-emerald-500 italic">stamina and logic</span>. Use Pearson for your conceptual base, but spend 70% of your time on BMAT-style logical puzzles and high-speed mock exams.
                                        </p>
                                        <div className="grid md:grid-cols-3 gap-6">
                                            {[
                                                { key: 'tip1', title: 'Concept Base', text: 'Spend the first 30 days mastering A-level Biology and Chemistry theory.', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' },
                                                { key: 'tip2', title: 'Logic Training', text: 'Logic accounts for 25% of your rank. Practice BMAT papers 2003-2023.', color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' },
                                                { key: 'tip3', title: 'Mock Season', text: 'Last 45 days: Do one complete mock test every 3 days under time pressure.', color: 'bg-rose-500/10 border-rose-500/20 text-rose-300' }
                                            ].map((tier, i) => (
                                                <div key={i} className={`p-6 rounded-2xl border ${tier.color} backdrop-blur-sm`}>
                                                    <div className="text-xs font-black uppercase tracking-widest mb-1 opacity-60">{tier.title}</div>
                                                    <div className="text-sm font-bold text-white">{tier.text}</div>
                                                </div>
                                            ))}
                                        </div>
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

                            {/* Resource Cluster */}
                            <section className="pt-20 border-t border-slate-200">
                                <h3 className="text-2xl font-black text-slate-900 mb-8">Full IMAT Resource Cluster 📚</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {imatLinks.map((link, i) => (
                                        <Link key={i} to={link.path} className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-600 transition-colors flex items-center justify-between">
                                            <span className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase text-xs tracking-widest">{link.label}</span>
                                            <ChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                            </section>

                            <CTASection fieldKeyPrefix="imat_books_cta" />
                        </div>
                    </div>
                </main>
            </div>
            <CTASection fieldKeyPrefix="imat_books_bottom_cta" />
        </Layout>
    );
}


