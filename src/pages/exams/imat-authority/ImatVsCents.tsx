import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    ArrowRightLeft,
    Zap,
    Scale,
    Sword,
    Target,
    Activity,
    BrainCircuit,
    ChevronRight,
    Search,
    Star,
    Grid,
    Globe,
    HelpCircle,
    ArrowRight,
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
import { getBreadcrumbSchema } from '@/utils/seo-schemas';
import PageNavigation from '@/components/exams/PageNavigation';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'differences', label: 'Key Differences' },
    { id: 'overlap', label: 'Syllabus Overlap' },
    { id: 'strategy', label: 'Dual Strategy' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'What is the main difference between IMAT and CEnT-S?', answer: 'The IMAT is for English-taught medical programs in Italy, while CEnT-S is a standardized entrance test for private or specific regional programs. The IMAT has a heavier focus on Critical Thinking and specific Ministerial syllabus' },
    { question: 'Is the syllabus for IMAT and CEnT-S the same?', answer: "There is about a 75-80% overlap in the Biology and Chemistry sections. However, CEnT-S often includes more 'Human Humanities' or specific regional knowledge depending on the institution." },
    { question: 'Which exam is more difficult?', answer: 'Generally, the IMAT is considered more competitive due to the limited seats for international students and the complexity of the logical reasoning section.' },
    { question: 'Can I prepare for both exams simultaneously?', answer: 'Yes! Because of the high syllabus overlap, studying for the IMAT provides a strong foundation for the CEnT-S. You only need to bridge the gap in specific section formats.' },
    { question: 'Are the exam dates the same?', answer: 'No. The IMAT is usually in September/October, whereas CEnT-S sessions can occur earlier in the spring or late summer depending on the provider.' },
    { question: 'Does CEnT-S have negative marking?', answer: 'Most CEnT-S versions have negative marking (typically -0.25 or -0.4), similar to the IMAT, to discourage guessing.' },
    { question: 'Which one should I prioritize?', answer: 'Priority should be based on your university preference. If you want a public Italian university (Milan, Rome, Pavia), prioritize IMAT. If you are targeting private ones, prioritize CEnT-S.' },
    { question: 'How is the scoring different?', answer: 'IMAT is scored out of 90 (60 questions × 1.5). CEnT-S scoring varies by institution but typically uses a similar weighted average system.' },
    { question: 'Can I use a calculator in either exam?', answer: 'No. Both the IMAT and CEnT-S are strictly no-calculator exams. Mental math and estimation are key skills.' },
    { question: 'Are mock tests for both available?', answer: 'Yes, we provide specialized simulators for both IMAT and CEnT-S that mimic the exact question distribution and timing of each.' }
];

export default function ImatVsCents() {
    const navigate = useNavigate();
    const { getField } = usePageContent('imat-vs-cents-comparison-2026');
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
        <CmsPageWrapper slug="imat-vs-cents-comparison-2026">
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
                    title="IMAT vs CEnT-S vs NEET 2026: Which is Easier? Full Comparison & Differences"
                    description="IMAT vs NEET vs CEnT-S compared: difficulty level, syllabus, passing scores, and strategy. Which Italian medical entrance exam should you take in 2026? Honest expert analysis."
                    keywords="imat vs neet, is imat easier than neet, is imat difficult than neet, imat vs cents 2026, imat vs cents exam, imat compared to neet, imat vs neet difficulty, imat vs neet syllabus, cent-s vs imat, which exam for italy medicine 2026"
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

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                                        {getField('hero_headline', 'IMAT vs CENT-S: The Comparison')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "Choosing the right entrance exam determines your university placement. We break down the structural and tactical differences for 2026.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'overlap', label: 'Overlap', value: '95%', icon: Target },
                                            { key: 'format', label: 'Format', value: 'Paper/Comp', icon: Activity },
                                            { key: 'seats', label: 'Seat Quota', value: 'Divergent', icon: Star },
                                            { key: 'acceptance', label: 'Schools', value: '15+ / 5+', icon: Globe }
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

                                {/* Direct Comparison Table */}
                                <section id="differences" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Scale className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Key Differences for 2026</h2>
                                    </div>
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-900 text-white font-black text-xs uppercase tracking-widest">
                                                        <th className="p-6">Feature</th>
                                                        <th className="p-6">IMAT (Public)</th>
                                                        <th className="p-6">CENT-S (Private/Specific)</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm font-medium text-slate-600">
                                                    {[
                                                        { feature: 'Authority', imat: 'Ministerial (MUR)', cents: 'CISIA Consortium' },
                                                        { feature: 'Exam Mode', imat: 'Paper-Based (In-Person)', cents: 'CBT (At Home or University)' },
                                                        { feature: 'Total Questions', imat: '60 Questions', cents: '55 Questions' },
                                                        { feature: 'Timing', imat: '100 Minutes', cents: '110 Minutes' },
                                                        { feature: 'Scoring', imat: '+1.5 Correct / -0.4 Wrong', cents: '+1 Correct / -0.25 Wrong' },
                                                        { feature: 'Max Score', imat: '90 Points', cents: '55 / Normalized Points' },
                                                        { feature: 'University Range', imat: 'All Italian Public Med Schools', cents: 'Specific Int. Bachelors (Engineering/Sciences)' }
                                                    ].map((row, i) => (
                                                        <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                                            <td className="p-6 font-black text-slate-900">{row.feature}</td>
                                                            <td className="p-6">{row.imat}</td>
                                                            <td className="p-6">{row.cents}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </section>

                                {/* Syllabus Overlap Detail */}
                                <section id="overlap" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-emerald-100 p-3 rounded-2xl">
                                            <Grid className="text-emerald-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Structural Syllabus Overlap</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <Card className="bg-indigo-600 text-white rounded-[3rem] p-8 border-0 shadow-xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                                <BrainCircuit size={140} />
                                            </div>
                                            <h3 className="text-2xl font-black mb-4">Core Science Overlap</h3>
                                            <p className="text-indigo-100 font-medium leading-relaxed mb-8">
                                                Preparation for IMAT covers roughly 95% of the Biology and Chemistry required for the CENT-S exam. Both follow the standard ministerial scientific protocols.
                                            </p>
                                            <div className="space-y-4">
                                                {[
                                                    { label: 'Biology', pct: '97%', color: 'bg-emerald-400' },
                                                    { label: 'Chemistry', pct: '95%', color: 'bg-amber-400' },
                                                    { label: 'Physics/Math', pct: '90%', color: 'bg-blue-400' }
                                                ].map((item, i) => (
                                                    <div key={i} className="space-y-2">
                                                        <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                                                            <span>{item.label}</span>
                                                            <span className="text-indigo-200">{item.pct}</span>
                                                        </div>
                                                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                            <div className={`h-full ${item.color}`} style={{ width: item.pct }}></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                        <div className="space-y-6">
                                            <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                                <h4 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                                                    <Target className="text-rose-500" size={20} />
                                                    The "Logic" Gap
                                                </h4>
                                                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                                                    While Sciences overlap perfectly, the **Reasoning** sections differ. IMAT focuses on Critical Thinking and Problem Solving (Cambridge style), whereas CENT-S focuses on **Logic on Data and Texts** (Scientific Literacy).
                                                </p>
                                            </div>
                                            <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
                                                <h4 className="text-xl font-black text-indigo-900 mb-4 flex items-center gap-2">
                                                    <Sparkles className="text-indigo-600" size={20} />
                                                    New for 2026: Health Modules
                                                </h4>
                                                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                                                    The IMAT remains focused on pure pre-medical sciences. Conversely, the CENT-S has integrated sections on **Health Citizenship**, testing your understanding of social responsibility in scientific contexts.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Universal Strategy (Dark) */}
                                <section className="scroll-mt-40">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Zap size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl font-black mb-8 flex items-center gap-4">
                                                <Star className="text-amber-500" />
                                                The Universal Strategy
                                            </h2>
                                            <p className="text-xl text-slate-300 leading-relaxed font-medium mb-12 max-w-3xl">
                                                The only difference is the Logic section style—IMAT uses BMAT/TSA style, whereas CENT-S is more aligned with the TOLC platform. <span className="text-indigo-400 font-black underline decoration-2 underline-offset-8">Do not study twice; study smarter.</span>
                                            </p>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                                                    <BrainCircuit size={32} className="text-indigo-400 mb-4" />
                                                    <h4 className="text-xl font-black mb-2">Logic Adaptation</h4>
                                                    <p className="text-sm text-slate-400 leading-relaxed">Swap your 15-minute daily practice between TSA puzzles and TOLC logic sets to cover both bases.</p>
                                                </div>
                                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                                                    <Scale size={32} className="text-emerald-400 mb-4" />
                                                    <h4 className="text-xl font-black mb-2">Resource Efficiency</h4>
                                                    <p className="text-sm text-slate-400 leading-relaxed">A-Level/IB textbooks are sufficient for both exams. Do not buy separate "ENTRANCE" specific books for science.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Dual Sitting Strategy (Emerald) */}
                                <section id="strategy" className="scroll-mt-40">
                                    <div className="bg-emerald-600 text-white rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-emerald-200 relative overflow-hidden group">
                                        <div className="absolute -bottom-10 -left-10 p-20 opacity-10 group-hover:scale-110 transition-transform">
                                            <Sword size={250} />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="bg-white text-emerald-600 p-4 rounded-2xl shadow-xl">
                                                    <Zap size={28} />
                                                </div>
                                                <h2 className="text-3xl font-black leading-tight italic">
                                                    The Dual Sitting Strategy
                                                </h2>
                                            </div>
                                            <p className="text-lg md:text-xl font-bold text-emerald-50 leading-relaxed mb-8 bg-emerald-700/30 p-8 rounded-3xl border border-emerald-500/50">
                                                This is a tactic where students apply for both exams. If they fail to get a seat in the highly competitive public IMAT ranking, they have a fallback option with their CENT-S result. Because the science is identical, the marginal effort for the second exam is near zero.
                                            </p>
                                            <Button className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-full px-8 py-6 h-auto font-black text-lg gap-2 shadow-xl shrink-0 group">
                                                Master the Strategy <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                            </Button>
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

                                <CTASection fieldKeyPrefix="imat_vs_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


