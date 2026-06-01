import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import {
    LineChart,
    Building2,
    TrendingUp,
    MapPin,
    AlertCircle,
    ChevronRight,
    HelpCircle,
    BarChart3,
    ArrowUpRight,
    Scale
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
    { id: 'overview', label: 'Cutoff Dynamics' },
    { id: 'engineering', label: 'TOLC-I (Engineering) Cutoffs' },
    { id: 'medicine', label: 'TOLC-MED (Medicine) Cutoffs' },
    { id: 'factors', label: 'Factors Influencing Scores' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'Why is it so hard to find TOLC cutoff scores?', answer: 'Unlike national exams with centralized ranking (like the IMAT), the TOLC is decentralized. Every single university manages its own ranking list (Graduatoria) and publishes it independently, often removing it from their website a few months later.' },
    { question: 'What is a "safe" score for Engineering (TOLC-I) in Milan or Turin?', answer: 'For elite technical universities like Politecnico di Milano or Politecnico di Torino, you generally want to aim for a score above 35/50 for early admission. For the standard autumn intake, the cutoff might float around 30-33/50 depending on the specific engineering branch.' },
    { question: 'How high does my score need to be for TOLC-MED?', answer: 'Medicine is notoriously competitive. In recent years, the equalized cutoff score for medicine has hovered in the extremely high percentiles. You generally need to be in the top 15% of all test-takers nationwide to secure a spot.' },
    { question: 'Do cutoffs change between the early spring sessions and the summer sessions?', answer: 'Yes. Universities often reserve a specific number of seats for early admission (Spring) where the cutoff might be predefined (e.g., "Score 36 or higher = automatic admission"). In the summer/autumn sessions, admission is purely competitive based on ranking.' },
    { question: 'Is a 20/50 considered a good score?', answer: 'It depends entirely on the program. For a highly competitive Aerospace Engineering program, 20/50 is too low. For an open-access Environmental Science degree at a regional university, 20/50 might be perfectly fine and will keep you from getting an OFA (remedial obligation).' },
    { question: 'Do Non-EU students have different cutoffs?', answer: 'Yes. Non-EU students residing abroad compete in a separate quota (contingente posti) from EU students. Because there are fewer seats but also fewer applicants, the Non-EU cutoff can be drastically different—sometimes much lower, sometimes higher—than the EU cutoff.' },
    { question: 'What happens if there is a tie in the cutoff score?', answer: 'Universities use tie-breakers defined in the Bando. Typically, they look at the score in specific sections (e.g., Mathematics is prioritized for Engineering). If there is still a tie, the younger candidate is almost always given priority by Italian law.' },
    { question: 'Can the cutoff drop after the first list is published?', answer: 'Yes, this is called "Scorrimento" (Scrolling). If admitted students decline their spot or enroll elsewhere, the university scrolls down the list and admits the next highest-scoring students. The cutoff can drop by several points over a few weeks.' }
];

export default function TolcCutoffTrends() {
    const { getField } = usePageContent('tolc-cutoff-trends-2026');
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
        <CmsPageWrapper slug="tolc-cutoff-trends-2026">
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
                    title="TOLC Exam Cutoff Trends 2026: Politecnico & TOLC-MED Data"
                    description="Analyze historical TOLC cutoff scores for top Italian universities, including Politecnico di Milano (TOLC-I) and national Medicine (TOLC-MED) equalized score thresholds."
                    keywords="TOLC cutoff score, TOLC-I politecnico di milano cutoff, TOLC-MED minimum score, what is a good TOLC score, TOLC ranking graduatoria, TOLC Non-EU cutoff"
                    schemas={[getBreadcrumbSchema([
                        { name: 'Home', item: '/' },
                        { name: 'TOLC Guide', item: '/tolc-exam-ultimate-guide-2026' },
                        { name: 'TOLC Cutoff Trends', item: '/tolc-cutoff-trends-2026' }
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
                                        <LineChart size={12} className="text-indigo-600" />
                                        Historical Admissions Data
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                                        {getField('hero_headline', 'TOLC Cutoff Scores & Trends')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "Determining the exact cutoff for the TOLC is famously difficult because the exam is highly decentralized. Unlike a national entrance exam with one unified ranking list, every single university—and sometimes every single department within a university—manages its own 'Graduatoria' (ranking list). The minimum score to enter Mechanical Engineering in Milan will be drastically different from Civil Engineering in a smaller regional town. Here is a breakdown of what constitutes a 'competitive' score.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'elite', label: 'Elite Univs', value: '35+', icon: Building2 },
                                            { key: 'avg', label: 'Average Univs', value: '20-25', icon: BarChart3 },
                                            { key: 'scroll', label: 'Scorrimento', value: 'High', icon: ArrowUpRight },
                                            { key: 'ofa', label: 'OFA Threshold', value: '14-18', icon: AlertCircle }
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

                                {/* Engineering Cutoffs */}
                                <section id="engineering" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Building2 className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">TOLC-I (Engineering) Trends</h2>
                                    </div>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium mb-8">
                                        Engineering is the most popular use case for the TOLC. The landscape is dominated by the elite Polytechnics in the North, which drive cutoffs extremely high.
                                    </p>

                                    <div className="space-y-6">
                                        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                                                <MapPin className="text-rose-500" size={20} /> Elite Tier (Milan, Turin, Bologna)
                                            </h3>
                                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                                Programs like Aerospace, Biomedical, or Computer Engineering at top institutions are hyper-competitive. 
                                            </p>
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                                <span className="font-bold text-slate-700">Target Score:</span>
                                                <span className="font-black text-indigo-600 text-xl">35 - 40+ / 50</span>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                                                <MapPin className="text-emerald-500" size={20} /> Mid-Tier / Regional Universities
                                            </h3>
                                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                                Universities in smaller cities or less demanded programs (Civil, Environmental). Many of these are "Accesso Libero", meaning you just need to beat the OFA threshold.
                                            </p>
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                                <span className="font-bold text-slate-700">Target Score (To avoid OFA):</span>
                                                <span className="font-black text-emerald-600 text-xl">18 - 22 / 50</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Medicine Cutoffs */}
                                <section id="medicine" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Scale size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-3xl font-black mb-6 flex items-center gap-4">
                                                <TrendingUp className="text-amber-400" />
                                                The Brutality of TOLC-MED
                                            </h2>
                                            <p className="text-lg text-slate-300 leading-relaxed font-medium mb-8 max-w-3xl">
                                                Medicine in Italy is notoriously difficult to enter. The introduction of the "Equalized Score" algorithm for TOLC-MED made interpreting the cutoff even more complex.
                                            </p>
                                            
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                                                    <h4 className="font-bold text-white text-lg mb-2">The Equalization Factor</h4>
                                                    <p className="text-sm text-slate-300 leading-relaxed">
                                                        You are no longer just scored on how many questions you got right, but how statistically difficult those specific questions were. A raw score of 35 could be equalized up to a 42 if your test variant was mathematically proven to be harder than average.
                                                    </p>
                                                </div>
                                                <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                                                    <h4 className="font-bold text-white text-lg mb-2">The 85th Percentile Rule</h4>
                                                    <p className="text-sm text-slate-300 leading-relaxed">
                                                        Historically, to comfortably secure a medical seat in the North (Milano, Padova, Pavia), you need to score in the top 10-15% of all candidates nationwide. Due to the equalization factor, the numerical cutoff fluctuates wildly, but the percentile remains rigid.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Factors */}
                                <section id="factors" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-amber-100 p-3 rounded-2xl">
                                            <AlertCircle className="text-amber-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">What Shifts the Cutoff?</h2>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <Card className="p-6 border-slate-200">
                                            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                                                <ArrowUpRight className="text-amber-600" size={20} />
                                            </div>
                                            <h4 className="font-bold text-slate-900 mb-2">Scorrimento (Scrolling)</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                Many students take the TOLC but end up enrolling elsewhere. As they decline their seats, the university "scrolls" down the ranking. The final cutoff can drop significantly from the first published list.
                                            </p>
                                        </Card>
                                        <Card className="p-6 border-slate-200">
                                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                                                <Building2 className="text-emerald-600" size={20} />
                                            </div>
                                            <h4 className="font-bold text-slate-900 mb-2">Location Bias</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                Northern universities (Milan, Turin, Bologna, Padua) are vastly more requested than Southern ones. A score that gets you rejected in Milan might comfortably win you a scholarship in Sicily.
                                            </p>
                                        </Card>
                                        <Card className="p-6 border-slate-200">
                                            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-4">
                                                <MapPin className="text-rose-600" size={20} />
                                            </div>
                                            <h4 className="font-bold text-slate-900 mb-2">Non-EU Quotas</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                Non-EU students compete in a completely separate ranking list. If a university allocates 10 Non-EU seats and only 5 apply, the cutoff drops essentially to zero (or the OFA threshold).
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

                                <CTASection fieldKeyPrefix="tolc_cutoff_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}
