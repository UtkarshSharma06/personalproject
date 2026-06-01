import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Target,
    TrendingUp,
    Award,
    ChevronRight,
    HelpCircle,
    CheckCircle2,
    Clock,
    Scale,
    AlertCircle,
    Zap,
    Grid,
    ShieldCheck,
    PieChart,
    Activity,
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
    { id: 'thresholds', label: 'Score Thresholds' },
    { id: 'logic', label: 'Scoring Logic' },
    { id: 'ranking', label: 'National Ranking' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'What is the minimum passing score for IMAT?', answer: 'For EU students, there is a legal minimum threshold of 20 points. For Non-EU students, the threshold is effectively any score above 0, but admission depends entirely on the ranking and available seats.' },
    { question: 'How is the IMAT score calculated?', answer: 'Each correct answer earns +1.5 points. Each wrong answer results in a penalty of -0.4 points. Unanswered questions earn 0 points. The maximum possible score is 90.' },
    { question: 'What is a "safe" score for the IMAT?', answer: 'A "safe" score varies by university. Historically, a score of 50-55 is considered very safe for most public universities, while top-tier ones like Milan or Bologna may require 60+.' },
    { question: 'Does the difficulty of the exam affect the score?', answer: 'Yes, if the exam is harder, the average scores drop, meaning a lower score could still be competitive. Conversely, in an easier year, the "cutoff" scores rise.' },
    { question: 'Is there a different passing score for Non-EU students?', answer: 'Non-EU students compete in a separate ranking. Often, the scores required for Non-EU seats are slightly lower than those for EU students, but this depends on the specific university quota.' },
    { question: 'How long are IMAT scores valid?', answer: 'IMAT scores are only valid for the specific academic year for which the exam was taken. You cannot use a previous year\'s score for a new application.' },
    { question: 'When are the official results released?', answer: 'Preliminary scores (scanned answer sheets) are usually available within 10-14 days. The official national ranking is typically published 3-4 weeks after the exam.' },
    { question: 'What happens if two students have the same score?', answer: 'In case of a tie, the MUR follows specific priority rules: scores in individual sections (Logic, then Biology, then Chemistry, etc.) are compared. If still tied, the younger candidate is prioritized.' },
    { question: 'Does the 20-point threshold apply to everyone?', answer: 'Technically, the 20-point minimum only applies to EU students (and Non-EU students residing in Italy). Non-EU students residing abroad do not have a mandatory minimum, but must rank high enough to get a seat.' },
    { question: 'Can I see my scanned answer sheet?', answer: 'Yes, after the results are finalized, you can access your personal area on the Universitaly portal to view your scanned answer sheet and individual section scores.' }
];

export default function ImatPassingScore() {
    const navigate = useNavigate();
    const { getField } = usePageContent('imat-exam-passing-score-2026');
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
        <CmsPageWrapper slug="imat-exam-passing-score-2026">
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
                    title="IMAT Passing Score 2026: Official Thresholds & Cutoff Analysis"
                    description="What is the passing score for IMAT 2026? Analysis of historical cutoffs, EU vs Non-EU thresholds, and how the 90-point scoring system works. Get the real data."
                    keywords="IMAT passing score 2026, IMAT cutoffs 2026, IMAT score calculation, IMAT minimum threshold, study medicine italy scores"
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
                                        {getField('hero_headline', 'IMAT 2026 Passing Score Analysis')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "Understanding the difference between the legal minimum and the competitive threshold is critical for your university selection.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'min', label: 'EU Min', value: '20.0 pts', icon: Target },
                                            { key: 'avg', label: 'Avg Success', value: '44.5 pts', icon: TrendingUp },
                                            { key: 'max', label: 'Max Possible', value: '90.0 pts', icon: Award },
                                            { key: 'status', label: 'Status', value: 'Verified', icon: ShieldCheck }
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

                                {/* Thresholds */}
                                <section id="thresholds" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Scale className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Official Score Thresholds</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <Card className="p-8 border-slate-900 border-2 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] bg-white overflow-hidden relative group">
                                            <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform">
                                                <Scale size={120} />
                                            </div>
                                            <div className="text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Theoretical Minimum</div>
                                            <div className="text-5xl font-black text-indigo-600 mb-6">20.0 pts</div>
                                            <p className="text-slate-500 font-medium leading-relaxed">
                                                According to MUR regulations, any EU student scoring below 20 is automatically disqualified. This is the legal floor, not the admission ceiling.
                                            </p>
                                        </Card>
                                        <Card className="p-8 border-emerald-100 shadow-lg bg-emerald-50/30 border-l-8 border-l-emerald-500 overflow-hidden relative group">
                                            <div className="absolute top-0 right-0 p-4 opacity-[0.1] group-hover:scale-110 transition-transform">
                                                <Award size={120} className="text-emerald-900" />
                                            </div>
                                            <div className="text-xs font-black text-emerald-600 uppercase mb-2 tracking-widest">Competitive Safety Line</div>
                                            <div className="text-5xl font-black text-emerald-700 mb-6">52.0+ pts</div>
                                            <p className="text-slate-600 font-medium leading-relaxed">
                                                Based on 2025 data, a score of 52.0 or higher is the 'Safety Line' to guarantee a seat in a major city university (Rome, Milan, Bologna).
                                            </p>
                                        </Card>
                                    </div>
                                </section>

                                {/* Scoring Algorithm */}
                                <section id="logic" className="scroll-mt-40">
                                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                            <PieChart size={150} />
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-3">
                                            <Scale className="text-indigo-600" />
                                            Scoring Algorithm & Penalties
                                        </h3>
                                        <div className="grid md:grid-cols-3 gap-8 text-center pb-8 border-b border-slate-50">
                                            {[
                                                { label: 'Correct Answer', val: '+1.50', desc: 'Weighted per question', color: 'text-emerald-600' },
                                                { label: 'Wrong Answer', val: '-0.40', desc: 'Negative marking penalty', color: 'text-rose-600' },
                                                { label: 'Unanswered', val: '0.00', desc: 'No penalty or gain', color: 'text-slate-400' }
                                            ].map((item, i) => (
                                                <div key={i} className="group">
                                                    <div className="text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">{item.label}</div>
                                                    <div className={`text-4xl font-black mb-2 ${item.color} group-hover:scale-110 transition-transform inline-block underline decoration-2 underline-offset-8`}>{item.val}</div>
                                                    <div className="text-xs font-bold text-slate-300 uppercase mt-2">{item.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-10 bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-6">
                                            <div className="bg-white p-3 rounded-xl shadow-sm">
                                                <Activity size={24} className="text-indigo-600" />
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                                Total Possible Score: <span className="font-black text-slate-900">90.0 Points</span>. Average successful score globally: <span className="font-black text-slate-900">44.5 Points</span>.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Guessing Penalty Trap (Dark) */}
                                <section className="scroll-mt-40">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Zap size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl font-black mb-8 flex items-center gap-4">
                                                <AlertCircle className="text-amber-500" />
                                                The "Guessing Penalty" Trap
                                            </h2>
                                            <p className="text-xl text-slate-300 leading-relaxed font-medium mb-12 max-w-3xl">
                                                Because a wrong answer costs you 0.4 points, guessing blindly on 5 questions and getting them all wrong loses you 2.0 full points—enough to drop you <span className="text-white font-black underline decoration-indigo-500">300+ places</span> in the global ranking.
                                            </p>
                                            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                                                <h4 className="text-indigo-400 font-black text-xl mb-3">Strategic Advice</h4>
                                                <p className="text-slate-300 font-medium leading-relaxed">
                                                    Never guess unless you have eliminated at least 3 out of 5 options. If you are 50/50, the statistical gain is positive (+0.55 expected), but blind guessing is suicidal for your ranking.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Ranking Logic */}
                                <section id="ranking" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Grid className="text-indigo-600" size={32} />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900">National Ranking Logic</h2>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {[
                                            { title: 'Assegnato', value: 'Assigned', desc: 'You won a seat at your 1st preference university. Game over, you must enroll.', icon: CheckCircle2, color: 'text-emerald-600' },
                                            { title: 'Prenotato', value: 'Booked', desc: 'You won a seat at a lower preference. You can enroll or wait for "scorrimento".', icon: Clock, color: 'text-indigo-600' },
                                            { title: 'In Attesa', value: 'Waiting', desc: 'You met the min threshold (20) but no open seats yet. You must wait for updates.', icon: Activity, color: 'text-amber-600' }
                                        ].map((item, i) => (
                                            <Card key={i} className="p-8 border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-indigo-600 transition-all">
                                                <item.icon className={`${item.color} mb-4 group-hover:scale-110 transition-transform`} size={40} />
                                                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{item.title}</div>
                                                <div className="text-xl font-black text-slate-900 mb-2">{item.value}</div>
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                            </Card>
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

                                <CTASection fieldKeyPrefix="passing_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


