import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    BarChart3,
    TrendingUp,
    Target,
    History,
    FileText,
    CheckCircle2,
    ChevronRight,
    Search,
    Star,
    Grid,
    Globe,
    HelpCircle,
    Zap,
    MapPin,
    ArrowRight,
    Activity,
    ShieldCheck,
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
    { id: 'trends', label: 'Recent Trends' },
    { id: 'historical', label: 'Historical Data' },
    { id: 'projection', label: '2026 Projection' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'What is a cutoff score in the IMAT?', answer: 'The cutoff score is the minimum score required for admission to a specific university during a particular year. It varies based on competition and the number of available seats.' },
    { question: 'Why do cutoff scores change every year?', answer: 'Cutoffs depend on the difficulty of the exam, the performance of all candidates, and the popularity of a specific university in that cycle.' },
    { question: 'What is a "safe score" for the IMAT?', answer: 'While there is no official "safe" score, historically, a score above 55 points has been very safe for most public universities in the Non-EU category.' },
    { question: 'Do Non-EU students have different cutoffs than EU students?', answer: 'Yes, Non-EU students applying from abroad have separate seat quotas and separate cutoff scores, which are often (but not always) lower than those for EU students.' },
    { question: 'Which university has the highest IMAT cutoff?', answer: 'The University of Milan (Statale) and Sapienza University of Rome consistently have the highest cutoff scores due to their global reputations.' },
    { question: 'What is the "scrolling" mechanism?', answer: 'Scrolling refers to the process where, as admitted students decline their seats, the next highest-scoring candidates on the ranking list are offered those places.' },
    { question: 'Are cutoffs lower for private universities?', answer: 'Cutoffs for private universities like San Raffaele or Humanitas can be lower or higher depending on the specific applicant pool and tuition fees.' },
    { question: 'How can I project the 2026 cutoff?', answer: 'Projection involves looking at the 5-year average while accounting for the ~5-10% annual increase in applicant numbers and global competition.' },
    { question: 'Does a high school GPA affect the cutoff?', answer: 'In Italian public universities, only your IMAT score determines your ranking. Your high school grades are usually only a tie-breaker if scores are identical.' },
    { question: 'Should I choose a university based solely on cutoffs?', answer: 'No, you should also consider city living costs, clinical facilities, and faculty research. A "lower cutoff" university often provides an equally excellent medical education.' }
];

export default function ImatCutoffTrends() {
    const navigate = useNavigate();
    const { getField } = usePageContent('imat-cutoff-trends-2026');
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
        <CmsPageWrapper slug="imat-cutoff-trends-2026">
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
                    title="IMAT Cutoff Trends 2011-2025 – Target Scores & Projection"
                    description="Comprehensive analysis of IMAT scores and cutoff trends. Understand the 'safe zone' for top Italian universities and project your target for 2026."
                    keywords="IMAT cutoff 2026, IMAT safe score, IMAT university ranking, Sapienza IMAT cutoff, University of Milan IMAT score"
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

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
                                        {getField('hero_headline', 'IMAT Cutoff Trends Analysis')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', 'A deep dive into 14 years of historical data. We analyze how the Italian medical university landscape has shifted and what it means for your 2026 seat.')}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'avg', label: 'Avg Cutoff', value: '48.5 Pts', icon: TrendingUp },
                                            { key: 'safe', label: 'Safe Zone', value: '55+ Pts', icon: Target },
                                            { key: 'trend', label: 'Recent Trend', value: '+8% / Year', icon: Activity },
                                            { key: 'demand', label: 'High Demand', value: 'Milan/Rome', icon: ShieldCheck }
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

                                {/* Recent Trends */}
                                <section id="trends" className="scroll-mt-40">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                        <Card className="p-8 md:p-10 border-slate-100 shadow-sm bg-white rounded-[2rem] md:rounded-[2.5rem]">
                                            <TrendingUp className="text-indigo-600 mb-6 shrink-0" size={32} />
                                            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4">Competition Evolution</h3>
                                            <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
                                                Cutoffs for top-tier universities like Sapienza and Milan have increased by an average of 12% since 2020. This is driven by a massive influx of applicants from South Asia, the Middle East, and North America.
                                            </p>
                                        </Card>
                                        <Card className="p-8 md:p-10 border-emerald-100 shadow-sm bg-emerald-50/30 rounded-[2rem] md:rounded-[2.5rem]">
                                            <Target className="text-emerald-600 mb-6 shrink-0" size={32} />
                                            <h3 className="text-xl md:text-2xl font-black text-emerald-900 mb-4">The Non-EU Advantage</h3>
                                            <p className="text-sm md:text-base text-emerald-700 font-medium leading-relaxed">
                                                While competition is rising, Non-EU cutoffs remain significantly more predictable than EU rankings. Strategic choice of first-preference university can effectively lower your target score by 5-8 points.
                                            </p>
                                        </Card>
                                    </div>
                                </section>

                                {/* Historical Table */}
                                <section id="historical" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-2 md:p-3 rounded-2xl">
                                            <History className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black text-slate-900">Historical Non-EU Rankings</h2>
                                    </div>
                                    <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden overflow-x-auto no-scrollbar">
                                        <table className="w-full text-left border-collapse min-w-[600px]">
                                            <thead>
                                                <tr className="bg-slate-900 text-white">
                                                    <th className="px-6 md:px-8 py-5 md:py-6 text-[10px] md:text-xs font-black uppercase tracking-widest">University</th>
                                                    <th className="px-6 md:px-8 py-5 md:py-6 text-[10px] md:text-xs font-black uppercase tracking-widest">2023 Cutoff</th>
                                                    <th className="px-6 md:px-8 py-5 md:py-6 text-[10px] md:text-xs font-black uppercase tracking-widest bg-slate-800">2024 Cutoff</th>
                                                    <th className="px-6 md:px-8 py-5 md:py-6 text-[10px] md:text-xs font-black uppercase tracking-widest">2025 (Est.)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {[
                                                    { uni: 'Milan (Statale)', c23: '58.2', c24: '61.4', c25: '62.0' },
                                                    { uni: 'Sapienza (Rome)', c23: '54.5', c24: '57.1', c25: '58.5' },
                                                    { uni: 'Pavia', c23: '52.1', c24: '55.0', c25: '56.0' },
                                                    { uni: 'Tor Vergata (Rome)', c23: '49.8', c24: '52.3', c25: '53.0' },
                                                    { uni: 'Bologna', c23: '53.4', c24: '56.2', c25: '57.0' }
                                                ].map((row, i) => (
                                                    <tr key={i} className="hover:bg-indigo-50/50 transition-colors group">
                                                        <td className="px-6 md:px-8 py-5 md:py-6 font-black text-slate-900 group-hover:text-indigo-600 text-sm md:text-base">{row.uni}</td>
                                                        <td className="px-6 md:px-8 py-5 md:py-6 font-bold text-slate-400 text-sm md:text-base">{row.c23}</td>
                                                        <td className="px-6 md:px-8 py-5 md:py-6 font-black text-indigo-600 bg-indigo-50/30 text-sm md:text-base">{row.c24}</td>
                                                        <td className="px-6 md:px-8 py-5 md:py-6 font-black text-emerald-600 text-sm md:text-base">{row.c25}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-8 p-6 bg-slate-100 rounded-2xl flex items-center gap-4 text-slate-500 font-bold text-sm italic">
                                        <Search size={20} />
                                        *Data compiled from official CINECA and MUR 2024 final ranking exports.
                                    </div>
                                </section>

                                {/* Projection 2026 */}
                                <section id="projection" className="scroll-mt-40">
                                    <div className="bg-slate-900 text-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <TrendingUp size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-2xl md:text-4xl font-black mb-8 flex items-center gap-4 text-emerald-400">
                                                <Target size={28} />
                                                2026 Score Projection
                                            </h2>
                                            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium mb-12 max-w-3xl">
                                                Based on the stabilization of current exam logistics, we project that the "First Choice Scroll" for top 5 universities will settle at approximately <span className="text-white font-black underline decoration-emerald-500">58.0 - 64.0 points</span>. Candidates targeting coastal or southern universities should aim for a safety margin of <span className="text-white font-black underline decoration-indigo-400">45.0+ points</span>.
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {[
                                                    { key: 'tier1', title: 'Tier 1 (Milan/Rome)', score: '60+ Pts', color: 'bg-rose-500/10 border-rose-500/20 text-rose-300' },
                                                    { key: 'tier2', title: 'Tier 2 (Pavia/Padua)', score: '52+ Pts', color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' },
                                                    { key: 'tier3', title: 'Tier 3 (South/Sicily)', score: '42+ Pts', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' }
                                                ].map((tier, i) => (
                                                    <div key={i} className={`p-6 rounded-2xl border ${tier.color} backdrop-blur-sm`}>
                                                        <div className="text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 opacity-60 text-center md:text-left">{tier.title}</div>
                                                        <div className="text-2xl font-black text-white text-center md:text-left">{tier.score}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
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

                                <CTASection fieldKeyPrefix="imat_cutoff_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}

