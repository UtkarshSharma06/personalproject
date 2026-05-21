import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Home,
    BookOpen,
    Star,
    MapPin,
    Users,
    GraduationCap,
    ChevronRight,
    Sparkles,
    HelpCircle,
    CheckCircle2,
    ArrowRight,
    Grid,
    TrendingUp,
    ShieldCheck,
    Euro,
    CalendarDays
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import CTASection from '@/components/exams/CTASection';
import { usePageContent } from '@/hooks/usePageContent';
import CmsPageWrapper from '@/components/cms/CmsPageWrapper';
import EditableText from '@/components/cms/EditableText';
import FAQSchema from '@/components/seo/FAQSchema';
import KnowledgeHubSidebar from '@/components/exams/KnowledgeHubSidebar';
import PageNavigation from '@/components/exams/PageNavigation';

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'public', label: 'Public Universities' },
    { id: 'private', label: 'Private Universities' },
    { id: 'comparison', label: 'Comparison' },
    { id: 'locations', label: 'Top Cities' },
    { id: 'faqs', label: 'FAQs' }
];


const faqs = [
    { question: 'Which Italian universities are best for international students?', answer: 'Top choices include the University of Bologna, Sapienza University of Rome, and the University of Milan. For medicine specifically, Pavia and Milan Statale are the most sought-after.' },
    { question: 'Are Italian public universities globally recognized?', answer: 'Yes, Italian public universities are ranked among the top global institutions in Medicine, Engineering, Architecture, and Humanities. They offer excellent value due to subsidized tuition.' },
    { question: 'Do Italian universities offer degrees in English?', answer: 'Yes. Hundreds of bachelor\'s and master\'s degrees are offered entirely in English, particularly in public universities targeting international applicants.' },
    { question: 'What is the ranking of the University of Bologna?', answer: 'The University of Bologna consistently ranks in the global top 200 and is often cited as the oldest university in the Western world, dating back to 1088.' },
    { question: 'Is Bocconi good for Finance?', answer: 'Bocconi University in Milan is consistently ranked among the top 10 Business schools in Europe and is the premier private institution for Finance, Economics, and Management.' },
    { question: 'Which city is cheapest for students in Italy?', answer: 'Pavia, Padua, Messina, and Turin are generally more affordable than Milan or Rome. Student housing costs can be 30-50% lower in smaller university cities.' },
    { question: 'Can I transfer from a foreign university to an Italian one?', answer: 'Yes, credit transfers are possible and encouraged in the EU framework. Your CIMEA or DOV document will be evaluated to determine how many credits can be recognized.' },
    { question: 'What is the Politecnico di Milano known for?', answer: 'Politecnico di Milano is Italy\'s top engineering and design university and consistently ranks in the global top 150 for Architecture, Engineering, and Design disciplines.' },
    { question: 'Do private universities in Italy give scholarships?', answer: 'Yes, private universities like Bocconi and Cattolica offer merit-based internal scholarships. Some can reduce tuition by 30-80% based on academic performance and financial need.' },
    { question: 'Is Sapienza University good for Medicine?', answer: 'Sapienza University of Rome is one of the largest universities in Europe and has a strong Medicine faculty. It accepts CENT-S scores for international students in its medical programs.' }
];

export default function StudyItalyUniversities() {
    const navigate = useNavigate();
    const { getField } = usePageContent('study-italy-universities');
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
        <CmsPageWrapper slug="study-italy-universities">
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
                    title="Study in Italy in English: Top Universities for International Students"
                    description="Discover the top Italian universities offering programs in English. Explore rankings, English-taught programs, and admission insights for international students."
                    keywords="study in italy in english, best universities in Italy for international students, English universities in Italy, public universities Italy rankings"
                />

                <FAQSchema items={faqs} />

                <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
                    <main className="container mx-auto px-4 pt-0 pb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        
                            {/* Sidebar Hub */}
                            <div className="lg:col-span-4 hidden lg:block">
                                <div className="sticky top-32 self-start">
                                    <KnowledgeHubSidebar examType="study-italy" />
                                </div>
                            </div>

                            <div className="lg:col-span-8 space-y-16">

                                {/* Hero */}
                                <section id="overview" className="scroll-mt-40">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                                        <Sparkles size={12} className="animate-pulse" />
                                        Official 2026 Academic Roadmap
                                    </div>

                                    <EditableText fieldKey="hero_headline" as="h1" className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6 md:mb-8">
                                        {getField('hero_headline', 'Top Universities in Italy 2026')}
                                    </EditableText>

                                    <EditableText fieldKey="hero_subheadline" multiline as="p" className="text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed font-medium mb-10">
                                        {getField('hero_subheadline', 'The complete, ranked guide to Italian universities for international students. Find your perfect fit across 90+ institutions — from historic public powerhouses to elite private schools.')}
                                    </EditableText>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                        {[
                                            { key: 'total', label: 'Universities', value: '90+', icon: Home },
                                            { key: 'intl', label: 'Intl Students', value: '100k+', icon: Users },
                                            { key: 'rank', label: 'Global Ranking', value: 'Top 500', icon: Star },
                                            { key: 'cities', label: 'Student Cities', value: '25+', icon: MapPin }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-4 md:p-6 rounded-2xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)] flex flex-col items-center text-center group hover:border-indigo-200 transition-colors">
                                                <item.icon className="text-indigo-600 mb-2 md:mb-3 group-hover:scale-110 transition-transform" size={20} />
                                                <EditableText fieldKey={`stat_val_${item.key}`} as="div" className="text-lg md:text-2xl font-black text-slate-900">
                                                    {getField(`stat_val_${item.key}`, item.value)}
                                                </EditableText>
                                                <EditableText fieldKey={`stat_label_${item.key}`} as="div" className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    {getField(`stat_label_${item.key}`, item.label)}
                                                </EditableText>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-loose">
                                        <EditableText fieldKey="overview_p1" multiline as="p" className="mb-4">
                                            {getField('overview_p1', 'Italy\'s university system is a unique blend of historic prestige and modern academic excellence. Public universities, which form the backbone of higher education, are funded by the state and offer highly subsidized tuition. Private institutions offer a more focused, industry-linked experience with smaller class sizes and international networks.')}
                                        </EditableText>
                                        <EditableText fieldKey="overview_p2" multiline as="p">
                                            {getField('overview_p2', 'This guide covers both public and private universities, helps you compare them on the factors that matter most — tuition, class size, admission pathway, and scholarship availability — and gives you a clear picture of student life across Italy\'s top cities.')}
                                        </EditableText>
                                    </div>
                                </section>

                                {/* Public Universities */}
                                <section id="public" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-indigo-100 p-2 md:p-3 rounded-2xl">
                                            <GraduationCap className="text-indigo-600" size={28} />
                                        </div>
                                        <EditableText fieldKey="public_title" as="h2" className="text-2xl md:text-4xl font-black text-slate-900 underline decoration-indigo-400 underline-offset-8">
                                            {getField('public_title', 'Prestigious Public Universities')}
                                        </EditableText>
                                    </div>
                                    <div className="prose prose-lg text-slate-600 mb-8 max-w-none">
                                        <EditableText fieldKey="public_desc" multiline as="p">
                                            {getField('public_desc', 'Public universities are the backbone of the Italian higher education system. They offer high-quality, English-taught degrees with very low tuition fees, subsidized by the Italian government.')}
                                        </EditableText>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { key: 'pavia', title: 'University of Pavia', weight: 'Medicine', focus: 'Top medical school. Accepts IMAT and CENT-S. Historic campus in Pavia.', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
                                            { key: 'bologna', title: 'University of Bologna', weight: 'STEM & Arts', focus: 'The world\'s oldest university (1088). Excellent for science, law, and humanities.', color: 'bg-amber-50 text-amber-700 border-amber-100' },
                                            { key: 'sapienza', title: 'Sapienza Rome', weight: 'Medicine & Classics', focus: 'One of Europe\'s largest universities. Strong CENT-S pathway for medical programs.', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
                                        ].map((item, i) => (
                                            <div key={i} className={`p-6 md:p-8 rounded-[2rem] border-2 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)] border-slate-900 ${item.color} flex flex-col justify-between h-full`}>
                                                <div>
                                                    <EditableText fieldKey={`pub_card_${item.key}_weight`} as="div" className="text-lg md:text-xl font-black mb-1 opacity-70">
                                                        {getField(`pub_card_${item.key}_weight`, item.weight)}
                                                    </EditableText>
                                                    <EditableText fieldKey={`pub_card_${item.key}_title`} as="h4" className="text-lg md:text-xl font-bold mb-4">
                                                        {getField(`pub_card_${item.key}_title`, item.title)}
                                                    </EditableText>
                                                    <EditableText fieldKey={`pub_card_${item.key}_focus`} as="p" className="text-sm opacity-80 font-medium leading-relaxed">
                                                        {getField(`pub_card_${item.key}_focus`, item.focus)}
                                                    </EditableText>
                                                </div>
                                                <ChevronRight className="mt-8 self-end" size={20} />
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Private Universities */}
                                <section id="private" className="scroll-mt-40">
                                    <div className="bg-slate-900 text-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)]">
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <Star size={200} />
                                        </div>
                                        <div className="relative z-10">
                                            <EditableText fieldKey="private_title" as="h2" className="text-2xl md:text-4xl font-black mb-8 flex items-center gap-4">
                                                <Star className="text-indigo-400" size={28} />
                                                {getField('private_title', 'Elite Private Institutions')}
                                            </EditableText>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                                {[
                                                    { key: 'b1', text: 'Bocconi University: The premier institution for Finance, Economics, and Management in Europe.' },
                                                    { key: 'b2', text: 'Humanitas University: A hospital-linked medical school with state-of-the-art clinical training.' },
                                                    { key: 'b3', text: 'NABA: Italy\'s top art and design school — globally recognized in Fashion and Architecture.' },
                                                    { key: 'b4', text: 'Università Cattolica: One of the most prestigious private universities for Law, Medicine, and Social Sciences.' }
                                                ].map(({ key, text }) => (
                                                    <div key={key} className="flex items-start gap-3">
                                                        <CheckCircle2 className="text-indigo-400 shrink-0 mt-1" size={18} />
                                                        <EditableText fieldKey={`priv_bullet_${key}`} as="p" className="text-sm md:text-base font-medium opacity-90 leading-relaxed">
                                                            {getField(`priv_bullet_${key}`, text)}
                                                        </EditableText>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Comparison */}
                                <section id="comparison" className="p-8 md:p-12 bg-white rounded-[2.5rem] md:rounded-[3rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)]">
                                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-8 flex items-center gap-4">
                                        <TrendingUp className="text-violet-500" size={28} />
                                        Public vs Private: 2026 Comparison
                                    </h2>
                                    <div className="space-y-4 md:space-y-6">
                                        {[
                                            { label: 'Tuition', pub: '€156 – €4,000/yr', priv: '€8,000 – €25,000/yr' },
                                            { label: 'Class Size', pub: 'Large (100 – 300)', priv: 'Small (20 – 50)' },
                                            { label: 'Admission', pub: 'Entrance Exam (IMAT/TOLC)', priv: 'School-Specific Test' },
                                            { label: 'Industry Links', pub: 'Standard', priv: 'Fully Integrated' },
                                            { label: 'Scholarships', pub: 'Regional (DSU)', priv: 'Merit-Based (Internal)' },
                                            { label: 'Facilities', pub: 'Historic / Traditional', priv: 'Modern / Hospital-Linked' }
                                        ].map((row, i) => (
                                            <div key={i} className="flex flex-col md:grid md:grid-cols-3 gap-3 md:gap-4 border-b border-slate-50 md:border-none pb-4 md:pb-0">
                                                <div className="font-black text-slate-500 text-[10px] md:text-sm uppercase tracking-wider flex items-center mb-1 md:mb-0">{row.label}</div>
                                                <div className="grid grid-cols-2 md:grid-cols-1 md:contents gap-2">
                                                    <div className="bg-indigo-50 text-indigo-700 font-bold text-xs md:text-sm p-3 rounded-xl text-center flex items-center justify-center">Public: {row.pub}</div>
                                                    <div className="bg-slate-100 text-slate-700 font-bold text-xs md:text-sm p-3 rounded-xl text-center flex items-center justify-center">Private: {row.priv}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Locations */}
                                <section id="locations" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-rose-100 p-2 md:p-3 rounded-2xl">
                                            <MapPin className="text-rose-600" size={28} />
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black text-slate-900">Top Student Cities</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { key: 'milan', icon: Star, title: 'Milan', desc: 'Italy\'s business and fashion capital. Home to Bocconi, Politecnico di Milano, and Humanitas. Highest cost of living but best career network.', color: 'bg-amber-50 text-amber-700 border-amber-100' },
                                            { key: 'rome', icon: GraduationCap, title: 'Rome', desc: 'The historic capital. Sapienza and Tor Vergata are key players. Great cultural life with moderate student accommodation costs.', color: 'bg-rose-50 text-rose-700 border-rose-100' },
                                            { key: 'pavia', icon: BookOpen, title: 'Pavia & Padua', desc: 'Classic university towns with high academic prestige and lower living costs. Excellent for Medicine and Engineering students.', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                                            { key: 'turin', icon: TrendingUp, title: 'Turin', desc: 'A rising student city. Home to Politecnico di Torino (Engineering & Tech). Lower rent compared to Milan with strong industry links.', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' }
                                        ].map((item, i) => (
                                            <div key={i} className={`group bg-white p-6 md:p-8 rounded-[2rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)] transition-all flex flex-col md:flex-row gap-6 items-start`}>
                                                <div className={`${item.color} p-4 rounded-2xl shrink-0 mx-auto md:mx-0`}>
                                                    <item.icon size={28} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-900 mb-2 text-center md:text-left">{item.title}</h3>
                                                    <p className="text-slate-600 text-sm leading-relaxed font-medium text-center md:text-left">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* FAQs */}
                                <section id="faqs" className="scroll-mt-40">
                                    <div className="flex items-center gap-4 mb-8 md:mb-12">
                                        <div className="bg-slate-200 p-2 md:p-3 rounded-2xl">
                                            <HelpCircle className="text-slate-600" size={28} />
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
                                    </div>
                                    <div className="space-y-6">
                                        {faqs.map((faq, i) => (
                                            <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23_42,1)] transition-shadow">
                                                <div className="text-lg md:text-xl font-black text-slate-900 mb-4 flex gap-3 md:gap-4">
                                                    <span className="text-indigo-600 shrink-0">Q{i + 1}:</span>
                                                    <EditableText fieldKey={`faq_q_${i}`} as="div">
                                                        {getField(`faq_q_${i}`, faq.question)}
                                                    </EditableText>
                                                </div>
                                                <div className="text-slate-600 leading-relaxed font-medium pl-8 md:pl-12 border-l-2 border-slate-50 text-sm md:text-base">
                                                    <EditableText fieldKey={`faq_a_${i}`} multiline as="div">
                                                        {getField(`faq_a_${i}`, faq.answer)}
                                                    </EditableText>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* CTA Section */}

                                <CTASection fieldKeyPrefix="italy_universities_cta" />
                            </div>
                        </div>
                    </main>
                </div>
            </Layout>
        </CmsPageWrapper>
    );
}


