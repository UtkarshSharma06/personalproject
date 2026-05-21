import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    FileDown,
    History,
    Zap,
    Download,
    FileText,
    ChevronRight,
    Search,
    BookOpen,
    Shield,
    Star,
    Grid,
    Globe,
    HelpCircle,
    CheckCircle2,
    Activity,
    GraduationCap,
    Sparkles,
    ArrowRight,
    TrendingUp
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import EditableFile from '@/components/cms/EditableFile';
import FAQSchema from '@/components/seo/FAQSchema';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import { imatLinks } from '@/lib/nav-links';
import PageNavigation from '@/components/exams/PageNavigation';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'archive', label: 'Paper Archive' },
    { id: 'download', label: 'Master Download' },
    { id: 'methodology', label: 'Methodology' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'Where can I find the official IMAT past papers?', answer: 'We maintain a complete, verified archive of all official IMAT question booklets from 2011 to 2025, including the latest Ministerial format sets.' },
    { question: 'Do the past papers come with answer keys?', answer: 'Yes, every paper in our archive includes the official ministerial answer key, cross-referenced with expert explanations to ensure 100% accuracy.' },
    { question: 'How many past papers are there in total?', answer: 'There are currently 14 official IMAT papers available. Starting from the 2011 pilot to the most recent 2024 October session.' },
    { question: 'Are the older papers (2011-2013) still relevant?', answer: 'While the format has evolved, the core scientific principles and logical reasoning styles remain highly relevant. They are excellent for foundational practice.' },
    { question: 'How should I use past papers in my study plan?', answer: 'You should use them for "Timed Simulations." Replicate the 100-minute constraint and avoid using calculators or notes to measure your true level.' },
    { question: 'Is the 2024 paper different from previous ones?', answer: 'The 2024 paper follows the new Ministerial (MUR) format, which has a slightly adjusted question distribution compared to the Cambridge Assessment era (pre-2023).' },
    { question: 'Can I download the papers in a single file?', answer: 'Yes, we provide a Master .ZIP bundle containing all papers and resources formatted for easy printing.' },
    { question: 'Are there worked solutions for the math and physics questions?', answer: 'Our premium archive includes worked-out logical derivations for all mathematical and numerical reasoning questions.' },
    { question: 'Should I solve the papers on a screen or paper?', answer: 'Since the real IMAT is a paper-based exam in Italy, we strongly recommend printing the PDFs and marking your answers manually on an optical sheet simulation.' },
    { question: 'Are the papers available in Italian?', answer: 'The IMAT is an English-medium exam. Our archive is strictly the English version used for admission to international medical programs in Italy.' }
];

export default function ImatPreviousPapers() {
    const navigate = useNavigate();
    const { getField } = usePageContent('imat-previous-year-papers-pdf');
    const papersZipUrl = getField('papers_zip_url', '');
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
        <CmsPageWrapper slug="imat-previous-year-papers-pdf">
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
                    title="IMAT Past Papers PDF (2011–2025) — Free Download + Answer Keys | ItaloStudy"
                    description="Download all 14 official IMAT past papers from 2011 to 2025 completely free. Includes ministerial answer keys, worked solutions, and difficulty analysis. Best IMAT preparation resource."
                    keywords="imat past papers pdf, imat previous year papers free download, imat 2024 paper pdf, imat question papers with answers, imat exam questions 2025, imat preparation materials pdf"
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
                                        <Sparkles size={12} className="animate-pulse" />
                                        Official 2026 Academic Roadmap
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                                        {getField('hero_headline', 'IMAT Past Papers (2011-2025)')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', 'Testing is the only true preparation. Download over a decade of official ministerial question sets with verified expert answer keys.')}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'years', label: 'History', value: '14 Years', icon: History },
                                            { key: 'papers', label: 'Papers', value: '14 Official', icon: FileText },
                                            { key: 'soluble', label: 'Solved', value: '100% Keys', icon: Shield },
                                            { key: 'update', label: 'Updates', value: 'Yearly', icon: Activity }
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

                                {/* Archive Table */}
                                <section id="archive" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <History className="text-indigo-600" size={32} />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900">Historical Audit</h2>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { year: '2024-2025', status: 'Ministerial (MUR) Format', delta: 'Focus: Chemistry/Bio Depth', icon: Activity },
                                            { year: '2014-2023', status: 'Cambridge Assessment Era', delta: 'Focus: Critical Logic (BMAT Style)', icon: BookOpen },
                                            { year: '2011-2013', status: 'Pilot & Early Cycles', delta: 'Focus: General Foundations', icon: GraduationCap }
                                        ].map((era, i) => (
                                            <div key={i} className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    <era.icon size={28} />
                                                </div>
                                                <div className="flex-1 text-center md:text-left">
                                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{era.year}</div>
                                                    <h4 className="text-xl font-black text-slate-900 mb-1">{era.status}</h4>
                                                    <p className="text-slate-500 font-medium text-sm">{era.delta}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" className="rounded-xl border-slate-200 font-bold">View List</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Master Download */}
                                <section id="download" className="scroll-mt-40">
                                    <Card className="p-12 border-slate-900 border-[3px] bg-white shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <FileDown size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex flex-col md:flex-row items-center gap-10">
                                                <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                                                    <Download size={48} />
                                                </div>
                                                <div className="flex-1 text-center md:text-left">
                                                    <h3 className="text-3xl font-black text-slate-900 mb-3">Master PDF Bundle (2011-2025)</h3>
                                                    <p className="text-slate-500 font-medium text-lg leading-relaxed mb-8 max-w-lg">
                                                        A single 45MB optimized ZIP file containing all official question booklets, answer keys, and score distribution reports.
                                                    </p>
                                                    <EditableFile fieldKey="papers_zip_url" currentUrl={papersZipUrl} accept=".pdf,.zip">
                                                        <Button
                                                            onClick={() => papersZipUrl && window.open(papersZipUrl, '_blank')}
                                                            className="bg-slate-900 text-white h-20 px-12 rounded-[1.5rem] font-black text-xl hover:bg-indigo-600 transition-colors shadow-2xl shadow-indigo-500/10 group"
                                                        >
                                                            DOWNLOAD ALL PAPERS (.ZIP)
                                                            <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                                                        </Button>
                                                    </EditableFile>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </section>

                                {/* Methodology */}
                                <section id="methodology" className="scroll-mt-40">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Zap size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl font-black mb-8 flex items-center gap-4">
                                                <Star className="text-indigo-400" />
                                                The Simulation Protocol
                                            </h2>
                                            <p className="text-xl text-slate-300 leading-relaxed font-medium mb-12 max-w-3xl">
                                                Do not solve past papers untimed. If you give yourself 3 hours for a 100-minute exam, your score is fraudulent. Replicate the test center environment—silence, no water on desk, and paper-based marking manually.
                                            </p>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                                    <CheckCircle2 size={32} className="text-emerald-400 mb-4" />
                                                    <h4 className="text-xl font-black mb-2">Verified Keys</h4>
                                                    <p className="text-sm text-slate-400 leading-relaxed">Cross-referenced with the final CINECA/MUR scoring audits for 100% precision.</p>
                                                </div>
                                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                                    <Activity size={32} className="text-indigo-400 mb-4" />
                                                    <h4 className="text-xl font-black mb-2">Score Calibration</h4>
                                                    <p className="text-sm text-slate-400 leading-relaxed">Calculate your "Weighted Average" across different eras to find your realistic 2026 percentile.</p>
                                                </div>
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

                                {/* Bottom Grid */}
                                <section className="pt-20 border-t border-slate-200">
                                    <h3 className="text-2xl font-black text-slate-900 mb-8">Explore the Full IMAT Cluster 📚</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {imatLinks.map((link, i) => (
                                            <Link key={i} to={link.path} className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-600 transition-colors flex items-center justify-between">
                                                <span className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{link.label}</span>
                                                <ChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        ))}
                                    </div>
                                </section>

                                <CTASection fieldKeyPrefix="imat_papers_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


