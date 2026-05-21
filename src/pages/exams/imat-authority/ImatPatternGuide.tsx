import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    LayoutDashboard,
    PieChart,
    ChevronRight,
    Zap,
    Scale,
    TrendingUp,
    Star,
    Grid,
    Globe,
    HelpCircle,
    CheckCircle2,
    ListChecks,
    BookOpen,
    FileText,
    Clock,
    Activity,
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
    { id: 'distribution', label: 'Distribution' },
    { id: 'scoring', label: 'Scoring' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'What is the structure of the IMAT exam?', answer: 'The IMAT is a 100-minute paper-based exam consisting of 60 multiple-choice questions across Biology, Chemistry, Physics, Maths, and Logical Reasoning.' },
    { question: 'How is the IMAT scored?', answer: 'Correct answers earn +1.5 points. Incorrect answers result in a -0.4 point penalty. Unanswered questions earn 0 points.' },
    { question: 'What is the maximum possible score?', answer: 'The maximum score is 90 points (60 questions × 1.5 points).' },
    { question: 'How much time do I have for each question?', answer: 'On average, you have 1.6 minutes (1 minute and 40 seconds) per question. This makes time management a critical factor.' },
    { question: 'Is the pattern the same for all universities?', answer: 'Yes, the IMAT exam pattern is standardized across all Italian public universities offering English-taught medical degrees.' },
    { question: 'Are there any negative marks?', answer: 'Yes, negative marking (-0.4) is applied to discourage random guessing. It is often better to leave a question blank if you are completely unsure.' },
    { question: 'Is the exam paper-based or computer-based?', answer: 'The IMAT is traditionally a paper-based exam. You mark your answers on a special optical reader sheet.' },
    { question: 'What language is the exam in?', answer: 'The IMAT is administered entirely in English for admission to English-taught MD programs.' },
    { question: 'How many choices are there for each question?', answer: 'Each question has 5 multiple-choice options (A, B, C, D, E). Only one answer is correct.' },
    { question: 'What is a "threshold" score?', answer: 'The threshold score is the minimum required to be considered for admission. For non-EU students, it is typically around 20 points, but competitive scores are usually much higher.' }
];

export default function ImatPatternGuide() {
    const navigate = useNavigate();
    const { getField } = usePageContent('imat-exam-pattern-2026');
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
        <CmsPageWrapper slug="imat-exam-pattern-2026">
            <Layout
                variant="public"
                showHeader={true}
                showFooter={true}
                subNavigation={
                    <PageNavigation
                        sections={sections}
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    />
                }
            >
                <SEOHead
                    title="IMAT Exam Pattern 2026 – Question Breakdown & Weightage"
                    description="Official 2026 IMAT exam pattern. Detailed breakdown of 60 questions across Biology, Chemistry, Physics, Math, and Critical Thinking sections."
                    keywords="IMAT exam pattern 2026, IMAT question weightage, IMAT section breakdown, IMAT biology questions, IMAT logic section"
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

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
                                        {getField('hero_headline', 'IMAT 2026 Exam Pattern')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', 'Strategy starts with understanding the battlefield. This expert analysis breaks down every section of the 60-question IMAT 2026 structure.')}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'questions', label: 'Questions', value: '60 MCQ', icon: ListChecks },
                                            { key: 'duration', label: 'Duration', value: '100 Mins', icon: Clock },
                                            { key: 'penalty', label: 'Penalty', value: '-0.4 pts', icon: Zap },
                                            { key: 'max', label: 'Max Score', value: '90 Pts', icon: Star }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-indigo-200 transition-colors">
                                                <item.icon className="text-indigo-600 mb-2 md:mb-3 group-hover:scale-110 transition-transform" size={20} />
                                                <EditableText fieldKey={`stat_val_${item.key}`} as="div" className="text-lg md:text-2xl font-black text-slate-900">
                                                    {getField(`stat_val_${item.key}`, item.value)}
                                                </EditableText>
                                                <EditableText fieldKey={`stat_label_${item.key}`} as="div" className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    {getField(`stat_label_${item.key}`, item.label)}
                                                </EditableText>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Distribution */}
                                <section id="distribution" className="scroll-mt-40">
                                    <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-600">
                                            <PieChart size={150} />
                                        </div>
                                        <div className="relative z-10">
                                            <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-8 flex items-center gap-4">
                                                <PieChart className="text-indigo-600" size={28} />
                                                Question Weighting
                                            </h3>
                                            <div className="space-y-6">
                                                {[
                                                    { label: 'Reading Skills & Knowledge', qs: '4 Questions', weight: 'High', color: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
                                                    { label: 'Logical Reasoning & Problems', qs: '5 Questions', weight: 'High', color: 'bg-blue-50 border-blue-100 text-blue-700' },
                                                    { label: 'Biology', qs: '23 Questions', weight: 'Critical', color: 'bg-rose-50 border-rose-100 text-rose-700' },
                                                    { label: 'Chemistry', qs: '15 Questions', weight: 'Critical', color: 'bg-amber-50 border-amber-100 text-amber-700' },
                                                    { label: 'Physics & Mathematics', qs: '13 Questions', weight: 'Medium', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' }
                                                ].map((item, i) => (
                                                    <div key={i} className={`flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 rounded-2xl border gap-4 ${item.color}`}>
                                                        <div>
                                                            <div className="font-black text-base md:text-lg">{item.label}</div>
                                                            <div className="text-[10px] md:text-xs font-black uppercase opacity-60 tracking-widest">{item.qs}</div>
                                                        </div>
                                                        <div className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/50 rounded-full border border-black/5 self-start md:self-center">
                                                            {item.weight} Priority
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Scoring */}
                                <section id="scoring" className="scroll-mt-40">
                                    <div className="bg-slate-900 text-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <Scale size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-2xl md:text-4xl font-black mb-8 flex items-center gap-4">
                                                <Scale className="text-indigo-400" size={28} />
                                                The Scoring Algorithm
                                            </h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                                <div className="p-6 md:p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                                    <div className="text-4xl md:text-5xl font-black text-emerald-400 mb-2">+1.5</div>
                                                    <div className="text-[10px] md:text-sm font-black uppercase tracking-widest text-emerald-300/60 mb-4">Correct Answer</div>
                                                    <p className="text-slate-300 text-xs md:text-sm font-medium">Every correct mark directly increases your rank. Accuracy is paramount in Science sections.</p>
                                                </div>
                                                <div className="p-6 md:p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                                    <div className="text-4xl md:text-5xl font-black text-rose-400 mb-2">-0.4</div>
                                                    <div className="text-[10px] md:text-sm font-black uppercase tracking-widest text-rose-300/60 mb-4">Incorrect Answer</div>
                                                    <p className="text-slate-300 text-xs md:text-sm font-medium">Guessing is dangerous. Only guess if you can eliminate at least 3 wrong options.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Strategy */}
                                <section id="strategy" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-amber-100 p-2 md:p-3 rounded-2xl">
                                            <TrendingUp className="text-amber-600" size={28} />
                                        </div>
                                        <EditableText fieldKey="section_strategy_title" as="h2" className="text-2xl md:text-4xl font-black text-slate-900 underline decoration-amber-400 underline-offset-8">
                                            {getField('section_strategy_title', 'Pattern Strategy')}
                                        </EditableText>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { key: 'calc', icon: Activity, title: 'No Calculators', focus: 'Mental math and scientific approximations are verified every year.', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
                                            { key: 'logic', icon: ListChecks, title: 'Logic Traps', focus: 'Section 1 requires extracting data from tables and evaluating logic flaws.', color: 'bg-rose-50 text-rose-700 border-rose-100' },
                                            { key: 'depth', icon: BookOpen, title: 'Scientific Depth', focus: 'Focus heavily on Biology and Chemistry as they represent 60%+ of marks.', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                                            { key: 'speed', icon: Clock, title: 'Speed Precision', focus: 'You must reach a speed of 90 seconds per question during mock tests.', color: 'bg-amber-50 text-amber-700 border-amber-100' }
                                        ].map((item, i) => (
                                            <div key={i} className={`p-6 md:p-8 rounded-[2rem] border-2 ${item.color} flex flex-col justify-between h-full`}>
                                                <div>
                                                    <item.icon className="mb-4" size={28} />
                                                    <EditableText fieldKey={`strategy_card_${item.key}_title`} as="h4" className="text-lg md:text-xl font-bold mb-4 uppercase">
                                                        {getField(`strategy_card_${item.key}_title`, item.title)}
                                                    </EditableText>
                                                    <EditableText fieldKey={`strategy_card_${item.key}_focus`} as="p" className="text-xs md:text-sm opacity-80 font-medium leading-relaxed">
                                                        {getField(`strategy_card_${item.key}_focus`, item.focus)}
                                                    </EditableText>
                                                </div>
                                                <ChevronRight className="mt-8 self-end" size={20} />
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* FAQs */}
                                <section id="faqs" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8 md:mb-12">
                                        <div className="bg-slate-200 p-2 md:p-3 rounded-2xl">
                                            <HelpCircle className="text-slate-600" size={28} />
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
                                    </div>
                                    <div className="space-y-6">
                                        {faqs.map((faq, i) => (
                                            <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="text-lg md:text-xl font-black text-slate-900 mb-4 flex gap-3 md:gap-4">
                                                    <span className="text-indigo-600 shrink-0">Q{i + 1}:</span>
                                                    <EditableText fieldKey={`faq_q_${i}`} as="div">
                                                        {getField(`faq_q_${i}`, faq.question)}
                                                    </EditableText>
                                                </div>
                                                <div className="text-slate-600 leading-relaxed font-medium pl-8 md:pl-12 border-l-2 border-slate-50 text-sm md:text-base">
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
                                            <Link key={i} to={link.path} className="group bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-600 transition-colors flex items-center justify-between">
                                                <span className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors text-sm md:text-base">{link.label}</span>
                                                <ChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" size={18} />
                                            </Link>
                                        ))}
                                    </div>
                                </section>

                                <CTASection fieldKeyPrefix="imat_pattern_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


