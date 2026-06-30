import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Euro,
    ShieldCheck,
    TrendingUp,
    Star,
    ChevronRight,
    Sparkles,
    HelpCircle,
    CheckCircle2,
    Grid,
    CalendarDays,
    Users,
    Home
} from 'lucide-react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { useNavigate } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import FAQSchema from '@/components/seo/FAQSchema';
import { getBreadcrumbSchema } from '@/utils/seo-schemas';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import PageNavigation from '@/components/exams/PageNavigation';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'public-fees', label: 'Public Fees' },
    { id: 'private-fees', label: 'Private Fees' },
    { id: 'living-costs', label: 'Living Costs' },
    { id: 'scholarships', label: 'Scholarships' },
    { id: 'faqs', label: 'FAQs' }
];


const faqs = [
    { question: 'How much does it cost to study in a public university in Italy?', answer: 'Public university tuition for international students usually ranges from €156 to €4,000 per year. The exact amount often depends on your family\'s income (ISEE) submitted annually.' },
    { question: 'Are there scholarships for international students in Italy?', answer: 'Yes. Italy offers generous regional DSU scholarships based on financial need, which can cover full tuition and provide a stipend of up to €7,000 per year.' },
    { question: 'Is Italy cheaper than the UK or USA for university students?', answer: 'Significantly. Living costs and tuition in Italy are among the lowest in Western Europe, making it a top destination for budget-conscious international students.' },
    { question: 'Do private universities in Italy offer financial aid?', answer: 'Private universities like Cattolica and Bocconi have higher fees (€8,000 – €25,000) but offer their own merit-based scholarships reducing fees by 30-80%.' },
    { question: 'What is the minimum tuition at an Italian public university?', answer: 'The minimum regional contribution (tassa regionale) is approximately €156 per year. Many low-income students pay only this baseline rate after financial assessment.' },
    { question: 'Can the DSU scholarship cover both tuition and living costs?', answer: 'Yes. The DSU covers tuition refund, provides subsidized housing, free meal vouchers, and a cash stipend up to €7,000 per year depending on the region and university.' },
    { question: 'Is accommodation included in Italian university fees?', answer: 'No, accommodation is separate. University dorms cost €150-€400/month. Private rentals in cities like Milan can be €500-€900/month. Pavia and Padua are much more affordable.' },
    { question: 'When do I apply for the DSU scholarship?', answer: 'DSU applications typically open in July-September each year for the following academic year. You should apply immediately after confirming your university enrollment.' },
    { question: 'Do I need to pay tuition before arriving in Italy?', answer: 'Typically, a first installment is due before or around enrollment. Many universities split payments into 2-3 installments across the academic year.' },
    { question: 'Is ISEE required for all Italian university scholarships?', answer: 'Yes. ISEE (Indicatore della Situazione Economica Equivalente) is required for all need-based aid. It evaluates your family\'s financial situation and determines your fee bracket.' }
];

export default function StudyItalyTuition() {
    const navigate = useNavigate();
    const { getField } = usePageContent('study-italy-tuition');
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY + 100;
            for (const s of sections) {
                const el = document.getElementById(s.id);
                if (el && el.offsetTop <= scrollPos && el.offsetTop + el.offsetHeight > scrollPos) {
                    setActiveSection(s.id);
                    break;
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    };

    return (
        <CmsPageWrapper slug="study-italy-tuition">
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
                    title="Study in Italy Cost & Tuition Fees 2026: Public vs Private"
                    description="Detailed breakdown of the cost to study in Italy for international students. Compare public and private university tuition fees and living expenses for 2026."
                    keywords="study in italy cost, Italy university tuition fees 2026, cost of studying in Italy, cheap universities in Italy, DSU Italy"
                    schemas={[getBreadcrumbSchema([
                        { name: 'Home', item: '/' },
                        { name: 'Study in Italy Guide', item: '/study-in-italy-guide-2026' },
                        { name: 'Italy Tuition Fees 2026', item: '/study-in-italy/tuition-fees-2026' }
                    ])]}
                    />
                <FAQSchema items={faqs} />

                <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
                    <main className="container mx-auto px-4 pt-0 pb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        
                            {/* Sidebar Hub */}
                            <div className="lg:col-span-4 hidden lg:block">
                                <div className="sticky top-32 self-start">
                                    <KnowledgeHubSidebar examType="study-italy" />
                                </div>
                            </div>

                            <div className="lg:col-span-8 space-y-16">

                                {/* Hero */}
                                <section id="overview" className="scroll-mt-40">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                                        <Sparkles size={12} className="animate-pulse" />
                                        Official 2026 Academic Roadmap
                                    </div>
                                    <EditableText fieldKey="hero_headline" as="h1" className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
                                        {getField('hero_headline', 'Tuition Fees in Italy 2026')}
                                    </EditableText>
                                    <EditableText fieldKey="hero_subheadline" multiline as="p" className="text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_subheadline', 'Italy is among the most affordable study destinations in Western Europe. This guide breaks down the real cost of studying — from minimum public fees to scholarship coverage — so you know exactly what to budget.')}
                                    </EditableText>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { label: 'Min Tuition', value: '€156/yr', icon: Euro },
                                            { label: 'Max Public', value: '€4,000/yr', icon: TrendingUp },
                                            { label: 'DSU Stipend', value: '€7,000', icon: Star },
                                            { label: 'Private Max', value: '€25,000/yr', icon: Home }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-4 md:p-6 rounded-2xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)] flex flex-col items-center text-center group hover:border-emerald-200 transition-colors">
                                                <item.icon className="text-emerald-600 mb-2 md:mb-3 group-hover:scale-110 transition-transform" size={20} />
                                                <div className="text-lg md:text-2xl font-black text-slate-900">{item.value}</div>
                                                <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-loose">
                                        <EditableText fieldKey="overview_p1" multiline as="p" className="mb-4">
                                            {getField('overview_p1', 'Italy\'s public university fee system is one of the most progressive in Europe. Fees are not fixed — they are calculated based on your family\'s financial situation using the ISEE income index. Students with lower incomes pay significantly less, sometimes as little as the mandatory regional contribution of €156.')}
                                        </EditableText>
                                        <EditableText fieldKey="overview_p2" multiline as="p">
                                            {getField('overview_p2', 'Private universities operate with fixed, higher fees but often offer strong internal scholarship programs that can dramatically reduce the effective cost. This guide helps you understand both systems and plan your finances accurately.')}
                                        </EditableText>
                                    </div>
                                </section>

                                {/* Public Fees */}
                                <section id="public-fees" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-2 md:p-3 rounded-2xl">
                                            <Euro className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 underline decoration-indigo-400 underline-offset-8">Public University Fee Structure</h2>
                                    </div>
                                    <div className="prose prose-lg text-slate-600 mb-8 max-w-none">
                                        <p>Italian public universities use an income-based (ISEE) sliding scale for fees. Here are the typical brackets for 2026:</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { key: 'low', title: 'Low Income', weight: '€156 – €600', focus: 'For families with ISEE under €13,000. Often qualifies for full DSU scholarship coverage.', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                                            { key: 'mid', title: 'Middle Income', weight: '€600 – €2,000', focus: 'For ISEE between €13,000 – €30,000. Partial DSU eligibility, significant savings remain.', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                                            { key: 'high', title: 'Higher Income', weight: '€2,000 – €4,000', focus: 'For ISEE above €30,000. Standard tuition rate. No DSU aid but still far cheaper than most Western universities.', color: 'bg-amber-50 text-amber-700 border-amber-100' }
                                        ].map((item, i) => (
                                            <div key={i} className={`p-6 md:p-8 rounded-[2rem] border-2 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)] border-slate-900 ${item.color} flex flex-col justify-between h-full`}>
                                                <div>
                                                    <div className="text-2xl md:text-3xl font-black mb-2">{item.weight}</div>
                                                    <h4 className="text-lg md:text-xl font-bold mb-4">{item.title}</h4>
                                                    <p className="text-sm opacity-80 font-medium leading-relaxed">{item.focus}</p>
                                                </div>
                                                <ChevronRight className="mt-8 self-end" size={20} />
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Private Fees */}
                                <section id="private-fees" className="scroll-mt-40">
                                    <div className="bg-slate-900 text-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)]">
                                        <div className="absolute top-0 right-0 p-8 opacity-10"><Star size={200} /></div>
                                        <div className="relative z-10">
                                            <h2 className="text-2xl md:text-4xl font-black mb-8 flex items-center gap-4">
                                                <Star className="text-amber-400" size={28} />
                                                Private University Costs
                                            </h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                                {[
                                                    { key: 'b1', text: 'Bocconi University: €14,000 – €26,000/year. Internal scholarship can reduce to €3,000+ depending on merit.' },
                                                    { key: 'b2', text: 'Humanitas University: €13,000 – €18,000/year. Hospital-linked clinical training justified by higher investment.' },
                                                    { key: 'b3', text: 'Cattolica University: €8,000 – €16,000/year. One of the more affordable private options with a wide scholarship pool.' },
                                                    { key: 'b4', text: 'NABA (Design/Arts): €10,000 – €17,000/year. Premium for art and design industry connections and studio access.' }
                                                ].map(({ key, text }) => (
                                                    <div key={key} className="flex items-start gap-3">
                                                        <CheckCircle2 className="text-amber-400 shrink-0 mt-1" size={18} />
                                                        <EditableText fieldKey={`priv_fee_${key}`} as="p" className="text-sm md:text-base font-medium opacity-90 leading-relaxed">
                                                            {getField(`priv_fee_${key}`, text)}
                                                        </EditableText>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Living Costs */}
                                <section id="living-costs" className="p-8 md:p-12 bg-white rounded-[2.5rem] md:rounded-[3rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)]">
                                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-8 flex items-center gap-4">
                                        <Home className="text-rose-500" size={28} />
                                        Monthly Living Costs by City
                                    </h2>
                                    <div className="space-y-4 md:space-y-6">
                                        {[
                                            { city: 'Milan', rent: '€600 – €900', food: '€300 – €450', transport: '€100', total: '~€1,100 – €1,500' },
                                            { city: 'Rome', rent: '€500 – €800', food: '€250 – €400', transport: '€90', total: '~€900 – €1,300' },
                                            { city: 'Bologna', rent: '€400 – €650', food: '€200 – €350', transport: '€80', total: '~€700 – €1,100' },
                                            { city: 'Pavia / Padua', rent: '€200 – €450', food: '€180 – €300', transport: '€60', total: '~€500 – €900' }
                                        ].map((row, i) => (
                                            <div key={i} className="flex flex-col md:grid md:grid-cols-5 gap-3 p-4 md:p-0 bg-slate-50 md:bg-transparent rounded-2xl md:rounded-none">
                                                <div className="font-black text-slate-800 flex items-center text-lg md:text-base mb-2 md:mb-0">{row.city}</div>
                                                <div className="grid grid-cols-2 md:grid-cols-1 md:contents lg:contents gap-2">
                                                    <div className="bg-indigo-50 text-indigo-700 font-bold text-[10px] md:text-xs p-3 rounded-xl text-center flex items-center justify-center">Rent: {row.rent}</div>
                                                    <div className="bg-amber-50 text-amber-700 font-bold text-[10px] md:text-xs p-3 rounded-xl text-center flex items-center justify-center">Food: {row.food}</div>
                                                    <div className="bg-slate-100 text-slate-700 font-bold text-[10px] md:text-xs p-3 rounded-xl text-center flex items-center justify-center">Transit: {row.transport}</div>
                                                    <div className="bg-emerald-100 text-emerald-800 font-black text-[10px] md:text-xs p-3 rounded-xl text-center flex items-center justify-center col-span-2 md:col-auto">{row.total}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Scholarships */}
                                <section id="scholarships" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="bg-emerald-100 p-2 md:p-3 rounded-2xl">
                                            <Star className="text-emerald-600" size={28} />
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black text-slate-900">DSU Scholarship: Full Coverage</h2>
                                    </div>
                                    <div className="space-y-6">
                                        {[
                                            { key: 'tuition', icon: Euro, title: 'Full Tuition Waiver', desc: 'DSU covers the entire tuition contribution, meaning you only pay the mandatory regional tax (~€156). This can save €1,000 – €3,800 per year.' },
                                            { key: 'stipend', icon: Star, title: 'Cash Stipend up to €7,000', desc: 'Eligible students receive a monetary grant paid in two installments (November and April). The amount depends on your university region and ISEE level.' },
                                            { key: 'housing', icon: Home, title: 'Subsidized University Housing', desc: 'DSU holders get priority access to university dormitories at rates of €100 – €300/month, far below market rent in Italian cities.' },
                                            { key: 'meals', icon: Users, title: 'Free or Subsidized Meals', desc: 'University cafeterias accept a DSU meal card. Students often receive 1-2 free or heavily discounted meals daily (€0.50 – €1 each).' }
                                        ].map((item, i) => (
                                            <div key={i} className="group bg-white p-6 md:p-8 rounded-[2rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)] transition-all flex flex-col md:flex-row gap-6 items-start">
                                                <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-emerald-50 transition-colors shrink-0">
                                                    <item.icon className="text-emerald-600" size={28} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-900 mb-2 text-center md:text-left">{item.title}</h3>
                                                    <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium text-center md:text-left">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-12 bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                                        <h4 className="text-xl md:text-2xl font-black mb-4 flex items-center gap-3">
                                            <Star className="text-emerald-600" fill="currentColor" size={24} />
                                            Key Tip for International Students
                                        </h4>
                                        <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                                            Apply for DSU as early as possible — typically July to September. You need your ISEE declaration and proof of enrollment. Late applications often miss the funding window entirely.
                                        </p>
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
                                            <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)] transition-shadow">
                                                <div className="text-lg md:text-xl font-black text-slate-900 mb-4 flex gap-3 md:gap-4">
                                                    <span className="text-emerald-600 shrink-0">Q{i + 1}:</span>
                                                    <EditableText fieldKey={`faq_q_${i}`} as="div">{getField(`faq_q_${i}`, faq.question)}</EditableText>
                                                </div>
                                                <div className="text-slate-600 leading-relaxed font-medium pl-8 md:pl-12 border-l-2 border-slate-50 text-sm md:text-base">
                                                    <EditableText fieldKey={`faq_a_${i}`} multiline as="div">{getField(`faq_a_${i}`, faq.answer)}</EditableText>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* CTA Section */}

                                <CTASection fieldKeyPrefix="italy_tuition_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


