import React from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Activity,
    BrainCircuit,
    Calculator,
    Zap,
    Scale,
    TrendingUp,
    ChevronRight,
    Target,
    HelpCircle,
    CheckCircle2,
    Play,
    Timer,
    BarChart,
    Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FAQSchema from '@/components/seo/FAQSchema';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import EditableText from '@/components/cms/EditableText';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import PageNavigation from '@/components/exams/PageNavigation';
import { centsLinks } from '@/lib/nav-links';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Test Features' },
    { id: 'structure', label: 'Structure' },
    { id: 'start', label: 'Start Test' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'Is this CENT-S mock test really free?', answer: 'Yes. We offer a full-length CENT-S simulation for free to help students understand the technical difficulty and time pressure of the actual exam.' },
    { question: 'Does the mock test use real past paper questions?', answer: 'Our simulation uses high-fidelity questions that mimic the style, difficulty, and topic distribution of official CISIA CENT-S papers.' },
    { question: 'What is a "good" score on the mock test?', answer: 'A raw score of 40+ out of 55 typically places you in the top 10% of candidates, which is competitive for top-tier Italian STEM programs.' },
    { question: 'Can I retake the mock test?', answer: 'Yes, you can retake the mock as many times as you like. We recommend waiting at least a week between retakes to ensure you aren\'t just memorizing answers.' },
    { question: 'Do I get a detailed score report?', answer: 'Yes, after completing the test, you will see your raw score breakdown by section (Math, Logic, Sciences, Reading) and your estimated national percentile.' },
    { question: 'Is the timing realistic?', answer: 'The simulator uses the official 110-minute timer and the same section-by-section time constraints as the real CENT-S.' },
    { question: 'Do I need a calculator for the mock?', answer: 'No. Just like the real exam, calculators are prohibited. You should have a pen and paper for scratch work.' },
    { question: 'Does the mock test have negative marking?', answer: 'Yes. Every incorrect answer results in a -0.25 point penalty, while skipped questions earn 0 points.' },
    { question: 'Is this mock test valid for all CENT-S modules?', answer: 'This mock covers the standard "General Scientific" CENT-S module, which is the most common requirement for Engineering and Pure Science degrees.' },
    { question: 'How do I improve my score after the mock?', answer: 'We recommend reviewing the detailed solutions provided after the test and focusing your study on the specific sub-topics where you lost the most points.' }
];

export default function CentsFreeMockTest() {
    const { getField } = usePageContent('cent-s-mock-test-2026');
    const [activeSection, setActiveSection] = React.useState('overview');

    React.useEffect(() => {
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

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
        }
    };

    return (
        <CmsPageWrapper slug="cent-s-mock-test-2026">
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
                    title="Free CENT-S Mock Test 2026: Full 110-Min Simulation"
                    description="Take our free full-length CENT-S 2026 mock test. Real exam timing, negative marking, and detailed score analysis for Italian STEM entrance preparation."
                    keywords="free cent-s mock test, cent-s simulation 2026, cisia practice test, stem italy entrance prep, free tolc-s mock"
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

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                                        {getField('hero_headline', 'Free CENT-S Official Simulator')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "Test your skills against the 2026 difficulty standard. Our simulator provides a high-fidelity experience of the actual CENT-S environment.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'mode', label: 'Mode', value: '110 Min', icon: Timer },
                                            { key: 'q', label: 'Questions', value: '55 MCQ', icon: Target },
                                            { key: 'score', label: 'Analytics', value: 'Instant', icon: BarChart },
                                            { key: 'status', label: 'Status', value: 'Free', icon: CheckCircle2 }
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

                                {/* Features */}
                                <section id="features" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Zap className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Why Practice With Us?</h2>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {[
                                            { title: 'Real Difficulty', desc: 'Questions are calibrated by our academic team to match the 2026 CISIA difficulty curve.', icon: Target },
                                            { title: 'Time Stress', desc: 'The section-lock and overall timer mirror the pressure of the live test center environment.', icon: Timer },
                                            { title: 'Gap Analysis', desc: 'Get a granular breakdown of your performance across all 12 scientific sub-topics.', icon: BarChart }
                                        ].map((feat, i) => (
                                            <Card key={i} className="p-8 border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-indigo-600 transition-colors">
                                                <feat.icon className="text-indigo-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
                                                <h4 className="font-black text-slate-900 mb-2">{feat.title}</h4>
                                                <p className="text-sm text-slate-500 font-medium">{feat.desc}</p>
                                            </Card>
                                        ))}
                                    </div>
                                </section>

                                {/* Structure */}
                                <section id="structure" className="scroll-mt-[120px]">
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-600"><BrainCircuit size={150} /></div>
                                        <h2 className="text-3xl font-black text-slate-900 mb-8">Simulation Blueprint</h2>
                                        <div className="space-y-6">
                                            {[
                                                { label: 'Mathematics', q: '20 Questions', time: '50 Minutes', icon: Calculator },
                                                { label: 'Logical Reasoning', q: '10 Questions', time: '20 Minutes', icon: BrainCircuit },
                                                { label: 'Reading Comprehension', q: '10 Questions', time: '20 Minutes', icon: Activity },
                                                { label: 'Sciences (Bio/Chem/Phys)', q: '15 Questions', time: '20 Minutes', icon: Zap }
                                            ].map((row, i) => (
                                                <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <div className="flex items-center gap-4">
                                                        <row.icon className="text-indigo-600" size={20} />
                                                        <span className="font-black text-slate-900">{row.label}</span>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{row.q}</span>
                                                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{row.time}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* Start Test */}
                                <section id="start" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 text-center relative overflow-hidden">
                                        <div className="absolute top-0 left-0 p-8 opacity-5"><Activity size={200} /></div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl font-black mb-4">Ready to start your simulation?</h2>
                                            <p className="text-slate-400 font-medium mb-10 max-w-2xl mx-auto">
                                                Ensure you have 110 minutes of uninterrupted time. Calculators are prohibited. Results will be saved to your dashboard.
                                            </p>
                                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-10 py-8 h-auto text-xl font-black gap-3 shadow-xl shadow-indigo-500/20">
                                                <Play fill="white" size={24} /> Start Mock Test Now
                                            </Button>
                                        </div>
                                    </div>
                                </section>

                                {/* FAQs */}
                                <section id="faqs" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-12">
                                        <div className="bg-slate-200 p-3 rounded-2xl">
                                            <HelpCircle className="text-slate-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
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

                                <CTASection fieldKeyPrefix="mock_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


