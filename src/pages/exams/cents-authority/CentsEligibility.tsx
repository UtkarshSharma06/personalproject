import React from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import {
    ShieldCheck,
    GraduationCap,
    Globe,
    CheckCircle2,
    Zap,
    Scale,
    AlertCircle,
    ChevronRight,
    Search,
    HelpCircle,
    Sparkles,
    Activity
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
    { id: 'academic-reqs', label: 'Academic Reqs' },
    { id: 'intl-students', label: 'International' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'Who can take the CENT-S exam?', answer: 'Anyone who holds a high school diploma or is in their final year of high school (Grade 12 or 13) can register for the CENT-S.' },
    { question: 'Do I need to speak Italian for the CENT-S?', answer: 'No. The CENT-S is specifically the English-language version of the entrance test, designed for English-taught STEM and Economics degrees.' },
    { question: 'Is there an age limit for the CENT-S?', answer: 'No. There is no upper age limit for university entrance in Italy, provided you meet the academic requirements.' },
    { question: 'What academic documents do I need?', answer: 'You typically need your final high school diploma and a "Declaration of Value" or CIMEA Statement of Comparability to prove your degree is valid in Italy.' },
    { question: 'Can I take the CENT-S if I already have a degree?', answer: 'Yes. Students with previous degrees can sit the exam to apply for a second Bachelor\'s or a Single-Cycle Master\'s degree.' },
    { question: 'Does my high school GPA affect eligibility?', answer: 'Generally, no. Admission is based almost entirely on your CENT-S ranking. However, some scholarships may consider your previous academic performance.' },
    { question: 'Are Non-EU students eligible for CENT-S?', answer: 'Yes. Non-EU students residing abroad must follow the "Visa" quota and pre-enroll on the Universitaly portal, in addition to taking the CENT-S.' },
    { question: 'What if my high school is only 11 years?', answer: 'Italy requires 12 years of schooling. If your country has an 11-year system, you must bridge the gap with a Foundation Year or one year of university studies.' },
    { question: 'Do I need an English certificate like IELTS?', answer: 'Most universities require a B2 level of English. Some accept the CENT-S score itself as proof, while others require a separate certificate (IELTS 6.0+ or TOEFL equivalent).' },
    { question: 'Is the CENT-S valid for medical schools?', answer: 'No. The CENT-S is for STEM and some Economics programs. For Medicine in English, you must take the IMAT.' }
];

export default function CentsEligibility() {
    const { getField } = usePageContent('cent-s-eligibility-2026');
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
        <CmsPageWrapper slug="cent-s-eligibility-2026">
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
                    title="CENT-S Eligibility 2026: Academic & Legal Requirements"
                    description="Official eligibility criteria for CENT-S 2026. High school requirements, 12-year schooling rule, English proficiency, and Non-EU visa regulations for Italian STEM degrees."
                    keywords="cent-s eligibility 2026, study italy requirements, cisia entry criteria, stem italy visa requirements, 12 year schooling italy"
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
                                        {getField('hero_headline', 'CENT-S 2026 Eligibility Criteria')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "Before booking your slot, ensure you meet the legal and academic requirements for enrollment in an Italian university.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'school', label: 'Schooling', value: '12 Years', icon: GraduationCap },
                                            { key: 'lang', label: 'Language', value: 'B2 English', icon: Globe },
                                            { key: 'visa', label: 'Visa Quota', value: 'Non-EU', icon: ShieldCheck },
                                            { key: 'status', label: 'Status', value: 'Open 2026', icon: CheckCircle2 }
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

                                {/* Academic Reqs */}
                                <section id="academic-reqs" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <GraduationCap className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Academic Entry Requirements</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <Card className="p-8 border-slate-900 border-2 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] bg-white overflow-hidden relative group">
                                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                                                <GraduationCap size={150} />
                                            </div>
                                            <h4 className="text-slate-900 font-black mb-4">The "12-Year" Rule</h4>
                                            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
                                                To sit the CENT-S, candidates must hold - or be in the final year of completing - a secondary school diploma (12 years of schooling) equivalent to the Italian <em>Diploma di Maturità</em>. This is the entry gate for Bachelor's (Laurea) and Single-Cycle (Laurea Magistrale) degrees in STEM and Economics.
                                            </p>
                                            <div className="bg-amber-50 p-4 rounded-xl text-xs font-bold text-amber-800 flex items-center gap-2">
                                                <AlertCircle size={16} /> If you have 11 years, you need a Foundation Year.
                                            </div>
                                        </Card>
                                        <div className="space-y-6">
                                            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                                                <h4 className="font-black text-slate-900 mb-2 flex items-center gap-2">
                                                    <Globe className="text-indigo-600" size={18} />
                                                    Language Proficiency
                                                </h4>
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                                    Most universities require a minimum B2 English level. While many accept the CENT-S as implicit proof, some specific "Bandi" (Calls) require a separate IELTS 6.0+ or TOEFL certificate.
                                                </p>
                                            </div>
                                            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                                                <h4 className="font-black text-slate-900 mb-2 flex items-center gap-2">
                                                    <Activity className="text-rose-600" size={18} />
                                                    Entry Threshold
                                                </h4>
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                                    There is no fixed minimum GPA for entry. Your eligibility for a seat depends entirely on your position in the national/local ranking of the CENT-S scores.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Intl Students */}
                                <section id="intl-students" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5"><Globe size={200} /></div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl font-black mb-8">Non-EU Student Eligibility</h2>
                                            <p className="text-xl text-slate-300 leading-relaxed font-medium mb-12 max-w-3xl">
                                                International students residing abroad must follow the specific **Visa Quota** path. This involves a mandatory pre-enrollment on Universitaly.it before sitting the CENT-S.
                                            </p>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                                                    <ShieldCheck size={32} className="text-indigo-400 mb-4" />
                                                    <h4 className="text-xl font-black mb-2">DOV & CIMEA</h4>
                                                    <p className="text-sm text-slate-400 leading-relaxed">You must obtain a Declaration of Value or a CIMEA Statement of Comparability to legalize your high school diploma.</p>
                                                </div>
                                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                                                    <Search size={32} className="text-emerald-400 mb-4" />
                                                    <h4 className="text-xl font-black mb-2">Universitaly Pre-enroll</h4>
                                                    <p className="text-sm text-slate-400 leading-relaxed">This is a legal requirement for your visa application. You must select your university preference here early in the year.</p>
                                                </div>
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

                                <CTASection fieldKeyPrefix="eligibility_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


