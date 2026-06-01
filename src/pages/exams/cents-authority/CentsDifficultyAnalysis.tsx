import React from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
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
    Sparkles,
    AlertCircle
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
import { getBreadcrumbSchema } from '@/utils/seo-schemas';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'difficulty-factors', label: 'Difficulty Factors' },
    { id: 'comparison', label: 'Comparison' },
    { id: 'strategy', label: 'Prep Strategy' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'Is the CENT-S harder than the SAT?', answer: 'The CENT-S Math section is generally considered more difficult than the SAT, as it covers advanced trigonometry and scientific principles not present in the SAT Math section.' },
    { question: 'What is the "pass rate" for the CENT-S?', answer: 'Since it is a ranking exam, there is no fixed pass rate. However, for top-tier Engineering programs, only students in the top 15-20% of the national ranking are typically admitted.' },
    { question: 'What is "Scientific Literacy" in the context of CENT-S?', answer: "This refers to your ability to read a scientific abstract or article and answer logical questions about its conclusions, methodology, or evidence." },
    { question: 'How much time do I have per question?', answer: 'You have approximately 2 minutes per question. While this seems generous, the complexity of the Math and Reading passages means you must manage your time aggressively.' },
    { question: 'Is the CENT-S harder in English or Italian?', answer: 'The difficulty level is calibrated to be identical. However, international students often find the Reading section challenging if they aren\'t comfortable with academic English vocabulary.' },
    { question: 'Which section should I study first?', answer: 'We recommend starting with Mathematics. It accounts for the largest portion of the score and requires the most long-term practice to master.' },
    { question: 'Does the difficulty of the CENT-S change by university?', answer: 'No, the exam is standardized by CISIA. However, the competition level changes based on how many high-scoring students apply to a specific university.' },
    { question: 'Is the online (Home-based) version easier?', answer: 'No. The exam content and time limits are exactly the same as the in-person version. Proctors monitor you via webcam and screen sharing.' },
    { question: 'What is the most common reason students fail to rank?', answer: 'Underestimating the Math section and failing to manage the negative marking penalty (-0.25) are the most common pitfalls.' },
    { question: 'How long does it take to prepare for the CENT-S?', answer: 'Most successful candidates spend 3-5 months of consistent study, focusing on mock exams and past paper simulations.' }
];

export default function CentsDifficultyAnalysis() {
    const { getField } = usePageContent('cent-s-difficulty-2026');
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
        <CmsPageWrapper slug="cent-s-difficulty-2026">
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
                    title="CENT-S Difficulty Analysis 2026: Challenge & Trends"
                    description="How hard is the CENT-S 2026? Expert analysis of section-by-section difficulty, time pressure, and how it compares to other entrance exams like IMAT and SAT."
                    keywords="cent-s difficulty 2026, is cent-s hard, cent-s vs sat, cent-s vs imat, study italy stem challenge"
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
                                        {getField('hero_headline', 'CENT-S 2026 Difficulty Analysis')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "Quantifying the challenge of the CENT-S is essential for building a study plan. We break down the technical difficulty and psychological factors of the exam.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'level', label: 'Difficulty', value: 'Moderate', icon: Target },
                                            { key: 'math', label: 'Math Bias', value: 'High', icon: Calculator },
                                            { key: 'time', label: 'Time Stress', value: 'High', icon: Activity },
                                            { key: 'status', label: 'Status', value: 'Verified', icon: CheckCircle2 }
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

                                {/* Difficulty Factors */}
                                <section id="difficulty-factors" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <BrainCircuit className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">What Makes the CENT-S Challenging?</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <EditableText fieldKey="diff_desc" multiline as="p" className="text-slate-600 font-medium leading-relaxed">
                                                {getField('diff_desc', "Unlike 'volume' tests, the CENT-S focuses on precision and the logical application of scientific principles. The challenge lies in the combination of advanced math and the aggressive penalty for incorrect answers.")}
                                            </EditableText>
                                            <div className="space-y-4">
                                                {[
                                                    { key: 'neg', label: 'Negative marking (-0.25) prevents blind guessing' },
                                                    { key: 'nocalc', label: 'No calculators permitted for complex physics' },
                                                    { key: 'log', label: 'Heavy emphasis on non-verbal and analytical logic' },
                                                    { key: 'norm', label: 'Normalization makes every point count relative to others' }
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
                                        <Card className="p-8 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                                <Zap size={150} />
                                            </div>
                                            <h4 className="text-indigo-400 font-black mb-4">The "Logic-First" Bias</h4>
                                            <p className="text-sm text-slate-300 font-medium leading-relaxed">
                                                The CENT-S is a "Logic-First" exam. Unlike the IMAT (Medicine) which is Biology-First, the CENT-S allocates over 54% of its score to Mathematics and Reasoning. Your strategy must prioritize these two sections to secure a seat at prestigious engineering or scientific faculties.
                                            </p>
                                        </Card>
                                    </div>
                                </section>

                                {/* Comparison Section */}
                                <section id="comparison" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-emerald-100 p-3 rounded-2xl">
                                            <Scale className="text-emerald-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Difficulty vs Other Exams</h2>
                                    </div>
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-900 text-white font-black text-xs uppercase tracking-widest">
                                                        <th className="p-6">Feature</th>
                                                        <th className="p-6">CENT-S</th>
                                                        <th className="p-6">SAT</th>
                                                        <th className="p-6">IMAT</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm font-medium text-slate-600">
                                                    {[
                                                        { feature: 'Math Level', cents: 'Calculus/Trig', sat: 'Alg 2/Stats', imat: 'Foundational' },
                                                        { feature: 'Penalty', cents: '-0.25 (Wrong)', sat: 'None', imat: '-0.4 (Wrong)' },
                                                        { feature: 'Focus', cents: 'STEM Logic', sat: 'General Aptitude', imat: 'Bio/Chem Recall' },
                                                        { feature: 'Time per Q', cents: '2.0 Min', sat: '1.2 Min', imat: '1.6 Min' }
                                                    ].map((row, i) => (
                                                        <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                                            <td className="p-6 font-black text-slate-900">{row.feature}</td>
                                                            <td className="p-6">{row.cents}</td>
                                                            <td className="p-6">{row.sat}</td>
                                                            <td className="p-6">{row.imat}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </section>

                                {/* Prep Strategy */}
                                <section id="strategy" className="scroll-mt-[120px]">
                                    <div className="bg-indigo-600 text-white rounded-3xl p-10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10"><TrendingUp size={180} /></div>
                                        <div className="relative z-10">
                                            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                                                <Target className="text-white" size={28} />
                                                Success Strategy
                                            </h2>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="p-6 bg-white/10 rounded-2xl border border-white/20">
                                                    <h4 className="font-black mb-2">Math Supremacy</h4>
                                                    <p className="text-sm opacity-80 leading-relaxed">Don't just memorize formulas. Practice identifying which formula to apply in complex, non-standard problems.</p>
                                                </div>
                                                <div className="p-6 bg-white/10 rounded-2xl border border-white/20">
                                                    <h4 className="font-black mb-2">Logic Discipline</h4>
                                                    <p className="text-sm opacity-80 leading-relaxed">Logic isn't innate; it's a skill. Solve 10 analytical reasoning problems every morning to build "cognitive speed".</p>
                                                </div>
                                            </div>
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

                                <CTASection fieldKeyPrefix="diff_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


