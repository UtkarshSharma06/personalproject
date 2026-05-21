import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    BookOpen,
    BrainCircuit,
    Beaker,
    Atom,
    Calculator,
    CheckCircle2,
    Zap,
    Target,
    HelpCircle,
    ChevronRight,
    Search,
    Star,
    Grid,
    Globe,
    TrendingUp,
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
    { id: 'biology', label: 'Biology' },
    { id: 'chemistry', label: 'Chemistry' },
    { id: 'physics-math', label: 'Physics & Math' },
    { id: 'logic', label: 'Logic & General' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'What is the most important section of the IMAT?', answer: 'Statistically, Biology and Chemistry account for nearly 50% of the total score. Logic and General Knowledge are also critical as they test speed and accuracy rather than pure recall.' },
    { question: 'Is the IMAT syllabus similar to A-Levels?', answer: 'Yes, the IMAT scientific syllabus heavily overlaps with UK A-Level (Biology, Chemistry, Physics) or IB higher-level content. However, the logic section is unique to the IMAT format.' },
    { question: 'What is the level of Physics required?', answer: 'IMAT Physics is at a senior high-school level. It focuses on Mechanics, Thermodynamics, Electromagnetism, and Optics. You do not need advanced university-level physics.' },
    { question: 'Do I need to study Italian History for General Knowledge?', answer: 'No. General Knowledge questions are typically international in scope, covering world history, literature, philosophy, and current events.' },
    { question: 'Are there many organic chemistry questions?', answer: 'Yes, Organic Chemistry is a significant part of the Chemistry section, typically covering functional groups, nomenclature, and basic reaction mechanisms.' },
    { question: 'How detailed is the Biology section?', answer: 'It is quite detailed, especially in Molecular Biology, Genetics, and Human Anatomy/Physiology. You need a deep understanding of cellular processes.' },
    { question: 'What kind of math is in the IMAT?', answer: 'The Math section covers Algebra, Geometry, Probability, and Statistics. It is not extremely advanced (no complex calculus), but requires speed and accuracy without a calculator.' },
    { question: 'Is the syllabus changed every year?', answer: 'The core scientific syllabus remains very stable. Any minor changes are usually announced in the official MUR decree published in the spring.' },
    { question: 'What is the best way to study for the Logic section?', answer: 'Practice TSA (Thinking Skills Assessment) past papers and BMAT Section 1. Focus on identifying argument structures and numerical reasoning patterns.' },
    { question: 'Can I use a calculator for the Math/Physics sections?', answer: 'No. Calculators are strictly prohibited. You must be comfortable with mental math and estimating scientific values.' }
];

export default function ImatDetailedSyllabus() {
    const navigate = useNavigate();
    const { getField } = usePageContent('imat-detailed-syllabus-2026');
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

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
        }
    };

    return (
        <CmsPageWrapper slug="imat-detailed-syllabus-2026">
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
                    title="IMAT Detailed Syllabus 2026: Section-by-Section Guide"
                    description="The most detailed IMAT 2026 syllabus guide. Complete breakdown of Biology, Chemistry, Physics, Math, and Logical Reasoning requirements for the Italian medical entrance exam."
                    keywords="IMAT syllabus 2026, IMAT biology topics, IMAT chemistry requirements, IMAT physics math syllabus, IMAT logical reasoning guide"
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
                                        {getField('hero_headline', 'IMAT 2026 Detailed Syllabus')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "The IMAT syllabus is derived from the Italian ministerial decree. It benchmarks candidate knowledge against high-level European secondary school standards.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'subjects', label: 'Subjects', value: '4 Major', icon: BookOpen },
                                            { key: 'questions', label: 'Questions', value: '60 MCQ', icon: Target },
                                            { key: 'time', label: 'Timing', value: '100 Min', icon: Zap },
                                            { key: 'status', label: 'Updated', value: '2026 Ready', icon: Star }
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

                                {/* Biology Section */}
                                <section id="biology" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-rose-100 p-3 rounded-2xl">
                                            <Beaker className="text-rose-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Biology: The Foundation</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <EditableText fieldKey="bio_desc" multiline as="p" className="text-slate-600 font-medium leading-relaxed">
                                                {getField('bio_desc', "Accounting for nearly 25% of the exam, Biology requires mastery of cellular life, genetics, and the complex mechanics of the human body. Focus on Molecular Biology as it often yields the highest difficulty questions.")}
                                            </EditableText>
                                            <div className="space-y-4">
                                                {[
                                                    { key: 'cell', label: 'The chemistry of living things' },
                                                    { key: 'genetics', label: 'Mendelian and molecular genetics' },
                                                    { key: 'anatomy', label: 'Human anatomy and physiology' },
                                                    { key: 'evolution', label: 'Bioenergetics and evolution' }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                        <CheckCircle2 size={16} className="text-rose-500" />
                                                        <EditableText fieldKey={`bio_item_${item.key}`} as="span">
                                                            {getField(`bio_item_${item.key}`, item.label)}
                                                        </EditableText>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <Card className="p-8 bg-rose-50 border-rose-100 border-2 rounded-[2.5rem] relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                                                <Beaker size={150} className="text-rose-900" />
                                            </div>
                                            <h4 className="text-rose-900 font-black mb-4">Exam weighting: 15 Questions</h4>
                                            <p className="text-sm text-rose-700 font-medium leading-relaxed">
                                                Because of the high number of questions, Biology acts as the primary "buffer" section. High performance here is non-negotiable for a competitive seat.
                                            </p>
                                        </Card>
                                    </div>
                                </section>

                                {/* Chemistry Section */}
                                <section id="chemistry" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-emerald-100 p-3 rounded-2xl">
                                            <Atom className="text-emerald-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Chemistry: Precision Engineering</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <Card className="p-8 bg-emerald-50 border-emerald-100 border-2 rounded-[2.5rem] relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                                                <Atom size={150} className="text-emerald-900" />
                                            </div>
                                            <h4 className="text-emerald-900 font-black mb-4">Exam weighting: 15 Questions</h4>
                                            <p className="text-sm text-emerald-700 font-medium leading-relaxed">
                                                Organic chemistry and reaction stoichiometry are the "trap" areas. Practice converting values without a calculator daily.
                                            </p>
                                        </Card>
                                        <div className="space-y-6">
                                            <EditableText fieldKey="chem_desc" multiline as="p" className="text-slate-600 font-medium leading-relaxed">
                                                {getField('chem_desc', "IMAT Chemistry covers the structure of matter, the periodic system, and chemical bonds. You must be proficient in acidic/basic equilibria and thermodynamics.")}
                                            </EditableText>
                                            <div className="space-y-4">
                                                {[
                                                    { key: 'matter', label: 'Atomic structure & Periodic table' },
                                                    { key: 'bonds', label: 'Chemical bonds & Compounds' },
                                                    { key: 'organic', label: 'Organic Chemistry fundamentals' },
                                                    { key: 'thermo', label: 'Kinetics and equilibrium' }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                                        <EditableText fieldKey={`chem_item_${item.key}`} as="span">
                                                            {getField(`chem_item_${item.key}`, item.label)}
                                                        </EditableText>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Physics & Math Section */}
                                <section id="physics-math" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Calculator className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Physics & Math: The Speed Test</h2>
                                    </div>
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12">
                                        <div className="grid md:grid-cols-2 gap-12">
                                            <div className="space-y-6">
                                                <h4 className="font-black text-slate-900 flex items-center gap-2">
                                                    <TrendingUp className="text-indigo-600" size={20} />
                                                    Physics Core Topics
                                                </h4>
                                                <div className="space-y-4">
                                                    {[
                                                        { key: 'mech', icon: TrendingUp, title: 'Mechanics & Dynamics', desc: 'Vectors, kinematics, Newton\'s laws, work, energy, and power. Fundamental to all physics problems.', color: 'bg-rose-50 text-rose-700 border-rose-100' },
                                                        { key: 'thermo', icon: Zap, title: 'Thermodynamics', desc: 'Heat, temperature, and the laws of thermodynamics.', color: 'bg-amber-50 text-amber-700 border-amber-100' }
                                                    ].map((item, i) => (
                                                        <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                            <div className="font-black text-slate-900 text-sm mb-1">{item.title}</div>
                                                            <div className="text-xs text-slate-500 font-medium">{item.desc}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <h4 className="font-black text-slate-900 flex items-center gap-2">
                                                    <Calculator className="text-emerald-600" size={20} />
                                                    Mathematical Principles
                                                </h4>
                                                <div className="space-y-4">
                                                    {[
                                                        { key: 'algebra', title: 'Advanced Algebra', desc: 'Polynomials, equations, and logarithmic functions.' },
                                                        { key: 'stats', title: 'Stats & Probability', desc: 'Data interpretation and likelihood calculations.' }
                                                    ].map((item, i) => (
                                                        <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                            <div className="font-black text-slate-900 text-sm mb-1">{item.title}</div>
                                                            <div className="text-xs text-slate-500 font-medium">{item.desc}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Logic & General Knowledge */}
                                <section id="logic" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <BrainCircuit size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl font-black mb-8 flex items-center gap-4">
                                                <BrainCircuit className="text-indigo-400" />
                                                Logical Reasoning
                                            </h2>
                                            <p className="text-xl text-slate-300 leading-relaxed font-medium mb-12 max-w-3xl">
                                                Often called Section 1, this part tests Critical Thinking and Problem Solving. It is the most "skill-based" part of the exam, where practice yields exponential returns.
                                            </p>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                                                    <Target size={32} className="text-indigo-400 mb-4" />
                                                    <h4 className="text-xl font-black mb-2">Critical Thinking</h4>
                                                    <p className="text-sm text-slate-400 leading-relaxed">Evaluating arguments, identifying assumptions, and drawing valid conclusions.</p>
                                                </div>
                                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                                                    <Search size={32} className="text-emerald-400 mb-4" />
                                                    <h4 className="text-xl font-black mb-2">General Knowledge</h4>
                                                    <p className="text-sm text-slate-400 leading-relaxed">International history, literature, philosophy, and political-institutional culture.</p>
                                                </div>
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

                                <CTASection fieldKeyPrefix="imat_syllabus_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


