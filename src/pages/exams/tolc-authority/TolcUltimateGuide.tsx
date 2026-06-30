import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BookOpen,
    Target,
    Trophy,
    Clock,
    FileText,
    CheckCircle2,
    Building2,
    Users,
    ChevronRight,
    Sparkles,
    HelpCircle,
    BrainCircuit,
    CalendarDays,
    AlertCircle,
    ArrowUpRight,
    Scale,
    FileCheck
} from 'lucide-react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import EditableText from '@/components/cms/EditableText';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import PageNavigation from '@/components/exams/PageNavigation';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import { tolcLinks } from '@/lib/nav-links';
import FAQSchema from '@/components/seo/FAQSchema';
import { getCourseSchema, getBreadcrumbSchema } from '@/utils/seo-schemas';

const sections = [
    { id: 'overview', label: 'What is the TOLC?' },
    { id: 'variants', label: 'TOLC Variants (I, E, MED)' },
    { id: 'structure', label: 'Exam Structure & Timing' },
    { id: 'scoring', label: 'Scoring & OFA System' },
    { id: 'registration', label: 'Registration Process' },
    { id: 'preparation', label: 'Preparation Strategy' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    {
        question: "What is the difference between TOLC-E, TOLC-I, and TOLC-F?",
        answer: "TOLC-E is designed for Economics and Social Sciences, TOLC-I is for Engineering, and TOLC-F is for Pharmacy and Biology. Each test has a different structure and focus, tailored to the specific degree program."
    },
    {
        question: "Can I take the TOLC exam online?",
        answer: "Yes, CISIA introduced the TOLC@CASA, which allows students to take the exam from home using specific proctoring software. However, the validity is identical to the in-person TOLC@UNI."
    },
    {
        question: "Is the TOLC exam available in English?",
        answer: "Yes, English versions are available for most TOLC exams (English TOLC-E, English TOLC-I, English TOLC-F), specifically designed for international students applying to English-taught degrees."
    },
    {
        question: "How long is the TOLC score valid?",
        answer: "The TOLC score is generally valid for the academic year in which the test is taken. Some universities may accept scores from the previous calendar year, but this depends strictly on the university's individual Bando."
    },
    {
        question: "Is there negative marking in the TOLC?",
        answer: "Yes. For every incorrect answer, you lose 0.25 points. Unanswered questions receive 0 points. Correct answers receive 1 point. This makes guessing statistically dangerous."
    },
    {
        question: "What is an OFA?",
        answer: "OFA stands for Obblighi Formativi Aggiuntivi (Additional Educational Obligations). If you score below a certain threshold (usually in Math), the university may still admit you but will require you to pass a remedial exam during your first year."
    },
    {
        question: "How many times can I take the TOLC?",
        answer: "You can take the TOLC once per calendar month, subject to session availability. Most students take it 2-3 times and submit their highest score."
    },
    {
        question: "Do I need the TOLC or the IMAT for Medicine?",
        answer: "If you want to study Medicine in English at a public university, you MUST take the IMAT. If you want to study Medicine in Italian, you MUST take the TOLC-MED."
    }
];

export default function TolcUltimateGuide() {
    const { getField } = usePageContent('tolc-exam-ultimate-guide-2026');
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 120;
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
        <CmsPageWrapper slug="tolc-exam-ultimate-guide-2026">
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
                    title="TOLC Exam Ultimate Guide 2026 | CISIA English & Italian Tests"
                    description="The complete 2026 guide to the CISIA TOLC exams (TOLC-I, TOLC-E, TOLC-MED). Learn about syllabus, scoring, negative marking, OFA, and how to register for Italian universities."
                    keywords="TOLC exam, CISIA TOLC, TOLC-I, TOLC-E, TOLC-MED, English TOLC, study in Italy, TOLC preparation, what is TOLC, TOLC OFA"
                    faqs={faqs}
                    schemas={[
                        getCourseSchema('tolc'),
                        getBreadcrumbSchema([
                            { name: 'Home', item: '/' },
                            { name: 'Exams', item: '/exams' },
                            { name: 'TOLC Guide 2026', item: '/tolc-exam-ultimate-guide-2026' }
                        ])
                    ]}
                />

                <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
                    <main className="container mx-auto px-4 pt-0 pb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            
                            {/* Sidebar */}
                            <div className="lg:col-span-4 hidden lg:block">
                                <div className="sticky top-32 self-start">
                                    <KnowledgeHubSidebar examType="tolc" />
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="lg:col-span-8 space-y-16">

                                {/* Hero Section */}
                                <section id="overview" className="scroll-mt-[120px]">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                                        <Sparkles size={12} className="text-indigo-600 animate-pulse" />
                                        Official CISIA 2026 Guide
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                                        {getField('hero_headline', 'The Ultimate TOLC Exam Guide 2026')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_subheadline" multiline as="p" className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_subheadline', "If you are planning to study at an Italian public university, you will almost certainly encounter the TOLC. Managed by CISIA, the TOLC (Test OnLine CISIA) is a family of digital entrance exams used to evaluate students for degrees ranging from Engineering to Economics and Medicine. This guide is your definitive blueprint for understanding, registering, and crushing the exam.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { label: 'Format', value: 'CBT', icon: Target },
                                            { label: 'Variants', value: '10+', icon: FileText },
                                            { label: 'Attempts', value: '1/Month', icon: CalendarDays },
                                            { label: 'Penalty', value: '-0.25', icon: Scale }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-indigo-200 transition-colors">
                                                <item.icon className="text-indigo-600 mb-3 group-hover:scale-110 transition-transform" size={24} />
                                                <div className="text-2xl font-black text-slate-900">{item.value}</div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-2xl">
                                        <h3 className="font-bold text-indigo-900 text-lg mb-2">What is the TOLC?</h3>
                                        <p className="text-indigo-800 text-sm leading-relaxed">
                                            Unlike the IMAT, which is a single national exam held on one specific day, the TOLC is decentralized. It is a Computer-Based Test (CBT) that you can take multiple times throughout the year. Your score is generated from a massive database of questions, meaning no two students take the exact same test. You then submit your best score to the universities of your choice.
                                        </p>
                                    </div>
                                </section>

                                {/* Variants Section */}
                                <section id="variants" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-emerald-100 p-3 rounded-2xl">
                                            <FileCheck className="text-emerald-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Understanding TOLC Variants</h2>
                                    </div>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium mb-8">
                                        There is no single "TOLC exam". It is an umbrella term. When a university publishes its admission requirements (the <em>Bando</em>), it will specify exactly which variant of the TOLC you must take.
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                                        <Card className="p-8 border-slate-200 hover:border-emerald-200 transition-colors">
                                            <h3 className="text-2xl font-black text-slate-900 mb-2">TOLC-I (Engineering)</h3>
                                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                                Required for almost all Engineering, Computer Science, and hardcore STEM degrees. Highly math and physics intensive. Available in both Italian and English (English TOLC-I).
                                            </p>
                                        </Card>
                                        <Card className="p-8 border-slate-200 hover:border-emerald-200 transition-colors">
                                            <h3 className="text-2xl font-black text-slate-900 mb-2">TOLC-E (Economics)</h3>
                                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                                Required for Economics, Business, Finance, and Management degrees. Focuses heavily on logic, reading comprehension, and basic mathematics. Available in English (English TOLC-E).
                                            </p>
                                        </Card>
                                        <Card className="p-8 border-slate-200 hover:border-emerald-200 transition-colors">
                                            <h3 className="text-2xl font-black text-slate-900 mb-2">TOLC-MED (Medicine)</h3>
                                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                                Exclusively for Italian-taught Medicine and Dentistry. Brutally difficult, highly competitive, and uses a complex equalized scoring algorithm. Not to be confused with the IMAT.
                                            </p>
                                        </Card>
                                        <Card className="p-8 border-slate-200 hover:border-emerald-200 transition-colors">
                                            <h3 className="text-2xl font-black text-slate-900 mb-2">Other Variants</h3>
                                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                                Includes TOLC-F (Pharmacy), TOLC-SU (Humanities), TOLC-B (Biology), and others. Always check your target university's website to confirm which specific variant is required.
                                            </p>
                                        </Card>
                                    </div>
                                </section>

                                {/* Structure Section */}
                                <section id="structure" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Clock size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-3xl font-black mb-6 flex items-center gap-4">
                                                <Clock className="text-amber-400" />
                                                Exam Structure & Segmented Timers
                                            </h2>
                                            <p className="text-lg text-slate-300 leading-relaxed font-medium mb-8 max-w-2xl">
                                                The most difficult aspect of the TOLC is not the content, but the time management. The exam uses strict, locked, per-section timers.
                                            </p>
                                            
                                            <div className="bg-white/10 p-6 rounded-2xl border border-white/20 mb-8">
                                                <h4 className="font-bold text-amber-400 text-xl mb-4">Example: English TOLC-I Structure</h4>
                                                <ul className="space-y-4 text-sm text-slate-300">
                                                    <li className="flex justify-between items-center border-b border-white/10 pb-2">
                                                        <span><strong>Mathematics</strong> (20 questions)</span>
                                                        <span className="font-mono bg-white/10 px-2 py-1 rounded">50 Minutes</span>
                                                    </li>
                                                    <li className="flex justify-between items-center border-b border-white/10 pb-2">
                                                        <span><strong>Logic</strong> (10 questions)</span>
                                                        <span className="font-mono bg-white/10 px-2 py-1 rounded">20 Minutes</span>
                                                    </li>
                                                    <li className="flex justify-between items-center border-b border-white/10 pb-2">
                                                        <span><strong>Sciences</strong> (10 questions)</span>
                                                        <span className="font-mono bg-white/10 px-2 py-1 rounded">20 Minutes</span>
                                                    </li>
                                                    <li className="flex justify-between items-center pb-2">
                                                        <span><strong>Reading Comprehension</strong> (10 questions)</span>
                                                        <span className="font-mono bg-white/10 px-2 py-1 rounded">20 Minutes</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="bg-rose-500/20 border-l-4 border-rose-500 p-4 rounded-r-xl">
                                                <p className="text-sm text-white leading-relaxed">
                                                    <strong>Crucial Warning:</strong> If you finish Mathematics in 30 minutes, you CANNOT carry those extra 20 minutes over to Logic. The timer resets for every section. If a section timer hits zero, it locks permanently. You cannot go back.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Scoring & OFA */}
                                <section id="scoring" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-rose-100 p-3 rounded-2xl">
                                            <Scale className="text-rose-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Scoring, Penalties & OFA</h2>
                                    </div>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium mb-8">
                                        The TOLC employs a negative marking system designed to severely punish students who guess blindly.
                                    </p>

                                    <div className="grid md:grid-cols-3 gap-4 mb-12">
                                        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center">
                                            <div className="text-3xl font-black text-emerald-600 mb-2">+1.0</div>
                                            <div className="text-sm font-bold text-slate-700">Correct Answer</div>
                                        </div>
                                        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center">
                                            <div className="text-3xl font-black text-rose-600 mb-2">-0.25</div>
                                            <div className="text-sm font-bold text-slate-700">Incorrect Answer</div>
                                        </div>
                                        <div className="bg-slate-100 border border-slate-200 p-6 rounded-2xl text-center">
                                            <div className="text-3xl font-black text-slate-600 mb-2">0.0</div>
                                            <div className="text-sm font-bold text-slate-700">Left Blank</div>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 mb-4">What is an OFA?</h3>
                                    <div className="prose prose-slate max-w-none text-slate-600 leading-loose">
                                        <p>
                                            OFA (<em>Obblighi Formativi Aggiuntivi</em>) is an Italian academic concept that translates to "Additional Educational Obligations."
                                        </p>
                                        <p>
                                            Many universities use the TOLC not just to rank students for competitive degrees (Accesso Programmato), but to verify minimum competencies for open-access degrees (Accesso Libero).
                                        </p>
                                        <p>
                                            If you enroll in an open-access degree but score below a certain threshold on the TOLC (e.g., scoring less than 14/50 on math), the university will admit you, but assign you an OFA. This means you must attend remedial classes and pass a special exam during your first year. If you fail to clear your OFA, you will be blocked from taking second-year exams.
                                        </p>
                                    </div>
                                </section>

                                {/* Preparation Strategy */}
                                <section id="preparation" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Target className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">How to Prepare for the TOLC</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <Card className="p-6 border-slate-200 shadow-sm">
                                            <h4 className="font-bold text-slate-900 text-lg mb-2">1. Master the Syllabus, Not Just the Questions</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                Because the test is drawn from a massive database, simply memorizing past questions (Quizzari) is not enough. You must deeply understand the underlying mathematical and scientific principles.
                                            </p>
                                        </Card>
                                        <Card className="p-6 border-slate-200 shadow-sm">
                                            <h4 className="font-bold text-slate-900 text-lg mb-2">2. Simulate the CBT Environment</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                Reading from a book is completely different from reading off a screen with a timer ticking down. You must take digital mock exams to train your eyes and your time management skills. You must learn to skip questions to avoid the section timer locking you out.
                                            </p>
                                        </Card>
                                        <Card className="p-6 border-slate-200 shadow-sm">
                                            <h4 className="font-bold text-slate-900 text-lg mb-2">3. Practice Triage (Negative Marking Defense)</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                Train yourself to identify "trap" questions. If you cannot eliminate at least two wrong answers, you must leave the question blank. Scoring a 0 is infinitely better than scoring a -0.25 and losing hard-earned points.
                                            </p>
                                        </Card>
                                    </div>
                                </section>

                                {/* Registration */}
                                <section id="registration" className="scroll-mt-[120px]">
                                    <div className="bg-emerald-50 rounded-[3rem] p-12 border border-emerald-100">
                                        <h2 className="text-3xl font-black text-emerald-900 mb-6 flex items-center gap-4">
                                            <CalendarDays className="text-emerald-600" />
                                            Registration & Logistics
                                        </h2>
                                        <p className="text-emerald-800 leading-relaxed mb-8">
                                            To take the TOLC, you must register directly on the official CISIA portal. The exam costs approximately <strong>€30 per attempt</strong>.
                                        </p>
                                        <ul className="space-y-4 text-sm text-emerald-900">
                                            <li className="flex items-start gap-3">
                                                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                                <span><strong>TOLC@UNI vs TOLC@CASA:</strong> You can choose to take the test in person at an Italian university computer lab, or at home using remote proctoring. Both are equally valid.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                                <span><strong>Booking Location Doesn't Matter:</strong> If you book a TOLC-I at the University of Bologna, you can still use that score to apply to Politecnico di Torino. The score is portable across all CISIA-affiliated universities.</span>
                                            </li>
                                        </ul>
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

                                <CTASection fieldKeyPrefix="tolc_guide_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}
