import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import {
    CalendarDays,
    CheckCircle2,
    BookOpen,
    BrainCircuit,
    Clock,
    Target,
    ChevronRight,
    HelpCircle,
    Activity,
    LineChart
} from 'lucide-react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
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
    { id: 'overview', label: 'The 90-Day Approach' },
    { id: 'month-1', label: 'Month 1: Foundation' },
    { id: 'month-2', label: 'Month 2: CBT Training' },
    { id: 'month-3', label: 'Month 3: Optimization' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'Is 90 days enough time to prepare for the TOLC?', answer: 'Yes, 90 days of focused, consistent study (about 2-3 hours per day) is generally the sweet spot for the TOLC. It is long enough to cover the syllabus, but short enough to prevent burnout.' },
    { question: 'Should I study differently for TOLC-I versus TOLC-MED?', answer: 'Yes. For TOLC-I, your primary focus should be advanced math (trigonometry, calculus) and logic. For TOLC-MED, you must spend a vast majority of your time memorizing complex biological and chemical pathways.' },
    { question: 'How many mock tests should I take?', answer: 'We recommend at least 8-10 full-length, timed mock tests. Take one at the very beginning (diagnostic), a few during month 2, and 1-2 per week in the final month.' },
    { question: 'I am weak at Math. Can I still pass the TOLC-I?', answer: 'It will be difficult, but possible. You must compensate by scoring nearly perfect in Logic and Sciences. However, since Math is 20 out of 50 questions, you cannot abandon it entirely; focus on the high-yield, easier algebra questions first.' },
    { question: 'Should I study for the English section?', answer: 'Unless your English is completely non-existent, no. It is basic reading comprehension without negative marking. Your time is infinitely better spent studying the core scientific subjects.' },
    { question: 'What is the best way to practice Logic?', answer: 'Logic cannot be memorized. The only way to improve is by doing hundreds of practice questions (Quizzari) and thoroughly reading the explanations when you get them wrong to understand the underlying pattern.' },
    { question: 'How do I handle the -0.25 penalty during the exam?', answer: 'Develop a strict triage system. If you know it, answer it. If you can eliminate two wrong answers, guess. If you have absolutely no idea, leave it blank. Never blind guess.' },
    { question: 'Can I use a calculator during my prep?', answer: 'Absolutely not. You will not have one during the real exam. You must train your brain to do fast mental arithmetic and complex multiplication on scratch paper.' }
];

export default function TolcPrepStrategy() {
    const { getField } = usePageContent('tolc-prep-strategy-2026');
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
        <CmsPageWrapper slug="tolc-prep-strategy-2026">
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
                    title="TOLC Exam Preparation Strategy 2026: 90-Day Study Plan"
                    description="A step-by-step 90-day study plan to crush the TOLC exam. Learn how to manage the strict CBT timers, avoid negative marking, and study for TOLC-I and TOLC-MED."
                    keywords="TOLC preparation, how to pass TOLC, TOLC study plan, TOLC-I study strategy, TOLC-MED preparation 90 days, CISIA CBT training"
                    schemas={[getBreadcrumbSchema([
                        { name: 'Home', item: '/' },
                        { name: 'TOLC Guide', item: '/tolc-exam-ultimate-guide-2026' },
                        { name: 'TOLC Prep Strategy', item: '/tolc-preparation-strategy-2026' }
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
                                        <CalendarDays size={12} className="text-indigo-600" />
                                        The 90-Day Masterplan
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                                        {getField('hero_headline', 'TOLC 90-Day Preparation Strategy')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "You cannot cram for the TOLC. The exam tests logic, speed, and deep scientific foundations under severe time pressure. Reading a biology textbook a week before the exam will result in a disastrous score due to the negative marking penalty. You need a structured, mechanical approach that trains you for the specific environment of a Computer-Based Test (CBT). This is our proven 3-month blueprint.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'duration', label: 'Timeline', value: '3 Months', icon: CalendarDays },
                                            { key: 'hours', label: 'Daily Study', value: '2-3 Hrs', icon: Clock },
                                            { key: 'method', label: 'Focus', value: 'CBT Drills', icon: Target },
                                            { key: 'goal', label: 'End Goal', value: '35+ Score', icon: LineChart }
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

                                {/* Month 1 */}
                                <section id="month-1" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <BookOpen className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Month 1: Foundation Building</h2>
                                    </div>
                                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                                        <h3 className="text-xl font-bold text-slate-900 mb-4">The "No-Timer" Phase</h3>
                                        <p className="text-slate-600 leading-relaxed mb-6">
                                            During the first 30 days, entirely ignore the clock. Your only goal is to understand the core concepts dictated by the CISIA syllabus. If you are taking TOLC-I, this means re-learning high school trigonometry and algebra from scratch.
                                        </p>
                                        <ul className="space-y-4 text-sm text-slate-700">
                                            <li className="flex items-start gap-3">
                                                <CheckCircle2 size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                                                <span><strong>Take a Diagnostic Mock:</strong> On Day 1, take a full CBT mock test. You will likely fail miserably. This is normal. It establishes your baseline and identifies your weakest subjects.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <CheckCircle2 size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                                                <span><strong>Syllabus Mapping:</strong> Print the official CISIA syllabus. Highlight what you know and aggressively study what you don't. Do not waste time re-reading what you already mastered in high school.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <CheckCircle2 size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                                                <span><strong>Active Recall:</strong> Instead of passively reading textbooks, use flashcards (Anki) for biology terms or chemistry formulas.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Month 2 */}
                                <section id="month-2" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-amber-100 p-3 rounded-2xl">
                                            <BrainCircuit className="text-amber-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Month 2: CBT Acclimation</h2>
                                    </div>
                                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                                        <h3 className="text-xl font-bold text-slate-900 mb-4">The "Digital Transition" Phase</h3>
                                        <p className="text-slate-600 leading-relaxed mb-6">
                                            Now that you know the theory, you must learn how to apply it digitally. The TOLC is taken on a screen, which causes severe eye fatigue and makes reading long logic puzzles difficult.
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                                <h4 className="font-bold text-slate-900 mb-2">Screen Reading</h4>
                                                <p className="text-xs text-slate-600 leading-relaxed">Stop using physical books for practice questions. You must train your eyes to read complex biological texts and logic puzzles directly on a computer monitor without a physical highlighter.</p>
                                            </div>
                                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                                <h4 className="font-bold text-slate-900 mb-2">Scratch Paper Mastery</h4>
                                                <p className="text-xs text-slate-600 leading-relaxed">You will be given blank paper during the exam. Practice looking at a math problem on the screen and accurately copying only the necessary variables onto your paper to solve it quickly.</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-bold text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-100">
                                            Start introducing timers during your practice sessions. If a section gives you 20 minutes for 10 questions, force yourself to finish in 18 minutes.
                                        </p>
                                    </div>
                                </section>

                                {/* Month 3 */}
                                <section id="month-3" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Activity size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-3xl font-black mb-6 flex items-center gap-4">
                                                <Activity className="text-emerald-400" />
                                                Month 3: Tactical Optimization
                                            </h2>
                                            <p className="text-lg text-slate-300 leading-relaxed font-medium mb-8 max-w-2xl">
                                                The final 30 days are purely about exam mechanics, managing the -0.25 penalty, and surviving the strict segmented countdown timers.
                                            </p>
                                            
                                            <ul className="space-y-6">
                                                <li className="flex gap-4">
                                                    <div className="bg-emerald-400/20 p-3 rounded-xl shrink-0 h-12 flex items-center justify-center">
                                                        <Target className="text-emerald-400" size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-lg mb-1">The Art of Skipping</h4>
                                                        <p className="text-sm text-slate-300 leading-relaxed">If you look at a Logic question and do not immediately know the path to the solution within 15 seconds, skip it. Do not let one hard question drain 5 minutes from your 20-minute section timer.</p>
                                                    </div>
                                                </li>
                                                <li className="flex gap-4">
                                                    <div className="bg-emerald-400/20 p-3 rounded-xl shrink-0 h-12 flex items-center justify-center">
                                                        <LineChart className="text-emerald-400" size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-lg mb-1">Mock Analysis Protocol</h4>
                                                        <p className="text-sm text-slate-300 leading-relaxed">Take 2 full CBT mock tests a week. Spend 2 hours taking the test, and <strong>3 hours reviewing it</strong>. Analyze every wrong answer. Did you lack knowledge, or were you rushed by the timer? Adjust accordingly.</p>
                                                    </div>
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

                                <CTASection fieldKeyPrefix="tolc_strategy_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}
