import React from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import {
    Award,
    TrendingUp,
    Target,
    Scale,
    AlertCircle,
    CheckCircle2,
    Zap,
    HelpCircle,
    ChevronRight,
    Sparkles,
    Activity,
    Users
} from 'lucide-react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
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
    { id: 'scoring-logic', label: 'Scoring Logic' },
    { id: 'normalization', label: 'Normalization' },
    { id: 'target-scores', label: 'Target Scores' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'What is a "Safety Score" for CENT-S?', answer: 'A raw score of 35-38 is generally considered a safety score for mid-tier scientific programs in Italy.' },
    { question: 'What is a "Competitive Score" for top universities?', answer: 'For high-demand programs at universities like Bologna or Sapienza, you should aim for a raw score of 42 or higher.' },
    { question: 'Does a higher score guarantee admission?', answer: 'Not directly. Since it is a ranking exam, admission depends on your final position relative to other candidates. A high score increases your probability but is subject to the university\'s available seats.' },
    { question: 'Is the passing score the same for EU and Non-EU students?', answer: 'EU and Non-EU students often compete in separate rankings. Non-EU students residing abroad follow a specific quota, where cutoffs are sometimes lower but seats are much more limited.' },
    { question: 'How much does normalization affect the final score?', answer: 'Normalization can adjust your score by several points. If you take a particularly difficult session, your raw score of 35 might be boosted to effectively match a 38 in an easier session.' },
    { question: 'How do I see my national ranking position?', answer: 'Rankings are published on the specific university portal or the CISIA "Area Riservata" after the final application deadline.' },
    { question: 'What is the maximum possible score in CENT-S?', answer: 'The maximum raw score is 55. After normalization, the score is expressed as a decimal value used for the ranking.' },
    { question: 'Do all sections have the same weight?', answer: 'Typically yes. Every correct answer in Math, Logic, or Science earns +1 point. However, tie-breaking rules often prioritize the Math score.' },
    { question: 'When is the score considered "expired"?', answer: 'CENT-S scores are usually valid for the academic year in which they are taken. Some universities may accept a score from the previous year, but you must check the specific "Bando".' },
    { question: 'Is there a negative marking penalty?', answer: 'Yes. Every incorrect answer results in a -0.25 point penalty. Skipping a question earns 0 points.' }
];

export default function CentsPassingScore() {
    const { getField } = usePageContent('cent-s-passing-score-2026');
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
        <CmsPageWrapper slug="cent-s-passing-score-2026">
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
                    title="CENT-S Passing Score 2026: Official Scoring & Cutoff Analysis"
                    description="What is the passing score for CENT-S 2026? Analysis of raw vs normalized scores, safety thresholds for top Italian universities, and ranking logic."
                    keywords="cent-s passing score 2026, cent-s cutoffs, cent-s scoring system, cisia normalization, study italy stem scores"
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
                                        {getField('hero_headline', 'CENT-S 2026 Passing Score Analysis')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "Admission to Italian STEM faculties is determined by your ranking position. Understanding the interplay between raw and normalized scores is critical for your success.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'max', label: 'Max Raw', value: '55.0 pts', icon: Target },
                                            { key: 'safe', label: 'Safe Score', value: '42.0 pts', icon: Award },
                                            { key: 'penalty', label: 'Penalty', value: '-0.25', icon: Zap },
                                            { key: 'status', label: 'Status', value: '2026 Ver', icon: CheckCircle2 }
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

                                {/* Scoring Logic */}
                                <section id="scoring-logic" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Scale className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">How the Score is Calculated</h2>
                                    </div>
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                        <div className="grid md:grid-cols-3 gap-8 text-center">
                                            {[
                                                { label: 'Correct Answer', val: '+1.0', color: 'text-emerald-600' },
                                                { label: 'Incorrect Answer', val: '-0.25', color: 'text-rose-600' },
                                                { label: 'Skipped Question', val: '0.0', color: 'text-slate-400' }
                                            ].map((item, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.label}</div>
                                                    <div className={`text-4xl font-black ${item.color}`}>{item.val}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                            <AlertCircle className="text-indigo-600" size={24} />
                                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                                Because of the negative marking, blind guessing is statistically risky. Only guess if you can eliminate at least two options.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Normalization */}
                                <section id="normalization" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-emerald-100 p-3 rounded-2xl">
                                            <Activity className="text-emerald-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">The Normalization Factor</h2>
                                    </div>
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5"><TrendingUp size={200} /></div>
                                        <p className="text-xl text-slate-300 leading-relaxed font-medium mb-10">
                                            Since candidates take different exam papers across different dates, CISIA applies a mathematical normalization. This adjusts raw scores based on the session's difficulty. A raw score of 35 in a "difficult" session might be worth more than a 38 in an "easy" session.
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="p-6 bg-white/10 rounded-2xl border border-white/20">
                                                <h4 className="font-black text-indigo-400 mb-2">Goal: Consistency</h4>
                                                <p className="text-sm opacity-80 leading-relaxed">Normalization ensures fairness across multiple macro-periods, preventing "luck of the draw" from affecting your university entrance.</p>
                                            </div>
                                            <div className="p-6 bg-white/10 rounded-2xl border border-white/20">
                                                <h4 className="font-black text-emerald-400 mb-2">Output</h4>
                                                <p className="text-sm opacity-80 leading-relaxed">The final result used for ranking is the **Normalized Score**, which is what universities use for their merit lists.</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Target Scores */}
                                <section id="target-scores" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Users className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Target Score Bands</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <Card className="p-8 border-slate-100 shadow-sm border-l-8 border-l-emerald-500">
                                            <h3 className="text-xl font-black text-slate-900">The "Safety" Zone</h3>
                                            <div className="text-4xl font-black text-emerald-600 my-4">42.0+</div>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                                A raw score in this range typically translates into a top 10% national ranking, securing admission to almost any university.
                                            </p>
                                        </Card>
                                        <Card className="p-8 border-slate-100 shadow-sm border-l-8 border-l-indigo-500">
                                            <h3 className="text-xl font-black text-indigo-600">The "Competitive" Zone</h3>
                                            <div className="text-4xl font-black text-indigo-600 my-4">35.0 - 41.5</div>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                                The average entry range for mid-tier STEM programs. Admission is likely but may depend on university-specific demand.
                                            </p>
                                        </Card>
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

                                <CTASection fieldKeyPrefix="passing_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


