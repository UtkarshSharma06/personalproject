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
        question: "What is the TIL-I Exam?",
        answer: "The TIL-I (Test in Laib) is the official entrance examination required for admission to Engineering bachelor's degree programs at Politecnico di Torino (PoliTo)."
    },
    {
        question: "Can I take the TIL-I exam online?",
        answer: "Yes, Politecnico di Torino offers the TIL-I online sessions, allowing international students to take the exam from their home country via a proctored platform."
    },
    {
        question: "Is the TIL-I exam available in English?",
        answer: "Absolutely. If you are applying for an English-taught Engineering degree at PoliTo, you can select the English version of the TIL-I during registration."
    },
    {
        question: "How is the TIL-I different from the TOLC-I?",
        answer: "While both are for Engineering, the TIL-I is specific to Politecnico di Torino. The structure is slightly different: TIL-I has 42 questions in 90 minutes, whereas TOLC-I has 50 questions in 110 minutes."
    }
];

export default function TiliUltimateGuide() {
    const navigate = useNavigate();
    const { getField } = usePageContent('tili-exam-ultimate-guide');
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
        <CmsPageWrapper slug="tili-exam-ultimate-guide">
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
                        title="TIL-I Exam Guide 2026 | PoliTo Engineering Entrance"
                        description="Complete guide to the TIL-I exam for admission to Politecnico di Torino (PoliTo) Engineering programs. Learn the syllabus, scoring, and best preparation strategies."
                        keywords="til-i exam, til-i syllabus, til-i preparation, til-i polimi, politecnico di torino, engineering entrance italy, study in italy"
                        faqs={faqs}
                        schemas={[
                            getCourseSchema('tili'), // Using accurate Course Schema for educational content
                            getBreadcrumbSchema([
                                { name: 'Home', item: '/' },
                                { name: 'Exams', item: '/exams' },
                                { name: 'TIL-I Guide 2026', item: '/til-i-exam-guide-2026' }
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
                                        Official PoliTo Guide
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.2] md:leading-[1.1] mb-8 mt-4 md:mt-0">
                                        {getField('hero_headline', 'The Ultimate TIL-I Exam Guide')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_subheadline" multiline as="p" className="text-xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_subheadline', "Everything you need to know about the TIL-I Test for admission to Engineering programs at Politecnico di Torino.")}
                                    </EditableText>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                                        {[
                                            { label: 'Total Questions', value: '42 MCQs', icon: FileText },
                                            { label: 'Time Limit', value: '90 Minutes', icon: Clock },
                                            { label: 'Target', value: 'PoliTo Engineering', icon: Target }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                                                <item.icon className="text-indigo-600 mb-3" size={24} />
                                                <div className="text-xl font-black text-slate-900">{item.value}</div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                                            </div>
                                        ))}
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
                                            <h3 className="text-2xl font-black text-slate-900 mb-4">TIL-I Component Breakdown</h3>
                                            <ul className="space-y-2 mb-4 list-disc pl-5 text-slate-600">
                                                <li>Mathematics (16 questions, 36 minutes)</li>
                                                <li>Reading Comprehension and Logical Evaluation (10 questions, 20 minutes)</li>
                                                <li>Physics (10 questions, 22 minutes)</li>
                                                <li>Basic Technical Knowledge (6 questions, 12 minutes)</li>
                                            </ul>
                                            <p className="font-bold text-slate-900">Total: 42 questions in 90 minutes</p>
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
