import React from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import {
    Zap,
    Clock,
    Trophy,
    Target,
    BarChart3,
    Calendar,
    ChevronRight,
    Sparkles,
    BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FAQSchema from '@/components/seo/FAQSchema';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import PageNavigation from '@/components/exams/PageNavigation';
import { centsLinks } from '@/lib/nav-links';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'phases', label: 'Study Phases' },
    { id: 'subjects', label: 'Subject Strategy' },
    { id: 'mocks', label: 'Mock Strategy' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'How long does it take to prepare for CENT-S?', answer: 'For a strong STEM student, 3-4 months of dedicated study (10-15 hours/week) is sufficient. Students from non-STEM backgrounds may need 6 months to master the Mathematics section.' },
    { question: 'What is the most important section in CENT-S?', answer: 'Statistically, Mathematics and Reasoning are the most "weighty" sections, accounting for 30 questions out of 55. We recommend starting with these.' },
    { question: 'Should I use a calculator for CENT-S prep?', answer: 'Official CISIA rules specify no calculators. You should practice mental math and manual calculations for all scientific sections.' },
    { question: 'How do I improve my speed for the Reasoning section?', answer: 'Read scientific journals (like Nature or Scientific American) in English. Focus on identifying the main argument and underlying data quickly.' },
    { question: 'Is a prep course necessary for CENT-S?', answer: 'While self-study is possible with the right resources, a structured course helps you focus on high-yield topics and provides a competitive community.' },
    { question: 'What is the "smart skipping" strategy?', answer: 'Since wrong answers deduct 0.25, you should skip questions if you cannot eliminate at least two options. Blind guessing will likely lower your normalized score.' },
    { question: 'Which books are best for the CENT-S science core?', answer: 'Cambridge A-Level Biology and Chemistry books are excellent because they align with the level of technical English used in the exam.' },
    { question: 'How many mocks should I take?', answer: 'Aim for at least 15-20 full-length mocks. The key is analyzing every error to prevent repeating it on exam day.' },
    { question: 'Can I study for IMAT and CENT-S together?', answer: 'Yes! About 80% of the Biology and Chemistry syllabus overlaps. However, CENT-S requires much deeper focus on advanced Mathematics.' },
    { question: 'When should I start taking full-length mocks?', answer: 'Start full mocks about 2 months before your test date, after you have completed at least 70% of the theoretical syllabus review.' }
];

const strategySteps = [
    {
        phase: 'Phase 1: Foundation (5–4 Months Before)',
        focus: 'Mathematics & Reasoning Mastery — 60% Focus',
        detail: 'CENT-S is logic-heavy. Start with algebraic functions, probability, and complex data interpretation. Use GMAT or scientific reasoning resources to build a solid foundation in analyzing text and data in English.'
    },
    {
        phase: 'Phase 2: Scientific Core (3–2 Months Before)',
        focus: 'Biology & Chemistry — 40% Focus',
        detail: 'Master the scientific core: cell biology, bioenergetics, and inorganic bonds. Focus on conceptual understanding rather than the medical-specific anatomy found in IMAT preparation.'
    },
    {
        phase: 'Phase 3: Simulation (Final 60 Days)',
        focus: 'Full-Length 110-Min Mocks — 100% Practice',
        detail: "Simulate the 110-minute pressure. Complete one full mock every 3 days. Focus on the +1/-0.25 scoring strategy—learn to skip questions where you can't eliminate two options."
    }
];

export default function CentsPrepStrategy() {
    const { getField } = usePageContent('cent-s-preparation-strategy-2026');
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
        <CmsPageWrapper slug="cent-s-preparation-strategy-2026">
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
                    title="CENT-S Preparation Strategy 2026 – STEM Success Roadmap"
                    description="The complete CENT-S (CISIA English Test – Science) 2026 preparation strategy. 3-phase study plan covering Math, Reasoning, and Sciences with timing and subject priorities."
                    keywords="CENT-S preparation 2026, CISIA English Test prep, study plan scientific programs Italy, CENT-S strategy"
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
                                        {getField('hero_headline', 'CENT-S 2026 Preparation Strategy')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" as="p" className="text-xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', 'The CEnT-S rewards conceptual understanding over rote learning. This 3-phase roadmap turns a 6-month preparation window into a structured path to a rank-competitive score.')}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Recommended Prep', value: '300–400 Hrs', icon: Clock },
                                            { label: 'Daily Questions', value: '40–60 Qs', icon: Target },
                                            { label: 'Score Target', value: '42+ / 55', icon: Trophy },
                                            { label: 'Intensity', value: 'High', icon: Zap }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-indigo-200 transition-colors">
                                                <item.icon className="text-indigo-600 mb-2 group-hover:scale-110 transition-transform" size={22} />
                                                <div className="text-lg font-black text-slate-900">{item.value}</div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Phases */}
                                <section id="phases" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Calendar className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">3-Phase Preparation Roadmap</h2>
                                    </div>
                                    <div className="space-y-5">
                                        {strategySteps.map((step, i) => (
                                            <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="text-5xl font-black text-slate-100 leading-none shrink-0">0{i + 1}</div>
                                                    <div>
                                                        <div className="font-black text-slate-900 text-lg mb-1">{step.phase}</div>
                                                        <div className="text-xs font-black text-indigo-600 uppercase tracking-widest">{step.focus}</div>
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 font-medium leading-relaxed pl-16">{step.detail}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Subject Strategy */}
                                <section id="subjects" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="bg-emerald-100 p-3 rounded-2xl">
                                            <BookOpen className="text-emerald-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Subject-Wise Preparation Priorities</h2>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { sub: 'Mathematics', priority: 'Highest', detail: '15 Questions. The foundation of the exam. Focus on functions, geometry, and algebra.', color: 'border-l-indigo-500 bg-indigo-50/30' },
                                            { sub: 'Reasoning', priority: 'Highest', detail: '15 Questions. Requires high English proficiency and critical thinking skills. Data interpretation is key.', color: 'border-l-emerald-500 bg-emerald-50/30' },
                                            { sub: 'Biology', priority: 'High', detail: '10 Questions. Focus on cell biochemistry and genetics. Less anatomy, more conceptual science.', color: 'border-l-blue-500 bg-blue-50/30' },
                                            { sub: 'Chemistry', priority: 'High', detail: '10 Questions. Focus on periodic trends, bonding, and concentration calculations.', color: 'border-l-rose-500 bg-rose-50/30' },
                                            { sub: 'Physics', priority: 'Strategic', detail: '5 Questions. High difficulty but low question count. Study mechanics and basic circuits.', color: 'border-l-amber-500 bg-amber-50/30' },
                                        ].map((item, i) => (
                                            <div key={i} className={`p-5 rounded-2xl border-l-4 ${item.color} flex gap-4`}>
                                                <div className="min-w-[130px]">
                                                    <div className="font-black text-slate-900">{item.sub}</div>
                                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mt-0.5">{item.priority} Priority</div>
                                                </div>
                                                <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.detail}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Mock Strategy */}
                                <section id="mocks" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-3xl p-10">
                                        <h2 className="text-3xl font-black mb-5 flex items-center gap-4">
                                            <BarChart3 className="text-indigo-400" size={28} />
                                            Mock Test Cadence
                                        </h2>
                                        <p className="text-slate-300 font-medium leading-relaxed mb-6">
                                            In the final 60 days before the CENT-S, sit a full-length 110-minute mock every 3–4 days. After each mock, spend at least 1 hour reviewing errors. Pay special attention to the "Reasoning" section to improve textual analysis speed.
                                        </p>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            {[
                                                { title: 'Phase 1–2', sub: 'Topic quizzes only', desc: 'No full mocks' },
                                                { title: 'Final 60 Days', sub: 'Every 3–4 days', desc: 'Full 60Q mocks' },
                                                { title: 'Final 2 Weeks', sub: 'Revision only', desc: 'Pacing + review' }
                                            ].map((item, i) => (
                                                <div key={i} className="bg-white/10 border border-white/20 p-5 rounded-2xl text-center">
                                                    <div className="font-black text-white">{item.title}</div>
                                                    <div className="text-indigo-300 font-bold text-sm mt-1">{item.sub}</div>
                                                    <div className="text-slate-400 text-xs mt-1">{item.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* FAQs */}
                                <section id="faqs" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-12">
                                        <div className="bg-slate-200 p-3 rounded-2xl">
                                            <Zap className="text-slate-600" size={32} />
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

                                {/* Cluster Links */}
                                <section className="pt-12 border-t border-slate-200">
                                    <h3 className="text-2xl font-black text-slate-900 mb-8">Explore the Full CEnT-S Cluster 📚</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {centsLinks.map((link, i) => (
                                            <Link key={i} to={link.path} className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-600 transition-colors flex items-center justify-between">
                                                <span className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors text-sm">{link.label}</span>
                                                <ChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" size={18} />
                                            </Link>
                                        ))}
                                    </div>
                                </section>

                                <CTASection fieldKeyPrefix="prep_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


