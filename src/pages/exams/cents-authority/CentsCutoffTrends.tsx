import React from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import {
    TrendingUp,
    ArrowLeft,
    Users,
    Trophy,
    Sparkles,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Target,
    BookOpen,
    HelpCircle
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

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'how-ranking-works', label: 'How Ranking Works' },
    { id: 'score-bands', label: 'Score Bands' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'What is a good score for CENT-S?', answer: 'A robust raw score is typically 40/55 or higher. However, because of the normalization system, your final admission depends on how you rank relative to other candidates in your session macro-period.' },
    { question: 'How is the CENT-S score normalized?', answer: 'CISIA uses a coefficient based on the average performance of all participants in a given period. This ensures that students taking a harder version of the test are not penalized compared to those taking an easier one.' },
    { question: 'What is the "raw score" in CENT-S?', answer: 'The raw score is the sum of points from your answers: +1 for correct, -0.25 for incorrect, and 0 for skipped. It is the unadjusted performance before normalization.' },
    { question: 'Do different universities have different cutoffs?', answer: 'Yes. Highly prestigious universities like Polimi or Bologna often have higher effective cutoffs because more high-scoring students apply there.' },
    { question: 'Is there a minimum passing score for CENT-S?', answer: 'While there is no national "fail" score, most universities require a minimum threshold (often around 18-20 raw points) to even consider you for the ranking.' },
    { question: 'When are the CENT-S ranking results published?', answer: 'Results are typically released a few weeks after the close of a macro-period session. Check your university portal for specific merit list publication dates.' },
    { question: 'Can I retake the CENT-S to improve my score?', answer: 'Yes, most universities allow you to take the exam in multiple macro-periods (e.g., Spring and Summer) and will usually consider your highest score for the ranking.' },
    { question: 'Is CENT-S harder than the IMAT?', answer: 'Structurally, CENT-S is often considered slightly more straightforward in its science sections, but the time pressure and normalization system add a different layer of complexity.' },
    { question: 'How many questions are in each section of CENT-S?', answer: 'The distribution varies by specific module, but it generally includes Mathematics, Logic, Reading Comprehension, and Sciences (Biology/Chemistry/Physics).' },
    { question: 'What happens if I have the same score as another candidate?', answer: 'Tie-breaking rules are university-specific but often prioritize the score in specific sections (like Math or Logic) or the younger candidate.' }
];

export default function CentsCutoffTrends() {
    const { getField } = usePageContent('cent-s-cutoff-2026');
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
        <CmsPageWrapper slug="cent-s-cutoff-2026">
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
                    title="CENT-S Cutoff Trends 2026: Passing Scores & Ranking Analysis"
                    description="What is a good score for CENT-S 2026? Analysis of raw scores, normalization coefficients, and university-specific cutoffs for Italian STEM programs."
                    keywords="cent-s cutoff 2026, cent-s passing score, cent-s ranking logic, cent-s normalization, study stem italy"
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
                                        {getField('hero_headline', 'CENT-S Cutoff & Ranking Analysis')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "Understanding how raw scores translate into national rankings is the first step in setting a realistic target for your Italian university application.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'q', label: 'Questions', value: '55 MCQ', icon: Target },
                                            { key: 'safe', label: 'Safe Score', value: '42+', icon: Trophy },
                                            { key: 'comp', label: 'Competition', value: 'High', icon: Users },
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

                                {/* How Ranking Works */}
                                <section id="how-ranking-works" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <TrendingUp className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">The Normalization System</h2>
                                    </div>
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-5">
                                        <p className="text-slate-600 leading-relaxed font-medium">
                                            The CENT-S uses a **normalized scoring system** to account for potential variations in difficulty between different macro-periods. Your raw score (calculated from the 55 questions) is multiplied by a normalization coefficient derived from the average performance across all candidates in your specific session.
                                        </p>
                                        <p className="text-slate-600 leading-relaxed font-medium">
                                            This means the "passing score" isn't a fixed number. For highly competitive STEM programs (like Engineering in Bologna or Economics in Sapienza), you typically need to be in the top 10-15% of the national ranking. A raw score of 42/55 is generally a very safe threshold for most programs.
                                        </p>
                                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4 items-start">
                                            <AlertCircle className="text-amber-600 shrink-0 mt-1" size={20} />
                                            <p className="text-sm font-medium text-amber-800">
                                                <strong>Note:</strong> CISIA does not publish official historical cutoff tables by university. The figures referenced in prep resources are based on candidate-reported outcomes and should be treated as indicative, not official data.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Score Bands */}
                                <section id="score-bands" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="bg-emerald-100 p-3 rounded-2xl">
                                            <Target className="text-emerald-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">CENT-S Raw Score Interpretation</h2>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { band: '45 – 55', label: 'Elite / Scholarship Range', desc: 'Candidates in this range are usually in the top 2% nationally. High probability of securing admission and potential merit-based scholarships.', color: 'bg-emerald-50 border-emerald-300' },
                                            { band: '40 – 44', label: 'Highly Competitive', desc: 'The "Safe Zone" for major universities. Strong probability of admission to first-choice scientific programs.', color: 'bg-blue-50 border-blue-300' },
                                            { band: '30 – 39', label: 'Moderate / Program Specific', desc: 'Admission depends heavily on the specific university and program demand. Safer for less popular STEM fields.', color: 'bg-amber-50 border-amber-300' },
                                            { band: 'Below 30', label: 'Risky / Retake Range', desc: 'Admission unlikely for top-tier programs. We recommend using following macro-periods to improve performance.', color: 'bg-rose-50 border-rose-300' },
                                        ].map((item, i) => (
                                            <div key={i} className={`p-6 rounded-2xl border-2 ${item.color} flex gap-6 items-start`}>
                                                <div className="min-w-[120px]">
                                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Raw Score</div>
                                                    <div className="text-2xl font-black text-slate-900">{item.band}</div>
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900 mb-1">{item.label}</div>
                                                    <p className="text-sm text-slate-600 font-medium">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Strategy */}
                                <section id="strategy" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-3xl p-10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5"><TrendingUp size={180} /></div>
                                        <div className="relative z-10">
                                            <h2 className="text-3xl font-black mb-6 flex items-center gap-4">
                                                <CheckCircle2 className="text-emerald-400" size={28} />
                                                Setting Your Score Target
                                            </h2>
                                            <p className="text-slate-300 font-medium leading-relaxed mb-6">
                                                Rather than chasing a specific cutoff number, prepare to score as high as possible in absolute terms. Since it is a ranking exam, your goal is to maximise your score relative to the candidate pool — not to clear a fixed bar.
                                            </p>
                                            <div className="bg-white/10 border border-white/20 p-6 rounded-2xl">
                                                <h4 className="text-indigo-300 font-black mb-2">Practical Target</h4>
                                                <p className="text-slate-300 text-sm leading-relaxed">
                                                    Aim for a cumulative raw score of 42+ out of 55 in your mocks. Given the normalization system, this raw consistency protects you against easier sessions where the coefficient might be lower.
                                                </p>
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

                                <CTASection fieldKeyPrefix="cutoff_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


