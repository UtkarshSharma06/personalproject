import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import {
    GraduationCap,
    CheckCircle2,
    Globe,
    AlertCircle,
    ChevronRight,
    HelpCircle,
    FileText,
    ShieldCheck,
    Languages,
    FileCheck2,
    Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import FAQSchema from '@/components/seo/FAQSchema';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import { tolcLinks } from '@/lib/nav-links';
import PageNavigation from '@/components/exams/PageNavigation';

const sections = [
    { id: 'overview', label: 'Eligibility Overview' },
    { id: 'academic', label: 'Academic Requirements' },
    { id: 'international', label: 'Non-EU & International' },
    { id: 'language', label: 'Language Requirements' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'Do I need a specific high school diploma to take the TOLC?', answer: 'No. Any high school diploma that is recognized by the Italian Ministry of Education (providing at least 12 years of overall schooling) makes you eligible to take the test and subsequently enroll in university.' },
    { question: 'Can I take the TOLC in my 4th year of high school?', answer: 'Yes! CISIA explicitly allows students in their penultimate (4th) year of high school to take the TOLC. In many cases, universities will accept this score for early admission (Ammissione Anticipata) for the following year.' },
    { question: 'Do I need a science background to take TOLC-MED or TOLC-I?', answer: 'From a legal standpoint, no. You can hold a diploma in humanities or arts and still take the medical or engineering TOLC. However, passing the exam will be extremely difficult without rigorous independent study of the scientific syllabus.' },
    { question: 'I am a Non-EU student. Can I take the TOLC?', answer: 'Yes, Non-EU students can absolutely take the TOLC. However, your admission is also subject to the specific "Extra-EU Quotas" (contingente posti) set by the university, and you must complete the pre-enrollment process via Universitaly.' },
    { question: 'Do I need an IELTS or TOEFL certificate if the TOLC has an English section?', answer: 'If you are applying to an English-taught degree, the university will almost certainly require a separate recognized English certificate (like IELTS 5.5 or 6.0). The 30-question English section on the TOLC is generally not sufficient to prove B2 proficiency for admission purposes.' },
    { question: 'What is a Declaration of Value (DOV)?', answer: 'If you graduated high school outside of Italy, the DOV is an official document issued by the Italian embassy in your country proving that your foreign diploma meets the Italian standard (12 years of schooling). You usually need this for final enrollment, not to take the TOLC.' },
    { question: 'Is there an age limit to take the TOLC?', answer: 'No. There is absolutely no upper age limit. As long as you possess a valid high school diploma, you are eligible to take the exam and apply for university.' },
    { question: 'My high school only took 11 years. Am I eligible?', answer: 'If your country\'s educational system only requires 11 years (e.g., some systems in South America or Eastern Europe), you cannot enroll directly. You must complete a 1-year Foundation Course in Italy, or complete 1 year of university in your home country before you are eligible.' },
    { question: 'Does a high TOLC score guarantee a visa for Non-EU students?', answer: 'No. The university admission (via TOLC) and the student visa (issued by the embassy) are two separate processes. However, an acceptance letter from the university based on your TOLC score is the primary prerequisite for applying for the visa.' },
    { question: 'Can I use a TOLC taken in Italian to apply for an English-taught degree?', answer: 'No. If the degree program is taught in English, you must usually take the specific "English TOLC" variant (e.g., English TOLC-I or English TOLC-E) as explicitly stated in the university\'s Call for Admission.' }
];

export default function TolcEligibility() {
    const { getField } = usePageContent('tolc-eligibility-2026');
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
        <CmsPageWrapper slug="tolc-eligibility-2026">
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
                    title="TOLC Exam Eligibility Criteria 2026 for EU & Non-EU Students"
                    description="Find out if you are eligible to take the TOLC exam in 2026. Complete guide on academic requirements, 12-year schooling rules, DOV, and Non-EU regulations."
                    keywords="TOLC eligibility, who can take TOLC, TOLC requirements non-EU, 12 years schooling Italy, DOV Italy, TOLC age limit"
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
                                        <ShieldCheck size={12} className="text-indigo-600" />
                                        Official CISIA & MUR Guidelines
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                                        {getField('hero_headline', 'TOLC Eligibility & Requirements 2026')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "Taking the TOLC test is surprisingly open; almost anyone can register and sit for the exam. However, actually using that score to successfully enroll in an Italian university requires meeting strict bureaucratic and academic prerequisites set by the Italian Ministry of University and Research (MUR). This page details exactly what academic qualifications you need, how international diplomas are evaluated, and the specific quotas for Non-EU applicants.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'schooling', label: 'Minimum Schooling', value: '12 Years', icon: GraduationCap },
                                            { key: 'age', label: 'Age Limit', value: 'None', icon: Target },
                                            { key: 'status', label: 'Open To', value: 'Global', icon: Globe },
                                            { key: 'test', label: 'Early Testing', value: 'Allowed', icon: CheckCircle2 }
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

                                {/* Academic Requirements */}
                                <section id="academic" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-emerald-100 p-3 rounded-2xl">
                                            <FileText className="text-emerald-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Core Academic Requirements</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold text-slate-800 border-b pb-2">The "12-Year Rule"</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                                The most rigid requirement for entering any Italian university (via TOLC or otherwise) is the 12-year schooling rule. Your primary and secondary education combined must equal at least 12 years of continuous study culminating in a valid high school diploma.
                                            </p>
                                            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                                                <h4 className="font-bold text-emerald-900 mb-2">What if I only have 11 years?</h4>
                                                <p className="text-sm text-emerald-800 leading-relaxed">
                                                    You are NOT eligible for direct university enrollment. You must bridge the gap by either completing a 1-year Foundation Course (Foundation Year) in Italy, or completing one full year of university in your home country before applying to Italy.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold text-slate-800 border-b pb-2">High School Year 4 & 5</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                                CISIA strongly encourages early testing. You do not need to wait until you graduate to take the TOLC.
                                            </p>
                                            <ul className="space-y-3 text-sm text-slate-700">
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                                                    <span><strong>Penultimate Year (4th Year):</strong> You can take the test and "bank" your score. Many universities allow you to use this score for early enrollment (Ammissione Anticipata) the following year.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                                                    <span><strong>Final Year (5th Year):</strong> This is the standard testing period. You take the test while completing your diploma to secure a spot for the upcoming autumn intake.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* International Students */}
                                <section id="international" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Globe size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl font-black mb-8 flex items-center gap-4">
                                                <Globe className="text-indigo-400" />
                                                Non-EU & International Bureaucracy
                                            </h2>
                                            <p className="text-xl text-slate-300 leading-relaxed font-medium mb-12 max-w-3xl">
                                                Taking the test is easy. Proving your qualifications to the Italian government is hard. If your high school diploma was issued outside of Italy, you must navigate a specific bureaucratic pipeline.
                                            </p>
                                            
                                            <div className="space-y-6">
                                                <div className="flex flex-col md:flex-row gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl">
                                                    <div className="md:w-1/3 border-r border-white/10 pr-6">
                                                        <h4 className="text-xl font-bold text-amber-400">Step 1: Universitaly</h4>
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Pre-Enrollment</p>
                                                    </div>
                                                    <div className="md:w-2/3">
                                                        <p className="text-slate-300 text-sm leading-relaxed">
                                                            All Non-EU students requiring a visa must register on the official <strong>Universitaly.it</strong> portal. This is where you declare your intention to study in Italy and select your chosen university and degree program. This step is entirely separate from booking your TOLC on the CISIA website.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col md:flex-row gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl">
                                                    <div className="md:w-1/3 border-r border-white/10 pr-6">
                                                        <h4 className="text-xl font-bold text-rose-400">Step 2: The DOV or CIMEA</h4>
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Value Verification</p>
                                                    </div>
                                                    <div className="md:w-2/3">
                                                        <p className="text-slate-300 text-sm leading-relaxed">
                                                            You must prove your foreign diploma is valid. You need either a <strong>Declaration of Value (DOV)</strong> from the Italian Embassy in your country, or a <strong>Statement of Comparability</strong> issued by CIMEA. Without one of these, you cannot finalize enrollment, even if you score a perfect 50/50 on the TOLC.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Language Requirements */}
                                <section id="language" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-amber-100 p-3 rounded-2xl">
                                            <Languages className="text-amber-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Language Certifications</h2>
                                    </div>
                                    <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100">
                                        <h4 className="text-xl font-bold text-amber-900 mb-4">English vs Italian Taught Degrees</h4>
                                        <p className="text-sm text-amber-800 leading-relaxed mb-6 font-medium">
                                            The TOLC exam you take dictates the language of instruction. However, passing the TOLC is rarely enough to prove linguistic competency to the university.
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="p-6 bg-white rounded-xl shadow-sm">
                                                <div className="font-black text-slate-900 mb-2">Italian Degrees (e.g., TOLC-I)</div>
                                                <p className="text-xs text-slate-600 leading-relaxed">
                                                    Non-EU students are generally required to possess a B2 level Italian language certificate (CILS, CELI) or pass an Italian language test administered by the university before they are allowed to sit the TOLC or enroll.
                                                </p>
                                            </div>
                                            <div className="p-6 bg-white rounded-xl shadow-sm">
                                                <div className="font-black text-slate-900 mb-2">English Degrees (e.g., English TOLC-E)</div>
                                                <p className="text-xs text-slate-600 leading-relaxed">
                                                    Universities typically require an external English certificate like IELTS (usually 5.5 or 6.0) or TOEFL. The 30-question English section at the end of the TOLC is for internal assessment (OFA), not for official visa/admission clearance.
                                                </p>
                                            </div>
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

                                <CTASection fieldKeyPrefix="tolc_eligibility_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}
