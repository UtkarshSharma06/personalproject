import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Globe,
    GraduationCap,
    Euro,
    ShieldCheck,
    Briefcase,
    Users,
    ChevronRight,
    Sparkles,
    HelpCircle,
    CheckCircle2,
    ArrowRight,
    Star,
    Grid,
    CalendarDays,
    TrendingUp,
    BookOpen,
    MapPin,
    ArrowLeft
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import FAQSchema from '@/components/seo/FAQSchema';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import PageNavigation from '@/components/exams/PageNavigation';
import faqData from '@/data/italy-faqs-2026.json';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'why-italy', label: 'Why Italy' },
    { id: 'requirements', label: 'Requirements' },
    { id: 'finances', label: 'Finances' },
    { id: 'application', label: 'How to Apply' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = faqData;

export default function StudyItalyGuide() {
    const navigate = useNavigate();
    const { getField } = usePageContent('study-italy-guide');
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

    return (
        <CmsPageWrapper slug="study-italy-guide">
            <Layout
                variant="public"
                showHeader={true}
                showFooter={true}
                subNavigation={
                    <PageNavigation
                        sections={sections}
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    />
                }
            >
                <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
                    <SEOHead
                        title="Study in Italy for International Students: 2026 Ultimate Guide"
                        description="The definitive guide for international students planning to study in Italy. Learn about admission, scholarships, visa processes, and university requirements."
                        keywords="study in italy for international students, study in Italy 2026, Italian university admission, scholarships in Italy, Italy student visa"
                    />

                    <FAQSchema items={faqs} />

                    <main className="container mx-auto px-4 pt-0 pb-12 md:pb-16">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                            {/* Sidebar */}
                            <div className="lg:col-span-4 hidden lg:block sticky top-32 self-start">
                                <KnowledgeHubSidebar examType="study-italy" />
                            </div>

                            {/* Main Content */}
                            <div className="lg:col-span-8 space-y-16">

                                {/* Hero */}
                                <section id="overview" className="scroll-mt-48">
                                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12">
                                        <div className="space-y-6">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                <Sparkles size={12} className="animate-pulse" />
                                                Official 2026 Academic Roadmap
                                            </div>

                                            <EditableText fieldKey="hero_headline" as="h1" className="text-4xl md:text-7xl font-black text-slate-900 leading-[1.1]">
                                                {getField('hero_headline', 'Study in Italy 2026')}
                                            </EditableText>
                                        </div>
                                    </div>

                                    <EditableText fieldKey="hero_subheadline" multiline as="p" className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_subheadline', 'The definitive, 3000+ word guide to studying in Italy as an international student in 2026. Covers everything from university selection to visa, scholarships, and cost of living.')}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'dest', label: 'Global Ranking', value: '#1 in Europe', icon: Globe },
                                            { key: 'cost', label: 'Annual Tuition', value: '€0 – €4,000', icon: Euro },
                                            { key: 'visa', label: 'Visa Success', value: 'Very High', icon: ShieldCheck },
                                            { key: 'stay', label: 'Post-Study Stay', value: '12 Months', icon: Briefcase }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-4 md:p-6 rounded-2xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center text-center group hover:border-indigo-200 transition-colors">
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

                                    <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-loose">
                                        <EditableText fieldKey="overview_p1" multiline as="p" className="mb-4">
                                            {getField('overview_p1', 'Italy has quietly become one of the world\'s most powerful destinations for international students. With over 90 universities, many ranked globally, and a cultural legacy unmatched anywhere on Earth, studying in Italy in 2026 is a decision that pays dividends far beyond the degree.')}
                                        </EditableText>
                                        <EditableText fieldKey="overview_p2" multiline as="p">
                                            {getField('overview_p2', 'This guide breaks down every aspect you need to know: from choosing between public and private universities, understanding the true cost of studying, navigating the visa process, to maximizing your scholarship potential through Italy\'s generous DSU system.')}
                                        </EditableText>
                                    </div>
                                </section>

                                {/* Why Italy */}
                                <section id="why-italy" className="scroll-mt-40">
                                    <div className="bg-slate-900 text-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <Globe size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <EditableText fieldKey="why_title" as="h2" className="text-2xl md:text-4xl font-black mb-8 flex items-center gap-4">
                                                <Globe className="text-indigo-400" size={28} />
                                                {getField('why_title', 'Why Italy is the 2026 Smart Choice')}
                                            </EditableText>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                                <div className="space-y-4">
                                                    {[
                                                        { key: 'b1', text: 'Public university tuition starts at just €156/year — among the lowest in all of Western Europe.' },
                                                        { key: 'b2', text: 'Hundreds of English-taught degrees available, including Medicine (IMAT), Engineering, and Business.' }
                                                    ].map(({ key, text }) => (
                                                        <div key={key} className="flex items-start gap-3">
                                                            <CheckCircle2 className="text-indigo-400 shrink-0 mt-1" size={18} />
                                                            <EditableText fieldKey={`why_bullet_${key}`} as="p" className="text-sm md:text-base font-medium opacity-90 leading-relaxed">
                                                                {getField(`why_bullet_${key}`, text)}
                                                            </EditableText>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="space-y-4">
                                                    {[
                                                        { key: 'b3', text: 'Italy offers the DSU scholarship — one of the most generous need-based grants in Europe, covering full tuition and living costs.' },
                                                        { key: 'b4', text: 'A globally recognized degree from institutions like University of Bologna, Sapienza, and Pavia boosts your career everywhere.' }
                                                    ].map(({ key, text }) => (
                                                        <div key={key} className="flex items-start gap-3">
                                                            <CheckCircle2 className="text-indigo-400 shrink-0 mt-1" size={18} />
                                                            <EditableText fieldKey={`why_bullet_${key}`} as="p" className="text-sm md:text-base font-medium opacity-90 leading-relaxed">
                                                                {getField(`why_bullet_${key}`, text)}
                                                            </EditableText>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Requirements */}
                                <section id="requirements" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-amber-100 p-2 md:p-3 rounded-2xl">
                                            <ShieldCheck className="text-amber-600" size={28} />
                                        </div>
                                        <div>
                                            <EditableText fieldKey="req_title" as="h2" className="text-2xl md:text-4xl font-black text-slate-900 underline decoration-amber-400 underline-offset-8">
                                                {getField('req_title', 'Admission Requirements 2026')}
                                            </EditableText>
                                        </div>
                                    </div>

                                    <div className="prose prose-lg text-slate-600 mb-8 max-w-none">
                                        <EditableText fieldKey="req_desc" multiline as="p">
                                            {getField('req_desc', 'The requirements for Italian university admission are structured but very achievable. The most important step is understanding what is needed for your specific degree level.')}
                                        </EditableText>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { key: 'academic', title: 'Academic', weight: 'Primary', focus: '12 years schooling for Bachelor\'s. 3-year degree for Master\'s.', color: 'bg-amber-50 text-amber-700 border-amber-100' },
                                            { key: 'language', title: 'Language', weight: 'Required', focus: 'IELTS 6.0+ or MOI Certificate. Duolingo DET 110+ accepted by many.', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                                            { key: 'entrance', title: 'Entrance Exam', weight: 'Selective', focus: 'IMAT for Medicine. TOLC-I for Engineering. TOLC-E for Business.', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' }
                                        ].map((item, i) => (
                                            <div key={i} className={`p-6 md:p-8 rounded-[2rem] border-2 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] border-slate-900 ${item.color} flex flex-col justify-between h-full`}>
                                                <div>
                                                    <EditableText fieldKey={`req_card_${item.key}_weight`} as="div" className="text-2xl md:text-4xl font-black mb-2">
                                                        {getField(`req_card_${item.key}_weight`, item.weight)}
                                                    </EditableText>
                                                    <EditableText fieldKey={`req_card_${item.key}_title`} as="h4" className="text-lg md:text-xl font-bold mb-4">
                                                        {getField(`req_card_${item.key}_title`, item.title)}
                                                    </EditableText>
                                                    <EditableText fieldKey={`req_card_${item.key}_focus`} as="p" className="text-sm opacity-80 font-medium leading-relaxed">
                                                        {getField(`req_card_${item.key}_focus`, item.focus)}
                                                    </EditableText>
                                                </div>
                                                <ChevronRight className="mt-8 self-end" size={20} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8">
                                        <Button variant="link" onClick={() => navigate('/imat-exam-ultimate-guide-2026')} className="text-indigo-600 font-black p-0 h-auto group text-lg">
                                            <span>Prepare for the IMAT 2026 Entrance Exam</span>
                                            <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
                                        </Button>
                                    </div>
                                </section>

                                {/* Finances */}
                                <section id="finances" className="p-8 md:p-12 bg-white rounded-[2.5rem] md:rounded-[3rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-8 flex items-center gap-4">
                                        <Euro className="text-emerald-500" size={28} />
                                        The Real Cost of Studying in Italy
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                        <div className="space-y-8">
                                            <EditableText fieldKey="finance_desc" multiline as="p" className="text-base md:text-lg text-slate-600 leading-relaxed mb-4 md:mb-8">
                                                {getField('finance_desc', 'Italy is significantly more affordable than the UK, USA, or Australia. Public university fees are income-based and often as low as €156/year for qualifying students.')}
                                            </EditableText>
                                            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                                                <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                                                    <Star size={20} />
                                                    DSU Scholarship
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-white p-4 rounded-xl text-center">
                                                        <div className="text-xl md:text-2xl font-black text-emerald-600">€7,000</div>
                                                        <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Max Stipend</div>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-xl text-center">
                                                        <div className="text-xl md:text-2xl font-black text-indigo-600">Full</div>
                                                        <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Tuition Waiver</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Card className="p-8 border-slate-900 border-2 bg-slate-50 relative">
                                            <div className="space-y-6">
                                                {[
                                                    { label: 'Public Tuition', value: '€156 – €4,000 /yr' },
                                                    { label: 'Private Tuition', value: '€8,000 – €25,000 /yr' },
                                                    { label: 'Accommodation', value: '€300 – €800 /mo' },
                                                    { label: 'Food & Living', value: '€250 – €450 /mo' }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex justify-between items-center border-b border-slate-200 pb-4">
                                                        <span className="font-black text-slate-900 text-sm md:text-base">{item.label}</span>
                                                        <span className="text-base md:text-lg font-black text-indigo-600">{item.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button onClick={() => navigate('/study-in-italy/tuition-fees-2026')} className="w-full mt-8 bg-slate-900 text-white hover:bg-slate-800">
                                                Full Tuition Breakdown 2026
                                            </Button>
                                        </Card>
                                    </div>
                                </section>

                                {/* Application */}
                                <section id="application" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="bg-indigo-100 p-2 md:p-3 rounded-2xl">
                                            <GraduationCap className="text-indigo-600" size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl md:text-4xl font-black text-slate-900">Step-by-Step Application</h2>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            { key: 'step1', icon: BookOpen, title: 'Step 1: Choose Your Course & University', desc: 'Research English-taught programs on the UniversItaly.it portal. Compare universities by ranking, location, and tuition fee band. Shortlist 2-3 universities.' },
                                            { key: 'step2', icon: ShieldCheck, title: 'Step 2: Apply Directly to University', desc: 'Submit your application documents (transcripts, MOI/IELTS, CV) to the university\'s admissions portal. Secure your "Letter of Acceptance" or "Conditional Offer."' },
                                            { key: 'step3', icon: Globe, title: 'Step 3: Pre-Enroll on UniversItaly', desc: 'The mandatory Italian government portal. Upload your acceptance letter and personal details. This triggers the visa process at your nearest consulate.' },
                                            { key: 'step4', icon: Briefcase, title: 'Step 4: Get Your Degree Legalized', desc: 'Obtain a CIMEA Statement of Comparability or a Declaration of Value (DOV) from the Italian Embassy in your country to prove your previous degree is recognized.' },
                                            { key: 'step5', icon: MapPin, title: 'Step 5: Apply for Student Visa', desc: 'Book an appointment at the Italian Consulate or VFS Global. Present all documents. Visa processing typically takes 60-90 days.' }
                                        ].map((step, i) => (
                                            <div key={i} className="group bg-white p-6 md:p-8 rounded-[2rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transition-all flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                                                <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-indigo-50 transition-colors shrink-0">
                                                    <step.icon className="text-indigo-600" size={28} />
                                                </div>
                                                <div>
                                                    <EditableText fieldKey={`${step.key}_title`} as="h3" className="text-xl md:text-2xl font-black text-slate-900 mb-3 text-center md:text-left">
                                                        {getField(`${step.key}_title`, step.title)}
                                                    </EditableText>
                                                    <EditableText fieldKey={`${step.key}_desc`} multiline as="p" className="text-sm md:text-base text-slate-600 leading-relaxed font-medium text-center md:text-left">
                                                        {getField(`${step.key}_desc`, step.desc)}
                                                    </EditableText>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* FAQs */}
                                <section id="faqs" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8 md:mb-12">
                                        <div className="bg-slate-200 p-2 md:p-3 rounded-2xl">
                                            <HelpCircle className="text-slate-600" size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl md:text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {faqs.map((faq, i) => (
                                            <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transition-shadow">
                                                <div className="text-lg md:text-xl font-black text-slate-900 mb-4 flex gap-3 md:gap-4">
                                                    <span className="text-indigo-600 shrink-0">Q{i + 1}:</span>
                                                    <EditableText fieldKey={`faq_2026_q${i + 1}`} as="div">
                                                        {getField(`faq_2026_q${i + 1}`, faq.question)}
                                                    </EditableText>
                                                </div>
                                                <div className="text-slate-600 leading-relaxed font-medium pl-8 md:pl-12 border-l-2 border-slate-50 text-sm md:text-base">
                                                    <EditableText fieldKey={`faq_2026_a${i + 1}`} multiline as="div">
                                                        {getField(`faq_2026_a${i + 1}`, faq.answer)}
                                                    </EditableText>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* CTA Section */}

                                <CTASection fieldKeyPrefix="italy_guide_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout >
        </CmsPageWrapper >
    );
}
