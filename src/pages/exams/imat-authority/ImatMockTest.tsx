import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Activity,
    Clock,
    Trophy,
    Target,
    Zap,
    Users,
    ChevronRight,
    BarChart3,
    ShieldAlert,
    CheckCircle2,
    Monitor,
    Star,
    Grid,
    Globe,
    HelpCircle,
    ArrowRight,
    Timer,
    Search,
    History,
    Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';
import VoltageButton from '@/components/ui/VoltageButton';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import FAQSchema from '@/components/seo/FAQSchema';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import { imatLinks } from '@/lib/nav-links';
import { getBreadcrumbSchema } from '@/utils/seo-schemas';
import PageNavigation from '@/components/exams/PageNavigation';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'simulation', label: 'Simulation' },
    { id: 'ranking', label: 'Live Ranking' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'Is this IMAT mock test really free?', answer: 'Yes, our baseline full-length mock test is 100% free. We believe every student should have access to high-quality simulation before the real exam.' },
    { question: 'How accurate is the ranking system?', answer: 'Our ranking algorithm compares your score against over 12,000 global applicants who have taken our mocks, providing a highly reliable percentile indicator.' },
    { question: 'Can I take the mock test multiple times?', answer: 'You can retake the test, but we recommend waiting at least 2 weeks between attempts to ensure you are measuring progress rather than just memorizing answers.' },
    { question: 'What is the difficulty level of the mock?', answer: 'We calibrate our mocks to be approximately 5-10% more difficult than the average official paper. This builds the "mental stamina" required for the real exam day.' },
    { question: 'Do I get an explanation for wrong answers?', answer: 'Yes, after submitting, you receive a detailed breakdown of every question with scientific explanations and logical reasoning walkthroughs.' },
    { question: 'Is the interface the same as the real IMAT?', answer: 'While the real IMAT is paper-based, our interface simulates the "pressure" of the clock and the structure of the question booklet as closely as possible in a digital format.' },
    { question: 'Do I need a webcam for the mock?', answer: 'No, this is a self-administered practice mock. However, we recommend taking it in a quiet environment without distractions to simulate real conditions.' },
    { question: 'How long do I have to complete it?', answer: 'The clock is set to exactly 100 minutes, mirroring the official Italian Ministry (MUR) regulations.' },
    { question: 'Will I see my score immediately?', answer: 'Yes, your score, negative marking penalty, and relative global rank are displayed instantly upon submission.' },
    { question: 'Can I pause the mock test?', answer: 'No. To simulate real exam conditions, the timer continues once started. We do not allow pausing to ensure the ranking data remains valid.' }
];

export default function ImatMockTest() {
    const navigate = useNavigate();
    const { getField } = usePageContent('imat-mock-test-free-2026');
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
        <CmsPageWrapper slug="imat-mock-test-free-2026">
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
                    title="IMAT Mock Test 2026 – Free Full-Length Exam Simulation"
                    description="Take the free IMAT mock test 2026. Realistic 100-minute simulation with 60 questions, instant global ranking, and detailed answer explanations for medical applicants."
                    keywords="imat mock test, imat mock exam, imat mock test free, imat practice test, imat simulation 2026, imat free mock, imat prep, medical entrance italy, italostudy"
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
                                        {getField('hero_headline', 'Free IMAT Mock Test 2026')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "Validate your preparation with the world's most accurate IMAT simulator. Calibrated difficulty and instant global ranking.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'duration', label: 'Duration', value: '100 Min', icon: Clock },
                                            { key: 'questions', label: 'Questions', value: '60 MCQ', icon: Target },
                                            { key: 'ranked', label: 'Ranked', value: '12,500+', icon: Users },
                                            { key: 'diff', label: 'Difficulty', value: '+5% Official', icon: ShieldAlert }
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

                                {/* Simulation Preview */}
                                <section id="simulation" className="scroll-mt-40">
                                    <div className="bg-indigo-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <Monitor size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl font-black mb-8 flex items-center gap-4">
                                                <Monitor className="text-indigo-400" />
                                                The Simulation Protocol
                                            </h2>
                                            <p className="text-xl text-indigo-100 font-medium leading-relaxed mb-12 max-w-2xl">
                                                Our digital exam interface is engineered to simulate the cognitive load of the official IMAT paper. No distractions, just high-stakes decision making.
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {[
                                                    { title: 'Automatic Penalties', desc: 'Real-time -0.4 point deduction for wrong answers to calibrate your risk tolerance.' },
                                                    { title: 'Sectional Logic', desc: 'Balanced question distribution matching the 2024 standardized format.' },
                                                    { title: 'Timed Pressure', desc: 'Inflexible 100-minute timer that cannot be paused or bypassed.' },
                                                    { title: 'Answer Explanations', desc: 'Detailed scientific pedagogical breakdown following the simulation.' }
                                                ].map((feature, i) => (
                                                    <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm flex items-start gap-4">
                                                        <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
                                                        <div>
                                                            <div className="font-black text-lg mb-1">{feature.title}</div>
                                                            <div className="text-indigo-200/70 text-sm font-medium">{feature.desc}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-12 flex justify-center">
                                                <Button size="lg" className="bg-white text-indigo-900 hover:bg-slate-100 font-black rounded-2xl px-12 py-8 h-auto text-xl shadow-xl shadow-indigo-500/20 group">
                                                    START MOCK TEST NOW
                                                    <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Live Ranking */}
                                <section id="ranking" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <BarChart3 className="text-indigo-600" size={32} />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Real-Time Global Percentile</h2>
                                    </div>
                                    <Card className="p-10 border-slate-100 shadow-xl bg-white rounded-[2.5rem] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-indigo-600">
                                            <Users size={150} />
                                        </div>
                                        <div className="relative z-10">
                                            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8">
                                                A score in isolation is meaningless. Admission in Italy is entirely relative. Our platform ranks you against the <span className="text-indigo-600 font-black italic">entire cohort</span> of applicants using our database.
                                            </p>
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="flex-1 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                                                    <div className="text-4xl font-black text-slate-900 mb-2">94th</div>
                                                    <div className="text-xs font-black uppercase text-slate-400 tracking-widest">Avg. Candidate Percentile</div>
                                                </div>
                                                <div className="flex-1 bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
                                                    <div className="text-4xl font-black text-emerald-600 mb-2">Top 5%</div>
                                                    <div className="text-xs font-black uppercase text-emerald-500/60 tracking-widest">Target for Milan/Rome</div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </section>

                                {/* Analytics */}
                                <section id="analytics" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-amber-100 p-3 rounded-2xl">
                                            <Zap className="text-amber-600" size={32} />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900">Predictive Admission Index</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {[
                                            { title: 'Score Stability', focus: 'Identify if your performance varies across different subject areas.', color: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
                                            { title: 'Accuracy Margin', focus: 'Measure the ratio of correct answers vs. penalty points deducted.', color: 'bg-rose-50 border-rose-100 text-rose-700' },
                                            { title: 'Speed Coefficient', focus: 'Determine your average time spent on Logic vs. Biology recall.', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
                                            { title: 'Subject Gaps', focus: 'Intelligent heatmap highlighting which syllabus areas need review.', color: 'bg-amber-50 border-amber-100 text-amber-700' }
                                        ].map((item, i) => (
                                            <div key={i} className={`p-8 rounded-[2rem] border-2 ${item.color} flex flex-col justify-between h-full group hover:shadow-lg transition-all`}>
                                                <div>
                                                    <h4 className="text-xl font-bold mb-4 uppercase">{item.title}</h4>
                                                    <p className="text-sm opacity-80 font-medium leading-relaxed">{item.focus}</p>
                                                </div>
                                                <ChevronRight className="mt-8 self-end" />
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

                                <CTASection fieldKeyPrefix="imat_mock_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


