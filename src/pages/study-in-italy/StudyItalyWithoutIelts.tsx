import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Globe,
    ShieldCheck,
    FileText,
    ChevronRight,
    Sparkles,
    HelpCircle,
    CheckCircle2,
    ArrowRight,
    Star,
    Grid,
    TrendingUp,
    Euro,
    CalendarDays,
    Users,
    BookOpen
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import FAQSchema from '@/components/seo/FAQSchema';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import PageNavigation from '@/components/exams/PageNavigation';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'moi', label: 'MOI Certificate' },
    { id: 'exemptions', label: 'Exemptions' },
    { id: 'alternatives', label: 'Alternatives' },
    { id: 'visa', label: 'Visa Without IELTS' },
    { id: 'faqs', label: 'FAQs' }
];


const faqs = [
    { question: 'Can I study in Italy without IELTS in 2026?', answer: 'Yes. Many Italian universities waive the IELTS requirement if you provide a Medium of Instruction (MOI) certificate proving your previous degree was entirely taught in English.' },
    { question: 'Which universities in Italy accept MOI?', answer: 'Major universities like the University of Milan, University of Bologna, and University of Pavia often accept MOI certificates for programs taught in English. Always check the specific "Call for Applications" (Bando).' },
    { question: 'Is Duolingo accepted by Italian universities?', answer: 'Yes, an increasing number of Italian universities and consulates accept the Duolingo English Test (DET) as a faster, more affordable alternative to IELTS.' },
    { question: 'Can I get a student visa without IELTS?', answer: 'Yes. If the university has issued an admission letter based on an MOI or alternative test, the consulate will generally process the visa. Policies vary by country, so verify with your local Italian consulate.' },
    { question: 'What score do I need in Duolingo for Italy?', answer: 'Most Italian universities that accept DET require a score of 105-120 as equivalent to B2 English proficiency, but requirements vary. Always check the specific university\'s Bando.' },
    { question: 'Is TOEFL accepted in Italy instead of IELTS?', answer: 'Yes, TOEFL iBT is widely accepted across Italian universities, often with a minimum score of 80. It is a strong alternative to IELTS.' },
    { question: 'Can native English speakers skip the language requirement?', answer: 'In most cases, yes. Citizens of USA, UK, Canada, Australia, New Zealand, and Ireland are typically exempt from English proficiency requirements.' },
    { question: 'What is an MOI certificate and how do I get one?', answer: 'An MOI (Medium of Instruction) certificate is a signed, stamped letter from your previous university\'s registrar stating that your degree was taught entirely in English. Request it from your university\'s administrative office.' },
    { question: 'Is the Italian consulate strict about English proof?', answer: 'Consulates vary. Some are very lenient and only check the university\'s admission letter, while others may conduct an English language interview. Best practice is to have both an MOI and a backup test score.' },
    { question: 'Does the DSU scholarship require IELTS?', answer: 'No. The DSU scholarship is based entirely on financial need (ISEE) and academic merit. English proficiency is not a factor in scholarship eligibility.' }
];

export default function StudyItalyWithoutIelts() {
    const navigate = useNavigate();
    const { getField } = usePageContent('study-italy-no-ielts');
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;
            for (const section of sections) {
                const el = document.getElementById(section.id);
                if (el && el.offsetTop <= scrollPosition && el.offsetTop + el.offsetHeight > scrollPosition) {
                    setActiveSection(section.id);
                    break;
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    };

    return (
        <CmsPageWrapper slug="study-italy-no-ielts">
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
                    title="Study in Italy Without IELTS 2026 – Requirements & Visa Guide"
                    description="Can you study in Italy without IELTS? Yes! Discover how to get admission and a study visa in Italy using MOI certificates, Duolingo, or native speaker exemptions in 2026."
                    keywords="study in italy without ielts 2026, italy study visa without ielts, study in italy without ielts, can i study in italy without ielts, study in italy for international students without ielts, italian universities without ielts, study in italy requirements 2026"
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
                                    <EditableText fieldKey="hero_headline" as="h1" className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6 md:mb-8">
                                        {getField('hero_headline', 'Study in Italy Without IELTS')}
                                    </EditableText>
                                    <EditableText fieldKey="hero_subheadline" multiline as="p" className="text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_subheadline', 'IELTS is not mandatory for most Italian universities. Over 70% of public universities accept an MOI certificate or alternative tests. This guide tells you exactly how to qualify.')}
                                    </EditableText>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'uni', label: 'Uni Accept MOI', value: '70%+', icon: ShieldCheck },
                                            { key: 'alt', label: 'Alternatives', value: '4 Options', icon: FileText },
                                            { key: 'native', label: 'Exempt Nations', value: '6+', icon: Globe },
                                            { key: 'visa', label: 'Visa Without IELTS', value: 'Yes', icon: CheckCircle2 }
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
                                            {getField('overview_p1', 'Italy has intentionally lowered barriers for English-speaking international students. The MOI certificate system was designed to allow graduates of English-taught programs worldwide to study in Italy without needing to retake an English language test they have already implicitly passed through their degree.')}
                                        </EditableText>
                                        <EditableText fieldKey="overview_p2" multiline as="p" className="mb-6">
                                            {getField('overview_p2', 'This guide covers every legitimate pathway: the MOI route, statutory national exemptions, alternative tests, and what to expect at the consulate when you don\'t have IELTS.')}
                                        </EditableText>
                                        <p className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-900 font-medium text-base">
                                            <span className="font-bold">📚 Required Entrance Exams:</span> Remember that even if you are exempt from the IELTS English requirement, you will still need to pass your academic entrance exams. Ensure you are fully prepared for the <Link to="/imat-exam-ultimate-guide" className="text-indigo-600 font-bold hover:underline">IMAT (for Medicine)</Link> or the <Link to="/cent-s-exam-ultimate-guide" className="text-indigo-600 font-bold hover:underline">CEnT-S (for Engineering & Science)</Link>.
                                        </p>
                                    </div>
                                </section>

                                {/* MOI Section */}
                                <section id="moi" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-amber-100 p-2 md:p-3 rounded-2xl">
                                            <FileText className="text-amber-600" size={28} />
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 underline decoration-amber-400 underline-offset-8">
                                            {getField('moi_title', 'The MOI Certificate Pathway')}
                                        </h2>
                                    </div>
                                    <div className="prose prose-lg text-slate-600 mb-8 max-w-none">
                                        <EditableText fieldKey="moi_desc" multiline as="p">
                                            {getField('moi_desc', 'An MOI (Medium of Instruction) certificate is the most widely used alternative to IELTS for Italian university admissions. It is a formal document from your previous university confirming your degree was conducted in English.')}
                                        </EditableText>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { key: 'auth', title: 'Authenticity', weight: 'Required', focus: 'Must be signed and stamped by the university registrar. Cannot be self-issued.', color: 'bg-amber-50 text-amber-700 border-amber-100' },
                                            { key: 'dur', title: 'Duration', weight: 'Minimum 3 Years', focus: 'Must cover at least 3 years of English-taught study, not individual courses.', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                                            { key: 'lang', title: 'Language', weight: 'Explicit Statement', focus: 'Must explicitly state that English was the sole / primary medium of instruction.', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' }
                                        ].map((item, i) => (
                                            <div key={i} className={`p-6 md:p-8 rounded-[2rem] border-2 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)] border-slate-900 ${item.color} flex flex-col justify-between h-full`}>
                                                <div>
                                                    <div className="text-xl md:text-2xl font-black mb-2">{item.weight}</div>
                                                    <h4 className="text-lg md:text-xl font-bold mb-4">{item.title}</h4>
                                                    <p className="text-sm opacity-80 font-medium leading-relaxed">{item.focus}</p>
                                                </div>
                                                <ChevronRight className="mt-8 self-end" size={20} />
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Who is Exempt */}
                                <section id="exemptions" className="scroll-mt-40">
                                    <div className="bg-slate-900 text-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)]">
                                        <div className="absolute top-0 right-0 p-8 opacity-10"><Globe size={200} /></div>
                                        <div className="relative z-10">
                                            <h2 className="text-2xl md:text-4xl font-black mb-8 flex items-center gap-4">
                                                <Globe className="text-indigo-400" size={28} />
                                                {getField('exempt_title', 'Who Is Automatically Exempt?')}
                                            </h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                                {[
                                                    { key: 'b1', text: 'Citizens of the USA, UK, Canada, Australia, New Zealand, and Ireland are fully exempt from all English language requirements.' },
                                                    { key: 'b2', text: 'Students who completed their previous Bachelor\'s or Master\'s entirely in an English-speaking country.' },
                                                    { key: 'b3', text: 'Students who completed IB Diploma Programme, A-Levels, or an American High School Diploma are often considered English-proficient.' },
                                                    { key: 'b4', text: 'Some Italian universities conduct internal English assessments during admission interviews, bypassing external tests entirely.' }
                                                ].map(({ key, text }) => (
                                                    <div key={key} className="flex items-start gap-3">
                                                        <CheckCircle2 className="text-indigo-400 shrink-0 mt-1" size={18} />
                                                        <EditableText fieldKey={`exempt_bullet_${key}`} as="p" className="text-sm md:text-base font-medium opacity-90 leading-relaxed">
                                                            {getField(`exempt_bullet_${key}`, text)}
                                                        </EditableText>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Alternatives */}
                                <section id="alternatives" className="p-8 md:p-12 bg-white rounded-[2.5rem] md:rounded-[3rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)]">
                                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-8 flex items-center gap-4">
                                        <BookOpen className="text-blue-500" size={28} />
                                        English Test Alternatives 2026
                                    </h2>
                                    <div className="space-y-6">
                                        {[
                                            { key: 'duo', icon: Sparkles, title: 'Duolingo English Test (DET)', desc: 'Fast (1 hour), affordable (~$65), and accepted by an increasing number of Italian universities. Score of 105-120 is typically required for B2 level.', status: 'Widely Accepted' },
                                            { key: 'toefl', icon: FileText, title: 'TOEFL iBT', desc: 'High global recognition. A minimum score of 79-80 is generally expected. Most Italian university portals have an explicit TOEFL acceptance policy.', status: 'Fully Accepted' },
                                            { key: 'oxford', icon: Globe, title: 'Oxford Test of English', desc: 'Becoming popular in European admissions. Accepted by selected Italian institutions as a B2/C1 proof for English-taught programs.', status: 'Accepted by Select Universities' },
                                            { key: 'internal', icon: Users, title: 'Internal University Interview', desc: 'Some universities (e.g., certain engineering faculties) conduct their own English level assessment as part of the admissions interview. No external test needed.', status: 'University-Dependent' }
                                        ].map((item, i) => (
                                            <div key={i} className="group bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all flex flex-col md:flex-row gap-6 items-start">
                                                <div className="bg-white p-4 rounded-2xl group-hover:bg-indigo-50 transition-colors shrink-0 mx-auto md:mx-0">
                                                    <item.icon className="text-indigo-600" size={28} />
                                                </div>
                                                <div>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                                                        <h3 className="text-xl font-black text-slate-900 text-center md:text-left">{item.title}</h3>
                                                        <span className="text-[10px] md:text-xs bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full w-max mx-auto md:mx-0">{item.status}</span>
                                                    </div>
                                                    <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium text-center md:text-left">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Visa Without IELTS */}
                                <section id="visa" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-emerald-100 p-2 md:p-3 rounded-2xl">
                                            <ShieldCheck className="text-emerald-600" size={28} />
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black text-slate-900">Visa Without IELTS: Key Rules</h2>
                                    </div>
                                    <div className="space-y-6">
                                        {[
                                            { key: 's1', icon: ShieldCheck, title: 'Step 1: Get Your Acceptance Letter', desc: 'The university\'s acceptance letter is your most powerful visa document. If it was issued without requiring IELTS, the consulate takes that as implicit English proof.' },
                                            { key: 's2', icon: FileText, title: 'Step 2: Pre-Enroll on UniversItaly', desc: 'The Italian government portal validates your acceptance and notifies the consulate. This is mandatory for all Type D student visa applications.' },
                                            { key: 's3', icon: Globe, title: 'Step 3: Be Ready for a Consulate Interview', desc: 'Some consulates may conduct a brief English conversation to satisfy themselves of your language ability. Prepare for basic questions about your academic plans.' },
                                            { key: 's4', icon: CheckCircle2, title: 'Step 4: Show Financial Proof', desc: 'Regardless of English requirements, you must show €6,000+ in accessible funds for the year. Bank statements or scholarship letters work.' }
                                        ].map((step, i) => (
                                            <div key={i} className="group bg-white p-6 md:p-8 rounded-[2rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)] transition-all flex flex-col md:flex-row gap-6 items-start">
                                                <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-indigo-50 transition-colors shrink-0 mx-auto md:mx-0">
                                                    <step.icon className="text-indigo-600" size={28} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-900 mb-2 text-center md:text-left">{step.title}</h3>
                                                    <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium text-center md:text-left">{step.desc}</p>
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

                                <CTASection fieldKeyPrefix="italy_ielts_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


