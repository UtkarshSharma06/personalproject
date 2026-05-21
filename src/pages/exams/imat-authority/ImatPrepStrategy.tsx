import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Target,
    Zap,
    BookOpen,
    TrendingUp,
    ChevronRight,
    Trophy,
    GraduationCap,
    Clock,
    Award,
    Calendar,
    Star,
    Grid,
    Globe,
    HelpCircle,
    CheckCircle2,
    Lightbulb,
    Activity,
    Search,
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
import PageNavigation from '@/components/exams/PageNavigation';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'roadmap', label: '6-Month Plan' },
    { id: 'logic', label: 'Logic Mastery' },
    { id: 'tactics', label: 'Exam Tactics' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'When should I start studying for the IMAT?', answer: 'The ideal time is 5-6 months before the exam. This allows 3 months for core concept mastery (Biology/Chemistry) and 2 months for intensive question practice and logical reasoning.' },
    { question: 'How many hours a day should I dedicate to IMAT prep?', answer: 'Successful candidates typically spend 4-6 hours daily during the intensive phase. Consistency is more important than raw hours.' },
    { question: 'What are the best resources for IMAT prep?', answer: 'We recommend starting with IB or A-level science textbooks, followed by IMAT-specific books like Pearson or 7001 Quiz, and finally, all official past papers from 2011 onwards.' },
    { question: 'Is logical reasoning more important than science?', answer: 'From 2024, the exam is balanced with 15 questions per section. However, logic often has the steepest learning curve for students, so avoid neglecting it.' },
    { question: 'How do I improve my speed for the IMAT?', answer: 'Speed comes from pattern recognition. Solve at least 2,000+ practice questions and time yourself. Your goal is to solve most biology questions in under 45 seconds.' },
    { question: 'Should I guess during the exam?', answer: 'Only guess if you can eliminate at least 3 options. The -0.4 penalty is designed to punish random guessing, so use "tactical blanking" for questions you have zero clue about.' },
    { question: 'Which subject should I study first?', answer: 'Start with Biology or Chemistry, as they contain the largest volume of factual content. Leave Physics and Maths for later if you already have a good foundation.' },
    { question: 'How useful are the IMAT past papers?', answer: 'They are the most valuable resource. They teach you the "logic" of the examiners. You should solve every official paper at least twice.' },
    { question: 'Do I need a tutor for IMAT?', answer: 'While self-study is possible, a tutor can help with complex sections like logical reasoning or organic chemistry. It depends on your background and target score.' },
    { question: 'What should my target score be in mocks?', answer: 'Aim for 10-15% higher than your target university cutoff. If a university requires 50, aim for consistent 58-60 in mocks to account for exam-day pressure.' }
];

export default function ImatPrepStrategy() {
    const navigate = useNavigate();
    const { getField } = usePageContent('imat-preparation-strategy');
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
        <CmsPageWrapper slug="imat-preparation-strategy">
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
                    title="IMAT Preparation Strategy 2026 – 6-Month Study Plan & Scoring Tactics"
                    description="Expert preparation strategy for the IMAT 2026. Data-backed study roadmaps, mastering the logic section, and tactical guessing to maximize your medical entrance score."
                    keywords="IMAT prep strategy 2026, IMAT study plan, IMAT guessing strategy, how to study for IMAT"
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
                                        {getField('hero_headline', 'IMAT 2026 Prep Strategy')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', 'Achieving a top-tier score requires more than academic knowledge; it requires a performance mindset and tactical execution.')}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'duration', label: 'Study Window', value: '5-6 Months', icon: Calendar },
                                            { key: 'hours', label: 'Daily Grind', value: '4-6 Hours', icon: Clock },
                                            { key: 'score', label: 'Target Score', value: '55+ Pts', icon: Target },
                                            { key: 'success', label: 'Success Rate', value: '+35% Margin', icon: Award }
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

                                {/* 6-Month Plan */}
                                <section id="roadmap" className="scroll-mt-40">
                                    <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-600">
                                            <Calendar size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl font-black text-slate-900 mb-10 flex items-center gap-4">
                                                <Calendar className="text-indigo-600" />
                                                Study Timeline
                                            </h2>
                                            <div className="space-y-8">
                                                {[
                                                    { phase: 'Phase 1: Foundation (Months 1-2)', focus: 'Focus on core scientific principles in Biology and Chemistry. Use IB/A-level resources to build deep conceptual understanding.' },
                                                    { phase: 'Phase 2: Transition (Months 3-4)', focus: 'Move to IMAT-specific question banks. Start identifying pattern traps and intensive Logical Reasoning practice.' },
                                                    { phase: 'Phase 3: Elite Execution (Months 5-6)', focus: 'Full-length timed mocks. Mastery of mental math. Intensive review of high-yield topics and official past papers.' }
                                                ].map((step, i) => (
                                                    <div key={i} className="flex gap-6">
                                                        <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black shrink-0 shadow-lg shadow-indigo-100">
                                                            {i + 1}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xl font-black text-slate-900 mb-2">{step.phase}</h4>
                                                            <p className="text-slate-600 font-medium leading-relaxed">{step.focus}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Logic Mastery */}
                                <section id="logic" className="scroll-mt-40">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute -bottom-10 -right-10 p-20 opacity-10">
                                            <Lightbulb size={300} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl font-black mb-8 flex items-center gap-4">
                                                <Target className="text-indigo-400" />
                                                Mastering Section 1
                                            </h2>
                                            <div className="prose prose-invert prose-lg mb-10 max-w-none opacity-90 font-medium">
                                                <EditableText fieldKey="section_logic_body" multiline as="div">
                                                    {getField('section_logic_body', 'Logical Reasoning is the cognitive anchor of the IMAT. You must learn to evaluate arguments (strengthen/weaken), solve numerical puzzles, and extract data from complex tables under immense pressure.')}
                                                </EditableText>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                                    <h4 className="text-lg font-black text-indigo-400 mb-2 underline decoration-indigo-400/30 underline-offset-4">Critical Thinking</h4>
                                                    <p className="text-sm text-slate-400 font-medium">Analyze sentence structures, identify hidden assumptions, and evaluate logical conclusions.</p>
                                                </div>
                                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                                    <h4 className="text-lg font-black text-emerald-400 mb-2 underline decoration-emerald-400/30 underline-offset-4">Problem Solving</h4>
                                                    <p className="text-sm text-slate-400 font-medium">Extract numerical data from charts and simulate spatial or abstract reasoning scenarios.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Exam Tactics */}
                                <section id="tactics" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-amber-100 p-3 rounded-2xl">
                                            <Zap className="text-amber-600" size={32} />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900 underline decoration-amber-400 underline-offset-8">Scoring Tactics</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {[
                                            { key: 'blank', icon: Zap, title: '-0.4 Penalty Buffer', desc: 'Tactical blanking is a skill. Only guess if you can eliminate at least 3 wrong options to maintain a positive expected value.', color: 'bg-rose-50 text-rose-700 border-rose-100' },
                                            { key: 'math', icon: Activity, title: 'Mental Math Mastery', desc: 'Strictly prohibit calculators in prep. Master scientific notation, percentages, and basic logs for the physics/chemistry sections.', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
                                            { key: 'search', icon: Search, title: 'Question Skimming', desc: 'Identify "one-looker" biology questions first. Speed through factual recall to save time for logic derivations.', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                                            { key: 'star', icon: Star, title: 'Mock Calibration', desc: 'Aim for a 15% safety margin in mocks compared to historical cutoffs to account for the actual exam-day performance drop.', color: 'bg-amber-50 text-amber-700 border-amber-100' }
                                        ].map((item, i) => (
                                            <div key={i} className={`p-8 rounded-[2rem] border-2 shadow-sm ${item.color} flex flex-col justify-between h-full group hover:shadow-xl transition-all`}>
                                                <div>
                                                    <item.icon className="mb-4 group-hover:scale-110 transition-transform" size={32} />
                                                    <h4 className="text-xl font-bold mb-4 uppercase">{item.title}</h4>
                                                    <p className="text-sm opacity-80 font-medium leading-relaxed">{item.desc}</p>
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

                                <CTASection fieldKeyPrefix="imat_prep_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


