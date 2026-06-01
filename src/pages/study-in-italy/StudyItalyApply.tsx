import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Globe,
    ShieldCheck,
    FileText,
    MapPin,
    GraduationCap,
    ClipboardList,
    ChevronRight,
    Sparkles,
    HelpCircle,
    CheckCircle2,
    Star,
    Grid,
    TrendingUp,
    Euro,
    CalendarDays
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
    { id: 'timeline', label: 'Timeline' },
    { id: 'documents', label: 'Documents' },
    { id: 'process', label: 'Step-by-Step' },
    { id: 'visa', label: 'Visa' },
    { id: 'faqs', label: 'FAQs' }
];


const faqs = [
    { question: 'When should I start applying to Italian universities for 2026?', answer: 'Ideally, begin research in September-October 2025. Most universities open applications for the 2026/27 academic year in February-March 2026. Pre-enrollment on UniversItaly opens around January.' },
    { question: 'What documents do I need to apply to an Italian university?', answer: 'The core documents are: Passport, secondary school certificate (translated + legalized), degree transcripts if applying for Master\'s, English proficiency certificate (IELTS/MOI), CV, and two letters of recommendation for postgraduate programs.' },
    { question: 'What is UniversItaly and is it mandatory?', answer: 'UniversItaly (universitaly.it) is the official Italian government pre-enrollment portal. It is mandatory for all non-EU students applying for a student visa to Italy.' },
    { question: 'What is a Declaration of Value (DOV)?', answer: 'A DOV is a document issued by the Italian Embassy in your country confirming that your previous degree is officially recognized by the Italian government. It is required for Master\'s applications.' },
    { question: 'Is there a CIMEA alternative to DOV?', answer: 'Yes. A CIMEA "Statement of Comparability" is a faster, university-approved alternative to the DOV. Most modern Italian universities accept CIMEA as their preferred document.' },
    { question: 'Do I need to take a language test for Italian-taught programs?', answer: 'Yes. If applying to an Italian-language program, a B2 level in Italian (typically CILS B2 or PLIDA B2) is required. English-taught programs require English proficiency instead.' },
    { question: 'How long does the Italian student visa take?', answer: 'Typically 60 to 90 days from the date of application. Students are strongly advised to book their consulate appointment as early as possible, ideally 3-4 months before intended travel.' },
    { question: 'What is the Type D student visa for Italy?', answer: 'The long-stay student visa (Type D) allows international students to stay in Italy for more than 90 days for the purpose of university study. It must be converted into a Permesso di Soggiorno (residence permit) within 8 days of arrival.' },
    { question: 'Can I apply to multiple Italian universities simultaneously?', answer: 'Yes. You can apply to multiple universities, and if accepted at more than one, you simply choose your preferred option. There is no national "clearing" system like in the UK.' },
    { question: 'Do I need to pay an application fee?', answer: 'Most Italian public universities charge a small application fee of €30 – €80. Some have free applications for international students. Private universities may charge higher application fees.' }
];

export default function StudyItalyApply() {
    const navigate = useNavigate();
    const { getField } = usePageContent('study-italy-apply');
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
        <CmsPageWrapper slug="study-italy-apply">
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
                    title="How to Apply & Italy Study Visa Requirements 2026"
                    description="A complete step-by-step guide on how international students can apply to Italian universities in 2026, from document preparation to Italy study visa requirements."
                    keywords="italy study visa requirements 2026, how to apply to Italian university, Italian university application process 2026, Italy student visa"
                    schemas={[getBreadcrumbSchema([
                        { name: 'Home', item: '/' },
                        { name: 'Study in Italy Guide', item: '/study-in-italy-guide-2026' },
                        { name: 'How to Apply in Italy', item: '/study-in-italy/how-to-apply' }
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
                                        {getField('hero_headline', 'How to Apply to Italian Universities')}
                                    </EditableText>
                                    <EditableText fieldKey="hero_subheadline" multiline as="p" className="text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_subheadline', 'The exact application process for international students in 2026 — from choosing your program to landing your student visa. Each step is documented and explained.')}
                                    </EditableText>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { label: 'Application Steps', value: '7 Steps', icon: ClipboardList },
                                            { label: 'Visa Duration', value: '60-90 Days', icon: CalendarDays },
                                            { label: 'App Fee', value: '€30 – €80', icon: Euro },
                                            { label: 'Intake Window', value: 'Feb – May', icon: Globe }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-4 md:p-6 rounded-2xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)] flex flex-col items-center text-center group hover:border-indigo-200 transition-colors">
                                                <item.icon className="text-indigo-600 mb-2 md:mb-3 group-hover:scale-110 transition-transform" size={20} />
                                                <div className="text-lg md:text-2xl font-black text-slate-900">{item.value}</div>
                                                <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-loose">
                                        <EditableText fieldKey="overview_p1" multiline as="p" className="mb-4">
                                            {getField('overview_p1', 'Applying to an Italian university as an international student is a structured, multi-step process that combines direct university applications with mandatory government pre-enrollment and consular visa procedures. This guide breaks the entire journey into clear, actionable steps.')}
                                        </EditableText>
                                        <EditableText fieldKey="overview_p2" multiline as="p">
                                            {getField('overview_p2', 'Unlike some countries, Italy does not have a centralized application system. You apply directly to each university and if accepted, use UniversItaly to trigger the visa process. This guide covers the full cycle from first research to arriving in Italy.')}
                                        </EditableText>
                                    </div>
                                </section>

                                {/* Timeline */}
                                <section id="timeline" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-2 md:p-3 rounded-2xl">
                                            <CalendarDays className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 underline decoration-indigo-400 underline-offset-8">2026 Application Timeline</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { key: 'research', title: 'Research Phase', weight: 'Sep – Nov 2025', focus: 'Shortlist universities and programs. Research entrance exams (IMAT, TOLC). Prepare a list of required documents.', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                                            { key: 'apply', title: 'Application Phase', weight: 'Jan – May 2026', focus: 'Submit applications to universities. Prepare and legalize academic documents. UniversItaly pre-enrollment opens in January.', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
                                            { key: 'visa', title: 'Visa Phase', weight: 'Mar – Aug 2026', focus: 'Book consulate appointment. Submit Type D visa application. Wait 60-90 days. Convert to Permesso di Soggiorno on arrival.', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
                                        ].map((item, i) => (
                                            <div key={i} className={`p-6 md:p-8 rounded-[2rem] border-2 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)] border-slate-900 ${item.color} flex flex-col justify-between h-full`}>
                                                <div>
                                                    <div className="text-lg md:text-xl font-black mb-2">{item.weight}</div>
                                                    <h4 className="text-lg md:text-xl font-bold mb-4">{item.title}</h4>
                                                    <p className="text-sm opacity-80 font-medium leading-relaxed">{item.focus}</p>
                                                </div>
                                                <ChevronRight className="mt-8 self-end" size={20} />
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Documents */}
                                <section id="documents" className="scroll-mt-40">
                                    <div className="bg-slate-900 text-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)]">
                                        <div className="absolute top-0 right-0 p-8 opacity-10"><FileText size={200} /></div>
                                        <div className="relative z-10">
                                            <h2 className="text-2xl md:text-4xl font-black mb-8 flex items-center gap-4">
                                                <FileText className="text-indigo-400" size={28} />
                                                {getField('docs_title', 'Essential Document Checklist')}
                                            </h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                                {[
                                                    { key: 'b1', text: 'Valid Passport: Must remain valid for at least 18 months beyond your expected enrollment date.' },
                                                    { key: 'b2', text: 'Academic Transcripts: Certified, translated into Italian or English, and authenticated (notarized/apostilled).' },
                                                    { key: 'b3', text: 'English Proficiency: IELTS, TOEFL, DET, or valid MOI certificate from your previous institution.' },
                                                    { key: 'b4', text: 'DOV or CIMEA: Declaration of Value OR CIMEA Statement of Comparability confirming your degree is recognized in Italy.' },
                                                    { key: 'b5', text: 'Motivation Letter: A 500-800 word statement explaining why you chose this program and university.' },
                                                    { key: 'b6', text: 'CV / Resume: Academic and professional history. Essential for Master\'s and PhD applications.' }
                                                ].map(({ key, text }) => (
                                                    <div key={key} className="flex items-start gap-3">
                                                        <CheckCircle2 className="text-indigo-400 shrink-0 mt-1" size={18} />
                                                        <EditableText fieldKey={`doc_bullet_${key}`} as="p" className="text-sm md:text-base font-medium opacity-90 leading-relaxed">
                                                            {getField(`doc_bullet_${key}`, text)}
                                                        </EditableText>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Application Process */}
                                <section id="process" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="bg-amber-100 p-2 md:p-3 rounded-2xl">
                                            <GraduationCap className="text-amber-600" size={28} />
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black text-slate-900">The 7-Step Application Process</h2>
                                    </div>
                                    <div className="space-y-6">
                                        {[
                                            { key: 's1', icon: Globe, title: 'Step 1: Research & Shortlist', desc: 'Visit universitaly.it and individual university websites. Identify English-taught programs that match your background. Shortlist 2-3 institutions. Check entrance exam requirements (IMAT, TOLC-I, TOLC-E).' },
                                            { key: 's2', icon: FileText, title: 'Step 2: Prepare Your Documents', desc: 'Collect academic transcripts, previous degree certificates, and a valid passport. Get all documents translated (if not in English/Italian) and officially authenticated or apostilled.' },
                                            { key: 's3', icon: ShieldCheck, title: 'Step 3: Take Entrance Exams (If Required)', desc: 'Medicine degrees require IMAT or CENT-S. Engineering uses TOLC-I. Business uses TOLC-E. Register early as exam slots fill quickly, especially for non-EU students applying from abroad.' },
                                            { key: 's4', icon: ClipboardList, title: 'Step 4: Apply Directly to University', desc: 'Submit your application via the university\'s online portal. Upload all required documents. Pay the application fee (€30-€80). You\'ll receive an offer letter upon acceptance.' },
                                            { key: 's5', icon: MapPin, title: 'Step 5: Pre-Enroll on UniversItaly', desc: 'Using your acceptance letter, register on universitaly.it. This is the government gateway that notifies the Italian Consulate in your country to begin the visa process.' },
                                            { key: 's6', icon: CalendarDays, title: 'Step 6: Apply for Student Visa (Type D)', desc: 'Book an appointment at the Italian Consulate or through VFS Global. Submit your visa application with all documents. Allow 60-90 days for processing. Do not book flights until the visa is confirmed.' },
                                            { key: 's7', icon: CheckCircle2, title: 'Step 7: Arrive & Register Residence', desc: 'Within 8 days of arrival, go to the nearest Questura (police station) to apply for your Permesso di Soggiorno (residence permit). Also register with your local Comune (municipality).' }
                                        ].map((step, i) => (
                                            <div key={i} className="group bg-white p-6 md:p-8 rounded-[2rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)] transition-all flex flex-col md:flex-row gap-6 items-start">
                                                <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-indigo-50 transition-colors shrink-0 relative">
                                                    <step.icon className="text-indigo-600" size={28} />
                                                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-indigo-600 text-white rounded-full text-xs font-black flex items-center justify-center">{i + 1}</div>
                                                </div>
                                                <div>
                                                    <EditableText fieldKey={`step_${step.key}_title`} as="h3" className="text-xl font-black text-slate-900 mb-2 md:mb-3 text-center md:text-left">
                                                        {getField(`step_${step.key}_title`, step.title)}
                                                    </EditableText>
                                                    <EditableText fieldKey={`step_${step.key}_desc`} multiline as="p" className="text-sm md:text-base text-slate-600 leading-relaxed font-medium text-center md:text-left">
                                                        {getField(`step_${step.key}_desc`, step.desc)}
                                                    </EditableText>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Visa */}
                                <section id="visa" className="p-8 md:p-12 bg-white rounded-[2.5rem] md:rounded-[3rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)]">
                                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-8 flex items-center gap-4">
                                        <ShieldCheck className="text-blue-500" size={28} />
                                        Student Visa Key Facts
                                    </h2>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Visa Type', value: 'Type D (Long Stay)' },
                                            { label: 'Processing Time', value: '60 – 90 Days' },
                                            { label: 'Residence Permit', value: 'Required within 8 days of arrival' },
                                            { label: 'Work Permission', value: '20 hrs/week during term' },
                                            { label: 'Financial Proof', value: '€6,000+ accessible funds' },
                                            { label: 'Validity', value: '1 Academic Year (Renewable Annually)' }
                                        ].map((row, i) => (
                                            <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-4">
                                                <span className="font-black text-slate-900 text-sm md:text-base">{row.label}</span>
                                                <span className="text-indigo-600 font-bold text-sm md:text-base">{row.value}</span>
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
                                        <h2 className="text-2xl md:text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
                                    </div>
                                    <div className="space-y-6">
                                        {faqs.map((faq, i) => (
                                            <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)] transition-shadow">
                                                <div className="text-lg md:text-xl font-black text-slate-900 mb-4 flex gap-3 md:gap-4">
                                                    <span className="text-indigo-600 shrink-0">Q{i + 1}:</span>
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

                                <CTASection fieldKeyPrefix="italy_apply_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


