import React from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BookOpen,
    ShoppingCart,
    Star,
    CheckCircle2,
    ArrowRight,
    Search,
    Book,
    FileText,
    Library,
    Sparkles,
    ChevronRight,
    HelpCircle
} from 'lucide-react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import FAQSchema from '@/components/seo/FAQSchema';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import PageNavigation from '@/components/exams/PageNavigation';
import { centsLinks } from '@/lib/nav-links';
import { getBreadcrumbSchema } from '@/utils/seo-schemas';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'recommended', label: 'Top Recommended' },
    { id: 'subjects', label: 'Subject-Specific' },
    { id: 'english', label: 'English Resources' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'What is the best book for CENT-S preparation?', answer: 'For the science sections, AlphaTest and Editest are the Italian standards. For English-speaking students, we recommend Cambridge A-Level science textbooks combined with Italostudy English mocks.' },
    { question: 'Are there any official CENT-S books by CISIA?', answer: 'CISIA does not publish textbooks, but they provide official exercise sets and old TOLC-I/E papers which are essential for understanding the question style.' },
    { question: 'Can I use IMAT books for CENT-S?', answer: 'Partially. The science content (Biology, Chemistry, Physics) overlaps significantly. However, CENT-S Mathematics and Reasoning are more technical and require specific practice.' },
    { question: 'Should I study from Italian or English books?', answer: 'The exam is in English, so studying from English resources (like SAT or A-Levels) is better for technical vocabulary. However, Italian prep books are excellent for specific CISIA-style logic.' },
    { question: 'Where can I buy CENT-S preparation books?', answer: 'They are available on Amazon.it, AlphaTest website, and specialized Italian bookstores. Many are also available as eBooks for international students.' },
    { question: 'Are AlphaTest books available in English?', answer: 'Most AlphaTest and Editest books are in Italian. Italostudy provides English translations and summaries for key scientific concepts in our digital guide.' },
    { question: 'Do I need a separate book for Reasoning?', answer: 'Yes, because Reasoning accounts for 27% of the score. Look for GRE or GMAT logic books if you want high-level English practice.' },
    { question: 'Is the AlphaTest 10,000 Quizz useful for CENT-S?', answer: 'Yes, it is excellent for volume practice. Even though many questions are in Italian, the math and science logic remain the same.' },
    { question: 'What is the most common mistake in buying books?', answer: 'Buying generic "Italian University" books. Ensure you get the ones specifically for TOLC-I, TOLC-E, or the new unified CENT-S standard.' },
    { question: 'Does Italostudy have its own prep book?', answer: 'We provide an All-in-One Digital Guide PDF that consolidates the best strategies from all major publishers into one English resource.' }
];

const recommendedBooks = [
    {
        title: "AlphaTest CENT-S Kit",
        publisher: "AlphaTest",
        type: "Complete Bundle",
        description: "The gold standard in Italy. Includes Manuale di Teoria, Esercizi Commentati, and Prove di Verifica updated for the new CISIA standard.",
        price: "€70 - €90",
        rating: 4.8
    },
    {
        title: "Editest TOLC-I/S Manual",
        publisher: "EdiSES",
        type: "Theory + Practice",
        description: "Detailed scientific explanations with a heavy focus on Mathematics and Physics. Excellent for students needing a strong theoretical foundation.",
        price: "€45 - €55",
        rating: 4.6
    },
    {
        title: "ItaloStudy English Authority Guide",
        publisher: "ItaloStudy",
        type: "English Digital PDF",
        description: "The only comprehensive English-language guide for CENT-S. Includes strategy, syllabus breakdown, and bilingual scientific vocabulary.",
        price: "FREE / Premium",
        rating: 4.9
    }
];

export default function CentsBooks() {
    const { getField } = usePageContent('cent-s-books-2026');
    const [activeSection, setActiveSection] = React.useState('overview');

    React.useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 120;
            const allSections = [{ id: 'overview', label: 'Overview' }, ...sections];
            for (const section of allSections) {
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
        <CmsPageWrapper slug="cent-s-books-2026">
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
                    title="Best CENT-S Preparation Books 2026 – English & Italian Guides"
                    description="Curated list of the best books for CENT-S (CISIA English Test – Science). Comparison of AlphaTest, Editest, and English-language scientific resources."
                    keywords="CENT-S books, best CENT-S prep books, AlphaTest CENT-S, Editest TOLC-I, CENT-S study material English"
                />

                <FAQSchema items={faqs} />

                <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
                    <main className="container mx-auto px-4 pt-0 pb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            
                            {/* Sidebar Hub */}
                            <div className="lg:col-span-4 hidden lg:block">
                                <div className="sticky top-32 self-start">
                                    <KnowledgeHubSidebar examType="cents" />
                                </div>
                            </div>

                            <div className="lg:col-span-8 space-y-16">

                                {/* Hero */}
                                <section id="overview" className="scroll-mt-[120px]">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                                        <Sparkles size={12} className="text-indigo-600 animate-pulse" />
                                        Official 2026 Academic Roadmap
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
                                        {getField('hero_headline', 'Best Books for CENT-S Preparation')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_subheadline" multiline as="p" className="text-xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_subheadline', 'Choosing the right study material is the first step to success. While the CENT-S is taken in English, the core logic is derived from Italian standards. We recommend a hybrid approach using the best resources from both worlds.')}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Core Manuals', value: '3 Major', icon: Book },
                                            { label: 'Language', value: 'English/IT', icon: Search },
                                            { label: 'Subject Depth', value: 'High', icon: Star },
                                            { label: 'Online Access', value: 'Included', icon: Library }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                                                <item.icon className="text-indigo-600 mb-2" size={24} />
                                                <div className="text-lg font-black text-slate-900">{item.value}</div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Recommended */}
                                <section id="recommended" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-amber-100 p-3 rounded-2xl">
                                            <Star className="text-amber-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Top Recommended Bundles</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {recommendedBooks.map((book, i) => (
                                            <Card key={i} className="p-8 border-none shadow-sm hover:shadow-xl transition-all bg-white rounded-[2rem] flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                                            {book.type}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-amber-500 font-black">
                                                            <Star size={16} fill="currentColor" />
                                                            {book.rating}
                                                        </div>
                                                    </div>
                                                    <h3 className="text-2xl font-black text-slate-900 mb-2">{book.title}</h3>
                                                    <div className="text-sm font-bold text-slate-400 mb-4">Publisher: {book.publisher}</div>
                                                    <p className="text-slate-600 text-sm leading-relaxed font-medium mb-8">{book.description}</p>
                                                </div>
                                                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                                    <div className="text-xl font-black text-slate-900">{book.price}</div>
                                                    <Button variant="outline" className="rounded-xl border-2 border-slate-900 font-black">
                                                        View on Amazon
                                                        <ShoppingCart size={16} className="ml-2" />
                                                    </Button>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </section>

                                {/* Subject-Specific */}
                                <section id="subjects" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <BookOpen className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Subject-Specific Depth</h2>
                                    </div>
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div>
                                                <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                                                    <CheckCircle2 className="text-emerald-500" size={18} />
                                                    Mathematics & Logic
                                                </h4>
                                                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                    For these high-weightage sections, look for **GMAT Quantitative** or **SAT Math Level 2** books. They cover the logical depth required for the CENT-S better than generic high school textbooks.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                                                    <CheckCircle2 className="text-emerald-500" size={18} />
                                                    Chemistry & Biology
                                                </h4>
                                                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                    **Cambridge A-Level** (AS & A2) Science books are perfect. They match the conceptual rigor of CISIA and ensure you learn all technical terms in English.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* English Resources */}
                                <section id="english" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Library size={180} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-3xl font-black mb-6 flex items-center gap-4">
                                                <Sparkles className="text-indigo-400" size={28} />
                                                The English-Language Advantage
                                            </h2>
                                            <p className="text-slate-300 font-medium leading-relaxed mb-8">
                                                Most students struggle because they use Italian books for an English exam. Italostudy bridges this gap with English-language scientific authority.
                                            </p>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <Link to="/cent-s-exam-preparation-book-pdf">
                                                    <Button className="w-full bg-indigo-600 hover:bg-indigo-500 h-14 rounded-2xl font-black">
                                                        Download Free English PDF
                                                        <FileText size={18} className="ml-2" />
                                                    </Button>
                                                </Link>
                                                <Link to="/cent-s-mock">
                                                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 h-14 rounded-2xl font-black">
                                                        Practice English Mocks
                                                        <ArrowRight size={18} className="ml-2" />
                                                    </Button>
                                                </Link>
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

                                <section className="pt-12 border-t border-slate-200">
                                    <h3 className="text-2xl font-black text-slate-900 mb-8">Explore the Full CENT-S Cluster 📚</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {centsLinks.map((link, i) => (
                                            <Link key={i} to={link.path} className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-600 transition-colors flex items-center justify-between">
                                                <span className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors text-sm">{link.label}</span>
                                                <ChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" size={18} />
                                            </Link>
                                        ))}
                                    </div>
                                </section>

                                <CTASection fieldKeyPrefix="books_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


