import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    ShieldCheck,
    CheckCircle2,
    XCircle,
    FileCheck,
    Globe2,
    AlertCircle,
    ChevronRight,
    Search,
    BookOpen,
    Scale,
    Zap,
    Star,
    Grid,
    Globe,
    HelpCircle,
    Activity,
    ArrowRight,
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
import PageNavigation from '@/components/exams/PageNavigation';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'pillars', label: 'Eligibility Pillars' },
    { id: 'checklist', label: 'Checklist' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'What is the 12-year schooling rule in Italy?', answer: 'To enroll in an Italian university, you must have completed at least 12 years of formal education. This usually means high school graduation following 12 years of school.' },
    { question: 'Can I apply if my country has an 11-year school system?', answer: 'Yes, but you must bridge the 1-year gap. This can be done through 1 year of university credits, an Italian "Foundation Year," or an International Foundation program.' },
    { question: 'What is a Declaration of Value (DoV)?', answer: 'A DoV is an official document issued by the Italian Consulate in your country that confirms the validity of your educational qualifications for the Italian system.' },
    { question: 'Do I need a language certificate for IMAT?', answer: 'Since the IMAT is in English, most universities do not require a separate English certificate for admission, but some may ask for B2 level proof for visa purposes.' },
    { question: 'Is there a minimum GPA for IMAT eligibility?', answer: 'The Italian Ministry (MUR) does not set a minimum high school GPA for IMAT entry. Your admission depends entirely on your IMAT score and fulfilling legal requirements.' },
    { question: 'What is the CIMEA comparability statement?', answer: 'CIMEA is an alternative to the DoV. It is a digital certificate of comparability for your diploma, often processed faster and accepted by most Italian medical schools.' },
    { question: 'Are there age limits for taking the IMAT?', answer: 'No, there are no official age limits. As long as you have a valid high school diploma, you are eligible to sit the exam.' },
    { question: 'Do Non-EU students have the same eligibility?', answer: 'The academic requirements are the same, but Non-EU students have additional visa, pre-enrollment via Universitaly, and quota-based admission steps.' },
    { question: 'What happens if I miss the 12-year requirement?', answer: 'If you fail to prove 12 years of education, your enrollment will be canceled by the university registrar, even if you passed the IMAT exam.' },
    { question: 'Can I take the IMAT while in my final year of high school?', answer: 'Yes, you can take the exam if you expect to receive your diploma before the enrollment deadline in October/November of the exam year.' }
];

export default function ImatEligibility() {
    const navigate = useNavigate();
    const { getField } = usePageContent('imat-eligibility-criteria-2026');
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
        <CmsPageWrapper slug="imat-eligibility-criteria-2026">
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
                    title="IMAT Eligibility Criteria 2026 – Requirements for International Students"
                    description="Official 2026 eligibility requirements for IMAT. Detailed guide on 12-year school requirement, Apostille, and declaration of value for medicine in Italy."
                    keywords="IMAT eligibility 2026, 12 years of education italy, apostille for italy medical school, declaration of value italy, CIMEA vs DoV"
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
                                        {getField('hero_headline', 'IMAT Eligibility Criteria 2026')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "Qualification is more than just a score. This compliance guide breaks down the mandatory legal and academic pillars for admission.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'schooling', label: 'Schooling', value: '12 Years', icon: BookOpen },
                                            { key: 'academic', label: 'Academic', value: 'Diploma', icon: Star },
                                            { key: 'legal', label: 'Legal', value: 'DoV/CIMEA', icon: Scale },
                                            { key: 'visa', label: 'Visa', value: 'Compliant', icon: Globe }
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

                                {/* Eligibility Pillars */}
                                <section id="pillars" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Scale className="text-indigo-600" size={32} />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900">The 3 Pillars of Qualification</h2>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {[
                                            { title: 'Academic', value: '12 Years Schooling', desc: 'Mandatory formal education span required by Italian law.', icon: BookOpen, color: 'text-indigo-600' },
                                            { title: 'Legal', value: 'Apostille / DoV', desc: 'Consular verification of your high school documents.', icon: FileCheck, color: 'text-emerald-600' },
                                            { title: 'Language', value: 'B2 Proficiency', desc: 'Common visa requirement for Non-EU medical students.', icon: Globe2, color: 'text-rose-600' }
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

                                {/* Checklist */}
                                <section id="checklist" className="scroll-mt-40">
                                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="bg-emerald-100 p-3 rounded-2xl">
                                                <CheckCircle2 className="text-emerald-600" size={24} />
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-900">Mandatory Compliance Checklist</h3>
                                        </div>
                                        <div className="space-y-8">
                                            {[
                                                { title: '12-Year School Requirement', desc: 'If your country has a 10 or 11-year system, you must bridge the gap with university credits or a Foundation Year.' },
                                                { title: 'Universitaly Pre-Enrollment', desc: 'Mandatory digital registration on the ministerial portal (usually June-July) for all Non-EU students.' },
                                                { title: 'National Entrance Exam', desc: 'If your home country requires an exam for university entry (e.g. NEET), you must provide proof of passing.' },
                                                { title: 'Passport Validity', desc: 'Passport must be valid for at least 6 months beyond your expected date of arrival in Italy.' }
                                            ].map((req, i) => (
                                                <div key={i} className="flex gap-6 items-start group">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors text-emerald-600">
                                                        <CheckCircle2 size={18} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-bold text-slate-900 mb-2">{req.title}</h4>
                                                        <p className="text-slate-500 font-medium leading-relaxed">{req.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* Compliance (Dark) */}
                                <section id="compliance" className="scroll-mt-40">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Zap size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl font-black mb-8 flex items-center gap-4">
                                                <AlertCircle className="text-amber-500" />
                                                The "Non-EU" Eligibility Trap
                                            </h2>
                                            <p className="text-xl text-slate-300 leading-relaxed font-medium mb-12 max-w-3xl">
                                                If you are a Non-EU student but have been living in Italy for more than 12 months with a regular stay permit, you are legally an EU applicant. Registering incorrectly will lead to immediate disqualification.
                                            </p>
                                            <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-3xl backdrop-blur-sm">
                                                <h4 className="text-amber-500 font-black text-xl mb-3">11-Year System Exception</h4>
                                                <p className="text-slate-300 font-medium leading-relaxed">
                                                    Diplomas obtained after 11 years CANNOT enroll directly. You must bridge with an Italian Foundation Year or provide 60 ECTS credits from a local university.
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

                                <CTASection fieldKeyPrefix="imat_eligibility_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}

