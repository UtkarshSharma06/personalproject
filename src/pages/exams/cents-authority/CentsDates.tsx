import React from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Card } from '@/components/ui/card';
import {
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    MapPin,
    Globe,
    Zap,
    HelpCircle,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import FAQSchema from '@/components/seo/FAQSchema';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import EditableText from '@/components/cms/EditableText';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import PageNavigation from '@/components/exams/PageNavigation';
import { centsLinks } from '@/lib/nav-links';
import { getBreadcrumbSchema } from '@/utils/seo-schemas';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'macro-periods', label: 'Macro-Periods' },
    { id: 'deadlines', label: 'Deadlines' },
    { id: 'locations', label: 'Test Locations' },
    { id: 'faqs', label: 'FAQs' }
];

const faqs = [
    { question: 'When is the next CENT-S exam date?', answer: 'CENT-S exams are held in multiple sessions throughout the year, typically grouped into "Macro-Periods" in Spring (Feb-April) and Summer (July-August). Check the CISIA portal for the current month\'s available slots.' },
    { question: 'How often can I take the CENT-S?', answer: 'Most universities allow you to take the CENT-S once per macro-period. If you take it multiple times, your highest score is usually considered for the final ranking.' },
    { question: 'When does registration for the Summer session close?', answer: 'Registration for specific slots usually closes 7-10 days before the exam date. However, popular test centers and dates fill up much earlier.' },
    { question: 'Can I change my exam date after booking?', answer: 'Changes are generally not permitted once a slot is confirmed. If you miss your session, you may need to pay a new registration fee for a different date.' },
    { question: 'Are the dates different for international students?', answer: 'The exam dates are the same, but international students must ensure their CENT-S result is obtained before the university\'s pre-enrollment and visa deadlines.' },
    { question: 'When are the results released after the exam?', answer: 'For the computer-based CENT-S, your raw score is typically available immediately after you submit the test. Official certificates are available in your CISIA area within 48 hours.' },
    { question: 'Is the CENT-S held on weekends?', answer: 'Most sessions are held on weekdays during standard university hours. Some private test centers may offer occasional Saturday slots.' },
    { question: 'What is a "Macro-Period"?', answer: 'It is a timeframe (e.g., March to May) during which scores are collected for a specific ranking cycle. Universities use the best score obtained within the allowed macro-periods.' },
    { question: 'Do I need to be in Italy for the exam date?', answer: 'Not necessarily. Many CENT-S sessions are offered as "CENT-S@CASA" (Home-based), allowing you to take the test from your country under online proctoring.' },
    { question: 'When is the deadline to submit the score to the university?', answer: 'The score is usually transmitted automatically if you use the same fiscal code/email, but you must complete the university\'s internal application by their specific "Bando" deadline.' }
];

export default function CentsDates() {
    const { getField } = usePageContent('cent-s-dates-2026');
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
        <CmsPageWrapper slug="cent-s-dates-2026">
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
                    title="CENT-S Exam Dates 2026: Official Calendar & Deadlines"
                    description="When is the CENT-S 2026? Official calendar for Spring and Summer macro-periods, registration windows, and university application deadlines for Italian STEM degrees."
                    keywords="cent-s dates 2026, cent-s calendar, cent-s registration deadline, cisia exam dates, study italy stem deadlines"
                    schemas={[getBreadcrumbSchema([
                        { name: 'Home', item: '/' },
                        { name: 'CEnT-S Guide', item: '/cent-s-exam-ultimate-guide' },
                        { name: 'CEnT-S Exam Dates 2026', item: '/cent-s-important-dates-2026' }
                    ])]}
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
                                        {getField('hero_headline', 'CENT-S 2026 Official Calendar')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_desc" multiline as="p" className="text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_desc', "Unlike single-date exams, the CENT-S offers multiple windows throughout the year. Tracking these macro-periods is vital for a successful dual-sitting strategy.")}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'spring', label: 'Spring Cycle', value: 'Feb - May', icon: Calendar },
                                            { key: 'summer', label: 'Summer Cycle', value: 'July - Aug', icon: Zap },
                                            { key: 'results', label: 'Results', value: 'Instant', icon: Clock },
                                            { key: 'status', label: 'Status', value: 'Live Slots', icon: CheckCircle2 }
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

                                {/* Macro-Periods */}
                                <section id="macro-periods" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <Calendar className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">The 2026 Macro-Period System</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <Card className="p-8 border-slate-100 shadow-sm hover:border-indigo-600 transition-all group">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                                    <Calendar size={24} />
                                                </div>
                                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Macro-Period 1</span>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 mb-2">Early Spring Session</h3>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                                                Primary window for early-bird applications and scholarship considerations at major technical universities.
                                            </p>
                                            <div className="text-indigo-600 font-black flex items-center gap-2">
                                                Feb – May 2026 <ArrowRight size={16} />
                                            </div>
                                        </Card>
                                        <Card className="p-8 border-slate-100 shadow-sm hover:border-indigo-600 transition-all group">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                                                    <Zap size={24} />
                                                </div>
                                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Macro-Period 2</span>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 mb-2">Summer Session</h3>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                                                The final window for the main 2026 intake. Ideal for students who need more prep time or a second attempt.
                                            </p>
                                            <div className="text-emerald-600 font-black flex items-center gap-2">
                                                July – Aug 2026 <ArrowRight size={16} />
                                            </div>
                                        </Card>
                                    </div>
                                </section>

                                {/* Deadlines */}
                                <section id="deadlines" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-rose-100 p-3 rounded-2xl">
                                            <Clock className="text-rose-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Critical Deadlines</h2>
                                    </div>
                                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                        <div className="space-y-8">
                                            {[
                                                { label: 'Exam Registration', time: '7 Days Before', desc: 'Final date to book your seat for a specific slot on the CISIA portal.' },
                                                { label: 'Fee Payment', time: 'Immediate', desc: 'The €30 fee must be paid during registration to confirm your test slot.' },
                                                { label: 'Score Submission', time: 'Varies', desc: 'Universities set their own deadlines to "receive" the score (typically late August).' }
                                            ].map((item, i) => (
                                                <div key={i} className="flex gap-6 items-start pb-8 border-b border-slate-50 last:border-0 last:pb-0">
                                                    <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap">
                                                        {item.time}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-900 mb-1">{item.label}</h4>
                                                        <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-10 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 items-start">
                                            <AlertCircle className="text-amber-600 shrink-0 mt-1" size={20} />
                                            <EditableText fieldKey="alert_uni_desc" multiline as="p" className="text-sm font-medium text-amber-800">
                                                {getField('alert_uni_desc', "Passing the CENT-S is only step one. You must also apply to your specific university's \"Call for Admission\" (Bando) before their internal deadlines which often differ from CISIA.")}
                                            </EditableText>
                                        </div>
                                    </div>
                                </section>

                                {/* Locations */}
                                <section id="locations" className="scroll-mt-[120px]">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-3 rounded-2xl">
                                            <MapPin className="text-indigo-600" size={28} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900">Test Locations & Modes</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="p-8 bg-slate-900 text-white rounded-3xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 opacity-5"><Globe size={150} /></div>
                                            <h3 className="text-2xl font-black mb-4">CENT-S@CASA</h3>
                                            <p className="text-slate-300 font-medium leading-relaxed mb-6">
                                                Take the exam from your own home. This mode uses a secure browser and remote proctoring. Essential for international students who cannot travel early.
                                            </p>
                                            <div className="bg-white/10 p-4 rounded-xl text-xs font-bold text-indigo-300">
                                                Check university "Bando" to ensure they accept @CASA mode.
                                            </div>
                                        </div>
                                        <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
                                            <h3 className="text-2xl font-black text-slate-900 mb-4">CENT-S@UNI</h3>
                                            <p className="text-slate-500 font-medium leading-relaxed mb-6">
                                                The traditional mode held in university computer labs across Italy. Best for students already in Italy who prefer a proctored environment.
                                            </p>
                                            <div className="space-y-3">
                                                {['Milan', 'Rome', 'Bologna', 'Turin'].map((city, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                                        <CheckCircle2 size={16} className="text-indigo-500" /> {city} Campus
                                                    </div>
                                                ))}
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

                                <CTASection fieldKeyPrefix="dates_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


