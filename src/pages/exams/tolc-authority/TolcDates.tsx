import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import {
    CalendarDays,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronRight,
    HelpCircle,
    Laptop,
    Building2,
    CalendarCheck,
    CalendarOff,
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
    { id: 'overview', label: 'Dates Overview' },
    { id: 'home-vs-uni', label: 'TOLC@HOME vs @UNI' },
    { id: 'timeline', label: 'Typical 2026 Timeline' },
    { id: 'rules', label: 'Booking Rules & Limits' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'When do TOLC exams take place?', answer: 'Unlike the IMAT which occurs on a single day, the TOLC exams are administered almost year-round. Sessions typically run from February to November, with brief pauses in August. Every participating university sets its own specific dates within this window.' },
    { question: 'Can I take the TOLC more than once?', answer: 'Yes, but there is a strict rule: you can only take the exact same type of TOLC (e.g., TOLC-I) once per calendar month. For example, if you take a TOLC-I on March 15th, you cannot take another TOLC-I until April.' },
    { question: 'Do I have to take the TOLC at the university I want to attend?', answer: 'No. The TOLC score is a centralized metric managed by CISIA. You can take the test at any participating university (or from home via TOLC@HOME) and use that score to apply to any other university that accepts the TOLC.' },
    { question: 'What is the difference between TOLC@HOME and TOLC@UNI?', answer: 'TOLC@UNI is taken in person at a university computer lab. TOLC@HOME is taken on your own computer at home under strict remote proctoring via the SEB (Safe Exam Browser) and a secondary camera (usually a smartphone via Zoom). The difficulty and validity of both formats are identical.' },
    { question: 'When should I book my TOLC exam?', answer: 'You should book as early as possible. Registration typically opens a month before the exam date and closes one week prior. High-demand sessions (especially in July and September) fill up rapidly.' },
    { question: 'How much does it cost to take the TOLC?', answer: 'The registration fee for any standard TOLC exam in 2024/2025 was €30 per attempt. This fee is non-refundable, though under very specific circumstances, a booking can be transferred to a later date if done before the deadline.' },
    { question: 'Can I take a TOLC-I and a TOLC-E in the same month?', answer: 'Yes. The "once per month" rule only applies to the specific test type. You can theoretically take a TOLC-I and a TOLC-E in the same month, provided you pay for both and schedule them accordingly.' },
    { question: 'What happens if I miss my scheduled exam?', answer: 'If you do not show up for your scheduled TOLC (either in person or by failing to connect properly for TOLC@HOME), you forfeit the €30 fee. You will have to re-register and pay again for a future session.' },
    { question: 'When do I get my TOLC results?', answer: 'TOLC results are available almost immediately. Upon finishing the test on the computer, you will usually see your raw score. The official certificate (Attestato di Risultato) becomes available in your CISIA reserved area within 48 hours.' },
    { question: 'Are TOLC scores valid for the next academic year?', answer: 'Usually, no. Most universities require a TOLC score obtained within the current calendar year (from January onwards) for enrollment in September of that same year. Some universities accept scores from the end of your 4th year of high school, but you must read the specific "Bando di Ammissione".' }
];

export default function TolcDates() {
    const { getField } = usePageContent('tolc-dates-2026');
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
        <CmsPageWrapper slug="tolc-dates-2026">
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
                    title="TOLC Exam Dates 2026: Booking Calendar & Deadlines"
                    description="Complete guide to TOLC 2026 exam dates, booking deadlines, TOLC@HOME vs TOLC@UNI differences, and CISIA attempt limits."
                    keywords="TOLC exam dates, TOLC 2026 calendar, TOLC booking deadline, TOLC@HOME dates, CISIA attempt limit, book TOLC test"
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
                                        <CalendarDays size={12} className="text-indigo-600" />
                                        Official CISIA Calendar Rules
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                                        {getField('hero_headline', 'TOLC Exam Dates & Deadlines 2026')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "Unlike traditional admission tests like the IMAT which force everyone into a single high-pressure date in September, the TOLC operates on a flexible, rolling calendar. Administered by CISIA, testing sessions run almost continuously from February through November. However, this flexibility creates a complex logistical puzzle for students. You must navigate university-specific deadlines, strict CISIA monthly attempt limits, and the choice between taking the exam at home or in person. This guide demystifies the entire scheduling process.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'season', label: 'Testing Season', value: 'Feb - Nov', icon: CalendarDays },
                                            { key: 'limit', label: 'Attempt Limit', value: '1 / Month', icon: AlertCircle },
                                            { key: 'fee', label: 'CISIA Fee', value: '€30', icon: Target },
                                            { key: 'results', label: 'Results In', value: '48 Hours', icon: Clock }
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

                                {/* TOLC@HOME vs @UNI Section */}
                                <section id="home-vs-uni" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-rose-100 p-3 rounded-2xl">
                                            <Laptop className="text-rose-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">TOLC@HOME vs TOLC@UNI</h2>
                                    </div>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium mb-8">
                                        CISIA offers two delivery methods for the test. It is crucial to understand that <strong>the test content, difficulty, and scoring are identical</strong> regardless of the format. A score of 35/50 on a TOLC@HOME carries exactly the same weight as a 35/50 on a TOLC@UNI. 
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="bg-indigo-100 p-3 rounded-xl">
                                                    <Laptop className="text-indigo-600" size={24} />
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900">TOLC@HOME</h3>
                                            </div>
                                            <ul className="space-y-4 text-slate-600">
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle2 className="text-indigo-500 shrink-0 mt-1" />
                                                    <span>Taken from your personal computer at home.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle2 className="text-indigo-500 shrink-0 mt-1" />
                                                    <span>Requires installing SEB (Safe Exam Browser) which locks down your computer.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <AlertCircle className="text-amber-500 shrink-0 mt-1" />
                                                    <span>Requires a smartphone positioned behind you via Zoom as a secondary proctoring camera.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle2 className="text-indigo-500 shrink-0 mt-1" />
                                                    <span>Ideal for international students or those who live far from major university centers.</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="bg-emerald-100 p-3 rounded-xl">
                                                    <Building2 className="text-emerald-600" size={24} />
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900">TOLC@UNI</h3>
                                            </div>
                                            <ul className="space-y-4 text-slate-600">
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" />
                                                    <span>Taken in person at an official university computer lab.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" />
                                                    <span>No complex software installation or dual-camera setup required on your part.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <AlertCircle className="text-amber-500 shrink-0 mt-1" />
                                                    <span>Must travel to the specific university on the scheduled date.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" />
                                                    <span>Provides a distraction-free, controlled environment favored by students with unreliable internet at home.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* Timeline Section */}
                                <section id="timeline" className="scroll-mt-[120px]">
                                    <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <CalendarCheck size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl font-black mb-8 flex items-center gap-4">
                                                <CalendarCheck className="text-emerald-400" />
                                                Typical 2026 Timeline
                                            </h2>
                                            <p className="text-xl text-slate-300 leading-relaxed font-medium mb-12 max-w-3xl">
                                                Universities structure their admissions in "Windows" (Finestre). Some accept TOLC scores early in the year for guaranteed admission, while others wait until late summer.
                                            </p>
                                            
                                            <div className="space-y-6">
                                                <div className="flex flex-col md:flex-row gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl">
                                                    <div className="md:w-1/3 border-r border-white/10 pr-6">
                                                        <h4 className="text-xl font-bold text-emerald-400">Feb - May</h4>
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Early Sessions</p>
                                                    </div>
                                                    <div className="md:w-2/3">
                                                        <p className="text-slate-300 text-sm leading-relaxed">
                                                            High school seniors (4th or 5th year) often take their first attempt here to secure an early score. This is highly recommended as a low-pressure "trial run" to experience the platform and format.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col md:flex-row gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl">
                                                    <div className="md:w-1/3 border-r border-white/10 pr-6">
                                                        <h4 className="text-xl font-bold text-amber-400">June - July</h4>
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Peak Season</p>
                                                    </div>
                                                    <div className="md:w-2/3">
                                                        <p className="text-slate-300 text-sm leading-relaxed">
                                                            Following high school graduation, the majority of students book their exams. These slots fill up extraordinarily fast. If you need a summer score, you must book the moment dates are released.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col md:flex-row gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl">
                                                    <div className="md:w-1/3 border-r border-white/10 pr-6">
                                                        <h4 className="text-xl font-bold text-rose-400">Late Aug - Sept</h4>
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Final Calls</p>
                                                    </div>
                                                    <div className="md:w-2/3">
                                                        <p className="text-slate-300 text-sm leading-relaxed">
                                                            The last opportunity before university classes begin in October. This is the highest pressure window. Relying on a September test date means you only have one final chance to hit the cutoff score.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Booking Rules */}
                                <section id="rules" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-amber-100 p-3 rounded-2xl">
                                            <CalendarOff className="text-amber-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Strict CISIA Rules</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <Card className="p-8 bg-amber-50 border-amber-100 border-2 rounded-[2.5rem] relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                                                <CalendarOff size={150} className="text-amber-900" />
                                            </div>
                                            <h4 className="text-amber-900 font-black mb-4">The "Once per Month" Rule</h4>
                                            <p className="text-sm text-amber-800 font-medium leading-relaxed relative z-10">
                                                You can take the <strong>same type</strong> of TOLC (e.g., TOLC-I) only once in a calendar month. If you take it on July 2nd and score poorly, you cannot attempt it again until August 1st. This is why booking early is essential—it guarantees you have backup months available.
                                            </p>
                                        </Card>
                                        <div className="space-y-6">
                                            <EditableText fieldKey="rules_desc" multiline as="p" className="text-slate-600 font-medium leading-relaxed">
                                                {getField('rules_desc', "Booking is done entirely through the CISIA reserved area. You do not book through your target university's website. However, you MUST read your target university's Bando (Call for Admission) to know their specific deadline for submitting the CISIA score.")}
                                            </EditableText>
                                            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                                                <h4 className="font-bold text-slate-900 mb-2">Booking Deadlines</h4>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    Generally, registration for a specific date closes exactly one week prior. For a Tuesday exam, booking closes the previous Tuesday. Late additions are structurally impossible in the CISIA system.
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

                                <CTASection fieldKeyPrefix="tolc_dates_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}
