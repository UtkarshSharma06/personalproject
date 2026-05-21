import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    BookOpen,
    Target,
    Trophy,
    Clock,
    FileText,
    CheckCircle2,
    ArrowRight,
    Users,
    ChevronRight,
    Sparkles,
    HelpCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import EditableText from '@/components/cms/EditableText';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import PageNavigation from '@/components/exams/PageNavigation';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { getCourseSchema, getBreadcrumbSchema } from '@/utils/seo-schemas';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'structure', label: 'Exam Structure' },
    { id: 'preparation', label: 'How to Prepare' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    {
        question: "What is the difference between TOLC-E, TOLC-I, and TOLC-F?",
        answer: "TOLC-E is for Economics and Social Sciences, TOLC-I is for Engineering, and TOLC-F is for Pharmacy and Biology. Each test has a different structure and focus, tailored to the specific degree program."
    },
    {
        question: "Can I take the TOLC exam online?",
        answer: "Yes, CISIA introduced the TOLC@CASA, which allows students to take the exam from home using specific proctoring software."
    },
    {
        question: "Is the TOLC exam available in English?",
        answer: "Yes, English versions are available for most TOLC exams (English TOLC-E, English TOLC-I, English TOLC-F), specifically designed for international students."
    },
    {
        question: "How long is the TOLC score valid?",
        answer: "The TOLC score is generally valid for the academic year in which the test is taken. Some universities may accept scores from the previous calendar year."
    }
];

export default function TolcUltimateGuide() {
    const navigate = useNavigate();
    const { getField } = usePageContent('tolc-exam-ultimate-guide');
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 120;
            const allSections = [{ id: 'overview', label: 'Overview' }, ...sections];
            for (const section of allSections) {
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
        <CmsPageWrapper slug="tolc-exam-ultimate-guide">
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
                        title="TOLC Exam Ultimate Guide 2026 | Preparation & Structure"
                        description="Complete guide to the CISIA TOLC exams (TOLC-E, TOLC-I, TOLC-F) for Italian university admission. Learn the syllabus, scoring, and best preparation strategies."
                        keywords="tolc preparation, tolc-e, tolc-i, tolc-f, tolc exam, cisia tolc, tolc italy, study abroad italy, tolc score"
                        faqs={faqs}
                        schemas={[
                            getCourseSchema('tolc'), // Using accurate Course Schema for educational content
                            getBreadcrumbSchema([
                                { name: 'Home', item: '/' },
                                { name: 'Exams', item: '/exams' },
                                { name: 'TOLC Guide 2026', item: '/tolc-exam-ultimate-guide-2026' }
                            ])
                        ]}
                    />

                    <main className="container mx-auto px-4 pt-0 pb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-8 space-y-16">

                                {/* Hero Section */}
                                <section id="overview" className="scroll-mt-48">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                                        <Sparkles size={12} className="text-indigo-600 animate-pulse" />
                                        Official CISIA Guide
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.2] md:leading-[1.1] mb-8 mt-4 md:mt-0">
                                        {getField('hero_headline', 'The Ultimate TOLC Exam Guide')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_subheadline" multiline as="p" className="text-xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_subheadline', "Everything you need to know about the CISIA Online Tests (TOLC) for admission to Italian universities in Engineering, Economics, and Sciences.")}
                                    </EditableText>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                                        {[
                                            { label: 'Variants', value: 'TOLC-E, I, F', icon: FileText },
                                            { label: 'Format', value: 'Online / In-Person', icon: Trophy },
                                            { label: 'Validity', value: '1 Academic Year', icon: Clock }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                                                <item.icon className="text-indigo-600 mb-3" size={24} />
                                                <div className="text-xl font-black text-slate-900">{item.value}</div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-loose">
                                        <p>The TOLC (Test OnLine CISIA) is a tool for student orientation and evaluation of initial preparation before enrolling in university degree programs in Italy. There are different types of TOLC depending on the chosen degree program.</p>
                                    </div>
                                </section>

                                {/* Structure Section */}
                                <section id="structure" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-amber-100 p-3 rounded-2xl">
                                            <BookOpen className="text-amber-600" size={32} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900 decoration-amber-400">Exam Structure</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-white p-8 rounded-2xl border-2 border-slate-100">
                                            <h3 className="text-2xl font-black text-slate-900 mb-4">English TOLC-E (Economics)</h3>
                                            <ul className="space-y-2 mb-4 list-disc pl-5 text-slate-600">
                                                <li>Logic (13 questions, 30 minutes)</li>
                                                <li>Reading Comprehension (10 questions, 30 minutes)</li>
                                                <li>Mathematics (13 questions, 30 minutes)</li>
                                            </ul>
                                            <p className="font-bold text-slate-900">Total: 36 questions in 90 minutes</p>
                                        </div>

                                        <div className="bg-white p-8 rounded-2xl border-2 border-slate-100">
                                            <h3 className="text-2xl font-black text-slate-900 mb-4">English TOLC-I (Engineering)</h3>
                                            <ul className="space-y-2 mb-4 list-disc pl-5 text-slate-600">
                                                <li>Mathematics (20 questions, 50 minutes)</li>
                                                <li>Logic (10 questions, 20 minutes)</li>
                                                <li>Sciences (10 questions, 20 minutes)</li>
                                                <li>Reading Comprehension (10 questions, 20 minutes)</li>
                                            </ul>
                                            <p className="font-bold text-slate-900">Total: 50 questions in 110 minutes</p>
                                        </div>
                                    </div>
                                </section>

                                {/* FAQs Section */}
                                <section id="faqs" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-slate-200 p-3 rounded-2xl">
                                            <HelpCircle className="text-slate-600" size={32} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
                                    </div>

                                    <div className="space-y-4">
                                        {faqs.map((faq, i) => (
                                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100">
                                                <div className="text-lg font-black text-slate-900 mb-2 flex gap-4">
                                                    <span className="text-indigo-600">Q:</span> {faq.question}
                                                </div>
                                                <div className="text-slate-600 leading-relaxed font-medium pl-8 border-l-2 border-indigo-100">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <CTASection fieldKeyPrefix="pillar_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}
