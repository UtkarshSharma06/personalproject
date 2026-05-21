import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Calendar,
    Clock,
    AlertCircle,
    Bell,
    CalendarDays,
    ChevronRight,
    MapPin,
    Globe,
    CheckCircle2,
    ShieldCheck,
    ClipboardCheck,
    Activity,
    Star,
    Zap,
    Map,
    HelpCircle,
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
    { id: 'timeline', label: 'Exam Timeline' },
    { id: 'centers', label: 'Test Centers' },
    { id: 'logistics', label: 'Logistics' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'When is the IMAT 2026 exam date?', answer: 'The official date is usually announced by the Italian Ministry in late spring. Historically, the exam takes place in mid-September.' },
    { question: 'When does registration for IMAT 2026 open?', answer: 'Registration typically opens in early July and stays open for about 2-3 weeks. You must register through the official Universitaly.it portal.' },
    { question: 'When are the IMAT 2026 results released?', answer: 'Scanned answer sheets are usually available 10-14 days after the exam. Official results and rankings are published approximately 3-4 weeks later.' },
    { question: 'Is the exam date the same globally?', answer: 'Yes, the IMAT is held on the same day and at the same time (adjusted for time zones) across all international and Italian test centers.' },
    { question: 'What is the deadline for university preferences?', answer: 'You must finalize your list of university preferences by the close of the registration window in July. You cannot change these later.' },
    { question: 'Can the exam date be changed?', answer: 'No. The IMAT is a single-session annual exam. If you miss the date, you must wait until the following year.' },
    { question: 'When should I travel to my test center?', answer: 'We recommend arriving at your test city at least 48 hours before the exam to account for travel delays and to locate your specific exam building.' },
    { question: 'What is the "Convocation Time"?', answer: 'The convocation time is when you must be present at the test center for identity verification. It is usually 1-2 hours before the actual exam start.' },
    { question: 'When is the final enrollment deadline?', answer: 'Enrollment deadlines vary by university but typically occur within 4-10 days after your status in the ranking changes to "Assegnato".' },
    { question: 'How do I know my specific test room?', answer: 'Your specific test room and building will be listed on your registration confirmation or published on the university/test center website a few days before the exam.' }
];

export default function ImatExamDates() {
    const navigate = useNavigate();
    const { getField } = usePageContent('imat-exam-dates-2026');
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
        <CmsPageWrapper slug="imat-exam-dates-2026">
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
                    title="IMAT Exam Dates 2026: Official Registration & Results Timeline"
                    description="Official IMAT 2026 calendar. Important dates for registration (July), exam day (September), and ranking publication. Don't miss the ministerial deadlines."
                    keywords="IMAT exam date 2026, IMAT registration 2026 dates, IMAT results date 2026, IMAT calendar 2026, Universitaly registration window"
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
                                        {getField('hero_headline', 'IMAT 2026 Official Timeline')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "The IMAT cycle follows a strict annual schedule. Missing a single window means waiting a full year for the next opportunity.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'reg', label: 'Registration', value: 'July 2026', icon: Bell },
                                            { key: 'test', label: 'Exam Day', value: 'Sept 2026', icon: Calendar },
                                            { key: 'res', label: 'Results', value: 'Oct 2026', icon: Clock },
                                            { key: 'rank', label: 'Ranking', value: 'Oct 2026', icon: Activity }
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

                                {/* Timeline */}
                                <section id="timeline" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <CalendarDays className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Critical Milestones</h2>
                                    </div>
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-600">
                                            <Zap size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl font-black mb-8 flex items-center gap-4">
                                                <AlertCircle className="text-indigo-400" />
                                                The "Double Gate" Rule
                                            </h2>
                                            <p className="text-xl text-slate-300 leading-relaxed font-medium mb-12 max-w-3xl">
                                                Dates for Non-EU students are coupled with Visa deadlines. If the MUR releases the decree in late June, you often only have 21 days to complete 'Pre-Enrollment' on Universitaly. Do not wait for the test date to start your visa paperwork.
                                            </p>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                                    <Activity size={32} className="text-rose-400 mb-4" />
                                                    <h4 className="text-xl font-black mb-2">Registration Clock</h4>
                                                    <p className="text-sm text-slate-400 leading-relaxed">Once the July window closes, there are NO exceptions. Late payments or submissions are not accepted.</p>
                                                </div>
                                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                                    <Star size={32} className="text-indigo-400 mb-4" />
                                                    <h4 className="text-xl font-black mb-2">Quota Snap-off</h4>
                                                    <p className="text-sm text-slate-400 leading-relaxed">Test centers in London, New York, and Dubai fill up within hours of the registration opening.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Centers */}
                                <section id="centers" className="scroll-mt-40">
                                    <div className="flex flex-col md:flex-row gap-12">
                                        <div className="md:w-1/3">
                                            <div className="bg-indigo-50 p-8 rounded-[2rem] mb-6">
                                                <MapPin size={48} className="text-indigo-600 mb-6" />
                                                <h3 className="text-2xl font-black text-slate-900 leading-tight">Global Test Centers</h3>
                                            </div>
                                            <p className="text-slate-600 text-sm font-medium leading-relaxed">
                                                Over 20 international cities host the IMAT. Centers are first-come, first-served on the Universitaly portal.
                                            </p>
                                        </div>
                                        <div className="md:w-2/3 grid grid-cols-2 gap-4">
                                            {[
                                                'New York', 'London', 'Dubai', 'Tel Aviv',
                                                'Beijing', 'São Paulo', 'Munich', 'Rome'
                                            ].map((city, i) => (
                                                <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-indigo-600 transition-colors">
                                                    <span className="font-bold text-slate-600 group-hover:text-slate-900">{city}</span>
                                                    <Globe size={14} className="text-slate-300 group-hover:text-indigo-600" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* Logistics Section */}
                                <section id="logistics" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-emerald-100 p-3 rounded-2xl">
                                            <ShieldCheck className="text-emerald-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Test Day Logistics & Rules</h2>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {[
                                            {
                                                title: 'Required Documents',
                                                icon: ClipboardCheck,
                                                items: ['Original Passport/ID', 'Confirmation Email', 'Payment Receipt']
                                            },
                                            {
                                                title: 'Prohibited Items',
                                                icon: AlertCircle,
                                                items: ['Calculators', 'Smartwatches', 'Personal Pens', 'Food/Drink']
                                            },
                                            {
                                                title: 'Result Timeline',
                                                icon: Clock,
                                                items: ['Scanned Score (10-14 days)', 'National Ranking (30 days)', 'Enrollment (Post-Ranking)']
                                            }
                                        ].map((box, i) => (
                                            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                                <box.icon className="text-indigo-600 mb-4" size={24} />
                                                <h4 className="font-black text-slate-900 mb-4">{box.title}</h4>
                                                <ul className="space-y-3">
                                                    {box.items.map((item, j) => (
                                                        <li key={j} className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                            <CheckCircle2 size={12} className="text-emerald-500" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 bg-amber-50 border border-amber-200 rounded-3xl p-8">
                                        <p className="text-sm font-medium text-amber-800 leading-relaxed">
                                            <strong>Critical Warning:</strong> In Italy, arriving late by even 5 minutes after the "Convocation Time" (usually 1 hour before the start) will result in exclusion from the exam. Check your local test center's specific convocation rules on the Universitaly portal.
                                        </p>
                                    </div>
                                </section>

                                {/* Travel Logistics Section */}
                                <section id="travel-logistics" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Map size={28} className="text-indigo-600" />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Travel & Accommodation Logistics</h2>
                                    </div>
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12">
                                        <EditableText fieldKey="travel_desc" multiline as="p" className="text-lg text-slate-600 leading-relaxed font-medium mb-8">
                                            {getField('travel_desc', "For students sitting the exam in Italy, logistical planning is as important as academic prep. Italian university campuses can be spread across multiple districts. Ensure you know the exact building address.")}
                                        </EditableText>
                                        <div className="grid md:grid-cols-2 gap-12">
                                            <div className="space-y-4">
                                                <h4 className="font-black text-slate-900">Italostudy Travel Checklist:</h4>
                                                {[
                                                    { key: 'hotel', label: 'Book accommodation within 15 min walk of campus' },
                                                    { key: 'visit', label: 'Visit the test building the day before' },
                                                    { key: 'sim', label: 'Get a local SIM for real-time transit updates' },
                                                    { key: 'cash', label: 'Keep emergency cash for taxis (approx. €50)' }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                        <CheckCircle2 size={16} className="text-indigo-500" />
                                                        <EditableText fieldKey={`travel_item_${item.key}`} as="span">
                                                            {getField(`travel_item_${item.key}`, item.label)}
                                                        </EditableText>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800">
                                                <div className="text-xs font-black text-indigo-400 uppercase mb-2">Travel Hack</div>
                                                <EditableText fieldKey="travel_hack" multiline as="p" className="text-xs font-bold text-slate-300 leading-relaxed">
                                                    {getField('travel_hack', "Most Italian cities like Milan or Rome have multiple campuses. Double-check your specific 'University of Milan' location—it might be in Segrate or downtown. A taxi on exam day is safer than relying on a potentially delayed Metro.")}
                                                </EditableText>
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

                                <CTASection fieldKeyPrefix="imat_dates_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


