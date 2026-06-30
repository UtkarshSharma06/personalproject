import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Target,
    CheckCircle2,
    Building2,
    AlertCircle,
    ChevronRight,
    HelpCircle,
    Scale,
    TrendingUp,
    ScrollText,
    Calculator
} from 'lucide-react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import FAQSchema from '@/components/seo/FAQSchema';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import { tolcLinks } from '@/lib/nav-links';
import { getBreadcrumbSchema } from '@/utils/seo-schemas';
import PageNavigation from '@/components/exams/PageNavigation';

const sections = [
    { id: 'overview', label: 'The Passing Score Myth' },
    { id: 'bando', label: 'The Bando di Ammissione' },
    { id: 'ofa', label: 'Understanding OFA' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'What is the passing score for the TOLC?', answer: 'There is no universal passing score. CISIA (the organization that creates the exam) only calculates your result out of 50. The specific university you are applying to dictates the minimum required score to pass or gain admission.' },
    { question: 'What is an OFA (Obbligo Formativo Aggiuntivo)?', answer: 'An OFA is an "Additional Educational Obligation." If you score below the university\'s minimum threshold in a specific section (e.g., Mathematics), they may still admit you, but you will be assigned an OFA. You must pass a remedial exam in your first year to remove this OFA.' },
    { question: 'Can I be rejected if my score is too low?', answer: 'Yes. Universities run two types of admissions: "Accesso Libero" (Open Access) and "Accesso Programmato" (Restricted Access). For restricted degrees (like Medicine or certain Engineering programs), if you don\'t meet the cutoff rank, you are rejected.' },
    { question: 'How is the ranking (Graduatoria) calculated?', answer: 'For restricted access degrees, universities rank all applicants based strictly on their TOLC score. If there are 100 seats, the top 100 scores are admitted, regardless of what the lowest score among them is. That lowest admitted score becomes that year\'s "cutoff."' },
    { question: 'Is the English section counted in the final score?', answer: 'Generally, no. The 30-question English section is usually evaluated separately. If you score poorly, the university may assign you an English OFA, but it rarely impacts your core ranking for admission.' },
    { question: 'What is a "good" score on the TOLC-I?', answer: 'It highly depends on the university. For highly competitive institutions like Politecnico di Milano or Torino, a score above 35/50 is often necessary. For smaller regional universities, a score of 18/50 might be sufficient to avoid an OFA.' },
    { question: 'Where do I find the required score for my chosen university?', answer: 'You must read the "Bando di Ammissione" (Call for Admission) published on the official website of your target university. It is the only legally binding document that specifies the exact minimum score required for that specific academic year.' },
    { question: 'Does a 25/50 on TOLC@HOME equal a 25/50 on TOLC@UNI?', answer: 'Yes. The delivery method has zero impact on the validity or weighting of the score. Both are recognized equally by participating universities.' },
    { question: 'What happens if I don\'t clear my OFA in the first year?', answer: 'If you are admitted with an OFA and fail to pass the remedial exam by the end of your first academic year, you will be blocked from taking second-year exams until the OFA is resolved.' },
    { question: 'Can I submit my highest score if I took the TOLC multiple times?', answer: 'Yes! This is the main advantage of the TOLC system. If you take the exam three times throughout the year, you can choose to submit your highest score when you apply to the university.' }
];

export default function TolcPassingScore() {
    const { getField } = usePageContent('tolc-passing-score-2026');
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
        <CmsPageWrapper slug="tolc-passing-score-2026">
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
                    title="TOLC Passing Score & OFA Explained 2026 | Cutoff Analysis"
                    description="What is a good TOLC score? Understand how CISIA calculates results, how universities rank students, and what an OFA (remedial obligation) means for you."
                    keywords="TOLC passing score, what is a good TOLC score, TOLC OFA meaning, TOLC-I average score, CISIA graduatoria, university admission Italy"
                    schemas={[getBreadcrumbSchema([
                        { name: 'Home', item: '/' },
                        { name: 'TOLC Guide', item: '/tolc-exam-ultimate-guide-2026' },
                        { name: 'TOLC Passing Score', item: '/tolc-passing-score-explained-2026' }
                    ])]}
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
                                        <Scale size={12} className="text-indigo-600" />
                                        Score Interpretation Guide
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                                        {getField('hero_headline', 'The Passing Score Myth & OFA')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "The most common question students ask is: 'What is the passing score for the TOLC?' The answer is that CISIA does not have a passing score. CISIA only calculates your raw numerical result (e.g., 32.5 out of 50). It is the individual university that determines what that score means. To understand if you 'passed', you have to understand the difference between Open Access, Restricted Access, and the dreaded OFA.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'max', label: 'Max Score', value: '50.00', icon: Target },
                                            { key: 'cisia', label: 'CISIA Passing', value: 'None', icon: AlertCircle },
                                            { key: 'ofa', label: 'Remedial', value: 'OFA System', icon: ScrollText },
                                            { key: 'ranking', label: 'Admissions', value: 'Rank Based', icon: TrendingUp }
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

                                {/* Bando Section */}
                                <section id="bando" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Building2 className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">The Power of the "Bando"</h2>
                                    </div>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium mb-8">
                                        Every university department publishes a <strong>Bando di Ammissione</strong> (Call for Admission) every year. This PDF is the absolute law regarding how they will treat your CISIA score. They generally fall into two categories:
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm">
                                            <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                                                <Calculator className="text-indigo-600" size={24} />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Accesso Programmato (Ranked)</h3>
                                            <p className="text-slate-600 leading-relaxed text-sm">
                                                Highly competitive degrees (Medicine, Architecture, top Engineering). The university says: <em>"We have 150 seats."</em> They rank all applicants by their TOLC score. The top 150 get in. The score of the 150th student becomes that year's cutoff. If you are 151st, you are rejected.
                                            </p>
                                        </div>
                                        <div className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm">
                                            <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                                                <CheckCircle2 className="text-emerald-600" size={24} />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-3">2. Accesso Libero (Threshold)</h3>
                                            <p className="text-slate-600 leading-relaxed text-sm">
                                                Less competitive degrees. The university says: <em>"Anyone who scores above 18/50 is admitted immediately."</em> If you score an 18.25, you are in. But what happens if you score a 12.0? That is where the OFA comes into play.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* OFA Section */}
                                <section id="ofa" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <AlertCircle size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-3xl font-black mb-6 flex items-center gap-4">
                                                <AlertCircle className="text-amber-400" />
                                                Understanding OFA
                                            </h2>
                                            <p className="text-lg text-slate-300 leading-relaxed font-medium mb-8 max-w-3xl">
                                                OFA stands for <strong>Obblighi Formativi Aggiuntivi</strong> (Additional Educational Obligations). It is a uniquely Italian academic concept.
                                            </p>
                                            
                                            <div className="space-y-6">
                                                <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                                                    <h4 className="font-bold text-white mb-2">How it works:</h4>
                                                    <p className="text-sm text-slate-300 leading-relaxed">
                                                        Imagine you apply for an Engineering degree (Accesso Libero). The Bando states you need a minimum of 14 points in the Math section of the TOLC-I. You take the exam and only score 8 points in Math. 
                                                    </p>
                                                    <p className="text-sm text-slate-300 leading-relaxed mt-2">
                                                        The university will still admit you and let you enroll. However, you will be assigned a "Math OFA." This means you must attend remedial math classes and pass a special OFA exam during your first year. If you fail to clear the OFA by the end of the year, you will be blocked from taking any second-year university exams.
                                                    </p>
                                                </div>
                                                <p className="text-amber-400 font-bold text-sm text-center">
                                                    Do not treat the TOLC lightly just because your degree is "Accesso Libero." Getting stuck with an OFA can severely delay your graduation timeline.
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

                                <CTASection fieldKeyPrefix="tolc_passing_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}
