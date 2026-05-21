import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Activity,
    BarChart3,
    BrainCircuit,
    ChevronRight,
    HelpCircle,
    Target,
    Zap,
    Scale,
    TrendingUp,
    CheckCircle2,
    Grid,
    PieChart,
    AlertCircle,
    Search,
    Star,
    Globe,
    Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import FAQSchema from '@/components/seo/FAQSchema';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import { imatLinks } from '@/lib/nav-links';
import PageNavigation from '@/components/exams/PageNavigation';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'difficulty', label: 'Difficulty Levels' },
    { id: 'balancing', label: 'Balancing Speed' },
    { id: 'historical', label: 'Historical Data' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'Is the IMAT getting harder every year?', answer: 'The technical syllabus has remained consistent, but the "competition density" has increased. More candidates are scoring high, which pushes the cutoffs up even if the raw difficulty is stable.' },
    { question: 'Which is the hardest section of the IMAT?', answer: 'For most students, Section 1 (Logic) is the hardest because it cannot be "memorized." For scientific sections, Organic Chemistry and Advanced Genetics are typically the high-difficulty markers.' },
    { question: 'What makes Section 1 so difficult?', answer: "Section 1 doesn't test knowledge; it tests cognitive speed and verbal logic. Questions are often phrased as traps, and the 100-minute time limit makes it the ultimate 'eliminator' section." },
    { question: 'Is the IMAT harder than the BMAT?', answer: "They are similar in style, but students often perceive IMAT as harder because of the 'negative marking' (-0.4 points) which doesn't exist in BMAT." },
    { question: 'How much time should I spend per question?', answer: 'On average, you have 1.6 minutes per question. However, you should aim to solve Biology/Chemistry in under 1 minute each to save time for complex Logic and Math problems.' },
    { question: 'Can a non-science student pass the IMAT?', answer: 'Yes, but it requires a very rigorous 6-9 month prep cycle to bridge the gap in Biology and Chemistry. The logic section might actually be an advantage for humanities students.' },
    { question: 'What is the "Negative Marking" impact?', answer: 'The penalty for wrong answers (-0.4) is aggressive. It turns the IMAT into a strategic game where knowing when NOT to answer is as important as knowing the right answer.' },
    { question: 'How does the IMAT difficulty compare to NEET?', answer: 'NEET is a test of massive volume and speed. IMAT is a test of logic and precision. The syllabus for IMAT is smaller than NEET, but the questions require deeper application.' },
    { question: 'What is the "Difficulty Curve" of the paper?', answer: 'The MUR typically distributes difficulty: 25% easy, 50% moderate, and 25% high-difficulty. Your goal is to secure 100% of the easy/moderate points.' },
    { question: 'Does the test center location affect difficulty?', answer: 'No. Every candidate globally sits the exact same paper at the same time. The difficulty is standardized across all centers.' }
];

export default function ImatDifficultyAnalysis() {
    const navigate = useNavigate();
    const { getField } = usePageContent('imat-exam-difficulty-2026');
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

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
        }
    };

    return (
        <CmsPageWrapper slug="imat-exam-difficulty-2026">
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
                    title="IMAT Difficulty Analysis 2026: Success Rates & Trend Data"
                    description="How hard is the IMAT 2026? Professional analysis of exam difficulty, historical scoring trends, section-by-section challenges, and competitive success rates."
                    keywords="IMAT difficulty level, is IMAT hard, IMAT success rate 2026, IMAT vs NEET difficulty, IMAT exam challenge analysis"
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
                                        {getField('hero_headline', 'IMAT 2026 Difficulty Analysis')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "Quantifying the challenge of the IMAT is essential for setting a realistic study timeline. We analyze the variables that determine exam difficulty.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'level', label: 'Challenge', value: 'High', icon: Target },
                                            { key: 'pass', label: 'Success Rate', value: '18.5%', icon: BarChart3 },
                                            { key: 'time', label: 'Time Stress', value: 'Extreme', icon: Activity },
                                            { key: 'logic', label: 'Logic Bias', value: '70%+', icon: BrainCircuit }
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

                                {/* Difficulty Analysis */}
                                <section id="difficulty" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <TrendingUp className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Measuring the Difficulty Curve</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <EditableText fieldKey="difficulty_desc" multiline as="p" className="text-slate-600 font-medium leading-relaxed">
                                                {getField('difficulty_desc', "The difficulty of the IMAT isn't just in the questions themselves, but in the environment: 100 minutes for 60 high-level questions with aggressive negative marking. This creates a psychological barrier that many students fail to cross.")}
                                            </EditableText>
                                            <div className="space-y-4">
                                                {[
                                                    { key: 'logic', label: 'Abstract and Verbal Reasoning challenges' },
                                                    { key: 'chem', label: 'Complex stoichiometry without calculators' },
                                                    { key: 'bio', label: 'Advanced molecular genetics and systems' },
                                                    { key: 'speed', label: 'Critical time pressure (1.6 min / question)' }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                        <CheckCircle2 size={16} className="text-indigo-500" />
                                                        <EditableText fieldKey={`diff_item_${item.key}`} as="span">
                                                            {getField(`diff_item_${item.key}`, item.label)}
                                                        </EditableText>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <Card className="p-8 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden group border-0 shadow-2xl">
                                            <div className="absolute top-0 right-0 p-8 opacity-[0.1] group-hover:scale-110 transition-transform">
                                                <Scale size={150} />
                                            </div>
                                            <h4 className="text-indigo-400 font-black mb-4">The "Eliminator" Section</h4>
                                            <p className="text-sm text-slate-300 font-medium leading-relaxed">
                                                Section 1 (Critical Thinking) is designed to be the primary eliminator. It tests your ability to stay calm and logical under extreme fatigue and time pressure.
                                            </p>
                                        </Card>
                                    </div>
                                </section>

                                {/* Balancing Speed */}
                                <section id="balancing" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-emerald-100 p-3 rounded-2xl">
                                            <PieChart className="text-emerald-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Balancing Speed vs Accuracy</h2>
                                    </div>
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12 relative overflow-hidden">
                                        <div className="grid md:grid-cols-2 gap-12 relative z-10">
                                            <div className="space-y-6">
                                                <h3 className="text-xl font-black text-slate-900">The 1.6 Minute Rule</h3>
                                                <p className="text-slate-600 font-medium leading-relaxed">
                                                    Managing your "time budget" is the difference between a 40 and a 60. You must solve the Biology and General Knowledge sections fast enough to "buy" time for the Physics and Logic problems that require deeper processing.
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                                <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                                                    <Zap className="text-amber-500" size={18} />
                                                    Efficiency Hack
                                                </h4>
                                                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                                    Use the "Two-Pass" system: Complete all Easy/Moderate questions in the first 60 minutes. Use the remaining 40 minutes only for high-difficulty problems where you've already eliminated 2+ answers.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Historical Trends (Dark) */}
                                <section id="historical" className="scroll-mt-40">
                                    <div className="bg-indigo-600 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <BarChart3 size={200} />
                                        </div>
                                        <div className="relative z-10 text-center max-w-3xl mx-auto">
                                            <h2 className="text-4xl font-black mb-8">Success Rate Data</h2>
                                            <p className="text-xl text-indigo-100 leading-relaxed font-medium mb-12">
                                                Over the last 5 years, the number of applicants has grown by 40%, while seats have only increased by 15%. This creates a "Difficulty Compression" effect where the margin for error is shrinking.
                                            </p>
                                            <div className="grid md:grid-cols-3 gap-8">
                                                <div className="p-6 bg-white/10 rounded-3xl border border-white/20">
                                                    <div className="text-3xl font-black mb-1">~22,000</div>
                                                    <div className="text-xs font-bold uppercase tracking-widest opacity-70">Total Applicants</div>
                                                </div>
                                                <div className="p-6 bg-white/10 rounded-3xl border border-white/20">
                                                    <div className="text-3xl font-black mb-1">~1,500</div>
                                                    <div className="text-xs font-bold uppercase tracking-widest opacity-70">Non-EU Seats</div>
                                                </div>
                                                <div className="p-6 bg-white/10 rounded-3xl border border-white/20">
                                                    <div className="text-3xl font-black mb-1">~850</div>
                                                    <div className="text-xs font-bold uppercase tracking-widest opacity-70">EU English Seats</div>
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

                                <CTASection fieldKeyPrefix="difficulty_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


