import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Laptop,
    CheckCircle2,
    Timer,
    BarChart,
    ChevronRight,
    HelpCircle,
    MonitorPlay,
    Target,
    BrainCircuit,
    Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import FAQSchema from '@/components/seo/FAQSchema';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import { tolcLinks } from '@/lib/nav-links';
import { getBreadcrumbSchema } from '@/utils/seo-schemas';
import PageNavigation from '@/components/exams/PageNavigation';

const sections = [
    { id: 'overview', label: 'Mock Test Overview' },
    { id: 'features', label: 'Simulation Features' },
    { id: 'variants', label: 'Supported TOLC Variants' },
    { id: 'analytics', label: 'AI Score Analytics' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'Is this TOLC mock test really free?', answer: 'Yes! We offer a completely free, full-length diagnostic mock test for major TOLC variants (TOLC-I, TOLC-E, TOLC-MED, TOLC-F). You can take it immediately after creating a free account.' },
    { question: 'Does the mock simulate the strict CISIA timing?', answer: 'Absolutely. The TOLC is notorious for its strict per-section timers. If you have 50 minutes for Mathematics, our system strictly enforces that countdown and locks the section when time expires, exactly like the real CISIA CBT platform.' },
    { question: 'Do you apply the -0.25 negative marking penalty?', answer: 'Yes. Our scoring algorithm applies the exact +1.0 for correct answers, 0.0 for blanks, and -0.25 for incorrect answers as mandated by CISIA.' },
    { question: 'Does the mock include the English proficiency section?', answer: 'Yes, our full-length simulations include the final 30-question, 15-minute English section without negative marking, just like the real exam.' },
    { question: 'How is the TOLC-MED equalized score calculated on your mock?', answer: 'For TOLC-MED simulations, we utilize thousands of past student data points to simulate the "Coefficient of Difficulty." You will receive both a raw score and an estimated Equalized Score.' },
    { question: 'Can I take the mock on my phone?', answer: 'While our platform is mobile-responsive, we strongly recommend taking the mock test on a laptop or desktop computer. The real TOLC is a Computer-Based Test (CBT), and you need to get used to navigating the interface with a mouse and keyboard.' },
    { question: 'Are the questions from past CISIA exams?', answer: 'CISIA rarely releases full past papers. However, our questions are meticulously reverse-engineered by our expert faculty based on the official syllabus, released sample questions, and post-exam student debriefs to match the exact difficulty level.' },
    { question: 'How many mock tests should I take before the real exam?', answer: 'We recommend taking a diagnostic mock at the start of your prep, followed by at least 1-2 mocks per week in the final month leading up to your exam date. Do not just take the mocks; spend time analyzing your mistakes.' },
    { question: 'Will I get explanations for the wrong answers?', answer: 'Yes. After submitting the mock, you get access to a detailed analytical report with step-by-step solutions for every single question, particularly for complex Math and Logic problems.' },
    { question: 'Do the mocks cover the new 2026 syllabus changes?', answer: 'Yes, our content team continuously updates the question banks. If CISIA modifies the syllabus or section weighting (as they did with TOLC-MED recently), our mocks are updated immediately.' }
];

export default function TolcMockTest() {
    const { getField } = usePageContent('tolc-mock-test-2026');
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
        <CmsPageWrapper slug="tolc-mock-test-2026">
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
                    title="Free TOLC Mock Test 2026: CBT Simulator (TOLC-I, E, MED, F)"
                    description="Take a free, full-length TOLC mock test online. Experience the exact CISIA CBT interface, strict section timers, and negative marking. Get instant AI analytics."
                    keywords="TOLC mock test free, TOLC-I simulator, TOLC-MED practice test, online TOLC CBT, CISIA mock exam, TOLC English test"
                    schemas={[getBreadcrumbSchema([
                        { name: 'Home', item: '/' },
                        { name: 'TOLC Guide', item: '/tolc-exam-ultimate-guide-2026' },
                        { name: 'TOLC Mock Test 2026', item: '/tolc-mock-test-free-2026' }
                    ])]}
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
                                        <MonitorPlay size={12} className="text-indigo-600" />
                                        Advanced CBT Simulator
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                                        {getField('hero_headline', 'Free TOLC Mock Test Simulator 2026')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "The TOLC is a highly psychological Computer-Based Test (CBT). You aren't just tested on your knowledge; you are tested on your ability to manage aggressive countdown timers per section and the pressure of a strict -0.25 negative marking penalty. Practicing on paper is not enough. You need to simulate the exact CISIA digital environment. Take our free diagnostic mock test today to establish your baseline score.")}
                                    </EditableText>

                                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                        <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-14 text-lg font-bold shadow-[0_0_40px_rgba(79,70,229,0.3)]">
                                            <a href="https://app.italostudy.com/auth/register">Start Free Mock Test Now</a>
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { key: 'cost', label: 'Price', value: '100% Free', icon: Target },
                                            { key: 'timer', label: 'Timing', value: 'Strict CBT', icon: Timer },
                                            { key: 'scoring', label: 'Scoring', value: '-0.25 Penalty', icon: CheckCircle2 },
                                            { key: 'analytics', label: 'Feedback', value: 'Instant AI', icon: BarChart }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-indigo-200 transition-colors">
                                                <item.icon className="text-indigo-600 mb-3 group-hover:scale-110 transition-transform" size={24} />
                                                <EditableText fieldKey={`stat_val_${item.key}`} as="div" className="text-xl font-black text-slate-900">
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
                                        <div className="bg-emerald-100 p-3 rounded-2xl">
                                            <Cpu className="text-emerald-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Pixel-Perfect CISIA Simulation</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm">
                                            <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                                                <Timer className="text-emerald-600" size={24} />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-3">Segmented Countdown Timers</h3>
                                            <p className="text-slate-600 leading-relaxed text-sm">
                                                Unlike standard exams where you get a total time block, the TOLC locks you into sections. If TOLC-I Math is 50 minutes, our platform enforces a strict 50-minute lock. You cannot go back once the timer expires.
                                            </p>
                                        </div>
                                        <div className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm">
                                            <div className="bg-rose-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                                                <Target className="text-rose-600" size={24} />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-3">Algorithmic Negative Marking</h3>
                                            <p className="text-slate-600 leading-relaxed text-sm">
                                                We apply the exact +1.0 / 0.0 / -0.25 scoring matrix. The final 30-question English section is strictly graded without the negative penalty, accurately reflecting the real exam architecture.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Supported Variants */}
                                <section id="variants" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Laptop className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Supported TOLC Variants</h2>
                                    </div>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium mb-8">
                                        The TOLC is not one exam; it's a family of exams. Our platform dynamically adjusts the test structure, syllabus content, and timers based on the specific variant you select.
                                    </p>
                                    <div className="space-y-4">
                                        {[
                                            { title: 'TOLC-I (Engineering)', desc: '50 Core Questions (Math, Logic, Science, Reading) + 30 English.' },
                                            { title: 'TOLC-E (Economics)', desc: '36 Core Questions (Logic, Reading, Math) + 30 English.' },
                                            { title: 'TOLC-MED (Medicine)', desc: '50 Questions with advanced equalization scoring algorithms.' },
                                            { title: 'TOLC-F (Pharmacy/Bio)', desc: '50 Core Questions emphasizing Chemistry and Biology.' }
                                        ].map((variant, i) => (
                                            <div key={i} className="p-6 bg-white border border-slate-200 rounded-2xl flex items-start gap-4">
                                                <div className="mt-1"><CheckCircle2 className="text-indigo-500" size={20} /></div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">{variant.title}</h4>
                                                    <p className="text-sm text-slate-600 mt-1">{variant.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Analytics */}
                                <section id="analytics" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <BrainCircuit size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-3xl font-black mb-6 flex items-center gap-4">
                                                <BrainCircuit className="text-amber-400" />
                                                Instant AI Analytics & Explanations
                                            </h2>
                                            <p className="text-lg text-slate-300 leading-relaxed font-medium mb-8 max-w-2xl">
                                                The moment you click submit, our engine generates a comprehensive diagnostic report. You don't just get a score; you get a roadmap.
                                            </p>
                                            
                                            <ul className="space-y-4">
                                                <li className="flex items-center gap-3">
                                                    <div className="bg-amber-400/20 p-2 rounded-lg"><BarChart size={16} className="text-amber-400" /></div>
                                                    <span className="text-slate-200"><strong>Pacing Analysis:</strong> See if you spent too much time on Logic vs. Math.</span>
                                                </li>
                                                <li className="flex items-center gap-3">
                                                    <div className="bg-emerald-400/20 p-2 rounded-lg"><Target size={16} className="text-emerald-400" /></div>
                                                    <span className="text-slate-200"><strong>Accuracy Matrix:</strong> Identify if the -0.25 penalty destroyed your score due to blind guessing.</span>
                                                </li>
                                                <li className="flex items-center gap-3">
                                                    <div className="bg-rose-400/20 p-2 rounded-lg"><HelpCircle size={16} className="text-rose-400" /></div>
                                                    <span className="text-slate-200"><strong>Step-by-Step Solutions:</strong> Detailed breakdowns of every single question.</span>
                                                </li>
                                            </ul>
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

                                <CTASection fieldKeyPrefix="tolc_mock_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}
