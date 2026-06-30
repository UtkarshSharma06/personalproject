import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    ArrowRight,
    MapPin,
    Users,
    Euro,
    Briefcase,
    Globe,
    ShieldCheck,
    GraduationCap,
    Clock,
    ChevronRight,
    Sparkles,
    HelpCircle,
    CheckCircle2,
    Grid,
    CalendarDays,
    TrendingUp,
    Star,
    BookOpen
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';

import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import PageNavigation from '@/components/exams/PageNavigation';
import { getCourseSchema, getBreadcrumbSchema } from '@/utils/seo-schemas';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { IMAT_CLUSTER } from '@/lib/seo-links';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'why-italy', label: 'Why Italy?' },
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'financials', label: 'Financials' },
    { id: 'structure', label: 'Exam Structure' },
    { id: 'faqs', label: 'FAQs' }
];


const faqs = [
    { question: 'What is the IMAT exam?', answer: 'The IMAT (International Medical Admissions Test) is the official entrance exam for English-taught medical and surgery degrees in Italian public universities.' },
    { question: 'Who can take the IMAT?', answer: 'Anyone with a high school diploma (or equivalent) that is recognized in Italy can take the IMAT. It is open to both EU and Non-EU students.' },
    { question: 'How much does medical school in Italy cost?', answer: 'Public universities in Italy are heavily subsidized. Tuition typically ranges from €156 to €4,000 per year, depending on family income.' },
    { question: 'What is the format of the IMAT?', answer: 'The IMAT is a 100-minute paper-based exam consisting of 60 multiple-choice questions in Biology, Chemistry, Physics, Maths, and General Knowledge/Logic.' },
    { question: 'When is the IMAT 2026 exam?', answer: 'The IMAT is usually held once a year in September. Official dates for 2026 are typically announced by the Mur (Ministry of University and Research) in late spring.' },
    { question: 'How many seats are available for Non-EU students?', answer: 'There are roughly 1,500+ seats across Italy, with specific quotas allocated to Non-EU students residing abroad at each university.' },
    { question: 'Can I study medicine in Italy in English?', answer: 'Yes, there are currently 15+ public universities and several private ones offering full MD programs entirely in English.' },
    { question: 'Do I need to speak Italian to study medicine in English?', answer: 'No, the degree is taught entirely in English. However, learning basic Italian is helpful for clinical rotations in later years.' },
    { question: 'What is a good score for the IMAT?', answer: 'Competitive scores vary yearly and by university. Generally, a score above 45-50 is strong for many public universities.' },
    { question: 'Is the IMAT exam difficult?', answer: 'The IMAT is a high-stakes exam with a specific logic. While the scientific content is at a high-school level, the time pressure and logical reasoning make it challenging.' }
];

export default function ImatUltimateGuide() {
    const navigate = useNavigate();
    const { getField } = usePageContent('imat-ultimate-guide');
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
        <CmsPageWrapper slug="imat-ultimate-guide">
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
                        title="IMAT 2026 – Complete Guide: Registration, Syllabus, Dates & Cutoff | ItalStudy"
                        description="The complete IMAT 2026 guide. Exam dates, Universitaly registration process, official syllabus breakdown, cutoff scores for all Italian universities, and preparation strategy for EU & Non-EU students."
                        keywords="imat 2026, imat exam 2026, imat exam, what is imat, imat 2026 registration, imat 2026 exam date, imat preparation, imat eligibility, imat non eu seats, study medicine italy english, imat guide 2026, italostudy imat"
                        faqs={faqs}
                        schemas={[
                            getCourseSchema('imat'),
                            getBreadcrumbSchema([
                                { name: 'Home', item: '/' },
                                { name: 'Guides', item: '/resources' },
                                { name: 'IMAT 2026', item: '/imat-exam-ultimate-guide-2026' }
                            ])
                        ]}
                    />

                    <main className="container mx-auto px-4 pt-0 pb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Sidebar */}
                            <div className="lg:col-span-4 hidden lg:block">
                                <div className="sticky top-32 self-start">
                                    <KnowledgeHubSidebar examType="imat" />
                                </div>
                            </div>

                            <div className="lg:col-span-8 space-y-16">

                                {/* Hero */}
                                <section id="overview" className="scroll-mt-48">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                                        <Sparkles size={12} className="text-indigo-600 animate-pulse" />
                                        Official 2026 Academic Roadmap
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-4xl md:text-7xl font-black text-slate-900 leading-[1.2] md:leading-[1.1] mb-8 mt-4 md:mt-0">
                                        {getField('hero_headline', 'IMAT Ultimate Guide 2026')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', 'Everything you need to know about the International Medical Admissions Test and starting your medical journey in Italy.')}
                                    </EditableText>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'rank', label: 'Global Rank', value: '#1 Choice', icon: Globe },
                                            { key: 'seats', label: 'Total Seats', value: '1,500+', icon: Users },
                                            { key: 'cost', label: 'Annual Fee', value: 'Subsidized', icon: Euro },
                                            { key: 'career', label: 'Career', value: 'Global MD', icon: Briefcase }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center md:flex-col text-left md:text-center group hover:border-indigo-200 transition-colors gap-4 md:gap-0">
                                                <item.icon className="text-indigo-600 mb-0 md:mb-3 group-hover:scale-110 transition-transform shrink-0" size={24} />
                                                <div>
                                                    <EditableText fieldKey={`stat_val_${item.key}`} as="div" className="text-xl md:text-2xl font-black text-slate-900">
                                                        {getField(`stat_val_${item.key}`, item.value)}
                                                    </EditableText>
                                                    <EditableText fieldKey={`stat_label_${item.key}`} as="div" className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                        {getField(`stat_label_${item.key}`, item.label)}
                                                    </EditableText>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-loose">
                                        <EditableText fieldKey="overview_body" multiline as="div" className="mb-6">
                                            {getField('overview_body', "The IMAT (International Medical Admissions Test) is your gateway to studying medicine and surgery in English at Italy's top public universities. This guide provides a comprehensive overview of the admission process, requirements, and strategies for the 2026 intake.")}
                                        </EditableText>
                                        <p className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-900 font-medium text-base">
                                            <span className="font-bold">💡 Seeking Engineering or Non-Medical STEM?</span> If you are applying for engineering or computer science degrees, you do not need the IMAT. You must prepare for the <Link to="/cent-s-exam-ultimate-guide" className="text-indigo-600 font-bold hover:underline">CEnT-S Exam</Link> instead.
                                        </p>
                                    </div>
                                </section>

                                {/* Why Italy */}
                                <section id="why-italy" className="scroll-mt-40">
                                    <div className="bg-slate-900 text-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <Star size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-3xl md:text-4xl font-black mb-8 flex items-center gap-4">
                                                <Globe className="text-indigo-400" />
                                                {getField('why_italy_title', 'Why Choose Medicine in Italy?')}
                                            </h2>
                                            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                                                {[
                                                    { key: 'w1', text: 'World-Class Education: Italian universities consistently rank among the top medical schools globally.' },
                                                    { key: 'w2', text: 'Subsidized Tuition: Quality medical education at a fraction of the cost in the US, UK, or Australia.' },
                                                    { key: 'w3', text: 'Global Career: Your degree is recognized across the EU, USA, UK, and beyond.' },
                                                    { key: 'w4', text: 'Cultural Heritage: Study in historic institutions amidst a vibrant Mediterranean culture.' }
                                                ].map(({ key, text }) => (
                                                    <div key={key} className="flex items-start gap-3">
                                                        <CheckCircle2 className="text-indigo-400 shrink-0 mt-1" />
                                                        <EditableText fieldKey={`why_italy_bullet_${key}`} as="p" className="font-medium opacity-90 leading-relaxed">
                                                            {getField(`why_italy_bullet_${key}`, text)}
                                                        </EditableText>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Eligibility */}
                                <section id="eligibility" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <ShieldCheck className="text-indigo-600" size={32} />
                                        </div>
                                        <EditableText fieldKey="section_eligibility_title" as="h2" className="text-3xl md:text-4xl font-black text-slate-900 underline decoration-indigo-400 underline-offset-8">
                                            {getField('section_eligibility_title', 'Eligibility & Requirements')}
                                        </EditableText>
                                    </div>
                                    <div className="prose prose-lg text-slate-600 mb-8 max-w-none">
                                        <EditableText fieldKey="section_eligibility_body" multiline as="div">
                                            {getField('section_eligibility_body', 'To be eligible for the IMAT 2026, students must have a valid high school diploma that is recognized by the Italian educational system. Requirements vary slightly between EU and Non-EU candidates.')}
                                        </EditableText>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {[
                                            { key: 'edu', title: 'Educational Background', weight: 'Diploma', focus: 'High school diploma with at least 12 years of total schooling.', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
                                            { key: 'lang', title: 'Language Proficiency', weight: 'English/Italian', focus: 'Must prove English proficiency (B2 level) for IMAT or Italian for Italian degrees.', color: 'bg-amber-50 text-amber-700 border-amber-100' },
                                            { key: 'legal', title: 'Legal Recognition', weight: 'DOV / CIMEA', focus: 'Official confirmation that your foreign degree is equivalent to an Italian one.', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
                                        ].map((item, i) => (
                                            <div key={i} className={`p-6 md:p-8 rounded-[2rem] border-2 ${item.color} flex flex-col justify-between h-full`}>
                                                <div>
                                                    <EditableText fieldKey={`elig_card_${item.key}_weight`} as="div" className="text-lg md:text-xl font-black mb-1 opacity-70">
                                                        {getField(`elig_card_${item.key}_weight`, item.weight)}
                                                    </EditableText>
                                                    <EditableText fieldKey={`elig_card_${item.key}_title`} as="h4" className="text-lg md:text-xl font-bold mb-4">
                                                        {getField(`elig_card_${item.key}_title`, item.title)}
                                                    </EditableText>
                                                    <EditableText fieldKey={`elig_card_${item.key}_focus`} as="p" className="text-xs md:text-sm opacity-80 font-medium leading-relaxed">
                                                        {getField(`elig_card_${item.key}_focus`, item.focus)}
                                                    </EditableText>
                                                </div>
                                                <ChevronRight className="mt-6 md:mt-8 self-end" />
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Financials */}
                                <section id="financials" className="scroll-mt-40">
                                    <div className="p-8 md:p-12 bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-600">
                                            <Euro size={150} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 flex items-center gap-4">
                                                <Euro className="text-emerald-500" />
                                                Financial Aid & Fees
                                            </h2>
                                            <EditableText fieldKey="section_financial_body" multiline as="div" className="prose prose-lg text-slate-600 mb-8 max-w-none">
                                                {getField('section_financial_body', 'Italian public universities are among the most affordable in the world. Fees are calculated on a sliding scale based on family income (ISEE). Reductions and full waivers are available via the DSU scholarship.')}
                                            </EditableText>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                                                    <h4 className="text-lg font-black text-emerald-900 mb-2">Tuition Range</h4>
                                                    <p className="text-emerald-700 font-medium">€156 – €4,000 / year</p>
                                                    <p className="text-xs text-emerald-600 mt-2 italic font-bold">Depends on income assessment</p>
                                                </div>
                                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                                    <h4 className="text-lg font-black text-blue-900 mb-2">Scholarship (DSU)</h4>
                                                    <p className="text-blue-700 font-medium">Full Tuition Waiver + Stipend</p>
                                                    <p className="text-xs text-blue-600 mt-2 italic font-bold">Need-based eligibility</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium italic mt-6">
                                                Looking to secure your visa quickly along with your scholarship? Read our comprehensive guide on <Link to="/study-in-italy-without-ielts" className="text-indigo-500 hover:underline">Studying in Italy Without IELTS</Link>.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Structure */}
                                <section id="structure" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-rose-100 p-3 rounded-2xl">
                                            <GraduationCap className="text-rose-600" size={32} />
                                        </div>
                                        <EditableText fieldKey="section_structure_title" as="h2" className="text-3xl md:text-4xl font-black text-slate-900">
                                            {getField('section_structure_title', 'IMAT Exam Structure')}
                                        </EditableText>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {[
                                            { key: 'bio', icon: Star, title: 'Biology', desc: '14-16 questions. Largest section, covering cell biology, genetics, and human physiology.', color: 'bg-rose-50 text-rose-700 border-rose-100' },
                                            { key: 'chem', icon: Sparkles, title: 'Chemistry', desc: '12-15 questions. Focus on organic chem, reaction kinetics, and stoichiometry.', color: 'bg-amber-50 text-amber-700 border-amber-100' },
                                            { key: 'phys', icon: BookOpen, title: 'Phys & Maths', desc: '10-12 questions. Scientific logic and pure mathematical application.', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                                            { key: 'logic', icon: TrendingUp, title: 'Knowledge & Logic', desc: '10-15 questions. General knowledge and critical thinking patterns.', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' }
                                        ].map((item, i) => (
                                            <div key={i} className={`group bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-xl transition-all flex flex-col md:flex-row gap-4 md:gap-6 items-start`}>
                                                <div className={`${item.color} p-3 md:p-4 rounded-xl md:rounded-2xl shrink-0`}>
                                                    <item.icon size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                                                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
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
                                    <div className="space-y-4 md:space-y-6">
                                        {faqs.map((faq, i) => (
                                            <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="text-lg md:text-xl font-black text-slate-900 mb-4 flex gap-4">
                                                    <span className="text-indigo-600">Q{i + 1}:</span>
                                                    <EditableText fieldKey={`faq_q_${i}`} as="div">
                                                        {getField(`faq_q_${i}`, faq.question)}
                                                    </EditableText>
                                                </div>
                                                <div className="text-slate-600 leading-relaxed font-medium pl-6 md:pl-12 border-l-2 border-slate-50 text-sm md:text-base">
                                                    <EditableText fieldKey={`faq_a_${i}`} multiline as="div">
                                                        {getField(`faq_a_${i}`, faq.answer)}
                                                    </EditableText>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Knowledge Hub (Mobile Only) */}
                                <div className="lg:hidden mt-20">
                                    <KnowledgeHubSidebar examType="imat" />
                                </div>

                                {/* Related Reading */}
                                <section className="pt-20 border-t border-slate-200">
                                    <h3 className="text-2xl font-black text-slate-900 mb-8">
                                        Continue Strengthening Your Authority 📚
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {IMAT_CLUSTER.map((link, i) => (
                                            <Link
                                                key={i}
                                                to={link.href}
                                                className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-600 transition-colors flex items-center justify-between"
                                            >
                                                <span className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                                                    {link.title}
                                                </span>
                                                <ChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        ))}
                                    </div>
                                </section>

                                <CTASection fieldKeyPrefix="imat_ultimate_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}
