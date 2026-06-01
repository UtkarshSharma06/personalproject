import React from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    FileText,
    Download,
    Search,
    Clock,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    FileSearch,
    HelpCircle,
    ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FAQSchema from '@/components/seo/FAQSchema';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import EditableFile from '@/components/cms/EditableFile';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import PageNavigation from '@/components/exams/PageNavigation';
import { centsLinks } from '@/lib/nav-links';
import { getBreadcrumbSchema } from '@/utils/seo-schemas';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'downloads', label: 'PDF Downloads' },
    { id: 'simulation', label: 'Online Simulations' },
    { id: 'strategy', label: 'Practice Strategy' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'Where can I download CENT-S previous papers?', answer: 'Official full-length CENT-S papers are not publicly released by CISIA. However, we provide official sample papers and archive collections of TOLC-I and TOLC-E papers which are identical in structure.' },
    { question: 'Are TOLC-I papers useful for CENT-S?', answer: 'Yes. The CENT-S is based on the TOLC-I scientific syllabus. Practicing TOLC-I papers is the most effective way to prepare for the Mathematics, Physics, and Chemistry sections of the CENT-S.' },
    { question: 'Does Italostudy have solved CENT-S papers?', answer: 'Yes, our Premium Guide includes step-by-step video solutions for the official CISIA sample sets, explaining the logic behind each of the 55 questions.' },
    { question: 'How many practice papers should I do?', answer: 'We recommend at least 10 full-length simulations before the real exam to master the 110-minute timing and the section-to-section transitions.' },
    { question: 'Is the marking scheme different in past papers?', answer: 'No, all official CISIA scientific tests follow the same +1 / -0.25 marking scheme. You should always practice using these rules to get an accurate score estimation.' },
    { question: 'Are there any official English sample papers?', answer: 'CISIA provides a small set of English sample questions on their portal. We have consolidated these into a single easy-to-read PDF for our students.' },
    { question: 'Can I find CENT-S papers with answers?', answer: 'Yes, our download hub includes answer keys for all provided papers. We also include score-to-percentile conversion tables based on historical data.' },
    { question: 'What is the best way to use past papers?', answer: "Don't just do them for score. Use them to identify which of the 5 sections is your weakest and spend 70% of your review time on those specific topics." },
    { question: 'Are the questions in the real exam the same as past papers?', answer: 'The specific questions change, but the "Question Type Templates" are highly repetitive. CISIA often reuses the same logical patterns year after year.' },
    { question: 'Where can I take a free CENT-S mock?', answer: 'You can access our full-length digital simulation for free on the Italostudy portal. It replicates the official exam interface exactly.' }
];

export default function CentsPreviousPapers() {
    const { getField } = usePageContent('cent-s-previous-papers-2026');
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

    const papers = [
        { title: "Official CISIA Sample Set", year: "2026 Edition", type: "Diagnostic", fieldKey: "paper_1" },
        { title: "TOLC-I Scientific Archive", year: "2024-2025", type: "High Yield", fieldKey: "paper_2" },
        { title: "Reasoning & Logic Focus", year: "2025 Special", type: "Sectional", fieldKey: "paper_3" },
        { title: "Mathematics Mastery Pack", year: "2026 Prep", type: "Targeted", fieldKey: "paper_4" }
    ];

    return (
        <CmsPageWrapper slug="cent-s-previous-papers-2026">
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
                    title="CENT-S Previous Year Papers PDF – Official Samples & Solved Sets"
                    description="Download CENT-S previous year papers and official CISIA scientific sample sets. Access solved TOLC-I and TOLC-E papers for 2026 exam preparation."
                    keywords="CENT-S previous papers, CENT-S sample paper pdf, CISIA past papers, TOLC-I previous papers English, CENT-S practice test pdf"
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
                                        {getField('hero_headline', 'CENT-S Previous Papers & Samples')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_subheadline" multiline as="p" className="text-xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_subheadline', 'Practicing with official material is the only way to understand the specific "CISIA logic" required for the CENT-S. While the exam name is new, the underlying scientific templates are derived from decades of Italian entrance testing.')}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Papers Available', value: '12 Sets', icon: FileText },
                                            { label: 'Solved Questions', value: '600+', icon: FileSearch },
                                            { label: 'Difficulty', value: 'Exam Level', icon: Clock },
                                            { label: 'Access', value: 'Free PDF', icon: Download }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                                                <item.icon className="text-indigo-600 mb-2" size={24} />
                                                <div className="text-lg font-black text-slate-900">{item.value}</div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Downloads */}
                                <section id="downloads" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Download className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">PDF Download Center</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {papers.map((paper, i) => (
                                            <Card key={i} className="p-6 bg-white border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-indigo-50 transition-colors">
                                                        <FileText className="text-slate-400 group-hover:text-indigo-600" size={24} />
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{paper.type}</div>
                                                        <h4 className="font-black text-slate-900">{paper.title}</h4>
                                                        <div className="text-xs font-bold text-slate-400">{paper.year}</div>
                                                    </div>
                                                </div>
                                                <EditableFile fieldKey={paper.fieldKey} currentUrl={getField(paper.fieldKey, '')}>
                                                    <Button size="icon" variant="ghost" className="rounded-full text-slate-400 hover:text-indigo-600">
                                                        <Download size={20} />
                                                    </Button>
                                                </EditableFile>
                                            </Card>
                                        ))}
                                    </div>
                                </section>

                                {/* Simulation */}
                                <section id="simulation" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Clock size={180} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-3xl font-black mb-6 flex items-center gap-4">
                                                <Search className="text-indigo-400" size={28} />
                                                Live Digital Simulation
                                            </h2>
                                            <p className="text-slate-300 font-medium leading-relaxed mb-8">
                                                PDFs are good for theory, but the CENT-S is a computer-based test. Don't let the real exam be the first time you interact with a timed digital portal.
                                            </p>
                                            <Link to="/cent-s-mock">
                                                <Button className="bg-indigo-600 hover:bg-indigo-500 h-14 px-8 rounded-2xl font-black text-lg shadow-xl">
                                                    Try Free Digital Mock
                                                    <ArrowRight size={18} className="ml-2" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </section>

                                {/* Strategy */}
                                <section id="strategy" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-emerald-100 p-3 rounded-2xl">
                                            <CheckCircle2 className="text-emerald-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">How to Use Past Papers</h2>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { title: 'The "No-Resource" Rule', desc: 'Take at least 5 papers under strict 110-minute conditions with no phone, no notes, and no calculator. This builds the necessary mental stamina.' },
                                            { title: 'Error Analysis', desc: 'Spend 2 hours reviewing for every 1 hour of testing. If you got a question wrong, was it a knowledge gap or a logical trap?' },
                                            { title: 'Section Prioritization', desc: 'Use your past paper scores to calculate your "Score per Minute" for each of the 5 sections. Focus your study on the sections with the lowest efficiency.' }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex gap-6 items-start">
                                                <div className="bg-indigo-50 text-indigo-600 font-black w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-900 mb-1">{item.title}</h4>
                                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
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

                                <CTASection fieldKeyPrefix="papers_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


