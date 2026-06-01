import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import {
    Activity,
    CheckCircle2,
    Clock,
    Scale,
    TrendingDown,
    TrendingUp,
    ChevronRight,
    HelpCircle,
    BrainCircuit,
    Zap,
    Target
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
    { id: 'overview', label: 'Difficulty Overview' },
    { id: 'time-pressure', label: 'The Time Pressure' },
    { id: 'subject-breakdown', label: 'Subject by Subject' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'Is the TOLC harder than the IMAT?', answer: 'It depends on the variant. TOLC-MED is arguably harder than the IMAT because of the extreme time pressure and the statistical equalization algorithm. However, a standard TOLC-I or TOLC-E is generally considered more straightforward than the IMAT, though the math is more advanced in TOLC-I.' },
    { question: 'Which section of the TOLC is the hardest?', answer: 'Historically, students struggle the most with the Logic and Mathematics sections. In TOLC-I, the Math section is heavily weighted and covers advanced high school calculus and trigonometry, making it the primary filter.' },
    { question: 'Are the questions straightforward or tricky?', answer: 'Logic questions are famously tricky, designed to test your ability to avoid cognitive biases under time pressure. Science questions tend to be more straightforward, testing raw knowledge and basic application rather than convoluted scenarios.' },
    { question: 'How hard is the English section?', answer: 'The English section is generally considered very easy (B1-B2 level). Because it has no negative marking, most students score highly on it. It is rarely the section that causes someone to fail.' },
    { question: 'Is the TOLC@HOME easier than the in-person test?', answer: 'No. The question database, scoring algorithm, and time limits are exactly identical. The only difference is the environment. Some students find the strict remote proctoring of TOLC@HOME more stressful than taking it in a quiet university lab.' },
    { question: 'If I guess, will it hurt my score?', answer: 'Yes. With a -0.25 penalty for wrong answers, blind guessing is statistically a bad idea. You should only guess if you can confidently eliminate at least two of the five options.' },
    { question: 'Does the difficulty change depending on the month I take it?', answer: 'No. Because questions are drawn randomly from a massive database, the overall difficulty remains statistically flat across all months. Furthermore, for TOLC-MED, the Equalized Score algorithm adjusts your final score to compensate for any minor variations in difficulty.' },
    { question: 'Is the Physics in TOLC-I very advanced?', answer: 'It covers standard high school physics (Mechanics, Thermodynamics, Electromagnetism). It is less about complex calculations and more about understanding fundamental principles and formulas quickly.' }
];

export default function TolcDifficultyAnalysis() {
    const { getField } = usePageContent('tolc-difficulty-2026');
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
        <CmsPageWrapper slug="tolc-difficulty-2026">
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
                    title="TOLC Exam Difficulty Level 2026: Is it Harder than IMAT?"
                    description="A deep dive into the difficulty level of the TOLC exam (TOLC-I, TOLC-MED). Analysis of time pressure, logic trick questions, and the -0.25 negative marking penalty."
                    keywords="TOLC difficulty, is TOLC hard, TOLC vs IMAT difficulty, TOLC-I math difficulty, TOLC negative marking, how hard is TOLC"
                    schemas={[getBreadcrumbSchema([
                        { name: 'Home', item: '/' },
                        { name: 'TOLC Guide', item: '/tolc-exam-ultimate-guide-2026' },
                        { name: 'TOLC Difficulty Analysis', item: '/tolc-difficulty-analysis-2026' }
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
                                        <Activity size={12} className="text-indigo-600" />
                                        Comprehensive Difficulty Review
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                                        {getField('hero_headline', 'How Hard is the TOLC Exam?')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "The difficulty of the TOLC cannot be measured simply by looking at the syllabus. While the scientific concepts are standard high school level, the exam is engineered to be psychologically taxing. The true difficulty lies in three intersecting mechanics: severe time fragmentation, harsh negative marking (-0.25), and logic questions designed specifically to trigger cognitive biases. This analysis breaks down exactly where students lose points.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'math', label: 'Math', value: 'Hard', icon: TrendingUp },
                                            { key: 'english', label: 'English', value: 'Easy', icon: TrendingDown },
                                            { key: 'time', label: 'Time Limit', value: 'Brutal', icon: Clock },
                                            { key: 'overall', label: 'Negative Mark', value: 'Punishing', icon: Scale }
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

                                {/* Time Pressure */}
                                <section id="time-pressure" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Clock size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-3xl font-black mb-6 flex items-center gap-4">
                                                <Zap className="text-amber-400" />
                                                The Real Enemy: Segmented Time
                                            </h2>
                                            <p className="text-lg text-slate-300 leading-relaxed font-medium mb-8 max-w-3xl">
                                                The TOLC does not give you 100 minutes to manage however you want. It gives you, for example, exactly 20 minutes for Logic.
                                            </p>
                                            
                                            <div className="space-y-6">
                                                <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                                                    <h4 className="font-bold text-white mb-2">Why this breaks students:</h4>
                                                    <p className="text-sm text-slate-300 leading-relaxed">
                                                        If you are a math prodigy and finish the Math section 15 minutes early, <strong>you cannot use those 15 minutes for Biology.</strong> They disappear. Conversely, if you get stuck on a difficult Logic puzzle and the 20-minute timer hits zero, the section locks. You cannot go back to guess on the remaining questions.
                                                    </p>
                                                    <p className="text-sm text-slate-300 leading-relaxed mt-4">
                                                        This creates immense panic. Students often rush the final questions of a section to avoid being locked out, leading to careless errors and accumulating -0.25 penalties.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Subject Breakdown */}
                                <section id="subject-breakdown" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <BrainCircuit className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Subject-by-Subject Breakdown</h2>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Card className="p-6 border-slate-200 shadow-sm">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-bold text-slate-900 text-lg">Mathematics</h4>
                                                <span className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Hard</span>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                Especially in TOLC-I, the math is aggressive. It goes beyond basic algebra into trigonometry, logarithms, and introductory calculus. You are not allowed a calculator, meaning you must be exceptionally fast at mental arithmetic and algebraic manipulation.
                                            </p>
                                        </Card>

                                        <Card className="p-6 border-slate-200 shadow-sm">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-bold text-slate-900 text-lg">Logic & Reasoning</h4>
                                                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Tricky</span>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                These questions rarely require deep knowledge. Instead, they present convoluted scenarios designed to confuse you. You will face syllogisms, sequence spotting, and text-based deduction under severe time constraints.
                                            </p>
                                        </Card>

                                        <Card className="p-6 border-slate-200 shadow-sm">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-bold text-slate-900 text-lg">Biology & Chemistry</h4>
                                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Moderate</span>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                For TOLC-MED and TOLC-F, these sections are memory-heavy. They are generally straightforward—you either know the function of the mitochondria or you don't. The difficulty lies purely in the vast volume of the syllabus you must memorize.
                                            </p>
                                        </Card>

                                        <Card className="p-6 border-slate-200 shadow-sm">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-bold text-slate-900 text-lg">English Proficiency</h4>
                                                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Easy</span>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                The 30-question English section is a B1/B2 level assessment. More importantly, <strong>it has no negative marking</strong>. You can guess freely without penalty. It is highly unlikely to be the reason you fail the exam.
                                            </p>
                                        </Card>
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

                                <CTASection fieldKeyPrefix="tolc_difficulty_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}
